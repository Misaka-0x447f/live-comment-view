import {notStrictEqual, strictEqual} from "assert";
import {isArray, isNil} from "lodash-es";

export const assert = {
  eq: strictEqual,
  notEq: notStrictEqual,
  notNull: <T>(actual: T, message: string) => {
    if (isArray(actual)) {
      (actual as unknown as any[]).forEach((v) => {
        assert.eq(isNil(v), false, message);
      });
      return actual as unknown as Required<T>;
    } else {
      assert.eq(isNil(actual), false, message);
      return actual as NonNullable<T>;
    }
  },
};
