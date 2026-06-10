import { useEffect, useState } from "react";
import { fetchAdminDashboard, fetchRecentFranchiseRequests } from "../services/api";
import { fetchLeadFocusStats } from "../services/leadService";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminErrorBanner from "../components/AdminErrorBanner";
import AdminEmptyState from "../components/AdminEmptyState";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --brand-green: #97b64c;
    --brand-green-dark: #5A9216;
    --surface-bg: #ffffff;
    --border: #e5e7eb;
    --border-light: #f3f4f6;
    --hover-bg: #f9fafb;
    --text-primary: #1e1e1e;
    --text-secondary: #6b7280;
    --white: #ffffff;
  }

  .db-root {
    min-height: 100vh;
    background: var(--surface-bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  .db-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (min-width: 769px) {
    .db-inner { padding: 28px 32px; gap: 28px; }
  }

  /* ── Header ── */
  .db-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 4px;
  }

  @media (min-width: 769px) {
    .db-header { flex-wrap: nowrap; align-items: center; }
  }

  .db-page-title {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--brand-green);
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 6px;
  }

  @media (min-width: 769px) {
    .db-page-title { font-size: 36px; }
  }

  .db-greeting {
    font-size: 15px;
    font-weight: 500;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.4;
    margin: 0;
  }

  .db-greeting span {
    font-weight: 600;
    color: var(--brand-green-dark);
  }

  .db-subline {
    margin: 4px 0 0;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .db-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--hover-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .db-date-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--brand-green);
    flex-shrink: 0;
  }

  /* ── Stat Cards ── */
  .db-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  @media (min-width: 640px) {
    .db-stats { grid-template-columns: repeat(3, 1fr); }
  }

  .db-stat {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 22px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
  }

  .db-stat.primary {
    border-left: 4px solid var(--brand-green);
  }

  .db-stat-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .db-stat-value {
    font-size: 40px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .db-stat.primary .db-stat-value {
    color: var(--brand-green-dark);
  }

  .db-stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--hover-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--brand-green-dark);
    flex-shrink: 0;
  }

  .db-stat-skeleton {
    height: 40px;
    width: 64px;
    border-radius: 6px;
    background: var(--border-light);
    animation: db-pulse 1.3s ease-in-out infinite;
  }

  @keyframes db-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }

  /* ── Today's Focus ── */
  .db-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .db-section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0;
  }

  .db-section-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--brand-green);
    flex-shrink: 0;
  }

  .db-focus-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--white);
  }

  @media (min-width: 768px) {
    .db-focus-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  .db-focus-card {
    padding: 18px 20px;
    background: var(--white);
    border-bottom: 1px solid var(--border-light);
    border-right: 1px solid var(--border-light);
  }

  .db-focus-card:nth-child(2n) { border-right: none; }
  .db-focus-card:nth-last-child(-n+2) { border-bottom: none; }

  @media (min-width: 768px) {
    .db-focus-card { border-bottom: none; }
    .db-focus-card:nth-child(2n) { border-right: 1px solid var(--border-light); }
    .db-focus-card:last-child { border-right: none; }
  }

  .db-focus-card.overdue {
    border-left: 3px solid #dc2626;
    padding-left: 17px;
  }

  .db-focus-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .db-focus-value {
    margin-top: 8px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--text-primary);
  }

  .db-focus-card.overdue .db-focus-value { color: #dc2626; }

  /* ── Recent Panel ── */
  .db-panel {
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    background: var(--white);
  }

  .db-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
    gap: 12px;
  }

  .db-panel-badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 8px;
    border: 1px solid var(--brand-green);
    background: var(--brand-green);
    font-size: 12px;
    font-weight: 600;
    color: var(--white);
    white-space: nowrap;
  }

  .db-table-head {
    display: none;
    grid-template-columns: 48px 1fr 180px;
    gap: 14px;
    align-items: center;
    padding: 10px 20px;
    background: var(--hover-bg);
    border-bottom: 1px solid var(--border-light);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--brand-green-dark);
  }

  @media (min-width: 768px) {
    .db-table-head { display: grid; }
  }

  /* ── Rows ── */
  .db-row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-light);
    transition: background 0.12s;
  }

  .db-row:last-child { border-bottom: none; }

  .db-row:hover { background: var(--hover-bg); }

  .db-row-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--brand-green);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
  }

  .db-row-info { min-width: 0; }

  .db-row-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .db-row-email {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .db-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .db-row-location {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .db-row-time {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  /* ── Skeleton ── */
  .db-skel-row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-light);
  }

  .db-skel-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--border-light);
    flex-shrink: 0;
    animation: db-pulse 1.3s ease-in-out infinite;
  }

  .db-skel-block {
    background: var(--border-light);
    border-radius: 4px;
    animation: db-pulse 1.3s ease-in-out infinite;
  }
