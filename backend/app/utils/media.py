import cv2
import numpy as np
from PIL import Image

FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def equalize_hist_frame(frame: np.ndarray) -> Image.Image:
    frame_yuv = cv2.cvtColor(frame, cv2.COLOR_BGR2YUV)
    frame_yuv[:, :, 0] = cv2.equalizeHist(frame_yuv[:, :, 0])
    frame_rgb = cv2.cvtColor(frame_yuv, cv2.COLOR_YUV2RGB)
    return Image.fromarray(frame_rgb)


def detect_face(frame: np.ndarray):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = FACE_CASCADE.detectMultiScale(gray, 1.3, 5, minSize=(50, 50))
    if len(faces) > 0:
        x, y, w, h = faces[0]
        face_crop = frame[max(0, y):y + h, max(0, x):x + w]
        face_resized = cv2.resize(face_crop, (224, 224))
        return face_resized, (int(x), int(y), int(w), int(h))
    return None, None
