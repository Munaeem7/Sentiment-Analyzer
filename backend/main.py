from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="Sentiment Analysis API",
    description="API for analyzing sentiment in text using machine learning",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",  # Local 
    "https://analyzetextsentiment.vercel.app/",  #  Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
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
        
        if len(data.text) > 10000:
            raise HTTPException(status_code=400, detail="Text is too long (max 10000 characters)")

        try:
            from ml.inference import predict
        except ImportError as e:
            raise HTTPException(
                status_code=503, 
                detail=f"ML model not available: {str(e)}"
            )

        result = predict(data.text)
        

        if not isinstance(result, dict):
            result = {"prediction": result}

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
                response['sentiment'] = str(response['prediction']).lower()
            elif 'label' in response:
                response['sentiment'] = str(response['label']).lower()
        
        # Add confidence if available
        if 'confidence' not in response and 'probability' in response:
            response['confidence'] = float(response['probability'])
        
        return response
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        # Log the actual error for debugging
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

#for Railway health checks
@app.get("/ping")
def ping():
    return {"message": "pong"}