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
  const processLockRef = useRef(false);
  const processWheelDeltaRef = useRef(0);

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
    const section = processSectionRef.current;
    if (!section) return;

    const THRESHOLD = 90;

    const isSectionCentered = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= window.innerHeight * 0.25 && rect.bottom >= window.innerHeight * 0.75;
    };

    const syncLockState = () => {
      if (!isSectionCentered()) {
        processLockRef.current = false;
        processWheelDeltaRef.current = 0;
      }
    };

    const onWheel = (e) => {
      const isTryingToLeaveForward = activeStep === steps.length - 1 && e.deltaY > 0;
      const isTryingToLeaveBackward = activeStep === 0 && e.deltaY < 0;
      if (isTryingToLeaveForward || isTryingToLeaveBackward) {
        processLockRef.current = false;
        processWheelDeltaRef.current = 0;
        return;
      }

      if (!processLockRef.current) {
        if (!isSectionCentered()) return;
        processLockRef.current = true;
      }

      e.preventDefault();
      processWheelDeltaRef.current += e.deltaY;

      if (Math.abs(processWheelDeltaRef.current) < THRESHOLD) return;

      const direction = processWheelDeltaRef.current > 0 ? 1 : -1;
      processWheelDeltaRef.current = 0;

      setActiveStep((prev) => {
        const next = prev + direction;
        if (next < 0) {
          processLockRef.current = false;
          return 0;
        }
        if (next >= steps.length) {
          processLockRef.current = false;
          return steps.length - 1;
        }
        return next;
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", syncLockState, { passive: true });
    window.addEventListener("resize", syncLockState);
    return () => {
      window.removeEventListener("wheel", onWheel);
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
    <main style={{ backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>


 {/* ══════════════════════════════════════
      SLIDE 1 — HERO (PREMIUM UPGRADE)
══════════════════════════════════════ */}
<section
  data-track-section="Franchise Hero"
  className="relative overflow-hidden"
  style={{
    background: "linear-gradient(160deg, #f5f8ef 0%, #ffffff 60%, #fffdf5 100%)",
    minHeight: isMobile ? "84vh" : "100vh",
    display: "flex",
    alignItems: "center",
  }}
>

  {/* Softer pattern */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.12) 1px, transparent 1px)",
      backgroundSize: "34px 34px",
      maskImage: "radial-gradient(ellipse at 30% 50%, black 20%, transparent 75%)",
      WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, black 20%, transparent 75%)",
    }}
  />

  {/* Ambient glow */}
  <div
    className="absolute -right-32 -top-24 pointer-events-none"
    style={{
      width: "600px",
      height: "600px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(151,182,76,0.10) 0%, transparent 70%)",
    }}
  />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-28 z-10 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">

      {/* LEFT */}
      <div className="flex flex-col gap-7">

        <span
          className="self-start inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-2 rounded-full"
          style={{
            backgroundColor: "rgba(151,182,76,0.10)",
            color: "#62840b",
            border: "1px solid rgba(151,182,76,0.22)"
          }}
        >
          🇹🇼 Franchise Opportunity
        </span>

        <h1
          style={{
            fontSize: "clamp(3.2rem, 6vw, 5.4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.05em",
            color: "#1e1e1e",
          }}
        >
          Own a Milkshop.<br />
          <span style={{ color: "#97b64c" }}>Build Your Future.</span>
        </h1>

        <p className="text-base leading-relaxed max-w-xl"
          style={{ color: "#5a6a4a" }}>
          Proven system, fast setup, and full support from day one. Start your business with a brand trusted by Filipino milk tea customers.
        </p>

        {/* KEY POINTS */}
        <ul className="flex flex-col gap-2 text-sm" style={{ color: "#3a4a2a" }}>
          {["No experience required", "12–18 months ROI target", "Exclusive territory available"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: "#97b64c" }}>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA (MORE DOMINANT) */}
        <div className="flex flex-wrap gap-4 mt-2">
          <a
            href="#inquiry"
            className="px-10 py-4 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.04] active:scale-95"
            style={{
              backgroundColor: "#97b64c",
              color: "#fff",
              boxShadow: "0 12px 32px rgba(151,182,76,0.35)",
            }}
          >
            Apply for Franchise →
          </a>

          <a
            href="#process"
            className="px-8 py-4 rounded-full font-bold text-sm transition-all duration-200"
            style={{
              border: "1.5px solid #d0e0b0",
              color: "#62840b",
              backgroundColor: "transparent"
            }}
          >
            View Process
          </a>
        </div>

        {/* TRUST METRICS (MORE PREMIUM) */}
        <div className="flex gap-6 mt-6 text-sm">

          {[
            { label: "Branches", value: "15+" },
            { label: "Partners", value: "100+" },
            { label: "Support", value: "Nationwide" }
          ].map((m) => (
            <div key={m.label} className="flex flex-col">
              <span className="text-xl font-extrabold" style={{ color: "#1e1e1e" }}>
                {m.value}
              </span>
              <span className="text-xs" style={{ color: "#62840b" }}>
                {m.label}
              </span>
            </div>
          ))}

        </div>

      </div>

      {/* RIGHT */}
      <div className="relative w-full max-w-xl mx-auto lg:mx-0">

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            border: "1px solid #d0e0b0",
            boxShadow: "0 25px 70px rgba(0,0,0,0.12)"
          }}
        >
          <img
            src="/images/store.jpg"
            alt="Milkshop Store"
            className="w-full h-[460px] object-cover"
          />
        </div>

        {/* FLOATING METRICS (REFINED) */}
        <div
          className="absolute -bottom-6 -left-6 bg-white px-5 py-4 rounded-2xl text-sm"
          style={{
            border: "1px solid #d0e0b0",
            boxShadow: "0 14px 34px rgba(0,0,0,0.10)"
          }}
        >
          <p className="font-bold" style={{ color: "#1e1e1e" }}>ROI</p>
          <p style={{ color: "#62840b", fontWeight: 800 }}>12–18 Months</p>
        </div>

        <div
          className="absolute -top-6 -right-6 bg-white px-5 py-4 rounded-2xl text-sm"
          style={{
            border: "1px solid #d0e0b0",
            boxShadow: "0 14px 34px rgba(0,0,0,0.10)"
          }}
        >
          <p className="font-bold" style={{ color: "#1e1e1e" }}>Support</p>
          <p style={{ color: "#62840b", fontWeight: 800 }}>Full Training</p>
        </div>

      </div>
    </div>
  </div>
