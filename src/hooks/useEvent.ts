import { DependencyList, useEffect, useRef } from "react";

export function useEvent<T>(
  handler: T | undefined,
  raise: (handler: T) => void,
  deps: DependencyList
): void {
  const enabled = useRef<T>();

  useEffect(() => {
    if (handler) {
      if (enabled.current === handler) {
        raise(handler);
      } else {
        enabled.current = handler;
      }
    } else {
      enabled.current = undefined;
    }
  }, [handler, ...deps]);
}
