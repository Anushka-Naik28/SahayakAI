"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { Sparkles, Check, ChevronRight, ChevronLeft, ShieldCheck, HeartHandshake } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { userId } = useApp();

  // Wizard Steps
  const [step, setStep] = useState(1);
  
  // Profile Fields State
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState<number | "">("");
  const [education, setEducation] = useState("");
  const [disabilityStatus, setDisabilityStatus] = useState(false);
  const [farmerStatus, setFarmerStatus] = useState(false);
  const [casteCategory, setCasteCategory] = useState("");
  const [familySize, setFamilySize] = useState<number | "">("");
  const [bankAccount, setBankAccount] = useState(false);

  // Score state
  const [score, setScore] = useState(0);

  // Recalculate score live
  useEffect(() => {
    const fields = [
      fullName, age, gender, state, district, occupation, 
      annualIncome, education, casteCategory, familySize
    ];
    const completed = fields.filter(f => f !== "" && f !== undefined && f !== null).length;
    // Add booleans (these have values, defaults count)
    const totalCompleted = completed + 4; // Disability, Farmer, Bank account, and completion score itself
    const computedScore = Math.min(100, Math.round((totalCompleted / 14) * 100));
    setScore(computedScore);
  }, [fullName, age, gender, state, district, occupation, annualIncome, education, disabilityStatus, farmerStatus, casteCategory, familySize, bankAccount]);

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!fullName || !age || !state || !district || annualIncome === "") {
      alert("Please fill in all key fields (Name, Age, State, District, Income) before submitting.");
      return;
    }

    try {
      const payload = {
        full_name: fullName,
        age: Number(age),
        gender,
        state,
        district,
        occupation,
        annual_income: Number(annualIncome),
        education,
        disability_status: disabilityStatus,
        farmer_status: farmerStatus,
        caste_category: casteCategory,
        family_size: Number(familySize || 1),
        bank_account_availability: bankAccount
      };

      await sahayakApi.submitOnboarding(userId, payload);
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Error saving profile details.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/30 bg-white dark:bg-slate-900/60 h-16 flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🤝</span>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">SahayakAI</span>
        </div>
        <div className="text-sm font-semibold text-slate-500">
          Citizen Benefit Onboarding
        </div>
      </header>

      {/* Main Form container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* Left Form Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 w-full md:w-3/5 p-8 rounded-3xl shadow-premium relative">
          
          {/* Step markers */}
          <div className="flex items-center space-x-2 mb-6">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>1</span>
            <span className="w-8 h-0.5 bg-slate-100 dark:bg-slate-800"></span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
            <span className="w-8 h-0.5 bg-slate-100 dark:bg-slate-800"></span>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>3</span>
          </div>

          {/* Form Step Content */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold mb-1">Personal Details</h2>
              <p className="text-sm text-slate-500 mb-6">Let's start with your identity and basic demographics.</p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value !== "" ? Number(e.target.value) : "")}
                    placeholder="E.g., 34"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select State</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter district"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold mb-1">Occupation & Finance</h2>
              <p className="text-sm text-slate-500 mb-6">Welfare schemes are highly dependent on income slabs and professions.</p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Primary Occupation</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select Occupation</option>
                  <option value="Farmer">Farmer / Agriculture</option>
                  <option value="Student">Student / Academic</option>
                  <option value="Business Owner">Micro/Small Business Owner</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Private Sector">Private Sector Job</option>
                  <option value="Retired">Retired / Pensioner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Annual Household Income (₹)</label>
                <input
                  type="number"
                  required
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value !== "" ? Number(e.target.value) : "")}
                  placeholder="E.g., 180000"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highest Education Level</label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select Education</option>
                    <option value="Below 10th">Below 10th Standard</option>
                    <option value="10th Pass">10th pass</option>
                    <option value="12th Pass">12th pass</option>
                    <option value="Graduate">Graduate / Degree holder</option>
                    <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold mb-1">Social Group & Specifics</h2>
              <p className="text-sm text-slate-500 mb-6">Final social criteria questions to perfect recommended match eligibility scores.</p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Social Caste Category</label>
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select Category</option>
                  <option value="General">General / UR</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Family Size</label>
                <input
                  type="number"
                  required
                  value={familySize}
                  onChange={(e) => setFamilySize(e.target.value !== "" ? Number(e.target.value) : "")}
                  placeholder="Number of members in family"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Checkbox Grids */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={farmerStatus}
                    onChange={(e) => setFarmerStatus(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">I am a landholding farmer family</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={disabilityStatus}
                    onChange={(e) => setDisabilityStatus(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">I am a person with disability (PwD)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bankAccount}
                    onChange={(e) => setBankAccount(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">I have an active bank account linked to Aadhaar</span>
                </label>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="mt-8 flex justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <ChevronLeft className="mr-1 w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary/95 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                Next Step
                <ChevronRight className="ml-1 w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center justify-center bg-green hover:bg-green/95 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                Save & Load Dashboard
                <Check className="ml-1.5 w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="w-full md:w-2/5 flex flex-col gap-6">
          {/* AI Score Radial Indicator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-premium text-center flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI Copilot Profiler</h3>
            
            {/* Circle Progress bar */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#2563EB" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * score) / 100}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{score}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Score</span>
              </div>
            </div>

            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">Profile Match Completeness</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Completing demographic, Caste, and Disability toggles feeds the Groq Recommendation engine to match policies with high precision.
            </p>
          </div>

          {/* Onboarding Tips */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <HeartHandshake className="w-5 h-5 text-saffron mr-2" />
              Benefit Guidance
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex items-start">
                <span className="text-saffron mr-2">✦</span>
                <span>Provide exact numbers matching your income certificates to avoid OCR verification failures.</span>
              </div>
              <div className="flex items-start">
                <span className="text-saffron mr-2">✦</span>
                <span>Select appropriate state: many schemes are state-specific (e.g. Karnataka NSP overrides).</span>
              </div>
              <div className="flex items-start">
                <span className="text-saffron mr-2">✦</span>
                <span>If you are a student and farmer family, checking the agricultural landholder check box is recommended.</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 border-t border-slate-800 text-xs">
        SahayakAI Onboarding Portal • Direct benefit delivery simulation.
      </footer>
    </div>
  );
}
