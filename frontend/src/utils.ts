export function decimalRound(val: number, decimal: number): number {
  const pow = Math.pow(10, decimal);
  return Math.round(val * pow) / pow;
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
