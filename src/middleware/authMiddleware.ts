import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      error: { code: 401, message: "Token não fornecido." },
    });
  }

  const parts = authHeader.split(" ");
  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      ok: false,
      error: { code: 401, message: "Token malformatado." },
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    if (err)
      return res.status(401).json({
        ok: false,
        error: { code: 401, message: "Token inválido ou expirado." },
      });

    req.userId = decoded.id;
    req.userLogin = decoded.login;
    return next();
  });
};
