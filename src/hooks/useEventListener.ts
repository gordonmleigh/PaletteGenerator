import { DependencyList, useEffect } from "react";

export function useEventListener<E extends keyof WindowEventMap>(
  event: E,
  listener: (this: Window, ev: WindowEventMap[E]) => void,
  deps?: DependencyList
) {
  const allDeps = [event];
  if (deps) {
    allDeps.push(...deps);
  }

  useEffect(() => {
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }, allDeps);
}
