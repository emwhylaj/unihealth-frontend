"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { hospitalService } from "@/services/hospital.service";
import type { PatientSearchResult } from "@/services/hospital.service";

export default function SearchPatientPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PatientSearchResult[] | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(false);
    try {
      const data = await hospitalService.searchPatients(trimmed);
      setResults(data);
      setSearched(true);
      if (data.length === 0) {
        toast("No patients found for that phone number.", { icon: "ℹ️" });
      }
    } catch {
      toast.error("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#4ade80] mb-1">Search Patient</h1>
      <p className="text-gray-400 text-sm mb-6">
        Search for a patient by their registered phone number.
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+2348012345678"
          className="flex-1 bg-[#0f1f0f] border border-[#1a2e1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4ade80]/50"
        />
        <button
          type="submit"
          disabled={loading || !phone.trim()}
          className="bg-[#4ade80] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && results !== null && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              No patients found for &quot;{phone}&quot;.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              {results.map((patient) => (
                <div
                  key={patient.patientId}
                  className="flex items-center justify-between bg-[#0f1f0f] border border-[#1a2e1a] rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    {patient.profilePhotoUrl ? (
                      <Image
                        src={patient.profilePhotoUrl}
                        alt={`${patient.firstName} ${patient.lastName}`}
                        width={44}
                        height={44}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center text-[#4ade80] font-bold text-sm">
                        {patient.firstName[0]}
                        {patient.lastName[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {patient.patientId}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/hospital/verify"
                    className="text-xs text-[#4ade80] border border-[#4ade80]/30 px-3 py-1.5 rounded-lg hover:bg-[#4ade80]/10 transition-colors"
                  >
                    Verify &amp; View Records
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
