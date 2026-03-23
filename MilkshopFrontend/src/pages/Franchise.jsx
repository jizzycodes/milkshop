import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { createFranchiseRequest } from "../services/api"
import { localDatetimeLocalFloor } from "../utils/dateInputConstraints"

// ─── DATA (unchanged) ────────────────────────────────────────────────────────

const packages = [
  {
    id: 1,
    name: "Cart / Mobile",
    emoji: "🛒",
    tag: "Most Affordable",
    tagColor: { bg: "#FEF3C7", color: "#D97706" },
    size: "2–3 sqm",
    popular: false,
    highlight: "Perfect starter for events & pop-ups",
    inclusions: [
      "Brand license (2 years)",
      "Branded mobile cart",
      "Initial product inventory",
      "Staff training (2 days)",
      "Marketing starter kit",
      "Basic support",
    ],
  },
  {
    id: 2,
    name: "Kiosk",
    emoji: "🏪",
    tag: "Entry Level",
    tagColor: { bg: "#ECFDF5", color: "#059669" },
    size: "4–6 sqm",
    popular: false,
    highlight: "Ideal for malls & high-foot-traffic areas",
    inclusions: [
      "Brand license (3 years)",
      "Kiosk structure & equipment",
      "Initial product inventory",
      "Staff training (3 days)",
      "Marketing starter kit",
      "Ongoing support",
    ],
  },
  {
    id: 3,
    name: "In-Line Store",
    emoji: "🏬",
    tag: "Best Value",
    tagColor: { bg: "#F0FDF4", color: "#62840b" },
    size: "15–25 sqm",
    popular: true,
    highlight: "Maximum ROI. Full brand experience.",
    inclusions: [
      "Brand license (5 years)",
      "Full store fit-out & equipment",
      "Initial product inventory",
      "Staff training (5 days)",
      "Grand opening support",
      "Full marketing package",
      "Dedicated account manager",
      "Priority product restocking",
    ],
  },
];

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

