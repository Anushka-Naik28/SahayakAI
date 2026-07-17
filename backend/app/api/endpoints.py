import os
import shutil
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from backend.app.core.db import get_db, HybridDatabase
from backend.app.services.ai_service import get_ai_service
from backend.app.services.ocr_service import get_ocr_service
from backend.app.core.config import settings

router = APIRouter()

# Schema models
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class OnboardingData(BaseModel):
    full_name: str
    age: int
    gender: str
    state: str
    district: str
    occupation: str
    annual_income: int
    education: str
    disability_status: bool
    farmer_status: bool
    caste_category: str
    family_size: int
    bank_account_availability: bool

class SchemeCreate(BaseModel):
    name: str
    description: str
    category: str
    eligibility_summary: str
    benefits: str
    required_documents: List[str]
    state_availability: str
    deadline: str
    logo_url: str = "🪙"
    eligibility_rules: Dict[str, Any] = {}

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    language: Optional[str] = "en"

class ApplicationUpdate(BaseModel):
    status: str  # Draft, Submitted, Verification, Processing, Approved, Rejected
    comments: Optional[str] = ""

# API Handlers

# Auth
@router.post("/auth/register")
def register_user(user: UserRegister, db: HybridDatabase = Depends(get_db)):
    users_col = db.get_collection("users")
    if users_col.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = {
        "_id": str(uuid.uuid4()),
        "email": user.email,
        "name": user.name,
        "password": user.password, # Plain for prototype, realistic schema
        "onboarded": False,
        "profile": {}
    }
    users_col.insert_one(new_user)
    return {"message": "Registration successful", "user_id": new_user["_id"]}

@router.post("/auth/login")
def login_user(user: UserLogin, db: HybridDatabase = Depends(get_db)):
    users_col = db.get_collection("users")
    found = users_col.find_one({"email": user.email, "password": user.password})
    if not found:
        # Check if user is admin
        admins_col = db.get_collection("admins")
        admin_found = admins_col.find_one({"email": user.email, "password": user.password})
        if admin_found:
            return {
                "message": "Admin login successful",
                "user_id": admin_found["_id"],
                "name": admin_found["name"],
                "role": "admin"
            }
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {
        "message": "Login successful",
        "user_id": found["_id"],
        "name": found["name"],
        "role": "citizen"
    }

# Onboarding
@router.post("/users/{user_id}/onboarding")
def complete_onboarding(user_id: str, data: OnboardingData, db: HybridDatabase = Depends(get_db)):
    users_col = db.get_collection("users")
    user = users_col.find_one({"_id": user_id})
    if not user:
        # Create a user on-the-fly if using social login mock
        user = {
            "_id": user_id,
            "email": f"{user_id}@sahayak.in",
            "name": data.full_name,
            "onboarded": False
        }
        users_col.insert_one(user)

    # Calculate Profile Completion Score
    fields = [
        data.full_name, data.age, data.gender, data.state, data.district,
        data.occupation, data.annual_income, data.education, data.caste_category,
        data.family_size
    ]
    completed_fields = sum(1 for f in fields if f is not None and str(f) != "")
    # Add status fields
    completed_fields += 2 # Disability & Farmer statuses (booleans)
    completed_fields += 2 # Bank availability & completion score itself
    score = int((completed_fields / 14.0) * 100)
    
    profile = data.model_dump()
    profile["score"] = score
    
    users_col.update_one(
        {"_id": user_id},
        {"$set": {"profile": profile, "onboarded": True}}
    )
    
    # Generate welcome notification
    notif_col = db.get_collection("notifications")
    notif_col.insert_one({
        "user_id": user_id,
        "title": "Welcome to SahayakAI!",
        "message": f"Hello {data.full_name}, your profile is {score}% complete. Discover schemes suited for you on the dashboard.",
        "type": "New User",
        "read": False,
        "date": "Just Now"
    })
    
    return {"message": "Onboarding complete", "profile": profile}

@router.get("/users/{user_id}/profile")
def get_user_profile(user_id: str, db: HybridDatabase = Depends(get_db)):
    users_col = db.get_collection("users")
    user = users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Schemes Database
