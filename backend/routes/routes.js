const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const appController = require("../controllers/appController");

const jsonParser = bodyParser.json();
const csvParser = bodyParser.text({type: "*/csv"});

// API Routes GET
router.get("/name", appController.getName);
router.get("/balance", appController.getBalance);
router.get("/all_keys", appController.getAllKeys);

// API Routes POST
router.post("/add_key", jsonParser, appController.addKey);
router.post("/prices", jsonParser, appController.prices);
router.post("/upload", csvParser, appController.upload);

module.exports = router;
