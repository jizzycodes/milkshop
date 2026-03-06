import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import Reveal from "../components/Reveal"
import logo from "../assets/milkshop-logo.png"

// ─── DATA ────────────────────────────────────────────────────────────────────

const highlights = [
  { icon: "🫧", label: "Popping Boba", sub: "Bursts of flavor in every sip" },
  { icon: "🥛", label: "Fresh Milk", sub: "No powder, real milk always" },
  { icon: "🇹🇼", label: "Taiwan Recipe", sub: "Authentic original formula" },
  { icon: "🌿", label: "Natural Ingredients", sub: "No artificial preservatives" },
];

const topDrinks = [
  {
    id: 1,
    name: "Black Sugar Boba Milk Tea",
    tag: "Best Seller",
    tagColor: "bg-[#E8A020] text-white",
    description: "Tiger-stripe signature with chewy pearls and fresh milk. The drink that started it all.",
    price: "₱99",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png",
  },
  {
    id: 2,
    name: "Signature Taiwanese Milk Tea",
    tag: "Classic",
    tagColor: "bg-[#5A9216] text-white",
    description: "The purest expression of Taiwan milk tea. Smooth, clean, and perfectly balanced.",
    price: "₱99",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A2%20Signature%20Taiwanese%20Milk%20Tea.png",
  },
  {
    id: 3,
    name: "Chocolate Pearl Milk Tea",
    tag: "Fan Fave",
    tagColor: "bg-pink-500 text-white",
    description: "Rich Belgian chocolate blended with fresh milk and dark pearl boba.",
    price: "₱105",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A3%20Chocolate%20Pearl%20Milk%20Tea.png",
  },
  {
    id: 4,
    name: "Matcha Black Sugar Pearl",
    tag: "New",
    tagColor: "bg-[#3E6610] text-white",
    description: "Japanese matcha meets our signature black sugar — a bold fusion in every sip.",
    price: "₱109",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A4%20Matcha%20BLACK%20SUGAR%20PEARL%20Milk%20Tea.png",
  },
  {
    id: 5,
    name: "Strawberry Popping Boba",
    tag: "Summer Pick",
    tagColor: "bg-rose-400 text-white",
    description: "Real strawberry with Taiwanese popping boba that bursts with every sip.",
    price: "₱109",
    imageUrl: "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png",
  },
];

const investorStats = [
  { value: "15+", label: "Active Branches", icon: "📍" },
  { value: "2015", label: "Year Founded", icon: "🇹🇼" },
  { value: "20+", label: "Menu Items", icon: "🧋" },
  { value: "12–18", label: "Months ROI", icon: "📈" },
];

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    role: "Franchisee · SM Mall of Asia",
    quote: "Opening my Milkshop branch was the best business decision I ever made. The support from the team is unmatched and the brand sells itself.",
    avatar: "👩‍💼",
    stars: 5,
  },
  {
    id: 2,
    name: "Carlo Reyes",
    role: "Franchisee · Cebu City",
    quote: "Within 14 months I already recovered my investment. The product quality is consistent and customers keep coming back every single day.",
    avatar: "👨‍💼",
    stars: 5,
  },
  {
    id: 3,
    name: "Jennelyn Cruz",
    role: "Franchisee · BGC Taguig",
    quote: "I had zero food industry experience. Milkshop's training program gave me everything I needed. Now I'm planning to open a second branch.",
    avatar: "👩‍🍳",
    stars: 5,
  },
];

