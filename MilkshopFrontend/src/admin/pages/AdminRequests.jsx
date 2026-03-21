import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchFranchiseRequests } from "../services/api";
import AdminErrorBanner from "../components/AdminErrorBanner";
import AdminEmptyState from "../components/AdminEmptyState";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .req-root {
    --bg-deep: #0a0a08;
    --bg-surface: #111110;
    --bg-elevated: #181816;
    --border: #1e1e1c;
    --border-accent: #2a2a26;
    --cream: #F5ECD7;
    --cream-dim: #c9b99a;
    --cream-faint: rgba(245, 236, 215, 0.04);
    --green: #5A9216;
    --green-dim: rgba(90, 146, 22, 0.15);
    --text-primary: #f0ead8;
    --text-secondary: #8a8678;
    --text-muted: #4a4840;
    min-height: 100vh;
    background: var(--bg-deep);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    padding: 20px 16px;
  }

  @media (min-width: 641px) {
    .req-root { padding: 32px 28px; }
  }

  /* Header */
  .req-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .req-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 700;
    color: var(--cream);
    line-height: 1;
    letter-spacing: -0.01em;
  }

  .req-subtitle {
    font-size: 11px;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.06em;
    margin-top: 4px;
  }

  .req-total-badge {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--text-muted);
    background: var(--bg-surface);
    border: 1px solid var(--border-accent);
    border-radius: 20px;
    padding: 4px 12px;
  }

  /* Filter Bar — 1 col mobile, 2 col from 481px, 4 col from 769px */
  .filter-bar {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
    align-items: end;
  }

  .filter-actions { grid-column: span 1; }

  @media (min-width: 481px) {
    .filter-bar { grid-template-columns: 1fr 1fr; }
    .filter-actions { grid-column: span 2; }
  }

  @media (min-width: 769px) {
    .filter-bar { grid-template-columns: 1fr 1fr 1.6fr auto; }
    .filter-actions { grid-column: auto; }
  }

  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .filter-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  .filter-input {
    background: var(--bg-surface);
    border: 1px solid var(--border-accent);
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    color: var(--cream-dim);
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    width: 100%;
    color-scheme: dark;
  }

  .filter-input::placeholder { color: var(--text-muted); }

  .filter-input:focus {
    border-color: rgba(90, 146, 22, 0.5);
    box-shadow: 0 0 0 3px rgba(90, 146, 22, 0.08);
  }

  .filter-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .btn-apply {
    padding: 8px 18px;
    border-radius: 8px;
    border: none;
    background: var(--green);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s ease;
    white-space: nowrap;
  }

  .btn-apply:hover { background: #3e6610; }

  .btn-clear {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--border-accent);
    background: transparent;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .btn-clear:hover {
    background: var(--bg-elevated);
    color: var(--cream-dim);
  }

  /* Active filter pills */
  .filter-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .filter-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px 3px 10px;
    background: var(--green-dim);
    border: 1px solid rgba(90, 146, 22, 0.25);
    border-radius: 20px;
    font-size: 10.5px;
    color: #a8d96c;
    font-family: 'DM Mono', monospace;
  }

  /* Table Wrapper */
  .table-wrap {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }

  .table-scroll {
    overflow-x: auto;
  }

  table.req-table {
    min-width: 960px;
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .req-table thead {
    background: var(--bg-elevated);
    border-bottom: 1px solid var(--border-accent);
  }

  .req-table thead th {
    padding: 11px 14px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }

  .req-table thead th:first-child {
    padding-left: 18px;
  }

  .req-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.12s ease;
  }

  .req-table tbody tr:last-child {
    border-bottom: none;
  }

  .req-table tbody tr:hover {
    background: var(--cream-faint);
  }

  .req-table td {
    padding: 11px 14px;
    color: var(--text-secondary);
    vertical-align: middle;
  }

  .req-table td:first-child {
    padding-left: 18px;
  }

  .td-name {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .td-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e3a08 0%, #2d5c10 100%);
    border: 1px solid rgba(90,146,22,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #a8d96c;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0;
  }

  .td-name-text {
    font-weight: 500;
    color: var(--cream);
    white-space: nowrap;
  }

  .td-mono {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
  }

  .td-remarks {
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .package-badge {
    display: inline-block;
    padding: 2px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
    background: var(--green-dim);
    border: 1px solid rgba(90,146,22,0.2);
    color: #a8d96c;
    white-space: nowrap;
  }

  /* Skeleton */
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  .skel-row td { padding: 12px 14px; }
  .skel-row td:first-child { padding-left: 18px; }

  .skel {
    border-radius: 4px;
    background: var(--bg-elevated);
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* Pagination */
  .req-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
  }

  .pag-info {
    font-size: 11px;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  .pag-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .pag-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 7px;
    border: 1px solid var(--border-accent);
    background: transparent;
    color: var(--text-secondary);
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pag-btn:hover:not(:disabled) {
    background: var(--bg-elevated);
    color: var(--cream-dim);
    border-color: #3a3a34;
  }

  .pag-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .pag-page {
    padding: 6px 12px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--cream-dim);
    background: var(--bg-elevated);
    border: 1px solid var(--border-accent);
    border-radius: 7px;
  }
`;

export default function AdminRequests() {
  const { token, logout } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!token) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const res = await fetchFranchiseRequests(token, {
          page, pageSize,
          from: from || undefined,
          to: to || undefined,
          search: search || undefined,
        });
        if (!isMounted) return;
        setItems(res.data || []);
        setTotal(res.pagination?.total || 0);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        if (!isMounted) return;
        if (err?.status === 401) {
          logout();
          setErrorMessage("Your session has expired. Please sign in again.");
        } else {
          setErrorMessage(err?.message || "Unable to load requests.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [token, page, pageSize, from, to, search]);

  const handleApplyFilters = (e) => { e.preventDefault(); setPage(1); };
  const handleClearFilters = () => { setFrom(""); setTo(""); setSearch(""); setPage(1); };

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const hasActiveFilters = from || to || search;

  return (
    <>
      <style>{STYLES}</style>
      <div className="req-root">
        <header className="req-header">
          <div>
            <h1 className="req-title">Franchise Requests</h1>
            <p className="req-subtitle">/admin/requests</p>
          </div>
          <span className="req-total-badge">{total} total</span>
        </header>

        <AdminErrorBanner message={errorMessage} />

        {/* Filters */}
        <form onSubmit={handleApplyFilters} className="filter-bar">
          <div className="filter-field">
            <label className="filter-label">From</label>
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(e) => {
                const v = e.target.value;
                setFrom(v);
                if (to && v && v > to) setTo(v);
              }}
              className="filter-input"
            />
          </div>
          <div className="filter-field">
            <label className="filter-label">To</label>
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(e) => {
                const v = e.target.value;
                setTo(v);
                if (from && v && v < from) setFrom(v);
              }}
              className="filter-input"
            />
          </div>
          <div className="filter-field">
            <label className="filter-label">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or email..."
              className="filter-input"
            />
          </div>
          <div className="filter-actions">
            <button type="submit" className="btn-apply">Apply</button>
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters} className="btn-clear">Clear</button>
            )}
          </div>
        </form>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="filter-pills">
            {from && <span className="filter-pill">From: {from}</span>}
            {to && <span className="filter-pill">To: {to}</span>}
            {search && <span className="filter-pill">"{search}"</span>}
          </div>
        )}

        {/* Table */}
        <div className="table-wrap">
          <div className="table-scroll">
            <table className="req-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Contact No.</th>
                  <th>Best Contact Time</th>
                  <th>Annual Income</th>
                  <th>Proposed Location</th>
                  <th>Package</th>
                  <th>Remarks</th>
                  <th>Referral</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="skel-row">
                      <td><div className="skel" style={{ height: 12, width: 110 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 130 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 90 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 100 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 80 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 100 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 80 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 120 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 80 }} /></td>
                      <td><div className="skel" style={{ height: 12, width: 110 }} /></td>
                    </tr>
                  ))
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <AdminEmptyState
                        title="No requests found"
                        description="Try adjusting your filters or check back later."
                      />
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="td-name">
                          <div className="td-avatar">
                            {(item.full_name?.[0] || "?").toUpperCase()}
                          </div>
                          <span className="td-name-text">{item.full_name}</span>
                        </div>
                      </td>
                      <td className="td-mono">{item.email}</td>
                      <td className="td-mono">{item.contact_number}</td>
                      <td>{item.best_contact_time}</td>
                      <td className="td-mono">{item.estimated_annual_income}</td>
                      <td>{item.proposed_location}</td>
                      <td>
                        {item.preferred_package
                          ? <span className="package-badge">{item.preferred_package}</span>
                          : <span style={{ color: "var(--text-muted)" }}>—</span>}
                      </td>
                      <td>
                        <span className="td-remarks" title={item.remarks}>
                          {item.remarks || <span style={{ color: "var(--text-muted)" }}>—</span>}
                        </span>
                      </td>
                      <td>{item.referral || <span style={{ color: "var(--text-muted)" }}>—</span>}</td>
                      <td className="td-mono" style={{ color: "var(--text-muted)", fontSize: 10 }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="req-pagination">
            <span className="pag-info">
              Page {page} of {totalPages} · {total} records
            </span>
            <div className="pag-controls">
              <button
                className="pag-btn"
                disabled={!canPrev || isLoading}
                onClick={() => canPrev && setPage((p) => p - 1)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                Prev
              </button>
              <span className="pag-page">{page}</span>
              <button
                className="pag-btn"
                disabled={!canNext || isLoading}
                onClick={() => canNext && setPage((p) => p + 1)}
              >
                Next
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}