import { useEffect, useState } from "react";
import { fetchAdminDashboard, fetchRecentFranchiseRequests } from "../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminErrorBanner from "../components/AdminErrorBanner";
import AdminEmptyState from "../components/AdminEmptyState";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#5a5a5a;
    --white:         #ffffff;
  }

  .db-root {
    min-height: 100vh;
    background: var(--surface-bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    padding: 32px 28px;
  }

  .db-inner {
    max-width: 1080px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* ── Header ── */
  .db-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .db-greeting {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .db-greeting span { color: var(--green-dark); }

  .db-subline {
    margin-top: 6px;
    font-size: 13px;
    color: var(--text-secondary);
    opacity: 0.65;
  }

  .db-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px 14px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    opacity: 0.8;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .db-date-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green-primary);
    flex-shrink: 0;
  }

  /* ── Stat Cards ── */
  .db-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 560px) {
    .db-stats { grid-template-columns: repeat(3, 1fr); }
  }

  .db-stat {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.18s ease, transform 0.18s ease;
    cursor: default;
    animation: db-enter 0.35s ease both;
  }

  .db-stat:nth-child(1) { animation-delay: 0.05s; }
  .db-stat:nth-child(2) { animation-delay: 0.12s; }
  .db-stat:nth-child(3) { animation-delay: 0.19s; }

  .db-stat:hover {
    box-shadow: 0 10px 36px rgba(10, 20, 5, 0.09);
    transform: translateY(-2px);
  }

  .db-stat.featured {
    background: var(--green-dark);
    border-color: var(--green-dark);
  }

  .db-stat-glow {
    position: absolute;
    right: -28px; top: -28px;
    width: 100px; height: 100px;
    border-radius: 50%;
    background: rgba(151, 182, 76, 0.07);
    pointer-events: none;
  }

  .db-stat.featured .db-stat-glow {
    background: rgba(255, 255, 255, 0.05);
  }

  .db-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.6;
    margin-bottom: 10px;
  }

  .db-stat.featured .db-stat-label {
    color: rgba(255,255,255,0.55);
    opacity: 1;
  }

  .db-stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 46px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .db-stat.featured .db-stat-value { color: var(--white); }

  .db-stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    flex-shrink: 0;
    opacity: 0.55;
  }

  .db-stat.featured .db-stat-icon {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.15);
    color: var(--white);
    opacity: 1;
  }

  .db-stat-skeleton {
    height: 46px; width: 68px;
    border-radius: 8px;
    background: var(--border);
    animation: db-pulse 1.3s ease-in-out infinite;
  }

  .db-stat.featured .db-stat-skeleton {
    background: rgba(255,255,255,0.15);
  }

  @keyframes db-pulse {
    0%, 100% { opacity: 1;    }
    50%       { opacity: 0.4; }
  }

  @keyframes db-enter {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* ── Recent Panel ── */
  .db-panel {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    animation: db-enter 0.35s 0.25s ease both;
  }

  .db-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }

  .db-panel-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }

  .db-panel-badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    background: var(--surface-bg);
    border: 1px solid var(--border);
    padding: 3px 10px;
    border-radius: 20px;
    opacity: 0.7;
  }

  /* ── Rows ── */
  .db-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 24px;
    transition: background 0.12s;
    position: relative;
  }

  .db-row:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0; left: 24px; right: 24px;
    height: 1px;
    background: var(--surface-bg);
  }

  .db-row:hover { background: #fafcf6; }

  .db-row-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4e8a0 0%, #97b64c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .db-row-info { flex: 1; min-width: 0; }

  .db-row-name {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .db-row-email {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--text-secondary);
    opacity: 0.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .db-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
  }

  .db-row-location {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 3px 9px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .db-row-time {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--text-secondary);
    opacity: 0.4;
  }

  /* ── Skeleton ── */
  .db-skel-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 24px;
  }

  .db-skel-row:not(:last-child) {
    border-bottom: 1px solid var(--surface-bg);
  }

  .db-skel-circle {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--border);
    flex-shrink: 0;
    animation: db-pulse 1.3s ease-in-out infinite;
  }

  .db-skel-block {
    background: var(--border);
    border-radius: 6px;
    animation: db-pulse 1.3s ease-in-out infinite;
  }

  /* ── Row entrance stagger ── */
  .db-rows .db-row {
    animation: db-enter 0.25s ease both;
  }
  .db-rows .db-row:nth-child(1) { animation-delay: 0.05s; }
  .db-rows .db-row:nth-child(2) { animation-delay: 0.10s; }
  .db-rows .db-row:nth-child(3) { animation-delay: 0.15s; }
  .db-rows .db-row:nth-child(4) { animation-delay: 0.20s; }
  .db-rows .db-row:nth-child(5) { animation-delay: 0.25s; }
