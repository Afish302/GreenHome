import json

import numpy as np
from tensorflow import keras

from config import CLASS_NAMES_FILE, MODEL_FILE, TEST_DIR

THRESHOLD = 0.90  # F4: below this confidence the app shows the top three predictions

# Which bin each category goes in. Edit this to match your rules table / local council.
BIN = {
    "battery": "Electrical",
    "cardboard": "Paper Recycling",
    "paper": "Paper Recycling",
    "plastic": "Mixed Recycling",
    "metal": "Mixed Recycling",
    "glass": "Glass Recycling",
    "food_waste": "Food Waste",
    "textiles": "Textile Bank",
    "general_waste": "General Waste",
}

model = keras.models.load_model(str(MODEL_FILE))
with open(CLASS_NAMES_FILE) as f:
    class_names = json.load(f)

test_ds = keras.utils.image_dataset_from_directory(
    str(TEST_DIR), image_size=(224, 224), batch_size=32, shuffle=False
)
y_true = np.concatenate([labels.numpy() for _, labels in test_ds])
probs = model.predict(test_ds)

y_pred = probs.argmax(axis=1)
confidence = probs.max(axis=1)
top3 = np.argsort(probs, axis=1)[:, -3:]
correct = y_pred == y_true
n = len(y_true)

sure = confidence >= THRESHOLD
unsure = ~sure
in_top3 = np.array([t in row for t, row in zip(y_true, top3)])
wrong = ~correct

print(f"\nTop-1 accuracy (category):      {correct.mean():.1%}")
print(f"Top-3 accuracy:                 {in_top3.mean():.1%}")

bin_correct = np.array([BIN[class_names[t]] == BIN[class_names[p]] for t, p in zip(y_true, y_pred)])
print(f"Accuracy at disposal-bin level: {bin_correct.mean():.1%}")

print(f"\n--- Fallback rule (confidence below {THRESHOLD:.0%}) ---")
print(f"Answered confidently:  {sure.sum()} images ({sure.mean():.1%}), accuracy {correct[sure].mean():.1%}")
if unsure.any():
    print(f"Fallback triggered:    {unsure.sum()} images ({unsure.mean():.1%})")
    print(f"  top-1 right in those: {correct[unsure].mean():.1%}")
    print(f"  right answer in the top 3 shown to the user: {in_top3[unsure].mean():.1%}")

print(f"\nOf the {wrong.sum()} wrong predictions:")
print(f"  caught by the fallback (low confidence):   {(wrong & unsure).sum()}")
print(f"  confidently wrong (user gets bad advice):  {(wrong & sure).sum()}")