import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: "/admin/leads",
    label: "Leads",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M3 18c0-2.2 1.8-4 4-4h2" />
        <path d="M14 14h2c2.2 0 4 1.8 4 4" />
      </svg>
    ),
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .al-root {
    display: flex;
    min-height: 100vh;
    background: #F7F9F4;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Sidebar (hidden on mobile, shown from 769px) ── */
  .al-sidebar {
    display: none;
    width: 220px;
    min-height: 100vh;
    background: #FFFFFF;
    border-right: 1px solid #DDE8CF;
    flex-direction: column;
    flex-shrink: 0;
  }

  @media (min-width: 769px) {
    .al-sidebar { display: flex; }
  }

  /* ── Brand ── */
  .al-brand {
    padding: 20px 18px 16px;
    border-bottom: 1px solid #DDE8CF;
  }

  .al-brand-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 2px;
  }

  .al-brand-logo {
    display: block;
    height: 36px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
  }

  .al-brand-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: #5A6B4A;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  /* ── Nav ── */
  .al-nav {
    flex: 1;
    padding: 14px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .al-nav-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5A6B4A;
    padding: 6px 10px 5px;
  }

  .al-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 500;
    color: #5A6B4A;
    text-decoration: none;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    position: relative;
  }

  .al-nav-link:hover {
    background: #F7F9F4;
    color: #1A2410;
  }

  .al-nav-link.active {
    background: #EEF5E6;
    color: #3E6610;
    border-color: #C8DFA8;
    font-weight: 600;
  }

  .al-nav-link.active .al-nav-icon { color: #5A9216; }

  .al-nav-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 55%;
    background: #5A9216;
    border-radius: 0 2px 2px 0;
  }

  .al-nav-icon { flex-shrink: 0; transition: color 0.15s; }

  /* ── Footer ── */
  .al-footer {
    padding: 12px 10px;
    border-top: 1px solid #DDE8CF;
  }

  .al-admin-info {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px;
    border-radius: 9px;
    background: #F7F9F4;
    border: 1px solid #DDE8CF;
    margin-bottom: 6px;
  }

  .al-admin-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #EEF5E6 0%, #C8DFA8 100%);
    border: 1.5px solid #DDE8CF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #3E6610;
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
  }

  .al-admin-name {
    font-size: 11.5px;
    font-weight: 500;
    color: #1A2410;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .al-admin-role {
    font-size: 9.5px;
    color: #5A6B4A;
    font-family: 'DM Mono', monospace;
  }

  .al-logout {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #5A6B4A;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .al-logout:hover {
    background: #FEF2F2;
    color: #991B1B;
  }

  /* ── Main ── */
  .al-content-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .al-main {
    flex: 1;
    min-height: 100vh;
    background: #F7F9F4;
  }

  /* ── Mobile header (default; hidden from 769px) ── */
  .al-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 18px;
    background: #FFFFFF;
    border-bottom: 1px solid #DDE8CF;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  @media (min-width: 769px) {
    .al-mobile-header { display: none; }
  }

  .al-mobile-brand {
    font-size: 16px;
    font-weight: 700;
    color: #1A2410;
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .al-hamburger {
    width: 34px;
    height: 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: #F7F9F4;
    border: 1px solid #DDE8CF;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
  }

  .al-hamburger span {
    display: block;
    width: 16px;
    height: 1.5px;
    background: #5A6B4A;
    border-radius: 2px;
  }

  /* ── Mobile Drawer (hidden from 769px) ── */
  .al-mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,36,16,0.5);
    z-index: 40;
    backdrop-filter: blur(2px);
  }

  .al-mobile-drawer {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 220px;
    background: #FFFFFF;
    border-right: 1px solid #DDE8CF;
    z-index: 50;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .al-mobile-drawer.open { transform: translateX(0); }

  @media (min-width: 769px) {
    .al-mobile-drawer { display: none; }
  }
`;

export default function AdminLayout({ children }) {
  const { logout, admin } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = ({ onLinkClick }) => (
    <>
      <div className="al-brand">
        <Link to="/admin/dashboard" className="al-brand-link" onClick={onLinkClick}>
          <img src="/milkshop-logo.png" alt="Milkshop" className="al-brand-logo" />
        </Link>
        <p className="al-brand-sub">Admin Console</p>
      </div>

      <nav className="al-nav">
        <p className="al-nav-label">Navigation</p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `al-nav-link${isActive ? " active" : ""}`}
            onClick={onLinkClick}
          >
            <span className="al-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="al-footer">
        {admin && (
          <div className="al-admin-info">
            <div className="al-admin-avatar">
              {(admin?.email?.[0] || "A").toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="al-admin-name">{admin?.email || "Admin"}</p>
              <p className="al-admin-role">Super Admin</p>
            </div>
          </div>
        )}
        <button className="al-logout" onClick={handleLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-root">

        {/* Desktop Sidebar */}
        <aside className="al-sidebar">
          <SidebarContent />
        </aside>

        {/* Content */}
        <div className="al-content-wrap">

          {/* Mobile Header */}
          <header className="al-mobile-header">
            <Link to="/admin/dashboard" className="al-mobile-brand">
              <img src="/milkshop-logo.png" alt="Milkshop" className="al-brand-logo" style={{ height: 28 }} />
            </Link>
            <button className="al-hamburger" onClick={() => setMobileOpen(true)}>
              <span /><span /><span />
            </button>
          </header>

          {/* Mobile Overlay */}
          {mobileOpen && (
            <div className="al-mobile-overlay" onClick={() => setMobileOpen(false)} />
          )}

          {/* Mobile Drawer */}
          <div className={`al-mobile-drawer${mobileOpen ? " open" : ""}`}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid #DDE8CF" }}>
              <img src="/milkshop-logo.png" alt="Milkshop" className="al-brand-logo" style={{ height: 28 }} />
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#5A6B4A", cursor: "pointer", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <SidebarContent onLinkClick={() => setMobileOpen(false)} />
          </div>

          <main className="al-main">{children}</main>
        </div>
      </div>
    </>
  );
}