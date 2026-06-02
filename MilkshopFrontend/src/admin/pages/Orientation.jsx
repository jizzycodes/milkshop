import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const ORIENTATION_TABS = [
  { value: "reschedule", label: "Reschedule" },
  { value: "confirmed",  label: "Confirmed"  },
  { value: "remind",     label: "Remind"     },
  { value: "attendance", label: "Attendance" },
]

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --amber:         #E8A020;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
  }

  .ori-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Stage hero ── */
  .ori-hero {
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
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .ori-hero::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: linear-gradient(180deg, #97b64c 0%, #62840b 100%);
    border-radius: 18px 0 0 18px;
  }

  .ori-hero-main {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .ori-hero-icon {
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
    box-shadow: 0 2px 8px rgba(98, 132, 11, 0.12);
  }

  .ori-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .ori-hero-pill {
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

  .ori-hero-sep { color: #c8dfa8; font-weight: 300; user-select: none; }

  .ori-hero-stage {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a9216;
  }

  .ori-banner-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 6px 0;
  }

  .ori-banner-desc {
    font-size: 13px;
    line-height: 1.55;
    color: #5a6b4a;
    margin: 0;
  }

  .ori-hero-actions { flex-shrink: 0; padding-top: 2px; }

  /* ── Error ── */
  .ori-error {
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
  .ori-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .ori-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--green-primary);
    border-radius: 50%;
    animation: ori-spin 0.7s linear infinite;
  }

  @keyframes ori-spin { to { transform: rotate(360deg); } }

  .ori-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  /* ── Count bar ── */
  .ori-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px;
    gap: 10px;
  }

  .ori-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.72;
  }

  .ori-count-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: #b07010;
    background: #fef3e0;
    border: 1px solid #f9d89a;
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Rows ── */
  .ori-tr {
    transition: background 0.12s ease;
    animation: ori-row-in 0.25s ease both;
  }

  .ori-tr:not(:last-child) td {
    border-bottom: 1px solid #f0f6e8;
  }

  .ori-tr:hover { background: #fafcf6; }

  .ori-tr td:first-child {
    box-shadow: inset 3px 0 0 transparent;
    transition: box-shadow 0.15s ease;
  }

  .ori-tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--amber); }

  .ori-tr:nth-child(1)   { animation-delay: 0.04s; }
  .ori-tr:nth-child(2)   { animation-delay: 0.08s; }
  .ori-tr:nth-child(3)   { animation-delay: 0.12s; }
  .ori-tr:nth-child(4)   { animation-delay: 0.16s; }
  .ori-tr:nth-child(5)   { animation-delay: 0.20s; }
  .ori-tr:nth-child(n+6) { animation-delay: 0.24s; }

  @keyframes ori-row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* ── Cells ── */
  .ori-td {
    padding: 13px 18px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  .ori-td-mono {
    padding: 13px 18px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    vertical-align: middle;
    opacity: 0.7;
    white-space: nowrap;
  }

  /* ── Name cell ── */
  .ori-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .ori-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fde9b8 0%, #E8A020 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .ori-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .ori-email {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.62;
    margin-top: 2px;
  }

  /* ── Date chip ── */
  .ori-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #374151;
    opacity: 1;
  }

  .ori-date-chip svg { opacity: 0.45; flex-shrink: 0; }

  /* ── Contact record placeholder ── */
  .ori-contact-placeholder {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.62;
  }

  /* ── View button ── */
  .ori-btn-view {
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

  .ori-btn-view:hover {
    background: #fef3e0;
    border-color: #f9d89a;
    color: #b07010;
  }

  /* ── Toast ── */
  .ori-toast {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 72px;
  }

  .ori-toast-inner {
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
    animation: ori-toast-in 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  @keyframes ori-toast-in {
    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`

export default function Orientation({ initialSubStatus }) {
  const { token } = useAdminAuth()
  const [subStatus, setSubStatus]       = useState(initialSubStatus || "reschedule")
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const showContactColumn = subStatus !== "confirmed"

  const columns = [
    { key: "name",              label: "Lead"                 },
    { key: "orientationSchedule", label: "Orientation Schedule" },
    ...(showContactColumn ? [{ key: "contactRecord", label: "Contact Record" }] : []),
    { key: "view", label: "" },
  ]

  const remindOptions    = ["Remind Successfully","No response","Callback","Cancel Schedule","Archive","Drop"]
  const attendanceOptions = ["Present","Absent"]
  const defaultOptions   = ["No response","Callback","Confirmed Schedule","Archive","Drop"]
  const confirmedOptions = ["Cancel Schedule"]

  const currentOptions =
    subStatus === "remind"     ? remindOptions     :
    subStatus === "attendance" ? attendanceOptions :
    subStatus === "confirmed"  ? confirmedOptions  :
    defaultOptions

  useEffect(() => {
    if (!initialSubStatus) return
    const allowed = ORIENTATION_TABS.map((t) => t.value)
    if (allowed.includes(initialSubStatus)) setSubStatus(initialSubStatus)
  }, [initialSubStatus])

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "orientation", page: 1, pageSize: 50 })
      .then((res)  => { if (!cancelled) setLeads(res?.data || []) })
      .catch((err) => { if (!cancelled) setError(err?.message || "Failed to load orientation"); setLeads([]) })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes, nextScheduleAt }) => {
    if (!token || !selectedLead) return

    const outcomeMap = {
      "No response":        "NO_ANSWER",
      "No Response":        "NO_ANSWER",
      Busy:                 "NO_ANSWER",
      Callback:             "CALLBACK",
      Present:              "PRESENT",
      Absent:               "ABSENT",
      Drop:                 "DROP",
      Archive:              "ARCHIVE",
      "Confirmed Schedule": "CONFIRMED_SCHEDULE",
      "Cancel Schedule":    "CANCEL",
    }

    const outcome = outcomeMap[contactRecord] || null
    const log = await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || `Contact record: ${contactRecord}`,
      outcome,
      nextFollowupAt: nextContactAt || null,
      scheduleDateTime:
        outcome === "CONFIRMED_SCHEDULE" && nextScheduleAt ? nextScheduleAt : null,
    })

    if (contactRecord === "Archive") {
      await updateLead(token, selectedLead.id, { status: "ARCHIVED" })
    } else if (contactRecord === "Drop") {
      await updateLead(token, selectedLead.id, { status: "DROPPED" })
    } else if (subStatus === "attendance" && contactRecord === "Present") {
      await updateLead(token, selectedLead.id, { status: "APPROVED", next_followup_at: nextContactAt || null })
    } else if (subStatus === "attendance" && contactRecord === "Absent") {
      await updateLead(token, selectedLead.id, { status: "INACTIVE", next_followup_at: nextContactAt || null })
    } else if (subStatus === "reschedule" && contactRecord === "Confirmed Schedule") {
      await updateLead(token, selectedLead.id, { status: "ACTIVE", next_followup_at: nextContactAt || null })
    } else if ((subStatus === "confirmed" || subStatus === "remind") && contactRecord === "Cancel Schedule") {
      await updateLead(token, selectedLead.id, { status: "INACTIVE", next_followup_at: nextContactAt || null })
    }

    if (notes) await updateLead(token, selectedLead.id, { remarks_admin: notes })
    setRefreshKey((k) => k + 1)
    return log
  }

  const filteredLeads = leads
    .filter((l) => l.status !== "DROPPED" && l.status !== "ARCHIVED" && l.status !== "APPROVED")
    .filter((lead) => {
      if (lead.status === "INACTIVE" && subStatus !== "reschedule") return false
      if (subStatus === "reschedule") return lead.status === "INACTIVE"
      const ts = lead.next_followup_at || lead.best_contact_at
      if (!ts) return false
      const now    = new Date()
      const d      = new Date(ts)
      const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const diffDays  = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)
      if (subStatus === "remind")     return diffDays === 1
      if (subStatus === "attendance") return diffHours >= 1
      if (subStatus === "confirmed")  return d.getTime() > now.getTime() && diffDays !== 1
      return true
    })

  const clockIcon = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="ori-root">

        <header className="ori-hero">
          <div className="ori-hero-main">
            <div className="ori-hero-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="ori-hero-meta">
                <span className="ori-hero-pill">Pipeline</span>
                <span className="ori-hero-sep">·</span>
                <span className="ori-hero-stage">Stage 2</span>
              </div>
              <h1 className="ori-banner-title">Orientation</h1>
              <p className="ori-banner-desc">Orientation scheduling and reminders.</p>
            </div>
          </div>
          <div className="ori-hero-actions">
            <StatusTabs
              options={ORIENTATION_TABS}
              value={subStatus}
              onChange={setSubStatus}
            />
          </div>
        </header>

        {/* ── Error ── */}
        {error && (
          <div className="ori-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Table ── */}
        {loading ? (
          <div className="ori-loading">
            <div className="ori-spinner" />
            <span className="ori-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="ori-countbar">
              <span className="ori-count-label">
                {ORIENTATION_TABS.find((t) => t.value === subStatus)?.label} leads
              </span>
              <span className="ori-count-pill">{filteredLeads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={filteredLeads}
              renderRow={(lead) => (
                <tr key={lead.id} className="ori-tr">

                  {/* Name */}
                  <td className="ori-td">
                    <div className="ori-name-cell">
                      <div className="ori-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="ori-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="ori-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Orientation Schedule */}
                  <td className="ori-td">
                    <span className="ori-date-chip">
                      {clockIcon}
                      {formatDateTime(lead.next_followup_at || lead.best_contact_at) || "—"}
                    </span>
                  </td>

                  {/* Contact Record */}
                  {showContactColumn && (
                    <td className="ori-td">
                      <span className="ori-contact-placeholder">Select in View</span>
                    </td>
                  )}

                  {/* Action */}
                  <td className="ori-td">
                    <button
                      type="button"
                      className="ori-btn-view"
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
            contactOptions={currentOptions}
            onSaveContact={handleSaveContact}
            onClose={() => setSelectedLead(null)}
            onSaved={() => {
              setSuccess("Contact record saved.")
              setTimeout(() => setSuccess(""), 3000)
            }}
            pipelineLabel="Orientation"
            enableNextScheduleField
          />
        )}

      </div>

      {/* ── Toast ── */}
      {success && !error && (
        <div className="ori-toast">
          <div className="ori-toast-inner">
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