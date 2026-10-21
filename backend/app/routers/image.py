from io import BytesIO
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from ..config import IMAGE_EXTENSIONS
from ..schemas.image import ImageAnalysisResult
from ..services.image_analyzer import predict_image
from ..services.model_loader import get_image_model

router = APIRouter(prefix="/images", tags=["images"])


@router.post("/analyze", response_model=ImageAnalysisResult)
def analyze_image(
    file: UploadFile = File(..., description="Image file (jpg, jpeg, png)"),
    threshold: float = Form(0.5, description="Fake score threshold (0.1 - 0.9)"),
):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported image type '{ext}'. Allowed: {sorted(IMAGE_EXTENSIONS)}")
    if not 0.0 < threshold < 1.0:
        raise HTTPException(status_code=400, detail="Threshold must be between 0 and 1")

    try:
        image = Image.open(BytesIO(file.file.read())).convert("RGB")
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="Could not read the uploaded image")

    try:
        model = get_image_model()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Image model unavailable: {exc}")

    return predict_image(model, image, threshold)
