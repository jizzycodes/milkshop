import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/milkshop-logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/products" },
  { label: "Locations", path: "/locations" },
  { label: "About", path: "/about" },
  { label: "Franchise Opportunities", path: "/franchise" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

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
      {/* Top brand bar */}
      <div className="bg-[#5A9216] text-white text-center text-xs py-2 font-medium tracking-widest uppercase">
        Authentic Taiwanese Popping Boba Brand
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-[#DDE8CF]"
            : "bg-[#F7F9F4] border-b border-[#DDE8CF]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="Milkshop logo"
              className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110 group-hover:-translate-y-0.5"
            />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[#1A2410] text-base tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Milkshop
              </span>
              <span className="text-[#5A6B4A] text-[10px] tracking-widest uppercase">
                秘客侠
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 group ${
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

          {/* No direct order button on brand site */}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full hover:bg-[#EEF5E6] transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#1A2410] transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-[#DDE8CF] px-6 py-4 flex flex-col gap-1">
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
          </div>
        </div>
      </nav>
    </>
  );
}