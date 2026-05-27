import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: "/admin/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/admin/qr-email",
    label: "QR & Email",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <polyline points="4 6 12 11 20 6" />
      </svg>
    ),
  },
  {
    to: "/admin/account-settings",
    label: "Account Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
      </svg>
    ),
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark: #62840b;
    --green-light: #b7cd7f;
    --green-muted: #b7cd7f;
    --amber: #E8A020;
    --surface-bg: #f5f8ef;
    --border: #d0e0b0;
    --text-primary: #1e1e1e;
    --text-secondary: #374151;
    --sidebar-width: 240px;
    --white: #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .al-root {
    display: flex;
    min-height: 100vh;
    background: var(--surface-bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  /* ─── Sidebar ─── */
  .al-sidebar {
    display: none;
    width: var(--sidebar-width);
    min-height: 100vh;
    background: var(--white);
    border-right: 1px solid var(--border);
    flex-direction: column;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  @media (min-width: 769px) {
    .al-sidebar { display: flex; }
  }

  /* ─── Brand ─── */
  .al-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .al-brand-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .al-brand-logo {
    display: block;
    height: 32px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
  }

  .al-brand-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--text-secondary);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-top: 8px;
    opacity: 0.7;
  }

  /* ─── Nav ─── */
  .al-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow-y: auto;
  }

  .al-nav-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    padding: 4px 10px 10px;
    opacity: 0.6;
  }

  .al-nav-link {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition: background 0.15s ease, color 0.15s ease;
    position: relative;
    letter-spacing: -0.01em;
  }

  .al-nav-link:hover {
    background: var(--surface-bg);
    color: var(--text-primary);
  }

  .al-nav-link.active {
    background: #eef5df;
    color: var(--green-dark);
    font-weight: 600;
  }

  .al-nav-link.active .al-nav-icon {
    color: var(--green-primary);
  }

  .al-nav-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 52%;
    background: var(--green-primary);
    border-radius: 0 3px 3px 0;
  }

  .al-nav-icon {
    flex-shrink: 0;
    color: var(--text-secondary);
    transition: color 0.15s;
    opacity: 0.8;
  }

  .al-nav-link.active .al-nav-icon {
    opacity: 1;
  }

  /* ─── Footer ─── */
  .al-footer {
    padding: 14px 12px 16px;
    border-top: 1px solid var(--border);
  }

  .al-admin-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--surface-bg);
    margin-bottom: 4px;
  }

  .al-admin-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4e8a0 0%, #97b64c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0;
  }

  .al-admin-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }

  .al-admin-role {
    font-size: 10px;
    color: var(--text-secondary);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.06em;
    opacity: 0.7;
    margin-top: 1px;
  }

  .al-logout {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    letter-spacing: -0.01em;
  }

  .al-logout:hover {
    background: #fff1f1;
    color: #c0392b;
  }

  .al-logout:hover .al-logout-icon {
    color: #c0392b;
  }

  .al-logout-icon {
    color: var(--text-secondary);
    transition: color 0.15s;
    opacity: 0.7;
  }

  /* ─── Main content ─── */
  .al-content-wrap {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .al-main {
    flex: 1;
    min-height: 100vh;
    background: var(--surface-bg);
  }

  /* ─── Mobile header ─── */
  .al-mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  @media (min-width: 769px) {
    .al-mobile-header { display: none; }
  }

  .al-hamburger {
    width: 36px;
    height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 9px;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s;
  }

  .al-hamburger:hover {
    background: #eef5df;
  }

  .al-hamburger span {
    display: block;
    width: 15px;
    height: 1.5px;
    background: var(--text-secondary);
    border-radius: 2px;
    transition: background 0.15s;
  }

  /* ─── Mobile Drawer ─── */
  .al-mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 20, 5, 0.4);
    z-index: 40;
    backdrop-filter: blur(3px);
    animation: al-fade-in 0.2s ease;
  }

  @keyframes al-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .al-mobile-drawer {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: var(--sidebar-width);
    background: var(--white);
    border-right: 1px solid var(--border);
    z-index: 50;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 4px 0 24px rgba(0,0,0,0.06);
  }

  .al-mobile-drawer.open { transform: translateX(0); }

  @media (min-width: 769px) {
    .al-mobile-drawer { display: none; }
  }

  .al-drawer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border);
  }

  .al-drawer-close {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-bg);
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
    color: var(--text-secondary);
    transition: background 0.15s, color 0.15s;
    flex-shrink: 0;
  }

  .al-drawer-close:hover {
    background: #eef5df;
    color: var(--text-primary);
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

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || admin?.role === "admin");

  const SidebarContent = ({ onLinkClick }) => (
    <>
      <div className="al-brand">
        <Link to="/admin/dashboard" className="al-brand-link" onClick={onLinkClick}>
          <img src="/milkshop-logo-removebg-preview.png" alt="Milkshop" className="al-brand-logo" />
        </Link>
        <p className="al-brand-sub">Admin Console</p>
      </div>

      <nav className="al-nav">
        <p className="al-nav-section-label">Navigation</p>
        {visibleNavItems.map((item) => (
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
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="al-admin-name">{admin?.email || "Admin"}</p>
              <p className="al-admin-role">Super Admin</p>
            </div>
          </div>
        )}
        <button className="al-logout" onClick={handleLogout}>
          <svg
            className="al-logout-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
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

        {/* Content Wrap */}
        <div className="al-content-wrap">

          {/* Mobile Header */}
          <header className="al-mobile-header">
            <Link to="/admin/dashboard">
              <img src="/milkshop-logo-removebg-preview.png" alt="Milkshop" className="al-brand-logo" style={{ height: 28 }} />
            </Link>
            <button className="al-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <span /><span /><span />
            </button>
          </header>

          {/* Mobile Overlay */}
          {mobileOpen && (
            <div className="al-mobile-overlay" onClick={() => setMobileOpen(false)} />
          )}

          {/* Mobile Drawer */}
          <div className={`al-mobile-drawer${mobileOpen ? " open" : ""}`}>
            <div className="al-drawer-top">
              <img src="/milkshop-logo-removebg-preview.png" alt="Milkshop" className="al-brand-logo" style={{ height: 28 }} />
              <button className="al-drawer-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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