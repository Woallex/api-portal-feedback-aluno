import dontenv from "dotenv";
import app from "./app.ts";

dontenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor roadando na porta ${PORT}`);
});
