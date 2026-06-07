import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about" },
  { label: "Locations", path: "/locations" },
  { label: "Products",  path: "/products" },
];

const NAV_DESKTOP_MIN = "1024px";
const NAV_COMPACT_MAX = "1440px";
const NAV_LARGE_MIN = "1441px";
const NAV_XL_MIN = "1600px";

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
    margin: 0 auto;
    height: clamp(56px, 14vw, 64px);
    padding: 0 clamp(12px, 3vw, 16px);
    padding-top: env(safe-area-inset-top, 0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(6px, 1.5vw, 12px);
    box-sizing: border-box;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) and (max-width: ${NAV_COMPACT_MAX}) {
    .nav-inner {
      height: clamp(60px, 6.5vw, 68px);
      padding-left: clamp(14px, 2.5vw, 28px);
      padding-right: clamp(14px, 2.5vw, 28px);
      gap: clamp(6px, 1vw, 10px);
    }
  }

  @media (min-width: ${NAV_LARGE_MIN}) {
    .nav-inner {
      height: clamp(72px, 6vw, 84px);
      padding-left: clamp(20px, 3.5vw, 56px);
      padding-right: clamp(20px, 3.5vw, 56px);
      gap: clamp(10px, 1.2vw, 16px);
    }
  }

  @media (min-width: ${NAV_XL_MIN}) {
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
    gap: 6px;
    flex-shrink: 1;
    min-width: 0;
    justify-content: flex-end;
  }

  .nav-desktop-links {
    display: none;
    align-items: center;
    gap: clamp(2px, 0.6vw, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
    flex-shrink: 1;
    min-width: 0;
    justify-content: flex-end;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) {
    .nav-desktop-links {
      display: flex;
    }
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) and (max-width: ${NAV_COMPACT_MAX}) {
    .nav-desktop-links {
      gap: clamp(2px, 0.5vw, 6px);
    }
  }

  @media (min-width: ${NAV_LARGE_MIN}) {
    .nav-desktop-links {
      gap: clamp(6px, 0.8vw, 12px);
    }
  }

  .nav-mobile-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) {
    .nav-mobile-actions { display: none; }
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    height: auto;
    padding: 0 clamp(4px, 0.8vw, 8px);
    border-radius: 8px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(0.72rem, 1.4vw, 0.88rem);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: rgba(24, 33, 15, 0.78);
    border: 1px solid transparent;
    white-space: nowrap;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.28s ease,
      text-shadow 0.28s ease;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) and (max-width: ${NAV_COMPACT_MAX}) {
    .nav-link {
      min-height: 38px;
      padding: 0 clamp(5px, 0.9vw, 10px);
      font-size: clamp(0.75rem, 1.25vw, 0.9rem);
    }
  }

  @media (min-width: ${NAV_LARGE_MIN}) {
    .nav-link {
      min-height: 46px;
      padding: 0 clamp(8px, 1vw, 14px);
      font-size: clamp(0.88rem, 1vw, 1.12rem);
    }
  }

  @media (min-width: ${NAV_XL_MIN}) {
    .nav-link {
      min-height: 51px;
      height: 55px;
      padding: 0 16px;
      font-size: clamp(1.1rem, 1.2vw, 1.47rem);
    }
  }

  .nav-link:hover {
    color: ${NAV_GREEN_DARK};
    transform: scale(1.06);
    text-shadow: none;
  }

  .nav-link.active {
    color: ${NAV_GREEN_DARK};
    text-shadow: none;
  }

  .nav-brand-link {
    display: flex;
    align-items: center;
    gap: clamp(6px, 1vw, 10px);
    text-decoration: none;
    flex-shrink: 0;
    min-width: 0;
    color: inherit;
    margin-left: 0;
  }

  .nav-brand-logo {
    display: block;
    height: clamp(32px, 8vw, 38px);
    width: auto;
    object-fit: contain;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), filter 0.28s ease;
    flex-shrink: 0;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) and (max-width: ${NAV_COMPACT_MAX}) {
    .nav-brand-logo {
      height: clamp(34px, 3.8vw, 42px);
    }
  }

  @media (min-width: ${NAV_LARGE_MIN}) {
    .nav-brand-logo {
      height: clamp(44px, 4vw, 52px);
    }
  }

  @media (min-width: ${NAV_XL_MIN}) {
    .nav-brand-logo { height: 60px; }
  }

  .nav-brand-wordmark {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: clamp(1.15rem, 4.5vw, 1.5rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.2;
    white-space: nowrap;
    user-select: none;
    display: inline-block;
    color: ${NAV_GREEN_DARK};
    -webkit-font-smoothing: antialiased;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) and (max-width: ${NAV_COMPACT_MAX}) {
    .nav-brand-wordmark {
      font-size: clamp(1.05rem, 2vw, 1.35rem);
    }
  }

  @media (min-width: ${NAV_LARGE_MIN}) {
    .nav-brand-wordmark {
      font-size: clamp(1.35rem, 2vw, 2rem);
    }
  }

  @media (min-width: ${NAV_XL_MIN}) {
    .nav-brand-wordmark { font-size: clamp(2rem, 2.2vw, 2.53rem); }
  }

  .nav-brand-link:hover .nav-brand-logo {
    transform: scale(1.08);
    filter: drop-shadow(0 0 8px rgba(98, 132, 11, 0.25));
  }

  .nav-brand-link:hover .nav-brand-wordmark {
    transform: scale(1.05);
    color: ${NAV_GREEN_DARK};
    text-shadow: none;
  }

  .nav-menu-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(98, 132, 11, 0.28);
    background: rgba(151, 182, 76, 0.08);
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
    background: ${NAV_GREEN_DARK};
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    transform-origin: center;
    pointer-events: none;
  }

  /* ── Full-screen mobile menu (Pickup-style) ── */
  .nav-mobile-full {
    position: fixed;
    inset: 0;
    z-index: 10050;
    background: #ffffff;
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
    font-size: 1.65rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${NAV_GREEN_DARK};
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-mobile-full-close {
    width: 44px;
    height: 44px;
    border: none;
    background: none;
    color: ${NAV_GREEN_DARK};
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
    color: ${NAV_GREEN_DARK};
    text-decoration: none;
    opacity: 0;
    animation: navLinkIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.2s ease, opacity 0.2s ease;
  }

  .nav-mobile-full-link:active {
    color: ${NAV_GREEN};
    opacity: 0.85;
  }

  .nav-mobile-full-link.is-active {
    font-weight: 700;
    color: ${NAV_GREEN_DARK};
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
    color: ${NAV_GREEN_DARK};
  }

  .nav-mobile-full-flag {
    font-size: 1.1rem;
    line-height: 1;
  }

  @media (min-width: ${NAV_DESKTOP_MIN}) {
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
    const mq = window.matchMedia(`(min-width: ${NAV_DESKTOP_MIN})`);
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
          background: "#ffffff",
          borderBottom: scrolled
            ? "1px solid rgba(151, 182, 76, 0.22)"
            : "1px solid rgba(151, 182, 76, 0.12)",
          boxShadow: scrolled ? "0 4px 18px rgba(98, 132, 11, 0.08)" : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <nav className="nav-root nav-inner">
          <Link to="/" aria-label="Milkshop home" className="nav-brand-link">
            <img
              src="/milkshop-logo-removebg-preview.webp"
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
