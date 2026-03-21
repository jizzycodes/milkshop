import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLoginRequest } from "../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#5a5a5a;
    --white:         #ffffff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .al-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: var(--surface-bg);
  }

  /* ── Left Brand Panel ── */
  .al-left {
    display: none;
    width: 44%;
    flex-shrink: 0;
    background: var(--green-dark);
    position: relative;
    overflow: hidden;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 44px 40px;
  }

  @media (min-width: 860px) {
    .al-left { display: flex; }
  }

  .al-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 15% 15%, rgba(151,182,76,0.2) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 85%, rgba(183,205,127,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .al-left::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(208,224,176,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(208,224,176,0.05) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  /* Top area */
  .al-left-top { position: relative; z-index: 1; }

  .al-left-logo {
    height: 34px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.9;
    display: block;
    margin-bottom: 48px;
  }

  .al-left-headline {
    font-size: 30px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: -0.03em;
    line-height: 1.15;
  }

  .al-left-headline em {
    font-style: normal;
    color: var(--green-light);
  }

  .al-left-tagline {
    margin-top: 14px;
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    line-height: 1.65;
    max-width: 270px;
  }

  /* Feature list */
  .al-left-bottom { position: relative; z-index: 1; }

  .al-features {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .al-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px;
  }

  .al-feature-icon {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: rgba(151,182,76,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--green-light);
    flex-shrink: 0;
  }

  .al-feature-label {
    font-size: 11.5px;
    color: rgba(255,255,255,0.45);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.02em;
    line-height: 1;
  }

  .al-feature-title {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    margin-top: 2px;
  }

  /* ── Right Form Panel ── */
  .al-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    background: var(--surface-bg);
    position: relative;
    min-height: 100vh;
  }

  .al-right::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(151,182,76,0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .al-right::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(183,205,127,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .al-form-wrap {
    width: 100%;
    max-width: 380px;
    position: relative;
    z-index: 1;
    animation: al-up 0.32s cubic-bezier(0.4,0,0.2,1) both;
  }

  @keyframes al-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Mobile logo */
  .al-mobile-logo {
    margin-bottom: 32px;
  }

  .al-mobile-logo img {
    height: 28px;
    width: auto;
    object-fit: contain;
  }

  @media (min-width: 860px) {
    .al-mobile-logo { display: none; }
  }

  /* Heading */
  .al-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--green-primary);
    margin-bottom: 8px;
  }

  .al-title {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .al-subtitle {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 6px;
    opacity: 0.6;
  }

  /* Divider */
  .al-sep {
    height: 1px;
    background: var(--border);
    margin: 22px 0;
  }

  /* Error */
  .al-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 14px;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    border-radius: 10px;
    margin-bottom: 18px;
    animation: al-up 0.18s ease both;
  }

  .al-error-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .al-error-msg {
    font-size: 12.5px;
    color: #c0392b;
    line-height: 1.45;
  }

  /* Fields */
  .al-fields {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .al-field-label {
    display: block;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 7px;
    opacity: 0.65;
  }

  .al-field-rel { position: relative; }

  .al-field-ico {
    position: absolute;
    left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
    opacity: 0.35;
    pointer-events: none;
    display: flex;
  }

  .al-input {
    width: 100%;
    padding: 11px 14px 11px 40px;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--white);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }

  .al-input::placeholder { color: var(--text-secondary); opacity: 0.3; }

  .al-input:focus {
    border-color: var(--green-primary);
    box-shadow: 0 0 0 4px rgba(151,182,76,0.1);
  }

  .al-input.err { border-color: #fca5a5; }
  .al-input.err:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }

  /* Submit */
  .al-submit {
    width: 100%;
    padding: 13px;
    border-radius: 11px;
    border: none;
    background: var(--green-dark);
    font-size: 14px;
    font-weight: 700;
    color: var(--white);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.01em;
    margin-top: 6px;
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    box-shadow: 0 4px 18px rgba(98,132,11,0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .al-submit:hover:not(:disabled) {
    background: #4e6909;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(98,132,11,0.28);
  }

  .al-submit:active:not(:disabled) { transform: translateY(0); }

  .al-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .al-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: al-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes al-spin { to { transform: rotate(360deg); } }

  /* Footer */
  .al-footer {
    margin-top: 26px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .al-footer-line { flex: 1; height: 1px; background: var(--border); }

  .al-footer-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.35;
    white-space: nowrap;
  }
`;

export default function AdminLogin() {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const result = await adminLoginRequest(form);
      login(result.token, result.data);
      const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || "Unable to login. Check your credentials.");
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
      <div className="al-root">

        {/* ── Left Brand Panel ── */}
        <div className="al-left">
          <div className="al-left-top">
            <img src="/milkshop-logo.png" alt="Milkshop" className="al-left-logo" />
            <h2 className="al-left-headline">
              Manage your<br />
              <em>franchise pipeline</em><br />
              with ease.
            </h2>
            <p className="al-left-tagline">
              Track leads from registration to onboarding — all in one place.
            </p>
          </div>

          <div className="al-left-bottom">
            <div className="al-features">
              <div className="al-feature">
                <div className="al-feature-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <p className="al-feature-label">Lead tracking</p>
                  <p className="al-feature-title">Full pipeline visibility</p>
                </div>
              </div>

              <div className="al-feature">
                <div className="al-feature-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="al-feature-label">Follow-up system</p>
                  <p className="al-feature-title">Never miss a contact</p>
                </div>
              </div>

              <div className="al-feature">
                <div className="al-feature-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <polyline points="2 6 12 13 22 6"/>
                  </svg>
                </div>
                <div>
                  <p className="al-feature-label">Auto email</p>
                  <p className="al-feature-title">Sends on every inquiry</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="al-right">
          <div className="al-form-wrap">

            <div className="al-mobile-logo">
              <img src="/milkshop-logo.png" alt="Milkshop" />
            </div>

            <p className="al-eyebrow">Admin Console</p>
            <h1 className="al-title">Welcome back.</h1>
            <p className="al-subtitle">Sign in to manage your franchise requests.</p>

            <div className="al-sep" />

            {errorMessage && (
              <div className="al-error">
                <span className="al-error-dot" />
                <p className="al-error-msg">{errorMessage}</p>
              </div>
            )}

            <div className="al-fields">
              <div>
                <label className="al-field-label">Email</label>
                <div className="al-field-rel">
                  <span className="al-field-ico">
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
                <label className="al-field-label">Password</label>
                <div className="al-field-rel">
                  <span className="al-field-ico">
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
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="al-submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="al-spinner" />
                    Signing in…
                  </>
                ) : "Sign in"}
              </button>
            </div>

            <div className="al-footer">
              <span className="al-footer-line" />
              <span className="al-footer-label">Admin Access Only</span>
              <span className="al-footer-line" />
            </div>

          </div>
        </div>

      </div>
    </>
  );
}