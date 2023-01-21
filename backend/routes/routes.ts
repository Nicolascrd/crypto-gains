import { Router } from "express";
import { json, text } from "body-parser";
import {
  getName,
  getAllKeys,
  getBalance,
  prices,
  addKey,
  upload,
} from "../controllers/appController";

const router = Router();

const jsonParser = json();
const csvParser = text({ type: "*/csv" });

// API Routes GET
router.get("/name", getName);
router.get("/balance", getBalance);
router.get("/all_keys", getAllKeys);

// API Routes POST
router.post("/add_key", jsonParser, addKey);
router.post("/prices", jsonParser, prices);
router.post("/upload", csvParser, upload);

module.exports = router;
