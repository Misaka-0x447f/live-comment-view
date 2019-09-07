import {fetchLiveComment, fetchRoomInfo} from "./network";
import {assert} from "../../../../utils/assert";
import {get, isNil} from "lodash-es";
import {AssertionError} from "assert";
import {recursivelyRun, selectCase} from "../../../../utils/lang";
import i18n from "../../../../utils/i18n";
import {toUser} from "../conv/user";
import {toChat} from "../conv/chat";

export class Watermelon {
  public status: {
    isLive: boolean
    lastRoomFetch: boolean
    name: string
    room: {
      title: string
      streamer?: ReturnType<typeof toUser>
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
  public commentPool: Array<{
    plainText: string,
  }> = [];
  private config: {
    roomId: number,
  } = {
    roomId: -1,
  };
  private raw: {
    room?: object,
  } = {
    room: undefined,
  };

  constructor(opt: Watermelon["config"]) {
    this.config = opt;
  }

  public startWatch() {
    recursivelyRun(this.fetchRoom, 30000);
    recursivelyRun(this.fetchComment, 5000);
  }

  public fetchRoom = async () => {
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
    const d = await fetchLiveComment(this.config.roomId, {offset: this.status.offset});
    try {
      assert.notNull([d.data, d.extra, d.cursor], "");
    } catch {
      if (get(d, "base_resp.status_code") !== 10038) {
        throw new AssertionError("room information parse error", get(d, "base_resp.status_code"), 10038);
      }
      return;
    }
    this.status.offset = d.extra.cursor;
    d.data.forEach((v) => {
      const username = toChat(v).user.name;
      const plainText: string | undefined = selectCase({
        exp: get(v, "common.method") as string | undefined,
        case: [
          [undefined],
          ["VideoLivePresentMessage"],  // TODO: support gift
          ["VideoLivePresentEndTipMessage"],
          ["VideoLiveRoomAdMessage", () => i18n.comments.broadcast(v)],
          ["VideoLiveChatMessage", () => i18n.comments.chat(toChat(v).content)],
          ["VideoLiveMemberMessage", () => i18n.comments.inbound(username)],
          ["VideoLiveSocialMessage", () => i18n.comments.subscribed(username)],
          ["VideoLiveJoinDiscipulusMessage", () => i18n.comments.favoured(username)],
          ["VideoLiveControlMessage", () => i18n.comments.leave],
          ["VideoLiveDiggMessage"], // System broadcast or what
          ["VideoLiveDanmakuMessage", () => toChat(v).content],
        ],
        def: () => JSON.stringify(toChat(v)),
      });
      if (!isNil(plainText)) {
        this.commentPool.push(
          {
            plainText,
          });
      }
    });
  }
}
