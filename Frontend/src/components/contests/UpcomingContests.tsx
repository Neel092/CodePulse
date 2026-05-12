import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { ContestCard } from './ContestCard';

interface Contest {
    id: string;
    platform: string;
    name: string;
    startTime: string;
    duration: number;
    url: string;
    status: "upcoming" | "running";
    rated: boolean;
}

export const UpcomingContests = () => {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('/api/contests/upcoming');
                if (response.data.success) {
                    setContests(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch contests", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
        const interval = setInterval(fetchContests, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const platforms = ['All', 'Codeforces', 'LeetCode', 'CodeChef', 'AtCoder'];
    
    const filteredContests = contests.filter(c => filter === 'All' || c.platform === filter);

    if (loading) {
        return <div className="text-center py-12 text-muted-dark font-mono animate-pulse bg-surface-dark rounded-2xl border border-border-dark">Loading upcoming contests...</div>;
    }

    return (
        <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between border-b border-border-dark pb-4">
                <h3 className="font-bold text-lg text-foreground-dark">Upcoming & Live Contests</h3>
                <div className="flex space-x-2 overflow-x-auto">
                    {platforms.map(p => (
                        <button 
                            key={p} 
                            onClick={() => setFilter(p)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors whitespace-nowrap ${
                                filter === p 
                                ? 'bg-primary-dark text-white' 
                                : 'bg-surface-dark border border-border-dark text-muted-dark hover:bg-elevated-dark hover:text-foreground-dark'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            
            {filteredContests.length === 0 ? (
                <div className="text-center py-12 text-muted-dark font-mono bg-surface-dark rounded-2xl border border-border-dark">
                    No upcoming contests found for {filter}.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredContests.map((contest, i) => (
                        <ContestCard key={`${contest.platform}-${contest.id}-${i}`} contest={contest} />
                    ))}
                </div>
            )}
        </div>
    );
};
