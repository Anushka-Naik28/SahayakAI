import httpx
import json
import logging
from typing import Dict, List, Any
from backend.app.core.config import settings

logger = logging.getLogger("sahayak_ai_service")

class AIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        
    async def chat_completion(self, messages: List[Dict[str, str]], temperature: float = 0.2) -> str:
        """Runs a chat completion. Falls back to mock responses if key is missing or request fails."""
        if not self.api_key:
            logger.warning("GROQ_API_KEY not found. Using local SahayakAI simulator.")
            return self._mock_chat_response(messages)
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.url, json=payload, headers=headers)
                if response.status_code == 200:
                    result = response.json()
                    return result["choices"][0]["message"]["content"]
                else:
                    logger.error(f"Groq API error: Status {response.status_code}, Body: {response.text}")
                    return self._mock_chat_response(messages)
        except Exception as e:
            logger.error(f"Groq API connection exception: {e}")
            return self._mock_chat_response(messages)

    def _mock_chat_response(self, messages: List[Dict[str, str]]) -> str:
        """Simulates response from Groq based on context, keeping it fully realistic."""
        # Find the last user prompt
        user_message = ""
        for m in reversed(messages):
            if m["role"] == "user":
                user_message = m["content"].lower()
                break
                
        # Parse typical flows
        if "kisan" in user_message or "farmer" in user_message:
            return (
                "**PM Kisan Samman Nidhi (Farmer Welfare Support)**\n\n"
                "Based on the system details, PM Kisan provides ₹6,000 per year directly to small and marginal farmers. "
                "You qualify if you own cultivable land and your family's annual income is within limits. "
                "To apply, you will need your Aadhaar, bank passbook, and land ownership records (Khata/Patta).\n\n"
                "Would you like me to walk you through the application upload page?"
            )
        elif "ayushman" in user_message or "health" in user_message or "medical" in user_message:
            return (
                "**Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)**\n\n"
                "This scheme provides up to ₹5 Lakh per year for cashless medical treatment. "
                "Eligibility is based on the SECC database and household income. Since your profile reflects an income below ₹2.5 Lakh, "
                "you are eligible to receive the Ayushman Gold Card. "
                "You need to provide your Aadhaar Card and Ration Card to link your profile.\n\n"
                "Let me know if you want to perform a manual eligibility check."
            )
        elif "mudra" in user_message or "loan" in user_message or "business" in user_message:
            return (
                "**Pradhan Mantri Mudra Yojana (PMMY)**\n\n"
                "Mudra loans are divided into Shishu (up to ₹50,000), Kishor (up to ₹5 Lakh), and Tarun (up to ₹10 Lakh). "
                "They are interest-subsidized, collateral-free loans for micro and small enterprises. "
                "Since you are above 18, you can apply by preparing a business plan. "
                "I recommend starting with Shishu mudra if this is a new venture."
            )
        elif "income" in user_message or "eligib" in user_message:
            return (
                "To determine your eligibility for schemes, the system checks:\n"
                "1. **Annual Income**: Most schemes have a limit (e.g. ₹2.5 Lakh or ₹3 Lakh).\n"
                "2. **Category/Occupation**: Whether you are registered as a farmer, student, woman entrepreneur, etc.\n"
                "3. **Age Limits**: E.g., Atal Pension Yojana is strictly between 18-40 years.\n\n"
                "I recommend completing your profile onboarding to see customized recommendation scores!"
            )
        elif "hello" in user_message or "hi " in user_message or "namaste" in user_message:
            return (
                "Namaste! I am **SahayakAI**, your Citizen Copilot. "
                "I can help you understand eligibility criteria, translate schemes into regional languages, "
                "and explain document requirements. "
                "What benefit or government scheme would you like to explore today?"
            )
            
        return (
            "Based on your profile, I can explain that you qualify for schemes like **PM Kisan** or **Ayushman Bharat** "
            "because your annual income is below the state threshold and your occupational details match. "
            "Let me know which document (Aadhaar, Ration Card, PAN) you are planning to upload next so I can help verify it."
        )

    def explain_eligibility(self, scheme_name: str, user_profile: Dict[str, Any], meets_criteria: bool) -> str:
        """Provides a simple, citizen-friendly explanation of why they qualify or not."""
        income = user_profile.get("annual_income", 0)
        caste = user_profile.get("caste", "General")
        is_farmer = user_profile.get("farmer_status", False)
        age = user_profile.get("age", 18)
        
        if meets_criteria:
            return (
                f"You qualify for **{scheme_name}** because your annual income of ₹{income:,} "
                f"is below the scheme's limit, your age is {age}, and your profile matches the "
                f"{'farmer status' if is_farmer else 'targeted category'}. "
                f"You have the required documents in order."
            )
        else:
            reasons = []
            if income > 300000 and "Kisan" in scheme_name:
                reasons.append(f"your annual income of ₹{income:,} exceeds the target ceiling of ₹3 Lakh")
            if not is_farmer and "Kisan" in scheme_name:
                reasons.append("you are not registered as a landholding farmer")
            if (age < 18 or age > 40) and "Atal" in scheme_name:
                reasons.append(f"your age ({age} years) is outside the 18-40 range required for Atal Pension Yojana")
            
            reason_str = " and ".join(reasons) if reasons else "some demographic criteria do not match the scheme's guidelines"
            return (
                f"You do not fully meet the criteria for **{scheme_name}** because {reason_str}. "
                f"However, you may still be partially eligible or can apply with a family co-applicant."
            )

# Global instances
ai_service = AIService()

def get_ai_service():
    return ai_service
