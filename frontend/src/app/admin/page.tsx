"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sahayakApi } from "@/lib/api";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Info,
  Calendar,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"review" | "schemes" | "users">("review");
  const [loading, setLoading] = useState(true);

  // Scheme creator state
  const [schemeName, setSchemeName] = useState("");
  const [schemeDesc, setSchemeDesc] = useState("");
  const [schemeCat, setSchemeCat] = useState("Farmer");
  const [schemeBenefits, setSchemeBenefits] = useState("");
  const [schemeDocs, setSchemeDocs] = useState("");
  const [schemeState, setSchemeState] = useState("All India");
  const [schemeDeadline, setSchemeDeadline] = useState("2026-12-31");
  const [schemeSuccess, setSchemeSuccess] = useState(false);

  // Review modal state
  const [reviewApp, setReviewApp] = useState<any>(null);
  const [auditComment, setAuditComment] = useState("");
  const [auditActionSuccess, setAuditActionSuccess] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const stats = await sahayakApi.getAdminAnalytics();
        setAnalytics(stats);

        const list = await sahayakApi.getAdminApplications();
        setApplications(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [activeTab, auditActionSuccess]);

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeName || !schemeDesc || !schemeBenefits) {
      alert("Please fill in Name, Description, and Benefits.");
      return;
    }

    try {
      const requiredDocsArray = schemeDocs.split(",").map(d => d.trim()).filter(d => d);
      const payload = {
        name: schemeName,
        description: schemeDesc,
        category: schemeCat,
        eligibility_summary: "Simulated custom administrative scheme.",
        benefits: schemeBenefits,
        required_documents: requiredDocsArray,
        state_availability: schemeState,
        deadline: schemeDeadline,
        logo_url: "🏢",
        eligibility_rules: {}
      };

      await sahayakApi.adminCreateScheme(payload);
      setSchemeSuccess(true);
      
      // Clear fields
      setSchemeName("");
      setSchemeDesc("");
      setSchemeBenefits("");
      setSchemeDocs("");
      
      setTimeout(() => setSchemeSuccess(false), 2500);
    } catch (e) {
      alert("Error adding scheme. Make sure the name is unique.");
    }
  };

  const handleAuditAction = async (status: "Approved" | "Rejected") => {
    if (!reviewApp) return;

    try {
      await sahayakApi.updateApplicationStatus(reviewApp._id, status, auditComment || `Application marked as ${status} by verification officer.`);
      setAuditActionSuccess(true);
      setTimeout(() => {
        setReviewApp(null);
        setAuditComment("");
        setAuditActionSuccess(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      alert("Error updating application status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoaderIcon className="animate-spin w-10 h-10 text-primary mx-auto" />
          <p className="text-xs text-slate-400">Loading Officer Console details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-12">
      
      {/* Top Header Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/30 py-4 px-8 sticky top-0 z-30 flex justify-between items-center shadow-premium">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-2xl">🤝</span>
          <h1 className="font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-saffron to-primary bg-clip-text text-transparent">
            SahayakAI Officer Portal
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-saffron/10 border border-saffron/20 text-[#F97316] text-[10px] font-bold px-3 py-1 rounded-full">
          <span>Official Session</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* ANALYTICS ROW */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Registered Citizens</span>
                <span className="block text-3xl font-extrabold mt-1">{analytics.total_users}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Welfare Requests Audit</span>
                <span className="block text-3xl font-extrabold mt-1">{analytics.total_applications}</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-saffron/10 text-[#F97316] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">DBT Approval Rate</span>
                <span className="block text-3xl font-extrabold mt-1">{analytics.approval_rate}%</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green/10 text-green flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}

        {/* TAB WORKFLOW CONTROL */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800/50 p-1 rounded-2xl max-w-md">
          <button
            onClick={() => setActiveTab("review")}
            className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-colors ${activeTab === "review" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"}`}
          >
            Review Claims
          </button>
          <button
            onClick={() => setActiveTab("schemes")}
            className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-colors ${activeTab === "schemes" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"}`}
          >
            Scheme Manager
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition-colors ${activeTab === "users" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"}`}
          >
            Citizen Registry
          </button>
        </div>

        {/* TAB CONTENT SPACES */}
        {activeTab === "review" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-premium">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">Submitted Citizen Claims</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                    <th className="p-4">Citizen Name</th>
                    <th className="p-4">Scheme Claimed</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                      <td className="p-4 font-bold">{app.applicant_name}</td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-350">{app.scheme_name}</td>
                      <td className="p-4 text-slate-500">{app.submission_date}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          app.status === "Approved" 
                            ? "bg-green/10 text-green" 
                            : (app.status === "Rejected" ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary")
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setReviewApp(app)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:text-primary transition-all"
                        >
                          Review Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "schemes" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-premium max-w-3xl">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 mb-6">
              Create & Publish Welfare Scheme
            </h3>

            <form onSubmit={handleCreateScheme} className="space-y-4">
              {schemeSuccess && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs p-3 rounded-lg">
                  Scheme successfully published and loaded in MongoDB welfare directories!
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Scheme Name</label>
                  <input
                    type="text"
                    required
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                    placeholder="E.g., PM Agritech subsidy"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                  <select
                    value={schemeCat}
                    onChange={(e) => setSchemeCat(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="Farmer">Farmer</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Housing">Housing</option>
                    <option value="Student">Student</option>
                    <option value="Women Entrepreneur">Women Entrepreneur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={3}
                  value={schemeDesc}
                  onChange={(e) => setSchemeDesc(e.target.value)}
                  placeholder="Explain benefits breakdown, budgets, and criteria guidelines..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Benefits Distributed (Short text)</label>
                <input
                  type="text"
                  required
                  value={schemeBenefits}
                  onChange={(e) => setSchemeBenefits(e.target.value)}
                  placeholder="E.g., Direct transfer of ₹10,000 per family per crop season."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Required Documents (Comma-separated)</label>
                <input
                  type="text"
                  value={schemeDocs}
                  onChange={(e) => setSchemeDocs(e.target.value)}
                  placeholder="E.g., Aadhaar Card, Land Ownership Documents, Bank Passbook"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">State Availability</label>
                  <input
                    type="text"
                    value={schemeState}
                    onChange={(e) => setSchemeState(e.target.value)}
                    placeholder="All India or specific state"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Portal Closing Deadline</label>
                  <input
                    type="date"
                    value={schemeDeadline}
                    onChange={(e) => setSchemeDeadline(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl saffron-gradient text-white font-bold text-xs shadow-md"
              >
                Publish Welfare Program
              </button>
            </form>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-premium">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">Onboarded Citizens Directory</h3>
            </div>
            
            <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Static mock catalog of users */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/35 rounded-2xl text-xs space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Amit Sharma</h4>
                <p className="text-[10px] text-slate-400">Occupation: Private Sector Job • Age: 29</p>
                <p className="text-[10px] text-slate-400">Income: ₹4,50,000/year • UP</p>
                <span className="inline-block bg-primary/10 text-primary font-bold text-[8px] px-2 py-0.5 rounded">
                  Score: 85%
                </span>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/35 rounded-2xl text-xs space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Savitri Devi</h4>
                <p className="text-[10px] text-slate-400">Occupation: Agriculture • Age: 42</p>
                <p className="text-[10px] text-slate-400">Income: ₹1,20,000/year • Bihar</p>
                <span className="inline-block bg-primary/10 text-primary font-bold text-[8px] px-2 py-0.5 rounded">
                  Score: 100%
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/40 dark:border-slate-800/35 rounded-2xl text-xs space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Vikram Singh</h4>
                <p className="text-[10px] text-slate-400">Occupation: Small Business Owner • Age: 36</p>
                <p className="text-[10px] text-slate-400">Income: ₹2,80,000/year • Rajasthan</p>
                <span className="inline-block bg-primary/10 text-primary font-bold text-[8px] px-2 py-0.5 rounded">
                  Score: 92%
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* OVERLAY AUDIT DETAIL MODAL PANEL */}
      {reviewApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm">Audit Citizen Application</h3>
                <p className="text-[10px] text-slate-400">Auditing claims details matching scheme standards</p>
              </div>
              <button 
                onClick={() => setReviewApp(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {auditActionSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-12 h-12 text-green mx-auto animate-bounce" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Auditor Status Updated!</h4>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                
                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Applicant</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{reviewApp.applicant_name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Welfare Scheme</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate block max-w-[200px]">{reviewApp.scheme_name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Submission ID</span>
                    <span className="font-mono text-slate-500">{reviewApp._id.substring(0, 10)}...</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Date Uploaded</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{reviewApp.submission_date}</span>
                  </div>
                </div>

                {/* Simulated Document verification check list */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-400">OCR Pre-verification Audit</h4>
                  
                  <div className="p-3 bg-green-500/5 border border-green-200/20 rounded-xl flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-350">Aadhaar Verification (Match ID extracted)</span>
                    <span className="text-[9px] text-green font-bold flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      OCR Verified
                    </span>
                  </div>
                  
                  <div className="p-3 bg-green-500/5 border border-green-200/20 rounded-xl flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-350">Income Certificate Validation</span>
                    <span className="text-[9px] text-green font-bold flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      OCR Verified
                    </span>
                  </div>
                </div>

                {/* Audit comments input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Auditor Review Comments</label>
                  <textarea
                    rows={2}
                    value={auditComment}
                    onChange={(e) => setAuditComment(e.target.value)}
                    placeholder="Enter audit justifications, block DBT disbursement orders, or missing notes..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleAuditAction("Rejected")}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleAuditAction("Approved")}
                    className="flex-grow py-3 green-gradient text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    Approve & Disburse DBT
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
