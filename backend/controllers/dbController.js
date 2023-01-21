const sqlite = require("sqlite3");

exports.insertInto = (newKey) => {
  // object with fields: exchange, name, public_key, private_key
  let db = newDbConnector();
  db.run(
    `INSERT INTO keys(exchange, name, public_key, secret_key) VALUES("${newKey.exchange}", "${newKey.name}", "${newKey.public_key}", "${newKey.secret_key}")`,
    [],
    function (err) {
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

exports.getName = (id) => {
  let db = newDbConnector();
  return new Promise(function (resolve, reject) {
    db.all(`SELECT name FROM keys WHERE key_id = ${id}`, [], (err, rows) => {
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
    });
    db.close();
  });
};

exports.getExchange = (id) => {
  let db = newDbConnector();
  return new Promise(function (resolve, reject) {
    db.all(
      `SELECT exchange FROM keys WHERE key_id = ${id}`,
      [],
      (err, rows) => {
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

exports.allKeys = () => {
  let db = newDbConnector();
  return new Promise(function (resolve, reject) {
    db.all(
      "SELECT key_id, exchange, name, public_key FROM keys",
      [],
      (err, rows) => {
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

exports.publicAndSecretKey = (id) => {
  let db = newDbConnector();

  return new Promise(function (resolve, reject) {
    db.all(
      `SELECT public_key, secret_key FROM keys WHERE key_id = ${id}`,
      [],
      (err, rows) => {
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

exports.addRecords = (recordsArr) => {
  let db = newDbConnector();

  let str =
    "INSERT INTO depositsWithdrawals(account, utc_time, asset, change) VALUES";
  for (rec of recordsArr) {
    str += `(${rec.key_id}, ${rec.utc_time}, "${rec.asset}", ${rec.change}),`;
  }
  str = str.slice(0, str.length - 1) + ";";
  console.log("input:", str);
  db.run(str, [], (err) => {
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
  let db;
  try {
    db = new sqlite.Database("./db/cryptoGains.db", (err) => {
      if (err) {
        throw err;
      }
      console.log("Connected to the SQLite DB");
    });
  } catch (e) {
    throw e;
  }
  return db;
};
