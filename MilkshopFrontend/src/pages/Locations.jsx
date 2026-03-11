import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"

// ─────────────────────────────────────────────────────────────────────────────
// LOCATIONS DATA
// ⚠️  To add a branch photo, set the `photo` field to the image URL.
//     If `photo` is null, a styled placeholder is shown automatically.
//
// Shape per location:
// {
//   id, name, region, address, hours, phone,
//   dateEstablished,   ← e.g. "March 2022"
//   tag, tagColor,
//   photo,             ← image URL string or null
// }
// ─────────────────────────────────────────────────────────────────────────────
const locations = [
  {
    id: 1,
    name: "SM Mall of Asia",
    region: "Metro Manila",
    address: "SM Mall of Asia, Pasay City, Metro Manila",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8161",
    dateEstablished: "March 2022",
    tag: "Flagship",
    tagColor: "bg-[#97b64c] text-white",
    photo: null, // ← replace with your photo URL
  },
  {
    id: 2,
    name: "BGC Bonifacio High Street",
    region: "Metro Manila",
    address: "Bonifacio High Street, BGC, Taguig City",
    hours: "10:00 AM – 11:00 PM",
    phone: "0995 290 8162",
    dateEstablished: "June 2022",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    photo: null,
  },
  {
    id: 3,
    name: "SM Megamall",
    region: "Metro Manila",
    address: "SM Megamall, Ortigas, Mandaluyong City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8163",
    dateEstablished: "August 2022",
    tag: null,
    photo: null,
  },
  {
    id: 4,
    name: "Trinoma",
    region: "Metro Manila",
    address: "TriNoma Mall, North Avenue, Quezon City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8164",
    dateEstablished: "October 2022",
    tag: null,
    photo: null,
  },
  {
    id: 5,
    name: "Robinsons Ermita",
    region: "Metro Manila",
    address: "Robinsons Place Manila, Ermita, Manila",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8165",
    dateEstablished: "November 2022",
    tag: null,
    photo: null,
  },
  {
    id: 6,
    name: "SM City Baguio",
    region: "Luzon",
    address: "SM City Baguio, Luneta Hill, Baguio City",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8166",
    dateEstablished: "February 2023",
    tag: "New",
    tagColor: "bg-[#97b64c] text-white",
    photo: null,
  },
  {
    id: 7,
    name: "SM City Pampanga",
    region: "Luzon",
    address: "SM City Pampanga, San Fernando, Pampanga",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8167",
    dateEstablished: "April 2023",
    tag: null,
    photo: null,
  },
  {
    id: 8,
    name: "Robinsons Naga",
    region: "Luzon",
    address: "Robinsons Place Naga, Naga City, Camarines Sur",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8168",
    dateEstablished: "July 2023",
    tag: "New",
    tagColor: "bg-[#97b64c] text-white",
    photo: null,
  },
  {
    id: 9,
    name: "SM City Sta. Rosa",
    region: "Luzon",
    address: "SM City Sta. Rosa, Sta. Rosa City, Laguna",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8169",
    dateEstablished: "September 2023",
    tag: null,
    photo: null,
  },
  {
    id: 10,
    name: "Ayala Center Cebu",
    region: "Visayas",
    address: "Ayala Center Cebu, Cebu Business Park, Cebu City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8170",
    dateEstablished: "May 2023",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    photo: null,
  },
  {
    id: 11,
    name: "SM City Iloilo",
    region: "Visayas",
    address: "SM City Iloilo, Iloilo City, Iloilo",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8171",
    dateEstablished: "August 2023",
    tag: null,
    photo: null,
  },
  {
    id: 12,
    name: "Robinsons Bacolod",
    region: "Visayas",
    address: "Robinsons Place Bacolod, Bacolod City, Negros Occidental",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8172",
    dateEstablished: "November 2023",
    tag: "New",
    tagColor: "bg-[#97b64c] text-white",
    photo: null,
  },
  {
    id: 13,
    name: "Abreeza Mall Davao",
    region: "Mindanao",
    address: "Abreeza Ayala Mall, J.P. Laurel Ave., Davao City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8173",
    dateEstablished: "June 2023",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    photo: null,
  },
  {
    id: 14,
    name: "SM City Cagayan de Oro",
    region: "Mindanao",
    address: "SM City CDO, Limketkai Dr., Cagayan de Oro City",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8174",
    dateEstablished: "September 2023",
    tag: null,
    photo: null,
  },
  {
    id: 15,
    name: "NCCC Mall Zamboanga",
    region: "Mindanao",
    address: "NCCC Mall, Veterans Ave., Zamboanga City",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8175",
    dateEstablished: "January 2024",
    tag: "New",
    tagColor: "bg-[#97b64c] text-white",
    photo: null,
  },
];

const regions = ["All", "Metro Manila", "Luzon", "Visayas", "Mindanao"];

