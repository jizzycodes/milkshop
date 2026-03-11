import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"
import logo from "../assets/milkshop-logo.png"

// ─── DATA ────────────────────────────────────────────────────────────────────

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
  {
    year: "2015",
    label: "Founded in Taiwan",
    desc: "Milkshop 秘客侠 opens its first store in Taiwan with a singular mission — to redefine what milk tea could be. Real milk. Real flavor. No shortcuts.",
    icon: "🏪",
  },
  {
    year: "2018",
    label: "Popping Boba Born",
    desc: "After 3 years of R&D, Milkshop introduces the Popping Boba series — a first in Taiwanese beverage culture. Each boba bursts with real fruit juice on first bite.",
    icon: "🫧",
  },
  {
    year: "2020",
    label: "Brand Expansion",
    desc: "Milkshop grows beyond its first store, establishing its production facility and standardized supply chain to ensure every cup tastes exactly the same — everywhere.",
    icon: "🏭",
  },
  {
    year: "2022",
    label: "Philippines Launch",
    desc: "Milkshop lands in Manila as the first Taiwanese Popping Boba brand in the Philippines. The response from Filipino milk tea lovers is overwhelming.",
    icon: "🇵🇭",
  },
  {
    year: "2023",
    label: "Franchise Program Opens",
    desc: "The official Milkshop franchise program launches, offering Filipino entrepreneurs three investment tiers to bring the brand to their own communities.",
    icon: "🤝",
  },
  {
    year: "2024",
    label: "15+ Branches Nationwide",
    desc: "From Metro Manila to Mindanao, Milkshop now operates 15 branches across the Philippines — with more territories opening every quarter.",
    icon: "📍",
  },
];

const rawMaterials = [
  {
    icon: "🍵",
    title: "Premium Tea Leaves",
    origin: "Nantou, Taiwan",
    desc: "Hand-selected oolong and green tea leaves sourced directly from the highland tea farms of Nantou County — the heartland of Taiwanese tea.",
  },
  {
    icon: "🥛",
    title: "Fresh Dairy Milk",
    origin: "Certified Local Farms",
    desc: "We never use powder. Every cup is made with fresh, full-cream dairy milk from certified partner farms — richer, creamier, cleaner.",
  },
  {
    icon: "🫧",
    title: "Taiwanese Popping Boba",
    origin: "Proprietary Factory, Taiwan",
    desc: "Our signature boba is produced in our own facility using natural fruit juice fills — no artificial flavoring, no shortcuts.",
  },
  {
    icon: "🍬",
    title: "Black Sugar Syrup",
    origin: "Traditional Recipe, Taiwan",
    desc: "Slow-cooked brown sugar syrup following a traditional Taiwanese formula. The same recipe that created our iconic tiger-stripe milk tea.",
  },
];

