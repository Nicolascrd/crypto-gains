import {
  getAccount as binanceGetAccount,
  getPrices,
} from "./binanceController.js";
import {
  getAccount as krakenGetAccount,
  getPrices as getKrakenPrices,
} from "./krakenController.js";
import {
  insertInto,
  getNameFromId,
  getExchange,
  allKeys,
  addRecords,
  IDepositRecord,
  getCryptoRecords,
  ITransactionSelector,
  getFiatRecords,
} from "./dbController.js";
import { parse, transform } from "csv/sync";
import { Request, Response } from "express";
import { params } from "../params/exchangeSpecifics.js";
import { dateParams } from "./../params/dates.js";
import { formatToTimeframe, groupAll, mergeBalances } from "./utils.js";

// An import assertion in a dynamic import

export const addKey = async (req: Request, res: Response) => {
  if (
    req.body.exchange == undefined ||
    !params.exchanges.includes(req.body.exchange)
  ) {
    res
      .status(400)
      .send(
        "exchange field must be completed and in " + String(params.exchanges)
      );
    return;
  }
  if (req.body.name == undefined || req.body.name.length < 1) {
    res.status(400).send("name field must be completed");
    return;
  }
  if (req.body.exchange == "Binance") {
    if (req.body.public_key == undefined || req.body.public_key.length != 64) {
      res
        .status(400)
        .send("public_key field must be completed and of length 64");
      return;
    }
    if (req.body.secret_key == undefined || req.body.secret_key.length != 64) {
      res
        .status(400)
        .send("secret_key field must be completed and of length 64");
      return;
    }
  } else if (req.body.exchange == "Kraken") {
    if (req.body.public_key == undefined) {
      res.status(400).send("public_key field must be completed");
      return;
    }
    if (req.body.secret_key == undefined) {
      res.status(400).send("secret_key field must be completed");
      return;
    }
  }

  try {
    await insertInto(req.body);
  } catch (e) {
    res.status(400).send(e);
    return;
  }
  res.sendStatus(200);
};

export const getName = async (req: Request, res: Response) => {
  if (typeof req.query.id != "string") {
    res
      .status(400)
      .send("To get Name, please include valid id in query params");
    return;
  }
  const id = parseInt(req.query.id);
  if (isNaN(id) || id == undefined || id < 1) {
    res
      .status(400)
      .send("To get Name, please include valid id in query params");
    return;
  }
  await getNameFromId(id).then(
    (value) => {
      res.status(200).send(value);
      return;
    },
    (reason) => {
      res.status(404).send(reason);
      return;
    }
  );
};

export const getAllKeys = async (req: Request, res: Response) => {
  await allKeys().then(
    async (value) => {
      res.status(200).send(value);
      return;
    },
    async (reason) => {
      res.status(404).send(reason);
      return;
    }
  );
};

export const balance = async (req: Request, res: Response) => {
  if (
    !Array.isArray(req.body) ||
    req.body == undefined ||
    req.body.length < 1
  ) {
    res.status(400).send("body must be an array of ids, but is : " + req.body);
    return;
  }

  const promises = [];

  for (const id of req.body) {
    const idInt = parseInt(id);
    if (isNaN(idInt)) {
      res
        .status(400)
        .send("body must be an array of ids (integers), but is : " + req.body);
      return;
    }
    promises.push(
      getExchange(parseInt(id)).then((value) => {
        if (value == "Kraken") {
          return krakenGetAccount(parseInt(id));
        } else {
          return binanceGetAccount(parseInt(id));
        }
      })
    );
  }

  await Promise.all(promises)
    .then((value) => mergeBalances(value))
    .then(
      (value) => res.status(200).json(value),
      (reason) => {
        res.status(400).send(reason);
      }
    );
};

export const prices = async (req: Request, res: Response) => {
  if (
    !Array.isArray(req.body) ||
    req.body == undefined ||
    req.body.length < 1
  ) {
    res
      .status(400)
      .send("body must be an array of tickers, but is : " + req.body);
    return;
  }
  // get all prices available on Binance, then the rest on Kraken
  const binanceUSDTArrayOfTickers = [];
  const binanceBUSDArrayOfTickers = [];
  const krakenArrayOfTickers = [];

  for (const t of req.body) {
    if (params.binanceUSDTPairs.includes(t)) {
      binanceUSDTArrayOfTickers.push(t);
    } else if (params.binanceBUSDpairs.includes(t)) {
      binanceBUSDArrayOfTickers.push(t);
    } else if (params.krakenUSDPairs.includes(t)) {
      krakenArrayOfTickers.push(t);
    }
  }
  const promises = [
    getPrices({
      BUSDtickers: binanceBUSDArrayOfTickers,
      USDTtickers: binanceUSDTArrayOfTickers,
    }),
    getKrakenPrices(krakenArrayOfTickers),
  ];
  await Promise.all(promises)
    .then(
      (values) => {
        res.status(200).json({ ...values[1], ...values[0], USD: 1 });
      },
      (reason) => {
        res.status(400).send(reason);
      }
    )
    .catch((reason) => {
      res.status(400).send(reason);
    });
};

