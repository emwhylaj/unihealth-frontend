"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { patientService } from "@/services/patient.service";
import type { VitalHistoryResponse } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-red-500/10 text-red-400 border border-red-500/20",
  Inactive: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  Resolved: "bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20",
};

export default function VitalHistoryPage() {
  const [items, setItems] = useState<VitalHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("Active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await patientService.getVitalHistory();
      setItems(data);
    } catch {
      toast.error("Failed to load vital history");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!condition.trim()) {
      toast.error("Please enter a condition name");
      return;
    }
    setSubmitting(true);
    try {
      const item = await patientService.createVitalHistory({
        condition,
        status,
        notes: notes || undefined,
      });
      setItems([...items, item]);
      setModalOpen(false);
      resetForm();
      toast.success("Condition added!");
    } catch {
      toast.error("Failed to add condition");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await patientService.deleteVitalHistory(id);
      setItems(items.filter((i) => i.id !== id));
      toast.success("Entry removed");
    } catch {
      toast.error("Failed to remove entry");
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setCondition("");
    setStatus("Active");
    setNotes("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading vital history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vital History</h1>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          + Add more
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2d4a2d] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">No vital history recorded</p>
          <p className="text-gray-400 text-sm mb-4">
            Record past or current health conditions and their status.
          </p>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Add First Entry
          </Button>
        </div>
      ) : (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2d4a2d] flex items-center justify-between">
            <h2 className="text-[#4ade80] font-semibold text-sm uppercase tracking-wider">
              Health Conditions
            </h2>
            <span className="text-gray-500 text-xs">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="divide-y divide-[#1e2e1e]">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between px-6 py-4 hover:bg-[#141e14] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-[#2d4a2d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {item.condition}
                    </p>
                    {item.notes && (
                      <p className="text-gray-500 text-xs mt-0.5">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      STATUS_COLORS[item.status] ||
                      "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
                    title="Remove entry"
                  >
                    {deleting === item.id ? (
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
        title="Add Health Condition"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Condition Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Stroke, Hypertension, Asthma"
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details..."
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
              Add Condition
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
