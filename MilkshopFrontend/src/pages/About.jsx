import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"
import logo from "../assets/milkshop-logo.png"

const values = [
  {
    icon: "🇹🇼",
    title: "Taiwanese Heritage",
    desc: "Rooted in Taiwan's iconic bubble tea culture — every recipe is authentic and time-tested.",
  },
  {
    icon: "🫧",
    title: "Popping Boba Pioneer",
    desc: "We're the first Taiwanese brand to bring Popping Boba milk products to the Philippines.",
  },
  {
    icon: "🥛",
    title: "Real Milk, Always",
    desc: "No powder shortcuts. We use fresh milk in every cup for a creamier, cleaner taste.",
  },
  {
    icon: "🌿",
    title: "Natural Ingredients",
    desc: "No artificial preservatives. Just clean, real flavors you can taste in every sip.",
  },
];

const milestones = [
  { year: "2015", label: "Founded in Taiwan", desc: "Milkshop 秘客侠 opens its first store in Taiwan with the mission to redefine milk tea." },
  { year: "2018", label: "Popping Boba Born", desc: "Introduced the signature Popping Boba series — a first in Taiwanese beverage culture." },
  { year: "2022", label: "Arrived in PH", desc: "Milkshop lands in the Philippines, bringing authentic Taiwanese flavors to Manila." },
  { year: "2024", label: "Growing Nationwide", desc: "Expanding across multiple cities nationwide." },
];

const team = [
  { emoji: "👨‍🍳", name: "Chef Lin", role: "Head of R&D" },
  { emoji: "👩‍💼", name: "Maria Santos", role: "PH Operations Lead" },
  { emoji: "🧑‍🎨", name: "Kai Chen", role: "Brand & Design" },
];

export default function About() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── PAGE HEADER ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-b border-[#DDE8CF] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12">

          {/* Text */}
          <Reveal as="div" delay={40} className="flex-1 flex flex-col gap-5">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Our Story
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1A2410] leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Born in Taiwan. <br />
              <span className="text-[#5A9216]">Brewed with Love.</span>
            </h1>
            <p className="text-[#5A6B4A] text-base leading-relaxed max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Milkshop 秘客侠 started with a simple dream — to craft the most honest, flavorful, and joyful milk tea experience. From the streets of Taiwan to the heart of Manila, every cup carries that original passion.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to="/products"
                className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-md active:scale-95"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                See Our Menu
              </Link>
              <Link
                to="/franchise"
                className="border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6] font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Franchise Opportunities
              </Link>
            </div>
          </Reveal>

          {/* Visual */}
          <Reveal as="div" delay={80} className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-[48px] bg-[#C8DFA8] rotate-6 opacity-50" />
              <div className="absolute inset-0 rounded-[48px] bg-[#EEF5E6] -rotate-3" />
              <div className="absolute inset-0 rounded-[48px] bg-white border border-[#DDE8CF] shadow flex flex-col items-center justify-center gap-3">
                <img src={logo} alt="Milkshop logo" className="w-24 h-24 object-contain" />
                <div className="text-center">
                  <p className="font-bold text-[#1A2410] text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Milkshop
                  </p>
                  <p className="text-[#5A6B4A] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    秘客侠 · Est. Taiwan
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* ── VALUES ── */}
      <Reveal as="section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              What We Stand For
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, index) => (
              <Reveal
                key={v.title}
                as="div"
                delay={index * 50}
                className="bg-[#F7F9F4] border border-[#DDE8CF] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-300"
              >
                <span className="text-4xl">{v.icon}</span>
                <h3 className="font-bold text-[#1A2410] text-base"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {v.title}
                </h3>
                <p className="text-[#5A6B4A] text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {v.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── TIMELINE ── */}
      <Reveal as="section" className="py-20 bg-[#F7F9F4] border-y border-[#DDE8CF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Our Journey
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              How We Got Here
            </h2>
          </div>

          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[#DDE8CF] hidden lg:block" />

            {milestones.map((m, i) => (
              <Reveal
                key={m.year}
                as="div"
                delay={i * 80}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10 pb-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block bg-white border border-[#DDE8CF] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                      i % 2 === 0 ? "lg:ml-auto" : ""
                    }`}
                  >
                    <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-1"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {m.label}
                    </p>
                    <p className="text-[#5A6B4A] text-sm leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Year dot */}
                <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#5A9216] flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      {m.year.slice(2)}
                    </span>
                  </div>
                  <span className="text-[#1A2410] text-xs font-bold hidden lg:block"
                    style={{ fontFamily: "'DM Mono', monospace" }}>
                    {m.year}
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden lg:block" />
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── STATS BAR ── */}
      <section className="bg-[#5A9216] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "2015", label: "Year Founded" },
            { value: "20+", label: "Flavors" },
            { value: "10+", label: "PH Branches" },
            { value: "5★", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}>
                {s.value}
              </span>
              <span className="text-green-200 text-xs tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The People
            </p>
            <h2 className="text-4xl font-bold text-[#1A2410]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Behind Every Cup
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((t) => (
              <div
                key={t.name}
                className="bg-[#F7F9F4] border border-[#DDE8CF] rounded-3xl p-8 flex flex-col items-center gap-3 w-52 hover:shadow-md hover:border-[#C8DFA8] transition-all duration-300"
              >
                <span className="text-5xl">{t.emoji}</span>
                <div className="text-center">
                  <p className="font-bold text-[#1A2410] text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t.name}
                  </p>
                  <p className="text-[#5A6B4A] text-xs mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#1A2410] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Ready to taste the story? 🧋
            </h2>
            <p className="text-[#C8DFA8] text-sm mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Visit us at a branch near you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/locations"
              className="border border-[#C8DFA8] text-[#C8DFA8] hover:bg-[#C8DFA8] hover:text-[#1A2410] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}