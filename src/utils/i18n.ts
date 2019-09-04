import {bypass, nop} from "./lang";

export const i18n = {
  room: {
    streamer: "主播",
    operator: "房管",
  },
  comments: {
    present: (v) => `礼物大量发生中: ${v}`,
    presentEnd: (v) => `礼物发生完了: ${v}`,
    broadcast: nop, // ads
    chat: bypass,
    danmaku: bypass,
    inbound: (v) => `${v} 的进站请求被接受。`,
    outbound: (v) => `${v} 已离站。`,
    banned: (v) => `${v} 已封锁。`,
    unbanned: (v) => `${v} 的封锁已解除。`,
    elevated: (v) => `${v} 已提升。`,
    subscribed: (v) => `${v} 正在监听你。`,
    message: bypass,
    like: (v) => `${v} +1 了你!`,
    leave: "zzzzzzzzz",
    lottery: (v) => `(中奖) ${v}`,
  },
};

export default i18n;