const team = [
  { emoji: "👨‍🍳", name: "Chef Lin", role: "Head of R&D" },
  { emoji: "👩‍💼", name: "Maria Santos", role: "PH Operations Lead" },
  { emoji: "🧑‍🎨", name: "Kai Chen", role: "Brand & Design" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function About() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── PAGE HEADER ── */}
      <Reveal as="section" className="bg-[#f5f8ef] border-b border-[#d0e0b0] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12">

          {/* Text */}
          <Reveal as="div" delay={40} className="flex-1 flex flex-col gap-5">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Our Story
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1e1e1e] leading-tight"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Born in Taiwan. <br />
              <span className="text-[#97b64c]">Brewed with Love.</span>
            </h1>
            <p className="text-[#5a5a5a] text-base leading-relaxed max-w-lg"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Milkshop 秘客侠 wasn't built overnight. It was built cup by cup — through years of recipe testing, ingredient sourcing, and an uncompromising belief that milk tea deserved better. From the highlands of Taiwan to the streets of Manila, every sip carries that original obsession.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                to="/products"
                className="bg-[#97b64c] hover:bg-[#62840b] text-white font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200 shadow-md active:scale-95"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
              >
                See Our Menu
              </Link>
              <Link
                to="/franchise#inquiry"
                className="border border-[#97b64c] text-[#97b64c] hover:bg-[#e8f0dc] font-semibold text-sm px-7 py-3 rounded-full transition-all duration-200"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
              >
                Franchise Opportunities
              </Link>
            </div>
          </Reveal>

          {/* Visual */}
          <Reveal as="div" delay={80} className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-[48px] bg-[#b7cd7f] rotate-6 opacity-50" />
              <div className="absolute inset-0 rounded-[48px] bg-[#e8f0dc] -rotate-3" />
              <div className="absolute inset-0 rounded-[48px] bg-white border border-[#d0e0b0] shadow flex flex-col items-center justify-center gap-3">
                <img src={logo} alt="Milkshop logo" className="w-24 h-24 object-contain" />
                <div className="text-center">
                  <p className="font-bold text-[#1e1e1e] text-xl" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    Milkshop
                  </p>
                  <p className="text-[#5a5a5a] text-sm" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    秘客侠 · Est. Taiwan 2015
                  </p>
                </div>
                {/* Badge */}
                <div className="bg-[#e8f0dc] border border-[#b7cd7f] rounded-full px-4 py-1.5 flex items-center gap-2">
                  <span className="text-xs">🇵🇭</span>
                  <span className="text-[#62840b] text-xs font-bold" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    First in the Philippines
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* ── BRAND STORY DEEP DIVE ── */}
      <Reveal as="section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              The Milkshop Identity
            </p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#1e1e1e] leading-tight"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              秘客侠
            </h2>
            <p
              className="text-2xl lg:text-3xl font-bold text-[#97b64c] mt-1"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              The Secret Champion
            </p>
            <p className="text-[#5a5a5a] text-base leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              The name 秘客侠 (Mì Kè Xiá) carries deep meaning — <em>"secret,"</em> <em>"guest,"</em> <em>"champion."</em> It represents a brand that quietly masters its craft before making its move. When Milkshop arrived in the Philippines in 2022, it didn't come with hype. It came with a product that spoke for itself.
            </p>
            <p className="text-[#5a5a5a] text-base leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Every recipe was tested over hundreds of iterations. Every ingredient was traced to its source. Every cup was designed to deliver the same experience — whether you're in a mall in Taipei or a branch in Davao. That consistency is not accidental. It's the result of a decade of quiet obsession.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── VALUES ── */}
      <Reveal as="section" className="py-16 bg-[#f5f8ef] border-y border-[#d0e0b0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              What We Stand For
            </p>
            <h2 className="text-4xl font-bold text-[#1e1e1e]"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, index) => (
              <Reveal
                key={v.title}
                as="div"
                delay={index * 50}
                className="bg-white border border-[#d0e0b0] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#b7cd7f] transition-all duration-300"
              >
                <span className="text-4xl">{v.icon}</span>
                <h3 className="font-bold text-[#1e1e1e] text-base"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  {v.title}
                </h3>
                <p className="text-[#5a5a5a] text-sm leading-relaxed"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  {v.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── COMPANY HISTORY TIMELINE ── */}
      <Reveal as="section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Company History
            </p>
            <h2 className="text-4xl font-bold text-[#1e1e1e]"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              A Decade in the Making
            </h2>
            <p className="text-[#5a5a5a] text-base max-w-lg mx-auto mt-3 leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              From a single store in Taiwan to a growing franchise network in the Philippines — here's how Milkshop became what it is today.
            </p>
          </div>

          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[#d0e0b0] hidden lg:block" />

            {milestones.map((m, i) => (
              <Reveal
                key={m.year}
                as="div"
                delay={i * 80}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10 pb-14 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block bg-[#f5f8ef] border border-[#d0e0b0] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#b7cd7f] transition-all duration-200 max-w-sm ${
                      i % 2 === 0 ? "lg:ml-auto" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? "lg:justify-end" : ""}`}>
                      <span className="text-xl">{m.icon}</span>
                      <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase"
                        style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                        {m.label}
                      </p>
                    </div>
                    <p className="text-[#5a5a5a] text-sm leading-relaxed"
                      style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Year dot */}
                <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-1 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-[#97b64c] flex items-center justify-center shadow-md ring-4 ring-white">
                    <span className="text-white text-xs font-bold"
                      style={{ fontFamily: "'DM Mono', monospace" }}>
                      '{m.year.slice(2)}
                    </span>
                  </div>
                  <span className="text-[#1e1e1e] text-xs font-bold hidden lg:block mt-1"
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

      {/* ── STATS BAR ─ */}
      <Reveal as="section" className="bg-[#97b64c] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "2015", label: "Year Founded" },
            { value: "20+", label: "Menu Items" },
            { value: "15+", label: "PH Branches" },
            { value: "5★", label: "Avg Rating" },
          ].map((s, index) => (
            <Reveal
              key={s.label}
              as="div"
              delay={index * 60}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {s.value}
              </span>
              <span
                className="text-green-200 text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
              >
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ── RAW MATERIALS & SOURCING ── */}
      <Reveal as="section" className="py-20 bg-[#f5f8ef] border-y border-[#d0e0b0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Ingredients & Sourcing
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1e1e1e]"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              Quality Starts at the Source
            </h2>
            <p className="text-[#5a5a5a] text-base max-w-xl mx-auto mt-3 leading-relaxed"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
              We don't cut corners on ingredients. Every element of every cup is traced back to a specific origin — because the quality of a drink starts long before it reaches your hands.
            </p>
          </div>

          {/* Sourcing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {rawMaterials.map((r, index) => (
              <Reveal
                key={r.title}
                as="div"
                delay={index * 60}
                className="bg-white border border-[#d0e0b0] rounded-3xl p-6 flex flex-col gap-3 hover:shadow-md hover:border-[#b7cd7f] transition-all duration-300"
              >
                <span className="text-4xl">{r.icon}</span>
                <div>
                  <h3 className="font-bold text-[#1e1e1e] text-base leading-snug"
                    style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    {r.title}
                  </h3>
                  <span className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#e8f0dc] text-[#62840b]"
                    style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    📍 {r.origin}
                  </span>
                </div>
                <p className="text-[#5a5a5a] text-sm leading-relaxed"
                  style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                  {r.desc}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Sourcing Video Placeholder */}
          <Reveal as="div" delay={60}>
            <div className="text-center mb-8">
              <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                See It Yourself
              </p>
              <h3 className="text-3xl font-bold text-[#1e1e1e]"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                From Farm to Cup
              </h3>
              <p className="text-[#5a5a5a] text-sm max-w-md mx-auto mt-2"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Watch how our raw materials are selected, processed, and transformed into the drinks you love.
              </p>
            </div>

            {/*
              VIDEO PLACEHOLDER
              ─────────────────
              To add video, replace the inner div with:

              Option A — Self-hosted:
              <video
                src="YOUR_VIDEO_URL"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover rounded-3xl"
              />

              Option B — YouTube:
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID"
                className="w-full h-full rounded-3xl"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            */}
            <div className="relative rounded-3xl overflow-hidden bg-[#1e1e1e] aspect-video max-w-4xl mx-auto shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-center px-4">
                  <p className="text-white font-bold text-lg" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    Raw Materials & Sourcing Process
                  </p>
                  <p className="text-white/50 text-sm mt-1" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                    Video coming soon — replace placeholder in About.jsx
                  </p>
                </div>
              </div>
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/70 via-transparent to-transparent pointer-events-none" />
              {/* Corner label */}
              <div className="absolute top-4 left-4 bg-[#97b64c]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                🎬 Sourcing Story
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>

      {/* ── TEAM ─ */}
      <Reveal as="section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p
              className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              The People
            </p>
            <h2
              className="text-4xl font-bold text-[#1e1e1e]"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Behind Every Cup
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {team.map((t, index) => (
              <Reveal
                key={t.name}
                as="div"
                delay={index * 80}
                className="bg-[#f5f8ef] border border-[#d0e0b0] rounded-3xl p-8 flex flex-col items-center gap-3 w-52 hover:shadow-md hover:border-[#b7cd7f] transition-all duration-300"
              >
                <span className="text-5xl">{t.emoji}</span>
                <div className="text-center">
                  <p
                    className="font-bold text-[#1e1e1e] text-sm"
                    style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-[#5a5a5a] text-xs mt-0.5"
                    style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
                  >
                    {t.role}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── BOTTOM CTA ─ */}
      <Reveal as="section" className="bg-[#1e1e1e] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Ready to be part of the story? 🧋
            </h2>
            <p
              className="text-[#b7cd7f] text-sm mt-1"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Own a branch. Join the movement. Build something that lasts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/franchise#inquiry"
              className="bg-[#97b64c] hover:bg-[#62840b] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-md active:scale-95"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Franchise Now →
            </Link>
            <Link
              to="/locations"
              className="border border-[#b7cd7f] text-[#b7cd7f] hover:bg-[#b7cd7f] hover:text-[#1e1e1e] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </Reveal>

    </main>
  );
}