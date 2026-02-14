import cors from "cors";
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import publicationRoutes from "./routes/publicationRoutes";
import favoriteRoutes from "./routes/favoriteRouts";

const app: Application = express();

app.use(
  cors({
    origin: "https://portal-feedback-aluno.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/publications", publicationRoutes);
app.use("/favorites", favoriteRoutes);

export default app;
