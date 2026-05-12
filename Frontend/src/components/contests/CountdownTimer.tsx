import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ startTime, status }: { startTime: string, status: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (status === 'running') {
            setTimeLeft('Live Now');
            return;
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const start = new Date(startTime).getTime();
            const diff = start - now;

            if (diff <= 0) {
                setTimeLeft('Starting soon...');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`Starts in ${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`Starts in ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`Starts in ${minutes}m`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000); // update every minute
        return () => clearInterval(interval);
    }, [startTime, status]);

    return (
        <div className={`font-display font-bold text-2xl ${status === 'running' ? 'text-danger-dark animate-pulse' : 'text-primary-dark'}`}>
            {timeLeft}
        </div>
    );
};
