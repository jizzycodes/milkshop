import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { isFirebaseConfigured } from "../firebase/config";
import {
  mapFirebaseAuthError,
  sendAdminPasswordReset,
  signInAdmin,
} from "../firebase/adminAuth";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --gp: #97b64c;
    --gd: #62840b;
    --gl: #b7cd7f;
    --bg: #f5f8ef;
    --bd: #d0e0b0;
    --tp: #1e1e1e;
    --ts: #374151;
    --wh: #ffffff;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Canvas ── */
  .al-canvas {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  /* ── Wave SVG background ── */
  .al-waves-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  .al-wave {
    position: absolute;
    width: 200%;
    will-change: transform;
  }

  .al-wave-1 {
    bottom: -10%;
    left: -50%;
    animation: al-wave-flow1 18s ease-in-out infinite;
    opacity: 0.18;
  }

  .al-wave-2 {
    bottom: -5%;
    left: -50%;
    animation: al-wave-flow2 22s ease-in-out infinite;
    opacity: 0.12;
  }

  .al-wave-3 {
    bottom: 0;
    left: -50%;
    animation: al-wave-flow3 26s ease-in-out infinite;
    opacity: 0.08;
  }

  .al-wave-top-1 {
    top: -12%;
    left: -50%;
    animation: al-wave-flow2 20s ease-in-out infinite reverse;
    opacity: 0.1;
  }

  .al-wave-top-2 {
    top: -8%;
    left: -50%;
    animation: al-wave-flow1 24s ease-in-out infinite reverse;
    opacity: 0.07;
  }

  @keyframes al-wave-flow1 {
    0%   { transform: translateX(0)   translateY(0); }
    25%  { transform: translateX(4%)  translateY(-12px); }
    50%  { transform: translateX(-3%) translateY(8px); }
    75%  { transform: translateX(2%)  translateY(-6px); }
    100% { transform: translateX(0)   translateY(0); }
  }

  @keyframes al-wave-flow2 {
    0%   { transform: translateX(0)    translateY(0); }
    30%  { transform: translateX(-5%)  translateY(10px); }
    60%  { transform: translateX(3%)   translateY(-14px); }
    100% { transform: translateX(0)    translateY(0); }
  }

  @keyframes al-wave-flow3 {
    0%   { transform: translateX(0)   translateY(0); }
    40%  { transform: translateX(6%)  translateY(-8px); }
    70%  { transform: translateX(-2%) translateY(12px); }
    100% { transform: translateX(0)   translateY(0); }
  }

  /* Soft green glow orbs to complement waves */
  .al-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(60px);
  }

  .al-orb-1 {
    width: 380px; height: 380px;
    background: radial-gradient(ellipse, rgba(151,182,76,0.14) 0%, transparent 70%);
    top: -80px; left: -80px;
  }

  .al-orb-2 {
    width: 280px; height: 280px;
    background: radial-gradient(ellipse, rgba(183,205,127,0.12) 0%, transparent 70%);
    bottom: -60px; right: -60px;
  }

  /* ── Floating card ── */
  .al-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.84);
    backdrop-filter: blur(24px) saturate(1.8);
    -webkit-backdrop-filter: blur(24px) saturate(1.8);
    border: 1px solid rgba(208,224,176,0.75);
    border-radius: 28px;
    padding: 38px 38px 34px;
    box-shadow:
      0 4px 6px rgba(10,20,5,0.04),
      0 24px 64px rgba(10,20,5,0.1),
      0 0 0 1px rgba(255,255,255,0.7) inset;
    animation: al-rise 0.5s cubic-bezier(0.4,0,0.2,1) both;
  }

  @keyframes al-rise {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Corner accents */
  .al-corner-tl {
    position: absolute;
    top: -1px; left: -1px;
    width: 56px; height: 56px;
    border-top: 2px solid rgba(151,182,76,0.45);
    border-left: 2px solid rgba(151,182,76,0.45);
    border-radius: 28px 0 0 0;
    pointer-events: none;
  }

  .al-corner-br {
    position: absolute;
    bottom: -1px; right: -1px;
    width: 56px; height: 56px;
    border-bottom: 2px solid rgba(151,182,76,0.45);
    border-right: 2px solid rgba(151,182,76,0.45);
    border-radius: 0 0 28px 0;
    pointer-events: none;
  }

  /* ── Card top ── */
  .al-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 26px;
  }

  .al-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .al-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(238,245,223,0.9);
    border: 1px solid var(--bd);
    border-radius: 99px;
    padding: 5px 11px;
    backdrop-filter: blur(4px);
  }

  .al-chip-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gp);
    animation: al-pulse 2.2s ease-in-out infinite;
  }

  @keyframes al-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.75); }
  }

  .al-chip-label {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gd);
  }

  /* ── Heading ── */
  .al-heading { margin-bottom: 26px; }

  .al-title {
    font-size: 27px;
    font-weight: 700;
    color: var(--tp);
    letter-spacing: -0.04em;
    line-height: 1.05;
  }

  .al-title span { color: var(--gd); }

  .al-subtitle {
    font-size: 13px;
    color: var(--ts);
    margin-top: 7px;
    opacity: 0.6;
    line-height: 1.5;
  }

  /* ── Error ── */
  .al-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 14px;
    background: rgba(254,242,242,0.9);
    border: 1px solid #fca5a5;
    border-radius: 12px;
    margin-bottom: 18px;
    animation: al-rise 0.2s ease both;
  }

  .al-error-ico { color: #ef4444; flex-shrink: 0; margin-top: 1px; }
  .al-error-msg { font-size: 12.5px; color: #c0392b; line-height: 1.45; }

  .al-success {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 14px;
    background: rgba(238,245,223,0.95);
    border: 1px solid var(--bd);
    border-radius: 12px;
    margin-bottom: 18px;
    animation: al-rise 0.2s ease both;
  }

  .al-success-ico { color: var(--gd); flex-shrink: 0; margin-top: 1px; }
  .al-success-msg { font-size: 12.5px; color: var(--gd); line-height: 1.45; }

  .al-forgot-row {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
    margin-bottom: 2px;
  }

  .al-forgot-btn {
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gd);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .al-forgot-btn:hover { color: var(--gp); }
  .al-forgot-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Fields ── */
  .al-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }

  .al-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ts);
    margin-bottom: 7px;
    opacity: 0.65;
  }

  .al-rel { position: relative; }

  .al-ico {
    position: absolute;
    left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--ts); opacity: 0.3;
    pointer-events: none;
    display: flex; align-items: center;
  }

  .al-input {
    width: 100%;
    padding: 12px 14px 12px 41px;
    border: 1.5px solid rgba(208,224,176,0.9);
    border-radius: 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--tp);
    background: rgba(255,255,255,0.65);
    backdrop-filter: blur(8px);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .al-input::placeholder { color: var(--ts); opacity: 0.3; }

  .al-input:focus {
    border-color: var(--gp);
    box-shadow: 0 0 0 4px rgba(151,182,76,0.12);
    background: rgba(255,255,255,0.95);
  }

  .al-input.err { border-color: #fca5a5; background: rgba(254,242,242,0.5); }
  .al-input.err:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }

  /* ── Submit ── */
  .al-btn {
    width: 100%;
    padding: 13px;
    border-radius: 16px;
    border: none;
    background: var(--gd);
    font-size: 14.5px;
    font-weight: 700;
    color: var(--wh);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.015em;
    transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(98,132,11,0.28), 0 1px 3px rgba(98,132,11,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }

  .al-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 55%);
    pointer-events: none;
  }

  .al-btn:hover:not(:disabled) {
    background: #4e6909;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(98,132,11,0.32);
  }

  .al-btn:active:not(:disabled) { transform: translateY(0); }

  .al-btn:disabled {
    opacity: 0.5; cursor: not-allowed;
    transform: none; box-shadow: none;
  }

  .al-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: var(--wh);
    border-radius: 50%;
    animation: al-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes al-spin { to { transform: rotate(360deg); } }

  /* ── Footer ── */
  .al-card-footer {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .al-footer-line { flex: 1; height: 1px; background: var(--bd); opacity: 0.55; }

  .al-footer-txt {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--ts);
    opacity: 0.32;
    white-space: nowrap;
  }

  /* ── Floating bottom pill ── */
  .al-bottom-pill {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 7px;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(208,224,176,0.65);
    border-radius: 99px;
    padding: 7px 18px;
    white-space: nowrap;
    box-shadow: 0 2px 16px rgba(10,20,5,0.08);
    animation: al-rise 0.6s 0.3s ease both;
  }

  .al-pill-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gp);
    flex-shrink: 0;
  }

  .al-pill-txt {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gd);
    opacity: 0.7;
  }
