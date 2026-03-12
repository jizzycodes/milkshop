import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Milk Tea Series",
  "Cheesecake Series",
  "Fruit Tea Series",
  "Milku Series",
  "Smoothies Series",
  "Bread",
];

const tagStyles = {
  "Best Seller": { bg: "#E8A020", color: "#fff"    },
  "Classic":     { bg: "#97b64c", color: "#fff"    },
  "New":         { bg: "#62840b", color: "#fff"    },
  "Fan Fave":    { bg: "#b7cd7f", color: "#1e1e1e" },
  "Signature":   { bg: "#1e1e1e", color: "#b7cd7f" },
  "Limited":     { bg: "#7c3aed", color: "#fff"    },
};

const feedbacks = [
  { id: 1, name: "Angelica R.",  handle: "@angelicar_ph",  stars: 5, comment: "Best milk tea I've ever had in the Philippines! The black sugar boba is absolutely insane. Already on my 5th visit this month." },
  { id: 2, name: "Miguel T.",    handle: "@migueltravels", stars: 5, comment: "The popping boba is on another level. You can actually taste the real fruit juice when it bursts. Nothing like it in Manila." },
  { id: 3, name: "Trisha Mae",   handle: "@trishafoods",   stars: 5, comment: "Finally a milk tea brand that uses ACTUAL fresh milk. You can taste the difference. The matcha pearl is my forever go-to." },
  { id: 4, name: "Carlo B.",     handle: "@carloeats",     stars: 5, comment: "Ordered the taro and the chocolate pearl. Both were 10/10. The queue was long but 100% worth it. Will be back tomorrow." },
  { id: 5, name: "Diane L.",     handle: "@dianelim.ph",   stars: 5, comment: "The brown sugar milk tea here hits different. Tiger stripes are real, the pearls are chewy. Taiwanese quality for real." },
  { id: 6, name: "Nico S.",      handle: "@nicosip",       stars: 5, comment: "My friends dragged me here and now I'm the one dragging everyone else. The lychee popping boba is completely addicting." },
  { id: 7, name: "Justine A.",   handle: "@justineandco",  stars: 5, comment: "Visited the Cebu branch and it was packed! Staff was super friendly and drinks came out fast. Ube cream is a must-try." },
  { id: 8, name: "Rachel P.",    handle: "@rachelpdiary",  stars: 5, comment: "Milkshop is the only milk tea that makes me feel like I'm actually in Taiwan. Every sip is just absolutely perfect." },
  { id: 9, name: "James V.",     handle: "@jamesv.eats",   stars: 5, comment: "Came for the black sugar, stayed for everything else. This is easily the best milk tea brand operating in the country right now." },
  { id: 10, name: "Sofia M.",    handle: "@sofiamph",      stars: 5, comment: "The freshness is unreal. No weird aftertaste, no powder taste — just clean, smooth, and so satisfying every single time." },
];

// ─── FLOATING CAROUSEL — DARK PREMIUM ────────────────────────────────────────

