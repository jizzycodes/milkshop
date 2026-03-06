import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"
import { createFranchiseRequest } from "../services/api"

const packages = [
  {
    id: 1,
    name: "Kiosk",
    emoji: "🏪",
    price: "₱350,000",
    tag: "Entry Level",
    tagColor: "bg-[#C8DFA8] text-[#3E6610]",
    size: "4–6 sqm",
    popular: false,
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
    id: 2,
    name: "Cart / Mobile",
    emoji: "🛒",
    price: "₱250,000",
    tag: "Most Affordable",
    tagColor: "bg-[#E8A020] text-white",
    size: "2–3 sqm",
    popular: false,
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
    id: 3,
    name: "In-Line Store",
    emoji: "🏬",
    price: "₱650,000",
    tag: "Best Value",
    tagColor: "bg-[#5A9216] text-white",
    size: "15–25 sqm",
    popular: true,
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
  { step: "01", title: "Submit Inquiry", desc: "Fill out our franchise inquiry form. Our team will review your application within 3–5 business days." },
  { step: "02", title: "Initial Interview", desc: "We'll set up a call or meeting to discuss your goals, location, and which package fits you best." },
  { step: "03", title: "Site Validation", desc: "Our team assesses your proposed location to ensure it meets Milkshop's foot traffic and visibility standards." },
  { step: "04", title: "Sign Agreement", desc: "Once approved, we finalize the franchise agreement and you pay the franchise fee to lock in your slot." },
  { step: "05", title: "Setup & Training", desc: "Store build-out begins. Your team undergoes official Milkshop training — operations, drinks, and service." },
  { step: "06", title: "Grand Opening 🎉", desc: "Launch day! Our team supports you on-site. Start serving Milkshop to your community." },
];

const faqs = [
  { q: "Do I need food industry experience?", a: "No prior experience is required. Our comprehensive training program covers everything you need to operate a Milkshop branch." },
  { q: "How long is the franchise term?", a: "Terms vary by package — 2 years for Cart, 3 years for Kiosk, and 5 years for In-Line Store. All are renewable." },
  { q: "Is the location exclusive?", a: "Yes. Once your territory is approved, no other Milkshop franchise will open within the agreed exclusivity radius." },
  { q: "What is the expected ROI period?", a: "Based on current branch performance, franchisees typically recover their investment within 12–18 months depending on location and volume." },
  { q: "Does Milkshop provide ongoing supply?", a: "Yes. All ingredients, cups, and branded materials are supplied directly by Milkshop PH to ensure quality consistency." },
];

export default function Franchise() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    bestContactTime: "",
    estimatedAnnualIncome: "",
    proposedLocation: "",
    preferredPackage: "",
    remarks: "",
    referral: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createFranchiseRequest(formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        bestContactTime: "",
        estimatedAnnualIncome: "",
        proposedLocation: "",
        preferredPackage: "",
        remarks: "",
        referral: "",
      });
    } catch (err) {
      const message = err?.message || "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">

      {/* ── PAGE HEADER ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-b border-[#DDE8CF] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col gap-5">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Franchise Opportunities
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1A2410] leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Own a Milkshop. <br />
              <span className="text-[#5A9216]">Build Your Future.</span>
            </h1>
            <p className="text-[#5A6B4A] text-base leading-relaxed max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join the fastest-growing Taiwanese beverage brand in the Philippines. Low investment, proven system, full support — everything you need to succeed.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href="#inquiry"
                className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-md active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Apply Now
              </a>
              <a
                href="#packages"
                className="border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6] font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View Packages
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { value: "15+", label: "Active Branches", icon: "📍" },
              { value: "3", label: "Franchise Packages", icon: "📦" },
              { value: "12–18", label: "Months ROI", icon: "📈" },
              { value: "100%", label: "Brand Support", icon: "🤝" },
            ].map((s, index) => (
              <div key={s.label}
                className={`bg-white border border-[#DDE8CF] rounded-3xl p-5 flex flex-col gap-2 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-200`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="text-3xl font-bold text-[#1A2410]"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.value}
                </span>
                <span className="text-xs text-[#5A6B4A]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── PACKAGES ── */}
      <Reveal as="section" id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Investment Options
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Choose Your Package
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Reveal
                key={pkg.id}
                as="div"
                delay={index * 80}
                className={`relative flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  pkg.popular
                    ? "border-[#5A9216] shadow-lg scale-[1.02]"
                    : "border-[#DDE8CF] hover:border-[#C8DFA8]"
                }`}
              >
                {pkg.popular && (
                  <div className="bg-[#5A9216] text-white text-xs font-bold text-center py-2 tracking-widest uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ⭐ Most Recommended
                  </div>
                )}

                <div className="bg-[#F7F9F4] p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{pkg.emoji}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${pkg.tagColor}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {pkg.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2410]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {pkg.name}
                  </h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-[#5A9216]"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {pkg.price}
                    </span>
                    <span className="text-[#5A6B4A] text-xs pb-1"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      franchise fee
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5A6B4A]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span>📐</span> {pkg.size} floor area
                  </div>
                </div>

                <div className="bg-white p-6 flex flex-col gap-4 flex-1">
                  <p className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Package Inclusions
                  </p>
                  <ul className="flex flex-col gap-2 flex-1">
                    {pkg.inclusions.map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <span className="text-[#5A9216] font-bold text-sm mt-0.5">✓</span>
                        <span className="text-[#5A6B4A] text-sm"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {inc}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#inquiry"
                    className={`mt-2 w-full text-center font-semibold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95 ${
                      pkg.popular
                        ? "bg-[#5A9216] hover:bg-[#3E6610] text-white"
                        : "border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
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
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((s, index) => (
              <Reveal
                key={s.step}
                as="div"
                delay={index * 70}
                className="bg-white border border-[#DDE8CF] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-300"
              >
                <span className="text-3xl font-bold text-[#EEF5E6] leading-none select-none"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.step}
                </span>
                <h3 className="font-bold text-[#1A2410] text-base"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s.title}
                </h3>
                <p className="text-[#5A6B4A] text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
              Got Questions?
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              FAQs
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i}
                className="border border-[#DDE8CF] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#C8DFA8]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 bg-[#F7F9F4] hover:bg-[#EEF5E6] transition-colors duration-200"
                >
                  <span className="font-semibold text-[#1A2410] text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {faq.q}
                  </span>
                  <span className={`text-[#5A9216] text-lg font-bold shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 bg-white border-t border-[#DDE8CF]">
                    <p className="text-[#5A6B4A] text-sm leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
              Let's Talk
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Franchise Inquiry
            </h2>
            <p className="text-[#5A6B4A] text-sm mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Fill out the form and our franchise team will reach out within 3–5 business days.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#EEF5E6] border border-[#C8DFA8] rounded-3xl p-10 flex flex-col items-center gap-4 text-center">
              <span className="text-6xl">🎉</span>
              <h3 className="text-2xl font-bold text-[#1A2410]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Inquiry Submitted!
              </h3>
              <p className="text-[#5A6B4A] text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Thank you! Our team will contact you within 3–5 business days.
              </p>
              <Link to="/"
                className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 mt-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#DDE8CF] rounded-3xl p-8 flex flex-col gap-5 shadow-sm">
              {errorMessage && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-1">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan dela Cruz"
                    className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@email.com"
                    className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Contact Number *
                  </label>
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="09XX XXX XXXX"
                    className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Best Contact Date/Time *
                  </label>
                  <input
                    name="bestContactTime"
                    type="datetime-local"
                    value={formData.bestContactTime}
                    onChange={handleChange}
                    placeholder="Select date and time"
                    className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Estimated Annual Income *
                </label>
                <input
                  name="estimatedAnnualIncome"
                  value={formData.estimatedAnnualIncome}
                  onChange={handleChange}
                  placeholder="e.g. ₱800,000 – ₱1,200,000"
                  className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Proposed Franchise Location *
                </label>
                <input
                  name="proposedLocation"
                  value={formData.proposedLocation}
                  onChange={handleChange}
                  placeholder="City, mall or area (e.g. Cebu City, Ayala Center)"
                  className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Preferred Package *
                </label>
                <select
                  name="preferredPackage"
                  value={formData.preferredPackage}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all bg-white"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <option value="">Select a package...</option>
                  <option value="cart">Cart / Mobile — ₱250,000</option>
                  <option value="kiosk">Kiosk — ₱350,000</option>
                  <option value="inline">In-Line Store — ₱650,000</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Remarks *
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your planned location, your background, or any questions..."
                  className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all resize-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1A2410] uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Referral
                </label>
                <input
                  name="referral"
                  value={formData.referral}
                  onChange={handleChange}
                  placeholder="Friend, social media, event, etc."
                  className="px-4 py-3 rounded-xl border border-[#DDE8CF] text-sm text-[#1A2410] placeholder-[#5A6B4A] focus:outline-none focus:border-[#5A9216] focus:ring-2 focus:ring-[#EEF5E6] transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#5A9216] hover:bg-[#3E6610] disabled:bg-[#9BBF7D] disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Franchise Inquiry →"}
              </button>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}