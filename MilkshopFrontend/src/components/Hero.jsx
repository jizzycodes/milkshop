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
  @keyframes floatCup {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-10px); }
  }
  @keyframes floatCupAlt {
    0%, 100% { transform: translateY(-6px); }
    50%      { transform: translateY(4px); }
  }
  @keyframes heroTaiwanPop {
    0%   { opacity: 0; transform: translateY(14px) scale(0.94); }
    60%  { opacity: 1; transform: translateY(0) scale(1.03); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroTaiwanFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes splashPulse {
    0%, 100% { transform: scaleY(1) scaleX(1); }
    50%      { transform: scaleY(1.025) scaleX(1.003); }
  }
  @keyframes cupEntrance {
    from { opacity: 0; transform: translateY(40px) scale(0.92); }
    to   { opacity: 1; }
  }

  /* ─── Section ─────────────────────────────────────── */
  .hero-section {
    position: relative;
    overflow: hidden;
    background: linear-gradient(150deg, #c8dc7a 0%, #97b64c 30%, #7ca03e 60%, #5e7f0a 100%);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
  }

  /* ─── Ambient glow overlay ────────────────────────── */
  .hero-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 15%, rgba(220,240,160,0.38) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(100,160,20,0.2) 0%, transparent 65%);
  }

  /* ─── Inner layout ────────────────────────────────── */
  .hero-inner {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 80px 24px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ─── LEFT: Copy ──────────────────────────────────── */
  .hero-copy {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding-bottom: 16px;
  }

  .hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    animation: fadeUp 0.5s ease forwards;
  }
  .hero-eyebrow-line {
    width: 20px;
    height: 2px;
    background: rgba(255,255,255,0.85);
    border-radius: 2px;
  }
  .hero-eyebrow-text {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
  }

  .hero-fresh {
    font-family: 'Caveat', cursive;
    font-size: clamp(2rem, 8vw, 3rem);
    font-weight: 800;
    color: #fff;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: fadeUp 0.5s ease forwards 0.1s;
    opacity: 0;
    margin-bottom: -4px;
  }

  .hero-taiwan {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-taiwan img {
    height: clamp(64px, 18vw, 100px);
    width: auto;
    display: block;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
    opacity: 0;
    animation: heroTaiwanPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.35s,
               heroTaiwanFloat 4s ease-in-out infinite 1.2s;
    will-change: transform, opacity;
  }

  .hero-tagline {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(1rem, 4.5vw, 1.35rem);
    color: #fff;
    letter-spacing: 0.06em;
    margin-top: 4px;
    animation: fadeUp 0.5s ease forwards 0.75s;
    opacity: 0;
  }

  .hero-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px 10px;
    width: 100%;
    max-width: 320px;
    margin-top: 16px;
    animation: fadeUp 0.5s ease forwards 0.95s;
    opacity: 0;
  }
  .hero-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    text-align: center;
  }
  .hero-feature-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(4px);
  }
  .hero-feature-label {
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.93);
    line-height: 1.4;
    max-width: 110px;
  }

  /* ─── Buttons ─────────────────────────────────────── */
  .hero-btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 11px;
    width: 100%;
    max-width: 300px;
    margin-top: 20px;
    animation: fadeUp 0.5s ease forwards 1.1s;
    opacity: 0;
  }
  .hero-btn-primary,
  .hero-btn-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 28px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.02em;
  }
  .hero-btn-primary {
    background: linear-gradient(135deg, #f0a820 0%, #d48a10 100%);
    color: #fff;
    box-shadow: 0 6px 20px rgba(232,160,32,0.45), 0 2px 6px rgba(0,0,0,0.15);
  }
  .hero-btn-primary:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 10px 28px rgba(232,160,32,0.55), 0 4px 10px rgba(0,0,0,0.18);
    background: linear-gradient(135deg, #f5b030 0%, #e09418 100%);
  }
  .hero-btn-primary:active { transform: translateY(0) scale(0.99); }

  .hero-btn-secondary {
    background: rgba(255,255,255,0.95);
    color: #4a7008;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    border: 1.5px solid rgba(255,255,255,0.9);
  }
  .hero-btn-secondary:hover {
    transform: translateY(-2px) scale(1.01);
    background: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.16);
  }
  .hero-btn-secondary:active { transform: translateY(0) scale(0.99); }

  /* ─── RIGHT: Cups visual ──────────────────────────── */
  .hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: 240px;
    margin-top: 4px;
  }

  .hero-cups {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    z-index: 2;
    transform: rotate(-6deg);
    transform-origin: 50% 100%;
  }

  /* Cup wrappers — slanted left like \ */
  .hero-cup-wrap {
    flex-shrink: 0;
    position: relative;
    transition: opacity 0.6s ease;
  }

  .hero-cup-wrap:nth-child(1) {
    z-index: 1;
    margin-right: -18vw;
    transform: rotate(-5deg) translateX(8px) translateY(-6px);
  }
  .hero-cup-wrap:nth-child(2) {
    z-index: 3;
    margin-bottom: 10px;
    transform: rotate(-3deg) translateY(-2px);
  }
  .hero-cup-wrap:nth-child(3) {
    z-index: 2;
    margin-left: -18vw;
    transform: rotate(-1deg) translateX(-6px) translateY(8px);
  }

  .hero-cup-wrap:nth-child(1) img {
    animation: cupEntrance 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards,
      floatCup 5.2s ease-in-out infinite 0.7s;
  }
  .hero-cup-wrap:nth-child(2) img {
    animation: cupEntrance 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.12s,
      floatCupAlt 4.8s ease-in-out infinite 1s;
  }
  .hero-cup-wrap:nth-child(3) img {
    animation: cupEntrance 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.24s,
      floatCup 5.6s ease-in-out infinite 1.2s;
  }

  .hero-cup-wrap img {
    height: clamp(160px, 44vw, 220px);
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 16px 28px rgba(0,0,0,0.26));
    display: block;
  }
  /* Slightly smaller side cups */
  .hero-cup-wrap:nth-child(1) img,
  .hero-cup-wrap:nth-child(3) img {
    height: clamp(130px, 36vw, 185px);
    filter: drop-shadow(0 12px 22px rgba(0,0,0,0.22));
  }

  /* ─── Milk splash wave ────────────────────────────── */
  .hero-splash {
    position: relative;
    z-index: 5;
    margin-top: -2px;
    transform-origin: bottom center;
    animation: splashPulse 6s ease-in-out infinite;
    line-height: 0;
    flex-shrink: 0;
  }
  .hero-splash svg {
    width: 100%;
    display: block;
  }

  /* ─── Decorative absolute elements ───────────────── */
  .hero-deco {
    position: absolute;
    pointer-events: none;
    z-index: 0;
  }

  /* ─── DESKTOP (768px+) ────────────────────────────── */
  @media (min-width: 768px) {
    .hero-inner {
      flex-direction: row;
      align-items: flex-end;
      padding: 90px 48px 0;
      gap: 0;
      min-height: calc(100svh - 120px);
    }

    .hero-copy {
      flex: 0 0 48%;
      align-items: flex-start;
      text-align: left;
      padding-bottom: 100px;
      gap: 11px;
    }

    .hero-eyebrow { justify-content: flex-start; }
    .hero-eyebrow-text { font-size: 10px; }

    .hero-fresh { font-size: clamp(2.6rem, 3.8vw, 3.8rem); margin-bottom: -6px; }

    .hero-taiwan { justify-content: flex-start; }
    .hero-taiwan img { height: clamp(80px, 9vw, 130px); }

    .hero-tagline { font-size: clamp(1.1rem, 1.8vw, 1.5rem); }

    .hero-features {
      grid-template-columns: repeat(4, 1fr);
      max-width: 100%;
      gap: 12px;
      margin-top: 20px;
    }
    .hero-feature-label { font-size: 7px; max-width: 88px; }
    .hero-feature-icon { width: 46px; height: 46px; }

    .hero-btns {
      flex-direction: row;
      max-width: none;
      width: auto;
      align-items: flex-start;
      margin-top: 24px;
    }
    .hero-btn-primary,
    .hero-btn-secondary {
      width: auto;
      min-width: 155px;
    }

    .hero-visual {
      flex: 1;
      min-height: 500px;
      margin-top: 0;
      align-items: flex-end;
      justify-content: center;
    }

    .hero-cups {
      transform: rotate(-7deg);
    }

    .hero-cup-wrap:nth-child(1) {
      margin-right: -9vw;
      transform: rotate(-6deg) translateX(10px) translateY(-10px);
    }
    .hero-cup-wrap:nth-child(3) {
      margin-left: -9vw;
      transform: rotate(-2deg) translateX(-8px) translateY(12px);
    }
    .hero-cup-wrap:nth-child(2) {
      margin-bottom: 30px;
      transform: rotate(-4deg) translateY(-4px);
    }

    .hero-cup-wrap img {
      height: clamp(300px, 36vw, 500px);
    }
    .hero-cup-wrap:nth-child(1) img,
    .hero-cup-wrap:nth-child(3) img {
      height: clamp(240px, 28vw, 410px);
    }
  }

  /* ─── LARGE DESKTOP (1024px+) ────────────────────── */
  @media (min-width: 1024px) {
    .hero-copy { flex: 0 0 44%; }

    .hero-cup-wrap:nth-child(1) { margin-right: -10vw; }
    .hero-cup-wrap:nth-child(3) { margin-left: -10vw; }

    .hero-cup-wrap img { height: clamp(380px, 40vw, 560px); }
    .hero-cup-wrap:nth-child(1) img,
    .hero-cup-wrap:nth-child(3) img {
      height: clamp(300px, 32vw, 460px);
    }
  }

  /* ─── Reduced motion ──────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .hero-eyebrow, .hero-fresh, .hero-tagline,
    .hero-features, .hero-btns, .hero-taiwan img,
    .hero-cup-wrap, .hero-cup-wrap img, .hero-splash {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    /* Keep slant transforms for cups even in reduced motion */
    .hero-cups { transform: rotate(-6deg); }
    .hero-cup-wrap:nth-child(1) { transform: rotate(-5deg) translateX(8px) translateY(-6px); }
    .hero-cup-wrap:nth-child(2) { transform: rotate(-3deg) translateY(-2px); }
    .hero-cup-wrap:nth-child(3) { transform: rotate(-1deg) translateX(-6px) translateY(8px); }
  }
