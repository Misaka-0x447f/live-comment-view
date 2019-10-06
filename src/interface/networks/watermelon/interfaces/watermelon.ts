import {fetchGiftList, fetchLiveComment, fetchLocateRoom, fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {defaultTo, forIn, get, isEmpty, isUndefined, omit} from "lodash-es";
import {recursivelyRun, selectCase, sleep} from "../../../../utils/lang";
import {toUser} from "../util/user";
import {ChatMethods, extraApis} from "../util/type";
import {Await} from "../../../../utils/typescript";
import {isIterable} from "rxjs/internal-compatibility";
import {register} from "../register";

export class Watermelon {
  public status: {
    isLive: boolean
    lastRoomFetch: boolean
    room: {
      id?: string
      title?: string
      streamer?: ReturnType<typeof toUser>
      activeUserCount: number,
    }
    offset: number,
    exactlyFilterList: string[],
    giftList?: Array<{
      name: number,
      weight: number,   // stands for amount of point used
    }>,
  } = {
    isLive: false,
    lastRoomFetch: false,
    room: {
      activeUserCount: -1,
    },
    offset: 0,
    exactlyFilterList: [],
  };
  public pool = {
    comment: [] as Array<ReturnType<Watermelon["toChat"]>>,
    giftHistory: {} as { [groupId: string]: Omit<Await<ReturnType<Watermelon["toGift"]>>, "groupId"> },
    giftStream: [] as Array<Await<ReturnType<Watermelon["toGift"]>>>,
    other: [] as Array<ReturnType<Watermelon["toChat"]>>,
  };
  /**
   * @member stats.giftTotal  CNY of gift * 100
   */
  public stats = {
    giftTotal: 0,
  };
  private config: {
    streamer: string,
  };
  private raw: {
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
        await sleep(60 * 1000);
      }
    }
    recursivelyRun(this.fetchRoom, 30 * 1000).then();
    recursivelyRun(this.fetchComment, 2000).then();
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
          activeUserCount: d.room.user_count,
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
            () => this.pool.comment.unshift(this.toChat(v)),
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
              // giftStream
              this.pool.giftStream.unshift(await this.toGift(v));
            },
          ],
        ],
        def: () => this.pool.other.unshift(this.toChat(v)),
      });
    });

    // update gift total
    let count = 0;
    forIn(this.pool.giftHistory, (v) => {
      count += v.gift.count * v.gift.weight * register.price;
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

  private locateRoom = async () => {
    const d = await fetchLocateRoom(this.config.streamer);
    assert.notNil(d.data, "invalid search result");
    for (const v of d.data) {
      if (v.block_type !== 0) {
        continue;
      }
      if (isEmpty(v.cells)) {
        return null;
      }
      this.status.lastRoomFetch = true;
      this.status.isLive = defaultTo(get(v, "cells.0.anchor.user_info.is_living"), false);
      this.status.room.id = defaultTo(get(v, "cells.0.anchor.room_id"), undefined);
      this.status.room.streamer = toUser(get(v, "cells.0.anchor"));
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
    const content = get(d, "extra.content");
    return {
      timestamp: new Date().getTime(),
      method: this.typeOf(d),
      user: toUser(d),
      content: content as string,
      isFiltered: this.status.exactlyFilterList.indexOf(content) !== -1,
    };
  }

  private toGift = async (d: any) => {
    if (isUndefined(this.status.giftList)) {
      const r = await fetchGiftList(this.status.room.id);
      this.status.giftList = [];
      r.gift_info.map((v) => {
        console.log(JSON.stringify({
          name: v.name,
          weight: v.diamond_count,
        }));
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
