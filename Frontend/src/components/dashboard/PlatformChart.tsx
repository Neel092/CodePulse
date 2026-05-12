'use client'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  title?: string
  data: Record<string, number>
}

const COLORS = ['#5B8DB8', '#8B5A2B', '#7A7068', '#D97B3C']

export default function PlatformChart({ data, title = "Platform Breakdown" }: Props) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))

  const isEmpty = chartData.length === 0

  const displayData = isEmpty 
    ? [{ name: 'None', value: 1 }] 
    : chartData

  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-5">
      <h3 className="text-[#C9B99A] font-semibold font-['DM_Sans'] mb-1">{title}</h3>
      {isEmpty && (
        <p className="text-[#7A7068] text-xs mb-2 font-['DM_Sans']">No data available</p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={!isEmpty}
          >
            {displayData.map((_, i) => (
              <Cell
                key={i}
                fill={isEmpty ? '#2E2A24' : COLORS[i % COLORS.length]}
                opacity={isEmpty ? 0.5 : 1}
              />
            ))}
          </Pie>
          {!isEmpty && (
            <Tooltip
              contentStyle={{ background: '#1A1714', border: '1px solid #2E2A24', borderRadius: 8, fontSize: 12 }}
              itemStyle={{ color: '#C9B99A' }}
              formatter={(val, name) => [`${val} problems`, name]}
            />
          )}
          <Legend
            formatter={val => <span style={{ color: '#7A7068', fontSize: 12, textTransform: 'capitalize' }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {!isEmpty && (
        <div className="flex justify-around mt-2 overflow-x-auto pb-2">
          {chartData.map((d, i) => (
            <div key={d.name} className="text-center min-w-fit px-2">
              <div className="text-lg font-bold" style={{ color: COLORS[i % COLORS.length] }}>{d.value}</div>
              <div className="text-[#7A7068] text-xs capitalize">{d.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
