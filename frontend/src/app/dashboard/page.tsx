"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { 
  Sparkles, 
  Search, 
  FileCheck2, 
  MapPin, 
  ChevronRight, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

export default function DashboardOverview() {
  const { userId } = useApp();
  const [profile, setProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const u = await sahayakApi.getProfile(userId);
        setProfile(u);

        const recs = await sahayakApi.getRecommendations(userId);
        setRecommendations(recs.slice(0, 3)); // show top 3

        const apps = await sahayakApi.getApplications(userId);
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 rounded-3xl skeleton animate-pulse"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 rounded-2xl skeleton animate-pulse"></div>
          <div className="h-40 rounded-2xl skeleton animate-pulse"></div>
          <div className="h-40 rounded-2xl skeleton animate-pulse"></div>
        </div>
        <div className="h-64 rounded-3xl skeleton animate-pulse"></div>
      </div>
    );
  }

  const name = profile?.profile?.full_name || profile?.name || "Citizen";
  const score = profile?.profile?.score || 35;
  const isCustomOnboarded = profile?.onboarded;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* WELCOME CARD BANNER */}
      <div className="blue-gradient text-white p-6 sm:p-8 rounded-3xl shadow-premium relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Benefits Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Namaste, {name}!</h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {isCustomOnboarded 
              ? `Your citizen profile is ${score}% complete. SahayakAI has identified ${recommendations.length} welfare schemes matching your eligibility metrics.`
              : "Welcome to SahayakAI! Complete your profile questionnaire to unlock personalized AI scheme recommendations."
            }
          </p>
          {!isCustomOnboarded && (
            <div className="pt-2">
              <Link 
                href="/onboarding"
                className="inline-flex items-center justify-center bg-white text-primary font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Onboard Profile Questionnaire →
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-0 flex items-center bg-white/10 p-4 rounded-2xl border border-white/10">
          <div className="text-center mr-4">
            <span className="block text-2xl font-black">{score}%</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-200 font-bold">Profile Score</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-300" />
          </div>
        </div>
      </div>

      {/* QUICK ANALYTICS METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-2xl shadow-premium">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Applications</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold">{applications.length}</span>
            <span className="text-xs text-green font-semibold">Tracked</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-2xl shadow-premium">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recommended Matches</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold">{recommendations.length}</span>
            <span className="text-xs text-primary font-semibold">Matched</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-2xl shadow-premium">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Verification Status</span>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green"></span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">All Docs Verified</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-4 rounded-2xl shadow-premium">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Next Portal Deadline</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <Calendar className="w-4 h-4 text-saffron" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">30-Nov-2026</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-4">Quick Welfare Actions</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/dashboard/schemes"
            className="p-4 bg-slate-50 dark:bg-slate-800/25 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 hover:border-primary/40 transition-colors text-left flex flex-col justify-between h-28 group"
          >
            <Search className="w-6 h-6 text-primary group-hover:scale-105 transition-transform" />
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Discover Schemes</h4>
              <p className="text-[10px] text-slate-400">Search government welfare programs</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/eligibility"
            className="p-4 bg-slate-50 dark:bg-slate-800/25 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 hover:border-saffron/40 transition-colors text-left flex flex-col justify-between h-28 group"
          >
            <CheckCircle className="w-6 h-6 text-saffron group-hover:scale-105 transition-transform" />
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Eligibility Wizard</h4>
              <p className="text-[10px] text-slate-400">Check eligibility dynamically</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/documents"
            className="p-4 bg-slate-50 dark:bg-slate-800/25 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 hover:border-green/40 transition-colors text-left flex flex-col justify-between h-28 group"
          >
            <FileCheck2 className="w-6 h-6 text-green group-hover:scale-105 transition-transform" />
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">OCR Pre-verify</h4>
              <p className="text-[10px] text-slate-400">Scan Aadhaar/PAN certificates</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/tracker"
            className="p-4 bg-slate-50 dark:bg-slate-800/25 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 hover:border-purple-500/40 transition-colors text-left flex flex-col justify-between h-28 group"
          >
            <MapPin className="w-6 h-6 text-purple-500 group-hover:scale-105 transition-transform" />
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Application Tracker</h4>
              <p className="text-[10px] text-slate-400">Track active submission stages</p>
            </div>
          </Link>
        </div>
      </div>

      {/* MATCHED RECOMMENDATIONS & TIMELINES */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* RECOMMENDED SCHEMES LIST */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center">
              <Sparkles className="w-4 h-4 text-primary mr-1.5" />
              Top AI Recommended Schemes
            </h3>
            <Link href="/dashboard/schemes" className="text-xs text-primary font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {!isCustomOnboarded || recommendations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Please complete your onboarding profile to fetch recommendation match scores.
              </div>
            ) : (
              recommendations.map((rec) => (
                <div 
                  key={rec.scheme_id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3.5">
                    <span className="text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/40 dark:border-slate-800/30">{rec.logo_url}</span>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{rec.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{rec.category} • {rec.deadline}</p>
                      {/* AI explanation snippet */}
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 italic">
                        "{rec.ai_explanation}"
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      rec.score >= 85 
                        ? 'bg-green/10 text-green' 
                        : (rec.score >= 50 ? 'bg-saffron/10 text-saffron' : 'bg-red-500/10 text-red-500')
                    }`}>
                      {rec.score}% Match
                    </span>
                    <Link 
                      href={`/dashboard/schemes?id=${rec.scheme_id}`}
                      className="mt-2 text-xs font-bold text-primary flex items-center hover:underline"
                    >
                      Verify Details <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACTIVE APPLICATIONS TRACKER CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Ongoing Applications
              </h3>
              <Link href="/dashboard/tracker" className="text-xs text-primary font-bold hover:underline flex items-center">
                Track <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 flex flex-col items-center">
                  <Clock className="w-8 h-8 text-slate-300 mb-2" />
                  <span>No active applications. Select a scheme card to apply!</span>
                </div>
              ) : (
                applications.slice(0, 2).map((app) => (
                  <div key={app._id} className="p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200/40 dark:border-slate-800/30">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs truncate max-w-[140px] text-slate-800 dark:text-slate-100">{app.scheme_name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold">
                        {app.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Submitted: {app.submission_date}</span>
                      <span>Est Completion: {app.estimated_completion_date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 mt-4">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 mb-1 flex items-center">
              <HelpCircle className="w-4 h-4 text-primary mr-1" />
              Portal Notice
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Verify your Aadhaar on-chain or link local files via the OCR Verification panel to expedite verification processes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
