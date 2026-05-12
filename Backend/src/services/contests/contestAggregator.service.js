import { fetchCodeforcesContests } from './codeforces.service.js';
import { fetchLeetCodeContests } from './leetcode.service.js';
import { fetchCodeChefContests } from './codechef.service.js';
import { fetchAtCoderContests } from './atcoder.service.js';

export const getAggregatedContests = async () => {
    const results = await Promise.allSettled([
        fetchCodeforcesContests(),
        fetchLeetCodeContests(),
        fetchCodeChefContests(),
        fetchAtCoderContests()
    ]);

    const contests = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .flatMap(result => result.value);

    // Sort by start time ascending
    contests.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    return contests;
};
