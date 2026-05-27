import { Request, Response } from "express";
import prisma from "../libs/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [totalPublications, totalUsers] = await Promise.all([
      prisma.publication.count(),
      prisma.user.count(),
    ]);

    return res.status(200).json({
      data: {
        totalPublications,
        totalUsers,
      },
      message: "Dashboard carregado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard admin:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const getAdminPublications = async (req: Request, res: Response) => {
  try {
    const publications = await prisma.publication.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        author: true,
        date: true,
      },
    });

    return res.status(200).json({
      data: publications,
      message: "Publicações carregadas com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao listar publicações do admin:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        favorites: true,
      },
    });

    return res.status(200).json({
      data: users.map((user) => ({
        id: user.id,
        login: user.login,
        favorites: user.favorites,
        favoritesCount: user.favorites.length,
      })),
      message: "Usuários carregados com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao listar usuários do admin:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
