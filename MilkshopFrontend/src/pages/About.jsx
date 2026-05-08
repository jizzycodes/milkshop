import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
const logo = "/milkshop-logo-removebg-preview.png";

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
  {
    title: "Premium Tea Leaves",
    origin: "Taiwan Highlands",
    desc: "Slow-grown tea leaves with deep aroma and smooth finish.",
    image: "/images/tea-leaves.jpg",
  },
  {
    title: "Fresh Milk",
    origin: "Daily Sourced",
    desc: "Creamy texture that balances every brewed flavor.",
    image: "/images/fresh-milk.jpg",
  },
  {
    title: "Brown Sugar Pearls",
    origin: "Handcrafted Daily",
    desc: "Soft, chewy pearls cooked for the perfect bite.",
    image: "/images/boba.jpg",
  },
  {
    title: "Natural Ingredients",
    origin: "Carefully Selected",
    desc: "Made with quality ingredients chosen for authentic taste.",
    image: "/images/ingredients.jpg",
  },
]

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
    preload="none"
    poster="/HEROFRESH.jpg"
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
    <source src="/Enhancer-HD-Boba.mp4" type="video/mp4" />
  </video>

  {/* ── Dim Overlay ── */}
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 3,
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
      zIndex: 3,
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 15px 34px;
  border-radius: 999px;

  background: linear-gradient(
    135deg,
    #62840b 0%,
    #97b64c 55%,
    #b7cd7f 100%
  );

  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.01em;

  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.14);

  cursor: pointer;

  box-shadow:
    0 10px 35px rgba(166,196,74,0.22),
    inset 0 1px 0 rgba(255,255,255,0.18);

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    filter 0.35s ease;
}

.about-cta-primary:hover {
  transform: translateY(-4px) scale(1.015);

  box-shadow:
    0 18px 50px rgba(166,196,74,0.34),
    inset 0 1px 0 rgba(255,255,255,0.22);

  filter: brightness(1.03);
}

.about-cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 15px 32px;
  border-radius: 999px;

  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(14px);

  color: rgba(246,241,231,0.92);

  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.01em;

  text-decoration: none;

  border: 1px solid rgba(255,255,255,0.12);

  transition:
    transform 0.35s ease,
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.about-cta-secondary:hover {
  transform: translateY(-3px);

  background: rgba(255,255,255,0.08);

  border-color: rgba(255,255,255,0.22);

  box-shadow:
    0 10px 35px rgba(0,0,0,0.18);
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
    gridTemplateColumns: "1fr",
    gap: isMobile ? 48 : 60,
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
  }}>

    {/* Text */}
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>

   
{/* Headline */}
<div className="about-hero-h1">
  <h1
    style={{
      fontSize: isMobile
        ? "clamp(2.7rem, 12vw, 3.8rem)"
        : "clamp(3.8rem, 6vw, 6.4rem)",
      fontWeight: 900,
      lineHeight: 0.92,
      letterSpacing: "-0.06em",
      margin: 0,
      color: "#F6F1E7",
      textShadow: "0 6px 30px rgba(0,0,0,0.38)",
    }}
  >
    Born in
    <br />

    <span
      style={{
        background:
          "linear-gradient(135deg, #A6C44A 0%, #C8D97B 45%, #E2C078 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "aboutShimmer 6s linear infinite",
        display: "inline-block",
      }}
    >
      Taiwan.
    </span>

    <br />

    <span
      style={{
        color: "rgba(246,241,231,0.92)",
      }}
    >
      Made for Milk Tea Lovers.
    </span>
  </h1>
</div>

{/* Body */}
<div className="about-hero-p">
  <p
    style={{
      fontSize: "clamp(0.95rem, 1.4vw, 1.08rem)",
      lineHeight: 1.9,
      color: "rgba(246,241,231,0.72)",
      maxWidth: 620,
      margin: 0,
      fontWeight: 400,
      textShadow: "0 2px 18px rgba(0,0,0,0.22)",
    }}
  >
    Crafted from authentic Taiwanese tea culture — blending rich brews,
    creamy textures, and handcrafted flavors into every cup. From first sip
    to last pearl, every drink is made to satisfy real milk tea cravings.
  </p>
