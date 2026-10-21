import type { ImageAnalysisResult, JobStatus } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

export async function analyzeImage(file: File, threshold: number): Promise<ImageAnalysisResult> {
  const form = new FormData()
  form.append('file', file)
  form.append('threshold', String(threshold))

  const res = await fetch(`${BASE_URL}/images/analyze`, { method: 'POST', body: form })
  return handle<ImageAnalysisResult>(res)
}

export async function startVideoAnalysis(
  file: File,
  threshold: number,
  modelId: string,
): Promise<{ job_id: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('threshold', String(threshold))
  form.append('model_id', modelId)

  const res = await fetch(`${BASE_URL}/videos/analyze`, { method: 'POST', body: form })
  return handle<{ job_id: string }>(res)
}

export async function getVideoJob(jobId: string): Promise<JobStatus> {
  const res = await fetch(`${BASE_URL}/videos/jobs/${jobId}`)
  return handle<JobStatus>(res)
}
