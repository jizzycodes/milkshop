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

// ─── TIMELINE V2 — CLEAN SINGLE LAYOUT ───────────────────────────────────────

const TL2_ACCENTS = ["#7ab52e","#62840b","#4f7209","#62840b","#7ab52e","#97b64c"];

function TL2Body() {
  const spineRef = useRef(null);
  const [spineInView, setSpineInView] = useState(false);

  useEffect(() => {
    const el = spineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSpineInView(true); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ position:"relative" }}>

      {/* Spine track */}
      <div ref={spineRef} style={{
        position:"absolute",
        left: "clamp(20px,6vw,32px)",
        top:0, bottom:0, width:2,
        background:"rgba(151,182,76,0.1)",
        borderRadius:2,
      }}>
        <div className="tl2-spine-fill" style={{
          width:"100%", height:"100%", borderRadius:2,
          background:"linear-gradient(180deg,#97b64c 0%,#b7cd7f 60%,rgba(183,205,127,0.3) 100%)",
          opacity: spineInView ? 1 : 0,
          animationPlayState: spineInView ? "running" : "paused",
        }}/>
      </div>

      {/* Items */}
      <div style={{ display:"flex", flexDirection:"column", gap:"clamp(28px,5vw,52px)" }}>
        {milestones.map((m, i) => (
          <TL2Item key={m.year} m={m} i={i} accent={TL2_ACCENTS[i % TL2_ACCENTS.length]} />
        ))}
      </div>
    </div>
  );
}

function TL2Item({ m, i, accent }) {
  const [ref, inView] = useInView(0.1);
  const delay = i * 90;

  return (
    <div ref={ref} style={{
      display:"flex",
      alignItems:"flex-start",
      gap:"clamp(16px,4vw,32px)",
    }}>

      {/* ── DOT ── */}
      <div style={{
        flexShrink:0,
        width:"clamp(40px,8vw,56px)",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        paddingTop:4,
        position:"relative",
        zIndex:2,
      }}>
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {/* Rings */}
          {inView && (<>
            <div className="tl2-ring" style={{
              position:"absolute",
              width:54, height:54, borderRadius:"50%",
              border:`1.5px solid ${accent}`,
              pointerEvents:"none",
              animationDelay:`${delay}ms`,
            }}/>
            <div className="tl2-ring2" style={{
              position:"absolute",
              width:54, height:54, borderRadius:"50%",
              border:`1px solid ${accent}`,
              pointerEvents:"none",
              animationDelay:`${delay + 800}ms`,
            }}/>
          </>)}

          {/* Dot */}
          <div
            className={inView ? "tl2-dot" : ""}
            style={{
              width:"clamp(40px,6vw,52px)",
              height:"clamp(40px,6vw,52px)",
              borderRadius:"50%",
              background:`linear-gradient(135deg, ${accent}, #c5dc8a)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"clamp(1rem,2.5vw,1.3rem)",
              boxShadow:`0 6px 22px rgba(151,182,76,0.35)`,
              border:"3px solid #fff",
              animationDelay:`${delay + 60}ms`,
              opacity: inView ? 1 : 0,
            }}
          >
            <span className="tl2-icon">{m.icon}</span>
          </div>
        </div>
      </div>

      {/* ── CARD ── */}
      <div
        className={inView ? "tl2-card" : ""}
        style={{
          flex:1,
          borderRadius:"clamp(16px,2vw,22px)",
          background:"rgba(255,255,255,0.95)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          border:"1px solid rgba(151,182,76,0.16)",
          boxShadow:"0 6px 28px rgba(151,182,76,0.09)",
          overflow:"hidden",
          opacity: inView ? 1 : 0,
          animationDelay:`${delay + 80}ms`,
          position:"relative",
        }}
      >
        {/* Top accent bar */}
        <div
          className={inView ? "tl2-bar" : ""}
          style={{
            height:4,
            background:`linear-gradient(90deg, ${accent}, #c5dc8a)`,
            animationDelay:`${delay + 200}ms`,
          }}
        />

        <div style={{ padding:"clamp(16px,3vw,26px) clamp(16px,3vw,28px) clamp(16px,3vw,24px)" }}>

          {/* Year watermark */}
          <div aria-hidden style={{
            position:"absolute", right:"clamp(12px,2vw,20px)", top:"clamp(10px,1.5vw,14px)",
            fontFamily:"'DM Mono',monospace",
            fontSize:"clamp(3rem,7vw,5.5rem)",
            fontWeight:900, lineHeight:1,
            color:"rgba(151,182,76,0.07)",
            pointerEvents:"none", userSelect:"none",
            letterSpacing:"-0.04em",
          }}>{m.year}</div>

          {/* Tag */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            padding:"5px 12px", borderRadius:999,
            background:"rgba(151,182,76,0.09)",
            border:"1px solid rgba(151,182,76,0.2)",
            marginBottom:"clamp(8px,1.5vw,12px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(-6px)",
            transition:`opacity 0.5s ease ${delay + 280}ms, transform 0.5s ease ${delay + 280}ms`,
          }}>
            <span style={{ fontSize:"11px" }}>{m.icon}</span>
            <span style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"10px", fontWeight:800,
              letterSpacing:"0.16em", textTransform:"uppercase",
              color:"#62840b",
            }}>{m.label}</span>
          </div>

          {/* Year text */}
          <p style={{
            fontFamily:"'DM Mono',monospace",
            fontSize:"clamp(10px,1.2vw,12px)", fontWeight:800,
            letterSpacing:"0.2em", color:accent,
            margin:"0 0 clamp(6px,1vw,8px)",
            opacity: inView ? 1 : 0,
            transition:`opacity 0.5s ease ${delay + 320}ms`,
          }}>{m.year}</p>

          {/* Description */}
          <p style={{
            fontFamily:"'DM Sans',sans-serif",
            fontSize:"clamp(0.82rem,1.3vw,0.93rem)",
            lineHeight:1.78, color:"#4d5c3a", margin:0,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(10px)",
            transition:`opacity 0.55s ease ${delay + 360}ms, transform 0.55s ease ${delay + 360}ms`,
          }}>{m.desc}</p>

        </div>
      </div>

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
    minHeight: isMobile ? "88vh" : "100vh",
    display: "flex",
    alignItems: "center",
    fontFamily: "'DM Sans', sans-serif",
  }}
