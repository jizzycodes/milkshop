import { Link } from "react-router-dom";
const logo = "/milkshop-logo-removebg-preview.png";

const navLinks = [
  { label: "Home",      path: "/" },
  { label: "Menu",      path: "/products" },
  { label: "Locations", path: "/locations" },
  { label: "About",     path: "/about" },
  { label: "Franchise", path: "/franchise#inquiry" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/MilkshopPH",
    icon: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/milkshopph",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
      </svg>
    ),
  },
];

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{
      position:   "relative",
      overflow:   "hidden",
      background: "linear-gradient(160deg, #7fa038 0%, #6b8c2e 55%, #5a7626 100%)",
      color:      "#fff",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* top separator */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.22) 70%, transparent)",
      }} />

      {/* ambient orb */}
      <div aria-hidden style={{
        position: "absolute", top: "-60px", right: "-80px",
        width: 280, height: 280, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 2 }}>

        {/* ══ MAIN ROW ══ */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 40,
          padding: "24px 0 16px",
          flexWrap: "wrap",
        }}>

          {/* ── Brand ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 160 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={logo} alt="Milkshop" style={{ width: 22, height: 22, objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>
                  Milkshop
                </div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)", marginTop: 3 }}>
                  秘客侠 · Milk Tea
                </div>
              </div>
            </Link>

            {/* Socials */}
            <div style={{ display: "flex", gap: 7 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 32, height: 32, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.85)",
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    textDecoration: "none",
                    transition: "transform 0.22s ease, background 0.22s ease, border-color 0.22s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Right side: Nav + Contact ── */}
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>

            {/* Navigation */}
            <div>
              <p style={{
                margin: "0 0 10px",
                fontSize: "0.6rem", fontWeight: 800,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
              }}>Navigation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.76)",
                      fontSize: "0.84rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      transition: "color 0.18s ease, transform 0.18s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.76)"; e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p style={{
                margin: "0 0 10px",
                fontSize: "0.6rem", fontWeight: 800,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
              }}>Contact</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { href: "tel:09952908161",              icon: <PhoneIcon />, label: "0995 290 8161" },
                  { href: "mailto:franchise@milkshop.ph", icon: <MailIcon />, label: "franchise@milkshop.ph" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.76)",
                      fontSize: "0.84rem", fontWeight: 500,
                      transition: "color 0.18s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.76)"}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "rgba(255,255,255,0.9)",
                    }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 4,
          padding: "10px 0 16px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.02em" }}>
            © {new Date().getFullYear()} Milkshop Philippines. All rights reserved.
          </span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.03em", fontStyle: "italic" }}>
            Freshly brewed from Taiwan 🧋
          </span>
        </div>

      </div>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 600px) {
          .footer-inner-main {
            flex-direction: column !important;
          }
        }
      `}</style>
    </footer>
  );
}