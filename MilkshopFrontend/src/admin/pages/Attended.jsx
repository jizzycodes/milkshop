import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const ATTENDED_TABS = [
  { value: "active",   label: "Active"   },
  { value: "inactive", label: "Inactive" },
]

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
    --purple:        #8b5cf6;
    --purple-dark:   #6d28d9;
    --purple-light:  #f5f3ff;
    --purple-border: #ddd6fe;
  }

  .att-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Stage hero ── */
  .att-hero {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    padding: 22px 22px 22px 26px;
    border-radius: 18px;
    border: 1px solid #dde8cf;
    background: linear-gradient(145deg, #fbfdf8 0%, #ffffff 42%, #f7faf3 100%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 28px rgba(26, 36, 16, 0.06);
    overflow: hidden;
  }

  .att-hero::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(180deg, #97b64c 0%, #62840b 100%);
    border-radius: 18px 0 0 18px;
  }

  .att-hero-main {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .att-hero-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(145deg, #eef5df 0%, #d4e4b8 100%);
    border: 1px solid #c8dfa8;
    color: #3e6610;
  }

  .att-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .att-hero-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3e6610;
    background: rgba(151, 182, 76, 0.14);
    border: 1px solid rgba(151, 182, 76, 0.35);
  }

  .att-hero-sep { color: #c8dfa8; font-weight: 300; user-select: none; }
  .att-hero-stage {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a9216;
  }

  .att-banner-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 6px 0;
  }

  .att-banner-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #5a6b4a;
    margin: 0;
  }
  .att-hero-actions { flex-shrink: 0; padding-top: 2px; }

  /* ── Segmented Toggle ── */
  .att-toggle {
    display: flex;
    align-items: center;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 3px;
    gap: 2px;
    flex-shrink: 0;
  }

  .att-toggle-btn {
    padding: 7px 20px;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  .att-toggle-btn.att-active {
    background: var(--white);
    color: var(--text-primary);
    font-weight: 600;
    box-shadow: 0 1px 6px rgba(10, 20, 5, 0.09);
  }

  /* ── Error ── */
  .att-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 10px;
    font-size: 12.5px;
    color: #c0392b;
  }

  /* ── Loading ── */
  .att-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .att-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--purple);
    border-radius: 50%;
    animation: att-spin 0.7s linear infinite;
  }

  @keyframes att-spin { to { transform: rotate(360deg); } }

  .att-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  /* ── Count bar ── */
  .att-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px;
  }

  .att-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.72;
  }

  .att-count-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--purple-dark);
    background: var(--purple-light);
    border: 1px solid var(--purple-border);
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Rows ── */
  .att-tr {
    transition: background 0.12s ease;
    animation: att-row-in 0.25s ease both;
  }

  .att-tr:not(:last-child) td { border-bottom: 1px solid #f0f6e8; }
  .att-tr:hover { background: #faf8ff; }

  .att-tr td:first-child {
    box-shadow: inset 3px 0 0 transparent;
    transition: box-shadow 0.15s ease;
  }

  .att-tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--purple); }

  .att-tr:nth-child(1)   { animation-delay: 0.04s; }
  .att-tr:nth-child(2)   { animation-delay: 0.08s; }
  .att-tr:nth-child(3)   { animation-delay: 0.12s; }
  .att-tr:nth-child(4)   { animation-delay: 0.16s; }
  .att-tr:nth-child(5)   { animation-delay: 0.20s; }
  .att-tr:nth-child(n+6) { animation-delay: 0.24s; }

  @keyframes att-row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* ── Cells ── */
  .att-td {
    padding: 13px 18px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  /* ── Name cell ── */
  .att-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .att-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .att-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .att-email {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.62;
    margin-top: 2px;
  }

  /* ── Contact placeholder ── */
  .att-contact-placeholder {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.62;
  }

  /* ── Date chip ── */
  .att-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #374151;
    opacity: 1;
  }

  .att-date-chip svg { opacity: 0.45; flex-shrink: 0; }

  /* ── View button ── */
  .att-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--white);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s, color 0.13s, border-color 0.13s;
    white-space: nowrap;
  }

  .att-btn-view:hover {
    background: var(--purple-light);
    border-color: var(--purple-border);
    color: var(--purple-dark);
  }

  /* ── Toast ── */
  .att-toast {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 72px;
  }

  .att-toast-inner {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--green-dark);
    color: var(--white);
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 500;
    box-shadow: 0 6px 24px rgba(10,20,5,0.18);
    animation: att-toast-in 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes att-toast-in {
    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`

export default function Attended() {
  const { token } = useAdminAuth()
  const [subStatus, setSubStatus]       = useState("active")
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const columns = [
    { key: "name",          label: "Lead"             },
    { key: "contactRecord", label: "Contact Record"   },
    { key: "nextContact",   label: "Next Contact Date"},
    { key: "view",          label: ""                 },
  ]

  const contactOptions = [
    "Callback",
    "No Response",
    "Paid - Franchise Fee",
    "Paid - Reservation",
    "Drop",
    "Archive",
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { status: "APPROVED", page: 1, pageSize: 50 })
      .then((res)  => { if (!cancelled) setLeads(res?.data || []) })
      .catch((err) => { if (!cancelled) { setError(err?.message || "Failed to load attended"); setLeads([]) } })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return
    const outcomeMap = {
      "No Response": "NO_ANSWER",
      Busy:          "NO_ANSWER",
      Callback:      "CALLBACK",
      "Paid - Franchise Fee": "PAID",
      "Paid - Reservation": "PAID_RESERVATION",
      Drop:          "DROP",
      Archive:       "ARCHIVE",
    }
    const outcome = outcomeMap[contactRecord] || null
    const log = await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || `Contact record: ${contactRecord}`,
      outcome,
      nextFollowupAt: nextContactAt || null,
    })
    if (contactRecord === "Archive") {
      await updateLead(token, selectedLead.id, { status: "ARCHIVED" })
    } else if (contactRecord === "Drop") {
      await updateLead(token, selectedLead.id, { status: "DROPPED" })
    } else if (contactRecord === "Paid - Franchise Fee") {
      await updateLead(token, selectedLead.id, { stage: "ONBOARDING", status: "ACTIVE", next_followup_at: nextContactAt || null })
    } else if (contactRecord === "Paid - Reservation") {
      await updateLead(token, selectedLead.id, { stage: "RESERVATION", status: "ACTIVE", next_followup_at: nextContactAt || null })
    } else if (["No Response", "Callback"].includes(contactRecord) && nextContactAt) {
      await updateLead(token, selectedLead.id, { next_followup_at: nextContactAt })
    }
    if (notes) await updateLead(token, selectedLead.id, { remarks_admin: notes })
    setRefreshKey((k) => k + 1)
    return log
  }

  const filteredLeads = leads
    .filter((l) => l.status !== "DROPPED" && l.status !== "ARCHIVED")
    .filter((lead) => {
      const ts = lead.next_followup_at || lead.best_contact_at
      if (!ts) return subStatus === "inactive"
      const now = new Date()
      const d   = new Date(ts)
      return subStatus === "active"
        ? d.getTime() <= now.getTime()
        : d.getTime() >  now.getTime()
    })

  const clockIcon = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="att-root">

        <header className="att-hero">
          <div className="att-hero-main">
            <div className="att-hero-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="att-hero-meta">
                <span className="att-hero-pill">Pipeline</span>
                <span className="att-hero-sep">·</span>
                <span className="att-hero-stage">Stage 3</span>
              </div>
              <h1 className="att-banner-title">Attended</h1>
              <p className="att-banner-desc">Leads who have already attended orientation.</p>
            </div>
          </div>
          <div className="att-hero-actions">
            <div className="att-toggle">
                {ATTENDED_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={`att-toggle-btn${subStatus === tab.value ? " att-active" : ""}`}
                    onClick={() => setSubStatus(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
          </div>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="att-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Table ── */}
        {loading ? (
          <div className="att-loading">
            <div className="att-spinner" />
            <span className="att-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="att-countbar">
              <span className="att-count-label">
                {subStatus === "active" ? "Active" : "Inactive"} leads
              </span>
              <span className="att-count-pill">{filteredLeads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={filteredLeads}
              renderRow={(lead) => (
                <tr key={lead.id} className="att-tr">

                  {/* Name */}
                  <td className="att-td">
                    <div className="att-name-cell">
                      <div className="att-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="att-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="att-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Contact Record */}
                  <td className="att-td">
                    <span className="att-contact-placeholder">Select in View</span>
                  </td>

                  {/* Next Contact */}
                  <td className="att-td">
                    <span className="att-date-chip">
                      {clockIcon}
                      {formatDateTime(lead.next_followup_at || lead.best_contact_at) || "—"}
                    </span>
                  </td>

                  {/* View */}
                  <td className="att-td">
                    <button
                      type="button"
                      className="att-btn-view"
                      onClick={() => setSelectedLead(lead)}
                      aria-label="View lead"
                    >
                      View
                    </button>
                  </td>

                </tr>
              )}
            />
          </>
        )}

        {selectedLead && (
          <LeadModal
            lead={selectedLead}
            contactOptions={contactOptions}
            onSaveContact={handleSaveContact}
            onClose={() => setSelectedLead(null)}
            onSaved={() => {
              setSuccess("Contact record saved.")
              setTimeout(() => setSuccess(""), 3000)
            }}
            pipelineLabel="Attended"
          />
        )}

      </div>

      {/* ── Toast ── */}
      {success && !error && (
        <div className="att-toast">
          <div className="att-toast-inner">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {success}
          </div>
        </div>
      )}
    </>
  )
}