export const movements = async (req: Request, res: Response) => {
  /*
  {
    ids: [1, 3],
    start: unix,
    end: unix,
    timeframe: "D" | "W" | "M" | "Y"
  }
  */
  if (
    req.body.ids == undefined ||
    req.body.start == undefined ||
    req.body.end == undefined ||
    req.body.timeframe == undefined ||
    req.body.crypto == undefined
  ) {
    res
      .status(400)
      .send(
        "Please include the following fields: ids, start, end, timeframe, crypto"
      );
    return;
  }

  if (Array.isArray(req.body.ids) == false || req.body.ids.length == 0) {
    res.status(400).send("ids field must be an array of integers");
    return;
  }
  if (typeof req.body.start !== "number") {
    res.status(400).send("start field must be a number");
    return;
  }
  if (req.body.start < dateParams.limitUnixSeconds) {
    req.body.start *= 1000;
  }
  if (req.body.start < dateParams.firstDate) {
    res.status(400).send("start time must be after September 2013");
    return;
  }
  if (typeof req.body.end !== "number") {
    res.status(400).send("end field must be a number");
    return;
  }
  if (req.body.end < dateParams.limitUnixSeconds) {
    req.body.end *= 1000;
  }
  if (req.body.end < req.body.start) {
    res.status(400).send("end time must be after start time");
    return;
  }
  if (!["D", "W", "M", "Y"].includes(req.body.timeframe)) {
    res.status(400).send("timeframe field must be 'D', 'W', 'M' or 'Y'");
    return;
  }
  if (typeof req.body.crypto !== "boolean") {
    res.status(400).send("crypto field must be a boolean");
    return;
  }
  const filters: ITransactionSelector = {
    start: req.body.start,
    end: req.body.end,
    ids: req.body.ids,
  };
  if (req.body.crypto) {
    await getCryptoRecords(filters)
      .then(
        async (value) => {
          if (value == null) {
            res.status(400).send("No value");
            return;
          }
          const ans = formatToTimeframe(
            value,
            req.body.timeframe,
            req.body.start,
            req.body.end
          );
          res.status(200).json(ans);
          return;
        },
        (reason) => {
          res.status(400).send(reason);
          return;
        }
      )
      .catch((reason) => {
        res.status(400).send(reason);
        return;
      });
  } else {
    await getFiatRecords(filters)
      .then(
        async (value) => {
          if (value == null) {
            res.status(400).send("No value");
            return;
          }
          res
            .status(200)
            .json(
              formatToTimeframe(
                value,
                req.body.timeframe,
                req.body.start,
                req.body.end
              )
            );
          return;
        },
        async (reason) => {
          res.status(400).send(reason);
          return;
        }
      )
      .catch((reason) => {
        res.status(400).send(reason);
        return;
      });
  }
};

export const movementsAgg = async (req: Request, res: Response) => {
  /*
  {
    ids: [1, 3],
    start: unix,
    end: unix,
    timeframe: "D" | "W" | "M" | "Y"
  }
  */
  if (
    req.body.ids == undefined ||
    req.body.start == undefined ||
    req.body.end == undefined ||
    req.body.crypto == undefined
  ) {
    res
      .status(400)
      .send("Please include the following fields: ids, start, end, crypto");
    return;
  }

  if (Array.isArray(req.body.ids) == false || req.body.ids.length == 0) {
    res.status(400).send("ids field must be an array of integers");
    return;
  }
  if (typeof req.body.start !== "number") {
    res.status(400).send("start field must be a number");
    return;
  }
  if (req.body.start < dateParams.limitUnixSeconds) {
    req.body.start *= 1000;
  }
  if (req.body.start < dateParams.firstDate) {
    res.status(400).send("start time must be after September 2013");
    return;
  }
  if (typeof req.body.end !== "number") {
    res.status(400).send("end field must be a number");
    return;
  }
  if (req.body.end < dateParams.limitUnixSeconds) {
    req.body.end *= 1000;
  }
  if (req.body.end < req.body.start) {
    res.status(400).send("end time must be after start time");
    return;
  }
  if (typeof req.body.crypto !== "boolean") {
    res.status(400).send("crypto field must be a boolean");
    return;
  }
  const filters: ITransactionSelector = {
    start: req.body.start,
    end: req.body.end,
    ids: req.body.ids,
  };
  if (req.body.crypto) {
    await getCryptoRecords(filters)
      .then(
        async (value) => {
          if (value == null) {
            res.status(400).send("No value");
            return;
          }
          const ans = groupAll(value);
          res.status(200).json(ans);
          return;
        },
        (reason) => {
          res.status(400).send(reason);
          return;
        }
      )
      .catch((reason) => {
        res.status(400).send(reason);
        return;
      });
  } else {
    await getFiatRecords(filters)
      .then(
        async (value) => {
          if (value == null) {
            res.status(400).send("No value");
            return;
          }
          res.status(200).json(groupAll(value));
          return;
        },
        async (reason) => {
          res.status(400).send(reason);
          return;
        }
      )
      .catch((reason) => {
        res.status(400).send(reason);
        return;
      });
  }
};

