import axios from 'axios';

export const fetchAtCoderContests = async () => {
    try {
        const response = await axios.get('https://kenkoooo.com/atcoder/resources/contests.json', {
            timeout: 10000
        });

        const now = Math.floor(Date.now() / 1000);
        
        // Filter out past contests
        const validContests = response.data.filter(contest => 
            (contest.start_epoch_second + contest.duration_second) > now
        );

        const contests = validContests.map(contest => {
            const status = contest.start_epoch_second > now ? 'upcoming' : 'running';
            const isRated = contest.rate_change && contest.rate_change !== '-';

            return {
                id: contest.id,
                platform: 'AtCoder',
                name: contest.title,
                startTime: new Date(contest.start_epoch_second * 1000).toISOString(),
                duration: contest.duration_second,
                url: `https://atcoder.jp/contests/${contest.id}`,
                status: status,
                rated: !!isRated
            };
        });

        return contests;
    } catch (error) {
        console.error('Error fetching AtCoder contests:', error.message);
        return [];
    }
};
