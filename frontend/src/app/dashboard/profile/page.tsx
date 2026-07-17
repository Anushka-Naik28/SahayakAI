"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { 
  User, 
  Settings, 
  Eye, 
  Bell, 
  Check, 
  ShieldCheck, 
  Sliders, 
  CloudLightning 
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { 
    userId, 
    language, 
    setLanguage, 
    darkMode, 
    toggleDarkMode, 
    largeFont, 
    toggleLargeFont, 
    highContrast, 
    toggleHighContrast 
  } = useApp();

  // Profile forms state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [income, setIncome] = useState<number | "">("");
  const [occupation, setOccupation] = useState("");
  
  // Notification checkboxes
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [digilockerLinked, setDigilockerLinked] = useState(false);

  // Success indicator
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const u = await sahayakApi.getProfile(userId);
        if (u && u.profile) {
          setName(u.profile.full_name || u.name || "");
          setAge(u.profile.age || "");
          setState(u.profile.state || "");
          setDistrict(u.profile.district || "");
          setIncome(u.profile.annual_income || "");
          setOccupation(u.profile.occupation || "");
        } else {
          setName(u?.name || "");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      // Re-submit onboarding details to update profile
      const data = {
        full_name: name,
        age: Number(age),
        gender: "Male", // defaults
        state,
        district,
        occupation,
        annual_income: Number(income),
        education: "Graduate",
        disability_status: false,
        farmer_status: occupation.toLowerCase() === "farmer",
        caste_category: "General",
        family_size: 4,
        bank_account_availability: true
      };

      await sahayakApi.submitOnboarding(userId, data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Error saving profile details.");
    }
  };

  if (loading) {
    return (
      <div className="h-64 rounded-3xl skeleton animate-pulse"></div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        
        {/* LEFT PROFILE EDITING CARD */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 mb-5 flex items-center">
            <User className="w-5 h-5 text-primary mr-1.5" />
            Citizen Identity Settings
          </h2>

          <form onSubmit={handleProfileSave} className="space-y-4">
            {saveSuccess && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs p-3 rounded-lg flex items-center">
                <Check className="w-4 h-4 mr-2" />
                <span>Identity details saved successfully! Match scores recompiled.</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full legal name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Annual Household Income (₹)</label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value !== "" ? Number(e.target.value) : "")}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl blue-gradient text-white font-bold text-xs shadow-md"
            >
              Save Profile Identity
            </button>
          </form>
        </div>

        {/* RIGHT ACCESSIBILITY & PREFERENCES CARD */}
        <div className="space-y-6">
          
          {/* Accessibility Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center">
              <Eye className="w-4.5 h-4.5 text-saffron mr-1.5" />
              Accessibility Tools
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl">
                <span className="text-xs font-semibold">Dark Mode Layout</span>
                <input 
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl">
                <span className="text-xs font-semibold">Large Font Size (A+)</span>
                <input 
                  type="checkbox"
                  checked={largeFont}
                  onChange={toggleLargeFont}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl">
                <span className="text-xs font-semibold">High Contrast Colors</span>
                <input 
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Integration & Alert Prefs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center">
              <Bell className="w-4.5 h-4.5 text-green mr-1.5" />
              Channels & Integrations
            </h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-xs font-medium">Email notifications for deadlines</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-xs font-medium">SMS reminders (Direct Link)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-xs font-medium">WhatsApp updates (API Sandbox)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer border-t border-slate-100 dark:border-slate-800/40 pt-3">
                <input 
                  type="checkbox"
                  checked={digilockerLinked}
                  onChange={(e) => setDigilockerLinked(e.target.checked)}
                  className="w-4 h-4 text-[#F97316] rounded"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Link DigiLocker Vault</span>
              </label>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
