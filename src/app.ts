import cors from "cors";
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import publicationRoutes from "./routes/publicationRoutes";
import favoriteRoutes from "./routes/favoriteRouts";
import { requestLogger } from "./middleware/logMiddleware";
import { monitorRoutes } from "./middleware/monitorMiddleware";

const app: Application = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Não permitido pela política de CORS"))
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(requestLogger);

app.use(monitorRoutes)
app.use("/auth", authRoutes);
app.use("/publications", publicationRoutes);
app.use("/favorites", favoriteRoutes);

export default app;
