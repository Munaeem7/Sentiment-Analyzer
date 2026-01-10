"""
Loads the trained pipeline and makes predictions
"""
import joblib
import os
import sys

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import TextCleaner so joblib can find it when loading the pipeline
from text_cleaner import TextCleaner

# Get correct path to model file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "sentiment_pipeline.joblib")

# Load pipeline
try:
    pipeline = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully from: {MODEL_PATH}")
except FileNotFoundError:
    print(f"Model not found at: {MODEL_PATH}")
    print(" run notebook (01_data_audit.ipynb) to create the model file.")
    pipeline = None
except Exception as e:
    print(f"Error loading model: {e}")
    pipeline = None


def predict(text: str):
    """
    Predict sentiment for input text
    Returns
    Dictionary with sentiment, confidence
    """
    if pipeline is None:
        raise RuntimeError("Model not loaded. Run notebook first.")
    
    if not text or not text.strip():
        raise ValueError("Text cannot be empty")
    
    # Get prediction
    prediction = pipeline.predict([text])[0]
    probabilities = pipeline.predict_proba([text])[0]
    confidence = probabilities.max()
    
    # Get class labels from the model
    # Will be: ['Negative', 'Neutral', 'Positive']
    classes = pipeline.classes_
    
    # Create probability dictionary
    prob_dict = dict(zip(classes, probabilities))
    
    return {
        "sentiment": prediction,  # Can be: Positive, Negative, or Neutral
        "confidence": round(float(confidence), 3),
    }