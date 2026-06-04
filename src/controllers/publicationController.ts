import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const createPublication = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;
    const author = (req as any).userLogin;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Título, corpo e categoria são obrigatórios." });
    }

    const newPublication = await prisma.publication.create({
      data: {
        title,
        description,
        category,
        author: author,
        date: new Date().toLocaleDateString("pt-BR"),
      },
    });

    return res.status(201).json({ data: newPublication });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao salvar a publicação." });
  }
};

export const getPublications = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const publications = await prisma.publication.findMany({
      where: category
        ? {
            category: {
              equals: category as string,
              mode: "insensitive",
            },
          }
        : {},
    });

    return res.status(200).json({ data: publications });
  } catch (error) {
    console.error("Erro ao ler publicações:", error);
    return res
      .status(500)
      .json({ message: "Erro interno do servidor ao ler publicações." });
  }
};

export const deletePublication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const publicationExists = await prisma.publication.findUnique({
      where: { id },
    });

    if (!publicationExists) {
      return res.status(404).json({ message: "Publicação não encontrada." });
    }

    await prisma.publication.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: "Publicação deletada com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar a publicação." });
  }
};

export const editPublication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title, description, category } = req.body;

    const publicationExists = await prisma.publication.findUnique({
      where: { id },
    });

    if (!publicationExists) {
      return res.status(404).json({ message: "Publicação não encontrada." });
    }

    const updatedPublication = await prisma.publication.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description  || undefined,
        category: category || undefined
      },
    });

    return res.status(200).json({
      message: "Publicação atualizada com sucesso.",
      data: updatedPublication,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar a publicação." });
  }
};
