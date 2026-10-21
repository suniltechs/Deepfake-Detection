export interface ImageAnalysisResult {
  label: 'Fake' | 'Real'
  confidence: number
  fake_score: number
  real_score: number
  threshold: number
  model: string
}

export interface FrameScore {
  frame: number
  fake_score: number
  time_seconds: number
}

export interface VideoAnalysisResult {
  final_label: 'FAKE' | 'REAL'
  avg_score: number
  percentile_90: number
  threshold: number
  faces_detected: number
  sampled_frames: number
  total_frames: number
  frame_scores: FrameScore[]
}

export type JobState = 'queued' | 'processing' | 'done' | 'error'

export interface JobStatus {
  job_id: string
  status: JobState
  progress: number
  current_frame: number
  total_frames: number
  fps: number
  duration: number
  faces_detected: number
  error: string | null
  result: VideoAnalysisResult | null
}
