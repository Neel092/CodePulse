import axios from 'axios';

export const fetchCodeChefContests = async () => {
    try {
        const response = await axios.get('https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all', {
            timeout: 10000
        });

        const { present_contests = [], future_contests = [] } = response.data;

        const processContest = (contest, status) => {
            const isRated = contest.contest_name.includes('Rated') || contest.contest_name.includes('Starters');
            return {
                id: contest.contest_code,
                platform: 'CodeChef',
                name: contest.contest_name,
                startTime: new Date(contest.contest_start_date_iso).toISOString(),
                duration: parseInt(contest.contest_duration) * 60, // Assuming duration in mins from API? Codechef returns mins. Let's multiply by 60 for seconds.
                url: `https://www.codechef.com/${contest.contest_code}`,
                status: status,
                rated: isRated
            };
        };

        const current = present_contests.map(c => processContest(c, 'running'));
        const upcoming = future_contests.map(c => processContest(c, 'upcoming'));

        return [...current, ...upcoming];
    } catch (error) {
        console.error('Error fetching CodeChef contests:', error.message);
        return [];
    }
};
