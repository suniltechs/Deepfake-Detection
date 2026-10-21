import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
IMAGE_MODEL_PATH = MODELS_DIR / "mesonet_deepfake_model.h5"
DEFAULT_VIDEO_MODEL = "google/vit-base-patch16-224"
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN") or None

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov"}