export const upload = async (req: Request, res: Response) => {
  let id = 0;
  if (typeof req.query.id != "string") {
    res
      .status(400)
      .send("To get Name, please include valid id in query params");
    return;
  }
  try {
    id = parseInt(req.query.id);
  } catch (e) {
    res
      .status(400)
      .send("To get Balance, please include valid id in query params");
    return;
  }
  let exchange = "";
  await getExchange(id).then(
    (value) => {
      exchange = value;
    },
    (reason) => {
      res.status(400).send(reason);
      return;
    }
  );
  console.log("upload to ", exchange);
  if (exchange == "Kraken") {
    await uploadKraken(req, res, id);
  }
  if (exchange == "Binance") {
    await uploadBinance(req, res, id);
  }
};

const uploadKraken = async (req: Request, res: Response, id: number) => {
  /*
  txid,               refid,                time,               type,   subtype, aclass,  asset, amount, fee, balance
  LCA6LV-5E7UH-47F36I,QCCTI4Q-ZKBGSL-T2XNVB,2020-02-25 02:13:24,deposit,        ,currency,ZEUR,  100,    0,   100
  */
  let rawRecords = parse(req.body) as string[];
  const expectedCols = [
    "txid",
    "refid",
    "time",
    "type",
    "subtype",
    "aclass",
    "asset",
    "amount",
    "fee",
    "balance",
  ];
  if (String(rawRecords[0]) != String(expectedCols)) {
    res
      .status(400)
      .send(
        "CSV File does not have the right format with columns : " +
          expectedCols.join(", ")
      );
    return;
  }
  rawRecords = rawRecords.slice(1); // remove top row
  const refinedRecords = transform(
    rawRecords.filter(function (value) {
      // records with no txid are in double
      return value[0] != "" && params.krakenDeposits.includes(value[3]);
    }),
    function (data) {
      return {
        key_id: id,
        utc_time: new Date(data[2]).getTime(),
        asset:
          data[6] in params.krakenAssets
            ? params.krakenAssets[data[6]]
            : data[6],
        change: parseFloat(data[7]),
      } as IDepositRecord;
    }
  );

  console.log(refinedRecords);
  try {
    addRecords(refinedRecords);
  } catch (e) {
    res.status(500).send("Cannot add records to db");
    console.error(e);
    return;
  }

  res.sendStatus(200);
  return;
};

const uploadBinance = async (req: Request, res: Response, id: number) => {
  /*
  User_ID, UTC_time,               Account, Operation, Coin, Change, Remark 
  51224736, 2020-02-25 02:13:24,  Earn,   Simple Earn Flexible interest, ADA, 0.01, fee included
  */
  let rawRecords = [] as string[];
  try {
    rawRecords = parse(req.body) as string[];
  } catch (e) {
    console.error(e);
    res.status(500).send("Cannot parse request body");
  }
  const expectedCols = [
    "User_ID",
    "UTC_Time",
    "Account",
    "Operation",
    "Coin",
    "Change",
    "Remark",
  ];
  if (String(rawRecords[0]) != String(expectedCols)) {
    res
      .status(400)
      .send(
        "CSV File does not have the right format with columns : " +
          expectedCols.join(", ")
      );
    return;
  }
  const refinedRecords = transform(
    rawRecords
      .slice(1)
      .filter((data) => params.binanceDeposits.includes(data[3])),
    function (data) {
      return {
        key_id: id,
        utc_time: new Date(data[1]).getTime(),
        asset:
          data[4] in params.krakenAssets
            ? params.krakenAssets[data[4]]
            : data[4],
        change: parseFloat(data[5]),
      } as IDepositRecord;
    }
  );

  console.log(refinedRecords);
  try {
    addRecords(refinedRecords);
  } catch (e) {
    res.status(500).send("Cannot add records to db");
    console.error(e);
    return;
  }

  res.sendStatus(200);
  return;
};
