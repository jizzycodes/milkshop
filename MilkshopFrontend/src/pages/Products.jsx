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
{/* ══ PRODUCTS HERO — Premium Redesign ══ */}
<section
  data-track-section="Products Hero"
  style={{
    position: "relative",
    overflow: "hidden",
    background: "#f7f9f2",
    minHeight: "clamp(600px, 88vh, 900px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
  }}
>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800;900&display=swap');

    /* ── Entrance animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(36px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Cup sway (natural, not bouncy) ── */
    @keyframes sway {
      0%,100% { transform: var(--base-transform) rotate(-1.5deg); }
      50%      { transform: var(--base-transform) translateY(-14px) rotate(1.5deg); }
    }

    /* ── Shimmer on CTA ── */
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    /* ── Marquee ── */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    /* ── Blob pulse ── */
    @keyframes blobPulse {
      0%,100% { transform: scale(1) rotate(0deg); }
      50%      { transform: scale(1.04) rotate(3deg); }
    }

    /* ── Halo glow under center cup ── */
    @keyframes haloGlow {
      0%,100% { opacity: 0.55; transform: scaleX(1); }
      50%      { opacity: 0.85; transform: scaleX(1.08); }
    }

    /* ── Left content stagger ── */
    .ph-label   { opacity:0; animation: fadeUp .6s ease forwards .1s; }
    .ph-heading { opacity:0; animation: fadeUp .7s ease forwards .25s; }
    .ph-sub     { opacity:0; animation: fadeUp .6s ease forwards .4s; }
    .ph-cta-wrap{ opacity:0; animation: fadeUp .6s ease forwards .55s; }

    /* ── Cup cascade ── */
    .ph-cup-0 { opacity:0; animation: fadeIn .5s ease forwards .4s; }
    .ph-cup-1 { opacity:0; animation: fadeIn .5s ease forwards .55s; }
    .ph-cup-2 { opacity:0; animation: fadeIn .5s ease forwards .3s; }
    .ph-cup-3 { opacity:0; animation: fadeIn .5s ease forwards .55s; }
    .ph-cup-4 { opacity:0; animation: fadeIn .5s ease forwards .4s; }

    /* ── Sway per cup ── */
    .ph-cup-inner { animation: sway 9s ease-in-out infinite; }
    .ph-cup-0 .ph-cup-inner { animation-duration: 9s; }
    .ph-cup-1 .ph-cup-inner { animation-duration: 10.5s; animation-delay: -3s; }
    .ph-cup-2 .ph-cup-inner { animation-duration: 8s;  animation-delay: -1s; }
    .ph-cup-3 .ph-cup-inner { animation-duration: 11s; animation-delay: -5s; }
    .ph-cup-4 .ph-cup-inner { animation-duration: 9.5s;animation-delay: -2s; }

    /* ── CTA button ── */
    .ph-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 15px 32px;
      border-radius: 999px;
      background: linear-gradient(
        90deg,
        #62840b 0%,
        #97b64c 40%,
        #c8dc8a 55%,
        #97b64c 70%,
        #62840b 100%
      );
      background-size: 200% auto;
      color: white;
      font-weight: 800;
      font-size: 15px;
      text-decoration: none;
      letter-spacing: 0.03em;
      box-shadow: 0 12px 32px rgba(98,132,11,0.35);
      transition: box-shadow .3s, transform .3s;
      width: fit-content;
    }
    .ph-cta:hover {
      animation: shimmer 1.2s linear infinite;
      transform: translateY(-3px);
      box-shadow: 0 18px 40px rgba(98,132,11,0.45);
    }

    /* ── Cup image ── */
    .ph-cup-img {
      height: clamp(200px, 35vh, 400px);
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 24px 32px rgba(0,0,0,0.13));
    }
    @media(min-width:1024px){
      .ph-cup-img { height: clamp(280px, 48vh, 520px); }
    }

    /* ── Marquee strip ── */
    .ph-marquee-track {
      display: flex;
      width: max-content;
      animation: marquee 28s linear infinite;
    }
    .ph-marquee-track:hover { animation-play-state: paused; }

    /* ── Cup label tag ── */
    .ph-cup-tag {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(98,132,11,0.15);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #62840b;
      white-space: nowrap;
    }
    .ph-cup-tag::before {
      content:'';
      width:5px;
      height:5px;
      border-radius:50%;
      background:#97b64c;
      flex-shrink:0;
    }

    /* ── Halo under center cup ── */
    .ph-halo {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 110px;
      height: 28px;
      background: radial-gradient(ellipse, rgba(151,182,76,0.55) 0%, transparent 75%);
      filter: blur(6px);
      animation: haloGlow 3s ease-in-out infinite;
      pointer-events: none;
    }

    /* ── Shadow puddle under all cups ── */
    .ph-puddle {
      width: 60%;
      height: 10px;
      margin: 4px auto 0;
      background: radial-gradient(ellipse, rgba(0,0,0,0.09) 0%, transparent 70%);
      filter: blur(3px);
    }
  `}</style>

  {/* ── Decorative blobs (SVG, no images) ── */}
  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "-80px",
      right: "-100px",
      width: "clamp(340px,44vw,620px)",
      opacity: 0.38,
      pointerEvents: "none",
      animation: "blobPulse 12s ease-in-out infinite",
    }}
    viewBox="0 0 600 560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M480 60 C560 120 600 240 560 340 C520 440 400 500 300 490 C200 480 80 420 40 320 C0 220 40 80 140 40 C240 0 400 0 480 60Z"
      fill="url(#blob1)"
    />
    <defs>
      <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c8dc8a" />
        <stop offset="100%" stopColor="#e8f2c8" />
      </radialGradient>
    </defs>
  </svg>

  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      bottom: "20px",
      left: "-80px",
      width: "clamp(200px,28vw,380px)",
      opacity: 0.25,
      pointerEvents: "none",
      animation: "blobPulse 15s ease-in-out infinite reverse",
    }}
    viewBox="0 0 400 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M300 30 C360 80 390 180 360 270 C330 360 220 400 130 370 C40 340 -20 240 10 150 C40 60 130 -10 220 2 C270 8 290 20 300 30Z"
      fill="url(#blob2)"
    />
    <defs>
      <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#97b64c" />
        <stop offset="100%" stopColor="#d4e8a0" />
      </radialGradient>
    </defs>
  </svg>

  {/* ── Subtle dot grid texture ── */}
  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.18,
      pointerEvents: "none",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="#62840b" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgrid)" />
  </svg>

  {/* ── Main content grid ── */}
  <div
    style={{
      position: "relative",
      zIndex: 10,
      maxWidth: 1280,
      margin: "0 auto",
      padding: "100px 40px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1.4fr",
      gap: 40,
      alignItems: "center",
    }}
    className="max-lg:grid-cols-1"
  >
    {/* ── LEFT ── */}
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* Label */}
      <div className="ph-label" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 28, height: 2, background: "#97b64c", display: "block", borderRadius: 2 }} />
        <span style={{ fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: "#62840b" }}>
          THE MENU
        </span>
      </div>

      {/* Heading */}
      <h1
        className="ph-heading"
        style={{
          fontSize: "clamp(3.2rem,6.2vw,5.8rem)",
          fontWeight: 900,
          lineHeight: 0.92,
          margin: 0,
          color: "#1a1e14",
          letterSpacing: "-0.02em",
        }}
      >
        Sip the <br />
        <span
          style={{
            background: "linear-gradient(135deg,#62840b 0%,#97b64c 50%,#b7cd7f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Difference.
        </span>
      </h1>

      {/* Subtext */}
      <p
        className="ph-sub"
        style={{
          color: "#4d5c3a",
          maxWidth: 380,
          fontSize: "clamp(14px,1.1vw,16px)",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        Premium milk tea crafted fresh — no powders, only real ingredients.
      </p>

      {/* CTA */}
      <div className="ph-cta-wrap">
        <a href="#menu" className="ph-cta">
          Browse Menu
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Trust micro-line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 4,
          opacity: 0,
          animation: "fadeUp .6s ease forwards .7s",
        }}
      >
        {["Real Tea", "No Powders", "Fresh Daily"].map((t) => (
          <span
            key={t}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#97b64c",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#97b64c", display:"inline-block" }} />
            {t}
          </span>
        ))}
      </div>
    </div>

    {/* ── RIGHT — 5 CUP ARC ── */}
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: "clamp(2px, 0.8vw, 10px)",
      }}
    >
      {topDrinks.slice(0, 5).map((d, i) => {
        const scales     = [0.72, 0.88, 1.14, 0.88, 0.72]
        const translateY = [44, 22, 0, 22, 44]
        const rotations  = [-4, -2, 0, 2, 4]
        const isCenter   = i === 2

        return (
          <div
            key={d.id}
            className={`ph-cup-${i}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transform: `translateY(${translateY[i]}px) scale(${scales[i]}) rotate(${rotations[i]}deg)`,
              zIndex: isCenter ? 5 : 3,
              position: "relative",
            }}
          >
            {/* Sway wrapper */}
            <div
              className="ph-cup-inner"
              style={{ "--base-transform": `translateY(${translateY[i]}px)` }}
            >
              <img
                src={d.imageUrl}
                alt={d.name}
                className="ph-cup-img"
                draggable={false}
              />

              {/* Halo glow under center cup only */}
              {isCenter && <div className="ph-halo" />}
            </div>

            {/* Shadow puddle */}
            <div className="ph-puddle" />

            {/* Name tag */}
            <div className="ph-cup-tag">
              {d.name}
            </div>
          </div>
        )
      })}
    </div>
  </div>

  {/* ── Marquee strip at the bottom ── */}
  <div
    style={{
      position: "relative",
      zIndex: 10,
      borderTop: "1px solid rgba(98,132,11,0.12)",
      borderBottom: "1px solid rgba(98,132,11,0.12)",
      background: "rgba(255,255,255,0.55)",
      backdropFilter: "blur(4px)",
      padding: "11px 0",
      overflow: "hidden",
    }}
  >
    <div className="ph-marquee-track">
      {[...Array(2)].map((_, repeat) =>
        (topDrinks || []).concat([
          { id: "sep1", name: "★ Black Sugar Boba" },
          { id: "sep2", name: "★ Signature Taiwanese" },
          { id: "sep3", name: "★ Milku Strawberry" },
          { id: "sep4", name: "★ Cheesecake Boba" },
          { id: "sep5", name: "★ Passion Fruit Canon" },
          { id: "sep6", name: "★ Brown Sugar Fresh Milk" },
        ]).map((d, j) => (
          <span
            key={`${repeat}-${d.id || j}`}
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: j % 3 === 0 ? "#62840b" : "#97b64c",
              padding: "0 28px",
              whiteSpace: "nowrap",
            }}
          >
            {d.name?.toUpperCase() || "MILKSHOP"}
          </span>
        ))
      )}
    </div>
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