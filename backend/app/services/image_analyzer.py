import numpy as np
from PIL import Image
from tensorflow.keras.preprocessing.image import img_to_array

TARGET_SIZE = (256, 256)


def predict_image(model, image: Image.Image, threshold: float = 0.5) -> dict:
    img = image.resize(TARGET_SIZE)
    img_array = img_to_array(img) / 255.0
    batch = np.expand_dims(img_array, axis=0)

    pred = model.predict(batch, verbose=0)
    fake_score = float(pred[0][0])
    real_score = float(pred[0][1])

    label = "Fake" if fake_score > threshold else "Real"
    confidence = (fake_score if label == "Fake" else real_score) * 100

    return {
        "label": label,
        "confidence": round(confidence, 2),
        "fake_score": round(fake_score, 6),
        "real_score": round(real_score, 6),
        "threshold": threshold,
        "model": "MesoNet",
    }
