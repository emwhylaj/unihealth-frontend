"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { patientService } from "@/services/patient.service";
import type { PatientProfileResponse, AccessCodeResponse } from "@/types";
import {
  decodeGender,
  decodeMaritalStatus,
  decodeBloodGroup,
  bloodGroupToApi,
} from "@/utils/enums";
import { useAuthStore } from "@/store/auth.store";

// ── Admin Overview ────────────────────────────────────────────────────────────

interface PlatformStats { totalHospitals: number; statesCovered: number; totalPatients: number; }
interface HospitalItem { id: string; name: string; hospitalCode: string; type: number; city?: string; state?: string; isVerified: boolean; }

function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const headers = { "X-Skip-Encryption": "true" };
    Promise.all([
      fetch(`${apiUrl}/api/v1/stats`, { headers }).then((r) => r.ok ? r.json() : null),
      fetch(`${apiUrl}/api/v1/hospitals`, { headers }).then((r) => r.ok ? r.json() : []),
    ])
      .then(([s, h]) => { setStats(s); setHospitals(Array.isArray(h) ? h : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading overview...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Registered Hospitals", value: stats?.totalHospitals ?? 0, icon: "🏥" },
    { label: "States Covered", value: stats?.statesCovered ?? 0, icon: "🗺️" },
    { label: "Total Patients", value: stats?.totalPatients ?? 0, icon: "👤" },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold text-white">Admin Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2d4a2d] flex items-center justify-center text-2xl flex-shrink-0">
              {card.icon}
            </div>
            <div>
              <p className="text-3xl font-bold text-[#4ade80]">{card.value.toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-0.5">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hospitals Table */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#2d4a2d] flex items-center justify-between">
          <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider">Registered Hospitals</h2>
          <span className="text-gray-500 text-xs">{hospitals.length} total</span>
        </div>
        {hospitals.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">No hospitals registered yet.</div>
        ) : (
          <div className="divide-y divide-[#1e2e1e]">
            {hospitals.map((h) => (
              <div key={h.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#141e14] transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">{h.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{[h.city, h.state].filter(Boolean).join(", ") || "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs font-mono">{h.hospitalCode}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${h.isVerified ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}>
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

// ── Dispatcher ────────────────────────────────────────────────────────────────

export default function DashboardProfilePage() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "Admin") return <AdminOverview />;
  if (role === "Hospital") return <HospitalOverview />;
  return <PatientProfilePage />;
}

// ── Hospital Overview ─────────────────────────────────────────────────────────

function HospitalOverview() {
  const { setProfileName } = useAuthStore();
  const [hospital, setHospital] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/v1/hospital/me`, {
      headers: {
        "X-Skip-Encryption": "true",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setHospital(data);
          setProfileName(data.name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setProfileName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading hospital profile...</p>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Hospital Name", value: hospital?.name },
    { label: "Hospital Code", value: hospital?.hospitalCode },
    { label: "Type", value: hospital?.type },
    { label: "City", value: hospital?.city },
    { label: "State", value: hospital?.state },
    { label: "Phone", value: hospital?.phone },
    { label: "Email", value: hospital?.email },
    { label: "Address", value: hospital?.address },
    { label: "Verification Status", value: hospital?.isVerified ? "Verified" : "Pending Verification" },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Hospital Profile</h1>

      {!hospital ? (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-10 text-center">
          <p className="text-white font-semibold mb-2">No hospital profile found</p>
          <p className="text-gray-400 text-sm">Your hospital profile has not been set up yet. Contact the admin.</p>
        </div>
      ) : (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6">
          <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-6">Hospital Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.label}>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-white text-sm font-medium">{f.value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/dashboard/hospital/verify" className="bg-[#1a2a1a] border border-[#2d4a2d] hover:border-[#4ade80]/40 rounded-2xl p-6 flex items-center gap-4 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#2d4a2d] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm group-hover:text-[#4ade80] transition-colors">Verify Patient</p>
            <p className="text-gray-500 text-xs mt-0.5">Enter a patient access code to view their records</p>
          </div>
        </a>
        <a href="/dashboard/hospital/search" className="bg-[#1a2a1a] border border-[#2d4a2d] hover:border-[#4ade80]/40 rounded-2xl p-6 flex items-center gap-4 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#2d4a2d] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm group-hover:text-[#4ade80] transition-colors">Search Patient</p>
            <p className="text-gray-500 text-xs mt-0.5">Find a patient by phone number</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ── Patient Profile ───────────────────────────────────────────────────────────

function PatientProfilePage() {
  const { setProfileName } = useAuthStore();
  const [profile, setProfile] = useState<PatientProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState<AccessCodeResponse | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editHealthOpen, setEditHealthOpen] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Edit profile form state
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
  });

  // Edit health form state
  const [healthData, setHealthData] = useState<{
    bloodGroup: string;
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  }>({
    bloodGroup: "",
    maritalStatus: "Single",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await patientService.getProfile();
      setProfile(data);
      setProfileName(data.fullName);
      setEditData({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || "",
        // Format date for <input type="date"> (YYYY-MM-DD)
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });
      // Decode enum integers to display strings for the edit form
      const decodedBloodGroup = decodeBloodGroup(data.bloodGroup as unknown as number | string);
      const decodedMaritalStatus = decodeMaritalStatus(data.maritalStatus as unknown as number | string);
      setHealthData({
        bloodGroup: decodedBloodGroup !== "—" ? decodedBloodGroup : "",
        maritalStatus: (decodedMaritalStatus as "Single" | "Married" | "Divorced" | "Widowed") || "Single",
      });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 403) {
        // No profile or not a patient — silently ignore, dashboard still renders
      } else {
        toast.error("Failed to load profile. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setCodeLoading(true);
    try {
      const code = await patientService.generateAccessCode();
      setAccessCode(code);
      toast.success("Access code generated!");
    } catch {
      toast.error("Failed to generate access code");
    } finally {
      setCodeLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      const updated = await patientService.uploadProfilePhoto(file);
      setProfile(updated);
      toast.success("Photo updated!");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocUploading(true);
    try {
      await patientService.uploadDocument(file);
      toast.success("Document uploaded successfully!");
    } catch {
      toast.error("Failed to upload document");
    } finally {
      setDocUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updated = await patientService.updateProfile({
        firstName: editData.firstName,
        lastName: editData.lastName,
        middleName: editData.middleName || undefined,
        dateOfBirth: editData.dateOfBirth,
        phoneNumber: editData.phoneNumber || undefined,
        address: editData.address || undefined,
      });
      setProfile(updated);
      setEditModalOpen(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleSaveHealth = async () => {
    try {
      const updated = await patientService.updateProfile({
        bloodGroup: healthData.bloodGroup ? bloodGroupToApi[healthData.bloodGroup] : undefined,
        maritalStatus: healthData.maritalStatus,
      });
      setProfile(updated);
      setEditHealthOpen(false);
      toast.success("Health details updated!");
    } catch {
      toast.error("Failed to update health details");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white">My Profile</h1>

      {/* Personal Information Card */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6">
        <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-6">
          Personal Information
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2d4a2d] flex items-center justify-center">
              {profile?.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <input
              type="file"
              ref={photoInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
              className="text-xs text-[#4ade80] hover:text-[#22c55e] border border-[#4ade80]/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {photoUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>

          {/* Info Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Full Name" value={profile?.fullName || "—"} />
            <InfoField
              label="Date of Birth"
              value={profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : "—"}
            />
            <InfoField label="Gender" value={decodeGender(profile?.gender as unknown as number | string)} />
            <InfoField
              label="Phone Number"
              value={profile?.phoneNumber || "—"}
            />
            <InfoField
              label="Address"
              value={profile?.address || "—"}
              fullWidth
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Details
          </Button>
        </div>
      </div>

      {/* Health Details Card */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6">
        <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-6">
          Health Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoField label="Blood Group" value={decodeBloodGroup(profile?.bloodGroup as unknown as number | string)} />
          <InfoField label="Marital Status" value={decodeMaritalStatus(profile?.maritalStatus as unknown as number | string)} />
          <InfoField
            label="Allergies"
            value={
              profile?.allergies && profile.allergies.length > 0
                ? profile.allergies.map((a) => a.name).join(", ")
                : "None recorded"
            }
          />
          <InfoField
            label="Health Conditions"
            value={
              profile?.healthConditions && profile.healthConditions.length > 0
                ? profile.healthConditions.map((c) => c.name).join(", ")
                : "None recorded"
            }
            fullWidth
          />
        </div>

        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditHealthOpen(true)}
          >
            Edit Details
          </Button>
        </div>
      </div>

      {/* Upload Documents Card */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6">
        <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-4">
          Upload Documents
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Upload medical reports, lab results, prescriptions, or any other
          health documents.
        </p>

        <input
          type="file"
          ref={docInputRef}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleDocUpload}
        />

        <button
          onClick={() => docInputRef.current?.click()}
          disabled={docUploading}
          className="w-full border-2 border-dashed border-[#2d4a2d] hover:border-[#4ade80]/50 rounded-xl p-8 flex flex-col items-center gap-3 transition-all duration-200 group disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-[#2d4a2d] group-hover:bg-[#4ade80]/10 flex items-center justify-center transition-colors">
            {docUploading ? (
              <div className="w-6 h-6 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[#4ade80] font-medium text-sm">
              {docUploading ? "Uploading..." : "Click to Upload"}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              PDF, JPG, PNG, DOC up to 10MB
            </p>
          </div>
        </button>
      </div>

      {/* Generate Access Code */}
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider mb-2">
              Hospital Access Code
            </h2>
            <p className="text-gray-400 text-sm">
              Generate a temporary code to share your health records with a
              hospital. The code expires after use.
            </p>
            {accessCode && (
              <div className="mt-4 bg-[#0d2010] border border-[#4ade80]/30 rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-1">Your access code:</p>
                <p className="text-[#4ade80] text-3xl font-bold font-mono tracking-widest">
                  {accessCode.code}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Expires:{" "}
                  {new Date(accessCode.expiresAt).toLocaleString("en-GB")}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            loading={codeLoading}
            onClick={handleGenerateCode}
            className="whitespace-nowrap"
          >
            Generate Code
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Personal Information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={editData.firstName}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
                className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={editData.lastName}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
                className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Middle Name
            </label>
            <input
              type="text"
              value={editData.middleName}
              onChange={(e) =>
                setEditData({ ...editData, middleName: e.target.value })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={editData.dateOfBirth}
              onChange={(e) =>
                setEditData({ ...editData, dateOfBirth: e.target.value })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={editData.phoneNumber}
              onChange={(e) =>
                setEditData({ ...editData, phoneNumber: e.target.value })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={editData.address}
              onChange={(e) =>
                setEditData({ ...editData, address: e.target.value })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Health Modal */}
      <Modal
        isOpen={editHealthOpen}
        onClose={() => setEditHealthOpen(false)}
        title="Edit Health Details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Blood Group
            </label>
            <select
              value={healthData.bloodGroup}
              onChange={(e) =>
                setHealthData({ ...healthData, bloodGroup: e.target.value })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Marital Status
            </label>
            <select
              value={healthData.maritalStatus}
              onChange={(e) =>
                setHealthData({
                  ...healthData,
                  maritalStatus: e.target.value as "Single" | "Married" | "Divorced" | "Widowed",
                })
              }
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setEditHealthOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveHealth}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoField({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-white text-sm font-medium">{value}</p>
    </div>
  );
}
