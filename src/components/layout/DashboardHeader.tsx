"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

interface DashboardHeaderProps {
  fullName?: string;
  patientId?: string;
}

export default function DashboardHeader({
  fullName = "Patient",
  patientId,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { logout, refreshToken } = useAuthStore();

  const handleSignOut = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Silently ignore logout API errors
    } finally {
      logout();
      toast.success("Signed out successfully");
      router.push("/login");
    }
  };

  return (
    <header className="bg-[#0d2010] border-b border-[#1a3a1a] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[#4ade80] font-semibold text-lg">
            Welcome, {fullName}
          </p>
          {patientId && (
            <p className="text-gray-400 text-sm">
              Patient ID:{" "}
              <span className="text-gray-300 font-mono">{patientId}</span>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 bg-[#1a2a1a] hover:bg-[#252f25] text-[#4ade80] border border-[#4ade80]/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign Out
      </button>
    </header>
  );
}
