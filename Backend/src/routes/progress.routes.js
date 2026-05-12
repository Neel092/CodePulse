import express from "express";
import { upsertProgress, getUserProgress } from "../controllers/progress.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.post("/", verifyJWT, upsertProgress);

router.get("/", verifyJWT, getUserProgress);

router.get("/dashboard", verifyJWT, getDashboard);

export default router;