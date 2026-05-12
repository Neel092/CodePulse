import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { syncCodeforces, syncLeetCode } from "../controllers/sync.controller.js";

const router = express.Router();

router.post("/codeforces", verifyJWT, syncCodeforces);
router.post("/leetcode", verifyJWT, syncLeetCode);

export default router;