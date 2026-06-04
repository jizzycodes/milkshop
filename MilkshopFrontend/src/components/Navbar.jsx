import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Our Menu",  path: "/products" },
  { label: "Locations", path: "/locations" },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about" },
];

const NAV_BREAKPOINT = "860px";

const NAV_GREEN = "#97b64c";
const NAV_GREEN_DARK = "#62840b";

const styles = `
  @keyframes navFade {
    from { opacity: 0; transform: translateY(-16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes navFullIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes navLinkIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .nav-root {
    animation: navFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .nav-inner {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0;
    height: 64px;
    padding: 0 16px;
    padding-top: env(safe-area-inset-top, 0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 9px;
    box-sizing: border-box;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-inner {
      height: 92px;
      padding-left: clamp(24px, 5vw, 96px);
      padding-right: clamp(24px, 5vw, 96px);
      gap: 20px;
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    min-width: 0;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-actions { gap: 10px; }
  }

  .nav-desktop-links {
    display: none;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-desktop-links {
      display: flex;
      gap: 12px;
    }
  }

  .nav-mobile-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-mobile-actions { display: none; }
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 51px;
    height: 55px;
    padding: 0 14px;
    border-radius: 8px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: rgba(255, 255, 255, 0.88);
    border: 1px solid transparent;
    white-space: nowrap;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.28s ease,
      text-shadow 0.28s ease;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-link {
      font-size: 1.47rem;
      padding: 0 16px;
    }
  }

  .nav-link:hover {
    color: #ffffff;
    transform: scale(1.06);
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
  }

  .nav-link.active {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }

  .nav-brand-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    flex-shrink: 1;
    min-width: 0;
    color: inherit;
    margin-left: 0;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-brand-link { gap: 10px; flex-shrink: 0; }
  }

  .nav-brand-logo {
    display: block;
    height: 39px;
    width: auto;
    object-fit: contain;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), filter 0.28s ease;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-brand-logo { height: 60px; }
  }

  .nav-brand-wordmark {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: 1.47rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.2;
    white-space: nowrap;
    user-select: none;
    display: inline-block;
    color: #ffffff;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      text-shadow 0.28s ease,
      color 0.28s ease;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-brand-wordmark { font-size: 2.53rem; }
  }

  .nav-brand-link:hover .nav-brand-logo {
    transform: scale(1.08);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.45));
  }

  .nav-brand-link:hover .nav-brand-wordmark {
    transform: scale(1.05);
    color: #ffffff;
    text-shadow: 0 0 14px rgba(255, 255, 255, 0.35);
  }

  .nav-menu-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: background 0.2s ease, border-color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .hb-line {
    display: block;
    height: 2px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.95);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    transform-origin: center;
    pointer-events: none;
  }

  /* ── Full-screen mobile menu (Pickup-style) ── */
  .nav-mobile-full {
    position: fixed;
    inset: 0;
    z-index: 10050;
    background: ${NAV_GREEN};
    display: flex;
    flex-direction: column;
    padding:
      calc(20px + env(safe-area-inset-top, 0))
      24px
      calc(28px + env(safe-area-inset-bottom, 0));
    animation: navFullIn 0.28s ease forwards;
    overflow: hidden;
  }

  .nav-mobile-full-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .nav-mobile-full-brand {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: 1.35rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #ffffff;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-mobile-full-close {
    width: 44px;
    height: 44px;
    border: none;
    background: none;
    color: #ffffff;
    font-size: 1.75rem;
    font-weight: 300;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-mobile-full-links {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(22px, 5.5vw, 34px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-mobile-full-link {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.15rem, 4.8vw, 1.45rem);
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.96);
    text-decoration: none;
    opacity: 0;
    animation: navLinkIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    -webkit-tap-highlight-color: transparent;
    transition: opacity 0.2s ease;
  }

  .nav-mobile-full-link:active {
    opacity: 0.72;
  }

  .nav-mobile-full-link.is-active {
    font-weight: 700;
  }

  .nav-mobile-full-footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.92);
  }

  .nav-mobile-full-flag {
    font-size: 1.1rem;
    line-height: 1;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-mobile-full { display: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-brand-link:hover .nav-brand-logo,
    .nav-brand-link:hover .nav-brand-wordmark,
    .nav-link:hover {
      transform: none;
      filter: none;
      text-shadow: none;
    }
    .nav-link.active {
      text-shadow: none;
    }
    .nav-root,
    .nav-mobile-full,
    .nav-mobile-full-link {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

function isNavLinkActive(pathname, path) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 16);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${NAV_BREAKPOINT})`);
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{styles}</style>

      <header
        className="ms-site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: NAV_GREEN,
          borderBottom: scrolled
            ? "1px solid rgba(255, 255, 255, 0.18)"
            : "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: scrolled ? "0 4px 18px rgba(10, 20, 5, 0.14)" : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <nav className="nav-root nav-inner">
          <Link to="/" aria-label="Milkshop home" className="nav-brand-link">
            <img
              src="/milkshop-logo-removebg-preview.png"
              alt=""
              aria-hidden
              className="nav-brand-logo"
            />
            <span className="nav-brand-wordmark">Milkshop</span>
          </Link>

          <div className="nav-actions">
            <ul className="nav-desktop-links">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(location.pathname, link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`nav-link${isActive ? " active" : ""}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="nav-mobile-actions">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="nav-menu-btn"
              >
                <span className="hb-line" style={{ width: "21px" }} />
                <span className="hb-line" style={{ width: "14px" }} />
                <span className="hb-line" style={{ width: "21px" }} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {menuOpen && createPortal(
        <div
          className="nav-mobile-full"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="nav-mobile-full-top">
            <Link
              to="/"
              className="nav-mobile-full-brand"
              onClick={() => setMenuOpen(false)}
            >
              Milkshop
            </Link>
            <button
              type="button"
              className="nav-mobile-full-close"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
          </div>

          <ul className="nav-mobile-full-links">
            {navLinks.map((link, i) => {
              const isActive = isNavLinkActive(location.pathname, link.path);
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-mobile-full-link${isActive ? " is-active" : ""}`}
                    style={{ animationDelay: `${0.06 + i * 0.05}s` }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-mobile-full-footer">
            <span className="nav-mobile-full-flag" aria-hidden>🇵🇭</span>
            <span>PH</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
