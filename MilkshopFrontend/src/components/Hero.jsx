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
  { id: "ingredients", line1: "Premium", line2: "Ingredients" },
  { id: "taste", line1: "Authentic", line2: "Taiwanese Taste" },
  { id: "healthy", line1: "Milky", line2: "& Healthy" },
  { id: "chewy", line1: "Irresistibly", line2: "Chewy" },
];

const HERO_HIGHLIGHTS = [
  { id: "brewed", icon: "leaf", title: "Freshly Brewed", subtitle: "Every Day" },
  { id: "love", icon: "cup", title: "Made with Love", subtitle: "in Taiwan" },
  { id: "best", icon: "trophy", title: "Best Taiwan Milktea", subtitle: "in Town!" },
  { id: "near", icon: "pin", title: "Now Brewing", subtitle: "Near You" },
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
    background:
      radial-gradient(ellipse 120% 90% at 50% 28%, #c5dc6a 0%, #89b031 48%, #4e6e1a 100%);
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
      radial-gradient(ellipse 55% 45% at 52% 22%, rgba(220, 236, 130, 0.42) 0%, transparent 68%),
      radial-gradient(ellipse 50% 40% at 78% 18%, rgba(197, 220, 106, 0.22) 0%, transparent 72%),
      radial-gradient(ellipse 45% 38% at 18% 78%, rgba(78, 110, 26, 0.28) 0%, transparent 70%);
  }

  /* ─── Inner layout ────────────────────────────────── */
  .hero-inner {
    position: relative;
    z-index: 10;
    flex: 1;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    /* Mobile: sit just below fixed nav (64px) + small gap */
    padding: calc(64px + env(safe-area-inset-top, 0px) + 6px) 20px 0;
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
    gap: 8px;
    padding-bottom: 12px;
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
    height: auto;
    width: clamp(260px, 88vw, 720px);
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
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px 6px;
    width: 100%;
    max-width: 100%;
    margin-top: 18px;
    animation: fadeUp 0.5s ease forwards 0.95s;
    opacity: 0;
  }
  .hero-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    min-width: 0;
  }
  .hero-feature-icon {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(255,255,255,0.14);
    backdrop-filter: blur(4px);
    flex-shrink: 0;
  }
  .hero-feature-label {
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 100%;
  }
  .hero-feature-line1,
  .hero-feature-line2 {
    display: block;
    font-size: 7px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1.25;
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

  /* ═══════════════════════════════════════════════════
     HERO CUPS — MOBILE FIRST (phones, below 768px)
     Edit ONLY this block for mobile layout.
  ═══════════════════════════════════════════════════ */
  .hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: 240px;
    margin-top: 4px;
  }

  /* MOVE ALL 3 CUPS (mobile) — translateX: + right, - left | gap: space between cups */
  .hero-cups {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0;
    position: relative;
    width: 100%;
    min-height: clamp(220px, 52vw, 320px);
    z-index: 2;
    transform: rotate(1deg) translateX(40px);
    transform-origin: 50% 100%;
  }

  .hero-cup-wrap {
    flex-shrink: 0;
    position: relative;
    transition: opacity 0.6s ease;
  }

  /* MOVE STRAWBERRY CUP (mobile) — translateX: + right closes gap to center */
  .hero-cup-wrap:nth-child(1) {
    z-index: 3;
    margin: 0;
    transform: rotate(-8deg) translateX(-1vw) translateY(1px);
  }

  /* MOVE CHEESECAKE CUP (mobile) — translateX: + right | translateY: + down */
  .hero-cup-wrap:nth-child(2) {
    z-index: 10;
    margin-left: -16vw;
    transform: rotate(-3deg) translateX(-30px) translateY(0px);
  }

  /* MOVE BOBA CUP (mobile) — translateX: + right | translateY: + down */
  .hero-cup-wrap:nth-child(3) {
    z-index: 2;
    margin-left: -18vw;
    transform: rotate(3deg) translateX(-11vw) translateY(1px);
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

  /* CUP SIZE (mobile) — center + cheesecake + boba default */
  .hero-cup-wrap img {
    height: clamp(160px, 44vw, 220px);
    width: auto;
    object-fit: contain;
    filter: drop-shadow(0 16px 28px rgba(0,0,0,0.26));
    display: block;
  }

  /* CUP SIZE (mobile) — strawberry + boba side cups (smaller) */
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

  /* ─── Bottom highlight bar ────────────────────────── */
  .hero-highlights {
    position: relative;
    z-index: 6;
    flex-shrink: 0;
    background: #f3efe6;
    border-top: 1px solid rgba(98, 132, 11, 0.1);
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
    animation: fadeUp 0.55s ease forwards 1.2s;
    opacity: 0;
  }

  .hero-highlights-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 12px;
    align-items: center;
  }

  .hero-highlight {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .hero-highlight-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(151, 182, 76, 0.14);
    border: 1px solid rgba(98, 132, 11, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #62840b;
  }

  .hero-highlight-text {
    min-width: 0;
    line-height: 1.2;
  }

  .hero-highlight-title {
    display: block;
    font-size: 0.72rem;
    font-weight: 800;
    color: #62840b;
    letter-spacing: -0.01em;
  }

  .hero-highlight-sub {
    display: block;
    margin-top: 2px;
    font-size: 0.68rem;
    font-weight: 600;
    color: #5a6a48;
  }

  .hero-highlights-cta {
    position: relative;
    grid-column: 1 / -1;
    justify-self: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #62840b;
    box-shadow: 0 6px 18px rgba(98, 132, 11, 0.28);
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .hero-highlights-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(98, 132, 11, 0.34);
  }

  .hero-highlights-cta img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  .hero-highlights-cta svg {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    padding: 2px;
    color: #62840b;
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
      gap: 3px;
    }

    .hero-eyebrow { justify-content: flex-start; }
    .hero-eyebrow-text { font-size: 10px; }

    .hero-fresh { font-size: clamp(6rem, 5vw, 5.5rem); margin-bottom: -6px; }

    .hero-taiwan { justify-content: flex-start; }
    .hero-taiwan img {height: clamp(120px, 14vw, 200px); }

    .hero-tagline { font-size: clamp(1.1rem, 1.8vw, 1.5rem); }

    .hero-features {
      gap: 16px;
      margin-top: 22px;
    }
    .hero-feature-line1,
    .hero-feature-line2 { font-size: 8px; letter-spacing: 0.1em; }
    .hero-feature-icon { width: 52px; height: 52px; }

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

    /* ═══ DESKTOP CUPS (768px+) — edit below for desktop only ═══ */

    /* GAP between cups (desktop) — gap only adds space; overlap = margin-left below */
    .hero-cups {
      gap: 0;
      transform: rotate(-7deg) translateX(200px);
    }

    /* TIGHTER: pull cups together (negative = overlap) */
    .hero-cup-wrap:nth-child(2) {
      margin-left: -10vw;
    }
    .hero-cup-wrap:nth-child(3) {
      margin-left: -12vw;
    }

    /* MOVE STRAWBERRY CUP (desktop) — translateX: + right | translateY: + down */
    .hero-cup-wrap:nth-child(1) {
      margin: 0;
      transform: rotate(-10deg) translateX(8vw) translateY(100px);
    }

    /* MOVE CHEESECAKE CUP (desktop) — translateX: + right | translateY: + down */
    .hero-cup-wrap:nth-child(2) {
      margin: 0;
      transform: rotate(-8deg) translateX(0px) translateY(0px);
    }

    /* MOVE BOBA CUP (desktop) — translateX: + right | translateY: + down */
    .hero-cup-wrap:nth-child(3) {
      margin: 0;
      transform: rotate(2deg) translateX(0px) translateY(0px);
    }

    /* CUP SIZE (desktop) — center cheesecake cup */
    .hero-cup-wrap img {
      height: clamp(300px, 36vw, 500px);
    }

    /* CUP SIZE (desktop) — strawberry + boba side cups */
    .hero-cup-wrap:nth-child(1) img,
    .hero-cup-wrap:nth-child(3) img {
      height: clamp(400px, 50vw, 600px);
    }
  }

  /* ─── LARGE DESKTOP (1024px+) ────────────────────── */
  @media (min-width: 1024px) {
    .hero-copy { flex: 0 0 44%; }

    /* GAP between cups (large desktop) — gap: 0; tighten with margin-left on cup 2 & 3 */
    .hero-cups {
      gap: 0;
    }

    .hero-cup-wrap:nth-child(2) {
      margin-left: -14vw;
    }
    .hero-cup-wrap:nth-child(3) {
      margin-left: -16vw;
    }

    /* MOVE STRAWBERRY CUP (large desktop) — translateX: + right closes gap to center cup */
    .hero-cup-wrap:nth-child(1) {
      transform: rotate(1deg) translateX(2vw) translateY(120px);
    }

    /* MOVE CHEESECAKE CUP (large desktop) */
    .hero-cup-wrap:nth-child(2) {
      z-index: 12;
      transform: rotate(2deg) translateX(0px) translateY(90px);
    }

    /* MOVE BOBA CUP (large desktop) */
    .hero-cup-wrap:nth-child(3) {
      transform: rotate(6deg) translateX(0px) translateY(100px);
    }

    /* CUP SIZE (large desktop) */
    .hero-cup-wrap img { height: clamp(300px, 40vw, 560px); }
    .hero-cup-wrap:nth-child(1) img,
    .hero-cup-wrap:nth-child(3) img {
      height: clamp(30px, 32vw, 560px);
    }

    .hero-highlights {
      padding: 16px 40px calc(16px + env(safe-area-inset-bottom, 0px));
    }

    .hero-highlights-inner {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      gap: 20px;
    }

    .hero-highlight {
      flex: 1 1 0;
      justify-content: center;
    }

    .hero-highlight-icon {
      width: 40px;
      height: 40px;
    }

    .hero-highlight-title { font-size: 0.8rem; }
    .hero-highlight-sub { font-size: 0.74rem; }

    .hero-highlights-cta {
      grid-column: auto;
      justify-self: auto;
      flex-shrink: 0;
      position: relative;
      width: 48px;
      height: 48px;
      margin-left: 8px;
    }

    .hero-highlights-cta img { width: 24px; height: 24px; }
  }

  /* ─── Reduced motion ──────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .hero-eyebrow, .hero-fresh, .hero-tagline,
    .hero-features, .hero-btns, .hero-taiwan img,
    .hero-cup-wrap img, .hero-splash, .hero-highlights {
      animation: none !important;
      opacity: 1 !important;
    }
    .hero-taiwan img, .hero-splash {
      transform: none !important;
    }
    /* Cup wrappers keep rotate/translate — do NOT set transform: none on .hero-cup-wrap */
    .hero-cups { transform: rotate(-6deg) translateX(40px); }
  }
