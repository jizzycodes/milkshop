import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about" },
  { label: "Locations", path: "/locations" },
  { label: "Our Menu",  path: "/products" },
];

const NAV_BREAKPOINT = "860px";

const styles = `
  @keyframes navFade {
    from { opacity: 0; transform: translateY(-16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes menuIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .nav-root {
    animation: navFade 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .nav-inner {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0;
    height: 72px;
    padding: 0 20px;
    padding-top: env(safe-area-inset-top, 0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    box-sizing: border-box;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-inner {
      height: 80px;
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

  /* Mobile-first: hide desktop, show mobile */
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

  .nav-mobile-panel {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 8px;
    padding-bottom: max(8px, env(safe-area-inset-bottom, 0));
    border-top: 1px solid rgba(17, 24, 39, 0.08);
    background: #ffffff;
    box-shadow: 0 12px 32px rgba(10, 20, 5, 0.12);
  }

  .nav-mobile-panel.is-open {
    display: block;
    animation: menuIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-mobile-panel { display: none !important; }
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    height: 48px;
    padding: 0 12px;
    border-radius: 8px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: rgba(17, 24, 39, 0.72);
    border: 1px solid transparent;
    white-space: nowrap;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.28s ease,
      text-shadow 0.28s ease;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-link {
      font-size: 1.28rem;
      padding: 0 14px;
    }
  }

  .nav-link:hover {
    color: #536f09;
    transform: scale(1.06);
    text-shadow:
      0 0 16px rgba(151, 182, 76, 0.4),
      0 0 4px rgba(98, 132, 11, 0.18);
  }

  .nav-link.active {
    color: #62840b;
    text-shadow: 0 0 10px rgba(151, 182, 76, 0.25);
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
    height: 44px;
    width: auto;
    object-fit: contain;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), filter 0.28s ease;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .nav-brand-logo { height: 52px; }
  }

  .nav-brand-wordmark {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: 1.65rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.2;
    white-space: nowrap;
    user-select: none;
    display: inline-block;
    color: #62840b;
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
    .nav-brand-wordmark { font-size: 2.2rem; }
  }

  .nav-brand-link:hover .nav-brand-logo {
    transform: scale(1.08);
    filter: drop-shadow(0 0 12px rgba(151, 182, 76, 0.5));
  }

  .nav-brand-link:hover .nav-brand-wordmark {
    transform: scale(1.05);
    color: #536f09;
    text-shadow:
      0 0 18px rgba(151, 182, 76, 0.45),
      0 0 4px rgba(98, 132, 11, 0.2);
  }

  .nav-menu-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(17, 24, 39, 0.10);
    background: rgba(255, 255, 255, 0.65);
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

  .nav-menu-btn.is-open {
    background: rgba(151, 182, 76, 0.14);
  }

  .mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    padding: 13px 14px;
    border-radius: 12px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: rgba(17, 24, 39, 0.78);
    border: 1px solid transparent;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.28s ease,
      text-shadow 0.28s ease;
    -webkit-tap-highlight-color: transparent;
  }

  @media (min-width: ${NAV_BREAKPOINT}) {
    .mobile-link { font-size: 1.28rem; }
  }

  .mobile-link:hover {
    color: #536f09;
    transform: scale(1.03);
    text-shadow:
      0 0 14px rgba(151, 182, 76, 0.38),
      0 0 4px rgba(98, 132, 11, 0.16);
  }

  .mobile-link.active {
    color: #62840b;
    text-shadow: 0 0 8px rgba(151, 182, 76, 0.22);
  }

  .nav-mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hb-line {
    display: block;
    height: 2px;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.82);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    transform-origin: center;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-brand-link:hover .nav-brand-logo,
    .nav-brand-link:hover .nav-brand-wordmark,
    .nav-link:hover,
    .mobile-link:hover {
      transform: none;
      filter: none;
      text-shadow: none;
    }
    .nav-link.active,
    .mobile-link.active {
      text-shadow: none;
    }
    .nav-root,
    .nav-mobile-panel.is-open {
      animation: none;
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
  const menuRef = useRef(null);

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
    if (!menuOpen) return;
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

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
          background: "#ffffff",
          borderBottom: scrolled
            ? "1px solid rgba(17, 24, 39, 0.10)"
            : "1px solid rgba(151, 182, 76, 0.18)",
          boxShadow: scrolled ? "0 4px 18px rgba(10, 20, 5, 0.08)" : "none",
          transition: "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <nav ref={menuRef} className="nav-root nav-inner">
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
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                className={`nav-menu-btn${menuOpen ? " is-open" : ""}`}
              >
                <span
                  className="hb-line"
                  style={{
                    width: "18px",
                    transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="hb-line"
                  style={{ width: "12px", opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="hb-line"
                  style={{
                    width: "18px",
                    transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                  }}
                />
              </button>
            </div>
          </div>

          <div className={`nav-mobile-panel${menuOpen ? " is-open" : ""}`}>
            <div className="nav-mobile-menu">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(location.pathname, link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mobile-link${isActive ? " active" : ""}`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
