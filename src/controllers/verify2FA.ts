import { Request, Response } from "express";
import prisma from "../libs/prisma";
import  jwt  from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret_key";

export const verify2FA = async (req: Request, res: Response) => {
  const { login, code } = req.body;
  const user = await prisma.user.findUnique({
    where: { login },
    select: {
      id: true,
      login: true,
      role: true,
      twoFactorCode: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  if (user.twoFactorCode === code) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        last2FADate: new Date().toLocaleDateString("pt-BR"),
        twoFactorCode: null,
      },
    });
    const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({ token, message: "Acesso liberado!" })
  }
  return res.status(401).json({ message: "Código inválido." })
};