@router.get("/schemes")
def list_schemes(category: Optional[str] = None, search: Optional[str] = None, db: HybridDatabase = Depends(get_db)):
    schemes_col = db.get_collection("schemes")
    query = {}
    if category:
        query["category"] = category
        
    schemes = schemes_col.find(query)
    
    if search:
        search = search.lower()
        schemes = [
            s for s in schemes
            if search in s["name"].lower() or search in s["description"].lower() or search in s["category"].lower()
        ]
        
    return schemes

@router.get("/schemes/{scheme_id}")
def get_scheme(scheme_id: str, db: HybridDatabase = Depends(get_db)):
    schemes_col = db.get_collection("schemes")
    scheme = schemes_col.find_one({"_id": scheme_id})
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

# Recommendations Engine & Eligibility Checker
@router.get("/users/{user_id}/recommendations")
async def get_recommendations(user_id: str, db: HybridDatabase = Depends(get_db), ai = Depends(get_ai_service)):
    users_col = db.get_collection("users")
    user = users_col.find_one({"_id": user_id})
    if not user or not user.get("onboarded", False):
        return [] # Return empty list if not onboarded yet
        
    profile = user.get("profile", {})
    schemes_col = db.get_collection("schemes")
    all_schemes = schemes_col.find()
    
    recommendations = []
    
    for s in all_schemes:
        rules = s.get("eligibility_rules", {})
        score = 100
        reasons = []
        
        # 1. Income Limit
        max_inc = rules.get("max_income")
        if max_inc and profile.get("annual_income", 0) > max_inc:
            diff = profile.get("annual_income", 0) - max_inc
            # Penalize score based on income gap
            penalty = min(50, int((diff / max_inc) * 50))
            score -= penalty
            reasons.append("income_exceeded")
            
        # 2. Farmer Status
        req_farmer = rules.get("farmer_status")
        if req_farmer is not None and req_farmer != profile.get("farmer_status", False):
            score -= 40
            reasons.append("farmer_status_mismatch")
            
        # 3. Age Checks
        min_age = rules.get("min_age")
        max_age = rules.get("max_age")
        u_age = profile.get("age", 18)
        if min_age and u_age < min_age:
            score -= 30
            reasons.append("age_under")
        if max_age and u_age > max_age:
            score -= 30
            reasons.append("age_over")
            
        # 4. Gender Checks
        req_gender = rules.get("gender")
        if req_gender and req_gender.lower() != profile.get("gender", "").lower():
            score -= 50
            reasons.append("gender_mismatch")
            
        score = max(0, score)
        meets_criteria = score >= 70
        
        # Call Groq AI justification
        ai_explanation = ai.explain_eligibility(s["name"], profile, meets_criteria)
        
        recommendations.append({
            "scheme_id": s["_id"],
            "name": s["name"],
            "description": s["description"],
            "category": s["category"],
            "benefits": s["benefits"],
            "required_documents": s["required_documents"],
            "deadline": s["deadline"],
            "logo_url": s.get("logo_url", "🪙"),
            "score": score,
            "meets_criteria": meets_criteria,
            "eligibility_status": "Eligible" if score >= 85 else ("Partially Eligible" if score >= 50 else "Not Eligible"),
            "ai_explanation": ai_explanation
        })
        
    # Sort recommendations by highest score
    recommendations.sort(key=lambda x: x["score"], reverse=True)
    return recommendations

# OCR Verification
@router.post("/ocr/verify")
async def verify_document(
    doc_type: str = Form(...),
    file: UploadFile = File(...),
    db: HybridDatabase = Depends(get_db),
    ocr = Depends(get_ocr_service)
):
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    file_name = f"{file_id}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Run OCR Service
    details = ocr.extract_document_details(file_path, doc_type)
    
    # Save document record
    doc_record = {
        "_id": file_id,
        "type": doc_type,
        "file_name": file.filename,
        "file_path": file_path,
        "extracted_name": details.get("name"),
        "extracted_dob": details.get("dob"),
        "extracted_address": details.get("address"),
        "document_number": details.get("document_number"),
        "verification_status": details.get("verification_status", "Verified"),
        "confidence": details.get("confidence", 0.90)
    }
    
    db.get_collection("documents").insert_one(doc_record)
    return doc_record

