import { useState, useEffect, useRef, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import FranchiseInquiryForm from "../components/FranchiseInquiryForm"
import FranchiseInquiryTrigger from "../components/FranchiseInquiryTrigger"
import {
  FRANCHISE_INQUIRY_ID,
  isFranchiseInquiryHash,
  scheduleScrollToFranchiseInquiry,
} from "../utils/franchiseInquiry"


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
  {
    q: "Do I need food industry experience?",
    a: "No experience is required. Milkshop provides a comprehensive training program covering daily operations, drink preparation, inventory management, and customer service.",
  },
  {
    q: "What is the expected ROI period?",
    a: "Franchisees typically recover their investment within 12–18 months, depending on location, foot traffic, and operational performance.",
  },
  {
    q: "What training and support will I receive?",
    a: "Milkshop provides complete franchise training, including a 5-day Barista and Management Training program for both owners and key staff.",
  },
  {
    q: "Is my territory exclusive?",
    a: "Yes. Once your location is officially approved, Milkshop will not open another franchise within your agreed exclusivity radius to help protect your investment.",
  },
  {
    q: "How long is the current promotion available?",
    a: "The special MAFBEX 2026 promotional offers—including NO FRANCHISE FEE and free concert tickets—are limited to the first 10 signed franchise agreements, encouraging immediate inquiry.",
  },
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

/** Scoped to this page route — overflow + stable gutter when process scroll-lock runs */
const franchisePageStyles = `
  html {
    overflow-x: hidden;
    scrollbar-gutter: stable;
  }

  .franchise-page-main {
    display: flex;
    flex-direction: column;
  }

  .franchise-inquiry-section {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    padding: 48px 0;
  }
  @media (min-width: 768px) {
    .franchise-inquiry-section { padding: 56px 0; }
  }
  @media (min-width: 1024px) {
    .franchise-inquiry-section { padding: 64px 0; }
  }

  .franchise-inquiry-inner {
    position: relative;
    z-index: 10;
    max-width: 72rem;
    margin: 0 auto;
    padding: 0 16px;
    box-sizing: border-box;
    width: 100%;
  }
  @media (min-width: 768px) {
    .franchise-inquiry-inner { padding: 0 24px; }
  }
  @media (min-width: 1024px) {
    .franchise-inquiry-inner { padding: 0 64px; }
  }

  .franchise-form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (min-width: 1024px) {
    .franchise-form-grid {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  }

  .franchise-form-header {
    text-align: center;
    margin-bottom: 32px;
  }
  @media (min-width: 768px) {
    .franchise-form-header { margin-bottom: 48px; }
  }

  .franchise-form-cta-row {
    margin-top: 32px;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    gap: 20px;
    border-top: 1px solid rgba(151,182,76,0.15);
  }
  @media (min-width: 1024px) {
    .franchise-form-cta-row {
      margin-top: 40px;
      padding-top: 32px;
      flex-direction: row;
      align-items: center;
      gap: 24px;
    }
  }

  .franchise-form-trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #62840b;
  }
  @media (min-width: 1024px) {
    .franchise-form-trust { justify-content: flex-start; }
  }

  .franchise-submit-btn {
    width: 100%;
    min-height: 48px;
    padding: 14px 32px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }
  @media (min-width: 1024px) {
    .franchise-submit-btn {
      width: auto;
      flex-shrink: 0;
      padding: 16px 40px;
    }
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



// ─── STORE TYPES — CAROUSEL (Products Top 5 style) ───────────────────────────

const PACKAGE_IMAGES = {
  sqm2: "/franchise/packages/2.png",
  sqm4: "/franchise/packages/4.png",
  sqm8: "/franchise/packages/8.png",
};

const storeTypes = [
  {
    id: "inline",
    label: "In-line Store",
    storeName: "Milky Deluxe Haven",
    size: "30 SQM",
    description: "A cozy and premium dine-in experience for milktea lovers.",
    tag: "Premium",
    tagColor: "bg-[#62840b] text-white",
    image: PACKAGE_IMAGES.sqm8,
  },
  {
    id: "kiosk-delights",
    label: "To-Go Kiosk",
    storeName: "Dairy Delights",
    size: "6 SQM",
    description: "Perfect for malls, events, and busy on-the-go customers.",
    tag: "Compact",
    tagColor: "bg-[#97b64c] text-white",
    image: PACKAGE_IMAGES.sqm2,
  },
  {
    id: "kiosk-deal",
    label: "To-Go Kiosk",
    storeName: "Dairy Deal",
    size: "4 SQM",
    description: "Ideal for malls, food courts, and outdoor locations.",
    tag: "Starter",
    tagColor: "bg-rose-400 text-white",
    image: PACKAGE_IMAGES.sqm4,
  },
];

const STORE_IMG_FALLBACK = "/hero-bg-3.png";

function StoreTypesCarousel({ onPackageSelect }) {
  const [active, setActive] = useState(0);
  const [imgFallback, setImgFallback] = useState({});
  const total = storeTypes.length;
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3500);
  }, [total, stopAuto]);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto]);

  const goTo = (index) => {
    setActive(index);
    onPackageSelect?.(storeTypes[index].id);
    startAuto();
  };

  const goPrev = () => goTo((active - 1 + total) % total);
  const goNext = () => goTo((active + 1) % total);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    if (Math.abs(delta) >= 48) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const getPos = (index) => {
    const diff = (index - active + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right1";
    if (diff === 2) return "right2";
    if (diff === total - 2) return "left2";
    if (diff === total - 1) return "left1";
    return "hidden";
  };

  const posStyles = {
    center: "z-40 scale-100 opacity-100 translate-x-0",
    right1: "z-30 scale-[0.55] opacity-40 translate-x-[78%]",
    left1: "z-30 scale-[0.55] opacity-40 -translate-x-[78%]",
    right2: "z-20 scale-[0.45] opacity-0 translate-x-[130%]",
    left2: "z-20 scale-[0.45] opacity-0 -translate-x-[130%]",
    hidden: "z-10 scale-[0.45] opacity-0 translate-x-0 pointer-events-none",
  };

  const current = storeTypes[active];

  const srcFor = (store) => {
    if (imgFallback[store.id]) return STORE_IMG_FALLBACK;
    return store.image;
  };

  const selectIndex = (i) => {
    goTo(i);
  };

  return (
    <div
      className="w-full"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <div
        className="relative h-[min(380px,72vw)] sm:h-[min(460px,64vw)] md:h-[min(520px,58vh)] lg:h-[min(560px,54vh)] flex items-center justify-center overflow-visible px-2 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {storeTypes.map((store, i) => {
          const pos = getPos(i);
          const isCenter = pos === "center";
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => selectIndex(i)}
              className={`absolute transition-all duration-500 ease-in-out flex flex-col items-center cursor-pointer bg-transparent border-0 p-0 ${posStyles[pos]}`}
              aria-label={`${store.label}, ${store.storeName}`}
              aria-pressed={i === active}
            >
              <img
                src={srcFor(store)}
                alt={store.label}
                className={`object-contain select-none ${
                  isCenter
                    ? "w-[min(540px,94vw)] h-[min(460px,70vw)] sm:h-[min(500px,58vw)] md:h-[min(520px,52vh)]"
                    : "w-[min(300px,62vw)] h-[min(240px,48vw)]"
                }`}
                style={{
                  filter: isCenter
                    ? "drop-shadow(0 24px 48px rgba(24, 33, 15, 0.14))"
                    : "drop-shadow(0 12px 24px rgba(24, 33, 15, 0.08))",
                }}
                draggable={false}
                loading="lazy"
                decoding="async"
                onError={() =>
                  setImgFallback((prev) => ({ ...prev, [store.id]: true }))
                }
              />
            </button>
          );
        })}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center justify-center absolute left-1 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-0 text-lg sm:text-xl font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                zIndex: 60,
                border: "2px solid #b7cd7f",
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "#62840b",
                boxShadow: "0 8px 24px rgba(98,132,11,0.18)",
              }}
              aria-label="Previous package"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex items-center justify-center absolute right-1 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-0 text-lg sm:text-xl font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                zIndex: 60,
                border: "2px solid #b7cd7f",
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "#62840b",
                boxShadow: "0 8px 24px rgba(98,132,11,0.18)",
              }}
              aria-label="Next package"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center text-center gap-2 px-4 min-h-[200px] transition-all duration-300">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full ${current.tagColor}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.tag}
        </span>
        <h3
          className="text-xl sm:text-2xl font-bold text-[#1e1e1e] m-0"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
        >
          {current.label}
        </h3>
        <p
          className="text-[#62840b] text-base sm:text-lg m-0 italic font-medium"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.storeName}
        </p>
        <p
          className="text-[#1e1e1e] text-lg sm:text-xl font-extrabold m-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.size}
        </p>
        <div
          className="w-full max-w-md my-1"
          style={{
            borderTop: "2px dotted rgba(98, 132, 11, 0.35)",
          }}
          aria-hidden
        />
        <p
          className="text-[#5a5a5a] text-sm sm:text-base max-w-md leading-relaxed m-0"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.description}
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {storeTypes.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => selectIndex(i)}
            className={`rounded-full transition-all duration-300 border-0 cursor-pointer ${
              i === active
                ? "w-6 h-2 bg-[#97b64c]"
                : "w-2 h-2 bg-[#d0e0b0] hover:bg-[#b7cd7f]"
            }`}
            aria-label={`Show ${storeTypes[i].label}`}
          />
        ))}
      </div>
    </div>
  );
}


// ─── MAIN ────────────────────────────────────────────────────────────────────


export default function Franchise() {
  const location = useLocation();
  const inquiryFromLink = isFranchiseInquiryHash(location.hash);

  const [openFaq, setOpenFaq]           = useState(null);
  const [preferredPackage, setPreferredPackage] = useState("");
  const [heroInlineAnimReady, setHeroInlineAnimReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (!inquiryFromLink) return;
    scheduleScrollToFranchiseInquiry();
  }, [inquiryFromLink]);

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

  return (
    <>
      <style>{franchisePageStyles}</style>
      <main
        className="franchise-page-main"
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
    REPLACE THIS ENTIRE BLOCK:
    From: <section className="relative overflow-hidden" ...> (the hero)
    To:   </section>  (line 1242, just before the FRANCHISING PROCESS comment)
    WITH THE SECTION BELOW
══════════════════════════════════════ */}

<section
  style={{
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100svh",
    display: "flex",
    alignItems: "flex-end",
  }}
>
  <style>{`
    @keyframes fhFadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fhImgScale {
      from { transform: scale(1.06); }
      to   { transform: scale(1); }
    }
    @keyframes fhBadgePulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.5); }
      50%      { box-shadow: 0 0 0 8px rgba(151,182,76,0); }
    }

    /* ── Mobile: full-screen image bg, text at bottom ── */
    .fh-bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 55%;
      animation: fhImgScale 1.6s cubic-bezier(0.16,1,0.3,1) forwards;
    }

    /* Dark gradient — strong top-to-bottom, heavier overall for legibility */
    .fh-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(10,18,4,0.52) 0%,
        rgba(10,18,4,0.44) 35%,
        rgba(10,18,4,0.72) 65%,
        rgba(10,18,4,0.92) 100%
      );
      z-index: 1;
    }

    /* Solid dark base behind text — ensures contrast regardless of image */
    .fh-overlay::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(8,14,3,0.28);
    }

    /* Green tint layer — brand colour warmth */
    .fh-tint {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 30% 80%, rgba(98,132,11,0.22) 0%, transparent 60%);
      z-index: 2;
    }

    /* Content sits above overlays */
    .fh-content {
      position: relative;
      z-index: 10;
      width: 100%;
      padding: 100px 24px 52px;
      box-sizing: border-box;
    }

    /* ── Desktop: split layout restored ── */
    @media (min-width: 768px) {
      .fh-section {
        align-items: center !important;
        min-height: clamp(920px, 110svh, 1180px) !important;
      }

      .fh-bg-img {
        /* On desktop image stays right side via object-position */
        object-position: center center;
      }

      /* Desktop overlay: dark left for text, lighter right to show store */
      .fh-overlay {
        background: linear-gradient(
          105deg,
          rgba(8,14,3,0.88) 0%,
          rgba(8,14,3,0.72) 35%,
          rgba(8,14,3,0.28) 60%,
          rgba(8,14,3,0.12) 100%
        );
      }
      .fh-overlay::after { display: none; }

      .fh-tint {
        background: radial-gradient(ellipse at 25% 60%, rgba(98,132,11,0.2) 0%, transparent 55%);
      }

      .fh-content {
        padding: 0 clamp(48px, 6vw, 96px);
        max-width: 1380px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        min-height: inherit;
      }

      /* Desktop: organic cream shape over left content zone */
      .fh-desktop-curve {
        display: block !important;
      }
    }

    /* Animations */
    .fh-anim-1 { opacity: 0; animation: fhFadeUp 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fh-anim-2 { opacity: 0; animation: fhFadeUp 0.7s 0.28s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fh-anim-3 { opacity: 0; animation: fhFadeUp 0.7s 0.42s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fh-anim-4 { opacity: 0; animation: fhFadeUp 0.7s 0.56s cubic-bezier(0.16,1,0.3,1) forwards; }

    .fh-badge-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #97b64c; flex-shrink: 0;
      animation: fhBadgePulse 2.2s ease-in-out infinite;
    }

    .fh-btn-main {
      display: inline-flex; align-items: center; justify-content: center;
      height: 52px; padding: 0 28px; border-radius: 999px;
      background: #62840b; color: #fff;
      font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: 0.92rem;
      border: none; cursor: pointer; text-decoration: none;
      box-shadow: 0 8px 28px rgba(98,132,11,0.38);
      transition: transform 0.2s ease, background 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .fh-btn-main:hover { transform: translateY(-2px); background: #4e6a09; }
    .fh-btn-main:active { transform: translateY(0); }

    .fh-btn-secondary {
      display: inline-flex; align-items: center; justify-content: center;
      height: 52px; padding: 0 24px; border-radius: 999px;
      background: rgba(255,255,255,0.12);
      border: 1.5px solid rgba(255,255,255,0.45);
      color: #fff;
      font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem;
      text-decoration: none; cursor: pointer;
      backdrop-filter: blur(8px);
      transition: transform 0.2s ease, background 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .fh-btn-secondary:hover { transform: translateY(-2px); background: rgba(255,255,255,0.2); }

    /* Mobile: stat bar at bottom */
    .fh-stat-bar {
      display: flex;
      gap: 0;
      margin-top: 36px;
      border-top: 1px solid rgba(255,255,255,0.14);
      padding-top: 24px;
    }
    .fh-stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 0 12px;
      border-right: 1px solid rgba(255,255,255,0.12);
    }
    .fh-stat-item:first-child { padding-left: 0; }
    .fh-stat-item:last-child { border-right: none; }
    .fh-stat-num {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1.4rem, 5vw, 1.8rem);
      font-weight: 900;
      color: #b7cd7f;
      letter-spacing: -0.04em;
      line-height: 1;
    }
    .fh-stat-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.68rem;
      font-weight: 600;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.04em;
      line-height: 1.3;
    }

    @media (prefers-reduced-motion: reduce) {
      .fh-anim-1, .fh-anim-2, .fh-anim-3, .fh-anim-4 {
        opacity: 1 !important; animation: none !important;
      }
      .fh-bg-img { animation: none !important; }
      .fh-badge-dot { animation: none !important; }
    }
  `}</style>

  {/* ── Full-bleed background image ── */}
  <img
    className="fh-bg-img"
    src="/franchise/packages/8.png"
    alt=""
    aria-hidden="true"
    onError={(e) => { e.currentTarget.src = STORE_IMG_FALLBACK; }}
  />

  {/* ── Overlays ── */}
  <div className="fh-overlay" />
  <div className="fh-tint" />

  {/* ── Watermark logo ── */}
  <img
    src="/milkshop-logo-removebg-preview.png"
    alt=""
    aria-hidden="true"
    style={{
      position: "absolute",
      bottom: "8%",
      right: "5%",
      opacity: 0.06,
      width: 220,
      pointerEvents: "none",
      zIndex: 3,
      userSelect: "none",
    }}
  />

  {/* ── Content ── */}
  <div className="fh-content">
    <div style={{ maxWidth: 540, display: "flex", flexDirection: "column", gap: 20 }}>

   

      {/* Headline */}
      <h1 className="fh-anim-2" style={{
        margin: 0,
        fontSize: "clamp(3.2rem, 10vw, 6.8rem)",
        lineHeight: 0.88,
        letterSpacing: "-0.05em",
        fontWeight: 900,
        color: "#F6F1E7",
        textShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        Own the<br />
        Future of<br />
        <span style={{
          background: "linear-gradient(135deg, #A6C44A 0%, #C8D97B 50%, #97b64c 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }}>
          Milk Tea.
        </span>
      </h1>

      {/* Accent rule */}
      <div className="fh-anim-2" style={{ width: 48, height: 3, background: "#97b64c", borderRadius: 2 }} />

      {/* Description */}
      <p className="fh-anim-3" style={{
        margin: 0,
        maxWidth: 400,
        fontSize: "clamp(0.9rem, 2.4vw, 1rem)",
        lineHeight: 1.8,
        color: "rgba(246,241,231,0.75)",
        fontWeight: 400,
      }}>
        Launch a premium milk tea franchise with proven operations,
        strong branding, and modern customer experience built for the Filipino market.
      </p>

      {/* CTAs */}
      <div className="fh-anim-4" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <FranchiseInquiryTrigger className="fh-btn-main">
          Apply for Franchise →
        </FranchiseInquiryTrigger>
        <a href="#packages" className="fh-btn-secondary">Explore Packages</a>
      </div>

      {/* Stat bar */}
      <div className="fh-anim-4 fh-stat-bar">
        <div className="fh-stat-item">
          <span className="fh-stat-num">11+</span>
          <span className="fh-stat-label">Active Branches</span>
        </div>
        <div className="fh-stat-item">
          <span className="fh-stat-num">12–18<span style={{ fontSize: "0.55em", fontWeight: 700 }}>mo</span></span>
          <span className="fh-stat-label">Avg. ROI Period</span>
        </div>
        <div className="fh-stat-item">
          <span className="fh-stat-num">🇹🇼</span>
          <span className="fh-stat-label">Authentic Taiwan Brand</span>
        </div>
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
          Store Types
        </h2>
      </Slide>
      <Slide direction="up" delay={100}>
      
      </Slide>
    </div>
 
    {/* Packages grid — full section width */}
    <div className="mt-10 mb-2 w-full max-w-[min(100%,1520px)] mx-auto px-[clamp(10px,1.2vw,20px)]">
      <StoreTypesCarousel onPackageSelect={setPreferredPackage} />
    </div>
 
    {/* Bottom nudge */}
    <Slide direction="up" delay={300} className="text-center mt-6 px-4">
      <p style={{
        fontSize: "0.78rem", color: T.body,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Not sure? Select <strong style={{ color: T.greenDark }}>Not sure</strong> in the application form and we&apos;ll help you decide.
      </p>
    </Slide>
  </div>
</section>
 



{/* ══════════════════════════════════════
       SLIDE 4 — FRANCHISE INQUIRY
   ══════════════════════════════════════ */}
<section id={FRANCHISE_INQUIRY_ID} className="franchise-inquiry-section">
  <div className="franchise-inquiry-inner">
    <Slide direction="up" className="franchise-form-header">
      <p
        className="text-[11px] tracking-[0.3em] font-bold uppercase mb-3"
        style={{ color: T.green, fontFamily: "'DM Sans', sans-serif" }}
      >
        Start Your Journey
      </p>
      <h2 className="ms-section-heading" style={{ margin: 0 }}>
        Franchise Application
      </h2>
    </Slide>

    <Slide direction="up" delay={80}>
      <div
        style={{
          marginTop: 8,
          background: "rgba(255,255,255,0.96)",
          border: `1px solid ${T.border}`,
          borderRadius: 24,
          padding: "clamp(24px, 4vw, 40px)",
          boxShadow: "0 16px 48px rgba(98, 132, 11, 0.08)",
        }}
      >
        <FranchiseInquiryForm
          key={preferredPackage || "default"}
          idPrefix="franchise-"
          preferredPackage={preferredPackage}
          hideHeader
        />
      </div>
    </Slide>
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