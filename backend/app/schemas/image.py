from pydantic import BaseModel, Field


class ImageAnalysisResult(BaseModel):
    label: str = Field(description="Fake or Real")
    confidence: float = Field(description="Confidence of the predicted label in %")
    fake_score: float
    real_score: float
    threshold: float
    model: str = "MesoNet"
