import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { createFranchiseRequest } from "../services/api"
import { localDatetimeLocalFloor } from "../utils/dateInputConstraints"


// ─── DATA (unchanged) ────────────────────────────────────────────────────────

/** Drop files here: `public/franchise/process/step-01.png` … `step-06.png` (or change paths below). */
const steps = [
  { step: "01", icon: "📋", title: "APPLICATION",    desc: "Contact us or fill out our franchise application form and provide us with some basic information about your background and what you envision for your store.",    image: "/franchise/process/step-01.png" },
  { step: "02", icon: "🤝", title: "INTERVIEW & QUALIFICATIONS", desc: "Contact us or fill out our franchise application form and provide us with some basic information about your background and what you envision for your store.", image: "/franchise/process/step-02.png" },
  { step: "03", icon: "📍", title: "LOCATION ASSESSMENT & SUPPORT",   desc: "We will work with you to find the perfect location and negotiate a lease for your new store.", image: "/franchise/process/step-03.png" },
  { step: "04", icon: "✍️", title: "CONTRACT SIGNING",    desc: "Together we will sign our commitment to bring the Fresh Taste of Taiwan here in the Philippines.", image: "/franchise/process/step-04.png" },
  { step: "05", icon: "🏗️", title: "SETUP & TRAINING",  desc: "You will receive training to prepare you for running a successful Milkshop Franchise", image: "/franchise/process/step-05.png" },
  { step: "06", icon: "🎉", title: "GRAND OPENING", desc: "Finally,following the successful completion of your training, your store will open and you will become a Milkshop Franchisee.", image: "/franchise/process/step-06.png" },
];

const faqs = [
  { q: "Do I need food industry experience?",   a: "None required. Our end-to-end training program covers everything — operations, drink preparation, inventory, and customer service. We've trained first-timers who are now running multiple branches." },
  { q: "How long is the franchise term?",        a: "Terms vary by package — 2 years for Cart, 3 years for Kiosk, and 5 years for In-Line Store. All terms are renewable upon mutual assessment." },
  { q: "Is my territory exclusive?",             a: "Yes. Once your location is approved, no other Milkshop franchise will open within the agreed exclusivity radius — protecting your investment from day one." },
  { q: "What is the expected ROI period?",       a: "Based on current branch performance, franchisees typically recover their investment within 12–18 months — depending on location foot traffic and daily volume." },
  { q: "Does Milkshop supply the ingredients?",  a: "Yes. All tea, milk, boba, cups, and branded materials are supplied directly by Milkshop PH — so every cup you serve meets our quality standard." },
  { q: "How do I get started?",                  a: "Simply fill out the Franchise Inquiry form on this page. Our team will reach out within 3–5 business days to schedule your initial interview." },
];

const whyUs = [
  { icon: "🇹🇼", title: "Authentic Taiwan Brand",  desc: "Not a local copycat. Milkshop is the real thing — born in Taiwan with a decade of proven recipes and systems." },
  { icon: "🫧",  title: "Unique Product",           desc: "The only brand in PH offering Taiwanese Popping Boba milk products. No direct competition in this niche." },
  { icon: "📦",  title: "Turnkey System",           desc: "Equipment, training, supply chain, marketing — all provided. You run the business, we back you up completely." },
  { icon: "📈",  title: "Proven ROI",               desc: "Current franchisees recover investment in 12–18 months. Our model is built for profitability, not just presence." },
];

