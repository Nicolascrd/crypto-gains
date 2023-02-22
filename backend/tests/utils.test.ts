import { describe, expect, test } from "@jest/globals";
import { GetAccount } from "../src/controllers/interfaces";
import { mergeBalances } from "../src/controllers/utils";

describe("Utils : merge Balances", () => {
  test("Merge 2 balances", () => {
    const balance1: GetAccount = {
      tickers: ["LTC", "BTC", "ETH", "BUSD"],
      amounts: {
        LTC: 1,
        BTC: 0.2,
        ETH: 2,
        BUSD: 20000,
      },
    };
    const balance2: GetAccount = {
      tickers: ["LTC", "BTC", "USDT"],
      amounts: {
        LTC: 10,
        BTC: 1,
        USDT: 10000,
      },
    };
    const merge: GetAccount = {
      tickers: ["LTC", "BTC", "ETH", "BUSD", "USDT"],
      amounts: {
        LTC: 11,
        BTC: 1.2,
        ETH: 2,
        BUSD: 20000,
        USDT: 10000,
      },
    };
    expect(mergeBalances([balance1, balance2])).toEqual(merge);
  });
});
