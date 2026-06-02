import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FranchiseInquiryTrigger from "./FranchiseInquiryTrigger";

const topDrinks = [
  {
    id: 1,
    name: "Milku Strawberry",
    imageUrl:
      "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/milku_series/M1.png",
  },
  {
    id: 2,
    name: "Cheesecake Black Sugar",
    imageUrl:
      "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/cheesecake_series/K1.png",
  },
  {
    id: 3,
    name: "Black Sugar Boba",
    imageUrl:
      "https://ewqycfetxsdpwaqqlhki.supabase.co/storage/v1/object/public/product-images/milktea_series/A1.png",
  },
];

const TAIWAN_LETTERS = [
  { letter: "T", color: "#e63946" },
  { letter: "a", color: "#f4a261" },
  { letter: "i", color: "#ce93d8" },
  { letter: "w", color: "#4caf50" },
  { letter: "a", color: "#29b6f6" },
  { letter: "n", color: "#e91e8c" },
];

const FEATURES = [
  { id: "ingredients", label: "Premium Ingredients" },
  { id: "taste", label: "Authentic Taiwanese Taste" },
  { id: "healthy", label: "Milky & Healthy" },
  { id: "chewy", label: "Irresistibly Chewy" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Caveat:wght@700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes letterPop {
    0%   { opacity: 0; transform: translateY(40px) scale(0.7); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes floatCup {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  @keyframes splashWave {
    0%, 100% { transform: scaleY(1); }
    50%      { transform: scaleY(1.04); }
  }

  .hero-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(160deg, #b8d46a 0%, #97b64c 35%, #7ca03e 65%, #62840b 100%);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
  }

  .hero-inner {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 72px 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .hero-copy {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeUp 0.5s ease forwards;
  }
  .hero-eyebrow-line {
    width: 18px;
    height: 2px;
    background: rgba(255,255,255,0.9);
    border-radius: 2px;
  }
  .hero-eyebrow-text {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.26em;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
  }

  .hero-fresh {
    font-family: 'Caveat', cursive;
    font-size: clamp(2rem, 8vw, 3.2rem);
    font-weight: 800;
    color: #fff;
    line-height: 1;
    text-shadow: 0 2px 8px rgba(0,0,0,0.25);
    animation: fadeUp 0.6s ease forwards 0.1s;
    opacity: 0;
  }

  .hero-taiwan {
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hero-taiwan img {
    height: clamp(56px, 16vw, 92px);
    width: auto;
    display: block;
    filter: drop-shadow(0 10px 26px rgba(0,0,0,0.35));
    opacity: 0;
    transform: translateY(10px) scale(0.96) rotate(-1deg);
    animation: heroTaiwanPop 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.42s,
      heroTaiwanFloat 3.6s ease-in-out infinite 1.25s;
    will-change: transform;
  }

  @keyframes heroTaiwanPop {
    0%   { opacity: 0; transform: translateY(10px) scale(0.96) rotate(-1deg); filter: saturate(0.9) drop-shadow(0 10px 26px rgba(0,0,0,0.35)); }
    55%  { opacity: 1; transform: translateY(0) scale(1.04) rotate(0deg); filter: saturate(1.05) drop-shadow(0 12px 30px rgba(0,0,0,0.36)); }
    100% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); filter: saturate(1) drop-shadow(0 10px 26px rgba(0,0,0,0.35)); }
  }
  @keyframes heroTaiwanFloat {
    0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
    50%      { transform: translateY(-6px) scale(1) rotate(0deg); }
  }

  .hero-tagline {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(1rem, 4.5vw, 1.4rem);
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.08em;
    margin-top: 6px;
    animation: fadeUp 0.5s ease forwards 0.8s;
    opacity: 0;
  }

  .hero-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 12px;
    width: 100%;
    max-width: 340px;
    margin-top: 18px;
    animation: fadeUp 0.5s ease forwards 1s;
    opacity: 0;
  }
  .hero-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }
  .hero-feature-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(255,255,255,0.08);
  }
  .hero-feature-label {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.95);
    line-height: 1.35;
    max-width: 120px;
  }

  .hero-btns {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 320px;
    margin-top: 20px;
    animation: fadeUp 0.5s ease forwards 1.15s;
    opacity: 0;
  }
  .hero-btn-primary,
  .hero-btn-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 24px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 14px;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .hero-btn-primary {
    background: linear-gradient(135deg, #E8A020 0%, #d49218 100%);
    color: #fff;
    box-shadow: 0 8px 24px rgba(232,160,32,0.4);
  }
  .hero-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(232,160,32,0.5);
  }
  .hero-btn-secondary {
    background: #fff;
    color: #62840b;
    border: 2px solid rgba(255,255,255,0.95);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }
  .hero-btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.14);
  }

  .hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: 260px;
    margin-top: 8px;
  }
  .hero-cups {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    z-index: 2;
    padding-bottom: 20px;
  }
  .hero-cup-wrap {
    flex-shrink: 0;
    animation: floatCup 5s ease-in-out infinite;
  }
  .hero-cup-wrap:nth-child(1) { animation-delay: 0s; margin-right: -28px; z-index: 1; }
  .hero-cup-wrap:nth-child(2) { animation-delay: 0.3s; z-index: 3; margin-bottom: 12px; }
  .hero-cup-wrap:nth-child(3) { animation-delay: 0.6s; margin-left: -28px; z-index: 2; }
  .hero-cup-wrap img {
    height: clamp(160px, 42vw, 220px);
    object-fit: contain;
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.28));
    display: block;
  }

  .hero-splash {
    position: relative;
    z-index: 5;
    margin-top: auto;
    animation: splashWave 5s ease-in-out infinite;
    transform-origin: bottom;
  }

  .hero-deco {
    position: absolute;
    pointer-events: none;
    z-index: 0;
  }

  @media (min-width: 768px) {
    .hero-inner {
      flex-direction: row;
      align-items: flex-end;
      padding: 80px 40px 0;
      gap: 0;
    }
    .hero-copy {
      flex: 0 0 46%;
      align-items: flex-start;
      text-align: left;
      padding-bottom: 80px;
    }
    .hero-eyebrow { justify-content: flex-start; }
    .hero-eyebrow-text { font-size: 10px; }
    .hero-eyebrow-line { width: 22px; }
    .hero-fresh { font-size: clamp(2.6rem, 4vw, 4rem); }
    .hero-taiwan { justify-content: flex-start; }
    .hero-taiwan img { height: clamp(72px, 8.2vw, 120px); }
    .hero-tagline { font-size: clamp(1.15rem, 2vw, 1.5rem); }
    .hero-features {
      grid-template-columns: repeat(4, 1fr);
      max-width: 100%;
      gap: 12px;
    }
    .hero-feature-label { font-size: 7px; max-width: 90px; }
    .hero-feature-icon { width: 48px; height: 48px; }
    .hero-btns {
      flex-direction: row;
      max-width: none;
      width: auto;
      flex-wrap: wrap;
    }
    .hero-btn-primary,
    .hero-btn-secondary {
      width: auto;
      min-width: 160px;
    }
    .hero-visual {
      flex: 1;
      min-height: 480px;
      margin-top: 0;
    }
    .hero-cup-wrap img {
      height: clamp(320px, 38vw, 520px);
    }
    .hero-cup-wrap:nth-child(1) { margin-right: -80px; }
    .hero-cup-wrap:nth-child(2) { margin-bottom: 40px; }
    .hero-cup-wrap:nth-child(3) { margin-left: -80px; }
  }

  @media (min-width: 1024px) {
    .hero-cup-wrap:nth-child(1) { margin-right: -120px; }
    .hero-cup-wrap:nth-child(3) { margin-left: -120px; }
    .hero-cup-wrap img { height: clamp(400px, 42vw, 580px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-eyebrow, .hero-fresh, .hero-tagline, .hero-features, .hero-btns,
    .hero-taiwan img, .hero-cup-wrap, .hero-splash {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }
  }
`;

function FeatureIcon({ type }) {
  const icons = {
    ingredients: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22C12 22 4 16 4 10a8 8 0 0116 0c0 6-8 12-8 12z" />
        <path d="M12 22V10" />
      </svg>
    ),
    taste: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20c0-4 2.7-7 6-7s6 3 6 7" />
      </svg>
    ),
    healthy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22V12" />
        <path d="M12 12C12 12 6 10 4 4c4 0 8 2 8 8" />
        <path d="M12 12c0 0 6-2 8-8-4 0-8 2-8 8" />
      </svg>
    ),
    chewy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 4h8l2 4v12H6V8l2-4z" />
        <path d="M8 12h8" />
      </svg>
    ),
  };
  return icons[type] || icons.ingredients;
}

function Leaf({ size = 32, style = {}, className = "" }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none" style={style} className={className}>
      <path d="M20 3C9 12 3 28 9 42C15 52 25 52 31 42C37 28 31 12 20 3Z"
        fill="rgba(255,255,255,.15)" stroke="rgba(255,255,255,.35)" strokeWidth="1.2"/>
    </svg>
  );
}

function Cloud({ w = 60, style = {} }) {
  return (
    <svg width={w} height={w * 0.45} viewBox="0 0 85 38" fill="none" style={style}>
      <ellipse cx="30" cy="24" rx="18" ry="12" stroke="rgba(255,255,255,.45)" strokeWidth="1.4" fill="rgba(255,255,255,.06)"/>
      <ellipse cx="50" cy="26" rx="16" ry="11" stroke="rgba(255,255,255,.45)" strokeWidth="1.4" fill="rgba(255,255,255,.06)"/>
      <ellipse cx="40" cy="18" rx="15" ry="11" stroke="rgba(255,255,255,.45)" strokeWidth="1.4" fill="rgba(255,255,255,.06)"/>
    </svg>
  );
}

function TaiwanMap({ style = {} }) {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" style={style}>
      <path d="M24 4C14 8 8 18 10 28c1 6 4 12 8 16 2 2 4 4 6 8 2-4 4-6 6-8 4-4 7-10 8-16 2-10-4-20-14-24z"
        fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
      <text x="24" y="32" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontWeight="800">TAIWAN</text>
    </svg>
  );
}

function TaipeiTower({ style = {} }) {
  return (
    <svg width="36" height="72" viewBox="0 0 58 120" fill="none" style={{ opacity: 0.35, ...style }}>
      <rect x="25" y="102" width="8" height="18" fill="rgba(255,255,255,.9)"/>
      <rect x="19" y="80" width="20" height="24" rx="2" fill="rgba(255,255,255,.9)"/>
      <rect x="14" y="59" width="30" height="23" rx="2" fill="rgba(255,255,255,.9)"/>
      <rect x="23" y="24" width="12" height="20" rx="1" fill="rgba(255,255,255,.9)"/>
      <rect x="25" y="6" width="8" height="20" rx="1" fill="rgba(255,255,255,.9)"/>
    </svg>
  );
}

function Temple({ style = {} }) {
  return (
    <svg width="44" height="54" viewBox="0 0 76 92" fill="none" style={{ opacity: 0.35, ...style }}>
      <rect x="8" y="62" width="60" height="26" rx="2" fill="rgba(255,255,255,.9)"/>
      <path d="M2 62 Q38 42 74 62Z" fill="rgba(255,255,255,.9)"/>
      <path d="M16 43 Q38 24 60 43Z" fill="rgba(255,255,255,.9)"/>
    </svg>
  );
}

export default function Hero() {
  const [cupsReady, setCupsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCupsReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="hero-section">
        {/* Background glow */}
        <div className="hero-deco" style={{
          inset: 0,
          background: "radial-gradient(ellipse at 70% 20%, rgba(200,228,148,0.45) 0%, transparent 55%)",
        }} />

        {/* Decorations — hidden on very small screens via opacity */}
        <Leaf size={28} style={{ position: "absolute", top: "4%", left: "2%", opacity: 0.7 }} />
        <Leaf size={22} style={{ position: "absolute", top: "12%", right: "4%", opacity: 0.6, transform: "scaleX(-1)" }} />
        <Cloud w={50} style={{ position: "absolute", top: "6%", right: "18%", opacity: 0.7 }} />
        <Cloud w={40} style={{ position: "absolute", top: "3%", right: "6%", opacity: 0.5 }} />
        <TaipeiTower style={{ position: "absolute", bottom: "28%", left: "2%" }} />
        <Temple style={{ position: "absolute", top: "8%", right: "12%" }} />
        <TaiwanMap style={{ position: "absolute", top: "6%", right: "22%" }} />

        <div className="hero-inner">
          {/* Copy — mobile first, stacks on top */}
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Authentic Taiwanese Milk Tea</span>
              <span className="hero-eyebrow-line" />
            </div>

            <div className="hero-fresh">Fresh Taste of</div>

            <div className="hero-taiwan">
              <img src="/taiwan-word.png" alt="Taiwan" />
            </div>

            <div className="hero-tagline">Milky · Healthy · Chewy</div>

            <div className="hero-features">
              {FEATURES.map((f) => (
                <div key={f.id} className="hero-feature">
                  <div className="hero-feature-icon">
                    <FeatureIcon type={f.id} />
                  </div>
                  <span className="hero-feature-label">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-btns">
              <FranchiseInquiryTrigger className="hero-btn-primary">
                Franchise Now +
              </FranchiseInquiryTrigger>
              <Link to="/products" className="hero-btn-secondary">
                View Menu
              </Link>
            </div>
          </div>

          {/* Cups visual */}
          <div className="hero-visual">
            <div className="hero-cups">
              {topDrinks.map((drink, i) => (
                <div
                  key={drink.id}
                  className="hero-cup-wrap"
                  style={{ opacity: cupsReady ? 1 : 0, transition: "opacity 0.6s ease" }}
                >
                  <img src={drink.imageUrl} alt={drink.name} draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milk splash wave */}
        <div className="hero-splash">
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ width: "100%", display: "block" }}>
            <path
              d="M0,90 C240,50 480,130 720,80 C960,30 1200,110 1440,70 L1440,160 L0,160 Z"
              fill="rgba(255,255,255,0.35)"
            />
            <path
              d="M0,70 C240,30 480,110 720,60 C960,10 1200,90 1440,50 L1440,160 L0,160 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>
    </>
  );
}
