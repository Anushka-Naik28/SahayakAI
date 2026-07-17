"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { 
  ShieldCheck, 
  HelpCircle, 
  Users, 
  TrendingUp, 
  FileText, 
  FileCheck, 
  Bot, 
  Mic, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Sun,
  Moon,
  Volume2,
  ChevronDown,
  Lock
} from "lucide-react";

// Localized strings for Landing page
const TRANSLATIONS: Record<string, any> = {
  en: {
    heroTitle: "Helping Every Citizen Access Every Government Benefit",
    heroDesc: "SahayakAI is an AI-powered Citizen Copilot helping you discover, check eligibility, scan documents, and track welfare schemes in one place.",
    getStarted: "Get Started as Citizen",
    adminPortal: "Officer Portal",
    statsSchemes: "Active Schemes",
    statsApplied: "Applications Processed",
    statsTime: "Time Saved",
    problemTitle: "The Welfare Access Gap",
    problemDesc: "Why millions of eligible Indian citizens miss out on life-changing benefits every day.",
    solTitle: "The SahayakAI Solution",
    solDesc: "A premium, unified single-window application powered by AI and document intelligence.",
    howItWorks: "How It Works",
    faqTitle: "Frequently Asked Questions",
    footerText: "SahayakAI is built to empower every Indian citizen. A Digital India initiative demo.",
  },
  hi: {
    heroTitle: "हर नागरिक को हर सरकारी योजना का लाभ पहुंचाना",
    heroDesc: "SahayakAI एक AI-संचालित नागरिक सहायक है जो आपको एक ही स्थान पर योजनाओं की खोज, पात्रता जांच, दस्तावेज सत्यापन और आवेदन ट्रैक करने में मदद करता है।",
    getStarted: "नागरिक के रूप में शुरू करें",
    adminPortal: "अधिकारी पोर्टल",
    statsSchemes: "सक्रिय योजनाएं",
    statsApplied: "संसाधित आवेदन",
    statsTime: "समय की बचत",
    problemTitle: "कल्याणकारी योजनाओं तक पहुंच का अंतर",
    problemDesc: "लाखों पात्र भारतीय नागरिक हर दिन जीवन बदलने वाले लाभों से वंचित रह जाते हैं।",
    solTitle: "SahayakAI समाधान",
    solDesc: "एआई और दस्तावेज़ बुद्धिमत्ता द्वारा संचालित एक प्रीमियम, एकीकृत एकल-खिड़की अनुप्रयोग।",
    howItWorks: "यह कैसे काम करता है",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    footerText: "SahayakAI हर भारतीय नागरिक को सशक्त बनाने के लिए बनाया गया है। डिजिटल इंडिया पहल।",
  },
  kn: {
    heroTitle: "ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನಿಗೂ ಪ್ರತಿಯೊಂದು ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ ಸಿಗುವಂತೆ ಮಾಡುವುದು",
    heroDesc: "SahayakAI ಎನ್ನುವುದು AI-ಚಾಲಿತ ನಾಗರಿಕ ಸಹಾಯಕವಾಗಿದ್ದು, ಯೋಜನೆಗಳ ಶೋಧನೆ, ಅರ್ಹತೆ ಪರಿಶೀಲನೆ, ದಾಖಲೆ ಸ್ಕ್ಯಾನಿಂಗ್ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್ ಅನ್ನು ಒಂದೇ ಸೂರಿನಡಿ ಒದಗಿಸುತ್ತದೆ.",
    getStarted: "ನಾಗರಿಕರಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
    adminPortal: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್",
    statsSchemes: "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು",
    statsApplied: "ಸಂಸ್ಕಾರಗೊಂಡ ಅರ್ಜಿಗಳು",
    statsTime: "ಉಳಿಸಿದ ಸಮಯ",
    problemTitle: "ಯೋಜನೆ ತಲುಪುವಲ್ಲಿನ ಅಂತರ",
    problemDesc: "ಲಕ್ಷಾಂತರ ಅರ್ಹ ಭಾರತೀಯ ನಾಗರಿಕರು ಪ್ರತಿದಿನ ತಮ್ಮ ಸೌಲಭ್ಯಗಳಿಂದ ವಂಚಿತರಾಗುತ್ತಿದ್ದಾರೆ.",
    solTitle: "SahayakAI ಪರಿಹಾರ",
    solDesc: "AI ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಆಧಾರಿತ ಏಕ-ವಿಂಡೋ ಪ್ರೀಮಿಯಂ ಅಪ್ಲಿಕೇಶನ್.",
    howItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    footerText: "ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸಲು SahayakAI ನಿರ್ಮಿಸಲಾಗಿದೆ. ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ ಉಪಕ್ರಮ.",
  }
};