</section>



      {/* ══════════════════════════════════════
      SLIDE 2 — WHY MILKSHOP (SPOTLIGHT)
══════════════════════════════════════ */}
<section
  data-track-section="Why Milkshop"
  className="relative py-32 bg-white overflow-hidden"
>

  {/* Watermark */}
  <div
    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
    style={{
      fontSize: "30vw",
      fontWeight: 900,
      color: "rgba(151,182,76,0.04)",
      fontFamily: "serif",
    }}
  >
    侠
  </div>

  <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10">

    {/* HEADER */}
    <p
      className="text-[11px] font-bold tracking-[0.28em] uppercase mb-3"
      style={{ color: "#97b64c" }}
    >
      Why Partner With Us
    </p>

    <h2
      className="mb-20"
      style={{
        fontSize: "clamp(3rem, 6vw, 4.5rem)",
        fontWeight: 900,
        letterSpacing: "-0.04em",
        color: "#1e1e1e",
        lineHeight: 1.05,
      }}
    >
      What Makes Milkshop Different
    </h2>

    {/* SPOTLIGHT GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {whyUs.map((w, i) => (
        <div
          key={w.title}
          className="group relative rounded-3xl p-8 transition-all duration-500 cursor-pointer"
          style={{
            background: "rgba(245,248,239,0.5)",
            border: "1px solid #e0ebd0",
          }}
        >

          {/* DIM OTHERS ON HOVER */}
          <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-0 peer-hover:opacity-60 transition-all duration-500 pointer-events-none" />

          {/* ICON */}
          <div className="text-4xl mb-6 transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2">
            {w.icon}
          </div>

          {/* TITLE */}
          <h3
            className="font-bold text-lg mb-3 transition-all duration-500"
            style={{
              color: "#1e1e1e",
            }}
          >
            {w.title}
          </h3>

          {/* DIVIDER */}
          <div
            className="h-[2px] w-8 mb-4 transition-all duration-500 group-hover:w-16"
            style={{ backgroundColor: "#97b64c" }}
          />

          {/* DESC */}
          <p
            className="text-sm leading-relaxed transition-all duration-500 opacity-70 group-hover:opacity-100 group-hover:translate-y-1"
            style={{ color: "#5a6a4a" }}
          >
            {w.desc}
          </p>

          {/* ACTIVE SPOTLIGHT EFFECT */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
            style={{
              boxShadow: "0 40px 100px rgba(151,182,76,0.25)",
              border: "1px solid #97b64c",
            }}
          />

        </div>
      ))}

    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
          SLIDE 3 — THE PROCESS
      ══════════════════════════════════════ */}

 