`;

function FeatureIcon({ type }) {
  const icons = {
    ingredients: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C12 22 4 16 4 10a8 8 0 0116 0c0 6-8 12-8 12z" />
        <path d="M12 10v12" />
      </svg>
    ),
    taste: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c1.5 2 4 3.5 4 6a4 4 0 01-8 0c0-2.5 2.5-4 4-6z" />
        <path d="M6 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
      </svg>
    ),
    healthy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12" />
        <path d="M12 12C12 12 6 10 4 4c4 0 8 2 8 8" />
        <path d="M12 12c0 0 6-2 8-8-4 0-8 2-8 8" />
      </svg>
    ),
    chewy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="14" r="2.5" />
        <circle cx="14" cy="10" r="2.5" />
        <circle cx="16" cy="17" r="2" />
        <circle cx="7" cy="8" r="1.5" />
      </svg>
    ),
  };
  return icons[type] || icons.ingredients;
}

function Leaf({ size = 32, style = {} }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" fill="none" style={style}>
      <path d="M20 3C9 12 3 28 9 42C15 52 25 52 31 42C37 28 31 12 20 3Z"
        fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.4)" strokeWidth="1.2"/>
      <path d="M20 8 Q20 30 20 46" stroke="rgba(255,255,255,.3)" strokeWidth="0.8"/>
    </svg>
  );
}

export default function Hero() {
  const [cupsReady, setCupsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCupsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="hero-section">

        {/* Ambient glow */}
        <div className="hero-glow" />

        {/* Floating leaves */}
        <Leaf size={30} style={{ position: "absolute", top: "5%", left: "3%", opacity: 0.75, zIndex: 1 }} />
        <Leaf size={22} style={{ position: "absolute", top: "14%", right: "5%", opacity: 0.6, transform: "scaleX(-1) rotate(20deg)", zIndex: 1 }} />
        <Leaf size={18} style={{ position: "absolute", top: "38%", left: "1%", opacity: 0.45, transform: "rotate(-30deg)", zIndex: 1 }} />
        <Leaf size={16} style={{ position: "absolute", top: "22%", right: "2%", opacity: 0.4, transform: "rotate(15deg)", zIndex: 1 }} />

        <div className="hero-inner">

          {/* ── LEFT: Copy ── */}
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Authentic Taiwanese Milk Tea</span>
              <span className="hero-eyebrow-line" />
            </div>

            <div className="hero-fresh">Fresh Taste of</div>

            <div className="hero-taiwan">
              <img src="/TAIWAN-WORD.png" alt="Taiwan" />
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

          {/* ── RIGHT: Cups ── */}
          <div className="hero-visual">
            <div className="hero-cups">
              {topDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="hero-cup-wrap"
                  style={{ opacity: cupsReady ? 1 : 0 }}
                >
                  <img src={drink.imageUrl} alt={drink.name} draggable={false} />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Milk splash wave ── */}
        <div className="hero-splash">
          <svg
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Back ripple layer */}
            <path
              d="M0,140
                 C60,125 100,108 140,118
                 C165,124 175,138 200,144
                 C220,149 235,144 255,132
                 C280,118 295,100 330,105
                 C360,110 375,128 410,136
                 C440,143 460,140 490,128
                 C520,116 535,100 570,106
                 C600,112 615,130 650,138
                 C680,145 700,142 730,130
                 C758,118 772,102 808,108
                 C838,113 852,130 888,138
                 C918,145 938,141 968,130
                 C998,118 1012,102 1048,107
                 C1078,112 1092,130 1128,138
                 C1158,145 1178,140 1208,128
                 C1238,116 1252,100 1290,106
                 C1340,114 1390,136 1440,130
                 L1440,200 L0,200 Z"
              fill="rgba(255,255,255,0.3)"
            />
            {/* Splash drip left */}
            <path
              d="M60,128 C58,112 52,96 48,80 C45,68 46,56 52,50 C56,46 62,46 66,50 C72,56 72,70 68,84 C64,98 64,114 66,128Z"
              fill="rgba(255,255,255,0.55)"
            />
            {/* Splash drip mid-left */}
            <path
              d="M200,120 C198,106 194,90 192,74 C190,62 192,52 198,48 C202,44 208,45 211,50 C216,57 214,70 210,84 C206,98 205,112 206,122Z"
              fill="rgba(255,255,255,0.5)"
            />
            {/* Splash drip center-left */}
            <path
              d="M380,112 C378,100 376,84 376,68 C376,56 379,46 385,43 C389,40 394,42 397,47 C401,54 400,67 397,81 C393,95 392,108 393,118Z"
              fill="rgba(255,255,255,0.6)"
            />
            {/* Splash drip center */}
            <path
              d="M620,118 C618,104 615,88 615,72 C615,60 618,50 624,47 C628,44 634,46 636,52 C640,60 638,74 634,88 C630,102 630,114 631,122Z"
              fill="rgba(255,255,255,0.55)"
            />
            {/* Splash drip center-right */}
            <path
              d="M840,110 C838,98 836,84 837,70 C838,58 842,49 848,46 C852,43 857,46 859,52 C862,60 860,73 856,87 C852,100 851,112 853,120Z"
              fill="rgba(255,255,255,0.5)"
            />
            {/* Splash drip right */}
            <path
              d="M1100,116 C1098,104 1096,88 1097,74 C1098,62 1102,52 1108,49 C1112,46 1117,49 1119,55 C1122,63 1120,76 1116,90 C1112,103 1112,114 1114,122Z"
              fill="rgba(255,255,255,0.5)"
            />
            {/* Splash drip far right */}
            <path
              d="M1340,122 C1338,110 1337,96 1338,82 C1339,70 1343,61 1348,59 C1352,57 1357,60 1359,66 C1362,74 1360,86 1356,99 C1352,111 1352,121 1354,128Z"
              fill="rgba(255,255,255,0.45)"
            />
            {/* Scattered milk droplets */}
            <ellipse cx="130" cy="125" rx="7" ry="9" fill="rgba(255,255,255,0.65)" />
            <ellipse cx="310" cy="118" rx="5" ry="7" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="500" cy="122" rx="8" ry="10" fill="rgba(255,255,255,0.65)" />
            <ellipse cx="700" cy="116" rx="6" ry="8" fill="rgba(255,255,255,0.55)" />
            <ellipse cx="920" cy="120" rx="7" ry="9" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="1150" cy="118" rx="5" ry="6" fill="rgba(255,255,255,0.55)" />
            <ellipse cx="1380" cy="123" rx="6" ry="8" fill="rgba(255,255,255,0.5)" />
            {/* Small boba pearls scattered at base */}
            <circle cx="160" cy="152" r="5" fill="rgba(80,40,10,0.35)" />
            <circle cx="290" cy="158" r="4" fill="rgba(80,40,10,0.3)" />
            <circle cx="450" cy="154" r="6" fill="rgba(80,40,10,0.35)" />
            <circle cx="640" cy="160" r="5" fill="rgba(80,40,10,0.3)" />
            <circle cx="800" cy="155" r="4" fill="rgba(80,40,10,0.3)" />
            <circle cx="1000" cy="158" r="6" fill="rgba(80,40,10,0.32)" />
            <circle cx="1200" cy="153" r="5" fill="rgba(80,40,10,0.28)" />
            <circle cx="1360" cy="157" r="4" fill="rgba(80,40,10,0.28)" />
            {/* Main white wave — front layer */}
            <path
              d="M0,155
                 C80,138 140,122 200,132
                 C240,139 260,152 300,158
                 C330,163 355,158 385,146
                 C415,133 430,118 468,124
                 C500,129 515,145 550,154
                 C580,162 600,160 630,148
                 C660,136 674,120 712,126
                 C744,131 758,148 794,156
                 C824,163 846,160 876,148
                 C906,136 920,120 958,126
                 C990,131 1004,148 1040,156
                 C1070,163 1092,159 1122,147
                 C1152,135 1166,119 1204,126
                 C1260,135 1340,158 1440,148
                 L1440,200 L0,200 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

      </section>
    </>
  );
}