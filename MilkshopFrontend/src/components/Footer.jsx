import { Link } from "react-router-dom";
import logo from "../assets/milkshop-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Promotions", path: "/promotions" },
  { label: "Locations", path: "/locations" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
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
    <footer className="bg-[#1A2410] text-white">

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <img src={logo} alt="Milkshop logo" className="w-9 h-9 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-base tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Milkshop
              </span>
              <span className="text-[#C8DFA8] text-[10px] tracking-widest uppercase">
                秘客侠
              </span>
            </div>
          </Link>

          <p className="text-[#C8DFA8] text-sm leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            First Taiwanese Popping Boba brand in the Philippines. Crafted with real milk, authentic flavors, and a burst of joy in every sip.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2 mt-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-[#3E6610] text-[#C8DFA8] hover:bg-[#5A9216] hover:border-[#5A9216] hover:text-white flex items-center justify-center transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-[#5A9216]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-[#C8DFA8] hover:text-white text-sm transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-[#5A9216]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Contact Us
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <span className="text-base mt-0.5">📞</span>
              <div>
                <p className="text-[#C8DFA8] text-sm"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  0995 290 8161
                </p>
                <p className="text-[#5A6B4A] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Call or text us
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-base mt-0.5">📍</span>
              <div>
                <p className="text-[#C8DFA8] text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Philippines
                </p>
                <p className="text-[#5A6B4A] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Multiple branches
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-base mt-0.5">🕐</span>
              <div>
                <p className="text-[#C8DFA8] text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  10:00 AM – 10:00 PM
                </p>
                <p className="text-[#5A6B4A] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Daily, incl. holidays
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="border-t border-[#3E6610]/50" />

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[#5A6B4A] text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          © {new Date().getFullYear()} Milkshop 秘客侠 Philippines. All rights reserved.
        </p>
        <p className="text-[#5A6B4A] text-xs"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          🇹🇼 Taiwanese Original · 🇵🇭 Made for Manila
        </p>
      </div>

    </footer>
  );
}