`

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export default function AdminDashboard() {
  const { token, logout, admin }        = useAdminAuth();
  const [stats, setStats]               = useState(null);
  const [recent, setRecent]             = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!token) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const [dashboardRes, recentRes] = await Promise.all([
          fetchAdminDashboard(token),
          fetchRecentFranchiseRequests(token, { pageSize: 5 }),
        ]);
        if (!isMounted) return;
        setStats(dashboardRes.data || null);
        setRecent(recentRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        if (err?.status === 401) {
          logout();
          setErrorMessage("Your session has expired. Please sign in again.");
        } else {
          setErrorMessage(err?.message || "Unable to load dashboard.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [token]);

  const total     = stats?.total      ?? "—";
  const today     = stats?.today      ?? "—";
  const thisMonth = stats?.this_month ?? "—";

  const adminName = admin?.email?.split("@")[0] || "Admin";

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">
        <div className="db-inner">

          {/* ── Header ── */}
          <div className="db-header">
            <div>
              <h1 className="db-greeting">
                {getGreeting()}, <span>{adminName}</span>.
              </h1>
              <p className="db-subline">Here's what's happening with your franchise leads.</p>
            </div>
            <div className="db-date-chip">
              <span className="db-date-dot" />
              {dateStr}
            </div>
          </div>

          <AdminErrorBanner message={errorMessage} />

          {/* ── Stats ── */}
          <div className="db-stats">

            <div className="db-stat featured">
              <div className="db-stat-glow" />
              <div>
                <p className="db-stat-label">Total Requests</p>
                {isLoading
                  ? <div className="db-stat-skeleton" />
                  : <p className="db-stat-value">{total}</p>
                }
              </div>
              <div className="db-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>

            <div className="db-stat">
              <div className="db-stat-glow" />
              <div>
                <p className="db-stat-label">Today</p>
                {isLoading
                  ? <div className="db-stat-skeleton" />
                  : <p className="db-stat-value">{today}</p>
                }
              </div>
              <div className="db-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8"  y1="2" x2="8"  y2="6"/>
                  <line x1="3"  y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>

            <div className="db-stat">
              <div className="db-stat-glow" />
              <div>
                <p className="db-stat-label">This Month</p>
                {isLoading
                  ? <div className="db-stat-skeleton" />
                  : <p className="db-stat-value">{thisMonth}</p>
                }
              </div>
              <div className="db-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
            </div>

          </div>

          {/* ── Recent Requests ── */}
          <div className="db-panel">
            <div className="db-panel-header">
              <p className="db-panel-title">Recent Franchise Requests</p>
              <span className="db-panel-badge">{recent.length || 0} entries</span>
            </div>

            {isLoading ? (
              <div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="db-skel-row">
                    <div className="db-skel-circle" />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div className="db-skel-block" style={{ height: 12, width: "36%" }} />
                      <div className="db-skel-block" style={{ height: 10, width: "54%" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <div className="db-skel-block" style={{ height: 22, width: 76, borderRadius: 6 }} />
                      <div className="db-skel-block" style={{ height: 10, width: 58 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <AdminEmptyState
                title="No franchise requests yet"
                description="New requests will appear here as soon as customers submit the form."
              />
            ) : (
              <div className="db-rows">
                {recent.map((item) => (
                  <div key={item.id} className="db-row">
                    <div className="db-row-avatar">
                      {(item.full_name?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="db-row-info">
                      <p className="db-row-name">{item.full_name || "—"}</p>
                      <p className="db-row-email">
                        {item.email}{item.phone ? ` · ${item.phone}` : ""}
                      </p>
                    </div>
                    <div className="db-row-right">
                      {item.location && (
                        <span className="db-row-location">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {item.location}
                        </span>
                      )}
                      <p className="db-row-time">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString("en-US", {
                              month: "short", day: "numeric",
                              hour: "numeric", minute: "2-digit",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}