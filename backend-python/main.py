# File: backend-python/main.py

from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from PIL import Image
import io

app = FastAPI(title="Deepfake Detection ML API")

# --- CONFIGURATION ---
# Set this to True if your model is predicting Real as Fake and vice-versa.
INVERT_PREDICTION = True 
# ---------------------

print("Loading AI model...")
try:
    # We stick with the robust model we chose
    pipe = pipeline("image-classification", model="umm-maybe/AI-image-detector", device=0)
    print("Model loaded on GPU.")
except Exception:
    print("Failed to load on GPU, falling back to CPU.")
    pipe = pipeline("image-classification", model="umm-maybe/AI-image-detector", device=-1)
    print("Model loaded on CPU.")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    print(f"Analyzing file: {file.filename}...")
    try:
        result = pipe(image)
        print(f"MODEL_RAW_OUTPUT: {result}") 
        
        # Get the top result
        top_result = result[0]
        raw_label = top_result['label'].lower() 
        raw_score = top_result['score']
        
        # Determine initial prediction based on label text
        # (This model typically uses 'artificial' for fake)
        if "artificial" in raw_label or "ai" in raw_label or "fake" in raw_label:
            prediction = "fake"
        else:
            prediction = "real"

        # --- APPLY THE INVERSION FIX ---
        if INVERT_PREDICTION:
            # Swap the prediction
            if prediction == "fake":
                prediction = "real"
            else:
                prediction = "fake"
            print(f"NOTE: Prediction inverted to '{prediction}' due to configuration.")

        # Prepare the reasoning text
        if prediction == "fake":
            reason = f"Model detects high likelihood of AI generation ({raw_score*100:.1f}%)."
        else:
            reason = f"Model classifies this as authentic/real media ({raw_score*100:.1f}%)."

        return {
            "prediction": prediction,
            "confidence": raw_score,
            "artifacts_detected": [
                reason,
                f"Raw Label: {raw_label}",
                f"Inverted: {INVERT_PREDICTION}"
            ]
        }

    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": "Failed to process image.", "details": str(e)}

@app.get("/")
def read_root():
    return {"message": "Deepfake ML Server is running"}