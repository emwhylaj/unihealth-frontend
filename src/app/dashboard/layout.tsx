"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized  = useAuthStore((s) => s.isInitialized);
  const patientId      = useAuthStore((s) => s.user?.patientId);
  const profileName    = useAuthStore((s) => s.profileName);
  const userEmail      = useAuthStore((s) => s.user?.email);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect once we KNOW the session state
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  // While loading auth state, show a full-screen spinner
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4ade80] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Initialized but not authenticated → redirect in progress, render nothing
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          fullName={profileName || userEmail?.split("@")[0] || "Patient"}
          patientId={patientId}
        />

        <button
          className="lg:hidden fixed bottom-4 right-4 z-40 bg-[#4ade80] text-[#0a0f0a] p-3 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
