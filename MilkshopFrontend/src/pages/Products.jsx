import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS DATA
// ⚠️  Set `imageUrl` to your product photo URL.
//     If null → styled placeholder shown automatically.
// ─────────────────────────────────────────────────────────────────────────────
const categories = ["All", "Milk Tea", "Fruit Tea", "Popping Boba", "Seasonal"];

const products = [
  {
    id: 1,
    category: "Milk Tea",
    name: "Black Sugar Boba Milk Tea",
    description: "Tiger-stripe signature with chewy pearls and fresh milk. The drink that started it all.",
    price: 99,
    tag: "Best Seller",
    tagColor: "bg-[#E8A020] text-white",
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
    tagColor: "bg-[#5A9216] text-white",
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
    tagColor: "bg-[#3E6610] text-white",
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
    tagColor: "bg-purple-400 text-white",
    popular: true,
    imageUrl: null, // ← replace with your photo URL
  },
  {
    id: 6,
    category: "Fruit Tea",
    name: "Strawberry Fruit Tea",
    description: "Real strawberry with a refreshing green tea base. Light, bright, and fruity.",
    price: 99,
    tag: "Fan Fave",
    tagColor: "bg-pink-400 text-white",
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
    tagColor: "bg-[#E8A020] text-white",
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
    tagColor: "bg-[#5A9216] text-white",
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
    tagColor: "bg-purple-600 text-white",
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
    tagColor: "bg-purple-600 text-white",
    popular: false,
    imageUrl: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER FEEDBACKS
// ⚠️  Set `photo` to the customer's screenshot/image URL.
//     If null → avatar placeholder shown.
//     `isPhoto: true` means the entire card IS a screenshot image.
//     `isPhoto: false` means it's a text review card with optional avatar.
// ─────────────────────────────────────────────────────────────────────────────
const feedbacks = [
  {
    id: 1,
    name: "Angelica R.",
    handle: "@angelicar_ph",
    stars: 5,
    comment: "Best milk tea I've ever had in the Philippines! The black sugar boba is INSANE. Already on my 5th visit this month 😭🧋",
    photo: null,    // ← replace with customer photo/avatar URL
    cardPhoto: null, // ← replace with screenshot image URL (optional)
  },
  {
    id: 2,
    name: "Miguel T.",
    handle: "@migueltravels",
    stars: 5,
    comment: "The popping boba is on another level. You can actually taste the real fruit juice when it bursts. Nothing like it in Manila.",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 3,
    name: "Trisha Mae",
    handle: "@trishafoods",
    stars: 5,
    comment: "Finally a milk tea brand that uses ACTUAL fresh milk! You can taste the difference. The matcha pearl is my forever go-to 💚",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 4,
    name: "Carlo B.",
    handle: "@carloeats",
    stars: 5,
    comment: "Ordered the taro and the chocolate pearl. Both were 10/10. The queue was long but 100% worth it. Will be back tomorrow lol",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 5,
    name: "Diane L.",
    handle: "@dianelim.ph",
    stars: 5,
    comment: "The brown sugar milk tea here hits different. Tiger stripes are real, the pearls are chewy, the milk is fresh. Taiwanese quality for real 🇹🇼",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 6,
    name: "Nico S.",
    handle: "@nicosip",
    stars: 5,
    comment: "My friends dragged me here and now I'm the one dragging everyone else. The lychee popping boba is addicting.",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 7,
    name: "Justine A.",
    handle: "@justineandco",
    stars: 5,
    comment: "Visited the Cebu branch and it was packed! Staff was super friendly and drinks came out fast. The ube cream special is a must-try.",
    photo: null,
    cardPhoto: null,
  },
  {
    id: 8,
    name: "Rachel P.",
    handle: "@rachelpdiary",
    stars: 5,
    comment: "Milkshop is the only milk tea that makes me feel like I'm actually in Taiwan. Every sip is just *chef's kiss* 🫧",
    photo: null,
    cardPhoto: null,
  },
];

// Duplicate for seamless infinite scroll
const feedbacksRow1 = [...feedbacks, ...feedbacks];
const feedbacksRow2 = [...feedbacks].reverse().concat([...feedbacks].reverse());

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  return (
    <Reveal
      as="div"
      delay={index * 40}
      className="group bg-white rounded-3xl border border-[#DDE8CF] overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image / Placeholder */}
      <div className="relative h-52 overflow-hidden bg-[#F7F9F4]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#EEF5E6] via-[#C8DFA8]/30 to-[#F7F9F4] flex flex-col items-center justify-center gap-2 group-hover:from-[#DDE8CF]/60 transition-all duration-500">
            <div className="w-12 h-12 rounded-2xl bg-white/80 border border-[#DDE8CF] flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-[#C8DFA8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5M3 7.5h18" />
              </svg>
            </div>
            <p className="text-[#C8DFA8] text-[11px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Photo coming soon
            </p>
          </div>
        )}

        {/* Tag */}
        {product.tag && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${product.tagColor}`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.tag}
          </span>
        )}

        {/* Popular fire */}
        {product.popular && (
          <span className="absolute top-3 right-3 text-base drop-shadow">🔥</span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-sm font-bold text-[#1A2410] leading-snug flex-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.name}
          </h3>
          <span
            className="text-base font-bold text-[#5A9216] shrink-0"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ₱{product.price}
          </span>
        </div>
        <p
          className="text-[#5A6B4A] text-xs leading-relaxed flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.description}
        </p>
      </div>
    </Reveal>
  );
}

// ─── FEEDBACK CARD ────────────────────────────────────────────────────────────
function FeedbackCard({ fb }) {
  // If cardPhoto is set — show as screenshot image card
  if (fb.cardPhoto) {
    return (
      <div className="shrink-0 w-64 rounded-3xl overflow-hidden border border-[#DDE8CF] shadow-sm bg-white">
        <img
          src={fb.cardPhoto}
          alt={`${fb.name} review`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Text review card
  return (
    <div className="shrink-0 w-72 bg-white border border-[#DDE8CF] rounded-3xl p-5 flex flex-col gap-3 shadow-sm">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: fb.stars }).map((_, i) => (
          <span key={i} className="text-[#E8A020] text-sm">★</span>
        ))}
      </div>
      {/* Comment */}
      <p
        className="text-[#1A2410] text-sm leading-relaxed flex-1"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        "{fb.comment}"
      </p>
      {/* Author */}
      <div className="flex items-center gap-2.5 pt-1 border-t border-[#DDE8CF]">
        {fb.photo ? (
          <img
            src={fb.photo}
            alt={fb.name}
            className="w-8 h-8 rounded-full object-cover border border-[#DDE8CF]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#EEF5E6] border border-[#DDE8CF] flex items-center justify-center text-base shrink-0">
            🧋
          </div>
        )}
        <div>
          <p className="text-[#1A2410] text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {fb.name}
          </p>
          <p className="text-[#5A6B4A] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {fb.handle}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-white min-h-screen">

      {/* ── PAGE HEADER ── */}
      <section className="relative bg-[#1A2410] py-24 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#5A9216]/10 pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-[#E8A020]/10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-5 z-10">
          <span className="bg-[#5A9216]/20 text-[#C8DFA8] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            🧋 Our Menu
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Every Sip, Crafted<br />
            <span className="text-[#5A9216]">Just for You.</span>
          </h1>
          <p className="text-[#C8DFA8] text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            From classic milk teas to our signature Taiwanese Popping Boba — explore every flavor crafted with real milk, real ingredients, real love.
          </p>
          {/* Quick category pills in hero */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {categories.filter(c => c !== "All").map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="bg-white/10 hover:bg-[#5A9216] text-[#C8DFA8] hover:text-white border border-white/10 hover:border-[#5A9216] text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="sticky top-[64px] z-40 bg-white border-b border-[#DDE8CF] py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#5A9216] text-white shadow-sm"
                  : "bg-[#F7F9F4] text-[#5A6B4A] border border-[#DDE8CF] hover:border-[#5A9216] hover:text-[#5A9216]"
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs text-[#5A6B4A] font-medium bg-[#F7F9F4] border border-[#DDE8CF] px-3 py-1.5 rounded-full"
            style={{ fontFamily: "'DM Mono', monospace" }}>
            {filtered.length} items
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-16 bg-[#F7F9F4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-3">
              <span className="text-4xl">🧋</span>
              <p className="text-[#1A2410] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No items found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CUSTOMER FEEDBACKS ── */}
      <section className="bg-[#1A2410] py-20 overflow-hidden">

        {/* Header */}
        <Reveal as="div" className="text-center mb-12 px-6">
          <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            What People Are Saying
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Real Sips. Real Love. 🧋
          </h2>
          <p className="text-[#C8DFA8] text-base max-w-lg mx-auto mt-3 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Thousands of Milkshop fans across the Philippines — here's what they're saying.
          </p>
        </Reveal>

        {/* ── ROW 1 — scrolls LEFT ── */}
        <div className="relative mb-4">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#1A2410] to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1A2410] to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-4 w-max"
            style={{
              animation: "marquee-left 40s linear infinite",
            }}
          >
            {feedbacksRow1.map((fb, i) => (
              <FeedbackCard key={`r1-${fb.id}-${i}`} fb={fb} />
            ))}
          </div>
        </div>

        {/* ── ROW 2 — scrolls RIGHT ── */}
        <div className="relative mt-4">
          {/* Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#1A2410] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1A2410] to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-4 w-max"
            style={{
              animation: "marquee-right 45s linear infinite",
            }}
          >
            {feedbacksRow2.map((fb, i) => (
              <FeedbackCard key={`r2-${fb.id}-${i}`} fb={fb} />
            ))}
          </div>
        </div>

        {/* Pause on hover note + CTA */}
        <Reveal as="div" className="text-center mt-12 px-6">
          <p className="text-[#5A6B4A] text-xs mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Join thousands of happy customers across the Philippines.
          </p>
          <Link
            to="/locations"
            className="inline-block bg-[#5A9216] hover:bg-[#3E6610] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Find a Branch Near You →
          </Link>
        </Reveal>
      </section>

      {/* ── KEYFRAMES — injected via style tag ── */}
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

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#F7F9F4] border-t border-[#DDE8CF] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Can't decide? 🧋
            </h2>
            <p className="text-[#5A6B4A] text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Visit a branch — our crew will help you find your new favorite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/locations"
              className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-md active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Find a Branch
            </Link>
            <Link
              to="/franchise"
              className="border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Franchise Now →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}