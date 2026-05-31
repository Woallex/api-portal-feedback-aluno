import { NextFunction, Request, Response } from "express";
import prisma from "../libs/prisma";
import e from "cors";

export const monitorRoutes = (req: Request, res: Response, next: NextFunction) => {
  next();

  const route = req.baseUrl + req.path;
  const method = req.method;

  if (method === "OPTIONS" || route.includes("/export-pdf")) {
    return;
  }

  try {
    prisma.routeLog.create({
      data: { route, method },
    });
  } catch (error) {
    console.log(`Erro ao salvar log de rota: ${error}`)
  }
};
