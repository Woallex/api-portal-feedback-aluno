import { NextFunction, Request, Response } from "express";
import prisma from "../libs/prisma";

export const monitorRoutes = async (req: Request, res: Response, next: NextFunction) => {
  const route = req.baseUrl + req.path;
  const method = req.method;

  if (method === "OPTIONS" || route.includes("/export-pdf")) {
    return next();
  }

  try {
    await prisma.routeLog.create({
      data: { route, method },
    });
  } catch (error) {
    console.error(`Erro ao salvar log de rota:`, error);
  }

  next();
};