import express, { Express, Request, Response } from "express";
const cors = require("cors");
const app = express();
const routes = require("./routes/routes");

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
