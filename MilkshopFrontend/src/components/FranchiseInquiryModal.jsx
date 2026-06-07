import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FranchiseInquiryForm from "./FranchiseInquiryForm";

export default function FranchiseInquiryModal({ isOpen, onClose, preferredPackage = "" }) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) setSubmitted(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <style>{`
        @keyframes fiModalIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fiSheetUp {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fiDialogIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .fi-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10050;
          background: rgba(10, 18, 4, 0.72);
          animation: fiModalIn 0.25s ease;
          padding: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .fi-modal-backdrop {
            align-items: center;
            padding: 24px;
          }
        }
        .fi-modal-panel {
          position: relative;
          width: 100%;
          max-height: 94dvh;
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          animation: fiSheetUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: visible;
          transform: none;
          isolation: isolate;
        }
        .fi-modal-panel--success {
          max-height: fit-content;
        }
        @media (min-width: 768px) {
          .fi-modal-panel {
            width: 100%;
            max-width: 920px;
            max-height: min(92dvh, 900px);
            border-radius: 24px;
            animation: fiDialogIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 24px 80px rgba(0,0,0,0.22);
          }
          .fi-modal-panel--success {
            max-width: 520px;
            max-height: none;
          }
        }
        .fi-modal-header {
          flex-shrink: 0;
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(151,182,76,0.18);
          background: #f9fbf4;
        }
        .fi-modal-header--success {
          padding: 10px 14px;
        }
        @media (min-width: 768px) {
          .fi-modal-header { padding: 14px 18px; }
          .fi-modal-header--success { padding: 12px 18px; }
        }
        .fi-modal-title {
          margin: 0;
          grid-column: 2;
          text-align: center;
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 900;
          color: #62840b;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .fi-modal-title { font-size: 1.05rem; }
        }
        .fi-modal-header-spacer {
          grid-column: 1;
          width: 44px;
          height: 44px;
        }
        .fi-modal-close {
          grid-column: 3;
          justify-self: end;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 12px;
          background: rgba(98,132,11,0.1);
          color: #62840b;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fi-modal-body {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: visible;
          padding: 0;
          background: #fafbf7;
        }
        .fi-modal-handle {
          width: 40px;
          height: 4px;
          border-radius: 999px;
          background: rgba(98,132,11,0.25);
          margin: 8px auto 0;
        }
        @media (min-width: 768px) {
          .fi-modal-handle { display: none; }
        }
      `}</style>

      <div
        className="fi-modal-backdrop"
        role="presentation"
        onClick={onClose}
      >
        <div
          className={`fi-modal-panel${submitted ? " fi-modal-panel--success" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fi-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fi-modal-handle" aria-hidden />
          <header className={`fi-modal-header${submitted ? " fi-modal-header--success" : ""}`}>
            <span className="fi-modal-header-spacer" aria-hidden />
            <h2 id="fi-modal-title" className="fi-modal-title">
              Franchise Application
            </h2>
            <button
              type="button"
              className="fi-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </header>
          <div className="fi-modal-body">
            <FranchiseInquiryForm
              key={preferredPackage || "default"}
              idPrefix="modal-fi-"
              preferredPackage={preferredPackage}
              hideHeader
              variant="modal"
              onSubmittedChange={setSubmitted}
            />
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
