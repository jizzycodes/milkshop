import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Hero from "../components/Hero"
import { supabase } from "../lib/supabaseClient"

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  green:      "#97b64c",
  greenDark:  "#62840b",
  greenLight: "#b7cd7f",
  greenFade:  "#eef5e2",
  amber:      "#E8A020",
  surface:    "#f7f9f3",
  border: "rgba(151,182,76,0.18)",
  borderDark: "#c8dba0",
  ink:        "#1e1e1e",
  muted:      "#6b7280",
  white:      "#ffffff",
  bg: "#f9fbf4",
}




// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const globalStyles = `
  html {
    overflow-x: hidden;
    scrollbar-gutter: stable;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes sceneSwitch {
    from { opacity: 0; transform: translateY(12px) scale(0.992); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popIn {
    0%   { transform: scale(0.85); opacity: 0; }
    60%  { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes floatDrift {
    0%   { transform: translate3d(0, 0, 0); }
    50%  { transform: translate3d(0, -10px, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .reveal { opacity: 0; }
  .reveal.visible {
    animation: fadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  .reveal-fade { opacity: 0; }
  .reveal-fade.visible {
    animation: fadeIn 0.6s ease forwards;
  }
  .card-hover {
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.3s cubic-bezier(0.16,1,0.3,1),
                border-color 0.3s ease,
                background 0.3s ease;
  }
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(97,132,11,0.12), 0 4px 16px rgba(0,0,0,0.06);
    border-color: ${T.greenLight} !important;
    background: ${T.greenFade} !important;
  }
  .row-hover {
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.3s ease,
                border-color 0.3s ease,
                background 0.3s ease;
  }
  .row-hover:hover {
    transform: translateX(10px);
    box-shadow: 0 8px 32px rgba(97,132,11,0.10);
    border-color: ${T.greenLight} !important;
    background: ${T.greenFade} !important;
  }
  .btn-primary {
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.25s ease,
                background 0.2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px ${T.green}60 !important;
    background: ${T.greenDark} !important;
  }
  .btn-ghost {
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
                border-color 0.2s ease,
                color 0.2s ease;
  }
  .btn-ghost:hover {
    transform: translateY(-3px);
    border-color: ${T.green} !important;
    color: ${T.greenDark} !important;
  }
  .btn-outline-light {
    transition: transform 0.25s cubic-bezier(0.16,1,0.3,1),
                background 0.2s ease,
                border-color 0.2s ease;
  }
  .btn-outline-light:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.1) !important;
    border-color: rgba(255,255,255,0.7) !important;
  }
  .stat-block {
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .stat-block:hover {
    transform: translateY(-4px);
  }
  .dot-btn {
    transition: width 0.22s ease, background 0.22s ease, transform 0.22s ease;
  }
  .dot-btn:hover { transform: scaleY(1.3); }
  .panel-switch {
    animation: sceneSwitch 480ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .ambient-float {
    animation: floatDrift 9s ease-in-out infinite;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal, .reveal.visible, .reveal-fade, .reveal-fade.visible, .panel-switch, .ambient-float {
      animation: none !important;
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
    .card-hover, .row-hover, .btn-primary, .btn-ghost, .btn-outline-light, .dot-btn, .stat-block {
      transition: none !important;
    }
  }
`

const whySectionStyles = `
  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
 
  @keyframes drawLine {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
 
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
 
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(151,182,76,0.35); }
    70%  { box-shadow: 0 0 0 14px rgba(151,182,76,0); }
    100% { box-shadow: 0 0 0 0 rgba(151,182,76,0); }
  }
 
  @keyframes floatGlow {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
    50%       { transform: translateY(-18px) scale(1.06); opacity: 1; }
  }
 
  .why-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .why-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
 
  .why-row {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
  }
 
  .why-row::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #97b64c;
    border-radius: 999px;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
  }
 
  .why-row.active::before,
  .why-row:hover::before {
    transform: scaleY(1);
  }
 
  .why-row.active {
    background: linear-gradient(90deg, rgba(151,182,76,0.07) 0%, transparent 100%);
    border-radius: 0 14px 14px 0;
  }
 
  .stat-block {
    animation: countUp 0.6s ease forwards;
  }
 
  .glow-orb {
    animation: floatGlow 6s ease-in-out infinite;
  }
 
  .pulse-dot {
    animation: pulseRing 2.4s ease-in-out infinite;
  }
 
  .line-draw {
    transform-origin: left;
    animation: drawLine 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  }

  .why-gallery-img {
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease;
  }
  .why-gallery-frame:hover .why-gallery-img {
    transform: scale(1.02);
  }

  @keyframes wsReveal {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wsLineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }
  @keyframes wsImageIn {
    from { opacity: 0; transform: scale(1.06); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes wsSlideRight {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes wsFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes wsProgressFill {
    from { width: 0%; }
    to   { width: 100%; }
  }
  @keyframes wsPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.45); }
    50%       { box-shadow: 0 0 0 10px rgba(151,182,76,0); }
  }
  @keyframes wsFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  .ws-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .ws-reveal.in { opacity: 1; transform: translateY(0); }

  .ws-img-frame {
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .ws-step-btn {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 16px;
    transition: all 0.35s ease;
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  .ws-step-btn::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(151,182,76,0.1), transparent);
    border-radius: 16px;
    transition: width 0.4s ease;
  }
  .ws-step-btn.active::before { width: 100%; }
  .ws-step-btn.active { background: rgba(151,182,76,0.06); }

  .ws-step-num {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #b7cd7f;
    transition: color 0.3s ease;
    min-width: 28px;
  }
  .ws-step-btn.active .ws-step-num { color: #62840b; }

  .ws-step-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #a8b89a;
    transition: color 0.3s ease;
    letter-spacing: -0.01em;
  }
  .ws-step-btn.active .ws-step-title { color: #1e1e1e; }

  .ws-step-icon {
    font-size: 1.1rem;
    opacity: 0.4;
    transition: opacity 0.3s ease;
    margin-left: auto;
  }
  .ws-step-btn.active .ws-step-icon { opacity: 1; }

  .ws-progress-track {
    height: 2px;
    background: rgba(151,182,76,0.15);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 6px;
    margin-left: 44px;
  }
  .ws-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #62840b, #97b64c);
    border-radius: 999px;
    animation: wsProgressFill 5.2s linear forwards;
  }

  .ws-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(151,182,76,0.35);
    background: rgba(151,182,76,0.07);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #62840b;
  }

  .ws-image-caption {
    animation: wsSlideRight 0.5s ease forwards;
  }

  .ws-content-block {
    animation: wsReveal 0.55s ease forwards;
  }

  .ws-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    border-radius: 999px;
    background: linear-gradient(135deg, #62840b, #97b64c);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.02em;
    box-shadow: 0 8px 28px rgba(151,182,76,0.35);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  .ws-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(151,182,76,0.45);
  }

  .ws-float-tag {
    animation: wsFloat 4s ease-in-out infinite;
  }
`

// ─── REVEAL HOOK ──────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, fade = false, style = {}, className = "" }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`${fade ? "reveal-fade" : "reveal"} ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}

function useViewport() {
  const [width, setWidth] = useState(() => {
    if (typeof window === "undefined") return 1280
    return window.innerWidth
  })

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
  }
}

function useCountUp(target, duration = 1600, active = false) {
  const [count, setCount] = useState(0)
 
  useEffect(() => {
    if (!active) return
    let start = 0
    const steps = 60
    const increment = target / steps
    const interval = duration / steps
 
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, interval)
 
    return () => clearInterval(timer)
  }, [target, active])
 
  return count
}
 
function AnimatedStat({ value, suffix, label, active }) {
  const num = useCountUp(parseInt(value), 1400, active)
 
  return (
    <div className="stat-block" key={active ? "active" : "idle"}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(5rem, 10vw, 8.5rem)",
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: "-0.05em",
          color: T.ink,
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <span>{num}</span>
        <span style={{ color: T.green, fontSize: "55%", marginTop: "0.15em" }}>
          {suffix}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: T.muted,
          marginTop: 10,
        }}
      >
        {label}
      </p>
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const whyProps = [
  {
    icon: "📈",
    title: "Quick ROI",
    stat: "24",
    statSuffix: "mo",
    statLabel: "Average Payback Period",
    body: "Based on actual franchisee data — not projections. Most partners recover full capital within their second year of operations.",
  },
  {
    icon: "⚙️",
    title: "Easy to Manage",
    stat: "98",
    statSuffix: "%",
    statLabel: "Franchisee Satisfaction Rate",
    body: "Streamlined operations, centralized supply chain, and a proven playbook mean you spend less time managing and more time growing.",
  },
  {
    icon: "🤝",
    title: "End-to-End Support",
    stat: "50",
    statSuffix: "+",
    statLabel: "Active Franchise Branches",
    body: "From site selection to grand opening and beyond — our team is with you at every stage of your franchise journey.",
  },
]

const franchiseTestimonials = [
  { quote: "I had zero F&B background, but the Milkshop team gave me a clear system and stayed with me from setup to opening.", name: "Carlo M.", location: "Quezon City", result: "ROI in 14 months" },
  { quote: "Daily operations became easy because training and supply support were already structured. We are now preparing our second branch.", name: "Alyssa R.", location: "Cebu City", result: "Opening 2nd branch" },
  { quote: "The brand pull is strong, and the team responds fast whenever we need help. It feels like a true partnership.", name: "John P.", location: "Davao City", result: "Consistent monthly growth" },
]

const stats = [
  { value: "12–18", unit: "mo", label: "ROI Payback",    desc: "Avg. across all branches" },
  { value: "15",    unit: "+",  label: "Active Branches", desc: "Nationwide & growing" },
  { value: "2015",  unit: "",   label: "Est. Year",       desc: "A decade of trust" },
  { value: "100",   unit: "%",  label: "Ops Support",     desc: "We grow together" },
]

// ─── EYEBROW ──────────────────────────────────────────────────────────────────
function Eyebrow({ text, light = false, large = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{
        width: large ? 36 : 28, height: 1.5,
        backgroundColor: light ? T.greenLight : T.green,
        display: "block", flexShrink: 0,
      }} />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: large ? 12 : 9, fontWeight: 800,
        letterSpacing: large ? "0.24em" : "0.3em", textTransform: "uppercase",
        color: light ? T.greenLight : T.green,
        lineHeight: 1.2,
      }}>{text}</span>
    </div>
  )
}

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
function SectionDivider({ flip = false }) {
  return (
    <div style={{
      width: "100%", height: 1,
      background: flip
        ? `linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)`
        : `linear-gradient(to right, transparent, ${T.border}, transparent)`,
    }} />
  )
}

