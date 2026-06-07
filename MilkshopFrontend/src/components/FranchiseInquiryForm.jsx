import { useEffect, useRef, useState } from "react";
import { createFranchiseRequest } from "../services/api";
import { localDatetimeLocalFloor } from "../utils/dateInputConstraints";

const T = {
  greenDark: "#62840b",
  body: "#4a5640",
  ink: "#18210f",
  border: "rgba(151,182,76,0.15)",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  contactNumber: "",
  bestContactTime: "",
  estimatedAnnualIncome: "",
  proposedLocation: "",
  preferredPackage: "",
  remarks: "",
  referral: "",
};

const FORM_FIELDS = [
  "name",
  "email",
  "contactNumber",
  "bestContactTime",
  "estimatedAnnualIncome",
  "proposedLocation",
  "preferredPackage",
  "remarks",
];

const inputBase =
  "w-full px-4 py-3 rounded-xl border text-sm placeholder-gray-400 focus:outline-none transition-all duration-200 bg-white min-h-[48px]";
const inputIdle =
  "border-[#d0e0b0] focus:border-[#97b64c] focus:ring-2 focus:ring-[#e8f0dc]";

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAADe_Eo_j7PaIbsrR";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js";

function waitForTurnstile() {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
    const done = () => resolve();
    if (script) {
      script.addEventListener("load", done, { once: true });
      if (window.turnstile) done();
      return;
    }
    const poll = () => {
      if (window.turnstile) done();
      else requestAnimationFrame(poll);
    };
    poll();
  });
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-bold uppercase tracking-widest flex items-center gap-1"
        style={{ color: T.ink, fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
        {required && <span style={{ color: "#97b64c" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#dc2626" }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function ThankYouView({ variant = "page" }) {
  const isModal = variant === "modal";
  return (
    <>
      <style>{`
        @keyframes fiTyFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fi-thankyou {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          width: 100%;
          box-sizing: border-box;
          padding: clamp(20px, 4vw, 28px) clamp(16px, 4vw, 20px);
          animation: fiTyFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .fi-thankyou--modal {
          padding: 16px 18px 20px;
          justify-content: center;
          gap: 16px;
        }
        @media (min-width: 560px) {
          .fi-thankyou {
            flex-direction: row;
            align-items: center;
            gap: 28px 36px;
            padding: clamp(24px, 4vw, 32px) clamp(20px, 4vw, 28px);
          }
          .fi-thankyou--modal {
            flex-direction: row;
            gap: 20px 24px;
            padding: 20px 24px 24px;
          }
        }
        @media (min-width: 768px) {
          .fi-thankyou--modal {
            padding: 22px 28px 26px;
          }
        }
        .fi-thankyou-visual {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          width: min(220px, 68vw);
        }
        .fi-thankyou--modal .fi-thankyou-visual {
          width: min(140px, 42vw);
        }
        @media (min-width: 560px) {
          .fi-thankyou-visual {
            width: auto;
            flex: 0 0 min(240px, 38%);
            justify-content: center;
          }
          .fi-thankyou--modal .fi-thankyou-visual {
            flex: 0 0 min(150px, 34%);
            width: auto;
          }
        }
        @media (min-width: 768px) {
          .fi-thankyou-visual {
            flex-basis: min(280px, 40%);
          }
          .fi-thankyou--modal .fi-thankyou-visual {
            flex-basis: min(160px, 32%);
          }
        }
        .fi-thankyou-visual img {
          display: block;
          width: 100%;
          height: auto;
          max-height: min(240px, 42vw);
          object-fit: contain;
        }
        .fi-thankyou--modal .fi-thankyou-visual img {
          max-height: min(150px, 38vw);
        }
        @media (min-width: 560px) {
          .fi-thankyou-visual img {
            width: auto;
            max-width: min(260px, 100%);
            max-height: 300px;
          }
          .fi-thankyou--modal .fi-thankyou-visual img {
            max-width: 160px;
            max-height: 180px;
          }
        }
        @media (min-width: 768px) {
          .fi-thankyou-visual img {
            max-width: 280px;
            max-height: 320px;
          }
          .fi-thankyou--modal .fi-thankyou-visual img {
            max-width: 170px;
            max-height: 190px;
          }
        }
        .fi-thankyou-copy {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        @media (min-width: 560px) {
          .fi-thankyou-copy {
            align-items: flex-start;
            text-align: left;
            justify-content: center;
          }
          .fi-thankyou--modal .fi-thankyou-copy {
            align-items: flex-start;
            text-align: left;
          }
        }
        .fi-thankyou-heading {
          margin: 0 0 8px;
          font-size: clamp(1.45rem, 5vw, 2rem);
          line-height: 1.15;
        }
        .fi-thankyou--modal .fi-thankyou-heading {
          font-size: clamp(1.2rem, 4vw, 1.45rem);
          margin-bottom: 6px;
        }
        .fi-thankyou-message {
          color: ${T.body};
          font-size: clamp(0.875rem, 2.6vw, 0.95rem);
          line-height: 1.6;
          margin: 0;
          max-width: 38ch;
        }
        .fi-thankyou--modal .fi-thankyou-message {
          font-size: clamp(0.8125rem, 2.4vw, 0.875rem);
          line-height: 1.55;
          max-width: 34ch;
        }
        .fi-thankyou-message strong {
          color: ${T.greenDark};
          font-weight: 700;
        }
        .fi-thankyou-trust {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid ${T.border};
          font-size: 0.78rem;
          font-weight: 600;
          color: ${T.greenDark};
        }
        .fi-thankyou--modal .fi-thankyou-trust {
          margin-top: 14px;
          padding-top: 12px;
          gap: 8px;
          font-size: 0.72rem;
        }
        @media (min-width: 420px) {
          .fi-thankyou-trust {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px 20px;
          }
          .fi-thankyou--modal .fi-thankyou-trust {
            gap: 8px 14px;
          }
        }
        @media (min-width: 560px) {
          .fi-thankyou-trust {
            justify-content: flex-start;
            margin-top: 28px;
            padding-top: 24px;
          }
          .fi-thankyou--modal .fi-thankyou-trust {
            margin-top: 16px;
            padding-top: 14px;
          }
        }
        .fi-thankyou-trust span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
      `}</style>
      <div className={`fi-thankyou${isModal ? " fi-thankyou--modal" : ""}`}>
        <div className="fi-thankyou-visual">
          <img src="/mooba-ty.webp" alt="Mooba thank you" draggable={false} />
        </div>
        <div className="fi-thankyou-copy">
          <h2 className="ms-section-heading fi-thankyou-heading">Thank You!</h2>
          <p className="fi-thankyou-message">
            We&apos;ve received your franchise application. Our team will reach out within{" "}
            <strong>1–2 business days</strong>.
          </p>
          <div className="fi-thankyou-trust">
            <span>🔒 Secure</span>
            <span>⚡ Fast Review</span>
            <span>📞 We&apos;ll Call You</span>
          </div>
        </div>
      </div>
    </>
  );
}

/** Shared franchise application form (Franchise.jsx + popup). */
export default function FranchiseInquiryForm({
  idPrefix = "fi-",
  preferredPackage = "",
  hideHeader = false,
  variant = "page",
  onSubmittedChange,
}) {
  const isModal = variant === "modal";
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    preferredPackage: preferredPackage || "",
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileTokenRef = useRef("");
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  const clearTurnstileToken = () => {
    turnstileTokenRef.current = "";
    setTurnstileToken("");
  };

  const resolveTurnstileToken = () => {
    if (turnstileTokenRef.current) return turnstileTokenRef.current;
    if (turnstileWidgetId.current != null && window.turnstile?.getResponse) {
      const liveToken = window.turnstile.getResponse(turnstileWidgetId.current);
      if (liveToken) {
        turnstileTokenRef.current = liveToken;
        setTurnstileToken(liveToken);
        return liveToken;
      }
    }
    return turnstileToken;
  };

  useEffect(() => {
    onSubmittedChange?.(submitted);
  }, [submitted, onSubmittedChange]);

  useEffect(() => {
    if (!preferredPackage) return;
    setFormData((p) => ({ ...p, preferredPackage }));
  }, [preferredPackage]);

  useEffect(() => {
    const handler = (e) => {
      turnstileTokenRef.current = e.detail;
      setTurnstileToken(e.detail);
    };
    document.addEventListener("turnstile:success", handler);
    return () => document.removeEventListener("turnstile:success", handler);
  }, []);

  useEffect(() => {
    const el = turnstileRef.current;
    if (!el || !TURNSTILE_SITE_KEY) return undefined;

    const onSuccess = (token) => {
      turnstileTokenRef.current = token;
      setTurnstileToken(token);
      document.dispatchEvent(new CustomEvent("turnstile:success", { detail: token }));
    };

    const renderWidget = () => {
      if (!window.turnstile || !el) return;
      if (turnstileWidgetId.current != null) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          /* already removed */
        }
        turnstileWidgetId.current = null;
      }
      el.innerHTML = "";
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      turnstileWidgetId.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        size: isMobile ? "flexible" : "normal",
        callback: onSuccess,
        "expired-callback": clearTurnstileToken,
        "error-callback": clearTurnstileToken,
      });
    };

    const scheduleRender = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(renderWidget);
      });
    };

    let cancelled = false;
    waitForTurnstile().then(() => {
      if (!cancelled) scheduleRender();
    });

    return () => {
      cancelled = true;
      if (turnstileWidgetId.current != null && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetId.current);
        } catch {
          /* already removed */
        }
      }
      turnstileWidgetId.current = null;
      clearTurnstileToken();
    };
  }, [isModal]);

  const fieldId = (name) => `${idPrefix}${name}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let next = value;
    if (name === "bestContactTime" && value) {
      const min = localDatetimeLocalFloor();
      if (value < min) next = min;
    }
    setFormData((p) => ({ ...p, [name]: next }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Full name is required.";
    if (!formData.email.trim()) e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email address.";
    if (!formData.contactNumber.trim()) e.contactNumber = "Contact number is required.";
    if (!formData.bestContactTime) e.bestContactTime = "Please pick a date and time.";
    if (!formData.estimatedAnnualIncome.trim())
      e.estimatedAnnualIncome = "Please provide your estimated income.";
    if (!formData.proposedLocation.trim()) e.proposedLocation = "Proposed location is required.";
    if (!formData.preferredPackage) e.preferredPackage = "Please select a package.";
    if (!formData.remarks.trim()) e.remarks = "Please tell us a bit about yourself.";
    return e;
  };

  const filledCount = FORM_FIELDS.filter((key) => String(formData[key] ?? "").trim() !== "").length;
  const progressPct = Math.round((filledCount / FORM_FIELDS.length) * 100);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrorMessage(""); 
    const activeTurnstileToken = resolveTurnstileToken();
    if (!activeTurnstileToken) {
      setErrorMessage("Please complete the security check.");
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(fieldId(Object.keys(errors)[0]))?.focus();
      return;
    }
    setIsSubmitting(true);
    try {
      await createFranchiseRequest({ ...formData, turnstileToken: activeTurnstileToken });
      setSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return <ThankYouView variant={variant} />;

  return (
    <div className={isModal ? "fi-form-root fi-form--modal" : "fi-form-root"}>
      <style>{`
        @keyframes fiTyFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fi-form-header { text-align: center; margin-bottom: 24px; }
        .fi-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .fi-form-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
        }
        .fi-form--modal .fi-form-grid {
          gap: 14px;
        }
        @media (min-width: 640px) {
          .fi-form--modal .fi-form-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px 22px;
          }
        }
        .fi-form--modal .fi-form-progress {
          margin-bottom: 20px;
        }
        .fi-form-cta-row {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid ${T.border};
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow: visible;
        }
        @media (min-width: 768px) {
          .fi-form-root:not(.fi-form--modal) .fi-form-cta-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 24px 32px;
          }
        }
        .fi-form-cta-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          width: 100%;
          min-width: 0;
        }
        @media (min-width: 768px) {
          .fi-form-root:not(.fi-form--modal) .fi-form-cta-actions {
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 16px;
            width: auto;
            flex-shrink: 0;
          }
        }
        .fi-form--modal .fi-form-cta-row {
          margin-top: 20px;
          padding-top: 18px;
          gap: 14px;
          align-items: stretch;
        }
        @media (min-width: 640px) {
          .fi-form--modal .fi-form-cta-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 20px 24px;
          }
          .fi-form--modal .fi-form-trust {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            flex: 0 0 auto;
          }
        }
        .fi-form--modal .fi-form-cta-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .fi-form--modal .fi-form-cta-actions {
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            width: auto;
            flex-shrink: 0;
          }
          .fi-form--modal .fi-turnstile-wrap {
            width: auto;
            min-width: 300px;
            justify-content: flex-start;
          }
          .fi-form--modal .fi-turnstile-wrap > div {
            width: auto;
            max-width: none;
          }
        }
        .fi-form-trust {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: ${T.greenDark};
        }
        @media (min-width: 768px) {
          .fi-form-root:not(.fi-form--modal) .fi-form-trust {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 8px;
            flex: 0 0 auto;
          }
        }
        @media (max-width: 767px) {
          .fi-form-root:not(.fi-form--modal) .fi-form-trust {
            order: 2;
          }
          .fi-form-root:not(.fi-form--modal) .fi-form-cta-actions {
            order: 1;
          }
        }
        .fi-form--modal .fi-form-trust {
          justify-content: center;
          gap: 10px 18px;
          padding-bottom: 4px;
        }
        .fi-form--modal {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .fi-form--modal .fi-form-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 16px 16px 12px;
        }
        @media (min-width: 768px) {
          .fi-form--modal .fi-form-scroll { padding: 20px 32px 16px; }
        }
     .fi-form--modal .fi-form-footer {
  flex-shrink: 0;
  padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  background: #fafbf7;
  border-top: 1px solid ${T.border};
  position: relative;
  z-index: 200;
  isolation: isolate;
}

