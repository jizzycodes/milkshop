import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { createFranchiseRequest } from "../services/api"
import { localDatetimeLocalFloor } from "../utils/dateInputConstraints"


// ─── DATA (unchanged) ────────────────────────────────────────────────────────

const steps = [
  { step: "01", icon: "📋", title: "Submit Inquiry",    desc: "Fill out the form below. Our franchise team reviews every application within 3–5 business days." },
  { step: "02", icon: "🤝", title: "Initial Interview", desc: "We set up a call or meeting to discuss your goals, target location, and the right package for you." },
  { step: "03", icon: "📍", title: "Site Validation",   desc: "Our team assesses your proposed location against Milkshop's foot traffic and visibility standards." },
  { step: "04", icon: "✍️", title: "Sign Agreement",    desc: "Once approved, we finalize the franchise agreement and you secure your slot with the franchise fee." },
  { step: "05", icon: "🏗️", title: "Setup & Training",  desc: "Store build-out begins. Your team undergoes official Milkshop training — operations, drinks, service." },
  { step: "06", icon: "🎉", title: "Grand Opening",     desc: "Launch day! Our team is on-site with you from day one. Start serving Milkshop to your community." },
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

/** Scoped to this page route — prevents horizontal overflow and scrollbar gutter jump when scroll-lock runs */
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

const packages = [
  {
    id: "cart",
    emoji: "🛒",
    label: "Cart",
    tagline: "Start Small, Dream Big",
    price: "Entry-level investment",
    term: "2-year term",
    badge: null,
    color: "#62840b",
    accentBg: "rgba(151,182,76,0.07)",
    borderSelected: "#97b64c",
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
    emoji: "🏪",
    label: "Kiosk",
    tagline: "The Sweet Spot",
    price: "Mid-range investment",
    term: "3-year term",
    badge: "Most Popular",
    color: "#4a6b08",
    accentBg: "rgba(151,182,76,0.11)",
    borderSelected: "#97b64c",
    features: [
      "Mall & commercial ready",
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
    features: [
      "Full store fit-out & design",
      "Highest revenue potential",
      "Premium exclusivity zone",
      "Priority franchise support",
    ],
    best: "For serious operators ready to scale.",
  },
];

function PackageCards({ formData, setFormData, setFieldErrors }) {
  const selected = formData.preferredPackage;

  const handleSelect = (id) => {
    setFormData((p) => ({ ...p, preferredPackage: id }));
    setFieldErrors((p) => ({ ...p, preferredPackage: "" }));
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 20,
    }}>
      {packages.map((pkg, i) => {
        const isSelected = selected === pkg.id;
        return (
          <Slide key={pkg.id} direction="up" delay={i * 80}>
            <div
              className={`pkg-card${isSelected ? " selected" : ""}`}
              onClick={() => handleSelect(pkg.id)}
              style={{
                borderRadius: 24,
                border: isSelected
                  ? `2px solid ${pkg.borderSelected}`
                  : "1.5px solid rgba(151,182,76,0.2)",
                background: isSelected
                  ? "rgba(255,255,255,0.97)"
                  : "rgba(255,255,255,0.82)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxShadow: isSelected
                  ? "0 16px 48px rgba(151,182,76,0.2)"
                  : "0 4px 20px rgba(151,182,76,0.07)",
                padding: "28px 26px 24px",
                position: "relative",
                overflow: "hidden",
                userSelect: "none",
              }}
            >
              {/* Selected top bar */}
              {isSelected && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: "linear-gradient(90deg, #62840b, #97b64c, #b7cd7f)",
                  borderRadius: "24px 24px 0 0",
                }} />
              )}

              {/* Background accent circle */}
              <div aria-hidden style={{
                position: "absolute", bottom: -40, right: -40,
                width: 160, height: 160, borderRadius: "50%",
                background: isSelected ? "rgba(151,182,76,0.09)" : "rgba(151,182,76,0.04)",
                pointerEvents: "none",
                transition: "background 0.3s ease",
              }} />

              {/* Badge */}
              {pkg.badge && (
                <div className={isSelected ? "pkg-badge" : ""} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 11px", borderRadius: 999,
                  background: isSelected
                    ? "linear-gradient(135deg, #62840b, #97b64c)"
                    : "rgba(151,182,76,0.14)",
                  color: isSelected ? "#fff" : "#62840b",
                  fontSize: "10px", fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 14,
                  transition: "background 0.3s ease, color 0.3s ease",
                }}>
                  {isSelected && <span style={{ fontSize: 9 }}>★</span>}
                  {pkg.badge}
                </div>
              )}
              {!pkg.badge && <div style={{ height: 28, marginBottom: 14 }} />}

              {/* Emoji + Label */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{
                  fontSize: "2rem", lineHeight: 1,
                  filter: isSelected ? "drop-shadow(0 2px 8px rgba(151,182,76,0.4))" : "none",
                  transition: "filter 0.3s ease",
                }}>{pkg.emoji}</span>
                <div>
                  <h3 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "1.45rem", fontWeight: 900,
                    color: isSelected ? pkg.color : "#2a3520",
                    margin: 0, letterSpacing: "-0.025em",
                    transition: "color 0.3s ease",
                  }}>{pkg.label}</h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.75rem", color: "#8aa06a",
                    margin: 0, fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}>{pkg.tagline}</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: isSelected
                  ? "linear-gradient(90deg, rgba(151,182,76,0.4), transparent)"
                  : "rgba(151,182,76,0.12)",
                borderRadius: 1,
                margin: "16px 0",
                transition: "background 0.3s ease",
              }} />

              {/* Meta */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[pkg.price, pkg.term].map((meta) => (
                  <span key={meta} style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "4px 10px", borderRadius: 999,
                    background: isSelected ? "rgba(151,182,76,0.13)" : "rgba(151,182,76,0.07)",
                    color: isSelected ? "#4a6b08" : "#7a9460",
                    border: "1px solid rgba(151,182,76,0.18)",
                    transition: "all 0.3s ease",
                  }}>{meta}</span>
                ))}
              </div>

              {/* Features */}
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {pkg.features.map((f, fi) => (
                  <li key={fi} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.85rem", color: isSelected ? "#3a4a2a" : "#627a50",
                    fontWeight: isSelected ? 600 : 500,
                    transition: "color 0.3s ease",
                  }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: isSelected
                        ? "linear-gradient(135deg, #62840b, #97b64c)"
                        : "rgba(151,182,76,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", color: isSelected ? "#fff" : "#7a9460",
                      fontWeight: 900,
                      transition: "all 0.3s ease",
                      boxShadow: isSelected ? "0 2px 8px rgba(151,182,76,0.3)" : "none",
                    }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Best for */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.78rem", lineHeight: 1.55,
                color: isSelected ? "#62840b" : "#9ab07a",
                margin: "14px 0 16px",
                fontStyle: "italic",
                transition: "color 0.3s ease",
              }}>{pkg.best}</p>

              {/* Select button */}
              <div style={{
                width: "100%", padding: "11px 0",
                borderRadius: 999, textAlign: "center",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem", fontWeight: 800,
                letterSpacing: "0.04em",
                background: isSelected
                  ? "linear-gradient(135deg, #62840b, #97b64c)"
                  : "rgba(151,182,76,0.1)",
                color: isSelected ? "#fff" : "#62840b",
                border: isSelected ? "none" : "1.5px solid rgba(151,182,76,0.3)",
                boxShadow: isSelected ? "0 8px 24px rgba(151,182,76,0.28)" : "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}>
                {isSelected ? "✓ Selected" : "Select Package"}
              </div>

            </div>
          </Slide>
        );
      })}
    </div>
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
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const panel = heroProcessPanelRef.current;
    const heroSection = processSectionRef.current;
    if (!panel || !heroSection) return;

    const THRESHOLD = 48;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevHtmlOverscroll = htmlEl.style.overscrollBehavior;
    const prevBodyOverscroll = bodyEl.style.overscrollBehavior;

    const setPageScrollLocked = (locked) => {
      if (locked) {
        htmlEl.style.overflow = "hidden";
        bodyEl.style.overflow = "hidden";
        htmlEl.style.overscrollBehavior = "none";
        bodyEl.style.overscrollBehavior = "none";
        return;
      }
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      htmlEl.style.overscrollBehavior = prevHtmlOverscroll;
      bodyEl.style.overscrollBehavior = prevBodyOverscroll;
    };

    const setLocked = (locked) => {
      processLockRef.current = locked;
      setPageScrollLocked(locked);
    };

    const isHeroEngaged = () => {
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
      if (!(eventTarget instanceof Node)) return processLockRef.current;
      return heroSection.contains(eventTarget) || processLockRef.current;
    };

    const syncLockState = () => {
      if (!isHeroEngaged()) {
        setLocked(false);
        processWheelDeltaRef.current = 0;
        processTouchYRef.current = null;
      }
    };

    const onWheel = (e) => {
      if (!shouldCaptureFromEvent(e.target)) return;

      const isTryingToLeaveForward = activeStep === steps.length - 1 && e.deltaY > 0;
      const isTryingToLeaveBackward = activeStep === 0 && e.deltaY < 0;
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        setLocked(false);
        processWheelDeltaRef.current = 0;
        return;
      }

      if (!processLockRef.current) {
        setLocked(true);
      }

      e.preventDefault();
      processWheelDeltaRef.current += e.deltaY;

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

      const isTryingToLeaveForward = activeStep === steps.length - 1 && deltaY > 0;
      const isTryingToLeaveBackward = activeStep === 0 && deltaY < 0;
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
      setLocked(false);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", syncLockState);
      window.removeEventListener("resize", syncLockState);
    };
  }, [activeStep]);

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
    FRANCHISE HERO — Premium Animated
