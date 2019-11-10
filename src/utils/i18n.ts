import {nop} from "./lang";

const d = (c, r?) => c ? (r ? r : c) : "";

export const i18n = {
  common: {
    priceUnit: "CN¥",
    offline: "{ 失去同步 }",
  },
  room: {
    streamer: "🔑",
    operator: "🔧",
  },
  comments: {
    VideoLiveNoticeMessage: nop,
    VideoLiveRoomAdMessage: nop,
    breadcrumb: (u, p?) => `${d(p)} ${u}`,
    badge: (l?, b?) => `${d(l)} ${d(b)}`,
    VideoLivePresentMessage: (u, c, n) => `${u} 赠送 ${c} 个 ${n}`,
    Inbound: (u) => `${u} 的进站请求被接受`,
    Banned: (u) => `${u} 已遭到封锁`,
    Unbanned: (u) => `${u} 的封锁已解除`,
    Elevated: (u) => `${u} 的权限已提升`,
    Subscribed: (u) => `${u} 正在监听你的直播`,
    VideoLiveJoinDiscipulusMessage: (u) => `${u} 已将你设为最爱`,
    notRegistered: (u, c, type) => `${u} 执行了动作类型: ${type}${c ? ", 并说：" + c : ""}`,
    VideoLiveControlMessage: "zzzzzzzzz",
  },
  tts: {
    thanks: (u, c, p) => `${u} 赠送了 ${c} 个 ${p}`,
  },
};

export default i18n;
