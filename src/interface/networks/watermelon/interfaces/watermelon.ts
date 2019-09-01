import {fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {get} from "lodash-es";
import {User} from "./user";

export class Watermelon {
  private config: {
    roomId: number,
  } = {
    roomId: -1,
  };
  private status: {
    isLive: boolean
    lastRoomFetch: boolean
    name: string
    room: {
      title: string
      streamer?: User
      activeUserCount: number,
    }
    offset: number,
  } = {
    isLive: false,
    lastRoomFetch: false,
    name: "null",
    room: {
      title: "null",
      streamer: undefined,
      activeUserCount: -1,
    },
    offset: -1,
  };
  private raw: {
    room?: object,
  } = {
    room: undefined,
  };

  constructor(opt: Watermelon["config"]) {
    this.config = opt;
  }

  public async fetchRoom() {
    this.status.lastRoomFetch = false;
    const d = await fetchRoomInfo(this.config.roomId);
    assert.eq(
      get(d, "base_resp.status_code"), 0,
      "Room information request end with non-zero value",
    );
    assert.notNull(
      [d.room, d.room.status, d.room.user_account],
      "Room information parse error",
    );
    this.raw.room = d.room;
    this.status = {
      ...this.status,
      ...{
        isLive: d.room.status === 2,
        room: {
          ...this.status.room,
          title: d.room.title,
          activeUserCount: d.room.user_count,
        },
      },
    };
  }
}
