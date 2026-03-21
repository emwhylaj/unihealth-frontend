"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { patientService } from "@/services/patient.service";
import type {
  MedicalRecordResponse,
  MedicalRecordEntryResponse,
  RecordType,
} from "@/types";

const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  BloodPressure: "Blood Pressure",
  BloodGlucose: "Blood Sugar",
  HeartRate: "Heart Rate",
  Temperature: "Body Temperature",
  Weight: "Weight",
  Height: "Height",
  OxygenSaturation: "Oxygen Saturation",
};

const RECORD_TYPE_UNITS: Record<RecordType, string> = {
  BloodPressure: "mmHg",
  BloodGlucose: "mg/dL",
  HeartRate: "bpm",
  Temperature: "°C",
  Weight: "kg",
  Height: "cm",
  OxygenSaturation: "%",
};

interface RecordWithEntries extends MedicalRecordResponse {
  entries: MedicalRecordEntryResponse[];
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<RecordWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [addEntryRecord, setAddEntryRecord] = useState<RecordWithEntries | null>(null);

  // New record form
  const [newRecordType, setNewRecordType] = useState<RecordType>("BloodPressure");
  const [newRecordLabel, setNewRecordLabel] = useState("");

  // New entry form
  const [entryValue, setEntryValue] = useState("");
  const [entrySecondaryValue, setEntrySecondaryValue] = useState("");
  const [entryUnit, setEntryUnit] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [entryNotes, setEntryNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await patientService.getMedicalRecords();
      const withEntries = await Promise.all(
        data.map(async (record) => {
          try {
            const entries = await patientService.getMedicalRecordEntries(
              record.id,
              3
            );
            return { ...record, entries };
          } catch {
            return { ...record, entries: [] };
          }
        })
      );
      setRecords(withEntries);
    } catch {
      toast.error("Failed to load medical records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    setSubmitting(true);
    try {
      const record = await patientService.createMedicalRecord({
        recordType: newRecordType,
        label: newRecordLabel || undefined,
      });
      setRecords([...records, { ...record, entries: [] }]);
      setAddRecordOpen(false);
      setNewRecordLabel("");
      toast.success("Medical record type added!");
    } catch {
      toast.error("Failed to add record type");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddEntry = async () => {
    if (!addEntryRecord) return;
    setSubmitting(true);
    try {
      const entry = await patientService.addMedicalRecordEntry(
        addEntryRecord.id,
        {
          value: parseFloat(entryValue),
          unit:
            entryUnit ||
            RECORD_TYPE_UNITS[addEntryRecord.recordType as RecordType],
          secondaryValue: entrySecondaryValue
            ? parseFloat(entrySecondaryValue)
            : undefined,
          recordedAt: new Date(entryDate).toISOString(),
          notes: entryNotes || undefined,
        }
      );

      setRecords(
        records.map((r) =>
          r.id === addEntryRecord.id
            ? { ...r, entries: [entry, ...r.entries].slice(0, 3) }
            : r
        )
      );
      setAddEntryRecord(null);
      resetEntryForm();
      toast.success("Entry added!");
    } catch {
      toast.error("Failed to add entry");
    } finally {
      setSubmitting(false);
    }
  };

  const resetEntryForm = () => {
    setEntryValue("");
    setEntrySecondaryValue("");
    setEntryUnit("");
    setEntryDate(new Date().toISOString().slice(0, 16));
    setEntryNotes("");
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusColor = (index: number) => {
    const colors = [
      "text-[#4ade80]",
      "text-yellow-400",
      "text-blue-400",
      "text-purple-400",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Medical Records</h1>
        <Button variant="primary" size="sm" onClick={() => setAddRecordOpen(true)}>
          + Add Record Type
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#2d4a2d] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">No medical records yet</p>
          <p className="text-gray-400 text-sm mb-4">
            Add a record type to start tracking your health metrics.
          </p>
          <Button variant="primary" size="sm" onClick={() => setAddRecordOpen(true)}>
            Add Your First Record
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record, idx) => (
            <div
              key={record.id}
              className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`font-semibold text-base ${getStatusColor(idx)}`}>
                    {record.displayName ||
                      RECORD_TYPE_LABELS[record.recordType as RecordType] ||
                      record.recordType}
                  </h3>
                  {record.label && (
                    <p className="text-gray-500 text-xs mt-0.5">{record.label}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setAddEntryRecord(record);
                    setEntryUnit(
                      RECORD_TYPE_UNITS[record.recordType as RecordType] || ""
                    );
                  }}
                  className="text-xs text-[#4ade80] border border-[#4ade80]/30 hover:bg-[#4ade80]/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Add more
                </button>
              </div>

              {record.entries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No entries yet. Click &quot;Add more&quot; to log a reading.
                </p>
              ) : (
                <div className="space-y-2">
                  {record.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between bg-[#141e14] rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
                        <div>
                          <span className="text-white font-semibold text-sm">
                            {entry.value}
                            {entry.secondaryValue && `/${entry.secondaryValue}`}{" "}
                            {entry.unit}
                          </span>
                          {entry.notes && (
                            <p className="text-gray-500 text-xs mt-0.5">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {formatDate(entry.recordedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Record Type Modal */}
      <Modal
        isOpen={addRecordOpen}
        onClose={() => setAddRecordOpen(false)}
        title="Add Medical Record Type"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Record Type
            </label>
            <select
              value={newRecordType}
              onChange={(e) => setNewRecordType(e.target.value as RecordType)}
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            >
              {Object.entries(RECORD_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Custom Label (optional)
            </label>
            <input
              type="text"
              value={newRecordLabel}
              onChange={(e) => setNewRecordLabel(e.target.value)}
              placeholder="e.g. Morning readings"
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" onClick={() => setAddRecordOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={submitting}
              onClick={handleAddRecord}
            >
              Add Record Type
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Entry Modal */}
      <Modal
        isOpen={!!addEntryRecord}
        onClose={() => {
          setAddEntryRecord(null);
          resetEntryForm();
        }}
        title={`Add ${
          addEntryRecord
            ? RECORD_TYPE_LABELS[addEntryRecord.recordType as RecordType] ||
              addEntryRecord.displayName
            : ""
        } Entry`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Value <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                placeholder="e.g. 120"
                className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Unit
              </label>
              <input
                type="text"
                value={entryUnit}
                onChange={(e) => setEntryUnit(e.target.value)}
                placeholder="e.g. mmHg"
                className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
              />
            </div>
          </div>

          {addEntryRecord?.recordType === "BloodPressure" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Diastolic Value (lower number)
              </label>
              <input
                type="number"
                step="0.1"
                value={entrySecondaryValue}
                onChange={(e) => setEntrySecondaryValue(e.target.value)}
                placeholder="e.g. 80"
                className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Notes (optional)
            </label>
            <input
              type="text"
              value={entryNotes}
              onChange={(e) => setEntryNotes(e.target.value)}
              placeholder="Any relevant notes..."
              className="w-full bg-[#141e14] border border-[#2d4a2d] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setAddEntryRecord(null);
                resetEntryForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={submitting}
              onClick={handleAddEntry}
              disabled={!entryValue}
            >
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
