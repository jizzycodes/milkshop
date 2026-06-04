import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Hero from "../components/Hero"
import FranchiseInquiryTrigger from "../components/FranchiseInquiryTrigger"
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
  heading:    "#18210f",
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
  .home-section-heading {
    margin: 0;
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: clamp(1.75rem, 5.2vw, 3.4rem);
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -0.04em;
    color: ${T.greenDark};
  }
  .home-section-heading--on-green {
    color: #ffffff;
  }

  /* Mobile-first layout utilities */
  .home-container {
    width: 100%;
    max-width: min(1160px, 100%);
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .home-container--wide {
    max-width: min(1320px, 100%);
  }
  @media (min-width: 768px) {
    .home-container {
      padding-left: 32px;
      padding-right: 32px;
    }
  }
  @media (min-width: 1024px) {
    .home-container {
      padding-left: 48px;
      padding-right: 48px;
    }
  }

  .home-section-pad {
    padding: 72px 0 80px;
  }
  @media (min-width: 768px) {
    .home-section-pad {
      padding: 100px 0 104px;
    }
  }

  .home-section-pad--green {
    padding: 72px 0 64px;
  }
  @media (min-width: 768px) {
    .home-section-pad--green {
      padding: 100px 0 96px;
    }
  }

  .home-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    min-width: 0;
  }
  @media (min-width: 1024px) {
    .home-stats-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
    }
  }

  .home-stats-shell {
    border-radius: 18px;
    padding: 8px;
  }
  @media (min-width: 768px) {
    .home-stats-shell {
      border-radius: 22px;
      padding: 10px;
    }
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
    
    title: "NO Franchising Fee",
    stat: "24",
    statSuffix: "mo",
    statLabel: "Average Payback Period",
    body: "Our franchise fee is affordable and allows you to start your own business without breaking the bank.",
    image: "/franchise/why/why-01.png",
  },
  {
   
    title: "Marketing Support",
    stat: "98",
    statSuffix: "%",
    statLabel: "Franchisee Satisfaction Rate",
    body: "We offer marketing materials, such as brochures and banners, to help promote your store in your local area.",
    image: "/franchise/why/why-02.png",
  },
  {
   
    title: "Training & Guidance",
    stat: "50",
    statSuffix: "+",
    statLabel: "Active Franchise Branches",
    body: "We provide training to help you get started, as well as ongoing support to help your business succeed.",
    image: "/franchise/why/why-03.png",
  },
  {
    
    title: "Flexible Store Type & Design",
    stat: "360",
    statSuffix: "°",
    statLabel: "Launch-to-Growth Support",
    body: "We offer a range of store designs to choose from, giving you the flexibility to create a concept that fit your vision.",
    image: "/franchise/why/why-04.png",
  },
  {
   
    title: "Authentic TW Products",
    stat: "14",
    statSuffix: "d",
    statLabel: "Onboarding & Ops Training",
    body: "We provide training to help you get started, as well as ongoing support to help your business succeed.",
    image: "/franchise/why/why-05.png",
  },
  {
    
    title: "Wide Market and ROI",
    stat: "3",
    statSuffix: "",
    statLabel: "Cart · Kiosk · In-line",
    body: "Guaranteed earning due big percentage of new and returning customers. Return of investments would be 10 to 12 months.",
    image: "/franchise/why/why-06.png",
  },
]

const franchiseTestimonials = [
  { quote: "I had zero F&B background, but the Milkshop team gave me a clear system and stayed with me from setup to opening."},
  { quote: "Daily operations became easy because training and supply support were already structured. We are now preparing our second branch." },
  { quote: "The brand pull is strong, and the team responds fast whenever we need help. It feels like a true partnership."},
]

