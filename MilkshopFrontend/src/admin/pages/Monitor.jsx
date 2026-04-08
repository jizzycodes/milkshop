import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { fetchMonitorSummary, resetMonitorMetrics } from "../services/api";

const TRACKING_RESET_AT_KEY = "milkshop_tracking_reset_at";

function formatDurationMs(ms) {
  const totalSec = Math.max(0, Math.round(Number(ms || 0) / 1000));
  if (totalSec < 60) return `${totalSec}s`;
  const totalMin = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (totalMin < 60) {
    if (sec === 0) return `${totalMin} min`;
    return `${totalMin} min ${sec}s`;
  }
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  if (min === 0) return `${h} hr`;
  return `${h} hr ${min} min`;
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --gp: #97b64c;
    --gd: #62840b;
    --gl: #b7cd7f;
    --bg: #f5f8ef;
    --bd: #d0e0b0;
    --tp: #1e1e1e;
    --ts: #374151;
    --wh: #ffffff;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .mo-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    padding: 32px 28px 56px;
  }

  .mo-inner {
    max-width: 1040px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── Page Header ── */
  .mo-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .mo-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.6;
    margin-bottom: 5px;
  }

  .mo-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--tp);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .mo-subtitle {
    font-size: 13px;
    color: var(--ts);
    margin-top: 5px;
    opacity: 0.6;
  }

  /* ── Header actions ── */
  .mo-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }

  .mo-btn-refresh {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid var(--bd);
    background: var(--wh);
    font-size: 12.5px;
    font-weight: 500;
    color: var(--ts);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s, color 0.13s;
    white-space: nowrap;
  }

  .mo-btn-refresh:hover:not(:disabled) { background: var(--bg); color: var(--tp); }
  .mo-btn-refresh:disabled { opacity: 0.45; cursor: not-allowed; }

  .mo-btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid #fca5a5;
    background: #fef2f2;
    font-size: 12.5px;
    font-weight: 500;
    color: #c0392b;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s, border-color 0.13s;
    white-space: nowrap;
  }

  .mo-btn-reset:hover:not(:disabled) { background: #fee2e2; border-color: #f87171; }
  .mo-btn-reset:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Reset message ── */
  .mo-reset-msg {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--gd);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Error ── */
  .mo-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 16px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 12px;
    font-size: 13px;
    color: #c0392b;
  }

  /* ── Filter card ── */
  .mo-filter-card {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 16px;
    padding: 18px 22px;
    box-shadow: 0 2px 12px rgba(10,20,5,0.04);
  }

  .mo-filter-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.6;
    display: block;
    margin-bottom: 6px;
  }

  .mo-filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    align-items: end;
  }

  .mo-filter-input,
  .mo-filter-select {
    width: 100%;
    padding: 9px 12px;
    border: 1.5px solid var(--bd);
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: var(--bg);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .mo-filter-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a5a5a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }

  .mo-filter-input:focus,
  .mo-filter-select:focus {
    border-color: var(--gp);
    box-shadow: 0 0 0 3px rgba(151,182,76,0.1);
    background: var(--wh);
  }

  .mo-filter-actions {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  .mo-btn-apply {
    flex: 1;
    padding: 9px 16px;
    border-radius: 10px;
    border: none;
    background: var(--gd);
    font-size: 13px;
    font-weight: 600;
    color: var(--wh);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .mo-btn-apply:hover { background: #4e6909; }

  .mo-btn-clear {
    padding: 9px 14px;
    border-radius: 10px;
    border: 1px solid var(--bd);
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: var(--ts);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.13s;
    white-space: nowrap;
  }

  .mo-btn-clear:hover { background: var(--bg); }

  /* ── Stat cards ── */
  .mo-stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 560px) { .mo-stats { grid-template-columns: repeat(3, 1fr); } }

  .mo-stat {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 18px;
    padding: 22px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.18s, transform 0.18s;
    animation: mo-enter 0.3s ease both;
  }

  .mo-stat:nth-child(1) { animation-delay: 0.05s; }
  .mo-stat:nth-child(2) { animation-delay: 0.10s; }
  .mo-stat:nth-child(3) { animation-delay: 0.15s; }

  .mo-stat:hover {
    box-shadow: 0 8px 28px rgba(10,20,5,0.08);
    transform: translateY(-2px);
  }

  .mo-stat.featured {
    background: var(--gd);
    border-color: var(--gd);
  }

  .mo-stat-glow {
    position: absolute;
    right: -24px; top: -24px;
    width: 90px; height: 90px;
    border-radius: 50%;
    background: rgba(151,182,76,0.07);
    pointer-events: none;
  }

  .mo-stat.featured .mo-stat-glow { background: rgba(255,255,255,0.05); }

  .mo-stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.6;
    margin-bottom: 10px;
  }

  .mo-stat.featured .mo-stat-label { color: rgba(255,255,255,0.55); opacity: 1; }

  .mo-stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 38px;
    font-weight: 700;
    color: var(--tp);
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .mo-stat.featured .mo-stat-value { color: var(--wh); }

  .mo-stat-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: var(--bg);
    border: 1px solid var(--bd);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ts);
    flex-shrink: 0;
    opacity: 0.5;
  }

  .mo-stat.featured .mo-stat-icon {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.15);
    color: var(--wh);
    opacity: 1;
  }

  .mo-stat-skeleton {
    height: 38px; width: 60px;
    border-radius: 8px;
    background: var(--bd);
    animation: mo-pulse 1.3s ease-in-out infinite;
  }

  .mo-stat.featured .mo-stat-skeleton { background: rgba(255,255,255,0.15); }

  @keyframes mo-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  @keyframes mo-enter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Loading ── */
  .mo-loading {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 16px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .mo-spinner {
    width: 22px; height: 22px;
    border: 2px solid var(--bd);
    border-top-color: var(--gp);
    border-radius: 50%;
    animation: mo-spin 0.7s linear infinite;
  }

  @keyframes mo-spin { to { transform: rotate(360deg); } }

  .mo-loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--ts);
    opacity: 0.55;
  }

  /* ── Sections panel ── */
  .mo-panel {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(10,20,5,0.04);
    animation: mo-enter 0.3s 0.2s ease both;
  }

  .mo-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 22px;
    border-bottom: 1px solid var(--bd);
    gap: 12px;
  }

  .mo-panel-title {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--tp);
    letter-spacing: -0.01em;
  }

  .mo-panel-count {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--ts);
    background: var(--bg);
    border: 1px solid var(--bd);
    padding: 3px 10px;
    border-radius: 20px;
    opacity: 0.7;
  }

  .mo-panel-body { padding: 16px 22px; display: flex; flex-direction: column; gap: 10px; }

  /* ── Section row card ── */
  .mo-section-card {
    border: 1px solid var(--bd);
    border-radius: 14px;
    overflow: hidden;
    transition: box-shadow 0.15s, border-color 0.15s;
    animation: mo-enter 0.25s ease both;
  }

  .mo-section-card:hover {
    box-shadow: 0 4px 16px rgba(10,20,5,0.06);
    border-color: var(--gl);
  }

  .mo-section-card-inner {
    display: flex;
    align-items: stretch;
  }

  .mo-section-strip {
    width: 4px;
    background: var(--gp);
    flex-shrink: 0;
  }

  .mo-section-content {
    flex: 1;
    padding: 14px 16px;
  }

  .mo-section-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--tp);
    letter-spacing: -0.01em;
    margin-bottom: 10px;
  }

  .mo-section-metrics {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  @media (min-width: 560px) { .mo-section-metrics { grid-template-columns: repeat(4, 1fr); } }

  .mo-metric {
    background: var(--bg);
    border-radius: 9px;
    padding: 9px 12px;
  }

  .mo-metric-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .mo-metric-value {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--tp);
    letter-spacing: -0.02em;
  }

  .mo-section-empty {
    padding: 32px 20px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--ts);
    opacity: 0.4;
  }

  /* ── Menu clicks list ── */
  .mo-menu-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mo-menu-row {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--bg);
  }

  .mo-menu-label {
    font-size: 12.5px;
    color: var(--tp);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  .mo-menu-count {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--ts);
    opacity: 0.8;
  }

  /* ── Daily chart ── */
  .mo-chart-body { padding: 16px 22px; display: flex; flex-direction: column; gap: 8px; }

  .mo-chart-row {
    display: grid;
    grid-template-columns: 110px 1fr 70px;
    align-items: center;
    gap: 12px;
    animation: mo-enter 0.2s ease both;
  }

  .mo-chart-day {
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    color: var(--ts);
    opacity: 0.65;
    white-space: nowrap;
  }

  .mo-chart-track {
    height: 8px;
    border-radius: 99px;
    background: #eef5df;
    overflow: hidden;
  }

  .mo-chart-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--gl) 0%, var(--gp) 100%);
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  .mo-chart-val {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--tp);
    text-align: right;
    white-space: nowrap;
    font-weight: 500;
  }

  /* ── Admin-only guard ── */
  .mo-guard {
    background: var(--wh);
    border: 1px solid var(--bd);
    border-radius: 16px;
    padding: 48px 24px;
    text-align: center;
    font-size: 13px;
    color: var(--ts);
    opacity: 0.65;
  }
