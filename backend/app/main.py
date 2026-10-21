from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .routers import health, image, video

app = FastAPI(
    title="DeepGuard API",
    description="Deepfake detection API for images (MesoNet) and videos (Hugging Face ViT)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(image.router, prefix="/api")
app.include_router(video.router, prefix="/api")
