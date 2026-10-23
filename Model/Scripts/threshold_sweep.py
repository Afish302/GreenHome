import numpy as np
from tensorflow import keras

from config import MODEL_FILE, TEST_DIR

THRESHOLDS = [0.5, 0.6, 0.7, 0.8, 0.9, 0.95]

model = keras.models.load_model(str(MODEL_FILE))
test_ds = keras.utils.image_dataset_from_directory(
    str(TEST_DIR), image_size=(224, 224), batch_size=32, shuffle=False
)
y_true = np.concatenate([labels.numpy() for _, labels in test_ds])
probs = model.predict(test_ds)

y_pred = probs.argmax(axis=1)
confidence = probs.max(axis=1)
correct = y_pred == y_true
wrong = ~correct

print(f"\n{'threshold':>9} {'asks user':>10} {'accuracy if':>12} {'mistakes':>9} {'confidently':>12}")
print(f"{'':>9} {'(fallback)':>10} {'confident':>12} {'caught':>9} {'wrong':>12}")
for t in THRESHOLDS:
    sure = confidence >= t
    unsure = ~sure
    acc_sure = f"{correct[sure].mean():.1%}" if sure.any() else "n/a"
    caught = f"{(wrong & unsure).sum()}/{wrong.sum()}"
    print(f"{t:>9.0%} {unsure.mean():>10.1%} {acc_sure:>12} {caught:>9} {(wrong & sure).sum():>12}")