export default function LandingPage() {
  const { 
    language, 
    setLanguage, 
    darkMode, 
    toggleDarkMode, 
    largeFont, 
    toggleLargeFont, 
    highContrast, 
    toggleHighContrast 
  } = useApp();
  
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const faqs = [
    {
      q: "How does SahayakAI check my eligibility?",
      a: "SahayakAI filters active schemes based on your profile criteria (age, state, income, category). Our backend recommendation engine then scores matches, and the Groq AI model generates a simple, citizen-friendly explanation of why you qualify."
    },
    {
      q: "Is my personal Aadhaar and income data safe?",
      a: "Yes. SahayakAI prioritizes user privacy. All uploaded documents are processed securely, and OCR extractions run in sandboxed memory. We follow standard data security protocols and offer DigiLocker-based integrations."
    },
    {
      q: "Does SahayakAI support regional Indian languages?",
      a: "Absolutely. You can toggle between English, Hindi, Tamil, and Kannada on the navbar. Our built-in AI chatbot and floating voice assistant also understand and respond in multiple local dialects."
    },
    {
      q: "What is the 'AI Profile Completion Score'?",
      a: "It measures the completeness of your citizen profile. Providing details like occupation, household size, and income bracket raises the score, helping the AI suggest more accurate recommendations with a higher match probability."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* TRICOLOR TOP BAR */}
      <div className="w-full h-1.5 flex">
        <div className="flex-1 bg-[#F97316]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#16A34A]"></div>
      </div>

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass shadow-premium border-b border-slate-200/50 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤝</span>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary via-saffron to-green bg-clip-text text-transparent">
                SahayakAI
              </span>
              <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 saffron-gradient text-white rounded-full">
                Citizen Copilot
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            {/* ACCESSIBILITY TOGGLES */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg space-x-1 border border-slate-200/50 dark:border-slate-800/50">
              <button 
                onClick={toggleDarkMode}
                className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Toggle Dark Mode"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun className="w-4.5 h-4.5 text-yellow-500" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
              </button>
              <button 
                onClick={toggleLargeFont}
                className={`px-2 py-0.5 rounded-md font-bold text-xs transition-colors ${largeFont ? 'bg-primary text-white' : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                title="Toggle Large Text Size"
              >
                A+
              </button>
              <button 
                onClick={toggleHighContrast}
                className={`p-1.5 rounded-md transition-colors ${highContrast ? 'bg-green text-white' : 'hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                title="Toggle High Contrast Mode"
              >
                <Eye className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* LANGUAGE DROP DOWN */}
            <div className="relative">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            <Link 
              href="/auth"
              className="text-sm font-medium hover:text-primary transition-colors px-3 py-1.5 rounded-md"
            >
              Sign In
            </Link>

            <Link 
              href="/auth?tab=register"
              className="blue-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg hover:shadow-md transition-all"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-slate-100 dark:border-slate-900">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-saffron/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Transforming Citizen Benefits Delivery
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight md:leading-[1.15]">
            {t.heroTitle}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/auth?tab=register"
              className="w-full sm:w-auto inline-flex items-center justify-center blue-gradient text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
            >
              {t.getStarted}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link 
              href="/auth?role=admin"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-base font-semibold px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Lock className="mr-2 w-4.5 h-4.5" />
              {t.adminPortal}
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/50 dark:border-slate-800/40 pt-10">
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-saffron to-yellow-500 bg-clip-text text-transparent">850+</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">{t.statsSchemes}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">1.2M+</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">{t.statsApplied}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green to-teal-400 bg-clip-text text-transparent">75%</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">{t.statsTime}</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent">99.8%</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">OCR Verification accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM VS SOLUTION */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-stretch">
            {/* Problem Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-premium flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-saffron mb-2 uppercase tracking-wide">The Hurdle</h3>
                <h4 className="text-3xl font-extrabold mb-6">{t.problemTitle}</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  {t.problemDesc}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start text-sm">
                    <span className="text-red-500 mr-3 text-base">✕</span>
                    <span>Fragmented portals across 28 states & center.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-red-500 mr-3 text-base">✕</span>
                    <span>Complex legal eligibility jargon that confuses common citizens.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-red-500 mr-3 text-base">✕</span>
                    <span>No automated verification leading to frequent application rejections.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-red-500 mr-3 text-base">✕</span>
                    <span>Long office queues and lack of active tracking updates.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                Source: National e-Governance Studies
              </div>
            </div>

            {/* Solution Box */}
            <div className="bg-white dark:bg-slate-900 border border-primary/20 dark:border-primary/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2 uppercase tracking-wide">The Innovation</h3>
                <h4 className="text-3xl font-extrabold mb-6">{t.solTitle}</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  {t.solDesc}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-green w-5 h-5 mr-3 flex-shrink-0" />
                    <span>One unified database linking national & state schemes.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-green w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Llama 3.3 AI score calculations explaining eligibility clearly.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-green w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Pre-verify uploads with local Tesseract OCR scanning immediately.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle2 className="text-green w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Multilingual chatbot and speech voice assistant support.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 text-xs text-primary font-semibold border-t border-slate-100 dark:border-slate-800 pt-4">
                Digital India Hackathon Judged Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES INFOGRAPHIC */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Designed forGrassroots Empowerment
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              Every screen is packed with state-of-the-art details ensuring accessibility for students, farmers, women, and seniors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Scheme Recommendation</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Calculates precise match scores. Explains complex legal guidelines in clean, conversational language customized to your details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">OCR Document Extraction</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Scan Aadhaar, PAN, and Caste certificates. Extracts dates, names, and certificate numbers instantly to crosscheck guidelines.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Conversational Chatbot</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                A regional language voice assistant allows citizens to speak or write queries about required documents, deadlines, and guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/30 dark:border-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold">{t.howItWorks}</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Four simple steps to claim your benefits.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full blue-gradient text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Register & Onboard</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Input demographics, income, and profession parameters.</p>
            </div>

            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full blue-gradient text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Get AI Recommendations</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Discover matching schemes ordered by customized eligibility scores.</p>
            </div>

            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full blue-gradient text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">OCR Pre-verification</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Upload documents. OCR validates values immediately to avoid rejection.</p>
            </div>

            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full blue-gradient text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
              <h3 className="font-bold text-lg mb-2">Track to Completion</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Submit application and monitor status changes live on your tracker.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold">Voices of Impact</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Real feedback from testing operators and citizens.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="text-saffron text-2xl mb-4">★★★★★</div>
              <p className="text-sm italic mb-6">
                "As a Common Service Center (CSC) operator in Haryana, helping rural citizens apply for PM Kisan was tedious. With SahayakAI's OCR document extraction, the form details fill out instantly, reducing time by 80%."
              </p>
              <div className="font-bold text-slate-800 dark:text-slate-200">Suresh Deshmukh</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">CSC Operator, Karnal</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="text-saffron text-2xl mb-4">★★★★★</div>
              <p className="text-sm italic mb-6">
                "I was searching for college scholarship programs, but legal texts were confusing. The AI eligibility scorer in SahayakAI analyzed my details and explained precisely which NSP schemes I matched."
              </p>
              <div className="font-bold text-slate-800 dark:text-slate-200">Pooja Patel</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Undergraduate Student, Gujarat</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
              <div className="text-saffron text-2xl mb-4">★★★★★</div>
              <p className="text-sm italic mb-6">
                "Applying for a Mudra loan was so simple. I used the voice assistant in my local language to ask about document needs, and the floating chat guided me throughout the upload process."
              </p>
              <div className="font-bold text-slate-800 dark:text-slate-200">K. Radhakrishnan</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Farmer & Retailer, Tamil Nadu</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">{t.faqTitle}</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden transition-all shadow-premium"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 text-white relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Start Your Welfare Access Journey</h2>
          <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of Indian citizens checking eligibility and applying for government support in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/auth?tab=register"
              className="w-full sm:w-auto inline-block blue-gradient text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all text-base"
            >
              Access Scheme Copilot
            </Link>
            <Link 
              href="/auth?role=admin"
              className="w-full sm:w-auto inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-8 py-4 rounded-xl border border-slate-700 transition-all text-base"
            >
              Verify Submissions
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <span className="text-xl font-black text-white">🤝 SahayakAI</span>
              <p className="mt-4 text-sm text-slate-500 max-w-sm">
                An advanced AI-powered Single-Window Citizen Welfare Copilot designed to bridge the benefits accessibility gap across India.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Modules</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth" className="hover:text-white transition-colors">Eligibility Checker</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">OCR Verification</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Scheme Recommendations</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Officer Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Digital India</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspired by the Government of India's vision of Digital India, India Stack, DigiLocker, and inclusive welfare delivery.
              </p>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800/40 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
            <p>© 2026 SahayakAI. All rights reserved. Demo Product created for National Innovation Summit.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">FAQ Docs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
