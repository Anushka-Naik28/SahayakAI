"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/Providers";
import { sahayakApi } from "@/lib/api";
import { KeyRound, Mail, User, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserId } = useApp();
  
  // State variables
  const [tab, setTab] = useState<"login" | "register" | "forgot" | "otp">("login");
  const [role, setRole] = useState<"citizen" | "admin">("citizen");
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otpCodes, setOtpCodes] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync tab from URL params if present
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "register") setTab("register");
    
    const r = searchParams.get("role");
    if (r === "admin") setRole("admin");
  }, [searchParams]);

  // Handle countdown for OTP
  useEffect(() => {
    let interval: any;
    if (tab === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tab, otpTimer]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "login") {
        // Run API Login
        const res = await sahayakApi.login(email, password);
        setUserId(res.user_id);
        
        if (res.role === "admin" || role === "admin") {
          router.push("/admin");
        } else {
          // If citizen is already onboarded, send to dashboard, else onboarding
          const profileRes = await sahayakApi.getProfile(res.user_id);
          if (profileRes.onboarded) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        }
      } else if (tab === "register") {
        // Run API Register
        const res = await sahayakApi.register(email, password, name);
        setUserId(res.user_id);
        // Switch to OTP tab to demonstrate the verification flow
        setTab("otp");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate successful OTP check
    setTimeout(() => {
      setLoading(false);
      router.push("/onboarding");
    }, 1200);
  };

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) return;
    const newCodes = [...otpCodes];
    newCodes[index] = val;
    setOtpCodes(newCodes);
    
    // Auto focus next box
    if (val !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors flex items-center">
          ← Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-4xl">🤝</span>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
          {role === "admin" ? "Officer Admin Access" : "SahayakAI Copilot Portal"}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {role === "admin" 
            ? "Enter official credentials to review citizen scheme uploads" 
            : "Discover and apply for your entitled welfare services"
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-premium rounded-3xl border border-slate-200/50 dark:border-slate-800/40 sm:px-10 relative overflow-hidden">
          
          {/* Saffron and green border accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-white to-green"></div>

          {/* Role selector tab (Only if not in OTP / Forgot mode) */}
          {(tab === "login" || tab === "register") && (
            <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl mb-6">
              <button
                onClick={() => { setRole("citizen"); setError(""); }}
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-colors ${role === "citizen" ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500"}`}
              >
                Citizen Portal
              </button>
              <button
                onClick={() => { setRole("admin"); setTab("login"); setError(""); }}
                className={`flex-1 text-center py-2 text-sm font-semibold rounded-lg transition-colors ${role === "admin" ? "bg-white dark:bg-slate-700 shadow-sm text-[#F97316]" : "text-slate-500"}`}
              >
                Officer Portal
              </button>
            </div>
          )}

          {/* Form Tabs */}
          {tab === "login" && (
            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Secret Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <KeyRound className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all ${role === "admin" ? 'saffron-gradient hover:opacity-90' : 'blue-gradient hover:opacity-90'}`}
              >
                {loading ? "Verifying..." : role === "admin" ? "Access Officer Panel" : "Login to Copilot"}
              </button>

              {role === "citizen" && (
                <div className="text-center text-sm text-slate-500 mt-4">
                  New to SahayakAI?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Register Account
                  </button>
                </div>
              )}
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg flex items-center">
                  <ShieldAlert className="w-4.5 h-4.5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Secret Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <KeyRound className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white shadow-md blue-gradient hover:opacity-90 transition-all"
              >
                {loading ? "Generating OTP..." : "Register & Get OTP"}
              </button>

              <div className="text-center text-sm text-slate-500 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {tab === "otp" && (
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs p-3 rounded-lg flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Verification OTP code sent to your email {email}.</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex justify-between space-x-2">
                  {otpCodes.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary bg-transparent"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white shadow-md green-gradient hover:opacity-90 transition-all flex items-center justify-center"
              >
                {loading ? "Checking Code..." : "Verify & Complete Onboarding"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>

              <div className="text-center text-sm text-slate-500">
                {otpTimer > 0 ? (
                  <span>Resend code in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOtpTimer(60)}
                    className="text-primary font-bold hover:underline"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </form>
          )}

          {tab === "forgot" && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@domain.in"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                onClick={() => setTab("otp")}
                className="w-full py-3 px-4 rounded-lg font-bold text-white shadow-md blue-gradient hover:opacity-90 transition-all"
              >
                Send Password Reset link
              </button>

              <div className="text-center text-sm text-slate-500">
                Remember your secret?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-sm text-slate-500">Loading authentication interface...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
