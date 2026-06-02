import { useEffect, useState } from "react";
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

function ThankYouView() {
  return (
    <div
      className="flex flex-col items-center text-center py-8 px-4"
      style={{ animation: "fiTyFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <img
        src="/milkshop-logo-removebg-preview.png"
        alt="Milkshop"
        style={{
          width: 72,
          height: 72,
          objectFit: "contain",
          marginBottom: 20,
        }}
      />
      <h2
        className="ms-section-heading"
        style={{ marginBottom: 8, fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
      >
        Thank You! 🎉
      </h2>
      <p
        style={{
          color: T.body,
          fontSize: "0.92rem",
          maxWidth: 360,
          lineHeight: 1.65,
          marginBottom: 24,
        }}
      >
        We&apos;ve received your franchise application. Our team will reach out within{" "}
        <strong style={{ color: T.greenDark }}>1–2 business days</strong>.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          fontSize: "0.78rem",
          color: T.greenDark,
          fontWeight: 600,
        }}
      >
        <span>🔒 Secure</span>
        <span>⚡ Fast Review</span>
        <span>📞 We&apos;ll Call You</span>
      </div>
    </div>
  );
}

/** Shared franchise application form (Franchise.jsx + popup). */
export default function FranchiseInquiryForm({
  idPrefix = "fi-",
  preferredPackage = "",
  hideHeader = false,
}) {
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    preferredPackage: preferredPackage || "",
  }));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!preferredPackage) return;
    setFormData((p) => ({ ...p, preferredPackage }));
  }, [preferredPackage]);

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
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      document.getElementById(fieldId(Object.keys(errors)[0]))?.focus();
      return;
    }
    setIsSubmitting(true);
    try {
      await createFranchiseRequest(formData);
      setSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return <ThankYouView />;

  return (
    <>
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
        .fi-form-cta-row {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid ${T.border};
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .fi-form-cta-row {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .fi-form-trust {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: ${T.greenDark};
        }
        @media (min-width: 768px) {
          .fi-form-trust { justify-content: flex-start; }
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
        }
        @media (min-width: 768px) {
          .fi-submit-btn { width: auto; }
        }
        .fi-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

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

      <div className="mb-6">
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
              <option value="cart">Cart</option>
              <option value="kiosk">Kiosk</option>
              <option value="inline">In-line</option>
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
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="fi-submit-btn"
        >
          {isSubmitting ? "Submitting..." : "Submit Application →"}
        </button>
      </div>
    </>
  );
}