// ─── DESIGN TOKENS (match Home.jsx) ─────────────────────────────────────────
const T = {
  green: "#97b64c",
  greenDark: "#62840b",
  greenLight: "#b7cd7f",
  greenFade: "#eef5e2",
  heroGradient: "linear-gradient(135deg, #f7faef 0%, #eef6dc 55%, #e8f2d0 100%)",
  offWhite: "#f9fbf4",
  white: "#ffffff",
  ink: "#18210f",
  body: "#4a5640",
  muted: "#6b7280",
  border: "rgba(151,182,76,0.15)",
  dark: "#1e1e1e",
  onDark: "#f5f8ef",
  onDarkMuted: "#c8dba0",
};

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Slide({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const from = { up: "translateY(40px)", left: "translateX(-40px)", right: "translateX(40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      width: "100%",
      minWidth: 0,
      ...style,
      opacity:    inView ? 1 : 0,
      transform:  inView ? "none" : from[direction],
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function ProcessCard({ s, i }) {
  return (
    <article className="process-card" style={{ "--step-i": i }}>
      <div className="process-card-media">
        <img
          src={s.image}
          alt={`Milkshop franchise — ${s.title}`}
          loading={i < 3 ? "eager" : "lazy"}
          decoding="async"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="process-card-fallback" aria-hidden>
          <span>{s.icon}</span>
        </div>
      </div>
      <div className="process-card-copy">
        <p className="process-card-desc">{s.desc}</p>
      </div>
    </article>
  );
}

function ProcessFlowArrow({ direction = "right", delay = 0 }) {
  const stroke = T.greenDark;
  const isDown = direction === "down";
  return (
    <div
      className={`process-flow-arrow process-flow-arrow--${direction}`}
      style={{ "--arrow-delay": `${delay * 120}ms` }}
      aria-hidden
    >
      <svg
        viewBox={isDown ? "0 0 24 36" : "0 0 40 24"}
        width={isDown ? 28 : 44}
        height={isDown ? 44 : 28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isDown ? (
          <>
            <line x1="12" y1="4" x2="12" y2="28" stroke={stroke} strokeWidth="2.75" strokeLinecap="round" />
            <path d="M6 22 L12 32 L18 22" stroke={stroke} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <line x1="4" y1="12" x2="30" y2="12" stroke={stroke} strokeWidth="2.75" strokeLinecap="round" />
            <path d="M22 6 L34 12 L22 18" stroke={stroke} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    </div>
  );
}

/** Staggered slide-up when process flow enters view (CSS transitions — not paused while scrolling). */
function ProcessStepsGrid() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let revealTimer;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        revealTimer = window.setTimeout(() => setRevealed(true), 150);
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (revealTimer) window.clearTimeout(revealTimer);
    };
  }, []);

  const revealedClass = revealed ? " is-revealed" : "";

  return (
    <div ref={ref} className={`process-flow-root${revealedClass}`}>
      <div className={`process-flow process-flow--wide${revealedClass}`}>
        <div className="process-flow-row">
          <ProcessCard s={steps[0]} i={0} />
          <ProcessFlowArrow direction="right" delay={0} />
          <ProcessCard s={steps[1]} i={1} />
          <ProcessFlowArrow direction="right" delay={1} />
          <ProcessCard s={steps[2]} i={2} />
        </div>
        <div className="process-flow-row">
          <ProcessCard s={steps[3]} i={3} />
          <ProcessFlowArrow direction="right" delay={3} />
          <ProcessCard s={steps[4]} i={4} />
          <ProcessFlowArrow direction="right" delay={4} />
          <ProcessCard s={steps[5]} i={5} />
        </div>
      </div>

      <div className={`process-flow process-flow--narrow${revealedClass}`}>
        {steps.map((s, i) => (
          <div key={s.step} className="process-flow-narrow-step">
            <ProcessCard s={s} i={i} />
            {i < steps.length - 1 && <ProcessFlowArrow direction="down" delay={i} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: T.ink, fontFamily: "'DM Sans', sans-serif" }}>
        {label}{required && <span style={{ color: "#97b64c" }}>*</span>}
      </label>
      {children}
      {error && <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#dc2626" }}>⚠ {error}</p>}
    </div>
  );
}

const inputBase = "w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 focus:outline-none transition-all duration-200 bg-white";
const inputIdle = "border-[#d0e0b0] focus:border-[#97b64c] focus:ring-2 focus:ring-[#e8f0dc]";
const inputErr  = "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100";

const FRANCHISE_FORM_ID = "inquiry";

/** Scoped to this page route — overflow + stable gutter when process scroll-lock runs */
const franchisePageStyles = `
  html {
    overflow-x: hidden;
    scrollbar-gutter: stable;
  }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes stepPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(151,182,76,0); }
  }
  @keyframes lineGrow {
    from { height: 0; }
    to   { height: 100%; }
  }
  @keyframes descReveal {
    from { opacity: 0; transform: translateY(8px); max-height: 0; }
    to   { opacity: 1; transform: translateY(0); max-height: 120px; }
  }

  .ms-section-heading {
    margin: 0;
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-size: clamp(2rem, 4vw, 3.4rem);
    font-weight: 900;
    line-height: 1.2;
    letter-spacing: -0.04em;
    color: ${T.greenDark};
  }
  .ms-section-heading--light {
    color: ${T.onDark};
  }

  .hero-step-active .step-dot {
    animation: stepPulse 2s ease-in-out infinite;
  }
  .hero-step-line {
    transform-origin: top;
    animation: lineGrow 0.4s ease forwards;
  }
`;



// ─── PACKAGE CARDS — PEEK CAROUSEL ──────────────────────────────────────────
 
const packages = [
  {
    id: "cart",
    label: "Cart",
   
    image: "/franchise/packages/2.png",
    features: ["Compact footprint, any location","Low startup cost","Full Milkshop menu","Training & supply included"],
    best: "Perfect for first-timers or tight spaces.",
  },
  {
    id: "kiosk",
    label: "Kiosk",
  
    image: "/franchise/packages/4.png",
    features: ["Higher daily capacity","Exclusive territory radius","Brand signage & fixtures"],
    best: "Ideal for malls, food parks & commercial areas.",
  },
  {
    id: "inline",
    label: "In-Line Store",
    
    image: "/franchise/packages/8.png",
    features: ["Highest revenue potential","Premium exclusivity zone","Priority franchise support"],
    best: "For serious operators ready to scale.",
  },
];
 
const PACKAGE_IMG_FALLBACK = "/hero-bg-3.png";
 
function PackageCards({ formData, setFormData, setFieldErrors }) {
  const selected = formData.preferredPackage;
  const [pkgImgTier, setPkgImgTier] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [stageRef, stageInView] = useInView(0.12);

  const handleSelect = (id) => {
    setFormData((p) => ({ ...p, preferredPackage: id }));
    setFieldErrors((p) => ({ ...p, preferredPackage: "" }));
  };

  const srcFor = (pkg) => {
    const t = pkgImgTier[pkg.id] ?? 0;
    if (t === 0) return pkg.image;
    if (t === 1) return PACKAGE_IMG_FALLBACK;
    return null;
  };

  const bumpImgTier = (pkgId) => {
    setPkgImgTier((prev) => {
      const t = prev[pkgId] ?? 0;
      if (t >= 2) return prev;
      return { ...prev, [pkgId]: t + 1 };
    });
  };

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  return (
    <>
      <style>{`
        .pkg-3d-stage {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(28px, 4.5vw, 56px);
          width: 100%;
          max-width: min(100%, 1520px);
          margin: 0 auto;
          padding: clamp(12px, 1.5vw, 24px) clamp(10px, 1.2vw, 20px) clamp(8px, 2vw, 16px);
          align-items: end;
          touch-action: pan-y;
          box-sizing: border-box;
        }
        .pkg-3d-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          -webkit-tap-highlight-color: transparent;
          background: none;
          border: none;
          padding: 0;
          font: inherit;
        }
        .pkg-3d-item.pos-0 {
          transform: scale(0.94);
          transform-origin: center bottom;
        }
        .pkg-3d-item.pos-1 {
          transform: scale(1.04);
          z-index: 2;
        }
        .pkg-3d-item.pos-2 {
          transform: scale(0.94);
          transform-origin: center bottom;
        }
        .pkg-3d-item.pos-0:hover {
          transform: scale(0.98);
        }
        .pkg-3d-item.pos-1:hover {
          transform: scale(1.06);
        }
        .pkg-3d-item.pos-2:hover {
          transform: scale(0.98);
        }
        .pkg-3d-item.is-selected .pkg-3d-img-wrap {
          box-shadow: 0 20px 40px rgba(98, 132, 11, 0.22);
        }
        .pkg-3d-img-wrap {
          width: 100%;
          position: relative;
          margin-bottom: clamp(12px, 2vw, 18px);
          border-radius: 16px;
          transition: box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pkg-3d-img {
          width: 100%;
          height: auto;
          max-height: clamp(340px, 52vw, 640px);
          object-fit: contain;
          object-position: center bottom;
          display: block;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .pkg-3d-badge {
          position: absolute;
          top: 4%;
          right: 6%;
          z-index: 2;
          background: #62840b;
          color: #fff;
          font-size: 0.52rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 11px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 14px rgba(98, 132, 11, 0.28);
          pointer-events: none;
        }
        .pkg-3d-label {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: ${T.ink};
          margin: 0 0 4px;
          line-height: 1.15;
          transition: color 0.25s ease;
        }
        .pkg-3d-item.is-selected .pkg-3d-label {
          color: ${T.greenDark};
        }
        .pkg-3d-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: ${T.body};
          margin: 0;
          line-height: 1.4;
        }
        .pkg-3d-selected {
          display: inline-block;
          margin-top: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #62840b;
        }
        .pkg-3d-view {
          margin-top: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          color: #97b64c;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          padding: 0;
        }
        .pkg-3d-view:hover { color: #62840b; }

        /* Scroll-in + stagger */
        .pkg-3d-stage:not(.pkg-3d-stage--in) .pkg-3d-item {
          opacity: 0;
        }
        .pkg-3d-stage--in .pkg-3d-item.pos-0 {
          animation: pkgRevealSide 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }
        .pkg-3d-stage--in .pkg-3d-item.pos-1 {
          animation: pkgRevealCenter 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }
        .pkg-3d-stage--in .pkg-3d-item.pos-2 {
          animation: pkgRevealSideR 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
        }
        @keyframes pkgRevealSide {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(0.94);
          }
        }
        @keyframes pkgRevealSideR {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(0.94);
          }
        }
        @keyframes pkgRevealCenter {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1.04);
          }
        }
        .pkg-3d-stage--in .pkg-3d-badge {
          animation: pkgBadgePop 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .pkg-3d-item.pos-0 .pkg-3d-badge { animation-delay: 0.4s; }
        .pkg-3d-item.pos-1 .pkg-3d-badge { animation-delay: 0.5s; }
        .pkg-3d-item.pos-2 .pkg-3d-badge { animation-delay: 0.6s; }
        @keyframes pkgBadgePop {
          from { opacity: 0; transform: scale(0.6) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pkg-3d-stage--in .pkg-3d-label,
        .pkg-3d-stage--in .pkg-3d-meta {
          animation: pkgTextFade 0.6s ease both;
        }
        .pkg-3d-item.pos-0 .pkg-3d-label { animation-delay: 0.45s; }
        .pkg-3d-item.pos-1 .pkg-3d-label { animation-delay: 0.55s; }
        .pkg-3d-item.pos-2 .pkg-3d-label { animation-delay: 0.65s; }
        .pkg-3d-item.pos-0 .pkg-3d-meta { animation-delay: 0.52s; }
        .pkg-3d-item.pos-1 .pkg-3d-meta { animation-delay: 0.62s; }
        .pkg-3d-item.pos-2 .pkg-3d-meta { animation-delay: 0.72s; }
        @keyframes pkgTextFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pkg-3d-item:hover .pkg-3d-img {
          transform: scale(1.05) translateY(-4px);
        }
        .pkg-3d-item.is-selected .pkg-3d-img-wrap::after {
          content: '';
          position: absolute;
          inset: -4%;
          border-radius: 20px;
          border: 2px solid rgba(98, 132, 11, 0.5);
          pointer-events: none;
        }

        @media (max-width: 767px) {
          .pkg-3d-stage {
            grid-template-columns: 1fr;
            gap: 28px;
            max-width: 420px;
          }
          .pkg-3d-item,
          .pkg-3d-item.pos-0,
          .pkg-3d-item.pos-1,
          .pkg-3d-item.pos-2,
          .pkg-3d-item.pos-0:hover,
          .pkg-3d-item.pos-1:hover,
          .pkg-3d-item.pos-2:hover {
            transform: none !important;
          }
          .pkg-3d-img { max-height: 420px; }
          .pkg-3d-stage {
            max-width: 100%;
            gap: 32px;
          }
          .pkg-3d-stage--in .pkg-3d-item.pos-0,
          .pkg-3d-stage--in .pkg-3d-item.pos-1,
          .pkg-3d-stage--in .pkg-3d-item.pos-2 {
            animation: pkgRevealMobile 0.75s cubic-bezier(0.16, 1, 0.3, 1) both !important;
          }
          .pkg-3d-item.pos-1 { animation-delay: 0.12s !important; }
          .pkg-3d-item.pos-2 { animation-delay: 0.24s !important; }
        }
        @keyframes pkgRevealMobile {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to { opacity: 1; transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pkg-3d-item,
          .pkg-3d-item.pos-0,
          .pkg-3d-item.pos-1,
          .pkg-3d-item.pos-2 {
            transform: none !important;
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
          }
          .pkg-3d-stage:not(.pkg-3d-stage--in) .pkg-3d-item {
            opacity: 1;
            pointer-events: auto;
          }
          .pkg-3d-item.is-selected .pkg-3d-img-wrap::after {
            animation: none !important;
          }
        }
      `}</style>

      <div ref={stageRef} className={`pkg-3d-stage${stageInView ? " pkg-3d-stage--in" : ""}`}>
        {packages.map((pkg, i) => {
          const isSelected = selected === pkg.id;
          const imgSrc = srcFor(pkg);

          return (
            <div
              key={pkg.id}
              role="button"
              tabIndex={0}
              className={`pkg-3d-item pos-${i}${isSelected ? " is-selected" : ""}`}
              aria-pressed={isSelected}
              aria-label={`Select ${pkg.label} package`}
              onClick={() => handleSelect(pkg.id)}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  handleSelect(pkg.id);
                }
              }}
            >
              <div className="pkg-3d-img-wrap">
                {pkg.badge && (
                  <span className="pkg-3d-badge">{pkg.badge}</span>
                )}
                {imgSrc ? (
                  <img
                    key={`${pkg.id}-${imgSrc}`}
                    className="pkg-3d-img"
                    src={imgSrc}
                    alt={`Milkshop ${pkg.label} franchise package`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    onError={() => bumpImgTier(pkg.id)}
                  />
                ) : (
                  <div
                    className="pkg-3d-img"
                    style={{
                      minHeight: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#62840b",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Add photo
                  </div>
                )}
              </div>

              <h3 className="pkg-3d-label">{pkg.label}</h3>
              <p className="pkg-3d-meta">{pkg.tagline}</p>
              {isSelected && <span className="pkg-3d-selected">Selected</span>}
              {imgSrc && (
                <button
                  type="button"
                  className="pkg-3d-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(pkg);
                  }}
                >
                  View larger
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${lightbox.label} package image`}
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.82)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "min(90vw, 900px)",
              maxHeight: "85vh",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            }}
          >
            <img
              src={srcFor(lightbox) ?? PACKAGE_IMG_FALLBACK}
              alt={`Milkshop ${lightbox.label} package`}
              style={{ display: "block", width: "100%", height: "auto", maxHeight: "85vh", objectFit: "contain" }}
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              style={{
                position: "absolute", top: 14, right: 14,
                background: "rgba(0,0,0,0.5)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999, width: 34, height: 34,
                fontSize: "1rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Close"
            >✕</button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}


// ─── MAIN ────────────────────────────────────────────────────────────────────


export default function Franchise() {
  const [openFaq, setOpenFaq]           = useState(null);
  const [formData, setFormData]         = useState({ name: "", email: "", contactNumber: "", bestContactTime: "", estimatedAnnualIncome: "", proposedLocation: "", preferredPackage: "", remarks: "", referral: "" });
  const [fieldErrors, setFieldErrors]   = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [heroInlineAnimReady, setHeroInlineAnimReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  useEffect(() => {
    if (window.location.hash !== `#${FRANCHISE_FORM_ID}`) return;
    const el = document.getElementById(FRANCHISE_FORM_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setIsMobile(window.innerWidth < 768);
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const startAnim = () => setHeroInlineAnimReady(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAnim();
      return undefined;
    }
    window.addEventListener("milkshop:route-loader-hidden", startAnim, { once: true });
    const fallback = window.setTimeout(startAnim, 2200);
    return () => {
      window.removeEventListener("milkshop:route-loader-hidden", startAnim);
      window.clearTimeout(fallback);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "bestContactTime" && value) {
      const min = localDatetimeLocalFloor();
      if (value < min) next = min;
    }
    setFormData((p) => ({ ...p, [name]: next }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())                      e.name                  = "Full name is required.";
    if (!formData.email.trim())                     e.email                 = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email                 = "Enter a valid email address.";
    if (!formData.contactNumber.trim())             e.contactNumber         = "Contact number is required.";
    if (!formData.bestContactTime)                  e.bestContactTime       = "Please pick a date and time.";
    if (!formData.estimatedAnnualIncome.trim())     e.estimatedAnnualIncome = "Please provide your estimated income.";
    if (!formData.proposedLocation.trim())          e.proposedLocation      = "Proposed location is required.";
    if (!formData.preferredPackage)                 e.preferredPackage      = "Please select a package.";
    if (!formData.remarks.trim())                   e.remarks               = "Please tell us a bit about yourself.";
    return e;
  };

  const FORM_FIELDS = [
    "name",
    "email",
    "contactNumber",
    "bestContactTime",
    "estimatedAnnualIncome",
    "proposedLocation",
    "preferredPackage",
    "remarks",
  ]
   
  const filledCount = FORM_FIELDS.filter(
    (key) => String(formData[key] ?? "").trim() !== ""
  ).length
   
  const progressPct = Math.round((filledCount / FORM_FIELDS.length) * 100)

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrorMessage("");
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(Object.keys(errors)[0])?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsSubmitting(true);
    try {
      await createFranchiseRequest(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", contactNumber: "", bestContactTime: "", estimatedAnnualIncome: "", proposedLocation: "", preferredPackage: "", remarks: "", referral: "" });
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{franchisePageStyles}</style>
      <main
        style={{
          backgroundColor: "#fafaf8",
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          overflowX: "hidden",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >

  {/* ══════════════════════════════════════
      SLIDE 1 — HERO (PREMIUM UPGRADE)
══════════════════════════════════════ */}
{/* ══════════════════════════════════════
   PREMIUM FRANCHISE HERO — UPGRADED
   Direction: Natural Editorial
   Left: cream/paper light with brand texture
   Right: store image, full bleed
   Divider: soft organic SVG curve
══════════════════════════════════════ */}
<section
  className="relative overflow-hidden"
  style={{
    background: T.offWhite,
    minHeight: isMobile ? "110svh" : "clamp(920px, 110svh, 1180px)",
    display: "flex",
    alignItems: "center",
    position: "relative",
    fontFamily: "'DM Sans', sans-serif",
  }}
>
  {/* ── BACKGROUND LAYER ── */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}
  >
    {/* === LEFT PANEL — paper cream base === */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: T.heroGradient,
        zIndex: 0,
      }}
    />

    {/* === Fine dot grid — left half only, very subtle === */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(98,132,11,0.13) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.9) 36%, transparent 52%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 18%, rgba(0,0,0,0.9) 36%, transparent 52%)",
        zIndex: 2,
      }}
    />

    {/* === Thin brand rule — left accent line === */}
    <div
      style={{
        position: "absolute",
        left: isMobile ? 28 : 48,
        top: "18%",
        width: 1,
        height: isMobile ? "0%" : "64%",
        background: "linear-gradient(180deg, transparent 0%, rgba(98,132,11,0.18) 20%, rgba(98,132,11,0.22) 70%, transparent 100%)",
        zIndex: 3,
      }}
    />

    {/* === Small brand circle accent — bottom left, very restrained === */}
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "auto" : -80,
        top: isMobile ? "auto" : "auto",
        left: -80,
        width: 320,
        height: 320,
        borderRadius: "50%",
        border: "1.5px solid rgba(98,132,11,0.1)",
        zIndex: 2,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "auto" : -120,
        left: -120,
        width: 480,
        height: 480,
        borderRadius: "50%",
        border: "1px solid rgba(151,182,76,0.07)",
        zIndex: 2,
      }}
    />

    {/* === STORE IMAGE — right side, entrance from right === */}
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: isMobile ? "auto" : 0,
        right: 0,
        bottom: isMobile ? 0 : "auto",
        width: isMobile ? "100%" : "68%",
        height: isMobile ? "52%" : "100%",
        zIndex: 3,
      }}
    >
      <div
        className={`hero-inline-enter${heroInlineAnimReady ? " hero-inline-enter--active" : ""}${isMobile ? " hero-inline-enter--mobile" : ""}`}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
      <img
        src={packages.find((p) => p.id === "inline")?.image ?? "/franchise/packages/8.png"}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: isMobile ? "center bottom" : "center center",
          display: "block",
        }}
        onError={(e) => { e.currentTarget.src = PACKAGE_IMG_FALLBACK; }}
      />

      {/* Soft dim over image for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(247,250,239,0.08)",
          zIndex: 1,
        }}
      />
      </div>
    </div>

    {/* === ORGANIC CURVE DIVIDER — sits between text and store image === */}
    {!isMobile && (
      <svg
        viewBox="0 0 900 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "58%",
          height: "100%",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        {/* Main filled cream shape covering left content zone */}
        <path
          d="M0,0 L800,0 C800,0 740,80 720,200 C698,340 750,420 728,560 C706,700 760,820 740,900 L0,900 Z"
          fill="#f4f9e8"
        />
        {/* Subtle second layer for depth */}
        <path
          d="M0,0 L780,0 C780,0 728,90 710,210 C690,355 740,435 720,572 C700,710 748,828 728,900 L0,900 Z"
          fill="#eef6dc"
          opacity="0.7"
        />
        {/* Brand green stroke edge — the organic curve line itself */}
        <path
          d="M800,0 C800,0 740,80 720,200 C698,340 750,420 728,560 C706,700 760,820 740,900"
          fill="none"
          stroke="rgba(98,132,11,0.14)"
          strokeWidth="1.5"
        />
        {/* Lighter inner stroke for dimension */}
        <path
          d="M780,0 C780,0 728,90 710,210 C690,355 740,435 720,572 C700,710 748,828 728,900"
          fill="none"
          stroke="rgba(151,182,76,0.09)"
          strokeWidth="1"
        />
      </svg>
    )}

    {/* === MOBILE: top fade instead of curve === */}
    {isMobile && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "58%",
          background: "linear-gradient(180deg, #f4f9e8 0%, #eef6dc 55%, transparent 100%)",
          zIndex: 4,
        }}
      />
    )}
  </div>

  {/* ── WATERMARK LOGO ── */}
  <img
    src="/milkshop-logo-removebg-preview.png"
    alt=""
    aria-hidden="true"
    style={{
      position: "absolute",
      bottom: "6%",
      left: isMobile ? "50%" : "22%",
      transform: "translateX(-50%)",
      opacity: 0.04,
      width: 300,
      pointerEvents: "none",
      zIndex: 5,
      userSelect: "none",
    }}
  />

  <style>{`
    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroBadgePulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.55; }
    }
    @keyframes heroInlineEnter {
      from { opacity: 0; transform: translateX(56px) scale(0.8); }
      to   { opacity: 1; transform: translateX(0) scale(0.8); }
    }

    .hero-reveal { animation: heroFadeUp .9s cubic-bezier(.16,1,.3,1) forwards; }
    .hero-inline-enter {
      opacity: 0;
      transform: translateX(56px) scale(0.8);
      transform-origin: right center;
    }
    .hero-inline-enter--active {
      animation: heroInlineEnter 1.15s cubic-bezier(.16,1,.3,1) both;
    }
    .hero-inline-enter--mobile { transform-origin: center bottom; }
    .hero-reveal-delayed { animation: heroFadeUp .9s .2s cubic-bezier(.16,1,.3,1) both; }
    .hero-badge-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #62840b;
      animation: heroBadgePulse 2s ease-in-out infinite; flex-shrink: 0;
    }

    .hero-btn-main, .hero-btn-secondary {
      display: inline-flex; align-items: center; justify-content: center;
      text-decoration: none; box-sizing: border-box;
    }
    .hero-btn-main {
      height: 54px; padding: 0 32px; border-radius: 999px;
      background: #62840b; color: #fff; font-weight: 800; font-size: .92rem;
      box-shadow: 0 8px 24px rgba(98,132,11,0.22);
      transition: transform .22s ease, background .22s ease;
    }
    .hero-btn-main:hover { transform: translateY(-3px); background: #536f09; }
    .hero-btn-secondary {
      height: 54px; padding: 0 28px; border-radius: 999px;
      background: rgba(255,255,255,0.55); border: 1.5px solid rgba(98,132,11,0.28);
      color: #62840b; font-weight: 700; font-size: .9rem;
      transition: transform .22s ease, background .22s ease;
    }
    .hero-btn-secondary:hover { transform: translateY(-3px); background: #fff; }

    @media (prefers-reduced-motion: reduce) {
      .hero-reveal, .hero-reveal-delayed, .hero-badge-dot, .hero-inline-enter {
        animation: none !important;
        opacity: 1;
        transform: scale(0.8);
      }
      .hero-inline-enter--active { transform: scale(0.8); }
    }
  `}</style>

  {/* ── CONTENT ── */}
  <div
    style={{
      width: "100%",
      maxWidth: 1380,
      margin: "0 auto",
      padding: isMobile ? "130px 28px calc(58vh + 32px)" : "130px 48px 120px",
      position: "relative",
      zIndex: 10,
    }}
  >
    <div
      className="hero-reveal"
      style={{
        maxWidth: 520,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        position: "relative",
        zIndex: 11,
      }}
    >
      {/* Headline */}
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(3.6rem,6.5vw,6.8rem)",
          lineHeight: .88,
          letterSpacing: "-.06em",
          fontWeight: 900,
          color: T.ink,
        }}
      >
        Own the
        <br />
        Future of
        <br />
        <span style={{ color: T.greenDark }}>Milk Tea.</span>
      </h1>

      {/* Divider accent */}
      <div
        style={{
          width: 52,
          height: 3,
          background: T.greenDark,
          borderRadius: 2,
        }}
      />

      {/* Desc */}
      <p
        style={{
          margin: 0,
          maxWidth: 420,
          fontSize: "1rem",
          lineHeight: 1.85,
          color: T.body,
          fontWeight: 500,
        }}
      >
        Launch a premium milk tea franchise with proven operations,
        strong branding, and modern customer experience built for the
        Filipino market.
      </p>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={`#${FRANCHISE_FORM_ID}`} className="hero-btn-main">Apply for Franchise →</a>
        <a href="#packages" className="hero-btn-secondary">Explore Packages</a>
      </div>
    </div>
  </div>
