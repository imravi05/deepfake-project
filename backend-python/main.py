# File: backend-python/main.py

from fastapi import FastAPI, File, UploadFile
from transformers import pipeline
from PIL import Image
import io

# 1. Initialize our FastAPI application
app = FastAPI(title="Deepfake Detection ML API")

# 2. Load the AI model
# This will download the model (prithivMLmods/Deep-Fake-Detector-v2-Model)
# the first time it's run.
print("Loading AI model...")
# We specify device=0 to use the GPU if available (much faster)
# If no GPU, change it to device=-1 to use the CPU
try:
  pipe = pipeline("image-classification", model="prithivMLmods/Deep-Fake-Detector-v2-Model", device=0)
  print("Model loaded on GPU.")
except Exception:
  print("Failed to load on GPU, falling back to CPU.")
  pipe = pipeline("image-classification", model="prithivMLmods/Deep-Fake-Detector-v2-Model", device=-1)
  print("Model loaded on CPU.")


# 3. Define the main prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    This endpoint takes an uploaded file, runs it through the
    deepfake detection model, and returns the result.
    """
    
    # 4. Read the uploaded file into an image
    # We use io.BytesIO to read the file in memory without saving it
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # 5. Run the prediction
    # The 'pipe' function runs the image through the model
    print(f"Analyzing file: {file.filename}...")
    try:
      result = pipe(image)
      print(f"Analysis complete. Result: {result}")
      
      # The model returns a list of dictionaries, like:
      # [{'label': 'Deepfake', 'score': 0.92}] or [{'label': 'Realism', 'score': 0.88}]
      
      # 6. Format the result to match our Node.js backend's needs
      best_prediction = result[0]
      prediction_label = "fake" if best_prediction["label"] == "Deepfake" else "real"
      confidence_score = best_prediction["score"]

      # See the "Important Note" below
      artifacts = [
          f"Model is {confidence_score * 100:.1f}% confident this is {prediction_label}."
      ]

      return {
          "prediction": prediction_label,
          "confidence": confidence_score,
          "artifacts_detected": artifacts
      }

    except Exception as e:
        print(f"Error during prediction: {e}")
        return {"error": "Failed to process image.", "details": str(e)}


# 4. A simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"message": "Welcome to the REAL Deepfake ML Server"}