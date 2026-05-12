import React from 'react';
import { CountdownTimer } from './CountdownTimer';
import { ExternalLink } from 'lucide-react';

import { Contest } from '@/hooks/useContests';

export const ContestCard = ({ contest }: { contest: Contest }) => {
    const isRunning = contest.status === 'running';
    
    const durationHours = Math.floor(contest.duration / 3600);
    const durationMinutes = Math.floor((contest.duration % 3600) / 60);
    const durationString = `${durationHours > 0 ? durationHours + 'h ' : ''}${durationMinutes > 0 ? durationMinutes + 'm' : ''}`.trim();

    return (
        <div 
            className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex flex-col space-y-4 group relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
        >
            <div className={`absolute top-0 left-0 w-full h-1 ${isRunning ? 'bg-danger-dark' : 'bg-primary-dark'} opacity-80`} />
            
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-muted-dark font-mono font-bold uppercase tracking-widest">{contest.platform}</p>
                    <h3 className="text-lg font-bold text-foreground-dark leading-tight mt-1 truncate max-w-[200px]" title={contest.name}>{contest.name}</h3>
                </div>
                {contest.rated && (
                    <span className="text-[10px] bg-secondary-dark/10 text-secondary-dark px-2 py-1 rounded-md font-bold uppercase tracking-wide">Rated</span>
                )}
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
                <CountdownTimer startTime={contest.startTime} status={contest.status || 'upcoming'} />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border-dark">
                <p className="text-sm text-muted-dark font-mono">
                    {durationString || 'Unknown'}
                </p>
                <a 
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-xl transition-colors ${
                        isRunning 
                        ? 'bg-danger-dark text-white hover:bg-danger-dark/80'
                        : 'bg-primary-dark text-white hover:bg-primary-dark/80'
                    }`}
                >
                    <span>{isRunning ? 'Enter' : 'Register'}</span>
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
};