</section>

{/* ══════════════════════════════════════
   FRANCHISING PROCESS — TOP HEADER + 2×3 GRID
══════════════════════════════════════ */}
<section
  id="process"
  className="process-section"
  style={{
    background: T.white,
    padding: "clamp(64px, 7vw, 96px) 0 clamp(72px, 8vw, 104px)",
    borderTop: `1px solid ${T.border}`,
    borderBottom: `1px solid ${T.border}`,
  }}
>
  <style>{`
    .process-wrap {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: clamp(44px, 5.5vw, 64px);
      width: 100%;
      max-width: min(1520px, 100%);
      margin: 0 auto;
      padding: 0 clamp(12px, 1.25vw, 24px);
      box-sizing: border-box;
    }

    .process-top-header {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      padding: 0 clamp(8px, 2vw, 24px);
    }

    .process-top-header .process-eyebrow {
      color: ${T.green};
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(0.65rem, 0.9vw, 0.72rem);
      font-weight: 700;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      margin: 0 0 clamp(14px, 2vw, 20px);
    }

    .process-flow-root {
      width: 100%;
      min-width: 0;
    }

    .process-flow--narrow {
      display: none;
    }

    .process-flow--wide {
      display: flex;
      flex-direction: column;
      gap: clamp(40px, 6vw, 72px);
      width: 100%;
    }

    .process-flow-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) clamp(48px, 6vw, 88px) minmax(0, 1fr) clamp(48px, 6vw, 88px) minmax(0, 1fr);
      align-items: center;
      column-gap: clamp(12px, 2vw, 28px);
      width: 100%;
    }

    .process-flow-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      padding: clamp(10px, 1.5vw, 20px);
      min-width: clamp(48px, 6vw, 88px);
      opacity: 0;
      transform: scale(0.85);
      transition:
        opacity 0.55s ease var(--arrow-delay, 0ms),
        transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) var(--arrow-delay, 0ms);
    }

    .process-flow-root.is-revealed .process-flow-arrow {
      opacity: 1;
      transform: scale(1);
    }

    .process-flow-root.is-revealed .process-flow-arrow svg {
      animation: processArrowPulse 1.35s ease-in-out infinite;
      animation-delay: var(--arrow-delay, 0ms);
    }

    .process-flow-arrow--right svg {
      transform-origin: center center;
    }

    .process-flow-arrow--down svg {
      transform-origin: center top;
    }

    @keyframes processArrowPulse {
      0%, 100% {
        opacity: 0.55;
        transform: translate(0, 0);
      }
      50% {
        opacity: 1;
        transform: translate(5px, 0);
      }
    }

    .process-flow-root.is-revealed .process-flow-arrow--down svg {
      animation-name: processArrowPulseDown;
    }

    @keyframes processArrowPulseDown {
      0%, 100% {
        opacity: 0.55;
        transform: translateY(0);
      }
      50% {
        opacity: 1;
        transform: translateY(6px);
      }
    }

    .process-flow-root .process-card {
      opacity: 0;
      transform: translate3d(0, 56px, 0);
      transition:
        opacity 0.7s ease,
        transform 0.95s cubic-bezier(0.16, 1, 0.3, 1);
      transition-delay: calc(var(--step-i, 0) * 220ms);
    }

    .process-flow-root.is-revealed .process-card {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    @media (prefers-reduced-motion: reduce) {
      .process-flow-root .process-card,
      .process-flow-arrow {
        opacity: 1;
        transform: none;
        transition: none;
      }
      .process-flow-root.is-revealed .process-flow-arrow svg {
        animation: none;
      }
    }

    .process-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 0;
      width: 100%;
    }

    .process-card-media {
      position: relative;
      width: 88%;
      max-width: 380px;
      margin-left: auto;
      margin-right: auto;
      aspect-ratio: 10 / 9;
      margin-bottom: clamp(16px, 2vw, 24px);
      overflow: visible;
      background: transparent;
      border: none;
      box-shadow: none;
    }

    .process-card-media img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      display: block;
    }

    .process-card-fallback {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-size: 2.6rem;
    }

    .process-card-copy {
      width: 100%;
      max-width: 36ch;
      margin: 0 auto;
      text-align: center;
    }

    .process-card-desc {
      color: ${T.body};
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(0.84rem, 1.05vw, 0.95rem);
      font-weight: 500;
      line-height: 1.72;
      margin: 0 auto;
      text-align: center;
    }

    @media (max-width: 960px) {
      .process-wrap {
        padding: 0 clamp(16px, 4vw, 24px);
      }
      .process-flow--wide {
        gap: clamp(32px, 5vw, 56px);
      }
      .process-flow-row {
        grid-template-columns: minmax(0, 1fr) clamp(36px, 5vw, 56px) minmax(0, 1fr) clamp(36px, 5vw, 56px) minmax(0, 1fr);
        column-gap: clamp(10px, 1.8vw, 20px);
      }
      .process-flow-arrow {
        min-width: clamp(36px, 5vw, 56px);
        padding: clamp(8px, 1.2vw, 14px);
      }
    }

    @media (max-width: 520px) {
      .process-flow--wide {
        display: none;
      }
      .process-flow--narrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: clamp(4px, 1.2vw, 10px);
        width: 100%;
      }
      .process-flow-narrow-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: clamp(12px, 2.5vw, 20px);
      }
      .process-flow--narrow {
        gap: clamp(16px, 3vw, 28px);
      }
      .process-flow--narrow .process-flow-arrow {
        min-height: clamp(36px, 6vw, 52px);
      }
    }
  `}</style>

  <div className="process-wrap relative z-10">
    <Slide direction="up">
      <header className="process-top-header">
        
        <h2 className="ms-section-heading">Franchise Process</h2>
      </header>
    </Slide>

    <ProcessStepsGrid />
  </div>
