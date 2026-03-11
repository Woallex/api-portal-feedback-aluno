import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const createPublication = async (req: Request, res: Response) => {
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

    const newPublication = await prisma.publication.create({
      data: {
        title,
        description,
        category,
        author,
        date: new Date().toLocaleDateString("pt-BR"),
      },
    });

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

export const getPublications = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const publications = await prisma.publication.findMany({
      where: category ? {
        category: {
          equals: category as string,
          mode: "insensitive",
        }
      } : {}
    })

    return res.status(200).json({
      ok: true,
      data: publications,
      error: null,
    });
  } catch (error) {
    console.error("Erro ao ler publicações:", error);
    return res.status(500).json({
      message: "Erro interno do servidor ao ler publicações.",
    });
  }
};
