import os
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Callable, Optional


class Job:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self._lock = threading.Lock()
        self._data: dict[str, Any] = {
            "job_id": job_id,
            "status": "queued",
            "progress": 0.0,
            "current_frame": 0,
            "total_frames": 0,
            "fps": 0.0,
            "duration": 0.0,
            "faces_detected": 0,
            "error": None,
            "result": None,
        }

    def update(self, **kwargs) -> None:
        with self._lock:
            self._data.update(kwargs)

    def snapshot(self) -> dict[str, Any]:
        with self._lock:
            return dict(self._data)


class JobStore:
    def __init__(self, max_workers: int = 1):
        self._jobs: dict[str, Job] = {}
        self._lock = threading.Lock()
        self._executor = ThreadPoolExecutor(max_workers=max_workers)

    def create(self) -> Job:
        job = Job(uuid.uuid4().hex)
        with self._lock:
            self._jobs[job.job_id] = job
        return job

    def get(self, job_id: str) -> Optional[Job]:
        with self._lock:
            return self._jobs.get(job_id)

    def submit(self, job: Job, fn: Callable, *args) -> None:
        self._executor.submit(self._run, job, fn, *args)

    def _run(self, job: Job, fn: Callable, *args) -> None:
        try:
            job.update(status="processing")
            result = fn(job, *args)
            job.update(status="done", progress=1.0, result=result)
        except Exception as exc:
            job.update(status="error", error=str(exc))
        finally:
            temp_path = job.snapshot().get("temp_path")
            if temp_path:
                try:
                    os.unlink(temp_path)
                except OSError:
                    pass


job_store = JobStore(max_workers=1)