/** Home testimonials — fixed branches (order = featured list). Match names from MSlocations. */
const featuredTestimonialBranches = [
  {
    branchMatch: ["sm valenzuela", "sm city valenzuela"],
    quote: franchiseTestimonials[0].quote,
    name: franchiseTestimonials[0].name,
    location: "Valenzuela City",
    result: franchiseTestimonials[0].result,
    fallbackLabel: "SM Valenzuela",
  },
  {
    branchMatch: ["starmall san jose", "san jose del monte", "starmall sjdm", "sjdm"],
    quote: franchiseTestimonials[2].quote,
    name: franchiseTestimonials[2].name,
    location: "San Jose del Monte, Bulacan",
    result: franchiseTestimonials[2].result,
    fallbackLabel: "Starmall San Jose del Monte",
  },
  {
    branchMatch: ["vista mall malolos", "vista mall"],
    quote: franchiseTestimonials[1].quote,
    name: franchiseTestimonials[1].name,
    location: "Malolos City, Bulacan",
    result: franchiseTestimonials[1].result,
    fallbackLabel: "Vista Mall Malolos",
  },
  {
    branchMatch: ["north centrum", "milkshop north centrum"],
    quote:
      "Strong foot traffic and a location that works — Milkshop support made opening and day-to-day operations smooth from day one.",
    name: "Milkshop Partner",
    location: "Guiguinto, Bulacan",

    fallbackLabel: "North Centrum",
  },
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



{/* ══════════════════════════════════════
   WHY FRANCHISE SECTION
══════════════════════════════════════ */}

function WhySection() {
  const sectionRef = useRef(null)
  const [motionOk] = useState(() => {
    if (typeof window === "undefined") return false
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })
  const [inView, setInView] = useState(() => {
    if (typeof window === "undefined") return true
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    if (!motionOk || inView) return undefined
    const el = sectionRef.current
    if (!el) return undefined

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [motionOk, inView])

  return (
    <>
      <style>{`
        /* Why Franchise — use Franchise Process 3×2 grid setup */
        .why-wrap {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(34px, 4.6vw, 54px);
          width: 100%;
          max-width: min(1320px, 100%);
          margin: 0 auto;
          padding: 0 clamp(12px, 1.25vw, 24px);
          box-sizing: border-box;
        }

        .why-top-header {
          width: 100%;
          margin: 0 auto;
          text-align: center;
          padding: 0 clamp(8px, 2vw, 24px);
        }

        .why-section.why-motion-ready:not(.is-inview) .why-top-header .home-section-heading {
          opacity: 0;
          transform: translate3d(0, 28px, 0);
        }

        .why-section.is-inview .why-top-header .home-section-heading {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .why-top-header .why-eyebrow {
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.65rem, 0.9vw, 0.72rem);
          font-weight: 800;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          margin: 0 0 clamp(14px, 2vw, 20px);
        }

        .why-top-header .why-sub {
          margin: 14px auto 0;
          max-width: 62ch;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          line-height: 1.8;
          color: #ffffff;
        }

        .why-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
          min-width: 0;
        }
        @media (min-width: 521px) {
          .why-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(16px, 3vw, 22px);
          }
        }
        @media (min-width: 961px) {
          .why-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(18px, 2.2vw, 26px);
          }
        }

        .why-card {
          opacity: 1;
          transform: none;
        }

        .why-section.why-motion-ready:not(.is-inview) .why-card {
          opacity: 0;
          transform: translate3d(0, 44px, 0) scale(0.98);
        }

        .why-section.is-inview .why-card {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          transition:
            opacity 0.55s ease,
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: calc(40ms + var(--why-i, 0) * 70ms);
        }

        .why-section.why-motion-ready:not(.is-inview) .why-card-media img {
          transform: scale(1.08);
        }

        .why-section.is-inview .why-card-media img {
          transform: scale(1);
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: calc(40ms + var(--why-i, 0) * 70ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .why-section .why-card,
          .why-section .why-card-media img,
          .why-section .why-top-header .home-section-heading {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        .why-card-inner {
          height: 100%;
          border-radius: 0;
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
          align-items: center;
          text-align: center;
        }

        .why-card-media {
          position: relative;
          width: 100%;
          max-width: none;
          aspect-ratio: 16 / 10;
          min-height: 168px;
          border-radius: 16px;
          overflow: hidden;
          background: transparent;
          border: none;
          box-shadow: 0 10px 32px rgba(98,132,11,0.10);
        }
        @media (min-width: 521px) {
          .why-card-media {
            width: 100%;
            aspect-ratio: 16 / 9;
            min-height: 180px;
            border-radius: 20px;
          }
        }
        @media (min-width: 961px) {
          .why-card-media {
            aspect-ratio: 3 / 2;
            min-height: 200px;
          }
        }

        .why-card-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          z-index: 1;
          transform: scale(1);
          will-change: transform;
        }

        .why-card-media .why-media-fallback {
          position: absolute;
          inset: 0;
          display: none;
          place-items: center;
          font-size: 2.2rem;
          color: #62840b;
          background: #eef5e2;
          z-index: 0;
        }

        .why-card-media:not(:has(img)) .why-media-fallback,
        .why-card-media[data-img-failed="true"] .why-media-fallback {
          display: grid;
        }

        .why-card-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 44ch;
        }

        .why-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          border-radius: 0;
          background: transparent;
          border: none;
          width: fit-content;
          max-width: 100%;
        }

        .why-chip .why-ic {
          font-size: 1.05rem;
          line-height: 1;
        }

        .why-chip .why-title {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.95rem, 2.8vw, 1.05rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (min-width: 521px) {
          .why-chip .why-title { white-space: nowrap; }
        }

        .why-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          line-height: 1.85;
          color: #ffffff;
          margin: 0;
          max-width: 44ch;
        }

      `}</style>

      <section
        ref={sectionRef}
        className={`home-section-pad--green why-section${motionOk ? " why-motion-ready" : ""}${inView ? " is-inview" : ""}`}
        style={{
          background: "#97b64c",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grain */}
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          opacity: 0.022, zIndex: 0, pointerEvents: "none", mixBlendMode: "multiply",
        }} xmlns="http://www.w3.org/2000/svg">
          <filter id="grain-why">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-why)"/>
        </svg>

        {/* Dot grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "none",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 70%)",
        }} />

        {/* Soft brand glows (background design) */}
        <div aria-hidden style={{
          position: "absolute",
          top: "-18%",
          left: "-12%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "transparent",
          filter: "blur(42px)",
          zIndex: 0,
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute",
          bottom: "-22%",
          right: "-14%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "transparent",
          filter: "blur(48px)",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        <div className="home-container home-container--wide" style={{
          position: "relative",
          zIndex: 1,
        }}>
          <div className="why-wrap">
            <header className="why-top-header">
              
              <h2 className="home-section-heading home-section-heading--on-green">
                Why Franchise with us?
              </h2>
             
            </header>

            <div className="why-grid">
              {whyProps.map((item, i) => (
                <article
                  key={item.title}
                  className="why-card"
                  style={{ "--why-i": i }}
                >
                  <div className="why-card-inner">
                    <div className="why-card-media">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={`Milkshop franchise — ${item.title}`}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement?.setAttribute("data-img-failed", "true");
                          }}
                        />
                      ) : null}
                      <div className="why-media-fallback" aria-hidden>
                        <span>{item.icon}</span>
                      </div>
                    </div>
                    <div className="why-card-top">
                      <div className="why-chip" title={item.title}>
                        <span className="why-ic" aria-hidden>{item.icon}</span>
                        <span className="why-title">{item.title}</span>
                      </div>
                    </div>
                    <p className="why-body">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>

       
          </div>
        </div>
      </section>
    </>
  )
}
function InvestorProofSection() {
  return (
    <section
      className="home-section-pad"
      style={{
        background: "linear-gradient(180deg, #f4f7ed 0%, #eef3e3 100%)",
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

      <div className="home-container" style={{ maxWidth: 1080, position: "relative", zIndex: 1 }}>

        {/* STATS — compact horizontal ticker style */}
        <div
          className="home-stats-shell"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(245,250,235,0.86))",
            border: "1px solid rgba(151,182,76,0.26)",
            boxShadow: "0 12px 28px rgba(98,132,11,0.08)",
            overflowX: "hidden",
            maxWidth: "100%",
          }}
        >
          <div className="home-stats-grid">
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

function shortBranchLabel(name = "") {
  const trimmed = name.trim()
  if (!trimmed) return "Milkshop Branch"
  return trimmed
    .replace(/^milkshop\s+/i, "")
    .replace(/\s+branch$/i, "")
    .trim() || trimmed
}

function normalizeBranchKey(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function findBranchByMatch(branchCards, patterns) {
  for (const pattern of patterns) {
    const key = normalizeBranchKey(pattern)
    const hit = branchCards.find((branch) =>
      normalizeBranchKey(branch.name).includes(key)
    )
    if (hit) return hit
  }
  return null
}

function buildPartnerStories(branchCards) {
  return featuredTestimonialBranches.map((entry, index) => {
    const branch = findBranchByMatch(branchCards, entry.branchMatch)
    return {
      id: `story-${index}`,
      quote: entry.quote,
      name: entry.name,
      location: entry.location,
      result: entry.result,
      image: branch?.image ?? null,
      branchName: branch?.name
        ? shortBranchLabel(branch.name)
        : entry.fallbackLabel,
    }
  })
}

const TESTIMONIAL_AUTO_MS = 5000
const TESTIMONIAL_FADE_MS = 450

function FranchiseTestimonialsSection() {
  const [branchCards, setBranchCards] = useState([])
  const [branchesLoaded, setBranchesLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [featuredFade, setFeaturedFade] = useState(true)
  const [inView, setInView] = useState(false)
  const [autoEpoch, setAutoEpoch] = useState(0)

  const sectionRef = useRef(null)
  const activeIndexRef = useRef(0)
  const fadeTimerRef = useRef(null)

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
              name:
                row.name ||
                row.branch_name ||
                row.location_name ||
                "Milkshop Branch",
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
      } finally {
        if (!cancelled) setBranchesLoaded(true)
      }
    }

    loadBranchImages()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const stories = buildPartnerStories(branchCards)
  const safeIndex = Math.min(activeIndex, Math.max(0, stories.length - 1))
  const active = stories[safeIndex] || stories[0]

  useEffect(() => {
    activeIndexRef.current = safeIndex
  }, [safeIndex])

  const transitionToStory = (nextIndex, resetAutoTimer = false) => {
    const len = stories.length
    if (len === 0) return
    const idx = ((nextIndex % len) + len) % len
    if (idx === activeIndexRef.current && featuredFade) return

    setFeaturedFade(false)
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    fadeTimerRef.current = setTimeout(() => {
      setActiveIndex(idx)
      requestAnimationFrame(() => setFeaturedFade(true))
    }, TESTIMONIAL_FADE_MS)

    if (resetAutoTimer) setAutoEpoch((e) => e + 1)
  }

  useEffect(() => {
    if (!inView || stories.length <= 1) return

    const id = setInterval(() => {
      transitionToStory(activeIndexRef.current + 1)
    }, TESTIMONIAL_AUTO_MS)

    return () => clearInterval(id)
  }, [inView, stories.length, autoEpoch])

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="home-section-pad"
      style={{
        background: T.surface,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(98,132,11,0.09) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />

      <style>{`
        .tm-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .tm-fade.visible { opacity: 1; transform: translateY(0); }

        .tm-story-btn {
          width: 100%;
          flex: 0 0 min(88vw, 300px);
          scroll-snap-align: start;
          text-align: left;
          cursor: pointer;
          border: 1px solid ${T.border};
          background: ${T.white};
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(112px, 42%) 1fr;
          min-height: 120px;
          padding: 0;
          font: inherit;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          -webkit-tap-highlight-color: transparent;
        }
        @media (min-width: 768px) {
          .tm-story-btn {
            flex: none;
            grid-template-columns: minmax(128px, 38%) 1fr;
            min-height: 128px;
          }
        }
        .tm-story-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(98,132,11,0.1);
        }
        .tm-story-btn[aria-pressed="true"] {
          border-color: rgba(98,132,11,0.45);
          box-shadow: 0 8px 32px rgba(98,132,11,0.14);
          outline: 3px solid rgba(151,182,76,0.2);
          outline-offset: 0;
        }
        .tm-story-btn img { transition: transform 0.45s ease; }
        .tm-story-btn:hover img { transform: scale(1.04); }

        .tm-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (min-width: 768px) {
          .tm-layout {
            grid-template-columns: 1.2fr 0.8fr;
            gap: 22px;
          }
        }

        .tm-header {
          margin-bottom: 40px;
        }
        @media (min-width: 768px) {
          .tm-header { margin-bottom: 52px; }
        }

        .tm-featured-body {
          padding: 20px 20px 22px;
        }
        @media (min-width: 768px) {
          .tm-featured-body { padding: 28px 32px 30px; }
        }

        .tm-side-list {
          display: flex;
          flex-direction: row;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
        @media (min-width: 768px) {
          .tm-side-list {
            flex-direction: column;
            overflow-x: visible;
            padding-bottom: 0;
            gap: 14px;
          }
        }

        .tm-cta-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          border-radius: 20px;
          padding: 20px 22px;
          min-height: 52px;
          background: ${T.greenDark};
          color: ${T.white};
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.92rem;
          box-shadow: 0 8px 24px rgba(98,132,11,0.22);
          transition: transform 0.22s ease, background 0.22s ease;
          flex: 0 0 min(88vw, 300px);
          scroll-snap-align: start;
          -webkit-tap-highlight-color: transparent;
        }
        .tm-cta-link:hover {
          transform: translateY(-2px);
          background: #536f09;
        }
        @media (min-width: 768px) {
          .tm-cta-link {
            flex: none;
            width: 100%;
          }
        }

        .tm-featured-media {
          position: relative;
          width: 100%;
          aspect-ratio: 40 / 31;
          background: #e8eedd;
          line-height: 0;
          overflow: hidden;
        }
        .tm-featured-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
        }
        .tm-thumb-media {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: #e8eedd;
          flex-shrink: 0;
        }
        .tm-thumb-img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center center;
        }

        .tm-featured-fade {
          transition: opacity 0.45s ease;
        }
        .tm-featured-fade.is-visible { opacity: 1; }
        .tm-featured-fade.is-hidden { opacity: 0; }

        @media (prefers-reduced-motion: reduce) {
          .tm-fade { transition: none; opacity: 1; transform: none; }
          .tm-story-btn:hover, .tm-cta-link:hover { transform: none; }
          .tm-featured-fade { transition: none; }
        }
      `}</style>

      <div className="home-container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          className={`tm-fade tm-header ${inView ? "visible" : ""}`}
          style={{
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow text="From Our Partners" large />
          </div>
          <h2
            className="home-section-heading"
            style={{ margin: "0 0 12px" }}
          >
            Real Stories.{" "}
            <span style={{ color: T.ink }}>Real Success.</span>
          </h2>
         
        </div>

        {/* Main grid */}
        <div
          className={`tm-fade tm-layout ${inView ? "visible" : ""}`}
          style={{ transitionDelay: "0.12s" }}
        >
          {/* Featured — image + quote below */}
          {active && (
            <article
              className={`tm-featured-wrap tm-featured-fade ${featuredFade ? "is-visible" : "is-hidden"}`}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: `1px solid ${T.border}`,
                background: T.white,
                boxShadow: "0 12px 40px rgba(98,132,11,0.08)",
              }}
            >
              <div className="tm-featured-media" style={{ position: "relative" }}>
                {!branchesLoaded ? (
                  <div
                    aria-hidden
                    className="tm-featured-img"
                    style={{
                      width: "100%",
                      background: "linear-gradient(110deg, #e8eedd 0%, #f5f8ee 45%, #e8eedd 100%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s ease-in-out infinite",
                    }}
                  />
                ) : active.image ? (
                  <img
                    src={active.image}
                    alt={active.branchName}
                    draggable={false}
                    className="tm-featured-img"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div
                    aria-hidden
                    style={{
                      width: "100%",
                      background: "#dfe9d1",
                    }}
                  />
                )}

                {active.result && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: T.greenDark,
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {active.result}
                  </span>
                )}

                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    maxWidth: "calc(100% - 28px)",
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.92)",
                    border: `1px solid ${T.border}`,
                    color: T.greenDark,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {active.branchName}
                </span>
              </div>

              <div className="tm-featured-body">
                <p
                  style={{
                    margin: "0 0 16px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                    fontWeight: 600,
                    lineHeight: 1.65,
                    color: "#18210f",
                  }}
                >
                  &ldquo;{active.quote}&rdquo;
                </p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#7a9460",
                  }}
                >
                  {active.name} · {active.location}
                </p>
              </div>
            </article>
          )}

          {/* Side stories */}
          <div className="tm-side-list">
            {stories.map((story, index) => (
              <button
                key={story.id}
                type="button"
                className="tm-story-btn"
                aria-pressed={index === safeIndex}
                aria-label={`Show story from ${story.name}, ${story.location}`}
                onClick={() => transitionToStory(index, true)}
              >
                <div className="tm-thumb-media">
                  {story.image ? (
                    <img
                      src={story.image}
                      alt=""
                      draggable={false}
                      className="tm-thumb-img"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      aria-hidden
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "#e8eedd",
                      }}
                    />
                  )}
                </div>
                <div style={{ padding: "14px 14px 12px" }}>
                  {story.result && (
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: 8,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: T.greenFade,
                        color: T.greenDark,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.58rem",
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {story.result}
                    </span>
                  )}
                  <span
                    style={{
                      display: "block",
                      color: T.greenDark,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {story.branchName}
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color: "#4a5840",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem",
                      lineHeight: 1.5,
                      fontWeight: 500,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {story.quote}
                  </p>
                </div>
              </button>
            ))}

            <FranchiseInquiryTrigger className="tm-cta-link">
              <span>Start Your Franchise Journey</span>
              <span aria-hidden>→</span>
            </FranchiseInquiryTrigger>
          </div>
        </div>
      </div>
    </section>
  )
}

