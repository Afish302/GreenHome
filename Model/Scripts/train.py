import json
import tensorflow as tf
from tensorflow import keras

from config import CLASS_NAMES_FILE, MODEL_FILE, PREPARED_DIR

print("GPU devices:", tf.config.list_physical_devices("GPU"))

# --- Settings ---
DATA_DIR = PREPARED_DIR
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42
STAGE1_EPOCHS = 5
STAGE2_EPOCHS = 20
UNFREEZE_LAST = 30  # how many layers at the end of MobileNetV3 to fine-tune

# --- Step 1: load the data ---
def load(split, shuffle):
    return keras.utils.image_dataset_from_directory(
        f"{DATA_DIR}/{split}",
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=shuffle,
        seed=SEED,
    )

train_ds = load("train", shuffle=True)
val_ds = load("val", shuffle=False)
test_ds = load("test", shuffle=False)

class_names = train_ds.class_names
print("Classes:", class_names)
with open(CLASS_NAMES_FILE, "w") as f:
    json.dump(class_names, f)

# --- Step 2: augmentation (training images only) ---
augment = keras.Sequential([
    keras.layers.RandomFlip("horizontal"),
    keras.layers.RandomRotation(0.1),
    keras.layers.RandomZoom(0.15),
    keras.layers.RandomContrast(0.15),
])

train_ds = train_ds.map(lambda x, y: (augment(x, training=True), y), num_parallel_calls=tf.data.AUTOTUNE)
train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
val_ds = val_ds.prefetch(tf.data.AUTOTUNE)
test_ds = test_ds.prefetch(tf.data.AUTOTUNE)

# --- Step 3: build the model ---
base = keras.applications.MobileNetV3Large(
    input_shape=IMG_SIZE + (3,),
    include_top=False,
    weights="imagenet",
)
base.trainable = False  # stage 1: backbone frozen

inputs = keras.Input(shape=IMG_SIZE + (3,))
x = base(inputs, training=False)  # keeps batch-norm layers in inference mode
x = keras.layers.GlobalAveragePooling2D()(x)
x = keras.layers.Dropout(0.2)(x)
outputs = keras.layers.Dense(len(class_names), activation="softmax")(x)
model = keras.Model(inputs, outputs)

# --- Step 4: stage 1, train only the new final layer ---
model.compile(
    optimizer=keras.optimizers.Adam(1e-3),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
print("\n=== Stage 1: new head only ===")
model.fit(train_ds, validation_data=val_ds, epochs=STAGE1_EPOCHS)

# --- Step 5: stage 2, unfreeze the last layers and fine-tune ---
base.trainable = True
for layer in base.layers[:-UNFREEZE_LAST]:
    layer.trainable = False

model.compile(  # must recompile after changing what is trainable
    optimizer=keras.optimizers.Adam(1e-4),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
callbacks = [
    keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=4, restore_best_weights=True),
    keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=2),
]
print("\n=== Stage 2: fine-tuning ===")
model.fit(train_ds, validation_data=val_ds, epochs=STAGE2_EPOCHS, callbacks=callbacks)

# --- Step 6: save and test ---
model.save(str(MODEL_FILE))
loss, acc = model.evaluate(test_ds)
print(f"\nTest accuracy: {acc:.1%}")