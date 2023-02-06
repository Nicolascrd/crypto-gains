import KrakenClient from "ts-kraken-api";
import { params } from "../params/exchangeSpecifics.js";
import { publicAndSecretKey } from "./dbController.js";
import { GetAccount } from "./interfaces.js";

const clientFromId = async (id: number) => {
  const { public_key, secret_key } = await publicAndSecretKey(id);
  return new KrakenClient(public_key, secret_key);
};

const krakenConverter = function (balance: Record<string, number>): GetAccount {
  const res = {
    amounts: {},
    tickers: [],
  } as GetAccount;
  for (const asset in balance) {
    if (asset in params.krakenAssets) {
      res.tickers.push(params.krakenAssets[asset]);
      res.amounts[params.krakenAssets[asset]] = balance[asset];
    } else {
      res.tickers.push(asset);
      res.amounts[asset] = balance[asset];
    }
  }
  return res;
};

export const getAccount = async (id: number) => {
  const client: KrakenClient = await clientFromId(id);
  return await client
    .privateMethod("Balance", {}, () => undefined)
    .then((result) => {
      console.log("kraken balance result", result);
      if (result.error && result.error.length > 0) {
        throw Error("Cannot query balance");
      }
      return krakenConverter(result.result);
    });
};

export const getPrices = (tickers: string[]) => {
  const client = new KrakenClient("", "");
  const promises = [];
  for (const t of tickers) {
    promises.push(
      client.publicMethod("Ticker", { pair: t + "USD" }, () => undefined)
    );
  }
  return Promise.all(promises)
    .then(
      (values) => {
        const pricesMap = {} as Record<string, number>;
        values.forEach((value, index) => {
          for (const tick in value.result) {
            pricesMap[tickers[index]] = parseFloat(value.result[tick]["b"][0]);
          }
        });
        return pricesMap;
      },
      (reason) => {
        throw reason;
      }
    )
    .catch((reason) => {
      throw reason;
    });
};
