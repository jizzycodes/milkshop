import { useState, useEffect, useRef, useCallback } from "react";
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
  { id: 1,  name: "Angelica R.",  handle: "@angelicar_ph",  stars: 5, comment: "Our favorite MilkTea shop!!! Pinaka nagustuhan namin of all milktea places" },
  { id: 2,  name: "Miguel T.",    handle: "@migueltravels", stars: 5, comment: "yummers talaga ang milktea nyo..ni-recommend ko to sa mga friends ko at nasiyahan naman sila" },
  { id: 3,  name: "Trisha Mae",   handle: "@trishafoods",   stars: 5, comment: "sobrang sarap talaga ng Milkshop! walang wala sa mga big names sa milk tea industry. this is our favorite talaga. worth the money" },
  { id: 4,  name: "Carlo B.",     handle: "@carloeats",     stars: 5, comment: "the kids love it. They also granted my request for the birthday note. Thank you so much highly recommended" },
  { id: 5,  name: "Diane L.",     handle: "@dianelim.ph",   stars: 5, comment: "Unexpected taste for its cheap price! This is actually better than those popular milktea shop. Definitely will reorder" },
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

// ─── SERIES CUPS GRID (all products visible: image + name only) ───────────────
function SeriesCupsGrid({ products }) {
  return (
    <>
      <style>{`
        .series-cups-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(24px, 3vw, 40px);
          justify-items: center;
          align-items: start;
        }
        @media (min-width: 640px) {
          .series-cups-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 900px) {
          .series-cups-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .series-cups-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
        .series-cups-item {
          width: 100%;
          max-width: 260px;
        }
      `}</style>
      <div className="prod-container prod-container--wide pb-10">
        <div className="series-cups-grid">
        {products.map((product) => (
          <article
            key={product.id}
            className="series-cups-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: "100%",
                minHeight: "clamp(260px, 40vw, 400px)",
                marginBottom: "16px",
              }}
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  draggable={false}
                  style={{
                    width: "auto",
                    height: "clamp(260px, 40vw, 400px)",
                    maxWidth: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.12))",
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-center w-full"
                  style={{ height: "clamp(260px, 40vw, 400px)", color: "#97b64c" }}
                  aria-hidden
                >
                  <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.121" />
                  </svg>
                </div>
              )}
            </div>
            <h3
              style={{
                fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
                fontSize: "clamp(1.05rem, 1.8vw, 1.35rem)",
                fontWeight: 700,
                color: "#1e1e1e",
                textAlign: "center",
                lineHeight: 1.3,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {product.name}
            </h3>
          </article>
        ))}
        </div>
      </div>
    </>
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
  return (
    <section style={{ marginBottom: "20px" }}>

      {/* Section Header */}
      <div className="prod-category-header" style={{ textAlign: "center", marginBottom: "16px" }}>

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
          <h2 className="ms-section-heading" style={{ color: "#1e1e1e" }}>
            {isBreak ? (
              <span style={{ color: "#1e1e1e" }}>Fresh </span>
            ) : (
              <span style={{ color: "#97b64c" }}>{seriesName} </span>
            )}
            <span style={{ color: "#1e1e1e" }}>
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
      <SeriesCupsGrid products={products} />

      {/* Section Divider */}
      <div className="prod-category-divider" style={{
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
    <div style={{ overflow: "hidden", padding: "8px 0" }}>
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

  const scrollToMenu = useCallback((e) => {
    e.preventDefault();
    const el = document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `${window.location.pathname}#menu`);
    }
  }, []);

  return (
    <main style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        .ms-section-heading {
          margin: 0;
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: clamp(1.75rem, 5.2vw, 3.4rem);
          font-weight: 900;
          line-height: 1.15;
          letter-spacing: -0.04em;
          color: #62840b;
        }

        .prod-container {
          width: 100%;
          max-width: min(1100px, 100%);
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
          box-sizing: border-box;
        }
        .prod-container--wide { max-width: min(1440px, 100%); }
        @media (min-width: 768px) {
          .prod-container { padding-left: 32px; padding-right: 32px; }
        }
        @media (min-width: 1024px) {
          .prod-container { padding-left: 48px; padding-right: 48px; }
        }

        .prod-section-pad { padding: 56px 0; }
        @media (min-width: 768px) {
          .prod-section-pad { padding: 72px 0; }
        }

        .prod-category-header { padding: 0 4px; }
        @media (min-width: 768px) {
          .prod-category-header { padding: 0 24px; }
        }

        .prod-category-divider { margin: 0 20px; }
        @media (min-width: 768px) {
          .prod-category-divider { margin: 0 48px; }
        }
        @media (min-width: 1024px) {
          .prod-category-divider { margin: 0 80px; }
        }

        .prod-reviews-layout {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (min-width: 900px) {
          .prod-reviews-layout {
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 28px;
            align-items: stretch;
            justify-content: space-between;
          }
        }

        .prod-reviews-intro {
          flex: none;
          width: 100%;
          min-width: 0;
          text-align: left;
        }
        @media (min-width: 900px) {
          .prod-reviews-intro {
            flex: 0 0 360px;
            min-width: 320px;
          }
        }

        .prod-review-card {
          padding: 24px 20px;
        }
        @media (min-width: 768px) {
          .prod-review-card { padding: 32px; }
        }

        .prod-review-dot {
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .prod-review-dot span {
          display: block;
          border-radius: 999px;
          height: 6px;
          transition: all 0.3s ease;
        }

        .prod-menu-section {
          padding-top: 56px;
          padding-bottom: 32px;
        }
        @media (min-width: 768px) {
          .prod-menu-section {
            padding-top: 80px;
            padding-bottom: 40px;
          }
        }
      `}</style>


{/* ══ PRODUCTS HERO — Mobile-First Redesign ══ */}
<section
  style={{
    position: "relative",
    overflow: "hidden",
    background: "#f7f9f2",
    fontFamily: "'DM Sans', sans-serif",
  }}
>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes sway {
      0%,100% { transform: var(--base-tx, translateX(0)) rotate(var(--rot-base, 0deg)); }
      50%      { transform: var(--base-tx, translateX(0)) translateY(-10px) rotate(var(--rot-peak, 0deg)); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes blobPulse {
      0%,100% { transform: scale(1) rotate(0deg); }
      50%      { transform: scale(1.04) rotate(3deg); }
    }
    @keyframes haloGlow {
      0%,100% { opacity: 0.5; transform: translateX(-50%) scaleX(1); }
      50%      { opacity: 0.8; transform: translateX(-50%) scaleX(1.1); }
    }

    /* Stagger reveals */
    .ph-label    { opacity:0; animation: fadeUp .55s ease forwards .08s; }
    .ph-heading  { opacity:0; animation: fadeUp .65s ease forwards .2s; }
    .ph-sub      { opacity:0; animation: fadeUp .55s ease forwards .32s; }
    .ph-cta-wrap { opacity:0; animation: fadeUp .55s ease forwards .44s; }
    .ph-trust    { opacity:0; animation: fadeUp .55s ease forwards .56s; }

    /* Cup stagger */
    .ph-cup-0 { opacity:0; animation: fadeIn .5s ease forwards .35s; }
    .ph-cup-1 { opacity:0; animation: fadeIn .5s ease forwards .48s; }
    .ph-cup-2 { opacity:0; animation: fadeIn .5s ease forwards .25s; }
    .ph-cup-3 { opacity:0; animation: fadeIn .5s ease forwards .48s; }
    .ph-cup-4 { opacity:0; animation: fadeIn .5s ease forwards .35s; }

    /* Sway per cup */
    .ph-cup-0 .ph-sway { animation: sway 9s ease-in-out infinite; --rot-base: -1deg; --rot-peak: 1deg; }
    .ph-cup-1 .ph-sway { animation: sway 10.5s ease-in-out infinite; animation-delay: -3s; --rot-base: -0.5deg; --rot-peak: 0.5deg; }
    .ph-cup-2 .ph-sway { animation: sway 8s ease-in-out infinite; animation-delay: -1s; --rot-base: -1.5deg; --rot-peak: 1.5deg; }
    .ph-cup-3 .ph-sway { animation: sway 11s ease-in-out infinite; animation-delay: -5s; --rot-base: -0.5deg; --rot-peak: 0.5deg; }
    .ph-cup-4 .ph-sway { animation: sway 9.5s ease-in-out infinite; animation-delay: -2s; --rot-base: -1deg; --rot-peak: 1deg; }

    /* ── LAYOUT ── */
    .ph-wrapper {
      position: relative;
      z-index: 10;
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    /* Mobile: stacked — text → cups → trust */
    .ph-layout {
      display: flex;
      flex-direction: column;
      padding: 64px 24px 0;
      gap: 0;
    }

    .ph-left {
      display: flex;
      flex-direction: column;
      gap: 16px;
      order: 1;
    }

    /* Cups stage mobile */
    .ph-cups-stage {
      order: 2;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      width: 100%;
      height: clamp(260px, 48vw, 380px);
      margin-top: 28px;
      overflow: visible;
    }

    .ph-cup-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
    }

    /* Mobile: only 3 cups, tighter arc */
    .ph-cup-col.hide-mobile { display: none; }

    /* Desktop overrides */
    @media (min-width: 1024px) {
      .ph-layout {
        flex-direction: row;
        align-items: center;
        padding: 100px 48px 0;
        gap: 40px;
        min-height: clamp(600px, 80vh, 880px);
      }
      .ph-left {
        flex: 0 0 auto;
        width: 42%;
        order: 1;
        gap: 22px;
      }
      .ph-cups-stage {
        order: 2;
        flex: 1;
        height: clamp(440px, 72vh, 780px);
        margin-top: 0;
        align-items: flex-end;
      }
      .ph-cup-col.hide-mobile { display: flex; }
    }

    /* Cup image sizing */
    .ph-cup-img {
      display: block;
      object-fit: contain;
      filter: drop-shadow(0 20px 28px rgba(0,0,0,0.12));
      width: auto;
    }

    /* Mobile cup sizes */
    .ph-img-side   { height: clamp(140px, 28vw, 200px); }
    .ph-img-mid    { height: clamp(170px, 34vw, 240px); }
    .ph-img-center { height: clamp(200px, 40vw, 300px); }

    /* Desktop cup sizes */
    @media (min-width: 1024px) {
      .ph-img-side   { height: clamp(260px, 34vh, 400px); }
      .ph-img-mid    { height: clamp(320px, 42vh, 470px); }
      .ph-img-center { height: clamp(380px, 52vh, 560px); }
    }

    /* Arc positions — mobile (3 cups: index 0,2,4 → positions left, center, right) */
    .ph-pos-0 { left: 5%;  transform: rotate(-4deg); z-index: 2; }
    .ph-pos-2 { left: 50%; transform: translateX(-50%) rotate(0deg); z-index: 5; }
    .ph-pos-4 { right: 5%; transform: rotate(4deg); z-index: 2; }

    /* Desktop 5-cup arc */
    @media (min-width: 1024px) {
      .ph-pos-0 { left: 2%;   transform: rotate(-5deg);  z-index: 2; }
      .ph-pos-1 { left: 22%;  transform: rotate(-2.5deg); z-index: 3; }
      .ph-pos-2 { left: 50%;  transform: translateX(-50%) rotate(0deg); z-index: 5; }
      .ph-pos-3 { right: 22%; transform: rotate(2.5deg);  z-index: 3; }
      .ph-pos-4 { right: 2%;  transform: rotate(5deg);    z-index: 2; }
    }

    /* Halo under center */
    .ph-halo {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 22px;
      background: radial-gradient(ellipse, rgba(151,182,76,0.6) 0%, transparent 72%);
      filter: blur(5px);
      animation: haloGlow 3s ease-in-out infinite;
      pointer-events: none;
    }

    /* Shadow puddle */
    .ph-puddle {
      width: 55%;
      height: 8px;
      margin: 2px auto 0;
      background: radial-gradient(ellipse, rgba(0,0,0,0.08) 0%, transparent 70%);
      filter: blur(2px);
    }

    /* Cup name tag */
    .ph-cup-tag {
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(98,132,11,0.15);
      border-radius: 999px;
      padding: 3px 9px;
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #62840b;
      white-space: nowrap;
      max-width: min(28vw, 140px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ph-cup-tag::before {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #97b64c;
      flex-shrink: 0;
    }

    @media (min-width: 1024px) {
      .ph-cup-tag {
        font-size: 9px;
        max-width: min(14vw, 180px);
        padding: 4px 10px;
      }
    }

    /* Trust badges */
    .ph-trust {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    /* CTA */
    .ph-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 48px;
      padding: 14px 28px;
      border-radius: 999px;
      background: #62840b;
      color: white;
      font-weight: 800;
      font-size: 15px;
      font-family: 'DM Sans', sans-serif;
      text-decoration: none;
      letter-spacing: 0.03em;
      box-shadow: 0 10px 28px rgba(98,132,11,0.32);
      transition: background 0.22s ease, box-shadow 0.25s ease, transform 0.22s ease;
      width: fit-content;
      -webkit-tap-highlight-color: transparent;
    }
    .ph-cta:hover {
      background: #536f09;
      transform: translateY(-2px);
      box-shadow: 0 16px 36px rgba(98,132,11,0.42);
    }
    .ph-cta:active { transform: translateY(0); }

    /* Marquee */
    .ph-marquee-track {
      display: flex;
      width: max-content;
      animation: marquee 26s linear infinite;
    }
    .ph-marquee-track:hover { animation-play-state: paused; }
  `}</style>

  {/* ── Decorative blobs ── */}
  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      top: "-80px",
      right: "-100px",
      width: "clamp(280px,40vw,580px)",
      opacity: 0.36,
      pointerEvents: "none",
      animation: "blobPulse 12s ease-in-out infinite",
    }}
    viewBox="0 0 600 560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M480 60 C560 120 600 240 560 340 C520 440 400 500 300 490 C200 480 80 420 40 320 C0 220 40 80 140 40 C240 0 400 0 480 60Z"
      fill="url(#blob1h)"
    />
    <defs>
      <radialGradient id="blob1h" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c8dc8a" />
        <stop offset="100%" stopColor="#e8f2c8" />
      </radialGradient>
    </defs>
  </svg>

  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      bottom: "60px",
      left: "-80px",
      width: "clamp(160px,24vw,340px)",
      opacity: 0.22,
      pointerEvents: "none",
      animation: "blobPulse 15s ease-in-out infinite reverse",
    }}
    viewBox="0 0 400 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M300 30 C360 80 390 180 360 270 C330 360 220 400 130 370 C40 340 -20 240 10 150 C40 60 130 -10 220 2 C270 8 290 20 300 30Z"
      fill="url(#blob2h)"
    />
    <defs>
      <radialGradient id="blob2h" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#97b64c" />
        <stop offset="100%" stopColor="#d4e8a0" />
      </radialGradient>
    </defs>
  </svg>

  {/* ── Dot grid ── */}
  <svg
    aria-hidden="true"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.16,
      pointerEvents: "none",
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="dotgridh" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="#62840b" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgridh)" />
  </svg>

  {/* ── Main ── */}
  <div className="ph-wrapper">
    <div className="ph-layout">

      {/* LEFT */}
      <div className="ph-left">

        <div className="ph-label" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 26, height: 2, background: "#97b64c", display: "block", borderRadius: 2 }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", fontWeight: 800, color: "#62840b" }}>
            THE MENU
          </span>
        </div>

        <h1
          className="ph-heading"
          style={{
            fontSize: "clamp(2.8rem,5.8vw,5.6rem)",
            fontWeight: 900,
            lineHeight: 0.93,
            margin: 0,
            color: "#1a1e14",
            letterSpacing: "-0.025em",
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

        <p
          className="ph-sub"
          style={{
            color: "#4d5c3a",
            maxWidth: 360,
            fontSize: "clamp(13px,1.05vw,15px)",
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          Premium milk tea crafted fresh — no powders, only real ingredients.
        </p>

        <div className="ph-cta-wrap">
          <a href="#menu" className="ph-cta" onClick={scrollToMenu}>
            Browse Menu
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        <div className="ph-trust">
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
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#97b64c", display: "inline-block" }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT — Cups arc */}
      <div className="ph-cups-stage">
        {topDrinks.slice(0, 5).map((d, i) => {
          const isCenter = i === 1  // index 1 in the visible set of 3 for mobile
          const posClass = `ph-pos-${i}`
          // Mobile: hide indices 1 and 3 (show 0, 2, 4)
          const hideMobile = i === 1 || i === 3
          // Size class
          const sizeClass = i === 2
            ? "ph-img-center"
            : (i === 1 || i === 3)
            ? "ph-img-mid"
            : "ph-img-side"
          // For the actual center cup (i===2), show halo
          const showHalo = i === 2

          return (
            <div
              key={d.id}
              className={`ph-cup-col ph-cup-${i} ${posClass}${hideMobile ? " hide-mobile" : ""}`}
            >
              <div className="ph-sway" style={{ position: "relative" }}>
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className={`ph-cup-img ${sizeClass}`}
                  draggable={false}
                />
                {showHalo && <div className="ph-halo" />}
              </div>
              <div className="ph-puddle" />
              <div className="ph-cup-tag">{d.name}</div>
            </div>
          )
        })}
      </div>

    </div>
  </div>

  {/* ── Marquee strip ── */}
  <div
    style={{
      position: "relative",
      zIndex: 10,
      borderTop: "1px solid rgba(98,132,11,0.11)",
      borderBottom: "1px solid rgba(98,132,11,0.11)",
      background: "rgba(255,255,255,0.52)",
      backdropFilter: "blur(4px)",
      padding: "10px 0",
      overflow: "hidden",
      marginTop: "clamp(28px,5vw,56px)",
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
              padding: "0 24px",
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

      <Reveal as="section" className="bg-white prod-section-pad overflow-hidden">
        <div className="prod-container prod-container--wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Top 5 Picks
              </p>
              <h2 className="ms-section-heading">
                Fan Favorites
              </h2>
            </div>
           
          </div>
          <DrinksCarousel />
        </div>
      </Reveal>

      {/* ══ ALL SERIES ══════════════════════════════════════════════ */}
      <section
        id="menu"
        className="prod-menu-section"
        style={{ scrollMarginTop: 96 }}
      >
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
      <section className="prod-section-pad" style={{
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #dde8cc",
      }}>
        <div className="prod-container" style={{ marginBottom: "24px" }}>
          <div className="prod-reviews-layout">

            <Reveal as="div" className="prod-reviews-intro">
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
              <h2 className="ms-section-heading" style={{ margin: "0 0 16px", color: "#1e1e1e" }}>
                What they Say
              </h2>
             
              
            </Reveal>

            <Reveal
              as="div"
              delay={80}
              style={{ flex: "1 1 auto", minWidth: "0" }}
            >
              <div className="prod-review-card" style={{
                backgroundColor: "white", borderRadius: "24px",
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
                <div style={{ display: "flex", gap: "4px", marginTop: "16px", flexWrap: "wrap" }}>
                  {feedbacks.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="prod-review-dot"
                      onClick={() => setActiveReview(i)}
                      aria-label={`Show review ${i + 1}`}
                    >
                      <span style={{
                        width: i === activeReview ? "24px" : "6px",
                        backgroundColor: i === activeReview ? "#97b64c" : "#dde8cc",
                      }} />
                    </button>
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
      `}</style>
    </main>
  );
}