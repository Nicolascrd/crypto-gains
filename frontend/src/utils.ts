export function decimalRound(val: number, decimal: number): number {
  const pow = Math.pow(10, decimal);
  return Math.round(val * pow) / pow;
}
