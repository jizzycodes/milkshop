import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"
import { createFranchiseRequest } from "../services/api"

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES DATA
// ⚠️  Replace this array with your real package data when ready.
// Price is intentionally hidden — visitors must inquire.
// Shape: { id, name, emoji, tag, tagColor, size, popular, highlight, inclusions[] }
// ─────────────────────────────────────────────────────────────────────────────
const packages = [
  {
    id: 1,
    name: "Cart / Mobile",
    emoji: "🛒",
    tag: "Most Affordable",
    tagColor: "bg-[#E8A020] text-white",
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
    tagColor: "bg-[#C8DFA8] text-[#3E6610]",
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
    tagColor: "bg-[#5A9216] text-white",
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
  {
    q: "Do I need food industry experience?",
    a: "None required. Our end-to-end training program covers everything — operations, drink preparation, inventory, and customer service. We've trained first-timers who are now running multiple branches.",
  },
  {
    q: "How long is the franchise term?",
    a: "Terms vary by package — 2 years for Cart, 3 years for Kiosk, and 5 years for In-Line Store. All terms are renewable upon mutual assessment.",
  },
  {
    q: "Is my territory exclusive?",
    a: "Yes. Once your location is approved, no other Milkshop franchise will open within the agreed exclusivity radius — protecting your investment from day one.",
  },
  {
    q: "What is the expected ROI period?",
    a: "Based on current branch performance, franchisees typically recover their investment within 12–18 months — depending on location foot traffic and daily volume.",
  },
  {
    q: "Does Milkshop supply the ingredients?",
    a: "Yes. All tea, milk, boba, cups, and branded materials are supplied directly by Milkshop PH — so every cup you serve meets our quality standard.",
  },
  {
    q: "How do I get started?",
    a: "Simply fill out the Franchise Inquiry form on this page. Our team will reach out within 3–5 business days to schedule your initial interview.",
  },
];

// ─── REUSABLE FIELD WRAPPER ───────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-bold text-[#1A2410] uppercase tracking-widest flex items-center gap-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
        {required && <span className="text-[#5A9216] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

const inputBase  = "w-full px-4 py-3 rounded-xl border text-sm text-[#1A2410] placeholder-[#9BA89A] focus:outline-none transition-all duration-200 bg-white";
const inputIdle  = "border-[#DDE8CF] focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6]";
const inputErr   = "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Franchise() {
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "", email: "", contactNumber: "", bestContactTime: "",
    estimatedAnnualIncome: "", proposedLocation: "", preferredPackage: "",
    remarks: "", referral: "",
  });
  const [fieldErrors, setFieldErrors]   = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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
      setFormData({
        name: "", email: "", contactNumber: "", bestContactTime: "",
        estimatedAnnualIncome: "", proposedLocation: "", preferredPackage: "",
        remarks: "", referral: "",
      });
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <Reveal as="section" className="bg-[#1A2410] py-24 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#5A9216]/10 pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-[#E8A020]/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-14 relative z-10">

          {/* Copy */}
          <div className="flex-1 flex flex-col gap-6">
            <span className="self-start bg-[#5A9216]/20 text-[#C8DFA8] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              🇹🇼 Franchise Opportunities
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Own a Milkshop.<br />
              <span className="text-[#5A9216]">Build Your Future.</span>
            </h1>
            <p className="text-[#C8DFA8] text-base leading-relaxed max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join the Philippines' fastest-growing Taiwanese beverage brand. Proven system, full support, real ROI — everything you need to run a business you're proud of.
            </p>
            <ul className="flex flex-col gap-2.5 mt-1">
              {[
                "No food experience required",
                "Recover investment in 12–18 months",
                "Exclusive territory per franchisee",
                "Full brand & operations support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[#C8DFA8] text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="w-5 h-5 rounded-full bg-[#5A9216] flex items-center justify-center shrink-0 text-white text-[10px] font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 mt-2">
              <a href="#inquiry"
                className="bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Apply Now →
              </a>
              <a href="#packages"
                className="border border-[#5A9216] text-[#C8DFA8] hover:bg-[#5A9216]/20 font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                View Packages
              </a>
            </div>
          </div>

          {/* Investor stats */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            {[
              { value: "15+",   label: "Active Branches",    icon: "📍", sub: "Nationwide & growing" },
              { value: "3",     label: "Franchise Packages", icon: "📦", sub: "For every budget" },
              { value: "12–18", label: "Months to ROI",      icon: "📈", sub: "Based on branch avg." },
              { value: "100%",  label: "Brand Support",      icon: "🤝", sub: "We grow together" },
            ].map((s, i) => (
              <Reveal key={s.label} as="div" delay={i * 60}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-2 hover:bg-white/10 transition-all duration-200">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-3xl font-bold text-white leading-none"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.value}
                </span>
                <span className="text-[#C8DFA8] text-xs font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </span>
                <span className="text-[#5A6B4A] text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.sub}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── WHY MILKSHOP ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-y border-[#DDE8CF] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Partner With Us
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              What Makes Milkshop Different
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🇹🇼", title: "Authentic Taiwan Brand",  desc: "Not a local copycat. Milkshop is the real thing — born in Taiwan with a decade of proven recipes and systems." },
              { icon: "🫧",  title: "Unique Product",           desc: "The only brand in PH offering Taiwanese Popping Boba milk products. No direct competition in this niche." },
              { icon: "📦",  title: "Turnkey System",           desc: "Equipment, training, supply chain, marketing — all provided. You run the business, we back you up completely." },
              { icon: "📈",  title: "Proven ROI",               desc: "Current franchisees recover investment in 12–18 months. Our model is built for profitability, not just presence." },
            ].map((w, i) => (
              <Reveal key={w.title} as="div" delay={i * 60}
                className="bg-white border border-[#DDE8CF] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-300">
                <span className="text-4xl">{w.icon}</span>
                <h3 className="font-bold text-[#1A2410] text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>{w.title}</h3>
                <p className="text-[#5A6B4A] text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{w.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── PACKAGES ── */}
      <Reveal as="section" id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-4">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Investment Options
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Choose Your Package
            </h2>
            <p className="text-[#5A6B4A] text-sm max-w-md mx-auto mt-3 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Three flexible packages to match your budget and goals. Inquire to receive full investment details.
            </p>
          </div>

          {/* ⚠️ Replace `packages` array at the top of this file with your real data. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {packages.map((pkg, index) => (
              <Reveal key={pkg.id} as="div" delay={index * 80}
                className={`relative flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  pkg.popular ? "border-[#5A9216] shadow-lg scale-[1.02]" : "border-[#DDE8CF] hover:border-[#C8DFA8]"
                }`}>

                {pkg.popular && (
                  <div className="bg-[#5A9216] text-white text-xs font-bold text-center py-2.5 tracking-widest uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ⭐ Most Recommended
                  </div>
                )}

                <div className="bg-[#F7F9F4] p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-5xl">{pkg.emoji}</span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${pkg.tagColor}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {pkg.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-[#5A6B4A] text-sm italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {pkg.highlight}
                  </p>
                  {/* Investment CTA — no price shown */}
                  <div className="bg-white border border-[#DDE8CF] rounded-xl px-4 py-3 flex items-center justify-between mt-1">
                    <span className="text-xs text-[#5A6B4A] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Investment details
                    </span>
                    <a href="#inquiry" className="text-xs font-bold text-[#5A9216] hover:text-[#3E6610] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Inquire →
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5A6B4A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span>📐</span> {pkg.size} floor area
                  </div>
                </div>

                <div className="bg-white p-6 flex flex-col gap-4 flex-1">
                  <p className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    What's Included
                  </p>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <span className="text-[#5A9216] font-bold text-sm mt-0.5 shrink-0">✓</span>
                        <span className="text-[#5A6B4A] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{inc}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#inquiry"
                    className={`mt-3 w-full text-center font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 active:scale-95 ${
                      pkg.popular
                        ? "bg-[#5A9216] hover:bg-[#3E6610] text-white shadow-md"
                        : "border-2 border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Apply for This Package
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── HOW IT WORKS ── */}
      <Reveal as="section" className="py-20 bg-[#F7F9F4] border-y border-[#DDE8CF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Process
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              From Inquiry to Opening Day
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((s, index) => (
              <Reveal key={s.step} as="div" delay={index * 70}
                className="bg-white border border-[#DDE8CF] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-300 relative overflow-hidden">
                <span className="absolute -top-3 -right-1 text-8xl font-bold text-[#F7F9F4] leading-none select-none pointer-events-none"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.step}
                </span>
                <span className="text-3xl relative z-10">{s.icon}</span>
                <h3 className="font-bold text-[#1A2410] text-base relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.title}
                </h3>
                <p className="text-[#5A6B4A] text-sm leading-relaxed relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Common Questions
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>FAQs</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  openFaq === i ? "border-[#5A9216] shadow-sm" : "border-[#DDE8CF] hover:border-[#C8DFA8]"
                }`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left gap-4 transition-colors duration-200 ${
                    openFaq === i ? "bg-[#EEF5E6]" : "bg-[#F7F9F4] hover:bg-[#EEF5E6]"
                  }`}>
                  <span className="font-semibold text-[#1A2410] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {faq.q}
                  </span>
                  <span className={`text-[#5A9216] text-xl font-bold shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 bg-white border-t border-[#DDE8CF]">
                    <p className="text-[#5A6B4A] text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="inquiry" className="py-20 bg-[#F7F9F4] border-t border-[#DDE8CF]">
        <div className="max-w-2xl mx-auto px-6 lg:px-10">

          <div className="text-center mb-10">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Take the First Step
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Franchise Inquiry
            </h2>
            <p className="text-[#5A6B4A] text-sm mt-3 leading-relaxed max-w-sm mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Fill out the form and our franchise team will reach out within <strong>3–5 business days</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {["🔒 Confidential", "📞 We call you", "⚡ Fast response"].map((t) => (
                <span key={t} className="text-xs text-[#5A6B4A] bg-white border border-[#DDE8CF] px-3 py-1.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── SUCCESS ── */}
          {submitted ? (
            <Reveal as="div"
              className="bg-white border-2 border-[#5A9216] rounded-3xl p-12 flex flex-col items-center gap-5 text-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-[#EEF5E6] border-4 border-[#C8DFA8] flex items-center justify-center text-4xl">
                🎉
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Inquiry Submitted!
                </h3>
                <p className="text-[#5A6B4A] text-sm mt-2 leading-relaxed max-w-xs mx-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Thank you for your interest in Milkshop! Our franchise team will contact you within <strong>3–5 business days</strong>.
                </p>
              </div>
              <div className="bg-[#F7F9F4] border border-[#DDE8CF] rounded-2xl px-6 py-4 text-sm text-[#5A6B4A] text-left w-full"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <p className="font-bold text-[#1A2410] mb-3 text-xs uppercase tracking-widest">What happens next?</p>
                <ul className="flex flex-col gap-2">
                  {[
                    "We review your inquiry internally",
                    "A franchise team member calls you within 3–5 days",
                    "Initial interview is scheduled at your convenience",
                  ].map((step, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#5A9216] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                <Link to="/"
                  className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 active:scale-95"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Back to Home
                </Link>
                <Link to="/products"
                  className="border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6] font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Explore Our Menu
                </Link>
              </div>
            </Reveal>

          ) : (

            // ── FORM ──
            <div className="bg-white border border-[#DDE8CF] rounded-3xl p-8 flex flex-col gap-6 shadow-sm">

              {/* API error banner */}
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-4">
                  <span className="text-xl shrink-0">⚠️</span>
                  <div>
                    <p className="text-red-700 font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Submission failed
                    </p>
                    <p className="text-red-600 text-sm mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required error={fieldErrors.name}>
                  <input id="name" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Juan dela Cruz"
                    className={`${inputBase} ${fieldErrors.name ? inputErr : inputIdle}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </Field>
                <Field label="Email Address" required error={fieldErrors.email}>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="juan@email.com"
                    className={`${inputBase} ${fieldErrors.email ? inputErr : inputIdle}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </Field>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Number" required error={fieldErrors.contactNumber}>
                  <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                    placeholder="09XX XXX XXXX"
                    className={`${inputBase} ${fieldErrors.contactNumber ? inputErr : inputIdle}`}
                    style={{ fontFamily: "'DM Mono', monospace" }} />
                </Field>
                <Field label="Best Contact Date / Time" required error={fieldErrors.bestContactTime}>
                  <input id="bestContactTime" name="bestContactTime" type="datetime-local"
                    value={formData.bestContactTime} onChange={handleChange}
                    className={`${inputBase} ${fieldErrors.bestContactTime ? inputErr : inputIdle}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </Field>
              </div>

              {/* Estimated Income */}
              <Field label="Estimated Annual Income" required error={fieldErrors.estimatedAnnualIncome}>
                <input id="estimatedAnnualIncome" name="estimatedAnnualIncome"
                  value={formData.estimatedAnnualIncome} onChange={handleChange}
                  placeholder="e.g. ₱800,000 – ₱1,200,000"
                  className={`${inputBase} ${fieldErrors.estimatedAnnualIncome ? inputErr : inputIdle}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </Field>

              {/* Location */}
              <Field label="Proposed Franchise Location" required error={fieldErrors.proposedLocation}>
                <input id="proposedLocation" name="proposedLocation"
                  value={formData.proposedLocation} onChange={handleChange}
                  placeholder="City, mall or area (e.g. Cebu City, Ayala Center)"
                  className={`${inputBase} ${fieldErrors.proposedLocation ? inputErr : inputIdle}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </Field>

              {/* Package */}
              <Field label="Preferred Package" required error={fieldErrors.preferredPackage}>
                <select id="preferredPackage" name="preferredPackage"
                  value={formData.preferredPackage} onChange={handleChange}
                  className={`${inputBase} ${fieldErrors.preferredPackage ? inputErr : inputIdle} cursor-pointer`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <option value="">Select a package...</option>
                  <option value="cart">Cart / Mobile</option>
                  <option value="kiosk">Kiosk</option>
                  <option value="inline">In-Line Store</option>
                  <option value="unsure">Not sure yet — advise me</option>
                </select>
              </Field>

              {/* Remarks */}
              <Field label="Remarks" required error={fieldErrors.remarks}>
                <textarea id="remarks" name="remarks" value={formData.remarks} onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your planned location, your background, or any questions you have..."
                  className={`${inputBase} ${fieldErrors.remarks ? inputErr : inputIdle} resize-none`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }} />
              </Field>

              {/* Referral — optional */}
              <div className="border-t border-[#DDE8CF] pt-4">
                <Field label="Referral" error={null}>
                  <input name="referral" value={formData.referral} onChange={handleChange}
                    placeholder="Friend, social media, franchise expo, etc."
                    className={`${inputBase} ${inputIdle}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </Field>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#5A9216] hover:bg-[#3E6610] disabled:bg-[#9BBF7D] disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Franchise Inquiry →"
                )}  
              </button>

              <p className="text-center text-xs text-[#5A6B4A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                🔒 Your information is kept strictly confidential.
              </p>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}