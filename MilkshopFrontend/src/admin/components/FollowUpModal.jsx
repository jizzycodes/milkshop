import { useState } from "react";

const CONTACT_TYPES = [
  { value: "CALL", label: "Call" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
];

export default function FollowUpModal({ open, onClose, onSubmit }) {
  const [contactType, setContactType] = useState("CALL");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [nextFollowupAt, setNextFollowupAt] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      contactType,
      outcome: outcome || null,
      notes,
      nextFollowupAt: nextFollowupAt || null,
    });
    setNotes("");
    setOutcome("");
    setNextFollowupAt("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2410]/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#DDE8CF] bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DDE8CF] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1A2410]">Add Contact Record</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#5A6B4A] hover:bg-[#EEF5E6] hover:text-[#1A2410] transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          {/* Contact Type */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Contact Type
            </label>
            <div className="flex gap-2">
              {CONTACT_TYPES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setContactType(c.value)}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition ${
                    contactType === c.value
                      ? "border-[#5A9216] bg-[#5A9216] text-white"
                      : "border-[#DDE8CF] bg-white text-[#5A6B4A] hover:bg-[#EEF5E6]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Outcome <span className="normal-case font-normal text-[#9AA686]">(optional)</span>
            </label>
            <input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value.toUpperCase())}
              placeholder="e.g. NO_ANSWER, CALLBACK, PAID"
              className="w-full rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] placeholder:text-[#9AA686] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition font-mono"
            />
          </div>

          {/* Next Contact Date */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Next Contact <span className="normal-case font-normal text-[#9AA686]">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={nextFollowupAt || ""}
              onChange={(e) => setNextFollowupAt(e.target.value)}
              className="w-full rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conversation details, commitments, objections..."
              className="w-full resize-none rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] placeholder:text-[#9AA686] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[#DDE8CF] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#DDE8CF] px-4 py-1.5 text-xs font-medium text-[#5A6B4A] hover:bg-[#EEF5E6] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-[#5A9216] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#3E6610] transition"
          >
            Save Record
          </button>
        </div>

      </div>
    </div>
  );
}