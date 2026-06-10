import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import FranchiseInquiryTrigger from "../components/FranchiseInquiryTrigger"

const milkshopLogo = "/milkshop-logo-removebg-preview.webp"

const T = {
  greenDark: "#62840b",
}

/** Map block height (+10% vs base 680 / 100svh-160 / 980) */
const MAP_LAYOUT_HEIGHT = "clamp(748px, calc((100svh - 160px) * 1.1), 1078px)"

/** Same image as About Milkshop — 2022 arrival storefront */
const LOCATIONS_HERO_IMAGE = "/about/history/storefront.webp"
const LOCATIONS_HERO_FALLBACK = "/closer.webp"

const STATIC_LOCATIONS = [
  {
    id: 1,
    name: "Milkshop GD Plaza Branch",
    address: "Front of WalterMart Guiguinto",
    lat: 14.8284535,
    lng: 120.8743037
  },
  {
    id: 2,
    name: "Milkshop MacArthur Hway Malolos",
    address: "Front of WalterMart Malolos",
    lat: 14.8715939,
    lng: 120.7990442
  },
  {
    id: 3,
    name: "Milkshop Starmall San Jose Del Monte",
    address: "Starmall SJDM, Bulacan",
    lat: 14.8139973,
    lng: 121.0707105
  },
  {
    id: 4,
    name: "Milkshop Marilao",
    address: "Marilao, Bulacan",
    lat: 14.769961,
    lng: 120.941103
  },
  {
    id: 5,
    name: "SM Valenzuela",
    address: "SM City Valenzuela",
    lat: 14.6856445,
    lng: 120.9771159
  },
  {
    id: 6,
    name: "Milkshop Malolos Convention",
    address: "Malolos, Bulacan",
    lat: 14.8588102,
    lng: 120.8108367
  },
  {
    id: 7,
    name: "Milkshop Tabang",
    address: "Tabang, Guiguinto, Bulacan",
    lat: 14.8258097,
    lng: 120.8658063
  },
  {
    id: 8,
    name: "Milkshop Vista Mall Malolos",
    address: "Vista Mall Malolos",
    lat: 14.8755907,
    lng: 120.7973621
  },
  {
    id: 9,
    name: "Milkshop North Centrum",
    address: "MacArthur Highway, Guiguinto, Bulacan",
    lat: 14.8392246,
    lng: 120.8599318
  },
  {
    id: 10,
    name: "Milkshop Parada",
    address: "Parada, Valenzuela City",
    lat: 14.6962913,
    lng: 120.9969947
  },
  {
    id: 11,
    name: "Milkshop Recto",
    address: "Recto, Manila",
    lat: 14.5995,
    lng: 120.9842
  },
]

const regionAccent = {
  "Metro Manila": "#97b64c",
  "Luzon":        "#62840b",
  "Visayas":      "#E8A020",
  "Mindanao":     "#b7cd7f",
}

const REGION_ORDER = ["All", "Metro Manila", "Luzon", "Visayas", "Mindanao"]

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function pinDisplayName(name) {
  if (!name) return "Milkshop"
  let short = String(name)
    .replace(/^Milkshop PH [-–]\s*/i, "")
    .replace(/^Milkshop\s+/i, "")
    .trim()
  if (!short) return "Milkshop"
  return `Milkshop ${short}`
}

function buildMapsQuery(loc) {
  const lat = parseFloat(loc?.lat)
  const lng = parseFloat(loc?.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `${lat},${lng}`
  }
  const label = [loc?.name, loc?.address].filter(Boolean).join(", ").trim()
  return label || null
}

