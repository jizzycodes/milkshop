import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"

// ─── DATA ────────────────────────────────────────────────────────────────────

const categories = ["All", "Milk Tea", "Fruit Tea", "Popping Boba", "Seasonal"];

const products = [
  {
    id: 1,
    category: "Milk Tea",
    name: "Black Sugar Boba Milk Tea",
    description: "Tiger-stripe signature with chewy pearls and fresh milk. The drink that started it all.",
    price: 99,
    tag: "Best Seller",
    popular: true,
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png",
  },
  {
    id: 2,
    category: "Milk Tea",
    name: "Signature Taiwanese Milk Tea",
    description: "The purest expression of Taiwan milk tea. Smooth, clean, and perfectly balanced.",
    price: 99,
    tag: "Classic",
    popular: false,
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A2%20Signature%20Taiwanese%20Milk%20Tea.png",
  },
  {
    id: 3,
    category: "Milk Tea",
    name: "Chocolate Pearl Milk Tea",
    description: "Rich Belgian chocolate blended with fresh milk and dark pearl boba.",
    price: 105,
    tag: null,
    popular: false,
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A3%20Chocolate%20Pearl%20Milk%20Tea.png",
  },
  {
    id: 4,
    category: "Milk Tea",
    name: "Matcha Black Sugar Pearl",
    description: "Japanese matcha meets our signature black sugar. Bold, earthy, and unforgettable.",
    price: 109,
    tag: "New",
    popular: true,
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A4%20Matcha%20BLACK%20SUGAR%20PEARL%20Milk%20Tea.png",
  },
  {
    id: 5,
    category: "Milk Tea",
    name: "Taro Milk Tea",
    description: "Creamy purple taro blend — sweet, smooth, and deeply satisfying.",
    price: 105,
    tag: "Fan Fave",
    popular: true,
    imageUrl: null,
  },
  {
    id: 6,
    category: "Fruit Tea",
    name: "Strawberry Fruit Tea",
    description: "Real strawberry with a refreshing green tea base. Light, bright, and fruity.",
    price: 99,
    tag: "Fan Fave",
    popular: true,
    imageUrl: null,
  },
  {
    id: 7,
    category: "Fruit Tea",
    name: "Peach Oolong Tea",
    description: "Sweet peach meets floral oolong — light, aromatic, and beautifully layered.",
    price: 99,
    tag: null,
    popular: false,
    imageUrl: null,
  },
  {
    id: 8,
    category: "Fruit Tea",
    name: "Lemon Green Tea",
    description: "Zesty fresh lemon with crisp green tea. Your perfect everyday sip.",
    price: 89,
    tag: null,
    popular: false,
    imageUrl: null,
  },
  {
    id: 9,
    category: "Popping Boba",
    name: "Mango Popping Boba",
    description: "Tropical mango tea bursting with Taiwanese popping boba on every sip.",
    price: 115,
    tag: "Signature",
    popular: true,
    imageUrl: null,
  },
  {
    id: 10,
    category: "Popping Boba",
    name: "Grape Popping Boba",
    description: "Concord grape base with juicy grape-filled boba pearls. Bold and refreshing.",
    price: 115,
    tag: "New",
    popular: false,
    imageUrl: null,
  },
  {
    id: 11,
    category: "Popping Boba",
    name: "Lychee Popping Boba",
    description: "Delicate lychee tea with floral notes and popping boba that bursts with every sip.",
    price: 115,
    tag: null,
    popular: false,
    imageUrl: null,
  },
  {
    id: 12,
    category: "Seasonal",
    name: "Ube Cream Special",
    description: "Limited ube milk tea topped with velvety cream cheese foam. Get it while it lasts.",
    price: 125,
    tag: "Limited",
    popular: true,
    imageUrl: null,
  },
  {
    id: 13,
    category: "Seasonal",
    name: "Pandan Milk Tea",
    description: "Southeast Asian pandan with creamy milk — a local × Taiwan fusion you won't forget.",
    price: 119,
    tag: "Limited",
    popular: false,
    imageUrl: null,
  },
];

