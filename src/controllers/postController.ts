import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import type { Publication } from "../models/Types.ts";

const databasePath = path.join(__dirname, "../", "data", "publication.json");

export const getAllPosts = (req: Request, res: Response) => {
  try {
    const data = fs.readFileSync(databasePath, "utf-8");

    const posts: Publication[] = JSON.parse(data);

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Erro ao ler o arquivo de publicações:", error);
    return res.status(500).json({
      message: "Erro interno do servidor ao ler publicações.",
    });
  }
};
