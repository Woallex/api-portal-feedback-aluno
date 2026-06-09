import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { initBackupSchedule } from "./services/backupService";

dotenv.config();

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
    console.log(` Novo aluno conectado ao Socket! ID: ${socket.id}`);
});

app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`Servidor e Socket.io rodando na porta ${PORT}`);
  initBackupSchedule();
});

export { io };