import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();

process.env.TZ = "Etc/GMT"

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/", routes);

export default app