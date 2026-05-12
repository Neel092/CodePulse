import axios from "axios";

const LC_HEADERS = {
  'Content-Type': 'application/json',
  'Referer': 'https://leetcode.com'
};

const fetchProblemDifficulty = async (titleSlug) => {
  const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        difficulty
      }
    }
  `;
  try {
    const res = await axios.post('https://leetcode.com/graphql',
      { query, variables: { titleSlug } },
      { headers: LC_HEADERS, timeout: 10000 }
    );
    return res.data?.data?.question?.difficulty?.toLowerCase() || "medium";
  } catch {
    return "medium"; // fallback only on error
  }
};

export const fetchLeetCodeData = async (username) => {
  try {
    const statsQuery = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
          userCalendar {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;

    const recentQuery = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;

    const [statsRes, recentRes] = await Promise.all([
      axios.post('https://leetcode.com/graphql',
        { query: statsQuery, variables: { username } },
        { headers: LC_HEADERS, timeout: 15000 }
      ),
      axios.post('https://leetcode.com/graphql',
        { query: recentQuery, variables: { username, limit: 100 } },
        { headers: LC_HEADERS, timeout: 20000 }
      )
    ]);

    const matchedUser = statsRes.data.data.matchedUser;
    if (!matchedUser) throw new Error("User not found on LeetCode");

    const submissions = recentRes.data.data.recentAcSubmissionList || [];

    // Deduplicate slugs to avoid redundant API calls
    const uniqueSlugs = [...new Set(submissions.map(s => s.titleSlug))];

    // Fetch all difficulties in parallel
    const difficultyMap = Object.fromEntries(
      await Promise.all(
        uniqueSlugs.map(async (slug) => [slug, await fetchProblemDifficulty(slug)])
      )
    );

    const normalizedSubmissions = submissions.map((sub) => ({
      problemId: sub.title,
      platform: "leetcode",
      difficulty: difficultyMap[sub.titleSlug] || "medium",
      solvedAt: new Date(Number(sub.timestamp) * 1000),
    }));

    const acStats = matchedUser.submitStatsGlobal.acSubmissionNum;
    const getCount = (diff) => acStats.find(a => a.difficulty === diff)?.count || 0;

    return {
      stats: {
        totalSolved: getCount("All"),
        easySolved: getCount("Easy"),
        mediumSolved: getCount("Medium"),
        hardSolved: getCount("Hard"),
        streak: matchedUser.userCalendar.streak,
        totalActiveDays: matchedUser.userCalendar.totalActiveDays,
        submissionCalendar: matchedUser.userCalendar.submissionCalendar
      },
      submissions: normalizedSubmissions
    };

  } catch (error) {
    console.error('Error fetching LeetCode data:', error.message);
    throw error;
  }
};