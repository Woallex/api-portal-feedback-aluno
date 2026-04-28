import { Router } from "express";
import { login, register } from "../controllers/authController";
import { verify2FA } from "../controllers/verify2FA"

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify2FA", verify2FA)

export default router;