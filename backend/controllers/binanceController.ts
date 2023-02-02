import { MainClient } from "binance";
import { publicAndSecretKey } from "./dbController.js";
import { GetAccount } from "./interfaces.js";

async function clientFromId(id: number) {
  let public_key: string, secret_key: string;
  try {
    ({ public_key, secret_key } = await publicAndSecretKey(id));
  } catch (e) {
    throw e;
  }
  return new MainClient({
    api_key: public_key,
    api_secret: secret_key,
  });
}

export const getAccount = async (id: number) => {
  let client;
  try {
    client = await clientFromId(id);
  } catch (err) {
    throw err;
  }
  let res: GetAccount = {
    amounts: {} as Record<string, number>,
    tickers: [] as string[],
  };
  return await client.getAccountInformation().then((result) => {
    console.log(result.balances);
    result.balances.forEach((el) => {
      let fr = typeof el.free == "number" ? el.free : parseFloat(el.free);
      let lock =
        typeof el.locked == "number" ? el.locked : parseFloat(el.locked);
      if (fr > 0 || lock > 0) {
        if (el.asset.substring(0, 2) == "LD" && el.asset.length > 3) {
          // lended asset counted as asset
          let ass = el.asset.substring(2);
          if (ass in res.amounts) {
            res.amounts[ass] += fr + lock;
          } else {
            res.amounts[ass] = fr + lock;
            res.tickers.push(ass);
          }
        } else {
          if (el.asset in res.amounts) {
            res.amounts[el.asset] += fr + lock;
          } else {
            res.amounts[el.asset] = fr + lock;
            res.tickers.push(el.asset);
          }
        }
      }
    });
    return res;
  });
};

export const getPrices = async (tickers: string[]) => {
  const client = new MainClient({});
  const promises = [];

  for (let t of tickers) {
    promises.push(client.getAvgPrice({ symbol: t + "USDT" }));
  }
  return Promise.all(promises)
    .then(
      (values) => {
        const pricesMap = {} as Record<string, number>;
        console.log(values, tickers);
        values.forEach((value, index) => {
          pricesMap[tickers[index]] =
            typeof value.price == "number"
              ? value.price
              : parseFloat(value.price);
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
