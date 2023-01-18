const { getAccount, getPrices } = require("./binanceController");
const dbController = require("./dbController");

exports.addKey = (req, res) => {
  console.log(req.body);
  if (req.body.name == undefined || req.body.name.length < 1) {
    res.status(400).send("name field must be completed");
    return;
  }
  if (req.body.public_key == undefined || req.body.public_key.length != 64) {
    res.status(400).send("public_key field must be completed and of length 64");
    return;
  }
  if (req.body.secret_key == undefined || req.body.secret_key.length != 64) {
    res.status(400).send("secret_key field must be completed and of length 64");
    return;
  }
  let db;
  try {
    db = new dbController();
    db.insertInto(req.body);
  } catch (e) {
    res.status(400).send(e);
    return;
  }
  res.sendStatus(200);
  db.close();
};

exports.getName = async (req, res) => {
  const id = parseInt(req.query.id);
  if (isNaN(id) || id == undefined || id < 1) {
    res
      .status(400)
      .send("To get Name, please include valid id in query params");
    return;
  }
  let db;
  try {
    db = new dbController();
    await db.getName(id).then(
      (value) => {
        res.status(200).send(value);
        return;
      },
      (reason) => {
        res.status(404).send(reason);
        return;
      }
    );
  } catch (e) {
    res.status(400).send(e);
    return;
  }
  db.close();
};

exports.getAllKeys = async (req, res) => {
  let db;
  try {
    db = new dbController();
    await db.allKeys().then(
      (value) => {
        res.status(200).send(value);
        return;
      },
      (reason) => {
        res.status(404).send(reason);
        return;
      }
    );
  } catch (e) {
    res.status(400).send(e);
    return;
  }
  db.close();
};

exports.getBalance = async (req, res) => {
  let id = 0;
  try {
    id = parseInt(req.query.id);
  } catch (e) {
    res
      .status(400)
      .send("To get Balance, please include valid id in query params");
    return;
  }
  if (isNaN(id) || id == undefined || id < 1) {
    res
      .status(400)
      .send("To get Balance, please include valid id in query params");
    return;
  }
  await getAccount(id).then(
    (value) => {
      res.status(200).json(value);
    },
    (reason) => {
      res.status(400).send(reason);
    }
  );
};

exports.prices = async (req, res) => {
  if (
    !Array.isArray(req.body) ||
    req.body == undefined ||
    req.body.length < 1
  ) {
    res.status(400).send("body must be an array of tickers");
    return;
  }
  await getPrices(req.body).then(
    (value) => {
      res.status(200).json(value);
    },
    (reason) => {
      res.status(400).send(reason);
    }
  );
};
