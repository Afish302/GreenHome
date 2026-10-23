"""All the file locations used by the GreenHome model scripts, in one place.

The scripts live in Model/Scripts, so everything is found relative to the Model folder
and works no matter where you run a script from. To move something, change it here.
"""
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parent.parent  # the Model folder

# --- Input data ---
KAGGLE_DIR = MODEL_DIR / "Data" / "kaggle - garbage classification (12 classes)" / "garbage_classification"
REALWASTE_DIR = MODEL_DIR / "Data" / "realwaste" / "realwaste-main" / "RealWaste"
PREPARED_DIR = MODEL_DIR / "Data" / "prepared"   # train / val / test folders made by prepare_data.py
TEST_DIR = PREPARED_DIR / "test"
OWN_PHOTOS_DIR = MODEL_DIR / "Data" / "own_photos"  # your own test-only photos (not used for training)

# --- Trained model and reports ---
MODEL_FILE = MODEL_DIR / "greenhome_model.keras"
CLASS_NAMES_FILE = MODEL_DIR / "class_names.json"
CONFUSION_MATRIX_FILE = MODEL_DIR / "confusion_matrix.png"
MISTAKES_FILE = MODEL_DIR / "mistakes.txt"

# --- Files for the web app ---
EXPORT_DIR = MODEL_DIR / "Export"
