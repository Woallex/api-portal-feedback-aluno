import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

router.get("/dashboard", authMiddleware, adminMiddleware, adminController.getDashboard);
router.get("/publications", authMiddleware, adminMiddleware, adminController.getAdminPublications);
router.get("/users", authMiddleware, adminMiddleware, adminController.getUsers);

export default router;
