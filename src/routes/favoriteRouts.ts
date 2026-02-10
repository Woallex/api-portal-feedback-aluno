import { Router } from "express";
import * as favoriteController from "../controllers/favoriteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, favoriteController.listFavorites);
router.post("/:publicationId", authMiddleware, favoriteController.addFavorite);
router.delete("/:publicationId", authMiddleware, favoriteController.removeFavotire);

export default router;