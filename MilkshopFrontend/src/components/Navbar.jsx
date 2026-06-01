import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about" },
  { label: "Locations", path: "/locations" },
  { label: "Our Menu",  path: "/products" },
];

// Navbar spacing — change these values to nudge logo / links
const NAV_BRAND_MARGIN_LEFT  = "100px";
const NAV_LINKS_MARGIN_RIGHT = "100px";

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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 14px;
    border-radius: 8px;
    text-decoration: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.28rem;
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

  .nav-brand-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
    color: inherit;
  }

  .nav-brand-logo {
    display: block;
    object-fit: contain;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), filter 0.28s ease;
  }

  .nav-brand-wordmark {
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
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
      color 0.28s ease,
      font-size 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
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

  @media (prefers-reduced-motion: reduce) {
    .nav-brand-link:hover .nav-brand-logo,
    .nav-brand-link:hover .nav-brand-wordmark,
    .nav-link:hover,
    .mobile-link:hover {
      transform: none;
      filter: none;
      text-shadow: none;
    }
    .nav-link.active {
      text-shadow: none;
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
    font-size: 1.28rem;
    font-weight: 700;
    color: rgba(17, 24, 39, 0.78);
    border: 1px solid transparent;
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.28s ease,
      text-shadow 0.28s ease;
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

  /* scroll listener — rAF-throttled to avoid extra re-renders per tick */
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

  const navHeight = isMobile ? 72 : 80;

  return (
    <>
      <style>{styles}</style>

      <header
        className="ms-site-nav"
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          right:           0,
          zIndex:          1000,
          background:      "#ffffff",
          borderBottom:    scrolled
            ? "1px solid rgba(17, 24, 39, 0.10)"
            : "1px solid rgba(151, 182, 76, 0.18)",
          boxShadow:       scrolled ? "0 4px 18px rgba(10, 20, 5, 0.08)" : "none",
          transition:      "box-shadow 0.25s ease, border-color 0.25s ease",
        }}
      >
        <nav
          ref={menuRef}
          className="nav-root"
          style={{
            position:       "relative",
            height:         navHeight,
            width:          "100%",
            maxWidth:       "100%",
            margin:         0,
            paddingTop:     0,
            paddingBottom:  0,
            paddingLeft:    isMobile ? "20px" : "1in",
            paddingRight:   isMobile ? "20px" : "1in",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "20px",
            boxSizing:      "border-box",
          }}
        >

          {/* ── LOGO ── */}
          <Link
            to="/"
            aria-label="Milkshop home"
            className="nav-brand-link"
            style={{ marginLeft: NAV_BRAND_MARGIN_LEFT }}
          >
            <img
              src="/milkshop-logo-removebg-preview.png"
              alt=""
              aria-hidden
              className="nav-brand-logo"
              style={{
                height: isMobile ? 44 : 52,
                width: "auto",
              }}
            />
            <span
              className="nav-brand-wordmark"
              style={{
                fontSize: isMobile ? "1.75rem" : "2.2rem",
              }}
            >
              Milkshop
            </span>
          </Link>

          {/* ── RIGHT: links + CTA (desktop) / CTA + menu (mobile) ── */}
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        isMobile ? 8 : 10,
              flexShrink: 0,
            }}
          >
            {!isMobile && (
              <ul
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        12,
                  margin:     0,
                  marginRight: NAV_LINKS_MARGIN_RIGHT,
                  padding:    0,
                  listStyle:  "none",
                }}
              >
                {navLinks.map((link) => {
                  const isActive =
                    link.path === "/"
                      ? location.pathname === "/"
                      : location.pathname === link.path ||
                        location.pathname.startsWith(`${link.path}/`);
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
            )}

       

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
              position:    "absolute",
              top:           "100%",
              left:          0,
              right:         0,
              padding:       "8px",
              borderTop:     "1px solid rgba(17,24,39,0.08)",
              background:    "#ffffff",
              boxShadow:     "0 12px 32px rgba(10,20,5,0.12)",
              animation:     "menuIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
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