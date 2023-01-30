import {
  getAccount as binanceGetAccount,
  getPrices,
} from "./binanceController.js";
import { getAccount as krakenGetAccount } from "./krakenController.js";
import {
  insertInto,
  getNameFromId,
  getExchange,
  allKeys,
  addRecords,
  IDepositRecord,
} from "./dbController.js";
import { parse, transform } from "csv/sync";
import { Request, Response } from "express";

// An import assertion in a dynamic import
const params = {
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

export const addKey = (req: Request, res: Response) => {
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
    insertInto(req.body);
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
  try {
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
  } catch (e) {
    res.status(400).send(e);
    return;
  }
};

export const getAllKeys = async (req: Request, res: Response) => {
  try {
    await allKeys().then(
      (value) => {
        res.status(200).send(value);
        return;
      },
      (reason) => {
        res.status(404).send(reason);
        return;
      }
    );
  } catch (e) {
    res.status(400).send(e);
    return;
  }
};

export const getBalance = async (req: Request, res: Response) => {
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
  if (isNaN(id) || id == undefined || id < 1) {
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

  if (exchange == "Kraken") {
    await krakenGetAccount(id).then(
      (value) => {
        res.status(200).json(value);
      },
      (reason) => {
        res.status(400).send(reason);
      }
    );
  }

  if (exchange == "Binance") {
    await binanceGetAccount(id).then(
      (value) => {
        res.status(200).json(value);
      },
      (reason) => {
        res.status(400).send(reason);
      }
    );
  }
};

export const prices = async (req: Request, res: Response) => {
  if (
    !Array.isArray(req.body) ||
    req.body == undefined ||
    req.body.length < 1
  ) {
    res.status(400).send("body must be an array of tickers");
    return;
  }
  await getPrices(req.body).then(
    (value) => {
      res.status(200).json(value);
    },
    (reason) => {
      res.status(400).send(reason);
    }
  );
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
        asset: params.krakenAssets.hasOwnProperty(data[6])
          ? params.krakenAssets[data[6]]
          : data[6],
        change: parseFloat(data[7]),
      } as IDepositRecord;
    }
  );

  console.log(refinedRecords);
  try {
    addRecords(refinedRecords);
  } catch (e: any) {
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
        asset: params.krakenAssets.hasOwnProperty(data[4])
          ? params.krakenAssets[data[4]]
          : data[4],
        change: parseFloat(data[5]),
      } as IDepositRecord;
    }
  );

  console.log(refinedRecords);
  try {
    addRecords(refinedRecords);
  } catch (e: any) {
    res.status(500).send("Cannot add records to db");
    console.error(e);
    return;
  }

  res.sendStatus(200);
  return;
};
