import { useOnce } from "./useOnce";

let count = 0;

export function makeUniqueId(): string {
  return `id${count++}`;
}

export function useUniqueId(): string {
  return useOnce(() => makeUniqueId());
}
