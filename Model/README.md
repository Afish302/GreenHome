# GreenHome recycling classifier

MobileNetV3-Large fine-tuned on 9 categories. Test accuracy 92.9% (94.7% for the right bin).

## Contents
- `Scripts/` - dataset prep, training, evaluation, threshold sweep, ONNX export (paths set in `Scripts/config.py`)
- `Export/` - web-ready model: `greenhome_fp16.onnx` (6 MB), `greenhome_fp32.onnx`, `model_meta.json`
- `class_names.json`, `greenhome_model.keras`, `confusion_matrix.png`, `mistakes.txt`

## Using the model in the web app
The web app serves a copy of `greenhome_fp16.onnx` and `model_meta.json` from `frontend/public/models/`.
Load it with onnxruntime-web. Input is raw 0-255 RGB, 224x224, NHWC.
Ask the user to confirm when top confidence is below 0.90 (see `model_meta.json`).
If the model is re-exported, copy the new files from `Export/` into `frontend/public/models/`.

## Rebuilding
Datasets are not in git. Download Kaggle "Garbage Classification (12 classes)" and RealWaste into `Data/`, then run `Scripts/prepare_data.py`, `train.py`, `evaluate.py`, `export_onnx.py` from inside `Scripts/`.

## Credits
Kaggle Garbage Classification (12 classes)
https://www.kaggle.com/datasets/mostafaabla/garbage-classification

RealWaste
https://github.com/garythung/trashnet