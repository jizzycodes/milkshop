import { Link } from "react-router-dom";
import logo from "../assets/milkshop-logo.png";

// ── Dead links removed: /promotions and /contact don't exist yet
const navLinks = [
  { label: "Home",      path: "/"          },
  { label: "Menu",      path: "/products"  },
  { label: "Locations", path: "/locations" },
  { label: "About",     path: "/about"     },
  { label: "Franchise", path: "/franchise" },
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
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
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
    <footer className="bg-[#0F1A09]">

      {/* ── FRANCHISE CTA BANNER ── */}
      <div className="bg-[#E8A020] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-yellow-900/70 text-xs font-bold tracking-widest uppercase mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Franchise Opportunities
            </p>
            <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Ready to own a Milkshop? 🧋
            </h3>
            <p className="text-yellow-100 text-sm mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ROI in 12–18 months · No experience required · Full brand support
            </p>
          </div>
          <Link
            to="/franchise"
            className="shrink-0 bg-white text-[#E8A020] hover:bg-yellow-50 font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Apply Now →
          </Link>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ── BRAND COLUMN ── */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <img
              src={logo}
              alt="Milkshop logo"
              className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-110"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-base tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Milkshop
              </span>
              <span className="text-[#5A9216] text-[10px] tracking-widest uppercase">
                秘客侠
              </span>
            </div>
          </Link>

          <p className="text-[#6B8C5A] text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            The first Taiwanese Popping Boba brand in the Philippines. Every cup is crafted with real milk, authentic Taiwanese recipes, and a burst of joy.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {["🇹🇼 Taiwan Original", "🥛 Real Milk", "🫧 Popping Boba"].map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-semibold text-[#5A9216] bg-[#5A9216]/10 border border-[#5A9216]/20 px-2.5 py-1 rounded-full"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/10 text-[#6B8C5A] hover:bg-[#5A9216] hover:border-[#5A9216] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-[#5A9216]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-[#6B8C5A] hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="w-1 h-1 rounded-full bg-[#5A9216] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── CONTACT INFO ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-[#5A9216]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5A9216]/10 border border-[#5A9216]/20 flex items-center justify-center shrink-0 text-sm">
                📞
              </div>
              <div>
                <p className="text-white text-sm font-semibold"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  0995 290 8161
                </p>
                <p className="text-[#6B8C5A] text-xs mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Call or text — Mon to Sun
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5A9216]/10 border border-[#5A9216]/20 flex items-center justify-center shrink-0 text-sm">
                📧
              </div>
              <div>
                <p className="text-white text-sm font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  franchise@milkshop.ph
                </p>
                <p className="text-[#6B8C5A] text-xs mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Franchise inquiries
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5A9216]/10 border border-[#5A9216]/20 flex items-center justify-center shrink-0 text-sm">
                🕐
              </div>
              <div>
                <p className="text-white text-sm font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  10:00 AM – 10:00 PM
                </p>
                <p className="text-[#6B8C5A] text-xs mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Daily, including holidays
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* ── FRANCHISE COLUMN ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-[#5A9216]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Franchise
          </h4>
          <div className="bg-[#5A9216]/10 border border-[#5A9216]/20 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-white text-sm font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Own a branch in your city.
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "3 flexible packages",
                "ROI in 12–18 months",
                "Exclusive territory",
                "Full training & support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[#6B8C5A] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-[#5A9216] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/franchise"
              className="mt-1 w-full text-center bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Learn More →
            </Link>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-white/5" />

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[#3A5A2A] text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          © {new Date().getFullYear()} Milkshop 秘客侠 Philippines. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[#3A5A2A] text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            🇹🇼 Taiwanese Original
          </span>
          <span className="text-[#3A5A2A]">·</span>
          <span className="text-[#3A5A2A] text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            🇵🇭 Proudly in the Philippines
          </span>
        </div>
      </div>

    </footer>
  );
}