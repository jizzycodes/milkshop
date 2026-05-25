import { Link } from "react-router-dom";

const logo = "/milkshop-logo-removebg-preview.png";

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
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/milkshopph",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@milkshopph",
    icon: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #f7faef 0%, #eef6dc 100%)",
        borderTop: "1px solid rgba(98, 132, 11, 0.15)",
        color: "#18210f",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 700px) {
          .footer-row {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .footer-cols {
            gap: 36px !important;
          }
        }
        .footer-link:hover { color: #62840b !important; }
        .footer-social:hover {
          background: #62840b !important;
          color: #fff !important;
          border-color: #62840b !important;
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 0" }}>
        <div
          className="footer-row"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
            paddingBottom: 28,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img
                src={logo}
                alt="Milkshop"
                style={{ width: 44, height: 44, objectFit: "contain" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#18210f",
                    lineHeight: 1,
                  }}
                >
                  Milkshop
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#62840b",
                  }}
                >
                  秘客侠 · Milk Tea
                </div>
              </div>
            </Link>

            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#62840b",
                    background: "#fff",
                    border: "1px solid rgba(98, 132, 11, 0.2)",
                    textDecoration: "none",
                    transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav + Contact */}
          <div
            className="footer-cols"
            style={{ display: "flex", gap: 56, flexWrap: "wrap" }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#97b64c",
                }}
              >
                Navigation
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="footer-link"
                    style={{
                      textDecoration: "none",
                      color: "#4a5840",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      transition: "color 0.18s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#97b64c",
                }}
              >
                Contact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href="tel:09952908161"
                  className="footer-link"
                  style={{
                    textDecoration: "none",
                    color: "#4a5840",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    transition: "color 0.18s ease",
                  }}
                >
                  0995 290 8161
                </a>
                <a
                  href="mailto:franchise@milkshop.ph"
                  className="footer-link"
                  style={{
                    textDecoration: "none",
                    color: "#4a5840",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    transition: "color 0.18s ease",
                  }}
                >
                  franchise@milkshop.ph
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          padding: "14px 24px",
          background: "#62840b",
          color: "rgba(255,255,255,0.9)",
          fontSize: "0.72rem",
          fontWeight: 600,
        }}
      >
        <span>© {new Date().getFullYear()} Milkshop Philippines. All rights reserved.</span>
        <span style={{ fontStyle: "italic", opacity: 0.85 }}>Freshly brewed from Taiwan</span>
      </div>
    </footer>
  );
}
