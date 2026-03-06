import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/milkshop-logo.png";

// Regular nav links — Franchise is handled separately as a CTA button
const navLinks = [
  { label: "Home",      path: "/"          },
  { label: "Menu",      path: "/products"  },
  { label: "Locations", path: "/locations" },
  { label: "About",     path: "/about"     },
];

const PROMO_MESSAGES = [
  "🇹🇼 First Taiwanese Popping Boba Brand in the Philippines",
  "20% off — Valentine's Special! Limited time only.",
  "New branch opening soon. Follow us for updates.",
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  const isFranchise = location.pathname === "/franchise";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* ── TOP BRAND BAR (scrolling promos) ── */}
      <div className="bg-[#1A2410] text-[#C8DFA8] text-xs py-2 font-medium tracking-widest uppercase overflow-hidden">
        <div className="flex animate-nav-marquee whitespace-nowrap">
          {[...PROMO_MESSAGES, ...PROMO_MESSAGES].map((msg, i) => (
            <span key={i} className="mx-8 inline-block">
              {msg}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes nav-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-nav-marquee { animation: nav-marquee 28s linear infinite; }
      `}</style>

      {/* ── MAIN NAVBAR ── */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-[#DDE8CF]"
            : "bg-white border-b border-[#DDE8CF]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 gap-6">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={logo}
              alt="Milkshop logo"
              className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-bold text-[#1A2410] text-base tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Milkshop
              </span>
              <span className="text-[#5A6B4A] text-[10px] tracking-widest uppercase">
                秘客侠
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "text-[#5A9216] bg-[#EEF5E6]"
                        : "text-[#5A6B4A] hover:text-[#5A9216] hover:bg-[#EEF5E6]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#5A9216]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── FRANCHISE CTA BUTTON (desktop) ── */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              to="/franchise"
              className={`relative group flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 ${
                isFranchise
                  ? "bg-[#CF8E18] text-white shadow-md"
                  : "bg-[#E8A020] hover:bg-[#CF8E18] text-white shadow-md hover:shadow-lg"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Ping ring — only when NOT already on franchise page */}
              {!isFranchise && (
                <span className="absolute -inset-0.5 rounded-full bg-[#E8A020]/40 animate-ping opacity-0 group-hover:opacity-100 pointer-events-none" />
              )}
              <span className="relative">Franchise Now</span>
              <span className="relative text-yellow-200">→</span>
            </Link>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full hover:bg-[#EEF5E6] transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-[#DDE8CF] px-6 py-4 flex flex-col gap-1">

            {/* Regular links */}
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#EEF5E6] text-[#5A9216]"
                      : "text-[#5A6B4A] hover:bg-[#EEF5E6] hover:text-[#5A9216]"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Franchise CTA — highlighted in mobile menu */}
            <div className="mt-3 pt-3 border-t border-[#DDE8CF]">
              <Link
                to="/franchise"
                className="flex items-center justify-between bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-sm px-5 py-3.5 rounded-2xl transition-all duration-200 active:scale-95 shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span>Franchise Now →</span>
                  <span className="text-yellow-200 text-[10px] font-medium">
                    ROI in 12–18 months · Full support
                  </span>
                </div>
                <span className="text-2xl">🧋</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}