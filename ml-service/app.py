# ML service: POST /predict with an image file, returns the waste class.
# Runs the TFLite model with LiteRT (TensorFlow's lightweight runtime).
import io
import json
import os

import numpy as np
from ai_edge_litert.interpreter import Interpreter
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

MODEL_PATH = os.getenv("MODEL_PATH", "model/model.tflite")
LABELS_PATH = os.getenv("LABELS_PATH", "model/labels.json")
MIN_CONFIDENCE = 0.6

interpreter = Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
inp = interpreter.get_input_details()[0]
out = interpreter.get_output_details()[0]
_, IMG_H, IMG_W, _ = inp["shape"]
with open(LABELS_PATH) as f:
    LABELS = json.load(f)

app = FastAPI()


def preprocess(data: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(data)).convert("RGB")
    # Centre-crop to a square so the object isn't squashed, then resize.
    w, h = img.size
    s = min(w, h)
    img = img.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))
    img = img.resize((IMG_W, IMG_H), Image.BILINEAR)
    # The model does its own scaling, so pass raw 0-255 pixels.
    return np.asarray(img, dtype=np.float32)[None, ...]


@app.get("/healthz")
def healthz():
    return {"ok": True}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        x = preprocess(await image.read())
    except Exception:
        raise HTTPException(400, "Not a valid image")
    interpreter.set_tensor(inp["index"], x)
    interpreter.invoke()
    probs = interpreter.get_tensor(out["index"])[0]
    top = sorted(
        ({"label": LABELS[i], "confidence": float(p)} for i, p in enumerate(probs)),
        key=lambda r: r["confidence"],
        reverse=True,
    )
    return {
        "label": top[0]["label"],
        "confidence": top[0]["confidence"],
        "top": top[:3],
        "confident": top[0]["confidence"] >= MIN_CONFIDENCE,
    }
