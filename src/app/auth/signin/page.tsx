"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="h-screen w-full flex border-[6px] border-[#FFCA40] relative overflow-hidden bg-[#FFCA40]">
      {/* Image Section */}
      <div className="hidden md:block flex-1 relative bg-cover bg-center">
        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src="/image16.jpg"
            alt="Login background"
            className="w-[80%] h-[80%] object-cover relative z-0 mx-auto mt-20 shadow-xl"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6ecec4d] to-transparent z-10" />

        <div className="absolute bottom-20 left-1/4 z-20 flex flex-col items-center gap-1">
          <h1 className="text-[#FFB22C] font-bold text-3xl drop-shadow-md">
            Welcome to <span className="text-black"> Foodie POS</span>
          </h1>
          <p className="text-[#F0A04B] font-semibold text-sm font-mono drop-shadow-md">
            Experience Effortless Backoffice Managing
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center p-8 text-black z-10 bg-[#FFCA40]">
        <div className="max-w-[400px] w-full mx-auto">
          <h2 className="text-4xl font-bold mb-2 text-black">Welcome</h2>
          <p className="text-base mb-8 text-slate-800 font-medium">
            Start Managing Your Accounts Faster and Better
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#FEF9F2] text-black border-none rounded focus:ring-2 focus:ring-slate-400 outline-none placeholder:text-slate-500 disabled:opacity-50 transition-all font-medium"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-[#FEF9F2] text-black border-none rounded focus:ring-2 focus:ring-slate-400 outline-none pr-12 placeholder:text-slate-500 disabled:opacity-50 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-black text-[#FFCA40] py-3 rounded text-lg font-bold hover:bg-[#292828] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="my-6 flex items-center w-full">
            <hr className="flex-1 border-black/20" />
            <span className="px-3 text-sm text-black/60 font-semibold">OR</span>
            <hr className="flex-1 border-black/20" />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-200 text-slate-800 py-3 rounded text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-slate-300"
          >
            <Image src="/google.png" alt="Google" width={24} height={24} />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
