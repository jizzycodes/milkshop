import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"
import LeadShortId from "../components/LeadShortId"
import PipelineStageTitle from "../components/PipelineStageTitle"
import LeadPagination, { LEAD_PAGE_SIZE } from "../components/LeadPagination"
import {
  countActiveInactive,
  filterRegisterLeads,
  tabsWithCounts,
} from "../utils/leadActivity"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --brand-green: #97b64c;
    --brand-green-dark: #5A9216;
    --amber: #E8A020;
    --surface-bg: #ffffff;
    --border: #e5e7eb;
    --border-light: #f3f4f6;
    --hover-bg: #f9fafb;
    --text-primary: #1e1e1e;
    --text-secondary: #6b7280;
    --white: #ffffff;
  }

  .reg-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Stage hero (Register header) ── */
  .reg-hero {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding: 0 0 8px 0;
    background: transparent;
  }

  .reg-hero-main {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .reg-hero-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--border-light);
    color: var(--text-secondary);
  }

  .reg-hero-copy {
    min-width: 0;
  }

  .reg-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  .reg-hero-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-secondary);
    background: var(--border-light);
  }

  .reg-hero-sep {
    color: #d1d5db;
    font-weight: 300;
    user-select: none;
  }

  .reg-hero-stage {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .reg-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0 0 6px 0;
  }

  .reg-desc {
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-secondary);
    margin: 0;
    max-width: 28rem;
  }

  .reg-hero-actions {
    flex-shrink: 0;
    padding-top: 2px;
    width: 100%;
  }

  .reg-hero-actions > div { width: 100%; justify-content: stretch; }

  @media (min-width: 641px) {
    .reg-hero { padding: 0 0 8px 0; }
    .reg-hero-actions { width: auto; }
    .reg-hero-actions > div { width: auto; justify-content: flex-end; }
  }

  /* ── Error ── */
  .reg-error {
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
  .reg-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 52px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .reg-spinner {
    width: 22px;
    height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--text-secondary);
    border-radius: 50%;
    animation: reg-spin 0.7s linear infinite;
  }

  @keyframes reg-spin { to { transform: rotate(360deg); } }

  .reg-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.6;
  }

  /* ── Table Card ── */
  .reg-table-card {
    background: var(--white);
  }

  /* ── Table Header ── */
  .reg-thead {
    background: var(--hover-bg);
    border-bottom: 1px solid var(--border);
  }

  .reg-th {
    padding: 10px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #5A9216;
    text-align: left;
    white-space: nowrap;
  }

  /* ── Rows ── */
  .reg-tr {
    border-bottom: 1px solid var(--border-light);
    transition: background 0.1s ease;
  }

  .reg-tr:last-child { border-bottom: none; }
  .reg-tr:hover { background: var(--hover-bg); }

  .reg-td {
    padding: 13px 16px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  .reg-td-mono {
    padding: 13px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 400;
    color: #1e1e1e;
    vertical-align: middle;
  }

  /* ── Lead Name Cell ── */
  .reg-name-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .reg-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #97b64c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
  }

  .reg-name {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 13px;
  }

  /* ── Status Badges ── */
  .reg-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .reg-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .reg-badge.new {
    background: #f3f4f6;
    color: #374151;
  }
  .reg-badge.new .reg-badge-dot { background: #9ca3af; }

  .reg-badge.followup {
    background: #fef3e0;
    color: #b07010;
  }
  .reg-badge.followup .reg-badge-dot { background: var(--amber); }

  .reg-badge.active {
    background: #f0fff4;
    color: #166534;
  }
  .reg-badge.active .reg-badge-dot { background: #22c55e; }

  .reg-badge.other {
    background: #f3f4f6;
    color: #4b5563;
  }
  .reg-badge.other .reg-badge-dot { background: #9ca3af; }

  /* ── View Button ── */
  .reg-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid var(--brand-green);
    background: var(--brand-green);
    font-size: 12px;
    font-weight: 500;
    color: var(--white);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s, border-color 0.13s;
    white-space: nowrap;
  }

  .reg-btn-view:hover {
    background: var(--brand-green-dark);
    border-color: var(--brand-green-dark);
    color: var(--white);
  }

  /* ── Empty State ── */
  .reg-empty {
    padding: 48px 20px;
    text-align: center;
  }

  .reg-empty-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--surface-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    color: var(--text-secondary);
    opacity: 0.5;
  }

  .reg-empty-text {
    font-size: 13px;
    color: var(--text-secondary);
    opacity: 0.6;
  }

  /* ── Toast ── */
  .reg-toast {
    pointer-events: none;
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 72px;
  }

  .reg-toast-inner {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1f2937;
    color: var(--white);
    padding: 9px 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(10,20,5,0.18);
    animation: reg-toast-in 0.2s ease;
  }

  @keyframes reg-toast-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reg-countbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 0 10px 0;
  }

  .reg-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-secondary);
    opacity: 0.65;
  }

  .reg-count-pill {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: var(--text-secondary);
  }
