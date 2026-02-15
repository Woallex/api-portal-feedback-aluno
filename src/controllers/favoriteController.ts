import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Publication, User } from "../models/Types";

const usersPath = path.resolve(process.cwd(), 'src', 'data', 'users.json');
const publicationPath = path.resolve(process.cwd(), 'src', 'data', 'publication.json');

const getData = (filePath: string) => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};
const saveData = (filePath: string, data: any) => {
  return fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
};

export const addFavorite = (req: Request, res: Response) => {
  try {
    const { publicationId } = req.params;
    const userId = (req as any).userId;

    const users: User[] = getData(usersPath);
    const posts: Publication[] = getData(publicationPath);

    const postExists = posts.find((p) => p.id === Number(publicationId));
    if (!postExists) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 404,
          message: "Publicação não encontrada",
        },
      });
    }

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 404,
          message: "Usuário não encontrado",
        },
      });
    }

    if (users[userIndex]?.favorites.includes(Number(publicationId))) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 400,
          message: "Publicação já favoritada",
        },
      });
    }

    users[userIndex]?.favorites.push(Number(publicationId));
    saveData(usersPath, users);

    return res.status(200).json({
      ok: true,
      data: null,
      error: null,
      message: "Publicação adicionada aos favoritos com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: {
        code: 500,
        message: "Erro interno do servidor",
      },
    });
  }
};

export const removeFavotire = (req: Request, res: Response) => {
  try {
    const { publicationId } = req.params;
    const userId = (req as any).userId;

    const users: User[] = getData(usersPath);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 404,
          message: "Usuário não encontrado",
        },
      });
    }

    if (users[userIndex]) {
      users[userIndex].favorites = users[userIndex].favorites.filter(
        (id) => id !== Number(publicationId),
      );
    }
    saveData(usersPath, users);

    return res.status(200).json({
      ok: true,
      data: null,
      error: null,
      message: "Publicação removida dos favoritos com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: {
        code: 500,
        message: "Erro interno do servidor",
      },
    });
  }
};

export const listFavorites = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const users: User[] = getData(usersPath);
    const posts: Publication[] = getData(publicationPath);

    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        error: {
          code: 404,
          message: "Usuário não encontrado",
        },
      });
    }

    const myFavorites = posts.filter(p => user.favorites.includes(p.id));
    return res.status(200).json({
      ok: true,
      data: myFavorites,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: {
        code: 500,
        message: "Erro interno do servidor",
      },
    });
  }
}