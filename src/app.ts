import cors from "cors";
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import publicationRoutes from "./routes/publicationRoutes";

const app: Application = express();

app.use(
  cors({
    origin: "https://portal-feedback-aluno.vercel.app",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/publications", publicationRoutes);

export default app;
