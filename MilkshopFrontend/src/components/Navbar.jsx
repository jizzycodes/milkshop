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

  /* Same motion as About hero “Taiwan.” shimmer */
@keyframes navWordmarkShimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 240% center;
  }
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
    height: 38px;
    padding: 0 15px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
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

  /* ── Gold CTA ── */
  .cta-btn {
    height: 42px;
    padding: 0 20px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.86rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    color: #1a1000;
    background: linear-gradient(135deg, #f5bc35, #E8A020, #d09018);
    border: 1px solid rgba(255, 200, 70, 0.45);
    box-shadow: 0 4px 18px rgba(232, 160, 32, 0.5), inset 0 1px 0 rgba(255,225,100,0.5);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, filter 0.25s ease;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cta-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 55%);
    border-radius: inherit;
    pointer-events: none;
  }

  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 26px rgba(232,160,32,0.62), inset 0 1px 0 rgba(255,225,100,0.5);
    filter: brightness(1.05);
  }

  .cta-btn:active {
    transform: scale(0.98);
  }

  .cta-arrow {
    font-style: normal;
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .cta-btn:hover .cta-arrow {
    transform: translateX(3px);
  }

  .nav-brand-wordmark {
  font-family: 'DM Sans', sans-serif;
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.92;
  white-space: nowrap;
  user-select: none;
  display: inline-block;
  position: relative;

 background: linear-gradient(
  135deg,
  #5E7E1F 0%,
  #88B04B 50%,
  #D6A23D 100%
);

  background-size: 240% auto;

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
  color: transparent;

  animation: navWordmarkShimmer 7s cubic-bezier(0.4,0,0.2,1) infinite;

  filter:
    drop-shadow(0 2px 10px rgba(127,163,58,0.12))
    drop-shadow(0 1px 2px rgba(0,0,0,0.08));

  transition:
    font-size 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.25s ease,
    filter 0.25s ease;

  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
}

.nav-brand-wordmark:hover {
  transform: translateY(-1px);
  filter:
    drop-shadow(0 4px 16px rgba(127,163,58,0.18))
    drop-shadow(0 2px 4px rgba(0,0,0,0.10));
}

  @media (prefers-reduced-motion: reduce) {
    .nav-brand-wordmark {
      animation: none;
      background-position: center;
    }
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
    font-size: 0.95rem;
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
              ? (scrolled ? "58px" : "64px")
              : (scrolled ? "68px" : "76px"),
            padding:        isMobile ? "0 12px" : "0 24px",
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
                height:     isMobile ? (scrolled ? "30px" : "34px") : (scrolled ? "42px" : "48px"),
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
                  ? (scrolled ? "1.25rem" : "1.38rem")
                  : (scrolled ? "1.6rem" : "1.78rem"),
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
              gap:       "2px",
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
              <Link to="/franchise#inquiry" className="cta-btn">
                Franchise Now
                <em className="cta-arrow">→</em>
              </Link>
            )}

            {/* Mobile: CTA pill (small) + hamburger */}
            {isMobile && (
              <>
                <Link
                  to="/franchise#inquiry"
                  className="cta-btn"
                  style={{ height: "36px", padding: "0 14px", fontSize: "0.78rem" }}
                >
                  Franchise
                  <em className="cta-arrow">→</em>
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