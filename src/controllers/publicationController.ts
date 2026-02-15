import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Publication } from "../models/Types";

const dbPath = path.resolve(process.cwd(), 'src', 'data', 'publication.json');
const readData = (): Publication[] => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

export const createPublication = (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;

    const author = (req as any).userLogin;

    if (!title || !description || !category) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 400,
          message: "Título, corpo e categoria são obrigatórios.",
        },
      });
    }

    const publications = readData();

    const newId =
      publications.length > 0
        ? Math.max(...publications.map((p) => p.id)) + 1
        : 1;

    const newPublication: Publication = {
      id: newId,
      title,
      description,
      category,
      data: new Date().toLocaleDateString("pt-BR"),
      author,
    };

    publications.push(newPublication);

    fs.writeFileSync(dbPath, JSON.stringify(publications, null, 4));

    return res.status(201).json({
      ok: true,
      data: newPublication,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: { code: 500, message: "Erro ao salvar a publicação." },
    });
  }
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