function WhySection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [branchGallery, setBranchGallery] = useState([])
  const sectionRef = useRef(null)
  const whyLockRef = useRef(false)
  const whyWheelDeltaRef = useRef(0)
  const whyTouchYRef = useRef(null)
  const [inView, setInView] = useState(false)
  const { isMobile, isTablet } = useViewport()

  const active = whyProps[activeIndex]

  useEffect(() => {
    let cancelled = false
    async function loadBranchGallery() {
      try {
        const { data, error } = await supabase
          .from("MSlocations")
          .select("*")
          .order("id", { ascending: true })
        if (error) throw error
        if (!cancelled && Array.isArray(data)) {
          const normalizeImage = (value) => {
            if (!value || typeof value !== "string") return null
            const trimmed = value.trim()
            if (!trimmed) return null
            if (/^https?:\/\//i.test(trimmed)) return trimmed
            if (trimmed.startsWith("/")) return trimmed
            return `https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`
          }
          const rows = data
            .map((row) => ({
              url: normalizeImage(
                row.image_url ||
                row.photo_url ||
                row.photo ||
                row.branch_image ||
                row.image
              ),
              name: row.name || row.branch_name || "Milkshop",
            }))
            .filter((row) => row.url)
            .slice(0, 3)
          setBranchGallery(rows)
        }
      } catch (e) {
        console.error("WhySection branch gallery", e)
      }
    }
    loadBranchGallery()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const THRESHOLD = 95

    const setLocked = (locked) => { whyLockRef.current = locked }

    const isSectionCentered = () => {
      const rect = section.getBoundingClientRect()
      return rect.top <= window.innerHeight * 0.25 && rect.bottom >= window.innerHeight * 0.75
    }

    const syncLockState = () => {
      if (!isSectionCentered()) {
        setLocked(false)
        whyWheelDeltaRef.current = 0
        whyTouchYRef.current = null
      }
    }

    const onWheel = (e) => {
      const isTryingToLeaveForward = activeIndex === whyProps.length - 1 && e.deltaY > 0
      const isTryingToLeaveBackward = activeIndex === 0 && e.deltaY < 0
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        setLocked(false)
        whyWheelDeltaRef.current = 0
        return
      }
      if (!whyLockRef.current) {
        if (!isSectionCentered()) return
        setLocked(true)
      }
      e.preventDefault()
      whyWheelDeltaRef.current += e.deltaY
      if (Math.abs(whyWheelDeltaRef.current) < THRESHOLD) return
      const direction = whyWheelDeltaRef.current > 0 ? 1 : -1
      whyWheelDeltaRef.current = 0
      setActiveIndex((prev) => {
        const next = prev + direction
        if (next < 0) { setLocked(false); return 0 }
        if (next >= whyProps.length) { setLocked(false); return whyProps.length - 1 }
        return next
      })
    }

    const onTouchStart = (e) => {
      whyTouchYRef.current = e.touches[0]?.clientY ?? null
    }

    const onTouchMove = (e) => {
      const currentY = e.touches[0]?.clientY
      const startY = whyTouchYRef.current
      if (typeof currentY !== "number" || typeof startY !== "number") return
      const deltaY = startY - currentY
      whyTouchYRef.current = currentY
      const isTryingToLeaveForward = activeIndex === whyProps.length - 1 && deltaY > 0
      const isTryingToLeaveBackward = activeIndex === 0 && deltaY < 0
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        setLocked(false)
        whyWheelDeltaRef.current = 0
        return
      }
      if (!whyLockRef.current) {
        if (!isSectionCentered()) return
        setLocked(true)
      }
      e.preventDefault()
      whyWheelDeltaRef.current += deltaY
      if (Math.abs(whyWheelDeltaRef.current) < THRESHOLD) return
      const direction = whyWheelDeltaRef.current > 0 ? 1 : -1
      whyWheelDeltaRef.current = 0
      setActiveIndex((prev) => {
        const next = prev + direction
        if (next < 0) { setLocked(false); return 0 }
        if (next >= whyProps.length) { setLocked(false); return whyProps.length - 1 }
        return next
      })
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("scroll", syncLockState, { passive: true })
    window.addEventListener("resize", syncLockState)
    return () => {
      setLocked(false)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("scroll", syncLockState)
      window.removeEventListener("resize", syncLockState)
    }
  }, [activeIndex])

  const handleRowClick = (i) => setActiveIndex(i)

  const pad = isMobile ? "0 18px" : isTablet ? "0 30px" : "0 56px"

  // Get image for active index, fallback to gradient
  const activeImage = branchGallery[activeIndex] || null
  const allImages = whyProps.map((_, i) => branchGallery[i] || null)

  return (
    <>
      <style>{whySectionStyles}</style>

      <section
        ref={sectionRef}
        style={{
          backgroundColor: T.white,
          padding: isMobile ? "80px 0 72px" : "128px 0 120px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient background */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 65% 55% at 85% 40%, rgba(183,205,127,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 12% 75%, rgba(151,182,76,0.07) 0%, transparent 55%)
          `,
        }} />

        {/* Subtle grid texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(rgba(151,182,76,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.035) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)",
        }} />

        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: pad,
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
        }}>

          {/* ── Section header ── */}
          <div
            className={`ws-reveal ${inView ? "in" : ""}`}
            style={{ marginBottom: isMobile ? 48 : 72, transitionDelay: "0.1s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                height: 2, width: 48, background: "linear-gradient(90deg, #62840b, #97b64c)",
                borderRadius: 2,
                animation: inView ? "wsLineGrow 0.7s ease forwards" : "none",
                animationDelay: "0.3s",
              }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem", fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#62840b",
              }}>
                Why Franchise With Us?
              </span>
            </div>
            <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: T.ink, margin: "0 0 18px",
          }}>
            Built for{" "}
            <span style={{
              background: "linear-gradient(135deg, #62840b, #97b64c, #b7cd7f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Franchisee Success
            </span>
          </h2>
          </div>

          {/* ── Main layout: Image left (large) + Steps right ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 420px",
            gap: isMobile ? 40 : 64,
            alignItems: "center",
          }}>

            {/* LEFT: Full spotlight image */}
            <div
              className={`ws-reveal ${inView ? "in" : ""}`}
              style={{ transitionDelay: "0.2s", position: "relative" }}
            >
              {/* Image stack — 3 layered images, active one on top */}
              <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>

                {/* Background ghost images for depth */}
                {allImages.map((img, i) => {
                  if (i === activeIndex) return null
                  const offset = i < activeIndex ? -1 : 1
                  return (
                    <div
                      key={`ghost-${i}`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 28,
                        overflow: "hidden",
                        opacity: 0.18,
                        transform: `translateX(${offset * 18}px) translateY(${Math.abs(offset) * 8}px) scale(0.95)`,
                        filter: "blur(2px)",
                        zIndex: 1,
                        transition: "all 0.6s ease",
                        border: "1px solid rgba(151,182,76,0.15)",
                      }}
                    >
                      {img?.url ? (
                        <img src={img.url} alt="" draggable={false}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: "linear-gradient(135deg, #e8f2d0, #b7cd7f)",
                        }} />
                      )}
                    </div>
                  )
                })}

                {/* Active image */}
                <div
                  key={`active-img-${activeIndex}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 28,
                    overflow: "hidden",
                    zIndex: 2,
                    boxShadow: "0 40px 100px rgba(98,132,11,0.18), 0 12px 32px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(151,182,76,0.25)",
                    animation: "wsImageIn 0.65s cubic-bezier(0.16,1,0.3,1) forwards",
                  }}
                >
                  {activeImage?.url ? (
                    <img
                      src={activeImage.url}
                      alt={activeImage.name || "Milkshop branch"}
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      background: "linear-gradient(135deg, #e8f2d0 0%, #b7cd7f 50%, #97b64c 100%)",
                    }} />
                  )}

                  {/* Subtle vignette */}
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 55%, rgba(20,30,10,0.45) 100%)",
                    pointerEvents: "none",
                  }} />

                  {/* Green top accent bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 4,
                    background: "linear-gradient(90deg, #62840b, #97b64c, #b7cd7f)",
                    borderRadius: "28px 28px 0 0",
                  }} />

                  {/* Branch name tag */}
                  {activeImage?.name && (
                    <div
                      key={`caption-${activeIndex}`}
                      className="ws-image-caption"
                      style={{
                        position: "absolute", left: 20, bottom: 20,
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#97b64c",
                        animation: "wsPulse 2s ease-in-out infinite",
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.7rem", fontWeight: 800,
                        letterSpacing: "0.14em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.95)",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}>
                        {activeImage.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Step counter badge — floating top right */}
                <div
                  className="ws-float-tag"
                  style={{
                    position: "absolute",
                    top: -16, right: -16,
                    zIndex: 3,
                  }}
                >
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "2px solid rgba(151,182,76,0.3)",
                    boxShadow: "0 8px 28px rgba(151,182,76,0.2)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem", fontWeight: 700,
                      letterSpacing: "0.05em", color: "#97b64c",
                      lineHeight: 1,
                    }}>
                      0{activeIndex + 1}
                    </span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.5rem", fontWeight: 600,
                      color: "#b7cd7f", letterSpacing: "0.05em",
                      lineHeight: 1, marginTop: 2,
                    }}>
                      / 0{whyProps.length}
                    </span>
                  </div>
                </div>

                {/* Thumbnail strip — bottom left */}
                <div style={{
                  position: "absolute",
                  left: 16, bottom: -20,
                  zIndex: 3,
                  display: "flex", gap: 8,
                }}>
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleRowClick(i)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        width: i === activeIndex ? 52 : 40,
                        height: i === activeIndex ? 52 : 40,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: i === activeIndex
                          ? "2.5px solid #97b64c"
                          : "2px solid rgba(255,255,255,0.6)",
                        boxShadow: i === activeIndex
                          ? "0 4px 16px rgba(151,182,76,0.4)"
                          : "0 2px 8px rgba(0,0,0,0.12)",
                        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                        flexShrink: 0,
                        opacity: i === activeIndex ? 1 : 0.7,
                      }}
                      aria-label={`View step ${i + 1}`}
                    >
                      {img?.url ? (
                        <img src={img.url} alt="" draggable={false}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%",
                          background: `linear-gradient(135deg, #e8f2d0, #97b64c)`,
                        }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Steps panel */}
            <div
              className={`ws-reveal ${inView ? "in" : ""}`}
              style={{ transitionDelay: "0.35s" }}
            >
              {/* Description */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem", lineHeight: 1.8,
                color: T.muted, marginBottom: 36,
                maxWidth: 360,
              }}>
                A simple, structured system that removes complexity and lets you focus on growth.
              </p>

              {/* Step list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {whyProps.map((item, i) => {
                  const isActive = i === activeIndex
                  return (
                    <div key={item.title}>
                      <button
                        className={`ws-step-btn ${isActive ? "active" : ""}`}
                        onClick={() => handleRowClick(i)}
                      >
                        <span className="ws-step-num">0{i + 1}</span>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                            <span className="ws-step-title">{item.title}</span>
                          </div>
                          {isActive && (
                            <p
                              key={`body-${activeIndex}`}
                              className="ws-content-block"
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "0.82rem",
                                lineHeight: 1.7,
                                color: T.muted,
                                margin: "8px 0 0",
                              }}
                            >
                              {item.body}
                            </p>
                          )}
                        </div>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: isActive ? "rgba(151,182,76,0.12)" : "transparent",
                          border: `1.5px solid ${isActive ? "rgba(151,182,76,0.4)" : "rgba(151,182,76,0.15)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.3s ease",
                          flexShrink: 0,
                        }}>
                          <div style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: isActive ? "#97b64c" : "#d7e2c7",
                            transition: "background 0.3s ease",
                            boxShadow: isActive ? "0 0 0 3px rgba(151,182,76,0.2)" : "none",
                          }} />
                        </div>
                      </button>

                      {/* Progress bar under active */}
                      {isActive && (
                        <div className="ws-progress-track" key={`progress-${activeIndex}`}>
                          <div className="ws-progress-fill" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 44 }}>
                <Link
                  to="/franchise#inquiry"
                  className="ws-cta-btn"
                >
                  Become a Partner →
                </Link>
              </div>
            </div>

          </div>
        </div>
        
      </section>
    </>
  )
}

