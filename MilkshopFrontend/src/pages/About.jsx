import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/milkshop-logo.png"

// ─── DATA (unchanged) ────────────────────────────────────────────────────────

const values = [
  { icon: "🇹🇼", title: "Taiwanese Heritage",     desc: "Rooted in Taiwan's iconic bubble tea culture — every recipe is authentic and time-tested." },
  { icon: "🫧", title: "Popping Boba Pioneer",    desc: "We're the first Taiwanese brand to bring Popping Boba milk products to the Philippines." },
  { icon: "🥛", title: "Real Milk, Always",       desc: "No powder shortcuts. We use fresh milk in every cup for a creamier, cleaner taste." },
  { icon: "🌿", title: "Natural Ingredients",     desc: "No artificial preservatives. Just clean, real flavors you can taste in every sip." },
];

const milestones = [
  { year: "2015", label: "Founded in Taiwan",      desc: "Milkshop 秘客侠 opens its first store in Taiwan with a singular mission — to redefine what milk tea could be. Real milk. Real flavor. No shortcuts.", icon: "🏪" },
  { year: "2018", label: "Popping Boba Born",      desc: "After 3 years of R&D, Milkshop introduces the Popping Boba series — a first in Taiwanese beverage culture. Each boba bursts with real fruit juice on first bite.", icon: "🫧" },
  { year: "2020", label: "Brand Expansion",        desc: "Milkshop grows beyond its first store, establishing its production facility and standardized supply chain to ensure every cup tastes exactly the same — everywhere.", icon: "🏭" },
  { year: "2022", label: "Philippines Launch",     desc: "Milkshop lands in Manila as the first Taiwanese Popping Boba brand in the Philippines. The response from Filipino milk tea lovers is overwhelming.", icon: "🇵🇭" },
  { year: "2023", label: "Franchise Program Opens",desc: "The official Milkshop franchise program launches, offering Filipino entrepreneurs three investment tiers to bring the brand to their own communities.", icon: "🤝" },
  { year: "2024", label: "15+ Branches Nationwide",desc: "From Metro Manila to Mindanao, Milkshop now operates 15 branches across the Philippines — with more territories opening every quarter.", icon: "📍" },
];

const rawMaterials = [
  { icon: "🍵", title: "Premium Tea Leaves",       origin: "Nantou, Taiwan",              desc: "Hand-selected oolong and green tea leaves sourced directly from the highland tea farms of Nantou County — the heartland of Taiwanese tea." },
  { icon: "🥛", title: "Fresh Dairy Milk",         origin: "Certified Local Farms",       desc: "We never use powder. Every cup is made with fresh, full-cream dairy milk from certified partner farms — richer, creamier, cleaner." },
  { icon: "🫧", title: "Taiwanese Popping Boba",   origin: "Proprietary Factory, Taiwan", desc: "Our signature boba is produced in our own facility using natural fruit juice fills — no artificial flavoring, no shortcuts." },
  { icon: "🍬", title: "Black Sugar Syrup",        origin: "Traditional Recipe, Taiwan",  desc: "Slow-cooked brown sugar syrup following a traditional Taiwanese formula. The same recipe that created our iconic tiger-stripe milk tea." },
];

const team = [
  { emoji: "👨‍🍳", name: "Chef Lin",       role: "Head of R&D"         },
  { emoji: "👩‍💼", name: "Maria Santos", role: "PH Operations Lead"  },
  { emoji: "🧑‍🎨", name: "Kai Chen",     role: "Brand & Design"      },
];

// ─── HOOK: Intersection Observer ─────────────────────────────────────────────

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ─── ANIMATED SECTION WRAPPER ─────────────────────────────────────────────────

