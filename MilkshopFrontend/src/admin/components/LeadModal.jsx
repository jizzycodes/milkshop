import { useState } from "react"
import { formatDateTime } from "../utils/formatDateTime"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .lm-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(26, 36, 16, 0.45);
    backdrop-filter: blur(4px);
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .lm-card {
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(26,36,16,0.16);
    animation: lm-up 0.2s ease;
  }

  @keyframes lm-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lm-accent {
    height: 3px;
    background: linear-gradient(90deg, transparent, #5A9216 40%, #3E6610 60%, transparent);
  }

  .lm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 16px;
    border-bottom: 1px solid #DDE8CF;
  }

  .lm-header-left {}

  .lm-title {
    font-size: 16px;
    font-weight: 700;
    color: #1A2410;
    letter-spacing: -0.02em;
  }

  .lm-subtitle {
    font-size: 11.5px;
    color: #5A6B4A;
    margin-top: 2px;
    font-family: 'DM Mono', monospace;
  }

  .lm-close {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #DDE8CF;
    background: #F7F9F4;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5A6B4A;
    transition: all 0.12s ease;
    flex-shrink: 0;
  }
  .lm-close:hover { background: #EEF5E6; border-color: #C8DFA8; color: #1A2410; }

  .lm-body {
    padding: 20px 22px;
    max-height: 62vh;
    overflow-y: auto;
  }

  /* Info grid — 1 col on mobile, 2 col from 461px */
  .lm-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @media (min-width: 461px) {
    .lm-info-grid { grid-template-columns: 1fr 1fr; }
  }

  .lm-info-item {
    padding: 10px 13px;
    border-radius: 10px;
    background: #F7F9F4;
    border: 1px solid #DDE8CF;
    transition: border-color 0.12s;
  }

  .lm-info-item:hover { border-color: #C8DFA8; }
  .lm-info-item.span2 { grid-column: 1 / -1; }

  .lm-info-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5A6B4A;
    margin-bottom: 3px;
  }

  .lm-info-value {
    font-size: 12.5px;
    font-weight: 500;
    color: #1A2410;
    line-height: 1.4;
  }

  /* Divider */
  .lm-divider {
    height: 1px;
    background: #DDE8CF;
    margin: 16px 0;
  }

  /* Contact Record section */
  .lm-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5A6B4A;
    margin-bottom: 8px;
  }

  .lm-contact-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    align-items: center;
  }

  @media (min-width: 461px) {
    .lm-contact-row { grid-template-columns: 1fr 1fr auto; }
    .lm-card        { max-width: 480px; }
  }

  .lm-select,
  .lm-datetime {
    background: #F7F9F4;
    border: 1px solid #DDE8CF;
    border-radius: 9px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }

  .lm-datetime { font-family: 'DM Sans', sans-serif; }

  .lm-select:focus,
  .lm-datetime:focus {
    border-color: #5A9216;
    box-shadow: 0 0 0 3px rgba(90,146,22,0.08);
    background: #FFFFFF;
  }

  .lm-btn-done {
    padding: 8px 18px;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, #5A9216 0%, #3E6610 100%);
    font-size: 12px;
    font-weight: 600;
    color: #FFFFFF;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 8px rgba(90,146,22,0.22);
    transition: all 0.12s ease;
    white-space: nowrap;
  }

  .lm-btn-done:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(90,146,22,0.32);
  }

  .lm-btn-done:disabled {
    background: #C8DFA8;
    color: #FFFFFF;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .lm-feedback-ok  { margin-top: 8px; font-size: 11px; color: #3E6610; font-family: 'DM Mono', monospace; }
  .lm-feedback-err { margin-top: 8px; font-size: 11px; color: #991B1B; font-family: 'DM Mono', monospace; }

  .lm-notes-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5A6B4A;
    margin-bottom: 6px;
    margin-top: 14px;
    display: block;
  }

  .lm-textarea {
    width: 100%;
    background: #F7F9F4;
    border: 1px solid #DDE8CF;
    border-radius: 9px;
    padding: 9px 12px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
    outline: none;
    resize: vertical;
    min-height: 70px;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .lm-textarea:focus {
    border-color: #5A9216;
    box-shadow: 0 0 0 3px rgba(90,146,22,0.08);
    background: #FFFFFF;
  }
`

export default function LeadModal({ lead, onClose, contactOptions, onSaveContact, onSaved }) {
  if (!lead) return null

  const name             = lead.full_name || lead.name || "—"
  const email            = lead.email || ""
  const contactNumber    = lead.contact_number || lead.phone || ""
  const annualIncome     = lead.annual_income
  const proposedLocation = lead.proposed_location || ""
  const preferredPackage = lead.package_type || ""
  const remarks          = lead.remarks || ""
  const referral         = lead.referral || ""

  const nextContact =
    lead.best_contact_at ||
    lead.next_followup_at ||
    lead.nextContact ||
    null

  const bestContactLabel    = lead.best_contact_time || null
  const inquiryDate         = lead.created_at || null
  const orientationSchedule = lead.orientation_schedule || lead.orientationSchedule || null
  const paidDate            = lead.paid_date || lead.paidDate || null

  const [contactRecord, setContactRecord] = useState("")
  const [nextContactAt, setNextContactAt] = useState("")
  const [notes, setNotes]                 = useState("")
  const [done, setDone]                   = useState(false)
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState("")

  const hasOptions = Array.isArray(contactOptions) && contactOptions.length > 0

  return (
    <>
      <style>{STYLES}</style>
      <div className="lm-overlay">
        <div className="lm-card">
          <div className="lm-accent" />

          {/* Header */}
          <div className="lm-header">
            <div className="lm-header-left">
              <h2 className="lm-title">Lead Details</h2>
              <p className="lm-subtitle">{email || contactNumber}</p>
            </div>
            <button type="button" className="lm-close" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="lm-body">
            <div className="lm-info-grid">

              <div className="lm-info-item span2">
                <p className="lm-info-label">Lead Name</p>
                <p className="lm-info-value">{name}</p>
              </div>

              {email && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Email</p>
                  <p className="lm-info-value">{email}</p>
                </div>
              )}

              {contactNumber && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Contact Number</p>
                  <p className="lm-info-value">{contactNumber}</p>
                </div>
              )}

              {inquiryDate && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Inquiry Date</p>
                  <p className="lm-info-value">{formatDateTime(inquiryDate)}</p>
                </div>
              )}

              {nextContact && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Next Contact Date</p>
                  <p className="lm-info-value">{formatDateTime(nextContact)}</p>
                </div>
              )}

              {bestContactLabel && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Best Contact Pref.</p>
                  <p className="lm-info-value">{bestContactLabel}</p>
                </div>
              )}

              {annualIncome != null && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Annual Income</p>
                  <p className="lm-info-value">{annualIncome}</p>
                </div>
              )}

              {proposedLocation && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Proposed Location</p>
                  <p className="lm-info-value">{proposedLocation}</p>
                </div>
              )}

              {preferredPackage && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Preferred Package</p>
                  <p className="lm-info-value">{preferredPackage}</p>
                </div>
              )}

              {referral && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Referral</p>
                  <p className="lm-info-value">{referral}</p>
                </div>
              )}

              {remarks && (
                <div className="lm-info-item span2">
                  <p className="lm-info-label">Remarks</p>
                  <p className="lm-info-value">{remarks}</p>
                </div>
              )}

              {orientationSchedule && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Orientation Schedule</p>
                  <p className="lm-info-value">{formatDateTime(orientationSchedule)}</p>
                </div>
              )}

              {paidDate && (
                <div className="lm-info-item">
                  <p className="lm-info-label">Paid Date</p>
                  <p className="lm-info-value">{formatDateTime(paidDate)}</p>
                </div>
              )}

            </div>

            {/* Contact Record */}
            {hasOptions && (
              <>
                <div className="lm-divider" />
                <p className="lm-section-label">Contact Record</p>
                <div className="lm-contact-row">
                  <select
                    className="lm-select"
                    value={contactRecord}
                    onChange={(e) => { setContactRecord(e.target.value); setDone(false) }}
                  >
                    <option value="">Select...</option>
                    {contactOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    className="lm-datetime"
                    value={nextContactAt}
                    onChange={(e) => { setNextContactAt(e.target.value); setDone(false) }}
                  />

                  <button
                    type="button"
                    className="lm-btn-done"
                    disabled={!contactRecord || !nextContactAt}
                    onClick={async () => {
                      if (!onSaveContact) return
                      try {
                        setSaving(true)
                        setError("")
                        await onSaveContact({ contactRecord, nextContactAt, notes })
                        setDone(true)
                        if (onSaved) {
                          onSaved()
                        }
                        setTimeout(() => {
                          if (onClose) {
                            onClose()
                          }
                        }, 800)
                      } catch (e) {
                        setDone(false)
                        setError(e?.message || "Failed to save contact record")
                      } finally {
                        setSaving(false)
                      }
                    }}
                  >
                    {saving ? "Saving..." : "Done"}
                  </button>
                </div>

                {error && <p className="lm-feedback-err">{error}</p>}
                {done  && <p className="lm-feedback-ok">✓ Contact record saved.</p>}

                <span className="lm-notes-label">Notes</span>
                <textarea
                  rows={3}
                  className="lm-textarea"
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); setDone(false) }}
                  placeholder="Notes about this contact..."
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}