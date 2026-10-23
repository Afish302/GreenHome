import json

import numpy as np
import onnx
import onnxruntime as ort
from onnxconverter_common import float16
from tensorflow import keras

from config import CLASS_NAMES_FILE, EXPORT_DIR, MODEL_FILE, TEST_DIR

EXPORT_DIR.mkdir(exist_ok=True)
MODEL_PATH = str(MODEL_FILE)
FP32_PATH = str(EXPORT_DIR / "greenhome_fp32.onnx")
FP16_PATH = str(EXPORT_DIR / "greenhome_fp16.onnx")
THRESHOLD = 0.90  # threshold chosen from the threshold sweep

# --- export to ONNX (full precision), then shrink to float16 ---
model = keras.models.load_model(MODEL_PATH)
model.predict(np.zeros((1, 224, 224, 3), dtype="float32"), verbose=0)  # Keras needs one call before export
model.export(FP32_PATH, format="onnx")
onnx.save(float16.convert_float_to_float16(onnx.load(FP32_PATH), keep_io_types=True), FP16_PATH)

# --- write the settings the web app needs ---
with open(CLASS_NAMES_FILE) as f:
    class_names = json.load(f)
with open(EXPORT_DIR / "model_meta.json", "w") as f:
    json.dump({
        "class_names": class_names,
        "input_size": [224, 224],
        "input_layout": "NHWC",
        "pixel_values": "raw 0-255 floats, no extra normalisation",
        "confidence_threshold": THRESHOLD,
    }, f, indent=2)

# --- check the exported models give the same answers on the test set ---
test_ds = keras.utils.image_dataset_from_directory(
    str(TEST_DIR), image_size=(224, 224), batch_size=32, shuffle=False
)
batches = [images.numpy() for images, _ in test_ds]
y_true = np.concatenate([labels.numpy() for _, labels in test_ds])

def onnx_predictions(path):
    session = ort.InferenceSession(path)
    name = session.get_inputs()[0].name
    return np.concatenate([session.run(None, {name: b})[0].argmax(axis=1) for b in batches])

keras_pred = model.predict(test_ds, verbose=0).argmax(axis=1)
fp32_pred = onnx_predictions(FP32_PATH)
fp16_pred = onnx_predictions(FP16_PATH)

acc_keras = (keras_pred == y_true).mean()
acc_fp32 = (fp32_pred == y_true).mean()
acc_fp16 = (fp16_pred == y_true).mean()
drop = (acc_fp32 - acc_fp16) * 100

print(f"\nKeras model accuracy:     {acc_keras:.2%}")
print(f"ONNX float32 accuracy:    {acc_fp32:.2%}   (same answers as Keras on {(fp32_pred == keras_pred).mean():.2%} of images)")
print(f"ONNX float16 accuracy:    {acc_fp16:.2%}   (same answers as float32 on {(fp16_pred == fp32_pred).mean():.2%} of images)")
print(f"Float16 accuracy drop:    {drop:.2f} percentage points  ->  {'PASS' if drop <= 2 else 'FAIL'} (target: within 2)")
print(f"\nFiles written to {EXPORT_DIR}: greenhome_fp32.onnx, greenhome_fp16.onnx, model_meta.json")