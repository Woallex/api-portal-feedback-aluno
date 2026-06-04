import { NextFunction, Request, Response } from "express";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).userRole;

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar este recurso." });
  }

  return next();
};
