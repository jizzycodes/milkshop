import { useState } from "react"
import Reveal from "../components/Reveal"

const regions = ["All", "Metro Manila", "Luzon", "Visayas", "Mindanao"];

const locations = [
  {
    id: 1,
    name: "SM Mall of Asia",
    region: "Metro Manila",
    address: "SM Mall of Asia, Pasay City, Metro Manila",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8161",
    tag: "Flagship",
    tagColor: "bg-[#5A9216] text-white",
    emoji: "🏬",
  },
  {
    id: 2,
    name: "BGC Bonifacio High Street",
    region: "Metro Manila",
    address: "Bonifacio High Street, BGC, Taguig City",
    hours: "10:00 AM – 11:00 PM",
    phone: "0995 290 8162",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    emoji: "🏙️",
  },
  {
    id: 3,
    name: "SM Megamall",
    region: "Metro Manila",
    address: "SM Megamall, Ortigas, Mandaluyong City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8163",
    tag: null,
    emoji: "🛍️",
  },
  {
    id: 4,
    name: "Trinoma",
    region: "Metro Manila",
    address: "TriNoma Mall, North Avenue, Quezon City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8164",
    tag: null,
    emoji: "🏪",
  },
  {
    id: 5,
    name: "Robinsons Ermita",
    region: "Metro Manila",
    address: "Robinsons Place Manila, Ermita, Manila",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8165",
    tag: null,
    emoji: "🏬",
  },
  {
    id: 6,
    name: "SM City Baguio",
    region: "Luzon",
    address: "SM City Baguio, Luneta Hill, Baguio City",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8166",
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    emoji: "⛰️",
  },
  {
    id: 7,
    name: "SM City Pampanga",
    region: "Luzon",
    address: "SM City Pampanga, San Fernando, Pampanga",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8167",
    tag: null,
    emoji: "🏬",
  },
  {
    id: 8,
    name: "Robinsons Naga",
    region: "Luzon",
    address: "Robinsons Place Naga, Naga City, Camarines Sur",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8168",
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    emoji: "🌿",
  },
  {
    id: 9,
    name: "SM City Sta. Rosa",
    region: "Luzon",
    address: "SM City Sta. Rosa, Sta. Rosa City, Laguna",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8169",
    tag: null,
    emoji: "🏬",
  },
  {
    id: 10,
    name: "Ayala Center Cebu",
    region: "Visayas",
    address: "Ayala Center Cebu, Cebu Business Park, Cebu City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8170",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    emoji: "🌊",
  },
  {
    id: 11,
    name: "SM City Iloilo",
    region: "Visayas",
    address: "SM City Iloilo, Iloilo City, Iloilo",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8171",
    tag: null,
    emoji: "🏬",
  },
  {
    id: 12,
    name: "Robinsons Bacolod",
    region: "Visayas",
    address: "Robinsons Place Bacolod, Bacolod City, Negros Occidental",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8172",
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    emoji: "🎉",
  },
  {
    id: 13,
    name: "Abreeza Mall Davao",
    region: "Mindanao",
    address: "Abreeza Ayala Mall, J.P. Laurel Ave., Davao City",
    hours: "10:00 AM – 10:00 PM",
    phone: "0995 290 8173",
    tag: "Popular",
    tagColor: "bg-[#E8A020] text-white",
    emoji: "🦅",
  },
  {
    id: 14,
    name: "SM City Cagayan de Oro",
    region: "Mindanao",
    address: "SM City CDO, Limketkai Dr., Cagayan de Oro City",
    hours: "10:00 AM – 9:30 PM",
    phone: "0995 290 8174",
    tag: null,
    emoji: "🏬",
  },
  {
    id: 15,
    name: "NCCC Mall Zamboanga",
    region: "Mindanao",
    address: "NCCC Mall, Veterans Ave., Zamboanga City",
    hours: "10:00 AM – 9:00 PM",
    phone: "0995 290 8175",
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    emoji: "🌺",
  },
];

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

      {/* ── PAGE HEADER ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-b border-[#DDE8CF] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-4">
          <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Find Us
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#1A2410] leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            We're All Over <br />
            <span className="text-[#5A9216]">the Philippines. 📍</span>
          </h1>
          <p className="text-[#5A6B4A] text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            15 branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop.
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-md mt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B4A] text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search branch or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[#DDE8CF] bg-white text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
        </div>
      </Reveal>

      {/* ── REGION FILTER ── */}
      <section className="sticky top-[64px] z-40 bg-white border-b border-[#DDE8CF] py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeRegion === r
                  ? "bg-[#5A9216] text-white shadow-sm"
                  : "bg-[#F7F9F4] text-[#5A6B4A] border border-[#DDE8CF] hover:border-[#5A9216] hover:text-[#5A9216]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs text-[#5A6B4A] font-medium"
            style={{ fontFamily: "'DM Mono', monospace" }}>
            {filtered.length} branch{filtered.length !== 1 ? "es" : ""}
          </span>
        </div>
      </section>

      {/* ── LOCATIONS GRID ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-3">
              <span className="text-5xl">🔍</span>
              <p className="text-[#1A2410] font-bold text-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No branches found
              </p>
              <p className="text-[#5A6B4A] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Try a different search or region.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((loc, index) => (
                <Reveal
                  key={loc.id}
                  as="div"
                  delay={index * 50}
                  className="group ui-card overflow-hidden flex flex-col"
                >
                  {/* Card top */}
                  <div className="bg-[#EEF5E6] h-28 flex items-center justify-center relative">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300 select-none">
                      {loc.emoji}
                    </span>
                    {loc.tag && (
                      <span
                        className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${loc.tagColor}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {loc.tag}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 text-xs text-[#5A6B4A] bg-white border border-[#DDE8CF] px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {loc.region}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-bold text-[#1A2410] text-base leading-snug"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {loc.name}
                    </h3>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm mt-0.5">📍</span>
                        <p className="text-[#5A6B4A] text-xs leading-relaxed"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {loc.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🕐</span>
                        <p className="text-[#5A6B4A] text-xs"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {loc.hours}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📞</span>
                        <p className="text-[#5A6B4A] text-xs"
                          style={{ fontFamily: "'DM Mono', monospace" }}>
                          {loc.phone}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-[#5A9216] hover:bg-[#3E6610] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors duration-200 active:scale-95"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FRANCHISE CTA ── */}
      <section className="bg-[#F7F9F4] border-t border-[#DDE8CF] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Grow With Us
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Open a Milkshop <br /> in Your City 🧋
            </h2>
            <p className="text-[#5A6B4A] text-sm max-w-md leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Interested in franchising? We're expanding across the Philippines. Let's bring Milkshop to your community.
            </p>
          </div>
          <a
            href="mailto:franchise@milkshop.ph"
            className="shrink-0 bg-[#5A9216] hover:bg-[#3E6610] text-white font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Inquire About Franchise →
          </a>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#1A2410] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Find a branch near you 📍
            </h2>
            <p className="text-[#C8DFA8] text-sm mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Visit us at any of our branches nationwide.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}