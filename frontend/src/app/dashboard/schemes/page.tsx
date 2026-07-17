"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { 
  Search, 
  Sparkles, 
  CheckCircle, 
  X, 
  ArrowRight, 
  Info, 
  AlertTriangle,
  FileCheck,
  Calendar,
  CheckCircle2
} from "lucide-react";

export default function SchemesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [schemes, setSchemes] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active detail scheme state
  const [activeScheme, setActiveScheme] = useState<any>(null);
  
  // Application form flow state
  const [isApplying, setIsApplying] = useState(false);
  const [attachedDocs, setAttachedDocs] = useState<string[]>([]);
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  const categories = [
    "All", "Farmer", "Healthcare", "Housing", 
    "Financial Services", "Pension", "Student", 
    "Skill Development", "Women Entrepreneur"
  ];

  // Load Schemes and User Documents
  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      try {
        const query = searchParams.get("query") || "";
        if (query) setSearchQuery(query);
        
        // Fetch recommendations to inject matching scores
        const recs = await sahayakApi.getRecommendations(userId);
        setRecommendations(recs);

        // Fetch schemes
        const list = await sahayakApi.getSchemes(searchQuery, selectedCategory === "All" ? "" : selectedCategory);
        setSchemes(list);

        // Check if a specific scheme ID is loaded in URL
        const targetId = searchParams.get("id");
        if (targetId) {
          const found = recs.find(r => r.scheme_id === targetId) || list.find(s => s._id === targetId);
          if (found) {
            // Find matched scores in recommendations
            const matchedRec = recs.find(r => r.scheme_id === found._id || r.scheme_id === found.scheme_id);
            setActiveScheme(matchedRec || found);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, [userId, selectedCategory, searchParams]);

  // Load User uploaded documents when applying
  useEffect(() => {
    if (isApplying) {
      // Mocked check for documents or call actual
      const checkDocs = async () => {
        try {
          // Pull uploaded files from mock store or endpoint
          const res = await fetch("http://localhost:8000/api/documents");
          if (res.ok) {
            const data = await res.json();
            setUserDocs(data);
          } else {
            // Standalone fallback files list
            setUserDocs([
              { _id: "doc-aadhaar", type: "Aadhaar Card", file_name: "aadhaar_card.jpg", verification_status: "Verified" },
              { _id: "doc-pan", type: "PAN Card", file_name: "pan_card.png", verification_status: "Verified" },
              { _id: "doc-income", type: "Income Certificate", file_name: "income_cert.pdf", verification_status: "Verified" }
            ]);
          }
        } catch {
          setUserDocs([
            { _id: "doc-aadhaar", type: "Aadhaar Card", file_name: "aadhaar_card.jpg", verification_status: "Verified" },
            { _id: "doc-pan", type: "PAN Card", file_name: "pan_card.png", verification_status: "Verified" },
            { _id: "doc-income", type: "Income Certificate", file_name: "income_cert.pdf", verification_status: "Verified" }
          ]);
        }
      };
      checkDocs();
    }
  }, [isApplying]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const list = await sahayakApi.getSchemes(searchQuery, selectedCategory === "All" ? "" : selectedCategory);
      setSchemes(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (scheme: any) => {
    // Merge recommendation details if available
    const recMatch = recommendations.find(r => r.scheme_id === scheme._id);
    setActiveScheme(recMatch || scheme);
    setIsApplying(false);
    setApplySuccess(false);
    setApplyError("");
    setAttachedDocs([]);
  };

  const handleDocToggle = (docType: string) => {
    if (attachedDocs.includes(docType)) {
      setAttachedDocs(attachedDocs.filter(d => d !== docType));
    } else {
      setAttachedDocs([...attachedDocs, docType]);
    }
  };

  const handleApplySubmit = async () => {
    if (!activeScheme) return;
    
    // Check if user attached all required documents
    const required = activeScheme.required_documents || [];
    const missing = required.filter((rDoc: string) => {
      // Check if attachedDocs has a verified document of this type
      const isAttached = attachedDocs.some(aId => {
        const uD = userDocs.find(d => d._id === aId);
        return uD && uD.type.toLowerCase().includes(rDoc.split(" ")[0].toLowerCase());
      });
      return !isAttached;
    });

    if (missing.length > 0) {
      setApplyError(`Please attach the following missing documents first: ${missing.join(", ")}`);
      return;
    }

    setApplyError("");
    try {
      const sId = activeScheme.scheme_id || activeScheme._id;
      await sahayakApi.submitApplication(userId, sId, attachedDocs);
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplying(false);
        setActiveScheme(null);
        router.push("/dashboard/tracker");
      }, 2000);
    } catch (e) {
      setApplyError("Error submitting application. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch min-h-[calc(100vh-8rem)]">
      
      {/* LEFT COLUMN: SEARCH & SCHEMES LIST */}
      <div className="flex-1 space-y-6">
        
        {/* Search Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-5 rounded-3xl shadow-premium">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute inset-y-0 left-3 flex items-center text-slate-400 w-4.5 h-4.5 my-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by welfare scheme name, benefits, or criteria..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="blue-gradient text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90"
            >
              Search
            </button>
          </form>

          {/* Horizontal scroll categories */}
          <div className="mt-4 flex items-center space-x-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                  (selectedCategory === cat || (cat === "All" && selectedCategory === ""))
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-slate-50 dark:bg-slate-800/20 border-slate-200/40 dark:border-slate-800/30 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes matches count and list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Matched Welfare Schemes ({schemes.length})
            </span>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-40 rounded-2xl skeleton animate-pulse"></div>
              <div className="h-40 rounded-2xl skeleton animate-pulse"></div>
            </div>
          ) : schemes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl text-center text-xs text-slate-400">
              No matching welfare schemes found. Try selecting another category or check your search query.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {schemes.map((s) => {
                const rec = recommendations.find(r => r.scheme_id === s._id || r.scheme_id === s.scheme_id);
                const score = rec ? rec.score : 80; // fallback
                const status = rec ? rec.eligibility_status : "Eligible";
                
                return (
                  <button
                    key={s._id || s.scheme_id}
                    onClick={() => handleCardClick(s)}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl hover:shadow-md transition-all text-left flex flex-col justify-between items-start space-y-4 glow-card group relative"
                  >
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/40 dark:border-slate-800/30">{s.logo_url || "🪙"}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          score >= 85 ? 'bg-green/10 text-green' : (score >= 50 ? 'bg-saffron/10 text-saffron' : 'bg-red-500/10 text-red-500')
                        }`}>
                          {score}% AI Match
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{s.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">{s.category} • {s.state_availability}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-2 leading-relaxed">{s.description}</p>
                    </div>

                    <div className="w-full flex justify-between items-center border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-400 font-semibold">
                      <span>Deadline: {s.deadline}</span>
                      <span className="text-primary flex items-center group-hover:translate-x-0.5 transition-transform">
                        Explore Benefit →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: DETAIL SPLIT PANEL / DRAWER */}
      <div className="w-full lg:w-[380px] xl:w-[440px] flex flex-col">
        {activeScheme ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-6 flex flex-col justify-between flex-grow sticky top-24 max-h-[calc(100vh-10rem)] overflow-y-auto">
            
            {/* Header / Close */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-3xl p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/40 dark:border-slate-800/30">{activeScheme.logo_url || "🪙"}</span>
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{activeScheme.name}</h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activeScheme.category}</span>
                </div>
              </div>
              <button 
                onClick={() => { setActiveScheme(null); setIsApplying(false); }}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Application success state */}
            {applySuccess ? (
              <div className="text-center py-12 space-y-4 flex-grow flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center text-green mb-2 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-sm">Application Uploaded!</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                  Your benefit application request has been forwarded. Opening tracker...
                </p>
              </div>
            ) : isApplying ? (
              /* APPLICATION SUBMISSION FORM FLOW */
              <div className="space-y-5 flex-grow">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Attach Verified Documents</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Attach your verified files extracted via OCR. If files are missing, navigate to the OCR Verification page.
                </p>

                {applyError && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-[10px] p-3 rounded-xl flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {activeScheme.required_documents?.map((rDoc: string, idx: number) => {
                    // Search if citizen has a matching uploaded file of this type
                    const matchedFile = userDocs.find(d => d.type.toLowerCase().includes(rDoc.split(" ")[0].toLowerCase()));
                    const isVerified = matchedFile && matchedFile.verification_status === "Verified";
                    
                    return (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          isVerified 
                            ? "bg-slate-50 dark:bg-slate-800/10 border-slate-200/50 dark:border-slate-800/30" 
                            : "bg-red-500/5 border-red-500/15"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <input 
                            type="checkbox"
                            disabled={!isVerified}
                            checked={matchedFile ? attachedDocs.includes(matchedFile._id) : false}
                            onChange={() => matchedFile && handleDocToggle(matchedFile._id)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary disabled:opacity-40"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">{rDoc}</h5>
                            <p className="text-[9px] text-slate-400 truncate">
                              {matchedFile ? matchedFile.file_name : "Document missing in scanner"}
                            </p>
                          </div>
                        </div>

                        <div>
                          {isVerified ? (
                            <span className="text-[8px] bg-green/10 text-green font-bold px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          ) : (
                            <span className="text-[8px] bg-red-500/10 text-red-500 font-bold px-2 py-0.5 rounded-full">
                              Missing
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsApplying(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplySubmit}
                    className="flex-grow py-2.5 rounded-xl blue-gradient text-white font-bold text-xs shadow-md"
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            ) : (
              /* SCHEME DETAIL SPECIFICATIONS */
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Scheme Overview</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">{activeScheme.description}</p>
                </div>

                {/* AI Score callout */}
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/10 p-4 rounded-2xl">
                  <h5 className="font-bold text-xs text-primary flex items-center mb-1.5">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Eligibility Judgment
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                    "{activeScheme.ai_explanation || 'Retrieving matching score analysis...'}"
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Benefits Distributed</h4>
                  <div className="bg-slate-50 dark:bg-slate-800/35 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/30 text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-relaxed">
                    {activeScheme.benefits}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">State Availability</h4>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1">
                      {activeScheme.state_availability}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Portal Deadline</h4>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-1 flex items-center">
                      <Calendar className="w-3.5 h-3.5 text-saffron mr-1 flex-shrink-0" />
                      {activeScheme.deadline}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 mb-2">Required Documents</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeScheme.required_documents?.map((doc: string, index: number) => (
                      <span key={index} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsApplying(true)}
                  className="w-full mt-4 py-3 rounded-xl blue-gradient text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center justify-center"
                >
                  Verify Documents & Apply
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-slate-100/50 dark:bg-slate-900/10 border border-dashed border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
            <Info className="w-8 h-8 text-slate-300 mb-2" />
            <span>Select any scheme card from the discovery list to evaluate eligibility parameters and submit digital claims.</span>
          </div>
        )}
      </div>

    </div>
  );
}
