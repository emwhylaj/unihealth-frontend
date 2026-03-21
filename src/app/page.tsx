"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import UniHealthLogo from "@/components/UniHealthLogo";

interface PlatformStats {
  totalHospitals: number;
  statesCovered: number;
  totalPatients: number;
}

export default function LandingPage() {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/v1/stats`, {
      headers: { "X-Skip-Encryption": "true" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const landingStats = [
    {
      value: stats ? stats.totalHospitals.toLocaleString() : "5,000+",
      label: "Hospitals",
    },
    { value: "1.2M", label: "Health Centers" },
    {
      value: stats ? stats.totalPatients.toLocaleString() : "5.4M",
      label: "Users",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f0a] overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob-animate absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #166534 0%, #14532d 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="blob-animate-delay absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, #15803d 0%, #166534 40%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="blob-animate-slow absolute -bottom-32 left-1/4 w-[450px] h-[450px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #4ade80 0%, #166534 50%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        {/* Logo */}
        <div className="mb-8">
          <UniHealthLogo size="lg" showText={true} />
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl mb-6">
          One Health Record.{" "}
          <span className="text-[#4ade80]">Every Hospital.</span>{" "}
          Anywhere.
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          Access your complete medical history, share records securely with
          healthcare providers, and take control of your health journey.
        </p>

        {/* Role Dropdown + CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          {/* Role Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-[#1a2a1a] border border-[#2d4a2d] text-gray-300 hover:text-[#4ade80] hover:border-[#4ade80]/50 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-200"
            >
              <svg
                className="w-4 h-4 text-[#4ade80]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              I am a Patient / User
              <svg
                className={`w-4 h-4 transition-transform ${
                  roleDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {roleDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#1a2a1a] border border-[#2d4a2d] rounded-xl shadow-xl z-20 overflow-hidden">
                <button
                  className="w-full px-4 py-3 text-sm text-gray-300 hover:text-[#4ade80] hover:bg-[#4ade80]/5 text-left transition-colors"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  Patient / User
                </button>
              </div>
            )}
          </div>

          {/* Sign Up CTA */}
          <Link
            href="/signup"
            className="bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0f0a] font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#4ade80]/20 hover:shadow-[#4ade80]/30"
          >
            Sign up free
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl">
          {landingStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#4ade80]">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Choose <span className="text-[#4ade80]">UniHealth</span>?
          </h2>
          <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
            Your health data, always secure, always accessible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Secure Records",
                description:
                  "AES-256 encryption keeps your health data private and protected at all times.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Instant Access",
                description:
                  "Generate a one-time access code to share your records with any hospital in seconds.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Full History",
                description:
                  "Track vitals, medical records, allergies, medications, and hospital visits in one place.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6 hover:border-[#4ade80]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#4ade80]/5"
              >
                <div className="text-[#4ade80] mb-4">{feature.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#0d2010] to-[#0a1a0a] border border-[#2d4a2d] rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-gray-400 mb-8">
            Join millions of patients who trust UniHealth with their medical
            records.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-[#4ade80] hover:bg-[#22c55e] text-[#0a0f0a] font-bold px-8 py-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#4ade80]/20"
            >
              Get Started — It&apos;s Free
            </Link>
            <Link
              href="/hospitals"
              className="border border-[#4ade80]/40 text-[#4ade80] hover:bg-[#4ade80]/10 font-medium px-8 py-4 rounded-xl text-sm transition-all duration-200"
            >
              Browse Hospitals
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1a2a1a] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UniHealthLogo size="sm" showText={false} />
            <span className="text-[#4ade80] font-bold text-sm tracking-widest">
              UNIHEALTH
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} UniHealth. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/hospitals"
              className="text-gray-500 hover:text-[#4ade80] text-sm transition-colors"
            >
              Hospitals
            </Link>
            <Link
              href="/contact"
              className="text-gray-500 hover:text-[#4ade80] text-sm transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
