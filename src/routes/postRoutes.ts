import { Router } from "express";
import * as postController from "../controllers/postController.ts";

const router = Router();

router.get('/', postController.getAllPosts);

export default router;