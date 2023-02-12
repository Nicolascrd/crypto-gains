import { Router } from "express";
import bodyParser from "body-parser";

const { json, text } = bodyParser;
import {
  getName,
  getAllKeys,
  balance,
  prices,
  addKey,
  upload,
} from "../controllers/appController.js";

const router = Router();

const jsonParser = json();
const csvParser = text({ type: "*/csv", limit: "5mb" });

// API Routes GET
router.get("/name", getName);
router.get("/all_keys", getAllKeys);

// API Routes POST
router.post("/add_key", jsonParser, addKey);
router.post("/balance", jsonParser, balance)
router.post("/prices", jsonParser, prices);
router.post("/upload", csvParser, upload);

export default router;
