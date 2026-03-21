import { useEffect, useState } from "react"
import { formatDateTime } from "../utils/formatDateTime"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeadContactLogs } from "../services/leadService"
import AddContactRecordModal from "./AddContactRecordModal"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark: #62840b;
    --green-light: #b7cd7f;
    --amber: #E8A020;
    --surface-bg: #f5f8ef;
    --border: #d0e0b0;
    --text-primary: #1e1e1e;
    --text-secondary: #5a5a5a;
    --white: #ffffff;
  }

  .lm-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 20, 5, 0.5);
    backdrop-filter: blur(6px);
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  .lm-card {
    width: 100%;
    max-width: 860px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(10, 20, 5, 0.18);
    animation: lm-up 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
  }

  @keyframes lm-up {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Header ── */
  .lm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    gap: 16px;
  }

  .lm-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .lm-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4e8a0 0%, #97b64c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0;
  }

  .lm-header-text { min-width: 0; }

  .lm-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lm-subtitle {
    font-size: 11px;
    color: var(--text-secondary);
    margin-top: 3px;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
  }

  .lm-close {
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

  .lm-close:hover {
    background: #fff1f1;
    border-color: #fca5a5;
    color: #c0392b;
  }

  /* ── Body ── */
  .lm-body {
    padding: 22px 24px;
    overflow-y: auto;
    flex: 1;
  }

  /* ── Info Grid ── */
  .lm-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
  }

  @media (min-width: 480px) {
    .lm-info-grid { grid-template-columns: 1fr 1fr; }
  }

  .lm-info-item {
    padding: 10px 14px;
    border-radius: 10px;
    background: var(--surface-bg);
    transition: background 0.12s;
  }

  .lm-info-item:hover { background: #eef5df; }
  .lm-info-item.span2 { grid-column: 1 / -1; }

  .lm-info-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 4px;
    opacity: 0.8;
  }

  .lm-info-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.4;
  }

  /* ── Divider ── */
  .lm-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
    opacity: 0.7;
  }

  /* ── Section Header ── */
  .lm-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
  }

  .lm-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.7;
  }

  /* ── Add Record Button ── */
  .lm-btn-add {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    background: var(--green-primary);
    font-size: 12px;
    font-weight: 600;
    color: var(--white);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.01em;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .lm-btn-add:hover {
    background: var(--green-dark);
    transform: translateY(-1px);
  }

  /* ── History Table ── */
  .lm-history-wrap {
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .lm-history-table {
    width: 100%;
    border-collapse: collapse;
  }

  .lm-history-head {
    background: var(--surface-bg);
  }

  .lm-history-th {
    padding: 9px 12px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: left;
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    opacity: 0.8;
  }

  .lm-history-row {
    transition: background 0.1s;
  }

  .lm-history-row:hover {
    background: var(--surface-bg);
  }

  .lm-history-row:not(:last-child) td {
    border-bottom: 1px solid #eef5df;
  }

  .lm-history-td {
    padding: 10px 12px;
    font-size: 12px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  .lm-history-td-mono {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
  }

  .lm-history-empty {
    padding: 24px 12px;
    font-size: 12px;
    color: var(--text-secondary);
    text-align: center;
    font-family: 'DM Mono', monospace;
    opacity: 0.6;
  }

  /* ── Outcome Badge ── */
  .lm-outcome-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .lm-outcome-badge.green {
    background: #eef5df;
    color: var(--green-dark);
  }

  .lm-outcome-badge.amber {
    background: #fef3e0;
    color: #b07010;
  }

  .lm-outcome-badge.red {
    background: #fef2f2;
    color: #c0392b;
  }

  .lm-outcome-badge.gray {
    background: #f3f4f6;
    color: #4b5563;
  }

  .lm-outcome-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
    opacity: 0.7;
  }

  /* ── Feedback ── */
  .lm-feedback-err {
    margin-top: 8px;
    font-size: 11px;
    color: #c0392b;
    font-family: 'DM Mono', monospace;
  }

  .lm-loading {
    font-size: 12px;
    color: var(--text-secondary);
    font-family: 'DM Mono', monospace;
    opacity: 0.6;
    padding: 16px 0;
  }
`

function getOutcomeMeta(code) {
  const map = {
    NO_ANSWER:          { label: "No Response",          variant: "gray"  },
    CONFIRMED_SCHEDULE: { label: "Confirmed Schedule",   variant: "green" },
    CALLBACK:           { label: "Callback",             variant: "amber" },
    PAID:               { label: "Paid",                 variant: "green" },
    DROP:               { label: "Drop",                 variant: "red"   },
    ARCHIVE:            { label: "Archive",              variant: "gray"  },
    NOT_INTERESTED:     { label: "Issue",                variant: "red"   },
    PRESENT:            { label: "Present",              variant: "green" },
    ABSENT:             { label: "Absent",               variant: "red"   },
    REMIND_SUCCESS:     { label: "Reminded",             variant: "green" },
    CANCEL:             { label: "Cancel",               variant: "red"   },
    INTERESTED:         { label: "Interested",           variant: "amber" },
  }
  return map[code] || { label: code || "—", variant: "gray" }
}

export default function LeadModal({ lead, onClose, contactOptions, onSaveContact, onSaved, pipelineLabel }) {
  if (!lead) return null

  const { token } = useAdminAuth()

  const name             = lead.full_name || lead.name || "—"
  const email            = lead.email || ""
  const contactNumber    = lead.contact_number || lead.phone || ""
  const annualIncome     = lead.annual_income
  const proposedLocation = lead.proposed_location || ""
  const preferredPackage = lead.package_type || ""
  const remarks          = lead.remarks || ""
  const referral         = lead.referral || ""

  const nextContact         = lead.best_contact_at || lead.next_followup_at || lead.nextContact || null
  const bestContactLabel    = lead.best_contact_time || null
  const inquiryDate         = lead.created_at || null
  const orientationSchedule = lead.orientation_schedule || lead.orientationSchedule || null
  const paidDate            = lead.paid_date || lead.paidDate || null

  const [logs, setLogs]                   = useState([])
  const [logsLoading, setLogsLoading]     = useState(false)
  const [logsError, setLogsError]         = useState("")
  const [logsRefreshKey, setLogsRefreshKey] = useState(0)
  const [showAddModal, setShowAddModal]   = useState(false)

  const avatarLetter = (name?.[0] || "?").toUpperCase()
  const hasOptions   = Array.isArray(contactOptions) && contactOptions.length > 0

  useEffect(() => {
    let cancelled = false
    async function loadLogs() {
      if (!token || !lead?.id) return
      setLogsLoading(true)
      setLogsError("")
      try {
        const res  = await fetchLeadContactLogs(token, lead.id)
        const list = Array.isArray(res) ? res : (res?.data ?? [])
        if (!cancelled) setLogs(list)
      } catch (e) {
        if (!cancelled) {
          setLogs([])
          setLogsError(e?.message || "Failed to load contact history")
        }
      } finally {
        if (!cancelled) setLogsLoading(false)
      }
    }
    loadLogs()
    return () => { cancelled = true }
  }, [token, lead?.id, logsRefreshKey])

  const handleCreateRecord = async ({ contactRecord, nextContactAt, notes }) => {
    if (!onSaveContact) return
    const log = await onSaveContact({ contactRecord, nextContactAt, notes })
    if (onSaved) onSaved()
    setLogsRefreshKey((k) => k + 1)
    return log
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="lm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="lm-card">

          {/* ── Header ── */}
          <div className="lm-header">
            <div className="lm-header-left">
              <div className="lm-avatar">{avatarLetter}</div>
              <div className="lm-header-text">
                <h2 className="lm-title">{name}</h2>
                <p className="lm-subtitle">{email || contactNumber || "No contact info"}</p>
              </div>
            </div>
            <button type="button" className="lm-close" onClick={onClose} aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="lm-body">

            {/* Info Grid */}
            <div className="lm-info-grid">

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
                  <p className="lm-info-label">Additional Information</p>
                  <p className="lm-info-value">{remarks}</p>
                </div>
              )}

              {logs.length > 0 && logs[0]?.notes && (
                <div className="lm-info-item span2">
                  <p className="lm-info-label">Latest Remark</p>
                  <p className="lm-info-value">{logs[0].notes}</p>
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

            {/* ── Contact History ── */}
            <div className="lm-divider" />

            <div className="lm-section-header">
              <p className="lm-section-label">Contact History</p>
              <button
                type="button"
                className="lm-btn-add"
                onClick={() => setShowAddModal(true)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Record
              </button>
            </div>

            {logsLoading && (
              <p className="lm-loading">Loading history...</p>
            )}

            {logsError && !logsLoading && (
              <p className="lm-feedback-err">{logsError}</p>
            )}

            {!logsLoading && !logsError && (
              <div className="lm-history-wrap">
                <table className="lm-history-table">
                  <thead className="lm-history-head">
                    <tr>
                      <th className="lm-history-th">Status</th>
                      <th className="lm-history-th">#</th>
                      <th className="lm-history-th">Contact Date</th>
                      <th className="lm-history-th">Result</th>
                      <th className="lm-history-th">Next Contact</th>
                      <th className="lm-history-th">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="lm-history-empty">
                          No contact records yet.
                        </td>
                      </tr>
                    ) : (
                      logs.map((log, index) => {
                        const { label, variant } = getOutcomeMeta(log.outcome)
                        return (
                          <tr key={log.id} className="lm-history-row">
                            <td className="lm-history-td">
                              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                                {pipelineLabel || lead.status || "—"}
                              </span>
                            </td>
                            <td className="lm-history-td lm-history-td-mono">
                              {logs.length - index}
                            </td>
                            <td className="lm-history-td lm-history-td-mono">
                              {formatDateTime(log.created_at)}
                            </td>
                            <td className="lm-history-td">
                              <span className={`lm-outcome-badge ${variant}`}>
                                <span className="lm-outcome-dot" />
                                {label}
                              </span>
                            </td>
                            <td className="lm-history-td lm-history-td-mono">
                              {log.next_followup_at ? formatDateTime(log.next_followup_at) : "—"}
                            </td>
                            <td className="lm-history-td" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                              {log.created_by || "—"}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      <AddContactRecordModal
        open={showAddModal && hasOptions}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateRecord}
        options={contactOptions}
      />
    </>
  )
}