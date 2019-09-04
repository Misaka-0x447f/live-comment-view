import {get} from "lodash-es";
import {toUser} from "./user";
import {selectCase} from "../../../../utils/lang";
import i18n from "../../../../utils/i18n";

export const toMemberMessage = (d: unknown) => {
  const type = get(d, "extra.action");
  const u = toUser(d).name;
  return {
    type,
    plainText: (() => {
      selectCase({
        exp: type,
        case: [
          [1, () => i18n.comments.inbound(u)],
          [3, () => i18n.comments.banned(u)],
          [4, () => i18n.comments.unbanned(u)],
          [5, () => i18n.comments.elevated(u)],
          [12, () => i18n.comments.subscribed(u)],
        ],
        def: () => !i18n.comments.notRegistered(u, type),
      });
    })(),
    content: get(d, "extra.content"),
  };
};
