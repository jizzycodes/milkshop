import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const A1_IMAGE_URL =
  "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png";

const HERO_BG_IMAGES = ["/hero-bg-1.png", "/hero-bg-2.png", "/hero-bg-3.png"];

const FADE_DURATION_MS = 5000;

export default function Hero() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setBgIndex((i) => (i + 1) % HERO_BG_IMAGES.length);
    }, FADE_DURATION_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full bg-[#f5f8ef] overflow-hidden">

      {/* ── FADING BACKGROUND IMAGES (transparent so content visible) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: bgIndex === i ? 0.2 : 0,
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden
            />
          </div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 z-10">

        {/* ── LEFT — Text Content ── */}
        <div className="flex-1 flex flex-col items-start gap-6 z-10">

          {/* Live badge */}
          <div className="flex items-center gap-2 bg-[#e8f0dc] border border-[#b7cd7f] rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-[#97b64c] animate-pulse shrink-0" />
            <span
              className="text-[#97b64c] text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              First Taiwanese Popping Boba Brand in PH
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1e1e1e] leading-[1.05] tracking-tight"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
          >
            Every Sip,
            <br />
            <span className="text-[#97b64c]">Bursting</span>
            <br />
            with Joy.
          </h1>

          {/* Subtext */}
          <p
            className="text-[#5a5a5a] text-base lg:text-lg max-w-md leading-relaxed"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
          >
            Freshly crafted milk tea with Taiwanese Popping Boba — a burst of flavor in every cup. Now in the Philippines, and growing fast.
          </p>

          {/* ── CTA ROW ── */}
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {/* PRIMARY — Franchise Now */}
            <Link
              to="/franchise#inquiry"
              className="relative group bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              {/* Subtle pulse ring on CTA */}
              <span className="absolute -inset-0.5 rounded-full bg-[#E8A020]/30 animate-ping opacity-0 group-hover:opacity-100 pointer-events-none" />
              <span className="relative">Franchise Now</span>
              <span className="relative">→</span>
            </Link>

            {/* SECONDARY — View Menu */}
            <Link
              to="/products"
              className="border border-[#97b64c] text-[#97b64c] hover:bg-[#e8f0dc] font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              View Menu
            </Link>
          </div>

          {/* Franchise micro-proof */}
          <p className="text-[#5a5a5a] text-xs flex items-center gap-1.5"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
            <span className="text-[#97b64c] font-bold">✓</span>
            No experience needed &nbsp;·&nbsp;
            <span className="text-[#97b64c] font-bold">✓</span>
            ROI in 12–18 months &nbsp;·&nbsp;
            <span className="text-[#97b64c] font-bold">✓</span>
            Full brand support
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-2 pt-4 border-t border-[#d0e0b0] w-full">
            {[
              { value: "15+",  label: "Branches" },
              { value: "20+",  label: "Flavors"  },
              { value: "5★",   label: "Rated"    },
              { value: "2015", label: "Est. Taiwan" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="text-xl lg:text-2xl font-bold text-[#1e1e1e]"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-[10px] text-[#5a5a5a] uppercase tracking-widest"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Visual ── */}
        <div className="flex-1 flex justify-center items-center relative z-10">
          <div className="relative w-72 h-72 lg:w-96 lg:h-96">

            {/* Outer dashed spinning ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#b7cd7f] animate-spin-slow" />

            {/* Inner circle bg */}
            <div className="absolute inset-6 rounded-full bg-[#e8f0dc] shadow-inner" />

            {/* Center drink image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <img
                  src={A1_IMAGE_URL}
                  alt="Milkshop Black Sugar Boba Milk Tea"
                  className="h-64 lg:h-80 object-contain drop-shadow-xl"
                />
                <span
                  className="text-[#97b64c] text-xs font-bold tracking-widest uppercase"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
                >
                  Milkshop 秘客侠
                </span>
              </div>
            </div>

            {/* Floating tag — Popping Boba */}
            <div className="absolute -top-3 -right-4 bg-white border border-[#d0e0b0] rounded-2xl px-3 py-2 shadow-md flex items-center gap-2">
              <span className="text-lg">🫧</span>
              <div>
                <p className="text-[10px] font-bold text-[#1e1e1e]" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>Popping Boba</p>
                <p className="text-[9px] text-[#5a5a5a]"            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>Taiwanese Original</p>
              </div>
            </div>

            {/* Floating tag — Best Seller */}
            <div className="absolute -bottom-3 -left-4 bg-[#E8A020] rounded-2xl px-3 py-2 shadow-md">
              <p className="text-[10px] font-bold text-white"       style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>🔥 Best Seller</p>
              <p className="text-[9px] text-yellow-100"             style={{ fontFamily: "'DM Mono', monospace" }}>Brown Sugar Series</p>
            </div>

            {/* Floating tag — Taiwan */}
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-white border border-[#d0e0b0] rounded-2xl px-3 py-2 shadow-md">
              <p className="text-[10px] font-bold text-[#97b64c]"  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>🇹🇼 Taiwan</p>
              <p className="text-[9px] text-[#5a5a5a]"             style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>Heritage Recipe</p>
            </div>

            {/* NEW floating tag — Franchise */}
            <div className="absolute -top-3 -left-6 bg-[#1e1e1e] rounded-2xl px-3 py-2 shadow-md hidden lg:block">
              <p className="text-[10px] font-bold text-[#E8A020]"  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>📈 Franchise Open</p>
              <p className="text-[9px] text-[#b7cd7f]"             style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>ROI in 12–18 months</p>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM WAVE DIVIDER ── */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 fill-white">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

    </section>
  );
}