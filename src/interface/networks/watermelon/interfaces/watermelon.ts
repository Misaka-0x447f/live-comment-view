import {fetchLiveComment, fetchLocateRoom, fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {defaultTo, get, isEmpty, isNil} from "lodash-es";
import {recursivelyRun, selectCase, sleep} from "../../../../utils/lang";
import {toUser} from "../conv/user";

const poolSize = 10000;

export type ChatMethods = APIMethods | ExtraMethods;
export type APIMethods =
  "VideoLivePresentMessage"           // TODO: support gift
  | "VideoLivePresentEndTipMessage"
  | "VideoLiveRoomAdMessage"
  | "VideoLiveChatMessage"            // normal chat
  | "VideoLiveMemberMessage"          // audience inbound
  | "VideoLiveSocialMessage"          // audience subscribed
  | "VideoLiveJoinDiscipulusMessage"  // audience favoured
  | "VideoLiveControlMessage"         // streamer leave
  | "VideoLiveDiggMessage"            // [ignore] broadcast
  | "VideoLiveDanmakuMessage"         // unknown type danmaku
  | "VideoLiveNoticeMessage"          // [ignore] broadcast
  | "VideoLiveNoticeMessage";
export type ExtraMethods =
  "Inbound"
  | "Banned"
  | "Unbanned"
  | "Elevated"
  | "Subscribed";

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
  } = {
    isLive: false,
    lastRoomFetch: false,
    room: {
      activeUserCount: -1,
    },
    offset: 0,
    exactlyFilterList: [],
  };
  public commentPool: Array<ReturnType<Watermelon["pushChat"]>> = [];
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
      if (!isNil(this.pushChat(v))) {
        this.commentPool.unshift({
          ...this.pushChat(v),
        });
      }
    });
    while (this.commentPool.length > poolSize) {
      this.commentPool.pop();
    }
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

  private pushChat = (d: unknown) => {
    const content = get(d, "extra.content");
    const typeRaw = get(d, "common.method");
    const action = get(d, "extra.action");
    const method = typeRaw === "VideoLiveMemberMessage" ? selectCase({
      exp: parseInt(action, 10),
      case: [
        [1, () => "Inbound"],
        [3, () => "Banned"],
        [4, () => "Unbanned"],
        [5, () => "Elevated"],
        [12, () => "Subscribed"],
      ],
      def: () => `Undefined ${typeRaw}`,
    }) : get(d, "common.method");
    return {
      timestamp: new Date().getTime(),
      method,
      user: toUser(d),
      content: content as string,
      isFiltered: this.status.exactlyFilterList.indexOf(content) !== -1,
    };
  }
}
