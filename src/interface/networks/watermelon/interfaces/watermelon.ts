import {fetchLiveComment, fetchLocateRoom, fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {defaultTo, get, isEmpty, isNil} from "lodash-es";
import {recursivelyRun, sleep} from "../../../../utils/lang";
import {toUser} from "../conv/user";
import {toChat} from "../conv/chat";

const poolSize = 10000;

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
  } = {
    isLive: false,
    lastRoomFetch: false,
    room: {
      activeUserCount: -1,
    },
    offset: 0,
  };
  public commentPool: Array<ReturnType<typeof toChat>> = [];
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
      if (!isNil(toChat(v))) {
        this.commentPool.unshift({
          ...toChat(v),
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
}