const MOOBA_SRC = "/happy-customers/mooba.png"

const happyCustomerPhotos = Array.from({ length: 10 }, (_, i) => ({
  id: `h${i + 1}`,
  src: `/happy-customers/h${i + 1}.jpg`,
  alt: `Happy Milkshop customer ${i + 1}`,
}))

function HappyCustomersSection() {
  const [inView, setInView] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowRight") {
        setLightboxIndex((i) => ((i ?? 0) + 1) % happyCustomerPhotos.length)
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex(
          (i) => ((i ?? 0) - 1 + happyCustomerPhotos.length) % happyCustomerPhotos.length,
        )
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxIndex])

  const openLightbox = (index) => setLightboxIndex(index)
  const goPrev = (e) => {
    e.stopPropagation()
    setLightboxIndex(
      (i) => ((i ?? 0) - 1 + happyCustomerPhotos.length) % happyCustomerPhotos.length,
    )
  }
  const goNext = (e) => {
    e.stopPropagation()
    setLightboxIndex((i) => ((i ?? 0) + 1) % happyCustomerPhotos.length)
  }

  return (
    <section
      ref={sectionRef}
      className="home-section-pad"
      aria-labelledby="hc-section-title"
      style={{
        background: T.white,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .hc-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .hc-fade.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hc-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .hc-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto clamp(28px, 5vw, 44px);
        }

        .hc-header-sub {
          margin: 0;
          color: ${T.muted};
          font-size: clamp(0.88rem, 2.2vw, 0.98rem);
          line-height: 1.6;
          font-family: 'DM Sans', sans-serif;
        }

        .hc-layout {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: stretch;
        }

        .hc-mooba {
          flex-shrink: 0;
          display: none;
          justify-content: flex-start;
          align-items: flex-end;
          margin: 0 0 -12px;
          z-index: 2;
        }

        .hc-mooba img {
          width: min(92vw, 360px);
          height: auto;
          display: block;
          object-fit: contain;
        }

        .hc-photos {
          flex: 1;
          min-width: 0;
          padding-bottom: 28px;
          width: 100%;
        }

        .hc-grid-frame {
          position: relative;
          background: #ffffff;
          border: 3px solid ${T.borderDark};
          border-radius: 22px;
          padding: 10px;
          box-shadow: 0 10px 36px rgba(98, 132, 11, 0.12);
          width: 100%;
        }

        .hc-gallery {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: min(88vw, 340px);
          gap: 14px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 4px 0 8px;
          margin-left: -20px;
          margin-right: -20px;
          padding-left: 20px;
          padding-right: 20px;
        }
        .hc-gallery::-webkit-scrollbar { display: none; }

        .hc-card {
          scroll-snap-align: center;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          border-radius: 18px;
          overflow: hidden;
          background: ${T.greenFade};
          box-shadow: 0 8px 28px rgba(98, 132, 11, 0.12);
          border: 2px solid ${T.border};
          aspect-ratio: 5 / 4;
          position: relative;
          font: inherit;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .hc-card:active { transform: scale(0.98); }

        .hc-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hc-hint {
          text-align: center;
          margin: 12px 0 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: ${T.muted};
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 767px) {
          .hc-grid-frame {
            background: transparent;
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }

        @media (min-width: 480px) {
          .hc-gallery { gap: 16px; }
          .hc-grid-frame { padding: 10px; border-radius: 24px; }
          .hc-card { border-radius: 16px; }
        }

        @media (min-width: 768px) {
          .hc-layout {
            flex-direction: row;
            align-items: center;
            gap: 0 20px;
          }
          .hc-mooba {
            display: flex;
            flex: 0 0 34%;
            max-width: 380px;
            margin: 0;
            align-items: center;
          }
          .hc-mooba img {
            width: 100%;
            max-width: 360px;
          }
          .hc-photos {
            flex: 1 1 64%;
            min-width: 0;
            padding-bottom: 24px;
          }
          .hc-grid-frame {
            padding: 14px;
            border-width: 4px;
            border-radius: 28px;
            transform: rotate(2.5deg);
            min-height: 380px;
          }
          .hc-gallery {
            grid-auto-flow: row;
            grid-template-columns: repeat(3, 1fr);
            grid-auto-columns: unset;
            grid-auto-rows: 1fr;
            overflow: visible;
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            gap: 10px;
            width: 100%;
            height: 100%;
            min-height: 340px;
          }
          .hc-card {
            scroll-snap-align: unset;
            aspect-ratio: 1;
            min-height: 0;
            height: auto;
            border-radius: 14px;
            box-shadow: none;
            border-width: 0;
          }
          .hc-hint { display: none; }
          .hc-card:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 18px rgba(98, 132, 11, 0.2);
          }
        }

        @media (min-width: 1024px) {
          .hc-layout { gap: 0 24px; align-items: center; }
          .hc-mooba {
            flex: 0 0 36%;
            max-width: 420px;
            align-self: center;
          }
          .hc-mooba img { max-width: 400px; }
          .hc-photos { flex: 1 1 62%; padding-bottom: 28px; }
          .hc-grid-frame {
            padding: 16px;
            transform: rotate(3deg);
            min-height: 480px;
          }
          .hc-gallery {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: minmax(120px, 1.15fr) minmax(120px, 1.15fr) minmax(88px, 0.85fr) minmax(88px, 0.85fr);
            gap: 12px;
            min-height: 440px;
            height: 100%;
          }
          .hc-card {
            aspect-ratio: unset;
            min-height: 0;
            height: 100%;
            width: 100%;
            display: block;
          }
          .hc-card img {
            min-height: 100%;
          }
          .hc-card:nth-child(1) { grid-column: 1 / 7; grid-row: 1 / 3; }
          .hc-card:nth-child(2) { grid-column: 7 / 13; grid-row: 1 / 3; }
          .hc-card:nth-child(3) { grid-column: 1 / 4; grid-row: 3; }
          .hc-card:nth-child(4) { grid-column: 4 / 7; grid-row: 3; }
          .hc-card:nth-child(5) { grid-column: 7 / 10; grid-row: 3; }
          .hc-card:nth-child(6) { grid-column: 10 / 13; grid-row: 3; }
          .hc-card:nth-child(7) { grid-column: 1 / 4; grid-row: 4; }
          .hc-card:nth-child(8) { grid-column: 4 / 7; grid-row: 4; }
          .hc-card:nth-child(9) { grid-column: 7 / 10; grid-row: 4; }
          .hc-card:nth-child(10) { grid-column: 10 / 13; grid-row: 4; }
          .hc-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 40px rgba(98, 132, 11, 0.18);
          }
        }

        @media (min-width: 1280px) {
          .hc-layout { gap: 0 32px; }
          .hc-grid-frame {
            padding: 18px;
            min-height: 540px;
          }
          .hc-gallery {
            gap: 14px;
            min-height: 500px;
            grid-template-rows: minmax(140px, 1.2fr) minmax(140px, 1.2fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr);
          }
        }

        .hc-lightbox {
          position: fixed;
          inset: 0;
          z-index: 10040;
          background: rgba(10, 18, 4, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
          box-sizing: border-box;
        }
        .hc-lightbox img {
          max-width: min(100%, 720px);
          max-height: min(85dvh, 900px);
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 12px;
        }
        .hc-lightbox-close {
          position: absolute;
          top: max(12px, env(safe-area-inset-top));
          right: max(12px, env(safe-area-inset-right));
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          font-size: 1.75rem;
          line-height: 1;
          cursor: pointer;
        }
        .hc-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border: none;
          border-radius: 999px;
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .hc-lightbox-prev { left: max(8px, env(safe-area-inset-left)); }
        .hc-lightbox-next { right: max(8px, env(safe-area-inset-right)); }

        @media (prefers-reduced-motion: reduce) {
          .hc-fade { transition: none; opacity: 1; transform: none; }
          .hc-card { transition: none; }
        }
      `}</style>

      <div className="home-container home-container--wide" style={{ position: "relative", zIndex: 1 }}>
        <div className={`hc-fade hc-header ${inView ? "visible" : ""}`}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow text="Community" large />
          </div>
          <h2 id="hc-section-title" className="home-section-heading" style={{ margin: "0 0 10px" }}>
            Happy Customers,{" "}
            <span style={{ color: T.ink }}>Happy Moments!</span>
          </h2>
          <p className="hc-header-sub">
            Real smiles from Milkshop fans across the Philippines.
          </p>
        </div>

        <div
          className={`hc-layout hc-fade ${inView ? "visible" : ""}`}
          style={{ transitionDelay: "0.08s" }}
        >
          <div className="hc-mooba">
            <img
              src={MOOBA_SRC}
              alt="Mooba, Milkshop mascot welcoming happy customers"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="hc-photos">
            <div className="hc-grid-frame">
              <div className="hc-gallery" role="list" aria-label="Happy customer photos">
                {happyCustomerPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    className="hc-card"
                    role="listitem"
                    onClick={() => openLightbox(index)}
                    aria-label={`View photo ${index + 1} of ${happyCustomerPhotos.length}`}
                  >
                    <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>
            <p className="hc-hint">Swipe for more →</p>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="hc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="hc-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            ×
          </button>
          <button
            type="button"
            className="hc-lightbox-nav hc-lightbox-prev"
            onClick={goPrev}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <img
            src={happyCustomerPhotos[lightboxIndex].src}
            alt={happyCustomerPhotos[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="hc-lightbox-nav hc-lightbox-next"
            onClick={goNext}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <style>{globalStyles}</style>
      <main
        className="home-page"
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
        <HappyCustomersSection />
      </main>
    </>
  )
}