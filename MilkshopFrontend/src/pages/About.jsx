import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import FranchiseInquiryTrigger from "../components/FranchiseInquiryTrigger"
const logo = "/milkshop-logo-removebg-preview.png";

// ─── DESIGN TOKENS (match Home / Franchise) ───────────────────────────────────
const T = {
  green: "#97b64c",
  greenDark: "#62840b",
  greenLight: "#b7cd7f",
  greenFade: "#eef5e2",
  offWhite: "#f9fbf4",
  white: "#ffffff",
  ink: "#18210f",
  body: "#4a5640",
  muted: "#6b7280",
  border: "rgba(151,182,76,0.18)",
};

// ─── DATA (unchanged) ────────────────────────────────────────────────────────


const historyBlocks = [
  {
    image: "/about/history/storefront.png",
    fallback: "/HEROFRESH.jpg",
    alt: "Milkshop storefront — The Fresh Taste of Taiwan",
    label: "2022 — Arrival in PH",
    content: (
      <>
        Since <strong>January 2022</strong>, we&apos;ve brought the authentic taste of Taiwan to the Philippines!
      </>
    ),
  },
  {
    image: "/about/history/grand-opening.png",
    fallback: "/closer.jpg",
    alt: "Milkshop grand opening ribbon cutting",
    label: "Local Taste Evolution",
    content: (
      <>
        By learning local preferences, we continually improve to satisfy every taste bud.
      </>
    ),
  },
  {
    image: "/about/history/ingredientss.jpg",
    fallback: "/about/history/ingredients.png",
    alt: "Milkshop signature Taiwan green, black, and oolong tea",
    label: "Premium Ingredients",
    content: (
      <>
        We craft <em>authentic</em> Taiwanese flavors using premium ingredients{" "}
        <strong>imported from Taiwan.</strong>
      </>
    ),
  },
  {
    image: "/hero-bg-3.png",
    fallback: "/LOGOLAND.png",
    alt: "Milkshop brand",
    imageFirst: false,
    content: (
      <>
        Our true Taiwanese taste won hearts, making <strong>originality</strong> Milkshop&apos;s hallmark.
      </>
    ),
  },
];

function HistoryImage({ src, fallback, alt }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallback) setImgSrc(fallback);
      }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

