"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Loader2, 
  HelpCircle, 
  ChevronRight,
  TrendingUp
} from "lucide-react";

export default function ApplicationTrackerPage() {
  const { userId } = useApp();
  const [applications, setApplications] = useState<any[]>([]);
  const [activeApp, setActiveApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      setLoading(true);
      try {
        const list = await sahayakApi.getApplications(userId);
        setApplications(list);
        if (list.length > 0) setActiveApp(list[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, [userId]);

  const timelineStages = [
    { name: "Draft", desc: "Application initialization" },
    { name: "Submitted", desc: "Application received by SahayakAI portal" },
    { name: "Verification", desc: "Citizen demographics checked against scheme rules" },
    { name: "Processing", desc: "Forwarded to block/district Welfare Officer" },
    { name: "Approved", desc: "Direct Benefit Transfer (DBT) initialized" }
  ];

  const getStageIndex = (status: string) => {
    if (status === "Rejected") return 3; // show rejection at DM level
    const idx = timelineStages.findIndex(s => s.name.toLowerCase() === status.toLowerCase());
    return idx !== -1 ? idx : 1;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 skeleton rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch min-h-[calc(100vh-8rem)]">
      
      {/* LEFT COLUMN: LIST OF APPLICATIONS */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 px-1">
          Tracked Claims ({applications.length})
        </h3>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl text-center text-xs text-slate-400">
            No active applications found. Choose a scheme and submit your first claim.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <button
                key={app._id}
                onClick={() => setActiveApp(app)}
                className={`w-full p-4 rounded-3xl border transition-all text-left flex justify-between items-center ${
                  activeApp?._id === app._id 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate max-w-[180px]">{app.scheme_name}</h4>
                  <span className="text-[10px] text-slate-400 mt-1 block">ID: {app._id.substring(0, 8)}...</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: ACTIVE APPLICATION TIMELINE */}
      <div className="flex-1">
        {activeApp ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 p-6 rounded-3xl shadow-premium space-y-6">
            
            {/* Metadata Summary */}
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activeApp.status}
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1.5">{activeApp.scheme_name}</h2>
                <p className="text-[10px] text-slate-400 mt-1">Application ID: {activeApp._id}</p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/25 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-saffron mr-1.5" />
                <div>
                  <span className="block font-bold text-[9px] uppercase text-slate-400">Est. Completion</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeApp.estimated_completion_date}</span>
                </div>
              </div>
            </div>

            {/* TIMELINE DISPLAY */}
            <div className="space-y-6">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Submission Progress Steps</h3>
              
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                {timelineStages.map((stage, idx) => {
                  const currentIdx = getStageIndex(activeApp.status);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  
                  // Check if rejected
                  const isRejected = activeApp.status === "Rejected" && idx === 3;

                  // Find history node if exists
                  const historyNode = activeApp.history?.find((h: any) => h.status.toLowerCase() === stage.name.toLowerCase());

                  return (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted 
                          ? "bg-green border-green" 
                          : (isCurrent 
                              ? (isRejected ? "bg-red-500 border-red-500" : "bg-primary border-primary") 
                              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700")
                      }`}>
                        {isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
                      </span>

                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className={`font-bold text-xs ${isCompleted || isCurrent ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400'}`}>
                            {isRejected ? "Application Rejected" : stage.name}
                          </h4>
                          {historyNode && (
                            <span className="text-[9px] text-slate-400">{historyNode.date}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {historyNode ? historyNode.note : stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Helpline box */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/30 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help with this claim?</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Click the float microphone button at the bottom right and ask: "What is the status of my {activeApp.scheme_name} application?" to get dynamic voice reports.
              </p>
            </div>

          </div>
        ) : (
          <div className="bg-slate-100/50 dark:bg-slate-900/10 border border-dashed border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
            <MapPin className="w-8 h-8 text-slate-300 mb-2" />
            <span>Select an active benefit application from the left panel to inspect timeline statuses and estimates.</span>
          </div>
        )}
      </div>

    </div>
  );
}
