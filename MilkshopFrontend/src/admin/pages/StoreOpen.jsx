import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

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
  }

  .sto-root {
    display: flex;
    flex-direction: column;
    gap: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  .sto-hero {
    position: relative;
    padding: 22px 22px 22px 26px;
    border-radius: 18px;
    border: 1px solid #dde8cf;
    background: linear-gradient(145deg, #fbfdf8 0%, #ffffff 42%, #f7faf3 100%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 8px 28px rgba(26, 36, 16, 0.06);
    overflow: hidden;
  }

  .sto-hero::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 5px;
    background: linear-gradient(180deg, #97b64c 0%, #62840b 100%);
    border-radius: 18px 0 0 18px;
  }

  .sto-hero-pill {
    display: inline-flex;
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
    margin-bottom: 8px;
  }

  .sto-banner-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    margin: 0 0 6px 0;
  }

  .sto-banner-desc {
    font-size: 12.5px;
    color: var(--text-secondary);
    opacity: 0.7;
    margin: 0 0 12px 0;
  }

  .sto-countbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .sto-count-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-secondary);
    opacity: 0.65;
  }

  .sto-count-pill {
    font-size: 12px;
    font-weight: 600;
    color: var(--green-dark);
    background: #eef5df;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 10px;
  }

  .sto-tr:hover { background: #fafdf6; }
  .sto-td { padding: 14px 16px; border-bottom: 1px solid #edf3e4; vertical-align: middle; }
  .sto-name-cell { display: flex; align-items: center; gap: 10px; }
  .sto-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: #eef5df; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; color: var(--green-dark); font-size: 13px;
  }
  .sto-name { font-size: 13.5px; font-weight: 600; margin: 0; }
  .sto-email { font-size: 11.5px; color: var(--text-secondary); opacity: 0.7; margin: 2px 0 0; }
  .sto-open-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 999px;
    background: #eef5df; border: 1px solid var(--border);
    font-size: 11px; font-weight: 600; color: var(--green-dark);
  }
  .sto-open-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-primary); }
  .sto-btn-view {
    padding: 6px 14px; border-radius: 8px; border: 1px solid #bfdbfe;
    background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .sto-btn-view:hover { background: #dbeafe; }
  .sto-error, .sto-loading {
    padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border);
    background: var(--white); font-size: 12.5px;
  }
  .sto-spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid #d0e0b0; border-top-color: var(--green-primary);
    animation: sto-spin 0.7s linear infinite;
  }
  @keyframes sto-spin { to { transform: rotate(360deg); } }
  .sto-loading { display: flex; align-items: center; gap: 10px; }
`

export default function StoreOpen() {
  const { token } = useAdminAuth()
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const columns = [
    { key: "name", label: "Lead" },
    { key: "opened", label: "Store Open" },
    { key: "view", label: "" },
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) { setLoading(false); return }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "store_open", page: 1, pageSize: 50 })
      .then((res) => { if (!cancelled) setLeads(res.data || []) })
      .catch((err) => { if (!cancelled) { setError(err?.message || "Failed to load store open leads"); setLeads([]) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [token])

  return (
    <>
      <style>{STYLES}</style>
      <div className="sto-root">
        <header className="sto-hero">
          <span className="sto-hero-pill">Final stage</span>
          <h1 className="sto-banner-title">Store Open</h1>
          <p className="sto-banner-desc">
            Leads that completed onboarding and reached store opening.
          </p>
        </header>

        {error && <div className="sto-error">{error}</div>}

        {loading ? (
          <div className="sto-loading">
            <div className="sto-spinner" />
            <span>Loading leads...</span>
          </div>
        ) : (
          <>
            <div className="sto-countbar">
              <span className="sto-count-label">Final stage</span>
              <span className="sto-count-pill">{leads.length} leads</span>
            </div>

            <LeadTable
              columns={columns}
              leads={leads}
              renderRow={(lead) => (
                <tr key={lead.id} className="sto-tr">
                  <td className="sto-td">
                    <div className="sto-name-cell">
                      <div className="sto-avatar">
                        {(lead.full_name?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="sto-name">{lead.full_name || "—"}</p>
                        {lead.email && <p className="sto-email">{lead.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="sto-td">
                    <span className="sto-open-badge">
                      <span className="sto-open-dot" />
                      Store Open
                    </span>
                    <div style={{ marginTop: 6, fontSize: 11.5, color: "#6b7280" }}>
                      {formatDateTime(lead.updated_at || lead.last_contacted_at) || "—"}
                    </div>
                  </td>
                  <td className="sto-td">
                    <button
                      type="button"
                      className="sto-btn-view"
                      onClick={() => setSelectedLead(lead)}
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
            contactOptions={[]}
            onClose={() => setSelectedLead(null)}
            pipelineLabel="Store Open"
          />
        )}
      </div>
    </>
  )
}
