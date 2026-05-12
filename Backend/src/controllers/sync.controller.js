import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";
import { fetchCodeforcesData } from "../services/codeforces.services.js";
import { fetchLeetCodeData } from "../services/leetcode.services.js";

export const syncCodeforces = async (req, res) => {
    try {
        const userId = req.user._id;
        const { handle } = req.body;

        if (!handle) {
            return res.status(400).json({ message: "Handle is required" });
        }

        const { stats, submissions } = await fetchCodeforcesData(handle);
        
        const bulkOps = submissions.map(p => ({
            updateOne: {
                filter: { userId, problemId: p.problemId, platform: p.platform },
                update: {
                    $set: {
                        difficulty: p.difficulty,
                        solvedAt: p.solvedAt,
                        status: "solved"
                    },
                    $setOnInsert: {
                        userId,
                        problemId: p.problemId,
                        platform: p.platform,
                    }
                },
                upsert: true
            }
        }));

        const result = await Progress.bulkWrite(bulkOps, { ordered: false });
        const created = result.upsertedCount;
        const updated = result.modifiedCount;

        // Update User Metadata
        await User.findByIdAndUpdate(userId, {
            $set: {
                "platforms.codeforces": handle,
                "syncMetadata.codeforces": stats
            }
        });

        return res.status(200).json({
            message: "Sync completed",
            created,
            updated,
            totalFetched: submissions.length,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const syncLeetCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const { stats, submissions } = await fetchLeetCodeData(username);
        const bulkOps = submissions.map(p => ({
            updateOne: {
                filter: { userId, problemId: p.problemId, platform: p.platform },
                update: {
                    $set: {
                        difficulty: p.difficulty,
                        solvedAt: p.solvedAt,
                        status: "solved"
                    },
                    $setOnInsert: {
                        userId,
                        problemId: p.problemId,
                        platform: p.platform,
                    }
                },
                upsert: true
            }
        }));

        const result = await Progress.bulkWrite(bulkOps, { ordered: false });
        const created = result.upsertedCount;
        const updated = result.modifiedCount;

        // Update User Metadata
        await User.findByIdAndUpdate(userId, {
            $set: {
                "platforms.leetcode": username,
                "syncMetadata.leetcode": stats
            }
        });

        return res.status(200).json({
            message: "Sync completed",
            created,
            updated,
            totalFetched: submissions.length,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};