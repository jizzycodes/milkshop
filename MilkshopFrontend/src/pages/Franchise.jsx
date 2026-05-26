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
          gap: clamp(12px, 3vw, 32px);
          width: 100%;
          max-width: min(100%, 1380px);
          margin: 0 auto;
          padding: clamp(16px, 3vw, 40px) clamp(8px, 2vw, 20px) clamp(8px, 2vw, 16px);
          align-items: end;
          touch-action: pan-y;
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
          max-height: clamp(260px, 38vw, 480px);
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
          color: #18210f;
          margin: 0 0 4px;
          line-height: 1.15;
          transition: color 0.25s ease;
        }
        .pkg-3d-item.is-selected .pkg-3d-label {
          color: #62840b;
        }
        .pkg-3d-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #7a9460;
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
          .pkg-3d-img { max-height: 300px; }
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
  data-track-section="Franchise Hero"
  className="relative overflow-hidden"
  style={{
    background: "#f7faef",
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
        background: "linear-gradient(135deg, #f7faef 0%, #eef6dc 55%, #e8f2d0 100%)",
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
          maxWidth: 420,
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
  </div>
</section>

{/* ══════════════════════════════════════
   FRANCHISING PROCESS — GRID + SIDE TITLE
══════════════════════════════════════ */}
<section
  id="process"
  data-track-section="Franchising Process"
  className="process-section"
  style={{
    background: "#ffffff",
    padding: "clamp(72px,8vw,104px) 0",
    borderTop: "1px solid rgba(151,182,76,0.15)",
    borderBottom: "1px solid rgba(151,182,76,0.15)",
  }}
>
  <style>{`
    .process-split {
      display: grid;
      grid-template-columns: minmax(200px, 0.6fr) 1.4fr;
      gap: clamp(32px, 5vw, 64px);
      align-items: center;
    }

    /* ── Centered header ── */
    .process-split-header {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* ── Grid ── */
    .process-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(16px, 2.4vw, 24px);
      min-width: 0;
    }

    /* ── Card ── */
    .process-card {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-width: 0;
      width: 100%;
      cursor: default;
    }

    /* ── Media box ── */
    .process-card-media {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 14px;
      border: 1px solid #d8e8b8;
      overflow: hidden;
      background: #f4f7f0;
      margin-bottom: 14px;
      transition: border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
      will-change: transform;
    }

    .process-card:hover .process-card-media {
      border-color: #97b64c;
      box-shadow: 0 8px 28px rgba(151,182,76,0.14);
      transform: translateY(-3px);
    }

    .process-card-media img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.38s ease;
    }

    .process-card:hover .process-card-media img {
      transform: scale(1.04);
    }

    .process-card-fallback {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      font-size: 2.4rem;
      background: #f4f7f0;
    }

    /* ── Copy ── */
    .process-card-copy {
      width: 100%;
      padding: 0 2px;
    }

    .process-card-title {
      color: #1e1e1e;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin: 0;
      line-height: 1.4;
    }

    .process-card-desc {
      color: #5a6a4a;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      line-height: 1.65;
      margin: 7px 0 0;
    }

    /* ── Divider under title ── */
    .process-card-divider {
      display: block;
      width: 20px;
      height: 2px;
      background: #97b64c;
      border-radius: 2px;
      margin: 8px 0;
      transition: width 0.28s ease;
    }

    .process-card:hover .process-card-divider {
      width: 36px;
    }

    /* ── Responsive ── */
    @media (max-width: 960px) {
      .process-split {
        grid-template-columns: 1fr;
        gap: clamp(24px, 4vw, 40px);
      }
      .process-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 520px) {
      .process-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>

  <div
    className="process-split relative z-10 mx-auto"
    style={{
      maxWidth: 1160,
      padding: "0 clamp(20px,4vw,56px)",
    }}
  >
    {/* ── Left: centered heading ── */}
    <Slide direction="left">
      <div className="process-split-header">
        <p
          style={{
            color: "#97b64c",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            margin: "0 0 16px",
          }}
        >
          How It Works
        </p>
        <h2
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#18210f",
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.05,
          }}
        >
          Franchise<br />Process
        </h2>
      </div>
    </Slide>

    {/* ── Right: cards grid ── */}
    <div className="process-grid">
      {steps.map((s, i) => (
        <Slide key={s.step} direction="up" delay={i * 60}>
          <article className="process-card">
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
              <h3 className="process-card-title">{s.title}</h3>
              <span className="process-card-divider" aria-hidden="true" />
              <p className="process-card-desc">{s.desc}</p>
            </div>
          </article>
        </Slide>
      ))}
    </div>
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
  data-track-section="Franchise Packages"
  className="relative py-10 sm:py-12 lg:py-16 overflow-x-clip"
  style={{
    background: "linear-gradient(135deg, #f7faef 0%, #eef6dc 55%, #e8f2d0 100%)",
    overflowY: "visible",
  }}
>
 
  {/* Dot grid */}
  <div aria-hidden style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: "radial-gradient(circle, rgba(98,132,11,0.1) 1px, transparent 1px)",
    backgroundSize: "28px 28px",
    maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 72%)",
    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 72%)",
  }} />
 
  <div className="relative z-10">
 
    {/* Header */}
    <div className="text-center mb-2 px-4">
      <Slide direction="up">
        <p style={{
          fontSize: "10px", fontWeight: 800, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#97b64c",
          fontFamily: "'DM Sans', sans-serif", margin: "0 0 10px",
        }}>Choose Your Package</p>
      </Slide>
      <Slide direction="up" delay={60}>
        <h2 style={{
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 900, letterSpacing: "-0.04em",
          color: "#18210f", margin: "0 0 10px",
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.05,
        }}>
          Find the Right{" "}
          <span style={{ color: "#62840b" }}>Fit for You</span>
        </h2>
      </Slide>
      <Slide direction="up" delay={100}>
      
      </Slide>
    </div>
 
    {/* Carousel */}
    <div className="mt-10 mb-2">
      <PackageCards formData={formData} setFormData={setFormData} setFieldErrors={setFieldErrors} />
    </div>
 
    {/* Bottom nudge */}
    <Slide direction="up" delay={300} className="text-center mt-6 px-4">
      <p style={{
        fontSize: "0.78rem", color: "#7a9460",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Not sure? Select <strong style={{ color: "#62840b" }}>Not sure yet</strong> in the form below and we'll help you decide.
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
                style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif", margin: "0 0 14px" }}
              >
                Common Questions
              </p>
              <h2
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#fafafa",
                  margin: "0 0 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.05,
                }}
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