const heroStats = [
  { value: "15+",   label: "Active Branches",    icon: "📍", sub: "Nationwide & growing" },
  { value: "3",     label: "Franchise Packages", icon: "📦", sub: "For every budget" },
  { value: "12–18", label: "Months to ROI",      icon: "📈", sub: "Based on branch avg." },
  { value: "100%",  label: "Brand Support",      icon: "🤝", sub: "We grow together" },
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

  useEffect(() => {
    if (window.location.hash !== `#${FRANCHISE_FORM_ID}`) return;
    const el = document.getElementById(FRANCHISE_FORM_ID);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
          SLIDE 1 — HERO
      ══════════════════════════════════════ */}
      <section data-track-section="Franchise Hero" className="relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #f5f8ef 0%, #ffffff 50%, #fffdf5 100%)",
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.22) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 30% 60%, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 60%, black 10%, transparent 70%)",
        }} />
        {/* Large circle accent */}
        <div className="absolute -right-32 -top-32 pointer-events-none" style={{
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(151,182,76,0.08) 0%, transparent 70%)",
        }} />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{
          background: "linear-gradient(to right, transparent, rgba(151,182,76,0.3), transparent)",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 py-28 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* LEFT — Copy */}
            <div className="flex-1 flex flex-col gap-6">
              <Slide direction="left" delay={0}>
                <span className="self-start inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(151,182,76,0.12)", color: "#62840b", border: "1px solid rgba(151,182,76,0.25)" }}>
                  🇹🇼 Franchise Opportunities
                </span>
              </Slide>

              <Slide direction="left" delay={80}>
                <h1 style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#1e1e1e" }}>
                  Own a Milkshop.<br />
                  <span style={{ color: "#97b64c" }}>Build Your Future.</span>
                </h1>
              </Slide>

              <Slide direction="left" delay={160}>
                <p className="text-base leading-relaxed max-w-lg" style={{ color: "#5a6a4a" }}>
                  Join the Philippines' fastest-growing Taiwanese beverage brand. Proven system, full support, real ROI — everything you need to run a business you're proud of.
                </p>
              </Slide>

              <Slide direction="left" delay={220}>
                <ul className="flex flex-col gap-2.5">
                  {["No food experience required", "Recover investment in 12–18 months", "Exclusive territory per franchisee", "Full brand & operations support"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#3a4a2a" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold" style={{ backgroundColor: "#97b64c" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Slide>

              <Slide direction="left" delay={300}>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href="#inquiry" className="font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95" style={{ backgroundColor: "#E8A020", color: "#ffffff", boxShadow: "0 6px 24px rgba(232,160,32,0.3)" }}>
                    Apply Now →
                  </a>
                  <a href="#packages" className="font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200" style={{ border: "1.5px solid #d0e0b0", color: "#62840b", backgroundColor: "transparent" }}>
                    View Packages
                  </a>
                </div>
              </Slide>
            </div>

            {/* RIGHT — Stats grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {heroStats.map((s, i) => (
                <Slide key={s.label} direction="right" delay={i * 70}
                  className="rounded-2xl p-5 flex flex-col gap-2"
                  style={{ backgroundColor: "white", border: "1px solid #e8f0dc", boxShadow: "0 2px 16px rgba(151,182,76,0.08)" }}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-3xl font-black leading-none" style={{ color: "#1e1e1e", fontFamily: "'DM Mono', monospace" }}>{s.value}</span>
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#62840b" }}>{s.label}</span>
                  <span className="text-xs" style={{ color: "#9aaa8a" }}>{s.sub}</span>
                </Slide>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ opacity: 0.4 }}>
          <div className="w-px h-12 relative overflow-hidden" style={{ backgroundColor: "rgba(151,182,76,0.3)" }}>
            <div className="absolute top-0 w-full" style={{ height: "40%", backgroundColor: "#97b64c", animation: "scrollDown 1.8s ease-in-out infinite" }} />
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "#97b64c" }}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 2 — WHY MILKSHOP
      ══════════════════════════════════════ */}
      <section data-track-section="Why Milkshop" className="relative py-28 overflow-hidden bg-white">
        {/* Large watermark text */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none" style={{
          fontSize: "28vw", fontWeight: 900, lineHeight: 1,
          color: "rgba(151,182,76,0.04)", fontFamily: "serif",
        }}>侠</div>

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Why Partner With Us</p>
          </Slide>
          <Slide direction="up" delay={60} className="mb-16">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1e1e1e", lineHeight: 1.05 }}>
              What Makes Milkshop Different
            </h2>
          </Slide>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((w, i) => (
              <Slide key={w.title} direction="up" delay={i * 80}
                className="group rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "#f5f8ef", border: "1px solid #e0ebd0" }}
              >
                <span className="text-4xl">{w.icon}</span>
                <div className="w-8 h-px" style={{ backgroundColor: "#97b64c" }} />
                <h3 className="font-bold text-base" style={{ color: "#1e1e1e" }}>{w.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6a4a" }}>{w.desc}</p>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 3 — PACKAGES
      ══════════════════════════════════════ */}
      <section id="packages" data-track-section="Franchise Packages" className="relative py-28 overflow-hidden" style={{
        background: "linear-gradient(180deg, #f5f8ef 0%, #ffffff 100%)",
      }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(151,182,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Investment Options</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-4">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1e1e1e" }}>
              Choose Your Package
            </h2>
          </Slide>
          <Slide direction="up" delay={100} className="text-center mb-14">
            <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "#5a6a4a" }}>
              Three flexible packages to match your budget and goals. Inquire to receive full investment details.
            </p>
          </Slide>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <Slide key={pkg.id} direction="up" delay={i * 90}
                className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${pkg.popular ? "scale-[1.03] shadow-xl" : "hover:-translate-y-1"}`}
                style={{ border: pkg.popular ? "2px solid #97b64c" : "1px solid #e0ebd0", backgroundColor: "white" }}
              >
                {pkg.popular && (
                  <div className="py-2.5 text-center text-xs font-bold tracking-widest uppercase text-white" style={{ backgroundColor: "#97b64c" }}>
                    ⭐ Most Recommended
                  </div>
                )}

                {/* Card top */}
                <div className="p-7 pb-5 flex flex-col gap-4" style={{ backgroundColor: pkg.popular ? "#f5f8ef" : "#fafaf8" }}>
                  <div className="flex items-start justify-between">
                    <span className="text-5xl">{pkg.emoji}</span>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: pkg.tagColor.bg, color: pkg.tagColor.color }}>
                      {pkg.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black" style={{ color: "#1e1e1e", letterSpacing: "-0.02em" }}>{pkg.name}</h3>
                    <p className="text-sm mt-1 italic" style={{ color: "#5a6a4a" }}>{pkg.highlight}</p>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ backgroundColor: "rgba(151,182,76,0.08)", border: "1px solid rgba(151,182,76,0.15)" }}>
                    <span className="text-xs font-medium" style={{ color: "#5a6a4a" }}>Investment details</span>
                    <a href="#inquiry" className="text-xs font-bold transition-colors" style={{ color: "#97b64c" }}>Inquire →</a>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#9aaa8a" }}>
                    <span>📐</span> {pkg.size} floor area
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px mx-6" style={{ backgroundColor: "#e8f0dc" }} />

                {/* Inclusions */}
                <div className="p-7 pt-5 flex flex-col gap-4 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#97b64c" }}>What's Included</p>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2.5">
                        <span className="font-bold text-sm mt-0.5 shrink-0" style={{ color: "#97b64c" }}>✓</span>
                        <span className="text-sm" style={{ color: "#5a6a4a" }}>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#inquiry"
                    className="mt-4 w-full text-center font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 active:scale-95"
                    style={pkg.popular
                      ? { backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 4px 16px rgba(151,182,76,0.3)" }
                      : { border: "1.5px solid #97b64c", color: "#62840b", backgroundColor: "transparent" }
                    }
                  >
                    Apply for This Package
                  </a>
                </div>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 4 — HOW IT WORKS
      ══════════════════════════════════════ */}
      <section data-track-section="How It Works" className="relative py-28 overflow-hidden bg-white">
        {/* Connecting line */}
        <div className="absolute top-[19rem] left-0 right-0 h-px hidden lg:block" style={{
          background: "linear-gradient(to right, transparent 5%, #d0e0b0 20%, #d0e0b0 80%, transparent 95%)",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>The Process</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-16">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1e1e1e" }}>
              From Inquiry to Opening Day
            </h2>
          </Slide>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <Slide key={s.step} direction="up" delay={i * 70}
                className="relative rounded-2xl p-7 flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: "#f5f8ef", border: "1px solid #e0ebd0" }}
              >
                {/* Step number watermark */}
                <span className="absolute -top-2 -right-1 text-8xl font-black leading-none select-none pointer-events-none" style={{ color: "rgba(151,182,76,0.1)", fontFamily: "'DM Mono', monospace" }}>
                  {s.step}
                </span>
                <span className="text-3xl relative z-10">{s.icon}</span>
                <h3 className="font-bold text-base relative z-10" style={{ color: "#1e1e1e" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed relative z-10" style={{ color: "#5a6a4a" }}>{s.desc}</p>
              </Slide>
            ))}
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

      {/* ══════════════════════════════════════
          SLIDE 6 — INQUIRY FORM
      ══════════════════════════════════════ */}
      <section id="inquiry" data-track-section="Franchise Inquiry" className="relative py-28 overflow-hidden bg-white">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none" style={{
          background: "radial-gradient(circle at top left, rgba(151,182,76,0.08) 0%, transparent 70%)",
        }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none" style={{
          background: "radial-gradient(circle at bottom right, rgba(232,160,32,0.06) 0%, transparent 70%)",
        }} />

        <div className="relative max-w-2xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Take the First Step</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-4">
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#1e1e1e" }}>
              Franchise Inquiry
            </h2>
          </Slide>
          <Slide direction="up" delay={100} className="text-center mb-8">
            <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "#5a6a4a" }}>
              Fill out the form and our franchise team will reach out within <strong>3–5 business days</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {["🔒 Confidential", "📞 We call you", "⚡ Fast response"].map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: "#f5f8ef", border: "1px solid #d0e0b0", color: "#5a6a4a" }}>{t}</span>
              ))}
            </div>
          </Slide>

          {submitted ? (
            <Slide direction="up">
              <div className="rounded-3xl p-12 flex flex-col items-center gap-5 text-center" style={{ backgroundColor: "white", border: "2px solid #97b64c", boxShadow: "0 8px 40px rgba(151,182,76,0.15)" }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: "#e8f0dc", border: "4px solid #b7cd7f" }}>🎉</div>
                <div>
                  <h3 className="text-2xl font-black" style={{ color: "#1e1e1e", letterSpacing: "-0.02em" }}>Inquiry Submitted!</h3>
                  <p className="text-sm mt-2 leading-relaxed max-w-xs mx-auto" style={{ color: "#5a6a4a" }}>
                    Thank you for your interest in Milkshop! Our franchise team will contact you within <strong>3–5 business days</strong>.
                  </p>
                </div>
                <div className="w-full rounded-2xl px-6 py-4 text-sm text-left" style={{ backgroundColor: "#f5f8ef", border: "1px solid #d0e0b0" }}>
                  <p className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: "#1e1e1e" }}>What happens next?</p>
                  <ul className="flex flex-col gap-2">
                    {["We review your inquiry internally", "A franchise team member calls you within 3–5 days", "Initial interview is scheduled at your convenience"].map((step, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#5a6a4a" }}>
                        <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: "#97b64c" }}>{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/" className="font-bold text-sm px-7 py-3 rounded-full transition-all duration-200 active:scale-95" style={{ backgroundColor: "#97b64c", color: "#ffffff" }}>Back to Home</Link>
                  <Link to="/products" className="font-bold text-sm px-7 py-3 rounded-full transition-all duration-200" style={{ border: "1.5px solid #97b64c", color: "#62840b", backgroundColor: "transparent" }}>Explore Our Menu</Link>
                </div>
              </div>
            </Slide>
          ) : (
            <Slide direction="up" delay={140}>
              <div className="rounded-3xl p-8 flex flex-col gap-6" style={{ backgroundColor: "white", border: "1px solid #e0ebd0", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>

                {errorMessage && (
                  <div className="flex items-start gap-3 rounded-2xl px-4 py-4" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                    <span className="text-xl shrink-0">⚠️</span>
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#dc2626" }}>Submission failed</p>
                      <p className="text-sm mt-0.5" style={{ color: "#dc2626" }}>{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required error={fieldErrors.name}>
                    <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Juan dela Cruz" className={`${inputBase} ${fieldErrors.name ? inputErr : inputIdle}`} />
                  </Field>
                  <Field label="Email Address" required error={fieldErrors.email}>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="juan@email.com" className={`${inputBase} ${fieldErrors.email ? inputErr : inputIdle}`} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Contact Number" required error={fieldErrors.contactNumber}>
                    <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="09XX XXX XXXX" className={`${inputBase} ${fieldErrors.contactNumber ? inputErr : inputIdle}`} style={{ fontFamily: "'DM Mono', monospace" }} />
                  </Field>
                  <Field label="Best Contact Date / Time" required error={fieldErrors.bestContactTime}>
                    <input
                      id="bestContactTime"
                      name="bestContactTime"
                      type="datetime-local"
                      min={localDatetimeLocalFloor()}
                      value={formData.bestContactTime}
                      onChange={handleChange}
                      className={`${inputBase} ${fieldErrors.bestContactTime ? inputErr : inputIdle}`}
                    />
                  </Field>
                </div>

                <Field label="Estimated Annual Income" required error={fieldErrors.estimatedAnnualIncome}>
                  <input id="estimatedAnnualIncome" name="estimatedAnnualIncome" value={formData.estimatedAnnualIncome} onChange={handleChange} placeholder="e.g. ₱800,000 – ₱1,200,000" className={`${inputBase} ${fieldErrors.estimatedAnnualIncome ? inputErr : inputIdle}`} />
                </Field>

                <Field label="Proposed Franchise Location" required error={fieldErrors.proposedLocation}>
                  <input id="proposedLocation" name="proposedLocation" value={formData.proposedLocation} onChange={handleChange} placeholder="City, mall or area (e.g. Cebu City, Ayala Center)" className={`${inputBase} ${fieldErrors.proposedLocation ? inputErr : inputIdle}`} />
                </Field>

                <Field label="Preferred Package" required error={fieldErrors.preferredPackage}>
                  <select id="preferredPackage" name="preferredPackage" value={formData.preferredPackage} onChange={handleChange} className={`${inputBase} ${fieldErrors.preferredPackage ? inputErr : inputIdle} cursor-pointer`}>
                    <option value="">Select a package...</option>
                    <option value="cart">Cart / Mobile</option>
                    <option value="kiosk">Kiosk</option>
                    <option value="inline">In-Line Store</option>
                    <option value="unsure">Not sure yet — advise me</option>
                  </select>
                </Field>

                <Field label="Additional Information" required error={fieldErrors.remarks}>
                  <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange} rows={4} placeholder="Tell us about your planned location, your background, or any questions you have..." className={`${inputBase} ${fieldErrors.remarks ? inputErr : inputIdle} resize-none`} />
                </Field>

                <div className="pt-2" style={{ borderTop: "1px solid #e8f0dc" }}>
                  <Field label="Referral (optional)" error={null}>
                    <input name="referral" value={formData.referral} onChange={handleChange} placeholder="Friend, social media, franchise expo, etc." className={`${inputBase} ${inputIdle}`} />
                  </Field>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full font-bold text-base py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ backgroundColor: isSubmitting ? "#a8c26a" : "#97b64c", color: "#ffffff", boxShadow: "0 4px 20px rgba(151,182,76,0.3)", cursor: isSubmitting ? "not-allowed" : "pointer" }}
                >
                  {isSubmitting ? (
                    <><svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</>
                  ) : "Submit Franchise Inquiry →"}
                </button>

                <p className="text-center text-xs" style={{ color: "#9aaa8a" }}>🔒 Your information is kept strictly confidential.</p>
              </div>
            </Slide>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SLIDE 7 — BOTTOM CTA
      ══════════════════════════════════════ */}
      <section data-track-section="Franchise CTA" className="relative py-24 overflow-hidden" style={{ backgroundColor: "#f5f8ef", borderTop: "1px solid #d0e0b0" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(151,182,76,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(151,182,76,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <Slide direction="left">
            <h2 className="font-black" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#1e1e1e", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Ready to own<br />a Milkshop? 🧋
            </h2>
            <p className="text-sm mt-4" style={{ color: "#5a6a4a" }}>
              Own a branch. Join the movement. Build something that lasts.
            </p>
          </Slide>

          <Slide direction="right" delay={100}>
            <div className="flex flex-wrap gap-3">
              <a href="#inquiry" className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 active:scale-95" style={{ backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 6px 24px rgba(151,182,76,0.3)" }}>
                Start Your Inquiry →
              </a>
              <Link to="/locations" className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200" style={{ border: "1.5px solid #97b64c", color: "#62840b", backgroundColor: "transparent" }}>
                Find a Branch
              </Link>
            </div>
          </Slide>
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