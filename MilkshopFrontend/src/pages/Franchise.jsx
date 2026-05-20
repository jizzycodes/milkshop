import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { createFranchiseRequest } from "../services/api"
import { localDatetimeLocalFloor } from "../utils/dateInputConstraints"


// ─── DATA (unchanged) ────────────────────────────────────────────────────────

/** Drop files here: `public/franchise/process/step-01.jpg` … `step-06.jpg` (or change paths below). */
const steps = [
  { step: "01", icon: "📋", title: "APPLICATION",    desc: "Contact us or fill out our franchise application form and provide us with some basic information about your background and what you envision for your store.",    image: "/franchise/process/step-01.jpg" },
  { step: "02", icon: "🤝", title: "INTERVIEW & QUALIFICATIONS", desc: "Contact us or fill out our franchise application form and provide us with some basic information about your background and what you envision for your store.", image: "/franchise/process/step-02.jpg" },
  { step: "03", icon: "📍", title: "LOCATION ASSESSMENT & SUPPORT",   desc: "We will work with you to find the perfect location and negotiate a lease for your new store.", image: "/franchise/process/step-03.jpg" },
  { step: "04", icon: "✍️", title: "CONTRACT SIGNING",    desc: "Together we will sign our commitment to bring the Fresh Taste of Taiwan here in the Philippines.", image: "/franchise/process/step-04.jpg" },
  { step: "05", icon: "🏗️", title: "SETUP & TRAINING",  desc: "We will help you set up your store and provide you with the training you need to run a successful Milkshop Franchise.", image: "/franchise/process/step-05.jpg" },
  { step: "06", icon: "🎉", title: "GRAND OPENING",     desc: "Finally, following the successful completion of your training, your store will open and you will become a Milkshop Franchisee!", image: "/franchise/process/step-06.jpg" },
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

// ─── FORM HELPERS ─────────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>
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

/** ~100 ≈ one mouse-wheel detent; sum 3 detents → advance one process step. */
const PROCESS_WHEEL_NOTCHES_PER_STEP = 3;
const PROCESS_DELTA_PER_WHEEL_NOTCH = 100;
const PROCESS_WHEEL_STEP_THRESHOLD =
  PROCESS_WHEEL_NOTCHES_PER_STEP * PROCESS_DELTA_PER_WHEEL_NOTCH;

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

  .hero-step-active .step-dot {
    animation: stepPulse 2s ease-in-out infinite;
  }
  .hero-step-line {
    transform-origin: top;
    animation: lineGrow 0.4s ease forwards;
  }
`;



// ─── PACKAGE CARDS COMPONENT ────────────────────────────────────────────────
// Drop-in replacement. Requires: useState, useEffect from "react", createPortal from "react-dom"
// Requires: Slide component from parent scope (already defined in Franchise.jsx)

const packages = [
  {
    id: "cart",
    emoji: "",
    label: "Cart",
    tagline: "Start Small, Dream Big",
    price: "Entry-level investment",
    term: "2-year term",
    badge: "Best Starter",
    color: "#62840b",
    accentBg: "rgba(151,182,76,0.07)",
    borderSelected: "#97b64c",
    image: "/franchise/packages/2.png",
    features: [
      "Compact footprint, any location",
      "Low startup cost",
      "Full Milkshop menu",
      "Training & supply included",
    ],
    best: "Perfect for first-timers or tight spaces.",
  },
  {
    id: "kiosk",
    emoji: "",
    label: "Kiosk",
    tagline: "The Sweet Spot",
    price: "Mid-range investment",
    term: "3-year term",
    badge: "Most Popular",
    color: "#4a6b08",
    accentBg: "rgba(151,182,76,0.11)",
    borderSelected: "#97b64c",
    image: "/franchise/packages/4.png",
    features: [
      "Higher daily capacity",
      "Exclusive territory radius",
      "Brand signage & fixtures",
    ],
    best: "Ideal for malls, food parks & commercial areas.",
  },
  {
    id: "inline",
    emoji: "🏬",
    label: "In-Line Store",
    tagline: "Go Full-Scale",
    price: "Premium investment",
    term: "5-year term",
    badge: "Best ROI",
    color: "#3a5c06",
    accentBg: "rgba(183,205,127,0.1)",
    borderSelected: "#97b64c",
    image: "/franchise/packages/8.png",
    features: [
      "Highest revenue potential",
      "Premium exclusivity zone",
      "Priority franchise support",
    ],
    best: "For serious operators ready to scale.",
  },
];

const PACKAGE_IMG_FALLBACK = "/hero-bg-3.png";

function PackageCards({ formData, setFormData, setFieldErrors }) {
  const selected = formData.preferredPackage;
  const [pkgImgTier, setPkgImgTier] = useState({});
  const [lightbox, setLightbox] = useState(null);

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
        .pkg-card-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .pkg-card {
          display: flex;
          flex-direction: column;
          flex: 1;
          border-radius: 26px;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
          position: relative;
          background: #ffffff;
        }
        .pkg-card.is-selected {
          border: 2.5px solid #97b64c !important;
          box-shadow: 0 28px 72px rgba(98,132,11,0.22);
        }
        .pkg-card:not(.is-selected) {
          border: 1.5px solid rgba(151,182,76,0.18);
          box-shadow: 0 6px 24px rgba(98,132,11,0.07);
        }

        .pkg-img-inner {
          transform: none !important;
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(1rem, 2.5vw, 1.75rem)",
          width: "100%",
          alignItems: "stretch",
        }}
        className="max-md:grid-cols-1"
      >
        {packages.map((pkg, i) => {
          const isSelected = selected === pkg.id;
          const imgSrc = srcFor(pkg);

          return (
            <Slide key={pkg.id} direction="up" delay={i * 80} className="flex flex-col h-full">
              <div className="pkg-card-wrap">
                <article
                  className={`pkg-card${isSelected ? " is-selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select ${pkg.label} package`}
                  onClick={() => handleSelect(pkg.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      handleSelect(pkg.id);
                    }
                  }}
                  style={{
                    minHeight: "clamp(24rem, 54vw, 34rem)",
                  }}
                >

                  <div style={{
                    height: 4, flexShrink: 0,
                    background: "rgba(151,182,76,0.12)",
                  }} />

                  {/* ── IMAGE BLOCK ── */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    flexShrink: 0,
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    background: "#eef3e4",
                  }}>
                    {/* Badge */}
                    {pkg.badge && (
                      <div style={{
                        position: "absolute", top: 12, right: 12, zIndex: 10,
                        background: isSelected
                          ? "rgba(255,255,255,0.92)"
                          : "#62840b",
                        color: isSelected ? "#62840b" : "#fff",
                        fontSize: "0.55rem", fontWeight: 900,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        padding: "5px 11px", borderRadius: 999,
                        fontFamily: "'DM Sans', sans-serif",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                      }}>
                        {pkg.badge}
                      </div>
                    )}

                    {/* Image */}
                    {imgSrc ? (
                      <img
                        key={`${pkg.id}-${imgSrc}`}
                        src={imgSrc}
                        alt={`Milkshop ${pkg.label} package`}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="pkg-img-inner"
                        style={{
                          position: "absolute", inset: 0,
                          width: "100%", height: "100%",
                          objectFit: "cover", objectPosition: "center",
                          display: "block",
                        }}
                        onError={() => bumpImgTier(pkg.id)}
                      />
                    ) : (
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12, fontWeight: 700, color: "#62840b",
                      }}>
                        <span style={{ fontSize: 28, marginBottom: 8 }}>{pkg.emoji}</span>
                        Add photo
                        <span style={{ fontSize: 10, color: "#7b9461", marginTop: 4 }}>
                          packages/{pkg.id}.jpg
                        </span>
                      </div>
                    )}

                    {/* View button */}
                    {imgSrc && (
                      <button
                        type="button"
                        className="pkg-view-btn"
                        onClick={(e) => { e.stopPropagation(); setLightbox(pkg); }}
                        style={{
                          position: "absolute", bottom: 12, right: 12, zIndex: 20,
                          background: "rgba(0,0,0,0.42)",
                          backdropFilter: "blur(6px)",
                          WebkitBackdropFilter: "blur(6px)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.22)",
                          borderRadius: 999,
                          padding: "5px 13px",
                          fontSize: "0.65rem", fontWeight: 700,
                          fontFamily: "'DM Sans', sans-serif",
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                          opacity: 0.85,
                        }}
                      >
                        ⤢ View
                      </button>
                    )}

                    {/* Bottom gradient fade */}
                    <div aria-hidden style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                      background: "linear-gradient(to top, rgba(255,255,255,1) 0%, transparent 100%)",
                      pointerEvents: "none",
                    }} />
                  </div>

                  {/* ── CONTENT BLOCK ── */}
                  <div style={{
                    flex: 1, display: "flex", flexDirection: "column", minHeight: 0,
                    padding: "clamp(1rem, 2.5vw, 1.3rem) clamp(1.1rem, 2.8vw, 1.45rem) clamp(1.1rem, 2.8vw, 1.45rem)",
                  }}>

                    {/* Type pill + term row */}
                    <div style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", marginBottom: 10,
                    }}>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.55rem", fontWeight: 900,
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: isSelected ? "#fff" : "#1a2e0a",
                        background: isSelected
                          ? "rgba(98,132,11,0.85)"
                          : "rgba(183,205,127,0.5)",
                        border: `1px solid ${isSelected ? "rgba(98,132,11,0.6)" : "rgba(151,182,76,0.4)"}`,
                        borderRadius: 999, padding: "4px 10px",
                      }}>
                        {pkg.label.toUpperCase()}
                      </span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "9px", fontWeight: 700,
                        letterSpacing: "0.06em", padding: "3px 8px",
                        borderRadius: 999,
                        background: "rgba(151,182,76,0.12)",
                        color: "#4a6b08",
                        border: "1px solid rgba(151,182,76,0.25)",
                      }}>
                        {pkg.term}
                      </span>
                    </div>

                    {/* Title + tagline */}
                    <div style={{ marginBottom: 11 }}>
                      <h3 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "clamp(1.15rem, 2.5vw, 1.4rem)",
                        fontWeight: 900,
                        color: isSelected ? "#62840b" : "#1f2a17",
                        margin: "0 0 3px",
                        letterSpacing: "-0.035em", lineHeight: 1.1,
                      }}>
                        {pkg.emoji} {pkg.label}
                      </h3>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.76rem", fontWeight: 600,
                        color: isSelected ? "#7a9460" : "#5a6a4a",
                        margin: 0,
                      }}>
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: 1,
                      background: isSelected
                        ? "linear-gradient(90deg, rgba(151,182,76,0.5), transparent)"
                        : "rgba(151,182,76,0.13)",
                      marginBottom: 11,
                    }} />

                    {/* Features */}
                    <ul style={{
                      listStyle: "none", margin: "0 0 10px", padding: 0,
                      display: "flex", flexDirection: "column", gap: 7,
                    }}>
                      {pkg.features.map((f, fi) => (
                        <li key={fi} style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.76rem", fontWeight: 600,
                          lineHeight: 1.35, color: isSelected ? "#2e3d1e" : "#3a4a2a",
                          paddingLeft: 16, position: "relative",
                        }}>
                          <span style={{
                            position: "absolute", left: 0, top: "0.35em",
                            width: isSelected ? 7 : 5,
                            height: isSelected ? 7 : 5,
                            borderRadius: "50%",
                            background: isSelected
                              ? "linear-gradient(135deg, #62840b, #97b64c)"
                              : "#97b64c",
                            boxShadow: isSelected ? "0 1px 6px rgba(151,182,76,0.45)" : "none",
                          }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Best for */}
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.68rem", lineHeight: 1.5,
                      color: isSelected ? "#62840b" : "#8aa06a",
                      margin: "0 0 14px",
                      fontStyle: "italic",
                      fontWeight: isSelected ? 600 : 400,
                    }}>
                      {pkg.best}
                    </p>

                    {/* CTA Button */}
                    <button
                      type="button"
                      style={{
                        width: "100%", marginTop: "auto",
                        padding: isSelected ? "13px 0" : "11px 0",
                        borderRadius: 999,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.82rem", fontWeight: 800,
                        letterSpacing: "0.04em", cursor: "pointer",
                        background: isSelected
                          ? "linear-gradient(135deg, #62840b, #97b64c)"
                          : "rgba(151,182,76,0.1)",
                        color: isSelected ? "#fff" : "#62840b",
                        boxShadow: isSelected
                          ? "0 8px 28px rgba(98,132,11,0.38)"
                          : "none",
                        border: isSelected
                          ? "1px solid rgba(98,132,11,0.4)"
                          : "1.5px solid rgba(151,182,76,0.28)",
                      }}
                    >
                      {isSelected ? "✓ Package Selected" : "Select Package"}
                    </button>
                  </div>
                </article>
              </div>
            </Slide>
          );
        })}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged package photo"
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0,
              zIndex: 2147483646,
              background: "rgba(0,0,0,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "min(4vw, 24px)",
              isolation: "isolate",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            {/* Label strip */}
            <div style={{
              position: "fixed", top: "max(20px, env(safe-area-inset-top))", left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2147483647,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 999, padding: "7px 18px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.72rem", fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
            }}>
              {lightbox.emoji} {lightbox.label}
            </div>

            {/* Close button */}
            <button
              type="button"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              style={{
                position: "fixed",
                top: "max(16px, env(safe-area-inset-top))",
                right: "max(16px, env(safe-area-inset-right))",
                zIndex: 2147483647,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff", borderRadius: "50%",
                width: 44, height: 44,
                fontSize: "1.1rem", lineHeight: 1, cursor: "pointer",
                fontWeight: 700, display: "flex",
                alignItems: "center", justifyContent: "center",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            >
              ✕
            </button>

            <img
              src={srcFor(lightbox)}
              alt=""
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "min(96vw, 1600px)",
                maxHeight: "min(88vh, 1200px)",
                width: "auto", height: "auto",
                objectFit: "contain",
                borderRadius: 14,
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
              }}
            />
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
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);
  activeStepRef.current = activeStep;
  const [heroProcessImgFailed, setHeroProcessImgFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const processSectionRef = useRef(null);
  const heroProcessPanelRef = useRef(null);
  const processLockRef = useRef(false);
  const processWheelDeltaRef = useRef(0);
  const processTouchYRef = useRef(null);
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
    setHeroProcessImgFailed(false);
  }, [activeStep]);

  useEffect(() => {
    const THRESHOLD = PROCESS_WHEEL_STEP_THRESHOLD;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevHtmlPaddingRight = htmlEl.style.paddingRight;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevHtmlOverscroll = htmlEl.style.overscrollBehavior;
    const prevBodyOverscroll = bodyEl.style.overscrollBehavior;

    const setPageScrollLocked = (locked) => {
      if (locked) {
        const gap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
        htmlEl.style.overflow = "hidden";
        if (gap > 0) {
          htmlEl.style.paddingRight = `${gap}px`;
        }
        bodyEl.style.overflow = "hidden";
        htmlEl.style.overscrollBehavior = "none";
        bodyEl.style.overscrollBehavior = "none";
        return;
      }
      htmlEl.style.overflow = prevHtmlOverflow;
      htmlEl.style.paddingRight = prevHtmlPaddingRight;
      bodyEl.style.overflow = prevBodyOverflow;
      htmlEl.style.overscrollBehavior = prevHtmlOverscroll;
      bodyEl.style.overscrollBehavior = prevBodyOverscroll;
    };

    const setLocked = (locked) => {
      processLockRef.current = locked;
      setPageScrollLocked(locked);
    };

    /** Always read current DOM nodes — the image panel remounts on `key={activeStep}` so stale refs break engagement after step 1. */
    const isHeroEngaged = () => {
      const heroSection = processSectionRef.current;
      const panel = heroProcessPanelRef.current;
      if (!heroSection || !panel) return false;
      const heroRect = heroSection.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const heroVisiblePx =
        Math.min(heroRect.bottom, viewportH) - Math.max(heroRect.top, 0);
      const heroVisibleRatio = Math.max(
        0,
        heroVisiblePx / Math.min(Math.max(heroRect.height, 1), viewportH)
      );

      const panelVisiblePx =
        Math.min(panelRect.bottom, viewportH) - Math.max(panelRect.top, 0);

      return heroVisibleRatio >= 0.55 && panelVisiblePx >= 120;
    };

    const shouldCaptureFromEvent = (eventTarget) => {
      if (!isHeroEngaged()) return false;
      const heroSection = processSectionRef.current;
      if (!heroSection) return false;
      if (!(eventTarget instanceof Node)) return processLockRef.current;
      return heroSection.contains(eventTarget) || processLockRef.current;
    };

    let syncRaf = 0;
    const syncLockState = () => {
      if (syncRaf) return;
      syncRaf = requestAnimationFrame(() => {
        syncRaf = 0;
        if (!isHeroEngaged()) {
          setLocked(false);
          processWheelDeltaRef.current = 0;
          processTouchYRef.current = null;
        }
      });
    };

    const onWheel = (e) => {
      if (!shouldCaptureFromEvent(e.target)) return;

      const useX = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = useX ? e.deltaX : e.deltaY;
      const step = activeStepRef.current;

      const isTryingToLeaveForward = step === steps.length - 1 && delta > 0;
      const isTryingToLeaveBackward = step === 0 && delta < 0;
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        setLocked(false);
        processWheelDeltaRef.current = 0;
        return;
      }

      if (!processLockRef.current) {
        setLocked(true);
      }

      e.preventDefault();
      processWheelDeltaRef.current += delta;

      if (Math.abs(processWheelDeltaRef.current) < THRESHOLD) return;

      const direction = processWheelDeltaRef.current > 0 ? 1 : -1;
      processWheelDeltaRef.current = 0;

      setActiveStep((prev) => {
        const next = prev + direction;
        if (next < 0) {
          setLocked(false);
          return 0;
        }
        if (next >= steps.length) {
          setLocked(false);
          return steps.length - 1;
        }
        return next;
      });
    };

    const onTouchStart = (e) => {
      processTouchYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e) => {
      if (!shouldCaptureFromEvent(e.target)) return;

      const currentY = e.touches[0]?.clientY;
      const startY = processTouchYRef.current;
      if (typeof currentY !== "number" || typeof startY !== "number") return;

      const deltaY = startY - currentY;
      processTouchYRef.current = currentY;

      const step = activeStepRef.current;
      const isTryingToLeaveForward = step === steps.length - 1 && deltaY > 0;
      const isTryingToLeaveBackward = step === 0 && deltaY < 0;
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        setLocked(false);
        processWheelDeltaRef.current = 0;
        return;
      }

      if (!processLockRef.current) {
        setLocked(true);
      }

      e.preventDefault();
      processWheelDeltaRef.current += deltaY;

      if (Math.abs(processWheelDeltaRef.current) < THRESHOLD) return;

      const direction = processWheelDeltaRef.current > 0 ? 1 : -1;
      processWheelDeltaRef.current = 0;
      setActiveStep((prev) => {
        const next = prev + direction;
        if (next < 0) {
          setLocked(false);
          return 0;
        }
        if (next >= steps.length) {
          setLocked(false);
          return steps.length - 1;
        }
        return next;
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scroll", syncLockState, { passive: true });
    window.addEventListener("resize", syncLockState);
    syncLockState();
    return () => {
      if (syncRaf) cancelAnimationFrame(syncRaf);
      setLocked(false);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", syncLockState);
      window.removeEventListener("resize", syncLockState);
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
   PREMIUM FRANCHISE HERO — ENHANCED
══════════════════════════════════════ */}
<section
  data-track-section="Franchise Hero"
  className="relative overflow-hidden"
  style={{
    background: "linear-gradient(168deg, #f8fbf2 0%, #eef6e4 48%, #e6f0d8 100%)",
    minHeight: "100svh",
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
    {/* Dot grid */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(98,132,11,0.18) 1.2px, transparent 1.2px)",
        backgroundSize: "26px 26px",
        maskImage: "linear-gradient(90deg, transparent 0%, black 42%, black 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 42%, black 100%)",
      }}
    />

    {/* Top-right outer ring */}
    <div
      style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 480,
        height: 480,
        borderRadius: "50%",
        border: "48px solid rgba(98,132,11,0.07)",
      }}
    />

    {/* Top-right inner ring */}
    <div
      style={{
        position: "absolute",
        top: 40,
        right: 40,
        width: 320,
        height: 320,
        borderRadius: "50%",
        border: "1.5px solid rgba(98,132,11,0.13)",
      }}
    />

    {/* Bottom-left ring */}
    <div
      style={{
        position: "absolute",
        bottom: -100,
        left: -80,
        width: 380,
        height: 380,
        borderRadius: "50%",
        border: "40px solid rgba(98,132,11,0.06)",
      }}
    />

    <div
      className="hero-bg-orb-a"
      style={{
        position: "absolute",
        top: "-8%",
        right: "-6%",
        width: "min(50vw, 480px)",
        height: "min(50vw, 480px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(151,182,76,0.32) 0%, transparent 68%)",
      }}
    />
    <div
      className="hero-bg-orb-b"
      style={{
        position: "absolute",
        bottom: "-14%",
        left: "-10%",
        width: "min(44vw, 400px)",
        height: "min(44vw, 400px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(183,205,127,0.38) 0%, transparent 70%)",
      }}
    />
    <div
      className="hero-bg-ring"
      style={{
        position: "absolute",
        top: "10%",
        right: "6%",
        width: "min(36vw, 320px)",
        height: "min(36vw, 320px)",
        borderRadius: "50%",
        border: "1.5px dashed rgba(98,132,11,0.2)",
      }}
    />

    {/* Diagonal ruled lines — right half */}
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "55%",
        height: "100%",
        backgroundImage:
          "repeating-linear-gradient(-55deg, transparent, transparent 38px, rgba(98,132,11,0.055) 38px, rgba(98,132,11,0.055) 39px)",
      }}
    />
  </div>

  {/* ── WATERMARK LOGO — replace src with your actual logo path ── */}
  <img
    src="/milkshop-logo-removebg-preview.png"
    alt=""
    aria-hidden="true"
    style={{
      position: "absolute",
      bottom: "6%",
      left: "50%",
      transform: "translateX(-50%)",
      opacity: 0.045,
      width: 340,
      pointerEvents: "none",
      zIndex: 1,
      userSelect: "none",
    }}
  />

  <style>{`
    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes heroBadgePulse {
      0%,100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.55; }
    }
    @keyframes heroOrbDrift {
      0%,100% { transform: translate(0, 0); }
      50% { transform: translate(14px, -12px); }
    }
    @keyframes heroOrbDriftB {
      0%,100% { transform: translate(0, 0); }
      50% { transform: translate(-12px, 16px); }
    }
    @keyframes heroRingSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes heroPkgFloatA {
      0%,100% { transform: translateY(0) rotate(-5deg); }
      50% { transform: translateY(-16px) rotate(-3deg); }
    }
    @keyframes heroPkgFloatB {
      0%,100% { transform: translateY(0) rotate(3deg); }
      50% { transform: translateY(-22px) rotate(5deg); }
    }
    @keyframes heroPkgFloatC {
      0%,100% { transform: translateY(0) rotate(6deg); }
      50% { transform: translateY(-14px) rotate(4deg); }
    }

    .hero-reveal { animation: heroFadeUp .85s cubic-bezier(.16,1,.3,1) forwards; }
    .hero-reveal-delayed { animation: heroFadeUp .85s .18s cubic-bezier(.16,1,.3,1) both; }
    .hero-badge-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #62840b;
      animation: heroBadgePulse 2s ease-in-out infinite; flex-shrink: 0;
    }
    .hero-bg-orb-a { animation: heroOrbDrift 16s ease-in-out infinite; }
    .hero-bg-orb-b { animation: heroOrbDriftB 18s ease-in-out infinite; }
    .hero-bg-ring { animation: heroRingSpin 52s linear infinite; }

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

    .hero-pkg-card {
      position: absolute; border-radius: 24px; overflow: hidden;
      background: rgba(255,255,255,0.95); border: 1px solid rgba(255,255,255,0.9);
      box-shadow: 0 24px 56px rgba(98,132,11,0.18), 0 8px 20px rgba(0,0,0,0.07);
      text-decoration: none; transition: box-shadow .25s ease, transform .25s ease;
    }
    .hero-pkg-card:hover {
      box-shadow: 0 32px 72px rgba(98,132,11,0.24), 0 12px 28px rgba(0,0,0,0.1);
      transform: translateY(-4px);
    }
    .hero-pkg-card--featured {
      border: 2px solid rgba(151,182,76,0.45);
      box-shadow: 0 28px 64px rgba(98,132,11,0.22), 0 10px 24px rgba(0,0,0,0.08);
    }
    @media (max-width: 1024px) {
      .hero-pkg-stage { min-height: clamp(560px, 85vw, 720px) !important; }
    }
    .hero-pkg-float-a { animation: heroPkgFloatA 5.8s ease-in-out infinite; }
    .hero-pkg-float-b { animation: heroPkgFloatB 6.4s ease-in-out infinite; }
    .hero-pkg-float-c { animation: heroPkgFloatC 7s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce) {
      .hero-reveal, .hero-reveal-delayed, .hero-badge-dot,
      .hero-bg-orb-a, .hero-bg-orb-b, .hero-bg-ring,
      .hero-pkg-float-a, .hero-pkg-float-b, .hero-pkg-float-c {
        animation: none !important;
      }
    }
  `}</style>

  <div
    style={{
      width: "100%",
      maxWidth: 1380,
      margin: "0 auto",
      padding: "130px 48px 90px",
      position: "relative",
      zIndex: 5,
    }}
  >
    <div
      className="max-lg:grid-cols-1"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1.08fr)",
        alignItems: "center",
        gap: "clamp(24px, 4vw, 48px)",
      }}
    >
      {/* LEFT */}
      <div
        className="hero-reveal"
        style={{
          maxWidth: 580,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Badge */}
        <div
          style={{
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            border: "1.5px solid rgba(98,132,11,0.22)",
            background: "rgba(255,255,255,0.55)",
            color: "#62840b",
            fontSize: ".7rem",
            fontWeight: 800,
            letterSpacing: ".15em",
            textTransform: "uppercase",
          }}
        >
          <span className="hero-badge-dot" />
          Taiwan's Fast Growing Milk Tea Brand
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(3.6rem,6.5vw,6.8rem)",
            lineHeight: .88,
            letterSpacing: "-.06em",
            fontWeight: 900,
            color: "#18210f",
          }}
        >
          Own the
          <br />
          Future of
          <br />
          <span style={{ color: "#62840b" }}>Milk Tea.</span>
        </h1>

        {/* Divider accent */}
        <div
          style={{
            width: 52,
            height: 3,
            background: "#62840b",
            borderRadius: 2,
          }}
        />

        {/* Desc */}
        <p
          style={{
            margin: 0,
            maxWidth: 480,
            fontSize: "1rem",
            lineHeight: 1.85,
            color: "#4a5840",
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

      {/* RIGHT — 3 franchise packages (animated) */}
      <div
        className="hero-reveal-delayed hero-pkg-stage"
        style={{
          position: "relative",
          minHeight: "clamp(520px, 62vw, 780px)",
          width: "100%",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100%, 620px)",
            height: "min(100%, 620px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(151,182,76,0.28) 0%, transparent 65%)",
          }}
        />

        {[
          {
            pkg: packages[0],
            floatClass: "hero-pkg-float-a",
            top: "2%",
            left: "0%",
            width: "clamp(175px, 30vw, 235px)",
            zIndex: 2,
            featured: false,
          },
          {
            pkg: packages[1],
            floatClass: "hero-pkg-float-b",
            top: "6%",
            right: "-2%",
            width: "clamp(260px, 46vw, 330px)",
            zIndex: 4,
            featured: true,
          },
          {
            pkg: packages[2],
            floatClass: "hero-pkg-float-c",
            bottom: "0%",
            left: "8%",
            width: "clamp(200px, 34vw, 265px)",
            zIndex: 3,
            featured: false,
          },
        ].map(({ pkg, floatClass, featured, top, right, bottom, left, width, zIndex }) => (
          <a
            key={pkg.id}
            href="#packages"
            aria-label={`View ${pkg.label} franchise package`}
            className={`hero-pkg-card ${floatClass}${featured ? " hero-pkg-card--featured" : ""}`}
            style={{ top, right, bottom, left, width, zIndex }}
          >
            <img
              src={pkg.image}
              alt={`Milkshop ${pkg.label}`}
              loading="eager"
              decoding="async"
              draggable={false}
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => { e.currentTarget.src = PACKAGE_IMG_FALLBACK }}
            />
            <div style={{
              padding: "14px 16px 16px",
              borderTop: "1px solid rgba(151,182,76,0.14)",
              background: "rgba(255,255,255,0.98)",
            }}>
              {pkg.badge && (
                <span style={{
                  display: "inline-block",
                  marginBottom: 8,
                  fontSize: ".6rem",
                  fontWeight: 900,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#fff",
                  background: "#62840b",
                  padding: "4px 10px",
                  borderRadius: 999,
                }}>
                  {pkg.badge}
                </span>
              )}
              <div style={{
                fontSize: "clamp(.8rem, 1.4vw, .92rem)",
                fontWeight: 800,
                color: "#1a2e0a",
                letterSpacing: "-.02em",
              }}>
                {pkg.emoji} {pkg.label}
              </div>
              <div style={{
                marginTop: 4,
                fontSize: "clamp(.68rem, 1.1vw, .76rem)",
                fontWeight: 600,
                color: "#62840b",
              }}>
                {pkg.term}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
</section>

{/* ══════════════════════════════════════
     FRANCHISING PROCESS SECTION
══════════════════════════════════════ */}
<section
  ref={processSectionRef}
  id="process"
  data-track-section="Franchising Process"
  className="relative overflow-hidden"
  style={{ background:"linear-gradient(160deg,#f3f9ea 0%,#ffffff 50%,#f0f7e6 100%)", padding:"clamp(60px,8vw,100px) 0" }}
>
  <div style={{ maxWidth:1380, margin:"0 auto", padding:"0 clamp(20px,4vw,56px)", width:"100%", boxSizing:"border-box" }}>

    {/* Section header */}
    <Slide direction="up" className="text-center" style={{ marginBottom:48 }}>
      <p style={{ fontSize:"11px", fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#97b64c", fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>How It Works</p>
      <h2 style={{ fontSize:"clamp(2.2rem,5vw,3.5rem)", fontWeight:900, letterSpacing:"-0.04em", color:"#1a1e14", margin:0, fontFamily:"'DM Sans',sans-serif" }}>
        Your Path to Ownership
      </h2>
    </Slide>

    {/* Main content: image left, details right */}
    <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:"clamp(24px,4vw,56px)", alignItems:"center" }} className="max-lg:grid-cols-1">

      {/* LEFT — Image */}
      <div
        ref={heroProcessPanelRef}
        key={activeStep}
        className="fh-step-card"
        style={{ borderRadius:24, overflow:"hidden", position:"relative", height:"clamp(340px,52vh,560px)", border:"1px solid rgba(151,182,76,0.2)", background:"#1a2214", boxShadow:"0 24px 64px rgba(98,132,11,0.14)" }}
      >
        {!heroProcessImgFailed ? (
          <img
            key={steps[activeStep].image}
            src={steps[activeStep].image}
            alt={`Milkshop franchise — ${steps[activeStep].title}`}
            loading={activeStep === 0 ? "eager" : "lazy"}
            decoding="async"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            onError={() => setHeroProcessImgFailed(true)}
          />
        ) : (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#eef3e4", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:600, color:"#62840b" }}>
            Add photo
            <span style={{ fontWeight:500, color:"#7b9461", fontSize:11, marginTop:6 }}>public/franchise/process/step-{steps[activeStep].step}.jpg</span>
          </div>
        )}
        {!heroProcessImgFailed && <div aria-hidden style={{ position:"absolute", inset:0, background:"rgba(26,34,20,0.18)", pointerEvents:"none" }} />}

        {/* Step number badge on image */}
        <div style={{ position:"absolute", top:20, left:20, zIndex:2, background:"rgba(26,34,20,0.75)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:999, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", fontWeight:800, letterSpacing:"0.15em", color:"#c5d9a3" }}>STEP {steps[activeStep].step}</span>
          <span style={{ fontSize:"0.9rem" }}>{steps[activeStep].icon}</span>
        </div>
      </div>

      {/* RIGHT — Step details + nav */}
      <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

        {/* Step counter */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:900, color:"rgba(151,182,76,0.2)", lineHeight:1 }}>
            {String(activeStep + 1).padStart(2,"0")}
          </span>
          <div style={{ width:1, height:48, background:"rgba(151,182,76,0.25)" }} />
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#97b64c", margin:"0 0 2px" }}>Current Step</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"0.75rem", color:"#7b9461", margin:0 }}>of {steps.length} total steps</p>
          </div>
        </div>

        {/* Title + desc */}
        <div>
          <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(1.5rem,3vw,2.1rem)", fontWeight:900, color:"#1a2e0a", margin:"0 0 12px", letterSpacing:"-0.03em", lineHeight:1.1 }}>
            {steps[activeStep].title}
          </h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(0.88rem,1.5vw,1rem)", lineHeight:1.75, color:"#4d5c3a", margin:0 }}>
            {steps[activeStep].desc}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", fontWeight:700, color:"#97b64c" }}>Progress</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#7b9461" }}>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div style={{ height:5, background:"rgba(151,182,76,0.14)", borderRadius:999, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${((activeStep + 1) / steps.length) * 100}%`, background:"linear-gradient(90deg,#62840b,#97b64c)", borderRadius:999, transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {steps.map((s, i) => (
            <button key={s.step} onClick={() => setActiveStep(i)} aria-label={s.title}
              style={{ width: activeStep === i ? 28 : 8, height:8, borderRadius:999, border:"none", cursor:"pointer", background: i < activeStep ? "#97b64c" : activeStep === i ? "#62840b" : "rgba(151,182,76,0.25)", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)", padding:0 }} />
          ))}
        </div>

        {/* Prev / Next buttons */}
        <div style={{ display:"flex", gap:12 }}>
          <button onClick={() => setActiveStep((p) => Math.max(0, p - 1))} disabled={activeStep === 0}
            style={{ flex:1, padding:"12px 0", borderRadius:999, border:"1.5px solid rgba(151,182,76,0.35)", background: activeStep === 0 ? "rgba(151,182,76,0.05)" : "rgba(151,182,76,0.1)", color: activeStep === 0 ? "#bdd49a" : "#62840b", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight:700, cursor: activeStep === 0 ? "not-allowed" : "pointer", transition:"all 0.2s ease" }}>
            ‹ Previous
          </button>
          <button onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))} disabled={activeStep === steps.length - 1}
            style={{ flex:1, padding:"12px 0", borderRadius:999, border:"none", background: activeStep === steps.length - 1 ? "#b7cd7f" : "linear-gradient(135deg,#62840b,#97b64c)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"0.85rem", fontWeight:700, cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer", boxShadow: activeStep === steps.length - 1 ? "none" : "0 8px 24px rgba(98,132,11,0.28)", transition:"all 0.2s ease" }}>
            Next ›
          </button>
        </div>

      </div>
    </div>
  </div>
