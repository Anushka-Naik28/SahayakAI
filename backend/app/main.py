import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.endpoints import router as api_router
from backend.app.core.db import get_db
from backend.app.core.seeds import seed_schemes
from backend.app.core.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sahayak_main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Citizen Copilot Backend for welfare scheme discovery, eligibility, tracking & OCR validation",
    version="1.0.0"
)

# CORS configuration for local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_db_client():
    logger.info("Starting up FastAPI Backend server...")
    # Get database instance
    db = get_db()
    # Seed the database
    seed_schemes(db)
    
@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "features": [
            "AI Recommendations",
            "Eligibility Scoring",
            "Tesseract OCR Processing",
            "Context-aware Chatbot",
            "Application Tracking",
            "Voice Assistant Mocking"
        ]
    }
