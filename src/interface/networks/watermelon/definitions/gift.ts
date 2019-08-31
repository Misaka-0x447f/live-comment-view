import {User} from "./user";

export interface Gift {
  id: number;
  count: number;
  roomId: number;
  contains: Array<{
    count: number
    type: string
  }>;
  user?: User;
}
