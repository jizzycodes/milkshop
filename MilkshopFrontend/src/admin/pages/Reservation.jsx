import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"
import LeadShortId from "../components/LeadShortId"
import PipelineStageTitle from "../components/PipelineStageTitle"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
  :root { --brand-green:#97b64c; --brand-green-dark:#5A9216; --surface-bg:#ffffff; --border:#e5e7eb; --border-light:#f3f4f6; --hover-bg:#f9fafb; --text-primary:#1e1e1e; --text-secondary:#6b7280; --white:#ffffff; }
  .res-root { display:flex; flex-direction:column; gap:14px; font-family:'DM Sans',sans-serif; color:var(--text-primary); }
  .res-hero { display:flex; align-items:flex-start; gap:16px; flex-wrap:wrap; padding:0 0 8px 0; background:transparent; }
  .res-hero-main { display:flex; align-items:flex-start; gap:16px; min-width:0; flex:1; }
  .res-hero-icon { flex-shrink:0; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:var(--border-light); color:var(--text-secondary); }
  .res-hero-meta { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px; }
  .res-hero-pill { display:inline-flex; align-items:center; padding:3px 10px; border-radius:999px; font-family:'DM Mono',monospace; font-size:9px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-secondary); background:var(--border-light); }
  .res-hero-sep { color:#d1d5db; font-weight:300; user-select:none; }
  .res-hero-stage { font-family:'DM Mono',monospace; font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-secondary); }
  .res-banner-title { font-size:clamp(1.25rem,2.5vw,1.5rem); font-weight:700; color:#1a2410; letter-spacing:-0.03em; line-height:1.2; margin:0 0 6px 0; }
  .res-banner-desc { font-size:13px; line-height:1.55; color:var(--text-secondary); margin:0; }
  .res-error { display:flex; align-items:center; gap:8px; padding:10px 14px; background:#fef2f2; border:1px solid #fca5a5; border-radius:10px; font-size:12.5px; color:#c0392b; }
  .res-loading { background:var(--white); border:1px solid var(--border); border-radius:14px; padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:12px; }
  .res-spinner { width:22px; height:22px; border:2px solid var(--border); border-top-color:var(--text-secondary); border-radius:50%; animation:res-spin 0.7s linear infinite; }
  @keyframes res-spin { to { transform:rotate(360deg); } }
  .res-loading-text { font-family:'DM Mono',monospace; font-size:11px; color:var(--text-secondary); opacity:0.55; }
  .res-countbar { display:flex; align-items:center; justify-content:flex-end; padding:0 0 10px 0; }
  .res-count-label { font-family:'DM Mono',monospace; font-size:11px; color:var(--text-secondary); opacity:0.72; }
  .res-count-pill { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:400; color:var(--text-secondary); }
  .res-tr { transition:background 0.12s ease; animation:res-row-in 0.25s ease both; }
  .res-tr:not(:last-child) td { border-bottom:1px solid var(--border-light); }
  .res-tr:hover { background:var(--hover-bg); }
  @keyframes res-row-in { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
  .res-td { padding:13px 18px; font-size:13px; color:var(--text-primary); vertical-align:middle; }
  .res-name-cell { display:flex; align-items:center; gap:11px; }
  .res-avatar { width:34px; height:34px; border-radius:50%; background:#97b64c; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; color:#ffffff; flex-shrink:0; }
  .res-name { font-size:13.5px; font-weight:600; color:var(--text-primary); letter-spacing:-0.01em; line-height:1.2; }
  .res-email { font-family:'DM Sans',sans-serif; font-size:12px; color:#1e1e1e; margin-top:2px; }
  .res-paid-badge { display:inline-flex; align-items:center; gap:6px; background:#f0fff4; border:1px solid #bbf7d0; border-radius:7px; padding:4px 10px; font-size:11px; font-weight:500; color:#166534; font-family:'DM Sans',sans-serif; white-space:nowrap; }
  .res-paid-dot { width:5px; height:5px; border-radius:50%; background:#22c55e; flex-shrink:0; }
  .res-date-chip { display:inline-flex; align-items:center; gap:5px; font-family:'DM Sans',sans-serif; font-size:12.5px; color:#1e1e1e; white-space:nowrap; }
  .res-date-chip svg { opacity:0.55; flex-shrink:0; }
  .res-btn-view { display:inline-flex; align-items:center; gap:5px; padding:6px 14px; border-radius:8px; border:1px solid var(--brand-green); background:var(--brand-green); font-size:12px; font-weight:500; color:var(--white); cursor:pointer; font-family:'DM Sans',sans-serif; transition:background 0.13s,border-color 0.13s; white-space:nowrap; }
  .res-btn-view:hover { background:var(--brand-green-dark); border-color:var(--brand-green-dark); color:var(--white); }
  .res-toast { pointer-events:none; position:fixed; inset:0; z-index:60; display:flex; align-items:flex-start; justify-content:center; padding-top:72px; }
  .res-toast-inner { pointer-events:auto; display:flex; align-items:center; gap:8px; background:#1f2937; color:var(--white); padding:10px 20px; border-radius:999px; font-size:12.5px; font-weight:500; box-shadow:0 6px 24px rgba(0,0,0,0.12); }
`

export default function Reservation() {
  const { token } = useAdminAuth()
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [success, setSuccess] = useState("")

  const columns = [
    { key: "id", label: "Lead ID" },
    { key: "name", label: "Lead" },
    { key: "paidDate", label: "Paid Date" },
    { key: "view", label: "" },
  ]

  const contactOptions = ["Paid - Franchise Fee"]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "reservation", page: 1, pageSize: 50 })
      .then((res) => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) { setError(err?.message || "Failed to load reservation"); setLeads([]) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return
    const outcome = contactRecord === "Paid - Franchise Fee" ? "PAID" : null
    const log = await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || `Contact record: ${contactRecord}`,
      outcome,
      nextFollowupAt: nextContactAt || null,
    })
    if (contactRecord === "Paid - Franchise Fee") {
      await updateLead(token, selectedLead.id, { stage: "ONBOARDING", status: "ACTIVE", next_followup_at: nextContactAt || null })
    }
    if (notes) await updateLead(token, selectedLead.id, { remarks_admin: notes })
    setRefreshKey((k) => k + 1)
    return log
  }

  const calIcon = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )

  return (
    <>
      <style>{STYLES}</style>
      <div className="res-root">
        <header className="res-hero">
          <div className="res-hero-main">
            <div>
              <PipelineStageTitle
                title="Reservation"
                count={loading ? null : leads.length}
              />
              <p className="res-banner-desc">Leads with reservation payments before full franchise fee.</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="res-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="res-loading">
            <div className="res-spinner" />
            <span className="res-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <LeadTable
              columns={columns}
              leads={leads}
              renderRow={(lead) => (
                <tr key={lead.id} className="res-tr">
                  <td className="res-td">
                    <LeadShortId id={lead.id} />
                  </td>
                  <td className="res-td">
                    <div className="res-name-cell">
                      <div className="res-avatar">{(lead.full_name?.[0] || "?").toUpperCase()}</div>
                      <div>
                        <p className="res-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="res-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="res-td">
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span className="res-paid-badge"><span className="res-paid-dot" />Paid - Reservation</span>
                      <span className="res-date-chip">
                        {calIcon}
                        {formatDateTime(lead.next_followup_at || lead.best_contact_at) || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="res-td">
                    <button type="button" className="res-btn-view" onClick={() => setSelectedLead(lead)} aria-label="View lead">
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
            pipelineLabel="Reservation"
          />
        )}
      </div>
      {success && !error && (
        <div className="res-toast">
          <div className="res-toast-inner">
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
