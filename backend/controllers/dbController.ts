import sqlite3 from "sqlite3";
const { Database } = sqlite3;

export type Exchange = "Kraken" | "Binance";

export interface INewKey {
  exchange: Exchange;
  name: string;
  public_key: string;
  secret_key: string;
}

export interface IDepositRecord {
  key_id: number;
  utc_time: number;
  asset: string;
  change: number;
}

export const insertInto = (newKey: INewKey) => {
  // object with fields: exchange, name, public_key, private_key
  let db = newDbConnector();
  db.run(
    `INSERT INTO keys(exchange, name, public_key, secret_key) VALUES("${newKey.exchange}", "${newKey.name}", "${newKey.public_key}", "${newKey.secret_key}")`,
    [],
    function (err: Error) {
      if (err) {
        console.error("Failed inserting new row in DB");
        throw err;
      } else {
        console.log("New row inserted in DB,  name = ", newKey.name);
      }
    }
  );
  db.close();
};

export const getNameFromId = (id: number) => {
  let db = newDbConnector();
  return new Promise<string>(function (resolve, reject) {
    db.all(
      `SELECT name FROM keys WHERE key_id = ${id}`,
      [],
      (err: Error, rows: any[]) => {
        if (err) {
          return reject(err);
        }
        console.log(`retrieved ${rows.length} keys in the local db`);
        if (rows.length != 1) {
          return reject("No keys corresponding to ID " + id);
        }
        if (rows[0].name == undefined) {
          return reject("Name can't be undefined");
        }
        resolve(rows[0].name);
      }
    );
    db.close();
  });
};

export const getExchange = (id: number) => {
  let db = newDbConnector();
  return new Promise<Exchange>(function (resolve, reject) {
    db.all(
      `SELECT exchange FROM keys WHERE key_id = ${id}`,
      [],
      (err: Error, rows: any[]) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        console.log(`retrieved ${rows.length} keys in the local db`);
        if (rows.length != 1) {
          return reject("No keys corresponding to ID " + id);
        }
        resolve(rows[0].exchange);
      }
    );
    db.close();
  });
};

export const allKeys = () => {
  let db = newDbConnector();
  return new Promise<any[]>(function (resolve, reject) {
    db.all(
      "SELECT key_id, exchange, name, public_key FROM keys",
      [],
      (err: Error, rows: any[]) => {
        if (err) {
          return reject(err);
        }
        console.log(`retrieved ${rows.length} keys in the local db`);
        resolve(rows);
      }
    );
    db.close();
  });
};

export interface IPublicAndSecretKey {
  public_key: string;
  secret_key: string;
}

export const publicAndSecretKey = (id: number) => {
  let db = newDbConnector();

  return new Promise<IPublicAndSecretKey>(function (resolve, reject) {
    db.all(
      `SELECT public_key, secret_key FROM keys WHERE key_id = ${id}`,
      [],
      (err: Error, rows: IPublicAndSecretKey[]) => {
        if (err) {
          return reject(err);
        }
        console.log(`retrieved ${rows.length} keys in the local db`);
        if (rows.length != 1) {
          return reject("No keys corresponding to ID " + id);
        }
        let public_key = rows[0].public_key;
        let secret_key = rows[0].secret_key;
        if (public_key == undefined) {
          return reject("Public key can't be undefined");
        }
        resolve({
          public_key,
          secret_key,
        });
      }
    );
    db.close();
  });
};

export const addRecords = (recordsArr: IDepositRecord[]) => {
  let db = newDbConnector();

  let str =
    "INSERT INTO depositsWithdrawals(account, utc_time, asset, change) VALUES";
  for (let rec of recordsArr) {
    str += `(${rec.key_id}, ${rec.utc_time}, "${rec.asset}", ${rec.change}),`;
  }
  str = str.slice(0, str.length - 1) + ";";
  console.log("input:", str);
  db.run(str, [], (err: Error) => {
    if (err) {
      console.error("Failed inserting rows in DB");
      throw err;
    } else {
      console.log(
        recordsArr.length +
          " new rows inserted in deposits and withdrawals table"
      );
    }
  });
};

const newDbConnector = () => {
  try {
    let db = new Database("./db/cryptoGains.db", (err: Error | null) => {
      if (err) {
        throw err;
      }
      console.log("Connected to the SQLite DB");
    });
    return db;
  } catch (e) {
    throw e;
  }
};
