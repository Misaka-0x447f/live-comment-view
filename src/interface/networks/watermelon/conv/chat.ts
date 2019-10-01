import {get} from "lodash-es";
import {toUser} from "./user";
import {selectCase} from "../../../../utils/lang";

export const exactlyFilterList: string[] = [];

export const toChat = (d: unknown) => {
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
    method,
    user: toUser(d),
    content: content as string,
    isFiltered: exactlyFilterList.indexOf(content) !== -1,
  };
};

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
  | "VideoLiveNoticeMessage";         // unknown
export type ExtraMethods =
  "Inbound"
  | "Banned"
  | "Unbanned"
  | "Elevated"
  | "Subscribed";
