import { useState } from 'react'
import { AlertTriangle, Download, Video } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { FileUpload } from '../components/FileUpload'
import { HistogramChart } from '../components/HistogramChart'
import { Metric } from '../components/Metric'
import { ProgressBar } from '../components/ProgressBar'
import { TimelineChart } from '../components/TimelineChart'
import { useTheme } from '../hooks/useTheme'
import { useVideoJob } from '../hooks/useVideoJob'
import { downloadFrameScoresCsv } from '../lib/format'

const DEFAULT_MODEL = 'google/vit-base-patch16-224'

export function VideoAnalysis() {
  const { theme } = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [threshold, setThreshold] = useState(0.5)
  const [modelId, setModelId] = useState(DEFAULT_MODEL)
  const [tab, setTab] = useState<'timeline' | 'data'>('timeline')
  const { status, error, isRunning, start } = useVideoJob()

  const result = status?.status === 'done' ? status.result : null
  const lowFaceRate =
    result && result.sampled_frames > 0 && result.faces_detected < result.sampled_frames * 0.5

  const run = () => {
    if (file) start(file, threshold, modelId)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <FileUpload
            accept=".mp4,.avi,.mov"
            label="Upload Video"
            hint="Supported formats: MP4, AVI, MOV"
            icon={Video}
            file={file}
            onFile={setFile}
            disabled={isRunning}
          />
        </Card>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-crimson bg-cream p-4 text-sm text-crimson dark:bg-charcoal">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {status && status.status !== 'done' && status.status !== 'error' && (
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-ink dark:text-cream">
              {status.status === 'queued' ? 'Queued...' : 'Processing video'}
            </h3>
            <ProgressBar
              progress={status.progress}
              label={`Frame ${status.current_frame}/${status.total_frames} (${Math.round(status.progress * 100)}%)`}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Metric label="Faces Detected" value={status.faces_detected} />
              <Metric label="FPS" value={status.fps ? status.fps.toFixed(1) : '—'} />
              <Metric label="Duration" value={status.duration ? `${status.duration.toFixed(1)}s` : '—'} />
            </div>
          </Card>
        )}

        {result && (
          <>
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-cream">Video Information</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Metric label="Total Frames" value={result.total_frames} />
                <Metric label="FPS" value={status?.fps ? status.fps.toFixed(1) : '—'} />
                <Metric label="Duration" value={status?.duration ? `${status.duration.toFixed(1)}s` : '—'} />
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-ink dark:text-cream">Video Analysis Summary</h3>
                <Badge variant={result.final_label === 'FAKE' ? 'fake' : 'real'}>{result.final_label}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric
                  label="Faces Detected"
                  value={result.faces_detected}
                  hint={
                    result.sampled_frames
                      ? `${((result.faces_detected / result.sampled_frames) * 100).toFixed(1)}% of samples`
                      : undefined
                  }
                />
                <Metric label="Avg Fake Score" value={result.avg_score.toFixed(3)} />
                <Metric label="90th Percentile" value={result.percentile_90.toFixed(3)} />
                <Metric label="Threshold" value={result.threshold.toFixed(2)} />
              </div>
              {lowFaceRate && (
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-crimson">
                  <AlertTriangle size={18} />
                  Low face detection rate. Try a video with clearer faces.
                </p>
              )}
            </Card>

            <Card>
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setTab('timeline')}
                  className={
                    tab === 'timeline'
                      ? 'rounded-lg bg-crimson px-3 py-1.5 text-sm font-medium text-white'
                      : 'rounded-lg bg-cream px-3 py-1.5 text-sm font-medium text-charcoal dark:bg-charcoal dark:text-cream'
                  }
                >
                  Frame Analysis
                </button>
                <button
                  type="button"
                  onClick={() => setTab('data')}
                  className={
                    tab === 'data'
                      ? 'rounded-lg bg-crimson px-3 py-1.5 text-sm font-medium text-white'
                      : 'rounded-lg bg-cream px-3 py-1.5 text-sm font-medium text-charcoal dark:bg-charcoal dark:text-cream'
                  }
                >
                  Download Data
                </button>
              </div>

              {tab === 'timeline' ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="mb-2 font-semibold text-ink dark:text-cream">Fake Score Over Time</h4>
                    <TimelineChart scores={result.frame_scores} threshold={result.threshold} isDark={theme === 'dark'} />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-ink dark:text-cream">
                      Distribution of Fake Scores
                    </h4>
                    <HistogramChart scores={result.frame_scores} threshold={result.threshold} isDark={theme === 'dark'} />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead className="text-charcoal dark:text-cream-dim">
                        <tr>
                          <th className="py-2 pr-4">Frame</th>
                          <th className="py-2 pr-4">Fake Score</th>
                          <th className="py-2">Time (s)</th>
                        </tr>
                      </thead>
                      <tbody className="text-charcoal dark:text-cream">
                        {[...result.frame_scores]
                          .sort((a, b) => b.fake_score - a.fake_score)
                          .slice(0, 10)
                          .map((s) => (
                            <tr key={s.frame} className="border-t border-cream-dim dark:border-charcoal">
                              <td className="py-2 pr-4">{s.frame}</td>
                              <td className="py-2 pr-4">{s.fake_score.toFixed(4)}</td>
                              <td className="py-2">{s.time_seconds.toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFrameScoresCsv(result.frame_scores)}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-crimson px-4 py-2 font-medium text-white transition-colors hover:bg-crimson-dark"
                  >
                    <Download size={18} />
                    Download Full Analysis Data
                  </button>
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <h3 className="mb-4 text-lg font-semibold text-ink dark:text-cream">Settings</h3>
        <label className="block text-sm font-medium text-charcoal dark:text-cream-dim">Hugging Face Model ID</label>
        <input
          type="text"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={isRunning}
          className="mt-1 w-full rounded-lg border border-cream-dim px-3 py-2 text-sm outline-none focus:border-crimson dark:border-charcoal dark:bg-ink dark:text-cream"
        />
        <label className="mt-4 block text-sm font-medium text-charcoal dark:text-cream-dim">
          Fake Score Threshold: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          disabled={isRunning}
          className="mt-2 w-full accent-crimson"
        />
        <button
          type="button"
          onClick={run}
          disabled={!file || isRunning}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-crimson px-4 py-2.5 font-semibold text-white transition-colors hover:bg-crimson-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {isRunning ? 'Analyzing...' : result ? 'Re-analyze Video' : 'Analyze Video'}
        </button>
      </Card>
    </div>
  )
}
