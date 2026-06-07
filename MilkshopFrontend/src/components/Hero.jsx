import { Link } from "react-router-dom";
import FranchiseInquiryTrigger from "./FranchiseInquiryTrigger";

/** Decorative cups composite */
const HERO_CUPS_SRC = "/hero/hero-cups1.webp";

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
  @keyframes heroTaiwanPop {
    0%   { opacity: 0; transform: translateY(14px) scale(0.94); }
    60%  { opacity: 1; transform: translateY(0) scale(1.03); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroTaiwanFloat {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  @keyframes featurePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.18); }
    50%      { box-shadow: 0 0 0 5px rgba(255,255,255,0.06); }
  }
  @keyframes heroCupsEnter {
    0%   { opacity: 0; transform: translateY(40px) scale(0.9); }
    60%  { opacity: 1; transform: translateY(-8px) scale(1.03); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
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
    padding: calc(64px + env(safe-area-inset-top, 0px) + clamp(18px, 4vw, 28px)) 20px 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  /* ─── LEFT: Copy ──────────────────────────────────── */
  .hero-copy {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: clamp(4px, 1.2vw, 10px);
    padding-bottom: 12px;
  }

  .hero-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    width: 100%;
    gap: 8px;
    margin-top: clamp(4px, 1.5vw, 10px);
    margin-bottom: 0;
    position: relative;
    top: clamp(18px, 5vw, 36px);
    animation: fadeUp 0.5s ease forwards;
  }
  .hero-eyebrow-line {
    width: 20px;
    height: 2px;
    background: rgba(255,255,255,0.85);
    border-radius: 2px;
  }
  .hero-eyebrow-text {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.28em;
    color: rgba(255,255,255,0.95);
    text-transform: uppercase;
  }

  .hero-fresh {
    font-family: 'Caveat', cursive;
    font-size: clamp(1.85rem, 8vw, 2.65rem);
    font-weight: 800;
    color: #fff;
    line-height: 0.95;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    animation: fadeUp 0.5s ease forwards 0.1s;
    opacity: 0;
    margin-top: 0;
    margin-bottom: clamp(-20px, -5vw, -10px);
    max-width: 100%;
    width: 100%;
    text-align: center;
    align-self: center;
    position: relative;
    top: clamp(18px, 5vw, 36px);
  }

  .hero-taiwan {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-left: -2px;
    margin-top: 0;
  }
  .hero-taiwan img {
    height: auto;
    width: min(100%, clamp(248px, 92vw, 400px));
    max-width: 100%;
    display: block;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
    opacity: 0;
    animation: heroTaiwanPop 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.35s,
               heroTaiwanFloat 4s ease-in-out infinite 1.2s;
    will-change: transform, opacity;
  }

  .hero-tagline {
    font-family: 'Fredoka One', cursive;
    font-size: clamp(0.92rem, 4.2vw, 1.22rem);
    color: #fff;
    letter-spacing: clamp(0.02em, 0.4vw, 0.06em);
    line-height: 1.25;
    margin-top: clamp(2px, 1vw, 8px);
    animation: fadeUp 0.5s ease forwards 0.75s;
    opacity: 0;
    max-width: 100%;
    width: 100%;
    text-align: center;
    align-self: center;
  }

  /* Taiwan → tagline → features → CTAs (dragged down as one block) */
  .hero-copy-lower {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    top: clamp(28px, 8vw, 52px);
    margin-bottom: clamp(-28px, -8vw, -52px);
    z-index: 1;
  }

  /* Small phones */
  @media (max-width: 379px) {
    .hero-eyebrow-text {
      font-size: 8px;
      letter-spacing: 0.22em;
    }
    .hero-fresh {
      font-size: clamp(1.6rem, 7.2vw, 2rem);
    }
    .hero-taiwan img {
      width: min(100%, clamp(220px, 88vw, 300px));
    }
    .hero-tagline {
      font-size: clamp(0.84rem, 3.8vw, 1rem);
    }
  }

  /* Large phones */
  @media (min-width: 480px) and (max-width: 767px) {
    .hero-fresh {
      font-size: clamp(2rem, 6.8vw, 2.85rem);
    }
    .hero-taiwan img {
      width: min(100%, clamp(280px, 86vw, 440px));
    }
    .hero-tagline {
      font-size: clamp(1rem, 3.6vw, 1.32rem);
    }
  }

  /* ─── MOBILE spacing + buttons (<768px) ─────────── */
  @media (max-width: 767px) {
    .hero-inner {
      padding-top: calc(64px + env(safe-area-inset-top, 0px) + clamp(28px, 6vw, 42px));
    }

    .hero-copy {
      gap: clamp(2px, 0.6vw, 6px);
    }

    .hero-eyebrow {
      margin-top: clamp(6px, 2vw, 14px);
      margin-bottom: 0;
      top: clamp(20px, 5.5vw, 40px);
    }

    .hero-fresh {
      margin-top: 0;
      margin-bottom: clamp(-24px, -6vw, -14px);
      top: clamp(20px, 5.5vw, 40px);
      position: relative;
      z-index: 2;
    }

    .hero-copy-lower {
      align-items: center;
      top: clamp(40px, 11vw, 80px);
      margin-bottom: clamp(-40px, -11vw, -80px);
    }

    .hero-taiwan {
      justify-content: center;
      margin-left: 0;
      margin-top: clamp(-12px, -3vw, -6px);
    }

    .hero-tagline {
      margin-top: clamp(10px, 2.5vw, 16px);
    }

    .hero-features {
      margin-top: clamp(22px, 5.5vw, 32px);
      gap: 10px 8px;
    }

    .hero-btns {
      flex-direction: column;
      align-items: center;
      align-self: center;
      width: 100%;
      max-width: 100%;
      margin-top: clamp(24px, 5.5vw, 32px);
      margin-bottom: clamp(14px, 3.5vw, 22px);
      margin-left: auto;
      margin-right: auto;
      gap: 12px;
    }

    .hero-visual {
      margin-top: clamp(12px, 3vw, 20px);
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      width: auto;
      align-self: center;
      max-width: min(100%, 260px);
      min-width: 0;
      font-family: 'Signia Pro', 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.02em;
      text-transform: none;
      padding: 10px 20px;
      border-radius: 999px;
      min-height: 48px;
      box-shadow: none;
      border: none;
    }

    .hero-btn-primary {
      background: #e8a020;
      color: #fff;
      padding-left: 12px;
      gap: 10px;
    }

    .hero-btn-primary:hover {
      background: #d49218;
    }

    .hero-btn-secondary {
      background: #ffffff;
      color: #62840b;
    }

    .hero-btn-secondary:hover {
      background: #f5f8ef;
      color: #62840b;
    }
  }

  /* ─── Feature Pills ───────────────────────────────── */
  .hero-features {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px 6px;
    width: 100%;
    max-width: 100%;
    margin-top: 18px;
    animation: fadeUp 0.5s ease forwards 0.95s;
    opacity: 0;
    justify-items: stretch;
    align-self: stretch;
  }
  .hero-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    min-width: 0;
    padding: 10px 4px 8px;
    border-radius: 14px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(6px);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    cursor: default;
  }
  .hero-feature:hover {
    background: rgba(255,255,255,0.16);
    border-color: rgba(255,255,255,0.35);
    transform: translateY(-2px);
  }
  .hero-feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(255,255,255,0.14);
    backdrop-filter: blur(4px);
    flex-shrink: 0;
    animation: featurePulse 3s ease-in-out infinite;
  }
  .hero-feature:nth-child(2) .hero-feature-icon { animation-delay: 0.75s; }
  .hero-feature:nth-child(3) .hero-feature-icon { animation-delay: 1.5s; }
  .hero-feature:nth-child(4) .hero-feature-icon { animation-delay: 2.25s; }

  .hero-feature-label {
    display: flex;
    flex-direction: column;
    gap: 1px;
    width: 100%;
  }
  .hero-feature-line1,
  .hero-feature-line2 {
    display: block;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.95);
    line-height: 1.25;
  }
  .hero-feature-line1 {
    color: #fff;
  }
  .hero-feature-line2 {
    color: rgba(255,255,255,0.78);
  }

  /* ─── Buttons ─────────────────────────────────────── */
  .hero-btns {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    width: 100%;
    max-width: 100%;
    margin-top: 20px;
    animation: fadeUp 0.5s ease forwards 1.1s;
    opacity: 0;
    align-self: stretch;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 10px 20px;
    border-radius: 999px;
    min-height: 48px;
    font-family: 'Signia Pro', 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.02em;
    text-transform: none;
    text-decoration: none;
    cursor: pointer;
    border: none;
    box-shadow: none;
    transition: background-color 0.2s ease;
    white-space: nowrap;
  }
  .hero-btn-primary {
    background: #e8a020;
    color: #fff;
    padding-left: 12px;
  }
  .hero-btn-primary:hover {
    background: #d49218;
  }

  .hero-btn-secondary {
    background: #ffffff;
    color: #62840b;
  }
  .hero-btn-secondary:hover {
    background: #f5f8ef;
    color: #62840b;
  }

  .hero-btn-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    overflow: hidden;
  }
  .hero-btn-icon img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }

  /* ─── Decorative cups (single composite image) ─── */
  .hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: clamp(320px, 78vw, 520px);
    margin-top: 6px;
    margin-bottom: -12px;
    pointer-events: none;
    overflow: visible;
  }

  .hero-cups-frame {
    position: relative;
    width: 100%;
    max-width: none;
    margin-left: auto;
    margin-right: auto;
    overflow: visible;
    transform: scale(0.9);
    transform-origin: center bottom;
  }

  .hero-cups-img {
    display: block;
    width: 142%;
    max-width: none;
    height: auto;
    margin-left: -21%;
    object-fit: contain;
    object-position: center bottom;
    mix-blend-mode: screen;
    filter: drop-shadow(0 16px 28px rgba(0,0,0,0.22));
    animation: heroCupsEnter 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.45s;
    opacity: 0;
    transform-origin: center bottom;
    will-change: transform, opacity;
  }

  /* ─── Bottom highlight bar ────────────────────────── */
  .hero-highlights {
    position: relative;
    z-index: 6;
    flex-shrink: 0;
    background: #f3efe6;
    border-top: 2px solid rgba(98, 132, 11, 0.08);
    padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
    animation: fadeUp 0.55s ease forwards 1.2s;
    opacity: 0;
  }

  .hero-highlights-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 10px;
    align-items: center;
  }

  .hero-highlight {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 8px 10px;
    border-radius: 12px;
    background: rgba(98,132,11,0.06);
    border: 1px solid rgba(98,132,11,0.1);
    transition: background 0.18s ease, border-color 0.18s ease;
  }
  .hero-highlight:hover {
    background: rgba(98,132,11,0.11);
    border-color: rgba(98,132,11,0.2);
  }

  .hero-highlight-icon {
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(151, 182, 76, 0.18);
    border: 1.5px solid rgba(98, 132, 11, 0.25);
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
    font-size: 0.74rem;
    font-weight: 800;
    color: #3d5507;
    letter-spacing: -0.01em;
  }

  .hero-highlight-sub {
    display: block;
    margin-top: 2px;
    font-size: 0.68rem;
    font-weight: 600;
    color: #6a7a52;
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
      padding: 80px clamp(24px, 4vw, 48px) 0;
      gap: 0;
      min-height: calc(100svh - 80px);
    }

    .hero-copy {
      flex: 0 0 42%;
      max-width: 520px;
      align-items: flex-start;
      text-align: left;
      padding-bottom: clamp(28px, 4vw, 48px);
      gap: 4px;
      align-self: flex-end;
    }

    .hero-eyebrow {
      justify-content: flex-start;
      align-self: flex-start;
      width: auto;
      margin-top: 0;
      top: 0;
    }
    .hero-eyebrow-text { font-size: 10px; letter-spacing: 0.24em; }

    .hero-fresh {
      font-size: clamp(2.4rem, 3.6vw, 3.75rem);
      margin-bottom: -6px;
      position: relative;
      z-index: 2;
      width: auto;
      text-align: left;
      align-self: flex-start;
      top: 0;
    }

    .hero-copy-lower {
      align-items: flex-start;
      top: 0;
      margin-bottom: 0;
    }

    .hero-taiwan {
      justify-content: flex-start;
      margin-top: 0;
    }
    .hero-taiwan img {
      width: min(100%, clamp(320px, 38vw, 560px));
      height: auto;
      max-width: 100%;
    }

    .hero-tagline {
      font-size: clamp(1rem, 1.35vw, 1.35rem);
      margin-top: 6px;
      width: auto;
      text-align: left;
      align-self: flex-start;
    }

    .hero-features {
      gap: clamp(10px, 1.2vw, 16px);
      margin-top: clamp(14px, 2vw, 22px);
      max-width: min(100%, 520px);
      width: 100%;
      align-self: flex-start;
    }
    .hero-feature {
      padding: clamp(8px, 1vw, 11px) clamp(4px, 0.5vw, 8px);
    }
    .hero-feature-line1,
    .hero-feature-line2 { font-size: clamp(7px, 0.55vw, 8px); letter-spacing: 0.1em; }
    .hero-feature-icon { width: clamp(44px, 4vw, 52px); height: clamp(44px, 4vw, 52px); }

    .hero-btns {
      flex-direction: row;
      align-items: center;
      align-self: flex-start;
      max-width: none;
      width: auto;
      margin-top: clamp(16px, 2vw, 24px);
      gap: 12px;
    }
    .hero-btn-primary,
    .hero-btn-secondary {
      width: auto;
      min-width: 148px;
      font-size: 14px;
      padding: 12px 22px;
    }

    .hero-visual {
      flex: 1;
      min-width: 0;
      max-width: 52%;
      min-height: clamp(320px, 42vw, 480px);
      margin-top: 0;
      align-items: flex-end;
      justify-content: flex-end;
      overflow: visible;
    }

    .hero-cups-frame {
      width: clamp(320px, 46vw, 640px);
      max-width: 100%;
      margin-left: auto;
      margin-right: 0;
    }

    .hero-cups-img {
      width: 100%;
      max-height: clamp(340px, 44vh, 480px);
      margin-left: 0;
      object-fit: contain;
      object-position: right bottom;
      transform-origin: right bottom;
    }

    .hero-highlights-inner {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      gap: 12px;
    }
    .hero-highlight {
      flex: 1 1 0;
      justify-content: flex-start;
    }
  }

  /* ─── TABLET / iPad (768px–1023px) — stacked like mobile ─── */
  @media (min-width: 768px) and (max-width: 1023px) {
    .hero-section {
      min-height: auto;
      overflow-x: hidden;
    }

    .hero-inner {
      flex-direction: column;
      align-items: stretch;
      min-height: auto;
      gap: 0;
      padding:
        calc(64px + env(safe-area-inset-top, 0px) + clamp(16px, 3vw, 28px))
        clamp(16px, 3vw, 28px)
        clamp(16px, 2vw, 24px);
    }

    .hero-copy {
      flex: none;
      width: 100%;
      max-width: 100%;
      align-items: center;
      text-align: center;
      align-self: center;
      padding-bottom: 8px;
    }

    .hero-eyebrow {
      top: clamp(8px, 2vw, 16px);
      justify-content: center;
      align-self: center;
      width: 100%;
    }

    .hero-fresh {
      font-size: clamp(2rem, 4.5vw, 2.75rem);
      margin-bottom: clamp(-18px, -4vw, -10px);
      top: clamp(8px, 2vw, 16px);
      text-align: center;
      align-self: center;
      width: 100%;
    }

    .hero-copy-lower {
      align-items: center;
      top: clamp(20px, 5vw, 40px);
      margin-bottom: clamp(-20px, -5vw, -40px);
      width: 100%;
    }

    .hero-taiwan {
      justify-content: center;
      width: 100%;
      margin-left: 0;
    }

    .hero-taiwan img {
      width: min(100%, clamp(300px, 62vw, 480px));
      margin-left: auto;
      margin-right: auto;
    }

    .hero-tagline {
      font-size: clamp(0.95rem, 2.2vw, 1.2rem);
      margin-top: clamp(8px, 1.5vw, 14px);
      text-align: center;
      align-self: center;
      width: 100%;
    }

    .hero-features {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-width: min(100%, 480px);
      width: 100%;
      gap: 10px 8px;
      margin-top: clamp(16px, 3vw, 24px);
      margin-left: auto;
      margin-right: auto;
      align-self: center;
    }

    .hero-feature-icon {
      width: 40px;
      height: 40px;
    }

    .hero-feature-line1,
    .hero-feature-line2 {
      font-size: 7px;
    }

    .hero-btns {
      flex-direction: column;
      align-items: center;
      align-self: center;
      width: 100%;
      max-width: min(100%, 320px);
      margin-top: clamp(16px, 3vw, 24px);
      margin-left: auto;
      margin-right: auto;
      gap: 12px;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      width: 100%;
      max-width: 280px;
      flex: none;
      font-size: 14px;
      padding: 10px 20px;
    }

    .hero-visual {
      position: relative;
      right: auto;
      bottom: auto;
      flex: none;
      width: 100%;
      max-width: 100%;
      min-height: clamp(280px, 42vw, 420px);
      margin-top: clamp(4px, 1vw, 12px);
      justify-content: center;
      align-items: flex-end;
      overflow: hidden;
    }

    .hero-cups-frame {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: min(100%, 560px);
      margin: 0 auto;
    }

    .hero-cups-img {
      width: min(100%, 520px);
      margin-left: 0;
      margin-right: 0;
      max-height: clamp(300px, 44vh, 440px);
      object-fit: contain;
      object-position: center bottom;
      transform-origin: center bottom;
    }

    .hero-highlights-inner {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px 10px;
    }

    .hero-highlight {
      flex: none;
    }
  }

  /* ─── COMPACT DESKTOP (1024px–1440px) — 13" laptop / zoom-safe ─── */
  @media (min-width: 1024px) and (max-width: 1440px) {
    .hero-section {
      min-height: auto;
      overflow-x: hidden;
    }

    .hero-inner {
      position: relative;
      align-items: center;
      justify-content: center;
      min-height: auto;
      gap: clamp(10px, 1.8vw, 20px);
      padding:
        calc(80px + env(safe-area-inset-top, 0px) + 12px)
        clamp(16px, 2.5vw, 28px)
        clamp(16px, 2vw, 24px);
    }

    .hero-copy {
      flex: 1 1 50%;
      min-width: 0;
      max-width: 50%;
      width: auto;
      padding-bottom: clamp(16px, 2.5vw, 32px);
      overflow: visible;
      z-index: 12;
      align-items: center;
      text-align: center;
      align-self: center;
    }

    .hero-eyebrow {
      top: 0;
      justify-content: center;
      align-self: center;
      width: 100%;
    }

    .hero-fresh {
      font-size: clamp(2rem, 2.8vw, 2.65rem);
      margin-bottom: -4px;
      top: 0;
      text-align: center;
      align-self: center;
      width: 100%;
    }

    .hero-copy-lower {
      top: 0;
      margin-top: 0;
      margin-bottom: 0;
      align-items: center;
      width: 100%;
    }

    .hero-taiwan {
      justify-content: center;
      width: 100%;
      max-width: 100%;
      margin-top: 0;
    }

    .hero-taiwan img {
      width: min(100%, clamp(240px, 32vw, 380px));
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-tagline {
      font-size: clamp(0.9rem, 1.15vw, 1.1rem);
      margin-top: 6px;
      text-align: center;
      align-self: center;
      width: 100%;
    }

    .hero-features {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
      max-width: min(100%, 420px);
      margin-top: 12px;
      margin-left: auto;
      margin-right: auto;
      align-self: center;
      gap: 8px;
    }

    .hero-feature-icon {
      width: 36px;
      height: 36px;
    }

    .hero-feature-line1,
    .hero-feature-line2 {
      font-size: 6.5px;
    }

    .hero-btns {
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px;
      margin-left: auto;
      margin-right: auto;
      gap: 10px;
      width: 100%;
      max-width: min(100%, 380px);
      align-self: center;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      min-width: 0;
      flex: 1 1 calc(50% - 5px);
      font-size: 12px;
      padding: 9px 14px;
    }

    .hero-visual {
      position: relative;
      right: auto;
      bottom: auto;
      flex: 1 1 50%;
      min-width: 0;
      max-width: 50%;
      min-height: clamp(345px, 46vw, 530px);
      justify-content: center;
      align-items: flex-end;
      overflow: visible;
    }

    .hero-cups-frame {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 100%;
      margin: 0;
      transform: scale(1.29);
      transform-origin: center bottom;
    }

    .hero-cups-img {
      width: min(100%, clamp(414px, 53vw, 621px));
      max-width: 100%;
      margin-left: 0;
      margin-right: 0;
      max-height: clamp(391px, 60vh, 575px);
      object-fit: contain;
      object-position: center bottom;
      transform-origin: center bottom;
    }
  }

  /* ─── LARGE DESKTOP (1441px+) — full bleed layout ─── */
  @media (min-width: 1441px) {
    .hero-section {
      overflow: hidden;
    }

    .hero-inner {
      position: relative;
      align-items: flex-end;
      justify-content: flex-start;
      padding:
        calc(92px + env(safe-area-inset-top, 0px) + 12px)
        clamp(24px, 4vw, 48px)
        clamp(4px, 1vw, 12px);
      min-height: calc(100svh - 92px);
    }

    .hero-copy {
      flex: 0 0 42%;
      width: 42%;
      max-width: 520px;
      align-items: flex-start;
      text-align: left;
      align-self: flex-end;
      padding-bottom: clamp(56px, 7vw, 88px);
      gap: 0;
      z-index: 12;
      overflow: visible;
    }

    .hero-eyebrow {
      top: 0;
      margin-top: clamp(1px, 1.8vw, 15px);
      margin-bottom: 18px;
      justify-content: flex-start;
      align-self: flex-start;
      width: auto;
    }

    .hero-fresh {
      font-size: clamp(2.5rem, 3.2vw, 3.85rem);
      top: 0;
      margin-top: clamp(10px, 0.9vw, 12px);
      margin-bottom: clamp(-20px, -5vw, -50px);
      width: auto;
      text-align: left;
      align-self: flex-start;
    }

    .hero-copy-lower {
      top: 0;
      margin-top: clamp(-28px, -3.2vw, -16px);
      margin-bottom: 0;
      align-items: flex-start;
      width: 100%;
      overflow: visible;
    }

    .hero-taiwan {
      margin-top: clamp(-18px, -2.2vw, -10px);
      justify-content: flex-start;
      align-items: flex-start;
      width: fit-content;
      max-width: none;
      align-self: flex-start;
      overflow: visible;
    }

    .hero-taiwan img {
      width: clamp(480px, 44vw, 700px);
      max-width: none;
      height: auto;
      margin-left: clamp(-192px, -17vw, -128px);
      margin-right: 0;
      display: block;
    }

    .hero-tagline {
      font-size: clamp(1rem, 1.15vw, 1.35rem);
      margin-top: 8px;
      width: auto;
      text-align: left;
      align-self: flex-start;
    }

    .hero-features {
      width: min(100%, 520px);
      max-width: 520px;
      align-self: flex-start;
      justify-items: stretch;
      margin-top: clamp(16px, 1.8vw, 22px);
      margin-left: clamp(-96px, -9vw, -64px);
    }

    .hero-btns {
      flex-direction: row;
      align-items: center;
      align-self: flex-start;
      width: auto;
      max-width: none;
      margin-top: clamp(18px, 2vw, 24px);
      margin-left: clamp(-56px, -6vw, -32px);
      gap: 12px;
    }

    .hero-btn-primary,
    .hero-btn-secondary {
      font-family: 'Signia Pro', 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.02em;
      text-transform: none;
      min-width: 148px;
      padding: 10px 18px;
    }

    .hero-visual {
      position: absolute;
      right: calc(-1 * max(0px, (100vw - 1280px) / 2));
      bottom: clamp(-40px, -3.5vw, -30px);
      width: clamp(460px, 46vw, 760px);
      max-width: none;
      flex: none;
      min-height: 0;
      margin: 0;
      align-items: flex-end;
      justify-content: flex-end;
      z-index: 8;
    }

    .hero-cups-frame {
      width: 100%;
      margin: 0;
      line-height: 0;
      transform: scale(0.9);
      transform-origin: right bottom;
    }

    .hero-cups-img {
      width: 140%;
      margin-left: -40%;
      max-height: none;
      height: auto;
      object-fit: contain;
      object-position: right bottom;
      transform-origin: right bottom;
    }

    .hero-highlights {
      padding: 18px 40px calc(18px + env(safe-area-inset-bottom, 0px));
    }
    .hero-highlight {
      padding: 10px 14px;
    }
    .hero-highlight-icon { width: 42px; height: 42px; }
    .hero-highlight-title { font-size: 0.82rem; }
    .hero-highlight-sub { font-size: 0.74rem; }
  }

  /* ─── XL DESKTOP (1600px+) ───────────────────────── */
  @media (min-width: 1600px) {
    .hero-copy {
      flex: 0 0 40%;
      width: 40%;
      max-width: 540px;
    }

    .hero-taiwan img {
      width: clamp(500px, 42vw, 740px);
      max-width: none;
      margin-left: clamp(-210px, -16vw, -140px);
    }

    .hero-features {
      margin-left: clamp(-104px, -8vw, -68px);
    }

    .hero-btns {
      margin-left: clamp(-64px, -5.5vw, -40px);
    }

    /* XL: override bottom only — decrease → lower, increase → higher */
    .hero-visual {
      width: clamp(500px, 44vw, 820px);
      bottom: clamp(-8px, 0.1vw, 3px);
    }

    .hero-cups-img {
      width: 152%;
      margin-left: -52%;
    }
  }

  /* ─── Reduced motion ──────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .hero-eyebrow, .hero-fresh, .hero-tagline,
    .hero-features, .hero-btns, .hero-taiwan img,
    .hero-cups-img, .hero-highlights {
      animation: none !important;
      opacity: 1 !important;
    }
    .hero-eyebrow, .hero-fresh {
      top: 0;
    }
    .hero-copy-lower {
      top: 0;
      margin-bottom: 0;
    }
    .hero-taiwan img {
      transform: none !important;
    }
    .hero-cups-img {
      transform: none !important;
    }
    .hero-feature-icon { animation: none !important; }
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

            <div className="hero-copy-lower">
            <div className="hero-taiwan">
              <img src="/taiwan-word.webp" alt="Taiwan" />
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
                <span className="hero-btn-icon">
                  <img src="/milkshop-logo-removebg-preview.webp" alt="" draggable={false} />
                </span>
                <span>Franchise Now</span>
                <span aria-hidden>→</span>
              </FranchiseInquiryTrigger>
              <Link to="/products" className="hero-btn-secondary">
                View Menu
              </Link>
            </div>
            </div>
          </div>

          {/* ── RIGHT: Cups (decorative composite) ── */}
          <div className="hero-visual">
            <div className="hero-cups-frame">
              <img
                className="hero-cups-img"
                src={HERO_CUPS_SRC}
                alt=""
                aria-hidden
                draggable={false}
              />
            </div>
          </div>

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
          </div>
        </div>

      </section>
    </>
  );
}