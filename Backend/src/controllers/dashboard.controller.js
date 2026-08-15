import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";

export const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const [solved, user] = await Promise.all([
            Progress.find(
                { userId, status: "solved" },
                { difficulty: 1, platform: 1, solvedAt: 1 }
            ).lean(),
            User.findById(userId).lean()
        ]);

        const totalSolved = solved.length;

        const difficulty = { easy: 0, medium: 0, hard: 0 };
        const lcDifficulty = { easy: 0, medium: 0, hard: 0 };
        const cfDifficulty = { easy: 0, medium: 0, hard: 0 };
        const platforms = {};
        const heatmapMap = new Map(); // key: YYYY-MM-DD, value: count

        const addToHeatmap = (dateStr, count = 1) => {
            if (!dateStr || dateStr === 'NaN-NaN-NaN') return;
            heatmapMap.set(dateStr, (heatmapMap.get(dateStr) || 0) + count);
        };

        solved.forEach(p => {
            const diffLower = typeof p.difficulty === 'string' ? p.difficulty.toLowerCase() : p.difficulty;
            
            // Platform specific difficulty
            if (p.platform === 'codeforces' || p.platform === 'CodeForces') {
                const rating = parseInt(p.difficulty);
                if (!isNaN(rating)) {
                    if (rating < 1000) cfDifficulty.easy++;
                    else if (rating <= 1500) cfDifficulty.medium++;
                    else cfDifficulty.hard++;
                } else if (cfDifficulty[diffLower] !== undefined) {
                    cfDifficulty[diffLower]++;
                }
            } else if (p.platform === 'leetcode' || p.platform === 'LeetCode') {
                if (lcDifficulty[diffLower] !== undefined) {
                    lcDifficulty[diffLower]++;
                }
            }

            // Overall difficulty
            if (difficulty[diffLower] !== undefined) {
                difficulty[diffLower]++;
            } else if (p.platform === 'codeforces' || p.platform === 'CodeForces') {
                const rating = parseInt(p.difficulty);
                if (!isNaN(rating)) {
                    if (rating < 1000) difficulty.easy++;
                    else if (rating <= 1500) difficulty.medium++;
                    else difficulty.hard++;
                }
            }

            // platform count
            const plat = p.platform ? p.platform.toLowerCase() : 'unknown';
            platforms[plat] = (platforms[plat] || 0) + 1;

            // manual progress
            if (p.solvedAt) {
                const date = new Date(p.solvedAt).toISOString().split("T")[0];
                addToHeatmap(date, 1);
            }
        });

        // Merge Platform Heatmaps from metadata
        const mergeExternalHeatmap = (calendarStr) => {
            if (!calendarStr) return;
            try {
                const cal = JSON.parse(calendarStr);
                Object.entries(cal).forEach(([timestamp, count]) => {
                    const date = new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0];
                    addToHeatmap(date, count);
                });
            } catch (e) {
                console.error("Failed to parse platform heatmap:", e);
            }
        };

        mergeExternalHeatmap(user?.syncMetadata?.leetcode?.submissionCalendar);
        mergeExternalHeatmap(user?.syncMetadata?.codeforces?.submissionCalendar);

        const heatmap = Object.fromEntries(heatmapMap);
        
        // Compute streak from unified heatmap (Safe O(1) continuous loop)
        let streak = 0;
        const todayDate = new Date().toISOString().split("T")[0];
        let d = new Date(todayDate);
        let ds = todayDate;

        if (heatmapMap.has(ds)) {
            streak++;
        } else {
            d.setDate(d.getDate() - 1);
            ds = d.toISOString().split("T")[0];
            if (heatmapMap.has(ds)) {
                streak++;
            }
        }

        if (streak > 0) {
            d.setDate(d.getDate() - 1);
            ds = d.toISOString().split("T")[0];
            // Loop safely back in time until gap
            while (heatmapMap.has(ds)) {
                streak++;
                d.setDate(d.getDate() - 1);
                ds = d.toISOString().split("T")[0];
            }
        }

        // Prioritize official stats for platform-specific charts if they exist
        const finalLcDifficulty = user?.syncMetadata?.leetcode ? {
            easy: user.syncMetadata.leetcode.easySolved || 0,
            medium: user.syncMetadata.leetcode.mediumSolved || 0,
            hard: user.syncMetadata.leetcode.hardSolved || 0
        } : lcDifficulty;

        const finalCfDifficulty = user?.syncMetadata?.codeforces ? {
            easy: user.syncMetadata.codeforces.easySolved || 0,
            medium: user.syncMetadata.codeforces.mediumSolved || 0,
            hard: user.syncMetadata.codeforces.hardSolved || 0
        } : cfDifficulty;

        // Override platform totals with official stats if available
        if (user?.syncMetadata?.leetcode?.totalSolved !== undefined) {
            platforms['leetcode'] = user.syncMetadata.leetcode.totalSolved;
        }
        if (user?.syncMetadata?.codeforces?.totalSolved !== undefined) {
            platforms['codeforces'] = user.syncMetadata.codeforces.totalSolved;
        }
        if (user?.syncMetadata?.codechef?.totalSolved !== undefined) {
            platforms['codechef'] = user.syncMetadata.codechef.totalSolved;
        }

        const finalTotalSolved = Object.values(platforms).reduce((a, b) => a + b, 0);

        return res.status(200).json({
            totalSolved: finalTotalSolved,
            difficulty,
            lcDifficulty: finalLcDifficulty,
            cfDifficulty: finalCfDifficulty,
            platforms,
            streak,
            heatmap,
            ratingHistory: user?.syncMetadata?.codeforces?.ratingHistory || [],
            lcData: user?.syncMetadata?.leetcode || {},
            cfData: user?.syncMetadata?.codeforces || {},
            ccData: user?.syncMetadata?.codechef || {},
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};