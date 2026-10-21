import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

interface ScoreChartProps {
  fakeScore: number
  realScore: number
  threshold: number
  isDark: boolean
}

export function ScoreChart({ fakeScore, realScore, threshold, isDark }: ScoreChartProps) {
  const data = [
    { name: 'Fake', value: fakeScore, color: '#d72323' },
    { name: 'Real', value: realScore, color: '#3e3636' },
  ]
  const axis = isDark ? '#f5eded' : '#3e3636'

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#3e3636' : '#e6dcdc'} />
          <XAxis type="number" domain={[0, 1]} tick={{ fill: axis, fontSize: 12 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: axis, fontSize: 12 }} width={48} />
          <ReferenceLine x={threshold} stroke="#000000" strokeDasharray="4 4" label={{ value: 'Threshold', fill: axis, fontSize: 12 }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
