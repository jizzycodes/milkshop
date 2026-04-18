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
    <footer className="bg-[#0a0a0a] text-white">

      {/* MAIN — pt for breathing room; tight pb so nothing sits under the bottom rule */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 lg:pt-12 pb-3 flex flex-col gap-8">

        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

          {/* BRAND */}
          <div className="max-w-sm flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <img
                src={logo}
                alt="Milkshop logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition"
              />
              <div>
                <p className="font-bold text-white text-base tracking-tight"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  Milkshop
                </p>
                <p className="text-[#97b64c] text-[10px] tracking-widest uppercase">
                  秘客侠
                </p>
              </div>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              The first Taiwanese Popping Boba brand in the Philippines. Crafted with real milk and authentic recipes.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-2 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[#97b64c] hover:bg-[#97b64c]/10 flex items-center justify-center transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">

            {/* NAV LINKS */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-white/60 hover:text-white text-sm transition"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CONTACT + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

              {/* CONTACT */}
              <div className="text-sm text-white/60 flex flex-col gap-1"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                <span>📞 0995 290 8161</span>
                <span>📧 franchise@milkshop.ph</span>
              </div>

              {/* CTA */}
              <Link
                to="/franchise#inquiry"
                className="px-6 py-3 rounded-full bg-[#E8A020] hover:bg-[#CF8E18] text-white text-sm font-semibold transition-all duration-200 active:scale-95 shadow-lg"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
              >
                Start Franchise →
              </Link>
            </div>

          </div>
        </div>

        {/* COPYRIGHT + bottom rule — small gap so no dead band below the line */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
            <span>© {new Date().getFullYear()} Milkshop 秘客侠 Philippines</span>
            <div className="flex items-center gap-2">
              <span>🇹🇼 Taiwanese Original</span>
              <span>·</span>
              <span>🇵🇭 Philippines</span>
            </div>
          </div>
          <div className="border-t border-white/10" aria-hidden />
        </div>

      </div>
    </footer>
  );
}