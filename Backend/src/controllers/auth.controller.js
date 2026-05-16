import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ======================
// Helper Function
// ======================

const generateTokens = async (user) => {
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Use updateOne to avoid triggering pre-save hooks (like password hashing) 
        // and validation during token updates.
        await User.updateOne(
            { _id: user._id },
            { $set: { refreshToken } }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("TOKEN GENERATION ERROR:", error);
        throw new Error("Failed to generate authentication tokens");
    }
};

// ======================
// Register
// ======================

export const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        const { accessToken, refreshToken } =
            await generateTokens(user);

        const safeUser = { ...user.toObject() };
        delete safeUser.password;
        delete safeUser.refreshToken;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(201).json({
            message: "Registration successful",
            user: safeUser,
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: error.message || "Registration failed",
        });
    }
};

// ======================
// Login
// ======================

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email })
            .select("+password");

        if (!user) {
            console.log("LOGIN FAILED: User not found for email:", email);
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await user.isPasswordCorrect(password);
        console.log("LOGIN ATTEMPT:", email, "Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        const { accessToken, refreshToken } =
            await generateTokens(user);

        const safeUser = { ...user.toObject() };
        delete safeUser.password;
        delete safeUser.refreshToken;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Login successful",
            user: safeUser,
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            message: error.message || "Login failed",
        });
    }
};

// ======================
// Get Profile
// ======================

export const getProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findById(userId)
            .select("-password -refreshToken");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user,
        });

    } catch (error) {

        console.error("PROFILE ERROR:", error);

        return res.status(500).json({
            message: error.message || "Failed to fetch profile",
        });
    }
};

// ======================
// Refresh Token
// ======================

export const refreshAccessToken = async (req, res) => {
    try {

        const incomingRefreshToken =
            req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                message: "Refresh token required",
            });
        }

        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const { accessToken, refreshToken } =
            await generateTokens(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Token refreshed successfully",
        });

    } catch (error) {

        console.error("REFRESH TOKEN ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
};

// ======================
// Logout
// ======================

export const logout = async (req, res) => {
    try {

        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, {
            refreshToken: null,
        });

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });

    } catch (error) {

        console.error("LOGOUT ERROR:", error);

        return res.status(500).json({
            message: error.message || "Logout failed",
        });
    }
};

// ======================
// Update Profile
// ======================

export const updateProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const {
            username,
            displayName,
            graduationYear,
            location,
            college,
            degree,
            branch,
            profileDetails,
            platforms,
            visibility,
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                displayName,
                graduationYear,
                location,
                college,
                degree,
                branch,
                profileDetails,
                platforms,
                visibility,
            },
            {
                new: true,
            }
        ).select("-password -refreshToken");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {

        console.error("UPDATE PROFILE ERROR:", error);

        return res.status(500).json({
            message: error.message || "Profile update failed",
        });
    }
};