`;

/* Milk wave SVG path generator */
function WavePath({ d, fill, opacity }) {
  return (
    <svg
      className={`al-wave ${d}`}
      viewBox="0 0 1440 180"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      style={{ display: "block", height: 180 }}
    >
      <path
        d={
          d === "al-wave-1"
            ? "M0,80 C180,140 360,20 540,80 C720,140 900,20 1080,80 C1260,140 1380,60 1440,80 L1440,180 L0,180 Z"
            : d === "al-wave-2"
            ? "M0,100 C200,30 400,160 600,100 C800,40 1000,150 1200,100 C1320,70 1400,110 1440,100 L1440,180 L0,180 Z"
            : d === "al-wave-3"
            ? "M0,120 C240,60 480,160 720,120 C960,80 1200,150 1440,120 L1440,180 L0,180 Z"
            : d === "al-wave-top-1"
            ? "M0,60 C200,120 400,20 600,70 C800,120 1000,30 1200,70 C1350,100 1420,50 1440,60 L1440,0 L0,0 Z"
            : "M0,40 C180,90 360,10 540,50 C720,90 900,15 1080,55 C1260,95 1380,35 1440,45 L1440,0 L0,0 Z"
        }
        fill={fill}
        opacity={opacity}
      />
    </svg>
  )
}

export default function AdminLogin() {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, firebaseConfigured } = useAdminAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!firebaseConfigured) {
      setErrorMessage(
        "Firebase is not configured. Copy MilkshopFrontend/.env.example to .env and add your VITE_FIREBASE_* keys, then restart npm run dev.",
      );
      return;
    }
    const email = form.email.trim();
    if (!email) {
      setErrorMessage("Enter your email address first, then click Forgot password.");
      return;
    }
    setIsResetting(true);
    try {
      await sendAdminPasswordReset(email);
      setSuccessMessage(
        "If an account exists for this email, Firebase sent a password reset link. Check your inbox and spam folder.",
      );
    } catch (err) {
      setErrorMessage(mapFirebaseAuthError(err));
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!firebaseConfigured) {
      setErrorMessage(
        "Firebase is not configured. Copy MilkshopFrontend/.env.example to .env and add your VITE_FIREBASE_* keys, then restart npm run dev.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await signInAdmin(form.email, form.password);
      login(result.token, result.profile);
      const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isSubmitting) handleSubmit();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-canvas">

        {/* ── Milk wave background ── */}
        <div className="al-waves-bg">
          {/* Top waves */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "200%", pointerEvents: "none" }}>
            <svg
              className="al-wave al-wave-top-1"
              viewBox="0 0 1440 180"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", height: 180, width: "100%" }}
            >
              <path
                d="M0,60 C200,120 400,20 600,70 C800,120 1000,30 1200,70 C1350,100 1420,50 1440,60 L1440,0 L0,0 Z"
                fill="#97b64c"
              />
            </svg>
          </div>

          <div style={{ position: "absolute", top: 0, left: 0, width: "200%", pointerEvents: "none" }}>
            <svg
              className="al-wave al-wave-top-2"
              viewBox="0 0 1440 160"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", height: 160, width: "100%" }}
            >
              <path
                d="M0,40 C180,90 360,10 540,50 C720,90 900,15 1080,55 C1260,95 1380,35 1440,45 L1440,0 L0,0 Z"
                fill="#b7cd7f"
              />
            </svg>
          </div>

          {/* Bottom waves */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "200%", pointerEvents: "none" }}>
            <svg
              className="al-wave al-wave-1"
              viewBox="0 0 1440 180"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", height: 180, width: "100%" }}
            >
              <path
                d="M0,80 C180,140 360,20 540,80 C720,140 900,20 1080,80 C1260,140 1380,60 1440,80 L1440,180 L0,180 Z"
                fill="#97b64c"
              />
            </svg>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, width: "200%", pointerEvents: "none" }}>
            <svg
              className="al-wave al-wave-2"
              viewBox="0 0 1440 180"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", height: 180, width: "100%" }}
            >
              <path
                d="M0,100 C200,30 400,160 600,100 C800,40 1000,150 1200,100 C1320,70 1400,110 1440,100 L1440,180 L0,180 Z"
                fill="#b7cd7f"
              />
            </svg>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, width: "200%", pointerEvents: "none" }}>
            <svg
              className="al-wave al-wave-3"
              viewBox="0 0 1440 180"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ display: "block", height: 180, width: "100%" }}
            >
              <path
                d="M0,120 C240,60 480,160 720,120 C960,80 1200,150 1440,120 L1440,180 L0,180 Z"
                fill="#d0e0b0"
              />
            </svg>
          </div>
        </div>

        {/* Soft orbs */}
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />

        {/* ── Glass Card ── */}
        <div className="al-card">
          <div className="al-corner-tl" />
          <div className="al-corner-br" />

          {/* Logo + chip */}
          <div className="al-card-top">
            <img src="/milkshop-logo-removebg-preview.webp" alt="Milkshop" className="al-logo" />
            <div className="al-chip">
              <span className="al-chip-dot" />
              <span className="al-chip-label">Admin</span>
            </div>
          </div>

          {/* Heading */}
          <div className="al-heading">
            <h1 className="al-title">
              Welcome<br /><span>back.</span>
            </h1>
            <p className="al-subtitle">Sign in to manage your franchise pipeline.</p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="al-error">
              <span className="al-error-ico">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <p className="al-error-msg">{errorMessage}</p>
            </div>
          )}

          {successMessage && !errorMessage && (
            <div className="al-success">
              <span className="al-success-ico">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
              <p className="al-success-msg">{successMessage}</p>
            </div>
          )}

          {/* Fields */}
          <div className="al-fields">
            <div>
              <label className="al-label">Email address</label>
              <div className="al-rel">
                <span className="al-ico">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2 6 12 13 22 6"/>
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                  placeholder="admin@milkshop.com"
                  className={`al-input${errorMessage ? " err" : ""}`}
                />
              </div>
            </div>

            <div>
              <label className="al-label">Password</label>
              <div className="al-rel">
                <span className="al-ico">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`al-input${errorMessage ? " err" : ""}`}
                />
              </div>
              <div className="al-forgot-row">
                <button
                  type="button"
                  className="al-forgot-btn"
                  disabled={isSubmitting || isResetting}
                  onClick={handleForgotPassword}
                >
                  {isResetting ? "Sending reset link…" : "Forgot password?"}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={isSubmitting || isResetting}
            onClick={handleSubmit}
            className="al-btn"
          >
            {isSubmitting ? (
              <>
                <span className="al-spinner" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>

          {/* Footer */}
          <div className="al-card-footer">
            <span className="al-footer-line" />
            <span className="al-footer-txt">Milkshop · Admin Access Only</span>
            <span className="al-footer-line" />
          </div>
        </div>

        {/* Floating bottom pill */}
        <div className="al-bottom-pill">
          <span className="al-pill-dot" />
          <span className="al-pill-txt">Secure Admin Portal</span>
        </div>

      </div>
    </>
  );
}