.fi-form--modal .fi-form-footer {
  overflow: visible !important;
}
.fi-form--modal {
  overflow: visible !important;
}
.fi-form--modal .fi-form-scroll {
  position: relative;
  z-index: 1;
}
       .fi-turnstile-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65px;
  width: 100%;
  position: relative;
  z-index: 300;
  pointer-events: auto !important;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.fi-form-root:not(.fi-form--modal) .fi-turnstile-wrap {
  width: 100%;
}
@media (min-width: 768px) {
  .fi-form-root:not(.fi-form--modal) .fi-turnstile-wrap {
    width: auto;
    min-width: 300px;
    justify-content: flex-start;
  }
}
.fi-turnstile-wrap > div {
  pointer-events: auto !important;
  touch-action: manipulation;
  position: relative;
  z-index: 300;
  min-height: 65px;
  width: 100%;
  max-width: 100%;
}
@media (min-width: 768px) {
  .fi-form-root:not(.fi-form--modal) .fi-turnstile-wrap > div {
    width: auto;
    max-width: none;
  }
}
.fi-turnstile-wrap iframe {
  pointer-events: auto !important;
  touch-action: manipulation;
  position: relative;
  z-index: 300;
}
        @media (min-width: 768px) {
          .fi-form--modal .fi-form-footer { padding: 14px 32px 24px; }
        }
        .fi-form--modal .fi-submit-btn {
          width: 100%;
          min-height: 50px;
          font-size: 0.9rem;
        }
        @media (min-width: 640px) {
          .fi-form--modal .fi-submit-btn {
            width: auto;
            min-width: 220px;
            white-space: nowrap;
          }
        }
        .fi-submit-btn {
          width: 100%;
          min-height: 48px;
          padding: 14px 28px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          color: #fff;
          background: ${T.greenDark};
          box-shadow: 0 8px 24px rgba(98,132,11,0.28);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          line-height: 1.2;
        }
        @media (min-width: 768px) {
          .fi-form-root:not(.fi-form--modal) .fi-submit-btn {
            width: auto;
            min-width: 220px;
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
        .fi-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {isModal ? (
        <>
        <div className="fi-form-scroll">
          <div className="mb-6 fi-form-progress">
        <div
          className="flex justify-between text-[11px] mb-2"
          style={{ color: T.greenDark }}
        >
          <span>
            {filledCount === 0
              ? "Start filling the form"
              : filledCount === FORM_FIELDS.length
                ? "✓ All fields complete"
                : `${filledCount} of ${FORM_FIELDS.length} fields filled`}
          </span>
          <span style={{ fontWeight: 700 }}>{progressPct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#e8f0dc]" style={{ overflow: "hidden" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background:
                progressPct === 100
                  ? "linear-gradient(90deg, #62840b, #97b64c)"
                  : "#97b64c",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <p
          role="alert"
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 12,
            background: "#fef2f2",
            color: "#dc2626",
            fontSize: "0.85rem",
          }}
        >
          {errorMessage}
        </p>
      )}

      <div className="fi-form-grid">
        <div className="flex flex-col gap-4">
          <Field label="Full Name" required error={fieldErrors.name}>
            <input
              id={fieldId("name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
          <Field label="Email Address" required error={fieldErrors.email}>
            <input
              id={fieldId("email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
          <Field label="Contact Number" required error={fieldErrors.contactNumber}>
            <input
              id={fieldId("contactNumber")}
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
          <Field label="Preferred Contact Time" required error={fieldErrors.bestContactTime}>
            <input
              id={fieldId("bestContactTime")}
              type="datetime-local"
              name="bestContactTime"
              value={formData.bestContactTime}
              min={localDatetimeLocalFloor()}
              onChange={handleChange}
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-4">
          <Field label="Estimated Income" required error={fieldErrors.estimatedAnnualIncome}>
            <input
              id={fieldId("estimatedAnnualIncome")}
              name="estimatedAnnualIncome"
              value={formData.estimatedAnnualIncome}
              onChange={handleChange}
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
          <Field label="Proposed Location" required error={fieldErrors.proposedLocation}>
            <input
              id={fieldId("proposedLocation")}
              name="proposedLocation"
              value={formData.proposedLocation}
              onChange={handleChange}
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
          <Field label="Preferred Package" required error={fieldErrors.preferredPackage}>
            <select
              id={fieldId("preferredPackage")}
              name="preferredPackage"
              value={formData.preferredPackage}
              onChange={handleChange}
              className={`${inputBase} ${inputIdle}`}
            >
              <option value="">Select package</option>
              <option value="inline">In-line Store (30 SQM)</option>
              <option value="kiosk-delights">To-Go Kiosk — Dairy Delights (6 SQM)</option>
              <option value="kiosk-deal">To-Go Kiosk — Dairy Deal (4 SQM)</option>
              <option value="unsure">Not sure</option>
            </select>
          </Field>
          <Field label="Additional Info" required error={fieldErrors.remarks}>
            <textarea
              id={fieldId("remarks")}
              name="remarks"
              rows={3}
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Tell us your plan..."
              className={`${inputBase} ${inputIdle}`}
            />
          </Field>
        </div>
      </div>
        </div>

        <div className="fi-form-footer">
          <div className="fi-form-cta-row fi-form-cta-row--modal">
            <div className="fi-form-trust">
              <span>🔒 Secure</span>
              <span>⚡ Fast Review</span>
              <span>📞 We&apos;ll Call You</span>
            </div>
            <div className="fi-form-cta-actions">
              <div className="fi-turnstile-wrap">
                <div ref={turnstileRef} />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="fi-submit-btn"
              >
                {isSubmitting ? "Submitting..." : "Submit Application →"}
              </button>
            </div>
          </div>
        </div>
        </>
      ) : (
        <>
          {!hideHeader && (
            <div className="fi-form-header">
              <h2
                className="ms-section-heading"
                style={{ fontSize: "clamp(1.35rem, 4.5vw, 2rem)" }}
              >
                Franchise Application
              </h2>
            </div>
          )}

          <div className="mb-6 fi-form-progress">
            <div
              className="flex justify-between text-[11px] mb-2"
              style={{ color: T.greenDark }}
            >
              <span>
                {filledCount === 0
                  ? "Start filling the form"
                  : filledCount === FORM_FIELDS.length
                    ? "✓ All fields complete"
                    : `${filledCount} of ${FORM_FIELDS.length} fields filled`}
              </span>
              <span style={{ fontWeight: 700 }}>{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e8f0dc]" style={{ overflow: "hidden" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background:
                    progressPct === 100
                      ? "linear-gradient(90deg, #62840b, #97b64c)"
                      : "#97b64c",
                  transition: "width 0.35s ease",
                }}
              />
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 12,
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "0.85rem",
              }}
            >
              {errorMessage}
            </p>
          )}

          <div className="fi-form-grid">
            <div className="flex flex-col gap-4">
              <Field label="Full Name" required error={fieldErrors.name}>
                <input
                  id={fieldId("name")}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
              <Field label="Email Address" required error={fieldErrors.email}>
                <input
                  id={fieldId("email")}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
              <Field label="Contact Number" required error={fieldErrors.contactNumber}>
                <input
                  id={fieldId("contactNumber")}
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="09XX XXX XXXX"
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
              <Field label="Preferred Contact Time" required error={fieldErrors.bestContactTime}>
                <input
                  id={fieldId("bestContactTime")}
                  type="datetime-local"
                  name="bestContactTime"
                  value={formData.bestContactTime}
                  min={localDatetimeLocalFloor()}
                  onChange={handleChange}
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Estimated Income" required error={fieldErrors.estimatedAnnualIncome}>
                <input
                  id={fieldId("estimatedAnnualIncome")}
                  name="estimatedAnnualIncome"
                  value={formData.estimatedAnnualIncome}
                  onChange={handleChange}
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
              <Field label="Proposed Location" required error={fieldErrors.proposedLocation}>
                <input
                  id={fieldId("proposedLocation")}
                  name="proposedLocation"
                  value={formData.proposedLocation}
                  onChange={handleChange}
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
              <Field label="Preferred Package" required error={fieldErrors.preferredPackage}>
                <select
                  id={fieldId("preferredPackage")}
                  name="preferredPackage"
                  value={formData.preferredPackage}
                  onChange={handleChange}
                  className={`${inputBase} ${inputIdle}`}
                >
                  <option value="">Select package</option>
                  <option value="inline">In-line Store (30 SQM)</option>
                  <option value="kiosk-delights">To-Go Kiosk — Dairy Delights (6 SQM)</option>
                  <option value="kiosk-deal">To-Go Kiosk — Dairy Deal (4 SQM)</option>
                  <option value="unsure">Not sure</option>
                </select>
              </Field>
              <Field label="Additional Info" required error={fieldErrors.remarks}>
                <textarea
                  id={fieldId("remarks")}
                  name="remarks"
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Tell us your plan..."
                  className={`${inputBase} ${inputIdle}`}
                />
              </Field>
            </div>
          </div>

          <div className="fi-form-cta-row">
            <div className="fi-form-trust">
              <span>🔒 Secure</span>
              <span>⚡ Fast Review</span>
              <span>📞 We&apos;ll Call You</span>
            </div>
            <div className="fi-form-cta-actions">
              <div className="fi-turnstile-wrap">
                <div ref={turnstileRef} />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="fi-submit-btn"
              >
                {isSubmitting ? "Submitting..." : "Submit Application →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
