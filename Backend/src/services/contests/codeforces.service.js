import axios from 'axios';

export const fetchCodeforcesContests = async () => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list', {
            timeout: 10000
        });

        if (response.data.status !== 'OK') {
            throw new Error('Codeforces API returned non-OK status');
        }

        const validPhases = ['BEFORE', 'CODING'];
        const contests = response.data.result
            .filter(contest => validPhases.includes(contest.phase))
            .map(contest => {
                const isRated = !contest.name.toLowerCase().includes('unrated') &&
                                (contest.name.includes('Div.') || contest.name.includes('Educational') || contest.name.includes('Global'));
                
                const status = contest.phase === 'BEFORE' ? 'upcoming' : 'running';

                return {
                    id: contest.id.toString(),
                    platform: 'Codeforces',
                    name: contest.name,
                    startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
                    duration: contest.durationSeconds,
                    url: `https://codeforces.com/contests/${contest.id}`,
                    status: status,
                    rated: isRated
                };
            });

        return contests;
    } catch (error) {
        console.error('Error fetching Codeforces contests:', error.message);
        return [];
    }
};
