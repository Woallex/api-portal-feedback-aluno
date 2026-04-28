import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../libs/prisma";
import { sendEmail } from "../libs/mail";

const SECRET_KEY = process.env.SECRET_KEY || "secret_key";

export const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({ where: { login } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, {
      expiresIn: "24h",
    });

    if (user.last2FADate === new Date().toLocaleDateString("pt-BR")) {
      return res.status(200).json({ message: "Login realizado", token });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorCode: code }
    });

    sendEmail(user.login, code).catch(err => console.log("Erro ao enviar e-mail: ", err));

    return res.status(200).json({ message: "Código de verificação envidado ao e-mail."});
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!login || !emailRegex.test(login)) {
      return res.status(400).json({ message: "E-mail institucional inválido." });
    }

    const userExists = await prisma.user.findUnique({ where: { login } });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        favorites: [],
      },
    });
    return res.status(201).json({ message: "Usuário registrado. Valide seu e-mail no primeiro login." });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};
