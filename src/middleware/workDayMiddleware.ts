import { Request, Response, NextFunction } from "express";

export const checkWorkingDays = (req: Request, res: Response, next: NextFunction ) => {
    const today = new Date();
    const dayOfweek = today.getDay();

    if (dayOfweek === 5) {
        return res.status(403).json({ message: "Acesso permitido na sexta-feira." });
    }
    next();
}