"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { hospitalService } from "@/services/hospital.service";
import type {
  PatientProfileResponse,
  AllergyResponse,
  HealthConditionResponse,
  MedicalRecordResponse,
  VitalHistoryResponse,
  DocumentResponse,
} from "@/types";
import type { MedicationResponse } from "@/services/hospital.service";

type Tab =
  | "profile"
  | "allergies"
  | "conditions"
  | "medications"
  | "records"
  | "vitals"
  | "documents";

interface PatientData {
  profile: PatientProfileResponse | null;
  allergies: AllergyResponse[];
  conditions: HealthConditionResponse[];
  medications: MedicationResponse[];
  medicalRecords: MedicalRecordResponse[];
  vitalHistory: VitalHistoryResponse[];
  documents: DocumentResponse[];
}

export default function VerifyPatientPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [sessionExpires, setSessionExpires] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [tabLoading, setTabLoading] = useState(false);
  const [data, setData] = useState<PatientData>({
    profile: null,
    allergies: [],
    conditions: [],
    medications: [],
    medicalRecords: [],
    vitalHistory: [],
    documents: [],
  });

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const result = await hospitalService.verifyAccessCode(code.trim());
      setPatientId(result.patientId);
      setSessionExpires(result.sessionExpiresAt);
      // Load profile immediately
      const profile = await hospitalService.getPatientProfile(result.patientId);
      setData((prev) => ({ ...prev, profile }));
      toast.success("Access granted. Patient session opened.");
    } catch {
      toast.error("Invalid or expired access code.");
    } finally {
      setLoading(false);
    }
  }

  async function switchTab(tab: Tab) {
    setActiveTab(tab);
    if (!patientId) return;

    setTabLoading(true);
    try {
      switch (tab) {
        case "allergies":
          if (data.allergies.length === 0) {
            const allergies = await hospitalService.getPatientAllergies(patientId);
            setData((prev) => ({ ...prev, allergies }));
          }
          break;
        case "conditions":
          if (data.conditions.length === 0) {
            const conditions = await hospitalService.getPatientConditions(patientId);
            setData((prev) => ({ ...prev, conditions }));
          }
          break;
        case "medications":
          if (data.medications.length === 0) {
            const medications = await hospitalService.getPatientMedications(patientId);
            setData((prev) => ({ ...prev, medications }));
          }
          break;
        case "records":
          if (data.medicalRecords.length === 0) {
            const medicalRecords = await hospitalService.getPatientMedicalRecords(patientId);
            setData((prev) => ({ ...prev, medicalRecords }));
          }
          break;
        case "vitals":
          if (data.vitalHistory.length === 0) {
            const vitalHistory = await hospitalService.getPatientVitalHistory(patientId);
            setData((prev) => ({ ...prev, vitalHistory }));
          }
          break;
        case "documents":
          if (data.documents.length === 0) {
            const documents = await hospitalService.getPatientDocuments(patientId);
            setData((prev) => ({ ...prev, documents }));
          }
          break;
      }
    } catch {
      toast.error(`Failed to load ${tab}.`);
    } finally {
      setTabLoading(false);
    }
  }

  function reset() {
    setCode("");
    setPatientId(null);
    setSessionExpires(null);
    setActiveTab("profile");
    setData({
      profile: null,
      allergies: [],
      conditions: [],
      medications: [],
      medicalRecords: [],
      vitalHistory: [],
      documents: [],
    });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "allergies", label: "Allergies" },
    { id: "conditions", label: "Conditions" },
    { id: "medications", label: "Medications" },
    { id: "records", label: "Medical Records" },
    { id: "vitals", label: "Vital History" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#4ade80] mb-1">Verify Patient</h1>
      <p className="text-gray-400 text-sm mb-6">
        Enter the access code provided by the patient to view their health records.
      </p>

      {!patientId ? (
        <form onSubmit={handleVerify} className="max-w-md">
          <div className="bg-[#0f1f0f] border border-[#1a2e1a] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Patient Access Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABCD-1234"
                className="w-full bg-[#0a160a] border border-[#1a2e1a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4ade80]/50 tracking-widest uppercase"
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-[#4ade80] text-black font-semibold py-3 rounded-xl hover:bg-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Open Session"}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {/* Session banner */}
          <div className="flex items-center justify-between mb-4 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-xl px-4 py-3">
            <div>
              <span className="text-[#4ade80] font-semibold text-sm">
                Session Active
              </span>
              {sessionExpires && (
                <span className="text-gray-400 text-xs ml-2">
                  Expires: {new Date(sessionExpires).toLocaleTimeString()}
                </span>
              )}
            </div>
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Close Session
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20"
                    : "text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-[#0f1f0f] border border-[#1a2e1a] rounded-2xl p-5 min-h-[300px]">
            {tabLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {activeTab === "profile" && <ProfileTab profile={data.profile} />}
                {activeTab === "allergies" && <AllergyTab items={data.allergies} />}
                {activeTab === "conditions" && <ConditionTab items={data.conditions} />}
                {activeTab === "medications" && <MedicationTab items={data.medications} />}
                {activeTab === "records" && <RecordsTab items={data.medicalRecords} />}
                {activeTab === "vitals" && <VitalsTab items={data.vitalHistory} />}
                {activeTab === "documents" && <DocumentsTab items={data.documents} />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileTab({ profile }: { profile: PatientProfileResponse | null }) {
  if (!profile) return <EmptyState message="No profile data." />;
  const rows: [string, string | undefined][] = [
    ["Full Name", profile.fullName],
    ["Patient ID", profile.patientId],
    ["Date of Birth", profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : undefined],
    ["Gender", profile.gender],
    ["Marital Status", profile.maritalStatus],
    ["Blood Group", profile.bloodGroup],
    ["Phone", profile.phoneNumber],
    ["Address", [profile.address, profile.city, profile.state, profile.country].filter(Boolean).join(", ")],
    ["Next of Kin", profile.nextOfKinName],
    ["NOK Phone", profile.nextOfKinPhone],
    ["NOK Relationship", profile.nextOfKinRelationship],
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {rows.map(([label, value]) =>
        value ? (
          <div key={label}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm text-white">{value}</p>
          </div>
        ) : null
      )}
    </div>
  );
}

function AllergyTab({ items }: { items: AllergyResponse[] }) {
  if (items.length === 0) return <EmptyState message="No allergies recorded." />;
  const severityColor: Record<string, string> = {
    Mild: "text-yellow-400",
    Moderate: "text-orange-400",
    Severe: "text-red-400",
  };
  return (
    <div className="space-y-2">
      {items.map((a) => (
        <div key={a.id} className="flex items-center justify-between p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <div>
            <p className="text-sm text-white font-medium">{a.name}</p>
            {a.notes && <p className="text-xs text-gray-400">{a.notes}</p>}
          </div>
          <span className={`text-xs font-semibold ${severityColor[a.severity] ?? "text-gray-400"}`}>
            {a.severity}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConditionTab({ items }: { items: HealthConditionResponse[] }) {
  if (items.length === 0) return <EmptyState message="No health conditions recorded." />;
  return (
    <div className="space-y-2">
      {items.map((c) => (
        <div key={c.id} className="p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-medium">{c.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              c.status === "Active" ? "bg-green-900/40 text-green-400" :
              c.status === "Resolved" ? "bg-blue-900/40 text-blue-400" :
              "bg-gray-800 text-gray-400"
            }`}>{c.status}</span>
          </div>
          {c.diagnosedDate && (
            <p className="text-xs text-gray-400 mt-1">
              Diagnosed: {new Date(c.diagnosedDate).toLocaleDateString()}
            </p>
          )}
          {c.notes && <p className="text-xs text-gray-500 mt-1">{c.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function MedicationTab({ items }: { items: MedicationResponse[] }) {
  if (items.length === 0) return <EmptyState message="No medications recorded." />;
  return (
    <div className="space-y-2">
      {items.map((m) => (
        <div key={m.id} className="p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <p className="text-sm text-white font-medium">{m.name}</p>
          {m.dosage && <p className="text-xs text-gray-400">Dosage: {m.dosage}</p>}
          {m.frequency && <p className="text-xs text-gray-400">Frequency: {m.frequency}</p>}
          {m.notes && <p className="text-xs text-gray-500 mt-1">{m.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function RecordsTab({ items }: { items: MedicalRecordResponse[] }) {
  if (items.length === 0) return <EmptyState message="No medical records found." />;
  return (
    <div className="space-y-2">
      {items.map((r) => (
        <div key={r.id} className="p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <p className="text-sm text-white font-medium">{r.displayName}</p>
          <p className="text-xs text-gray-400">{r.recordType}</p>
        </div>
      ))}
    </div>
  );
}

function VitalsTab({ items }: { items: VitalHistoryResponse[] }) {
  if (items.length === 0) return <EmptyState message="No vital history recorded." />;
  return (
    <div className="space-y-2">
      {items.map((v) => (
        <div key={v.id} className="p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-medium">{v.condition}</p>
            <span className="text-xs text-gray-400">{v.status}</span>
          </div>
          {v.notes && <p className="text-xs text-gray-500 mt-1">{v.notes}</p>}
        </div>
      ))}
    </div>
  );
}

function DocumentsTab({ items }: { items: DocumentResponse[] }) {
  if (items.length === 0) return <EmptyState message="No documents uploaded." />;
  return (
    <div className="space-y-2">
      {items.map((d) => (
        <div key={d.id} className="flex items-center justify-between p-3 bg-[#0a160a] rounded-xl border border-[#1a2e1a]">
          <div>
            <p className="text-sm text-white font-medium">{d.fileName}</p>
            <p className="text-xs text-gray-400">
              {d.fileType} · {(d.fileSize / 1024).toFixed(1)} KB · {new Date(d.uploadedAt).toLocaleDateString()}
            </p>
            {d.description && <p className="text-xs text-gray-500">{d.description}</p>}
          </div>
          <a
            href={d.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#4ade80] hover:underline ml-4"
          >
            View
          </a>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
      {message}
    </div>
  );
}