`

const PH_TIMEZONE = "Asia/Manila"

function getPhHour(date = new Date()) {
  const hour = new Intl.DateTimeFormat("en-PH", {
    timeZone: PH_TIMEZONE,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date).find((p) => p.type === "hour")?.value
  return Number(hour ?? 0)
}

function formatPhDateTime(date = new Date()) {
  const datePart = date.toLocaleDateString("en-PH", {
    timeZone: PH_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const timePart = date.toLocaleTimeString("en-PH", {
    timeZone: PH_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  return `${datePart} · ${timePart}`
}

function formatPhSubmittedAt(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-PH", {
    timeZone: PH_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function getGreeting() {
  const h = getPhHour()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export default function AdminDashboard() {
  const { token, logout, admin }        = useAdminAuth();
  const [stats, setStats]               = useState(null);
  const [focus, setFocus]               = useState(null);
  const [recent, setRecent]             = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [phNow, setPhNow] = useState(() => new Date());

  useEffect(() => {
    const tick = setInterval(() => setPhNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!token) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const [dashboardRes, focusRes, recentRes] = await Promise.all([
          fetchAdminDashboard(token),
          fetchLeadFocusStats(token),
          fetchRecentFranchiseRequests(token, { pageSize: 5 }),
        ]);
        if (!isMounted) return;
        setStats(dashboardRes.data || null);
        setFocus(focusRes.data || null);
        setRecent(recentRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        if (err?.status === 403) {
          setErrorMessage(
            err?.message ||
              "Your Firebase account is not linked to an admin user in the database.",
          );
        } else if (err?.status === 401) {
          setErrorMessage(
            err?.message ||
              "Backend rejected your login token. Add Firebase Admin settings to MilkshopBackend/.env and restart the API.",
          );
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
  const overdue   = focus?.overdue ?? "—";
  const dueToday  = focus?.due_today ?? "—";
  const newToday  = focus?.new_today ?? "—";
  const followup  = focus?.for_followup ?? "—";

  const adminName = admin?.email?.split("@")[0] || "Admin";

  const dateStr = formatPhDateTime(phNow);

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">
        <div className="db-inner">

          {/* ── Header ── */}
          <div className="db-header">
            <div>
              <h1 className="db-page-title">Dashboard</h1>
              <p className="db-greeting">
                {getGreeting()}, <span>{adminName}</span>.
              </p>
              <p className="db-subline">Franchise lead overview and recent activity.</p>
            </div>
            <div className="db-date-chip">
              <span className="db-date-dot" />
              {dateStr}
            </div>
          </div>

          <AdminErrorBanner message={errorMessage} />

          {/* ── Stats ── */}
          <div className="db-stats">

            <div className="db-stat primary">
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

          {/* ── Today's Focus ── */}
          <section>
            <div className="db-section-head">
              <h2 className="db-section-title">
                <span className="db-section-dot" aria-hidden />
                Today&apos;s Focus
              </h2>
            </div>
            <div className="db-focus-grid">
              <div className="db-focus-card overdue">
                <p className="db-focus-label">Overdue</p>
                <p className="db-focus-value">{isLoading ? "…" : overdue}</p>
              </div>
              <div className="db-focus-card">
                <p className="db-focus-label">Due Today</p>
                <p className="db-focus-value">{isLoading ? "…" : dueToday}</p>
              </div>
              <div className="db-focus-card">
                <p className="db-focus-label">New Today</p>
                <p className="db-focus-value">{isLoading ? "…" : newToday}</p>
              </div>
              <div className="db-focus-card">
                <p className="db-focus-label">For Follow-up</p>
                <p className="db-focus-value">{isLoading ? "…" : followup}</p>
              </div>
            </div>
          </section>

          {/* ── Recent Requests ── */}
          <div className="db-panel">
            <div className="db-panel-header">
              <h2 className="db-section-title">
                <span className="db-section-dot" aria-hidden />
                Recent Franchise Requests
              </h2>
              <span className="db-panel-badge">({recent.length || 0} entries)</span>
            </div>

            <div className="db-table-head">
              <span />
              <span>Lead</span>
              <span>Submitted</span>
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
                        {formatPhSubmittedAt(item.created_at)}
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