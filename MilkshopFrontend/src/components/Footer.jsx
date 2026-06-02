import { Link } from "react-router-dom";
import FranchiseInquiryTrigger from "./FranchiseInquiryTrigger";

const logo = "/milkshop-logo-removebg-preview.png";

const FOOTER_BG = "#97b64c";
const FOOTER_TEXT = "#ffffff";
const FOOTER_TEXT_SOFT = "rgba(255,255,255,0.9)";
const FOOTER_TEXT_MUTED = "rgba(255,255,255,0.78)";
const FOOTER_GREEN_DARK = "#62840b";
const FOOTER_GREEN_LIGHT = "#b7cd7f";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/products" },
  { label: "Locations", path: "/locations" },
  { label: "About", path: "/about" },
  { label: "Franchise", path: "/franchise", inquiry: true },
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
        background: FOOTER_BG,
        color: FOOTER_TEXT,
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .footer-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 20px;
          padding-bottom: env(safe-area-inset-bottom, 0);
          position: relative;
          z-index: 1;
          box-sizing: border-box;
          width: 100%;
        }
        @media (min-width: 768px) {
          .footer-inner { padding-left: 32px; padding-right: 32px; }
        }
        @media (min-width: 1024px) {
          .footer-inner { padding-left: 48px; padding-right: 48px; }
        }

        .footer-watermark {
          position: absolute;
          right: -60px;
          bottom: -24px;
          width: 180px;
          opacity: 0.12;
          filter: brightness(0) invert(1);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
        @media (min-width: 521px) {
          .footer-watermark { right: -40px; width: 220px; }
        }
        @media (min-width: 861px) {
          .footer-watermark { width: 260px; bottom: -20px; }
        }

        .footer-cta-section {
          border-bottom: 1px solid rgba(255,255,255,0.22);
          padding: 40px 0 36px;
        }
        @media (min-width: 861px) {
          .footer-cta-section { padding: 52px 0 44px; }
        }

        .footer-main {
          padding: 36px 0 28px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
          border-bottom: 1px solid rgba(255,255,255,0.22);
        }
        @media (min-width: 521px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
        @media (min-width: 861px) {
          .footer-main {
            grid-template-columns: 1.4fr 1fr 1fr 1fr;
            gap: 40px;
            padding: 44px 0 36px;
          }
        }

        .footer-col-label {
          font-size: 0.58rem;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: ${FOOTER_TEXT};
          margin: 0 0 14px;
        }

        .footer-nav-link {
          display: block;
          text-decoration: none;
          color: ${FOOTER_TEXT_SOFT};
          font-size: 0.88rem;
          font-weight: 600;
          transition: color 0.18s ease, transform 0.18s ease;
          margin-bottom: 9px;
          padding: 4px 0;
        }
        button.footer-nav-link {
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: inherit;
          min-height: 32px;
          -webkit-tap-highlight-color: transparent;
        }
        .footer-nav-link:hover {
          color: ${FOOTER_TEXT};
          transform: translateX(3px);
        }

        .footer-contact-link {
          display: block;
          text-decoration: none;
          color: ${FOOTER_TEXT_SOFT};
          font-size: 0.85rem;
          font-weight: 600;
          transition: color 0.18s ease;
          margin-bottom: 9px;
          word-break: break-all;
        }
        .footer-contact-link:hover { color: ${FOOTER_TEXT}; }

        .footer-follow-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: ${FOOTER_TEXT_SOFT};
          font-size: 0.85rem;
          font-weight: 600;
          transition: color 0.18s ease;
        }
        .footer-follow-link:hover { color: ${FOOTER_TEXT}; }

        .footer-social-btn {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: ${FOOTER_TEXT};
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.28);
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
          flex-shrink: 0;
        }
        .footer-social-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.45);
          transform: translateY(-2px);
        }

        .footer-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none;
          background: ${FOOTER_GREEN_DARK};
          color: ${FOOTER_TEXT};
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          padding: 14px 28px;
          border-radius: 999px;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          box-shadow: 0 6px 20px rgba(98,132,11,0.25);
          white-space: nowrap;
        }
        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(98,132,11,0.35);
        }

        /* Bottom bar */
        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          padding: 16px 0;
        }
        @media (min-width: 521px) {
          .footer-bottom {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
          }
        }

        .footer-brand-wordmark {
          margin: 0;
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: clamp(1.15rem, 2vw, 1.35rem);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.04em;
          color: ${FOOTER_TEXT};
        }
      `}</style>

      {/* Watermark logo */}
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className="footer-watermark"
      />

      <div className="footer-inner">

     

        {/* ── Main columns ── */}
        <div className="footer-main">

          {/* Brand col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Link
              to="/"
              style={{
                display: "flex", alignItems: "center",
                gap: 12, textDecoration: "none", color: "inherit",
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                background: "#ffffff",
                border: "1px solid rgba(255,255,255,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(98,132,11,0.15)",
              }}>
                <img
                  src={logo}
                  alt="Milkshop"
                  style={{ width: 36, height: 36, objectFit: "contain" }}
                />
              </div>
              <div>
                <div className="footer-brand-wordmark">
                  Milkshop
                </div>
                <div style={{
                  marginTop: 4, fontSize: "0.58rem", fontWeight: 800,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: FOOTER_GREEN_LIGHT,
                }}>
                  秘客侠 · Milk Tea
                </div>
              </div>
            </Link>

            <p style={{
              fontSize: "0.8rem", lineHeight: 1.7,
              color: FOOTER_TEXT_MUTED,
              margin: 0, maxWidth: 220,
            }}>
              Premium Taiwanese milk tea, freshly brewed for the Filipino market.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social-btn"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation col */}
          <div>
            <p className="footer-col-label">Navigation</p>
            {navLinks.map((link) => (
              link.inquiry ? (
              <FranchiseInquiryTrigger
                key={link.path}
                className="footer-nav-link"
              >
                {link.label}
              </FranchiseInquiryTrigger>
              ) : (
              <Link
                key={link.path}
                to={link.path}
                className="footer-nav-link"
              >
                {link.label}
              </Link>
              )
            ))}
          </div>

          {/* Contact col */}
          <div>
            <p className="footer-col-label">Contact</p>
            <a href="tel:09952908161" className="footer-contact-link">
              0995 290 8161
            </a>
            <a href="mailto:franchise@milkshop.ph" className="footer-contact-link">
              franchise@milkshop.ph
            </a>

          
          
          </div>

          {/* Hours / tagline col */}
          <div>
            <p className="footer-col-label">Follow Us</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-follow-link"
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    color: FOOTER_TEXT,
                  }}>
                    {s.icon}
                  </span>
                  @milkshopph
                </a>
              ))}
            </div>
          </div>

        </div>

     

      </div>
    </footer>
  );
}