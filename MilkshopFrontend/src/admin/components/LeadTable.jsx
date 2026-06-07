const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --brand-green: #97b64c;
    --surface-bg: #ffffff;
    --border: #e5e7eb;
    --border-light: #f3f4f6;
    --hover-bg: #f9fafb;
    --text-primary: #1e1e1e;
    --text-secondary: #6b7280;
    --white: #ffffff;
  }

  /* ── Wrapper ── */
  .lt-wrap {
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Table ── */
  .lt-table {
    width: 100%;
    border-collapse: collapse;
  }

  /* ── Head ── */
  .lt-thead tr {
    background: var(--hover-bg);
    border-bottom: 1px solid var(--border);
  }

  .lt-th {
    padding: 11px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #5A9216;
    text-align: left;
    white-space: nowrap;
  }

  /* ── Body ── */
  .lt-tbody tr {
    transition: background 0.12s ease;
  }

  .lt-tbody td {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #1e1e1e;
  }

  .lt-tbody tr:not(:last-child) td {
    border-bottom: 1px solid var(--border-light);
  }

  .lt-tbody tr:hover {
    background: var(--hover-bg);
  }

  /* ── Empty ── */
  .lt-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 56px 20px;
  }

  .lt-empty-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    opacity: 0.4;
    margin-bottom: 4px;
  }

  .lt-empty-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    opacity: 0.4;
  }

  .lt-empty-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.35;
  }
`

export default function LeadTable({ columns, leads, renderRow }) {
  return (
    <>
      <style>{STYLES}</style>

      {!leads || leads.length === 0 ? (
        <div className="lt-wrap">
          <div className="lt-empty">
            <div className="lt-empty-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="lt-empty-title">No leads available</p>
            <p className="lt-empty-sub">Records will appear here once added.</p>
          </div>
        </div>
      ) : (
        <div className="lt-wrap">
          <table className="lt-table">
            <thead className="lt-thead">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="lt-th">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="lt-tbody">
              {leads.map((lead) => renderRow(lead))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}