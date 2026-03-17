import { useEffect, useState } from "react"

const DEFAULT_RESULT_OPTIONS = [
  "No Response",
  "Busy",
  "Callback",
  "Issue",
  "Drop",
  "Archive",
  "Confirmed Schedule",
]

export default function AddContactRecordModal({ open, onClose, onSubmit, options }) {
  const [now, setNow] = useState("")
  const [result, setResult] = useState("")
  const [nextContactAt, setNextContactAt] = useState("")
  const [remarks, setRemarks] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!open) return
    const d = new Date()
    const iso = d.toISOString().slice(0, 16)
    setNow(iso)
    setResult("")
    setNextContactAt("")
    setRemarks("")
    setError("")
    setSaving(false)
    setConfirming(false)
  }, [open])

  if (!open) return null

  const choices =
    Array.isArray(options) && options.length > 0 ? options : DEFAULT_RESULT_OPTIONS

  const handleSave = async () => {
    if (!result) {
      setError("Please select a result.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await onSubmit?.({
        contactRecord: result,
        nextContactAt: nextContactAt || null,
        notes: remarks,
      })
      onClose?.()
    } catch (e) {
      setError(e?.message || "Failed to save contact record")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2410]/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#DDE8CF] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#DDE8CF] px-5 py-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5A6B4A]">
              Contact Record
            </p>
            <h2 className="text-sm font-semibold text-[#1A2410]">
              Add Contact Record
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#5A6B4A] transition hover:bg-[#EEF5E6] hover:text-[#1A2410]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Contact Date / Time
            </label>
            <input
              type="datetime-local"
              value={now}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] opacity-80"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Next Contact Date / Time
            </label>
            <input
              type="datetime-local"
              value={nextContactAt || ""}
              onChange={(e) => setNextContactAt(e.target.value)}
              className="w-full rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Result
            </label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition"
            >
              <option value="">Select...</option>
              {choices.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Remarks
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Notes about this contact..."
              className="w-full resize-none rounded-lg border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-2 text-xs text-[#1A2410] placeholder:text-[#9AA686] focus:border-[#5A9216] focus:outline-none focus:ring-1 focus:ring-[#5A9216] transition"
            />
          </div>

          {error && (
            <p className="text-[11px] font-mono text-[#991B1B]">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#DDE8CF] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#DDE8CF] px-4 py-1.5 text-xs font-medium text-[#5A6B4A] transition hover:bg-[#EEF5E6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={saving}
            className="rounded-full bg-[#5A9216] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#3E6610] disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Record"}
          </button>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-sm rounded-2xl border border-[#DDE8CF] bg-white px-5 py-4 shadow-2xl">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5A6B4A]">
              Confirm Contact Record
            </p>
            <p className="mb-4 text-xs text-[#1A2410]">
              Do you want to save this contact record for this lead?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-[#DDE8CF] px-4 py-1.5 text-xs font-medium text-[#5A6B4A] transition hover:bg-[#EEF5E6]"
              >
                No, go back
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#5A9216] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[#3E6610] disabled:opacity-70"
              >
                Yes, save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

