import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { createPortal } from "react-dom"
import { supabase } from "../lib/supabaseClient"

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATIC_LOCATIONS = [
  { id: 1,  name: "SM Mall of Asia",           region: "Metro Manila", address: "SM Mall of Asia, Pasay City, Metro Manila",                hours: "10:00 AM – 10:00 PM", phone: "0995 290 8161", dateEstablished: "March 2022",     tag: "Flagship", tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 2,  name: "BGC Bonifacio High Street",  region: "Metro Manila", address: "Bonifacio High Street, BGC, Taguig City",                  hours: "10:00 AM – 11:00 PM", phone: "0995 290 8162", dateEstablished: "June 2022",      tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 3,  name: "SM Megamall",                region: "Metro Manila", address: "SM Megamall, Ortigas, Mandaluyong City",                   hours: "10:00 AM – 10:00 PM", phone: "0995 290 8163", dateEstablished: "August 2022",    tag: null,       tagColor: null,                             photo: null },
  { id: 4,  name: "Trinoma",                    region: "Metro Manila", address: "TriNoma Mall, North Avenue, Quezon City",                  hours: "10:00 AM – 10:00 PM", phone: "0995 290 8164", dateEstablished: "October 2022",   tag: null,       tagColor: null,                             photo: null },
  { id: 5,  name: "Robinsons Ermita",           region: "Metro Manila", address: "Robinsons Place Manila, Ermita, Manila",                   hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8165", dateEstablished: "November 2022",  tag: null,       tagColor: null,                             photo: null },
  { id: 6,  name: "SM City Baguio",             region: "Luzon",        address: "SM City Baguio, Luneta Hill, Baguio City",                 hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8166", dateEstablished: "February 2023",  tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 7,  name: "SM City Pampanga",           region: "Luzon",        address: "SM City Pampanga, San Fernando, Pampanga",                 hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8167", dateEstablished: "April 2023",     tag: null,       tagColor: null,                             photo: null },
  { id: 8,  name: "Robinsons Naga",             region: "Luzon",        address: "Robinsons Place Naga, Naga City, Camarines Sur",           hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8168", dateEstablished: "July 2023",      tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 9,  name: "SM City Sta. Rosa",          region: "Luzon",        address: "SM City Sta. Rosa, Sta. Rosa City, Laguna",                hours: "10:00 AM – 10:00 PM", phone: "0995 290 8169", dateEstablished: "September 2023", tag: null,       tagColor: null,                             photo: null },
  { id: 10, name: "Ayala Center Cebu",          region: "Visayas",      address: "Ayala Center Cebu, Cebu Business Park, Cebu City",         hours: "10:00 AM – 10:00 PM", phone: "0995 290 8170", dateEstablished: "May 2023",       tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 11, name: "SM City Iloilo",             region: "Visayas",      address: "SM City Iloilo, Iloilo City, Iloilo",                      hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8171", dateEstablished: "August 2023",    tag: null,       tagColor: null,                             photo: null },
  { id: 12, name: "Robinsons Bacolod",          region: "Visayas",      address: "Robinsons Place Bacolod, Bacolod City, Negros Occidental", hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8172", dateEstablished: "November 2023",  tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
  { id: 13, name: "Abreeza Mall Davao",         region: "Mindanao",     address: "Abreeza Ayala Mall, J.P. Laurel Ave., Davao City",         hours: "10:00 AM – 10:00 PM", phone: "0995 290 8173", dateEstablished: "June 2023",      tag: "Popular",  tagColor: { bg: "#E8A020", text: "#fff" },  photo: null },
  { id: 14, name: "SM City Cagayan de Oro",     region: "Mindanao",     address: "SM City CDO, Limketkai Dr., Cagayan de Oro City",          hours: "10:00 AM – 9:30 PM",  phone: "0995 290 8174", dateEstablished: "September 2023", tag: null,       tagColor: null,                             photo: null },
  { id: 15, name: "NCCC Mall Zamboanga",        region: "Mindanao",     address: "NCCC Mall, Veterans Ave., Zamboanga City",                 hours: "10:00 AM – 9:00 PM",  phone: "0995 290 8175", dateEstablished: "January 2024",   tag: "New",      tagColor: { bg: "#97b64c", text: "#fff" },  photo: null },
]

const regionAccent = {
  "Metro Manila": "#97b64c",
  "Luzon":        "#62840b",
  "Visayas":      "#E8A020",
  "Mindanao":     "#b7cd7f",
}

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

// ─── LOCATION CARD ────────────────────────────────────────────────────────────

function LocationCard({ loc, index, onOpenImage }) {
  const [ref, inView] = useInView()
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const accent = regionAccent[loc.region] || "#97b64c"

  return (
    <div
      ref={ref}
      data-track-section={`Location Branch: ${loc.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        border: `1px solid ${hovered ? accent + "55" : "#e8f0dc"}`,
        boxShadow: hovered
          ? `0 20px 48px rgba(0,0,0,0.10), 0 0 0 1px ${accent}22`
          : "0 2px 12px rgba(0,0,0,0.05)",
        opacity: inView ? 1 : 0,
        transform: inView
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 50}ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${index * 50}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      {/* ── Photo area ── */}
      <button
        type="button"
        onClick={() => loc.photo && !imgError && onOpenImage?.(loc)}
        style={{
          all: "unset",
          display: "block",
          width: "100%",
          cursor: loc.photo && !imgError ? "zoom-in" : "default",
        }}
      >
      <div style={{
        position: "relative",
        height: "200px",
        backgroundColor: "#f0f5e8",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {loc.photo && !imgError ? (
          <img
            src={loc.photo}
            alt={loc.name}
            onError={() => setImgError(true)}
            draggable={false}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(145deg, ${accent}18 0%, ${accent}08 60%, #f5f8ef 100%)`,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "10px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `radial-gradient(circle, ${accent}22 1px, transparent 1px)`,
              backgroundSize: "22px 22px",
            }} />
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: `${accent}18`,
              border: `1.5px solid ${accent}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1,
            }}>
              <svg width="22" height="22" fill="none" stroke={accent} strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
            </div>
            <span style={{
              fontSize: "10px", fontWeight: 600, color: `${accent}88`,
              fontFamily: "'DM Sans', sans-serif", position: "relative", zIndex: 1,
              letterSpacing: "0.05em",
            }}>
              Photo coming soon
            </span>
            <div style={{
              position: "absolute", bottom: 0, left: "50%",
              transform: "translateX(-50%)",
              width: "60%", height: "32px",
              background: `radial-gradient(ellipse, ${accent}20 0%, transparent 70%)`,
              filter: "blur(6px)",
            }} />
          </div>
        )}

        {/* Tag badge */}
        {loc.tag && (
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            fontSize: "9px", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: "999px",
            backgroundColor: loc.tagColor?.bg || accent,
            color: loc.tagColor?.text || "#fff",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}>
            {loc.tag}
          </span>
        )}

        {/* Region chip */}
        <span style={{
          position: "absolute", top: "12px", right: "12px",
          fontSize: "9px", fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: "999px",
          backgroundColor: "rgba(255,255,255,0.92)",
          color: accent,
          border: `1px solid ${accent}30`,
          fontFamily: "'DM Sans', sans-serif",
          backdropFilter: "blur(8px)",
        }}>
          {loc.region}
        </span>

        {/* Accent line bottom of photo */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "3px",
          background: `linear-gradient(to right, ${accent}, ${accent}66)`,
          opacity: hovered ? 1 : 0.35,
          transition: "opacity 0.3s ease",
        }} />
      </div>
      </button>

      {/* ── Body ── */}
      <div style={{
        padding: "20px 20px 22px",
        display: "flex", flexDirection: "column", gap: "14px", flex: 1,
      }}>
        {/* Name */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem", fontWeight: 800,
            color: "#1e1e1e", letterSpacing: "-0.02em",
            lineHeight: 1.25, margin: 0, flex: 1,
          }}>
            {loc.facebookUrl ? (
              <a
                href={loc.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e1e1e", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline" }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}
              >
                {loc.name}
              </a>
            ) : (
              loc.name
            )}
          </h3>
        </div>

        {/* Info rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <svg style={{ flexShrink: 0, marginTop: "2px" }} width="12" height="12" fill="none" stroke={accent} strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
            </svg>
            <span style={{ fontSize: "11px", color: "#5a6a4a", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
              {loc.address}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg style={{ flexShrink: 0 }} width="12" height="12" fill="none" stroke={accent} strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
            </svg>
            <span style={{ fontSize: "11px", color: "#5a6a4a", fontFamily: "'DM Sans', sans-serif" }}>
              {loc.hours}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Locations() {
  const [allLocations, setAllLocations] = useState(STATIC_LOCATIONS)
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [heroVisible, setHeroVisible]   = useState(false)
  const [activeImage, setActiveImage]   = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data, error } = await supabase
          .from("MSlocations").select("*").order("id", { ascending: true })
        if (error) throw error
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setAllLocations(data.map(row => ({
            id: row.id,
            name: row.name,
            address: row.address ?? "",
            hours: row.hours ?? "",
            phone: row.phone ?? "",
            dateEstablished: row.date_established ? String(row.date_established) : "",
            region: row.region ?? null,
            tag: row.tag ?? null,
            tagColor: row.tag_color_bg ? { bg: row.tag_color_bg, text: row.tag_color_text || "#fff" } : null,
            photo: row.image_url || row.photo_url || null,
            facebookUrl: row.facebook_url || row.fb_link || row.fb_url || null,
          })))
        }
      } catch (e) {
        console.error("Supabase error", e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = allLocations.filter(loc => {
    const q = search.toLowerCase()
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    )
  })

  // Group by region (e.g. Bulacan, Metro Manila); null/empty → "Other"
  const groupedByRegion = filtered.reduce((acc, loc) => {
    const region = (loc.region && String(loc.region).trim()) || "Other"
    if (!acc[region]) acc[region] = []
    acc[region].push(loc)
    return acc
  }, {})
  const regionOrder = Object.keys(groupedByRegion).sort((a, b) =>
    a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b)
  )

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section data-track-section="Locations Hero" style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #f5f8ef 0%, #ffffff 60%, #fffdf5 100%)",
        padding: "140px 48px 110px",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 20% 50%, black 10%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 20% 50%, black 10%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(151,182,76,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, rgba(151,182,76,0.3), transparent)",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(14px)",
            transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}>
            <span style={{
              fontSize: "10px", fontWeight: 800, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "#62840b",
              padding: "6px 14px", borderRadius: "999px",
              backgroundColor: "rgba(151,182,76,0.1)",
              border: "1px solid rgba(151,182,76,0.22)",
              fontFamily: "'DM Sans', sans-serif",
            }}>📍 Find a Branch</span>
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "flex-end", justifyContent: "space-between", gap: "32px",
          }}>
            <div>
              <h1 style={{
                fontSize: "clamp(3rem, 6.5vw, 5.5rem)", fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 0.92,
                color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif",
                margin: "0 0 20px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "none" : "translateY(20px)",
                transition: "opacity 0.65s ease 80ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) 80ms",
              }}>
                We're All Over<br />
                <span style={{ color: "#97b64c" }}>the Philippines.</span>
              </h1>
              <p style={{
                fontSize: "0.95rem", color: "#5a6a4a", lineHeight: 1.7,
                maxWidth: "420px", margin: 0,
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "none" : "translateY(14px)",
                transition: "opacity 0.65s ease 160ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) 160ms",
              }}>
                {allLocations.length} branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop to you.
              </p>
            </div>

            <div style={{
              display: "flex", flexDirection: "column", gap: "16px",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "none" : "translateY(14px)",
              transition: "opacity 0.65s ease 220ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) 220ms",
              minWidth: "300px",
            }}>
              {/* Stats */}
              <div style={{
                display: "flex", gap: "0",
                border: "1px solid #e0ecd0", borderRadius: "14px",
                overflow: "hidden", backgroundColor: "white",
                boxShadow: "0 2px 12px rgba(151,182,76,0.07)",
              }}>
                {[
                  { v: `${allLocations.length}`, l: "Branches" },
                  { v: "4",    l: "Regions"  },
                  { v: "2022", l: "Est."      },
                ].map((s, i) => (
                  <div key={s.l} style={{
                    flex: 1, padding: "16px 12px", textAlign: "center",
                    borderRight: i < 2 ? "1px solid #e0ecd0" : "none",
                  }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 900, fontSize: "1.25rem", color: "#1e1e1e", lineHeight: 1, margin: "0 0 4px" }}>{s.v}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#97b64c", margin: 0 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", pointerEvents: "none" }}
                  fill="none" stroke="#97b64c" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search branch or city..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    paddingLeft: "44px", paddingRight: search ? "40px" : "16px",
                    paddingTop: "13px", paddingBottom: "13px",
                    borderRadius: "12px", fontSize: "0.875rem",
                    border: "1.5px solid #d0e0b0",
                    backgroundColor: "white", color: "#1e1e1e",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 2px 10px rgba(151,182,76,0.07)",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={e => e.target.style.borderColor = "#97b64c"}
                  onBlur={e => e.target.style.borderColor = "#d0e0b0"}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#97b64c", fontSize: "13px", lineHeight: 1, padding: "2px",
                  }}>✕</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CARD GRID ══════════════════════════════════════════════════════════ */}
      <section data-track-section="Branch List" style={{ backgroundColor: "#f5f8ef", padding: "56px 48px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {loading ? (
            <div style={{ display: "flex", gap: "12px", padding: "120px 0", justifyContent: "center" }}>
              {[0, 150, 300].map(d => (
                <div key={d} style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  backgroundColor: "#97b64c",
                  animation: "locBounce 1s ease infinite",
                  animationDelay: `${d}ms`,
                }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "100px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "16px", backgroundColor: "white", border: "1px solid #d0e0b0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>🔍</div>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1e1e1e", margin: 0 }}>No branches found</p>
              <p style={{ fontSize: "0.875rem", color: "#5a6a4a", margin: 0 }}>Try a different search or region.</p>
              <button onClick={() => { setSearch("") }} style={{
                marginTop: "4px", padding: "10px 24px", borderRadius: "999px",
                border: "1.5px solid #97b64c", backgroundColor: "white", color: "#62840b",
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {regionOrder.map(region => (
                <div key={region}>
                  <h2 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#1e1e1e",
                    margin: "0 0 16px",
                    paddingBottom: "8px",
                    borderBottom: "2px solid #97b64c",
                    display: "inline-block",
                  }}>
                    {region}
                  </h2>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "20px",
                  }}>
                    {groupedByRegion[region].map((loc, i) => (
                      <LocationCard
                        key={loc.id}
                        loc={loc}
                        index={i}
                        onOpenImage={setActiveImage}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {activeImage?.photo && createPortal(
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            backgroundColor: "rgba(17,24,39,0.82)",
            display: "grid",
            placeItems: "center",
            padding: "24px",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              width: "36px",
              height: "36px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <img
            src={activeImage.photo}
            alt={activeImage.name || "Location photo"}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "block",
              maxWidth: "min(1200px, 94vw)",
              maxHeight: "88vh",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              backgroundColor: "#fff",
            }}
          />
        </div>,
        document.body
      )}

      {/* ══ COMING TO YOUR CITY ════════════════════════════════════════════════ */}
      <section data-track-section="Locations CTA" style={{
        backgroundColor: "#ffffff", borderTop: "1px solid #e8f0dc",
        padding: "80px 48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(151,182,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div style={{
          maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1,
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: "40px",
        }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#97b64c", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
              Expanding Nationwide
            </p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#1e1e1e", margin: "0 0 12px", fontFamily: "'DM Sans', sans-serif" }}>
              Don't see your city?<br /><span style={{ color: "#97b64c" }}>We're coming there.</span>
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#5a6a4a", maxWidth: "380px", lineHeight: 1.7, margin: 0 }}>
              New branches open every quarter. Check back soon — or bring Milkshop to your city yourself.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link to="/franchise#inquiry" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem",
              padding: "14px 28px", borderRadius: "999px",
              backgroundColor: "#E8A020", color: "#fff", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(232,160,32,0.28)", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(232,160,32,0.35)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,160,32,0.28)" }}
            >Open a Branch →</Link>
            <Link to="/franchise" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
              padding: "14px 28px", borderRadius: "999px",
              border: "1.5px solid #d0e0b0", color: "#62840b",
              textDecoration: "none", backgroundColor: "transparent", transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#97b64c"; e.currentTarget.style.backgroundColor = "#f5f8ef" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0e0b0"; e.currentTarget.style.backgroundColor = "transparent" }}
            >Learn About Franchising</Link>
          </div>
        </div>
      </section>

     

      <style>{`
        @keyframes locBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        input::placeholder { color: #a0b080; }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
    </main>
  )
}