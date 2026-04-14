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

const tagStyles = {
  "Best Seller": { bg: "linear-gradient(135deg,#62840b,#97b64c)", color: "#fff" },
  "Classic":     { bg: "linear-gradient(135deg,#97b64c,#b7cd7f)", color: "#fff" },
  "New":         { bg: "linear-gradient(135deg,#1e1e1e,#3a3a3a)", color: "#b7cd7f" },
  "Fan Fave":    { bg: "linear-gradient(135deg,#b7cd7f,#d4e8a0)", color: "#1e1e1e" },
  "Signature":   { bg: "linear-gradient(135deg,#2a2a2a,#1e1e1e)", color: "#97b64c" },
  "Limited":     { bg: "linear-gradient(135deg,#62840b,#4a6008)", color: "#fff" },
};

const VISIBLE = 4; // cards visible at once

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, isCenter, isAdjacent }) {
  const [hovered, setHovered] = useState(false);
  const tag = product.tag ? tagStyles[product.tag] : null;

  const scale    = hovered ? 1.01 : 1;
  const opacity  = 1;
  const yShift   = hovered ? -2 : 0;
  const shadow   = hovered
    ? "0 14px 28px rgba(98,132,11,0.2), 0 6px 18px rgba(0,0,0,0.1)"
    : "0 8px 20px rgba(98,132,11,0.12)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "220px",
        cursor: "pointer",
        transition: "transform 0.18s ease, opacity 0.18s ease",
        transform: `scale(${scale}) translateY(${yShift}px)`,
        opacity,
      }}
    >
      {/* Glass card */}
      <div style={{
        borderRadius: "24px",
        background: hovered
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1.5px solid ${hovered ? "rgba(151,182,76,0.6)" : "rgba(151,182,76,0.32)"}`,
        boxShadow: shadow,
        overflow: "hidden",
        transition: "all 0.18s ease",
        position: "relative",
      }}>

        {/* Inner glow top */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "24px",
          background: "linear-gradient(160deg, rgba(255,255,255,0.6) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Image area */}
        <div style={{
          height: "240px",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px 20px 12px",
          background: "linear-gradient(180deg, rgba(240,246,232,0.8) 0%, rgba(255,255,255,0) 100%)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Floor glow */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: "70%", height: "40px",
            background: "radial-gradient(ellipse, rgba(151,182,76,0.35) 0%, transparent 70%)",
            filter: "blur(10px)",
            opacity: hovered ? 1 : 0.45,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }} />

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              draggable={false}
              style={{
                height: "200px",
                width: "auto",
                maxWidth: "150px",
                objectFit: "contain",
                position: "relative", zIndex: 2,
                transition: "transform 0.18s ease, filter 0.18s ease",
                transform: hovered ? "scale(1.03) translateY(-2px)" : "scale(1) translateY(0)",
                filter: hovered
                  ? "drop-shadow(0 12px 20px rgba(0,0,0,0.18))"
                  : "drop-shadow(0 8px 14px rgba(0,0,0,0.1))",
                userSelect: "none",
              }}
            />
          ) : (
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg,#e8f0da,#d0e0b0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2, position: "relative",
            }}>
              <svg width="30" height="30" fill="none" stroke="#97b64c" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.5 2.121" />
              </svg>
            </div>
          )}

          {/* Tag */}
          {tag && (
            <span style={{
              position: "absolute", top: "12px", left: "12px", zIndex: 3,
              fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase", padding: "4px 10px",
              borderRadius: "999px", background: tag.bg, color: tag.color,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
            }}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{
          padding: "14px 18px 20px",
          borderTop: "1px solid rgba(151,182,76,0.1)",
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(8px)",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "0.82rem",
            color: hovered ? "#62840b" : "#1e1e1e",
            letterSpacing: "-0.01em", lineHeight: 1.3,
            margin: 0,
            transition: "color 0.15s ease",
          }}>
            {product.name}
          </p>
          {product.price && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 900, fontSize: "0.95rem",
              color: "#97b64c", marginTop: "6px", marginBottom: 0,
            }}>
              ₱{product.price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PREMIUM CAROUSEL ─────────────────────────────────────────────────────────
function PremiumCarousel({ products }) {
  const [offset, setOffset]       = useState(0); // index of first visible card
  const [dragging, setDragging]   = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const trackRef = useRef(null);
  const maxOffset = Math.max(0, products.length - VISIBLE);
  const centerIdx = offset + Math.floor(VISIBLE / 2);

  const goLeft  = () => setOffset(o => Math.max(0, o - 1));
  const goRight = () => setOffset(o => Math.min(maxOffset, o + 1));

  // ── Drag / Swipe ──
  const onDragStart = (clientX) => {
    setDragging(true);
    setDragStart(clientX);
    setDragDelta(0);
  };
  const onDragMove = useCallback((clientX) => {
    if (!dragging) return;
    setDragDelta(clientX - dragStart);
  }, [dragging, dragStart]);
  const onDragEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (dragDelta < -60)       setOffset(o => Math.min(maxOffset, o + 1));
    else if (dragDelta > 60)   setOffset(o => Math.max(0, o - 1));
    setDragDelta(0);
  }, [dragging, dragDelta, maxOffset]);

  // Mouse
  const onMouseDown = (e) => onDragStart(e.clientX);
  const onMouseMove = (e) => onDragMove(e.clientX);
  const onMouseUp   = () => onDragEnd();
  const onMouseLeave= () => { if (dragging) onDragEnd(); };

  // Touch
  const onTouchStart = (e) => onDragStart(e.touches[0].clientX);
  const onTouchMove  = (e) => onDragMove(e.touches[0].clientX);
  const onTouchEnd   = () => onDragEnd();

  const CARD_W  = 210;
  const CARD_GAP = 16;
  const translateX = offset * -(CARD_W + CARD_GAP) + (dragging ? dragDelta * 0.4 : 0);

  return (
    <div style={{ position: "relative", userSelect: "none" }}>

      {/* Track wrapper — clips overflow */}
      <div style={{ overflow: "hidden", padding: "32px 0 40px" }}>
        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            display: "flex",
            gap: `${CARD_GAP}px`,
            paddingLeft: "calc(50% - 470px)", // center group of 4
            cursor: dragging ? "grabbing" : "grab",
            transition: dragging ? "none" : "transform 0.22s ease",
            transform: `translateX(${translateX}px)`,
          }}
        >
          {products.map((p, i) => {
            const absIdx    = i;
            const isCenter  = absIdx === centerIdx;
            const isAdjacent = Math.abs(absIdx - centerIdx) === 1;
            return (
              <ProductCard
                key={p.id}
                product={p}
                isCenter={isCenter}
                isAdjacent={isAdjacent}
              />
            );
          })}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={goLeft}
        disabled={offset === 0}
        style={{
          position: "absolute", left: "16px", top: "50%",
          transform: "translateY(-50%)",
          width: "44px", height: "44px", borderRadius: "50%",
          border: `2px solid ${offset === 0 ? "rgba(151,182,76,0.2)" : "rgba(151,182,76,0.6)"}`,
          background: offset === 0
            ? "rgba(255,255,255,0.4)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          color: offset === 0 ? "#c8d8a8" : "#62840b",
          fontSize: "1.1rem", fontWeight: 800,
          cursor: offset === 0 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: offset === 0 ? "none" : "0 4px 20px rgba(98,132,11,0.25)",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        ←
      </button>

      {/* Right Arrow */}
      <button
        onClick={goRight}
        disabled={offset === maxOffset}
        style={{
          position: "absolute", right: "16px", top: "50%",
          transform: "translateY(-50%)",
          width: "44px", height: "44px", borderRadius: "50%",
          border: `2px solid ${offset === maxOffset ? "rgba(151,182,76,0.2)" : "rgba(151,182,76,0.6)"}`,
          background: offset === maxOffset
            ? "rgba(255,255,255,0.4)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          color: offset === maxOffset ? "#c8d8a8" : "#62840b",
          fontSize: "1.1rem", fontWeight: 800,
          cursor: offset === maxOffset ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: offset === maxOffset ? "none" : "0 4px 20px rgba(98,132,11,0.25)",
          transition: "all 0.3s ease",
          zIndex: 10,
        }}
      >
        →
      </button>

      {/* Dot Indicators */}
      {products.length > VISIBLE && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
          marginBottom: "70px",
        }}>
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setOffset(i)}
              style={{
                width: i === offset ? "24px" : "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: i === offset ? "#97b64c" : "#d0e0b0",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s ease",
              }}
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

// ─── CATEGORY SECTION ─────────────────────────────────────────────────────────
function CategorySection({ category, products }) {
  if (!products.length) return null;
  const seriesName = category.replace(" Series", "");
  const isBreak = category === "Bread";
  const sectionLabel = isBreak ? "Products Series: Bread" : `Products Series: ${seriesName}`;

  return (
    <section data-track-section={sectionLabel} style={{ marginBottom: "10px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "10px", padding: "0 24px" }}>
        <span style={{
          display: "inline-block",
          fontSize: "12px", fontWeight: 800, letterSpacing: "0.3em",
          textTransform: "uppercase", color: "#97b64c",
          fontFamily: "'DM Sans', sans-serif", marginBottom: "5px",
        }}>
          {isBreak ? "Bites" : "Series"}
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(1.6rem,3.2vw,2.3rem)", fontWeight: 900,
            letterSpacing: "-0.03em", color: "#1e1e1e", margin: 0,
          }}>
            {isBreak ? "Fresh " : `${seriesName} `}
            <span style={{ color: "#97b64c" }}>
              {isBreak ? "Bread" : "Series"}
            </span>
          </h2>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "10px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "999px",
            backgroundColor: "#f0f6e8", color: "#62840b",
            border: "1px solid #d0e0b0",
          }}>
            {products.length}
          </span>
        </div>
      </div>

      {/* Carousel */}
      <PremiumCarousel products={products} />

      {/* Divider */}
      <div style={{
        margin: "0 48px", height: "1px",
        background: "linear-gradient(to right, transparent, rgba(151,182,76,0.3) 30%, rgba(151,182,76,0.3) 70%, transparent)",
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
  const row1 = feedbacks.slice(0, Math.ceil(feedbacks.length / 2));
  const row2 = feedbacks.slice(Math.ceil(feedbacks.length / 2));

  return (
    <main style={{
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ══ HERO (white header) ═══════════════════════════════════ */}
      <section data-track-section="Products Hero" style={{
        position: "relative",
        overflow: "hidden",
        background: "#ffffff",
        padding: "130px 40px 100px",
        textAlign: "center",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "11px", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", padding: "8px 18px", borderRadius: "999px",
            backgroundColor: "#f0f6e8",
            color: "#62840b",
            border: "1px solid rgba(151,182,76,0.3)",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "24px",
          }}>
            🧋 The Menu
          </span>

          <h1 style={{
            fontSize: "clamp(3.5rem,8vw,6.5rem)", fontWeight: 900,
            letterSpacing: "-0.05em", lineHeight: 0.92,
            color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif",
            margin: "0 0 24px",
          }}>
            Sip the<br />
            <span style={{ color: "#97b64c" }}>Difference.</span>
          </h1>

          <p style={{
            fontSize: "1rem", lineHeight: 1.75,
            color: "#6b7a5a",
            maxWidth: "400px", margin: "0 auto 48px",
          }}>
            Taiwan's original Popping Boba — brewed fresh, never powdered, always real.
            {products.length > 0 && (
              <> <strong style={{ color: "#fff" }}>{products.length} drinks</strong> across {CATEGORIES.length} series.</>
            )}
          </p>

          {/* Stats — dark glass pill */}
          <div style={{
            display: "inline-flex", gap: "0",
            border: "1px solid rgba(151,182,76,0.18)", borderRadius: "16px",
            overflow: "hidden",
            background: "rgba(10,14,4,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(151,182,76,0.1)",
          }}>
            {[
              { value: "20+",  label: "Menu Items" },
              { value: "6",    label: "Series"     },
              { value: "100%", label: "Fresh Milk" },
            ].map((s, i) => (
              <div key={s.label} style={{
                padding: "20px 36px",
                borderRight: i < 2 ? "1px solid rgba(151,182,76,0.15)" : "none",
                textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "'DM Mono', monospace", fontWeight: 900,
                  fontSize: "1.6rem", color: "#fff", lineHeight: 1, margin: "0 0 4px",
                }}>{s.value}</p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "10px",
                  fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.18em", color: "#97b64c", margin: 0,
                }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "100px",
          background: "linear-gradient(to bottom, transparent, #f7faf2)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
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
        overflow: "hidden", padding: "96px 0",
        backgroundColor: "#ffffff", borderTop: "1px solid #dde8cc",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 48px", marginBottom: "24px" }}>
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