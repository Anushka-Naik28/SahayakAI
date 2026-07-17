"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import FloatingAssistant from "@/components/FloatingAssistant";
import { 
  LayoutDashboard, 
  Search, 
  UserCheck, 
  FileCheck2, 
  MapPin, 
  User, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Languages
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId, language, setLanguage } = useApp();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load User details & Notifications
  useEffect(() => {
    async function loadData() {
      try {
        const u = await sahayakApi.getProfile(userId);
        setProfile(u);
        
        const notifs = await sahayakApi.getNotifications(userId);
        setNotifications(notifs);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [userId, pathname]);

  const handleNotificationRead = async (id: string) => {
    try {
      await sahayakApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("sahayak_userId");
    router.push("/");
  };

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Discover Schemes", path: "/dashboard/schemes", icon: Search },
    { name: "Eligibility Checker", path: "/dashboard/eligibility", icon: UserCheck },
    { name: "OCR Verification", path: "/dashboard/documents", icon: FileCheck2 },
    { name: "Application Tracker", path: "/dashboard/tracker", icon: MapPin },
    { name: "Citizen Profile", path: "/dashboard/profile", icon: User },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800/40 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl">🤝</span>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-green bg-clip-text text-transparent">SahayakAI</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Summary */}
          {profile && profile.profile && (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/30">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full blue-gradient text-white flex items-center justify-center font-bold text-xs uppercase">
                  {profile.profile.full_name?.substring(0, 2) || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">{profile.profile.full_name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{profile.profile.occupation || "Citizen"}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500 font-semibold">
                <span>AI Profile score:</span>
                <span className="text-primary">{profile.profile.score || 0}%</span>
              </div>
              {/* Progress Line */}
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${profile.profile.score || 0}%` }}></div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-1 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/30 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {navItems.find(n => n.path === pathname)?.name || "SahayakAI Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Language Selection */}
            <div className="flex items-center space-x-1 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[11px] font-bold py-1 px-1 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popup dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in duration-100">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Alerts & Messages</h5>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-400 py-6">No new alerts.</p>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n._id}
                          onClick={() => handleNotificationRead(n._id)}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer text-left ${
                            n.read 
                              ? "bg-slate-50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/40" 
                              : "bg-primary/5 border-primary/20 dark:border-primary/10"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h6 className={`font-bold text-xs ${n.read ? 'text-slate-600 dark:text-slate-400' : 'text-primary'}`}>{n.title}</h6>
                            <span className="text-[8px] text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-ping"></span>
              <span className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">Live Server</span>
            </div>

          </div>
        </header>

        {/* Dynamic page contents render here */}
        <main className="flex-grow p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating chatbot assistant */}
      <FloatingAssistant />
    </div>
  );
}
