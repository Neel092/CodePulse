import axios from "axios";


const CODECHEF_API = "https://api-production-9299.up.railway.app";

const mapDifficulty = (stars) => {
    if (!stars) return "easy";
    const count = parseInt(stars);
    if (count <= 2) return "easy";
    if (count <= 4) return "medium";
    return "hard";
};

export const fetchCodechefData = async (username) => {
    try {
        const { data: res } = await axios.get(
            `${CODECHEF_API}/api/user/${username}`,
            { timeout: 20000 }
        );

        if (!res.success) {
            throw new Error("Failed to fetch CodeChef data");
        }

        const info = res.data;

        const ratingHistory = Array.isArray(info.ratingHistory) ? info.ratingHistory.map(entry => ({
            contestName: entry.contestName || entry.name,
            newRating: entry.rating,
            rank: entry.rank,
            ratingUpdateTimeSeconds: Math.floor(new Date(entry.date || entry.end_date).getTime() / 1000)
        })) : [];

        const normalizedSubmissions = Array.isArray(info.solvedProblems) ? info.solvedProblems.map(problemCode => ({
            problemId: typeof problemCode === 'string' ? problemCode : problemCode?.name || "unknown",
            platform: "codechef",
            difficulty: mapDifficulty(info.stars),
            solvedAt: new Date()
        })) : [];

        const totalSolved = info.totalSolved || 0;
        return {
            stats: {
                rating: info.currentRating,
                maxRating: info.highestRating,
                rank: info.rank,
                maxRank: info.rank,
                stars: info.stars,
                totalSolved,
                ratingHistory,
                submissionCalendar: info.submissionCalendar
            },
            submissions: normalizedSubmissions
        };

    } catch (error) {
        console.error('Error fetching CodeChef data:', error.message);
        throw error;
    }
};