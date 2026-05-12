import { getAggregatedContests } from "../services/contests/contestAggregator.service.js";

let cache = {
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getUpcomingContests = async (req, res) => {
    try {
        if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
            return res.json({
                success: true,
                cached: true,
                data: cache.data
            });
        }

        const upcoming = await getAggregatedContests();

        cache.data = upcoming;
        cache.timestamp = Date.now();

        res.json({
            success: true,
            cached: false,
            data: upcoming
        });
    } catch (error) {
        console.error("Error fetching contests:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch contests", 
            error: error.message 
        });
    }
};