</section>






{/* ══════════════════════════════════════
     PACKAGE SELECTION SECTION
══════════════════════════════════════ */}
<section
  id="packages"
  data-track-section="Franchise Packages"
  className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
  style={{ background: "linear-gradient(165deg, #aac86e 0%, #97b64c 45%, #8aab4a 100%)" }}
>
  <style>{`
    @keyframes pkgFadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pkgShimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pkgBadgePop {
      0%   { transform: scale(0.7) translateY(-4px); opacity: 0; }
      70%  { transform: scale(1.08) translateY(0); }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes pkgDotPulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.45; transform: scale(0.6); }
    }
    .pkg-badge {
      animation: pkgBadgePop 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .pkg-feature-dot {
      animation: pkgDotPulse 2.4s ease-in-out infinite;
    }
    .pkg-shimmer-text {
      background: linear-gradient(120deg, #ffffff 0%, #f4fce8 35%, #ffffff 55%, #e8f5d4 75%, #ffffff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: pkgShimmer 4s linear infinite;
    }
  `}</style>

  {/* Dot grid background */}
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)",
    backgroundSize: "36px 36px",
    maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
  }} />
  {/* Orb accents */}
  <div aria-hidden style={{
    position: "absolute", top: "-8%", right: "-4%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
    filter: "blur(32px)", pointerEvents: "none",
  }} />
  <div aria-hidden style={{
    position: "absolute", bottom: "-5%", left: "-3%",
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
    filter: "blur(24px)", pointerEvents: "none",
  }} />

  <div className="relative max-w-[min(100%,1600px)] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 z-10">

    {/* Header */}
    <Slide direction="up" className="text-center mb-4">
      <p style={{
        fontSize: "11px", fontWeight: 800, letterSpacing: "0.3em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.82)",
        fontFamily: "'DM Sans', sans-serif",
      }}>Choose Your Package</p>
    </Slide>
    <Slide direction="up" delay={60} className="text-center mb-3">
      <h2 style={{
        fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
        fontWeight: 900, letterSpacing: "-0.04em",
        color: "#ffffff", margin: 0,
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.05,
        textShadow: "0 1px 18px rgba(255,255,255,0.15)",
      }}>
        Find the Right <span className="pkg-shimmer-text">Fit for You</span>
      </h2>
    </Slide>
    <Slide direction="up" delay={100} className="text-center mb-14">
      <p style={{
        fontSize: "0.95rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.75,
        maxWidth: 420, margin: "12px auto 0",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Three flexible formats — pick one and we'll build the rest together.
      </p>
    </Slide>

    {/* Cards */}
    <PackageCards formData={formData} setFormData={setFormData} setFieldErrors={setFieldErrors} />

    {/* Bottom nudge */}
    <Slide direction="up" delay={300} className="text-center mt-10">
      <p style={{
        fontSize: "0.82rem", color: "rgba(255,255,255,0.88)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Not sure? Select <strong style={{ color: "#ffffff" }}>Not sure yet</strong> in the form below and we'll help you decide.
      </p>
    </Slide>

  </div>
</section>



{/* ══════════════════════════════════════
       SLIDE 4 — FRANCHISE INQUIRY
   ══════════════════════════════════════ */}
<section id="inquiry" className="relative py-12 sm:py-14 lg:py-16 bg-[#f7f9f4] overflow-hidden">

{/* Soft background */}
<div className="absolute inset-0 pointer-events-none"
  style={{
    background: "radial-gradient(circle at 10% 20%, rgba(151,182,76,0.08), transparent 60%)"
  }}
/>

<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 z-10">

  {/* ── THANK YOU SCREEN (shown after submit, hidden on reload) ── */}
  {submitted ? (
    <div
      className="rounded-[28px] p-10 lg:p-16 flex flex-col items-center text-center backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1px solid #dce8c8",
        boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
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
        style={{
          fontSize: "clamp(1.8rem,4vw,2.6rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "#1e1e1e",
          marginBottom: 8,
          animation: "tySlideUp 0.5s ease 0.35s both",
        }}
      >
        Thank You! 🎉
      </h2>

      {/* SUBTEXT */}
      <p
        style={{
          color: "#5a6a4a",
          fontSize: "0.95rem",
          maxWidth: 380,
          lineHeight: 1.65,
          marginBottom: 32,
          animation: "tySlideUp 0.5s ease 0.45s both",
        }}
      >
        We've received your franchise application. Our team will reach out to you
        within <strong style={{ color: "#62840b" }}>1–2 business days</strong> to
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
        <p className="text-[11px] tracking-[0.3em] font-bold uppercase mb-3"
          style={{ color: "#97b64c" }}>
          Start Your Journey
        </p>

        <h2 style={{
          fontSize: "clamp(2.5rem,5vw,3.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "#1e1e1e"
        }}>
          Franchise Application
        </h2>

        <p className="text-sm mt-3 max-w-md mx-auto"
          style={{ color: "#5a6a4a" }}>
          Modern, simple, and fast. Takes less than 2 minutes.
        </p>
      </div>

      {/* GLASS CARD */}
      <div className="rounded-[28px] p-6 lg:p-10 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.75)",
          border: "1px solid #dce8c8",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)"
        }}>

        {/* PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between text-[11px] mb-2"
            style={{ color: "#62840b" }}>
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
                placeholder="Juan dela Cruz"
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
                placeholder="₱800k – ₱1.2M"
                className={`${inputBase} ${inputIdle}`} />
            </Field>

            <Field label="Proposed Location" required error={fieldErrors.proposedLocation}>
              <input name="proposedLocation"
                value={formData.proposedLocation}
                onChange={handleChange}
                placeholder="City / Mall"
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
            style={{ color: "#62840b" }}>
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>📞 We call you</span>
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
      <section data-track-section="Franchise FAQs" className="relative py-14 sm:py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(250, 8, 8, 0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
        }} />

        <div className="relative max-w-3xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Common Questions</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-8">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#fafafa" }}>FAQs</h2>
          </Slide>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Slide key={i} direction="up" delay={i * 50}>
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ border: openFaq === i ? "1.5px solid #97b64c" : "1px solid rgba(255,255,255,0.12)", boxShadow: openFaq === i ? "0 4px 20px rgba(151,182,76,0.12)" : "none" }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 transition-colors duration-200"
                    style={{ backgroundColor: openFaq === i ? "#eef4e3" : "white" }}
                  >
                    <span className="font-semibold text-sm" style={{ color: "#1e1e1e" }}>{faq.q}</span>
                    <span className="text-xl font-bold shrink-0 transition-transform duration-300" style={{ color: "#97b64c", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 py-4 bg-white" style={{ borderTop: "1px solid #e0ebd0" }}>
                      <p className="text-sm leading-relaxed" style={{ color: "#5a6a4a" }}>{faq.a}</p>
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