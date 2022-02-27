import { useOnce } from "./useOnce";

let count = 0;

export function useUniqueId(): string {
  return useOnce(() => `id${count++}`);
}
