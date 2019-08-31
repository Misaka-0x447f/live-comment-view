import {User} from "./user";

export interface Lottery {
  id: number;
  isActive: boolean;
  isFinished: boolean;
  prizeName: string;
  content: string;
  luckyUsers: User[];
  userCount: number;
  finishAt: number; // unix time stamp
}
