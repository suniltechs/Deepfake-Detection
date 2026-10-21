import tempfile
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..config import DEFAULT_VIDEO_MODEL, VIDEO_EXTENSIONS
from ..schemas.video import JobCreated, JobStatus
from ..services.jobs import job_store
from ..services.video_analyzer import analyze_video

router = APIRouter(prefix="/videos", tags=["videos"])


@router.post("/analyze", response_model=JobCreated, status_code=202)
async def start_video_analysis(
    file: UploadFile = File(..., description="Video file (mp4, avi, mov)"),
    threshold: float = Form(0.5, description="Fake score threshold (0.1 - 0.9)"),
    model_id: str = Form(DEFAULT_VIDEO_MODEL, description="Hugging Face model id"),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in VIDEO_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported video type '{ext}'. Allowed: {sorted(VIDEO_EXTENSIONS)}")
    if not 0.0 < threshold < 1.0:
        raise HTTPException(status_code=400, detail="Threshold must be between 0 and 1")

    suffix = ext if ext else ".mp4"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    tmp.close()
    with open(tmp.name, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            out.write(chunk)

    job = job_store.create()
    job.update(temp_path=tmp.name, threshold=threshold, model_id=model_id, original_name=file.filename)
    job_store.submit(job, analyze_video, tmp.name, model_id, threshold)
    return {"job_id": job.job_id}


@router.get("/jobs/{job_id}", response_model=JobStatus)
def get_job(job_id: str):
    job = job_store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatus(**job.snapshot())
