import {fetchGiftList, fetchLiveComment, fetchLocateRoom, fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {forIn, get, isNull, isUndefined, omit} from "lodash-es";
import {recursivelyRun, selectCase, sleep} from "../../../../utils/lang";
import {toUser} from "../util/user";
import {ChatMethods, extraApis} from "../util/type";
import {Await} from "../../../../utils/typescript";
import {isIterable} from "rxjs/internal-compatibility";
import {register} from "../register";
import {ec} from "../../../../utils/event";

export class Watermelon {
  public status: {
    error: string
    isLive: boolean
    lastRoomFetch: boolean
    room: {
      id?: string
      title?: string
      streamer?: ReturnType<typeof toUser>
      activeUserCount: number,
      followerInfo?: {
        title: string,
        count: number,
      },
    }
    offset: number,
    giftList?: Array<{
      name: number,
      weight: number,   // stands for amount of point used
    }>,
  } = {
    error: "",
    isLive: false,
    lastRoomFetch: false,
    room: {
      activeUserCount: 0,
    },
    offset: 0,
  };
  public pool = {
    comment: [] as Array<ReturnType<Watermelon["toChat"]>>,
    giftHistory: {} as { [groupId: string]: Omit<Await<ReturnType<Watermelon["toGift"]>>, "groupId"> },
    giftStream: [] as Array<Await<ReturnType<Watermelon["toGift"]>>>,
    giftTotalStream: [] as Array<Await<ReturnType<Watermelon["toGift"]>>>,
    commentAndGift: [] as Array<{
      type: "chat" | "gift", content:
        Await<ReturnType<Watermelon["toGift"]>> | ReturnType<Watermelon["toChat"]>,
    }>,
    other: [] as Array<ReturnType<Watermelon["toChat"]>>,
  };
  /**
   * @member stats.giftTotal  CNY of gift * 100
   */
  public stats = {
    giftTotal: 0,
    streamTime: 0,
    avgActiveUser: 0,
  };
  public config: {
    streamer: string,
    badge?: string,
  };
  public raw: {
    room?: object,
  } = {
    room: undefined,
  };

  constructor(opt: Watermelon["config"]) {
    this.config = opt;
  }

  public async startWatch() {
    while (!this.status.isLive) {
      await this.locateRoom();
      if (!this.status.isLive) {
        await sleep(register.interval.refresh * 1000);
      }
    }
    setInterval(this.clock, 2000);
    recursivelyRun(this.fetchRoom, register.interval.room * 1000).then();
    recursivelyRun(this.fetchComment, register.interval.comment * 1000).then();
  }

  public fetchRoom = async () => {
    this.status.lastRoomFetch = false;
    const d = await fetchRoomInfo(this.status.room.id);
    assert.eq(
      get(d, "base_resp.status_code"), 0,
      "Room information request end with non-zero value",
    );
    assert.notNil(
      [d.room, d.room.status, d.room.user_count],
      "Room information parse error",
    );
    this.raw.room = d.room;
    this.status = {
      ...this.status,
      ...{
        isLive: d.room.status === 2,
        room: {
          ...this.status.room,
          streamer: toUser(d),
          title: d.room.title,
          activeUserCount: parseInt(d.room.user_count, 10),
          ...(() => {
            if (!d.room.discipulus_info) {
              return {};
            }
            return {
              followerInfo: {
                title: d.room.discipulus_info.discipulus_title,
                count: d.room.discipulus_info.follower_count,
              },
            };
          })(),
        },
      },
    };
  }

  public fetchComment = async () => {
    if (!this.status.lastRoomFetch) {
      await this.fetchRoom();
    }
    const d = await fetchLiveComment(this.status.room.id, {offset: this.status.offset});
    try {
      assert.notNil([d.data, d.extra, get(d, "extra.cursor")], "unexpected data");
    } catch {
      if (get(d, "base_resp.status_code") !== 10038) {
        throw new Error(
          `room parse error - unexpected data and not response with 10038: ${get(d, "base_resp.status_code")}`,
        );
      }
      return;
    }
    this.status.offset = d.extra.cursor;

    d.data.forEach((v) => {
      selectCase({
        exp: this.typeOf(v),
        case: [
          [
            ["VideoLiveChatMessage", "VideoLiveDanmakuMessage"],
            () => {
              const r = this.toChat(v);
              if (!r.isFiltered) {
                this.pool.comment.unshift(this.toChat(v));
                this.pool.commentAndGift.unshift({type: "chat", content: this.toChat(v)});
              }
            },
          ],
          [
            ["VideoLivePresentMessage", "VideoLivePresentEndTipMessage"],
            async () => {
              // giftHistory
              const src = await this.toGift(v);
              if (Reflect.has(this.pool.giftHistory, src.groupId)) {
                const tgt = this.pool.giftHistory[src.groupId];
                assert.eq(tgt.gift.name, src.gift.name, "Mismatched gift type");
                if (this.typeOf(v) === "VideoLivePresentEndTipMessage") {
                  tgt.gift.count = src.gift.count;
                } else {
                  tgt.gift.count += src.gift.count;
                }
              } else {
                Reflect.set(this.pool.giftHistory, src.groupId, omit(src, "groupId"));
              }
              if (this.typeOf(v) === "VideoLivePresentMessage") {
                // giftStream
                this.pool.giftStream.unshift(await this.toGift(v));
              } else {
                // giftTotalStream
                this.pool.giftTotalStream.unshift(await this.toGift(v));
                this.pool.commentAndGift.unshift({type: "gift", content: await this.toGift(v)});
                ec.emit("presentEnd", await this.toGift(v));
              }
            },
          ],
        ],
        def: () => this.pool.other.unshift(this.toChat(v)),
      });
    });

    // update gift total
    let count = 0;
    forIn(this.pool.giftHistory, (v) => {
      const price = v.gift.count * v.gift.weight * register.price;
      if (isFinite(count + price)) {
        count += v.gift.count * v.gift.weight * register.price;
      }
    });
    this.stats.giftTotal = count;

    forIn(this.pool, (v) => {
      if (isIterable(v)) {
        while (v.length > register.poolSize) {
          v.pop();
        }
      }
    });
  }

  private clock = () => {
    if (this.status.isLive) {
      this.stats.avgActiveUser = (this.stats.avgActiveUser * this.stats.streamTime + this.status.room.activeUserCount) /
        (this.stats.streamTime + 1);
      this.stats.streamTime++;
    }
  }

  private locateRoom = async () => {
    this.status.error = "";
    try {
      const d = await fetchLocateRoom(this.config.streamer);
      const el = document.createElement("html");
      el.innerHTML = d;
      let roomID = (el.querySelector(".search__anchor__list > .anchor-card > a") as HTMLAnchorElement).href;
      roomID = roomID.match(/(room\/)([0-9]+)/)[2];
      let isLiving;
      try {
        isLiving = (el.querySelector(
          ".search__anchor__list > .anchor-card .anchor-card__avatar__tag",
        ) as HTMLElement).innerText === "直播中";
      } catch (e) {
        this.status.error = "excepted 1 or more live channels, got 0.";
        return;
      }
      this.status.lastRoomFetch = true;
      this.status.isLive = isLiving;
      this.status.room.id = roomID;
    } catch (e) {
      this.status.error = e.toString();
      console.error(e);
    }
  }

  private typeOf = (d: any): ChatMethods => {
    const typeRaw = get(d, "common.method");
    const action = get(d, "extra.action");
    return typeRaw === "VideoLiveMemberMessage" ? selectCase({
      exp: parseInt(action, 10),
      case: [
        [1, () => extraApis.inbound],
        [3, () => extraApis.banned],
        [4, () => extraApis.unbanned],
        [5, () => extraApis.elevated],
        [12, () => extraApis.subscribed],
      ],
      def: () => `Undefined ${typeRaw}`,
    }) : get(d, "common.method");
  }

  private toChat = (d: unknown) => {
    let content = get(d, "extra.content") as string;
    for (const v of register.replaceChat) {
      content = content.replace(v[0], v[1]);
    }
    return {
      timestamp: new Date().getTime(),
      method: this.typeOf(d),
      user: toUser(d),
      content,
      isFiltered: register.filterChat.some((v) => {
        return !isNull(v.exec(content));
      }),
    };
  }

  private toGift = async (d: any) => {
    if (isUndefined(this.status.giftList)) {
      const r = await fetchGiftList(this.status.room.id);
      this.status.giftList = [];
      r.gift_info.map((v) => {
        Reflect.set(this.status.giftList, v.id as number, {
          name: v.name as string,
          weight: v.diamond_count as number,
        });
      });
    }
    const getInfo = (str: string) => get(d, "extra.present_info." + str);
    const getEnd = (str: string) => get(d, "extra.present_end_info." + str);
    const getAll = (str: string) => getInfo(str) || getEnd(str);
    const giftId = parseInt(getAll("id"), 10);
    return {
      user: toUser(d),
      isEnd: this.typeOf(d) === "VideoLivePresentEndTipMessage",
      gift: {
        ...this.status.giftList[giftId],
        count: getAll("count") as number,
      },
      groupId: getAll("group_id") as string,
    };
  }
}