</div>

      {/* Stats strip */}
     

      {/* CTAs */}
      <div className="about-hero-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        <Link to="/franchise#inquiry" className="about-cta-primary">
         Franchise Opportunities 
        </Link>
        <Link to="/products" className="about-cta-secondary">
          See our Menu →
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



      {/* ── From Farm to Cup ── */}
      <section
        data-track-section="From Farm to Cup"
        className="relative overflow-hidden"
        style={{
          background: "#fafaf8",
          padding: isMobile ? "72px 18px 80px" : "100px 48px 112px",
        }}
      >
        <style>{`
          @keyframes ftc-shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .ftc-card {
            background: #ffffff;
            border: 1px solid rgba(151,182,76,0.18);
            border-radius: 24px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.3s ease;
            box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          }
          .ftc-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 48px rgba(151,182,76,0.14), 0 4px 16px rgba(0,0,0,0.06);
            border-color: rgba(151,182,76,0.42);
          }
          .ftc-card:hover .ftc-accent-bar {
            width: 100%;
          }
          .ftc-card:hover .ftc-img-wrap img {
            transform: scale(1.04);
          }
          .ftc-accent-bar {
            height: 3px;
            width: 36px;
            background: linear-gradient(90deg, #62840b, #97b64c);
            border-radius: 99px;
            transition: width 0.45s cubic-bezier(0.16,1,0.3,1);
          }
          .ftc-origin-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(151,182,76,0.1);
            border: 1px solid rgba(151,182,76,0.22);
            font-family: 'DM Mono', monospace;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #62840b;
          }
          .ftc-img-wrap {
            overflow: hidden;
            width: 100%;
            aspect-ratio: 4 / 3;
            background: #f0f4ea;
            position: relative;
          }
          .ftc-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
          }
          .ftc-img-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(145deg, #f0f5e8 0%, #e8f0dc 100%);
            font-size: 3rem;
          }
        `}</style>

        {/* Subtle dot grid */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.14) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
        }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <Slide direction="up" className="text-center" style={{ marginBottom: isMobile ? 40 : 56 }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "#97b64c",
              margin: "0 0 12px",
            }}>
              From Farm to Cup
            </p>
            <h2 style={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#1a1e14",
              fontSize: isMobile ? "clamp(1.9rem,6vw,2.4rem)" : "clamp(2.4rem,4vw,3.2rem)",
              lineHeight: 1.08,
              margin: "0 0 14px",
            }}>
              Ingredients that Make the Difference
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem", color: "#6a7a5a",
              maxWidth: 440, margin: "0 auto", lineHeight: 1.7,
            }}>
              Every cup starts with ingredients sourced and crafted for one purpose — authentic taste.
            </p>
          </Slide>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rawMaterials.map((r, i) => (
              <Slide key={r.title} direction="up" delay={i * 70}>
                <div className="ftc-card">

                  {/* Image area */}
                  <div className="ftc-img-wrap">
                    {r.image ? (
                      <img src={r.image} alt={r.title} loading="lazy" decoding="async" />
                    ) : (
                      <div className="ftc-img-placeholder">
                        {["🍃", "🥛", "🧋", "🌿"][i]}
                      </div>
                    )}
                    {/* Soft green overlay at bottom of image */}
                    <div aria-hidden style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                      background: "linear-gradient(to top, rgba(240,245,232,0.55), transparent)",
                      pointerEvents: "none",
                    }} />
                  </div>

                  {/* Body */}
                  <div style={{
                    padding: isMobile ? "20px 20px 24px" : "22px 24px 28px",
                    display: "flex", flexDirection: "column", gap: 10, flex: 1,
                  }}>
                    <span className="ftc-origin-badge">● {r.origin}</span>

                    <div className="ftc-accent-bar" />

                    <h3 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 900,
                      fontSize: isMobile ? "1.25rem" : "1.35rem",
                      letterSpacing: "-0.03em",
                      color: "#1a1e14",
                      margin: 0,
                      lineHeight: 1.15,
                    }}>
                      {r.title}
                    </h3>

                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.875rem",
                      color: "#6a7a5a",
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {r.desc}
                    </p>
                  </div>

                </div>
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
            src="/closer.jpg"
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