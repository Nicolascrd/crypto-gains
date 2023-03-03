import { GetAccount, IdwEntry, IdwFormatted } from "../src/interfaces";
import {
  mergeBalances,
  formatToTimeframe,
  getMonday,
  get1stNextMonth,
  get1stJanNextYear,
} from "../src/controllers/utils";
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

suite("Utils: getMonday", () => {
  test("get Monday from Wednesday", () => {
    expect(getMonday(new Date("2021-01-14 UTC")).getTime()).to.be.equal(
      new Date("2021-01-11 UTC").getTime()
    );
  });
  test("get Monday from Monday", () => {
    expect(getMonday(new Date("2021-01-11 UTC")).getTime()).to.be.equal(
      new Date("2021-01-11 UTC").getTime()
    );
  });
});

suite("Utils: get first day of next month", () => {
  test("get first day 1", () => {
    expect(get1stNextMonth(new Date("2021-01-11 UTC")).getTime()).to.be.equal(
      new Date("2021-02-01 UTC").getTime()
    );
  });
});

suite("Utils: get first day of next year", () => {
  test("get first day", () => {
    expect(get1stJanNextYear(new Date("2021-01-11 UTC")).getTime()).to.be.equal(
      new Date("2022-01-01 UTC").getTime()
    );
  });
});
suite("Utils: format to timeframe", () => {
  const unixStart1 = new Date("2021-11-04 UTC").getTime();
  const unixEnd1 = new Date("2021-11-07 UTC").getTime();
  const entries1: IdwEntry[] = [
    {
      asset: "BTC",
      utc_time: new Date("2021-11-04 10:30:10 UTC").getTime(),
      dw_id: 1,
      change: 1,
    },
    {
      asset: "ETH",
      utc_time: new Date("2021-11-04 11:00:00 UTC").getTime(),
      dw_id: 1,
      change: 6,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-11-06 01:30:10 UTC").getTime(),
      dw_id: 1,
      change: -0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-11-06 23:59:59 UTC").getTime(),
      dw_id: 1,
      change: 0.5,
    },
    {
      asset: "BNB",
      utc_time: new Date("2021-11-07 00:00:01 UTC").getTime(),
      dw_id: 1,
      change: 0.5,
    },
  ];
  const resultDailySplit1: IdwFormatted[] = [
    {
      start: unixStart1,
      assets: {
        BTC: {
          "+": 1,
          "-": 0,
        },
        ETH: {
          "+": 6,
          "-": 0,
        },
      },
    },
    {
      start: unixStart1 + 24 * 60 * 60 * 1000,
      assets: {},
    },
    {
      start: unixStart1 + 24 * 60 * 60 * 1000 * 2,
      assets: {
        BTC: {
          "+": 0.5,
          "-": -0.5,
        },
      },
    },
  ];
  const resultWeeklySplit1: IdwFormatted[] = [
    {
      start: unixStart1,
      assets: {
        BTC: {
          "+": 1.5,
          "-": -0.5,
        },
        ETH: {
          "+": 6,
          "-": 0,
        },
      },
    },
  ];
  const resultMonthlySplit1: IdwFormatted[] = [
    {
      start: unixStart1,
      assets: {
        BTC: {
          "+": 1.5,
          "-": -0.5,
        },
        ETH: {
          "+": 6,
          "-": 0,
        },
      },
    },
  ];
  const resultYearlySplit1: IdwFormatted[] = [
    {
      start: unixStart1,
      assets: {
        BTC: {
          "+": 1.5,
          "-": -0.5,
        },
        ETH: {
          "+": 6,
          "-": 0,
        },
      },
    },
  ];
  const unixStart2 = new Date("2021-01-01 UTC").getTime(); // Friday
  const unixEnd2 = new Date("2021-01-24 UTC").getTime(); // last day selected is 2021-01-23 (Saturday)

  const entries2: IdwEntry[] = [
    {
      asset: "BTC",
      utc_time: new Date("2021-01-01 00:00:01 UTC").getTime(),
      dw_id: 1,
      change: 0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-01-03 23:59:01 UTC").getTime(), // still 1st week
      dw_id: 1,
      change: 0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-01-04 00:00:59 UTC").getTime(), // 2nd week
      dw_id: 1,
      change: -0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-01-18 00:00:59 UTC").getTime(), // 4th week
      dw_id: 1,
      change: -0.5,
    },
    {
      asset: "BNB",
      utc_time: new Date("2021-01-24 00:00:59 UTC").getTime(), // not included
      dw_id: 1,
      change: 10,
    },
  ];
  const resultDailySplit2: IdwFormatted[] = [];
  for (let i = 0; i < 23; i++) {
    switch (i) {
      case 0:
        resultDailySplit2.push({
          start: unixStart2 + 3600 * 24 * 1000 * i,
          assets: { BTC: { "+": 0.5, "-": 0 } },
        });
        break;
      case 2:
        resultDailySplit2.push({
          start: unixStart2 + 3600 * 24 * 1000 * i,
          assets: { BTC: { "+": 0.5, "-": 0 } },
        });
        break;
      case 3:
        resultDailySplit2.push({
          start: unixStart2 + 3600 * 24 * 1000 * i,
          assets: { BTC: { "-": -0.5, "+": 0 } },
        });
        break;
      case 17:
        resultDailySplit2.push({
          start: unixStart2 + 3600 * 24 * 1000 * i,
          assets: { BTC: { "-": -0.5, "+": 0 } },
        });
        break;
      default:
        resultDailySplit2.push({
          start: unixStart2 + 3600 * 24 * 1000 * i,
          assets: {},
        });
    }
  }
  const resultWeeklySplit2: IdwFormatted[] = [
    {
      start: unixStart2,
      assets: {
        BTC: {
          "+": 1,
          "-": 0,
        },
      },
    },
    {
      start: new Date("2021-01-04 UTC").getTime(),
      assets: {
        BTC: {
          "+": 0,
          "-": -0.5,
        },
      },
    },
    {
      start: new Date("2021-01-11 UTC").getTime(),
      assets: {},
    },
    {
      start: new Date("2021-01-18 UTC").getTime(),
      assets: {
        BTC: {
          "+": 0,
          "-": -0.5,
        },
      },
    },
  ];

  const resultMonthlySplit2: IdwFormatted[] = [
    {
      start: unixStart2,
      assets: {
        BTC: {
          "+": 1,
          "-": -1,
        },
      },
    },
  ];

  const resultYearlySplit2: IdwFormatted[] = [
    {
      start: unixStart2,
      assets: {
        BTC: {
          "+": 1,
          "-": -1,
        },
      },
    },
  ];

  const unixStart3 = new Date("2021-01-03 UTC").getTime();
  const unixEnd3 = new Date("2021-04-01 UTC").getTime(); // last day selected is 2021-02-28
  const entries3 = [
    {
      asset: "BTC",
      utc_time: new Date("2021-02-01 00:00:59 UTC").getTime(), // second month
      dw_id: 1,
      change: 0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-02-27 23:00:59 UTC").getTime(), // second month
      dw_id: 1,
      change: 0.5,
    },
    {
      asset: "BTC",
      utc_time: new Date("2021-03-01 00:00:59 UTC").getTime(), // third month
      dw_id: 1,
      change: -1,
    },
    {
      asset: "BNB",
      utc_time: new Date("2021-04-01 00:00:59 UTC").getTime(), // not included
      dw_id: 1,
      change: 10,
    },
  ];

  const resultMonthlySplit3: IdwFormatted[] = [
    { start: unixStart3, assets: {} },
    {
      start: new Date("2021-02-01 UTC").getTime(),
      assets: {
        BTC: { "+": 1, "-": 0 },
      },
    },
    {
      start: new Date("2021-03-01 UTC").getTime(),
      assets: {
        BTC: {
          "+": 0,
          "-": -1,
        },
      },
    },
  ];

  test("Daily", () => {
    expect(
      formatToTimeframe(entries1, "D", unixStart1, unixEnd1)
    ).to.deep.equal(resultDailySplit1);
    expect(
      formatToTimeframe(entries2, "D", unixStart2, unixEnd2)
    ).to.deep.equal(resultDailySplit2);
  });
  test("Weekly", () => {
    expect(
      formatToTimeframe(entries1, "W", unixStart1, unixEnd1)
    ).to.deep.equal(resultWeeklySplit1);
    expect(
      formatToTimeframe(entries2, "W", unixStart2, unixEnd2)
    ).to.deep.equal(resultWeeklySplit2);
  });
  test("Monthly", () => {
    expect(
      formatToTimeframe(entries1, "M", unixStart1, unixEnd1)
    ).to.deep.equal(resultMonthlySplit1);
    expect(
      formatToTimeframe(entries2, "M", unixStart2, unixEnd2)
    ).to.deep.equal(resultMonthlySplit2);
    expect(
      formatToTimeframe(entries3, "M", unixStart3, unixEnd3)
    ).to.deep.equal(resultMonthlySplit3);
  });
  test("Yearly", () => {
    expect(
      formatToTimeframe(entries1, "Y", unixStart1, unixEnd1)
    ).to.deep.equal(resultYearlySplit1);
    expect(
      formatToTimeframe(entries2, "Y", unixStart2, unixEnd2)
    ).to.deep.equal(resultYearlySplit2);
  });
});