══════════════════════════════════════ */}
<section
  ref={processSectionRef}
  data-track-section="Franchise Hero"
  className="relative overflow-hidden"
  style={{
    background: "linear-gradient(158deg, #f3f9ea 0%, #ffffff 50%, #f0f7e6 100%)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    fontFamily: "'DM Sans', sans-serif",
  }}
>
  <style>{`
    @keyframes fhFadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fhFadeLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fhFadeRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fhShimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes fhOrbDrift  { 0%,100%{transform:translate(0,0) scale(1);opacity:0.5} 50%{transform:translate(18px,-14px) scale(1.07);opacity:0.85} }
    @keyframes fhTagPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(151,182,76,0.45)} 50%{box-shadow:0 0 0 9px rgba(151,182,76,0)} }
    @keyframes fhDotBlink  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.65)} }
    @keyframes fhCardIn    { from{opacity:0;transform:translateY(14px) scale(0.99)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes fhDescIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fhScrollLine{ 0%{transform:translateY(-100%)} 100%{transform:translateY(220%)} }
    @keyframes fhSoftPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(151,182,76,0.2) } 50%{ box-shadow:0 0 0 10px rgba(151,182,76,0) } }
    @keyframes fhCheckIn   { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

    .fh-tag   { opacity:0; animation:fhFadeUp   0.6s ease forwards; animation-delay:0.1s }
    .fh-h1    { opacity:0; animation:fhFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.25s }
    .fh-p     { opacity:0; animation:fhFadeLeft 0.7s ease forwards; animation-delay:0.42s }
    .fh-list  { opacity:0; animation:fhFadeUp   0.7s ease forwards; animation-delay:0.55s }
    .fh-cta   { opacity:0; animation:fhFadeUp   0.7s ease forwards; animation-delay:0.68s }
    .fh-stats { opacity:0; animation:fhFadeUp   0.7s ease forwards; animation-delay:0.8s }
    .fh-right { opacity:0; animation:fhFadeRight 0.85s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.15s }

    .fh-cta-primary {
      display:inline-flex; align-items:center; gap:7px;
      padding:15px 32px; border-radius:999px;
      background:linear-gradient(135deg,#62840b,#97b64c);
      color:#fff; font-family:'DM Sans',sans-serif;
      font-size:0.9rem; font-weight:800;
      text-decoration:none; border:none; cursor:pointer;
      box-shadow:0 10px 32px rgba(151,182,76,0.4);
      transition:all 0.3s ease; letter-spacing:0.01em;
    }
    .fh-cta-primary:hover { transform:translateY(-3px); box-shadow:0 18px 44px rgba(151,182,76,0.52) }

    .fh-cta-secondary {
      display:inline-flex; align-items:center; gap:7px;
      padding:15px 28px; border-radius:999px;
      background:transparent; color:#62840b;
      font-family:'DM Sans',sans-serif;
      font-size:0.9rem; font-weight:700;
      text-decoration:none;
      border:1.5px solid rgba(151,182,76,0.38);
      transition:all 0.3s ease;
    }
    .fh-cta-secondary:hover { background:rgba(151,182,76,0.08); border-color:#97b64c; transform:translateY(-2px) }

    .fh-step-track-fill {
      transition: height 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    .fh-step-card {
      animation: fhCardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .fh-step-desc {
      animation: fhDescIn 0.45s ease forwards;
      animation-delay: 0.1s;
      opacity: 0;
    }
    .fh-stat-item { transition:transform 0.3s ease; }
    .fh-stat-item:hover { transform:translateY(-3px) }
    .fh-check { animation:fhCheckIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
    .fh-node-active {
      animation: fhSoftPulse 1.8s ease-in-out infinite;
    }
  `}</style>

  {/* ── Backgrounds ── */}
  <div aria-hidden style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:"radial-gradient(circle, rgba(151,182,76,0.2) 1.5px, transparent 1.5px)",
    backgroundSize:"32px 32px",
    maskImage:"radial-gradient(ellipse at 8% 55%, black 5%, transparent 52%)",
    WebkitMaskImage:"radial-gradient(ellipse at 8% 55%, black 5%, transparent 52%)",
  }} />
  <div aria-hidden style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:"radial-gradient(circle, rgba(151,182,76,0.1) 1.5px, transparent 1.5px)",
    backgroundSize:"26px 26px",
    maskImage:"radial-gradient(ellipse at 94% 42%, black 5%, transparent 50%)",
    WebkitMaskImage:"radial-gradient(ellipse at 94% 42%, black 5%, transparent 50%)",
  }} />
  <div aria-hidden style={{
    position:"absolute", top:"-10%", right:"-6%",
    width:600, height:600, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(151,182,76,0.11) 0%, transparent 68%)",
    filter:"blur(28px)", pointerEvents:"none",
    animation:"fhOrbDrift 16s ease-in-out infinite",
  }} />
  <div aria-hidden style={{
    position:"absolute", bottom:"0%", left:"-5%",
    width:360, height:360, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(183,205,127,0.13) 0%, transparent 70%)",
    filter:"blur(22px)", pointerEvents:"none",
    animation:"fhOrbDrift 20s ease-in-out infinite reverse",
  }} />
  <div aria-hidden style={{
    position:"absolute", right:"4%", top:"50%", transform:"translateY(-50%)",
    width:"min(540px,55vw)", height:"min(540px,55vw)", borderRadius:"50%",
    border:"1px solid rgba(151,182,76,0.09)", pointerEvents:"none",
  }} />
  <div aria-hidden style={{
    position:"absolute", bottom:0, left:0, right:0, height:1,
    background:"linear-gradient(90deg, transparent, rgba(151,182,76,0.25), transparent)",
  }} />

  {/* ── Content ── */}
  <div style={{
    position:"relative", zIndex:10,
    maxWidth:1380, margin:"0 auto",
    padding:"clamp(100px,12vw,130px) clamp(20px,4vw,56px) clamp(80px,10vw,110px)",
    width:"100%", boxSizing:"border-box",
    display:"grid",
    gridTemplateColumns:"0.78fr 1.22fr",
    gap:34,
    alignItems:"center",
  }}
    className="max-lg:grid-cols-1 max-lg:gap-12"
  >

    {/* ══ LEFT ══ */}
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>



      {/* Headline */}
      <div className="fh-h1">
        <h1 style={{
          fontSize:"clamp(3rem,6.5vw,5.6rem)",
          fontWeight:900, lineHeight:0.88,
          letterSpacing:"-0.055em", margin:0,
          color:"#1a1e14",
        }}>
          Own a Milkshop.<br />
          <span style={{
            background:"linear-gradient(135deg, #3a5c06 0%, #62840b 30%, #97b64c 65%, #b7cd7f 100%)",
            backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            animation:"fhShimmer 5s linear infinite",
            animationDelay:"1s",
            display:"inline-block",
          }}>Build Your Future.</span>
        </h1>
      </div>

      {/* Body */}
      <div className="fh-p">
        <p style={{
          fontSize:"clamp(0.9rem,1.5vw,1.05rem)",
          lineHeight:1.8, color:"#4d5c3a",
          maxWidth:480, margin:0,
        }}>
          Proven system, fast setup, and full support from day one. Start your business with a brand trusted by Filipino milk tea customers.
        </p>
      </div>

      {/* Key points */}
      <ul className="fh-list" style={{
        listStyle:"none", margin:0, padding:0,
        display:"flex", flexDirection:"column", gap:10,
      }}>
        {["No experience required", "12–18 months ROI target", "Exclusive territory available"].map((item, i) => (
          <li key={item} style={{
            display:"flex", alignItems:"center", gap:10,
            fontFamily:"'DM Sans', sans-serif",
            fontSize:"0.9rem", fontWeight:600, color:"#3a4a2a",
          }}>
            <span className="fh-check" style={{
              width:20, height:20, borderRadius:"50%",
              background:"linear-gradient(135deg, #62840b, #97b64c)",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, fontSize:"10px", color:"white", fontWeight:800,
              boxShadow:"0 3px 10px rgba(151,182,76,0.35)",
              animationDelay:`${0.6 + i * 0.1}s`,
            }}>✓</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="fh-cta" style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
        <a href="#inquiry" className="fh-cta-primary">Apply for Franchise →</a>
        <a href="#process" className="fh-cta-secondary">View Process</a>
      </div>

  

    </div>

    {/* ══ RIGHT — Minimal Timeline Panel ══ */}
    <div className="fh-right" style={{ position:"relative", width:"100%", justifySelf:"end" }}>
      <div
        ref={heroProcessPanelRef}
        style={{
          width:"min(100%, 860px)",
          marginLeft:"auto",
          background:"rgba(255,255,255,0.93)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          borderRadius:30,
          border:"1px solid rgba(151,182,76,0.22)",
          boxShadow:"0 20px 56px rgba(151,182,76,0.14)",
          overflow:"hidden",
          position:"relative",
        }}
      >
        <div style={{
          height:6,
          background:"linear-gradient(90deg, rgba(151,182,76,0.7), rgba(183,205,127,0.45))",
        }} />

        <div style={{ padding:"34px 34px 28px", display:"flex", flexDirection:"column", gap:0 }}>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:20,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"10px", fontWeight:800,
                letterSpacing:"0.2em", textTransform:"uppercase",
                color:"#62840b",
              }}>How It Works</span>
            </div>
            <span style={{
              fontFamily:"'DM Mono',monospace",
              fontSize:"11px", fontWeight:700,
              letterSpacing:"0.1em", color:"#62840b",
              background:"rgba(151,182,76,0.12)",
              border:"1px solid rgba(151,182,76,0.25)",
              borderRadius:999,
              padding:"5px 10px",
            }}>
              {String(activeStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          </div>

          <div key={activeStep} className="fh-step-card" style={{
            display:"flex", flexDirection:"column", gap:10,
            padding:"24px 22px",
            borderRadius:20,
            background:"linear-gradient(180deg, rgba(248,252,241,0.95) 0%, rgba(255,255,255,0.96) 100%)",
            border:"1px solid rgba(151,182,76,0.2)",
            marginBottom:22,
            position:"relative",
            overflow:"hidden",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:"10px", fontWeight:800,
                letterSpacing:"0.18em", color:"#97b64c",
              }}>{steps[activeStep].step}</span>
              <div style={{ width:26, height:1, background:"rgba(151,182,76,0.35)" }} />
              <span style={{ fontSize:"1.05rem" }}>{steps[activeStep].icon}</span>
            </div>
            <h4 style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"1.38rem", fontWeight:800,
              color:"#1f2a17", margin:0,
              letterSpacing:"-0.02em",
            }}>{steps[activeStep].title}</h4>
            <p className="fh-step-desc" style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"0.96rem", lineHeight:1.75,
              color:"#506244", margin:0, maxWidth:560,
            }}>{steps[activeStep].desc}</p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:4, position:"relative", minHeight:260 }}>
            <div style={{
              position:"absolute", left:15, top:4, bottom:14,
              width:2, background:"rgba(151,182,76,0.12)", borderRadius:999,
            }}>
              <div className="fh-step-track-fill" style={{
                width:"100%", borderRadius:999,
                background:"linear-gradient(180deg, #97b64c, #b7cd7f)",
                height:`${((activeStep + 1) / steps.length) * 100}%`,
              }} />
            </div>

            {steps.map((s, i) => {
              const isActive = activeStep === i
              const isPast   = i < activeStep
              return (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  style={{
                    display:"flex", alignItems:"center", gap:12,
                    padding:"9px 8px 9px 0",
                    cursor:"pointer",
                    transition:"all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.paddingLeft = "3px" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.paddingLeft = "0px" }}
                >
                  <div className={isActive ? "fh-node-active" : ""} style={{
                    width:30, height:30, borderRadius:"50%", flexShrink:0,
                    background: isActive ? "#f1f7e8" : isPast ? "#f4f8ef" : "#fafcf7",
                    border:`1.5px solid ${isActive ? "#97b64c" : isPast ? "rgba(151,182,76,0.42)" : "rgba(151,182,76,0.2)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:"10px", color:"#62840b",
                    boxShadow: isActive ? "0 8px 20px rgba(151,182,76,0.18)" : "none",
                    transition:"all 0.3s ease",
                    zIndex:1, position:"relative",
                  }}>
                    {isPast
                      ? <span style={{ fontSize:10, color:"#62840b", fontWeight:800 }}>✓</span>
                      : <span style={{ fontSize:11 }}>{isActive ? "●" : "○"}</span>
                    }
                  </div>

                  <span style={{
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:"0.9rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#25321c" : isPast ? "#62840b" : "#879a79",
                    transition:"all 0.3s ease",
                    letterSpacing:"-0.005em",
                  }}>{s.title}</span>

                  {isActive && (
                    <span style={{
                      marginLeft:"auto", fontSize:10, color:"#97b64c", fontWeight:700,
                    }}>active</span>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"space-between",
            marginTop:22,
            paddingTop:18,
            borderTop:"1px solid rgba(151,182,76,0.14)",
          }}>
            <p style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"11px", color:"#7b9461",
              margin:0, letterSpacing:"0.03em",
              opacity: activeStep === 0 ? 1 : 0,
              transform: activeStep === 0 ? "translateY(0)" : "translateY(-5px)",
              transition:"all 0.4s ease",
            }}>↓ Scroll to walk through each step</p>

            <a href="#inquiry" style={{
              display:"inline-flex", alignItems:"center", gap:5,
              padding:"10px 19px", borderRadius:999,
              background:"#97b64c",
              color:"white", textDecoration:"none",
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"11px", fontWeight:700,
              boxShadow:"0 6px 16px rgba(151,182,76,0.22)",
              transition:"all 0.25s ease",
              letterSpacing:"0.02em",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 10px 20px rgba(151,182,76,0.28)" }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 6px 16px rgba(151,182,76,0.22)" }}
            >Apply Now →</a>
          </div>

        </div>
      </div>
    </div>
  </div>

  {/* Scroll cue */}
  <div style={{
    position:"absolute", bottom:24, right:"clamp(24px, 5vw, 64px)",
    display:"flex", alignItems:"center", gap:8,
    opacity:0.46, zIndex:5,
  }}>
    <div style={{
      width:36, height:1, overflow:"hidden",
      background:"rgba(98,132,11,0.2)", borderRadius:1, position:"relative",
    }}>
      <div style={{
        position:"absolute", left:0, width:"42%", height:"100%",
        background:"#97b64c", borderRadius:1,
        animation:"fhScrollLine 1.8s ease-in-out infinite",
      }} />
    </div>
    <span style={{
      fontFamily:"'DM Mono',monospace",
      fontSize:"8px", letterSpacing:"0.14em",
      textTransform:"uppercase", color:"#62840b",
    }}>Scroll</span>
  </div>

</section>






{/* ══════════════════════════════════════
     PACKAGE SELECTION SECTION
══════════════════════════════════════ */}
<section
  id="packages"
  data-track-section="Franchise Packages"
  className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
  style={{ background: "linear-gradient(160deg, #f7faf0 0%, #ffffff 50%, #f3f9ea 100%)" }}
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
    @keyframes pkgGlow {
      0%,100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.3); }
      50%      { box-shadow: 0 0 0 10px rgba(151,182,76,0); }
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
    .pkg-card {
      transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                  box-shadow 0.35s ease,
                  border-color 0.25s ease;
      cursor: pointer;
    }
    .pkg-card:hover {
      transform: translateY(-6px);
    }
    .pkg-card.selected {
      animation: pkgGlow 2s ease-in-out infinite;
    }
    .pkg-badge {
      animation: pkgBadgePop 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .pkg-feature-dot {
      animation: pkgDotPulse 2.4s ease-in-out infinite;
    }
    .pkg-shimmer-text {
      background: linear-gradient(120deg, #3a5c06 0%, #62840b 30%, #97b64c 60%, #b7cd7f 80%, #62840b 100%);
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
    backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.14) 1.5px, transparent 1.5px)",
    backgroundSize: "36px 36px",
    maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
    WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 68%)",
  }} />
  {/* Orb accents */}
  <div aria-hidden style={{
    position: "absolute", top: "-8%", right: "-4%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(151,182,76,0.1) 0%, transparent 70%)",
    filter: "blur(32px)", pointerEvents: "none",
  }} />
  <div aria-hidden style={{
    position: "absolute", bottom: "-5%", left: "-3%",
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(183,205,127,0.12) 0%, transparent 70%)",
    filter: "blur(24px)", pointerEvents: "none",
  }} />

  <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 z-10">

    {/* Header */}
    <Slide direction="up" className="text-center mb-4">
      <p style={{
        fontSize: "11px", fontWeight: 800, letterSpacing: "0.3em",
        textTransform: "uppercase", color: "#97b64c",
        fontFamily: "'DM Sans', sans-serif",
      }}>Choose Your Package</p>
    </Slide>
    <Slide direction="up" delay={60} className="text-center mb-3">
      <h2 style={{
        fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
        fontWeight: 900, letterSpacing: "-0.04em",
        color: "#1a1e14", margin: 0,
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.05,
      }}>
        Find the Right <span className="pkg-shimmer-text">Fit for You</span>
      </h2>
    </Slide>
    <Slide direction="up" delay={100} className="text-center mb-14">
      <p style={{
        fontSize: "0.95rem", color: "#5a6a4a", lineHeight: 1.75,
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
        fontSize: "0.82rem", color: "#8aa06a",
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
      <section data-track-section="Franchise FAQs" className="relative py-14 sm:py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: "#f5f8ef" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 0%, transparent 65%)",
        }} />

        <div className="relative max-w-3xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Common Questions</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-8">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1e1e1e" }}>FAQs</h2>
          </Slide>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Slide key={i} direction="up" delay={i * 50}>
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ border: openFaq === i ? "1.5px solid #97b64c" : "1px solid #d0e0b0", boxShadow: openFaq === i ? "0 4px 20px rgba(151,182,76,0.12)" : "none" }}
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