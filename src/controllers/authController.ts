import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";

const SECRET_KEY = process.env.SECRET_KEY || "secret_key";

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({where: { login }});

    if (!user || user.password !== password) {
      return res.status(401).json({ ok: false, message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      ok: true,
      message: "Login realizado com sucesso",
      data: { token, login: user.login, id: user.id },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: "Erro interno no servidor." });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { login } });

    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const newUser = await prisma.user.create({
      data: {
        login,
        password,
        favorites: [],
      },
    });
    return res.status(201).json({
      message: "Usuário registrado.",
      data: { id: newUser.id, login: newUser.login },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};
