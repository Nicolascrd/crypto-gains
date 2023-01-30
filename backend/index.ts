import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
