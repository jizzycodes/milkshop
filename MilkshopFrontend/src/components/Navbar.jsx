import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about" },
  { label: "Locations", path: "/locations" },
  { label: "Our Menu",  path: "/products" },
];

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

  /* ── Desktop nav links ── */
  .nav-link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    padding: 0 20px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: rgba(17, 24, 39, 0.72);
    border: 1px solid transparent;
    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #111827;
    background: rgba(151, 182, 76, 0.12);
    border-color: rgba(151, 182, 76, 0.22);
  }

  .nav-link.active {
    color: #111827;
    background: rgba(151, 182, 76, 0.16);
    border-color: rgba(151, 182, 76, 0.30);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 18px rgba(10, 20, 5, 0.08);
  }

  /* Active underline dot */
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 2px;
    border-radius: 999px;
    background: #b7cd7f;
  }

  /* Franchise CTA — flat pill (like Apply for Franchise ref), solid orange */
  .franchise-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    padding: 0 28px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #ffffff;
    background: #E8A020;
    border: none;
    box-shadow: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.2s ease;
  }

  .franchise-cta:hover {
    background: #d49218;
    color: #ffffff;
  }

  .franchise-cta:active {
    background: #c28415;
  }

  .franchise-cta-arrow {
    font-style: normal;
    font-weight: 400;
    line-height: 1;
  }

  .nav-brand-wordmark {
    font-family: 'DM Sans', sans-serif;
    font-weight: 900;
    letter-spacing: -0.05em;
    line-height: 0.92;
    white-space: nowrap;
    user-select: none;
    display: inline-block;
    color: #62840b;
    transition: font-size 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Mobile menu links ── */
  .mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 14px;
    border-radius: 12px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: rgba(17, 24, 39, 0.78);
    border: 1px solid transparent;
    transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  }

  .mobile-link:hover {
    background: rgba(151, 182, 76, 0.12);
    border-color: rgba(151, 182, 76, 0.22);
    color: #111827;
  }

  .mobile-link.active {
    background: rgba(151, 182, 76, 0.16);
    border-color: rgba(151, 182, 76, 0.30);
    color: #111827;
  }

  .mobile-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #97b64c;
    opacity: 0;
    flex-shrink: 0;
  }

  .mobile-link.active .mobile-dot { opacity: 1; }

  /* ── Hamburger ── */
  .hb-line {
    display: block;
    height: 2px;
    border-radius: 999px;
    background: rgba(17,24,39,0.82);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease;
    transform-origin: center;
    pointer-events: none;
  }