const rawMaterials = [
  {
    title: "Premium Tea Leaves",
    caption: "Premium Taiwanese Tea",
    image: "/franchise/why/why-05.png",
    imageAlt: "Milkshop tea leaves and packaging imported from Taiwan",
  },
  {
    title: "Brown Sugar Pearls",
    caption: "Handcrafted and Chewy (Boba)",
    image: "/about/raw-materials/brown-sugar-pearls.png",
    imageAlt: "Brown sugar tapioca pearls in a bowl with a spoon",
  },
  {
    title: "Natural Ingredients",
    caption: "Healthy Options",
    image: "/about/raw-materials/natural-ingredients.png",
    imageAlt: "Fresh fruit, berries, and popping boba on ice",
  },
  {
    title: "Fresh Milk & Cream",
    caption: "Smooth & Milky",
    image: "/about/raw-materials/fresh-milk-boba.png",
    imageAlt: "Milk being poured into a milk tea with boba pearls",
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
  const [heroAnimReady, setHeroAnimReady] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    const startAnim = () => setHeroAnimReady(true)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAnim()
      return undefined
    }
    window.addEventListener("milkshop:route-loader-hidden", startAnim, { once: true })
    const fallback = window.setTimeout(startAnim, 2200)
    return () => {
      window.removeEventListener("milkshop:route-loader-hidden", startAnim)
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <main className="overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif", background: T.offWhite }}>
      <style>{`
        .ms-section-heading {
          margin: 0;
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: clamp(2rem, 4vw, 3.4rem);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.04em;
          color: ${T.greenDark};
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          SLIDE 1 — HERO: Born in Taiwan
      ══════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════
    ABOUT HERO — Premium Light, Animated
══════════════════════════════════════════════ */}
<section
  className={heroAnimReady ? "about-hero--ready" : ""}
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
    @keyframes aboutTaiwanPop {
      0%   { opacity: 0; transform: translateY(12px) scale(0.96) rotate(-1deg); filter: saturate(0.9); }
      55%  { opacity: 1; transform: translateY(0) scale(1.04) rotate(0deg); filter: saturate(1.05); }
      100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); filter: saturate(1); }
    }
    @keyframes aboutTaiwanFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-6px) scale(1); }
    }

    .about-taiwan-word {
      display: inline-flex;
      align-items: baseline;
      justify-content: center;
      vertical-align: baseline;
      margin-left: 14px;
      transform-origin: 50% 80%;
    }
    .about-taiwan-word img {
      height: clamp(53px, 9.12vw, 103px);
      width: auto;
      display: block;
      filter: drop-shadow(0 10px 26px rgba(0,0,0,0.38));
    }
    .about-hero--ready .about-taiwan-word {
      animation: aboutTaiwanPop 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: 0.45s;
    }
    .about-hero--ready .about-taiwan-word img {
      animation: aboutTaiwanFloat 3.6s ease-in-out infinite;
      animation-delay: 1.25s;
      will-change: transform;
    }

    .about-hero-tag, .about-hero-h1, .about-hero-p, .about-hero-stat, .about-hero-cta, .about-hero-img { opacity: 0; }
    .about-hero--ready .about-hero-tag  { animation: aboutFadeUp 0.6s ease forwards; animation-delay: 0.15s; }
    .about-hero--ready .about-hero-h1   { animation: aboutFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.3s; }
    .about-hero--ready .about-hero-p    { animation: aboutFadeLeft 0.75s ease forwards; animation-delay: 0.5s; }
    .about-hero--ready .about-hero-stat { animation: aboutFadeUp 0.7s ease forwards; animation-delay: 0.65s; }
    .about-hero--ready .about-hero-cta  { animation: aboutFadeUp 0.7s ease forwards; animation-delay: 0.8s; }
    .about-hero--ready .about-hero-img  { animation: aboutFadeRight 0.9s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.2s; }

    .about-hero-scroll-bar { opacity: 0; }
    .about-hero--ready .about-hero-scroll-bar { opacity: 1; animation: aboutScrollLine 1.8s ease-in-out infinite; }

    .about-hero-img-inner {
      opacity: 0;
    }
    .about-hero--ready .about-hero-img-inner {
      opacity: 1;
      animation: aboutFloatImg 8s ease-in-out infinite;
      animation-delay: 1.2s;
    }

    @media (prefers-reduced-motion: reduce) {
      .about-hero-tag, .about-hero-h1, .about-hero-p, .about-hero-stat, .about-hero-cta, .about-hero-img, .about-hero-img-inner, .about-hero-scroll-bar, .about-taiwan-word, .about-taiwan-word img {
        opacity: 1 !important;
        animation: none !important;
        transform: none !important;
        filter: none !important;
      }
    }

  .about-cta-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 32px;
    border-radius: 999px;
    background: #62840b;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-decoration: none;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(98, 132, 11, 0.28);
    transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }

  .about-cta-primary:hover {
    transform: translateY(-3px);
    background: #536f09;
    box-shadow: 0 12px 28px rgba(98, 132, 11, 0.34);
  }

  .about-cta-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 30px;
    border-radius: 999px;
    background: #fff;
    color: #62840b;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-decoration: none;
    border: 1.5px solid rgba(255, 255, 255, 0.95);
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
  }

  .about-cta-secondary:hover {
    transform: translateY(-3px);
    background: #f7faef;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
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
    

    <span className="about-taiwan-word">
      <img src="/about/taiwan-word.png" alt="Taiwan" />
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
        <FranchiseInquiryTrigger className="about-cta-primary">
         Franchise Opportunities 
        </FranchiseInquiryTrigger>
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
      <div
        className="about-hero-scroll-bar"
        style={{
          position: "absolute", top: 0, width: "100%", height: "40%",
          background: "#97b64c", borderRadius: 1,
        }}
      />
    </div>
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "8px", letterSpacing: "0.22em",
      textTransform: "uppercase", color: "#62840b",
    }}>Scroll</span>
  </div>

</section>


{/* ── Ingredients ── */}
<section
  className="ing-section"
  style={{
    background: T.green,
    padding: isMobile ? "56px 16px 64px" : "80px 32px 96px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  }}
>
  <style>{`
    .ing-section-inner {
      max-width: 1280px;
      margin: 0 auto;
    }

    .ing-header {
      text-align: center;
      margin-bottom: clamp(36px, 5vw, 56px);
    }

    .ing-header h2 {
      margin: 0;
      font-family: 'Signia Pro', sans-serif;
      font-size: clamp(1.75rem, 4.8vw, 2.85rem);
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 1.15;
      text-transform: uppercase;
      color: ${T.white};
    }

    .ing-cards {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .ing-card {
      display: flex;
      flex-direction: column;
      border-radius: 18px;
      overflow: hidden;
      background: ${T.white};
    }

    .ing-card-photo {
      width: 100%;
      aspect-ratio: 16 / 12;
      overflow: hidden;
      border-radius: 18px 18px 0 0;
      background: #f3f4f2;
    }

    .ing-card-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    .ing-card-caption {
      margin: 0;
      padding: 14px 16px;
      background: ${T.white};
      color: ${T.green};
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(0.78rem, 2vw, 0.88rem);
      font-weight: 700;
      letter-spacing: 0.02em;
      line-height: 1.35;
      text-align: center;
      border-radius: 0 0 18px 18px;
    }

    @media (min-width: 640px) {
      .ing-cards {
        grid-template-columns: repeat(2, 1fr);
        gap: clamp(18px, 2.4vw, 28px);
      }
      .ing-card-photo {
        aspect-ratio: 16 / 11;
        min-height: 240px;
      }
    }

    @media (min-width: 1024px) {
      .ing-cards {
        grid-template-columns: repeat(4, 1fr);
      }
      .ing-card-photo {
        aspect-ratio: 25 / 18;
        min-height: 264px;
      }
    }
  `}</style>

  <div className="ing-section-inner">
    <Slide direction="up" className="ing-header">
      <h2>Ingredients that Make the Difference</h2>
    </Slide>

    <ul className="ing-cards">
      {rawMaterials.map((r, i) => (
        <Slide key={r.title} direction="up" delay={i * 80} style={{ display: "contents" }}>
          <li className="ing-card">
            <div className="ing-card-photo">
              <img src={r.image} alt={r.imageAlt || r.title} loading="lazy" decoding="async" />
            </div>
            <p className="ing-card-caption">{r.caption}</p>
          </li>
        </Slide>
      ))}
    </ul>
  </div>
</section>

 
     {/* ══════════════════════════════════════════════
    COMPANY HISTORY — PREMIUM TIMELINE
══════════════════════════════════════════════ */}
<section
  className="relative overflow-hidden py-24 sm:py-32"
  style={{
    background: T.white,
    borderTop: `1px solid ${T.border}`,
    borderBottom: `1px solid ${T.border}`,
  }}
>
  <style>{`
    @keyframes historyOrbDrift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(28px, -22px) scale(1.06); }
    }
    @keyframes historyHeaderIn {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes historyTitlePop {
      0%   { opacity: 0; transform: translateY(20px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes historyAccentGrow {
      from { transform: scaleX(0); opacity: 0; }
      to   { transform: scaleX(1); opacity: 1; }
    }
    @keyframes historyDotPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(98,132,11,0.4), 0 0 18px rgba(151,182,76,0.35); }
      50%      { box-shadow: 0 0 0 10px rgba(98,132,11,0), 0 0 26px rgba(151,182,76,0.45); }
    }
    @keyframes historyFloat {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-10px); }
    }
    .history-img-float {
      animation: historyFloat 7s ease-in-out infinite;
      animation-delay: calc(var(--history-i, 0) * 0.45s);
      will-change: transform;
    }
    .history-img-float:hover {
      animation-play-state: paused;
    }
    .history-header-wrap {
      animation: historyHeaderIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .history-eyebrow {
      animation: historyTitlePop 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
    }
    .history-title-main {
      animation: historyTitlePop 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
    }
    .history-accent-bar {
      height: 3px;
      width: 52px;
      margin: 18px auto 0;
      border-radius: 999px;
      background: ${T.greenDark};
      transform-origin: center;
      animation: historyAccentGrow 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
    }
    .history-orb-a { animation: historyOrbDrift 16s ease-in-out infinite; }
    .history-orb-b { animation: historyOrbDrift 20s ease-in-out infinite reverse; }
    .history-timeline-dot {
      animation: historyDotPulse 2.8s ease-in-out infinite;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 5px;
      box-sizing: border-box;
    }
    .history-timeline-dot img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .history-img-card {
      transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease;
    }
    .history-img-card:hover {
      transform: perspective(1200px) rotateY(0deg) translateY(-6px) !important;
      box-shadow: 0 36px 90px rgba(98, 132, 11, 0.24) !important;
    }
    .history-img-card img { transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1); }
    .history-img-card:hover img { transform: scale(1.06); }
    .history-text-panel { transition: transform 0.4s ease; }
    .history-text-panel:hover { transform: translateY(-4px); }
    @media (prefers-reduced-motion: reduce) {
      .history-header-wrap, .history-eyebrow, .history-title-main, .history-accent-bar {
        animation: none; opacity: 1; transform: none;
      }
      .history-orb-a, .history-orb-b, .history-timeline-dot, .history-img-float {
        animation: none;
      }
      .history-img-card:hover { transform: none !important; }
      .history-img-card:hover img { transform: none; }
    }
  `}</style>

  {/* ── BACKGROUND GLOWS ── */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
    }}
  >
    <div
      className="history-orb-a"
      style={{
        position: "absolute",
        width: 420,
        height: 420,
        borderRadius: "50%",
        background: "rgba(151,182,76,.14)",
        filter: "blur(80px)",
        top: -120,
        left: -120,
      }}
    />

    <div
      className="history-orb-b"
      style={{
        position: "absolute",
        width: 380,
        height: 380,
        borderRadius: "50%",
        background: "rgba(98,132,11,.12)",
        filter: "blur(80px)",
        bottom: -100,
        right: -100,
      }}
    />

    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.12) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
  </div>

  {/* ── CENTER TIMELINE ── */}
  {!isMobile && (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 220,
        transform: "translateX(-50%)",
        width: 4,
        height: "68%",
        borderRadius: 999,
        background:
          "linear-gradient(to bottom, rgba(98,132,11,0), rgba(98,132,11,.35), rgba(98,132,11,0))",
      }}
    />
  )}

  <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
    {/* ── HEADER ── */}
    <div className="history-header-wrap text-center mb-20 sm:mb-24">
  

      <h2 className="history-title-main ms-section-heading">
        ABOUT MILKSHOP
      </h2>

      <div className="history-accent-bar" aria-hidden />

    
    </div>

    {/* ── TIMELINE BLOCKS ── */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(42px, 6vw, 78px)",
      }}
    >
      {historyBlocks.map((block, i) => {
        const imageLeft = isMobile ? true : i % 2 === 0;

        return (
          <Slide
            key={block.image}
            direction={imageLeft ? "left" : "right"}
            delay={i * 100}
          >
            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "clamp(26px, 4vw, 58px)",
                alignItems: "center",
              }}
            >
              {/* ── TIMELINE DOT ── */}
              {!isMobile && (
                <div
                  className="history-timeline-dot"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "3px solid rgba(98,132,11,0.28)",
                    zIndex: 20,
                  }}
                  aria-hidden
                >
                  <img src={logo} alt="" />
                </div>
              )}

              {/* ── IMAGE ── */}
              <div
                style={{
                  order: imageLeft ? 0 : 1,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: -12,
                    borderRadius: 30,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,.5), rgba(255,255,255,.08))",
                    filter: "blur(12px)",
                  }}
                />

                <div
                  className="history-img-float"
                  style={{ "--history-i": i }}
                >
                  <div
                    className="history-img-card"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: 28,
                      background: "rgba(255,255,255,.55)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,.7)",
                      boxShadow: "0 30px 80px rgba(98,132,11,0.18)",
                      transform: imageLeft
                        ? "perspective(1200px) rotateY(-5deg)"
                        : "perspective(1200px) rotateY(5deg)",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "4 / 3",
                        overflow: "hidden",
                      }}
                    >
                      <HistoryImage
                        src={block.image}
                        fallback={block.fallback}
                        alt={block.alt}
                      />
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,.18), transparent 40%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── TEXT ── */}
              <div
                className="history-text-panel"
                style={{
                  order: imageLeft ? 1 : 0,
                  textAlign: isMobile
                    ? "center"
                    : imageLeft
                    ? "left"
                    : "right",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    marginBottom: 14,
                    fontSize: ".82rem",
                    fontWeight: 800,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: T.greenDark,
                  }}
                >
                  {i === 0
                    ? "2022 — Arrival in PH"
                    : i === 1
                    ? "Local Taste Evolution"
                    : "Authentic Taiwanese Craft"}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "clamp(1.1rem, 2.1vw, 1.38rem)",
                    lineHeight: 1.8,
                    color: T.ink,
                    fontWeight: 500,
                  }}
                >
                  {block.content}
                </p>
              </div>
            </div>
          </Slide>
        );
      })}
    </div>

    {/* ── ENDING STATEMENT ── */}
    <Slide direction="up">
      <div
        style={{
          textAlign: "center",
          marginTop: "clamp(80px, 10vw, 140px)",
        }}
      >
        <p className="ms-section-heading">
          From Taiwan to the Philippines —
          <br />
          one cup at a time.
        </p>
      </div>
    </Slide>
  </div>
</section>
   

      {/* ══════════════════════════════════════════════
    BRING MILKSHOP CLOSER — Full Section
    PASTE THIS to REPLACE line 583 to line 635
    (replaces the compact promo section entirely)
══════════════════════════════════════════════ */}
<section
  className="relative overflow-hidden"
  style={{
    background: T.offWhite,
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
      background: #62840b;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 800;
      text-decoration: none;
      letter-spacing: 0.02em;
      box-shadow: 0 14px 40px rgba(98,132,11,0.32);
      transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.25s ease;
    }
    .bmc-cta:hover {
      background: #536f09;
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
    .bmc-split {
      display: grid;
      grid-template-columns: 1fr;
      align-items: stretch;
      min-height: 0;
    }
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

    {/* ── Two column: image 50% | text 50% ── */}
    <div
      className="bmc-split"
      style={{
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? 40 : 0,
        minHeight: isMobile ? "auto" : "clamp(420px, 48vw, 560px)",
      }}
    >
      {/* ── LEFT: Photo (fills half) ── */}
      <Slide direction="left">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "clamp(280px, 50vw, 380px)" : "100%",
            minHeight: isMobile ? "clamp(280px, 50vw, 380px)" : "100%",
            overflow: "hidden",
            borderRadius: isMobile ? 20 : "20px 0 0 20px",
            border: "1px solid rgba(151,182,76,0.22)",
            borderRight: isMobile ? undefined : "none",
            boxShadow: isMobile ? "0 16px 40px rgba(98,132,11,0.12)" : "none",
          }}
        >
          <img
            src="/closer.jpg"
            alt="Milkshop drinks"
            loading="lazy"
            decoding="async"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "linear-gradient(90deg, transparent 60%, rgba(249,251,244,0.15) 100%)",
            }}
          />
        </div>
      </Slide>

      {/* ── RIGHT: Text ── */}
      <Slide direction="right" delay={120}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            height: "100%",
            padding: isMobile ? "0 4px" : "0 clamp(32px, 5vw, 64px)",
            boxSizing: "border-box",
          }}
        >
          <h2 className="ms-section-heading">
            Bring Milkshop<br />
            <span style={{ color: T.ink }}>Closer to Your</span>
            <br />
            <span style={{ color: T.ink }}>Community.</span>
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
            <FranchiseInquiryTrigger className="bmc-cta">
              Start Your Journey →
            </FranchiseInquiryTrigger>
            <Link to="/franchise" className="bmc-ghost">
              Learn More
            </Link>
          </div>
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