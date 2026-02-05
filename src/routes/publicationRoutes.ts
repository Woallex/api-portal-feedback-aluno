import { Router } from "express";
import * as publicationController from "../controllers/publicationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", publicationController.getPublications);

router.post("/", authMiddleware, publicationController.createPublication);

export default router;