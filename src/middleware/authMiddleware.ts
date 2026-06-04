import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret_key";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido ou malformatado." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  jwt.verify(token!, SECRET_KEY, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    (req as any).userId = decoded.id;
    (req as any).userLogin = decoded.login;
    (req as any).userRole = decoded.role || "user";

    return next();
  });
};