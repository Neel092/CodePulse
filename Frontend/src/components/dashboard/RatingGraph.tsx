'use client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface RatingPoint { date: string; rating: number; contestName?: string }

interface Props {
  data: Array<{ ratingUpdateTimeSeconds: number; newRating: number; contestName: string }>
}

export default function RatingGraph({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-5 flex flex-col items-center justify-center h-60 gap-3">
        <p className="text-[#7A7068] text-sm font-['DM_Sans']">Sync Codeforces to see your rating history</p>
      </div>
    )
  }

  const chartData: RatingPoint[] = [...data]
    .sort((a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds)
    .map(d => ({
      date: new Date(d.ratingUpdateTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      rating: d.newRating,
      contestName: d.contestName,
    }))

  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-5">
      <h3 className="text-[#C9B99A] font-semibold font-['DM_Sans'] mb-4">Rating History</h3>
      {/* CRITICAL: ResponsiveContainer needs explicit height, not 100% */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#D97B3C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#D97B3C" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#7A7068', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#7A7068', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={35} />
          <Tooltip
            contentStyle={{ background: '#1A1714', border: '1px solid #2E2A24', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#C9B99A' }}
            itemStyle={{ color: '#D97B3C' }}
          />
          <Area type="monotone" dataKey="rating" stroke="#D97B3C" strokeWidth={2} fill="url(#ratingGrad)" dot={false} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
