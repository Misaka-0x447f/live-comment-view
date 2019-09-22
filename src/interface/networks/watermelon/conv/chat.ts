import {get} from "lodash-es";
import {toUser} from "./user";

export const exactlyFilterList: string[] = [];

export const toChat = (d: unknown) => {
  const content = get(d, "extra.content");
  return {
    method: get(d, "common.method") as ChatMethods,
    user: toUser(d),
    content: content as string,
    isFiltered: exactlyFilterList.indexOf(content) !== -1,
  };
};

export type ChatMethods =
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
  | "VideoLiveNoticeMessage";         // [ignore] broadcast