</section>


{/* ══════════════════════════════════════
   PACKAGE SELECTION — PEEK CAROUSEL v1
   Direction: Editorial peek carousel
   Center card dominant, side cards peek
   Brand cream bg, image-forward, clean
══════════════════════════════════════ */}
<section
  id="packages"
  className="relative py-10 sm:py-12 lg:py-16 overflow-x-clip"
  style={{
    background: T.offWhite,
    overflowY: "visible",
    borderTop: `1px solid ${T.border}`,
    borderBottom: `1px solid ${T.border}`,
  }}
>
 
  <div className="relative z-10">
 
    {/* Header */}
    <div className="text-center mb-2 px-4">
    
      <Slide direction="up" delay={60}>
        <h2 className="ms-section-heading" style={{ margin: "0 0 10px" }}>
          Find the Right Fit for You
        </h2>
      </Slide>
      <Slide direction="up" delay={100}>
      
      </Slide>
    </div>
 
    {/* Packages grid — full section width */}
    <div className="mt-10 mb-2 w-full max-w-[min(100%,1520px)] mx-auto px-[clamp(10px,1.2vw,20px)]">
      <PackageCards formData={formData} setFormData={setFormData} setFieldErrors={setFieldErrors} />
    </div>
 
    {/* Bottom nudge */}
    <Slide direction="up" delay={300} className="text-center mt-6 px-4">
      <p style={{
        fontSize: "0.78rem", color: T.body,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Not sure? Select <strong style={{ color: T.greenDark }}>Not sure yet</strong> in the form below and we'll help you decide.
      </p>
    </Slide>
  </div>
</section>
 



{/* ══════════════════════════════════════
       SLIDE 4 — FRANCHISE INQUIRY
   ══════════════════════════════════════ */}
<section id="inquiry" className="relative py-12 sm:py-14 lg:py-16 overflow-hidden" style={{ background: T.white }}>

<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 z-10">

  {/* ── THANK YOU SCREEN (shown after submit, hidden on reload) ── */}
  {submitted ? (
    <div
      className="flex flex-col items-center text-center py-6 lg:py-10"
      style={{
        animation: "tyFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes tyFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tyPop {
          0%   { transform: scale(0.7); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tyRing {
          0%,100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.35); }
          50%      { box-shadow: 0 0 0 18px rgba(151,182,76,0); }
        }
        @keyframes tySlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* LOGO — replace the src below with your actual logo file path */}
      <img
        src="/milkshop-logo-removebg-preview.png"
        alt="Milkshop Logo"
        style={{
          width: 80,
          height: 80,
          objectFit: "contain",
          marginBottom: 24,
          borderRadius: 16,
          animation: "tyPop 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both",
        }}
      />

      {/* CHECK CIRCLE */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#62840b,#97b64c)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          animation: "tyPop 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s both, tyRing 1.8s ease 0.8s infinite",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M7 16.5l6 6 12-12" stroke="#fff" strokeWidth="2.8"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 30, strokeDashoffset: 30,
              animation: "none", transition: "stroke-dashoffset 0.5s ease 0.7s",
            }}
          />
        </svg>
      </div>

      {/* HEADLINE */}
      <h2
        className="ms-section-heading"
        style={{
          marginBottom: 8,
          animation: "tySlideUp 0.5s ease 0.35s both",
        }}
      >
        Thank You! 🎉
      </h2>

      {/* SUBTEXT */}
      <p
        style={{
          color: T.body,
          fontSize: "0.95rem",
          maxWidth: 380,
          lineHeight: 1.65,
          marginBottom: 32,
          animation: "tySlideUp 0.5s ease 0.45s both",
        }}
      >
        We've received your franchise application. Our team will reach out to you
        within <strong style={{ color: T.greenDark }}>1–2 business days</strong> to
        discuss the next steps.
      </p>

      {/* DIVIDER */}
      <div
        style={{
          width: 48, height: 3, borderRadius: 99,
          background: "linear-gradient(90deg,#62840b,#97b64c)",
          marginBottom: 32,
          animation: "tySlideUp 0.5s ease 0.5s both",
        }}
      />

      {/* TRUST BADGES */}
      <div
        style={{
          display: "flex",
          gap: 20,
          fontSize: "0.78rem",
          color: "#62840b",
          fontWeight: 600,
          animation: "tySlideUp 0.5s ease 0.55s both",
        }}
      >
        <span>🔒 Secure</span>
        <span>⚡ Fast Review</span>
        <span>📞 We'll Call You</span>
      </div>

    </div>

  ) : (
    <>
      {/* HEADER */}
      <div className="text-center mb-12">
       

        <h2 className="ms-section-heading">
          Franchise Application
        </h2>

      
      </div>

      <div className="w-full">

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-[11px] mb-2"
            style={{ color: T.greenDark }}>
            <span>
              {filledCount === 0
                ? "Start filling the form"
                : filledCount === FORM_FIELDS.length
                ? "✓ All fields complete"
                : `${filledCount} of ${FORM_FIELDS.length} fields filled`}
            </span>
            <span style={{ fontWeight: 700 }}>{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#e8f0dc]" style={{ overflow: "hidden" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                background: progressPct === 100
                  ? "linear-gradient(90deg, #62840b, #97b64c)"
                  : "#97b64c",
                transition: "width 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        </div>

        {/* FORM GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            <Field label="Full Name" required error={fieldErrors.name}>
              <input name="name" value={formData.name} onChange={handleChange}
                
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Email Address" required error={fieldErrors.email}>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@email.com"
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Contact Number" required error={fieldErrors.contactNumber}>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                placeholder="09XX XXX XXXX"
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Preferred Contact Time" required error={fieldErrors.bestContactTime}>
              <input type="datetime-local" name="bestContactTime"
                value={formData.bestContactTime}
                min={localDatetimeLocalFloor()}
                onChange={handleChange}
                className={`${inputBase} ${inputIdle}`} />
            </Field>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">

            <Field label="Estimated Income" required error={fieldErrors.estimatedAnnualIncome}>
              <input name="estimatedAnnualIncome"
                value={formData.estimatedAnnualIncome}
                onChange={handleChange}
                
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Proposed Location" required error={fieldErrors.proposedLocation}>
              <input name="proposedLocation"
                value={formData.proposedLocation}
                onChange={handleChange}
                
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Preferred Package" required error={fieldErrors.preferredPackage}>
              <select name="preferredPackage"
                value={formData.preferredPackage}
                onChange={handleChange}
                className={`${inputBase} ${inputIdle}`}>
                <option value="">Select package</option>
                <option value="cart">Cart</option>
                <option value="kiosk">Kiosk</option>
                <option value="inline">In-line</option>
                <option value="unsure">Not sure</option>
              </select>
            </Field>

            <Field label="Additional Info" required error={fieldErrors.remarks}>
              <textarea name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Tell us your plan..."
                className={`${inputBase} ${inputIdle}`} />
            </Field>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* TRUST */}
          <div className="flex gap-3 text-xs"
            style={{ color: T.greenDark }}>
           
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full lg:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all active:scale-95"
            style={{
              background: isSubmitting ? "#b7cd7f" : "#62840b",
              color: "#fff",
              boxShadow: "0 10px 30px rgba(98,132,11,0.3)"
            }}
          >
            {isSubmitting ? "Submitting..." : "Continue →"}
          </button>

        </div>

      </div>
    </>
  )}

</div>
</section>

      {/* ══════════════════════════════════════
          SLIDE 5 — FAQ
      ══════════════════════════════════════ */}
      <section className="relative py-14 sm:py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: T.dark }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
        }} />

        <style>{`
          .faq-split {
            display: grid;
            grid-template-columns: minmax(240px, 0.9fr) 1.1fr;
            gap: clamp(28px, 5vw, 64px);
            align-items: start;
          }
          @media (max-width: 900px) {
            .faq-split { grid-template-columns: 1fr; }
            .faq-split-header { position: static !important; }
          }
        `}</style>

        <div
          className="faq-split relative z-10 mx-auto"
          style={{
            maxWidth: 1160,
            padding: "0 clamp(20px,4vw,56px)",
          }}
        >
          {/* Left — header */}
          <Slide direction="left">
            <div className="faq-split-header" style={{ position: "sticky", top: 24 }}>
              <p
                className="text-[11px] font-bold tracking-[0.28em] uppercase"
                style={{ color: T.green, fontFamily: "'DM Sans', sans-serif", margin: "0 0 14px" }}
              >
                Common Questions
              </p>
              <h2
                className="ms-section-heading ms-section-heading--light"
                style={{ margin: "0 0 14px" }}
              >
                FAQs
              </h2>
            </div>
          </Slide>

          {/* Right — questions */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Slide key={i} direction="right" delay={i * 40}>
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ border: openFaq === i ? "1.5px solid #97b64c" : "1px solid rgba(255,255,255,0.12)", boxShadow: openFaq === i ? "0 4px 20px rgba(151,182,76,0.12)" : "none" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 transition-colors duration-200"
                    style={{ backgroundColor: openFaq === i ? T.greenFade : "rgba(255,255,255,0.96)" }}
                  >
                    <span className="font-semibold text-sm" style={{ color: T.ink }}>{faq.q}</span>
                    <span className="text-xl font-bold shrink-0 transition-transform duration-300" style={{ color: T.green, transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 py-4" style={{ background: T.white, borderTop: `1px solid ${T.border}` }}>
                      <p className="text-sm leading-relaxed" style={{ color: T.body }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%);  }
        }
      `}</style>
    </main>
    </>
  );
}