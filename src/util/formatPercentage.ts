export function formatPercentage(value: number, precision = 0): string {
  return (value * 100).toFixed(precision);
}
