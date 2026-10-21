import cv2
import numpy as np
import tensorflow as tf

from ..schemas.video import FrameScore, VideoAnalysisResult
from ..utils.media import detect_face, equalize_hist_frame
from .model_loader import get_video_model

FRAME_SAMPLE_INTERVAL = 8
FACE_CONFIDENCE_GATE = 0.6
SMOOTHING_WINDOW = 10
PROGRESS_UPDATE_EVERY = 4


def _vit_confidence(model, extractor, image) -> float:
    inputs = extractor(images=image, return_tensors="tf")
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = int(tf.argmax(logits, axis=-1).numpy()[0])
    probs = tf.nn.softmax(tf.cast(logits, tf.float32), axis=-1).numpy()[0]
    return float(probs[predicted_class])


def analyze_video(job, video_path: str, model_id: str, threshold: float) -> VideoAnalysisResult:
    model, extractor = get_video_model(model_id)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError("Could not open the uploaded video file.")

    try:
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = float(cap.get(cv2.CAP_PROP_FPS) or 0.0)
        duration = total_frames / fps if fps > 0 else 0.0
        job.update(
            status="processing",
            total_frames=total_frames,
            fps=round(fps, 2),
            duration=round(duration, 2),
        )

        current = 0
        sampled = 0
        faces_detected = 0
        scores: list[float] = []
        frame_scores: list[FrameScore] = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if current % FRAME_SAMPLE_INTERVAL == 0:
                sampled += 1
                face, _ = detect_face(frame)
                if face is not None:
                    pil = equalize_hist_frame(face)
                    confidence = _vit_confidence(model, extractor, pil)
                    if confidence > FACE_CONFIDENCE_GATE:
                        faces_detected += 1
                        scores.append(confidence)
                        frame_scores.append(
                            FrameScore(
                                frame=current,
                                fake_score=round(confidence, 6),
                                time_seconds=round(current / fps, 2) if fps > 0 else 0.0,
                            )
                        )
            current += 1

            if current % PROGRESS_UPDATE_EVERY == 0:
                job.update(
                    current_frame=current,
                    progress=min(current / total_frames, 1.0) if total_frames > 0 else 0.0,
                    faces_detected=faces_detected,
                )

        job.update(current_frame=current, progress=1.0, faces_detected=faces_detected)

        if not scores:
            raise RuntimeError("No faces found. Use a video with clear frontal faces.")

        avg_score = float(np.mean(scores))
        percentile_90 = float(np.percentile(scores, 90))
        final_label = "FAKE" if avg_score > threshold else "REAL"

        return VideoAnalysisResult(
            final_label=final_label,
            avg_score=round(avg_score, 6),
            percentile_90=round(percentile_90, 6),
            threshold=threshold,
            faces_detected=faces_detected,
            sampled_frames=sampled,
            total_frames=total_frames,
            frame_scores=frame_scores,
        )
    finally:
        cap.release()
