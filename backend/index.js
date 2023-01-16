const { MainClient } = require("binance");
const express = require("express");
const bodyParser = require("body-parser");
const sqlite = require("sqlite3");
const app = express();
const jsonParser = bodyParser.json();

async function clientFromId(id) {
  const db = new sqlite.Database("./db/keys.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQLite DB");
  });
  let public_key, secret_key;
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
        public_key = rows[0].public_key;
        secret_key = rows[0].secret_key;
        if (public_key == undefined) {
          return reject("Public key can't be undefined");
        }
        resolve(
          new MainClient({
            api_key: public_key,
            api_secret: secret_key,
          })
        );
      }
    );
    db.close();
  });
}

async function getAccount(id) {
  let client;
  try {
    client = await clientFromId(id);
  } catch (err) {
    throw err;
  }
  res = {};
  return await client.getAccountInformation().then((result) => {
    console.log(result.balances);
    result.balances.forEach((el) => {
      let fr = parseFloat(el.free);
      let lock = parseFloat(el.locked);
      if (fr > 0 || lock > 0) {
        if (el.asset.substring(0, 2) == "LD" && el.asset.length > 3) {
          // lended asset counted as asset
          let ass = el.asset.substring(2);
          if (ass in res) {
            res[ass] += fr + lock;
          } else {
            res[ass] = fr + lock;
          }
        } else {
          if (el.asset in res) {
            res[el.asset] += fr + lock;
          } else {
            res[el.asset] = fr + lock;
          }
        }
      }
    });
    return res;
  });
}

app.post("/add_key", jsonParser, (req, res) => {
  const db = new sqlite.Database("./db/keys.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQLite DB");
  });
  console.log(req.body);
  if (req.body.name == undefined || req.body.name.length < 1) {
    res.status(400).send("name field must be completed");
  }
  if (req.body.public_key == undefined || req.body.public_key.length != 64) {
    res.status(400).send("public_key field must be completed and of length 64");
  }
  if (req.body.secret_key == undefined || req.body.secret_key.length != 64) {
    res.status(400).send("secret_key field must be completed and of length 64");
  }
  db.run(
    `INSERT INTO keys(name, public_key, secret_key) VALUES("${req.body.name}", "${req.body.public_key}", "${req.body.secret_key}")`,
    [],
    function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        console.log("New row inserted in DB,  name = ", req.body.name);
        res.sendStatus(200);
      }
    }
  );
  db.close();
});

app.get("/all_keys", (req, res) => {
  const db = new sqlite.Database("./db/keys.db", (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQLite DB");
  });
  db.all("SELECT key_id, name, public_key FROM keys", [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(`retrieved ${rows.length} keys in the local db`);
    res.json(rows);
  });
  db.close();
});

app.get("/balance", async (req, res) => {
  const id = parseInt(req.query.id);
  if (isNaN(id) || id == undefined || id < 1) {
    throw Error("To get Balance, please include valid id in query params");
  }
  let balance = await getAccount(id);
  res.json(balance);
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
