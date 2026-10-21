import { useEffect, useRef, useState } from 'react'
import { getVideoJob, startVideoAnalysis } from '../api/client'
import type { JobStatus } from '../api/types'

const POLL_INTERVAL_MS = 1500

export function useVideoJob() {
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const timer = useRef<number | null>(null)
  const cancelled = useRef(false)

  const stop = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => () => {
    cancelled.current = true
    stop()
  }, [])

  const poll = (jobId: string) => {
    timer.current = window.setTimeout(async () => {
      if (cancelled.current) return
      try {
        const next = await getVideoJob(jobId)
        setStatus(next)
        if (next.status === 'done' || next.status === 'error') {
          setIsRunning(false)
          if (next.status === 'error') setError(next.error ?? 'Video analysis failed')
          return
        }
        poll(jobId)
      } catch (err) {
        setIsRunning(false)
        setError(err instanceof Error ? err.message : 'Polling failed')
      }
    }, POLL_INTERVAL_MS)
  }

  const start = async (file: File, threshold: number, modelId: string) => {
    stop()
    cancelled.current = false
    setError(null)
    setStatus(null)
    setIsRunning(true)
    try {
      const { job_id } = await startVideoAnalysis(file, threshold, modelId)
      poll(job_id)
    } catch (err) {
      setIsRunning(false)
      setError(err instanceof Error ? err.message : 'Could not start analysis')
    }
  }

  const reset = () => {
    stop()
    cancelled.current = true
    setStatus(null)
    setError(null)
    setIsRunning(false)
  }

  return { status, error, isRunning, start, reset }
}
