import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SahayakAI Backend"
    API_V1_STR: str = "/api"
    
    # MongoDB Configuration
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "sahayak_ai")
    
    # AI (Groq API)
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama3-70b-8192")
    
    # Upload Settings
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    
    # Clerk Authentication settings
    CLERK_API_KEY: Optional[str] = os.getenv("CLERK_API_KEY", "")
    
    class Config:
        case_sensitive = True

# Workaround for pydantic_settings if not installed, we can fall back to standard Os envs
try:
    settings = Settings()
except Exception:
    class FallbackSettings:
        PROJECT_NAME = "SahayakAI Backend"
        API_V1_STR = "/api"
        MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        DATABASE_NAME = os.getenv("DATABASE_NAME", "sahayak_ai")
        GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
        GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
        CLERK_API_KEY = os.getenv("CLERK_API_KEY", "")
    settings = FallbackSettings()
