import KrakenClient from "kraken-api";
import { params } from "../params/exchangeSpecifics.js";
import { publicAndSecretKey } from "./dbController.js";
import { GetAccount } from "./interfaces.js";

const clientFromId = async (id: number) => {
  let public_key: string, secret_key: string;
  try {
    ({ public_key, secret_key } = await publicAndSecretKey(id));
  } catch (e) {
    throw e;
  }
  return new KrakenClient(public_key, secret_key);
};

const krakenConverter = function (
  balance: Record<string, number>
): Record<string, number> {
  const res: Record<string, number> = {};
  for (let asset in balance) {
    if (asset in params.krakenAssets) {
      res[params.krakenAssets[asset]] = balance[asset];
    } else {
      res[asset] = balance[asset];
    }
  }
  return res;
};

export const getAccount = async (id: number) => {
  let client: KrakenClient;
  try {
    client = await clientFromId(id);
  } catch (e) {
    throw e;
  }
  let res: GetAccount = {
    amounts: {},
    tickers: [],
  };
  return await client
    .privateMethod("Balance", {}, () => {})
    .then((result) => {
      console.log("kraken balance result", result);
      if (result.error && result.error.length > 0) {
        throw Error("Cannot query balance");
      }
      return krakenConverter(result.result);
    });
};
