import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"

// ─── DATA ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "15+",    label: "Active Branches",  detail: "Across the Philippines" },
  { value: "2015",   label: "Est. in Taiwan",   detail: "Decade-proven formula"  },
  { value: "12–18",  label: "Months to ROI",    detail: "Based on franchisee avg." },
  { value: "₱800K+", label: "Entry Capital",    detail: "Full support included"  },
];

const pillars = [
  {
    tag: "Market Position",
    headline: "First Mover.\nZero Direct\nCompetition.",
    body: "Milkshop owns the Taiwanese Popping Boba category in the Philippines — unchallenged. You're not entering a crowded market. You're defining one.",
    accent: "#97B64C",
    bg: "#F4F8EC",
    border: "#D6E8A8",
  },
  {
    tag: "Returns",
    headline: "ROI in\n12–18 Months.\nConsistently.",
    body: "Not a projection — a pattern. Across 15+ franchisees, capital recovery within 12 to 18 months of opening day. Every single time.",
    accent: "#E8A020",
    bg: "#FDF6E8",
    border: "#F5D98A",
  },
  {
    tag: "Operations",
    headline: "No F&B\nExperience\nRequired.",
    body: "Training, supply chain, hiring playbooks, and ongoing ops support are fully built in. You own the business. We make it run.",
    accent: "#97B64C",
    bg: "#F4F8EC",
    border: "#D6E8A8",
  },
  {
    tag: "Product",
    headline: "Taiwan Recipe.\nCustomers\nReturn Weekly.",
    body: "Real milk, proprietary popping boba, zero shortcuts. A product that builds daily habits — not one-time visits.",
    accent: "#E8A020",
    bg: "#FDF6E8",
    border: "#F5D98A",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    location: "SM Mall of Asia",
    result: "ROI: 13 months",
    quote: "The support from the team is unmatched. The brand sells itself — I just had to show up and run it well.",
    initials: "MS",
    accentColor: "#97B64C",
  },
  {
    name: "Carlo Reyes",
    location: "Cebu City",
    result: "ROI: 14 months",
    quote: "Within 14 months I fully recovered my investment. Consistent product, loyal customers — they come back every single day.",
    initials: "CR",
    accentColor: "#E8A020",
  },
  {
    name: "Jennelyn Cruz",
    location: "BGC Taguig",
    result: "2nd branch incoming",
    quote: "Zero food industry background. Milkshop's program gave me everything I needed. Now I'm opening branch number two.",
    initials: "JC",
    accentColor: "#97B64C",
  },
];

// ─── STAT BAR ─────────────────────────────────────────────────────────────────

