from typing import Literal, Optional

from pydantic import BaseModel, Field


class FrameScore(BaseModel):
    frame: int
    fake_score: float
    time_seconds: float


class VideoAnalysisResult(BaseModel):
    final_label: Literal["FAKE", "REAL"]
    avg_score: float
    percentile_90: float
    threshold: float
    faces_detected: int
    sampled_frames: int
    total_frames: int
    frame_scores: list[FrameScore]


class JobCreated(BaseModel):
    job_id: str


class JobStatus(BaseModel):
    job_id: str
    status: Literal["queued", "processing", "done", "error"] = "queued"
    progress: float = 0.0
    current_frame: int = 0
    total_frames: int = 0
    fps: float = 0.0
    duration: float = 0.0
    faces_detected: int = 0
    error: Optional[str] = None
    result: Optional[VideoAnalysisResult] = None
