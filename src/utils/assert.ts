import {notStrictEqual, strictEqual} from "assert";
import {isArray, isNil} from "lodash-es";

/**
 * @module assert
 * @member eq
 * @member notEq
 * @member notNull
 * @desc check if a or a group of value is null or undefined.
 */
export const assert = {
  eq: strictEqual,
  notEq: notStrictEqual,
  /**
   * @param actual          actual value
   * @param message         message on error
   */
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
