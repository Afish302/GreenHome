import json
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow import keras

from config import CLASS_NAMES_FILE, CONFUSION_MATRIX_FILE, MISTAKES_FILE, MODEL_FILE, TEST_DIR

# --- Load the trained model and the test images ---
model = keras.models.load_model(str(MODEL_FILE))
with open(CLASS_NAMES_FILE) as f:
    class_names = json.load(f)

test_ds = keras.utils.image_dataset_from_directory(
    str(TEST_DIR),
    image_size=(224, 224),
    batch_size=32,
    shuffle=False,  # keeps the order the same as test_ds.file_paths
)
paths = test_ds.file_paths
y_true = np.concatenate([labels.numpy() for _, labels in test_ds])
y_pred = model.predict(test_ds).argmax(axis=1)

# --- Overall and per-category results ---
print(f"\nOverall test accuracy: {(y_true == y_pred).mean():.1%}\n")
print(classification_report(y_true, y_pred, target_names=class_names, digits=3, zero_division=0))

# --- Accuracy by dataset (uses the kaggle_ / realwaste_ filename prefix) ---
print("Accuracy by source dataset:")
for source in ("kaggle", "realwaste"):
    idx = [i for i, p in enumerate(paths) if os.path.basename(p).startswith(source + "_")]
    if idx:
        acc = (y_true[idx] == y_pred[idx]).mean()
        print(f"  {source:<10} {acc:.1%}  ({len(idx)} images)")

# --- Confusion matrix picture ---
cm = confusion_matrix(y_true, y_pred)
fig, ax = plt.subplots(figsize=(8, 7))
ax.imshow(cm, cmap="Blues")
ax.set_xticks(range(len(class_names)), class_names, rotation=45, ha="right")
ax.set_yticks(range(len(class_names)), class_names)
ax.set_xlabel("Predicted")
ax.set_ylabel("Actual")
for i in range(len(class_names)):
    for j in range(len(class_names)):
        ax.text(j, i, cm[i, j], ha="center", va="center",
                color="white" if cm[i, j] > cm.max() / 2 else "black")
fig.tight_layout()
fig.savefig(CONFUSION_MATRIX_FILE, dpi=150)
print("\nSaved confusion_matrix.png")

# --- List every wrong prediction so you can look at the images ---
with open(MISTAKES_FILE, "w") as f:
    for p, t, pr in zip(paths, y_true, y_pred):
        if t != pr:
            f.write(f"actual={class_names[t]:<14} predicted={class_names[pr]:<14} {p}\n")
print("Saved mistakes.txt (open the listed images to see why they were wrong)")