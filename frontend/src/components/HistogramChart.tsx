import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FrameScore } from '../api/types'

interface HistogramChartProps {
  scores: FrameScore[]
  threshold: number
  isDark: boolean
}

const BINS = 20

function buildHistogram(scores: FrameScore[]) {
  const bins = Array.from({ length: BINS }, (_, i) => ({
    range: ((i + 0.5) / BINS).toFixed(2),
    count: 0,
  }))
  for (const s of scores) {
    const idx = Math.min(Math.floor(s.fake_score * BINS), BINS - 1)
    bins[idx].count += 1
  }
  return bins
}

export function HistogramChart({ scores, threshold, isDark }: HistogramChartProps) {
  const axis = isDark ? '#f5eded' : '#3e3636'
  const data = buildHistogram(scores)

  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#3e3636' : '#e6dcdc'} />
          <XAxis
            dataKey="range"
            tick={{ fill: axis, fontSize: 11 }}
            interval={3}
            label={{ value: 'Fake Score', position: 'insideBottom', offset: -4, fill: axis, fontSize: 12 }}
          />
          <YAxis tick={{ fill: axis, fontSize: 12 }} width={40} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: isDark ? '#3e3636' : '#f5eded',
              border: `1px solid ${isDark ? '#524848' : '#e6dcdc'}`,
              borderRadius: 8,
              color: axis,
            }}
          />
          <ReferenceLine x={(Math.floor(threshold * BINS) / BINS + 0.5 / BINS).toFixed(2)} stroke="#000000" strokeDasharray="4 4" />
          <Bar dataKey="count" fill="#d72323" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
