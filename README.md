# SahayakAI: Citizen Copilot

SahayakAI is an AI-powered Citizen Copilot for welfare scheme discovery, eligibility scoring, application tracking, and automated document OCR verification.

The project is split into a **FastAPI backend** and a **Next.js frontend**.

---

## Prerequisites

Before running the application, ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended)
- **Python** (v3.10 or higher recommended)
- **MongoDB** (Optional, falls back to a built-in **In-Memory Store** if MongoDB is not running or available)
- **Tesseract OCR** (Optional, required for full document OCR text extraction features)

---

## 🚀 Running the Application

For ease of development, you can start the backend and frontend services separately.

### 1. Backend Service (FastAPI)

The backend is built with FastAPI and runs on port `8000`.

1. Open a new terminal / command prompt.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Activate the Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
4. Run the FastAPI development server:
   ```bash
   python run.py
   ```
   The backend API will start at **[http://localhost:8000](http://localhost:8000)**.
   You can view the interactive OpenAPI documentation at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

> [!NOTE]
> If MongoDB is not running locally, the backend will output a warning: `MongoDB connection failed. Falling back to In-Memory storage.` and continue running perfectly using mock/in-memory data.

---

### 2. Frontend Service (Next.js)

The frontend is a Next.js web application built with React, TypeScript, and TailwindCSS.

1. Open a separate terminal / command prompt.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (if they are not already installed):
   ```bash
   npm install
   ```
4. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will start at **[http://localhost:3000](http://localhost:3000)**.

---

## 🛠️ Configuration & Environment Variables

If you want to configure third-party services like **Groq AI** (for AI chat/recommendations) or **MongoDB**, you can set up the configuration.

### Backend Configurations
You can create a `.env` file inside the `backend` folder with the following variables:

```ini
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=sahayak_ai

# Groq API (Optional, for LLM recommendation explanations)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama3-70b-8192

# Clerk Authentication (Optional)
CLERK_API_KEY=your-clerk-api-key
```

### Standalone / Mock Mode
If the backend is not running, the frontend will automatically detect the connection issue and switch to a **Standalone Mock Mode**. It uses preloaded welfare schemes (PM Kisan, Ayushman Bharat, PMAY, PM Mudra, APY, NSP) and simulates the eligibility check, OCR validation, and chatbots locally on the client side.
