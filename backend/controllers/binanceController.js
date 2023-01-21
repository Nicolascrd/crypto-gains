const { MainClient } = require("binance");
const { publicAndSecretKey } = require("./dbController");

async function clientFromId(id) {
  let public_key, secret_key;
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

exports.getAccount = async (id) => {
  let client;
  try {
    client = await clientFromId(id);
  } catch (err) {
    throw err;
  }
  res = {
    amounts: {},
    tickers: [],
  };
  return await client.getAccountInformation().then((result) => {
    console.log(result.balances);
    result.balances.forEach((el) => {
      let fr = parseFloat(el.free);
      let lock = parseFloat(el.locked);
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

exports.getPrices = async (tickers) => {
  const client = new MainClient({});
  const promises = [];

  for (let t of tickers) {
    promises.push(client.getAvgPrice({ symbol: t + "USDT" }));
  }
  return Promise.all(promises)
    .then(
      (values) => {
        const pricesMap = {};
        console.log(values, tickers);
        values.forEach((value, index) => {
          pricesMap[tickers[index]] = parseFloat(value.price);
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
