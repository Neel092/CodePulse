import express from "express";
import { register, login, getProfile, refreshAccessToken, logout, updateProfile } from "../controllers/auth.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import { getCSRFToken } from "../controllers/csrf.controller.js";
import { verifyCSRF } from "../middleware/csrf.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/protected", verifyJWT, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user,
    });
});

router.get("/profile", verifyJWT, getProfile);
router.put("/update-profile", verifyJWT, updateProfile);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", verifyCSRF, verifyJWT, logout);

router.get(
    "/admin-only",
    verifyJWT,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({ message: "welcome admin" });
    }

);

router.get("/csrf-token", getCSRFToken)

export default router;