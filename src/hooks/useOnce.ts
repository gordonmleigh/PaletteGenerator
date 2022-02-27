import { useRef } from "react";

export function useOnce<T>(init: () => T): T {
  const initialised = useRef(false);
  const value = useRef<T>();

  if (!initialised.current) {
    value.current = init();
    initialised.current = true;
  }

  return value.current as T;
}
