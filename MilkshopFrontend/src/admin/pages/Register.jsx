import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .reg-root {
    display: flex;
    flex-direction: column;
    gap: 16px;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
  }

  .reg-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 14px;
    padding: 16px 20px;
  }

  .reg-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5A9216;
    margin-bottom: 3px;
  }

  .reg-title {
    font-size: 17px;
    font-weight: 700;
    color: #1A2410;
    letter-spacing: -0.02em;
  }

  .reg-desc {
    font-size: 11.5px;
    color: #5A6B4A;
    margin-top: 2px;
  }

  .reg-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: #FEF2F2;
    border: 1px solid #FCA5A5;
    border-radius: 10px;
    font-size: 12.5px;
    color: #991B1B;
  }

  .reg-loading {
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 14px;
    padding: 48px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .reg-spinner {
    width: 24px; height: 24px;
    border: 2.5px solid #DDE8CF;
    border-top-color: #5A9216;
    border-radius: 50%;
    animation: reg-spin 0.7s linear infinite;
  }

  @keyframes reg-spin { to { transform: rotate(360deg); } }

  .reg-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11.5px;
    color: #5A6B4A;
  }

  /* Table wrapper */
  .reg-table-card {
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 14px;
    overflow: hidden;
  }

  /* Row styles — applied via renderRow */
  .reg-tr {
    border-bottom: 1px solid #DDE8CF;
    transition: background 0.1s ease;
  }

  .reg-tr:last-child { border-bottom: none; }
  .reg-tr:hover { background: #F7F9F4; }

  .reg-td {
    padding: 12px 16px;
    font-size: 12.5px;
    color: #1A2410;
    vertical-align: middle;
  }

  .reg-td-mono {
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: #5A6B4A;
    vertical-align: middle;
  }

  .reg-name {
    font-weight: 500;
    color: #1A2410;
  }

  .reg-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 20px;
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
  }

  .reg-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .badge-new      { background: #EEF5E6; color: #3E6610;  border: 1px solid #C8DFA8; }
  .badge-followup { background: #FEF3E2; color: #92400E;  border: 1px solid #FCD34D; }
  .badge-active   { background: #F0FFF4; color: #166534;  border: 1px solid #BBF7D0; }
  .badge-other    { background: #F3F4F6; color: #374151;  border: 1px solid #D1D5DB; }

  .badge-new .reg-badge-dot      { background: #5A9216; }
  .badge-followup .reg-badge-dot { background: #E8A020; }
  .badge-active .reg-badge-dot   { background: #16A34A; }
  .badge-other .reg-badge-dot    { background: #9CA3AF; }

  .reg-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid #DDE8CF;
    background: #FFFFFF;
    font-size: 11.5px;
    font-weight: 600;
    color: #1A2410;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.12s ease;
  }

  .reg-btn-view:hover {
    background: #5A9216;
    border-color: #5A9216;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(90,146,22,0.22);
  }
`

const REGISTER_TABS = [
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
]

function StatusPill({ status, subStatus }) {
  if (subStatus === "active") {
    return (
      <span className="reg-status-badge badge-followup">
        <span className="reg-badge-dot" />
        Follow-up
      </span>
    )
  }
  if (subStatus === "inactive") {
    return (
      <span className="reg-status-badge badge-new">
        <span className="reg-badge-dot" />
        New
      </span>
    )
  }
  const map = {
    NEW:          { label: "New",           cls: "badge-new"      },
    FOR_FOLLOWUP: { label: "For Follow-up", cls: "badge-followup" },
    ACTIVE:       { label: "Active",        cls: "badge-active"   },
  }
  const d = map[status] || { label: status || "—", cls: "badge-other" }
  return (
    <span className={`reg-status-badge ${d.cls}`}>
      <span className="reg-badge-dot" />
      {d.label}
    </span>
  )
}

export default function Register() {
  const { token } = useAdminAuth()
  const [subStatus, setSubStatus]       = useState("active")
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const columns = [
    { key: "name",        label: "Lead Name"         },
    { key: "status",      label: "Status"            },
    { key: "inquiryDate", label: "Inquiry Date"      },
    { key: "nextContact", label: "Next Contact Date" },
    { key: "view",        label: ""                  },
  ]

  const contactOptions = [
    "No Response",
    "Callback",
    "Confirmed Schedule",
    "Archive",
    "Drop",
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, {
      tab: "new",
      page: 1,
      pageSize: 50,
    })
      .then((res) => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) setError(err?.message || "Failed to load leads"); setLeads([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return

    const outcomeMap = {
      "No Response": "NO_ANSWER",
      Busy: "NO_ANSWER",
      Callback: "CALLBACK",
      Issue: "NOT_INTERESTED",
      Drop: "DROP",
      Archive: "ARCHIVE",
      "Confirmed Schedule": "CONFIRMED_SCHEDULE",
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
    } else if (contactRecord === "Confirmed Schedule" && nextContactAt) {
      await updateLead(token, selectedLead.id, {
        stage: "ORIENTATION",
        status: "ACTIVE",
        next_followup_at: nextContactAt,
      })
    } else if (["No Response", "Callback"].includes(contactRecord) && nextContactAt) {
      await updateLead(token, selectedLead.id, {
        next_followup_at: nextContactAt,
      })
    }

    if (notes) {
      await updateLead(token, selectedLead.id, { remarks_admin: notes })
    }

    setRefreshKey((k) => k + 1)
    return log
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="reg-root">

        {/* Top bar */}
        <div className="reg-topbar">
          <div>
            <p className="reg-eyebrow">Pipeline · Stage 1</p>
            <h1 className="reg-title">Register</h1>
            <p className="reg-desc">New franchise inquiries and initial follow-ups.</p>
          </div>
          <StatusTabs options={REGISTER_TABS} value={subStatus} onChange={setSubStatus} />
        </div>

        {/* Error */}
        {error && (
          <div className="reg-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="reg-loading">
            <div className="reg-spinner" />
            <span className="reg-loading-text">Loading leads...</span>
          </div>
        ) : (
          <div className="reg-table-card">
            <LeadTable
              columns={columns}
              leads={leads
                .filter((lead) => lead.status !== "ARCHIVED" && lead.status !== "DROPPED")
                .filter((lead) => {
                  const ts = lead.next_followup_at || lead.best_contact_at
                  if (!ts) return subStatus === "inactive"
                  const now = new Date()
                  const d = new Date(ts)
                  if (subStatus === "active") {
                    return d.getTime() <= now.getTime()
                  }
                  return d.getTime() > now.getTime()
                })}
              renderRow={(lead) => (
                <tr key={lead.id} className="reg-tr">
                  <td className="reg-td">
                    <span className="reg-name">{lead.full_name || "—"}</span>
                  </td>
                  <td className="reg-td">
                    <StatusPill status={lead.status} subStatus={subStatus} />
                  </td>
                  <td className="reg-td-mono">
                    {formatDateTime(lead.created_at)}
                  </td>
                  <td className="reg-td-mono">
                    {formatDateTime(lead.next_followup_at || lead.best_contact_at)}
                  </td>
                  <td className="reg-td">
                    <button
                      type="button"
                      className="reg-btn-view"
                      onClick={() => setSelectedLead(lead)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              )}
            />
          </div>
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
            pipelineLabel="Register"
          />
        )}

      </div>

      {/* Floating success toast */}
      {success && !error && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#166534] px-4 py-2 text-xs font-medium text-white shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </>
  )
}