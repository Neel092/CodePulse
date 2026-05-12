'use client'
import { useEffect, useState } from 'react'
import { useContests, Contest } from '@/hooks/useContests'

const PLATFORM_COLORS: Record<string, string> = {
  Codeforces: '#5B8DB8', LeetCode: '#D97B3C',
  CodeChef: '#8B5A2B',   AtCoder: '#7A7068',
}

const computeCountdown = (targetDate: string, now: number) => {
  const diff = new Date(targetDate).getTime() - now
  if (diff <= 0) return 'Starting now'
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`
}

function ContestCard({ contest, countdown }: { contest: Contest; countdown: string }) {
  const color = PLATFORM_COLORS[contest.platform] || '#7A7068'

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`
  }

  const formatStart = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
    }) + ' IST'

  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-4 min-w-[260px] flex flex-col gap-2 hover:border-[#D97B3C]/40 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
        <span className="text-[#7A7068] text-xs font-['DM_Sans']">{contest.platform}</span>
      </div>
      <p className="text-[#C9B99A] text-sm font-medium font-['DM_Sans'] leading-snug line-clamp-2">
        {contest.name.length > 45 ? contest.name.slice(0, 45) + '…' : contest.name}
      </p>
      <div className="text-[#7A7068] text-xs font-['DM_Sans']">{formatStart(contest.startTime)}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-mono" style={{ color }}>⏱ {countdown}</span>
        <span className="text-[#7A7068] text-xs">{formatDuration(contest.duration)}</span>
      </div>
      <a
        href={contest.url} target="_blank" rel="noopener noreferrer"
        className="mt-1 text-center text-xs py-1.5 rounded-lg border border-[#D97B3C]/40 text-[#D97B3C] hover:bg-[#D97B3C]/10 transition-colors font-['DM_Sans']"
      >
        Register →
      </a>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-4 min-w-[260px] flex flex-col gap-3 animate-pulse">
      <div className="h-3 w-20 bg-[#2E2A24] rounded" />
      <div className="h-4 w-full bg-[#2E2A24] rounded" />
      <div className="h-3 w-32 bg-[#2E2A24] rounded" />
      <div className="h-3 w-24 bg-[#2E2A24] rounded" />
      <div className="h-7 w-full bg-[#2E2A24] rounded-lg" />
    </div>
  )
}

export default function UpcomingContests() {
  const { contests, loading, error } = useContests()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-[#0F0D0B] rounded-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#C9B99A] font-semibold font-['DM_Sans']">Upcoming Contests</h3>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <p className="text-[#7A7068] text-sm font-['DM_Sans']">Failed to load contests</p>
        </div>
      ) : contests.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-[#7A7068] text-sm font-['DM_Sans']">No upcoming contests found</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {contests.map((c) => (
            <ContestCard 
              key={`${c.platform}-${c.id}`} 
              contest={c} 
              countdown={computeCountdown(c.startTime, now)} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
