import type { FrameScore } from '../api/types'

export function downloadFrameScoresCsv(scores: FrameScore[], filename = 'deepfake_analysis_results.csv') {
  const header = 'Frame,FAKE_Score,Time (s)'
  const rows = scores.map((s) => `${s.frame},${s.fake_score.toFixed(6)},${s.time_seconds}`)
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`
}
