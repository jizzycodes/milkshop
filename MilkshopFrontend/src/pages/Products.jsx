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

const PRODUCTS_HERO_IMAGE = "/products/products-hero.webp";
const PRODUCTS_HERO_FALLBACK = "/closer.webp";

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
      <div className="prod-container prod-container--wide" style={{ marginBottom: "16px" }}>
        <h2 className="ms-section-heading" style={{ color: "#1e1e1e" }}>
          {isBreak ? (
            <span style={{ color: "#97b64c" }}>Fresh </span>
          ) : (
            <span style={{ color: "#97b64c" }}>{seriesName} </span>
          )}
          <span style={{ color: "#1e1e1e" }}>
            {isBreak ? "Bread" : "Series"}
          </span>
        </h2>
      </div>

      {/* Carousel */}
      <SeriesCupsGrid products={products} />

      {!isBreak && (
        <div className="prod-category-divider" style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(151,182,76,0.25) 20%, rgba(151,182,76,0.25) 80%, transparent)",
        }} />
      )}
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
  const [heroImg, setHeroImg] = useState(PRODUCTS_HERO_IMAGE);
  const [heroAnimReady, setHeroAnimReady] = useState(false);

  useEffect(() => {
    const startAnim = () => setHeroAnimReady(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAnim();
      return undefined;
    }
    const raf = requestAnimationFrame(() => startAnim());
    return () => cancelAnimationFrame(raf);
  }, []);

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

        @keyframes heroFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes locHeroFadeLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes locHeroScrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .loc-hero-h1, .loc-hero-p, .loc-hero-tag { opacity: 0; }
        .loc-hero--ready .loc-hero-tag { animation: heroFadeUp 0.6s ease forwards; animation-delay: 0.12s; }
        .loc-hero--ready .loc-hero-h1 { animation: locHeroFadeLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.25s; }
        .loc-hero--ready .loc-hero-p  { animation: heroFadeUp 0.7s ease forwards; animation-delay: 0.45s; }
        .loc-hero-scroll-bar { opacity: 0; }
        .loc-hero--ready .loc-hero-scroll-bar { opacity: 1; animation: locHeroScrollLine 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .loc-hero-h1, .loc-hero-p, .loc-hero-tag, .loc-hero-scroll-bar {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
        }
        .loc-hero {
          min-height: 83svh;
        }
        .loc-hero-content {
          padding: 100px 20px 64px;
        }
        .loc-hero-h1-text {
          font-size: clamp(2.4rem, 10vw, 3.4rem);
        }
        @media (max-width: 767px) {
          .loc-hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .loc-hero-tag,
          .loc-hero-h1,
          .loc-hero-p {
            width: 100%;
            text-align: center;
          }
          .loc-hero-h1-text {
            text-align: center;
          }
          .loc-hero--ready .loc-hero-h1 {
            animation: heroFadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            animation-delay: 0.25s;
          }
        }
        @media (min-width: 901px) {
          .loc-hero { min-height: 90vh; }
          .loc-hero-content { padding: 120px 48px 72px; }
          .loc-hero-h1-text { font-size: clamp(3.2rem, 5.5vw, 5.2rem); }
        }
      `}</style>

      {/* ══ PRODUCTS HERO — Locations-style blurred image ══ */}
      <section
        className={`loc-hero${heroAnimReady ? " loc-hero--ready" : ""}`}
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            background: "#141c0a",
          }}
        >
          <img
            src={heroImg}
            alt=""
            onError={() => {
              if (heroImg !== PRODUCTS_HERO_FALLBACK) setHeroImg(PRODUCTS_HERO_FALLBACK);
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              filter: "blur(4px) brightness(0.72) saturate(0.88)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(158deg, rgba(18,26,8,0.62) 0%, rgba(24,34,12,0.50) 40%, rgba(20,30,10,0.58) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(10,18,4,0.35) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="loc-hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 900,
            margin: "0 auto",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div className="loc-hero-tag" style={{ marginBottom: 16 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#b7cd7f",
              }}
            >
              The Menu
            </p>
          </div>

          <div className="loc-hero-h1">
            <h1
              className="loc-hero-h1-text"
              style={{
                margin: 0,
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                color: "#F6F1E7",
                textShadow: "0 6px 30px rgba(0,0,0,0.38)",
              }}
            >
              Sip the{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #A6C44A 0%, #C8D97B 45%, #E2C078 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                }}
              >
                Difference
              </span>
            </h1>
          </div>

          <div className="loc-hero-p" style={{ marginTop: 20 }}>
            <p
              style={{
                margin: "0 auto",
                maxWidth: 520,
                fontSize: "clamp(0.92rem, 1.35vw, 1.05rem)",
                lineHeight: 1.85,
                color: "rgba(246,241,231,0.72)",
                fontWeight: 400,
                textShadow: "0 2px 18px rgba(0,0,0,0.22)",
              }}
            >
              Premium milk tea crafted fresh — no powders, only real ingredients.
            </p>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.65,
          }}
        >
          <div
            style={{
              width: 1,
              height: 40,
              overflow: "hidden",
              background: "rgba(98,132,11,0.25)",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <div
              className="loc-hero-scroll-bar"
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "40%",
                background: "#97b64c",
                borderRadius: 1,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 8,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#b7cd7f",
            }}
          >
            Scroll
          </span>
        </div>
      </section>

      <Reveal as="section" className="bg-white prod-section-pad overflow-hidden">
        <div className="prod-container prod-container--wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#97b64c] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}>
                Top 5 Picks
              </p>
              <h2 className="ms-section-heading" style={{ color: "#1e1e1e" }}>
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