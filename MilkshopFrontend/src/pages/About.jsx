import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/milkshop-logo.png"

// ─── DATA (unchanged) ────────────────────────────────────────────────────────

const milestones = [
  { year: "2015", label: "Founded in Taiwan",      desc: "Milkshop 秘客侠 opens its first store in Taiwan with a singular mission — to redefine what milk tea could be. Real milk. Real flavor. No shortcuts.", icon: "🏪" },
  { year: "2018", label: "Popping Boba Born",      desc: "After 3 years of R&D, Milkshop introduces the Popping Boba series — a first in Taiwanese beverage culture. Each boba bursts with real fruit juice on first bite.", icon: "🫧" },
  { year: "2020", label: "Brand Expansion",        desc: "Milkshop grows beyond its first store, establishing its production facility and standardized supply chain to ensure every cup tastes exactly the same — everywhere.", icon: "🏭" },
  { year: "2022", label: "Philippines Launch",     desc: "Milkshop lands in Manila as the first Taiwanese Popping Boba brand in the Philippines. The response from Filipino milk tea lovers is overwhelming.", icon: "🇵🇭" },
  { year: "2023", label: "Franchise Program Opens",desc: "The official Milkshop franchise program launches, offering Filipino entrepreneurs three investment tiers to bring the brand to their own communities.", icon: "🤝" },
  { year: "2024", label: "15+ Branches Nationwide",desc: "From Metro Manila to Mindanao, Milkshop now operates 15 branches across the Philippines — with more territories opening every quarter.", icon: "📍" },
];

const rawMaterials = [
  { icon: "🍵", title: "Premium Tea Leaves",       origin: "Nantou, Taiwan",              desc: "Hand-selected oolong and green tea leaves sourced directly from the highland tea farms of Nantou County — the heartland of Taiwanese tea." },
  { icon: "🥛", title: "Fresh Dairy Milk",         origin: "Certified Local Farms",       desc: "We never use powder. Every cup is made with fresh, full-cream dairy milk from certified partner farms — richer, creamier, cleaner." },
  { icon: "🫧", title: "Taiwanese Popping Boba",   origin: "Proprietary Factory, Taiwan", desc: "Our signature boba is produced in our own facility using natural fruit juice fills — no artificial flavoring, no shortcuts." },
  { icon: "🍬", title: "Black Sugar Syrup",        origin: "Traditional Recipe, Taiwan",  desc: "Slow-cooked brown sugar syrup following a traditional Taiwanese formula. The same recipe that created our iconic tiger-stripe milk tea." },
];

// ─── HOOK: Intersection Observer ─────────────────────────────────────────────

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── ANIMATED SECTION WRAPPER ─────────────────────────────────────────────────

