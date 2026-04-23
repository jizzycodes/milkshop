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
  const [showDirectory, setShowDirectory] = useState(true)
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
 
      leafletInstanceRef.current = map
      setMapReady(true)
 
      // Step 1: start zoomed out on Philippines
      // Step 2: fly into Bulacan (center of 14.59–15.37°N, 120.61–121.42°E)
      setTimeout(() => {
        map.flyTo([14.86, 120.88], 13, {
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

     

    {/* ══ MAP SECTION — PREMIUM REDESIGN ══ */}
    <section className="loc-map-section" data-track-section="Branch Map" style={{
        background: "radial-gradient(120% 120% at 50% 0%, #f8fcf1 0%, #eef5e2 40%, #e8f0da 100%)",
        padding: "24px 48px 96px",
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

          .ms-pin-wrap:hover .ms-pin-body { transform: scale(1.18) translateY(-4px); filter: brightness(1.08) saturate(1.1); }
          .ms-branch-row { transition: all 0.22s ease; }
          .ms-branch-row:hover { background: rgba(255,255,255,0.8) !important; transform: translateX(4px); border-color: rgba(151,182,76,0.35) !important; }
          .ms-branch-row.selected { background: linear-gradient(145deg, #ffffff 0%, #f9fdf4 100%) !important; }


          
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
          .leaflet-control-attribution { font-size: 8px !important; opacity: 0.45 !important; background: rgba(255,255,255,0.5) !important; border-radius: 8px; padding: 2px 6px !important; }
          .leaflet-attribution-flag { display: none !important; }
          .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
        `}</style>

        <div style={{ maxWidth: "1500px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Section header ── */}
          <div className="loc-map-header" style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "flex-end", justifyContent: "space-between",
            gap: 10, marginBottom: 10,
            
  
          }}>
            <div />

          </div>

          {/* ── Main content: map + sidebar ── */}
          <div className="loc-map-layout" style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 0,
            borderRadius: 0,
            overflow: "visible",
            boxShadow: "none",
            border: "none",
            minHeight: "clamp(620px, 80vh, 920px)",
          }}>

            {/* MAP */}
            <div className="loc-map-pane" style={{ position: "relative", background: "#e8f0da", minHeight: "clamp(620px, 80vh, 920px)", order: 2, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(151,182,76,0.26)", boxShadow: "0 24px 70px rgba(98,132,11,0.14), 0 8px 22px rgba(0,0,0,0.08)" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, background: "linear-gradient(180deg, rgba(248,252,241,0.18) 0%, rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.04) 100%)" }} />
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6, border: "1px solid rgba(255,255,255,0.5)" }} />
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
                  <button
                    type="button"
                    onClick={() => setShowDirectory((prev) => !prev)}
                    style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(0,18,56,0.55)", background: "linear-gradient(145deg, #071739, #0d234f)", color: "#ffffff", fontSize: 14, fontWeight: 800, lineHeight: "1", cursor: "pointer", boxShadow: "0 6px 14px rgba(0,0,0,0.22)" }}
                    title={showDirectory ? "Hide sidebar" : "Show sidebar"}
                  >
                    {showDirectory ? "◨" : "◧"}
                  </button>
                  <button type="button" onClick={zoomIn} style={{ width: 36, height: 36, borderRadius: 12, border: "1px solid rgba(151,182,76,0.42)", background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,250,236,0.94))", color: "#62840b", fontSize: 20, fontWeight: 800, lineHeight: "1", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>+</button>
                  <button type="button" onClick={zoomOut} style={{ width: 36, height: 36, borderRadius: 12, border: "1px solid rgba(151,182,76,0.42)", background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,250,236,0.94))", color: "#62840b", fontSize: 20, fontWeight: 800, lineHeight: "1", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>-</button>
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
                  position: "absolute", bottom: 20, right: 20,
                  width: "clamp(260px, 32vw, 320px)",
                  zIndex: 1000,
                  background: "linear-gradient(160deg, rgba(255,255,255,0.99) 0%, rgba(251,255,245,0.96) 58%, rgba(242,250,231,0.93) 100%)",
                  backdropFilter: "blur(18px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 26px 80px rgba(0,0,0,0.18), 0 10px 26px rgba(98,132,11,0.14)",
                  border: "1px solid rgba(151,182,76,0.38)",
                  animation: "sidebarIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                }}>
                  {/* Image */}
                  {selectedLoc.photo ? (
                    <div style={{ position: "relative", height: 148, overflow: "hidden" }}>
                      <img src={selectedLoc.photo} alt={selectedLoc.name} draggable={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.42) 100%)" }} />
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${regionAccent[selectedLoc.region] || "#97b64c"}, #b7cd7f)` }} />
                    </div>
                  ) : (
                    <div style={{
                      height: 8,
                      background: `linear-gradient(90deg, ${regionAccent[selectedLoc.region] || "#97b64c"}, #b7cd7f)`,
                    }} />
                  )}

                  <div style={{ padding: "16px 16px 16px" }}>
                    {/* Tags row */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {selectedLoc.tag && (
                        <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, background: selectedLoc.tagColor?.bg || "#97b64c", color: selectedLoc.tagColor?.text || "#fff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 3px 10px rgba(0,0,0,0.12)" }}>
                          {selectedLoc.tag}
                        </span>
                      )}
                      <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", borderRadius: 999, background: "rgba(151,182,76,0.14)", color: "#62840b", border: "1px solid rgba(151,182,76,0.32)", fontFamily: "'DM Sans', sans-serif" }}>
                        {selectedLoc.region}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.02rem", fontWeight: 800, color: "#1e1e1e", margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                      {selectedLoc.name}
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { icon: "📍", text: selectedLoc.address },
                        { icon: "🕐", text: selectedLoc.hours },
                        selectedLoc.phone && { icon: "📞", text: selectedLoc.phone },
                        selectedLoc.dateEstablished && { icon: "📅", text: `Est. ${selectedLoc.dateEstablished}` },
                      ].filter(Boolean).map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ fontSize: 10, marginTop: 1, flexShrink: 0, width: 14, textAlign: "center" }}>{row.icon}</span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", color: "#4f6040", lineHeight: 1.52, fontWeight: 500 }}>{row.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Close */}
                  <button type="button" onClick={() => setSelectedLoc(null)} style={{
                    position: "absolute", top: 10, right: 10,
                    width: 26, height: 26, borderRadius: "50%",
                    background: "rgba(255,255,255,0.94)", border: "1px solid rgba(151,182,76,0.22)",
                    cursor: "pointer", fontSize: 12, color: "#4a5568",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.16)",
                    zIndex: 10,
                  }}>×</button>
                </div>
              )}

              {/* Top center label */}
              {mapReady && (
                <div style={{
                  position: "absolute", top: 16, left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 500,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(240,248,226,0.94))",
                  backdropFilter: "blur(12px)",
                  borderRadius: 999, padding: "8px 18px",
                  border: "1px solid rgba(151,182,76,0.45)",
                  boxShadow: "0 8px 22px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.7)",
                  display: "flex", alignItems: "center", gap: 8,
                  animation: "mapFadeUp 0.5s ease forwards",
                  animationDelay: "0.6s", opacity: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#97b64c", boxShadow: "0 0 0 3px rgba(151,182,76,0.2)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 900, color: "#587608", letterSpacing: "0.26em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    OUR BRANCHES
                  </span>
                </div>
              )}

              {/* Bottom center hint */}
              {mapReady && !selectedLoc && (
                <div style={{
                  position: "absolute", bottom: 16, left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 500,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,251,236,0.9))",
                  backdropFilter: "blur(12px)",
                  borderRadius: 999, padding: "7px 16px",
                  border: "1px solid rgba(151,182,76,0.3)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
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

         
            </div>

            {/* ── RIGHT SIDEBAR: Branch directory ── */}
            <div className="loc-sidebar" style={{
              background: "linear-gradient(180deg, rgba(250,253,244,0.97) 0%, rgba(244,249,233,0.96) 55%, rgba(238,246,223,0.96) 100%)",
              backgroundImage: "linear-gradient(rgba(151,182,76,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px, 20px 20px",
              backdropFilter: "blur(12px) saturate(1.02)",
              border: "1px solid rgba(151,182,76,0.3)",
              borderLeft: "1px solid rgba(151,182,76,0.3)",
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "absolute",
              top: 14,
              left: 14,
              bottom: 14,
              zIndex: 650,
              width: showDirectory ? "320px" : "0px",
              opacity: showDirectory ? 1 : 0,
              pointerEvents: showDirectory ? "auto" : "none",
              transition: "width 0.25s ease, opacity 0.2s ease",
              boxShadow: "0 26px 54px rgba(0,0,0,0.42), 0 10px 28px rgba(0,0,0,0.28)",
            }}>
              {/* Sidebar header */}
              <div style={{
                padding: "18px 16px 12px",
                borderBottom: "1px solid rgba(151,182,76,0.22)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(247,252,238,0.85))",
                boxShadow: "0 8px 18px rgba(98,132,11,0.12)",
                position: "sticky",
                top: 0,
                zIndex: 5,
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                  <p style={{ fontFamily: "'DM Mono', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#62840b", margin: 0 }}>
                    Milkshop PH Branches
                  </p>
                 
                </div>

              
              </div>

              {/* Branch list — scrollable */}
              <div style={{
                flex: 1, overflowY: "auto", padding: "10px 10px 14px",
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
                            padding: "11px 12px", borderRadius: 16,
                            background: isSelected
                              ? "linear-gradient(145deg, rgba(233,245,202,0.95), rgba(223,241,180,0.95))"
                              : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(247,251,238,0.9))",
                            border: `1px solid ${isSelected ? "#97b64c" : "rgba(151,182,76,0.2)"}`,
                            boxShadow: isSelected
                              ? "0 0 0 1px rgba(151,182,76,0.35), 0 10px 22px rgba(98,132,11,0.2)"
                              : "0 6px 14px rgba(98,132,11,0.08)",
                            animation: `mapFadeUp 0.4s ease forwards`,
                            animationDelay: `${idx * 0.03}s`,
                            opacity: 1,
                          }}
                        >
                          {/* Color dot with pulse on selected */}
                          <div style={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{
                              width: 10, height: 10, borderRadius: "50%", background: isSelected ? "#97b64c" : accent,
                              boxShadow: isSelected ? "0 0 0 3px rgba(151,182,76,0.24), 0 0 8px rgba(151,182,76,0.35)" : "none",
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
                              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
                              fontSize: "12px", fontWeight: isSelected ? 800 : 700,
                              color: isSelected ? "#1e1e1e" : "#3a4a2a",
                              margin: 0,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              letterSpacing: "-0.01em",
                              transition: "font-weight 0.2s ease",
                            }}>{loc.name}</p>
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