function StatBar() {
  return (
    <section className="bg-white border-y border-[#E8E8E0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E8E8E0]">
          {stats.map((s, i) => (
            <div key={i} className="px-8 py-10 flex flex-col gap-1.5 group hover:bg-[#FAFAF5] transition-colors duration-200">
              <span
                className="font-black leading-none tracking-tight"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  color: i % 2 === 0 ? "#97B64C" : "#E8A020",
                }}
              >
                {s.value}
              </span>
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#1E1E1E]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.label}
              </span>
              <span className="text-[#9a9a8a] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {s.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY NOW ──────────────────────────────────────────────────────────────────

function WhySection() {
  return (
    <section className="bg-[#FAFAF7] py-24 lg:py-32 overflow-hidden relative">

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #97B64C18 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 z-10">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#97B64C]" />
              <span
                className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#97B64C]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                The Opportunity
              </span>
            </div>
            <h2
              className="font-black text-[#1E1E1E] leading-[0.93] tracking-tight"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              }}
            >
              Why Milkshop.<br />
              <span style={{ color: "#97B64C" }}>Why Now.</span>
            </h2>
          </div>
          <p
            className="text-[#6b6b5a] text-base max-w-sm leading-relaxed lg:text-right"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Four reasons high-net-worth investors are choosing Milkshop over every other F&B franchise in the market today.
          </p>
        </div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-8 lg:p-10 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
              style={{ backgroundColor: p.bg, borderColor: p.border }}
            >
              {/* Tag */}
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6"
                style={{
                  backgroundColor: p.accent + "20",
                  color: p.accent,
                  border: `1px solid ${p.accent}40`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                {p.tag}
              </span>

              {/* Headline */}
              <h3
                className="font-black text-[#1E1E1E] leading-tight tracking-tight mb-4 whitespace-pre-line"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                }}
              >
                {p.headline}
              </h3>

              {/* Divider */}
              <div className="w-8 h-[2px] rounded-full mb-4" style={{ backgroundColor: p.accent }} />

              {/* Body */}
              <p className="text-[#5a5a4a] text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* Link to franchise */}
        <div className="flex justify-center mt-12">
          <Link
            to="/franchise"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#97B64C] hover:text-[#62840B] transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            See the full investment breakdown
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const go = (i) => {
    setActive(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 5500);
  };

  const tick = () => setActive(p => (p + 1) % testimonials.length);

  useEffect(() => {
    timerRef.current = setInterval(tick, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const t = testimonials[active];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#E8A020]" />
            <span
              className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#E8A020]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              From Our Franchisees
            </span>
            <div className="h-px w-8 bg-[#E8A020]" />
          </div>
          <h2
            className="font-black text-[#1E1E1E] leading-tight tracking-tight mb-3"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
            }}
          >
            Real People.<br />Real Returns.
          </h2>
          <p className="text-[#6b6b5a] text-base max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Entrepreneurs who took the leap — and haven't looked back.
          </p>
        </div>

        {/* Cards row — show all 3 on desktop, active on mobile */}
        <div className="hidden lg:grid grid-cols-3 gap-5 mb-10">
          {testimonials.map((item, i) => (
            <div
              key={i}
              onClick={() => go(i)}
              className="relative rounded-2xl p-8 border cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: i === active ? "#F4F8EC" : "#FAFAF7",
                borderColor: i === active ? "#97B64C" : "#E8E4DC",
                boxShadow: i === active ? "0 8px 32px rgba(151,182,76,0.12)" : "none",
                transform: i === active ? "translateY(-4px)" : "none",
              }}
            >
              {/* Result pill */}
              <div
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6"
                style={{
                  backgroundColor: item.accentColor + "18",
                  color: item.accentColor,
                  border: `1px solid ${item.accentColor}35`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.accentColor }} />
                {item.result}
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                  <span key={si} className="text-[#E8A020] text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-[#1E1E1E] text-sm leading-relaxed mb-6 italic"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                "{item.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0"
                  style={{
                    backgroundColor: item.accentColor + "20",
                    color: item.accentColor,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="font-bold text-[#1E1E1E] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {item.name}
                  </p>
                  <p className="text-[#9a9a8a] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Franchisee · {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: single active card */}
        <div className="lg:hidden mb-8">
          <div
            key={active}
            className="rounded-2xl p-8 border"
            style={{
              backgroundColor: "#F4F8EC",
              borderColor: "#97B64C",
              animation: "fadeUp 0.45s ease forwards",
            }}
          >
            <div
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5"
              style={{
                backgroundColor: t.accentColor + "18",
                color: t.accentColor,
                border: `1px solid ${t.accentColor}35`,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accentColor }} />
              {t.result}
            </div>
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, si) => (
                <span key={si} className="text-[#E8A020] text-sm">★</span>
              ))}
            </div>
            <p className="text-[#1E1E1E] text-base leading-relaxed mb-6 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs"
                style={{ backgroundColor: t.accentColor + "20", color: t.accentColor, fontFamily: "'DM Mono', monospace" }}
              >
                {t.initials}
              </div>
              <div>
                <p className="font-bold text-[#1E1E1E] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.name}</p>
                <p className="text-[#9a9a8a] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Franchisee · {t.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? "32px" : "8px",
                height: "8px",
                backgroundColor: i === active ? "#97B64C" : "#D0E0B0",
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/franchise#inquiry"
            className="group inline-flex items-center gap-3 font-black text-sm px-10 py-4 rounded-full text-white transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#97B64C",
              boxShadow: "0 6px 28px rgba(151,182,76,0.28)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Start Your Franchise Journey
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── SCARCITY STRIP ───────────────────────────────────────────────────────────

function ScarcityStrip() {
  return (
    <div
      className="relative py-5 overflow-hidden border-y border-[#F0D080]"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 80px, #E8A02010 80px, #E8A02010 81px)",
        }}
      />
    
    </div>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ backgroundColor: "#F4F8EC" }}
    >
      {/* Green glow bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(151,182,76,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #97B64C20 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 50% 100%, black 0%, transparent 55%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 100%, black 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-16 z-10 text-center">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#97B64C]" />
          <span
            className="text-[10px] font-bold tracking-[0.28em] uppercase text-[#97B64C]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Limited Territories
          </span>
          <div className="h-px w-8 bg-[#97B64C]" />
        </div>

        {/* Headline */}
        <h2
          className="font-black text-[#1E1E1E] leading-none tracking-tight mb-6"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
          }}
        >
          Your City.<br />
          <span style={{ color: "#97B64C" }}>Your Branch.</span><br />
          Your ROI.
        </h2>

        {/* Sub */}
        <p
          className="text-[#6b6b5a] text-base max-w-md mx-auto leading-relaxed mb-12"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Territories are awarded exclusively. When your area is taken, it's closed permanently. Submit your inquiry — we respond within 24 hours.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/franchise#inquiry"
            className="group inline-flex items-center gap-3 font-black text-base px-12 py-5 rounded-full text-white transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#97B64C",
              boxShadow: "0 10px 40px rgba(151,182,76,0.30)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Reserve My Inquiry Slot
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <Link
            to="/franchise"
            className="font-semibold text-sm text-[#97B64C] hover:text-[#62840B] transition-colors duration-200 underline underline-offset-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View Full Franchise Details
          </Link>
        </div>

        <p className="text-[#b0b09a] text-xs mt-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          No commitment required. Just a conversation.
        </p>
      </div>
    </section>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-white -mt-px">

      {/* 1 — HERO */}
      <Hero />

      {/* 2 — INVESTOR NUMBERS */}
      <StatBar />

      {/* 3 — WHY MILKSHOP */}
      <WhySection />

      {/* 4 — FRANCHISEE TESTIMONIALS */}
      <TestimonialsSection />

      {/* 5 — SCARCITY STRIP */}
      <ScarcityStrip />

      {/* 6 — FINAL CTA */}
      <FinalCTA />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}