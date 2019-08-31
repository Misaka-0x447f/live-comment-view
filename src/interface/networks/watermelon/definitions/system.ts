import {User} from "./user";

export const systemMessageType = {
  1: "%s 进入房间",
  3: "%s 已被禁言",
  4: "%s 已被取消禁言",
  5: "%s 已任命为房管",
  12: "%s 关注了主播"
};

export interface System {
  type: keyof typeof systemMessageType;
  content: string;
  user: User;
}
