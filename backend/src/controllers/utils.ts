import { GetAccount, Timeframe, IdwEntry, IdwFormatted } from "../interfaces";

export const mergeBalances = (balances: GetAccount[]) => {
  const res: GetAccount = {
    tickers: [],
    amounts: {} as Record<string, number>,
  };
  for (const bal of balances) {
    for (const t of bal.tickers) {
      if (!res.tickers.includes(t)) {
        res.tickers.push(t);
        res.amounts[t] = bal.amounts[t];
      } else {
        res.amounts[t] += bal.amounts[t];
      }
    }
  }
  return res;
};

export const formatToTimeframe = (
  entries: IdwEntry[],
  timeframe: Timeframe,
  startDate: number, // Start of first day
  endDate?: number // Start of last day (not included)
) => {
  // entries must be ordered by utc_time

  // for each timeframe (day, week, month or year), group all entries by asset (+/-)
  const res = [] as IdwFormatted[];
  if (entries.length == 0) {
    return res;
  }
  let date = new Date(startDate);
  let entriesPosition = 0;
  do {
    const obj = {
      start: date.getTime(),
      assets: {},
    } as IdwFormatted;
    switch (timeframe) {
      case "D":
        date.setDate(date.getUTCDate() + 1);
        break;
      case "W":
        date.setDate(date.getUTCDate() + 7);
        date = getMonday(date);
        break;
      case "M":
        date = get1stNextMonth(date);
        break;
      case "Y":
        date = get1stJanNextYear(date);
        break;
    }
    while (
      entriesPosition < entries.length &&
      entries[entriesPosition].utc_time < date.getTime() &&
      (endDate == undefined || entries[entriesPosition].utc_time < endDate)
    ) {
      if (!(entries[entriesPosition].asset in obj.assets)) {
        obj.assets[entries[entriesPosition].asset] = { "+": 0, "-": 0 };
      }
      if (entries[entriesPosition].change > 0) {
        obj.assets[entries[entriesPosition].asset]["+"] +=
          entries[entriesPosition].change;
      } else {
        obj.assets[entries[entriesPosition].asset]["-"] +=
          entries[entriesPosition].change;
      }
      entriesPosition++;
    }
    res.push(obj);
  } while (
    endDate == undefined
      ? entriesPosition < entries.length
      : date.getTime() < endDate
  );

  return res;
};

export function getMonday(d: Date) {
  // https://stackoverflow.com/questions/4156434/javascript-get-the-first-day-of-the-week-from-current-date
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

export function get1stNextMonth(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
}

export function get1stJanNextYear(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear() + 1, 0, 1));
}