function getGoogleMapsDirectionsUrl(loc) {
  const query = buildMapsQuery(loc)
  if (!query) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`
}

function openGoogleMaps(url) {
  if (!url) return
  window.open(url, "_blank", "noopener,noreferrer")
}

function BranchMapActions({ loc, accent = "#97b64c", compact = false }) {
  const directionsUrl = getGoogleMapsDirectionsUrl(loc)
  if (!directionsUrl) return null

  const fontSize = compact ? "11px" : "12px"
  const padding = compact ? "9px 8px" : "10px 10px"

  return (
    <div style={{ display: "flex", gap: 8, marginTop: compact ? 12 : 14, flexWrap: "wrap" }}>
      {directionsUrl && (
        <button
          type="button"
          onClick={() => openGoogleMaps(directionsUrl)}
          style={{
            flex: "1 1 120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding,
            borderRadius: 8,
            background: accent,
            color: "#fff",
            border: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontSize,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 14px ${accent}35`,
            transition: "opacity 0.15s ease",
          }}
        >
          Visit the Store
        </button>
      )}
    </div>
  )
}

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
          <img src={loc.photo} alt={loc.name} draggable={false} loading="lazy" decoding="async"
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
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#5a6a4a", lineHeight: 1.55 }}>{row.text}</span>
            </div>
          ))}
        </div>
        <BranchMapActions loc={loc} accent={accent} compact />
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
  const [selectedLoc, setSelectedLoc]   = useState(null)
  const [activeRegion, setActiveRegion] = useState("All")
  const [showDirectory, setShowDirectory] = useState(true)
  const [mapReady, setMapReady]         = useState(false)
  const [mapShouldInit, setMapShouldInit] = useState(false)
  const mapContainerRef                 = useRef(null)
  const leafletInstanceRef              = useRef(null)
  const markersRef                      = useRef([])
  const focusBranchRef                  = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [heroImg, setHeroImg] = useState(LOCATIONS_HERO_IMAGE)
  const [heroAnimReady, setHeroAnimReady] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState("list") // "list" | "detail"
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)")
    const sync = () => {
      const mobile = mq.matches
      setIsMobile(mobile)
      if (!mobile) {
        setDrawerOpen(false)
        setDrawerView("list")
      }
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const startAnim = () => setHeroAnimReady(true)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAnim()
      return undefined
    }
    const raf = requestAnimationFrame(() => startAnim())
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => setSearchQuery(search.trim()), 220)
    return () => clearTimeout(id)
  }, [search])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return allLocations.filter((loc) => {
      const matchesSearch =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        (loc.address && loc.address.toLowerCase().includes(q))
      const matchesRegion = activeRegion === "All" || loc.region === activeRegion
      return matchesSearch && matchesRegion
    })
  }, [allLocations, searchQuery, activeRegion])

  const focusBranch = useCallback((loc) => {
    setSelectedLoc(loc)
    if (isMobile) {
      setDrawerOpen(true)
      setDrawerView("detail")
    }
    const map = leafletInstanceRef.current
    if (!map || loc?.lat == null) return
    const lat = parseFloat(loc.lat)
    const lng = parseFloat(loc.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      map.setView([lat, lng], 16)
    } else {
      map.flyTo([lat, lng], 16, { duration: 0.65, easeLinearity: 0.3 })
    }
  }, [isMobile])

  focusBranchRef.current = focusBranch

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const { data, error } = await supabase.from("MSlocations").select("*").order("id", { ascending: true })
        if (error) throw error
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const staticById = new Map(STATIC_LOCATIONS.map((loc) => [loc.id, loc]))
          /* One row per id (last wins). Avoid name/lat mixups from duplicate rows. */
          const uniqueRows = Array.from(
            new Map(data.map((r) => [r.id, r])).values()
          )
          const merged = uniqueRows.map((row) => {
            const stat = staticById.get(row.id)
            const nameDb = row.name != null ? String(row.name).trim() : ""
            const addrDb = row.address != null ? String(row.address).trim() : ""
            return {
              ...(stat || {}),
              id: row.id,
              /* DB drives label + image together; static only fills gaps by matching id. */
              name: nameDb || stat?.name || "Milkshop Branch",
              address: addrDb || stat?.address || "",
              hours: row.hours ?? "",
              phone: row.phone ?? "",
              dateEstablished: row.date_established ? String(row.date_established) : "",
              region: row.region ?? null,
              tag: row.tag ?? null,
              tagColor: row.tag_color_bg ? { bg: row.tag_color_bg, text: row.tag_color_text || "#fff" } : null,
              photo: row.image_url || row.photo_url || row.photo || null,
              facebookUrl: row.facebook_url || row.fb_link || row.fb_url || null,
              lat: (() => {
                const v = parseFloat(row.lat ?? row.latitude ?? row.Lat ?? row.LAT)
                if (Number.isFinite(v)) return v
                return stat?.lat ?? null
              })(),
              lng: (() => {
                const v = parseFloat(row.lng ?? row.longitude ?? row.Lng ?? row.LNG)
                if (Number.isFinite(v)) return v
                return stat?.lng ?? null
              })(),
            }
          })
          /* Drop duplicate map pins at the same spot (overlapping labels looked "doubled"). */
          const seenKeys = new Set()
          setAllLocations(
            merged.filter((loc) => {
              const la = parseFloat(loc.lat)
              const ln = parseFloat(loc.lng)
              if (!Number.isFinite(la) || !Number.isFinite(ln)) return false
              const key = `${la.toFixed(5)},${ln.toFixed(5)}`
              if (seenKeys.has(key)) return false
              seenKeys.add(key)
              return true
            })
          )
        }
      } catch (e) { console.error("Supabase error", e) }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Lazy-mount Leaflet only when map is near viewport (big perf win on first load)
  useEffect(() => {
    if (mapShouldInit) return
    const el = mapContainerRef.current
    if (!el) return

    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setMapShouldInit(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) {
          setMapShouldInit(true)
          io.disconnect()
        }
      },
      { root: null, rootMargin: '260px 0px', threshold: 0.01 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [mapShouldInit])

  useEffect(() => {
    if (!mapShouldInit) return
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
      const map = L.map(mapContainerRef.current, {
        center: [14.86, 120.86],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: true,
      })
      const mapEl = map.getContainer()
      mapEl.style.touchAction = "none"
      mapEl.style.overscrollBehavior = "contain"
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
        updateWhenZooming: false,
        updateWhenIdle: true,
      }).addTo(map)

      leafletInstanceRef.current = map
      setMapReady(true)
    }

    loadCSS()
    if (window.L) { initMap() } else {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.onload = initMap
      document.head.appendChild(script)
    }

    return () => { if (leafletInstanceRef.current) { leafletInstanceRef.current.remove(); leafletInstanceRef.current = null; markersRef.current = [] } }
  }, [mapShouldInit])

  useEffect(() => {
    if (!mapReady || !leafletInstanceRef.current) return
    const L = window.L
    const map = leafletInstanceRef.current
    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    filtered.forEach((loc) => {
      const lat = parseFloat(loc.lat)
      const lng = parseFloat(loc.lng)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
      const accent = regionAccent[loc.region] || "#97b64c"
      const label = escapeHtml(pinDisplayName(loc.name))
      const icon = L.divIcon({
        className: "",
        html: `
        <div class="ms-pin-wrap" style="display:flex;flex-direction:column;align-items:center;width:120px;cursor:pointer;">
          <span class="ms-pin-label" title="${label}">${label}</span>
          <div style="position:relative;width:44px;height:54px;margin-top:2px;">
            <div class="ms-pin-body" style="
              width:40px;height:40px;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              background:#ffffff;
              border:2px solid rgba(98,132,11,0.38);
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 4px 10px rgba(0,0,0,0.18);
            ">
              <img src="${milkshopLogo}" alt="" style="transform:rotate(45deg);width:26px;height:26px;object-fit:contain;" />
            </div>
            ${loc.tag ? `<span style="
              position:absolute;top:-8px;right:-4px;
              background:${loc.tagColor?.bg || accent};
              color:${loc.tagColor?.text || '#fff'};
              font-size:7px;font-weight:800;
              padding:2px 5px;border-radius:999px;
              font-family:'DM Sans',sans-serif;
              white-space:nowrap;
            ">${loc.tag}</span>` : ""}
          </div>
        </div>
      `,
        iconSize: [120, 78],
        iconAnchor: [60, 78],
      })
      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .on("click", () => focusBranchRef.current?.(loc))
      markersRef.current.push(marker)
    })
  }, [mapReady, filtered])

  const zoomIn = useCallback(() => leafletInstanceRef.current?.zoomIn(), [])
  const zoomOut = useCallback(() => leafletInstanceRef.current?.zoomOut(), [])

  return (
    <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes locBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes heroFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes locHeroFadeLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes locHeroScrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .loc-hero-h1, .loc-hero-p, .loc-hero-tag { opacity: 0; }
        .loc-hero--ready .loc-hero-tag { animation: heroFadeUp 0.6s ease forwards; animation-delay: 0.12s; }
        .loc-hero--ready .loc-hero-h1 { animation: locHeroFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.25s; }
        .loc-hero--ready .loc-hero-p  { animation: heroFadeUp 0.7s ease forwards; animation-delay: 0.45s; }
        .loc-hero-scroll-bar { opacity: 0; }
        .loc-hero--ready .loc-hero-scroll-bar { opacity: 1; animation: locHeroScrollLine 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .loc-hero-h1, .loc-hero-p, .loc-hero-tag, .loc-hero-scroll-bar {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
        @keyframes panelIn    { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
        @keyframes orbFloat   { 0%,100%{transform:translateY(0) scale(1);opacity:0.5} 50%{transform:translateY(-16px) scale(1.06);opacity:0.9} }
        .loc-a1{opacity:0;animation:heroFadeUp 0.6s ease forwards;animation-delay:0.1s}
        .loc-a2{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.25s}
        .loc-a3{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.4s}
        .loc-a4{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.55s}
        .loc-a5{opacity:0;animation:heroFadeUp 0.7s ease forwards;animation-delay:0.65s}
        .ms-section-heading {
          margin: 0;
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: clamp(1.75rem, 5.2vw, 3.4rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.04em;
          color: #62840b;
        }

        .loc-page-wrap {
          max-width: 1500px;
          margin: 0 auto;
          padding: 0 16px;
          position: relative;
          z-index: 1;
          width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .loc-page-wrap { padding-left: 28px; padding-right: 28px; }
        }
        @media (min-width: 901px) {
          .loc-page-wrap { padding-left: 48px; padding-right: 48px; }
        }

        .loc-hero {
          min-height: 83svh;
        }
        .loc-hero-content {
          padding: 100px 20px 64px;
        }
        .loc-hero-h1-text {
          font-size: clamp(2.4rem, 10vw, 3.4rem);
        }
        @media (min-width: 901px) {
          .loc-hero { min-height: 90vh; }
          .loc-hero-content { padding: 120px 48px 72px; }
          .loc-hero-h1-text { font-size: clamp(3.2rem, 5.5vw, 5.2rem); }
        }

        .loc-map-section {
          padding: 53px 16px 35px;
        }
        .loc-map-header {
          gap: 14px;
          margin-bottom: 28px;
        }
        .loc-map-layout {
          border-radius: 18px;
          height: auto;
          min-height: auto;
        }
        .loc-map-pane {
          min-height: 68.2vh;
          order: 2;
          overscroll-behavior: contain;
        }
        .loc-map-pane .leaflet-container {
          touch-action: none;
        }
        @media (min-width: 901px) {
          .loc-map-section { padding: 79px 48px 53px; }
          .loc-map-header { gap: 20px; margin-bottom: 40px; }
          .loc-map-layout {
            border-radius: 0;
            height: ${MAP_LAYOUT_HEIGHT};
            min-height: ${MAP_LAYOUT_HEIGHT};
          }
          .loc-map-pane {
            min-height: clamp(680px, calc(100svh - 160px), 980px);
            order: unset;
          }
        }
        input::placeholder{color:#a0b080}
        .leaflet-control-attribution{font-size:9px!important;opacity:0.45!important}
        .leaflet-attribution-flag{display:none!important}
        .leaflet-control-zoom{border:1px solid rgba(151,182,76,0.28)!important;border-radius:12px!important;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.07)!important}
        .leaflet-control-zoom a{color:#62840b!important;font-weight:700!important;background:#fff!important}
        .leaflet-control-zoom a:hover{background:rgba(151,182,76,0.1)!important}

        .loc-selected-card {
          left: 10px;
          right: 10px;
          bottom: 10px;
          width: auto !important;
        }
        @media (min-width: 901px) {
          .loc-selected-card {
            left: auto;
            right: 20px;
            bottom: 20px;
            width: clamp(280px, 28vw, 400px) !important;
          }
        }

        .loc-map-control-btn {
          min-width: 44px;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* ══ HERO — blurred storefront (About hero style) ══ */}
      <section
        className={`loc-hero${heroAnimReady ? " loc-hero--ready" : ""}`}
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            background: "#141c0a",
          }}
        >
          <img
            src={heroImg}
            alt=""
            onError={() => {
              if (heroImg !== LOCATIONS_HERO_FALLBACK) setHeroImg(LOCATIONS_HERO_FALLBACK)
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              filter: "blur(4px) brightness(0.72) saturate(0.88)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(158deg, rgba(18,26,8,0.62) 0%, rgba(24,34,12,0.50) 40%, rgba(20,30,10,0.58) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,18,4,0.35) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="loc-hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div className="loc-hero-tag" style={{ marginBottom: 16 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#b7cd7f",
              }}
            >
              Store Locations
            </p>
          </div>

          <div className="loc-hero-h1">
            <h1
              className="loc-hero-h1-text"
              style={{
                margin: 0,
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                color: "#F6F1E7",
                textShadow: "0 6px 30px rgba(0,0,0,0.38)",
              }}
            >
              Find a{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #A6C44A 0%, #C8D97B 45%, #E2C078 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                }}
              >
                Milkshop
              </span>
              <br />
              <span style={{ color: "rgba(246,241,231,0.92)" }}>Near You.</span>
            </h1>
          </div>

          <div className="loc-hero-p" style={{ marginTop: 20 }}>
            <p
              style={{
                margin: "0 auto",
                maxWidth: 520,
                fontSize: "clamp(0.92rem, 1.35vw, 1.05rem)",
                lineHeight: 1.85,
                color: "rgba(246,241,231,0.72)",
                fontWeight: 400,
                textShadow: "0 2px 18px rgba(0,0,0,0.22)",
              }}
            >
              Visit any of our branches across the Philippines — tap a pin on the map below to see
              directions and store details.
            </p>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.65,
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              overflow: "hidden",
              background: "rgba(98,132,11,0.25)",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <div
              className="loc-hero-scroll-bar"
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "40%",
                background: "#97b64c",
                borderRadius: 1,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 8,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b7cd7f",
            }}
          >
            Scroll
          </span>
        </div>
      </section>

{/* ══ MAP SECTION — PREMIUM REDESIGN ══ */}
<section className="loc-map-section" style={{
  background: "#ffffff",
  position: "relative",
  overflow: "hidden",
}}>

  <style>{`
    @keyframes mapFadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pinDrop     { 0%{opacity:0;transform:translateY(-20px) scale(0.6)} 60%{transform:translateY(4px) scale(1.1)} 100%{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes sidebarIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes drawerUp    { from{transform:translateY(100%)} to{transform:translateY(0)} }
    @keyframes shimmerBar  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spin        { to{transform:rotate(360deg)} }

    .ms-pin-wrap:hover .ms-pin-body { transform: rotate(-45deg) scale(1.08); }
    .ms-pin-label {
      display: block;
      max-width: 148px;
      padding: 3px 8px;
      background: #ffffff;
      border: 1px solid rgba(151,182,76,0.3);
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #1e1e1e;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      pointer-events: none;
      line-height: 1.2;
    }

    .leaflet-control-zoom { border: 1px solid rgba(151,182,76,0.3) !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
    .leaflet-control-zoom a { color: #62840b !important; font-weight: 800 !important; background: rgba(255,255,255,0.95) !important; height: 34px !important; line-height: 34px !important; width: 34px !important; font-size: 16px !important; }
    .leaflet-control-zoom a:hover { background: rgba(151,182,76,0.12) !important; }
    .leaflet-control-attribution { font-size: 8px !important; opacity: 0.45 !important; background: rgba(255,255,255,0.5) !important; border-radius: 8px; padding: 2px 6px !important; }
    .leaflet-attribution-flag { display: none !important; }
    .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
    @media (max-width: 900px) {
      .loc-map-pane,
      .loc-map-pane .leaflet-container {
        touch-action: none;
        overscroll-behavior: contain;
      }
    }

    /* ── Drawer (mobile) ── */
    .loc-drawer-backdrop {
      display: none;
    }
    @media (max-width: 900px) {
      .loc-drawer-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.28);
        z-index: 799;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .loc-drawer-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }
    }
  `}</style>

  <div className="loc-page-wrap">

    {/* ── Section header ── */}
    <div className="loc-map-header" style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      justifyContent: "space-between",
    }}>
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <h1 className="loc-a2 ms-section-heading">Store Locator</h1>
      </div>
    </div>

    {/* ── Map + Sidebar layout ── */}
    <div className="loc-map-layout" style={{
      position: "relative",
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 0,
      overflow: "visible",
    }}>

      {/* MAP PANE */}
      <div className="loc-map-pane" style={{
        position: "relative",
        background: "#e8f0da",
        borderRadius: 22,
        overflow: "hidden",
        border: "1px solid rgba(151,182,76,0.26)",
        boxShadow: "0 24px 70px rgba(98,132,11,0.14), 0 8px 22px rgba(0,0,0,0.08)",
        height: "100%",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, background: "linear-gradient(180deg, rgba(248,252,241,0.18) 0%, rgba(255,255,255,0.04) 45%, rgba(0,0,0,0.04) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6, border: "1px solid rgba(255,255,255,0.5)" }} />
        <div
          ref={mapContainerRef}
          className="loc-map-canvas"
          style={{ width: "100%", height: "100%", touchAction: "none" }}
        />

        {/* Map controls */}
        {mapReady && (
          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 700, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Desktop only: sidebar toggle */}
            <button
              type="button"
              className="loc-map-control-btn"
              onClick={() => setShowDirectory(prev => !prev)}
              style={{
                display: "none", // shown via media query below
                width: 44, height: 44, borderRadius: 10,
                border: "1px solid rgba(0,18,56,0.55)",
                background: "linear-gradient(145deg, #071739, #0d234f)",
                color: "#ffffff", fontSize: 14, fontWeight: 800,
                cursor: "pointer", boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
              }}
              title={showDirectory ? "Hide sidebar" : "Show sidebar"}
              id="loc-sidebar-toggle"
            >
              {showDirectory ? "◨" : "◧"}
            </button>
            <style>{`@media (min-width: 901px) { #loc-sidebar-toggle { display: flex !important; align-items: center; justify-content: center; } }`}</style>

            <button type="button" className="loc-map-control-btn" onClick={zoomIn}
              style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(151,182,76,0.42)", background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,250,236,0.94))", color: "#62840b", fontSize: 20, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            <button type="button" className="loc-map-control-btn" onClick={zoomOut}
              style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(151,182,76,0.42)", background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,250,236,0.94))", color: "#62840b", fontSize: 20, fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>–</button>
          </div>
        )}

        {/* Mobile: "Browse Branches" pill button */}
        {mapReady && (
          <button
            type="button"
            id="loc-drawer-open-btn"
            onClick={() => {
              setDrawerOpen(true)
              setDrawerView("list")
            }}
            style={{
              display: "none", // shown via media query
              position: "absolute", bottom: 20, left: "50%",
              transform: "translateX(-50%)",
              zIndex: 600,
              padding: "12px 24px",
              borderRadius: 999,
              background: "#62840b",
              color: "#fff",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px", fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(98,132,11,0.35)",
              whiteSpace: "nowrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span>📍</span>&nbsp; Browse Branches ({filtered.length})
          </button>
        )}
        <style>{`@media (max-width: 900px) { #loc-drawer-open-btn { display: flex !important; } }`}</style>

        {/* Loading overlay */}
        {!mapReady && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, #f0f7e6, #e8f3d8)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16, zIndex: 20,
          }}>
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid rgba(151,182,76,0.2)", borderTopColor: "#97b64c", animation: "spin 0.9s linear infinite" }} />
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 20 }}>📍</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#62840b", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Locating branches…
            </p>
            <div style={{ width: 120, height: 3, borderRadius: 999, overflow: "hidden", background: "rgba(151,182,76,0.15)" }}>
              <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, transparent, #97b64c, transparent)", backgroundSize: "200% 100%", animation: "shimmerBar 1.4s ease infinite" }} />
            </div>
          </div>
        )}

        {/* Desktop hint */}
        {mapReady && !selectedLoc && (
          <div id="loc-map-hint" style={{
            position: "absolute", bottom: 16, left: "50%",
            transform: "translateX(-50%)",
            zIndex: 500,
            background: "rgba(255,255,255,0.96)",
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
        <style>{`@media (max-width: 900px) { #loc-map-hint { display: none !important; } }`}</style>

        {/* ── DESKTOP: Branch detail card (bottom-right float) ── */}
        {selectedLoc && (() => {
          const accent = regionAccent[selectedLoc.region] || "#97b64c"
          return (
            <div
              id="loc-desktop-card"
              className="loc-selected-card"
              style={{
                position: "absolute", bottom: 20, right: 20,
                width: "clamp(280px, 28vw, 400px)",
                zIndex: 1000,
                background: "#ffffff",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                animation: "sidebarIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
                display: "none", // shown via media query
              }}
            >
              <style>{`@media (min-width: 901px) { #loc-desktop-card { display: block !important; } }`}</style>

              <div style={{ position: "relative", height: "clamp(200px, 26vh, 300px)", overflow: "hidden", background: "#f0f4e8" }}>
                {selectedLoc.photo ? (
                  <img src={selectedLoc.photo} alt={selectedLoc.name} draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                    </svg>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 5 }}>
                  {selectedLoc.region && (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: accent, color: "#fff" }}>{selectedLoc.region}</span>
                  )}
                  {selectedLoc.tag && (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: selectedLoc.tagColor?.bg || "rgba(255,255,255,0.18)", color: selectedLoc.tagColor?.text || "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>{selectedLoc.tag}</span>
                  )}
                </div>
                <button type="button" onClick={() => setSelectedLoc(null)}
                  style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, zIndex: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
                >×</button>
              </div>

              <div style={{ padding: "14px 16px 16px" }}>
                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#1a1a1a", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>{selectedLoc.name}</h3>
                <div style={{ height: 1, background: "rgba(0,0,0,0.07)", marginBottom: 10 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedLoc.address && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#4a4a4a", lineHeight: 1.5, fontWeight: 500 }}>{selectedLoc.address}</span>
                    </div>
                  )}
                  {selectedLoc.hours && (
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#4a4a4a", fontWeight: 500 }}>{selectedLoc.hours}</span>
                    </div>
                  )}
                  {selectedLoc.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#4a4a4a", fontWeight: 500 }}>{selectedLoc.phone}</span>
                    </div>
                  )}
                  {selectedLoc.dateEstablished && (
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#8a8a8a", fontWeight: 500 }}>Est. {selectedLoc.dateEstablished}</span>
                    </div>
                  )}
                </div>
                <BranchMapActions loc={selectedLoc} accent={accent} />
                {selectedLoc.facebookUrl && (
                  <a href={selectedLoc.facebookUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, padding: "10px 0", borderRadius: 8, background: "#62840b", color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, transition: "background 0.15s ease" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#4e6a09"}
                    onMouseLeave={e => e.currentTarget.style.background = "#62840b"}
                  >
                    View Facebook Page
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
              </div>
            </div>
          )
        })()}

        {/* ── DESKTOP SIDEBAR ── */}
        <div
          className="loc-sidebar"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(151,182,76,0.18)",
            borderRadius: 16,
            display: "none", // shown via media query
            flexDirection: "column",
            overflow: "hidden",
            position: "absolute",
            top: 14, left: 14, bottom: 14,
            zIndex: 650,
            width: showDirectory ? "300px" : "0px",
            opacity: showDirectory ? 1 : 0,
            pointerEvents: showDirectory ? "auto" : "none",
            transition: "width 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
          id="loc-desktop-sidebar"
        >
          <style>{`@media (min-width: 901px) { #loc-desktop-sidebar { display: flex !important; } }`}</style>

          <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.01em" }}>Our Branches</span>
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#97b64c" strokeWidth="2.2"
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="Search branches…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 10px 9px 30px", borderRadius: 9, border: "1px solid rgba(151,182,76,0.25)", background: "#f7faf0", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "#1a1a1a", outline: "none" }}
                onFocus={e => e.target.style.borderColor = "#97b64c"}
                onBlur={e => e.target.style.borderColor = "rgba(151,182,76,0.25)"}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px 12px", scrollbarWidth: "none" }}>
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} style={{ height: 52, borderRadius: 8, background: "#f5f5f5", marginBottom: 1 }} />)
            ) : filtered.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "48px 16px", textAlign: "center" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1a1a1a", margin: 0 }}>No branches found</p>
                <button onClick={() => { setSearch(""); setActiveRegion("All") }} style={{ marginTop: 4, padding: "6px 16px", borderRadius: 999, border: "1px solid #97b64c", background: "white", color: "#62840b", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Clear filters</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {filtered.map((loc, idx) => {
                  const accent = regionAccent[loc.region] || "#97b64c"
                  const isSelected = selectedLoc?.id === loc.id
                  return (
                    <button key={loc.id} type="button" onClick={() => focusBranch(loc)}
                      style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", padding: "11px 10px", borderRadius: 10, gap: 10, background: isSelected ? "#f4f9ea" : "transparent", borderBottom: idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", transition: "background 0.15s ease" }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#fafdf4" }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent" }}
                    >
                      <img src={milkshopLogo} alt="" style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0, opacity: isSelected ? 1 : 0.55, transition: "opacity 0.15s ease" }} />
                      <div style={{ width: 1, alignSelf: "stretch", background: isSelected ? accent : "rgba(0,0,0,0.08)", borderRadius: 999, flexShrink: 0, transition: "background 0.15s ease" }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: isSelected ? 800 : 600, color: isSelected ? "#1a2e0a" : "#2a2a2a", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.01em" }}>
                          {loc.name.replace("Milkshop PH - ", "").replace("Milkshop PH – ", "")}
                        </p>
                        {loc.address && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 400, color: "#9aaa8a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.address}</p>}
                      </div>
                      {loc.tag && <span style={{ flexShrink: 0, fontSize: "7px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 999, background: loc.tagColor?.bg || accent, color: loc.tagColor?.text || "#fff", fontFamily: "'DM Sans', sans-serif" }}>{loc.tag}</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>{/* end loc-map-pane */}
    </div>{/* end loc-map-layout */}
  </div>{/* end loc-page-wrap */}

  {/* ══════════════════════════════════════════════
      MOBILE DRAWER — rendered outside page-wrap
      so it can be position:fixed full-width
  ══════════════════════════════════════════════ */}

  {/* Backdrop */}
  <div
    className={`loc-drawer-backdrop${drawerOpen ? " open" : ""}`}
    onClick={() => setDrawerOpen(false)}
  />

  {/* Drawer sheet */}
  <div
    style={{
      position: "fixed",
      left: 0, right: 0, bottom: 0,
      zIndex: 800,
      background: "#ffffff",
      borderRadius: "20px 20px 0 0",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
      transform: drawerOpen ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
      maxHeight: "72vh",
      display: isMobile ? "flex" : "none",
      flexDirection: "column",
      overflow: "hidden",
    }}
    id="loc-mobile-drawer"
  >
    <style>{`@media (min-width: 901px) { #loc-mobile-drawer, .loc-drawer-backdrop { display: none !important; } }`}</style>

    {/* Drag handle */}
    <div style={{ padding: "12px 16px 0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 36, height: 4, borderRadius: 999, background: "#e0e0e0", margin: "0 auto 10px" }} />
    </div>

    {/* Header row */}
    <div style={{ padding: "0 16px 12px", flexShrink: 0, display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
      {drawerView === "detail" && (
        <button
          type="button"
          onClick={() => setDrawerView("list")}
          style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#62840b", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}
        >
          ← Back
        </button>
      )}
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 800, color: "#1a1a1a", flex: 1, letterSpacing: "-0.01em" }}>
        {drawerView === "detail" && selectedLoc ? selectedLoc.name.replace("Milkshop PH - ", "").replace("Milkshop PH – ", "") : `Our Branches (${filtered.length})`}
      </span>
      <button
        type="button"
        onClick={() => setDrawerOpen(false)}
        style={{ all: "unset", cursor: "pointer", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a4a4a", fontSize: 14, fontWeight: 700, flexShrink: 0 }}
      >×</button>
    </div>

    {/* ── LIST VIEW ── */}
    {drawerView === "list" && (
      <>
        {/* Search */}
        <div style={{ padding: "10px 16px", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#97b64c" strokeWidth="2.2"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Search branches…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 10px 10px 32px", borderRadius: 10, border: "1px solid rgba(151,182,76,0.25)", background: "#f7faf0", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#1a1a1a", outline: "none" }}
              onFocus={e => e.target.style.borderColor = "#97b64c"}
              onBlur={e => e.target.style.borderColor = "rgba(151,182,76,0.25)"}
            />
          </div>
        </div>

        {/* Branch list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 16px", WebkitOverflowScrolling: "touch" }}>
          {loading ? (
            [1,2,3,4,5].map(i => <div key={i} style={{ height: 60, borderRadius: 10, background: "#f5f5f5", marginBottom: 6 }} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "#1a1a1a" }}>No branches found</p>
              <button onClick={() => { setSearch(""); setActiveRegion("All") }} style={{ marginTop: 8, padding: "7px 18px", borderRadius: 999, border: "1px solid #97b64c", background: "white", color: "#62840b", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>Clear filters</button>
            </div>
          ) : (
            filtered.map((loc, idx) => {
              const accent = regionAccent[loc.region] || "#97b64c"
              const isSelected = selectedLoc?.id === loc.id
              return (
                <button
                  key={loc.id} type="button"
                  onClick={() => {
                    focusBranch(loc)
                    setDrawerView("detail")
                  }}
                  style={{
                    all: "unset", cursor: "pointer", display: "flex", alignItems: "center",
                    padding: "13px 10px", gap: 12, width: "100%", boxSizing: "border-box",
                    background: isSelected ? "#f4f9ea" : "transparent",
                    borderBottom: idx < filtered.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    borderRadius: 10, transition: "background 0.15s ease",
                  }}
                >
                  <img src={milkshopLogo} alt="" style={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0, opacity: isSelected ? 1 : 0.5 }} />
                  <div style={{ width: 1, alignSelf: "stretch", background: isSelected ? accent : "rgba(0,0,0,0.08)", borderRadius: 999, flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: isSelected ? 800 : 600, color: isSelected ? "#1a2e0a" : "#1a1a1a", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {loc.name.replace("Milkshop PH - ", "").replace("Milkshop PH – ", "")}
                    </p>
                    {loc.address && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#9aaa8a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.address}</p>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0cfa8" strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                </button>
              )
            })
          )}
        </div>
      </>
    )}

    {/* ── DETAIL VIEW ── */}
    {drawerView === "detail" && selectedLoc && (() => {
      const accent = regionAccent[selectedLoc.region] || "#97b64c"
      return (
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {/* Photo */}
          <div style={{ position: "relative", height: 190, background: "#f0f4e8", flexShrink: 0 }}>
            {selectedLoc.photo ? (
              <img src={selectedLoc.photo} alt={selectedLoc.name} draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", gap: 5 }}>
              {selectedLoc.region && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: accent, color: "#fff" }}>{selectedLoc.region}</span>}
              {selectedLoc.tag && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "9px", fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: selectedLoc.tagColor?.bg || "rgba(255,255,255,0.18)", color: selectedLoc.tagColor?.text || "#fff" }}>{selectedLoc.tag}</span>}
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "16px 18px 28px" }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>{selectedLoc.name}</h3>
            <div style={{ height: 1, background: "rgba(0,0,0,0.07)", marginBottom: 12 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedLoc.address && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#4a4a4a", lineHeight: 1.55, fontWeight: 500 }}>{selectedLoc.address}</span>
                </div>
              )}
              {selectedLoc.hours && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/></svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#4a4a4a", fontWeight: 500 }}>{selectedLoc.hours}</span>
                </div>
              )}
              {selectedLoc.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#4a4a4a", fontWeight: 500 }}>{selectedLoc.phone}</span>
                </div>
              )}
              {selectedLoc.dateEstablished && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#8a8a8a", fontWeight: 500 }}>Est. {selectedLoc.dateEstablished}</span>
                </div>
              )}
            </div>
            <BranchMapActions loc={selectedLoc} accent={accent} />
            {selectedLoc.facebookUrl && (
              <a href={selectedLoc.facebookUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18, padding: "13px 0", borderRadius: 10, background: "#62840b", color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 800, letterSpacing: "0.01em" }}>
                View Facebook Page
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            )}
          </div>
        </div>
      )
    })()}
  </div>{/* end mobile drawer */}

</section>

      {/* CTA — expanding nationwide */}
      <section className="loc-expand-cta">
        <style>{`
          .loc-expand-cta {
            background: #ffffff;
            border-top: 1px solid #e8f0dc;
            padding: clamp(31px, 4.4vw, 44px) clamp(16px, 4vw, 48px);
            min-height: clamp(198px, 38vw, 242px);
            display: flex;
            align-items: center;
            box-sizing: border-box;
          }
          .loc-expand-inner {
            width: 100%;
            max-width: 1120px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 22px;
          }
          .loc-expand-copy {
            min-width: 0;
            text-align: left;
          }
          .loc-expand-eyebrow {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
          }
          .loc-expand-eyebrow span {
            width: 28px;
            height: 2px;
            background: #62840b;
            border-radius: 2px;
            flex-shrink: 0;
          }
          .loc-expand-eyebrow p {
            margin: 0;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #62840b;
            font-family: 'DM Sans', sans-serif;
          }
          .loc-expand-title {
            margin: 0 0 10px;
            font-family: 'DM Sans', sans-serif;
            font-weight: 900;
            font-size: clamp(1.75rem, 7vw, 2.2rem);
            color: #18210f;
            line-height: 1.12;
            letter-spacing: -0.03em;
          }
          .loc-expand-title em {
            font-style: normal;
            color: #62840b;
          }
          .loc-expand-body {
            margin: 0;
            max-width: 42ch;
            font-family: 'DM Sans', sans-serif;
            font-size: clamp(0.88rem, 3.6vw, 0.95rem);
            line-height: 1.65;
            color: #4a5640;
          }
          .loc-expand-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }
          .loc-expand-btn-primary,
          .loc-expand-btn-secondary {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 48px;
            padding: 14px 22px;
            border-radius: 999px;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.88rem;
            font-weight: 800;
            text-decoration: none;
            box-sizing: border-box;
            transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
            -webkit-tap-highlight-color: transparent;
          }
          .loc-expand-btn-primary {
            background: #62840b;
            color: #fff;
            border: none;
            box-shadow: 0 6px 18px rgba(98, 132, 11, 0.28);
          }
          .loc-expand-btn-primary:hover {
            background: #536f09;
            transform: translateY(-1px);
          }
          .loc-expand-btn-secondary {
            background: #fff;
            color: #62840b;
            font-weight: 700;
            border: 1.5px solid #d0e0b0;
          }
          .loc-expand-btn-secondary:hover {
            border-color: #97b64c;
            background: #f7faef;
            transform: translateY(-1px);
          }
          @media (max-width: 640px) {
            .loc-expand-copy {
              text-align: center;
            }
            .loc-expand-eyebrow {
              justify-content: center;
            }
            .loc-expand-body {
              margin-left: auto;
              margin-right: auto;
            }
            .loc-expand-actions {
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: center;
              align-items: stretch;
              gap: 10px;
            }
            .loc-expand-btn-primary,
            .loc-expand-btn-secondary {
              flex: 1 1 0;
              min-width: 0;
              width: auto;
              padding: 12px 10px;
              font-size: clamp(10px, 2.8vw, 12px);
              white-space: nowrap;
            }
          }
          @media (min-width: 641px) {
            .loc-expand-inner {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              gap: 28px 32px;
            }
            .loc-expand-copy {
              flex: 1 1 280px;
            }
            .loc-expand-actions {
              flex-direction: row;
              flex-wrap: wrap;
              width: auto;
              flex-shrink: 0;
            }
            .loc-expand-btn-primary,
            .loc-expand-btn-secondary {
              width: auto;
              min-height: 44px;
              padding: 12px 22px;
              font-size: 0.82rem;
            }
          }
        `}</style>

        <div className="loc-expand-inner">
          <div className="loc-expand-copy">
            <div className="loc-expand-eyebrow">
              <span />
              <p>Franchise Opportunity</p>
            </div>
            <h2 className="loc-expand-title">
              We&apos;re <em>Expanding</em> Nationwide
            </h2>
            <p className="loc-expand-body">
              Bring Milkshop closer to your community. Explore franchise packages and start your
              journey with us.
            </p>
          </div>
          <div className="loc-expand-actions">
            <FranchiseInquiryTrigger className="loc-expand-btn-primary">
              Start Your Journey →
            </FranchiseInquiryTrigger>
            <Link to="/franchise" className="loc-expand-btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}