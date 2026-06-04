import cors from "cors";
import express, { Application } from "express";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import publicationRoutes from "./routes/publicationRoutes";
import favoriteRoutes from "./routes/favoriteRouts";
import { requestLogger } from "./middleware/logMiddleware";

const app: Application = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [];

const isLocalDevOrigin = (origin?: string) => {
  if (!origin) return false;
  return /^(https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?)$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pela política de CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/publications", publicationRoutes);
app.use("/favorites", favoriteRoutes);

export default app;
