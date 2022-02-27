import deepEqual from "deep-equal";
import { Dispatch, SetStateAction } from "react";

export function deepEqualDispatch<T>(
  base: Dispatch<SetStateAction<T>>
): Dispatch<SetStateAction<T>> {
  return (value) => {
    base((prev) => {
      const next =
        typeof value === "function" ? (value as (v: T) => T)(prev) : value;

      if (deepEqual(prev, next)) {
        return prev;
      }
      return next;
    });
  };
}
