import { GetAccount } from "./interfaces";

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
