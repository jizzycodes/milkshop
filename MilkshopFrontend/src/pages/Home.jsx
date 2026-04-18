import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Hero from "../components/Hero"

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
  const [statKey, setStatKey] = useState(0)
  const sectionRef = useRef(null)
  const whyLockRef = useRef(false)
  const whyWheelDeltaRef = useRef(0)
  const whyTouchYRef = useRef(null)
  const [inView, setInView] = useState(false)
  const { isMobile, isTablet } = useViewport()
 
  const active = whyProps[activeIndex]
 
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

    const setLocked = (locked) => {
      whyLockRef.current = locked
    }

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
        if (next < 0) {
          setLocked(false)
          return 0
        }
        if (next >= whyProps.length) {
          setLocked(false)
          return whyProps.length - 1
        }
        return next
      })
      setStatKey((k) => k + 1)
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
        if (next < 0) {
          setLocked(false)
          return 0
        }
        if (next >= whyProps.length) {
          setLocked(false)
          return whyProps.length - 1
        }
        return next
      })
      setStatKey((k) => k + 1)
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
 
  const handleRowClick = (i) => {
    setActiveIndex(i)
    setStatKey((k) => k + 1)
  }
 
  return (
    <>
      <style>{whySectionStyles}</style>
 
      <section
        ref={sectionRef}
        style={{
          backgroundColor: T.white,
          padding: isMobile ? "72px 0 66px" : "120px 0 110px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background texture */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(183,205,127,0.13) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(151,182,76,0.07) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
 
        {/* Floating orbs */}
        <div
          aria-hidden
          className="glow-orb"
          style={{
            position: "absolute",
            right: "8%",
            top: "15%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(183,205,127,0.22) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
 
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: isMobile ? "0 18px" : isTablet ? "0 30px" : "0 48px",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.1fr 1fr",
            gap: isMobile ? 34 : 80,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
 
          {/* LEFT: Cinematic Stat Panel */}
          <div
            className={`why-reveal ${inView ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                className="line-draw"
                style={{
                  height: 2,
                  width: 32,
                  background: T.green,
                  borderRadius: 2,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: T.darkGreen,
                }}
              >
                Why Franchise With Us
              </span>
            </div>
 
            {/* Headline */}
            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(2.6rem, 4.8vw, 4.2rem)",
                fontWeight: 900,
                color: T.ink,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                marginBottom: 20,
              }}
            >
              Built for<br />
              Franchisee{" "}
              <span style={{ color: T.green }}>Success.</span>
            </h2>
 
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                color: T.muted,
                marginBottom: 52,
                maxWidth: 380,
              }}
            >
              A simple, structured system that removes complexity and lets you focus on growth.
            </p>
 
            {/* Animated Stat */}
            <div
              style={{
                marginBottom: 52,
                paddingBottom: 40,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <AnimatedStat
                key={statKey}
                value={active.stat}
                suffix={active.statSuffix}
                label={active.statLabel}
                active={inView}
              />
            </div>
 
            {/* Stacked Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {whyProps.map((item, i) => {
                const isActive = i === activeIndex
                return (
                  <div
                    key={item.title}
                    className={`why-row ${isActive ? "active" : ""}`}
                    onClick={() => handleRowClick(i)}
                    style={{ padding: isMobile ? "14px 14px 14px 18px" : "18px 20px 18px 24px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: "1.15rem" }}>{item.icon}</span>
                        <span
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            color: isActive ? T.ink : T.muted,
                            letterSpacing: "-0.01em",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
 
                      <div
                        className={isActive ? "pulse-dot" : ""}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background: isActive ? T.green : "#d9e2c6",
                          transition: "background 0.3s ease",
                        }}
                      />
                    </div>
 
                    {/* Expandable body */}
                    <div
                      style={{
                        maxHeight: isActive ? 80 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.875rem",
                          lineHeight: 1.75,
                          color: T.muted,
                          marginTop: 8,
                          paddingLeft: 28,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
 
          {/* RIGHT: Visual Feature Card */}
          <div
            className={`why-reveal ${inView ? "visible" : ""}`}
            style={{ transitionDelay: "0.28s" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 32,
                overflow: "hidden",
                background: "linear-gradient(145deg, #f4f9ea 0%, #ffffff 60%, #eef5d8 100%)",
                border: `1px solid ${T.border}`,
                boxShadow: "0 40px 100px rgba(98,132,11,0.1), 0 8px 24px rgba(0,0,0,0.04)",
                padding: isMobile ? "28px 22px 24px" : "56px 52px 48px",
                minHeight: isMobile ? 0 : 500,
              }}
            >
              {/* Decorative corner accent */}
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(151,182,76,0.12)",
                  filter: "blur(50px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(183,205,127,0.18)",
                  filter: "blur(40px)",
                }}
              />
 
              {/* Inner content — keyed to trigger re-animation */}
              <div
                key={activeIndex}
                style={{
                  position: "relative",
                  zIndex: 2,
                  animation: "fadeSlideUp 0.5s ease forwards",
                }}
              >
                {/* Counter badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(151,182,76,0.1)",
                    border: `1px solid rgba(151,182,76,0.3)`,
                    borderRadius: 999,
                    padding: "6px 14px",
                    marginBottom: 32,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      color: T.darkGreen,
                      textTransform: "uppercase",
                    }}
                  >
                    0{activeIndex + 1} / 0{whyProps.length}
                  </span>
                </div>
 
                {/* Icon circle */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.green}, ${T.lightGreen})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    marginBottom: 24,
                    boxShadow: "0 12px 32px rgba(151,182,76,0.3)",
                  }}
                >
                  {active.icon}
                </div>
 
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    fontWeight: 900,
                    color: T.ink,
                    letterSpacing: "-0.03em",
                    marginBottom: 16,
                    lineHeight: 1.05,
                  }}
                >
                  {active.title}
                </h3>
 
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.9,
                    color: T.muted,
                    maxWidth: 380,
                    marginBottom: 40,
                  }}
                >
                  {active.body}
                </p>
 
                {/* Progress bar */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  {whyProps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleRowClick(i)}
                      style={{
                        all: "unset",
                        cursor: "pointer",
                        height: 4,
                        width: i === activeIndex ? 40 : 10,
                        borderRadius: 999,
                        background: i === activeIndex ? T.green : "#d7e2c7",
                        transition: "all 0.35s ease",
                      }}
                    />
                  ))}
                </div>
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
        {/* HEADER */}
        <Reveal>
          <div style={{ marginBottom: 50 }}>
            <Eyebrow text="Investor Proof" />

            <h2
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(2rem, 3vw, 2.6rem)",
                fontWeight: 900,
                color: "#1e1e1e",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Built to Perform.{" "}
              <span style={{ color: "#62840b" }}>Backed by Numbers.</span>
            </h2>
          </div>
        </Reveal>

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
function FranchiseTestimonialsSection() {
  const [active, setActive] = useState(0)
  const { isMobile, isTablet } = useViewport()

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % franchiseTestimonials.length), 4500)
    return () => clearInterval(t)
  }, [])

  const item = franchiseTestimonials[active]

  const padX = isMobile ? 16 : isTablet ? 24 : 48

  return (
    <section style={{
      backgroundColor: T.surface,
      padding: isMobile ? "72px 0 80px" : "120px 0 108px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle top ring decoration */}
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: -200,
        transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        border: `1px solid ${T.border}`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: `0 ${padX}px`, position: "relative", zIndex: 1, boxSizing: "border-box", width: "100%" }}>

        {/* Header */}
        <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow text="From Our Partners" large />
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
            fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: T.ink, margin: "0 0 18px",
          }}>Real Stories. Real Success.</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            lineHeight: 1.7, color: T.muted,
            maxWidth: 540, margin: "0 auto",
          }}>
            Hear from the franchisees who took the leap and have not looked back since.
          </p>
        </Reveal>

        {/* Testimonial card */}
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            position: "relative",
            backgroundColor: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: 28,
            padding: isMobile ? "36px 20px 28px" : "60px 64px 52px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
            minHeight: isMobile ? 320 : 300,
            overflow: "hidden",
          }}>
            {/* Decorative quote mark */}
            <div aria-hidden style={{
              position: "absolute", top: 28, right: 44,
              fontFamily: "Georgia, serif", fontSize: "8rem",
              color: T.green, opacity: 0.07, lineHeight: 1,
              userSelect: "none", pointerEvents: "none",
            }}>"</div>

            {/* Stars */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
              {[...Array(5)].map((_, j) => (
                <span key={j} style={{ color: T.amber, fontSize: "0.9rem" }}>★</span>
              ))}
            </div>

            {/* Quote — animated on change; minHeight reduces vertical scrollbar twitch between slides */}
            <div style={{ minHeight: isMobile ? 140 : 120, marginBottom: 36 }}>
              <p
                key={active}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)",
                  fontWeight: 600, lineHeight: 1.5,
                  color: "#1e2319", margin: 0,
                  animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
                }}
              >
                {item.quote}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  backgroundColor: T.greenFade,
                  fontSize: "1.1rem",
                }}>👨‍💼</div>
                <div>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800, fontSize: "1rem",
                    color: T.ink, margin: 0,
                  }}>{item.name}</p>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem", color: T.muted, margin: "3px 0 0",
                  }}>Franchisee · {item.location}</p>
                </div>
              </div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: T.green,
                padding: "6px 14px",
                border: `1px solid ${T.border}`,
                borderRadius: 100,
                backgroundColor: T.greenFade,
              }}>{item.result}</span>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {franchiseTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="dot-btn"
                aria-label={`Show testimonial ${i + 1}`}
                style={{
                  width: i === active ? 28 : 8,
                  height: 8, border: 0, borderRadius: 999, padding: 0, cursor: "pointer",
                  backgroundColor: i === active ? T.green : T.borderDark,
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 52 }}>
            <Link
              to="/franchise#inquiry"
              className="btn-primary"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: "0.88rem",
                padding: "16px 40px", borderRadius: 100,
                backgroundColor: T.green, color: T.white,
                textDecoration: "none",
                boxShadow: `0 8px 24px ${T.green}40`,
                display: "inline-block",
              }}
            >
              Start Your Franchise Journey →
            </Link>
          </div>
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
      background: T.white,
      padding: isMobile ? "48px 0 44px" : "64px 0 60px",
      position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{
        position: "absolute", left: "22%", top: "50%",
        transform: "translateY(-50%)",
        width: 260, height: 260, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.green}16 0%, transparent 70%)`,
        filter: "blur(8px)",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 940,
        margin: "0 auto",
        padding: isMobile ? "22px 16px" : isTablet ? "30px 24px" : "34px 38px",
        position: "relative",
        zIndex: 1,
        borderRadius: 24,
        background: `linear-gradient(105deg, #4e6f07 0%, ${T.greenDark} 46%, #1b3004 100%)`,
        border: "1px solid rgba(183,205,127,0.22)",
        boxShadow: "0 16px 36px rgba(17,22,19,0.18)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
          gap: isMobile ? "18px 0" : "0 52px", alignItems: "center",
        }}>

          <Reveal>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 800,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: T.greenLight, display: "block", marginBottom: 12,
            }}>Next Step</span>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(2rem, 3.2vw, 2.9rem)",
              fontWeight: 900, color: T.white,
              letterSpacing: "-0.035em", margin: 0, lineHeight: 0.95,
            }}>
              Ready to Review<br />the Franchise Deck?
            </h2>
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
        <InvestorProofSection />
        <FranchiseTestimonialsSection />
        <FinalCTASection />
      </main>
    </>
  )
}