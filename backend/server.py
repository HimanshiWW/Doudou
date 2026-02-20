from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from bson import ObjectId

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper function for ObjectId serialization
def serialize_doc(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

# ==================== MODELS ====================

class LocationCreate(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    location_type: str  # cafe, restaurant, park, library, etc.
    privacy_level: str  # private, semi-private, public
    requires_purchase: bool = False
    description: Optional[str] = None
    amenities: List[str] = []  # changing_table, high_chairs, quiet_area, etc.
    photos: List[str] = []  # base64 encoded images
    owner_id: Optional[str] = None

class LocationResponse(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    location_type: str
    privacy_level: str
    requires_purchase: bool
    description: Optional[str] = None
    amenities: List[str] = []
    photos: List[str] = []
    owner_id: Optional[str] = None
    average_rating: float = 0.0
    total_reviews: int = 0
    created_at: datetime
    verified: bool = False

class ReviewCreate(BaseModel):
    location_id: str
    staff_rating: int  # 1-5
    comfort_rating: int  # 1-5
    privacy_rating: int  # 1-5
    safety_rating: int  # 1-5
    would_return: bool
    comment: Optional[str] = None
    issues: List[str] = []  # red flags
    photos: List[str] = []  # base64 encoded images
    anonymous: bool = False
    reviewer_name: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    location_id: str
    staff_rating: int
    comfort_rating: int
    privacy_rating: int
    safety_rating: int
    overall_rating: float
    would_return: bool
    comment: Optional[str] = None
    issues: List[str] = []
    photos: List[str] = []
    anonymous: bool
    reviewer_name: Optional[str] = None
    helpful_count: int = 0
    created_at: datetime

class SavedLocationCreate(BaseModel):
    location_id: str
    user_id: str = "default_user"  # For MVP, we use a default user

# ==================== LOCATION ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Doudou API - Breastfeeding Location Finder"}

@api_router.post("/locations", response_model=LocationResponse)
async def create_location(location: LocationCreate):
    """Create a new nursing-friendly location"""
    location_dict = location.dict()
    location_dict["created_at"] = datetime.utcnow()
    location_dict["verified"] = False
    location_dict["average_rating"] = 0.0
    location_dict["total_reviews"] = 0
    
    result = await db.locations.insert_one(location_dict)
    location_dict["id"] = str(result.inserted_id)
    if "_id" in location_dict:
        del location_dict["_id"]
    
    return LocationResponse(**location_dict)

@api_router.get("/locations", response_model=List[LocationResponse])
async def get_locations(
    location_type: Optional[str] = None,
    privacy_level: Optional[str] = None,
    free_only: bool = False,
    verified_only: bool = False,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: float = 5.0
):
    """Get all locations with optional filters"""
    query = {}
    
    if location_type:
        query["location_type"] = location_type
    if privacy_level:
        query["privacy_level"] = privacy_level
    if free_only:
        query["requires_purchase"] = False
    if verified_only:
        query["verified"] = True
    
    locations = await db.locations.find(query).to_list(100)
    
    result = []
    for loc in locations:
        loc_data = serialize_doc(loc)
        result.append(LocationResponse(**loc_data))
    
    return result

@api_router.get("/locations/{location_id}", response_model=LocationResponse)
async def get_location(location_id: str):
    """Get a specific location by ID"""
    try:
        location = await db.locations.find_one({"_id": ObjectId(location_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    loc_data = serialize_doc(location)
    return LocationResponse(**loc_data)

@api_router.delete("/locations/{location_id}")
async def delete_location(location_id: str):
    """Delete a location"""
    try:
        result = await db.locations.delete_one({"_id": ObjectId(location_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return {"message": "Location deleted successfully"}

# ==================== REVIEW ENDPOINTS ====================

@api_router.post("/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate):
    """Create a new review for a location"""
    # Verify location exists
    try:
        location = await db.locations.find_one({"_id": ObjectId(review.location_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid location ID")
    
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Calculate overall rating
    overall_rating = (review.staff_rating + review.comfort_rating + 
                     review.privacy_rating + review.safety_rating) / 4.0
    
    review_dict = review.dict()
    review_dict["overall_rating"] = round(overall_rating, 1)
    review_dict["helpful_count"] = 0
    review_dict["created_at"] = datetime.utcnow()
    
    result = await db.reviews.insert_one(review_dict)
    review_dict["id"] = str(result.inserted_id)
    
    # Update location's average rating
    all_reviews = await db.reviews.find({"location_id": review.location_id}).to_list(1000)
    if all_reviews:
        avg_rating = sum(r["overall_rating"] for r in all_reviews) / len(all_reviews)
        await db.locations.update_one(
            {"_id": ObjectId(review.location_id)},
            {"$set": {
                "average_rating": round(avg_rating, 1),
                "total_reviews": len(all_reviews)
            }}
        )
    
    return ReviewResponse(**review_dict)

@api_router.get("/reviews/{location_id}", response_model=List[ReviewResponse])
async def get_reviews(location_id: str):
    """Get all reviews for a location"""
    reviews = await db.reviews.find({"location_id": location_id}).sort("created_at", -1).to_list(100)
    
    result = []
    for review in reviews:
        review_data = serialize_doc(review)
        result.append(ReviewResponse(**review_data))
    
    return result

@api_router.post("/reviews/{review_id}/helpful")
async def mark_review_helpful(review_id: str):
    """Mark a review as helpful"""
    try:
        result = await db.reviews.update_one(
            {"_id": ObjectId(review_id)},
            {"$inc": {"helpful_count": 1}}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid review ID")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return {"message": "Review marked as helpful"}

# ==================== SAVED LOCATIONS ENDPOINTS ====================

@api_router.post("/saved")
async def save_location(data: SavedLocationCreate):
    """Save a location to favorites"""
    # Check if already saved
    existing = await db.saved_locations.find_one({
        "location_id": data.location_id,
        "user_id": data.user_id
    })
    
    if existing:
        return {"message": "Location already saved", "saved": True}
    
    await db.saved_locations.insert_one({
        "location_id": data.location_id,
        "user_id": data.user_id,
        "saved_at": datetime.utcnow()
    })
    
    return {"message": "Location saved", "saved": True}

@api_router.delete("/saved/{location_id}")
async def unsave_location(location_id: str, user_id: str = "default_user"):
    """Remove a location from favorites"""
    await db.saved_locations.delete_one({
        "location_id": location_id,
        "user_id": user_id
    })
    
    return {"message": "Location removed from saved", "saved": False}

@api_router.get("/saved", response_model=List[LocationResponse])
async def get_saved_locations(user_id: str = "default_user"):
    """Get all saved locations for a user"""
    saved = await db.saved_locations.find({"user_id": user_id}).to_list(100)
    saved_ids = [s["location_id"] for s in saved]
    
    locations = []
    for loc_id in saved_ids:
        try:
            loc = await db.locations.find_one({"_id": ObjectId(loc_id)})
            if loc:
                loc_data = serialize_doc(loc)
                locations.append(LocationResponse(**loc_data))
        except:
            continue
    
    return locations

@api_router.get("/saved/check/{location_id}")
async def check_if_saved(location_id: str, user_id: str = "default_user"):
    """Check if a location is saved"""
    saved = await db.saved_locations.find_one({
        "location_id": location_id,
        "user_id": user_id
    })
    
    return {"saved": saved is not None}

# ==================== SEED DATA ENDPOINT ====================

@api_router.post("/seed")
async def seed_data():
    """Seed the database with sample locations"""
    # Clear existing data
    await db.locations.delete_many({})
    await db.reviews.delete_many({})
    await db.saved_locations.delete_many({})
    
    sample_locations = [
        {
            "name": "Le Petit Jardin Café",
            "address": "123 Rue de la Paix, Paris 75001",
            "latitude": 48.8566,
            "longitude": 2.3522,
            "location_type": "cafe",
            "privacy_level": "semi-private",
            "requires_purchase": True,
            "description": "Cozy café with a private nursing corner and changing facilities.",
            "amenities": ["changing_table", "high_chairs", "quiet_area", "wifi"],
            "photos": [],
            "verified": True,
            "average_rating": 4.5,
            "total_reviews": 128,
            "created_at": datetime.utcnow()
        },
        {
            "name": "Family Park Gardens",
            "address": "45 Avenue des Enfants, Paris 75008",
            "latitude": 48.8606,
            "longitude": 2.3376,
            "location_type": "park",
            "privacy_level": "public",
            "requires_purchase": False,
            "description": "Beautiful park with shaded seating areas perfect for nursing.",
            "amenities": ["benches", "shade", "playground", "restrooms"],
            "photos": [],
            "verified": True,
            "average_rating": 4.2,
            "total_reviews": 85,
            "created_at": datetime.utcnow()
        },
        {
            "name": "Mama's Kitchen Restaurant",
            "address": "78 Rue Saint-Honoré, Paris 75001",
            "latitude": 48.8636,
            "longitude": 2.3311,
            "location_type": "restaurant",
            "privacy_level": "private",
            "requires_purchase": True,
            "description": "Family-friendly restaurant with private nursing rooms.",
            "amenities": ["private_room", "changing_table", "high_chairs", "kids_menu"],
            "photos": [],
            "verified": True,
            "average_rating": 4.8,
            "total_reviews": 256,
            "created_at": datetime.utcnow()
        },
        {
            "name": "City Library - Nursing Room",
            "address": "15 Place de la République, Paris 75011",
            "latitude": 48.8674,
            "longitude": 2.3646,
            "location_type": "library",
            "privacy_level": "private",
            "requires_purchase": False,
            "description": "Quiet library with dedicated nursing room and baby corner.",
            "amenities": ["private_room", "comfortable_seating", "air_conditioning", "wifi"],
            "photos": [],
            "verified": True,
            "average_rating": 4.6,
            "total_reviews": 92,
            "created_at": datetime.utcnow()
        },
        {
            "name": "Baby Café Lounge",
            "address": "200 Boulevard Haussmann, Paris 75009",
            "latitude": 48.8738,
            "longitude": 2.3285,
            "location_type": "cafe",
            "privacy_level": "semi-private",
            "requires_purchase": True,
            "description": "Café designed for new moms with play area and nursing booths.",
            "amenities": ["nursing_booths", "play_area", "changing_table", "stroller_parking"],
            "photos": [],
            "verified": True,
            "average_rating": 4.7,
            "total_reviews": 180,
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.locations.insert_many(sample_locations)
    
    # Add some sample reviews
    locations = await db.locations.find().to_list(10)
    
    sample_reviews = [
        {
            "location_id": str(locations[0]["_id"]),
            "staff_rating": 5,
            "comfort_rating": 4,
            "privacy_rating": 4,
            "safety_rating": 5,
            "overall_rating": 4.5,
            "would_return": True,
            "comment": "The back corner is perfect for breastfeeding! Staff were so patient when my little one had a meltdown.",
            "issues": [],
            "photos": [],
            "anonymous": False,
            "reviewer_name": "Sarah M.",
            "helpful_count": 24,
            "created_at": datetime.utcnow()
        },
        {
            "location_id": str(locations[0]["_id"]),
            "staff_rating": 4,
            "comfort_rating": 4,
            "privacy_rating": 3,
            "safety_rating": 4,
            "overall_rating": 3.75,
            "would_return": True,
            "comment": "Decent space, though it gets quite loud during the morning rush.",
            "issues": [],
            "photos": [],
            "anonymous": False,
            "reviewer_name": "Jessica W.",
            "helpful_count": 8,
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.reviews.insert_many(sample_reviews)
    
    return {"message": "Database seeded with sample data", "locations_count": len(sample_locations)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
