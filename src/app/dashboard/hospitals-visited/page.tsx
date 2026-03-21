"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { patientService } from "@/services/patient.service";
import type { HospitalVisitResponse } from "@/types";

export default function HospitalsVisitedPage() {
  const [visits, setVisits] = useState<HospitalVisitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalLocation, setHospitalLocation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const data = await patientService.getHospitalsVisited();
      setVisits(data);
    } catch {
      toast.error("Failed to load hospital visits");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!hospitalName.trim()) {
      toast.error("Please enter a hospital name");
      return;
    }
    setSubmitting(true);
    try {
      const visit = await patientService.addHospitalVisit({
        hospitalName,
        hospitalLocation: hospitalLocation || undefined,
        visitDate: visitDate ? new Date(visitDate).toISOString() : undefined,
        notes: notes || undefined,
      });
      setVisits([...visits, visit]);
      setModalOpen(false);
      resetForm();
      toast.success("Hospital visit added!");
    } catch {
      toast.error("Failed to add hospital visit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await patientService.deleteHospitalVisit(id);
      setVisits(visits.filter((v) => v.id !== id));
      toast.success("Visit removed");
    } catch {
      toast.error("Failed to remove visit");
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setHospitalName("");
    setHospitalLocation("");
    setVisitDate("");
    setNotes("");
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
          <p className="text-gray-400 text-sm">Loading hospital visits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Hospitals Visited</h1>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          + Add more
        </Button>
      </div>

      {visits.length === 0 ? (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2d4a2d] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">No hospital visits recorded</p>
          <p className="text-gray-400 text-sm mb-4">
            Keep track of hospitals you have visited for consultations or
            treatment.
          </p>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Add First Visit
          </Button>
        </div>
      ) : (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2d4a2d] flex items-center justify-between">
            <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider">
              Hospital Visits
            </h2>
            <span className="text-gray-500 text-xs">
              {visits.length} {visits.length === 1 ? "visit" : "visits"}
            </span>
          </div>

          <div className="divide-y divide-[#1e2e1e]">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="flex items-start justify-between px-6 py-4 hover:bg-[#141e14] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-10 h-10 rounded-xl bg-[#2d4a2d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {visit.hospitalName}
                    </p>
                    {visit.hospitalLocation && (
                      <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {visit.hospitalLocation}
                      </p>
                    )}
                    {visit.notes && (
                      <p className="text-gray-500 text-xs mt-1">{visit.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {visit.visitDate && (
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(visit.visitDate)}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(visit.id)}
                    disabled={deleting === visit.id}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded flex-shrink-0"
                    title="Remove visit"
                  >
                    {deleting === visit.id ? (
                      <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title="Add Hospital Visit"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Hospital Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g. Lagos University Teaching Hospital"
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Location (optional)
            </label>
            <input
              type="text"
              value={hospitalLocation}
              onChange={(e) => setHospitalLocation(e.target.value)}
              placeholder="e.g. Idi-Araba, Lagos"
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Date of Visit (optional)
            </label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for visit, doctor seen, etc."
              rows={3}
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={submitting}
              onClick={handleAdd}
            >
              Add Visit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
