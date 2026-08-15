import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";
import { fetchCodeforcesData } from "../services/codeforces.services.js";
import { fetchLeetCodeData } from "../services/leetcode.services.js";
import { fetchCodechefData } from "../services/codechef.services.js";
import { getCache, setCache, acquireLock, releaseLock } from "../services/redis.services.js";

export const syncCodeforces = async (req, res) => {
    try {
        const userId = req.user._id;
        const { handle } = req.body;

        if (!handle) {
            return res.status(400).json({ message: "Handle is required" });
        }

        const lockKey = `${userId}:codeforces`;
        const lockAcquired = await acquireLock(lockKey);
        if (!lockAcquired) {
            return res.status(429).json({ message: "Sync already in progress" });
        }

        try {
            const cacheKey = `sync:codeforces:${handle}`;
            let stats, submissions;
            const cached = await getCache(cacheKey);
            
            if (cached) {
                stats = cached.stats;
                submissions = cached.submissions;
            } else {
                const fetched = await fetchCodeforcesData(handle);
                stats = fetched.stats;
                submissions = fetched.submissions;
                await setCache(cacheKey, { stats, submissions }, 600); // 10 minutes cache
            }
        
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

        const responseData = {
            message: "Sync completed",
            created,
            updated,
            totalFetched: submissions.length,
        };

        await releaseLock(lockKey);

        return res.status(200).json(responseData);
        } catch (error) {
            await releaseLock(`${userId}:codeforces`);
            throw error;
        }
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

        const lockKey = `${userId}:leetcode`;
        const lockAcquired = await acquireLock(lockKey);
        if (!lockAcquired) {
            return res.status(429).json({ message: "Sync already in progress" });
        }

        try {
            const cacheKey = `sync:leetcode:${username}`;
            let stats, submissions;
            const cached = await getCache(cacheKey);

            if (cached) {
                stats = cached.stats;
                submissions = cached.submissions;
            } else {
                const fetched = await fetchLeetCodeData(username);
                stats = fetched.stats;
                submissions = fetched.submissions;
                await setCache(cacheKey, { stats, submissions }, 600);
            }
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

        const responseData = {
            message: "Sync completed",
            created,
            updated,
            totalFetched: submissions.length,
        };

        await releaseLock(lockKey);

        return res.status(200).json(responseData);
        } catch (error) {
            await releaseLock(`${userId}:leetcode`);
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const syncCodechef = async (req, res) => {
    try {
        const userId = req.user._id;
        const { handle } = req.body;

        if (!handle) {
            return res.status(400).json({ message: "Handle is required" });
        }

        const lockKey = `${userId}:codechef`;
        const lockAcquired = await acquireLock(lockKey);
        if (!lockAcquired) {
            return res.status(429).json({ message: "Sync already in progress" });
        }

        try {
            const cacheKey = `sync:codechef:${handle}`;
            let stats, submissions;
            const cached = await getCache(cacheKey);

            if (cached) {
                stats = cached.stats;
                submissions = cached.submissions;
            } else {
                const fetched = await fetchCodechefData(handle);
                stats = fetched.stats;
                submissions = fetched.submissions;
                await setCache(cacheKey, { stats, submissions }, 600);
            }
        
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
                "platforms.codechef": handle,
                "syncMetadata.codechef": stats
            }
        });

        const responseData = {
            message: "Sync completed",
            created,
            updated,
            totalFetched: submissions.length,
        };

        await releaseLock(lockKey);

        return res.status(200).json(responseData);
        } catch (error) {
            await releaseLock(`${userId}:codechef`);
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};