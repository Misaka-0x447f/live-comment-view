import {get} from "lodash-es";
import {toUser} from "./user";

export const exactlyFilterList: string[] = [];

export const toChat = (d: unknown) => {
  const content = get(d, "extra.content");
  return {
    user: toUser(d),
    content,
    isFiltered: !!exactlyFilterList.findIndex(content),
  };
};
