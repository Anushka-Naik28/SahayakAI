"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, Sliders } from "lucide-react";

export default function EligibilityCheckerPage() {
  const { userId } = useApp();
  
  // Wizard steps: 1 = choose scheme & verify parameters, 2 = running analysis, 3 = show results
  const [wizardStep, setWizardStep] = useState(1);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState("");
  
  // Adjusted simulation parameters
  const [simIncome, setSimIncome] = useState<number>(200000);
  const [simAge, setSimAge] = useState<number>(30);
  const [simFarmer, setSimFarmer] = useState(false);
  const [simDisability, setSimDisability] = useState(false);
  const [simCaste, setSimCaste] = useState("General");
  
  // Loading statements
  const [loadingText, setLoadingText] = useState("Filtering schemes database...");
  
  // Result states
  const [result, setResult] = useState<any>(null);

  // Load Schemes and profile details initially
  useEffect(() => {
    async function init() {
      try {
        const list = await sahayakApi.getSchemes();
        setSchemes(list);
        if (list.length > 0) setSelectedSchemeId(list[0]._id);

        const u = await sahayakApi.getProfile(userId);
        if (u && u.profile) {
          setSimIncome(u.profile.annual_income || 200000);
          setSimAge(u.profile.age || 30);
          setSimFarmer(u.profile.farmer_status || false);
          setSimDisability(u.profile.disability_status || false);
          setSimCaste(u.profile.caste_category || "General");
        }
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, [userId]);

  const runVerification = () => {
    setWizardStep(2);
    
    // Rotate loading text
    const texts = [
      "Analyzing policy eligibility criteria...",
      "Comparing household income levels...",
      "Matching age and social group brackets...",
      "Generating Llama 3.3 AI decision summary...",
      "Finalizing eligibility metrics..."
    ];
    
    let textIdx = 0;
    const interval = setInterval(() => {
      if (textIdx < texts.length - 1) {
        textIdx++;
        setLoadingText(texts[textIdx]);
      }
    }, 800);

    // Call simulated eligibility scoring
    setTimeout(async () => {
      clearInterval(interval);
      
      const scheme = schemes.find(s => s._id === selectedSchemeId);
      if (!scheme) {
        setWizardStep(1);
        return;
      }

      // Calculate score based on inputs
      let score = 100;
      const rules = scheme.eligibility_rules || {};

      if (rules.max_income && simIncome > rules.max_income) {
        score -= Math.min(50, Math.round(((simIncome - rules.max_income) / rules.max_income) * 50));
      }
      if (rules.farmer_status !== undefined && rules.farmer_status !== simFarmer) {
        score -= 40;
      }
      if (rules.min_age && simAge < rules.min_age) score -= 30;
      if (rules.max_age && simAge > rules.max_age) score -= 30;

      score = Math.max(0, score);
      const status = score >= 85 ? "Eligible" : (score >= 50 ? "Partially Eligible" : "Not Eligible");

      // Generate Groq explain text
      try {
        const prompt = `Explain why a citizen with annual income ₹${simIncome.toLocaleString()}, age ${simAge}, is_farmer=${simFarmer}, is_disabled=${simDisability}, caste=${simCaste} matches the scheme "${scheme.name}" which has benefits: "${scheme.benefits}". Result matches score is ${score}%. Give citizen-friendly explanation and what documents to upload. Keep under 3 paragraphs.`;
        const aiResponse = await sahayakApi.sendChatMessage(prompt, userId);
        
        setResult({
          schemeName: scheme.name,
          benefits: scheme.benefits,
          score,
          status,
          explanation: aiResponse,
          logo: scheme.logo_url || "🪙"
        });
        setWizardStep(3);
      } catch (err) {
        setWizardStep(1);
      }
    }, 4500);
  };

  const resetWizard = () => {
    setResult(null);
    setWizardStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* WIZARD CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-saffron/5 rounded-full blur-2xl"></div>

        {/* STEP 1: PARAMETER SELECTION */}
        {wizardStep === 1 && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold">Welfare Eligibility Sandbox</h2>
                <p className="text-xs text-slate-400 mt-1">Simulate demographics updates to evaluate eligibility rules.</p>
              </div>
              <Sparkles className="w-6 h-6 text-saffron" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Scheme and demographics inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Target Scheme</label>
                  <select
                    value={selectedSchemeId}
                    onChange={(e) => setSelectedSchemeId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {schemes.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center">
                    <Sliders className="w-4 h-4 text-primary mr-1" />
                    Sandbox Controls
                  </h4>
                  
                  {/* Income Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Annual Income:</span>
                      <span className="text-primary font-bold">₹{simIncome.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={50000}
                      max={1000000}
                      step={10000}
                      value={simIncome}
                      onChange={(e) => setSimIncome(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Age Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Age:</span>
                      <span className="text-primary font-bold">{simAge} Years</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={80}
                      value={simAge}
                      onChange={(e) => setSimAge(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Status toggles */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category parameters</label>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-800/35">
                    <span className="text-xs font-semibold">Caste Category</span>
                    <select
                      value={simCaste}
                      onChange={(e) => setSimCaste(e.target.value)}
                      className="bg-transparent border border-slate-200 dark:border-slate-800 rounded-md text-xs py-0.5 px-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>

                  <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-800/35 cursor-pointer">
                    <span className="text-xs font-semibold">Landholder Farmer</span>
                    <input
                      type="checkbox"
                      checked={simFarmer}
                      onChange={(e) => setSimFarmer(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary border-slate-300 focus:ring-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-800/35 cursor-pointer">
                    <span className="text-xs font-semibold">Person with Disability</span>
                    <input
                      type="checkbox"
                      checked={simDisability}
                      onChange={(e) => setSimDisability(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary border-slate-300 focus:ring-primary"
                    />
                  </label>
                </div>

                <button
                  onClick={runVerification}
                  className="w-full py-3.5 rounded-xl blue-gradient text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center justify-center"
                >
                  Analyze AI Eligibility
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: LOADING SIMULATION */}
        {wizardStep === 2 && (
          <div className="py-16 text-center space-y-6 flex flex-col items-center justify-center">
            <div className="relative w-20 h-20">
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 animate-pulse">Running Eligibility Scenarios</h3>
            <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/30 px-4 py-1.5 rounded-full flex items-center">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-saffron" />
              {loadingText}
            </p>
          </div>
        )}

        {/* STEP 3: RESULTS VERDICT */}
        {wizardStep === 3 && result && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-3xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/40 dark:border-slate-800/30">{result.logo}</span>
                <div>
                  <h2 className="text-lg font-extrabold">{result.schemeName}</h2>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Benefits: {result.benefits}</p>
                </div>
              </div>
              <button
                onClick={resetWizard}
                className="text-xs text-primary font-bold hover:underline flex items-center"
              >
                Re-check Sandbox
              </button>
            </div>

            {/* Verdict Box */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              
              {/* Verdict column */}
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200/40 dark:border-slate-800/30 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Verdict</span>
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                  result.status === "Eligible" 
                    ? "bg-green/10 text-green" 
                    : (result.status === "Partially Eligible" ? "bg-saffron/10 text-saffron" : "bg-red-500/10 text-red-500")
                }`}>
                  {result.status}
                </span>

                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke={result.status === "Eligible" ? "#16A34A" : (result.status === "Partially Eligible" ? "#F97316" : "#EF4444")} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold">{result.score}%</span>
                    <span className="text-[8px] uppercase font-bold text-slate-400">Match score</span>
                  </div>
                </div>
              </div>

              {/* Text explanation column */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 text-primary mr-1" />
                    Llama 3.3 Reasoning
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {result.explanation}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={resetWizard}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Adjust Sandbox Params
                  </button>
                  <button
                    onClick={() => {
                      const found = schemes.find(s => s.name === result.schemeName);
                      if (found) {
                        router.push(`/dashboard/schemes?id=${found._id}`);
                      }
                    }}
                    className="flex-grow py-2.5 rounded-xl blue-gradient text-white font-bold text-xs shadow-md"
                  >
                    Verify & Apply Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
