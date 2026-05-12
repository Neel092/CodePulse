'use client'
import { useMemo, useState } from 'react'

interface Props {
  data: Record<string, number>
}

const WEEKS = 52
const DAYS  = 7

const getColor = (count: number) => {
  if (!count || count === 0) return '#1A1714'
  if (count <= 2) return '#4A3018'
  if (count <= 5) return '#8B5A2B'
  return '#D97B3C'
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ActivityHeatmap({ data }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null)

  const dates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: WEEKS * DAYS }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (WEEKS * DAYS - 1 - i))
      return d.toISOString().split('T')[0]
    })
  }, [])

  const weeks = useMemo(() =>
    Array.from({ length: WEEKS }, (_, w) => dates.slice(w * 7, w * 7 + 7)),
  [dates])

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; col: number }> = []
    let lastMonth = -1
    weeks.forEach((week, col) => {
      const month = new Date(week[0]).getMonth()
      if (month !== lastMonth) {
        labels.push({ label: MONTHS[month], col })
        lastMonth = month
      }
    })
    return labels
  }, [weeks])

  const totalActive = Object.keys(data).length
  const totalSolved = Object.values(data).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#C9B99A] font-semibold font-['DM_Sans']">Activity</h3>
        <span className="text-[#7A7068] text-xs">
          {totalSolved} submissions across {totalActive} days
        </span>
      </div>

      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: `${WEEKS * 14}px` }}>

          {/* Month labels */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${WEEKS}, 12px)`,
              gap: '2px',
              marginBottom: '4px',
              paddingLeft: '0px'
            }}
          >
            {Array.from({ length: WEEKS }, (_, col) => {
              const label = monthLabels.find(m => m.col === col)
              return (
                <div key={col} className="text-[#7A7068] text-[9px] font-['DM_Sans']">
                  {label ? label.label : ''}
                </div>
              )
            })}
          </div>

          {/* Heatmap grid — 52 columns × 7 rows */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${WEEKS}, 12px)`,
              gridTemplateRows: `repeat(${DAYS}, 12px)`,
              gap: '2px',
              gridAutoFlow: 'column',  // fills column by column (week by week)
            }}
          >
            {dates.map(date => {
              const count = data[date] || 0
              return (
                <div
                  key={date}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: getColor(count),
                    cursor: count > 0 ? 'pointer' : 'default',
                    transition: 'opacity 0.1s',
                  }}
                  onMouseEnter={e => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({ date, count, x: rect.left, y: rect.top })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#7A7068] text-[10px]">Less</span>
            {['#1A1714','#4A3018','#8B5A2B','#D97B3C'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: c }} />
            ))}
            <span className="text-[#7A7068] text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#1A1714] border border-[#2E2A24] rounded-lg px-3 py-2 text-xs text-[#C9B99A] pointer-events-none shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y - 40 }}
        >
          <span className="font-medium">
            {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {' — '}
          {tooltip.count === 0 ? 'No activity' : `${tooltip.count} problem${tooltip.count > 1 ? 's' : ''} solved`}
        </div>
      )}
    </div>
  )
}
