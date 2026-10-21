from fastapi import APIRouter

from ..config import IMAGE_MODEL_PATH

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "status": "ok",
        "image_model_available": IMAGE_MODEL_PATH.exists(),
    }
