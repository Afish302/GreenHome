import hashlib
import random
import shutil
from itertools import zip_longest
from pathlib import Path

from config import KAGGLE_DIR, PREPARED_DIR, REALWASTE_DIR

# --- Where the data is ---
OUT_DIR = PREPARED_DIR

# --- Settings ---
TARGET_PER_CATEGORY = 1200  # how many images we want in each category
SEED = 42                   # fixed seed so the shuffle and split are repeatable
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# --- Label mappings: dataset folder name -> our category ---
KAGGLE_MAP = {
    "cardboard": "cardboard",
    "paper": "paper",
    "brown-glass": "glass",
    "green-glass": "glass",
    "white-glass": "glass",
    "plastic": "plastic",
    "metal": "metal",
    "biological": "food_waste",
    "battery": "battery",
    "clothes": "textiles",
    "shoes": "textiles",
    "trash": "general_waste",
}
REALWASTE_MAP = {
    "Cardboard": "cardboard",
    "Food Organics": "food_waste",
    "Glass": "glass",
    "Metal": "metal",
    "Miscellaneous Trash": "general_waste",
    "Paper": "paper",
    "Plastic": "plastic",
    # "Textile Trash" deliberately left out: textiles come from Kaggle only
    # "Vegetation" deliberately left out: no matching category
}


def collect_images(root, mapping, source):
    """Return {category: [(image_path, source), ...]} for one dataset."""
    found = {}
    for class_folder in sorted(root.iterdir()):
        if not class_folder.is_dir():
            continue
        category = mapping.get(class_folder.name)
        if category is None:
            print(f"  skipping '{class_folder.name}' (no mapping)")
            continue
        for file in class_folder.iterdir():
            if file.suffix.lower() in IMAGE_EXTENSIONS:
                found.setdefault(category, []).append((file, source))
    return found


# --- collect the images from both datasets ---
kaggle = collect_images(KAGGLE_DIR, KAGGLE_MAP, "kaggle")
realwaste = collect_images(REALWASTE_DIR, REALWASTE_MAP, "realwaste")

# --- remove exact duplicate images ---
seen = set()
duplicates = 0
for dataset in (kaggle, realwaste):
    for category, items in dataset.items():
        unique = []
        for path, source in items:
            digest = hashlib.md5(path.read_bytes()).hexdigest()
            if digest in seen:
                duplicates += 1
            else:
                seen.add(digest)
                unique.append((path, source))
        dataset[category] = unique
print(f"Duplicates removed: {duplicates}\n")

# --- for each category, alternate Kaggle / RealWaste, then split 70/15/15 ---
random.seed(SEED)
print("category        total   kaggle  realwaste")

for category in sorted(set(kaggle) | set(realwaste)):
    k = kaggle.get(category, [])
    r = realwaste.get(category, [])
    random.shuffle(k)
    random.shuffle(r)

    # Take one from each in turn. When one dataset runs out, the other carries on.
    mixed = [item for pair in zip_longest(k, r) for item in pair if item is not None]
    chosen = mixed[:TARGET_PER_CATEGORY]
    random.shuffle(chosen)

    n_real = sum(1 for _, source in chosen if source == "realwaste")
    print(f"{category:<14}{len(chosen):>6}{len(chosen) - n_real:>9}{n_real:>11}")

    n_train = int(len(chosen) * 0.70)
    n_val = int(len(chosen) * 0.15)
    splits = {
        "train": chosen[:n_train],
        "val": chosen[n_train:n_train + n_val],
        "test": chosen[n_train + n_val:],
    }

    # --- copy the images into train/val/test folders ---
    for split_name, files in splits.items():
        dest_folder = OUT_DIR / split_name / category
        dest_folder.mkdir(parents=True, exist_ok=True)
        for path, source in files:
            dest = dest_folder / f"{source}_{path.name}"
            n = 1
            while dest.exists():  # never overwrite: add a number if the name is already taken
                dest = dest_folder / f"{source}_{path.stem}_{n}{path.suffix}"
                n += 1
            shutil.copy2(path, dest)

print(f"\nDone. Images written to {OUT_DIR}")