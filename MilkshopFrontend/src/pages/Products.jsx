import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { supabase } from "../lib/supabaseClient";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Milk Tea Series",
  "Cheesecake Series",
  "Fruit Tea Series",
  "Milku Series",
  "Smoothies Series",
  "Bread",
];

const feedbacks = [
  { id: 1,  name: "Angelica R.",  handle: "@angelicar_ph",  stars: 5, comment: "Best milk tea I've ever had in the Philippines! The black sugar boba is absolutely insane. Already on my 5th visit this month." },
  { id: 2,  name: "Miguel T.",    handle: "@migueltravels", stars: 5, comment: "The popping boba is on another level. You can actually taste the real fruit juice when it bursts. Nothing like it in Manila." },
  { id: 3,  name: "Trisha Mae",   handle: "@trishafoods",   stars: 5, comment: "Finally a milk tea brand that uses ACTUAL fresh milk. You can taste the difference. The matcha pearl is my forever go-to." },
  { id: 4,  name: "Carlo B.",     handle: "@carloeats",     stars: 5, comment: "Ordered the taro and the chocolate pearl. Both were 10/10. The queue was long but 100% worth it. Will be back tomorrow." },
  { id: 5,  name: "Diane L.",     handle: "@dianelim.ph",   stars: 5, comment: "The brown sugar milk tea here hits different. Tiger stripes are real, the pearls are chewy. Taiwanese quality for real." },
  { id: 6,  name: "Nico S.",      handle: "@nicosip",       stars: 5, comment: "My friends dragged me here and now I'm the one dragging everyone else. The lychee popping boba is completely addicting." },
  { id: 7,  name: "Justine A.",   handle: "@justineandco",  stars: 5, comment: "Visited the Cebu branch and it was packed! Staff was super friendly and drinks came out fast. Ube cream is a must-try." },
  { id: 8,  name: "Rachel P.",    handle: "@rachelpdiary",  stars: 5, comment: "Milkshop is the only milk tea that makes me feel like I'm actually in Taiwan. Every sip is just absolutely perfect." },
  { id: 9,  name: "James V.",     handle: "@jamesv.eats",   stars: 5, comment: "Came for the black sugar, stayed for everything else. This is easily the best milk tea brand operating in the country right now." },
  { id: 10, name: "Sofia M.",     handle: "@sofiamph",      stars: 5, comment: "The freshness is unreal. No weird aftertaste, no powder taste — just clean, smooth, and so satisfying every single time." },
];

const topDrinks = [
  {
    id: 1,
    name: "Black Sugar Boba Milk Tea",
    tag: "Best Seller",
    tagColor: "bg-[#E8A020] text-white",
    description: "A rich milk tea blended with caramelized brown sugar and chewy black sugar pearls for a deep, sweet flavor.",
    price: "₱99",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/milktea_series/A1.png",
  },
  {
    id: 2,
    name: "Signature Taiwanese Milk Tea",
    tag: "Classic",
    tagColor: "bg-[#97b64c] text-white",
    description: "A smooth and classic Taiwanese milk tea made with fragrant tea and creamy milk for a perfectly balanced taste.",
    price: "₱99",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/milktea_series/A2.png",
  },
  {
    id: 3,
    name: "Milku Strawberry",
    tag: "Fan Fave",
    tagColor: "bg-pink-500 text-white",
    description: "A creamy strawberry milk drink bursting with sweet berry flavor and fun popping boba.",
    price: "₱105",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/milku_series/M1.png",
  },
  {
    id: 4,
    name: "Cheese Cake Black Sugar Boba Milk Tea",
    tag: "New",
    tagColor: "bg-[#62840b] text-white",
    description: "A bold black sugar boba milk tea combined with creamy cheesecake for a sweet and slightly salty finish",
    price: "₱109",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/cheesecake_series/K1.png",
  },
  {
    id: 5,
    name: "Passion Fruit Double Canon",
    tag: "Summer Pick",
    tagColor: "bg-rose-400 text-white",
    description: "A refreshing passion fruit drink loaded with rainbow jelly for a tangy and juicy tropical kick.",
    price: "₱109",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/fruit_series/C1.png",
  },
];

