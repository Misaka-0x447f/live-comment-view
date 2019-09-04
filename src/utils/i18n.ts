import {bypass, nop} from "./lang";

export const i18n = {
  room: {
    streamer: "主播",
    operator: "房管",
  },
  comments: {
    present: (u) => `来自 ${u} 的礼物大量发生中`,
    presentEnd: (u) => `来自 ${u} 的礼物发生完了`,
    broadcast: nop, // ads
    chat: bypass,
    danmaku: bypass,
    inbound: (u) => `${u} 的进站请求被接受。`,
    outbound: (u) => `${u} 已离站。`,
    banned: (u) => `${u} 已封锁。`,
    unbanned: (u) => `${u} 的封锁已解除。`,
    elevated: (u) => `${u} 已提升。`,
    subscribed: (u) => `${u} 正在监听你。`,
    notRegistered: (u, type) => `${u} 执行了动作类型: ${type}`,
    message: bypass,
    like: (u) => `${u} +1 了你!`,
    leave: "zzzzzzzzz",
    lottery: (u) => `(中奖消息) ${u}`,
  },
};

export default i18n;
