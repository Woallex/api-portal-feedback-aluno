import { Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { ApiResponse, User } from "../models/Types";

const usersPath = path.resolve(process.cwd(), 'src', 'data', 'users.json');
const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

export const login = (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const users: User[] = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    const user = users.find(
      (u) => u.login === login && u.password === password,
    );

    if (!user) {
      const errorResponse: ApiResponse = {
        ok: false,
        message: "Login ou senha incorretos.",
        data: null,
        error: { code: 401, message: "Login ou senha incorretos." },
      };
      return res.status(401).json(errorResponse);
    }

    const token = jwt.sign({ id: user.id, login: user.login }, SECRET_KEY, {
      expiresIn: "24h",
    });

    const successResponse: ApiResponse = {
      ok: true,
      message: "Login realizado com sucesso.",
      data: {
        id: user.id,
        login: user.login,
        token: token,
      },
      error: null,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return res.status(500).json({
      ok: false,
      message: "Erro interno no servidor.",
      error: { code: 500, message: "Erro interno no servidor." },
    });
  }
};
