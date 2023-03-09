export function decimalRound(val: number, decimal: number): number {
  const pow = Math.pow(10, decimal);
  return Math.round(val * pow) / pow;
}

export function decimalRoundWrapper(val: number): string {
  return val > 1 ? String(decimalRound(val, 2)) : val.toPrecision(3);
}

export function dateStringToUTCDayStartEpoch(s: string): number {
  if (!s) {
    throw Error("Please enter a date string");
  }
  const d = s.split("T")[0] + " UTC"; // YYYY-MM-DD
  const date = Date.parse(d);
  console.log("date", date);
  return date;
}
