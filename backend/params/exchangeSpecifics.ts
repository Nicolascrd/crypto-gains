export const params = {
  exchanges: ["Binance", "Kraken"],
  binanceDeposits: ["Deposit", "Withdraw"],
  krakenDeposits: ["deposit", "withdrawal"],
  krakenAssets: {
    XBT: "BTC",
    XXBT: "BTC",
    XETH: "ETH",
    XXRP: "XRP",
    XXLM: "XLM",
    XLTC: "LTC",
    LUNA: "LUNC",
    LUNA2: "LUNA",
    ZUSD: "USD",
    ZEUR: "EUR",
  } as Record<string, string>,
};
