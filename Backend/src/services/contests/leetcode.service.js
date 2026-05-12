import axios from 'axios';

export const fetchLeetCodeContests = async () => {
    try {
        const query = `
        {
            topTwoContests {
                title
                titleSlug
                startTime
                duration
            }
        }`;

        const response = await axios.post('https://leetcode.com/graphql', {
            query
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (response.data.errors) {
            throw new Error('LeetCode GraphQL returned errors');
        }

        const now = Math.floor(Date.now() / 1000);
        const contests = response.data.data.topTwoContests
            .filter(contest => (contest.startTime + contest.duration) > now)
            .map(contest => {
                const status = contest.startTime > now ? 'upcoming' : 'running';
                
                return {
                    id: contest.titleSlug,
                    platform: 'LeetCode',
                    name: contest.title,
                    startTime: new Date(contest.startTime * 1000).toISOString(),
                    duration: contest.duration, // usually in seconds?
                    url: `https://leetcode.com/contest/${contest.titleSlug}`,
                    status: status,
                    rated: true // Leetcode contests are rated
                };
            });

        return contests;
    } catch (error) {
        console.error('Error fetching LeetCode contests:', error.message);
        return [];
    }
};