`;

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isMobile,  setIsMobile]  = useState(
    () => typeof window !== "undefined" ? window.innerWidth < 860 : false
  );

  const location = useLocation();
  const menuRef  = useRef(null);

  /* scroll listener */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close on route change */
  useEffect(() => { setMenuOpen(false); }, [location]);

  /* close on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [menuOpen]);

  /* resize */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Minimal light glass navbar */
  const navBg = scrolled
    ? "rgba(255, 255, 255, 0.92)"
    : "rgba(255, 255, 255, 0.72)";

  const navBorder = scrolled
    ? "1px solid rgba(17, 24, 39, 0.10)"
    : "1px solid rgba(17, 24, 39, 0.08)";

  const navShadow = scrolled
    ? "0 14px 50px rgba(10, 20, 5, 0.14), inset 0 1px 0 rgba(255,255,255,0.85)"
    : "0 10px 34px rgba(10, 20, 5, 0.10), inset 0 1px 0 rgba(255,255,255,0.70)";

  return (
    <>
      <style>{styles}</style>

      <header style={{
        position:             "fixed",
        top:                  isMobile ? "10px" : "16px",
        left:                 "50%",
        transform:            "translateX(-50%)",
        zIndex:               1000,
        width:                isMobile ? "calc(100% - 20px)" : "calc(100% - 48px)",
        maxWidth:             "1360px",
        borderRadius:         isMobile ? "18px" : "22px",
        border:               navBorder,
        background:           navBg,
        backdropFilter:       "blur(10px) saturate(130%)",
        WebkitBackdropFilter: "blur(10px) saturate(130%)",
        boxShadow:            navShadow,
        transition:           "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
      }}>
        <nav
          ref={menuRef}
          className="nav-root"
          style={{
            position:       "relative",
            height:         isMobile
              ? (scrolled ? "66px" : "72px")
              : (scrolled ? "80px" : "88px"),
            padding:        isMobile ? "0 14px" : "0 28px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "12px",
            transition:     "height 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >

          {/* ── LOGO ── */}
          <Link
            to="/"
            aria-label="Milkshop home"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
          >
            <img
              src="/milkshop-logo-removebg-preview.png"
              alt=""
              aria-hidden
              style={{
                height:     isMobile ? (scrolled ? "36px" : "40px") : (scrolled ? "48px" : "54px"),
                width:      "auto",
                objectFit:  "contain",
                transition: "height 0.35s cubic-bezier(0.16,1,0.3,1)",
                filter:     "drop-shadow(0 1px 6px rgba(0,0,0,0.12))",
              }}
            />
            <span
              className="nav-brand-wordmark"
              style={{
                fontSize: isMobile
                  ? (scrolled ? "1.55rem" : "1.7rem")
                  : (scrolled ? "2rem" : "2.25rem"),
              }}
            >
              Milkshop
            </span>
          </Link>

          {/* ── DESKTOP LINKS (centered) ── */}
          {!isMobile && (
            <ul style={{
              display:   "flex",
              alignItems:"center",
              gap:       "4px",
              position:  "absolute",
              left:      "50%",
              transform: "translateX(-50%)",
              margin: 0, padding: 0, listStyle: "none",
            }}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link${location.pathname === link.path ? " active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* ── RIGHT ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

            {/* Desktop CTA */}
            {!isMobile && (
              <Link to="/franchise#inquiry" className="franchise-cta">
                Franchise Now
                <span className="franchise-cta-arrow" aria-hidden>→</span>
              </Link>
            )}

            {/* Mobile: CTA pill (small) + hamburger */}
            {isMobile && (
              <>
                <Link
                  to="/franchise#inquiry"
                  className="franchise-cta"
                  style={{ height: "42px", padding: "0 18px", fontSize: "0.9rem", gap: "6px" }}
                >
                  Franchise
                  <span className="franchise-cta-arrow" aria-hidden>→</span>
                </Link>

                <button
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                  style={{
                    width:          "40px",
                    height:         "40px",
                    borderRadius:   "12px",
                    border:         "1px solid rgba(17,24,39,0.10)",
                    background:     menuOpen ? "rgba(151,182,76,0.14)" : "rgba(255,255,255,0.65)",
                    display:        "flex",
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "5px",
                    cursor:         "pointer",
                    padding:        0,
                    flexShrink:     0,
                    transition:     "background 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  <span className="hb-line" style={{
                    width:     "18px",
                    transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                  }} />
                  <span className="hb-line" style={{
                    width:   "12px",
                    opacity: menuOpen ? 0 : 1,
                  }} />
                  <span className="hb-line" style={{
                    width:     "18px",
                    transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                  }} />
                </button>
              </>
            )}
          </div>

          {/* ── MOBILE DROPDOWN ── */}
          {isMobile && menuOpen && (
            <div style={{
              position:       "absolute",
              top:            "calc(100% + 8px)",
              left:           0,
              right:          0,
              padding:        "8px",
              borderRadius:   "20px",
              border:         "1px solid rgba(17,24,39,0.10)",
              background:     "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(28px) saturate(160%)",
              boxShadow:      "0 24px 60px rgba(10,20,5,0.16), inset 0 1px 0 rgba(255,255,255,0.75)",
              animation:      "menuIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`mobile-link${isActive ? " active" : ""}`}
                    >
                      <span>{link.label}</span>
                      <span className="mobile-dot" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
} 