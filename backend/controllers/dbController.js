const sqlite = require("sqlite3");

module.exports = class dbController {
  constructor() {
    let db;
    try {
      db = new sqlite.Database("./db/keys.db", (err) => {
        if (err) {
          throw err;
        }
        console.log("Connected to the SQLite DB");
      });
    } catch (e) {
      throw e;
    }
    this.db = db;
  }
  close() {
    this.db.close();
  }
  insertInto(newKey) {
    // object with fields: name, public_key, private_key
    this.db.run(
      `INSERT INTO keys(name, public_key, secret_key) VALUES("${newKey.name}", "${newKey.public_key}", "${newKey.secret_key}")`,
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
  }
  getName(id) {
    let db = this.db;
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
    });
  }
  allKeys() {
    let db = this.db;
    return new Promise(function (resolve, reject) {
      db.all("SELECT key_id, name, public_key FROM keys", [], (err, rows) => {
        if (err) {
          return reject(err);
        }
        console.log(`retrieved ${rows.length} keys in the local db`);
        resolve(rows);
      });
    });
  }
  publicAndSecretKey(id) {
    let db = this.db;
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
    });
  }
};
