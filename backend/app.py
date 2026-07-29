import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import HealthResponse, SchemaResponse, PredictRequest, PredictResponse
from backend.waam_model import load_waam_model, get_model_schema, predict_waam

# Load model during application startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("FastAPI startup: Initializing WAAM AI Model...")
    try:
        model = load_waam_model()
        print("FastAPI startup: WAAM AI Model loaded successfully.")
    except Exception as e:
        print(f"Error loading WAAM AI Model on startup: {e}")
    yield
    print("FastAPI shutdown.")

app = FastAPI(
    title="WAAM AI Digital Twin API",
    description="Production API for Wire Arc Additive Manufacturing (WAAM) Process Prediction",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    try:
        load_waam_model()
        model_loaded = True
    except Exception:
        model_loaded = False

    return {
        "status": "healthy",
        "model_loaded": model_loaded,
        "version": "1.0"
    }

@app.get("/api/schema", response_model=SchemaResponse)
def get_schema():
    try:
        return get_model_schema()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract schema from model: {str(e)}"
        )

@app.post("/api/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        input_data = request.model_dump()
        result = predict_waam(input_data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