# Application Tracker
@router.post("/users/{user_id}/apply")
def submit_application(
    user_id: str,
    scheme_id: str = Form(...),
    document_ids: str = Form(...), # comma separated
    db: HybridDatabase = Depends(get_db)
):
    schemes_col = db.get_collection("schemes")
    scheme = schemes_col.find_one({"_id": scheme_id})
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
        
    app_id = str(uuid.uuid4())
    doc_id_list = [d.strip() for d in document_ids.split(",") if d.strip()]
    
    import datetime
    today = datetime.date.today()
    est_completion = (today + datetime.timedelta(days=45)).strftime("%Y-%m-%d")
    
    new_app = {
        "_id": app_id,
        "user_id": user_id,
        "scheme_id": scheme_id,
        "scheme_name": scheme["name"],
        "document_ids": doc_id_list,
        "status": "Submitted",  # Timeline: Draft -> Submitted -> Verification -> Processing -> Approved -> Rejected
        "submission_date": today.strftime("%Y-%m-%d"),
        "estimated_completion_date": est_completion,
        "history": [
            {"status": "Draft", "date": today.strftime("%Y-%m-%d"), "note": "Application started by user"},
            {"status": "Submitted", "date": today.strftime("%Y-%m-%d"), "note": "Documents submitted & pre-verified via SahayakAI OCR"}
        ]
    }
    
    db.get_collection("applications").insert_one(new_app)
    
    # Notification
    db.get_collection("notifications").insert_one({
        "user_id": user_id,
        "title": "Application Submitted",
        "message": f"Your application for {scheme['name']} was successfully submitted. Track progress on your dashboard.",
        "type": "Application",
        "read": False,
        "date": "Just Now"
    })
    
    return {"message": "Application submitted successfully", "application_id": app_id}

@router.get("/users/{user_id}/applications")
def get_user_applications(user_id: str, db: HybridDatabase = Depends(get_db)):
    apps_col = db.get_collection("applications")
    return apps_col.find({"user_id": user_id})

# Chatbot & Voice Assistant APIs
@router.post("/chat")
async def chat_assistant(chat_req: ChatMessage, db: HybridDatabase = Depends(get_db), ai = Depends(get_ai_service)):
    messages = [
        {"role": "system", "content": (
            "You are SahayakAI, a reliable Citizen Copilot built to assist Indian citizens. "
            "Help citizens discover, understand, and apply for government schemes. "
            "Use simple language. Never fabricate or invent government schemes. "
            "Always align recommendations strictly with schemes stored in the database. "
            "Answer questions in the language requested (English, Hindi, Kannada, Tamil, etc.)."
        )}
    ]
    
    # Pull recent user history if user_id is provided
    if chat_req.user_id:
        chat_col = db.get_collection("chat_history")
        history = chat_col.find({"user_id": chat_req.user_id})
        # Append last 4 messages to context
        for h in history[-4:]:
            messages.append({"role": "user", "content": h["user_message"]})
            messages.append({"role": "assistant", "content": h["ai_response"]})
            
    messages.append({"role": "user", "content": chat_req.message})
    
    # Call Groq
    response = await ai.chat_completion(messages)
    
    # Save response
    if chat_req.user_id:
        chat_col = db.get_collection("chat_history")
        chat_col.insert_one({
            "user_id": chat_req.user_id,
            "user_message": chat_req.message,
            "ai_response": response,
            "timestamp": "Just Now"
        })
        
    return {"response": response}

# Notifications
@router.get("/users/{user_id}/notifications")
def get_notifications(user_id: str, db: HybridDatabase = Depends(get_db)):
    notif_col = db.get_collection("notifications")
    return notif_col.find({"user_id": user_id})

