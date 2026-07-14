"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, ChefHat, BarChart3, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/backoffice",
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/backoffice";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@foodiepos.com");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      
      {/* Left Column: Branding / Visual Preview Panel (Hidden on mobile) */}
      <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden shrink-0 border-r border-slate-800">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,202,64,0.08),transparent_50%)]" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Logo / Header */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFCA40] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/10">
            f
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Foodie<span className="text-[#FFCA40]">POS</span>
          </span>
        </div>

        {/* Hero Section & Features */}
        <div className="z-10 my-auto py-8 space-y-10">
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/85 border border-slate-700 text-xs font-bold text-[#FFCA40] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              SaaS Administration Portal
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Powering Modern Restaurant Operations
            </h1>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              An all-in-one POS tool designed to streamline dining rooms, kitchen workflows, and company sales audits.
            </p>
          </div>

          {/* Feature List (Replacing the old image/vector) */}
          <div className="space-y-4 max-w-md">
            
            {/* Feature 1 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FFCA40]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Dynamic Table Ordering</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Let customers scan QR codes to browse menus, select custom addons, and send orders directly to the kitchen.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FFCA40]">
                <ChefHat className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Real-Time Kitchen Queue</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Provide cooks with live ticket updates and change prep statuses seamlessly from the operations dashboard.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-[#FFCA40]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Sales & VAT Reports</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Monitor store revenue, verify average ticket margins, and compare performances across branches instantly.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs font-semibold text-slate-500 flex justify-between items-center border-t border-slate-800/80 pt-6">
          <span>© 2026 FoodiePOS Admin</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFCA40]" /> Security Certified
            </span>
            <span>v1.2.0</span>
          </div>
        </div>
      </div>
      {/* Right Column: Centered Login Form (Cardless layout for modern SaaS look) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative">
        
        {/* Mobile Header Branding (Only visible on small viewports) */}
        <div className="md:hidden flex items-center gap-2.5 mb-10 self-start">
          <div className="w-10 h-10 rounded-xl bg-[#FFCA40] flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
            f
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">
            Foodie<span className="text-[#FFCA40]">POS</span>
          </span>
        </div>

        {/* Center Content Container */}
        <div className="w-full max-w-[380px] flex flex-col justify-center">
          
          <div className="text-left mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100/80 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Store Administration
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Enter your details to manage your restaurant operations.
            </p>
          </div>

          {/* Error Message banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2.5 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-sm transition-all placeholder:text-slate-400 disabled:opacity-50 shadow-sm"
                />
                <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-medium text-sm transition-all placeholder:text-slate-400 disabled:opacity-50 shadow-sm"
                />
                <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-650 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFCA40]" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick Demo Access (Sleek Developer Portal style helper) */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.015)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Sandbox Account
              </span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer hover:underline"
              >
                Autofill Credentials
              </button>
            </div>
            <div className="space-y-1.5 text-slate-500 font-mono text-[11px]">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-100/50">
                <span>Email:</span>
                <span className="font-semibold text-slate-800">admin@foodiepos.com</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>Password:</span>
                <span className="font-semibold text-slate-800">password123</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider text-[10px]">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm border border-slate-200/80 hover:border-slate-300 active:scale-[0.99] active:translate-y-0"
          >
            <Image src="/google.png" alt="Google" width={18} height={18} />
            <span>Google Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
