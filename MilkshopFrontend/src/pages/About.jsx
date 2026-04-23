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
      <div className="about-hero-stat" style={{
        display: "flex", gap: 0,
        border: "1px solid #ddecc4",
        borderRadius: 16, overflow: "hidden",
        background: "white",
        alignSelf: "flex-start",
        boxShadow: "0 4px 20px rgba(151,182,76,0.1)",
      }}>
        {[
          { v: "2015", l: "Founded" },
          { v: "15+",  l: "Branches" },
          { v: "100%", l: "Fresh Milk" },
        ].map((s, i) => (
          <div key={s.l} className="about-stat-item" style={{
            padding: isMobile ? "14px 18px" : "16px 24px",
            textAlign: "center",
            borderRight: i < 2 ? "1px solid #ddecc4" : "none",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 900,
              fontSize: isMobile ? "1.1rem" : "1.3rem",
              color: "#1a1e14", lineHeight: 1,
              margin: "0 0 4px",
            }}>{s.v}</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "8px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.16em",
              color: "#97b64c", margin: 0,
            }}>{s.l}</p>
          </div>
        ))}
      </div>

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
      <section data-track-section="Raw Materials" className="relative py-28 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
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
          <Slide direction="up" delay={80} className="mb-16">
            <p className="text-base max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Every ingredient is traced to its source — tea from Nantou, milk from certified farms, popping boba from our Taiwan facility, and black sugar by a recipe we still slow-cook today. See how that chain becomes the drink in your hand.
            </p>
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

          <Slide direction="up" delay={120}>
            <div className="relative rounded-3xl overflow-hidden aspect-video max-w-4xl mx-auto" style={{ backgroundColor: "#0d0d0d" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                  backgroundColor: "rgba(151,182,76,0.15)",
                  border: "2px solid rgba(151,182,76,0.3)",
                }}>
                  <svg className="w-8 h-8 ml-1" fill="#97b64c" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </Slide>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 2 — 秘客侠 IDENTITY
      ══════════════════════════════════════════════ */}
      <section data-track-section="Milkshop Identity" className="relative py-28 overflow-hidden bg-white">
        {/* Large Chinese character watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none" style={{
          fontSize: "32vw", fontWeight: 900, lineHeight: 1,
          color: "rgba(151,182,76,0.04)",
          fontFamily: "serif",
        }}>
          侠
        </div>

        <div className="relative max-w-4xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" delay={0} className="text-center mb-6">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>The Milkshop Identity</p>
          </Slide>

          <Slide direction="up" delay={80} className="text-center mb-4">
            <h2 className="font-black" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "#1e1e1e", letterSpacing: "-0.04em", lineHeight: 1 }}>
              秘客侠
            </h2>
          </Slide>

          <Slide direction="up" delay={140} className="text-center mb-6">
            <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#97b64c" }}>
              The Secret Champion
            </p>
          </Slide>

          <Slide direction="up" delay={200} className="text-center">
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#5a5a5a" }}>
              The name 秘客侠 (Mì Kè Xiá) carries deep meaning — <em>"secret,"</em> <em>"guest,"</em> <em>"champion."</em> It represents a brand that quietly masters its craft before making its move. When Milkshop arrived in the Philippines in 2022, it didn't come with hype. It came with a product that spoke for itself.
            </p>
          </Slide>

          <Slide direction="up" delay={260} className="text-center mt-6">
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#5a5a5a" }}>
              Every recipe was tested over hundreds of iterations. Every ingredient was traced to its source. Every cup was designed to deliver the same experience — whether you're in a mall in Taipei or a branch in Davao. That consistency is not accidental. It's the result of a decade of quiet obsession.
            </p>
          </Slide>
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
          COMPACT PROMO — BRING MILKSHOP CLOSER
      ══════════════════════════════════════════════ */}
      <section data-track-section="Community Promo" className="relative py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16">
          <Slide direction="up">
            <div
              className="rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch"
              style={{
                border: "1px solid #e0ebd0",
                boxShadow: "0 10px 30px rgba(98,132,11,0.08)",
                background: "linear-gradient(120deg, #f8fbf2 0%, #ffffff 100%)",
                minHeight: 180,
              }}
            >
              <div className="md:w-[36%] w-full" style={{ minHeight: 180 }}>
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                  alt="Milk tea branch storefront"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-[64%] w-full flex items-center px-6 sm:px-8 py-6">
                <div>
                  <p
                    className="text-[11px] font-bold tracking-[0.24em] uppercase mb-2"
                    style={{ color: "#97b64c" }}
                  >
                    Community Growth
                  </p>
                  <h3
                    style={{
                      fontSize: "clamp(1.15rem, 2.3vw, 1.8rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      color: "#1e1e1e",
                      margin: 0,
                    }}
                  >
                    Bring Milkshop Closer to your community
                  </h3>
                </div>
              </div>
            </div>
          </Slide>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          SLIDE 6 — BOTTOM CTA
      ══════════════════════════════════════════════ */}
      <section data-track-section="About CTA" className="relative py-24 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, rgba(124, 182, 76, 0.1) 0%, transparent 70%)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <Slide direction="left" delay={0}>
              <h2 className="font-black" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Ready to be part<br />of the story? 🧋
              </h2>
              <p className="text-sm mt-4" style={{ color: "#b7cd7f" }}>
                Own a branch. Join the movement. Build something that lasts.
              </p>
            </Slide>

            <Slide direction="right" delay={120}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/franchise#inquiry"
                  className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 6px 24px rgba(151,182,76,0.35)" }}
                >
                  Franchise Now →
                </Link>
                <Link
                  to="/locations"
                  className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", backgroundColor: "transparent" }}
                >
                  Find a Branch
                </Link>
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