// ─── SERIES CUPS (Fan Favorites layout: manual, equal cups, full opacity, tight gap) ─
function SeriesCupsCarousel({ products }) {
  const [active, setActive] = useState(0);
  const total = products.length;
  const activeIndex = total === 0 ? 0 : Math.min(active, total - 1);

  const getPos = (index) => {
    if (total === 0) return "hidden";
    let d = index - activeIndex;
    const half = total / 2;
    if (d > half) d -= total;
    if (d < -half) d += total;
    if (d === 0) return "center";
    if (d === 1) return "right1";
    if (d === -1) return "left1";
    if (d === 2) return "right2";
    if (d === -2) return "left2";
    return "hidden";
  };

  const posStyles = {
    center:  "z-40 opacity-100 translate-x-0",
    right1:  "z-30 opacity-50 translate-x-[100%]",
    left1:   "z-30 opacity-50 -translate-x-[100%]",
    right2:  "z-20 opacity-30 translate-x-[200%]",
    left2:   "z-20 opacity-30 -translate-x-[200%]",
    hidden:  "z-10 opacity-0 pointer-events-none translate-x-0",
  };

  const current = products[activeIndex];
  const cupImgClass =
    "object-contain drop-shadow-2xl select-none h-56 w-auto max-w-[200px] sm:h-64 sm:max-w-[220px]";

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-10">
      <div className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden">
        {products.map((product, i) => {
          const pos = getPos(i);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => setActive(i)}
              className={`absolute transition-all duration-500 ease-in-out flex flex-col items-center cursor-pointer ${posStyles[pos]}`}
              aria-label={product.name}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt=""
                  draggable={false}
                  className={cupImgClass}
                />
              ) : (
                <div className="flex h-56 w-[168px] sm:h-64 sm:w-[188px] shrink-0 items-center justify-center">
                  <svg width="40" height="40" fill="none" stroke="#97b64c" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.121" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((activeIndex - 1 + total) % total)}
              className="hidden sm:flex items-center justify-center absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border text-xs transition-colors"
              style={{
                borderColor: "#b7cd7f",
                backgroundColor: "rgba(183,205,127,0.18)",
                color: "#62840b",
              }}
              aria-label="Previous"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActive((activeIndex + 1) % total)}
              className="hidden sm:flex items-center justify-center absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border text-xs transition-colors"
              style={{
                borderColor: "#b7cd7f",
                backgroundColor: "rgba(183,205,127,0.18)",
                color: "#62840b",
              }}
              aria-label="Next"
            >
              →
            </button>
          </>
        )}
      </div>

      {current && (
        <div className="mt-6 flex flex-col items-center text-center px-4 min-h-[3.5rem]">
          <h3
            className="text-xl sm:text-2xl font-bold text-[#1e1e1e] max-w-lg"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
          >
            {current.name}
          </h3>
        </div>
      )}

      {total > 1 && (
        <div className="flex justify-center gap-2 mt-5 mb-4 flex-wrap">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 h-2 bg-[#97b64c]"
                  : "w-2 h-2 bg-[#d0e0b0] hover:bg-[#b7cd7f]"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DrinksCarousel() {
  const [active, setActive] = useState(2);
  const total = topDrinks.length;
  const intervalRef = useRef(null);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3000);
  };

  const stopAuto = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  const getPos = (index) => {
    const diff = (index - active + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right1";
    if (diff === 2) return "right2";
    if (diff === total - 2) return "left2";
    if (diff === total - 1) return "left1";
    return "hidden";
  };

  const posStyles = {
    center:  "z-40 scale-110 opacity-100 translate-x-0",
    right1:  "z-30 scale-50 opacity-35 translate-x-[70%]",
    left1:   "z-30 scale-50 opacity-35 -translate-x-[70%]",
    right2:  "z-20 scale-50 opacity-35 translate-x-[130%]",
    left2:   "z-20 scale-50 opacity-35 -translate-x-[130%]",
    hidden:  "z-10 scale-50 opacity-0 translate-x-0 pointer-events-none",
  };

  const current = topDrinks[active];

  return (
    <div
      className="w-full"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <div className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden">
        {topDrinks.map((drink, i) => {
          const pos = getPos(i);
          const isCenter = pos === "center";
          return (
            <button
              key={drink.id}
              onClick={() => setActive(i)}
              className={`absolute transition-all duration-500 ease-in-out flex flex-col items-center cursor-pointer ${posStyles[pos]}`}
              aria-label={drink.name}
            >
              <img
                src={drink.imageUrl}
                alt={drink.name}
                className={`object-contain drop-shadow-2xl select-none ${isCenter ? "h-64 sm:h-72" : "h-52 sm:h-60"}`}
                draggable={false}
              />
            </button>
          );
        })}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((active - 1 + total) % total)}
              className="hidden sm:flex items-center justify-center absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border text-xs transition-colors"
              style={{
                borderColor: "#b7cd7f",
                backgroundColor: "rgba(183,205,127,0.18)",
                color: "#b7cd7f",
              }}
              aria-label="Previous drink"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setActive((active + 1) % total)}
              className="hidden sm:flex items-center justify-center absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border text-xs transition-colors"
              style={{
                borderColor: "#b7cd7f",
                backgroundColor: "rgba(183,205,127,0.18)",
                color: "#b7cd7f",
              }}
              aria-label="Next drink"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col items-center text-center gap-2 px-4 min-h-[120px] transition-all duration-300">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full ${current.tagColor}`}
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          {current.tag}
        </span>
        <h3
          className="text-xl sm:text-2xl font-bold text-[#1e1e1e]"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          {current.name}
        </h3>
        <p
          className="text-[#5a5a5a] text-sm max-w-xs leading-relaxed"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          {current.description}
        </p>
        <span
          className="text-xl font-bold text-[#97b64c] mt-1"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {current.price}
        </span>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {topDrinks.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-[#97b64c]"
                : "w-2 h-2 bg-[#d0e0b0] hover:bg-[#b7cd7f]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORY SECTION (UPGRADED) ──────────────────────────────────────────────
function CategorySection({ category, products }) {
  if (!products.length) return null;
  const seriesName = category.replace(" Series", "");
  const isBreak    = category === "Bread";
  const sectionLabel = isBreak ? "Products Series: Bread" : `Products Series: ${seriesName}`;

  return (
    <section data-track-section={sectionLabel} style={{ marginBottom: "20px" }}>

      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "16px", padding: "0 24px" }}>

        {/* Series eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          marginBottom: "12px",
        }}>
          <div style={{ width: "24px", height: "1.5px", background: "linear-gradient(to right, transparent, #97b64c)" }} />
          <span style={{
            fontSize: "10px", fontWeight: 800, letterSpacing: "0.35em",
            textTransform: "uppercase", color: "#97b64c",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {isBreak ? "Bites" : "Series"}
          </span>
          <div style={{ width: "24px", height: "1.5px", background: "linear-gradient(to left, transparent, #97b64c)" }} />
        </div>

        {/* Series title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#1e1e1e", margin: 0,
            lineHeight: 1,
          }}>
            {isBreak ? "Fresh " : `${seriesName} `}
            <span style={{
              color: "#97b64c",
              textShadow: "0 2px 20px rgba(151,182,76,0.25)",
            }}>
              {isBreak ? "Bread" : "Series"}
            </span>
          </h2>

          {/* Count pill */}
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", fontWeight: 700,
            padding: "4px 12px", borderRadius: "999px",
            background: "linear-gradient(135deg, #f0f6e8, #e4f0d0)",
            color: "#62840b",
            border: "1px solid rgba(151,182,76,0.3)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          }}>
            {products.length} items
          </span>
        </div>
      </div>

      {/* Carousel */}
      <SeriesCupsCarousel products={products} />

      {/* Section Divider */}
      <div style={{
        margin: "0 80px",
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(151,182,76,0.25) 20%, rgba(151,182,76,0.25) 80%, transparent)",
      }} />
    </section>
  );
}
// ─── REVIEW TICKER ────────────────────────────────────────────────────────────
function ReviewTicker({ reviews, direction = "left", speed = 38 }) {
  const doubled = [...reviews, ...reviews];
  return (
    <div
      data-track-section={`Review Ticker: ${direction === "left" ? "Top Row" : "Bottom Row"}`}
      style={{ overflow: "hidden", padding: "8px 0" }}
    >
      <div style={{
        display: "flex", gap: "20px", width: "max-content",
        animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`,
      }}>
        {doubled.map((fb, i) => (
          <div key={`${fb.id}-${i}`} style={{
            flexShrink: 0,
            width: "280px",
            borderRadius: "20px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backgroundColor: "#ffffff",
            border: "1px solid #dde8cc",
            boxShadow: "0 2px 16px rgba(151,182,76,0.06)",
          }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: fb.stars }).map((_, si) => (
                <span key={si} style={{ color: "#97b64c", fontSize: "11px" }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: "11px", lineHeight: 1.65, flex: 1, color: "#5a6a4a", fontFamily: "'DM Sans', sans-serif" }}>
              "{fb.comment}"
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              paddingTop: "12px", borderTop: "1px solid #eef4e3",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                backgroundColor: "#eef4e3", border: "1px solid #d0e0b0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", flexShrink: 0,
              }}>🧋</div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>{fb.name}</p>
                <p style={{ fontSize: "9px", color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>{fb.handle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Products() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("MSproducts").select("*").order("id", { ascending: true });
      if (error) { console.error(error); return; }
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveReview(p => (p + 1) % feedbacks.length), 4000);
    return () => clearInterval(t);
  }, []);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat);
    return acc;
  }, {});

  const featured = feedbacks[activeReview];

  return (
    <main style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    }}>

     {/* ══ PRODUCTS HERO — Premium Animated ══ */}
<section data-track-section="Products Hero" style={{
  position: "relative",
  overflow: "hidden",
  background: "linear-gradient(158deg, #f3f9ea 0%, #ffffff 48%, #f0f7e6 100%)",
  minHeight: "clamp(600px, 88vh, 900px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontFamily: "'DM Sans', sans-serif",
}}>

  <style>{`
    @keyframes phFadeUp    { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes phFadeLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
    @keyframes phFadeRight { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
    @keyframes phShimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes phFloat0    { 0%,100%{transform:translateY(0px) rotate(-1.5deg) scale(1)} 50%{transform:translateY(-18px) rotate(0.8deg) scale(1.015)} }
    @keyframes phFloat1    { 0%,100%{transform:translateY(0px) rotate(1.2deg) scale(1.04)} 50%{transform:translateY(-24px) rotate(-0.5deg) scale(1)} }
    @keyframes phFloat2    { 0%,100%{transform:translateY(0px) rotate(-0.8deg) scale(0.97)} 50%{transform:translateY(-14px) rotate(1.5deg) scale(1.02)} }
    @keyframes phOrbDrift  { 0%,100%{transform:translate(0,0) scale(1);opacity:0.5} 50%{transform:translate(16px,-14px) scale(1.08);opacity:0.85} }
    @keyframes phRingPulse { 0%{transform:scale(0.92);opacity:0.7} 100%{transform:scale(1.7);opacity:0} }
    @keyframes phTagPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(151,182,76,0.45)} 50%{box-shadow:0 0 0 9px rgba(151,182,76,0)} }
    @keyframes phDotBlink  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
    @keyframes phScrollLine{ 0%{transform:translateY(-100%)} 100%{transform:translateY(300%)} }
    @keyframes phLineGrow  { from{width:0;opacity:0} to{width:40px;opacity:1} }
    @keyframes phCupEntrance0 { from{opacity:0;transform:translateY(52px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes phCupEntrance1 { from{opacity:0;transform:translateY(36px) scale(0.92)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes phCupEntrance2 { from{opacity:0;transform:translateY(64px) scale(0.88)} to{opacity:1;transform:translateY(0) scale(1)} }

    .ph-tag   { opacity:0; animation:phFadeUp   0.6s ease forwards; animation-delay:0.1s }
    .ph-h1    { opacity:0; animation:phFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.25s }
    .ph-p     { opacity:0; animation:phFadeLeft 0.75s ease forwards; animation-delay:0.42s }
    .ph-stats { opacity:0; animation:phFadeUp   0.7s ease forwards; animation-delay:0.58s }
    .ph-cta   { opacity:0; animation:phFadeUp   0.7s ease forwards; animation-delay:0.72s }
    .ph-cup-0 { opacity:0; animation:phCupEntrance0 0.85s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.2s }
    .ph-cup-1 { opacity:0; animation:phCupEntrance1 0.85s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.08s }
    .ph-cup-2 { opacity:0; animation:phCupEntrance2 0.85s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay:0.36s }
    .ph-float-0 { animation:phFloat0 9s  ease-in-out infinite; animation-delay:0s }
    .ph-float-1 { animation:phFloat1 11s ease-in-out infinite; animation-delay:0.8s }
    .ph-float-2 { animation:phFloat2 8s  ease-in-out infinite; animation-delay:1.6s }

    .ph-cta-primary {
      display:inline-flex; align-items:center; gap:6px;
      padding:13px 28px; border-radius:999px;
      background:linear-gradient(135deg,#62840b,#97b64c);
      color:#fff; font-family:'DM Sans',sans-serif;
      font-size:0.875rem; font-weight:700;
      text-decoration:none; border:none; cursor:pointer;
      box-shadow:0 8px 28px rgba(151,182,76,0.38);
      transition:all 0.3s ease; letter-spacing:0.01em;
    }
    .ph-cta-primary:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(151,182,76,0.5) }
    .ph-cta-secondary {
      display:inline-flex; align-items:center; gap:6px;
      padding:13px 26px; border-radius:999px;
      background:transparent; color:#62840b;
      font-family:'DM Sans',sans-serif;
      font-size:0.875rem; font-weight:700;
      text-decoration:none;
      border:1.5px solid rgba(151,182,76,0.38);
      transition:all 0.3s ease;
    }
    .ph-cta-secondary:hover { background:rgba(151,182,76,0.08); border-color:#97b64c; transform:translateY(-2px) }
    .ph-stat-pill { transition:transform 0.3s ease; }
    .ph-stat-pill:hover { transform:translateY(-3px) }
    .ph-cup-img {
      width:auto;
      height:clamp(240px,40vh,480px);
      object-fit:contain;
      display:block;
    }
    @media(min-width:1024px){
      .ph-cup-img { height:clamp(320px,50vh,600px); }
    }
  `}</style>

  {/* ── Backgrounds ── */}

  {/* Dot grid left */}
  <div aria-hidden style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:"radial-gradient(circle, rgba(151,182,76,0.2) 1.5px, transparent 1.5px)",
    backgroundSize:"32px 32px",
    maskImage:"radial-gradient(ellipse at 7% 55%, black 5%, transparent 50%)",
    WebkitMaskImage:"radial-gradient(ellipse at 7% 55%, black 5%, transparent 50%)",
  }} />

  {/* Dot grid right */}
  <div aria-hidden style={{
    position:"absolute", inset:0, pointerEvents:"none",
    backgroundImage:"radial-gradient(circle, rgba(151,182,76,0.1) 1.5px, transparent 1.5px)",
    backgroundSize:"28px 28px",
    maskImage:"radial-gradient(ellipse at 94% 38%, black 5%, transparent 48%)",
    WebkitMaskImage:"radial-gradient(ellipse at 94% 38%, black 5%, transparent 48%)",
  }} />

  {/* Orb top-right */}
  <div aria-hidden style={{
    position:"absolute", top:"-12%", right:"-6%",
    width:580, height:580, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(151,182,76,0.12) 0%, transparent 68%)",
    filter:"blur(30px)", pointerEvents:"none",
    animation:"phOrbDrift 16s ease-in-out infinite",
  }} />

  {/* Orb bottom-left */}
  <div aria-hidden style={{
    position:"absolute", bottom:"0%", left:"-5%",
    width:380, height:380, borderRadius:"50%",
    background:"radial-gradient(circle, rgba(183,205,127,0.14) 0%, transparent 70%)",
    filter:"blur(22px)", pointerEvents:"none",
    animation:"phOrbDrift 20s ease-in-out infinite reverse",
  }} />

  {/* Decorative rings */}
  <div aria-hidden style={{
    position:"absolute", right:"5%", top:"50%", transform:"translateY(-50%)",
    width:"min(560px,58vw)", height:"min(560px,58vw)",
    borderRadius:"50%",
    border:"1px solid rgba(151,182,76,0.09)",
    pointerEvents:"none",
  }} />
  <div aria-hidden style={{
    position:"absolute", right:"9%", top:"50%", transform:"translateY(-50%)",
    width:"min(400px,43vw)", height:"min(400px,43vw)",
    borderRadius:"50%",
    border:"1px dashed rgba(151,182,76,0.07)",
    pointerEvents:"none",
  }} />

  {/* Bottom fade */}
  <div aria-hidden style={{
    position:"absolute", bottom:0, left:0, right:0, height:80,
    background:"linear-gradient(to bottom, transparent, #f5f8ef)",
    pointerEvents:"none", zIndex:2,
  }} />

  {/* ── Main content ── */}
  <div style={{
    position:"relative", zIndex:10,
    maxWidth:1240, margin:"0 auto",
    padding:"clamp(100px,14vw,140px) clamp(20px,5vw,56px) clamp(60px,8vw,100px)",
    width:"100%", boxSizing:"border-box",
    display:"grid",
    gridTemplateColumns:"1fr 1.3fr",
    gap:48,
    alignItems:"flex-end",
  }}
    className="max-lg:grid-cols-1 max-lg:gap-10"
  >

    {/* LEFT — Text */}
    <div style={{ display:"flex", flexDirection:"column", gap:22, paddingBottom: "clamp(20px,4vw,48px)" }}>

      {/* Eyebrow */}
      <div className="ph-tag">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            height:2, width:40,
            background:"linear-gradient(90deg, #62840b, #97b64c)",
            borderRadius:2,
            animation:"phLineGrow 0.7s ease forwards",
            animationDelay:"0.4s",
          }} />
          <span style={{
            display:"inline-flex", alignItems:"center", gap:7,
            padding:"6px 14px", borderRadius:999,
            background:"rgba(151,182,76,0.09)",
            border:"1px solid rgba(151,182,76,0.26)",
            fontSize:"10px", fontWeight:800,
            letterSpacing:"0.22em", textTransform:"uppercase",
            color:"#62840b",
            animation:"phTagPulse 3s ease-in-out infinite",
            animationDelay:"1.2s",
          }}>
            <span style={{
              width:5, height:5, borderRadius:"50%",
              background:"#97b64c", display:"inline-block",
              animation:"phDotBlink 2s ease-in-out infinite",
            }} />
            The Menu
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className="ph-h1">
        <h1 style={{
          fontSize:"clamp(3.2rem,7vw,5.8rem)",
          fontWeight:900, lineHeight:0.9,
          letterSpacing:"-0.055em", margin:0,
          color:"#1a1e14",
        }}>
          Sip the<br />
          <span style={{
            background:"linear-gradient(135deg, #3a5c06 0%, #62840b 30%, #97b64c 65%, #b7cd7f 100%)",
            backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            animation:"phShimmer 5s linear infinite",
            animationDelay:"1s",
            display:"inline-block",
          }}>Difference.</span>
        </h1>
      </div>

      {/* Body */}
      <div className="ph-p">
        <p style={{
          fontSize:"clamp(0.9rem,1.5vw,1.05rem)",
          lineHeight:1.8, color:"#4d5c3a",
          maxWidth:440, margin:0,
        }}>
          Taiwan's original Popping Boba — brewed fresh, never powdered, always real.
          {products.length > 0 && (
            <> <strong style={{ color:"#62840b", fontWeight:700 }}>{products.length} drinks</strong>{" "}across {CATEGORIES.length} series.</>
          )}
        </p>
      </div>

      {/* Stats strip */}
      <div className="ph-stats" style={{
        display:"flex", gap:0,
        border:"1px solid #ddecc4", borderRadius:16,
        overflow:"hidden", background:"white",
        alignSelf:"flex-start",
        boxShadow:"0 4px 20px rgba(151,182,76,0.1)",
      }}>
        {[
          { value:"20+",  label:"Menu Items" },
          { value:"6",    label:"Series" },
          { value:"100%", label:"Fresh Milk" },
        ].map((s, i) => (
          <div key={s.label} className="ph-stat-pill" style={{
            padding:"15px 22px", textAlign:"center",
            borderRight: i < 2 ? "1px solid #ddecc4" : "none",
          }}>
            <p style={{ fontFamily:"'DM Mono', monospace", fontWeight:900, fontSize:"1.25rem", color:"#1a1e14", lineHeight:1, margin:"0 0 4px" }}>{s.value}</p>
            <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"8px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.16em", color:"#97b64c", margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="ph-cta" style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
        <a href="#menu" className="ph-cta-primary">Browse the Menu ↓</a>
        <Link to="/franchise#inquiry" className="ph-cta-secondary">Franchise Opportunities</Link>
      </div>

    </div>

    {/* RIGHT — Cups */}
    <div style={{
      position:"relative",
      display:"flex",
      alignItems:"flex-end",
      justifyContent:"center",
      minHeight:"clamp(300px,55vh,680px)",
      width:"100%",
    }}>

      {/* Ripple rings */}
      {[0, 0.7, 1.4].map((d, i) => (
        <div key={i} aria-hidden style={{
          position:"absolute",
          width:"clamp(180px,28vw,320px)",
          height:"clamp(180px,28vw,320px)",
          borderRadius:"50%",
          border:"1.5px solid rgba(151,182,76,0.18)",
          animation:"phRingPulse 4.5s ease-out infinite",
          animationDelay:`${d}s`,
          pointerEvents:"none",
          bottom:"10%",
          left:"50%", transform:"translateX(-50%)",
        }} />
      ))}

      {/* Shadow pool */}
      <div aria-hidden style={{
        position:"absolute", bottom:0,
        left:"50%", transform:"translateX(-50%)",
        width:"80%", height:"12%",
        background:"radial-gradient(ellipse at 50% 100%, rgba(98,132,11,0.2), transparent 70%)",
        filter:"blur(20px)", pointerEvents:"none",
      }} />

      {/* Green glow behind cups */}
      <div aria-hidden style={{
        position:"absolute", bottom:"8%",
        left:"50%", transform:"translateX(-50%)",
        width:"90%", height:"60%",
        background:"radial-gradient(ellipse at 50% 80%, rgba(151,182,76,0.16) 0%, transparent 65%)",
        filter:"blur(32px)", pointerEvents:"none",
      }} />

      {/* Cup row */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", flexDirection:"row",
        alignItems:"flex-end", justifyContent:"center",
        gap:"clamp(0px,0.4vw,6px)",
        width:"100%",
      }}>
        {topDrinks.slice(0, 3).map((d, i) => {
          const scales = [0.9, 1.0, 0.88]
          return (
            <div
              key={d.id}
              className={`ph-cup-${i}`}
              style={{
                flex:"0 0 auto",
                position:"relative",
                zIndex: i === 1 ? 3 : 2,
                lineHeight:0,
              }}
            >
              <div className={`ph-float-${i}`} style={{ lineHeight:0 }}>
                <img
                  className="ph-cup-img"
                  src={d.imageUrl}
                  alt={`${d.name} — Milkshop`}
                  draggable={false}
                  style={{
                    transform:`scale(${scales[i]})`,
                    transformOrigin:"50% 100%",
                    filter:"drop-shadow(0 24px 40px rgba(40,60,20,0.18)) drop-shadow(0 6px 12px rgba(40,60,20,0.1))",
                  }}
                />
              </div>

              {/* Name label under each cup */}
              <div style={{ textAlign:"center", marginTop:6, opacity:0.7 }}>
                <span style={{
                  fontFamily:"'DM Sans', sans-serif",
                  fontSize:"10px", fontWeight:700,
                  letterSpacing:"0.1em", textTransform:"uppercase",
                  color:"#62840b",
                }}>{d.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating badge — Popping Boba */}
      <div style={{
        position:"absolute", top:"12%", right:"4%", zIndex:4,
        background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(12px)",
        borderRadius:14, padding:"9px 14px",
        border:"1px solid rgba(151,182,76,0.28)",
        boxShadow:"0 6px 20px rgba(0,0,0,0.09)",
        animation:"phFloat1 7s ease-in-out infinite",
      }}>
        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"10px", fontWeight:800, color:"#1a1e14", margin:0 }}>🫧 Popping Boba</p>
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"9px", color:"#62840b", margin:"2px 0 0", fontWeight:700 }}>Taiwan Original</p>
      </div>

      {/* Floating badge — Fresh Milk */}
      <div style={{
        position:"absolute", top:"30%", left:"2%", zIndex:4,
        background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(12px)",
        borderRadius:14, padding:"9px 14px",
        border:"1px solid rgba(151,182,76,0.28)",
        boxShadow:"0 6px 20px rgba(0,0,0,0.09)",
        animation:"phFloat0 9s ease-in-out infinite",
      }}>
        <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:"10px", fontWeight:800, color:"#1a1e14", margin:0 }}>🥛 Fresh Milk</p>
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:"9px", color:"#62840b", margin:"2px 0 0", fontWeight:700 }}>Never Powdered</p>
      </div>

    </div>
  </div>

  {/* Scroll cue */}
  <div style={{
    position:"absolute", bottom:20, left:"50%",
    transform:"translateX(-50%)",
    display:"flex", flexDirection:"column", alignItems:"center", gap:5,
    opacity:0.4, zIndex:5,
  }}>
    <div style={{
      width:1, height:40, overflow:"hidden",
      background:"rgba(98,132,11,0.2)", borderRadius:1, position:"relative",
    }}>
      <div style={{
        position:"absolute", top:0, width:"100%", height:"40%",
        background:"#97b64c", borderRadius:1,
        animation:"phScrollLine 1.8s ease-in-out infinite",
      }} />
    </div>
    <span style={{
      fontFamily:"'DM Mono', monospace",
      fontSize:"7px", letterSpacing:"0.22em",
      textTransform:"uppercase", color:"#62840b",
    }}>Scroll</span>
  </div>

</section>

      <Reveal as="section" data-track-section="Fan Favorites" className="bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Top 5 Picks
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1e1e1e] leading-tight" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Fan Favorites
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-[#97b64c] hover:text-[#62840b] transition-colors"
              style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
            >
              View Full Menu →
            </Link>
          </div>
          <DrinksCarousel />
        </div>
      </Reveal>

      {/* ══ ALL SERIES ══════════════════════════════════════════════ */}
      <section data-track-section="All Series" style={{ paddingTop: "80px", paddingBottom: "40px" }}>
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", padding: "160px 0", gap: "12px",
          }}>
            {[0, 150, 300].map(d => (
              <div key={d} style={{
                width: "12px", height: "12px", borderRadius: "50%",
                backgroundColor: "#97b64c",
                animation: "bounce 1s ease infinite",
                animationDelay: `${d}ms`,
              }} />
            ))}
          </div>
        ) : (
          CATEGORIES.map(cat =>
            grouped[cat]?.length > 0 && (
              <CategorySection key={cat} category={cat} products={grouped[cat]} />
            )
          )
        )}
      </section>

      {/* ══ REVIEWS ══════════════════════════════════════════════ */}
      <section data-track-section="Reviews" style={{
        overflow: "hidden", padding: "72px 0",
        backgroundColor: "#ffffff", borderTop: "1px solid #dde8cc",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px", marginBottom: "24px" }}>
          <div style={{ display: "flex", flexWrap: "nowrap", gap: "28px", alignItems: "stretch", justifyContent: "space-between" }}>

            <Reveal as="div" style={{ flex: "0 0 360px", minWidth: "320px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "34px", height: "2px", backgroundColor: "#97b64c" }} />
                <span style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#97b64c",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Customer Feedbacks</span>
              </div>
              <h2 style={{
                fontSize: "clamp(2rem,4vw,3rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#1e1e1e",
                lineHeight: 1.05,
                margin: "0 0 16px",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                What they<span style={{ color: "#97b64c" }}> Say</span>
              </h2>
             
              
            </Reveal>

            <Reveal
              as="div"
              delay={80}
              data-track-section="Featured Review Comment"
              style={{ flex: "1 1 auto", minWidth: "0" }}
            >
              <div style={{
                backgroundColor: "white", borderRadius: "24px", padding: "32px",
                border: "1px solid #dde8cc",
                boxShadow: "0 10px 34px rgba(151,182,76,0.12)",
              }}>
                <span style={{
                  fontSize: "4rem", lineHeight: 1,
                  color: "rgba(151,182,76,0.2)", fontFamily: "Georgia, serif",
                  userSelect: "none", display: "block", marginBottom: "8px",
                }}>"</span>
                <p key={activeReview} className="review-fadein" style={{
                  fontSize: "1rem", lineHeight: 1.8, fontWeight: 500,
                  color: "#1e1e1e", minHeight: "110px", fontFamily: "'DM Sans', sans-serif",
                }}>
                  {featured.comment}
                </p>
                <div key={`a-${activeReview}`} className="review-fadein" style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eef4e3",
                }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    backgroundColor: "#eef4e3", border: "1px solid #dde8cc",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                  }}>🧋</div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>{featured.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>{featured.handle}</p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                    {Array.from({ length: featured.stars }).map((_, i) => (
                      <span key={i} style={{ color: "#97b64c", fontSize: "14px" }}>★</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  {feedbacks.map((_, i) => (
                    <button key={i} onClick={() => setActiveReview(i)} style={{
                      borderRadius: "999px", height: "6px",
                      width: i === activeReview ? "24px" : "6px",
                      backgroundColor: i === activeReview ? "#97b64c" : "#dde8cc",
                      border: "none", cursor: "pointer",
                      transition: "all 0.3s ease", padding: 0,
                    }} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    

      <style>{`
        @keyframes marquee-left  { 0% { transform: translateX(0); }    100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0);    } }
        @keyframes reviewFadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cardFadeUp    { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce        { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .review-fadein { animation: reviewFadeIn 0.45s ease forwards; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}