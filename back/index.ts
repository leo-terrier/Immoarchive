import express, { Request, Response } from "express";

import dotenv from "dotenv";
import { getDeals } from "./fetchDeals";
import cors from "cors";

const app = express();

dotenv.config();

app.use(cors());

const port = process.env.PORT;

app.get("/", (res: Response) => {
  res.send("Express server");
});

app.get("/deals", getDeals);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
