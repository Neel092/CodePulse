import axios from "axios";

const mapDifficulty = (rating) => {
    if (!rating) return "easy";
    if (rating < 1000) return "easy";
    if (rating < 1600) return "medium";
    return "hard";
};

export const fetchCodeforcesData = async (handle) => {
    try {
        const [statusRes, ratingRes, infoRes] = await Promise.all([
            axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`, { timeout: 20000 }),
            axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`, { timeout: 10000 }),
            axios.get(`https://codeforces.com/api/user.info?handles=${handle}`, { timeout: 10000 })
        ]);

        if (statusRes.data.status !== "OK" || infoRes.data.status !== "OK") {
            throw new Error("Failed to fetch Codeforces data");
        }

        const info = infoRes.data.result[0];
        const ratingHistory = ratingRes.data.status === "OK" ? ratingRes.data.result : [];
        const submissions = statusRes.data.result;

        // Filter ACs and deduplicate
        const uniqueProblems = new Map();

        submissions.forEach(sub => {
            if (sub.verdict === "OK") {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                // Keep the earliest AC submission if multiple exist
                if (!uniqueProblems.has(problemId) || uniqueProblems.get(problemId).creationTimeSeconds > sub.creationTimeSeconds) {
                    uniqueProblems.set(problemId, sub);
                }
            }
        });

        // Build submission calendar
        const calendarMap = new Map();
        uniqueProblems.forEach(sub => {
            const dateStr = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
            const ts = Math.floor(new Date(dateStr).getTime() / 1000);
            // Unix timestamp at midnight
            calendarMap.set(ts, (calendarMap.get(ts) || 0) + 1);
        });

        const submissionCalendar = JSON.stringify(Object.fromEntries(calendarMap));

        const normalizedSubmissions = Array.from(uniqueProblems.values()).map(sub => ({
            problemId: `${sub.problem.contestId}-${sub.problem.index}`,
            platform: "codeforces",
            difficulty: mapDifficulty(sub.problem.rating),
            solvedAt: new Date(sub.creationTimeSeconds * 1000),
        }));

        return {
            stats: {
                rating: info.rating || 0,
                maxRating: info.maxRating || 0,
                rank: info.rank || "Unrated",
                maxRank: info.maxRank || "Unrated",
                ratingHistory,
                submissionCalendar
            },
            submissions: normalizedSubmissions
        };

    } catch (error) {
        console.error('Error fetching Codeforces data:', error.message);
        throw error;
    }
};