import { Link } from "react-router-dom";
import logo from "../assets/milkshop-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/products" },
  { label: "Locations", path: "/locations" },
  { label: "About", path: "/about" },
  { label: "Franchise", path: "/franchise#inquiry" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/MilkshopPH",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/milkshopph",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@milkshopph",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(160deg, #87a63c 0%, #97b64c 40%, #7fa040 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Decorative watermark character */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-2rem",
          bottom: "-2rem",
          fontSize: "16rem",
          fontWeight: 900,
          lineHeight: 1,
          color: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
          userSelect: "none",
          fontFamily: "serif",
        }}
      >
        侠
      </div>

      {/* Subtle top edge highlight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background: "rgba(255,255,255,0.25)",
        }}
      />

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "48px 24px 0",
        }}
      >

        {/* TOP SECTION — stacked on mobile, row on desktop */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
          className="footer-top"
        >

          {/* ── BRAND BLOCK ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={logo}
                  alt="Milkshop logo"
                  style={{ width: 30, height: 30, objectFit: "contain" }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    color: "#fff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    margin: 0,
                    fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
                  }}
                >
                  Milkshop
                </p>
                <p
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.75)",
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  秘客侠
                </p>
              </div>
            </Link>

            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.7,
                maxWidth: 320,
                margin: 0,
                fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
              }}
            >
              The first Taiwanese Popping Boba brand in the Philippines.
              Crafted with real milk and authentic recipes.
            </p>

            {/* SOCIALS */}
            <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    background: "rgba(255,255,255,0.1)",
                    transition: "background 0.2s, border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── NAV + CONTACT ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* NAV */}
            <div>
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 14,
                  margin: "0 0 14px",
                }}
              >
                Navigate
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px 20px",
                }}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      textDecoration: "none",
                      fontSize: "0.88rem",
                      fontWeight: 500,
                      fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  margin: "0 0 14px",
                }}
              >
                Get in Touch
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a
                  href="tel:09952908161"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    📞
                  </span>
                  0995 290 8161
                </a>
                <a
                  href="mailto:franchise@milkshop.ph"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                    fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    📧
                  </span>
                  franchise@milkshop.ph
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 18,
            paddingBottom: 20,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            © {new Date().getFullYear()} Milkshop 秘客侠 Philippines
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
          </div>
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        @media (min-width: 768px) {
          .footer-top {
            flex-direction: row !important;
            justify-content: space-between;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}