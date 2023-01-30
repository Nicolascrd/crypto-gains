import KrakenClient from "kraken-api";
import { publicAndSecretKey } from "./dbController.js";
import { GetAccount } from "./interfaces.js";

// new KrakenClient()

const clientFromId = async (id: number) => {
  let public_key: string, secret_key: string;
  try {
    ({ public_key, secret_key } = await publicAndSecretKey(id));
  } catch (e) {
    throw e;
  }
  return new KrakenClient(public_key, secret_key, {
    timeout: 5000,
    otp: "",
  });
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
  console.log(await client.privateMethod("Balance", {}, () => {}));
};