function FloatingCarousel({ products, accentColor = "#97b64c" }) {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef         = useRef(null);
  const total               = products.length;

  const goTo = useCallback((idx) => {
    if (idx === active) return;
    setFading(true);
    setTimeout(() => { setActive(idx); setFading(false); }, 220);
  }, [active]);

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((p) => (p + 1) % total);
    }, 3000);
  }, [total]);

  useEffect(() => { startAuto(); return () => clearInterval(intervalRef.current); }, [startAuto]);

  const getPos = (i) => {
    const d = (i - active + total) % total;
    if (d === 0)                       return "center";
    if (d === 1 || d === total - 4)    return "right1";
    if (d === total - 1 || d === 4)    return "left1";
    if (d === 2 || d === total - 5)    return "right2";
    if (d === total - 2 || d === 5)    return "left2";
    return "hidden";
  };

  const posStyles = {
    center: { zIndex: 30, transform: "translateX(0%)    scale(1)",    opacity: 1,    filter: "none"         },
    right1: { zIndex: 20, transform: "translateX(46%)   scale(0.72)", opacity: 0.45, filter: "blur(0.8px)"  },
    left1:  { zIndex: 20, transform: "translateX(-46%)  scale(0.72)", opacity: 0.45, filter: "blur(0.8px)"  },
    right2: { zIndex: 10, transform: "translateX(78%)   scale(0.5)",  opacity: 0.15, filter: "blur(1.5px)"  },
    left2:  { zIndex: 10, transform: "translateX(-78%)  scale(0.5)",  opacity: 0.15, filter: "blur(1.5px)"  },
    hidden: { zIndex: 0,  transform: "translateX(0%)    scale(0.3)",  opacity: 0,    filter: "blur(3px)"    },
  };

  const current = products[active];
  const tag     = current?.tag ? tagStyles[current.tag] : null;
  if (!total) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={startAuto}
    >
      {/* Radial glow — larger, more dramatic */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "480px",
          height: "180px",
          background: `radial-gradient(ellipse at center, ${accentColor}35 0%, transparent 70%)`,
          filter: "blur(32px)",
        }}
      />

      {/* Stage */}
      <div className="relative flex items-end justify-center overflow-hidden" style={{ height: "380px" }}>
        {products.map((p, i) => {
          const s = posStyles[getPos(i)];
          return (
            <button
              key={p.id}
              onClick={() => { goTo(i); startAuto(); }}
              className="absolute bottom-0 flex items-end justify-center cursor-pointer"
              style={{ transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)", ...s }}
              aria-label={p.name}
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  draggable={false}
                  className="select-none object-contain"
                  style={{ height: "320px", width: "auto", filter: "drop-shadow(0 32px 48px rgba(0,0,0,0.65))" }}
                />
              ) : (
                <div style={{ height: "280px", fontSize: "5rem", display: "flex", alignItems: "flex-end" }}>🧋</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div
        className="mt-10 flex flex-col items-center text-center gap-3 px-6"
        style={{ minHeight: "120px", transition: "opacity 0.25s ease", opacity: fading ? 0 : 1 }}
      >
        {tag && (
          <span
            className="text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase"
            style={{ backgroundColor: tag.bg, color: tag.color, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.1em" }}
          >
            {current.tag}
          </span>
        )}
        <h3
          className="text-3xl sm:text-4xl font-black"
          style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}
        >
          {current.name}
        </h3>
        {current.description && (
          <p className="text-sm max-w-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
            {current.description}
          </p>
        )}
        {current.price && (
          <span
            className="text-2xl font-black mt-1 tabular-nums"
            style={{ color: accentColor, fontFamily: "'DM Mono', monospace" }}
          >
            ₱{current.price}
          </span>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8 pb-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); startAuto(); }}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? "28px" : "6px",
              height: "6px",
              backgroundColor: i === active ? accentColor : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORY SECTION — DARK ──────────────────────────────────────────────────

function CategorySection({ category, products }) {
  if (!products.length) return null;
  return (
    <Reveal as="section" className="relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: "#161616",
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(151,182,76,0.06) 0%, transparent 55%),
            radial-gradient(circle at 85% 50%, rgba(98,132,11,0.04) 0%, transparent 55%),
            radial-gradient(circle at 50% 100%, rgba(151,182,76,0.05) 0%, transparent 40%)
          `,
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-20">
        {/* Section header */}
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-5">
            <div className="w-1 h-12 rounded-full" style={{ background: "linear-gradient(to bottom, #97b64c, #62840b)" }} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1" style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>
                Series
              </p>
              <h2 className="text-3xl font-black leading-none" style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.03em" }}>
                {category}
              </h2>
            </div>
          </div>
          <span
            className="text-xs font-bold px-4 py-2 rounded-full tabular-nums"
            style={{
              backgroundColor: "rgba(151,182,76,0.1)",
              color: "#b7cd7f",
              border: "1px solid rgba(151,182,76,0.25)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {products.length} drinks
          </span>
        </div>
        <FloatingCarousel products={products} />
      </div>
      {/* Separator */}
      <div
        className="mx-auto"
        style={{
          height: "1px",
          maxWidth: "80%",
          background: "linear-gradient(to right, transparent, rgba(151,182,76,0.15), transparent)",
        }}
      />
    </Reveal>
  );
}

// ─── ANIMATED REVIEW TICKER ───────────────────────────────────────────────────

function ReviewTicker({ reviews, direction = "left", speed = 38 }) {
  const doubled = [...reviews, ...reviews];
  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex gap-5 w-max"
        style={{ animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite` }}
      >
        {doubled.map((fb, i) => (
          <div
            key={`${fb.id}-${i}`}
            className="shrink-0 w-[280px] rounded-2xl p-5 flex flex-col gap-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: fb.stars }).map((_, si) => (
                <span key={si} className="text-[#E8A020] text-xs">★</span>
              ))}
            </div>
            <p
              className="text-xs leading-relaxed flex-1"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}
            >
              "{fb.comment}"
            </p>
            <div className="flex items-center gap-2.5 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                style={{ backgroundColor: "rgba(151,182,76,0.18)", border: "1px solid rgba(151,182,76,0.2)" }}
              >
                🧋
              </div>
              <div>
                <p className="text-[10px] font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{fb.name}</p>
                <p className="text-[9px]" style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>{fb.handle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Products() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [activeReview, setActiveReview]     = useState(0);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("MSproducts")
        .select("*")
        .order("id", { ascending: true });
      if (error) { console.error(error); return; }
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  // Cycle featured review
  useEffect(() => {
    const t = setInterval(() => setActiveReview((p) => (p + 1) % feedbacks.length), 4000);
    return () => clearInterval(t);
  }, []);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat);
    return acc;
  }, {});

  const visibleCategories = [activeCategory];
  const featured = feedbacks[activeReview];
  const row1 = feedbacks.slice(0, Math.ceil(feedbacks.length / 2));
  const row2 = feedbacks.slice(Math.ceil(feedbacks.length / 2));

  return (
    <main style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <section className="relative overflow-hidden py-24 pb-32" style={{ backgroundColor: "#1e1e1e" }}>
        {/* Diagonal accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(151,182,76,0.1) 0%, transparent 45%, rgba(98,132,11,0.06) 100%)",
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(151,182,76,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        {/* Green glow top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "600px", height: "300px",
            background: "radial-gradient(ellipse, rgba(151,182,76,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 z-10">
          {/* Two-column layout */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px" style={{ backgroundColor: "#97b64c" }} />
                <span
                  className="text-[11px] font-bold tracking-[0.25em] uppercase"
                  style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}
                >
                  The Menu
                </span>
              </div>
              <h1
                className="font-black leading-[1.0] mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                  color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "-0.04em",
                }}
              >
                Sip the<br />
                <span style={{ color: "#97b64c" }}>Difference.</span>
              </h1>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
              >
                Taiwan's original Popping Boba — brewed fresh, never powdered, always real.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 lg:gap-10">
              {[
                { value: "20+",  label: "Menu Items"   },
                { value: "6",    label: "Series"       },
                { value: "100%", label: "Fresh Milk"   },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-3xl lg:text-4xl font-black leading-none"
                    style={{ color: "#ffffff", fontFamily: "'DM Mono', monospace" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-widest mt-1"
                    style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER (series navbar) ── */}
      <div
        className="sticky z-40 py-3.5"
        style={{
          top: "64px",
          backgroundColor: "rgba(22,22,22,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(151,182,76,0.12)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat ? "#97b64c" : "rgba(255,255,255,0.05)",
                color:           activeCategory === cat ? "#ffffff" : "rgba(255,255,255,0.5)",
                border:          activeCategory === cat ? "1px solid #97b64c" : "1px solid rgba(255,255,255,0.08)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          ))}
          <span
            className="ml-auto shrink-0 text-[10px] font-semibold px-3 py-1 rounded-full tabular-nums"
            style={{ color: "#b7cd7f", backgroundColor: "rgba(151,182,76,0.12)", border: "1px solid rgba(151,182,76,0.15)", fontFamily: "'DM Mono', monospace" }}
          >
            {grouped[activeCategory]?.length ?? 0} items
          </span>
        </div>
      </div>

      {/* ── CAROUSELS ── */}
      <div style={{ backgroundColor: "#161616" }}>
      {loading ? (
        <div className="flex items-center justify-center py-40 gap-3">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#97b64c", animationDelay: `${d}ms` }} />
          ))}
        </div>
      ) : (
        visibleCategories.map((cat) => (
          <CategorySection key={cat} category={cat} products={grouped[cat] || []} />
        ))
      )}
      </div>

      {/* ── REVIEWS — SPLIT LAYOUT ── */}
      <section className="overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        {/* Top separator */}
        <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(151,182,76,0.2), transparent)" }} />

        {/* ── TOP: SPLIT — stat left, featured quote right ── */}
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

            {/* LEFT — Brand credibility */}
            <Reveal as="div" className="flex flex-col gap-6 lg:w-[380px] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ backgroundColor: "#97b64c" }} />
                <span
                  className="text-[11px] font-bold tracking-[0.25em] uppercase"
                  style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}
                >
                  What They Say
                </span>
              </div>

              <h2
                className="font-black leading-[1.05]"
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                  color: "#ffffff",
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Loved by<br />
                <span style={{ color: "#97b64c" }}>Thousands.</span>
              </h2>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
              >
                From first-timers to daily regulars — Milkshop has built a loyal community across the Philippines.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: "4.9★",  label: "Average Rating" },
                  { value: "15+",   label: "Branches"       },
                  { value: "2,000+",label: "Happy Reviews"  },
                  { value: "2015",  label: "Est. Taiwan"    },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p
                      className="text-2xl font-black leading-none mb-1"
                      style={{ color: "#ffffff", fontFamily: "'DM Mono', monospace" }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* RIGHT — Animated featured quote */}
            <Reveal as="div" delay={80} className="flex-1 flex flex-col gap-4">
              {/* Big quote mark */}
              <span
                className="text-8xl leading-none select-none"
                style={{ color: "rgba(151,182,76,0.2)", fontFamily: "Georgia, serif", lineHeight: 1 }}
              >
                "
              </span>

              {/* Quote text — animates on change */}
              <div style={{ minHeight: "140px" }}>
                <p
                  key={activeReview}
                  className="text-lg lg:text-xl leading-relaxed font-medium review-fadein"
                  style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {featured.comment}
                </p>
              </div>

              {/* Author */}
              <div
                key={`author-${activeReview}`}
                className="flex items-center gap-3 review-fadein"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ backgroundColor: "rgba(151,182,76,0.15)", border: "1px solid rgba(151,182,76,0.2)" }}
                >
                  🧋
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {featured.name}
                  </p>
                  <p className="text-xs" style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>
                    {featured.handle}
                  </p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: featured.stars }).map((_, i) => (
                    <span key={i} className="text-[#E8A020] text-sm">★</span>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div className="flex gap-2 mt-2">
                {feedbacks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReview(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:           i === activeReview ? "24px" : "6px",
                      height:          "6px",
                      backgroundColor: i === activeReview ? "#97b64c" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── BOTTOM: ANIMATED TICKER ROWS ── */}
        <div className="pb-20 flex flex-col gap-5">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1e1e1e, transparent)" }} />
            <ReviewTicker reviews={row1} direction="left"  speed={35} />
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1e1e1e, transparent)" }} />
            <ReviewTicker reviews={row2} direction="right" speed={42} />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16" style={{ backgroundColor: "#f7f9f3", borderTop: "1px solid #e8f0dc" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-1" style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>
              Can't decide? 🧋
            </h2>
            <p className="text-sm" style={{ color: "#7a8a6a", fontFamily: "'DM Sans', sans-serif" }}>
              Visit a branch — our crew will help you find your new favorite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/locations"
              className="font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
              style={{ backgroundColor: "#97b64c", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 6px 20px rgba(151,182,76,0.35)" }}
            >
              Find a Branch
            </Link>
            <Link
              to="/franchise#inquiry"
              className="font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:bg-[#f0f7e6]"
              style={{ border: "1.5px solid #97b64c", color: "#62840b", backgroundColor: "transparent", fontFamily: "'DM Sans', sans-serif" }}
            >
              Franchise Now →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee-left  { 0% { transform: translateX(0);    } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0);    } }
        @keyframes reviewFadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .review-fadein { animation: reviewFadeIn 0.5s ease forwards; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}