`;

export default function Monitor() {
  const { token, admin } = useAdminAuth();
  const isAdmin = admin?.role === "admin";

  const [days, setDays]             = useState(14);
  const [from, setFrom]             = useState("");
  const [to, setTo]                 = useState("");
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [resetBusy, setResetBusy]   = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token || !isAdmin) return;
      setLoading(true); setError("");
      try {
        const res = await fetchMonitorSummary(token, { days, from, to });
        if (!cancelled) setData(res?.data || null);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load monitor data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token, isAdmin, days, from, to, refreshKey]);

  const maxDaily = useMemo(() => {
    const vals = (data?.byDay || []).map((d) => Number(d.duration_ms || 0));
    return Math.max(1, ...vals);
  }, [data]);

  const cleanSections = useMemo(
    () => (data?.topSections || []).filter((r) => {
      const key = String(r.section_key || "").toLowerCase();
      return key !== "unknown section" && key !== "unknown-section" && key !== "(unknown)";
    }),
    [data]
  );

  if (!isAdmin) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="mo-root">
          <div className="mo-inner">
            <div className="mo-guard">Monitor is admin-only.</div>
          </div>
        </div>
      </>
    );
  }

  function applyFilters(e) { e.preventDefault(); setRefreshKey((k) => k + 1); }
  function clearFilters() { setDays(14); setFrom(""); setTo(""); }
  function handleRefresh() { setError(""); setRefreshKey((k) => k + 1); }

  async function handleResetMetrics() {
    if (!token) return;
    if (!window.confirm("Delete ALL monitoring metrics data from database? This clears totals, sections, averages, and charts. This cannot be undone.")) return;
    setResetBusy(true); setResetMessage(""); setError("");
    try {
      await resetMonitorMetrics(token);
      window.localStorage.setItem(TRACKING_RESET_AT_KEY, new Date().toISOString());
      setResetMessage("All monitoring metrics data deleted from database.");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setError(e?.message || "Failed to reset metrics");
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="mo-root">
        <div className="mo-inner">

          {/* ── Page Header ── */}
          <div className="mo-page-header">
            <div>
              <p className="mo-eyebrow">Analytics</p>
              <h1 className="mo-title">Monitor</h1>
              <p className="mo-subtitle">Website tracking overview and session data.</p>
            </div>
            <div className="mo-header-actions">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || resetBusy}
                className="mo-btn-refresh"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                {loading ? "Refreshing…" : "Refresh"}
              </button>
              <button
                type="button"
                onClick={handleResetMetrics}
                disabled={resetBusy || loading}
                className="mo-btn-reset"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
                {resetBusy ? "Deleting…" : "Delete All Metrics Data"}
              </button>
            </div>
          </div>

          {resetMessage && (
            <div className="mo-reset-msg">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {resetMessage}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="mo-error">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* ── Filter card ── */}
          <div className="mo-filter-card">
            <form onSubmit={applyFilters}>
              <div className="mo-filter-row">
                <div>
                  <label className="mo-filter-label">Period</label>
                  <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="mo-filter-select">
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>
                <div>
                  <label className="mo-filter-label">From</label>
                  <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mo-filter-input" />
                </div>
                <div>
                  <label className="mo-filter-label">To</label>
                  <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mo-filter-input" />
                </div>
                <div className="mo-filter-actions">
                  <button type="submit" className="mo-btn-apply">Apply</button>
                  <button type="button" onClick={clearFilters} className="mo-btn-clear">Clear</button>
                </div>
              </div>
            </form>
          </div>

          {/* ── Stats ── */}
          <div className="mo-stats">
            <div className="mo-stat featured">
              <div className="mo-stat-glow" />
              <div>
                <p className="mo-stat-label">Total Events</p>
                {loading
                  ? <div className="mo-stat-skeleton" />
                  : <p className="mo-stat-value">{data?.totals?.total_events || 0}</p>
                }
              </div>
              <div className="mo-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
            </div>

            <div className="mo-stat">
              <div className="mo-stat-glow" />
              <div>
                <p className="mo-stat-label">Total Sessions</p>
                {loading
                  ? <div className="mo-stat-skeleton" />
                  : <p className="mo-stat-value">{data?.totals?.total_sessions || 0}</p>
                }
              </div>
              <div className="mo-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>

            <div className="mo-stat">
              <div className="mo-stat-glow" />
              <div>
                <p className="mo-stat-label">Total Time</p>
                {loading
                  ? <div className="mo-stat-skeleton" />
                  : <p className="mo-stat-value">{formatDurationMs(data?.totals?.total_duration_ms || 0)}</p>
                }
              </div>
              <div className="mo-stat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          {loading ? (
            <div className="mo-loading">
              <div className="mo-spinner" />
              <span className="mo-loading-text">Loading data...</span>
            </div>
          ) : (
            <>
              {/* Sections List */}
              <div className="mo-panel">
                <div className="mo-panel-header">
                  <p className="mo-panel-title">Sections</p>
                  <span className="mo-panel-count">{cleanSections.length} sections</span>
                </div>
                <div className="mo-panel-body">
                  {cleanSections.length === 0 ? (
                    <p className="mo-section-empty">No section data yet.</p>
                  ) : (
                    cleanSections.map((r, i) => (
                      <div key={r.section_key} className="mo-section-card" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="mo-section-card-inner">
                          <div className="mo-section-strip" />
                          <div className="mo-section-content">
                            <p className="mo-section-name">{r.section_key}</p>
                            <div className="mo-section-metrics">
                              <div className="mo-metric">
                                <p className="mo-metric-label">Events</p>
                                <p className="mo-metric-value">{r.events}</p>
                              </div>
                              <div className="mo-metric">
                                <p className="mo-metric-label">Sessions</p>
                                <p className="mo-metric-value">{r.sessions || 0}</p>
                              </div>
                              <div className="mo-metric">
                                <p className="mo-metric-label">Total Time</p>
                                <p className="mo-metric-value">{formatDurationMs(r.duration_ms)}</p>
                              </div>
                              <div className="mo-metric">
                                <p className="mo-metric-label">Avg Time</p>
                                <p className="mo-metric-value">{formatDurationMs(r.avg_duration_ms)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Daily Chart */}
              <div className="mo-panel">
                <div className="mo-panel-header">
                  <p className="mo-panel-title">Daily Time</p>
                  <span className="mo-panel-count">{(data?.byDay || []).length} days</span>
                </div>
                <div className="mo-chart-body">
                  {(data?.byDay || []).map((d, i) => {
                    const width = Math.max(2, Math.round((Number(d.duration_ms || 0) / maxDaily) * 100));
                    return (
                      <div key={d.day} className="mo-chart-row" style={{ animationDelay: `${i * 0.03}s` }}>
                        <div className="mo-chart-day">{d.day}</div>
                        <div className="mo-chart-track">
                          <div className="mo-chart-fill" style={{ width: `${width}%` }} />
                        </div>
                        <div className="mo-chart-val">{formatDurationMs(d.duration_ms)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Menu Clicks */}
              <div className="mo-panel">
                <div className="mo-panel-header">
                  <p className="mo-panel-title">Menu Clicks</p>
                  <span className="mo-panel-count">{(data?.menuClicks || []).length} items</span>
                </div>
                <div className="mo-panel-body">
                  {(data?.menuClicks || []).length === 0 ? (
                    <p className="mo-section-empty">No menu clicks yet.</p>
                  ) : (
                    <div className="mo-menu-list">
                      {(data?.menuClicks || []).map((item) => (
                        <div key={item.menu_label} className="mo-menu-row">
                          <span className="mo-menu-label">{item.menu_label}</span>
                          <span className="mo-menu-count">{item.clicks} clicks</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}