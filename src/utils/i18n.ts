import {nop} from "./lang";

const i18nCommentBypass = (u, t) => `${u} ${t}`;

export const i18n = {
  common: {
    priceUnit: "CN¥",
  },
  room: {
    streamer: "主播",
    operator: "房管",
  },
  comments: {
    VideoLiveNoticeMessage: nop,
    VideoLiveRoomAdMessage: nop,
    VideoLivePresentMessage: (u) => `${u} 的礼物大量发生中`,
    VideoLivePresentEndTipMessage: (u) => `${u} 的礼物发生完了`,
    VideoLiveChatMessage: i18nCommentBypass,
    VideoLiveDanmakuMessage: i18nCommentBypass,
    Inbound: (u) => `${u} 的进站请求被接受`,
    Banned: (u) => `${u} 已遭到封锁`,
    Unbanned: (u) => `${u} 的封锁已解除`,
    Elevated: (u) => `${u} 的权限已提升`,
    Subscribed: (u) => `${u} 正在监听你的直播`,
    VideoLiveJoinDiscipulusMessage: (u) => `${u} 已将你设为最爱`,
    notRegistered: (u, c, type) => `${u} 执行了动作类型: ${type}${c ? ", 并说：" + c : ""}`,
    like: (u) => `${u} +1 了`,
    VideoLiveControlMessage: "zzzzzzzzz",
    lottery: (u) => `(中奖消息) ${u}`,
  },
};

export default i18n;