<section
  ref={processSectionRef}
  id="process"
  className="relative py-14 sm:py-18 lg:py-24 bg-[#f7f9f4] overflow-hidden"
  style={{ minHeight: "100vh" }}           /* keeps section tall enough to trigger lock */
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6">
 
    {/* HEADER */}
    <div className="text-center mb-16">
      <p
        className="text-[11px] tracking-[0.3em] font-bold uppercase mb-3"
        style={{ color: "#97b64c" }}
      >
        THE PROCESS
      </p>
 
      <h2
        style={{
          fontSize: "clamp(2.5rem,5vw,4rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: "#1e1e1e",
        }}
      >
        From Inquiry to Opening Day
      </h2>
 
      {/* SCROLL HINT — fades out once user has started stepping */}
      <p
        className="mt-4 text-sm transition-all duration-500"
        style={{
          color: "#97b64c",
          opacity: activeStep === 0 ? 1 : 0,
          transform: activeStep === 0 ? "translateY(0)" : "translateY(-8px)",
        }}
      >
        ↓ Scroll to walk through each step
      </p>
    </div>
 
    {/* GRID */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {steps.map((s, i) => {
        const isActive = activeStep === i;
        const isPast   = i < activeStep;
 
        return (
          <div
            key={i}
            onClick={() => setActiveStep(i)}
            className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-500"
            style={{
              background: isActive ? "#ffffff" : isPast ? "#f0f7e4" : "#eef5e6",
              border: `1px solid ${isActive ? "#97b64c" : isPast ? "#b8d98a" : "#dce8c8"}`,
              transform: isActive ? "scale(1.03)" : "scale(1)",
              opacity: isPast ? 0.75 : 1,
            }}
          >
 
            {/* BIG NUMBER */}
            <span
              className="absolute top-4 right-5 text-5xl font-black transition-all duration-500"
              style={{
                color: "#62840b",
                opacity: isActive ? 0.2 : 0.08,
                transform: isActive ? "scale(1.2)" : "scale(1)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
 
            {/* CHECKMARK FOR PAST STEPS */}
            {isPast && (
              <span
                className="absolute top-4 left-5 text-base transition-all duration-300"
                style={{ color: "#97b64c" }}
              >
                ✓
              </span>
            )}
 
            {/* ICON */}
            <div
              className="text-2xl mb-3 transition-all duration-500"
              style={{
                transform: isActive ? "translateY(-6px) scale(1.15)" : "none",
              }}
            >
              {s.icon}
            </div>
 
            {/* TITLE */}
            <h3
              className="font-bold mb-2 transition-all duration-300"
              style={{
                color: "#1e1e1e",
                transform: isActive ? "translateX(4px)" : "none",
              }}
            >
              {s.title}
            </h3>
 
            {/* DESC (EXPAND on active) */}
            <div
              className="overflow-hidden transition-all duration-500"
              style={{
                maxHeight: isActive ? "200px" : "0px",
                opacity: isActive ? 1 : 0,
              }}
            >
              <p
                className="text-sm leading-relaxed mt-2"
                style={{ color: "#5a6a4a" }}
              >
                {s.desc}
              </p>
            </div>
 
            {/* HOVER GLOW */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
              style={{
                boxShadow: isActive
                  ? "0 25px 60px rgba(151,182,76,0.35)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
            />
 
            {/* ACTIVE BAR */}
            <div
              className="absolute bottom-0 left-0 h-[3px] rounded-full transition-all duration-500"
              style={{
                width: isActive ? "100%" : "0%",
                background: "#97b64c",
              }}
            />
 
          </div>
        );
      })}
    </div>
 
    {/* PROGRESS DOTS */}
    <div className="flex justify-center gap-2 mt-10">
      {steps.map((_, i) => (
        <button
          key={i}
          onClick={() => setActiveStep(i)}
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: activeStep === i ? "24px" : "8px",
            background: activeStep === i ? "#62840b" : "#c8dfa8",
          }}
        />
      ))}
    </div>
 
    {/* SCROLL COMPLETE HINT */}
    <p
      className="text-center text-sm mt-6 transition-all duration-500"
      style={{
        color: "#97b64c",
        opacity: activeStep === steps.length - 1 ? 1 : 0,
        transform: activeStep === steps.length - 1 ? "translateY(0)" : "translateY(8px)",
      }}
    >
      ↓ Continue scrolling
    </p>
 
  </div>
</section>



      {/* ══════════════════════════════════════
          SLIDE 4 — FRANCHISE INQUIRY
      ══════════════════════════════════════ */}
<section id="inquiry" className="relative py-16 sm:py-20 lg:py-28 bg-[#f7f9f4] overflow-hidden">

{/* Soft background */}
<div className="absolute inset-0 pointer-events-none"
  style={{
    background: "radial-gradient(circle at 10% 20%, rgba(151,182,76,0.08), transparent 60%)"
  }}
/>

<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 z-10">

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
        <span>Step 1 of 2</span>
        <span>50%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-[#e8f0dc]">
        <div className="h-full rounded-full"
          style={{ width: "50%", background: "#97b64c" }} />
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

</div>
</section>

      {/* ══════════════════════════════════════
          SLIDE 5 — FAQ
      ══════════════════════════════════════ */}
      <section data-track-section="Franchise FAQs" className="relative py-28 overflow-hidden" style={{ backgroundColor: "#f5f8ef" }}>
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
          <Slide direction="up" delay={60} className="text-center mb-14">
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
  );
}