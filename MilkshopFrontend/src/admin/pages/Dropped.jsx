import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-dark:    #62840b;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#5a5a5a;
    --white:         #ffffff;
    --red:           #ef4444;
    --red-dark:      #b91c1c;
    --red-light:     #fef2f2;
    --red-border:    #fca5a5;
    --red-mid:       #f87171;
  }

  .drp-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ── Banner ── */
  .drp-banner {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .drp-banner-inner { display: flex; align-items: stretch; }

  .drp-banner-accent {
    width: 5px;
    background: var(--red);
    flex-shrink: 0;
  }

  .drp-banner-body {
    flex: 1;
    padding: 18px 22px;
  }

  .drp-stage-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--red-light);
    border: 1px solid var(--red-border);
    border-radius: 6px;
    padding: 3px 9px;
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--red-dark);
    margin-bottom: 8px;
  }

  .drp-stage-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--red);
    flex-shrink: 0;
  }

  .drp-banner-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
    line-height: 1.1;
  }

  .drp-banner-desc {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
    opacity: 0.65;
  }

  /* ── Error ── */
  .drp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--red-light);
    border: 1px solid var(--red-border);
    border-radius: 10px;
    font-size: 12.5px;
    color: var(--red-dark);
  }

  /* ── Loading ── */
  .drp-loading {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .drp-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--border);
    border-top-color: var(--red);
    border-radius: 50%;
    animation: drp-spin 0.7s linear infinite;
  }

  @keyframes drp-spin { to { transform: rotate(360deg); } }

  .drp-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  /* ── Count bar ── */
  .drp-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px;
  }

  .drp-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.55;
  }

  .drp-count-pill {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--red-dark);
    background: var(--red-light);
    border: 1px solid var(--red-border);
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* ── Rows ── */
  .drp-tr {
    position: relative;
    transition: background 0.12s ease;
    animation: drp-row-in 0.25s ease both;
  }

  .drp-tr:not(:last-child) td { border-bottom: 1px solid #f0f6e8; }
  .drp-tr:hover { background: #fff8f8; }

  .drp-tr::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--red);
    opacity: 0;
    transition: opacity 0.15s;
    border-radius: 0 2px 2px 0;
  }

  .drp-tr:hover::before { opacity: 1; }

  .drp-tr:nth-child(1)   { animation-delay: 0.04s; }
  .drp-tr:nth-child(2)   { animation-delay: 0.08s; }
  .drp-tr:nth-child(3)   { animation-delay: 0.12s; }
  .drp-tr:nth-child(4)   { animation-delay: 0.16s; }
  .drp-tr:nth-child(5)   { animation-delay: 0.20s; }
  .drp-tr:nth-child(n+6) { animation-delay: 0.24s; }

  @keyframes drp-row-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0);    }
  }

  /* ── Cells ── */
  .drp-td {
    padding: 13px 18px;
    font-size: 13px;
    color: var(--text-primary);
    vertical-align: middle;
  }

  /* ── Name cell ── */
  .drp-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .drp-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fecaca 0%, #ef4444 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .drp-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .drp-email {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0.5;
    margin-top: 2px;
  }

  /* ── Status badge ── */
  .drp-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--red-light);
    border: 1px solid var(--red-border);
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 500;
    color: var(--red-dark);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .drp-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--red);
    flex-shrink: 0;
  }

  /* ── Date chip ── */
  .drp-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.65;
  }

  .drp-date-chip svg { opacity: 0.45; flex-shrink: 0; }

  /* ── View button ── */
  .drp-btn-view {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border-radius: 9px;
    border: 1px solid var(--red-border);
    background: var(--white);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.13s, color 0.13s, border-color 0.13s, transform 0.1s;
  }

  .drp-btn-view:hover {
    background: var(--red-light);
    border-color: var(--red-mid);
    color: var(--red-dark);
    transform: translateX(2px);
  }
`

export default function Dropped() {
  const { token } = useAdminAuth()
  const [leads, setLeads]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState("")
  const [selectedLead, setSelectedLead] = useState(null)

  const columns = [
    { key: "name",        label: "Lead"         },
    { key: "status",      label: "Status"       },
    { key: "inquiryDate", label: "Inquiry Date" },
    { key: "view",        label: ""             },
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "dropped", page: 1, pageSize: 50 })
      .then((res)  => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) { setError(err?.message || "Failed to load dropped"); setLeads([]) } })
      .finally(()  => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

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
      <div className="drp-root">

        {/* ── Banner ── */}
        <div className="drp-banner">
          <div className="drp-banner-inner">
            <div className="drp-banner-accent" />
            <div className="drp-banner-body">
              <div className="drp-stage-tag">
                <span className="drp-stage-dot" />
                Dropped
              </div>
              <h1 className="drp-banner-title">Dropped</h1>
              <p className="drp-banner-desc">Leads that have been dropped and are no longer active.</p>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="drp-error">
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
          <div className="drp-loading">
            <div className="drp-spinner" />
            <span className="drp-loading-text">Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="drp-countbar">
              <span className="drp-count-label">Dropped leads</span>
              <span className="drp-count-pill">{leads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={leads}
              renderRow={(lead) => (
                <tr key={lead.id} className="drp-tr">

                  {/* Name */}
                  <td className="drp-td">
                    <div className="drp-name-cell">
                      <div className="drp-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="drp-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="drp-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="drp-td">
                    <span className="drp-status-badge">
                      <span className="drp-status-dot" />
                      {lead.status || "Dropped"}
                    </span>
                  </td>

                  {/* Inquiry Date */}
                  <td className="drp-td">
                    <span className="drp-date-chip">
                      {calIcon}
                      {formatDateTime(lead.created_at) || "—"}
                    </span>
                  </td>

                  {/* View */}
                  <td className="drp-td" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="drp-btn-view"
                      onClick={() => setSelectedLead(lead)}
                      aria-label="View lead"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
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
            onClose={() => setSelectedLead(null)}
          />
        )}

      </div>
    </>
  )
}