function Slide({ children, className = "", style = {}, delay = 0, direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = {
    up:    "translateY(48px)",
    left:  "translateX(-48px)",
    right: "translateX(48px)",
    none:  "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity:    inView ? 1 : 0,
        transform:  inView ? "none" : transforms[direction],
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────

function CountUp({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const num = parseFloat(target);
    const step = num / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <main className="bg-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════════
          SLIDE 1 — HERO: Born in Taiwan
      ══════════════════════════════════════════════ */}
      <section
        data-track-section="About Hero"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.18) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at 60% 50%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 60% 50%, black 20%, transparent 75%)",
        }} />
        {/* Green glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none" style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(151,182,76,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 py-28 z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* TEXT */}
            <div className="flex-1 flex flex-col gap-6">
              <Slide direction="left" delay={0}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-px" style={{ backgroundColor: "#97b64c" }} />
                  <span className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>
                    Our Story
                  </span>
                </div>
              </Slide>

              <Slide direction="left" delay={80}>
                <h1 style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#ffffff" }}>
                  Born in Taiwan.<br />
                  <span style={{ color: "#97b64c" }}>Brewed with Love.</span>
                </h1>
              </Slide>

              <Slide direction="left" delay={160}>
                <p className="text-base leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Milkshop 秘客侠 wasn't built overnight. It was built cup by cup — through years of recipe testing, ingredient sourcing, and an uncompromising belief that milk tea deserved better. From the highlands of Taiwan to the streets of Manila, every sip carries that original obsession.
                </p>
              </Slide>

              <Slide direction="left" delay={240}>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    to="/products"
                    className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 active:scale-95"
                    style={{ backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 6px 24px rgba(151,182,76,0.35)" }}
                  >
                    See Our Menu
                  </Link>
                  <Link
                    to="/franchise#inquiry"
                    className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
                    style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", backgroundColor: "transparent" }}
                  >
                    Franchise Opportunities
                  </Link>
                </div>
              </Slide>
            </div>

            {/* LOGO CARD */}
            <Slide direction="right" delay={200} className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-[48px] rotate-6" style={{ backgroundColor: "rgba(151,182,76,0.18)" }} />
                <div className="absolute inset-0 rounded-[48px] -rotate-3" style={{ backgroundColor: "rgba(151,182,76,0.10)" }} />
                <div className="absolute inset-0 rounded-[48px] flex flex-col items-center justify-center gap-4" style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(151,182,76,0.35)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                }}>
                  <img src={logo} alt="Milkshop logo" className="w-28 h-28 object-contain" />
                  <div className="text-center">
                    <p className="font-bold text-xl" style={{ color: "#1e1e1e" }}>Milkshop</p>
                    <p className="text-sm mt-0.5" style={{ color: "#5a5a5a" }}>秘客侠 · Est. Taiwan 2015</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: "#97b64c", border: "1px solid #62840b" }}>
                    <span className="text-xs text-white">🇵🇭</span>
                    <span className="text-xs font-bold text-white">First in the Philippines</span>
                  </div>
                </div>
              </div>
            </Slide>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 relative overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <div className="absolute top-0 w-full bg-white" style={{ height: "40%", animation: "scrollDown 1.8s ease-in-out infinite" }} />
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white">Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 2 — 秘客侠 IDENTITY
      ══════════════════════════════════════════════ */}
      <section data-track-section="Milkshop Identity" className="relative py-28 overflow-hidden bg-white">
        {/* Large Chinese character watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none" style={{
          fontSize: "32vw", fontWeight: 900, lineHeight: 1,
          color: "rgba(151,182,76,0.04)",
          fontFamily: "serif",
        }}>
          侠
        </div>

        <div className="relative max-w-4xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" delay={0} className="text-center mb-6">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>The Milkshop Identity</p>
          </Slide>

          <Slide direction="up" delay={80} className="text-center mb-4">
            <h2 className="font-black" style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "#1e1e1e", letterSpacing: "-0.04em", lineHeight: 1 }}>
              秘客侠
            </h2>
          </Slide>

          <Slide direction="up" delay={140} className="text-center mb-6">
            <p className="text-2xl lg:text-3xl font-bold" style={{ color: "#97b64c" }}>
              The Secret Champion
            </p>
          </Slide>

          <Slide direction="up" delay={200} className="text-center">
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#5a5a5a" }}>
              The name 秘客侠 (Mì Kè Xiá) carries deep meaning — <em>"secret,"</em> <em>"guest,"</em> <em>"champion."</em> It represents a brand that quietly masters its craft before making its move. When Milkshop arrived in the Philippines in 2022, it didn't come with hype. It came with a product that spoke for itself.
            </p>
          </Slide>

          <Slide direction="up" delay={260} className="text-center mt-6">
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#5a5a5a" }}>
              Every recipe was tested over hundreds of iterations. Every ingredient was traced to its source. Every cup was designed to deliver the same experience — whether you're in a mall in Taipei or a branch in Davao. That consistency is not accidental. It's the result of a decade of quiet obsession.
            </p>
          </Slide>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 3 — CORE VALUES
      ══════════════════════════════════════════════ */}
      <section data-track-section="Core Values" className="relative py-28 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(151,182,76,0.06) 0%, transparent 60%)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" delay={0} className="mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>What We Stand For</p>
          </Slide>
          <Slide direction="up" delay={60} className="mb-16">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Our Core Values
            </h2>
          </Slide>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Slide key={v.title} direction="up" delay={i * 80}
                className="group rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="text-4xl">{v.icon}</span>
                <div className="w-8 h-px" style={{ backgroundColor: "#97b64c" }} />
                <h3 className="font-bold text-white text-base">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{v.desc}</p>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 4 — STATS BAR
      ══════════════════════════════════════════════ */}
      <section data-track-section="Company Stats" className="py-20" style={{ backgroundColor: "#97b64c" }}>
        <div className="max-w-6xl mx-auto px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: "2015", suffix: "", label: "Year Founded" },
            { value: "20",   suffix: "+", label: "Menu Items"  },
            { value: "15",   suffix: "+", label: "PH Branches" },
            { value: "5",    suffix: "★", label: "Avg Rating"  },
          ].map((s, i) => (
            <Slide key={s.label} direction="up" delay={i * 80} className="flex flex-col items-center gap-1">
              <span className="text-4xl lg:text-5xl font-black text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
                <CountUp target={parseInt(s.value)} suffix={s.suffix} />
              </span>
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                {s.label}
              </span>
            </Slide>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 5 — TIMELINE
      ══════════════════════════════════════════════ */}
      <section data-track-section="Company Timeline" className="relative py-28 bg-white overflow-hidden">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block" style={{ backgroundColor: "#e8f0dc" }} />

        <div className="max-w-6xl mx-auto px-8 lg:px-16">
          <Slide direction="up" className="text-center mb-4">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Company History</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-6">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#1e1e1e", letterSpacing: "-0.03em" }}>
              A Decade in the Making
            </h2>
          </Slide>
          <Slide direction="up" delay={100} className="text-center mb-20">
            <p className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: "#5a5a5a" }}>
              From a single store in Taiwan to a growing franchise network in the Philippines — here's how Milkshop became what it is today.
            </p>
          </Slide>

          <div className="flex flex-col gap-0">
            {milestones.map((m, i) => (
              <Slide
                key={m.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 60}
                className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 pb-14 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Card */}
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block rounded-2xl p-6 max-w-sm transition-all duration-300 hover:shadow-lg ${i % 2 === 0 ? "lg:ml-auto" : ""}`}
                    style={{ backgroundColor: "#f5f8ef", border: "1px solid #e0ebd0" }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${i % 2 === 0 ? "lg:justify-end" : ""}`}>
                      <span className="text-xl">{m.icon}</span>
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#97b64c" }}>{m.label}</p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#5a5a5a" }}>{m.desc}</p>
                  </div>
                </div>

                {/* Year dot */}
                <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-1 shrink-0">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white" style={{ backgroundColor: "#97b64c" }}>
                    <span className="text-white text-xs font-black" style={{ fontFamily: "'DM Mono', monospace" }}>'{m.year.slice(2)}</span>
                  </div>
                  <span className="text-xs font-bold hidden lg:block mt-1" style={{ color: "#1e1e1e", fontFamily: "'DM Mono', monospace" }}>{m.year}</span>
                </div>

                <div className="flex-1 hidden lg:block" />
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 6 — RAW MATERIALS
      ══════════════════════════════════════════════ */}
      <section data-track-section="Raw Materials" className="relative py-28 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 80% 20%, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 80% 20%, black 0%, transparent 60%)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>Ingredients & Sourcing</p>
          </Slide>
          <Slide direction="up" delay={60} className="mb-5">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Quality Starts<br />at the Source
            </h2>
          </Slide>
          <Slide direction="up" delay={100} className="mb-16">
            <p className="text-base max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              We don't cut corners on ingredients. Every element of every cup is traced back to a specific origin — because the quality of a drink starts long before it reaches your hands.
            </p>
          </Slide>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
            {rawMaterials.map((r, i) => (
              <Slide key={r.title} direction="up" delay={i * 80}
                className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-4xl">{r.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm leading-snug">{r.title}</h3>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(151,182,76,0.15)", color: "#b7cd7f" }}>
                    📍 {r.origin}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{r.desc}</p>
              </Slide>
            ))}
          </div>

          {/* Video placeholder */}
          <Slide direction="up" delay={100}>
            <div className="text-center mb-8">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "#97b64c" }}>See It Yourself</p>
              <h3 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.03em" }}>From Farm to Cup</h3>
              <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.35)" }}>
                Watch how our raw materials are selected, processed, and transformed into the drinks you love.
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-video max-w-4xl mx-auto" style={{ backgroundColor: "#0d0d0d" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                  backgroundColor: "rgba(151,182,76,0.15)",
                  border: "2px solid rgba(151,182,76,0.3)",
                }}>
                  <svg className="w-8 h-8 ml-1" fill="#97b64c" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Raw Materials & Sourcing Process</p>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Video coming soon — replace placeholder in About.jsx</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(151,182,76,0.85)" }}>
                🎬 Sourcing Story
              </div>
            </div>
          </Slide>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 7 — TEAM
      ══════════════════════════════════════════════ */}
      <section data-track-section="Team" className="relative py-28 bg-white overflow-hidden">
        {/* Large watermark */}
        <div className="absolute bottom-0 left-0 pointer-events-none select-none" style={{
          fontSize: "30vw", fontWeight: 900, lineHeight: 1,
          color: "rgba(151,182,76,0.04)", fontFamily: "serif",
        }}>人</div>

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <Slide direction="up" className="text-center mb-3">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "#97b64c" }}>The People</p>
          </Slide>
          <Slide direction="up" delay={60} className="text-center mb-16">
            <h2 className="font-black" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#1e1e1e", letterSpacing: "-0.03em" }}>
              Behind Every Cup
            </h2>
          </Slide>

          <div className="flex flex-wrap justify-center gap-6">
            {team.map((t, i) => (
              <Slide key={t.name} direction="up" delay={i * 100}
                className="group flex flex-col items-center gap-4 w-52 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ backgroundColor: "#f5f8ef", border: "1px solid #e0ebd0" }}
              >
                <span className="text-5xl">{t.emoji}</span>
                <div className="w-8 h-px" style={{ backgroundColor: "#97b64c" }} />
                <div className="text-center">
                  <p className="font-bold text-sm" style={{ color: "#1e1e1e" }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#5a5a5a" }}>{t.role}</p>
                </div>
              </Slide>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SLIDE 8 — BOTTOM CTA
      ══════════════════════════════════════════════ */}
      <section data-track-section="About CTA" className="relative py-24 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, rgba(151,182,76,0.1) 0%, transparent 70%)",
        }} />

        <div className="relative max-w-6xl mx-auto px-8 lg:px-16 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <Slide direction="left" delay={0}>
              <h2 className="font-black" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Ready to be part<br />of the story? 🧋
              </h2>
              <p className="text-sm mt-4" style={{ color: "#b7cd7f" }}>
                Own a branch. Join the movement. Build something that lasts.
              </p>
            </Slide>

            <Slide direction="right" delay={120}>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/franchise#inquiry"
                  className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: "#97b64c", color: "#ffffff", boxShadow: "0 6px 24px rgba(151,182,76,0.35)" }}
                >
                  Franchise Now →
                </Link>
                <Link
                  to="/locations"
                  className="font-bold text-sm px-8 py-4 rounded-full transition-all duration-200"
                  style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", backgroundColor: "transparent" }}
                >
                  Find a Branch
                </Link>
              </div>
            </Slide>
          </div>
        </div>
      </section>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%);  }
        }
      `}</style>
    </main>
  );
}