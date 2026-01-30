import express from 'express';
import cors from 'cors';
import type { Application, Request, Response } from 'express';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("API rodando!");
});

export default app;