const feedbacks = [
  { id: 1, name: "Angelica R.", handle: "@angelicar_ph", stars: 5, comment: "Best milk tea I've ever had in the Philippines! The black sugar boba is INSANE. Already on my 5th visit this month 😭🧋", photo: null },
  { id: 2, name: "Miguel T.", handle: "@migueltravels", stars: 5, comment: "The popping boba is on another level. You can actually taste the real fruit juice when it bursts. Nothing like it in Manila.", photo: null },
  { id: 3, name: "Trisha Mae", handle: "@trishafoods", stars: 5, comment: "Finally a milk tea brand that uses ACTUAL fresh milk! You can taste the difference. The matcha pearl is my forever go-to 💚", photo: null },
  { id: 4, name: "Carlo B.", handle: "@carloeats", stars: 5, comment: "Ordered the taro and the chocolate pearl. Both were 10/10. The queue was long but 100% worth it. Will be back tomorrow lol", photo: null },
  { id: 5, name: "Diane L.", handle: "@dianelim.ph", stars: 5, comment: "The brown sugar milk tea here hits different. Tiger stripes are real, the pearls are chewy, the milk is fresh. Taiwanese quality for real 🇹🇼", photo: null },
  { id: 6, name: "Nico S.", handle: "@nicosip", stars: 5, comment: "My friends dragged me here and now I'm the one dragging everyone else. The lychee popping boba is addicting.", photo: null },
  { id: 7, name: "Justine A.", handle: "@justineandco", stars: 5, comment: "Visited the Cebu branch and it was packed! Staff was super friendly and drinks came out fast. The ube cream special is a must-try.", photo: null },
  { id: 8, name: "Rachel P.", handle: "@rachelpdiary", stars: 5, comment: "Milkshop is the only milk tea that makes me feel like I'm actually in Taiwan. Every sip is just *chef's kiss* 🫧", photo: null },
];

const feedbacksRow1 = [...feedbacks, ...feedbacks];
const feedbacksRow2 = [...feedbacks].reverse().concat([...feedbacks].reverse());

// ─── TAG CONFIG ──────────────────────────────────────────────────────────────

