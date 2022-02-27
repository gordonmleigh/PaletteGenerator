export function setArrayIndex(
  array: number[],
  index: number,
  value: number
): number[] {
  if (array[index] === value) {
    return array;
  }
  const next = [...array];
  next[index] = value;
  return next;
}
