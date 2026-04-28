import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  { letter: "A", color: "#f4a261" },
  { letter: "I", color: "#e9c46a" },
  { letter: "W", color: "#62840b" },
  { letter: "A", color: "#2196f3" },
  { letter: "N", color: "#9c27b0" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=DM+Sans:ital,wght@0,400;0,700;0,800;0,900;1,900&family=Caveat:wght@700;800&display=swap');

  :root {
    --g-mod: #97b64c;
    --g-dark: #62840b;
    --g-light: #b7cd7f;
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes letterPop {
    0%   { opacity:0; transform:translateY(50px) scale(0.6) rotate(-8deg); }
    65%  { transform:translateY(-8px) scale(1.12) rotate(3deg); }
    100% { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
  }
  @keyframes tagBounce {
    0%   { opacity:0; transform:translateX(-40px) rotate(-2deg); }
    70%  { transform:translateX(6px) rotate(1deg); }
    100% { opacity:1; transform:translateX(0) rotate(0deg); }
  }
  @keyframes floatCup0 {
    0%,100% { transform: rotate(-14deg) translateY(0px); }
    50%      { transform: rotate(-14deg) translateY(-18px); }
  }
  @keyframes floatCup1 {
    0%,100% { transform: rotate(-10deg) translateY(0px); }
    50%      { transform: rotate(-10deg) translateY(-24px); }
  }
  @keyframes floatCup2 {
    0%,100% { transform: rotate(-6deg) translateY(0px); }
    50%      { transform: rotate(-6deg) translateY(-20px); }
  }
  @keyframes cupDrop0 {
    0%   { opacity:0; transform: rotate(-14deg) translateY(80px); }
    100% { opacity:1; transform: rotate(-14deg) translateY(0); }
  }
  @keyframes cupDrop1 {
    0%   { opacity:0; transform: rotate(-10deg) translateY(100px); }
    100% { opacity:1; transform: rotate(-10deg) translateY(0); }
  }
  @keyframes cupDrop2 {
    0%   { opacity:0; transform: rotate(-6deg) translateY(120px); }
    100% { opacity:1; transform: rotate(-6deg) translateY(0); }
  }
  @keyframes floatLeaf {
    0%,100% { transform:translateY(0) rotate(0deg); }
    50%      { transform:translateY(-14px) rotate(18deg); }
  }
  @keyframes floatBalloon {
    0%,100% { transform:translateY(0) rotate(-3deg); }
    50%      { transform:translateY(-12px) rotate(3deg); }
  }
  @keyframes driftCloud {
    0%,100% { transform:translateX(0); }
    50%      { transform:translateX(10px); }
  }
  @keyframes flyBird {
    0%   { transform:translateX(-10px) translateY(0); }
    25%  { transform:translateX(-4px) translateY(-4px); }
    50%  { transform:translateX(0) translateY(0); }
    75%  { transform:translateX(4px) translateY(-4px); }
    100% { transform:translateX(10px) translateY(0); }
  }
  @keyframes splashWave {
    0%,100% { transform:scaleY(1); }
    50%      { transform:scaleY(1.04); }
  }
  @keyframes bubbleFloat {
    0%,100% { transform:translateY(0) scale(1); opacity:.5; }
    50%      { transform:translateY(-10px) scale(1.08); opacity:.8; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes marq {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  @keyframes pulseGlow {
    0%,100% { text-shadow: 0 0 12px currentColor, 0 4px 20px rgba(0,0,0,0.2); }
    50%      { text-shadow: 0 0 28px currentColor, 0 4px 30px rgba(0,0,0,0.3); }
  }
  @keyframes twinkle {
    0%,100% { opacity:0.3; transform:scale(0.8); }
    50%      { opacity:1; transform:scale(1.2); }
  }

  /* ── APPLIED ── */
  .ms-cup0-enter { animation: cupDrop0 0.7s cubic-bezier(.34,1.56,.64,1) forwards; }
  .ms-cup1-enter { animation: cupDrop1 0.7s cubic-bezier(.34,1.56,.64,1) .12s forwards; }
  .ms-cup2-enter { animation: cupDrop2 0.7s cubic-bezier(.34,1.56,.64,1) .24s forwards; }

  .ms-cup0-float { animation: floatCup0 6s ease-in-out infinite; }
  .ms-cup1-float { animation: floatCup1 7.5s ease-in-out infinite; }
  .ms-cup2-float { animation: floatCup2 5.8s ease-in-out infinite; }

  .ms-leaf   { animation: floatLeaf 5s ease-in-out infinite; }
  .ms-ballon { animation: floatBalloon 6s ease-in-out infinite; }
  .ms-cloud  { animation: driftCloud 7s ease-in-out infinite; }
  .ms-bird   { animation: flyBird 2.2s ease-in-out infinite; }
  .ms-splash { animation: splashWave 4s ease-in-out infinite; transform-origin: bottom; }
  .ms-bubble { animation: bubbleFloat var(--d,4s) ease-in-out infinite; }

  .ms-eyebrow { opacity:0; animation: fadeUp .5s ease forwards .1s; }
  .ms-fresh   { opacity:0; animation: fadeUp .55s cubic-bezier(.34,1.56,.64,1) forwards .2s; }
  .ms-of      { opacity:0; animation: fadeUp .5s ease forwards .35s; }
  .ms-tag     { opacity:0; animation: tagBounce .65s cubic-bezier(.34,1.56,.64,1) forwards 1.6s; }
  .ms-btns    { opacity:0; animation: fadeUp .5s ease forwards 1.8s; }
  .ms-trust   { opacity:0; animation: fadeUp .5s ease forwards 2s; }

  .ms-letter-glow { animation: pulseGlow 3s ease-in-out infinite; }
  .ms-twinkle    { animation: twinkle var(--d,2s) ease-in-out infinite; }

  .ms-cta-main {
    display:inline-flex; align-items:center; gap:8px;
    padding:14px 30px; border-radius:999px;
    background: linear-gradient(135deg, var(--g-dark), var(--g-mod));
    color:white; font-weight:900; font-size:14px;
    text-decoration:none; letter-spacing:.06em;
    box-shadow: 0 12px 32px rgba(98,132,11,.45), inset 0 1px 0 rgba(255,255,255,.2);
    transition: transform .25s, box-shadow .25s;
    font-family: 'Fredoka One', cursive;
  }
  .ms-cta-main:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 20px 40px rgba(98,132,11,.55); }

  .ms-cta-out {
    display:inline-flex; align-items:center; gap:8px;
    padding:14px 30px; border-radius:999px;
    border: 2.5px solid rgba(255,255,255,.7);
    color:white; font-weight:700; font-size:14px;
    text-decoration:none; background:rgba(255,255,255,.18);
    backdrop-filter:blur(10px);
    transition: all .25s;
    font-family: 'DM Sans', sans-serif;
  }
  .ms-cta-out:hover { background:rgba(255,255,255,.35); transform:translateY(-4px); border-color:white; }
`;

/* ── SVG Deco Components ── */
function Leaf({ size = 36, style = {}, className = "" }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none" style={style} className={className}>
      <path d="M20 3C9 12 3 30 9 45C15 56 25 56 31 45C37 30 31 12 20 3Z" fill="var(--g-light)" opacity=".85"/>
      <path d="M20 3L20 52" stroke="var(--g-dark)" strokeWidth="1.3" opacity=".5"/>
      <path d="M20 22 Q28 32 30 40" stroke="var(--g-dark)" strokeWidth=".9" fill="none" opacity=".4"/>
      <path d="M20 22 Q12 32 10 40" stroke="var(--g-dark)" strokeWidth=".9" fill="none" opacity=".4"/>
    </svg>
  );
}

function HotAirBalloon({ size = 44, style = {} }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 44 66" fill="none" style={style} className="ms-ballon">
      <ellipse cx="22" cy="24" rx="18" ry="20" stroke="rgba(255,255,255,.5)" strokeWidth="1.6" fill="none"/>
      <path d="M10 10 Q22 2 34 10" stroke="rgba(255,255,255,.4)" strokeWidth="1.2" fill="none"/>
      <path d="M6 20 Q22 12 38 20" stroke="rgba(255,255,255,.3)" strokeWidth="1" fill="none"/>
      <path d="M5 30 Q22 22 39 30" stroke="rgba(255,255,255,.25)" strokeWidth="1" fill="none"/>
      <path d="M14 42 Q22 50 30 42" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" fill="none"/>
      <rect x="17" y="46" width="10" height="8" rx="2" stroke="rgba(255,255,255,.45)" strokeWidth="1.3" fill="none"/>
      <line x1="17" y1="46" x2="14" y2="42" stroke="rgba(255,255,255,.35)" strokeWidth="1"/>
      <line x1="27" y1="46" x2="30" y2="42" stroke="rgba(255,255,255,.35)" strokeWidth="1"/>
    </svg>
  );
}

function Cloud({ w = 70, style = {} }) {
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 70 35" fill="none" style={style} className="ms-cloud">
      <ellipse cx="24" cy="22" rx="16" ry="11" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" fill="none"/>
      <ellipse cx="40" cy="24" rx="14" ry="10" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" fill="none"/>
      <ellipse cx="32" cy="17" rx="13" ry="10" stroke="rgba(255,255,255,.45)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

function Bird({ style = {} }) {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" fill="none" style={style} className="ms-bird">
      <path d="M2 6 Q6 1 12 6 Q18 1 22 6" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function TaipeiTower({ style = {} }) {
  return (
    <svg width="50" height="105" viewBox="0 0 50 105" fill="none" style={{ opacity: .18, ...style }}>
      <rect x="22" y="90" width="6" height="15" fill="rgba(255,255,255,.9)"/>
      <rect x="17" y="70" width="16" height="22" rx="2" fill="rgba(255,255,255,.9)"/>
      <rect x="12" y="52" width="26" height="20" rx="2" fill="rgba(255,255,255,.9)"/>
      <rect x="17" y="36" width="16" height="18" rx="1" fill="rgba(255,255,255,.9)"/>
      <rect x="20" y="20" width="10" height="18" rx="1" fill="rgba(255,255,255,.9)"/>
      <rect x="22" y="6" width="6" height="16" rx="1" fill="rgba(255,255,255,.9)"/>
      <line x1="6"  y1="70" x2="44" y2="70" stroke="rgba(255,255,255,.9)" strokeWidth="1.5"/>
      <line x1="10" y1="52" x2="40" y2="52" stroke="rgba(255,255,255,.9)" strokeWidth="1.2"/>
    </svg>
  );
}

function Temple({ style = {} }) {
  return (
    <svg width="65" height="80" viewBox="0 0 65 80" fill="none" style={{ opacity: .16, ...style }}>
      <rect x="8" y="54" width="49" height="22" rx="2" fill="rgba(255,255,255,.9)"/>
      <rect x="18" y="38" width="29" height="18" rx="1" fill="rgba(255,255,255,.9)"/>
      <path d="M4 54 Q32 36 61 54Z" fill="rgba(255,255,255,.9)"/>
      <path d="M14 38 Q32 22 51 38Z" fill="rgba(255,255,255,.9)"/>
      <rect x="26" y="54" width="13" height="22" rx="1" fill="rgba(255,255,255,.5)"/>
      <line x1="32" y1="10" x2="32" y2="22" stroke="rgba(255,255,255,.9)" strokeWidth="1.5"/>
    </svg>
  );
}

function Plant({ style = {} }) {
  return (
    <svg width="44" height="60" viewBox="0 0 44 60" fill="none" style={{ opacity: .22, ...style }}>
      <line x1="22" y1="60" x2="22" y2="20" stroke="rgba(255,255,255,.9)" strokeWidth="1.5"/>
      <path d="M22 40 Q10 30 8 18 Q18 16 22 30Z" fill="rgba(255,255,255,.9)"/>
      <path d="M22 32 Q34 22 36 10 Q26 8 22 22Z" fill="rgba(255,255,255,.9)"/>
      <path d="M22 50 Q12 44 10 34 Q20 32 22 44Z" fill="rgba(255,255,255,.9)"/>
    </svg>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [cupsReady, setCupsReady] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setCupsReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(140deg, #b7cd7f 0%, #97b64c 38%, #7a9c38 70%, #62840b 100%)",
        minHeight: isMobile ? "100svh" : "88vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── RADIAL GLOW CENTER ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 60% 30%, rgba(183,205,127,0.5) 0%, transparent 60%)",
        }}/>

        {/* ── DOT TEXTURE ── */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .08, pointerEvents: "none" }}>
          <defs>
            <pattern id="dotg" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#1e1e1e"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotg)"/>
        </svg>

        {/* ── TWINKLE STARS ── */}
        {[
          { t:"12%", l:"22%", d:"1.8s", dl:"0s", sz:6 },
          { t:"8%",  l:"55%", d:"2.4s", dl:"-1s", sz:5 },
          { t:"20%", l:"72%", d:"1.6s", dl:"-0.5s", sz:4 },
          { t:"35%", l:"15%", d:"2.8s", dl:"-2s", sz:5 },
          { t:"6%",  r:"12%", d:"2s",  dl:"-1.5s", sz:6 },
        ].map((s, i) => (
          <div key={i} className="ms-twinkle" style={{
            position: "absolute", top: s.t, left: s.l, right: s.r,
            width: s.sz, height: s.sz, borderRadius: "50%",
            background: "rgba(255,255,255,.9)",
            boxShadow: "0 0 6px rgba(255,255,255,.9)",
            "--d": s.d, animationDelay: s.dl,
          }}/>
        ))}

        {/* ── BUBBLES ── */}
        {[
          { t:"10%", l:"18%", w:22, d:"4s",  dl:"0s"   },
          { t:"22%", l:"35%", w:14, d:"5.5s",dl:"-1s"  },
          { t:"5%",  l:"62%", w:18, d:"4.8s",dl:"-2s"  },
          { t:"32%", r:"18%", w:13, d:"6s",  dl:"-0.5s"},
          { t:"50%", l:"5%",  w:10, d:"5.2s",dl:"-3s"  },
          { t:"16%", r:"30%", w:16, d:"3.8s",dl:"-1.5s"},
        ].map((b, i) => (
          <div key={i} className="ms-bubble" style={{
            position: "absolute", top: b.t, left: b.l, right: b.r,
            width: b.w, height: b.w, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.7), rgba(255,255,255,.08))",
            border: "1px solid rgba(255,255,255,.45)",
            "--d": b.d, animationDelay: b.dl,
          }}/>
        ))}

        {/* ── FLOATING LEAVES ── */}
        <Leaf size={46} className="ms-leaf" style={{ position:"absolute", top:"4%", left:"0.5%", animationDelay:"0s" }}/>
        <Leaf size={28} className="ms-leaf" style={{ position:"absolute", top:"16%", left:"6%", animationDelay:"-2s" }}/>
        <Leaf size={34} className="ms-leaf" style={{ position:"absolute", top:"3%", right:"3%", animationDelay:"-1s", transform:"scaleX(-1)" }}/>
        <Leaf size={20} className="ms-leaf" style={{ position:"absolute", top:"22%", right:"9%", animationDelay:"-3s", transform:"scaleX(-1) rotate(20deg)" }}/>
        {!isMobile && <Leaf size={16} className="ms-leaf" style={{ position:"absolute", top:"42%", left:"1%", animationDelay:"-4s" }}/>}

        {/* ── HOT AIR BALLOONS ── */}
        <HotAirBalloon size={42} style={{ position:"absolute", top:"6%", right:"20%", animationDelay:"0s" }}/>
        {!isMobile && <HotAirBalloon size={28} style={{ position:"absolute", top:"14%", right:"42%", animationDelay:"-2s" }}/>}

        {/* ── CLOUDS ── */}
        <Cloud w={60} style={{ position:"absolute", top:"10%", right:"26%", animationDelay:"-1s" }}/>
        {!isMobile && <Cloud w={44} style={{ position:"absolute", top:"20%", right:"45%", animationDelay:"-3s" }}/>}
        <Cloud w={50} style={{ position:"absolute", top:"5%", right:"8%", animationDelay:"-0.5s" }}/>

        {/* ── BIRDS ── */}
        <Bird style={{ position:"absolute", top:"13%", left:"40%", animationDelay:"0s" }}/>
        <Bird style={{ position:"absolute", top:"18%", left:"44%", animationDelay:"-0.4s", transform:"scale(0.7)" }}/>
        {!isMobile && <Bird style={{ position:"absolute", top:"10%", right:"35%", animationDelay:"-0.8s", transform:"scale(0.8)" }}/>}

        {/* ── TAIWAN LANDMARKS ── */}
        <TaipeiTower style={{ position:"absolute", bottom:"24%", left:"0.5%" }}/>
        {!isMobile && <Temple style={{ position:"absolute", bottom:"22%", left:"6.5%" }}/>}
        {!isMobile && <Plant style={{ position:"absolute", bottom:"22%", left:"14%" }}/>}

        {/* ══ MAIN CONTENT ══ */}
        <div style={{
          position: "relative", zIndex: 10,
          flex: 1,
          maxWidth: 1280, margin: "0 auto", width: "100%",
          padding: isMobile ? "72px 20px 0" : "70px 52px 0",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr",
          gap: isMobile ? 0 : 16,
          alignItems: "flex-end",
        }}>

          {/* ── LEFT TEXT ── */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            textAlign: isMobile ? "center" : "left",
            alignItems: isMobile ? "center" : "flex-start",
            paddingBottom: isMobile ? 24 : 110,
            zIndex: 2,
          }}>

            {/* Eyebrow */}
            <div className="ms-eyebrow" style={{
              display: "flex", alignItems: "center", gap: 8,
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              <span style={{ width:20, height:2, background:"rgba(255,255,255,.8)", borderRadius:2 }}/>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.28em",
                color: "rgba(255,255,255,.92)", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Authentic Taiwanese Milk Tea
              </span>
              <span style={{ width:20, height:2, background:"rgba(255,255,255,.8)", borderRadius:2 }}/>
            </div>

            {/* FRESH TASTE */}
            <div className="ms-fresh" style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? "clamp(2rem,10vw,3rem)" : "clamp(2.4rem,4.5vw,3.8rem)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textShadow: "0 3px 14px rgba(0,0,0,0.2)",
            }}>
              Fresh Taste
            </div>

            {/* OF */}
            <div className="ms-of" style={{
              fontFamily: "'Caveat', cursive",
              fontSize: isMobile ? "clamp(1.3rem,6vw,2rem)" : "clamp(1.5rem,2.8vw,2.3rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,.9)",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}>
              of
            </div>

            {/* TAIWAN — multicolor letters */}
            <div style={{
              display: "flex",
              gap: isMobile ? 3 : 5,
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              flexWrap: "nowrap",
            }}>
              {TAIWAN_LETTERS.map((item, i) => (
                <span
                  key={i}
                  className="ms-letter-glow"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontSize: isMobile ? "clamp(3.2rem,15vw,5.2rem)" : "clamp(4.5rem,8.5vw,8rem)",
                    fontWeight: 400,
                    color: item.color,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    display: "inline-block",
                    textShadow: `0 4px 0 rgba(0,0,0,0.18), 0 0 24px ${item.color}88`,
                    opacity: 0,
                    animation: `letterPop 0.6s cubic-bezier(.34,1.56,.64,1) forwards`,
                    animationDelay: `${0.55 + i * 0.1}s`,
                    WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                    filter: `drop-shadow(0 6px 12px ${item.color}55)`,
                  }}
                >
                  {item.letter}
                </span>
              ))}
            </div>

            {/* Tagline pill */}
            <div className="ms-tag">
              <div style={{
                background: "var(--g-dark)",
                borderRadius: 8,
                padding: isMobile ? "8px 20px" : "10px 24px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
              }}>
                <span style={{
                  color: "white",
                  fontWeight: 800,
                  fontSize: isMobile ? 13 : 16,
                  letterSpacing: "0.05em",
                  fontFamily: "'Fredoka One', cursive",
                }}>
                  Milky, Healthy, Chewy!
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="ms-btns" style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              <Link to="/franchise#inquiry" className="ms-cta-main">Franchise Now ✦</Link>
              <Link to="/products" className="ms-cta-out">View Menu</Link>
            </div>

            {/* Trust badges */}
            <div className="ms-trust" style={{
              display: "flex", gap: 16, flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              {["Real Ingredients", "No Powders", "Taiwan Recipe"].map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.85)",
                  letterSpacing: "0.1em",
                  display: "flex", alignItems: "center", gap: 5,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"white", opacity:.7, display:"inline-block" }}/>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── RIGHT — 3 SLANTED CUPS ── */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            height: isMobile ? 280 : 520,
            position: "relative",
            paddingRight: isMobile ? 0 : 20,
          }}>
            {/* Soft glow behind cups */}
            <div style={{
              position: "absolute",
              bottom: 60,
              left: "50%",
              transform: "translateX(-50%)",
              width: "80%",
              height: 80,
              borderRadius: "50%",
              background: "rgba(183,205,127,0.35)",
              filter: "blur(28px)",
              pointerEvents: "none",
            }}/>

            {topDrinks.map((drink, i) => {
              const heights    = isMobile ? [160, 210, 240] : [290, 390, 460];
              const rotations  = [-14, -10, -6];
              const zIndexes   = [1, 2, 3];
              const enterCls   = ["ms-cup0-enter","ms-cup1-enter","ms-cup2-enter"][i];
              const floatCls   = ["ms-cup0-float","ms-cup1-float","ms-cup2-float"][i];
              const bottoms    = isMobile ? [-10, -5, 0] : [-20, -10, 0];
              const rights     = isMobile
                ? ["auto","auto","auto"]
                : ["auto","auto","auto"];
              const marginLefts = isMobile ? [-20, -18, -12] : [-40, -36, -24];

              return (
                <div
                  key={drink.id}
                  style={{
                    position: "relative",
                    zIndex: zIndexes[i],
                    marginLeft: marginLefts[i],
                    marginBottom: bottoms[i],
                    opacity: 0,
                  }}
                  className={cupsReady ? `${enterCls}` : ""}
                >
                  <div className={cupsReady ? floatCls : ""} style={{
                    transform: `rotate(${rotations[i]}deg)`,
                  }}>
                    <img
                      src={drink.imageUrl}
                      alt={drink.name}
                      draggable={false}
                      style={{
                        height: heights[i],
                        objectFit: "contain",
                        filter: `drop-shadow(0 ${isMobile ? 16:30}px ${isMobile ? 24:44}px rgba(0,0,0,0.28))`,
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MILK SPLASH WAVE ── */}
        <div style={{ position:"relative", zIndex:5, marginTop:"auto" }} className="ms-splash">
          <svg
            viewBox="0 0 1440 190"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width:"100%", display:"block" }}
          >
            {/* Shadow layer */}
            <path
              d="M0,105 C80,72 180,130 320,95 C460,60 570,118 720,88 C870,58 990,108 1140,78 C1290,48 1380,92 1440,72 L1440,190 L0,190 Z"
              fill="rgba(183,205,127,0.35)"
            />
            {/* Cream mid layer */}
            <path
              d="M0,78 C100,42 220,110 370,68 C520,26 630,96 780,60 C930,24 1050,86 1190,54 C1330,22 1390,72 1440,52 L1440,190 L0,190 Z"
              fill="rgba(255,255,255,0.6)"
            />
            {/* Main white wave */}
            <path
              d="M0,58 C110,18 240,90 390,50 C540,10 640,78 790,42 C940,6 1060,68 1200,38 C1340,8 1400,56 1440,36 L1440,190 L0,190 Z"
              fill="white"
            />
            {/* Splash droplets */}
            <ellipse cx="390"  cy="50"  rx="22" ry="14" fill="white" opacity=".95"/>
            <ellipse cx="790"  cy="42"  rx="17" ry="11" fill="white" opacity=".9"/>
            <ellipse cx="1200" cy="40"  rx="19" ry="12" fill="white" opacity=".95"/>
            <ellipse cx="160"  cy="76"  rx="11" ry="7"  fill="white" opacity=".7"/>
            <ellipse cx="580"  cy="70"  rx="9"  ry="6"  fill="white" opacity=".7"/>
            <ellipse cx="980"  cy="65"  rx="10" ry="6"  fill="white" opacity=".7"/>
            <ellipse cx="1340" cy="58"  rx="12" ry="7"  fill="white" opacity=".7"/>
            {/* Mini splashes */}
            <ellipse cx="290"  cy="65"  rx="6"  ry="4"  fill="white" opacity=".55"/>
            <ellipse cx="690"  cy="56"  rx="5"  ry="3"  fill="white" opacity=".55"/>
            <ellipse cx="1090" cy="52"  rx="6"  ry="4"  fill="white" opacity=".55"/>
          </svg>
        </div>

        {/* ── MARQUEE ── */}
        <div style={{
          background: "white", zIndex: 6, overflow: "hidden",
          padding: "10px 0", borderTop: "1px solid #dde8cc",
        }}>
          <div style={{
            display: "flex", width: "max-content",
            animation: "marq 24s linear infinite",
          }}>
            {[...Array(2)].map((_, r) =>
              [
                { t:"🧋 Black Sugar Boba",    c:"#62840b" },
                { t:"🥛 Milku Strawberry",    c:"#97b64c" },
                { t:"🍰 Cheesecake Series",   c:"#62840b" },
                { t:"🍓 Fruit Tea",            c:"#97b64c" },
                { t:"🍞 Fresh Bread",          c:"#62840b" },
                { t:"⭐ Taiwan Recipe",        c:"#97b64c" },
                { t:"🌿 Real Ingredients",     c:"#62840b" },
              ].map((item, j) => (
                <span key={`${r}-${j}`} style={{
                  padding: "0 28px",
                  fontSize: 11, fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: item.c,
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.t.toUpperCase()}
                </span>
              ))
            )}
          </div>
        </div>

      </section>
    </>
  );
}