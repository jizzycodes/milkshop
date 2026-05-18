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
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(160deg, #97b64c 0%, #84a23d 40%, #62840b 100%)",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Top highlight line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 35%, rgba(183,205,127,0.6) 65%, transparent)",
      }} />

      {/* Subtle dot grid texture */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 72%)",
      }} />

      {/* Ambient orbs */}
      <div aria-hidden style={{
        position: "absolute", top: "-50%", right: "-10%",
        width: "min(420px, 60vw)", height: "min(420px, 60vw)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,205,127,0.25) 0%, transparent 68%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "-40%", left: "-8%",
        width: "min(320px, 50vw)", height: "min(320px, 50vw)", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(98,132,11,0.3) 0%, transparent 65%)",
        filter: "blur(36px)", pointerEvents: "none",
      }} />

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 600px) {
          .footer-main-row {
            flex-direction: column !important;
            gap: 28px !important;
          }
          .footer-right-cols {
            gap: 32px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 28px", position: "relative", zIndex: 2 }}>

        {/* ══ MAIN ROW ══ */}
        <div
          className="footer-main-row"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 40,
            padding: "36px 0 24px",
            flexWrap: "wrap",
          }}
        >

          {/* ── Brand ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 170 }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14, flexShrink: 0,
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}>
                <img src={logo} alt="Milkshop" style={{ width: 26, height: 26, objectFit: "contain" }} />
              </div>
              <div>
                <div style={{
                  fontSize: "1.1rem", fontWeight: 900,
                  letterSpacing: "-0.03em", color: "#fff", lineHeight: 1,
                  textShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}>
                  Milkshop
                </div>
                <div style={{
                  fontSize: "0.58rem", letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.65)",
                  marginTop: 3,
                }}>
                  秘客侠 · Milk Tea
                </div>
              </div>
            </Link>

            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff",
                    background: "rgba(255,255,255,0.15)",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    transition: "transform 0.22s ease, background 0.22s ease, border-color 0.22s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.28)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Right side: Nav + Contact ── */}
          <div className="footer-right-cols" style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>

            {/* Navigation */}
            <div>
              <p style={{
                margin: "0 0 12px",
                fontSize: "0.58rem", fontWeight: 800,
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>Navigation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      display: "inline-block",
                      transition: "color 0.18s ease, transform 0.18s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.82)"; e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p style={{
                margin: "0 0 12px",
                fontSize: "0.58rem", fontWeight: 800,
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}>Contact</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { href: "tel:09952908161",              icon: <PhoneIcon />, label: "0995 290 8161" },
                  { href: "mailto:franchise@milkshop.ph", icon: <MailIcon />, label: "franchise@milkshop.ph" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 9,
                      textDecoration: "none",
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.875rem", fontWeight: 500,
                      transition: "color 0.18s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.82)"}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                      background: "rgba(255,255,255,0.15)",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff",
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
          flexWrap: "wrap", gap: 6,
          padding: "12px 0 20px",
          borderTop: "1px solid rgba(255,255,255,0.18)",
        }}>
          <span style={{
            fontSize: "0.7rem", color: "rgba(255,255,255,0.52)",
            letterSpacing: "0.02em",
          }}>
            © {new Date().getFullYear()} Milkshop Philippines. All rights reserved.
          </span>
          <span style={{
            fontSize: "0.7rem", color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.03em", fontStyle: "italic",
          }}>
            Freshly brewed from Taiwan 🧋
          </span>
        </div>

      </div>
    </footer>
  );
}