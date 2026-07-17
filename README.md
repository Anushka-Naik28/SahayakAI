
# 🌐 SahayakAI: Citizen Copilot  

**SahayakAI** is an AI‑powered Citizen Copilot designed to simplify access to government welfare schemes.  
It helps citizens with:  
- 🔍 **Scheme Discovery** – Find relevant welfare programs.  
- 📊 **Eligibility Scoring** – Check if you qualify instantly.  
- 📑 **Application Tracking** – Monitor progress of submissions.  
- 🖹 **Automated Document OCR Verification** – Validate documents with AI‑driven OCR.  

---

## 🏗️ Architecture  

The project is split into two core services:  
- **Backend (FastAPI)** – Handles APIs, eligibility logic, OCR, and integrations.  
- **Frontend (Next.js)** – Provides a modern, responsive citizen dashboard with React, TypeScript, and TailwindCSS.  

---

## ⚙️ Tech Highlights  

- **Node.js v18+** and **Python v3.10+**  
- **MongoDB** (with fallback to in‑memory store)  
- **Tesseract OCR** for document text extraction  
- Optional integrations: **Groq AI** for LLM‑powered recommendations, **Clerk** for authentication  

---

## 📦 Deployment Modes  

- **Full Stack Mode** – Backend + Frontend connected with MongoDB and OCR.  
- **Standalone Mock Mode** – Frontend simulates welfare schemes (PM Kisan, Ayushman Bharat, PMAY, PM Mudra, APY, NSP) with local mock data when backend is unavailable.  

---
Live Demo Link: https://sahayak-ai-iota.vercel.app
