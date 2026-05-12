'use client'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  title?: string
  data: { easy: number; medium: number; hard: number }
}

const COLORS = ['#5C9E6E', '#B89742', '#C0474A']
const KEYS   = ['easy', 'medium', 'hard'] as const

export default function DifficultyChart({ data, title = "Difficulty Breakdown" }: Props) {
  const isEmpty = !data || (data.easy === 0 && data.medium === 0 && data.hard === 0)

  const chartData = isEmpty
    ? KEYS.map(k => ({ name: k, value: 1 }))   // placeholder so chart renders
    : KEYS.map(k => ({ name: k, value: data[k] })).filter(d => d.value > 0)

  return (
    <div className="bg-[#141210] border border-[#2E2A24] rounded-xl p-5">
      <h3 className="text-[#C9B99A] font-semibold font-['DM_Sans'] mb-1">{title}</h3>
      {isEmpty && (
        <p className="text-[#7A7068] text-xs mb-2 font-['DM_Sans']">Sync LeetCode or Codeforces to see breakdown</p>
      )}
      {/* CRITICAL: PieChart must have explicit width/height, not 100% */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={!isEmpty}
          >
            {chartData.map((_, i) => (
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
        <div className="flex justify-around mt-2">
          {KEYS.map((k, i) => (
            <div key={k} className="text-center">
              <div className="text-lg font-bold" style={{ color: COLORS[i] }}>{data[k]}</div>
              <div className="text-[#7A7068] text-xs capitalize">{k}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
