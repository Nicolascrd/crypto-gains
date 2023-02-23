import { GetAccount } from "../src/controllers/interfaces";
import { mergeBalances } from "../src/controllers/utils";
import { expect } from "chai";
import { suite, test } from "mocha";

suite("Utils : merge Balances", () => {
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
  test("Merge 2 balances", () => {
    expect(
      mergeBalances([balance1, balance2]),
      "Merging two balances does not give expected result"
    ).to.deep.equal(merge);
  });
});
