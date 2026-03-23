import { Request, Response, NextFunction } from "express";

export const requestLogger = ( req: Request, res: Response, next: NextFunction
 ) => {
    const timestamp = new Date().toLocaleString("pt-BR");
    const method = req.method;
    const path = req.path;


    console.log(`[${timestamp}] ${method} ${path}`);

    next();
 };
 