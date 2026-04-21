import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

const STATIC_LOCATIONS = [
  {
    id: 1,
    name: "Milkshop PH - Guiguinto",
    address: "MacArthur Highway, Guiguinto, Bulacan",
    lat: 14.8392246,
    lng: 120.8599318
  },
  {
    id: 2,
    name: "Milkshop PH - Tabang Guiguinto",
    address: "Tabang, Guiguinto, Bulacan",
    lat: 14.8258097,
    lng: 120.8658063
  },
  {
    id: 3,
    name: "Milkshop PH - GD Plaza Guiguinto",
    address: "Front of WalterMart Guiguinto",
    lat: 14.8284535,
    lng: 120.8743037
  },
  {
    id: 4,
    name: "Milkshop PH - Malolos Convention",
    address: "Malolos, Bulacan",
    lat: 14.8588102,
    lng: 120.8108367
  },
  {
    id: 5,
    name: "Milkshop PH - Vista Mall Malolos",
    address: "Vista Mall Malolos",
    lat: 14.8755907,
    lng: 120.7973621
  },
  {
    id: 6,
    name: "Milkshop PH - MacArthur Hwy Malolos",
    address: "Front of WalterMart Malolos",
    lat: 14.8715939,
    lng: 120.7990442
  },
  {
    id: 7,
    name: "Milkshop PH - Marilao",
    address: "Marilao, Bulacan",
    lat: 14.769961,
    lng: 120.941103
  },
  {
    id: 8,
    name: "Milkshop PH - Parada Valenzuela",
    address: "Parada, Valenzuela City",
    lat: 14.6962913,
    lng: 120.9969947
  },
  {
    id: 9,
    name: "Milkshop PH - SM Valenzuela",
    address: "SM City Valenzuela",
    lat: 14.6856445,
    lng: 120.9771159
  },
  {
    id: 10,
    name: "Milkshop PH - Starmall SJDM",
    address: "Starmall SJDM, Bulacan",
    lat: 14.8139973,
    lng: 121.0707105
  }
];

const regionAccent = {
  "Metro Manila": "#97b64c",
  "Luzon":        "#62840b",
  "Visayas":      "#E8A020",
  "Mindanao":     "#b7cd7f",
}

const REGION_ORDER = ["All", "Metro Manila", "Luzon", "Visayas", "Mindanao"]

