import { MainClient } from "binance";
import { publicAndSecretKey } from "./dbController.js";
import { GetAccount } from "./interfaces.js";

async function clientFromId(id: number) {
  const { public_key, secret_key } = await publicAndSecretKey(id);
  return new MainClient({
    api_key: public_key,
    api_secret: secret_key,
  });
}

export const getAccount = async (id: number) => {
  const client = await clientFromId(id);
  const res: GetAccount = {
    amounts: {} as Record<string, number>,
    tickers: [] as string[],
  };
  return await client.getAccountInformation().then((result) => {
    console.log(result.balances);
    result.balances.forEach((el) => {
      const fr = typeof el.free == "number" ? el.free : parseFloat(el.free);
      const lock =
        typeof el.locked == "number" ? el.locked : parseFloat(el.locked);
      if (fr > 0 || lock > 0) {
        if (el.asset.substring(0, 2) == "LD" && el.asset.length > 3) {
          // lended asset counted as asset
          const ass = el.asset.substring(2);
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

export const getPrices = (tickers: {
  USDTtickers: string[];
  BUSDtickers: string[];
}) => {
  const client = new MainClient({});
  const promises = [];

  for (const t of tickers.USDTtickers) {
    promises.push(client.getAvgPrice({ symbol: t + "USDT" }));
  }
  for (const t of tickers.BUSDtickers) {
    promises.push(client.getAvgPrice({ symbol: t + "BUSD" }));
  }
  const allTickers = [...tickers.USDTtickers, ...tickers.BUSDtickers];
  return Promise.all(promises)
    .then(
      (values) => {
        const pricesMap = {} as Record<string, number>;
        values.forEach((value, index) => {
          pricesMap[allTickers[index]] =
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