const tagStyles = {
  "Best Seller": { bg: "#E8A020", color: "#fff"     },
  "Classic":     { bg: "#97b64c", color: "#fff"     },
  "New":         { bg: "#62840b", color: "#fff"     },
  "Fan Fave":    { bg: "#b7cd7f", color: "#1e1e1e"  },
  "Signature":   { bg: "#1e1e1e", color: "#b7cd7f"  },
  "Limited":     { bg: "#7c3aed", color: "#fff"     },
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, index }) {
  const tag = tagStyles[product.tag];

  return (
    <Reveal
      as="div"
      delay={index * 40}
      className="group relative bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* ── IMAGE ZONE ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: "220px", backgroundColor: "#f7f9f3" }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105 drop-shadow-md"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: "#eef4e3" }}
            >
              🧋
            </div>
            <p className="text-xs font-medium" style={{ color: "#b7cd7f", fontFamily: "'DM Sans', sans-serif" }}>
              Photo coming soon
            </p>
          </div>
        )}

        {/* Tag */}
        {product.tag && tag && (
          <span
            className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
            style={{
              backgroundColor: tag.bg,
              color: tag.color,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            {product.tag}
          </span>
        )}

        {/* Popular */}
        {product.popular && (
          <span className="absolute top-3 right-3 text-sm">🔥</span>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(151,182,76,0.08), transparent)" }}
        />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", backgroundColor: "#f0f4e8" }} />

      {/* ── BODY ── */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-sm font-bold leading-snug flex-1"
            style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.name}
          </h3>
          <span
            className="text-base font-bold shrink-0 tabular-nums"
            style={{ color: "#97b64c", fontFamily: "'DM Mono', monospace" }}
          >
            ₱{product.price}
          </span>
        </div>
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ color: "#7a8a6a", fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.description}
        </p>
      </div>

      {/* ── BOTTOM ACCENT LINE on hover ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ backgroundColor: "#97b64c" }}
      />
    </Reveal>
  );
}

// ─── FEEDBACK CARD ────────────────────────────────────────────────────────────

function FeedbackCard({ fb }) {
  return (
    <div
      className="shrink-0 w-72 rounded-2xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8f0dc",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: fb.stars }).map((_, i) => (
          <span key={i} className="text-[#E8A020] text-sm">★</span>
        ))}
      </div>
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}
      >
        "{fb.comment}"
      </p>
      <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: "1px solid #f0f4e8" }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: "#eef4e3" }}
        >
          🧋
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>
            {fb.name}
          </p>
          <p className="text-[10px]" style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}>
            {fb.handle}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main style={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none" style={{ backgroundColor: "rgba(151,182,76,0.07)" }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full pointer-events-none" style={{ backgroundColor: "rgba(232,160,32,0.07)" }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-5 z-10">
          <span
            className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
            style={{ backgroundColor: "rgba(151,182,76,0.15)", color: "#b7cd7f", fontFamily: "'DM Sans', sans-serif" }}
          >
            🧋 Our Menu
          </span>
          <h1
            className="text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
          >
            Every Sip, Crafted<br />
            <span style={{ color: "#97b64c" }}>Just for You.</span>
          </h1>
          <p
            className="text-base max-w-lg leading-relaxed"
            style={{ color: "#7a8a6a", fontFamily: "'DM Sans', sans-serif" }}
          >
            From classic milk teas to our signature Taiwanese Popping Boba — crafted with real milk, real ingredients, real love.
          </p>

          {/* Category pills in header */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {categories.filter(c => c !== "All").map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: activeCategory === cat ? "#97b64c" : "rgba(255,255,255,0.07)",
                  color: activeCategory === cat ? "#ffffff" : "#7a8a6a",
                  border: activeCategory === cat ? "1px solid #97b64c" : "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER BAR ── */}
      <section
        className="sticky z-40 py-4"
        style={{
          // Stick just under the main navbar (h-16 ≈ 64px)
          top: "64px",
          backgroundColor: "rgba(250,250,250,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #eff4e8",
          boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat ? "#97b64c" : "transparent",
                color: activeCategory === cat ? "#ffffff" : "#5a6a4a",
                border: activeCategory === cat ? "1px solid #97b64c" : "1px solid #e0ebd0",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat}
            </button>
          ))}
          <span
            className="ml-auto shrink-0 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: "#97b64c",
              backgroundColor: "#eef4e3",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {filtered.length} items
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-3">
              <span className="text-4xl">🧋</span>
              <p className="font-bold" style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}>
                No items found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CUSTOMER FEEDBACKS ── */}
      <section className="py-20 overflow-hidden" style={{ backgroundColor: "#1e1e1e" }}>
        <Reveal as="div" className="text-center mb-12 px-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: "#97b64c", fontFamily: "'DM Sans', sans-serif" }}
          >
            What People Are Saying
          </p>
          <h2
            className="text-4xl lg:text-5xl font-bold"
            style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
          >
            Real Sips. Real Love. 🧋
          </h2>
          <p
            className="text-base max-w-lg mx-auto mt-3 leading-relaxed"
            style={{ color: "#7a8a6a", fontFamily: "'DM Sans', sans-serif" }}
          >
            Thousands of Milkshop fans across the Philippines.
          </p>
        </Reveal>

        {/* Row 1 — left */}
        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1e1e1e, transparent)" }} />
          <div className="flex gap-4 w-max" style={{ animation: "marquee-left 40s linear infinite" }}>
            {feedbacksRow1.map((fb, i) => <FeedbackCard key={`r1-${fb.id}-${i}`} fb={fb} />)}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="relative mt-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #1e1e1e, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #1e1e1e, transparent)" }} />
          <div className="flex gap-4 w-max" style={{ animation: "marquee-right 45s linear infinite" }}>
            {feedbacksRow2.map((fb, i) => <FeedbackCard key={`r2-${fb.id}-${i}`} fb={fb} />)}
          </div>
        </div>

        <Reveal as="div" className="text-center mt-12 px-6">
          <Link
            to="/locations"
            className="inline-block font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#97b64c",
              color: "#ffffff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(151,182,76,0.3)",
            }}
          >
            Find a Branch Near You →
          </Link>
        </Reveal>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ backgroundColor: "#f7f9f3", borderTop: "1px solid #e8f0dc" }} className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "#1e1e1e", fontFamily: "'DM Sans', sans-serif" }}
            >
              Can't decide? 🧋
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "#7a8a6a", fontFamily: "'DM Sans', sans-serif" }}
            >
              Visit a branch — our crew will help you find your new favorite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/locations"
              className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "#97b64c",
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 16px rgba(151,182,76,0.25)",
              }}
            >
              Find a Branch
            </Link>
            <Link
              to="/franchise#inquiry"
              className="font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
              style={{
                border: "1.5px solid #97b64c",
                color: "#62840b",
                backgroundColor: "transparent",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Franchise Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}