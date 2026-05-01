from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random
import logging
import os

# Use simple classifier for demo, or full ML classifier if USE_ML_MODEL=1
USE_ML_MODEL = os.environ.get('USE_ML_MODEL', '0') == '1'

if USE_ML_MODEL:
    from .waste_classifier import get_classifier
else:
    from .simple_classifier import get_simple_classifier as get_classifier

app = FastAPI(title="StubbleX AI API")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for production/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class WasteItem(BaseModel):
    waste_type: str
    quantity: float
    location_pincode: str
    moisture_content: Optional[float] = None

class PricePrediction(BaseModel):
    estimated_price_per_ton: float
    total_value: float
    confidence_score: float
    sustainability_impact: dict

class OTPRequest(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp: str

@app.post("/api/send-otp")
async def send_otp(request: OTPRequest):
    """
    Generates and 'sends' an OTP.
    For hackathon demo, we return the OTP in the response.
    """
    otp = str(random.randint(1000, 9999))
    logger.info(f"Generated OTP for {request.phone_number}: {otp}")
    return {"status": "success", "message": "OTP sent successfully", "otp": otp} # Returning OTP for demo

@app.post("/api/verify-otp")
async def verify_otp(request: OTPVerify):
    """
    Verifies the OTP.
    For hackathon demo, accepts '1234' or any 4-digit code if we aren't storing state.
    """
    # In a real app, check against DB/Redis
    if len(request.otp) == 4 and request.otp.isdigit():
         return {"status": "success", "message": "OTP verified", "token": "mock-jwt-token"}
    
    raise HTTPException(status_code=400, detail="Invalid OTP")

# Mock AI Logic (Replace with XGBoost model later)
def predict_price(item: WasteItem) -> PricePrediction:
    base_prices = {
        "rice_straw": 2200,      # Low demand, hard to process
        "wheat_stubble": 4500,   # High demand (Easy fodder)
        "sugarcane_trash": 3200  # Biofuel
    }
    
    base = base_prices.get(item.waste_type, 2000)
    
    # "AI" adjustments based on location/qty
    # Bulk bonus
    multiplier = 1.05 if item.quantity > 10 else 1.0
    
    # Location penalty (mock logic)
    # real implementation would calculate distance to nearest industry
    
    final_price_per_ton = base * multiplier
    
    return PricePrediction(
        estimated_price_per_ton=final_price_per_ton,
        total_value=final_price_per_ton * item.quantity,
        confidence_score=0.92,
        sustainability_impact={
            "co2_saved_kg": item.quantity * 1500,  # 1 ton straw burn ~ 1.5 ton CO2
            "soil_nitrogen_retained_kg": item.quantity * 4.5
        }
    )

@app.post("/api/predict-price", response_model=PricePrediction)
async def get_valuation(item: WasteItem):
    """
    Returns AI-driven market valuation for agricultural waste.
    """
    try:
        return predict_price(item)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/classify-waste")
async def classify_waste(file: UploadFile = File(...)):
    """
    Classify agricultural waste from uploaded image.
    
    Returns:
        - predicted_class: Type of waste (e.g., rice_straw)
        - display_name: Human-readable name
        - confidence: Prediction confidence (0-1)
        - industrial_uses: List of industrial reuse options
        - environmental_benefits: CO2, nitrogen, water savings
        - price_range: Estimated market value per ton
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.content_type}. Please upload an image."
            )
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if len(image_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large ({len(image_bytes)} bytes). Maximum size is 10MB."
            )
        
        # Get classifier and make prediction
        classifier = get_classifier()
        result = classifier.predict(image_bytes)
        
        logger.info(
            f"Classified waste as {result['display_name']} "
            f"with {result['confidence']:.2%} confidence"
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error classifying waste: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )

@app.post("/api/classify-waste-top-k")
async def classify_waste_top_k(file: UploadFile = File(...), k: int = 3):
    """
    Get top-k waste classification predictions.
    
    Args:
        file: Uploaded image file
        k: Number of top predictions to return (default: 3)
    
    Returns:
        List of top predictions sorted by confidence
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.content_type}. Please upload an image."
            )
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Get classifier and make predictions
        classifier = get_classifier()
        results = classifier.predict_top_k(image_bytes, k=k)
        
        return {"predictions": results}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in top-k classification: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )


@app.get("/api/leaderboard")
async def get_leaderboard():
    """
    Returns the top farmers ranked by Green Score.
    Mock data for demo.
    """
    return {
        "leaderboard": [
            {
                "id": "farmer-1",
                "rank": 1, "name": "Rajesh Kumar", "location": "Punjab",
                "green_score": 950, "co2_saved": "12.5 Tons", "waste_recycled": "45 Tons", "badge": "Eco-Warrior"
            },
            {
                "id": "farmer-2",
                "rank": 2, "name": "Sunita Devi", "location": "Haryana",
                "green_score": 880, "co2_saved": "10.2 Tons", "waste_recycled": "38 Tons", "badge": "Soil Guardian"
            },
            {
                "id": "farmer-3",
                "rank": 3, "name": "Vikram Singh", "location": "UP",
                "green_score": 820, "co2_saved": "9.1 Tons", "waste_recycled": "32 Tons", "badge": "Green Hero"
            },
            {
                "id": "farmer-4",
                "rank": 4, "name": "Amandeep Singh", "location": "Punjab",
                "green_score": 750, "co2_saved": "8.0 Tons", "waste_recycled": "28 Tons", "badge": "Earth Saver"
            },
            {
                "id": "farmer-5",
                "rank": 5, "name": "Meera Reddy", "location": "Telangana",
                "green_score": 710, "co2_saved": "7.5 Tons", "waste_recycled": "25 Tons", "badge": "Nature Friend"
            },
            {
                "id": "farmer-6",
                "rank": 6, "name": "Ramesh Patel", "location": "Gujarat",
                "green_score": 680, "co2_saved": "6.8 Tons", "waste_recycled": "22 Tons", "badge": "Sustainability Star"
            }
        ],
        "user_rank": {
            "id": "current-user",
            "rank": 142, "name": "You", "green_score": 320,
            "co2_saved": "2.1 Tons", "waste_recycled": "8 Tons"
        }
    }
async def health_check():
    return {
        "status": "healthy",
        "model_version": "v1.0.2",
        "waste_classifier": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
