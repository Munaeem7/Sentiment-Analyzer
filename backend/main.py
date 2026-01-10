from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import json
from ml.inference import predict

app = FastAPI(
    title="Sentiment Analysis API",
    description="API for analyzing sentiment in text using machine learning",
    version="1.0.0"
)

# Add CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.get("/")
def home():
    return {
        "message": "Sentiment Analysis API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": {
            "predict": "POST /predict",
            "docs": "GET /docs",
            "redoc": "GET /redoc"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "sentiment-analyzer",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict")
async def predict_sentiment(data: TextInput):
    try:
        if not data.text or not data.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        
        if len(data.text) > 10000:  # Prevent very large inputs
            raise HTTPException(status_code=400, detail="Text is too long (max 10000 characters)")
        
        # Get prediction from ML model
        result = predict(data.text)
        
        # Ensure result is a dictionary
        if not isinstance(result, dict):
            result = {"prediction": result}
        
        # Add additional metadata
        response = {
            "success": True,
            "text": data.text,
            "text_length": len(data.text),
            "timestamp": datetime.now().isoformat(),
            **result
        }
        
        # Ensure sentiment is in the response
        if 'sentiment' not in response:
            # Try to extract from prediction
            if 'prediction' in response:
                response['sentiment'] = response['prediction']
            elif 'label' in response:
                response['sentiment'] = response['label']
        
        # Add confidence if available
        if 'confidence' not in response and 'probability' in response:
            response['confidence'] = response['probability']
        
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")