function Slide({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = {
    up:    "translateY(48px)",
    left:  "translateX(-48px)",
    right: "translateX(48px)",
    none:  "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity:    inView ? 1 : 0,
        transform:  inView ? "none" : transforms[direction],
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function About() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < 768
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <main className="bg-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════════
          SLIDE 1 — HERO: Born in Taiwan
      ══════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════
    ABOUT HERO — Premium Light, Animated
══════════════════════════════════════════════ */}
<section
  data-track-section="About Hero"
  style={{
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(155deg, #f4f9ec 0%, #ffffff 45%, #f0f7e6 100%)",
    minHeight: isMobile ? "88vh" : "100vh",
    display: "flex",
    alignItems: "center",
    fontFamily: "'DM Sans', sans-serif",
  }}
>
  <style>{`
    @keyframes aboutScrollLine {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(300%); }
    }
    @keyframes aboutFloatImg {
      0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
      50%       { transform: translateY(-18px) rotate(0.5deg); }
    }
    @keyframes aboutOrbDrift {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.55; }
      33%       { transform: translate(20px,-15px) scale(1.06); opacity: 0.8; }
      66%       { transform: translate(-12px, 10px) scale(0.96); opacity: 0.6; }
    }
    @keyframes aboutBadgePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.5); }
      50%       { box-shadow: 0 0 0 10px rgba(151,182,76,0); }
    }
    @keyframes aboutLineGrow {
      from { width: 0; opacity: 0; }
      to   { width: 48px; opacity: 1; }
    }
    @keyframes aboutFadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes aboutFadeLeft {
      from { opacity: 0; transform: translateX(-32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes aboutFadeRight {
      from { opacity: 0; transform: translateX(32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes aboutDotBounce {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.5); }
    }
    @keyframes aboutRingExpand {
      0%   { transform: scale(0.85); opacity: 0.7; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    @keyframes aboutStatCount {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes aboutShimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .about-hero-tag  { opacity:0; animation: aboutFadeUp 0.6s ease forwards; animation-delay: 0.15s; }
    .about-hero-h1   { opacity:0; animation: aboutFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.3s; }
    .about-hero-p    { opacity:0; animation: aboutFadeLeft 0.75s ease forwards; animation-delay: 0.5s; }
    .about-hero-stat { opacity:0; animation: aboutFadeUp 0.7s ease forwards; animation-delay: 0.65s; }
    .about-hero-cta  { opacity:0; animation: aboutFadeUp 0.7s ease forwards; animation-delay: 0.8s; }
    .about-hero-img  { opacity:0; animation: aboutFadeRight 0.9s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.2s; }

    .about-hero-img-inner {
      animation: aboutFloatImg 8s ease-in-out infinite;
      animation-delay: 1.2s;
    }

    .about-cta-primary {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 14px 30px; border-radius: 999px;
      background: linear-gradient(135deg, #62840b, #97b64c);
      color: #fff; font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem; font-weight: 700;
      text-decoration: none; border: none; cursor: pointer;
      box-shadow: 0 8px 28px rgba(151,182,76,0.38);
      transition: all 0.3s ease;
      letter-spacing: 0.01em;
    }
    .about-cta-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 40px rgba(151,182,76,0.5);
    }
    .about-cta-secondary {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 14px 28px; border-radius: 999px;
      background: transparent; color: #62840b;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem; font-weight: 700;
      text-decoration: none;
      border: 1.5px solid rgba(151,182,76,0.4);
      transition: all 0.3s ease;
    }
    .about-cta-secondary:hover {
      background: rgba(151,182,76,0.08);
      border-color: #97b64c;
      transform: translateY(-2px);
    }
    .about-stat-item {
      transition: transform 0.3s ease;
    }
    .about-stat-item:hover { transform: translateY(-3px); }
  `}</style>

  {/* ── Background layers ── */}

  {/* Dot grid — left side */}
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.22) 1.5px, transparent 1.5px)",
    backgroundSize: "32px 32px",
    maskImage: "radial-gradient(ellipse at 8% 60%, black 5%, transparent 52%)",
    WebkitMaskImage: "radial-gradient(ellipse at 8% 60%, black 5%, transparent 52%)",
  }} />

  {/* Dot grid — right side */}
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.12) 1.5px, transparent 1.5px)",
    backgroundSize: "28px 28px",
    maskImage: "radial-gradient(ellipse at 92% 40%, black 5%, transparent 50%)",
    WebkitMaskImage: "radial-gradient(ellipse at 92% 40%, black 5%, transparent 50%)",
  }} />

  {/* Large ambient orb — top right */}
  <div aria-hidden style={{
    position: "absolute", top: "-10%", right: "-8%",
    width: 600, height: 600, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(151,182,76,0.13) 0%, transparent 68%)",
    filter: "blur(32px)", pointerEvents: "none",
    animation: "aboutOrbDrift 14s ease-in-out infinite",
  }} />

  {/* Small orb — bottom left */}
  <div aria-hidden style={{
    position: "absolute", bottom: "5%", left: "-4%",
    width: 340, height: 340, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(183,205,127,0.15) 0%, transparent 70%)",
    filter: "blur(24px)", pointerEvents: "none",
    animation: "aboutOrbDrift 18s ease-in-out infinite reverse",
  }} />

  {/* Decorative rings — behind image */}
  <div aria-hidden style={{
    position: "absolute", right: "4%", top: "50%",
    transform: "translateY(-50%)",
    width: "min(520px, 55vw)", height: "min(520px, 55vw)",
    borderRadius: "50%",
    border: "1px solid rgba(151,182,76,0.1)",
    pointerEvents: "none",
  }} />
  <div aria-hidden style={{
    position: "absolute", right: "7.5%", top: "50%",
    transform: "translateY(-50%)",
    width: "min(380px, 42vw)", height: "min(380px, 42vw)",
    borderRadius: "50%",
    border: "1px dashed rgba(151,182,76,0.08)",
    pointerEvents: "none",
  }} />

  {/* Bottom separator */}
  <div aria-hidden style={{
    position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(151,182,76,0.28), transparent)",
  }} />

  {/* ── Content ── */}
  <div style={{
    position: "relative", zIndex: 10,
    maxWidth: 1240, margin: "0 auto",
    padding: isMobile ? "80px 20px 80px" : "0 56px",
    width: "100%", boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 48 : 60,
    alignItems: "center",
  }}>

    {/* LEFT — Text */}
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Eyebrow tag */}
      <div className="about-hero-tag">
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 999,
          background: "rgba(151,182,76,0.09)",
          border: "1px solid rgba(151,182,76,0.28)",
          fontSize: "10px", fontWeight: 800,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "#62840b",
          animation: "aboutBadgePulse 3s ease-in-out infinite",
          animationDelay: "1.5s",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#97b64c",
            display: "inline-block",
            animation: "aboutDotBounce 2s ease-in-out infinite",
          }} />
          Our Story · Est. Taiwan 2015
        </span>
      </div>

      {/* Headline */}
      <div className="about-hero-h1">
        <h1 style={{
          fontSize: isMobile ? "clamp(2.6rem, 12vw, 3.6rem)" : "clamp(3.4rem, 6vw, 5.8rem)",
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          margin: 0,
          color: "#1a1e14",
        }}>
          Born in<br />
          <span style={{
            background: "linear-gradient(135deg, #3a5c06 0%, #62840b 35%, #97b64c 70%, #b7cd7f 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "aboutShimmer 5s linear infinite",
            animationDelay: "1s",
            display: "inline-block",
          }}>
            Taiwan.
          </span>
          <br />
          <span style={{ color: "#1a1e14" }}>Brewed with Love.</span>
        </h1>
      </div>

      {/* Body */}
      <div className="about-hero-p">
        <p style={{
          fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
          lineHeight: 1.8,
          color: "#4d5c3a",
          maxWidth: 480,
          margin: 0,
        }}>
          Milkshop 秘客侠 wasn't built overnight. It was built cup by cup — through years of recipe testing, ingredient sourcing, and an uncompromising belief that milk tea deserved better. From the highlands of Taiwan to the streets of Manila, every sip carries that original obsession.
        </p>
      </div>

      {/* Stats strip */}
     

      {/* CTAs */}
      <div className="about-hero-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Link to="/products" className="about-cta-primary">
          See Our Menu →
        </Link>
        <Link to="/franchise#inquiry" className="about-cta-secondary">
          Franchise Opportunities
        </Link>
      </div>

    </div>

    {/* RIGHT — Image */}
    <div className="about-hero-img" style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      position: "relative",
    }}>

      {/* Ripple rings behind image */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <div key={i} aria-hidden style={{
          position: "absolute",
          width: isMobile ? 260 : 360,
          height: isMobile ? 260 : 360,
          borderRadius: "50%",
          border: "1.5px solid rgba(151,182,76,0.18)",
          animation: "aboutRingExpand 4s ease-out infinite",
          animationDelay: `${delay}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Green glow behind image */}
      <div aria-hidden style={{
        position: "absolute",
        width: isMobile ? 280 : 420,
        height: isMobile ? 280 : 420,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(151,182,76,0.18) 0%, transparent 68%)",
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Floating image frame */}
      <div className="about-hero-img-inner" style={{
        position: "relative", zIndex: 2,
        borderRadius: isMobile ? 24 : 32,
        overflow: "hidden",
        border: "2px solid rgba(151,182,76,0.25)",
        boxShadow: "0 32px 80px rgba(98,132,11,0.18), 0 8px 24px rgba(0,0,0,0.07)",
        width: "100%",
        maxWidth: isMobile ? 320 : 520,
      }}>
        {/* Green top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 4,
          background: "linear-gradient(90deg, #62840b, #97b64c, #b7cd7f)",
          zIndex: 3,
        }} />

        <img
          src="/hero-custom.png"
          alt="Milkshop signature drinks — Fresh Taste of Taiwan"
          draggable={false}
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />

        {/* Subtle overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 60%, rgba(240,248,230,0.25) 100%)",
          pointerEvents: "none",
        }} />

        {/* Floating badge — bottom left */}
        <div style={{
          position: "absolute", bottom: 16, left: 16, zIndex: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: 12, padding: "8px 14px",
          border: "1px solid rgba(151,182,76,0.25)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>🇹🇼</span>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, color: "#1a1e14", margin: 0, letterSpacing: "-0.01em" }}>Taiwan Original</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#62840b", margin: 0, fontWeight: 700 }}>Est. 2015</p>
          </div>
        </div>

        {/* Floating badge — top right */}
        <div style={{
          position: "absolute", top: 20, right: 16, zIndex: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: 12, padding: "8px 14px",
          border: "1px solid rgba(151,182,76,0.25)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>🇵🇭</span>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 800, color: "#1a1e14", margin: 0 }}>First in PH</p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#62840b", margin: 0, fontWeight: 700 }}>Since 2022</p>
          </div>
        </div>
      </div>

    </div>
  </div>

  {/* Scroll cue */}
  <div style={{
    position: "absolute", bottom: 28, left: "50%",
    transform: "translateX(-50%)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    opacity: 0.45,
  }}>
    <div style={{
      width: 1, height: 44, overflow: "hidden",
      background: "rgba(98,132,11,0.18)", borderRadius: 1, position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, width: "100%", height: "40%",
        background: "#97b64c", borderRadius: 1,
        animation: "aboutScrollLine 1.8s ease-in-out infinite",
      }} />
    </div>
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "8px", letterSpacing: "0.22em",
      textTransform: "uppercase", color: "#62840b",
    }}>Scroll</span>
  </div>

</section>



        {/* ══════════════════════════════════════════════
          SLIDE 4 — SOURCING + FROM FARM TO CUP (single block)
      ══════════════════════════════════════════════ */}
      <section data-track-section="Raw Materials" className="relative py-10 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 80% 20%, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 80% 20%, black 0%, transparent 60%)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="mb-5">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              From Farm to Cup
            </h2>
          </Slide>
          

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {rawMaterials.map((r, i) => (
              <Slide key={r.title} direction="up" delay={i * 80}
                className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-4xl">{r.icon}</span>
                <h3 className="font-bold text-white text-base leading-snug">{r.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <span className="text-white/90">{r.origin}.</span> {r.desc}
                </p>
              </Slide>
            ))}
          </div>

      
        </div>
      </section>

 
      {/* ══════════════════════════════════════════════
          SLIDE 3 — TIMELINE
      ══════════════════════════════════════════════ */}
      <section data-track-section="Company Timeline" className="relative py-28 bg-white overflow-hidden">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block" style={{ backgroundColor: "#e8f0dc" }} />

        <div className="max-w-6xl mx-auto px-8 lg:px-16">
          <Slide direction="up" className="text-center mb-4">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Company History</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-6">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#1e1e1e", letterSpacing: "-0.03em" }}>
              A Decade in the Making
            </h2>
          </Slide>
          <Slide direction="up" delay={100} className="text-center mb-20">
            <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: "#5a5a5a" }}>
              From a single store in Taiwan to a growing franchise network in the Philippines — here's how Milkshop became what it is today.
            </p>
          </Slide>

          <div className="flex flex-col gap-0">
            {milestones.map((m, i) => (
              <Slide
                key={m.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 60}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 pb-14 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Card */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block rounded-2xl p-6 max-w-sm transition-all duration-300 hover:shadow-lg ${i % 2 === 0 ? "lg:ml-auto" : ""}`}
                    style={{ backgroundColor: "#f5f8ef", border: "1px solid #e0ebd0" }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? "lg:justify-end" : ""}`}>
                      <span className="text-xl">{m.icon}</span>
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#97b64c" }}>{m.label}</p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#5a5a5a" }}>{m.desc}</p>
                  </div>
                </div>

                {/* Year dot */}
                <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-1 shrink-0">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white" style={{ backgroundColor: "#97b64c" }}>
                    <span className="text-white text-xs font-black" style={{ fontFamily: "'DM Mono', monospace" }}>'{m.year.slice(2)}</span>
                  </div>
                  <span className="text-xs font-bold hidden lg:block mt-1" style={{ color: "#1e1e1e", fontFamily: "'DM Mono', monospace" }}>{m.year}</span>
                </div>

                <div className="flex-1 hidden lg:block" />
              </Slide>
            ))}
          </div>
        </div>
      </section>

   

      {/* ══════════════════════════════════════════════
    BRING MILKSHOP CLOSER — Full Section
    PASTE THIS to REPLACE line 583 to line 635
    (replaces the compact promo section entirely)
══════════════════════════════════════════════ */}
<section
  data-track-section="Bring Milkshop Closer"
  className="relative overflow-hidden"
  style={{
    background: "linear-gradient(155deg, #f4f9ec 0%, #ffffff 50%, #f0f7e6 100%)",
    padding: isMobile ? "80px 20px" : "120px 40px",
  }}
>
  <style>{`
    @keyframes bmc-orb {
      0%,100% { transform: scale(1) translate(0,0); opacity: 0.5; }
      50%      { transform: scale(1.08) translate(12px,-16px); opacity: 0.8; }
    }
    @keyframes bmc-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes bmc-float {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-8px); }
    }
    .bmc-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 40px;
      border-radius: 999px;
      background: linear-gradient(90deg, #62840b 0%, #97b64c 40%, #c8dc8a 55%, #97b64c 70%, #62840b 100%);
      background-size: 200% auto;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.02em;
      box-shadow: 0 14px 40px rgba(98,132,11,0.32);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .bmc-cta:hover {
      animation: bmc-shimmer 1.2s linear infinite;
      transform: translateY(-3px);
      box-shadow: 0 20px 50px rgba(98,132,11,0.42);
    }
    .bmc-ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 15px 32px;
      border-radius: 999px;
      background: transparent;
      color: #62840b;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      border: 1.5px solid rgba(151,182,76,0.45);
      transition: all 0.25s ease;
    }
    .bmc-ghost:hover {
      background: rgba(151,182,76,0.08);
      border-color: #97b64c;
      transform: translateY(-2px);
    }
    .bmc-stat {
      transition: transform 0.25s ease;
    }
    .bmc-stat:hover { transform: translateY(-4px); }
  `}</style>

  {/* ── Ambient orbs ── */}
  <div aria-hidden style={{
    position: "absolute", top: "-10%", right: "-6%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(151,182,76,0.13) 0%, transparent 68%)",
    filter: "blur(40px)", pointerEvents: "none",
    animation: "bmc-orb 14s ease-in-out infinite",
  }} />
  <div aria-hidden style={{
    position: "absolute", bottom: "-8%", left: "-4%",
    width: 360, height: 360, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(183,205,127,0.14) 0%, transparent 70%)",
    filter: "blur(28px)", pointerEvents: "none",
    animation: "bmc-orb 18s ease-in-out infinite reverse",
  }} />

  {/* ── Dot grid ── */}
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.2) 1.5px, transparent 1.5px)",
    backgroundSize: "32px 32px",
    maskImage: "radial-gradient(ellipse at 15% 50%, black 0%, transparent 55%)",
    WebkitMaskImage: "radial-gradient(ellipse at 15% 50%, black 0%, transparent 55%)",
  }} />

  <div style={{
    position: "relative",
    zIndex: 10,
    maxWidth: 1160,
    margin: "0 auto",
  }}>

    {/* ── Two column layout ── */}
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 52 : 80,
      alignItems: "center",
    }}>

      {/* ── LEFT: Text ── */}
      <Slide direction="left">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 2, background: "#97b64c", borderRadius: 2, display: "block" }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", fontWeight: 900,
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "#62840b",
            }}>
              Franchise Opportunity
            </span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "#1a1e14",
            margin: 0,
          }}>
            Bring Milkshop<br />
            <span style={{
              background: "linear-gradient(135deg, #3a5c06 0%, #62840b 35%, #97b64c 70%, #b7cd7f 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "bmc-shimmer 6s linear infinite",
              display: "inline-block",
            }}>
              Closer to Your
            </span>
            <br />Community.
          </h2>

          {/* Body */}
         

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
            <Link to="/franchise#inquiry" className="bmc-cta">
              Start Your Journey →
            </Link>
            <Link to="/franchise" className="bmc-ghost">
              Learn More
            </Link>
          </div>

        </div>
      </Slide>

      {/* ── RIGHT: Stats + perks grid ── */}
      <Slide direction="right" delay={120}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        

      
        </div>
      </Slide>

    </div>
  </div>
</section>



      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%);  }
        }
      `}</style>
    </main>
  );
}