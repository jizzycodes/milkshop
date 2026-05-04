import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import StatusTabs from "../components/StatusTabs"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
    --blue:          #3b82f6;
    --blue-light:    #eff6ff;
    --blue-border:   #bfdbfe;
  }

  .onb-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Stage hero ── */
  .onb-hero {
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

  .onb-hero::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(180deg, #97b64c 0%, #62840b 100%);
    border-radius: 18px 0 0 18px;
  }

  .onb-hero-main {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .onb-hero-icon {
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

  .onb-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .onb-hero-pill {
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

  .onb-hero-sep { color: #c8dfa8; font-weight: 300; user-select: none; }
  .onb-hero-stage {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a9216;
  }

  .onb-banner-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 6px 0;
  }

  .onb-banner-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #5a6b4a;
    margin: 0;
  }

  /* ── Error ── */
  .onb-error {
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
  .onb-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .onb-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--blue);
    border-radius: 50%;
    animation: onb-spin 0.7s linear infinite;
  }

  @keyframes onb-spin { to { transform: rotate(360deg); } }

  .onb-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  /* ── Count bar ── */
  .onb-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px;
  }

  .onb-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.72;
  }

  .onb-count-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: #1d4ed8;
    background: var(--blue-light);
    border: 1px solid var(--blue-border);
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Rows ── */
  .onb-tr {
    transition: background 0.12s ease;
    animation: onb-row-in 0.25s ease both;
  }

  .onb-tr:not(:last-child) td { border-bottom: 1px solid #f0f6e8; }
  .onb-tr:hover { background: #f7faff; }

  .onb-tr td:first-child {
    box-shadow: inset 3px 0 0 transparent;
    transition: box-shadow 0.15s ease;
  }

  .onb-tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--blue); }

  .onb-tr:nth-child(1)   { animation-delay: 0.04s; }
  .onb-tr:nth-child(2)   { animation-delay: 0.08s; }
  .onb-tr:nth-child(3)   { animation-delay: 0.12s; }
  .onb-tr:nth-child(4)   { animation-delay: 0.16s; }
  .onb-tr:nth-child(5)   { animation-delay: 0.20s; }
  .onb-tr:nth-child(n+6) { animation-delay: 0.24s; }

  @keyframes onb-row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* ── Cells ── */
  .onb-td {
    padding: 13px 18px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  /* ── Name cell ── */
  .onb-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .onb-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .onb-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .onb-email {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.62;
    margin-top: 2px;
  }

  /* ── Paid badge ── */
  .onb-paid-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0fff4;
    border: 1px solid #bbf7d0;
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
    color: #166534;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .onb-paid-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
  }

  /* ── Date chip ── */
  .onb-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #374151;
    opacity: 1;
  }

  .onb-date-chip svg { opacity: 0.45; flex-shrink: 0; }

  /* ── View button ── */
  .onb-btn-view {
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

  .onb-btn-view:hover {
    background: var(--blue-light);
    border-color: var(--blue-border);
    color: #1d4ed8;
  }
`

const ONBOARDING_SUBTABS = [
  { value: "MANAGEMENT_TRAINING", label: "Management Training" },
  { value: "BARISTA_TRAINING", label: "Barista Training" },
  { value: "GRAND_OPENING", label: "Grand Opening" },
]

const ONBOARDING_ACTIVITY = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function Onboarding() {
  const { token } = useAdminAuth()
  const [subtab, setSubtab] = useState("MANAGEMENT_TRAINING")
  const [activity, setActivity] = useState("active")
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const columns = [
    { key: "name",     label: "Lead"      },
    { key: "paidDate", label: "Paid Date" },
    { key: "view",     label: ""          },
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "onboarding", onboardingStep: subtab, page: 1, pageSize: 50 })
      .then((res)  => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) setError(err?.message || "Failed to load onboarding"); setLeads([]) })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, subtab, refreshKey])

  const getContactOptions = () => {
    if (subtab === "GRAND_OPENING") return []
    return ["No Response", "Callback", "Confirmed Schedule", "Finished"]
  }

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes, nextScheduleAt }) => {
    if (!token || !selectedLead) return

    const outcomeMap = {
      "No Response": "NO_ANSWER",
      Callback: "CALLBACK",
      "Confirmed Schedule": "CONFIRMED_SCHEDULE",
      Finished: "FINISHED",
    }

    const outcome = outcomeMap[contactRecord] || null
    await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || `Contact record: ${contactRecord}`,
      outcome,
      nextFollowupAt: nextContactAt || null,
      scheduleDateTime:
        outcome === "CONFIRMED_SCHEDULE" && nextScheduleAt ? nextScheduleAt : null,
    })

    if (contactRecord === "Finished") {
      if (subtab === "MANAGEMENT_TRAINING") {
        await updateLead(token, selectedLead.id, {
          onboarding_step: "BARISTA_TRAINING",
          next_followup_at: nextContactAt || null,
        })
      } else if (subtab === "BARISTA_TRAINING") {
        await updateLead(token, selectedLead.id, {
          onboarding_step: "GRAND_OPENING",
          next_followup_at: nextContactAt || null,
        })
      }
    } else if (nextContactAt) {
      await updateLead(token, selectedLead.id, { next_followup_at: nextContactAt })
    }

    if (notes) {
      await updateLead(token, selectedLead.id, { remarks_admin: notes })
    }

    setRefreshKey((k) => k + 1)
  }

  const filteredLeads = leads.filter((lead) => {
    const ts = lead.next_followup_at || lead.best_contact_at
    if (!ts) return activity === "inactive"
    const now = new Date()
    const d = new Date(ts)
    return activity === "active"
      ? d.getTime() <= now.getTime()
      : d.getTime() > now.getTime()
  })

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
      <div className="onb-root">

        <header className="onb-hero">
          <div className="onb-hero-main">
            <div className="onb-hero-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="onb-hero-meta">
                <span className="onb-hero-pill">Pipeline</span>
                <span className="onb-hero-sep">·</span>
                <span className="onb-hero-stage">Stage 4</span>
              </div>
              <h1 className="onb-banner-title">Onboarding</h1>
              <p className="onb-banner-desc">Leads that have paid and are moving into onboarding.</p>
              <div style={{ marginTop: 12 }}>
                <StatusTabs options={ONBOARDING_SUBTABS} value={subtab} onChange={setSubtab} />
              </div>
            </div>
          </div>
          <div>
            <StatusTabs options={ONBOARDING_ACTIVITY} value={activity} onChange={setActivity} />
          </div>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="onb-error">
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
          <div className="onb-loading">
            <div className="onb-spinner" />
            <span className="onb-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="onb-countbar">
              <span className="onb-count-label">
                {ONBOARDING_SUBTABS.find((s) => s.value === subtab)?.label} · {activity === "active" ? "Active" : "Inactive"}
              </span>
              <span className="onb-count-pill">{filteredLeads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={filteredLeads}
              renderRow={(lead) => (
                <tr key={lead.id} className="onb-tr">

                  {/* Name */}
                  <td className="onb-td">
                    <div className="onb-name-cell">
                      <div className="onb-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="onb-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="onb-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Paid Date */}
                  <td className="onb-td">
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span className="onb-paid-badge">
                        <span className="onb-paid-dot" />
                        Paid
                      </span>
                      <span className="onb-date-chip">
                        {calIcon}
                        {formatDateTime(lead.next_followup_at || lead.best_contact_at) || "—"}
                      </span>
                    </div>
                  </td>

                  {/* View */}
                  <td className="onb-td">
                    <button
                      type="button"
                      className="onb-btn-view"
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
            contactOptions={getContactOptions()}
            onSaveContact={handleSaveContact}
            onClose={() => setSelectedLead(null)}
            onSaved={() => {
              setSuccess("Contact record saved.")
              setTimeout(() => setSuccess(""), 3000)
            }}
            pipelineLabel={`Onboarding - ${ONBOARDING_SUBTABS.find((s) => s.value === subtab)?.label || "Onboarding"}`}
            enableNextScheduleField
          />
        )}

      </div>
      {success && !error && (
        <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 72 }}>
          <div style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 8, background: "#62840b", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 12.5, fontWeight: 500, boxShadow: "0 6px 24px rgba(10,20,5,0.18)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </>
  )
}