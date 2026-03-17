import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

// ─── DATA ─────────────────────────────────────────────────────────────────────

const locations = [
  { id: 1,  name: "SM Mall of Asia",          region: "Metro Manila", address: "SM Mall of Asia, Pasay City, Metro Manila",                hours: "10:00 AM – 10:00 PM", phone: "0995 290 8161", dateEstablished: "March 2022",     tag: "Flagship", tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 2,  name: "BGC Bonifacio High Street", region: "Metro Manila", address: "Bonifacio High Street, BGC, Taguig City",                  hours: "10:00 AM – 11:00 PM", phone: "0995 290 8162", dateEstablished: "June 2022",      tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 3,  name: "SM Megamall",               region: "Metro Manila", address: "SM Megamall, Ortigas, Mandaluyong City",                   hours: "10:00 AM – 10:00 PM", phone: "0995 290 8163", dateEstablished: "August 2022",    tag: null,       tagColor: null,                             photo: null },
  { id: 4,  name: "Trinoma",                   region: "Metro Manila", address: "TriNoma Mall, North Avenue, Quezon City",                  hours: "10:00 AM – 10:00 PM", phone: "0995 290 8164", dateEstablished: "October 2022",   tag: null,       tagColor: null,                             photo: null },
  { id: 5,  name: "Robinsons Ermita",          region: "Metro Manila", address: "Robinsons Place Manila, Ermita, Manila",                   hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8165", dateEstablished: "November 2022",  tag: null,       tagColor: null,                             photo: null },
  { id: 6,  name: "SM City Baguio",            region: "Luzon",        address: "SM City Baguio, Luneta Hill, Baguio City",                 hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8166", dateEstablished: "February 2023",  tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 7,  name: "SM City Pampanga",          region: "Luzon",        address: "SM City Pampanga, San Fernando, Pampanga",                 hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8167", dateEstablished: "April 2023",     tag: null,       tagColor: null,                             photo: null },
  { id: 8,  name: "Robinsons Naga",            region: "Luzon",        address: "Robinsons Place Naga, Naga City, Camarines Sur",           hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8168", dateEstablished: "July 2023",      tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 9,  name: "SM City Sta. Rosa",         region: "Luzon",        address: "SM City Sta. Rosa, Sta. Rosa City, Laguna",                hours: "10:00 AM – 10:00 PM", phone: "0995 290 8169", dateEstablished: "September 2023", tag: null,       tagColor: null,                             photo: null },
  { id: 10, name: "Ayala Center Cebu",         region: "Visayas",      address: "Ayala Center Cebu, Cebu Business Park, Cebu City",         hours: "10:00 AM – 10:00 PM", phone: "0995 290 8170", dateEstablished: "May 2023",       tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 11, name: "SM City Iloilo",            region: "Visayas",      address: "SM City Iloilo, Iloilo City, Iloilo",                      hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8171", dateEstablished: "August 2023",    tag: null,       tagColor: null,                             photo: null },
  { id: 12, name: "Robinsons Bacolod",         region: "Visayas",      address: "Robinsons Place Bacolod, Bacolod City, Negros Occidental", hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8172", dateEstablished: "November 2023",  tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 13, name: "Abreeza Mall Davao",        region: "Mindanao",     address: "Abreeza Ayala Mall, J.P. Laurel Ave., Davao City",         hours: "10:00 AM – 10:00 PM", phone: "0995 290 8173", dateEstablished: "June 2023",      tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 14, name: "SM City Cagayan de Oro",    region: "Mindanao",     address: "SM City CDO, Limketkai Dr., Cagayan de Oro City",          hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8174", dateEstablished: "September 2023", tag: null,       tagColor: null,                             photo: null },
  { id: 15, name: "NCCC Mall Zamboanga",       region: "Mindanao",     address: "NCCC Mall, Veterans Ave., Zamboanga City",                 hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8175", dateEstablished: "January 2024",   tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
];

const regions = [
  { label: "All",          emoji: "🗺️" },
  { label: "Metro Manila", emoji: "🏙️" },
  { label: "Luzon",        emoji: "🌿" },
  { label: "Visayas",      emoji: "🌊" },
  { label: "Mindanao",     emoji: "🏝️" },
];

const regionAccent = {
  "Metro Manila": "#97b64c",
  "Luzon":        "#62840b",
  "Visayas":      "#E8A020",
  "Mindanao":     "#b7cd7f",
};

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Slide({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const from = { up: "translateY(36px)", left: "translateX(-36px)", right: "translateX(36px)" };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : from[direction],
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────

function LocationCard({ loc, index }) {
  const accent = regionAccent[loc.region] || "#97b64c";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), index * 55);
    return () => clearTimeout(t);
  }, [loc.id, index]);

  const regionEmoji = regions.find(r => r.label === loc.region)?.emoji || "📍";

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid #e8f0dc",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease",
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"}
    >
      {/* Region accent top stripe */}
      <div style={{ height: "3px", backgroundColor: accent }} />

      {/* Photo / Placeholder */}
      <div className="relative overflow-hidden" style={{ height: "172px", backgroundColor: "#f5f8ef" }}>
        {loc.photo ? (
          <img src={loc.photo} alt={loc.name} draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accent}18`, border: `2px solid ${accent}28` }}>
                <svg className="w-6 h-6" fill="none" stroke={accent} strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div className="mt-1 w-8 h-1.5 rounded-full" style={{ backgroundColor: `${accent}20`, filter: "blur(3px)" }} />
            </div>
            <p className="text-[11px] font-medium" style={{ color: `${accent}88`, fontFamily: "'DM Sans', sans-serif" }}>
              Photo coming soon
            </p>
          </div>
        )}

        {loc.tag && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"
            style={{ backgroundColor: loc.tagColor.bg, color: loc.tagColor.text, fontFamily: "'DM Sans', sans-serif" }}>
            {loc.tag}
          </span>
        )}

        <span className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "white", color: accent, border: `1px solid ${accent}28`, fontFamily: "'DM Sans', sans-serif" }}>
          {regionEmoji} {loc.region}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-5 flex-1">

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm leading-snug" style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>
            {loc.name}
          </h3>
          <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap"
            style={{ backgroundColor: "#f5f8ef", color: "#62840b", border: "1px solid #d0e0b0", fontFamily: "'DM Mono', monospace" }}>
            {loc.dateEstablished.split(" ")[1]}
          </span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {[
            { icon: "📍", text: loc.address },
            { icon: "🕐", text: loc.hours },
            { icon: "📞", text: loc.phone, mono: true },
          ].map((row, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs shrink-0 mt-0.5">{row.icon}</span>
              <p className="text-xs leading-relaxed" style={{
                color: "#5a6a4a",
                fontFamily: row.mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
              }}>{row.text}</p>
            </div>
          ))}
        </div>

        <div className="h-px" style={{ backgroundColor: "#e8f0dc" }} />

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs transition-all duration-200 active:scale-95"
          style={{ backgroundColor: accent, color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 4px 14px ${accent}30` }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Locations() {
  const [activeRegion, setActiveRegion] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = locations.filter(loc => {
    const matchRegion = activeRegion === "All" || loc.region === activeRegion;
    const matchSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <main style={{ backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>

      {/* ══════════════════════════════════════
          SLIDE 1 — HERO
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #f5f8ef 0%, #ffffff 60%, #fffdf5 100%)",
        minHeight: "72vh",
        display: "flex", alignItems: "center",
      }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.22) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 20% 50%, black 10%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 20% 50%, black 10%, transparent 65%)",
        }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(151,182,76,0.07) 0%, transparent 70%)",
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: "linear-gradient(to right, transparent, rgba(151,182,76,0.25), transparent)",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-24 z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            <div className="flex-1 flex flex-col gap-6">
              <Slide direction="left" delay={0}>
                <span className="self-start inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
                  style={{ backgroundColor: "rgba(151,182,76,0.12)", color: "#62840b", border: "1px solid rgba(151,182,76,0.25)" }}>
                  📍 Find Us
                </span>
              </Slide>

              <Slide direction="left" delay={80}>
                <h1 style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#1e1e1e" }}>
                  We're All Over<br />
                  <span style={{ color: "#97b64c" }}>the Philippines.</span>
                </h1>
              </Slide>

              <Slide direction="left" delay={150}>
                <p className="text-base leading-relaxed max-w-md" style={{ color: "#5a6a4a" }}>
                  {locations.length} branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop to you.
                </p>
              </Slide>

              <Slide direction="left" delay={220}>
                <div className="relative max-w-md">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="#97b64c" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search branch or city..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: "100%", paddingLeft: "2.75rem", paddingRight: "2.5rem",
                      paddingTop: "0.875rem", paddingBottom: "0.875rem",
                      borderRadius: "9999px", fontSize: "0.875rem",
                      border: "1.5px solid #d0e0b0", backgroundColor: "white",
                      color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif",
                      boxShadow: "0 2px 12px rgba(151,182,76,0.08)", outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#97b64c"}
                    onBlur={e => e.target.style.borderColor = "#d0e0b0"}
                  />
                  {search && (
                    <button onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                      style={{ color: "#97b64c" }}>✕</button>
                  )}
                </div>
              </Slide>
            </div>

            {/* Stats grid */}
            <Slide direction="right" delay={150} className="flex-shrink-0 grid grid-cols-2 gap-4">
              {[
                { value: `${locations.length}`, label: "Total Branches",  icon: "🏪" },
                { value: "4",                   label: "Regions Covered", icon: "🗺️" },
                { value: "2022",                label: "PH Launch Year",  icon: "🇵🇭" },
                { value: "12–18mo",             label: "Franchise ROI",   icon: "📈" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-5 flex flex-col gap-1.5"
                  style={{ backgroundColor: "white", border: "1px solid #e8f0dc", boxShadow: "0 2px 12px rgba(151,182,76,0.07)" }}>
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-2xl font-black leading-none" style={{ color: "#1e1e1e", fontFamily: "'DM Mono', monospace" }}>{s.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#62840b" }}>{s.label}</span>
                </div>
              ))}
            </Slide>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 2 — STICKY REGION FILTER
      ══════════════════════════════════════ */}
      <div className="sticky z-40 py-4" style={{
        top: "calc(32px + 72px)",
        backgroundColor: "rgba(250,250,248,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e8f0dc",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
      }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {regions.map(r => (
            <button key={r.label} onClick={() => setActiveRegion(r.label)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                backgroundColor: activeRegion === r.label ? "#97b64c" : "white",
                color:           activeRegion === r.label ? "#ffffff" : "#5a6a4a",
                border:          activeRegion === r.label ? "1.5px solid #97b64c" : "1px solid #d0e0b0",
                boxShadow:       activeRegion === r.label ? "0 2px 12px rgba(151,182,76,0.25)" : "none",
                fontFamily: "'DM Sans', sans-serif",
              }}>
              {r.emoji} {r.label}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#f5f8ef", color: "#97b64c", border: "1px solid #d0e0b0", fontFamily: "'DM Mono', monospace" }}>
            {filtered.length} branch{filtered.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SLIDE 3 — GRID
      ══════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#f5f8ef" }}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {filtered.length === 0 ? (
            <div className="py-32 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: "white", border: "1px solid #d0e0b0" }}>🔍</div>
              <p className="font-bold text-lg" style={{ color: "#1e1e1e" }}>No branches found</p>
              <p className="text-sm" style={{ color: "#5a6a4a" }}>Try a different search or region.</p>
              <button onClick={() => { setSearch(""); setActiveRegion("All"); }}
                className="mt-2 text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200"
                style={{ border: "1.5px solid #97b64c", color: "#62840b", backgroundColor: "white" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((loc, index) => (
                <LocationCard key={loc.id} loc={loc} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 4 — COMING TO YOUR CITY
      ══════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden bg-white" style={{ borderTop: "1px solid #e8f0dc" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(151,182,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <Slide direction="left">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "#97b64c" }}>Expanding Nationwide</p>
            <h2 className="font-black" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#1e1e1e", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Don't see your city?<br />
              <span style={{ color: "#97b64c" }}>We're coming there.</span>
            </h2>
            <p className="text-sm mt-4 max-w-md" style={{ color: "#5a6a4a" }}>
              New branches open every quarter. Check back soon — or bring Milkshop to your city yourself.
            </p>
          </Slide>
          <Slide direction="right" delay={100}>
            <div className="flex flex-wrap gap-3">
              <Link to="/franchise#inquiry"
                className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 active:scale-95"
                style={{ backgroundColor: "#E8A020", color: "#ffffff", boxShadow: "0 4px 20px rgba(232,160,32,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                Open a Branch →
              </Link>
              <Link to="/franchise"
                className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
                style={{ border: "1.5px solid #d0e0b0", color: "#62840b", backgroundColor: "transparent", fontFamily: "'DM Sans', sans-serif" }}>
                Learn About Franchising
              </Link>
            </div>
          </Slide>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 5 — FRANCHISE CTA
      ══════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{
        background: "linear-gradient(160deg, #f5f8ef 0%, #eef4e3 100%)",
        borderTop: "1px solid #d0e0b0",
      }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.18) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 flex flex-col gap-5">
              <Slide direction="left">
                <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Grow With Us</p>
              </Slide>
              <Slide direction="left" delay={60}>
                <h2 className="font-black" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "#1e1e1e", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  Build a Business<br />You're Proud Of.
                </h2>
              </Slide>
              <Slide direction="left" delay={120}>
                <ul className="flex flex-col gap-2.5">
                  {["Exclusive territory guaranteed", "Full training & brand support", "Proven 12–18 month ROI", "No food experience required"].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#3a4a2a" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
                        style={{ backgroundColor: "#97b64c" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Slide>
            </div>

            <Slide direction="right" delay={100} className="flex-shrink-0 w-full lg:w-80">
              <div className="rounded-3xl p-8 flex flex-col gap-6"
                style={{ backgroundColor: "white", border: "1px solid #d0e0b0", boxShadow: "0 8px 40px rgba(151,182,76,0.15)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏪</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1e1e1e" }}>Milkshop Franchise</p>
                    <p className="text-xs" style={{ color: "#97b64c" }}>3 packages available</p>
                  </div>
                </div>
                <div className="h-px" style={{ backgroundColor: "#e8f0dc" }} />
                <div className="flex flex-col gap-2">
                  {["🛒 Cart / Mobile", "🏪 Kiosk", "🏬 In-Line Store"].map(p => (
                    <div key={p} className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm"
                      style={{ backgroundColor: "#f5f8ef", color: "#3a4a2a" }}>
                      <span>{p}</span>
                      <span className="text-xs font-bold" style={{ color: "#97b64c" }}>→</span>
                    </div>
                  ))}
                </div>
                <Link to="/franchise#inquiry"
                  className="w-full text-center font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 4px 16px rgba(151,182,76,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
                  Franchise Now →
                </Link>
                <p className="text-center text-xs" style={{ color: "#9aaa8a" }}>No food experience required.</p>
              </div>
            </Slide>
          </div>
        </div>
      </section>

    </main>
  );
}