import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import postRouts from "./routes/postRoutes.ts";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/posts", postRouts);

app.get("/", (req: Request, res: Response) => {
  res.send("API rodando!");
});

export default app;