`

const PAGE_SIZE = LEAD_PAGE_SIZE

const REGISTER_TABS = [
  { value: "active",   label: "Active"   },
  { value: "inactive", label: "Inactive" },
]

function StatusPill({ subStatus, status }) {
  if (subStatus === "active") {
    return (
      <span className="reg-badge followup">
        <span className="reg-badge-dot" />
        Follow-up
      </span>
    )
  }
  if (subStatus === "inactive") {
    return (
      <span className="reg-badge new">
        <span className="reg-badge-dot" />
        New
      </span>
    )
  }
  const map = {
    NEW:          { label: "New",           cls: "new"      },
    FOR_FOLLOWUP: { label: "For Follow-up", cls: "followup" },
    ACTIVE:       { label: "Active",        cls: "active"   },
  }
  const d = map[status] || { label: status || "—", cls: "other" }
  return (
    <span className={`reg-badge ${d.cls}`}>
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
  const [page, setPage]                 = useState(1)
  const [total, setTotal]               = useState(0)
  const [totalPages, setTotalPages]     = useState(1)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [refreshKey, setRefreshKey]     = useState(0)
  const [success, setSuccess]           = useState("")

  const columns = [
    { key: "id",          label: "Lead ID"           },
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
    fetchLeads(token, { tab: "new", page, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        setLeads(res.data || [])
        setTotal(res.pagination?.total || 0)
        setTotalPages(res.pagination?.totalPages || 1)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Failed to load leads")
          setLeads([])
          setTotal(0)
          setTotalPages(1)
        }
      })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey, page])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes, nextScheduleAt }) => {
    if (!token || !selectedLead) return
    const outcomeMap = {
      "No Response":       "NO_ANSWER",
      Busy:                "NO_ANSWER",
      Callback:            "CALLBACK",
      Issue:               "NOT_INTERESTED",
      Drop:                "DROP",
      Archive:             "ARCHIVE",
      "Confirmed Schedule":"CONFIRMED_SCHEDULE",
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
    } else if (contactRecord === "Confirmed Schedule" && nextContactAt) {
      await updateLead(token, selectedLead.id, {
        stage: "ORIENTATION",
        status: "ACTIVE",
        next_followup_at: nextContactAt,
      })
    } else if (["No Response", "Callback"].includes(contactRecord) && nextContactAt) {
      await updateLead(token, selectedLead.id, { next_followup_at: nextContactAt })
    }
    if (notes) {
      await updateLead(token, selectedLead.id, { remarks_admin: notes })
    }
    setPage(1)
    setRefreshKey((k) => k + 1)
    return log
  }

  const baseLeads = leads.filter((l) => l.status !== "ARCHIVED" && l.status !== "DROPPED")
  const activityCounts = countActiveInactive(baseLeads)
  const registerTabs = tabsWithCounts(REGISTER_TABS, {
    active: activityCounts.active,
    inactive: activityCounts.inactive,
  })
  const filteredLeads = filterRegisterLeads(leads, subStatus)

  return (
    <>
      <style>{STYLES}</style>
      <div className="reg-root">

        {/* Stage header */}
        <header className="reg-hero">
          <div className="reg-hero-main">
            <div className="reg-hero-copy">
              <PipelineStageTitle
                title="Register"
                count={loading ? null : total}
              />
              <p className="reg-desc">
                New franchise inquiries and initial follow-ups.
              </p>
            </div>
          </div>
          <div className="reg-hero-actions">
            <StatusTabs
              options={registerTabs}
              value={subStatus}
              onChange={(value) => {
                setSubStatus(value)
                setPage(1)
              }}
            />
          </div>
        </header>

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
          <>
          <div className="reg-table-card">
            <LeadPagination
              page={page}
              totalPages={totalPages}
              total={total}
              loading={loading}
              onPageChange={setPage}
              visibleCount={filteredLeads.length}
            />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead className="reg-thead">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="reg-th">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length}>
                      <div className="reg-empty">
                        <div className="reg-empty-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                        </div>
                        <p className="reg-empty-text">No leads found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="reg-tr">
                      <td className="reg-td">
                        <LeadShortId id={lead.id} />
                      </td>
                      <td className="reg-td">
                        <div className="reg-name-cell">
                          <div className="reg-avatar">
                            {(lead.full_name?.[0] || "?").toUpperCase()}
                          </div>
                          <span className="reg-name">{lead.full_name || "—"}</span>
                        </div>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
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
            pipelineLabel="Register"
            enableNextScheduleField
          />
        )}

      </div>

      {/* Toast */}
      {success && !error && (
        <div className="reg-toast">
          <div className="reg-toast-inner">
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