// ─── CAROUSEL COMPONENT ───────────────────────────────────────────────────────

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
    if (diff === 1 || diff === total - 4) return "right1";
    if (diff === total - 1 || diff === 4) return "left1";
    return "hidden";
  };

  const posStyles = {
    center:  "z-30 scale-100 opacity-100 translate-x-0",
    right1:  "z-20 scale-75 opacity-60 translate-x-[55%]",
    left1:   "z-20 scale-75 opacity-60 -translate-x-[55%]",
    hidden:  "z-10 scale-50 opacity-0 translate-x-0 pointer-events-none",
  };

  const current = topDrinks[active];

  return (
    <div
      className="w-full"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      {/* Carousel Track */}
      <div className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden">
        {topDrinks.map((drink, i) => {
          const pos = getPos(i);
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
                className="h-56 sm:h-64 object-contain drop-shadow-2xl select-none"
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      {/* Active Drink Info */}
      <div className="mt-6 flex flex-col items-center text-center gap-2 px-4 min-h-[120px] transition-all duration-300">
        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full ${current.tagColor}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.tag}
        </span>
        <h3
          className="text-xl sm:text-2xl font-bold text-[#1A2410]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.name}
        </h3>
        <p
          className="text-[#5A6B4A] text-sm max-w-xs leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {current.description}
        </p>
        <span
          className="text-xl font-bold text-[#5A9216] mt-1"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {current.price}
        </span>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5">
        {topDrinks.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2 bg-[#5A9216]"
                : "w-2 h-2 bg-[#DDE8CF] hover:bg-[#C8DFA8]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── TESTIMONIAL CAROUSEL ─────────────────────────────────────────────────────

function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % total), 4500);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Quote Card */}
      <div className="relative bg-white border border-[#DDE8CF] rounded-3xl p-8 max-w-2xl w-full shadow-sm transition-all duration-300">
        {/* Quote mark */}
        <span
          className="absolute -top-5 left-8 text-7xl text-[#EEF5E6] leading-none select-none font-serif"
          aria-hidden
        >
          "
        </span>
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: t.stars }).map((_, i) => (
            <span key={i} className="text-[#E8A020] text-base">★</span>
          ))}
        </div>
        <p
          className="text-[#1A2410] text-base leading-relaxed relative z-10"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {t.quote}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-10 h-10 rounded-full bg-[#EEF5E6] flex items-center justify-center text-xl">
            {t.avatar}
          </div>
          <div>
            <p className="font-bold text-[#1A2410] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t.name}
            </p>
            <p className="text-[#5A6B4A] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {t.role}
            </p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-300 ${
              i === active ? "w-6 h-2 bg-[#5A9216]" : "w-2 h-2 bg-[#DDE8CF] hover:bg-[#C8DFA8]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="bg-white">

      {/* ── HERO ── */}
      <Reveal as="div">
        <Hero />
      </Reveal>

      {/* ── HIGHLIGHTS STRIP ── */}
      <Reveal as="section" className="bg-[#5A9216] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center gap-3">
              <span className="text-2xl">{h.icon}</span>
              <div>
                <p className="text-white text-sm font-bold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {h.label}
                </p>
                <p className="text-green-200 text-xs leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {h.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── TOP 5 DRINKS CAROUSEL ── */}
      <Reveal as="section" className="bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Top 5 Picks
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A2410] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Fan Favorites
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-[#5A9216] hover:text-[#3E6610] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Full Menu →
            </Link>
          </div>
          <DrinksCarousel />
        </div>
      </Reveal>

      {/* ── INVESTOR STATS BAR ── */}
      <Reveal as="section" className="bg-[#1A2410] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {investorStats.map((s, i) => (
            <Reveal key={s.label} as="div" delay={i * 60} className="flex flex-col items-center gap-1">
              <span className="text-2xl mb-1">{s.icon}</span>
              <span
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {s.value}
              </span>
              <span
                className="text-[#C8DFA8] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.label}
              </span>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ── BRAND STORY ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-y border-[#DDE8CF] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12">
          <Reveal as="div" className="flex-1 flex justify-center" delay={40}>
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-[40px] bg-[#EEF5E6] rotate-6" />
              <div className="absolute inset-0 rounded-[40px] bg-[#C8DFA8] -rotate-3 opacity-50" />
              <div className="absolute inset-0 rounded-[40px] bg-white border border-[#DDE8CF] flex flex-col items-center justify-center gap-3 shadow-sm">
                <img src={logo} alt="Milkshop logo" className="w-20 h-20 object-contain" />
                <div className="text-center">
                  <p className="font-bold text-[#1A2410] text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Milkshop</p>
                  <p className="text-[#5A6B4A] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>秘客侠 · Est. Taiwan</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal as="div" className="flex-1 flex flex-col gap-5" delay={80}>
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Our Story
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A2410] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Born in Taiwan. <br />
              <span className="text-[#5A9216]">Loved in Manila.</span>
            </h2>
            <p className="text-[#5A6B4A] text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Milkshop 秘客侠 is the first Taiwanese brand to bring Popping Boba milk products to the Philippines. Every cup carries the authenticity of Taiwan's iconic bubble tea culture — crafted with real milk, natural flavors, and our signature boba that bursts with every sip.
            </p>
            <Link
              to="/about"
              className="self-start border border-[#5A9216] text-[#5A9216] hover:bg-[#EEF5E6] font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Learn More About Us
            </Link>
          </Reveal>
        </div>
      </Reveal>

      {/* ── FACTORY / TEA-MAKING VIDEO ── */}
      <Reveal as="section" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Behind Every Cup
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Crafted With Precision
            </h2>
            <p className="text-[#5A6B4A] text-base max-w-lg mx-auto mt-3 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              From our factory in Taiwan to every cup we serve — see how Milkshop ensures quality in every sip.
            </p>
          </div>

          {/* Video Placeholder — replace src with actual video URL */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1A2410] aspect-video max-w-4xl mx-auto shadow-2xl">
            {/* 
              TO ADD VIDEO: Replace this div with:
              <video
                src="YOUR_VIDEO_URL"
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              />
              OR for YouTube embed:
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1"
                className="w-full h-full"
                allow="autoplay; fullscreen"
              />
            */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Factory & Tea-Making Process
                </p>
                <p className="text-white/50 text-sm mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Video coming soon — replace placeholder in Home.jsx
                </p>
              </div>
            </div>
            {/* Decorative overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2410]/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </Reveal>

      {/* ── FRANCHISE CTA BANNER ── */}
      <Reveal as="section" className="bg-[#E8A020] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <Reveal as="div" className="flex flex-col gap-3">
            <p className="text-yellow-100 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Grow With Us
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Own a Milkshop. <br />
              Build Your Future.
            </h2>
            <p className="text-yellow-100 text-base max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join the fastest-growing Taiwanese beverage brand in the Philippines. Low investment, proven system, full support — everything you need to succeed.
            </p>
            <ul className="flex flex-col gap-1.5 mt-1">
              {["Proven ROI in 12–18 months", "Full training & brand support", "3 flexible franchise packages"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-white text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-yellow-200 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal as="div" delay={80} className="flex flex-col items-center gap-3">
            <Link
              to="/franchise"
              className="shrink-0 bg-white text-[#E8A020] hover:bg-yellow-50 font-bold text-base px-10 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Franchise Now →
            </Link>
            <p className="text-yellow-100 text-xs text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              No experience needed. We'll train you.
            </p>
          </Reveal>
        </div>
      </Reveal>

      {/* ── FRANCHISEE TESTIMONIALS ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-y border-[#DDE8CF] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              From Our Partners
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Real Stories. Real Success.
            </h2>
            <p className="text-[#5A6B4A] text-base max-w-lg mx-auto mt-3 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Hear from the franchisees who took the leap — and haven't looked back since.
            </p>
          </div>
          <TestimonialCarousel />
          <div className="flex justify-center mt-10">
            <Link
              to="/franchise"
              className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Start Your Franchise Journey →
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ── LOCATIONS CTA ── */}
      <Reveal as="section" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-6">
          <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Find Us
          </p>
          <Reveal as="h2" delay={40} className="text-4xl lg:text-5xl font-bold text-[#1A2410]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            We're Near You 📍
          </Reveal>
          <Reveal as="p" delay={80} className="text-[#5A6B4A] text-base max-w-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            15 branches nationwide — from Metro Manila to Mindanao. With more locations opening soon.
          </Reveal>
          <Reveal as="div" delay={120} className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              to="/locations"
              className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View All Locations
            </Link>
          </Reveal>
        </div>
      </Reveal>

    </main>
  );
}