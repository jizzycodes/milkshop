import { useState } from "react"
import { Link } from "react-router-dom"
import Reveal from "../components/Reveal"

// --- Data ---
const categories = ["All", "Milk Tea", "Fruit Tea", "Popping Boba", "Seasonal"];

const products = [
  // Milk Tea
  {
    id: 1,
    category: "Milk Tea",
    emoji: "🧋",
    name: "Brown Sugar Milk Tea",
    description: "Tiger stripe signature with chewy pearls and fresh milk.",
    price: 99,
    tag: "Best Seller",
    tagColor: "bg-[#E8A020] text-white",
    popular: true,
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png",

  },
  {
    id: 2,
    category: "Milk Tea",
    emoji: "🍵",
    name: "Matcha Milk Tea",
    description: "Premium Japanese matcha blended with creamy fresh milk.",
    price: 109,
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    popular: false,
  },
  {
    id: 3,
    category: "Milk Tea",
    emoji: "🍫",
    name: "Chocolate Milk Tea",
    description: "Rich Belgian chocolate with silky milk and dark pearls.",
    price: 105,
    tag: null,
    popular: false,
  },
  {
    id: 4,
    category: "Milk Tea",
    emoji: "🍪",
    name: "Taro Milk Tea",
    description: "Creamy purple taro blend — sweet, smooth, and satisfying.",
    price: 105,
    tag: "Fan Fave",
    tagColor: "bg-purple-400 text-white",
    popular: true,
  },

  // Fruit Tea
  {
    id: 5,
    category: "Fruit Tea",
    emoji: "🍓",
    name: "Strawberry Fruit Tea",
    description: "Real strawberry with refreshing green tea base.",
    price: 99,
    tag: "Fan Fave",
    tagColor: "bg-pink-400 text-white",
    popular: true,
  },
  {
    id: 6,
    category: "Fruit Tea",
    emoji: "🍑",
    name: "Peach Oolong Tea",
    description: "Sweet peach meets floral oolong — light and aromatic.",
    price: 99,
    tag: null,
    popular: false,
  },
  {
    id: 7,
    category: "Fruit Tea",
    emoji: "🍋",
    name: "Lemon Green Tea",
    description: "Zesty fresh lemon with crisp green tea. Perfect daily sip.",
    price: 89,
    tag: null,
    popular: false,
  },

  // Popping Boba
  {
    id: 8,
    category: "Popping Boba",
    emoji: "🫧",
    name: "Mango Popping Boba",
    description: "Tropical mango tea bursting with Taiwanese popping boba.",
    price: 115,
    tag: "Signature",
    tagColor: "bg-yellow-400 text-white",
    popular: true,
  },
  {
    id: 9,
    category: "Popping Boba",
    emoji: "🍇",
    name: "Grape Popping Boba",
    description: "Concord grape base with juicy grape-filled boba pearls.",
    price: 115,
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    popular: false,
  },
  {
    id: 10,
    category: "Popping Boba",
    emoji: "🍈",
    name: "Lychee Popping Boba",
    description: "Delicate lychee tea with floral notes and popping boba.",
    price: 115,
    tag: null,
    popular: false,
  },

  // Seasonal
  {
    id: 11,
    category: "Seasonal",
    emoji: "🎃",
    name: "Ube Cream Special",
    description: "Limited ube milk tea topped with cream cheese foam.",
    price: 125,
    tag: "Limited",
    tagColor: "bg-purple-600 text-white",
    popular: true,
  },
  {
    id: 12,
    category: "Seasonal",
    emoji: "🍀",
    name: "Pandan Milk Tea",
    description: "Southeast Asian pandan with creamy milk — local x Taiwan fusion.",
    price: 119,
    tag: "Limited",
    tagColor: "bg-purple-600 text-white",
    popular: false,
  },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="bg-white min-h-screen">

      {/* ── PAGE HEADER ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-b border-[#DDE8CF] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-4">
          <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Our Menu
          </p>
          <h1 className="text-5xl lg:text-6xl font-bold text-[#1A2410] leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Every Sip, Crafted <br />
            <span className="text-[#5A9216]">Just for You.</span>
          </h1>
          <p className="text-[#5A6B4A] text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            From classic milk teas to our signature Taiwanese Popping Boba — explore every flavor we've crafted with love.
          </p>
        </div>
      </Reveal>

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
          <span className="ml-auto shrink-0 text-xs text-[#5A6B4A] font-medium"
            style={{ fontFamily: "'DM Mono', monospace" }}>
            {filtered.length} items
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, index) => (
              <Reveal
                key={product.id}
                as="div"
                delay={index * 50}
                className="group ui-card overflow-hidden flex flex-col"
              >
                {/* Image area */}
                <div className="relative bg-[#EEF5E6] h-44 flex items-center justify-center">
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
                    {product.emoji}
                  </span>
                  {product.tag && (
                    <span
                      className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${product.tagColor}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {product.tag}
                    </span>
                  )}
                  {product.popular && (
                    <span className="absolute top-3 right-3 text-lg">🔥</span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-bold text-[#1A2410] leading-snug"
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
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM NOTE ── */}
      <section className="bg-[#1A2410] py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Can't decide? 🧋
            </h2>
            <p className="text-[#C8DFA8] text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Visit a branch and our crew will help you choose a favorite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/locations"
              className="border border-[#C8DFA8] text-[#C8DFA8] hover:bg-[#C8DFA8] hover:text-[#1A2410] font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Find a Branch
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}