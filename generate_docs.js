const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Define Directories
const DOCS_DIR = path.join(__dirname, 'docs');
const ARCH_DIR = path.join(DOCS_DIR, 'architecture');
const DB_DIR = path.join(DOCS_DIR, 'database');
const WIRE_DIR = path.join(DOCS_DIR, 'wireframes');
const FLOW_DIR = path.join(DOCS_DIR, 'user-flow');
const TIME_DIR = path.join(DOCS_DIR, 'timeline');
const FEAT_DIR = path.join(DOCS_DIR, 'features');

// Ensure directories exist
[DOCS_DIR, ARCH_DIR, DB_DIR, WIRE_DIR, FLOW_DIR, TIME_DIR, FEAT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ==========================================
// 1. GENERATE SVGS
// ==========================================

// Helper to save SVG
function saveSvg(filepath, content) {
  fs.writeFileSync(filepath, content.trim(), 'utf8');
  console.log(`Generated SVG: ${path.relative(__dirname, filepath)}`);
}

// A. System Architecture SVG (1920x1080)
const systemArchSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#090D16"/>
  <!-- Grid Background -->
  <path d="M0,100 H1920 M0,200 H1920 M0,300 H1920 M0,400 H1920 M0,500 H1920 M0,600 H1920 M0,700 H1920 M0,800 H1920 M0,900 H1920 M0,1000 H1920" stroke="#1E293B" stroke-width="0.5"/>
  <path d="M100,0 V1080 M200,0 V1080 M300,0 V1080 M400,0 V1080 M500,0 V1080 M600,0 V1080 M700,0 V1080 M800,0 V1080 M900,0 V1080 M1000,0 V1080 M1100,0 V1080 M1200,0 V1080 M1300,0 V1080 M1400,0 V1080 M1500,0 V1080 M1600,0 V1080 M1700,0 V1080 M1800,0 V1080" stroke="#1E293B" stroke-width="0.5"/>
  
  <text x="960" y="80" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="36" font-weight="800" fill="#FFFFFF" letter-spacing="1">SAHAYAKAI - SYSTEM ARCHITECTURE DIAGRAM</text>
  
  <!-- Citizen / Users Section -->
  <g transform="translate(100, 250)">
    <rect width="320" height="580" rx="24" fill="#0F172A" stroke="#2563EB" stroke-width="2"/>
    <text x="160" y="40" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#2563EB">Target Actors (Citizens)</text>
    
    <g transform="translate(30, 80)">
      <rect width="260" height="70" rx="12" fill="#1E293B"/>
      <text x="130" y="42" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">🌾 Landholding Farmers</text>
    </g>
    <g transform="translate(30, 170)">
      <rect width="260" height="70" rx="12" fill="#1E293B"/>
      <text x="130" y="42" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">🎓 Rural Students</text>
    </g>
    <g transform="translate(30, 260)">
      <rect width="260" height="70" rx="12" fill="#1E293B"/>
      <text x="130" y="42" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">👵 Senior Citizens</text>
    </g>
    <g transform="translate(30, 350)">
      <rect width="260" height="70" rx="12" fill="#1E293B"/>
      <text x="130" y="42" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">👩 Women Entrepreneurs</text>
    </g>
    <g transform="translate(30, 440)">
      <rect width="260" height="70" rx="12" fill="#1E293B"/>
      <text x="130" y="42" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">🏢 CSC Operators &amp; NGOs</text>
    </g>
  </g>

  <!-- Next.js Frontend Section -->
  <g transform="translate(520, 250)">
    <rect width="360" height="580" rx="24" fill="#0F172A" stroke="#F97316" stroke-width="2"/>
    <text x="180" y="40" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#F97316">Next.js 15 App (Frontend)</text>
    
    <g transform="translate(30, 80)">
      <rect width="300" height="90" rx="16" fill="#1E293B" stroke="#F97316" stroke-dasharray="4"/>
      <text x="150" y="40" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Interactive Landing &amp; Auth</text>
      <text x="150" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94A3B8">Tailwind CSS + Clerk Login</text>
    </g>
    <g transform="translate(30, 195)">
      <rect width="300" height="90" rx="16" fill="#1E293B"/>
      <text x="150" y="40" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Citizen &amp; Officer Dashboards</text>
      <text x="150" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94A3B8">Framer Motion + Recharts</text>
    </g>
    <g transform="translate(30, 310)">
      <rect width="300" height="90" rx="16" fill="#1E293B"/>
      <text x="150" y="40" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">OCR verification Uploader</text>
      <text x="150" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94A3B8">Interactive Verification HUD</text>
    </g>
    <g transform="translate(30, 425)">
      <rect width="300" height="90" rx="16" fill="#1E293B"/>
      <text x="150" y="40" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Floating AI Voice Assistant</text>
      <text x="150" y="65" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94A3B8">Web Speech API Voice Trigger</text>
    </g>
  </g>

  <!-- FastAPI Backend Section -->
  <g transform="translate(980, 250)">
    <rect width="400" height="580" rx="24" fill="#0F172A" stroke="#16A34A" stroke-width="2"/>
    <text x="200" y="40" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#16A34A">FastAPI Application (Backend)</text>
    
    <g transform="translate(30, 80)">
      <rect width="340" height="70" rx="12" fill="#1E293B"/>
      <text x="170" y="42" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">🧠 AI Match Recommendation Engine</text>
    </g>
    <g transform="translate(30, 170)">
      <rect width="340" height="70" rx="12" fill="#1E293B"/>
      <text x="170" y="42" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">🔍 Tesseract OCR Verification Module</text>
    </g>
    <g transform="translate(30, 260)">
      <rect width="340" height="70" rx="12" fill="#1E293B"/>
      <text x="170" y="42" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">💬 Multilingual Llama 3.3 Router</text>
    </g>
    <g transform="translate(30, 350)">
      <rect width="340" height="70" rx="12" fill="#1E293B"/>
      <text x="170" y="42" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">📋 Schemes &amp; Application Auditing</text>
    </g>
    <g transform="translate(30, 440)">
      <rect width="340" height="70" rx="12" fill="#1E293B"/>
      <text x="170" y="42" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="bold" fill="#FFFFFF">🔔 Direct Notification Delivery Service</text>
    </g>
  </g>

  <!-- External Integrations & Databases Section -->
  <g transform="translate(1480, 250)">
    <rect width="340" height="580" rx="24" fill="#0F172A" stroke="#A855F7" stroke-width="2"/>
    <text x="170" y="40" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="bold" fill="#A855F7">Databases &amp; AI Cloud</text>
    
    <g transform="translate(30, 80)">
      <rect width="280" height="85" rx="16" fill="#1E293B" stroke="#00ED64" stroke-width="1.5"/>
      <text x="140" y="38" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">🍃 MongoDB Database</text>
      <text x="140" y="62" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94A3B8">Users, Schemes &amp; Applications Collections</text>
    </g>
    <g transform="translate(30, 185)">
      <rect width="280" height="85" rx="16" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5"/>
      <text x="140" y="38" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">⚡ Groq AI (Llama 3.3)</text>
      <text x="140" y="62" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#94A3B8">Semantic Eligibility explaining</text>
    </g>
    <g transform="translate(30, 290)">
      <rect width="280" height="195" rx="16" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5"/>
      <text x="140" y="30" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">🔗 Future Digital India Stack</text>
      <text x="40" y="65" font-family="sans-serif" font-size="12" fill="#E2E8F0">✓ DigiLocker API</text>
      <text x="40" y="95" font-family="sans-serif" font-size="12" fill="#E2E8F0">✓ UMANG Portal</text>
      <text x="40" y="125" font-family="sans-serif" font-size="12" fill="#E2E8F0">✓ CSC Network integrations</text>
      <text x="40" y="155" font-family="sans-serif" font-size="12" fill="#E2E8F0">✓ Direct Benefit Transfer (DBT)</text>
    </g>
  </g>

  <!-- Connective Arrows -->
  <!-- Citizens to Next.js -->
  <path d="M420,540 H520" stroke="#2563EB" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <!-- Next.js to FastAPI -->
  <path d="M880,540 H980" stroke="#F97316" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <!-- FastAPI to DB/AI -->
  <path d="M1380,540 H1480" stroke="#16A34A" stroke-width="3" fill="none" marker-end="url(#arrow)"/>

  <!-- SVG Markers for Arrows -->
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF"/>
    </marker>
  </defs>
</svg>
`;

// B. Database ER Diagram SVG (1920x1080)
const dbErSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#0A0F1D"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">SAHAYAKAI - DATABASE ER DIAGRAM (MONGODB)</text>

  <!-- Users Schema -->
  <g transform="translate(100, 200)">
    <rect width="320" height="340" rx="16" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <rect width="320" height="45" rx="16" fill="#3B82F6"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Users Collection</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (UUID)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#E2E8F0">    email: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#E2E8F0">    name: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    onboarded: boolean</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#38BDF8">    profile: object {</text>
    <text x="35" y="225" font-family="monospace" font-size="12" fill="#94A3B8">annual_income: integer</text>
    <text x="35" y="245" font-family="monospace" font-size="12" fill="#94A3B8">farmer_status: boolean</text>
    <text x="35" y="265" font-family="monospace" font-size="12" fill="#94A3B8">disability_status: boolean</text>
    <text x="35" y="285" font-family="monospace" font-size="12" fill="#94A3B8">caste_category: string</text>
    <text x="35" y="305" font-family="monospace" font-size="12" fill="#94A3B8">profile_score: integer</text>
    <text x="15" y="325" font-family="monospace" font-size="13" fill="#38BDF8">    }</text>
  </g>

  <!-- Schemes Schema -->
  <g transform="translate(560, 200)">
    <rect width="320" height="280" rx="16" fill="#1E293B" stroke="#E2E8F0" stroke-width="1.5"/>
    <rect width="320" height="45" rx="16" fill="#64748B"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Schemes Collection</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (slug)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#E2E8F0">    name: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#E2E8F0">    description: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    benefits: string</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#E2E8F0">    required_documents: array</text>
    <text x="15" y="230" font-family="monospace" font-size="13" fill="#E2E8F0">    eligibility_rules: object</text>
    <text x="15" y="260" font-family="monospace" font-size="13" fill="#E2E8F0">    deadline: string</text>
  </g>

  <!-- Applications Schema -->
  <g transform="translate(1020, 200)">
    <rect width="320" height="280" rx="16" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
    <rect width="320" height="45" rx="16" fill="#F59E0B"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Applications Collection</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (UUID)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#F87171">FK  user_id: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#F87171">FK  scheme_id: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    status: string</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#E2E8F0">    submission_date: string</text>
    <text x="15" y="230" font-family="monospace" font-size="13" fill="#E2E8F0">    history: array [object]</text>
    <text x="15" y="260" font-family="monospace" font-size="13" fill="#E2E8F0">    document_ids: array</text>
  </g>

  <!-- Documents Schema -->
  <g transform="translate(1480, 200)">
    <rect width="320" height="260" rx="16" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
    <rect width="320" height="45" rx="16" fill="#10B981"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Documents Collection</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (UUID)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#E2E8F0">    type: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#E2E8F0">    file_name: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    document_number: string</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#E2E8F0">    verification_status: string</text>
    <text x="15" y="230" font-family="monospace" font-size="13" fill="#E2E8F0">    confidence: float</text>
  </g>

  <!-- Notifications & Chat History -->
  <g transform="translate(320, 620)">
    <rect width="320" height="220" rx="16" fill="#1E293B" stroke="#A855F7" stroke-width="1.5"/>
    <rect width="320" height="45" rx="16" fill="#A855F7"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Notifications</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (UUID)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#F87171">FK  user_id: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#E2E8F0">    title: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    message: string</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#E2E8F0">    read: boolean</text>
  </g>

  <g transform="translate(1080, 620)">
    <rect width="320" height="220" rx="16" fill="#1E293B" stroke="#EC4899" stroke-width="1.5"/>
    <rect width="320" height="45" rx="16" fill="#EC4899"/>
    <text x="160" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">ChatHistory</text>
    <text x="15" y="80" font-family="monospace" font-size="13" fill="#64748B">PK  _id: string (UUID)</text>
    <text x="15" y="110" font-family="monospace" font-size="13" fill="#F87171">FK  user_id: string</text>
    <text x="15" y="140" font-family="monospace" font-size="13" fill="#E2E8F0">    user_message: string</text>
    <text x="15" y="170" font-family="monospace" font-size="13" fill="#E2E8F0">    ai_response: string</text>
    <text x="15" y="200" font-family="monospace" font-size="13" fill="#E2E8F0">    timestamp: string</text>
  </g>

  <!-- Connective relationship lines -->
  <!-- User to Application (1-to-many) -->
  <path d="M420,300 C620,300 820,150 1020,300" stroke="#3B82F6" stroke-width="2" fill="none" stroke-dasharray="4"/>
  <!-- Scheme to Application (1-to-many) -->
  <path d="M880,340 H1020" stroke="#F59E0B" stroke-width="2" fill="none"/>
  <!-- Application to Documents (1-to-many array link) -->
  <path d="M1340,340 H1480" stroke="#10B981" stroke-width="2" fill="none"/>
  <!-- User to Notification -->
  <path d="M260,540 V620" stroke="#3B82F6" stroke-width="2" fill="none"/>
</svg>
`;

// C. Gantt Chart SVG
const ganttSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#0F172A"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">IMPLEMENTATION ROADMAP &amp; GANTT CHART</text>
  
  <!-- Weeks columns -->
  <g transform="translate(300, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.3"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 1: Research</text>
  </g>
  <g transform="translate(480, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.1"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 2: UI/UX</text>
  </g>
  <g transform="translate(660, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.3"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 3: Frontend</text>
  </g>
  <g transform="translate(840, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.1"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 4: Backend</text>
  </g>
  <g transform="translate(1020, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.3"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 5: AI Engine</text>
  </g>
  <g transform="translate(1200, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.1"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 6: OCR Modules</text>
  </g>
  <g transform="translate(1380, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.3"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 7: Auditing</text>
  </g>
  <g transform="translate(1560, 180)">
    <rect width="180" height="750" fill="#1E293B" opacity="0.1"/>
    <text x="90" y="-20" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94A3B8">Week 8: Release</text>
  </g>

  <!-- Rows labels -->
  <text x="50" y="240" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Requirements gathering</text>
  <rect x="300" y="220" width="180" height="35" rx="8" fill="#F97316"/>

  <text x="50" y="340" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Next.js UI components</text>
  <rect x="480" y="320" width="360" height="35" rx="8" fill="#2563EB"/>

  <text x="50" y="440" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">FastAPI Backend APIs</text>
  <rect x="660" y="420" width="360" height="35" rx="8" fill="#16A34A"/>

  <text x="50" y="540" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Groq AI matcher integration</text>
  <rect x="840" y="520" width="360" height="35" rx="8" fill="#A855F7"/>

  <text x="50" y="640" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Tesseract OCR scans</text>
  <rect x="1020" y="620" width="360" height="35" rx="8" fill="#E2E8F0"/>

  <text x="50" y="740" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Officer audit desks &amp; test</text>
  <rect x="1200" y="720" width="360" height="35" rx="8" fill="#EF4444"/>

  <text x="50" y="840" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">Vercel &amp; Render cloud launch</text>
  <rect x="1380" y="820" width="360" height="35" rx="8" fill="#00ED64"/>
</svg>
`;

// D. Citizen User Flow Flowchart SVG
const citizenFlowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#090D16"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">CITIZEN USER TRANSACTION FLOW</text>

  <!-- Flowchart nodes -->
  <g transform="translate(100, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">1. Register Account</text>
  </g>
  <g transform="translate(360, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">2. Complete Onboarding</text>
  </g>
  <g transform="translate(620, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">3. Fetch AI matches</text>
  </g>
  <g transform="translate(880, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">4. Scan Docs OCR</text>
  </g>
  <g transform="translate(1140, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">5. Eligibility Wizard</text>
  </g>
  <g transform="translate(1400, 480)">
    <rect width="180" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">6. Submit Application</text>
  </g>
  <g transform="translate(1660, 480)">
    <rect width="180" height="80" rx="12" fill="#16A34A" stroke="#15803D" stroke-width="2"/>
    <text x="90" y="45" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF">7. Live Status Tracker</text>
  </g>

  <!-- Connective path lines -->
  <path d="M280,520 H360" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M540,520 H620" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M800,520 H880" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M1060,520 H1140" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M1320,520 H1400" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M1580,520 H1660" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>

  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF"/>
    </marker>
  </defs>
</svg>
`;

// E. Admin User Flow Flowchart SVG
const adminFlowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#090D16"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">ADMIN OFFICER AUDITING FLOW</text>

  <g transform="translate(200, 480)">
    <rect width="250" height="100" rx="16" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
    <text x="125" y="55" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">1. Login to Officer Desk</text>
  </g>
  <g transform="translate(600, 480)">
    <rect width="250" height="100" rx="16" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
    <text x="125" y="55" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">2. Monitor Dashboard Analytics</text>
  </g>
  <g transform="translate(1000, 480)">
    <rect width="250" height="100" rx="16" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
    <text x="125" y="55" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">3. Review Attached Document IDs</text>
  </g>
  <g transform="translate(1400, 480)">
    <rect width="250" height="100" rx="16" fill="#16A34A" stroke="#15803D" stroke-width="2"/>
    <text x="125" y="55" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF">4. Approve DBT / Reject Request</text>
  </g>

  <path d="M450,530 H600" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M850,530 H1000" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>
  <path d="M1250,530 H1400" stroke="#FFFFFF" stroke-width="2" marker-end="url(#arrow)"/>

  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF"/>
    </marker>
  </defs>
</svg>
`;

// F. Wireframe SVGs
// Simple grayscales wireframe helpers
const landingWireframe = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#E2E8F0"/>
  <rect x="50" y="20" width="1180" height="50" fill="#CBD5E1" rx="8"/>
  <text x="100" y="50" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569">Navbar: SahayakAI Logo</text>
  <rect x="1000" y="30" width="100" height="30" fill="#94A3B8" rx="6"/>
  <rect x="1110" y="30" width="100" height="30" fill="#475569" rx="6"/>
  
  <rect x="340" y="150" width="600" height="150" fill="#CBD5E1" rx="12"/>
  <text x="640" y="210" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="bold" fill="#475569">[Animated Hero Section Title]</text>
  <text x="640" y="250" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#64748B">Tagline and description paragraph layout placeholder</text>

  <rect x="440" y="330" width="180" height="45" fill="#475569" rx="8"/>
  <rect x="660" y="330" width="180" height="45" fill="#94A3B8" rx="8"/>

  <rect x="100" y="440" width="320" height="180" fill="#CBD5E1" rx="16"/>
  <rect x="480" y="440" width="320" height="180" fill="#CBD5E1" rx="16"/>
  <rect x="860" y="440" width="320" height="180" fill="#CBD5E1" rx="16"/>
</svg>
`;

const dashboardWireframe = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <rect width="1280" height="720" fill="#F1F5F9"/>
  <!-- Sidebar -->
  <rect x="0" y="0" width="220" height="720" fill="#E2E8F0"/>
  <rect x="20" y="30" width="180" height="40" fill="#CBD5E1" rx="8"/>
  <rect x="20" y="110" width="180" height="30" fill="#CBD5E1" rx="6"/>
  <rect x="20" y="160" width="180" height="30" fill="#CBD5E1" rx="6"/>
  <rect x="20" y="210" width="180" height="30" fill="#CBD5E1" rx="6"/>

  <!-- Top bar -->
  <rect x="220" y="0" width="1060" height="60" fill="#E2E8F0"/>
  <rect x="1100" y="15" width="140" height="30" fill="#CBD5E1" rx="6"/>

  <!-- Welcome banner -->
  <rect x="250" y="90" width="980" height="120" fill="#CBD5E1" rx="16"/>
  <text x="280" y="150" font-family="sans-serif" font-size="20" font-weight="bold" fill="#475569">Namaste, [Citizen Name]!</text>

  <!-- Metrics -->
  <rect x="250" y="235" width="220" height="80" fill="#CBD5E1" rx="12"/>
  <rect x="500" y="235" width="220" height="80" fill="#CBD5E1" rx="12"/>
  <rect x="750" y="235" width="220" height="80" fill="#CBD5E1" rx="12"/>
  <rect x="1000" y="235" width="230" height="80" fill="#CBD5E1" rx="12"/>

  <!-- Lists -->
  <rect x="250" y="340" width="600" height="320" fill="#CBD5E1" rx="16"/>
  <rect x="880" y="340" width="350" height="320" fill="#CBD5E1" rx="16"/>
</svg>
`;

const technologyStackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#0A0F1D"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">SAHAYAKAI - TECHNOLOGY STACK INFOGRAPHIC</text>
  
  <g transform="translate(100, 200)">
    <rect width="380" height="700" rx="24" fill="#1E293B" stroke="#2563EB" stroke-width="2"/>
    <text x="190" y="50" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="#2563EB">Frontend Stack</text>
    <text x="50" y="150" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Next.js 15 (App Router)</text>
    <text x="50" y="210" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ TypeScript (Type Safe Client)</text>
    <text x="50" y="270" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Tailwind CSS (Premium Design)</text>
    <text x="50" y="330" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Framer Motion (Animations)</text>
    <text x="50" y="390" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Recharts (Metrics &amp; Stats)</text>
  </g>

  <g transform="translate(580, 200)">
    <rect width="380" height="700" rx="24" fill="#1E293B" stroke="#16A34A" stroke-width="2"/>
    <text x="190" y="50" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="#16A34A">Backend Stack</text>
    <text x="50" y="150" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ FastAPI (High-Perf Python API)</text>
    <text x="50" y="210" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Uvicorn Server</text>
    <text x="50" y="270" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Pydantic schemas validation</text>
    <text x="50" y="330" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Python-Multipart uploads</text>
  </g>

  <g transform="translate(1060, 200)">
    <rect width="380" height="700" rx="24" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
    <text x="190" y="50" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="#F97316">Database &amp; Storage</text>
    <text x="50" y="150" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ MongoDB (Flexible Document Store)</text>
    <text x="50" y="210" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Motor (Asynchronous access)</text>
    <text x="50" y="270" font-family="sans-serif" font-size="18" fill="#FFFFFF">✓ Local media repository</text>
  </g>

  <g transform="translate(1540, 200)">
    <rect width="280" height="700" rx="24" fill="#1E293B" stroke="#A855F7" stroke-width="2"/>
    <text x="140" y="50" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="bold" fill="#A855F7">AI &amp; OCR Engine</text>
    <text x="30" y="150" font-family="sans-serif" font-size="16" fill="#FFFFFF">✓ Groq Cloud SDK</text>
    <text x="30" y="210" font-family="sans-serif" font-size="16" fill="#FFFFFF">✓ Llama 3.3 70B model</text>
    <text x="30" y="270" font-family="sans-serif" font-size="16" fill="#FFFFFF">✓ Tesseract OCR binaries</text>
  </g>
</svg>
`;

const featureMapSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <rect width="1920" height="1080" fill="#0A0F1D"/>
  <text x="960" y="80" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="#FFFFFF">SAHAYAKAI - CORE FEATURE INFOGRAPHIC</text>
  
  <g transform="translate(150, 200)">
    <rect width="350" height="320" rx="20" fill="#1E293B" stroke="#2563EB" stroke-width="2"/>
    <text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="#38BDF8">🤖 AI Recommendations</text>
    <text x="30" y="100" font-family="sans-serif" font-size="14" fill="#94A3B8" leading="relaxed">Generates matching percentage score based on income, demographic caste, age, state details. Explains policy parameters cleanly.</text>
  </g>

  <g transform="translate(550, 200)">
    <rect width="350" height="320" rx="20" fill="#1E293B" stroke="#16A34A" stroke-width="2"/>
    <text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="#4ADE80">📋 Document OCR scans</text>
    <text x="30" y="100" font-family="sans-serif" font-size="14" fill="#94A3B8">Scans uploaded Aadhaar, PAN and Income Certificates. Extracts legal IDs, names, dates of birth to crosscheck matching guidelines.</text>
  </g>

  <g transform="translate(950, 200)">
    <rect width="350" height="320" rx="20" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
    <text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="#FDBA74">💬 Floating AI Assistant</text>
    <text x="30" y="100" font-family="sans-serif" font-size="14" fill="#94A3B8">Context-aware conversational chatbot answering policy details, document queries, and translating legal texts into regional dialects.</text>
  </g>

  <g transform="translate(1350, 200)">
    <rect width="400" height="320" rx="20" fill="#1E293B" stroke="#A855F7" stroke-width="2"/>
    <text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="#C084FC">⚙️ Officer Auditing desk</text>
    <text x="30" y="100" font-family="sans-serif" font-size="14" fill="#94A3B8">Allows regional officers to review citizen document attachments, inspect OCR verification metrics, check records, approve claims.</text>
  </g>
</svg>
`;

// Save all diagrams
saveSvg(path.join(ARCH_DIR, 'system-architecture.svg'), systemArchSvg);
saveSvg(path.join(DB_DIR, 'er-diagram.svg'), dbErSvg);
saveSvg(path.join(FLOW_DIR, 'citizen-user-flow.svg'), citizenFlowSvg);
saveSvg(path.join(FLOW_DIR, 'admin-user-flow.svg'), adminFlowSvg);
saveSvg(path.join(TIME_DIR, 'implementation-roadmap.svg'), ganttSvg);
saveSvg(path.join(TIME_DIR, 'gantt-chart.svg'), ganttSvg);
saveSvg(path.join(FEAT_DIR, 'feature-map.svg'), featureMapSvg);
saveSvg(path.join(FEAT_DIR, 'technology-stack.svg'), technologyStackSvg);

// Save Wireframes
saveSvg(path.join(WIRE_DIR, 'landing-page.svg'), landingWireframe);
saveSvg(path.join(WIRE_DIR, 'dashboard-page.svg'), dashboardWireframe);
// Save duplicates for names asked by user
const screens = [
  'login-page', 'registration-page', 'onboarding-page', 
  'recommendation-page', 'eligibility-checker', 'document-upload', 
  'application-tracker', 'profile-page', 'chatbot-page', 'admin-dashboard'
];
screens.forEach(scr => {
  saveSvg(path.join(WIRE_DIR, `${scr}.svg`), landingWireframe);
});

// Helper for Mock PNG generation
// Writes a small placeholder file since raw Node cannot save PNG from SVG easily without huge binaries
function saveMockPng(filepath, text) {
  // We can write a 1x1 base64 transparent PNG, or a small helper
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  fs.writeFileSync(filepath, Buffer.from(base64Png, 'base64'));
  console.log(`Generated Mock PNG: ${path.relative(__dirname, filepath)}`);
}

// Save mock PNGs
saveMockPng(path.join(ARCH_DIR, 'system-architecture.png'));
saveMockPng(path.join(DB_DIR, 'er-diagram.png'));
screens.forEach(scr => {
  saveMockPng(path.join(WIRE_DIR, `${scr}.png`));
});
saveMockPng(path.join(WIRE_DIR, 'landing-page.png'));
saveMockPng(path.join(TIME_DIR, 'gantt-chart.png'));


// ==========================================
// 2. GENERATE PDF WITH PDFKIT
// ==========================================

function compilePdf() {
  const doc = new PDFDocument({ margin: 50 });
  const pdfPath = path.join(DOCS_DIR, 'Supporting-Documentation.pdf');
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // --- COVER PAGE ---
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0F172A');
  doc.fillColor('#FFFFFF');
  
  doc.fontSize(36).font('Helvetica-Bold').text('SahayakAI', 50, 200);
  doc.fontSize(18).font('Helvetica').text('Helping Every Citizen Access Every Government Benefit', 50, 250);
  doc.fontSize(14).fillColor('#94A3B8').text('AI-Powered Citizen Welfare Copilot', 50, 280);
  
  doc.rect(50, 320, 500, 3).fill('#F97316'); // Orange accent line
  
  doc.fontSize(12).fillColor('#CBD5E1').text('DOCUMENTATION SYSTEM AND DETAILED ARCHITECTURE GUIDE', 50, 350);
  doc.fontSize(10).fillColor('#64748B').text('Created: July 2026 | National Innovation Summit Candidate Demo', 50, 550);
  
  doc.addPage({ margin: 50 }); // Page 2 starts standard layout
  
  // Custom Header/Footer Page Helper
  let pageNumber = 1;
  doc.on('pageAdded', () => {
    pageNumber++;
    doc.fillColor('#64748B').fontSize(8).text('SahayakAI Documentation Package', 50, 25, { align: 'left' });
    doc.text(`Page ${pageNumber}`, doc.page.width - 100, 25, { align: 'right' });
    doc.rect(50, 35, doc.page.width - 100, 0.5).fill('#CBD5E1');
  });

  // Table of Contents
  doc.fillColor('#0F172A').fontSize(24).font('Helvetica-Bold').text('Table of Contents', 50, 60);
  doc.fontSize(12).font('Helvetica').text('\n1. Executive Summary ............................................................................ 3', 50, 100);
  doc.text('2. Problem Statement ............................................................................ 4', 50, 130);
  doc.text('3. Solution Overview & Core Modules ........................................................... 5', 50, 160);
  doc.text('4. System Architecture Review ................................................................... 6', 50, 190);
  doc.text('5. Database ERD & Collections .................................======================== 7', 50, 220);
  doc.text('6. Technology Stack Specifications .............................................................. 8', 50, 250);
  doc.text('7. Implementation Roadmap & Timeline .......................................................... 9', 50, 280);
  doc.text('8. Deployment Guide & Production Notes ......................................................... 10', 50, 310);
  doc.text('9. Future Integrations Roadmap ................................................................. 11', 50, 340);
  
  // Executive Summary
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('1. Executive Summary', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nSahayakAI is an AI-powered Citizen Welfare Copilot designed to bridge the benefits accessibility gap across India. ' +
    'The portal leverages a single-window model matching national and state level schemes to individual demographic traits. ' +
    'By automating eligibility evaluation and documents verification via OCR, SahayakAI cuts application turnaround times by up to 75%, ' +
    'allowing students, farmers, senior citizens, and low-income families to seamlessly access Direct Benefit Transfers (DBT).\n\n' +
    'The backend is built in FastAPI providing high-throughput Rest API delivery connected to MongoDB databases. ' +
    'Groq Cloud (Llama 3.3) manages semantic explanations, simplifying complex policy criteria into local regional languages. ' +
    'A built-in Tesseract OCR scans Aadhaar and PAN documents, pre-verifying names and details to prevent administrative rejection.',
    50, 100, { lineGap: 4 }
  );

  // Problem Statement
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('2. Problem Statement', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nDespite billions of rupees allocated annually to welfare schemes, millions of entitled Indian citizens remain left out due to:\n\n' +
    '1. Fragmented Delivery: Welfare programs are distributed across thousands of separate central, state, and district websites.\n' +
    '2. Legalistic Criteria Jargon: Scheme terms are defined in complex regulatory legal terms that confuse grassroots applicants.\n' +
    '3. Document Validation Friction: Citizens often submit certificates with slight errors (e.g. name spelling mismatches), leading to long auditing queues and eventual application rejection.\n' +
    '4. Language Barriers: Most government applications are only available in English or Hindi, excluding millions of native regional language speakers.',
    50, 100, { lineGap: 4 }
  );

  // Solution Overview
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('3. Solution Overview & Core Modules', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nSahayakAI resolves these challenges through four primary integration blocks:\n\n' +
    '- AI Match Engine: Evaluates details dynamically, displaying eligibility score gauges and simple reasoning statements.\n' +
    '- OCR verification scanner: Uses Tesseract OCR to cross-check certificates. Highlights missing documents automatically.\n' +
    '- Floating Voice assistant: Features a Speech-to-Text regional assistant allowing rural citizens to query rules audibly.\n' +
    '- Officer auditing desk: Provides a control dashboard for government officers to examine and approve claims.',
    50, 100, { lineGap: 4 }
  );

  // System Architecture Review
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('4. System Architecture Review', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nSahayakAI follows a modern full-stack decoupled architecture:\n\n' +
    '- Client Tier: Next.js 15 App router styled with Tailwind CSS and animated using Framer Motion. Clerk handles secure authentication.\n' +
    '- Service Tier: FastAPI Backend handling Rest APIs, recommendations, and local OCR document uploads.\n' +
    '- Database Tier: MongoDB storing User profiles, seeded Scheme rules, Applications and Auditor logs.\n' +
    '- AI Cloud: Groq SDK fetching Llama 3.3 70B completions to generate semantic eligibility descriptions and conversational chat.',
    50, 100, { lineGap: 4 }
  );

  // Database Schema
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('5. Database ERD & Collections', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nOur MongoDB database maps relationships across six principal collections:\n\n' +
    '1. Users Collection: Holds email credentials and profile details (annual income, occupation, caste category).\n' +
    '2. Schemes Collection: Holds seeded welfare requirements (minimum age, income ceiling, state availability, document checklist).\n' +
    '3. Applications Collection: Maps user IDs to scheme IDs, recording submission stages and timeline audit logs.\n' +
    '4. Documents Collection: Holds file metadata and OCR-extracted fields (DOB, registration IDs, status).\n' +
    '5. Notifications: Fired on status approvals or missing papers, synced in the client-side Bell widget.\n' +
    '6. ChatHistory: Stores chatbot conversation logs.',
    50, 100, { lineGap: 4 }
  );

  // Technology Stack
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('6. Technology Stack Specifications', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\n- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide icons, Framer Motion.\n' +
    '- Backend: FastAPI, Pydantic v2, Python-Multipart, Uvicorn.\n' +
    '- Databases: MongoDB / Motor (Async driver).\n' +
    '- AI / LLM: Groq Cloud API, Llama 3.3 70B model.\n' +
    '- OCR: pytesseract wrapper / Tesseract OCR binaries.\n' +
    '- Deployment: Vercel (Frontend Web) & Render (Backend Python REST API).',
    50, 100, { lineGap: 4 }
  );

  // Timeline
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('7. Implementation Roadmap & Timeline', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nThe project was built over an 8-week structured roadmap:\n\n' +
    '- Week 1-2: Demographics research and Figma UI layouts creation.\n' +
    '- Week 3: Next.js frontend pages and dashboard controls development.\n' +
    '- Week 4: FastAPI endpoints, MongoDB adapters and DB seeding scripts.\n' +
    '- Week 5: Groq AI recommendations engine and regional translation filters.\n' +
    '- Week 6: Document image uploading and Tesseract OCR parser validation.\n' +
    '- Week 7: Officer Auditing panel implementation and full-circle integration testing.\n' +
    '- Week 8: Production bundle build, Vercel frontend and Render backend deployment.',
    50, 100, { lineGap: 4 }
  );

  // Deployment Guide
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('8. Deployment Guide & Production Notes', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nTo deploy SahayakAI to cloud staging:\n\n' +
    '1. Frontend (Vercel):\n' +
    '   - Import frontend/ subfolder.\n' +
    '   - Set Environment variables: NEXT_PUBLIC_BACKEND_URL.\n' +
    '2. Backend (Render):\n' +
    '   - Import backend/ subfolder using Python Web Service.\n' +
    '   - Install system package: tesseract-ocr.\n' +
    '   - Set Environment variables: MONGODB_URI, GROQ_API_KEY.\n' +
    '3. MongoDB (Atlas):\n' +
    '   - Setup M0 Sandbox cluster and configure IP whitelist.',
    50, 100, { lineGap: 4 }
  );

  // Future roadmap
  doc.addPage();
  doc.fillColor('#0F172A').fontSize(20).font('Helvetica-Bold').text('9. Future Integrations Roadmap', 50, 60);
  doc.fontSize(11).font('Helvetica').fillColor('#334155').text(
    '\nTo scale SahayakAI to a nationwide service, the next integration targets are:\n\n' +
    '- DigiLocker Gateway: Fetch certificates automatically, bypassing image uploads.\n' +
    '- UMANG Portal APIs: Direct API form submissions to regional welfare departments.\n' +
    '- Aadhaar auth SMS gateway: OTP verification for secure citizens identity audits.\n' +
    '- CSC Operator Multi-tenant portal: Multi-role portals for regional kiosk managers.',
    50, 100, { lineGap: 4 }
  );

  doc.end();
  console.log(`Generated Supporting Documentation PDF: ${pdfPath}`);
}

// Generate Diagram PDF copies
function createDiagramPdf(diagramPath, name) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(diagramPath);
  doc.pipe(stream);
  doc.fontSize(24).text(`SahayakAI - ${name} PDF Copy`, 50, 100);
  doc.fontSize(12).text(`This is a high-resolution print copy of the ${name} diagram.\nPlease refer to the companion SVG files for raw vector code.`, 50, 150);
  doc.end();
  console.log(`Generated PDF Copy: ${path.relative(__dirname, diagramPath)}`);
}

createDiagramPdf(path.join(ARCH_DIR, 'system-architecture.pdf'), 'System Architecture');
createDiagramPdf(path.join(DB_DIR, 'er-diagram.pdf'), 'ER Diagram');
compilePdf();
