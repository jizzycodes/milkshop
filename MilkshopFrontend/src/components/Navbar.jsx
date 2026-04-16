import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home",      path: "/"          },
  { label: "Franchise", path: "/franchise" },
  { label: "About",     path: "/about"     },
  { label: "Locations", path: "/locations" },
  { label: "Our Menu",  path: "/products"  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=DM+Mono:wght@700&display=swap');

  @keyframes navSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mobileMenuIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes ctaShine {
    0%   { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(250%) skewX(-15deg); }
  }

  .nav-root {
    animation: navSlideDown 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* ── Desktop nav link ── */
  .nav-link-v2 {
    position: relative;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #4a5a30;
    text-decoration: none;
    padding: 6px 0;
    transition: color 0.2s ease;
    white-space: nowrap;
  }
  .nav-link-v2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #62840b, #97b64c);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .nav-link-v2:hover { color: #1e1e1e; }
  .nav-link-v2:hover::after { transform: scaleX(1); }
  .nav-link-v2.active { color: #62840b; }
  .nav-link-v2.active::after { transform: scaleX(1); }

  /* ── CTA button ── */
  .cta-btn-v2 {
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #fff;
    text-decoration: none;
    padding: 13px 26px;
    border-radius: 100px;
    background: linear-gradient(135deg, #E8A020 0%, #CF8E18 100%);
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(232,160,32,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.25s ease;
  }
  .cta-btn-v2::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 40%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
    transform: translateX(-100%) skewX(-15deg);
  }
  .cta-btn-v2:hover::before {
    animation: ctaShine 0.55s ease forwards;
  }
  .cta-btn-v2:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(232,160,32,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .cta-btn-v2:active { transform: translateY(0) scale(0.97); }

  /* ── Mobile link ── */
  .mobile-link-v2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.04rem;
    font-weight: 700;
    color: #4a5a30;
    text-decoration: none;
    padding: 15px 18px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.18s ease, color 0.18s ease;
    letter-spacing: 0.005em;
  }
  .mobile-link-v2:hover { background: rgba(151,182,76,0.1); color: #1e1e1e; }
  .mobile-link-v2.active {
    background: linear-gradient(135deg, rgba(151,182,76,0.15), rgba(98,132,11,0.08));
    color: #62840b;
  }

  /* ── Hamburger ── */
  .hb-line {
    display: block;
    width: 22px;
    height: 2px;
    background: #2a3a18;
    border-radius: 4px;
    transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease;
    transform-origin: center;
  }
`;

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const location = useLocation();
  const menuRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          // Subtle green-tinted top border glow when scrolled
          borderBottom: scrolled
            ? "1px solid rgba(151,182,76,0.22)"
            : "1px solid transparent",
          transition: "border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease",
          background: scrolled
            ? "rgba(255,255,255,0.88)"
            : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(98,132,11,0.10), 0 1px 0 rgba(151,182,76,0.08)"
            : "none",
        }}
      >
        {/* Top green accent line */}
        <div style={{
          height: "3px",
          background: "linear-gradient(90deg, #62840b 0%, #97b64c 40%, #b7cd7f 70%, #97b64c 100%)",
          opacity: scrolled ? 1 : 0.7,
          transition: "opacity 0.4s ease",
        }} />

        <nav
          ref={menuRef}
          className="nav-root"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: isMobile ? "0 14px" : "0 40px",
            height: isMobile ? (scrolled ? "60px" : "66px") : (scrolled ? "68px" : "78px"),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "height 0.35s cubic-bezier(0.16,1,0.3,1)",
            position: "relative",
          }}
        >
          {/* ── LOGO — maximized ── */}
          <Link
            to="/"
            aria-label="Milkshop home"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              textDecoration: "none",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.82"; e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <img
              src="/logo-landscape.png"
              alt="Milkshop"
              style={{
                height: isMobile ? (scrolled ? "34px" : "38px") : (scrolled ? "44px" : "52px"),
                width: "auto",
                objectFit: "contain",
                display: "block",
                transition: "height 0.35s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </Link>

          {/* ── DESKTOP LINKS — centered, larger ── */}
          <ul
            style={{
              display: isMobile ? "none" : "flex",
              gap: "36px",
              listStyle: "none",
              margin: 0, padding: 0,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nav-link-v2 ${isActive ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── RIGHT SIDE ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>

            {/* Desktop CTA */}
            {!isMobile && (
              <Link
                to="/franchise#inquiry"
                className="cta-btn-v2"
              >
                <span>Franchise Now</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.9, fontWeight: 900 }}>→</span>
              </Link>
            )}

            {/* ── Hamburger ── */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
                style={{
                  width: "44px", height: "44px",
                  border: `1.5px solid ${menuOpen ? "rgba(151,182,76,0.5)" : "rgba(151,182,76,0.25)"}`,
                  cursor: "pointer",
                  background: menuOpen
                    ? "linear-gradient(135deg, rgba(151,182,76,0.15), rgba(98,132,11,0.08))"
                    : "rgba(255,255,255,0.5)",
                  borderRadius: "14px",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "5px",
                  transition: "all 0.25s ease",
                  flexShrink: 0,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="hb-line" style={{
                  transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
                }} />
                <span className="hb-line" style={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? "22px" : "15px" }} />
                <span className="hb-line" style={{
                  transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
                }} />
              </button>
            )}
          </div>

          {/* ── MOBILE DROPDOWN ── */}
          {isMobile && menuOpen && (
            <div
              className="mobile-menu-v2"
              style={{
                animation: "mobileMenuIn 0.32s cubic-bezier(0.16,1,0.3,1) forwards",
                position: "absolute",
                top: "calc(100% + 10px)",
                left: "16px", right: "16px",
                padding: "10px",
                zIndex: 100,
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                border: "1px solid rgba(151,182,76,0.28)",
                borderRadius: "24px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(98,132,11,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Green top accent line inside mobile menu */}
              <div style={{
                height: "2px",
                background: "linear-gradient(90deg, #62840b, #97b64c, #b7cd7f)",
                borderRadius: "2px",
                marginBottom: "8px",
              }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`mobile-link-v2 ${isActive ? "active" : ""}`}
                    >
                      {link.label}
                      {isActive && (
                        <span style={{
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: "linear-gradient(135deg, #97b64c, #62840b)",
                          display: "block", flexShrink: 0,
                          boxShadow: "0 0 8px rgba(151,182,76,0.6)",
                        }} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <div style={{
                padding: "10px 0 2px",
                marginTop: "8px",
                borderTop: "1px solid rgba(151,182,76,0.15)",
              }}>
                <Link
                  to="/franchise#inquiry"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "linear-gradient(135deg, #E8A020 0%, #CF8E18 100%)",
                    color: "#fff", textDecoration: "none",
                    padding: "18px 22px", borderRadius: "18px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800, fontSize: "0.92rem",
                    boxShadow: "0 8px 24px rgba(232,160,32,0.38), inset 0 1px 0 rgba(255,255,255,0.2)",
                    letterSpacing: "0.01em",
                  }}
                >
                  <div>
                    <div>Franchise Now →</div>
                    <div style={{
                      fontSize: "0.74rem", fontWeight: 500,
                      color: "rgba(255,255,255,0.78)", marginTop: "4px",
                    }}>
                      ROI in 12–18 months · Full support
                    </div>
                  </div>
                  <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>🧋</span>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}