import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Publication } from "../models/Types";

const dbPath = path.join(__dirname, "..", "data", "publication.json");

const readData = (): Publication[] => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

export const getPublications = (req: Request, res: Response) => {
  try {
    let publication = readData();
    const { category } = req.query;

    if (category) {
      publication = publication.filter(
        (p) => p.category.toLowerCase() === (category as string).toLowerCase(),
      );
    }

    const response = {
      ok: true,
      data: publication,
      error: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao ler publicações:", error);
    return res.status(500).json({
      message: "Erro interno do servidor ao ler publicações.",
    });
  }
};
