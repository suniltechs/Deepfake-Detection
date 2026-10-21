from functools import lru_cache

from tensorflow.keras.models import load_model
from transformers import TFAutoModelForImageClassification, ViTFeatureExtractor

from ..config import HUGGINGFACE_TOKEN, IMAGE_MODEL_PATH


@lru_cache(maxsize=1)
def get_image_model():
    if not IMAGE_MODEL_PATH.exists():
        raise FileNotFoundError(f"Image model not found at {IMAGE_MODEL_PATH}")
    return load_model(str(IMAGE_MODEL_PATH))


@lru_cache(maxsize=4)
def get_video_model(model_id: str):
    try:
        model = TFAutoModelForImageClassification.from_pretrained(model_id, token=HUGGINGFACE_TOKEN)
        extractor = ViTFeatureExtractor.from_pretrained(model_id, token=HUGGINGFACE_TOKEN)
    except Exception as exc:
        raise RuntimeError(f"Could not load Hugging Face model '{model_id}': {exc}") from exc
    return model, extractor
