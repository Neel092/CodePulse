"use client";
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContests, Contest } from '@/hooks/useContests';

const PLATFORMS = ['All', 'Codeforces', 'LeetCode', 'CodeChef', 'AtCoder'];
const PLATFORM_COLORS: Record<string, string> = {
  Codeforces: '#5B8DB8', LeetCode: '#D97B3C',
  CodeChef: '#8B5A2B', AtCoder: '#7A7068',
};

// --- Date Helpers ---
const getISTDate = (dateString: string) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false
  }).formatToParts(new Date(dateString));
  
  const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
  return new Date(getPart('year'), getPart('month') - 1, getPart('day'), getPart('hour') === 24 ? 0 : getPart('hour'), getPart('minute'), getPart('second'));
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
};

const formatStartIST = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  }) + ' IST';
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const isToday = (d: Date) => isSameDay(d, new Date());

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export default function ContestCalendarDashboard() {
  const { contests, loading, error, refetch } = useContests();

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [filter, setFilter] = useState('All');
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);

  const filteredContests = useMemo(() => {
    return contests.filter(c => filter === 'All' || c.platform.toLowerCase() === filter.toLowerCase());
  }, [contests, filter]);

  const { days, calendarContests } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const daysArray = Array.from({ length: 42 }, (_, i) => {
      const dayNum = i - firstDay + 1;
      const date = new Date(year, month, dayNum);
      return { date, isCurrentMonth: dayNum > 0 && dayNum <= daysInMonth };
    });

    const cMap = new Map<string, Contest[]>();
    filteredContests.forEach(c => {
      const istDate = getISTDate(c.startTime);
      const key = `${istDate.getFullYear()}-${istDate.getMonth()}-${istDate.getDate()}`;
      if (!cMap.has(key)) cMap.set(key, []);
      cMap.get(key)!.push(c);
    });

    return { days: daysArray, calendarContests: cMap };
  }, [currentDate, filteredContests]);

  const upcomingList = useMemo(() => {
    const now = new Date().getTime();
    return [...filteredContests]
      .filter(c => new Date(c.startTime).getTime() + c.duration * 1000 > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [filteredContests]);

  const navMonth = (dir: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  const getCountdown = (startTime: string, duration: number) => {
    const start = new Date(startTime).getTime();
    const end = start + duration * 1000;
    const now = Date.now();

    if (now >= start && now <= end) return "LIVE NOW";
    if (now > end) return "Ended";

    const diff = start - now;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    return `Starts in ${d}d ${h}h`;
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full min-h-[800px]">
      {/* Left: Calendar Section (75%) */}
      <div className="flex-1 flex flex-col bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        {/* Header & Filters */}
        <div className="p-6 border-b border-border-dark space-y-6 bg-elevated-dark/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-display font-bold text-heading-dark w-48">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2 bg-background-dark p-1 rounded-lg border border-border-dark">
                <button onClick={() => navMonth(-1)} className="p-1.5 rounded-md hover:bg-elevated-dark text-muted-dark hover:text-primary-dark transition-colors"><ChevronLeft size={18} /></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-bold rounded-md hover:bg-elevated-dark text-foreground-dark transition-colors">Today</button>
                <button onClick={() => navMonth(1)} className="p-1.5 rounded-md hover:bg-elevated-dark text-muted-dark hover:text-primary-dark transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setFilter(p)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                    filter === p
                      ? "bg-primary-dark border-primary-dark text-background-dark shadow-lg shadow-primary-dark/20"
                      : "bg-background-dark border-border-dark text-muted-dark hover:border-primary-dark/50 hover:text-foreground-dark"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col bg-background-dark">
          <div className="grid grid-cols-7 border-b border-border-dark">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-widest text-muted-dark">
                {d}
              </div>
            ))}
          </div>

          <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {loading ? (
              <div className="col-span-7 row-span-6 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary-dark border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="col-span-7 row-span-6 flex flex-col items-center justify-center text-muted-dark">
                <AlertCircle size={32} className="mb-2 text-danger-dark" />
                <p>Failed to load calendar</p>
                <button onClick={refetch} className="mt-2 text-primary-dark hover:underline">Retry</button>
              </div>
            ) : (
              days.map((day, idx) => {
                const isTodayDate = isToday(day.date);
                const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
                const dayContests = calendarContests.get(key) || [];

                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-[100px] p-2 border-r border-b border-border-dark/50 transition-colors flex flex-col gap-1",
                      !day.isCurrentMonth && "bg-elevated-dark/20 opacity-50",
                      isTodayDate && "bg-primary-dark/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold",
                        isTodayDate ? "bg-primary-dark text-background-dark" : "text-muted-dark"
                      )}>
                        {day.date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
                      {dayContests.slice(0, 3).map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedContest(c)}
                          className="w-full text-left px-2 py-1.5 rounded-md flex items-center gap-2 text-[10px] font-medium hover:brightness-125 transition-all border border-transparent hover:border-white/10"
                          style={{ backgroundColor: `${PLATFORM_COLORS[c.platform] || '#7A7068'}20`, color: PLATFORM_COLORS[c.platform] || '#C9B99A' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[c.platform] || '#7A7068' }} />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                      {dayContests.length > 3 && (
                        <div className="text-[10px] text-muted-dark font-bold pl-2">
                          +{dayContests.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right: Upcoming Contests Sidebar (25%) */}
      <div className="xl:w-80 flex flex-col bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-xl shrink-0 h-[800px]">
        <div className="p-6 border-b border-border-dark bg-elevated-dark/30">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-primary-dark" />
            Agenda
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-elevated-dark/50 h-24 rounded-xl" />
            ))
          ) : upcomingList.length === 0 ? (
            <p className="text-muted-dark text-center py-10 text-sm">No upcoming contests found.</p>
          ) : (
            upcomingList.map(c => {
              const countdown = getCountdown(c.startTime, c.duration);
              const isLive = countdown === "LIVE NOW";
              const istDate = getISTDate(c.startTime);

              return (
                <div key={c.id} className="p-4 rounded-xl border border-border-dark bg-background-dark hover:border-primary-dark/30 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="px-2 py-1 bg-elevated-dark rounded text-[10px] font-bold tracking-wider uppercase text-muted-dark group-hover:text-foreground-dark transition-colors">
                      {istDate.toLocaleString('default', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-md",
                      isLive ? "bg-danger-dark/20 text-danger-dark animate-pulse" : "bg-elevated-dark text-muted-dark"
                    )}>
                      {countdown}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm leading-snug mb-2 line-clamp-2 text-foreground-dark">{c.name}</h4>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[c.platform] || '#7A7068' }} />
                      <span className="text-muted-dark font-medium">{c.platform}</span>
                    </div>
                    <button onClick={() => setSelectedContest(c)} className="text-primary-dark hover:underline flex items-center gap-1">
                      Details <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal for Contest Details */}
      {selectedContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => setSelectedContest(null)} />
          <div className="relative bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${PLATFORM_COLORS[selectedContest.platform] || '#7A7068'}20`, color: PLATFORM_COLORS[selectedContest.platform] || '#C9B99A' }}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold font-display leading-tight text-foreground-dark">{selectedContest.name}</h3>
                  <p className="text-sm font-medium" style={{ color: PLATFORM_COLORS[selectedContest.platform] || '#7A7068' }}>{selectedContest.platform}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 bg-background-dark p-4 rounded-xl border border-border-dark">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-dark">Start Time:</span>
                  <span className="font-bold text-foreground-dark">{formatStartIST(selectedContest.startTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-dark">Duration:</span>
                  <span className="font-bold text-foreground-dark">{formatDuration(selectedContest.duration)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-dark">Status:</span>
                  {(() => {
                    const statusText = getCountdown(selectedContest.startTime, selectedContest.duration);
                    return (
                      <span className={cn("font-bold px-2 py-0.5 rounded text-xs", statusText === "LIVE NOW" ? "bg-danger-dark/20 text-danger-dark" : "bg-elevated-dark text-muted-dark")}>
                        {statusText}
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedContest(null)} className="flex-1 py-2.5 rounded-xl border border-border-dark text-muted-dark hover:bg-elevated-dark font-bold transition-colors">Close</button>
                <a href={selectedContest.url} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl bg-primary-dark text-background-dark font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Register <ExternalLink size={16} />
                </a>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
