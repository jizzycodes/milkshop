import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-dark:    #62840b;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
    --gray:          #6b7280;
    --gray-light:    #f3f4f6;
    --gray-border:   #d1d5db;
    --gray-dark:     #374151;
  }

  .arc-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Stage hero ── */
  .arc-hero {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
    padding: 22px 22px 22px 26px;
    border-radius: 18px;
    border: 1px solid #dde8cf;
    background: linear-gradient(145deg, #fbfdf8 0%, #ffffff 42%, #f7faf3 100%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 28px rgba(26, 36, 16, 0.06);
    overflow: hidden;
  }

  .arc-hero::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(180deg, #97b64c 0%, #62840b 100%);
    border-radius: 18px 0 0 18px;
  }

  .arc-hero-main {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .arc-hero-icon {
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

  .arc-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .arc-hero-pill {
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

  .arc-hero-sep { color: #c8dfa8; font-weight: 300; user-select: none; }
  .arc-hero-stage {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a9216;
  }

  .arc-banner-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 6px 0;
  }

  .arc-banner-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #5a6b4a;
    margin: 0;
  }

  /* ── Error ── */
  .arc-error {
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
  .arc-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .arc-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--gray);
    border-radius: 50%;
    animation: arc-spin 0.7s linear infinite;
  }

  @keyframes arc-spin { to { transform: rotate(360deg); } }

  .arc-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  /* ── Count bar ── */
  .arc-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px;
  }

  .arc-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.72;
  }

  .arc-count-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--gray-dark);
    background: var(--gray-light);
    border: 1px solid var(--gray-border);
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Rows ── */
  .arc-tr {
    transition: background 0.12s ease;
    animation: arc-row-in 0.25s ease both;
  }

  .arc-tr:not(:last-child) td { border-bottom: 1px solid #f0f6e8; }
  .arc-tr:hover { background: #f9f9f9; }

  .arc-tr td:first-child {
    box-shadow: inset 3px 0 0 transparent;
    transition: box-shadow 0.15s ease;
  }

  .arc-tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--gray); }

  .arc-tr:nth-child(1)   { animation-delay: 0.04s; }
  .arc-tr:nth-child(2)   { animation-delay: 0.08s; }
  .arc-tr:nth-child(3)   { animation-delay: 0.12s; }
  .arc-tr:nth-child(4)   { animation-delay: 0.16s; }
  .arc-tr:nth-child(5)   { animation-delay: 0.20s; }
  .arc-tr:nth-child(n+6) { animation-delay: 0.24s; }

  @keyframes arc-row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* ── Cells ── */
  .arc-td {
    padding: 13px 18px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  /* ── Name cell ── */
  .arc-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .arc-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .arc-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .arc-email {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.62;
    margin-top: 2px;
  }

  /* ── Status badge ── */
  .arc-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--gray-light);
    border: 1px solid var(--gray-border);
    border-radius: 7px;
    padding: 4px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gray);
    white-space: nowrap;
  }

  .arc-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gray);
    flex-shrink: 0;
    opacity: 0.6;
  }

  /* ── Date chip ── */
  .arc-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #374151;
    opacity: 1;
  }

  .arc-date-chip svg { opacity: 0.45; flex-shrink: 0; }

  /* ── View button ── */
  .arc-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--gray-border);
    background: var(--white);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s, color 0.13s, border-color 0.13s;
    white-space: nowrap;
  }

  .arc-btn-view:hover {
    background: var(--gray-light);
    border-color: var(--gray);
    color: var(--gray-dark);
  }

  /* ── Toast ── */
  .arc-toast {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 72px;
  }

  .arc-toast-inner {
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
    animation: arc-toast-in 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes arc-toast-in {
    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`

export default function Archived() {
  const { token } = useAdminAuth()
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [selectedLead, setSelectedLead] = useState(null)
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const columns = [
    { key: "name",        label: "Lead"         },
    { key: "status",      label: "Status"       },
    { key: "inquiryDate", label: "Inquiry Date" },
    { key: "view",        label: ""             },
  ]

  const contactOptions = ["Confirmed Schedule"]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "archived", page: 1, pageSize: 50 })
      .then((res)  => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) { setError(err?.message || "Failed to load archived"); setLeads([]) } })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return
    if (contactRecord !== "Confirmed Schedule") throw new Error("Invalid result for archived lead.")
    if (!nextContactAt) throw new Error("Please select a next contact date.")
    const log = await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || "Contact record: Confirmed Schedule",
      outcome: "CONFIRMED_SCHEDULE",
      nextFollowupAt: nextContactAt,
    })
    await updateLead(token, selectedLead.id, {
      stage: "REGISTERED",
      status: "ACTIVE",
      next_followup_at: nextContactAt,
      ...(notes ? { remarks_admin: notes } : {}),
    })
    setRefreshKey((k) => k + 1)
    return log
  }

  const calIcon = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="arc-root">

        <header className="arc-hero">
          <div className="arc-hero-main">
            <div className="arc-hero-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="arc-hero-meta">
                <span className="arc-hero-pill">Pipeline</span>
                <span className="arc-hero-sep">·</span>
                <span className="arc-hero-stage">Archived</span>
              </div>
              <h1 className="arc-banner-title">Archived</h1>
              <p className="arc-banner-desc">Leads that have been archived for record-keeping.</p>
            </div>
          </div>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="arc-error">
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
          <div className="arc-loading">
            <div className="arc-spinner" />
            <span className="arc-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="arc-countbar">
              <span className="arc-count-label">Archived leads</span>
              <span className="arc-count-pill">{leads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={leads}
              renderRow={(lead) => (
                <tr key={lead.id} className="arc-tr">

                  {/* Name */}
                  <td className="arc-td">
                    <div className="arc-name-cell">
                      <div className="arc-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="arc-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="arc-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="arc-td">
                    <span className="arc-status-badge">
                      <span className="arc-status-dot" />
                      {lead.status || "ARCHIVED"}
                    </span>
                  </td>

                  {/* Inquiry Date */}
                  <td className="arc-td">
                    <span className="arc-date-chip">
                      {calIcon}
                      {formatDateTime(lead.created_at) || "—"}
                    </span>
                  </td>

                  {/* View */}
                  <td className="arc-td">
                    <button
                      type="button"
                      className="arc-btn-view"
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
            pipelineLabel="Archived"
          />
        )}

      </div>

      {/* ── Toast ── */}
      {success && !error && (
        <div className="arc-toast">
          <div className="arc-toast-inner">
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