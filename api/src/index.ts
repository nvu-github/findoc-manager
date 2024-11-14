import cors from "cors";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import routeV1 from "./routes";

dotenv.config();
const app: Express = express();
const port: number = parseInt(process.env.PORT || "5000", 10);

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/v1", routeV1);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
