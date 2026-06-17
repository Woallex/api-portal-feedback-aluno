import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const createPublication = async (req: Request, res: Response) => {
  try {
    const { title, description, category } = req.body;
    
    const authorId = (req as any).userId; 
    const file = req.file as any;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Título, corpo e categoria são obrigatórios." });
    }

    const newPublication = await prisma.publication.create({
      data: {
        title,
        description,
        mediaUrl: file ? file.path : null,
        mediaType: file ? file.mimetype.split("/")[0] : null,
        category,
        authorId: authorId,
        date: new Date().toLocaleDateString("pt-BR"),
      },
    });

    if ((req as any).io) {
        console.log("Emitindo nova publicação para a rede via Socket!");
        (req as any).io.emit("new_publication", newPublication);
    } else {
        console.log("ERRO GRAVE: req.io não foi encontrado nesta requisição!");
    }

    return res.status(201).json({ data: newPublication });
  } catch (error) {
    console.error("ERRO AO CRIAR PUBLICAÇÃO:", error); 
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
        description: description || undefined,
        category: category || undefined,
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

export const exportToCSV = async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.publication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { login: true } },
      },
    });

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: "Nenhum dado encontrado pra exportar." });
    }

    const csvHeaders = ["ID", "Titulo", "Descrição", "Autor", "Data de Criação"].join(";");

    const csvRows = feedback.map((item) => {
      const title = item.title.replace(/[\n\r;]/g," ");
      const description = item.description.replace(/[\n\r;]/g," ");
      const author = item.author?.login || "Anónimo";
      const date = new Date(item.createdAt).toLocaleDateString("pt-BR");

      return `${item.id};${title};${description};${author};${date}`;
    })

    const csvContent = [csvHeaders, ...csvRows].join("\n");

    res.setHeader("Content-type", "text/csv; charset=utf-8");
    res.setHeader("Content-Despositon", "attachment; filename=feedback_portal.csv");

    return res.status(200).send("\uFFEF" + csvContent);

  } catch (error) {
    // console.log("Erro ao exportar CSV:", error)
    return res.status(500).json({ mesage: "Erro interno ao gerar o csv" })
  }
};
