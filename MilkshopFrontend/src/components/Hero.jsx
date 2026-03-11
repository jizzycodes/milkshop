import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── SLIDES CONFIG ─────────────────────────────────────────────────────────
// Replace image paths with your actual assets
const SLIDES = [
  {
    id: 0,
    image: "/hero-bg-1.png", // 🔁 Replace with your image
    accent: "#97b64c",
    eyebrow: "Est. Taiwan · 秘客侠",
    headline: ["Every Sip,", "Bursting", "with Joy."],
    headlineAccent: 1, // which line gets accent color
    sub: "Authentic Taiwanese Popping Boba — crafted with real milk, natural flavors, and boba that bursts with every sip.",
    cta: { label: "View Menu", to: "/products" },
    ctaSecondary: { label: "Our Story", to: "/about" },
    badge: "🫧 First Taiwanese Popping Boba Brand in PH",
  },
  {
    id: 1,
    image: "/hero-bg-2.png", // 🔁 Replace with your image
    accent: "#E8A020",
    eyebrow: "Born in Taiwan · Loved in Manila",
    headline: ["Taiwan's", "Heritage,", "Your Cup."],
    headlineAccent: 0,
    sub: "Since 2015, Milkshop has defined the Popping Boba category across Asia. Now we're growing fast in the Philippines.",
    cta: { label: "Discover Our Brand", to: "/about" },
    ctaSecondary: { label: "See Locations", to: "/locations" },
    badge: "🇹🇼 Authentic Original Formula",
  },
  {
    id: 2,
    image: "/hero-bg-3.png", // 🔁 Replace with your image
    accent: "#97b64c",
    eyebrow: "Franchise Opportunities · Open Now",
    headline: ["Your Next", "Business", "Starts Here."],
    headlineAccent: 2,
    sub: "Join 15+ successful franchisees. Low barrier to entry, full brand support, and ROI in as little as 12–18 months.",
    cta: { label: "Franchise Now →", to: "/franchise#inquiry" },
    ctaSecondary: { label: "Learn More", to: "/franchise" },
    badge: "📈 ROI in 12–18 months · No experience needed",
  },
];

const SLIDE_DURATION = 6000;

// ─── HERO ──────────────────────────────────────────────────────────────────
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(index);
    setProgress(0);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 900);
  };

  const next = () => goTo((current + 1) % SLIDES.length);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [current, animating]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
      if (elapsed < SLIDE_DURATION) {
        progressRef.current = requestAnimationFrame(step);
      }
    };
    progressRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1000px] overflow-hidden bg-[#0a0a0a] mt-0 pt-0">

      {/* ── BACKGROUND SLIDES ── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {/* Image */}
          <img
            src={s.image}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: i === current ? "scale(1.04)" : "scale(1)", transition: "transform 6s ease-out" }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── CONTENT ── */}
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-8 lg:px-16">

        {/* Eyebrow */}
        <div
          key={`eyebrow-${current}`}
          className="mb-5 hero-fadein"
          style={{ animationDelay: "0ms" }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full border"
            style={{
              color: slide.accent,
              borderColor: slide.accent + "55",
              backgroundColor: slide.accent + "15",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: slide.accent }}
            />
            {slide.eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {slide.headline.map((line, li) => (
            <div
              key={`line-${current}-${li}`}
              className="overflow-hidden"
            >
              <span
                className="block hero-slidein"
                style={{
                  animationDelay: `${80 + li * 80}ms`,
                  fontSize: "clamp(3rem, 7vw, 6rem)",
                  fontWeight: 800,
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  color: li === slide.headlineAccent ? slide.accent : "#ffffff",
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </h1>

        {/* Subtext */}
        <p
          key={`sub-${current}`}
          className="text-white/60 text-base lg:text-lg max-w-md leading-relaxed mb-8 hero-fadein"
          style={{ animationDelay: "320ms", fontFamily: "'DM Sans', sans-serif" }}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div
          key={`cta-${current}`}
          className="flex flex-wrap items-center gap-4 mb-8 hero-fadein"
          style={{ animationDelay: "420ms" }}
        >
          <Link
            to={slide.cta.to}
            className="relative overflow-hidden text-sm font-bold px-8 py-3.5 rounded-full text-white transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: slide.accent,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {slide.cta.label}
          </Link>
          <Link
            to={slide.ctaSecondary.to}
            className="text-sm font-semibold px-8 py-3.5 rounded-full border border-white/30 text-white/80 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm active:scale-95"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {slide.ctaSecondary.label}
          </Link>
        </div>

        {/* Badge */}
        <div
          key={`badge-${current}`}
          className="hero-fadein"
          style={{ animationDelay: "500ms" }}
        >
          <p
            className="text-white/40 text-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {slide.badge}
          </p>
        </div>
      </div>

      {/* ── SLIDE INDICATORS + PROGRESS ── */}
      <div className="absolute bottom-10 left-0 right-0 z-20 max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-center gap-4">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: i === current ? "64px" : "24px",
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: slide.accent,
                    transition: "width 0.1s linear",
                  }}
                />
              )}
            </button>
          ))}

          {/* Slide counter */}
          <span
            className="ml-auto text-white/30 text-xs tabular-nums"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            0{current + 1} / 0{SLIDES.length}
          </span>
        </div>
      </div>

      {/* ── SCROLL CUE ── */}
      <div className="absolute bottom-10 right-8 lg:right-16 z-20 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-white text-[10px] tracking-[0.2em] uppercase rotate-90 origin-center translate-y-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Scroll
        </span>
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-white animate-scroll-line" />
        </div>
      </div>

      {/* ── STATS ROW — pinned bottom left ── */}
      <div
        className="absolute bottom-10 left-8 lg:left-16 z-20 hidden lg:flex items-center gap-8 hero-fadein"
        style={{ animationDelay: "600ms" }}
      >
        {[
          { value: "15+", label: "Branches" },
          { value: "20+", label: "Flavors" },
          { value: "2015", label: "Est. Taiwan" },
          { value: "12–18mo", label: "ROI" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span
              className="text-white text-xl font-bold leading-none"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {stat.value}
            </span>
            <span
              className="text-white/30 text-[10px] tracking-widest uppercase mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── WAVE DIVIDER ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 fill-white">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* ── CSS ANIMATIONS ── */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .hero-fadein {
          opacity: 0;
          animation: heroFadeIn 0.7s ease forwards;
        }
        .hero-slidein {
          opacity: 0;
          animation: heroSlideIn 0.65s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .animate-scroll-line {
          animation: scrollLine 1.6s ease-in-out infinite;
          height: 40%;
        }
      `}</style>
    </section>
  );
}