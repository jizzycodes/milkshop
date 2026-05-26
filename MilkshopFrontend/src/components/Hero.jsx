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
  { letter: "T", color: "#e63946", shadow: "#7a0a10" },
  { letter: "A", color: "#f4a261", shadow: "#7a4208" },
  { letter: "I", color: "#e9c46a", shadow: "#7a5e0a" },
  { letter: "W", color: "#4caf50", shadow: "#1b5e20" },
  { letter: "A", color: "#29b6f6", shadow: "#01579b" },
  { letter: "N", color: "#ce93d8", shadow: "#6a1b9a" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Caveat:wght@700;800&display=swap');

  :root {
    --g-mod: #97b64c;
    --g-dark: #62840b;
    --g-light: #b7cd7f;
  }

  /* ═══ KEYFRAMES ═══ */

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(36px); }
    to   { opacity:1; transform:translateY(0); }
  }

  @keyframes letterPop {
    0%   { opacity:0; transform:translateY(70px) scale(0.45) rotate(-12deg); }
    60%  { transform:translateY(-12px) scale(1.18) rotate(5deg); }
    80%  { transform:translateY(4px) scale(0.97) rotate(-1deg); }
    100% { opacity:1; transform:translateY(0) scale(1) rotate(0deg); }
  }

  @keyframes tagSlide {
    0%   { opacity:0; transform:translateX(-50px) rotate(-3deg) scale(0.9); }
    70%  { transform:translateX(8px) rotate(1deg) scale(1.02); }
    100% { opacity:1; transform:translateX(0) rotate(0deg) scale(1); }
  }

  /* cups — rotation baked in so float keeps it */
  @keyframes floatCup0 {
    0%,100% { transform:rotate(-6deg) translateY(0px); }
    50%      { transform:rotate(-6deg) translateY(-24px); }
  }
  @keyframes floatCup1 {
    0%,100% { transform:rotate(-4deg) translateY(0px); }
    50%      { transform:rotate(-4deg) translateY(-30px); }
  }
  @keyframes floatCup2 {
    0%,100% { transform:rotate(-2deg) translateY(0px); }
    50%      { transform:rotate(-2deg) translateY(-26px); }
  }
 @keyframes cupDrop0 {
  0%   { opacity:0; transform:rotate(-6deg) translateY(120px) scale(0.6); }
  100% { opacity:1; transform:rotate(-6deg) translateY(0) scale(1); }
}
  @keyframes cupDrop1 {
    0%   { opacity:0; transform:rotate(-4deg) translateY(150px) scale(0.8); }
    100% { opacity:1; transform:rotate(-4deg) translateY(0) scale(1); }
  }
  @keyframes cupDrop2 {
    0%   { opacity:0; transform:rotate(-2deg) translateY(180px) scale(0.8); }
    100% { opacity:1; transform:rotate(-2deg) translateY(0) scale(1); }
  }

  @keyframes floatLeaf {
    0%,100% { transform:translateY(0) rotate(0deg); }
    50%      { transform:translateY(-18px) rotate(24deg); }
  }
  @keyframes floatBalloon {
    0%,100% { transform:translateY(0) rotate(-4deg); }
    50%      { transform:translateY(-15px) rotate(5deg); }
  }
  @keyframes driftCloud {
    0%,100% { transform:translateX(0); }
    50%      { transform:translateX(14px); }
  }
  @keyframes flyBird {
    0%,100% { transform:translateY(0) scaleX(1); }
    50%      { transform:translateY(-6px) scaleX(1.05); }
  }
  @keyframes splashWave {
    0%,100% { transform:scaleY(1) scaleX(1); }
    50%      { transform:scaleY(1.055) scaleX(1.004); }
  }
  @keyframes bubbleRise {
    0%,100% { transform:translateY(0) scale(1); opacity:.42; }
    50%      { transform:translateY(-14px) scale(1.12); opacity:.82; }
  }
  @keyframes twinkle {
    0%,100% { opacity:.2; transform:scale(0.65); }
    50%      { opacity:1; transform:scale(1.35); }
  }
  @keyframes marq {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  @keyframes letterGlow {
    0%,100% { filter: brightness(1); }
    50%      { filter: brightness(1.18) saturate(1.2); }
  }
  @keyframes waveGlow {
    0%,100% { opacity:.35; }
    50%      { opacity:.55; }
  }

  /* ═══ APPLIED CLASSES ═══ */

  .ms-cup0-enter { animation: cupDrop0 .8s cubic-bezier(.34,1.5,.64,1) forwards; }
  .ms-cup1-enter { animation: cupDrop1 .8s cubic-bezier(.34,1.5,.64,1) .18s forwards; }
  .ms-cup2-enter { animation: cupDrop2 .8s cubic-bezier(.34,1.5,.64,1) .36s forwards; }

  .ms-cup0-float { animation: floatCup0 6.4s ease-in-out infinite; }
  .ms-cup1-float { animation: floatCup1 8s ease-in-out infinite; }
  .ms-cup2-float { animation: floatCup2 6s ease-in-out infinite; }

  .ms-leaf    { animation: floatLeaf 5.5s ease-in-out infinite; }
  .ms-balloon { animation: floatBalloon 6.8s ease-in-out infinite; }
  .ms-cloud   { animation: driftCloud 8s ease-in-out infinite; }
  .ms-bird    { animation: flyBird 1.9s ease-in-out infinite; }
  .ms-splash  { animation: splashWave 5s ease-in-out infinite; transform-origin:bottom; }
  .ms-bubble  { animation: bubbleRise var(--d,4s) ease-in-out infinite; }
  .ms-twinkle { animation: twinkle var(--d,2s) ease-in-out infinite; }
  .ms-tw-glow { animation: letterGlow 3s ease-in-out infinite; }

  .ms-eyebrow { opacity:0; animation: fadeUp .5s ease forwards .08s; }
  .ms-fresh   { opacity:0; animation: fadeUp .6s cubic-bezier(.34,1.5,.64,1) forwards .22s; }
  .ms-of      { opacity:0; animation: fadeUp .5s ease forwards .4s; }
  .ms-tag     { opacity:0; animation: tagSlide .7s cubic-bezier(.34,1.5,.64,1) forwards 1.75s; }
  .ms-btns    { opacity:0; animation: fadeUp .5s ease forwards 1.95s; }
  .ms-trust   { opacity:0; animation: fadeUp .5s ease forwards 2.15s; }

 .ms-cta-main {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  min-width: 168px;
  padding:14px 32px; border-radius:999px;
  background: linear-gradient(135deg, #E8A020 0%, #d49218 100%);
  color:#fff; font-weight:800; font-size:14px;
  text-decoration:none; letter-spacing:.04em;
  box-shadow: 0 8px 24px rgba(232,160,32,0.42);
  transition:transform .2s, box-shadow .2s;
  font-family:'DM Sans',sans-serif;
}
.ms-cta-main:hover {
  transform:translateY(-2px);
  box-shadow: 0 12px 32px rgba(232,160,32,0.52);
}

.ms-cta-out {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  min-width: 148px;
  padding:14px 30px; border-radius:999px;
  border: 2px solid rgba(255,255,255,0.9);
  color:#62840b; font-weight:800; font-size:14px;
  text-decoration:none;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  transition:transform .2s, background .2s, box-shadow .2s;
  font-family:'DM Sans',sans-serif;
}
.ms-cta-out:hover {
  background:#fff;
  transform:translateY(-2px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.16);
}

  .ms-trust-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.22);
  }
  .ms-trust-pill.ms-backdrop-blur {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
`;

/* ── SVG DECO ── */
function Leaf({ size = 36, style = {}, className = "" }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none" style={style} className={className}>
      <path d="M20 3C9 12 3 30 9 45C15 56 25 56 31 45C37 30 31 12 20 3Z"
        fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.42)" strokeWidth="1.2"/>
      <path d="M20 3L20 52" stroke="rgba(255,255,255,.32)" strokeWidth="1.3"/>
      <path d="M20 22 Q28 33 30 42" stroke="rgba(255,255,255,.24)" strokeWidth="1" fill="none"/>
      <path d="M20 22 Q12 33 10 42" stroke="rgba(255,255,255,.24)" strokeWidth="1" fill="none"/>
    </svg>
  );
}

function HotAirBalloon({ size = 50, style = {} }) {
  return (
    <svg width={size} height={size * 1.55} viewBox="0 0 50 78" fill="none" style={style} className="ms-balloon">
      <ellipse cx="25" cy="28" rx="21" ry="24"
        stroke="rgba(255,255,255,.52)" strokeWidth="1.7" fill="rgba(255,255,255,.07)"/>
      <path d="M9 10 Q25 1 41 10" stroke="rgba(255,255,255,.42)" strokeWidth="1.3" fill="none"/>
      <path d="M4 22 Q25 13 46 22" stroke="rgba(255,255,255,.32)" strokeWidth="1.1" fill="none"/>
      <path d="M4 36 Q25 27 46 36" stroke="rgba(255,255,255,.26)" strokeWidth="1" fill="none"/>
      <path d="M17 50 Q25 58 33 50" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" fill="none"/>
      <rect x="19" y="54" width="12" height="10" rx="2.5"
        stroke="rgba(255,255,255,.5)" strokeWidth="1.3" fill="rgba(255,255,255,.08)"/>
      <line x1="19" y1="54" x2="17" y2="50" stroke="rgba(255,255,255,.36)" strokeWidth="1.1"/>
      <line x1="31" y1="54" x2="33" y2="50" stroke="rgba(255,255,255,.36)" strokeWidth="1.1"/>
    </svg>
  );
}

function Cloud({ w = 85, style = {} }) {
  return (
    <svg width={w} height={w * 0.48} viewBox="0 0 85 41" fill="none" style={style} className="ms-cloud">
      <ellipse cx="30" cy="27" rx="20" ry="14"
        stroke="rgba(255,255,255,.5)" strokeWidth="1.6" fill="rgba(255,255,255,.08)"/>
      <ellipse cx="52" cy="29" rx="18" ry="13"
        stroke="rgba(255,255,255,.5)" strokeWidth="1.6" fill="rgba(255,255,255,.08)"/>
      <ellipse cx="41" cy="21" rx="17" ry="13"
        stroke="rgba(255,255,255,.5)" strokeWidth="1.6" fill="rgba(255,255,255,.08)"/>
    </svg>
  );
}

function Bird({ size = 30, style = {} }) {
  return (
    <svg width={size} height={size * 0.48} viewBox="0 0 30 14" fill="none" style={style} className="ms-bird">
      <path d="M2 7 Q8 1 15 7 Q22 1 28 7"
        stroke="rgba(255,255,255,.68)" strokeWidth="1.9" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function TaipeiTower({ style = {} }) {
  return (
    <svg width="58" height="120" viewBox="0 0 58 120" fill="none" style={{ opacity:.24, ...style }}>
      <rect x="25" y="102" width="8" height="18" fill="rgba(255,255,255,.95)"/>
      <rect x="19" y="80"  width="20" height="24" rx="2" fill="rgba(255,255,255,.95)"/>
      <rect x="14" y="59"  width="30" height="23" rx="2" fill="rgba(255,255,255,.95)"/>
      <rect x="19" y="42"  width="20" height="19" rx="1" fill="rgba(255,255,255,.95)"/>
      <rect x="23" y="24"  width="12" height="20" rx="1" fill="rgba(255,255,255,.95)"/>
      <rect x="25" y="6"   width="8"  height="20" rx="1" fill="rgba(255,255,255,.95)"/>
      <line x1="6"  y1="80" x2="52" y2="80" stroke="rgba(255,255,255,.95)" strokeWidth="2"/>
      <line x1="10" y1="59" x2="48" y2="59" stroke="rgba(255,255,255,.95)" strokeWidth="1.5"/>
    </svg>
  );
}

function Temple({ style = {} }) {
  return (
    <svg width="76" height="92" viewBox="0 0 76 92" fill="none" style={{ opacity:.22, ...style }}>
      <rect x="8"  y="62" width="60" height="26" rx="2" fill="rgba(255,255,255,.95)"/>
      <rect x="22" y="43" width="32" height="21" rx="1" fill="rgba(255,255,255,.95)"/>
      <path d="M2 62 Q38 42 74 62Z" fill="rgba(255,255,255,.95)"/>
      <path d="M16 43 Q38 24 60 43Z" fill="rgba(255,255,255,.95)"/>
      <rect x="30" y="62" width="16" height="26" rx="1" fill="rgba(255,255,255,.5)"/>
      <line x1="38" y1="10" x2="38" y2="24" stroke="rgba(255,255,255,.95)" strokeWidth="2"/>
    </svg>
  );
}

function Plant({ style = {} }) {
  return (
    <svg width="50" height="68" viewBox="0 0 50 68" fill="none" style={{ opacity:.22, ...style }}>
      <line x1="25" y1="68" x2="25" y2="18" stroke="rgba(255,255,255,.95)" strokeWidth="1.8"/>
      <path d="M25 44 Q11 34 9 19 Q22 17 25 33Z" fill="rgba(255,255,255,.95)"/>
      <path d="M25 34 Q39 24 41 9 Q28 7 25 23Z" fill="rgba(255,255,255,.95)"/>
      <path d="M25 55 Q13 49 11 36 Q23 34 25 48Z" fill="rgba(255,255,255,.95)"/>
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
    const t = setTimeout(() => setCupsReady(true), 650);
    return () => clearTimeout(t);
  }, []);

  
  return (
    <>
      <style>{CSS}</style>
      <section style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(148deg, #c4db8e 0%, #97b64c 32%, #7ca03e 62%, #62840b 100%)",
        minHeight: isMobile ? "100svh" : "93vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Radial light core */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"radial-gradient(ellipse at 56% 26%, rgba(200,228,148,0.58) 0%, transparent 60%)",
        }}/>

        {/* Dot texture */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.07, pointerEvents:"none" }}>
          <defs>
            <pattern id="dotg" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="#1a1a1a"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotg)"/>
        </svg>

        {/* ── TWINKLE STARS ── */}
        {[
          { t:"8%",  l:"20%",  d:"1.8s", dl:"0s",    sz:7 },
          { t:"5%",  l:"50%",  d:"2.5s", dl:"-1s",   sz:5 },
          { t:"17%", l:"66%",  d:"1.6s", dl:"-0.5s", sz:4 },
          { t:"30%", l:"11%",  d:"2.9s", dl:"-2s",   sz:6 },
          { t:"4%",  r:"9%",   d:"2.1s", dl:"-1.5s", sz:6 },
          { t:"22%", r:"20%",  d:"3.3s", dl:"-0.8s", sz:4 },
          { t:"38%", l:"42%",  d:"2s",   dl:"-3s",   sz:4 },
        ].map((s, i) => (
          <div key={i} className="ms-twinkle" style={{
            position:"absolute", top:s.t, left:s.l, right:s.r,
            width:s.sz, height:s.sz, borderRadius:"50%",
            background:"rgba(255,255,255,.98)",
            boxShadow:"0 0 8px 2px rgba(255,255,255,.8)",
            "--d":s.d, animationDelay:s.dl,
          }}/>
        ))}

        {/* ── BUBBLES ── */}
        {[
          { t:"7%",  l:"15%", w:28, d:"4s",   dl:"0s"    },
          { t:"19%", l:"31%", w:16, d:"5.8s", dl:"-1s"   },
          { t:"3%",  l:"58%", w:22, d:"4.8s", dl:"-2s"   },
          { t:"28%", r:"14%", w:15, d:"6.3s", dl:"-0.5s" },
          { t:"46%", l:"3%",  w:12, d:"5.3s", dl:"-3s"   },
          { t:"12%", r:"26%", w:19, d:"3.9s", dl:"-1.5s" },
          { t:"38%", l:"26%", w:11, d:"4.6s", dl:"-2.5s" },
          { t:"55%", l:"18%", w:9,  d:"5s",   dl:"-4s"   },
        ].map((b, i) => (
          <div key={i} className="ms-bubble" style={{
            position:"absolute", top:b.t, left:b.l, right:b.r,
            width:b.w, height:b.w, borderRadius:"50%",
            background:"radial-gradient(circle at 33% 27%, rgba(255,255,255,.75), rgba(255,255,255,.06))",
            border:"1px solid rgba(255,255,255,.52)",
            "--d":b.d, animationDelay:b.dl,
          }}/>
        ))}

        {/* ── LEAVES ── */}
        <Leaf size={52} className="ms-leaf" style={{ position:"absolute", top:"3%",  left:"0.2%", animationDelay:"0s" }}/>
        <Leaf size={32} className="ms-leaf" style={{ position:"absolute", top:"14%", left:"5%",   animationDelay:"-2s" }}/>
        <Leaf size={40} className="ms-leaf" style={{ position:"absolute", top:"2%",  right:"2%",  animationDelay:"-1s",  transform:"scaleX(-1)" }}/>
        <Leaf size={24} className="ms-leaf" style={{ position:"absolute", top:"19%", right:"7%",  animationDelay:"-3s",  transform:"scaleX(-1) rotate(25deg)" }}/>
        {!isMobile && <Leaf size={19} className="ms-leaf" style={{ position:"absolute", top:"43%", left:"0.6%", animationDelay:"-4s" }}/>}
        {!isMobile && <Leaf size={15} className="ms-leaf" style={{ position:"absolute", top:"9%",  right:"32%", animationDelay:"-2.5s", transform:"scaleX(-1) rotate(12deg)" }}/>}

        {/* ── HOT AIR BALLOONS ── */}
        <HotAirBalloon size={50} style={{ position:"absolute", top:"6%",  right:"20%", animationDelay:"0s" }}/>
        {!isMobile && <HotAirBalloon size={32} style={{ position:"absolute", top:"13%", right:"43%", animationDelay:"-2.2s" }}/>}
        {!isMobile && <HotAirBalloon size={24} style={{ position:"absolute", top:"24%", left:"19%",  animationDelay:"-1s" }}/>}

        {/* ── CLOUDS ── */}
        <Cloud w={78} style={{ position:"absolute", top:"10%", right:"26%", animationDelay:"-1s" }}/>
        <Cloud w={60} style={{ position:"absolute", top:"3%",  right:"6%",  animationDelay:"-0.5s" }}/>
        {!isMobile && <Cloud w={54} style={{ position:"absolute", top:"22%", right:"46%", animationDelay:"-3.5s" }}/>}
        {!isMobile && <Cloud w={44} style={{ position:"absolute", top:"32%", left:"22%",  animationDelay:"-2s" }}/>}

        {/* ── BIRDS ── */}
        <Bird size={30} style={{ position:"absolute", top:"14%", left:"36%", animationDelay:"0s" }}/>
        <Bird size={21} style={{ position:"absolute", top:"19%", left:"40%", animationDelay:"-0.45s" }}/>
        {!isMobile && <Bird size={26} style={{ position:"absolute", top:"8%",  right:"35%", animationDelay:"-0.9s" }}/>}
        {!isMobile && <Bird size={17} style={{ position:"absolute", top:"12%", right:"39%", animationDelay:"-1.3s" }}/>}

        {/* ── LANDMARKS ── */}
        <TaipeiTower style={{ position:"absolute", bottom:"24%", left:"0.4%" }}/>
        {!isMobile && <Temple style={{ position:"absolute", bottom:"22%", left:"7%" }}/>}
        {!isMobile && <Plant  style={{ position:"absolute", bottom:"21%", left:"16.5%" }}/>}

        {/* ══ MAIN CONTENT ══ */}
        <div style={{
          position:"relative", zIndex:10,
          flex:1,
          maxWidth:1280, margin:"0 auto", width:"100%",
          padding: isMobile ? "66px 22px 0" : "66px 20px 0 0",
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr" : "0.55fr 1.55fr",
          gap: isMobile ? 0 : 0,
          alignItems:"flex-end",
        }}>

          {/* ── LEFT TEXT — alignment only affects this column; grid tracks unchanged so cups stay put ── */}
          <div style={{
            display:"flex", flexDirection:"column",
            gap: isMobile ? 10 : 6,
            textAlign: isMobile ? "center" : "left",
            alignItems: isMobile ? "center" : "flex-start",
            paddingBottom: isMobile ? 18 : 115,
            paddingLeft: isMobile ? 0 : 0,
            /* Nudge copy left inside the fixed left track without resizing the cup column */
            marginLeft: isMobile ? 0 : "clamp(-6px, -1vw, -20px)",
            zIndex: 2,
            position: "relative",
          }}>
            {/* Eyebrow */}
            <div className="ms-eyebrow" style={{
              display:"flex", alignItems:"center", gap:9,
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              <span style={{ width:22, height:2, background:"rgba(255,255,255,.88)", borderRadius:2 }}/>
              <span style={{
                fontSize:10, fontWeight:800, letterSpacing:"0.28em",
                color:"rgba(255,255,255,.94)", textTransform:"uppercase",
                fontFamily:"'DM Sans',sans-serif",
              }}>
                Authentic Taiwanese Milk Tea
              </span>
              <span style={{ width:22, height:2, background:"rgba(255,255,255,.88)", borderRadius:2 }}/>
            </div>

            {/* FRESH TASTE */}
            <div className="ms-fresh" style={{
              fontFamily:"'Caveat',cursive",
              fontSize: isMobile
                ? "clamp(2.1rem,10vw,3.1rem)"
                : "clamp(2.8rem,4.6vw,4.4rem)",
              fontWeight:800,
              color:"white",
              lineHeight:1,
              textShadow:"0 2px 6px rgba(0,0,0,0.35), 0 8px 28px rgba(0,0,0,0.22)",
              marginBottom: 1,
            }}>
              Fresh Taste of
            </div>

      

            {/* TAIWAN — 3D multicolor */}
            <div style={{
              display:"flex",
              gap: isMobile ? 1 : 1,
              alignItems:"center",
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              {TAIWAN_LETTERS.map((item, i) => (
                <span
                  key={i}
                  className="ms-tw-glow"
                  style={{
                    fontFamily:"'Fredoka One',cursive",
                    fontSize: isMobile
                      ? "clamp(3.2rem,14vw,5.2rem)"
                      : "clamp(4rem,7vw,6.5rem)",
                    fontWeight:400,
                    color: item.color,
                    lineHeight:1,
                    display:"inline-block",
                    /* true 3-D stacked shadow */
                    textShadow: "-2px -2px 0 #1a1a1a, 2px -2px 0 #1a1a1a, -2px 2px 0 #1a1a1a, 2px 2px 0 #1a1a1a",
                    WebkitTextStroke: "3px #1a1a1a",
                    opacity:0,
                    animationName:"letterPop",
                    animationDuration:"5s",
                    animationTimingFunction:"cubic-bezier(.34,1.5,.64,1)",
                    animationFillMode:"forwards",
                    animationDelay:`${0.52 + i * 0.1}s`,
                  }}
                >
                  {item.letter}
                </span>
              ))}
            </div>

            {/* Tagline */}
            <div className="ms-tag" style={{ marginTop: isMobile ? 12 : 16 }}>
              <span style={{
                display: "inline-flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
                gap: "0.35em 0.5em",
                color: "#fff",
                fontWeight: 800,
                fontSize: isMobile ? "clamp(1.05rem, 4.8vw, 1.35rem)" : "clamp(1.2rem, 2.2vw, 1.55rem)",
                letterSpacing: "0.1em",
                fontFamily: "'Fredoka One', cursive",
                textShadow: "0 2px 12px rgba(0,0,0,0.32), 0 0 24px rgba(255,255,255,0.15)",
                lineHeight: 1.25,
              }}>
                {["Milky", "Healthy", "Chewy"].map((word, wi) => (
                  <span key={word} style={{ display: "inline-flex", alignItems: "center", gap: "0.35em" }}>
                    {wi > 0 && <span aria-hidden style={{ opacity: 0.55, fontWeight: 400 }}>·</span>}
                    {word}
                  </span>
                ))}
              </span>
            </div>

            {/* CTAs */}
            <div className="ms-btns" style={{
              display:"flex", flexWrap:"wrap", gap:14,
              justifyContent: isMobile ? "center" : "flex-start",
              marginTop: isMobile ? 22 : 28,
            }}>
              <Link to="/franchise#inquiry" className="ms-cta-main">Franchise Now ✦</Link>
              <Link to="/products" className="ms-cta-out">View Menu</Link>
            </div>

      
          </div>

    {/* ── RIGHT — 3 CUPS ── */}
<div style={{
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-end",
  gap: isMobile ? 0 : 0,
  height: isMobile ? 308 : 650,
  overflow: "visible",
}}>
  {topDrinks.map((drink, i) => {
    const heights = isMobile ? [180, 220, 260] : [540, 580, 620];
    const offsets = isMobile ? [0, 20, 40]     : [-160, -130, -100];
    const enters  = ["ms-cup0-enter","ms-cup1-enter","ms-cup2-enter"];
    const floats  = ["ms-cup0-float","ms-cup1-float","ms-cup2-float"];
    

    return (
      <div
        key={drink.id}
        className={cupsReady ? enters[i] : ""}
        style={{
          opacity: 0,
          marginBottom: offsets[i],
          marginLeft: i === 0 ? 350 : -300,
          flexShrink: 0,
        }}
      >
        <div
          className={cupsReady ? floats[i] : ""}
          style={{ transformOrigin: "bottom center" }}
        >
          <img
            src={drink.imageUrl}
            alt={drink.name}
            draggable={false}
            style={{
              height: heights[i],
              objectFit: "contain",
              filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.3))",
              marginLeft: i === 0 ? 0 : -10,
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
        <div style={{ position: "relative", zIndex: 5, marginTop: "auto" }} className="ms-splash">
  <svg
    viewBox="0 0 1440 180"
    preserveAspectRatio="none"
    style={{ width: "100%", display: "block" }}
  >
    {/* soft shadow */}
    <path
      d="M0,100 C200,60 400,140 720,90 C1040,40 1240,120 1440,80 L1440,180 L0,180 Z"
      fill="rgba(183,205,127,0.35)"
    />

    {/* main cream */}
    <path
      d="M0,80 C200,40 400,120 720,70 C1040,20 1240,100 1440,60 L1440,180 L0,180 Z"
      fill="white"
    />

    {/* subtle highlight */}
    <path
      d="M0,70 C200,30 400,110 720,60 C1040,10 1240,90 1440,50"
      stroke="rgba(255,255,255,0.6)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
</div>

       

      </section>
    </>
  );
}