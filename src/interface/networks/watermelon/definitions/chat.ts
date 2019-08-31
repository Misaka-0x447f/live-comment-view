import {User} from "./user";

export interface Chat {
  content: string;
  user: User;
  filterString: string[];
  isFiltered: boolean;
}