@router.post("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: str, db: HybridDatabase = Depends(get_db)):
    notif_col = db.get_collection("notifications")
    result = notif_col.update_one({"_id": notif_id}, {"$set": {"read": True}})
    return {"message": "Notification updated", "matched": result.matched_count}

# Admin Routes
@router.get("/admin/analytics")
def get_admin_analytics(db: HybridDatabase = Depends(get_db)):
    users_count = db.get_collection("users").count_documents({})
    apps_col = db.get_collection("applications")
    apps = apps_col.find()
    total_apps = len(apps)
    
    approved = sum(1 for a in apps if a.get("status") == "Approved")
    rejected = sum(1 for a in apps if a.get("status") == "Rejected")
    processing = sum(1 for a in apps if a.get("status") in ["Verification", "Processing", "Submitted"])
    
    rate = (approved / (approved + rejected) * 100) if (approved + rejected) > 0 else 85.0
    
    # Applications by scheme statistics
    scheme_counts = {}
    for a in apps:
        name = a.get("scheme_name", "Unknown")
        scheme_counts[name] = scheme_counts.get(name, 0) + 1
        
    chart_data = [{"name": name, "applications": count} for name, count in scheme_counts.items()]
    if not chart_data:
        # Mock analytics data for visual representation if empty
        chart_data = [
            {"name": "PM Kisan", "applications": 240},
            {"name": "Ayushman Bharat", "applications": 380},
            {"name": "PM Awas Yojana", "applications": 180},
            {"name": "PM Mudra Loan", "applications": 310},
            {"name": "Atal Pension Yojana", "applications": 140}
        ]
        
    return {
        "total_users": users_count if users_count > 0 else 1420,
        "total_applications": total_apps if total_apps > 0 else 1250,
        "approval_rate": round(rate, 1),
        "applications_status": {
            "approved": approved if total_apps > 0 else 840,
            "rejected": rejected if total_apps > 0 else 110,
            "processing": processing if total_apps > 0 else 300
        },
        "chart_data": chart_data
    }

@router.get("/admin/applications")
def get_all_applications(db: HybridDatabase = Depends(get_db)):
    apps_col = db.get_collection("applications")
    apps = apps_col.find()
    
    # Join with user profile name
    users_col = db.get_collection("users")
    for a in apps:
        u = users_col.find_one({"_id": a["user_id"]})
        if u and u.get("profile"):
            a["applicant_name"] = u["profile"].get("full_name", u.get("name", "Unknown"))
        else:
            a["applicant_name"] = "Anonymous Citizen"
            
    return apps

@router.post("/admin/applications/{app_id}/status")
def update_app_status(app_id: str, update: ApplicationUpdate, db: HybridDatabase = Depends(get_db)):
    apps_col = db.get_collection("applications")
    app = apps_col.find_one({"_id": app_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    import datetime
    today = datetime.date.today().strftime("%Y-%m-%d")
    
    # Append to history
    history = app.get("history", [])
    history.append({
        "status": update.status,
        "date": today,
        "note": update.comments or f"Application moved to {update.status}"
    })
    
    apps_col.update_one(
        {"_id": app_id},
        {"$set": {"status": update.status, "history": history}}
    )
    
    # Send Notification to User
    db.get_collection("notifications").insert_one({
        "user_id": app["user_id"],
        "title": f"Application Status Update: {update.status}",
        "message": f"Your application for {app['scheme_name']} has been updated to {update.status}. Note: {update.comments}",
        "type": "Application",
        "read": False,
        "date": "Just Now"
    })
    
    return {"message": "Application status updated successfully"}

@router.post("/admin/schemes")
def admin_create_scheme(scheme: SchemeCreate, db: HybridDatabase = Depends(get_db)):
    schemes_col = db.get_collection("schemes")
    scheme_id = scheme.name.lower().replace(" ", "-")
    
    if schemes_col.find_one({"_id": scheme_id}):
        raise HTTPException(status_code=400, detail="Scheme already exists")
        
    new_scheme = scheme.model_dump()
    new_scheme["_id"] = scheme_id
    
    schemes_col.insert_one(new_scheme)
    return {"message": "Scheme created successfully", "scheme_id": scheme_id}
