import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/dashboard", authMiddleware, adminController.getDashboard);
router.get("/publications", authMiddleware, adminController.getAdminPublications);
router.get("/users", authMiddleware, adminController.getUsers);

export default router;
