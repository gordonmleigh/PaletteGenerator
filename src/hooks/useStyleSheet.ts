import { DependencyList, useLayoutEffect } from "react";

export function useStyleSheet(
  factory: () => string | undefined,
  deps: DependencyList
) {
  useLayoutEffect(() => {
    const stylesheet = factory();
    if (!stylesheet) {
      return;
    }

    const el = document.createElement("style");
    el.innerHTML = stylesheet;
    document.head.appendChild(el);

    return () => {
      el.remove();
    };
  }, deps);
}
