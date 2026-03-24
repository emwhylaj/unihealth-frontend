"use client";

import { useState } from "react";
import Link from "next/link";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import UniHealthLogo from "@/components/UniHealthLogo";
import { useOAuthLogin } from "@/hooks/useOAuthLogin";

export default function LoginPage() {
  const { handleOAuthResponse } = useOAuthLogin();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [role, setRole] = useState<"patient" | "hospital">("patient");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        await handleOAuthResponse("google", tokenResponse.access_token);
      } catch {
        toast.error("Google login failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login was cancelled or failed.");
      setGoogleLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    googleLogin();
  };

  const handleAppleLogin = async () => {
    const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
    if (!appleClientId || appleClientId === "com.unihealth.web") {
      toast.error(
        "Apple Sign In is not configured yet. Please use email login."
      );
      return;
    }

    if (!window.AppleID) {
      toast.error("Apple Sign In failed to load. Please refresh and try again.");
      return;
    }

    setAppleLoading(true);
    try {
      window.AppleID.auth.init({
        clientId: appleClientId,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const data = await window.AppleID.auth.signIn();
      await handleOAuthResponse("apple", data.authorization.id_token);
    } catch {
      toast.error("Apple login was cancelled or failed.");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 auth-left relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, #166534 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #15803d 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <div className="w-72 h-72 mx-auto mb-8 flex items-center justify-center">
            <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="30" y="200" width="220" height="8" rx="4" fill="#2d4a2d"/>
              <rect x="50" y="208" width="12" height="50" rx="4" fill="#2d4a2d"/>
              <rect x="218" y="208" width="12" height="50" rx="4" fill="#2d4a2d"/>
              <rect x="70" y="168" width="140" height="34" rx="6" fill="#1a3a1a"/>
              <rect x="75" y="100" width="130" height="90" rx="8" fill="#1a3a1a"/>
              <rect x="82" y="107" width="116" height="76" rx="4" fill="#0d2010"/>
              <rect x="85" y="110" width="110" height="70" rx="3" fill="#0a2010" opacity="0.8"/>
              <rect x="92" y="120" width="60" height="3" rx="1.5" fill="#4ade80" opacity="0.7"/>
              <rect x="92" y="128" width="80" height="3" rx="1.5" fill="#4ade80" opacity="0.5"/>
              <rect x="92" y="136" width="50" height="3" rx="1.5" fill="#4ade80" opacity="0.6"/>
              <rect x="92" y="144" width="70" height="3" rx="1.5" fill="#4ade80" opacity="0.4"/>
              <rect x="92" y="152" width="45" height="3" rx="1.5" fill="#4ade80" opacity="0.5"/>
              <rect x="92" y="160" width="65" height="3" rx="1.5" fill="#4ade80" opacity="0.3"/>
              <circle cx="140" cy="68" r="22" fill="#1a3a1a"/>
              <circle cx="132" cy="65" r="2.5" fill="#4ade80" opacity="0.7"/>
              <circle cx="148" cy="65" r="2.5" fill="#4ade80" opacity="0.7"/>
              <path d="M133 74 Q140 79 147 74" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M110 165 Q120 130 140 125 Q160 130 170 165" fill="#1a3a1a"/>
              <path d="M115 150 Q100 165 95 185" stroke="#1a3a1a" strokeWidth="16" strokeLinecap="round"/>
              <path d="M165 150 Q180 165 185 185" stroke="#1a3a1a" strokeWidth="16" strokeLinecap="round"/>
              <ellipse cx="100" cy="188" rx="10" ry="7" fill="#2d4a2d"/>
              <ellipse cx="180" cy="188" rx="10" ry="7" fill="#2d4a2d"/>
            </svg>
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="inline-flex items-center gap-2 bg-[#4ade80]/10 border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/15 hover:border-[#4ade80]/60 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {role === "patient" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                )}
              </svg>
              {role === "patient" ? "I am a Patient / User" : "I am a Medical Personnel"}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-[#0f1a0f] border border-[#2d4a2d] rounded-2xl shadow-2xl z-20 overflow-hidden">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    role === "patient" ? "text-[#4ade80] bg-[#4ade80]/5" : "text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/5"
                  }`}
                  onClick={() => { setRole("patient"); setRoleDropdownOpen(false); }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Patient / User
                  {role === "patient" && (
                    <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="h-px bg-[#2d4a2d]/50 mx-3" />
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    role === "hospital" ? "text-[#4ade80] bg-[#4ade80]/5" : "text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/5"
                  }`}
                  onClick={() => { setRole("hospital"); setRoleDropdownOpen(false); }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Medical Personnel
                  {role === "hospital" && (
                    <svg className="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-400 text-sm mt-6 max-w-xs">
            {role === "patient"
              ? "Welcome back. Access your health records and manage your medical history."
              : "Welcome back. Access your hospital portal and patient records."}
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[#0a0f0a] lg:bg-white">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:shadow-none lg:rounded-none">
          <div className="flex flex-col items-center mb-8">
            <UniHealthLogo size="md" showText={true} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Log in
          </h1>
          <p className="text-gray-500 text-sm text-center mb-4">
            Welcome back — choose how to log in
          </p>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setRole("patient")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                role === "patient"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Patient / User
            </button>
            <button
              onClick={() => setRole("hospital")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                role === "hospital"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Medical Personnel
            </button>
          </div>

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || appleLoading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-4 rounded-xl transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? "Logging in with Google..." : "Continue with Google"}
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleLogin}
              disabled={googleLoading || appleLoading}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-4 rounded-xl transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {appleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              )}
              {appleLoading ? "Logging in with Apple..." : "Continue with Apple"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Email */}
            <Link
              href="/login/email"
              className="w-full flex items-center justify-center gap-3 bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0f0a] font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-[#4ade80]/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Log in with Email
            </Link>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#22c55e] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
