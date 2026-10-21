import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FrameScore } from '../api/types'

interface TimelineChartProps {
  scores: FrameScore[]
  threshold: number
  isDark: boolean
}

export function TimelineChart({ scores, threshold, isDark }: TimelineChartProps) {
  const axis = isDark ? '#f5eded' : '#3e3636'
  const data = scores.map((s) => ({ time: s.time_seconds, score: s.fake_score }))

  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d72323" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#d72323" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#3e3636' : '#e6dcdc'} />
          <XAxis
            dataKey="time"
            tick={{ fill: axis, fontSize: 12 }}
            label={{ value: 'Time (s)', position: 'insideBottom', offset: -4, fill: axis, fontSize: 12 }}
          />
          <YAxis domain={[0, 1]} tick={{ fill: axis, fontSize: 12 }} width={40} />
          <Tooltip
            contentStyle={{
              background: isDark ? '#3e3636' : '#f5eded',
              border: `1px solid ${isDark ? '#524848' : '#e6dcdc'}`,
              borderRadius: 8,
              color: axis,
            }}
          />
          <ReferenceLine y={threshold} stroke="#000000" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="score" stroke="#d72323" strokeWidth={2} fill="url(#scoreFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
