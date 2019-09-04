import {get} from "lodash-es";
import {toUser} from "./user";
import {selectCase} from "../../../../utils/lang";
import i18n from "../../../../utils/i18n";

export const toMemberMessage = (d: unknown) => {
  const type = get(d, "extra.action");
  const user = toUser(d);
  return {
    type,
    typeEnum: (() => {
      selectCase({
        exp: type,
        case: [
          [1, () => i18n.comments.inbound(user.name)],
        ],
      });
    })(),
    content: get(d, "extra.content"),
  };
};
