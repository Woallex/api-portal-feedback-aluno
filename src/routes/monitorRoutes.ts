import { Router } from "express";
import { generateMonitoringPDF } from "../controllers/metricsController";

const router = Router();

router.get("/metrics/export-pdf", generateMonitoringPDF);

export default router;