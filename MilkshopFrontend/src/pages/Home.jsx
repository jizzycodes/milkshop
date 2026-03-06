import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import Reveal from "../components/Reveal"
import logo from "../assets/milkshop-logo.png"

const A1_IMAGE_URL =
  "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A1%20Black%20Sugar%20Boba%20Milk%20Tea.png"; 

// --- Data ---
const featuredProducts = [
  {
    id: 1,
    emoji: "🧋",
    name: "Brown Sugar Milk Tea",
    tag: "Best Seller",
    tagColor: "bg-[#E8A020] text-white",
    description: "Classic tiger stripes with fresh milk and chewy pearls.",
    price: "₱99",
  },
  {
    id: 2,
    emoji: "🍵",
    name: "Matcha Popping Boba",
    tag: "New",
    tagColor: "bg-[#5A9216] text-white",
    description: "Japanese matcha base with our signature Taiwanese popping boba.",
    price: "₱109",
  },
  {
    id: 3,
    emoji: "🍓",
    name: "Strawberry Milk Series",
    tag: "Fan Fave",
    tagColor: "bg-pink-400 text-white",
    description: "Real strawberry blended with creamy fresh milk. Refreshing & sweet.",
    price: "₱105",
  },
];

const highlights = [
  { icon: "🫧", label: "Popping Boba", sub: "Bursts of flavor in every sip" },
  { icon: "🥛", label: "Fresh Milk", sub: "No powder, real milk always" },
  { icon: "🇹🇼", label: "Taiwan Recipe", sub: "Authentic original formula" },
  { icon: "🌿", label: "Natural Ingredients", sub: "No artificial preservatives" },
];

// --- Component ---
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-white">

      {/* Hero with entry transition */}
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

      {/* ── FEATURED PRODUCTS ── */}
      <Reveal as="section" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[#5A9216] text-xs font-bold tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Our Menu
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A2410] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Fan Favorites
              </h2>
            </div>
            <Link
              to="/products"
              className="ui-link-underline text-sm font-semibold text-[#5A9216] hover:text-[#3E6610]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Full Menu →
            </Link>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="ui-card overflow-hidden rounded-3xl border border-[#DDE8CF] animate-pulse"
                  >
                    <div className="bg-[#EEF5E6] h-52" />
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-4 bg-[#DDE8CF] rounded w-2/3" />
                        <div className="h-4 bg-[#DDE8CF] rounded w-16" />
                      </div>
                      <div className="h-3 bg-[#DDE8CF] rounded w-full" />
                      <div className="h-3 bg-[#DDE8CF] rounded w-5/6" />
                    </div>
                  </div>
                ))
              : featuredProducts.map((product, index) => (
                  <Reveal
                    key={product.id}
                    as="div"
                    delay={index * 60}
                    className="group flex flex-col items-center text-center gap-3"
                  >
                    {/* Floating drink image */}
                    <div className="relative flex items-center justify-center mb-4">
                      {product.id === 1 && (
                        <img
                          src="https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A4%20Matcha%20BLACK%20SUGAR%20PEARL%20Milk%20Tea.png"
                          alt={product.name}
                          className="h-40 object-contain drop-shadow-xl"
                        />
                      )}
                      {product.id === 2 && (
                        <img
                          src="https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A2%20Signature%20Taiwanese%20Milk%20Tea.png"
                          alt={product.name}
                          className="h-40 object-contain drop-shadow-xl"
                        />
                      )}
                      {product.id === 3 && (
                        <img
                          src="https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/A3%20Chocolate%20Pearl%20Milk%20Tea.png"
                          alt={product.name}
                          className="h-40 object-contain drop-shadow-xl"
                        />
                      )}
                      <span
                        className={`absolute top-1/2 -right-3 -translate-y-1/2 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${product.tagColor}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {product.tag}
                      </span>
                    </div>

                    {/* Text info under floating image */}
                    <div className="flex flex-col items-center gap-1">
                      <h3
                        className="text-base font-bold text-[#1A2410] leading-snug"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {product.name}
                      </h3>
                      <span
                        className="text-lg font-bold text-[#5A9216]"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {product.price}
                      </span>
                      <p
                        className="text-[#5A6B4A] text-sm leading-relaxed max-w-xs"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </Reveal>

      {/* ── BRAND STORY ── */}
      <Reveal as="section" className="bg-[#F7F9F4] border-y border-[#DDE8CF] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12">

          {/* Visual side */}
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

          {/* Text side */}
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

      {/* ── FRANCHISE CTA BANNER ── */}
      <Reveal as="section" className="bg-[#E8A020] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <Reveal as="div" className="flex flex-col gap-3">
            <p className="text-yellow-100 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Grow With Us
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Franchise Opportunities <br /> With Milkshop
            </h2>
            <p className="text-yellow-100 text-base max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Curious about opening your own Milkshop branch? Learn more about our upcoming franchise
              program and how you can be part of the story.
            </p>
          </Reveal>
          <Reveal as="div" delay={80}>
            <Link
              to="/franchise"
              className="shrink-0 bg-white text-[#E8A020] hover:bg-yellow-50 font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore Franchise Info →
            </Link>
          </Reveal>
        </div>
      </Reveal>

      {/* ── LOCATIONS CTA ── */}
      <Reveal as="section" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center flex flex-col items-center gap-6">
          <Reveal
            as="p"
            className="text-[#5A9216] text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Find Us
          </Reveal>
          <Reveal
            as="h2"
            delay={40}
            className="text-4xl lg:text-5xl font-bold text-[#1A2410]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            We're Near You 📍
          </Reveal>
          <Reveal
            as="p"
            delay={80}
            className="text-[#5A6B4A] text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Multiple branches across the Philippines — with more locations coming soon.
          </Reveal>
          <Reveal as="div" delay={120} className="flex flex-wrap justify-center gap-3 mt-2">
            <Link
              to="/locations"
              className="bg-[#5A9216] hover:bg-[#3E6610] text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Locations
            </Link>
          </Reveal>
        </div>
      </Reveal>

    </main>
  );
}