>

  {/* ── Video Background ── */}
  <video
    autoPlay
    muted
    loop
    playsInline
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      filter: "brightness(0.75) saturate(0.9)",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    <source src="/public/Enhancer-HD-Boba.mp4" type="video/mp4" />
  </video>

  {/* ── Dim Overlay ── */}
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 1,
      background: "linear-gradient(158deg, rgba(18,26,8,0.62) 0%, rgba(24,34,12,0.50) 40%, rgba(20,30,10,0.58) 100%)",
      pointerEvents: "none",
    }}
  />

  {/* ── Soft green vignette edges ── */}
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 2,
      background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,18,4,0.35) 100%)",
      pointerEvents: "none",
    }}
  />

  
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

     

      {/* Headline */}
      <div className="about-hero-h1">
        <h1 style={{
          fontSize: isMobile ? "clamp(2.6rem, 12vw, 3.6rem)" : "clamp(3.4rem, 6vw, 5.8rem)",
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          margin: 0,
          color: "#f4f9ec",
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
          <span style={{ color: "#b7cd7f" }}>Brewed with Love.</span>
        </h1>
      </div>

      {/* Body */}
      <div className="about-hero-p">
        <p style={{
          fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
          lineHeight: 1.8,
          color: "rgba(220,235,200,0.88)",
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

  
  </div>

  {/* Scroll cue */}
  <div style={{
    position: "absolute", bottom: 28, left: "50%",
    transform: "translateX(-50%)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    opacity: 0.65,
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
    SLIDE 3 — TIMELINE (Clean Rebuild)
══════════════════════════════════════════════ */}
<section data-track-section="Company Timeline" className="relative overflow-hidden" style={{
  background: "linear-gradient(170deg, #f7faf0 0%, #ffffff 50%, #f3f9ea 100%)",
  padding: "clamp(72px,10vw,128px) 0",
}}>
  <style>{`
    @keyframes tlShimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes tlOrbFloat {
      0%,100% { transform: translate(0,0) scale(1); opacity:0.5; }
      50%      { transform: translate(12px,-14px) scale(1.06); opacity:0.75; }
    }
    @keyframes tlSpineFill {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    @keyframes tlDotBounce {
      0%   { transform: scale(0.3) rotate(-15deg); opacity:0; }
      60%  { transform: scale(1.18) rotate(4deg); opacity:1; }
      80%  { transform: scale(0.94) rotate(-2deg); }
      100% { transform: scale(1) rotate(0deg); opacity:1; }
    }
    @keyframes tlRingOut {
      0%   { transform: scale(1); opacity: 0.7; }
      100% { transform: scale(2.6); opacity: 0; }
    }
    @keyframes tlCardSlide {
      from { opacity:0; transform: translateX(36px); }
      to   { opacity:1; transform: translateX(0); }
    }
    @keyframes tlBarGrow {
      from { width: 0; }
      to   { width: 100%; }
    }
    @keyframes tlIconSway {
      0%,100% { transform: rotate(-6deg) scale(1); }
      50%      { transform: rotate(6deg) scale(1.1); }
    }
    @keyframes tlFadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .tl2-card {
      animation: tlCardSlide 0.6s cubic-bezier(0.16,1,0.3,1) both;
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
    }
    .tl2-card:hover {
      transform: translateY(-6px) translateX(3px) !important;
      box-shadow: 0 24px 60px rgba(151,182,76,0.18) !important;
    }
    .tl2-dot {
      animation: tlDotBounce 0.65s cubic-bezier(0.16,1,0.3,1) both;
    }
    .tl2-ring {
      animation: tlRingOut 2.2s ease-out infinite;
    }
    .tl2-ring2 {
      animation: tlRingOut 2.2s ease-out 0.8s infinite;
    }
    .tl2-icon {
      animation: tlIconSway 4s ease-in-out infinite;
      display: inline-block;
    }
    .tl2-bar {
      animation: tlBarGrow 0.9s cubic-bezier(0.16,1,0.3,1) both;
    }
    .tl2-spine-fill {
      transform-origin: top center;
      animation: tlSpineFill 2.4s cubic-bezier(0.16,1,0.3,1) both;
    }
  `}</style>

  {/* Orbs */}
  <div aria-hidden style={{
    position:"absolute", top:"-6%", right:"-3%",
    width:480, height:480, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(151,182,76,0.1) 0%, transparent 68%)",
    filter:"blur(40px)", pointerEvents:"none",
    animation:"tlOrbFloat 15s ease-in-out infinite",
  }}/>
  <div aria-hidden style={{
    position:"absolute", bottom:"-4%", left:"-2%",
    width:320, height:320, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(183,205,127,0.13) 0%, transparent 70%)",
    filter:"blur(28px)", pointerEvents:"none",
    animation:"tlOrbFloat 19s ease-in-out infinite reverse",
  }}/>
  {/* Dot grid */}
  <div aria-hidden style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:"radial-gradient(circle, rgba(151,182,76,0.12) 1.5px, transparent 1.5px)",
    backgroundSize:"36px 36px",
    maskImage:"radial-gradient(ellipse at 50% 50%, black 0%, transparent 62%)",
    WebkitMaskImage:"radial-gradient(ellipse at 50% 50%, black 0%, transparent 62%)",
  }}/>

  <div style={{
    maxWidth:1000, margin:"0 auto",
    padding:"0 clamp(16px,5vw,56px)",
    position:"relative", zIndex:10,
  }}>

    {/* Header */}
    <Slide direction="up" style={{ textAlign:"center", marginBottom:"clamp(8px,2vw,12px)" }}>
      <p style={{
        fontSize:"11px", fontWeight:800, letterSpacing:"0.3em",
        textTransform:"uppercase", color:"#97b64c",
        fontFamily:"'DM Sans',sans-serif", margin:0,
      }}>Company History</p>
    </Slide>
    <Slide direction="up" delay={60} style={{ textAlign:"center", marginBottom:"clamp(12px,2vw,16px)" }}>
      <h2 style={{
        fontSize:"clamp(2.4rem,6vw,4.4rem)",
        fontWeight:900, letterSpacing:"-0.04em",
        color:"#1a1e14", margin:0,
        fontFamily:"'DM Sans',sans-serif", lineHeight:1.0,
      }}>
        A Decade{" "}
        <span style={{
          background:"linear-gradient(120deg,#3a5c06 0%,#62840b 30%,#97b64c 65%,#b7cd7f 100%)",
          backgroundSize:"200% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          animation:"tlShimmer 5s linear infinite",
          display:"inline-block",
        }}>in the Making</span>
      </h2>
    </Slide>
    <Slide direction="up" delay={100} style={{ textAlign:"center", marginBottom:"clamp(52px,8vw,96px)" }}>
      <p style={{
        fontSize:"clamp(0.88rem,1.4vw,1rem)",
        color:"#5a6a4a", lineHeight:1.75,
        maxWidth:440, margin:"0 auto",
        fontFamily:"'DM Sans',sans-serif",
      }}>
        From a single store in Taiwan to a growing franchise network in the Philippines.
      </p>
    </Slide>

    {/* Timeline body */}
    <TL2Body />

  </div>
</section>

      {/* ══════════════════════════════════════════════
    BRING MILKSHOP CLOSER — 
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

      {/* ── RIGHT: Branch photo ── */}
      <Slide direction="right" delay={120}>
        <div
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(151,182,76,0.28)",
            boxShadow: "0 28px 64px rgba(98,132,11,0.18), 0 10px 28px rgba(0,0,0,0.06)",
            background: "linear-gradient(145deg, #eef5df 0%, #ffffff 100%)",
          }}
        >
          <img
            src="/HEROFRESH.jpg"
            alt="Milkshop branch"
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              aspectRatio: "4 / 5",
              maxHeight: isMobile ? 380 : 520,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "linear-gradient(180deg, transparent 55%, rgba(26,30,20,0.12) 100%)",
            }}
          />
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