// ─── LOCATION CARD ────────────────────────────────────────────────────────────
function LocationCard({ loc, index }) {
  return (
    <Reveal
      as="div"
      delay={index * 45}
      className="group relative bg-white rounded-3xl border border-[#d0e0b0] overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── PHOTO / PLACEHOLDER ── */}
      <div className="relative h-52 overflow-hidden">
        {loc.photo ? (
          <img
            src={loc.photo}
            alt={`Milkshop ${loc.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Placeholder — replaced once you upload a photo */
          <div className="w-full h-full bg-gradient-to-br from-[#e8f0dc] via-[#b7cd7f]/40 to-[#f5f8ef] flex flex-col items-center justify-center gap-2 group-hover:from-[#d0e0b0] transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-white/70 border border-[#d0e0b0] flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-[#b7cd7f]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5M3 7.5h18M3 12h18" />
              </svg>
            </div>
            <p className="text-[#b7cd7f] text-xs font-medium" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Photo coming soon
            </p>
          </div>
        )}

        {/* Gradient overlay at bottom of photo */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Tag badge */}
        {loc.tag && (
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${loc.tagColor}`}
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
          >
            {loc.tag}
          </span>
        )}

        {/* Region pill */}
        <span
          className="absolute top-3 right-3 text-xs font-medium bg-white/90 backdrop-blur-sm text-[#5a5a5a] border border-[#d0e0b0] px-2.5 py-1 rounded-full"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          {loc.region}
        </span>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Branch name */}
        <h3
          className="font-bold text-[#1e1e1e] text-base leading-snug"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          {loc.name}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start gap-2.5">
            <span className="text-base mt-0.5 shrink-0">📍</span>
            <p className="text-[#5a5a5a] text-xs leading-relaxed" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              {loc.address}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base shrink-0">🕐</span>
            <p className="text-[#5a5a5a] text-xs" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              {loc.hours}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base shrink-0">📞</span>
            <p className="text-[#5a5a5a] text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
              {loc.phone}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base shrink-0">📅</span>
            <p className="text-[#5a5a5a] text-xs" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Est. {loc.dateEstablished}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#d0e0b0]" />

        {/* Action */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#97b64c] hover:bg-[#62840b] text-white text-xs font-bold py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Get Directions
        </a>
      </div>
    </Reveal>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Locations() {
  const [activeRegion, setActiveRegion] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = locations.filter((loc) => {
    const matchRegion = activeRegion === "All" || loc.region === activeRegion;
    const matchSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.address.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO HEADER ── */}
      <section className="relative bg-[#1e1e1e] py-24 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#97b64c]/10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-[#E8A020]/10 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-6 z-10">
          <span className="bg-[#97b64c]/20 text-[#b7cd7f] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
            📍 Find Us
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
            We're All Over<br />
            <span className="text-[#97b64c]">the Philippines.</span>
          </h1>
          <p className="text-[#b7cd7f] text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
            {locations.length} branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop to you.
          </p>

          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-2">
            {[
              { value: `${locations.length}`, label: "Total Branches" },
              { value: "4",  label: "Regions Covered" },
              { value: "2022", label: "PH Launch Year" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.value}
                </span>
                <span className="text-[#b7cd7f] text-xs uppercase tracking-widest" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md mt-2">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a5a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search branch or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm text-sm text-white placeholder-[#5a5a5a] focus:outline-none focus:border-[#97b64c] focus:ring-2 focus:ring-[#97b64c]/30 transition-all"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            />
          </div>
        </div>
      </section>

      {/* ── REGION FILTER ── */}
      <section className="sticky top-[64px] z-40 bg-white border-b border-[#d0e0b0] py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeRegion === r
                  ? "bg-[#97b64c] text-white shadow-sm"
                  : "bg-[#f5f8ef] text-[#5a5a5a] border border-[#d0e0b0] hover:border-[#97b64c] hover:text-[#97b64c]"
              }`}
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              {r}
            </button>
          ))}
          <span
            className="ml-auto shrink-0 text-xs text-[#5a5a5a] font-medium bg-[#f5f8ef] border border-[#d0e0b0] px-3 py-1.5 rounded-full"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {filtered.length} branch{filtered.length !== 1 ? "es" : ""}
          </span>
        </div>
      </section>

      {/* ── LOCATIONS GRID ── */}
      <section className="py-16 bg-[#f5f8ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-32 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f0dc] border border-[#d0e0b0] flex items-center justify-center text-3xl">
                🔍
              </div>
              <p className="text-[#1e1e1e] font-bold text-lg" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                No branches found
              </p>
              <p className="text-[#5a5a5a] text-sm" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Try a different search or region filter.
              </p>
              <button
                onClick={() => { setSearch(""); setActiveRegion("All"); }}
                className="mt-2 text-sm font-semibold text-[#97b64c] border border-[#97b64c] px-5 py-2 rounded-full hover:bg-[#e8f0dc] transition-all duration-200"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((loc, index) => (
                <LocationCard key={loc.id} loc={loc} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FRANCHISE CTA ── */}
      <Reveal as="section" className="bg-[#1e1e1e] py-20 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#97b64c]/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex flex-col gap-4">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Grow With Us
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Don't see your city? <br />
              <span className="text-[#97b64c]">Open a branch there.</span>
            </h2>
            <p className="text-[#b7cd7f] text-base max-w-md leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              We're actively expanding across the Philippines. Bring Milkshop to your community — and build a business you're proud of.
            </p>
            <ul className="flex flex-col gap-2 mt-1">
              {["Exclusive territory guaranteed", "Full training & brand support", "Proven 12–18 month ROI"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[#b7cd7f] text-sm"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  <span className="w-4 h-4 rounded-full bg-[#97b64c] flex items-center justify-center text-white text-[9px] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Link
              to="/franchise#inquiry"
              className="bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-sm px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Franchise Now →
            </Link>
            <p className="text-[#5a5a5a] text-xs" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              No food experience required.
            </p>
          </div>
        </div>
      </Reveal>

    </main>
  );
}