function BranchPanel({ loc, onClose }) {
  const accent = regionAccent[loc.region] || "#97b64c"
  return (
    <div style={{
      position: "absolute", top: 20, left: 20,
      width: "clamp(270px, 28vw, 340px)",
      zIndex: 1000,
      background: "#ffffff",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)",
      border: "1px solid rgba(151,182,76,0.2)",
      animation: "panelIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
    }}>
      <div style={{ position: "relative", height: 170, background: `${accent}10`, overflow: "hidden" }}>
        {loc.photo ? (
          <img src={loc.photo} alt={loc.name} draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: `linear-gradient(145deg, ${accent}18, ${accent}06)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" fill="none" stroke={accent} strokeWidth="1.6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
            </svg>
          </div>
        )}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 5 }}>
          {loc.tag && (
            <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: loc.tagColor?.bg || accent, color: loc.tagColor?.text || "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>{loc.tag}</span>
          )}
          <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: accent, border: `1px solid ${accent}30`, fontFamily: "'DM Sans', sans-serif", backdropFilter: "blur(6px)" }}>{loc.region}</span>
        </div>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", fontSize: 13, color: "#4a5568", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} aria-label="Close">×</button>
      </div>

      <div style={{ padding: "16px 18px 18px" }}>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1e1e1e", letterSpacing: "-0.02em", margin: "0 0 12px", lineHeight: 1.2 }}>{loc.name}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: "📍", text: loc.address },
            { icon: "🕐", text: loc.hours },
            loc.phone && { icon: "📞", text: loc.phone },
            loc.dateEstablished && { icon: "📅", text: `Est. ${loc.dateEstablished}` },
          ].filter(Boolean).map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontSize: 11, marginTop: 1, flexShrink: 0 }}>{row.icon}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#5a6a4a", lineHeight: 1.55 }}>{row.text}</span>
            </div>
          ))}
        </div>
        {loc.facebookUrl && (
          <a href={loc.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "8px 16px", borderRadius: 999, background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, boxShadow: `0 4px 14px ${accent}35`, transition: "all 0.2s ease" }}>View Page →</a>
        )}
      </div>
    </div>
  )
}

export default function Locations() {
  const [allLocations, setAllLocations] = useState(STATIC_LOCATIONS)
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [heroVisible, setHeroVisible]   = useState(false)
  const [selectedLoc, setSelectedLoc]   = useState(null)
  const [activeRegion, setActiveRegion] = useState("All")
  const [mapReady, setMapReady]         = useState(false)
  const mapContainerRef                 = useRef(null)
  const leafletInstanceRef              = useRef(null)
  const markersRef                      = useRef([])

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t) }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data, error } = await supabase.from("MSlocations").select("*").order("id", { ascending: true })
        if (error) throw error
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const staticById = new Map(STATIC_LOCATIONS.map((loc) => [loc.id, loc]))
          const staticByName = new Map(STATIC_LOCATIONS.map((loc) => [loc.name, loc]))
          setAllLocations(data.map(row => ({
            ...(staticById.get(row.id) || staticByName.get(row.name) || {}),
            id: row.id, name: row.name, address: row.address ?? "", hours: row.hours ?? "",
            phone: row.phone ?? "", dateEstablished: row.date_established ? String(row.date_established) : "",
            region: row.region ?? null, tag: row.tag ?? null,
            tagColor: row.tag_color_bg ? { bg: row.tag_color_bg, text: row.tag_color_text || "#fff" } : null,
            photo: row.image_url || row.photo_url || row.photo || null,
            facebookUrl: row.facebook_url || row.fb_link || row.fb_url || null,
            lat: Number.isFinite(parseFloat(row.lat || row.latitude))
              ? parseFloat(row.lat || row.latitude)
              : (staticById.get(row.id)?.lat ?? staticByName.get(row.name)?.lat ?? null),
            lng: Number.isFinite(parseFloat(row.lng || row.longitude))
              ? parseFloat(row.lng || row.longitude)
              : (staticById.get(row.id)?.lng ?? staticByName.get(row.name)?.lng ?? null),
          })))
        }
      } catch (e) { console.error("Supabase error", e) }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (leafletInstanceRef.current || !mapContainerRef.current) return

    function loadCSS() {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }
    }

    function initMap() {
      const L = window.L
      if (!L || !mapContainerRef.current || leafletInstanceRef.current) return
      const map = L.map(mapContainerRef.current, { center: [12.5, 122.5], zoom: 5, zoomControl: false, attributionControl: true, scrollWheelZoom: false })
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { attribution: '© <a href="https://www.openstreetmap.org/">OSM</a> © <a href="https://carto.com/">CARTO</a>', maxZoom: 19 }).addTo(map)
      L.control.zoom({ position: "bottomright" }).addTo(map)
      leafletInstanceRef.current = map
      setMapReady(true)
      setTimeout(() => {
        map.flyToBounds(
          [
            [14.79, 120.88], // Bulacan / Bulakan area
            [14.70, 120.97], // Valenzuela City
          ],
          { padding: [80, 80], maxZoom: 13, duration: 1.8 }
        )
      }, 600)
    }

    loadCSS()
    if (window.L) { initMap() } else {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => { if (leafletInstanceRef.current) { leafletInstanceRef.current.remove(); leafletInstanceRef.current = null; markersRef.current = [] } }
  }, [])

  useEffect(() => {
    if (!mapReady || !leafletInstanceRef.current) return
    const L = window.L
    const map = leafletInstanceRef.current
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    allLocations.forEach(loc => {
      const lat = parseFloat(loc.lat), lng = parseFloat(loc.lng)
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return
      const accent = regionAccent[loc.region] || "#97b64c"
      const cityFromAddress = (loc.address || "").split(",").map(s => s.trim()).filter(Boolean)
      const city = cityFromAddress.length > 1 ? cityFromAddress[cityFromAddress.length - 2] : (loc.region || "")
      const pinLabel = `${loc.name}${city ? ` • ${city}` : ""}`
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;width:36px;height:44px;cursor:pointer;">
          <div style="position:absolute;left:50%;bottom:44px;transform:translateX(-50%);max-width:170px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,0.95);border:1px solid ${accent}50;color:#1e1e1e;font:700 8px/1.25 'DM Sans',sans-serif;letter-spacing:0.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 3px 10px rgba(0,0,0,0.14);">${pinLabel}</div>
          <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:linear-gradient(135deg,${accent},${accent}bb);border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,0.18),0 0 0 5px ${accent}28;display:flex;align-items:center;justify-content:center;">
            <div style="transform:rotate(45deg);width:14px;height:14px;border-radius:50%;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.2);">
              <img src="/milkshop-logo.png" alt="Milkshop" style="width:11px;height:11px;object-fit:contain;display:block;" />
            </div>
          </div>
          ${loc.tag ? `<span style="position:absolute;top:-9px;right:-10px;background:${loc.tagColor?.bg || accent};color:${loc.tagColor?.text || "#fff"};font-size:7px;font-weight:800;letter-spacing:0.06em;padding:2px 5px;border-radius:999px;font-family:'DM Sans',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.18);white-space:nowrap;">${loc.tag}</span>` : ""}
        </div>`,
        iconSize: [36, 44], iconAnchor: [18, 44],
      })
      const marker = L.marker([lat, lng], { icon }).addTo(map).on("click", () => { setSelectedLoc(loc); map.flyTo([lat, lng], 14, { duration: 1.3, easeLinearity: 0.28 }) })
      markersRef.current.push(marker)
    })
  }, [mapReady, allLocations])

  const flyTo = useCallback((loc) => {
    const map = leafletInstanceRef.current
    if (!map || !loc.lat) return
    map.flyTo([parseFloat(loc.lat), parseFloat(loc.lng)], 14, { duration: 1.2, easeLinearity: 0.28 })
  }, [])

  const filtered = allLocations.filter(loc => {
    const q = search.toLowerCase()
    return (loc.name.toLowerCase().includes(q) || loc.address.toLowerCase().includes(q)) && (activeRegion === "All" || loc.region === activeRegion)
  })

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes locBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes panelIn    { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes orbFloat   { 0%,100%{transform:translateY(0) scale(1);opacity:0.5} 50%{transform:translateY(-16px) scale(1.06);opacity:0.9} }
        .loc-a1{opacity:0;animation:heroFadeUp 0.6s ease forwards;animation-delay:0.1s}
        .loc-a2{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.25s}
        .loc-a3{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.4s}
        .loc-a4{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.55s}
        .loc-a5{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.65s}
        input::placeholder{color:#a0b080}
        *::-webkit-scrollbar{display:none}
        *{scrollbar-width:none}
        .leaflet-control-attribution{font-size:9px!important;opacity:0.45!important}
        .leaflet-attribution-flag{display:none!important}
        .leaflet-control-zoom{border:1px solid rgba(151,182,76,0.28)!important;border-radius:12px!important;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.07)!important}
        .leaflet-control-zoom a{color:#62840b!important;font-weight:700!important;background:#fff!important}
        .leaflet-control-zoom a:hover{background:rgba(151,182,76,0.1)!important}
      `}</style>

      {/* HERO */}
      <section data-track-section="Locations Hero" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(158deg, #f3f9ea 0%, #ffffff 52%, #eef6e4 100%)", padding: "clamp(110px,15vw,170px) 48px clamp(88px,11vw,128px)" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.2) 1.5px, transparent 1.5px)", backgroundSize: "34px 34px", maskImage: "radial-gradient(ellipse at 12% 55%, black 5%, transparent 58%)", WebkitMaskImage: "radial-gradient(ellipse at 12% 55%, black 5%, transparent 58%)" }} />
        <div style={{ position: "absolute", right: "-4%", top: "15%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(151,182,76,0.09) 0%, transparent 68%)", filter: "blur(18px)", pointerEvents: "none", animation: "orbFloat 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", right: "7%", top: "50%", transform: "translateY(-50%)", width: "min(400px,48vw)", height: "min(400px,48vw)", borderRadius: "50%", border: "1px solid rgba(151,182,76,0.09)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(151,182,76,0.28), transparent)" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="loc-a1" style={{ marginBottom: 30 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "10px", fontWeight: 800, letterSpacing: "0.26em", textTransform: "uppercase", color: "#62840b", padding: "7px 16px", borderRadius: 999, background: "rgba(151,182,76,0.08)", border: "1px solid rgba(151,182,76,0.22)", fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#97b64c", boxShadow: "0 0 0 3px rgba(151,182,76,0.22)", display: "inline-block" }} />
              Find a Branch
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 44 }}>
            <div style={{ maxWidth: 540 }}>
              <h1 className="loc-a2" style={{ fontSize: "clamp(3.2rem,7.5vw,6.2rem)", fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 0.88, color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif", margin: "0 0 26px" }}>
                We're All Over<br />
                <span style={{ background: "linear-gradient(135deg, #62840b 0%, #97b64c 55%, #b7cd7f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>the Philippines.</span>
              </h1>
              <p className="loc-a3" style={{ fontSize: "0.95rem", color: "#5a6a4a", lineHeight: 1.75, maxWidth: "400px", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {allLocations.length} branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop to you.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 300 }}>
              <div className="loc-a4" style={{ display: "flex", gap: 0, border: "1px solid #e0ecd0", borderRadius: 16, overflow: "hidden", background: "white", boxShadow: "0 4px 20px rgba(151,182,76,0.08)" }}>
                {[{ v: `${allLocations.length}`, l: "Branches" }, { v: "4", l: "Regions" }, { v: "2022", l: "Est." }].map((s, i) => (
                  <div key={s.l} style={{ flex: 1, padding: "18px 12px", textAlign: "center", borderRight: i < 2 ? "1px solid #e0ecd0" : "none" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontWeight: 900, fontSize: "1.3rem", color: "#1e1e1e", lineHeight: 1, margin: "0 0 4px" }}>{s.v}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#97b64c", margin: 0 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              <div className="loc-a5" style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, pointerEvents: "none" }} fill="none" stroke="#97b64c" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
                </svg>
                <input type="text" placeholder="Search branch or city..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", boxSizing: "border-box", paddingLeft: 44, paddingRight: search ? 40 : 16, paddingTop: 14, paddingBottom: 14, borderRadius: 12, fontSize: "0.875rem", border: "1.5px solid #d0e0b0", background: "white", color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 2px 12px rgba(151,182,76,0.07)", outline: "none", transition: "border-color 0.2s ease, box-shadow 0.2s ease" }} onFocus={e => { e.target.style.borderColor = "#97b64c"; e.target.style.boxShadow = "0 0 0 3px rgba(151,182,76,0.12)" }} onBlur={e => { e.target.style.borderColor = "#d0e0b0"; e.target.style.boxShadow = "0 2px 12px rgba(151,182,76,0.07)" }} />
                {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#97b64c", fontSize: 13, lineHeight: 1, padding: "2px" }}>✕</button>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section data-track-section="Branch Map" style={{ backgroundColor: "#f5f8ef", padding: "52px 48px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#7a8a6a", marginRight: 4 }}>Region:</span>
            {REGION_ORDER.map(r => {
              const acc = r === "All" ? "#97b64c" : (regionAccent[r] || "#97b64c")
              const isActive = activeRegion === r
              return (
                <button key={r} type="button" onClick={() => setActiveRegion(r)} style={{ all: "unset", cursor: "pointer", padding: "6px 16px", borderRadius: 999, fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, background: isActive ? acc : "white", color: isActive ? "#fff" : "#5a6a4a", border: `1.5px solid ${isActive ? acc : "#d0e0b0"}`, boxShadow: isActive ? `0 4px 14px ${acc}35` : "none", transition: "all 0.25s ease" }}>{r}</button>
              )
            })}
            <span style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "10px", fontWeight: 700, color: "#97b64c", letterSpacing: "0.1em" }}>{filtered.length} locations</span>
          </div>

          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(151,182,76,0.18)", boxShadow: "0 24px 80px rgba(98,132,11,0.09), 0 4px 16px rgba(0,0,0,0.04)", height: "clamp(500px,66vh,720px)", background: "#eef4e4" }}>
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

            {!mapReady && (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #f3f9ea, #eef5e0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, zIndex: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {[0, 150, 300].map(d => <div key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: "#97b64c", animation: "locBounce 1s ease infinite", animationDelay: `${d}ms` }} />)}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#62840b", fontWeight: 600, letterSpacing: "0.12em" }}>Mapping branches…</p>
              </div>
            )}

            {selectedLoc && <BranchPanel loc={selectedLoc} onClose={() => setSelectedLoc(null)} />}

            <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 500, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(151,182,76,0.16)", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#62840b", margin: "0 0 8px" }}>Regions</p>
              {Object.entries(regionAccent).map(([name, color]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4a5568", fontWeight: 600 }}>{name}</span>
                </div>
              ))}
            </div>

            {mapReady && !selectedLoc && (
              <div style={{ position: "absolute", top: 16, right: 16, zIndex: 500, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(12px)", borderRadius: 999, padding: "8px 16px", border: "1px solid rgba(151,182,76,0.18)", boxShadow: "0 4px 14px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12 }}>📍</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: "#4a5568" }}>Click a pin to explore</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: 28 }}>
            {loading ? (
              <div style={{ display: "flex", gap: 10, justifyContent: "center", padding: "32px 0" }}>
                {[0, 150, 300].map(d => <div key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: "#97b64c", animation: "locBounce 1s ease infinite", animationDelay: `${d}ms` }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <p style={{ fontWeight: 800, fontSize: "1rem", color: "#1e1e1e", margin: 0 }}>No branches found</p>
                <button onClick={() => { setSearch(""); setActiveRegion("All") }} style={{ padding: "8px 22px", borderRadius: 999, border: "1.5px solid #97b64c", background: "white", color: "#62840b", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Clear filters</button>
              </div>
            ) : (
              <div style={{
                borderTop: "1px solid rgba(151,182,76,0.24)",
                paddingTop: 14,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}>
                  <p style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#5d7040",
                  }}>
                    Branch Directory
                  </p>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#7d9462",
                    letterSpacing: "0.08em",
                  }}>
                    {filtered.length} listed
                  </span>
                </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 9 }}>
                {filtered.map(loc => {
                  const accent = regionAccent[loc.region] || "#97b64c"
                  const isSelected = selectedLoc?.id === loc.id
                  return (
                    <button key={loc.id} type="button" onClick={() => { setSelectedLoc(loc); flyTo(loc) }}
                      style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 11, background: "#ffffff", border: `1px solid ${isSelected ? accent : "rgba(151,182,76,0.2)"}`, boxShadow: isSelected ? `inset 0 0 0 1px ${accent}55` : "none", transition: "border-color 0.2s ease, box-shadow 0.2s ease" }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = `${accent}70` } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(151,182,76,0.2)" } }}
                    >
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: accent, flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1e1e1e", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>{loc.name}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#75856a", margin: "1px 0 0", fontWeight: 500 }}>{loc.region}</p>
                      </div>
                      {loc.tag && <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "3px 7px", borderRadius: 999, background: "rgba(151,182,76,0.13)", color: "#5f7b1a", flexShrink: 0, border: "1px solid rgba(151,182,76,0.25)" }}>{loc.tag}</span>}
                    </button>
                  )
                })}
              </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-track-section="Locations CTA" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e8f0dc", padding: "96px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(151,182,76,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.045) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div style={{ position: "absolute", left: "-5%", top: "50%", transform: "translateY(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(151,182,76,0.07), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: "5%", bottom: "-20%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(183,205,127,0.09), transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ height: 2, width: 36, background: "linear-gradient(90deg, #62840b, #97b64c)", borderRadius: 2 }} />
              <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#97b64c", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>Expanding Nationwide</p>
            </div>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#1e1e1e", margin: "0 0 16px", fontFamily: "'DM Sans', sans-serif" }}>
              Don't see your city?<br />
              <span style={{ background: "linear-gradient(135deg, #62840b, #97b64c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>We're coming there.</span>
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#5a6a4a", maxWidth: "380px", lineHeight: 1.75, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              New branches open every quarter. Check back soon — or bring Milkshop to your city yourself.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link to="/franchise#inquiry" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.875rem", padding: "15px 30px", borderRadius: 999, background: "linear-gradient(135deg, #E8A020, #cf8e18)", color: "#fff", textDecoration: "none", boxShadow: "0 6px 24px rgba(232,160,32,0.32)", transition: "all 0.25s ease", display: "inline-block" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(232,160,32,0.42)" }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,160,32,0.32)" }}>Open a Branch →</Link>
            <Link to="/franchise" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem", padding: "15px 30px", borderRadius: 999, border: "1.5px solid #d0e0b0", color: "#62840b", textDecoration: "none", background: "transparent", transition: "all 0.25s ease", display: "inline-block" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#97b64c"; e.currentTarget.style.background = "#f5f8ef"; e.currentTarget.style.transform = "translateY(-2px)" }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#d0e0b0"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)" }}>Learn About Franchising</Link>
          </div>
        </div>
      </section>
    </main>
  )
}