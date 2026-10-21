import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, ImageIcon } from 'lucide-react'
import { analyzeImage } from '../api/client'
import type { ImageAnalysisResult } from '../api/types'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { FileUpload } from '../components/FileUpload'
import { Metric } from '../components/Metric'
import { ScoreChart } from '../components/ScoreChart'
import { useTheme } from '../hooks/useTheme'

export function ImageAnalysis() {
  const { theme } = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [threshold, setThreshold] = useState(0.5)
  const [result, setResult] = useState<ImageAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const run = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await analyzeImage(file, threshold))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const buttonText = loading ? null : result ? 'Re-analyze' : 'Analyze Image'

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card>
          <FileUpload
            accept=".jpg,.jpeg,.png"
            label="Upload Image"
            hint="Supported formats: JPG, JPEG, PNG"
            icon={ImageIcon}
            file={file}
            onFile={(f) => {
              setFile(f)
              setResult(null)
              setError(null)
            }}
            disabled={loading}
          />

          {preview && (
            <img
              src={preview}
              alt="Uploaded preview"
              className="mt-4 max-h-80 w-full rounded-xl object-contain"
            />
          )}
        </Card>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-crimson bg-cream p-4 text-sm text-crimson dark:bg-charcoal">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <>
            <Card>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-ink dark:text-cream">Detection Results</h3>
                <Badge variant={result.label === 'Fake' ? 'fake' : 'real'}>
                  {result.label} ({result.confidence}%)
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric label="Fake Score" value={result.fake_score.toFixed(3)} />
                <Metric label="Real Score" value={result.real_score.toFixed(3)} />
                <Metric label="Threshold" value={result.threshold.toFixed(2)} />
                <Metric label="Model" value={result.model} />
              </div>
              <p
                className={
                  result.label === 'Real'
                    ? 'mt-4 flex items-center gap-2 text-sm font-medium text-charcoal dark:text-cream'
                    : 'mt-4 flex items-center gap-2 text-sm font-medium text-crimson'
                }
              >
                {result.label === 'Real' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                {result.label === 'Real'
                  ? 'Authentic content detected with high confidence.'
                  : 'Potential deepfake detected. Please verify this content.'}
              </p>
            </Card>

            <Card>
              <h3 className="mb-4 text-lg font-semibold text-ink dark:text-cream">Confidence Scores</h3>
              <ScoreChart
                fakeScore={result.fake_score}
                realScore={result.real_score}
                threshold={result.threshold}
                isDark={theme === 'dark'}
              />
            </Card>
          </>
        )}
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <h3 className="mb-4 text-lg font-semibold text-ink dark:text-cream">Settings</h3>
        <label className="block text-sm font-medium text-charcoal dark:text-cream-dim">
          Fake Score Threshold: {threshold.toFixed(2)}
        </label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="mt-2 w-full accent-crimson"
        />
        <button
          type="button"
          onClick={run}
          disabled={!file || loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-crimson px-4 py-2.5 font-semibold text-white transition-colors hover:bg-crimson-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? 'Analyzing...' : buttonText}
        </button>
      </Card>
    </div>
  )
}