function InvestorProofSection() {
  const { isMobile, isTablet } = useViewport()
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f4f7ed 0%, #eef3e3 100%)",
        padding: isMobile ? "64px 0" : "90px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        className="ambient-float"
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(151,182,76,0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(98,132,11,0.2), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: isMobile ? "0 16px" : isTablet ? "0 28px" : "0 40px",
          position: "relative",
          zIndex: 1,
        }}
      >
      

        {/* STATS — compact horizontal ticker style */}
        <div
          style={{
            borderRadius: 22,
            padding: isMobile ? "8px" : "10px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(245,250,235,0.86))",
            border: "1px solid rgba(151,182,76,0.26)",
            boxShadow: "0 12px 28px rgba(98,132,11,0.08)",
            overflowX: "hidden",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, minmax(0, 1fr))"
                : isTablet
                  ? "repeat(2, minmax(0, 1fr))"
                  : "repeat(4, minmax(0, 1fr))",
              gap: isMobile ? 8 : 10,
              minWidth: 0,
            }}
          >
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div
                  className="stat-card"
                  style={{
                    padding: "14px 14px 12px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(151,182,76,0.2)",
                    transition: "all 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 14px 28px rgba(98,132,11,0.16)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 2,
                      background: "linear-gradient(90deg, #97b64c, #62840b)",
                      opacity: 0.85,
                    }}
                  />

                  {/* LABEL */}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#62840b",
                      margin: "0 0 8px",
                    }}
                  >
                    {s.label}
                  </p>

                  {/* VALUE */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 3,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      className="stat-number"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "clamp(1.75rem, 2.3vw, 2.25rem)",
                        fontWeight: 900,
                        color: "#1e1e1e",
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.92rem",
                        fontWeight: 800,
                        color: "#62840b",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.unit}
                    </span>
                  </div>

                  {/* DESC */}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.72rem",
                      color: "#6f7a5c",
                      margin: 0,
                      lineHeight: 1.45,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function FranchiseTestimonialsSection() {
  const [branchCards, setBranchCards] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)
  const autoRef = useRef(null)
  const { isMobile, isTablet } = useViewport()

  useEffect(() => {
    let cancelled = false
    async function loadBranchImages() {
      try {
        const { data, error } = await supabase
          .from("MSlocations")
          .select("*")
          .order("id", { ascending: true })
        if (error) throw error
        if (!cancelled && Array.isArray(data)) {
          const normalizeImage = (value) => {
            if (!value || typeof value !== "string") return null
            const trimmed = value.trim()
            if (!trimmed) return null
            if (/^https?:\/\//i.test(trimmed)) return trimmed
            if (trimmed.startsWith("/")) return trimmed
            return `https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/${trimmed.replace(/^\/+/, "")}`
          }

          const cardsFromDb = data
            .map((row) => ({
              name: row.name || row.branch_name || row.location_name || "Milkshop Branch",
              image: normalizeImage(
                row.image_url ||
                row.photo_url ||
                row.photo ||
                row.branch_image ||
                row.image
              ),
            }))
            .filter((row) => row.image)
          setBranchCards(cardsFromDb)
        }
      } catch (e) {
        console.error("Failed to load branch images", e)
      }
    }
    loadBranchImages()
    return () => { cancelled = true }
  }, [])

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cards = (branchCards.length
    ? branchCards
    : Array.from({ length: franchiseTestimonials.length }, (_, i) => ({ image: null, name: `Milkshop Branch ${i + 1}` }))
  ).map((branch, index) => ({
    id: `testimonial-${index}`,
    image: branch.image,
    branchName: branch.name,
    quote: franchiseTestimonials[index % franchiseTestimonials.length].quote,
  }))

  const total = cards.length

  // Auto-advance
  useEffect(() => {
    autoRef.current = setInterval(() => {
      goTo((prev) => (prev + 1) % total)
    }, 4800)
    return () => clearInterval(autoRef.current)
  }, [total])

  const goTo = (indexOrFn) => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex(typeof indexOrFn === "function" ? indexOrFn(activeIndex) : indexOrFn)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const prev = () => { clearInterval(autoRef.current); goTo((activeIndex - 1 + total) % total) }
  const next = () => { clearInterval(autoRef.current); goTo((activeIndex + 1) % total) }

   // ── Landscape card dimensions ──
   const rectW = isMobile ? Math.min(window.innerWidth * 0.82, 320) : Math.min(window.innerWidth * 0.52, 620)
   const rectH = isMobile ? Math.round(rectW * 0.62) : Math.round(rectW * 0.58)

   // ── Fan layout positions (5 visible slots: -2, -1, 0, +1, +2) ──
   const getRect = (i) => {
     const total = cards.length
     let rel = ((i - activeIndex) % total + total) % total
     if (rel > Math.floor(total / 2)) rel -= total

     const absRel = Math.abs(rel)
     if (absRel > 2) return { display: "none" }

    const configs = {
      0:  { x: 0,                          scale: 1,    opacity: 1,    zIndex: 10, rotate: 0,   blur: 0  },
      1:  { x: rectW * 0.62,               scale: 0.84, opacity: 0.78, zIndex: 7,  rotate: 2,   blur: 0  },
      "-1":{ x: -(rectW * 0.62),           scale: 0.84, opacity: 0.78, zIndex: 7,  rotate: -2,  blur: 0  },
      2:  { x: rectW * 1.08,               scale: 0.68, opacity: 0.42, zIndex: 4,  rotate: 4,   blur: 1  },
      "-2":{ x: -(rectW * 1.08),           scale: 0.68, opacity: 0.42, zIndex: 4,  rotate: -4,  blur: 1  },
    }

    const cfg = configs[rel] || { display: "none" }
    const centerX = "50%"

    return {
      position: "absolute",
      top: "50%",
      left: centerX,
      transform: `translateX(calc(-50% + ${cfg.x}px)) translateY(-50%) scale(${cfg.scale}) rotate(${cfg.rotate}deg)`,
      opacity: cfg.opacity,
      zIndex: cfg.zIndex,
      filter: cfg.blur ? `blur(${cfg.blur}px)` : "none",
      transition: "all 0.52s cubic-bezier(0.16, 1, 0.3, 1)",
      cursor: rel !== 0 ? "pointer" : "default",
      willChange: "transform, opacity",
    }
  }


  const padX = isMobile ? 16 : isTablet ? 24 : 48
  const cardW = isMobile ? 280 : isTablet ? 320 : 380
  const cardH = isMobile ? 340 : isTablet ? 380 : 440

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: T.surface,
        padding: isMobile ? "80px 0 96px" : "128px 0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes tmFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tmLineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes tmOrb {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50%       { transform: translateY(-20px) scale(1.1); opacity: 0.9; }
        }
        @keyframes quoteSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tm-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .tm-reveal.in { opacity: 1; transform: translateY(0); }

        .tm-nav-btn {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1.5px solid rgba(151,182,76,0.4);
          background: rgba(255,255,255,0.9);
          color: #62840b;
          font-size: 18px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .tm-nav-btn:hover {
          background: #97b64c;
          color: #fff;
          border-color: #97b64c;
          transform: scale(1.08);
          box-shadow: 0 8px 24px rgba(151,182,76,0.35);
        }

        .tm-dot {
          width: 6px; height: 6px;
          border-radius: 999px;
          background: #d7e2c7;
          cursor: pointer;
          transition: all 0.35s ease;
          border: none;
          padding: 0;
        }
        .tm-dot.active {
          width: 28px;
          background: #97b64c;
          box-shadow: 0 0 0 4px rgba(151,182,76,0.15);
        }

        .tm-card-quote {
          animation: quoteSlide 0.45s ease forwards;
        }

        .tm-counter {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #97b64c;
        }
      `}</style>

      {/* Background glows */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 55% at 50% 110%, rgba(151,182,76,0.08), transparent 60%)",
      }} />
      <div aria-hidden style={{
        position: "absolute", top: -120, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%",
        border: "1px solid rgba(151,182,76,0.07)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "5%", right: "5%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,205,127,0.12), transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
        animation: "tmOrb 8s ease-in-out infinite",
      }} />

      <div style={{
        maxWidth: 1160,
        margin: "0 auto",
        padding: `0 ${padX}px`,
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
        width: "100%",
      }}>

        {/* Header */}
        <div
          className={`tm-reveal ${inView ? "in" : ""}`}
          style={{ textAlign: "center", marginBottom: isMobile ? 56 : 80, transitionDelay: "0.1s" }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 12, marginBottom: 18,
          }}>
            <span style={{
              display: "block", width: 32, height: 2,
              background: "linear-gradient(90deg, transparent, #97b64c)",
              borderRadius: 2, transformOrigin: "right",
              animation: inView ? "tmLineGrow 0.7s ease forwards" : "none",
              animationDelay: "0.3s",
            }} />
            <Eyebrow text="From Our Partners" large />
            <span style={{
              display: "block", width: 32, height: 2,
              background: "linear-gradient(90deg, #97b64c, transparent)",
              borderRadius: 2, transformOrigin: "left",
              animation: inView ? "tmLineGrow 0.7s ease forwards" : "none",
              animationDelay: "0.3s",
            }} />
          </div>

          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: T.ink, margin: "0 0 18px",
          }}>
            Real Stories.{" "}
            <span style={{
              background: "linear-gradient(135deg, #62840b, #97b64c, #b7cd7f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Real Success.
            </span>
          </h2>

        
        </div>

        {/* 3D Carousel Stage */}
        <div
        className={`tm-reveal ${inView ? "in" : ""}`}
        style={{ transitionDelay: "0.25s" }}
      >
        {/* Stage */}
        <div style={{
          position: "relative",
          height: rectH + (isMobile ? 24 : 40),
          overflow: "visible",
        }}>
 
          {/* ── Nav: Prev ── */}
          <button
            type="button"
            className="tm-nav-btn"
            onClick={prev}
            aria-label="Previous testimonials"
            style={{
              position: "absolute",
              left: isMobile ? 0 : "calc(50% - " + (rectW * 0.5 + 52) + "px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
            }}
          >
            ←
          </button>
 
          {/* ── Nav: Next ── */}
          <button
            type="button"
            className="tm-nav-btn"
            onClick={next}
            aria-label="Next testimonials"
            style={{
              position: "absolute",
              right: isMobile ? 0 : "calc(50% - " + (rectW * 0.5 + 52) + "px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
            }}
          >
            →
          </button>
 
          {/* ── Cards ── */}
          <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}>
            {cards.map((card, i) => {
              const style = getRect(i)
              if (style.display === "none") return null
              const isActive = i === activeIndex
 
              return (
                <article
                  key={card.id}
                  onClick={() => !isActive && goTo(i)}
                  style={{
                    ...style,
                    width: rectW,
                    height: rectH,
                    borderRadius: isMobile ? 16 : 20,
                    overflow: "hidden",
                    border: `1px solid ${isActive ? "rgba(151,182,76,0.45)" : "rgba(151,182,76,0.12)"}`,
                    boxShadow: isActive
                      ? "0 28px 72px rgba(98,132,11,0.2), 0 8px 24px rgba(0,0,0,0.1)"
                      : "0 8px 28px rgba(0,0,0,0.08)",
                    backgroundColor: "#dfe7cf",
                  }}
                >
                  {/* Image */}
                  {card.image ? (
                    <img
                      src={card.image}
                      alt="Milkshop franchise branch"
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.6s ease",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #d8e5bf 0%, #b7cd7f 45%, #97b64c 100%)",
                    }} />
                  )}
 
                  {/* Gradient overlay — starts lower on active for better image visibility */}
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: isActive
                      ? "linear-gradient(180deg, rgba(20,20,20,0.08) 0%, rgba(20,20,20,0.18) 45%, rgba(20,20,20,0.78) 100%)"
                      : "linear-gradient(180deg, rgba(20,20,20,0.22) 0%, rgba(20,20,20,0.72) 100%)",
                    pointerEvents: "none",
                    transition: "background 0.55s ease",
                  }} />
 
                  {/* Top accent bar — active only */}
                  {isActive && (
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: 3,
                      background: "linear-gradient(90deg, #62840b, #97b64c, #b7cd7f)",
                      borderRadius: `${isMobile ? 16 : 20}px ${isMobile ? 16 : 20}px 0 0`,
                    }} />
                  )}
 
                  {/* Branch name pill */}
                  <span style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isActive ? "#1a2e0a" : "#ffffff",
                    background: isActive ? "rgba(183,205,127,0.92)" : "rgba(30,30,30,0.52)",
                    border: isActive ? "1px solid rgba(151,182,76,0.5)" : "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 999,
                    padding: "5px 11px",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.35s ease",
                  }}>
                    {card.branchName}
                  </span>
 
                  {/* Quote block — bottom of card */}
                  <div style={{
                    position: "absolute",
                    left: isActive ? 22 : 16,
                    right: isActive ? 22 : 16,
                    bottom: isActive ? 22 : 16,
                    transition: "all 0.35s ease",
                  }}>
                    {isActive && (
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "2.2rem",
                        lineHeight: 1,
                        color: "rgba(151,182,76,0.75)",
                        display: "block",
                        marginBottom: 2,
                        fontWeight: 900,
                      }}>"</span>
                    )}
                    <p
                      key={`quote-${activeIndex}`}
                      className={isActive ? "tm-card-quote" : ""}
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: isActive
                          ? "clamp(0.85rem, 1.3vw, 0.98rem)"
                          : "clamp(0.72rem, 1vw, 0.82rem)",
                        fontWeight: isActive ? 700 : 600,
                        lineHeight: 1.5,
                        color: "#ffffff",
                        margin: 0,
                        textShadow: "0 2px 10px rgba(0,0,0,0.55)",
                        display: "-webkit-box",
                        WebkitLineClamp: isActive ? 4 : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {card.quote}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
 
        {/* ── Dot indicators ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 16,
          gap: 6,
        }}>
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`tm-dot ${i === activeIndex ? "active" : ""}`}
              onClick={() => { clearInterval(autoRef.current); goTo(i) }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

        {/* CTA */}
        <div
          className={`tm-reveal ${inView ? "in" : ""}`}
          style={{
            display: "flex", justifyContent: "center",
            marginTop: 56,
            transitionDelay: "0.4s",
          }}
        >
          <Link
            to="/franchise#inquiry"
            className="btn-primary"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: "0.88rem",
              padding: "16px 44px", borderRadius: 100,
              backgroundColor: T.green, color: T.white,
              textDecoration: "none",
              boxShadow: `0 8px 28px ${T.green}45`,
              display: "inline-block",
              transition: "all 0.3s ease",
            }}
          >
            Start Your Franchise Journey →
          </Link>
        </div>

      </div>
    </section>
  )
}

// ─── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTASection() {
  const { isMobile, isTablet } = useViewport()
  return (
    <section style={{
      background: "#1e1e1e",
      padding: isMobile ? "30px 0 26px" : "40px 0 36px",
      position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(151,182,76,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.08) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        opacity: 0.18,
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 1160,
        margin: "0 auto",
        padding: isMobile ? "14px 14px" : isTablet ? "20px 20px" : "22px 28px",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(183,205,127,0.26)",
        borderBottom: "1px solid rgba(183,205,127,0.26)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          gap: isMobile ? "18px 0" : "0 52px", alignItems: "center",
        }}>

          <Reveal>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "#b7cd7f", display: "block", marginBottom: 12,
            }}>Next Step</span>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1.65rem, 2.7vw, 2.4rem)",
              fontWeight: 900, color: T.white,
              letterSpacing: "-0.035em", margin: 0, lineHeight: 0.95,
            }}>
              Ready to Review<br />the Franchise Deck?
            </h2>
            <p style={{
              margin: "12px 0 0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.84rem",
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.86)",
              maxWidth: 460,
            }}>
              See the full business model, numbers, and rollout support in one investor-ready deck.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: isMobile ? 0 : 198 }}>
              <Link
                to="/franchise#inquiry"
                className="btn-primary"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: "0.88rem",
                  padding: "13px 30px", borderRadius: 100,
                  backgroundColor: T.green, color: T.white,
                  textDecoration: "none", textAlign: "center",
                  boxShadow: `0 6px 18px ${T.green}45`,
                  display: "block",
                }}
              >
                Book Investor Call
              </Link>
              <Link
                to="/franchise"
                className="btn-outline-light"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: "0.88rem",
                  padding: "13px 30px", borderRadius: 100,
                  backgroundColor: "transparent", color: "rgba(255,255,255,0.85)",
                  textDecoration: "none", textAlign: "center",
                  border: "1.5px solid rgba(255,255,255,0.22)",
                  display: "block",
                }}
              >
                Get Franchise Deck
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{globalStyles}</style>
      <main
        style={{
          backgroundColor: T.white,
          overflowX: "hidden",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Hero />
        <WhySection />
        <FranchiseTestimonialsSection />
        <FinalCTASection />
      </main>
    </>
  )
}