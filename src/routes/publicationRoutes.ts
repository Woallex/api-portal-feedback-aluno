import { Router } from "express";
import * as publicationController from "../controllers/publicationController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkWorkingDays } from "../middleware/workDayMiddleware";

const router = Router();

router.use(checkWorkingDays);

router.get("/", publicationController.getPublications);
router.get("/export", publicationController.exportToCSV);
router.post("/", authMiddleware, publicationController.createPublication);
router.put("/:id", authMiddleware, publicationController.editPublication);
router.delete("/:id", authMiddleware, publicationController.deletePublication);

export default router;