"use client";

import { useEffect, useState } from "react";

interface Hospital {
  id: string;
  name: string;
  hospitalCode: string;
  type: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  isVerified: boolean;
  registrationDate: string;
}

const HOSPITAL_TYPES: Record<number, string> = {
  0: "General",
  1: "Teaching",
  2: "Specialist",
  3: "Private",
  4: "Federal",
  5: "State",
};

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filtered, setFiltered] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/v1/hospitals`, { headers: { "X-Skip-Encryption": "true" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setHospitals(list);
        setFiltered(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = hospitals;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.hospitalCode.toLowerCase().includes(q) ||
          h.city?.toLowerCase().includes(q)
      );
    }
    if (stateFilter) {
      result = result.filter((h) => h.state === stateFilter);
    }
    setFiltered(result);
  }, [search, stateFilter, hospitals]);

  const states = [...new Set(hospitals.map((h) => h.state).filter(Boolean))].sort() as string[];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return dateStr; }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">All Hospitals</h1>
        <span className="text-gray-500 text-sm">{hospitals.length} registered</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, code, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#1a2a1a] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-[#1a2a1a] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] min-w-[160px]"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No hospitals found.</div>
        ) : (
          <div className="divide-y divide-[#1e2e1e]">
            {filtered.map((h) => (
              <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-3 hover:bg-[#141e14] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-10 h-10 rounded-xl bg-[#2d4a2d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{h.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {[h.address, h.city, h.state].filter(Boolean).join(", ") || "No address"}
                    </p>
                    {h.phone && <p className="text-gray-600 text-xs mt-0.5">{h.phone}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <span className="text-gray-400 text-xs font-mono bg-[#0d2010] px-2 py-1 rounded-lg">
                    {h.hospitalCode}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {HOSPITAL_TYPES[h.type] ?? "Unknown"}
                  </span>
                  <span className="text-gray-600 text-xs whitespace-nowrap">
                    {formatDate(h.registrationDate)}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                    h.isVerified
                      ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {h.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
