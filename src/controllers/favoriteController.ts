import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { publicationId } = req.params as { publicationId: string };
    const userId = (req as any).userId;

    const postExists = await prisma.publication.findUnique({
      where: {
        id: publicationId,
      },
    });
    if (!postExists) {
      return res.status(404).json({ message: "Publicação não encontrada" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favorites: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (user.favorites.includes(publicationId)) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { favorites: { set: user.favorites.filter((id: string) => id !== publicationId) } },
    });
    return res.status(200).json({ 
        message: "Publicação removida dos favoritos", 
        data: updatedUser.favorites 
    });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            push: publicationId,
          },
        },
      });
      return res.status(200).json({ message: "Publicação adicionada aos favoritos" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const listFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const myFavorites = await prisma.publication.findMany({
      where: {
        id: { in: user?.favorites || [] },
      },
    });

    return res.status(200).json({ message: "Favoritos listados com sucesso", data: myFavorites });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