`;

function HighlightIcon({ type }) {
  const icons = {
    leaf: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C12 22 4 16 4 10a8 8 0 0116 0c0 6-8 12-8 12z" />
        <path d="M12 10v12" />
      </svg>
    ),
    cup: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8h12l-1 10H7L6 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
        <circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="13" cy="16" r="1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
    trophy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4h8v3a4 4 0 01-8 0V4z" />
        <path d="M6 4H4a2 2 0 002 4" />
        <path d="M18 4h2a2 2 0 01-2 4" />
        <path d="M10 14h4v3H10z" />
        <path d="M8 20h8" />
      </svg>
    ),
    pin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    ),
  };
  return icons[type] || icons.leaf;
}

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
        <path d="M14 4c-2 1-4 3-4 6 0 2 1 4 2 5 1-1 2-3 2-5 0-3-2-5-4-6z" />
        <path d="M10 8c-1 2-2 4-2 7 0 4 2 7 4 9 2-2 4-5 4-9 0-3-1-5-2-7z" />
        <path d="M8 18c1 2 3 3 4 3s3-1 4-3" />
      </svg>
    ),
    healthy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M12 10C12 10 8 8 6 4c3 0 5 2 6 6" />
        <path d="M12 10c0 0 4-2 6-6-3 0-5 2-6 6" />
      </svg>
    ),
    chewy: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8h10l-1 10H8L7 8z" />
        <path d="M9 8V6a3 3 0 016 0v2" />
        <circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14" r="1" fill="currentColor" stroke="none" />
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
              <img src="/taiwan-word.png" alt="Taiwan" />
            </div>

            <div className="hero-tagline">Milky · Healthy · Chewy</div>

            <div className="hero-features">
              {FEATURES.map((f) => (
                <div key={f.id} className="hero-feature">
                  <div className="hero-feature-icon">
                    <FeatureIcon type={f.id} />
                  </div>
                  <div className="hero-feature-label">
                    <span className="hero-feature-line1">{f.line1}</span>
                    <span className="hero-feature-line2">{f.line2}</span>
                  </div>
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

        {/* ── Bottom highlights ── */}
        <div className="hero-highlights">
          <div className="hero-highlights-inner">
            {HERO_HIGHLIGHTS.map((item) => (
              <div key={item.id} className="hero-highlight">
                <div className="hero-highlight-icon" aria-hidden>
                  <HighlightIcon type={item.icon} />
                </div>
                <div className="hero-highlight-text">
                  <span className="hero-highlight-title">{item.title}</span>
                  <span className="hero-highlight-sub">{item.subtitle}</span>
                </div>
              </div>
            ))}
            <Link to="/locations" className="hero-highlights-cta" aria-label="Find Milkshop locations">
              <img src="/milkshop-logo-removebg-preview.png" alt="" aria-hidden />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}