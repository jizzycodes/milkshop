import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

const STATIC_LOCATIONS = [
  {
    id: 1,
    name: "Milkshop PH - North Centrum Guiguinto",
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
          const pickNearestStatic = (lat, lng) => {
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
            let best = null
            let bestDist = Infinity
            for (const loc of STATIC_LOCATIONS) {
              const dLat = lat - loc.lat
              const dLng = lng - loc.lng
              const dist = dLat * dLat + dLng * dLng
              if (dist < bestDist) {
                bestDist = dist
                best = loc
              }
            }
            return best
          }
          setAllLocations(data.map(row => ({
            ...(() => {
              const parsedLat = parseFloat(row.lat || row.latitude)
              const parsedLng = parseFloat(row.lng || row.longitude)
              return (
                pickNearestStatic(parsedLat, parsedLng) ||
                staticById.get(row.id) ||
                staticByName.get(row.name) ||
                {}
              )
            })(),
            id: row.id,
            name: (() => {
              const parsedLat = parseFloat(row.lat || row.latitude)
              const parsedLng = parseFloat(row.lng || row.longitude)
              const nearest = pickNearestStatic(parsedLat, parsedLng)
              return nearest?.name || staticById.get(row.id)?.name || staticByName.get(row.name)?.name || row.name || "Milkshop Branch"
            })(),
            address: (() => {
              const parsedLat = parseFloat(row.lat || row.latitude)
              const parsedLng = parseFloat(row.lng || row.longitude)
              const nearest = pickNearestStatic(parsedLat, parsedLng)
              return nearest?.address || row.address || staticById.get(row.id)?.address || staticByName.get(row.name)?.address || ""
            })(),
            hours: row.hours ?? "",
            phone: row.phone ?? "", dateEstablished: row.date_established ? String(row.date_established) : "",
            region: row.region ?? null, tag: row.tag ?? null,
            tagColor: row.tag_color_bg ? { bg: row.tag_color_bg, text: row.tag_color_text || "#fff" } : null,
            photo: row.image_url || row.photo_url || row.photo || null,
            facebookUrl: row.facebook_url || row.fb_link || row.fb_url || null,
            lat: (() => {
              const v = parseFloat(row.lat ?? row.latitude ?? row.Lat ?? row.LAT)
              if (Number.isFinite(v)) return v
              const nearest = pickNearestStatic(
                parseFloat(row.lat ?? row.latitude),
                parseFloat(row.lng ?? row.longitude)
              )
              return nearest?.lat ?? staticById.get(row.id)?.lat ?? staticByName.get(row.name)?.lat ?? null
            })(),
            lng: (() => {
              const v = parseFloat(row.lng ?? row.longitude ?? row.Lng ?? row.LNG)
              if (Number.isFinite(v)) return v
              const nearest = pickNearestStatic(
                parseFloat(row.lat ?? row.latitude),
                parseFloat(row.lng ?? row.longitude)
              )
              return nearest?.lng ?? staticById.get(row.id)?.lng ?? staticByName.get(row.name)?.lng ?? null
            })(),
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
       // Apple-like clean map style (Carto Voyager)
       L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)
 
      L.control.zoom({ position: "bottomleft" }).addTo(map)
      leafletInstanceRef.current = map
      setMapReady(true)
 
      // Step 1: start zoomed out on Philippines
      // Step 2: fly into Bulacan (center of 14.59–15.37°N, 120.61–121.42°E)
      setTimeout(() => {
        map.flyTo([14.98, 121.01], 10, {
          duration: 2.8,
          easeLinearity: 0.18,
        })
      }, 700)
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
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
      const accent = regionAccent[loc.region] || "#97b64c"
      const cityFromAddress = (loc.address || "").split(",").map(s => s.trim()).filter(Boolean)
      const city = cityFromAddress.length > 1 ? cityFromAddress[cityFromAddress.length - 2] : (loc.region || "")
      const pinLabel = `${loc.name}${city ? ` • ${city}` : ""}`
      const icon = L.divIcon({
        className: "",
        html: `
        <div class="ms-pin-wrap" style="position:relative;width:40px;height:50px;cursor:pointer;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.24));">
          <div class="ms-pin-body" style="
            width:38px;height:38px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            background:linear-gradient(135deg,${accent} 0%,${accent}dd 100%);
            border:2.5px solid rgba(255,255,255,0.95);
            display:flex;align-items:center;justify-content:center;
            transition:all 0.25s ease;
          ">
            <img src="/milkshop-logo.png" alt="Milkshop" style="transform:rotate(45deg);width:18px;height:18px;object-fit:contain;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2));" />
          </div>
          ${loc.tag ? `<span style="
            position:absolute;top:-10px;right:-10px;
            background:${loc.tagColor?.bg || accent};
            color:${loc.tagColor?.text || '#fff'};
            font-size:7px;font-weight:800;letter-spacing:0.05em;
            padding:2px 5px;border-radius:999px;
            font-family:'DM Sans',sans-serif;
            box-shadow:0 2px 6px rgba(0,0,0,0.2);
            white-space:nowrap;
          ">${loc.tag}</span>` : ""}
          ${loc.tag === "Flagship" ? `<div style="
            position:absolute;top:-6px;left:-6px;
            width:42px;height:42px;border-radius:50%;
            border:1.5px solid ${accent};
            animation:pinRipple 2s ease-out infinite;
            pointer-events:none;
          "></div>` : ""}
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      })
      const marker = L.marker([lat, lng], { icon }).addTo(map)
      .bindTooltip(loc.name, {
        permanent: true,
        direction: "top",
        offset: [0, -44],
        className: "ms-label",
      })
      .on("click", () => { setSelectedLoc(loc); map.flyTo([lat, lng], 17, { duration: 1.3, easeLinearity: 0.28 }) })
    })
  }, [mapReady, allLocations])

  const flyTo = useCallback((loc) => {
    const map = leafletInstanceRef.current
    if (!map || !loc.lat) return
    map.flyTo([parseFloat(loc.lat), parseFloat(loc.lng)], 17, { duration: 1.2, easeLinearity: 0.28 })
  }, [])
  const zoomIn = useCallback(() => leafletInstanceRef.current?.zoomIn(), [])
  const zoomOut = useCallback(() => leafletInstanceRef.current?.zoomOut(), [])

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

        @media (max-width: 900px){
          .loc-hero{padding: 92px 16px 56px !important}
          .loc-hero-content{gap: 22px !important}
          .loc-hero-right{min-width: 100% !important}
          .loc-map-section{padding: 36px 12px 56px !important}
          .loc-map-header{gap: 14px !important; margin-bottom: 16px !important}
          .loc-map-layout{
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            border-radius: 18px !important;
          }
          .loc-map-pane{
            min-height: 62vh !important;
          }
          .loc-sidebar{
            border-left: none !important;
            border-top: 1px solid rgba(151,182,76,0.15) !important;
            max-height: 44vh !important;
          }
          .loc-selected-card{
            left: 10px !important;
            right: 10px !important;
            bottom: 10px !important;
            width: auto !important;
          }
          .loc-legend{
            display: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="loc-hero" data-track-section="Locations Hero" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(158deg, #f3f9ea 0%, #ffffff 52%, #eef6e4 100%)", padding: "clamp(110px,15vw,170px) 48px clamp(88px,11vw,128px)" }}>
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

          <div className="loc-hero-content" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 44 }}>
            <div style={{ maxWidth: 540 }}>
              <h1 className="loc-a2" style={{ fontSize: "clamp(3.2rem,7.5vw,6.2rem)", fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 0.88, color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif", margin: "0 0 26px" }}>
                We're All Over<br />
                <span style={{ background: "linear-gradient(135deg, #62840b 0%, #97b64c 55%, #b7cd7f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>the Philippines.</span>
              </h1>
              <p className="loc-a3" style={{ fontSize: "0.95rem", color: "#5a6a4a", lineHeight: 1.75, maxWidth: "400px", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {allLocations.length} branches nationwide — from Metro Manila to Mindanao. Find the nearest Milkshop to you.
              </p>
            </div>

            <div className="loc-hero-right" style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 300 }}>
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

    {/* ══ MAP SECTION — PREMIUM REDESIGN ══ */}
    <section className="loc-map-section" data-track-section="Branch Map" style={{
        backgroundColor: "#f5f8ef",
        padding: "64px 48px 88px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ambient background */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(151,182,76,0.07), transparent 65%)",
        }} />

        <style>{`
          @keyframes mapFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pinDrop     { 0%{opacity:0;transform:translateY(-20px) scale(0.6)} 60%{transform:translateY(4px) scale(1.1)} 100%{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes pinRipple   { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2.6);opacity:0} }
          @keyframes sidebarIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
          @keyframes locBounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          @keyframes shimmerBar  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

          .ms-pin-wrap:hover .ms-pin-body { transform: scale(1.15) translateY(-3px); filter: brightness(1.1); }
          .ms-branch-row { transition: all 0.22s ease; }
          .ms-branch-row:hover { background: rgba(151,182,76,0.07) !important; transform: translateX(3px); }
          .ms-branch-row.selected { background: white !important; }

          .ms-label {
  background: white;
  border: 1px solid rgba(151,182,76,0.3);
  border-radius: 8px;
  padding: 3px 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  white-space: nowrap;
}
.ms-label::before { display: none; }

          .leaflet-tile-pane { filter: saturate(0.9) brightness(1.02); }
          .leaflet-control-zoom { border: 1px solid rgba(151,182,76,0.3) !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
          .leaflet-control-zoom a { color: #62840b !important; font-weight: 800 !important; background: rgba(255,255,255,0.95) !important; height: 34px !important; line-height: 34px !important; width: 34px !important; font-size: 16px !important; }
          .leaflet-control-zoom a:hover { background: rgba(151,182,76,0.12) !important; }
          .leaflet-control-attribution { font-size: 8px !important; opacity: 0.4 !important; background: transparent !important; }
          .leaflet-attribution-flag { display: none !important; }
          .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
        `}</style>

        <div style={{ maxWidth: "1300px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Section header ── */}
          <div className="loc-map-header" style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "flex-end", justifyContent: "space-between",
            gap: 20, marginBottom: 28,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ height: 2, width: 32, background: "linear-gradient(90deg, #62840b, #97b64c)", borderRadius: 2 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase", color: "#62840b" }}>
                  Our Branches
                </span>
              </div>
              <h2 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 900, letterSpacing: "-0.04em",
                color: "#1e1e1e", margin: 0, lineHeight: 1.0,
              }}>
                Find Us{" "}
                <span style={{
                  background: "linear-gradient(135deg, #62840b, #97b64c)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>Nationwide.</span>
              </h2>
            </div>

            {/* Region filter pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {REGION_ORDER.map(r => {
                const acc = r === "All" ? "#97b64c" : (regionAccent[r] || "#97b64c")
                const isActive = activeRegion === r
                return (
                  <button key={r} type="button" onClick={() => setActiveRegion(r)} style={{
                    all: "unset", cursor: "pointer",
                    padding: "6px 14px", borderRadius: 999,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700,
                    background: isActive ? acc : "rgba(255,255,255,0.8)",
                    color: isActive ? "#fff" : "#5a6a4a",
                    border: `1.5px solid ${isActive ? acc : "#d0e0b0"}`,
                    boxShadow: isActive ? `0 4px 14px ${acc}40` : "none",
                    transition: "all 0.25s ease",
                    backdropFilter: "blur(8px)",
                  }}>{r}</button>
                )
              })}
            </div>
          </div>

          {/* ── Main content: map + sidebar ── */}
          <div className="loc-map-layout" style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 0,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 32px 100px rgba(98,132,11,0.12), 0 8px 24px rgba(0,0,0,0.06)",
            border: "1px solid rgba(151,182,76,0.2)",
            minHeight: "clamp(520px, 68vh, 740px)",
          }}>

            {/* MAP */}
            <div className="loc-map-pane" style={{ position: "relative", background: "#e8f0da", minHeight: "clamp(400px, 60vh, 700px)" }}>
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
              {mapReady && (
                <div style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  zIndex: 700,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  <button type="button" onClick={zoomIn} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(151,182,76,0.35)", background: "rgba(255,255,255,0.95)", color: "#62840b", fontSize: 20, fontWeight: 800, lineHeight: "1", cursor: "pointer" }}>+</button>
                  <button type="button" onClick={zoomOut} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(151,182,76,0.35)", background: "rgba(255,255,255,0.95)", color: "#62840b", fontSize: 20, fontWeight: 800, lineHeight: "1", cursor: "pointer" }}>-</button>
                </div>
              )}

              {/* Loading overlay */}
              {!mapReady && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(160deg, #f0f7e6, #e8f3d8)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 16,
                  zIndex: 20,
                }}>
                  <div style={{ position: "relative", width: 56, height: 56 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(151,182,76,0.2)", borderTopColor: "#97b64c", animation: "spin 0.9s linear infinite" }} />
                    <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 20 }}>📍</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#62840b", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Locating branches…
                  </p>
                  {/* Shimmer bar */}
                  <div style={{
                    width: 120, height: 3, borderRadius: 999, overflow: "hidden",
                    background: "rgba(151,182,76,0.15)",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 999,
                      background: "linear-gradient(90deg, transparent, #97b64c, transparent)",
                      backgroundSize: "200% 100%",
                      animation: "shimmerBar 1.4s ease infinite",
                    }} />
                  </div>
                </div>
              )}

              {/* Branch detail card — floats over map */}
              {selectedLoc && (
                <div className="loc-selected-card" style={{
                  position: "absolute", bottom: 20, left: 20,
                  width: "clamp(260px, 32vw, 320px)",
                  zIndex: 1000,
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(151,182,76,0.25)",
                  animation: "sidebarIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                }}>
                  {/* Image */}
                  {selectedLoc.photo ? (
                    <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
                      <img src={selectedLoc.photo} alt={selectedLoc.name} draggable={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${regionAccent[selectedLoc.region] || "#97b64c"}, #b7cd7f)` }} />
                    </div>
                  ) : (
                    <div style={{
                      height: 8,
                      background: `linear-gradient(90deg, ${regionAccent[selectedLoc.region] || "#97b64c"}, #b7cd7f)`,
                    }} />
                  )}

                  <div style={{ padding: "14px 16px 16px" }}>
                    {/* Tags row */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                      {selectedLoc.tag && (
                        <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: selectedLoc.tagColor?.bg || "#97b64c", color: selectedLoc.tagColor?.text || "#fff", fontFamily: "'DM Sans', sans-serif" }}>
                          {selectedLoc.tag}
                        </span>
                      )}
                      <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, background: "rgba(151,182,76,0.1)", color: "#62840b", border: "1px solid rgba(151,182,76,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
                        {selectedLoc.region}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#1e1e1e", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                      {selectedLoc.name}
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { icon: "📍", text: selectedLoc.address },
                        { icon: "🕐", text: selectedLoc.hours },
                        selectedLoc.phone && { icon: "📞", text: selectedLoc.phone },
                        selectedLoc.dateEstablished && { icon: "📅", text: `Est. ${selectedLoc.dateEstablished}` },
                      ].filter(Boolean).map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                          <span style={{ fontSize: 10, marginTop: 1, flexShrink: 0 }}>{row.icon}</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#5a6a4a", lineHeight: 1.5 }}>{row.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Close */}
                  <button type="button" onClick={() => setSelectedLoc(null)} style={{
                    position: "absolute", top: 10, right: 10,
                    width: 24, height: 24, borderRadius: "50%",
                    background: "rgba(255,255,255,0.92)", border: "none",
                    cursor: "pointer", fontSize: 12, color: "#4a5568",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    zIndex: 10,
                  }}>×</button>
                </div>
              )}

              {/* Hint pill top-right */}
              {mapReady && !selectedLoc && (
                <div style={{
                  position: "absolute", top: 16, left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 500,
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 999, padding: "7px 16px",
                  border: "1px solid rgba(151,182,76,0.2)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
                  display: "flex", alignItems: "center", gap: 6,
                  animation: "mapFadeUp 0.5s ease forwards",
                  animationDelay: "0.8s", opacity: 0,
                }}>
                  <span style={{ fontSize: 11 }}>📍</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 600, color: "#4a5568", whiteSpace: "nowrap" }}>
                    Tap a pin to explore a branch
                  </span>
                </div>
              )}

              {/* Region legend bottom-left */}
              <div className="loc-legend" style={{
                position: "absolute", bottom: 16, right: 16,
                zIndex: 500,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                borderRadius: 14, padding: "10px 14px",
                border: "1px solid rgba(151,182,76,0.16)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#62840b", margin: "0 0 7px" }}>Regions</p>
                {Object.entries(regionAccent).map(([name, color]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", color: "#4a5568", fontWeight: 600 }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT SIDEBAR: Branch directory ── */}
            <div className="loc-sidebar" style={{
              background: "white",
              borderLeft: "1px solid rgba(151,182,76,0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}>
              {/* Sidebar header */}
              <div style={{
                padding: "20px 20px 14px",
                borderBottom: "1px solid rgba(151,182,76,0.12)",
                background: "linear-gradient(180deg, #fafdf5, white)",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#62840b", margin: 0 }}>
                    Branch Directory
                  </p>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", fontWeight: 700, color: "#97b64c", letterSpacing: "0.1em" }}>
                    {filtered.length} listed
                  </span>
                </div>

                {/* Search inside sidebar */}
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, pointerEvents: "none" }} fill="none" stroke="#97b64c" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search branches…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      paddingLeft: 30, paddingRight: search ? 28 : 10,
                      paddingTop: 9, paddingBottom: 9,
                      borderRadius: 10, fontSize: "11px",
                      border: "1.5px solid #e0ebd0",
                      background: "#f8fbf4", color: "#1e1e1e",
                      fontFamily: "'DM Sans', sans-serif",
                      outline: "none", transition: "border-color 0.2s ease",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#97b64c"; e.target.style.background = "white" }}
                    onBlur={e => { e.target.style.borderColor = "#e0ebd0"; e.target.style.background = "#f8fbf4" }}
                  />
                  {search && (
                    <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#97b64c", fontSize: 11, padding: "2px" }}>✕</button>
                  )}
                </div>
              </div>

              {/* Branch list — scrollable */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "8px 12px 12px",
                scrollbarWidth: "none",
              }}>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0" }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        height: 52, borderRadius: 10,
                        background: "linear-gradient(90deg, #f0f5e8, #e8f2d8, #f0f5e8)",
                        backgroundSize: "200% 100%",
                        animation: `shimmerBar 1.4s ease infinite`,
                        animationDelay: `${i * 0.1}s`,
                      }} />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>🔍</span>
                    <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1e1e1e", margin: 0 }}>No branches found</p>
                    <button onClick={() => { setSearch(""); setActiveRegion("All") }} style={{ padding: "7px 18px", borderRadius: 999, border: "1.5px solid #97b64c", background: "white", color: "#62840b", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Clear filters</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {filtered.map((loc, idx) => {
                      const accent = regionAccent[loc.region] || "#97b64c"
                      const isSelected = selectedLoc?.id === loc.id
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          className={`ms-branch-row ${isSelected ? "selected" : ""}`}
                          onClick={() => { setSelectedLoc(loc); flyTo(loc) }}
                          style={{
                            all: "unset",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 12px", borderRadius: 12,
                            background: isSelected ? "white" : "transparent",
                            border: `1px solid ${isSelected ? accent : "transparent"}`,
                            boxShadow: isSelected ? `0 4px 16px ${accent}20` : "none",
                            animation: `mapFadeUp 0.4s ease forwards`,
                            animationDelay: `${idx * 0.03}s`,
                            opacity: 0,
                          }}
                        >
                          {/* Color dot with pulse on selected */}
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{
                              width: 9, height: 9, borderRadius: "50%", background: accent,
                              boxShadow: isSelected ? `0 0 0 3px ${accent}28` : "none",
                              transition: "box-shadow 0.3s ease",
                            }} />
                            {isSelected && (
                              <div style={{
                                position: "absolute", inset: -3,
                                borderRadius: "50%",
                                border: `1.5px solid ${accent}`,
                                animation: "pinRipple 1.5s ease-out infinite",
                              }} />
                            )}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "12px", fontWeight: isSelected ? 800 : 600,
                              color: isSelected ? "#1e1e1e" : "#3a4a2a",
                              margin: 0,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              letterSpacing: "-0.01em",
                              transition: "font-weight 0.2s ease",
                            }}>{loc.name}</p>
                            <p style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "9px", color: "#7a8a6a",
                              margin: "2px 0 0", fontWeight: 500,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>{loc.address || loc.region}</p>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
                            {loc.tag && (
                              <span style={{
                                fontSize: "7px", fontWeight: 800, letterSpacing: "0.06em",
                                textTransform: "uppercase", padding: "2px 6px", borderRadius: 999,
                                background: loc.tagColor?.bg || accent,
                                color: loc.tagColor?.text || "#fff",
                              }}>{loc.tag}</span>
                            )}
                            {isSelected && (
                              <span style={{ fontSize: 9, color: accent, fontWeight: 700 }}>→</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar footer */}
              <div style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(151,182,76,0.1)",
                background: "linear-gradient(180deg, white, #fafdf5)",
                flexShrink: 0,
              }}>
                <Link to="/franchise#inquiry" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "11px 16px", borderRadius: 12,
                  background: "linear-gradient(135deg, #62840b, #97b64c)",
                  color: "white", textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 700,
                  boxShadow: "0 6px 20px rgba(151,182,76,0.35)",
                  transition: "all 0.25s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(151,182,76,0.45)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(151,182,76,0.35)" }}
                >
                  Open a Branch in Your City →
                </Link>
              </div>
            </div>

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