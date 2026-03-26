import { useEffect, useState } from "react"
import { localDatetimeLocalFloor } from "../../utils/dateInputConstraints"

const DEFAULT_RESULT_OPTIONS = [
  "No Response",
  "Busy",
  "Callback",
  "Issue",
  "Drop",
  "Archive",
  "Confirmed Schedule",
]

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark: #62840b;
    --surface-bg: #f5f8ef;
    --border: #d0e0b0;
    --text-primary: #1e1e1e;
    --text-secondary: #374151;
    --white: #ffffff;
  }

  .acm-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 20, 5, 0.5);
    backdrop-filter: blur(6px);
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .acm-card {
    width: 100%;
    max-width: 440px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(10, 20, 5, 0.18);
    animation: acm-up 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes acm-up {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Header ── */
  .acm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }

  .acm-header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.7;
    margin-bottom: 3px;
  }

  .acm-header-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .acm-close {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    border: 1px solid var(--border);
    background: var(--surface-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: background 0.12s, color 0.12s, border-color 0.12s;
    flex-shrink: 0;
  }

  .acm-close:hover {
    background: #fff1f1;
    border-color: #fca5a5;
    color: #c0392b;
  }

  /* ── Body ── */
  .acm-body {
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Field ── */
  .acm-field {}

  .acm-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 7px;
    opacity: 0.8;
  }

  .acm-input,
  .acm-select,
  .acm-textarea {
    width: 100%;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 9px 13px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .acm-input:focus,
  .acm-select:focus,
  .acm-textarea:focus {
    border-color: var(--green-primary);
    box-shadow: 0 0 0 3px rgba(151, 182, 76, 0.12);
    background: var(--white);
  }

  .acm-input.readonly {
    cursor: not-allowed;
    opacity: 0.55;
    background: var(--surface-bg);
  }

  .acm-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a5a5a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 13px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .acm-textarea {
    resize: none;
    min-height: 80px;
    line-height: 1.5;
  }

  .acm-textarea::placeholder {
    color: var(--text-secondary);
    opacity: 0.45;
  }

  /* ── Error ── */
  .acm-error {
    font-size: 11px;
    color: #c0392b;
    font-family: 'DM Mono', monospace;
    margin-top: -8px;
  }

  /* ── Footer ── */
  .acm-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 22px 18px;
    border-top: 1px solid var(--border);
  }

  .acm-btn-cancel {
    padding: 8px 16px;
    border-radius: 9px;
    border: 1px solid var(--border);
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.12s, color 0.12s;
    letter-spacing: -0.01em;
  }

  .acm-btn-cancel:hover {
    background: var(--surface-bg);
    color: var(--text-primary);
  }

  .acm-btn-save {
    padding: 8px 18px;
    border-radius: 9px;
    border: none;
    background: var(--green-primary);
    font-size: 13px;
    font-weight: 600;
    color: var(--white);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.01em;
    transition: background 0.15s, transform 0.1s;
  }

  .acm-btn-save:hover:not(:disabled) {
    background: var(--green-dark);
    transform: translateY(-1px);
  }

  .acm-btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* ── Confirm Panel (inline) ── */
  .acm-confirm {
    animation: acm-up 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .acm-confirm-body {
    padding: 22px 22px 8px;
  }

  .acm-confirm-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eef5df;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    color: var(--green-primary);
  }

  .acm-confirm-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }

  .acm-confirm-text {
    font-size: 12.5px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
`

export default function AddContactRecordModal({ open, onClose, onSubmit, options }) {
  const [now, setNow]                 = useState("")
  const [result, setResult]           = useState("")
  const [nextContactAt, setNextContactAt] = useState("")
  const [remarks, setRemarks]         = useState("")
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState("")
  const [confirming, setConfirming]   = useState(false)

  useEffect(() => {
    if (!open) return
    const d = new Date()
    setNow(d.toISOString().slice(0, 16))
    setResult("")
    setNextContactAt("")
    setRemarks("")
    setError("")
    setSaving(false)
    setConfirming(false)
  }, [open])

  if (!open) return null

  const choices = Array.isArray(options) && options.length > 0 ? options : DEFAULT_RESULT_OPTIONS

  const handleReview = () => {
    if (!result) {
      setError("Please select a result before saving.")
      return
    }
    setError("")
    setConfirming(true)
  }

  const handleSave = async () => {
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
      setConfirming(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="acm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="acm-card">

          {/* ── Header ── */}
          <div className="acm-header">
            <div>
              <p className="acm-header-eyebrow">Contact Record</p>
              <h2 className="acm-header-title">
                {confirming ? "Confirm Record" : "Add Contact Record"}
              </h2>
            </div>
            <button type="button" className="acm-close" onClick={onClose} aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Form View ── */}
          {!confirming && (
            <>
              <div className="acm-body">

                {/* Contact Date/Time */}
                <div className="acm-field">
                  <label className="acm-label">Contact Date / Time</label>
                  <input
                    type="datetime-local"
                    value={now}
                    readOnly
                    className="acm-input readonly"
                  />
                </div>

                {/* Next Contact */}
                <div className="acm-field">
                  <label className="acm-label">Next Contact Date / Time</label>
                  <input
                    type="datetime-local"
                    min={localDatetimeLocalFloor()}
                    value={nextContactAt || ""}
                    onChange={(e) => {
                      const v = e.target.value
                      const min = localDatetimeLocalFloor()
                      setNextContactAt(!v || v >= min ? v : min)
                    }}
                    className="acm-input"
                  />
                </div>

                {/* Result */}
                <div className="acm-field">
                  <label className="acm-label">Result</label>
                  <select
                    value={result}
                    onChange={(e) => { setResult(e.target.value); setError("") }}
                    className="acm-select"
                  >
                    <option value="">Select a result...</option>
                    {choices.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Remarks */}
                <div className="acm-field">
                  <label className="acm-label">Remarks</label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Notes about this contact..."
                    className="acm-textarea"
                  />
                </div>

                {error && <p className="acm-error">{error}</p>}

              </div>

              <div className="acm-footer">
                <button type="button" className="acm-btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="acm-btn-save" onClick={handleReview}>
                  Save Record
                </button>
              </div>
            </>
          )}

          {/* ── Confirm View (inline) ── */}
          {confirming && (
            <div className="acm-confirm">
              <div className="acm-confirm-body">
                <div className="acm-confirm-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <p className="acm-confirm-title">Save this contact record?</p>
                <p className="acm-confirm-text">
                  Result: <strong>{result}</strong>
                  {nextContactAt && (
                    <> &nbsp;·&nbsp; Next contact: <strong>{nextContactAt.replace("T", " ")}</strong></>
                  )}
                </p>
                {error && <p className="acm-error" style={{ marginTop: 10 }}>{error}</p>}
              </div>

              <div className="acm-footer">
                <button
                  type="button"
                  className="acm-btn-cancel"
                  onClick={() => setConfirming(false)}
                  disabled={saving}
                >
                  Go back
                </button>
                <button
                  type="button"
                  className="acm-btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Yes, save"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}