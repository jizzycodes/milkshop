import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const EXIT_MS = 180;
const LOGO_SRC = "/milkshop-logo-removebg-preview.webp";

/**
 * Full-screen route transition loader (Milkshop brand — pour bar + logo sway).
 * - First paint: skipped (home loads immediately)
 * - Navigations: `minDurationMs`
 *
 * Two layout effects keep React Strict Mode from leaving the overlay stuck visible.
 */
export default function RouteLoader({ minDurationMs = 650 }) {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [activeMs, setActiveMs] = useState(minDurationMs);
  const hideTimerRef = useRef(null);
  const prevPathnameRef = useRef(null);

  const clearTimer = () => {
    if (hideTimerRef.current != null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHide = (ms) => {
    clearTimer();
    setActiveMs(ms);
    hideTimerRef.current = window.setTimeout(() => {
      setLeaving(true);
      hideTimerRef.current = window.setTimeout(() => {
        setShow(false);
        setLeaving(false);
        window.dispatchEvent(new CustomEvent("milkshop:route-loader-hidden"));
      }, EXIT_MS);
    }, ms);
  };

  useLayoutEffect(() => {
    window.dispatchEvent(new CustomEvent("milkshop:route-loader-hidden"));
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first paint only
  }, []);

  useLayoutEffect(() => {
    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = pathname;
      return;
    }
    if (prevPathnameRef.current === pathname) return;

    prevPathnameRef.current = pathname;
    setShow(true);
    setLeaving(false);
    scheduleHide(minDurationMs);
    return clearTimer;
  }, [pathname, minDurationMs]);

  if (!show && !leaving) return null;

  return (
    <>
      <style>{`
        @keyframes msSway {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%      { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes msPour {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes msDotDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 28px 28px; }
        }
        .ms-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background-color: #f7f9f2;
          opacity: 1;
          transition: opacity ${EXIT_MS}ms ease;
          pointer-events: all;
        }
        .ms-loader-overlay.is-leaving {
          opacity: 0;
          pointer-events: none;
        }
        .ms-loader-overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.45;
          background-image: radial-gradient(circle, rgba(151,182,76,0.14) 1px, transparent 1px);
          background-size: 22px 22px;
          animation: msDotDrift 12s linear infinite;
          pointer-events: none;
        }
        .ms-loader-card {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .ms-loader-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 88px;
        }
        .ms-loader-logo {
          width: 56px;
          height: 56px;
          object-fit: contain;
          filter: drop-shadow(0 10px 22px rgba(98,132,11,0.18));
          animation: msSway 2.8s ease-in-out infinite;
        }
        .ms-loader-track {
          width: 128px;
          height: 3px;
          border-radius: 999px;
          background: rgba(151,182,76,0.22);
          overflow: hidden;
        }
        .ms-loader-fill {
          display: block;
          height: 100%;
          width: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #62840b 0%, #97b64c 55%, #b7cd7f 100%);
          transform: scaleX(0);
          transform-origin: left center;
          animation: msPour var(--ms-loader-ms, 450ms) cubic-bezier(0.33, 1, 0.32, 1) forwards;
        }
        .ms-loader-label {
          font-family: 'Signia Pro', 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #62840b;
          margin: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .ms-loader-overlay::before { animation: none; }
          .ms-loader-logo { animation: none; }
          .ms-loader-fill {
            animation: none;
            transform: scaleX(1);
          }
          .ms-loader-overlay { transition: none; }
        }
      `}</style>
      <div
        className={`ms-loader-overlay${leaving ? " is-leaving" : ""}`}
        style={{ "--ms-loader-ms": `${activeMs}ms` }}
        role="status"
        aria-live="polite"
        aria-label="Loading page"
      >
        <div className="ms-loader-card">
          <div className="ms-loader-logo-wrap">
            <img className="ms-loader-logo" src={LOGO_SRC} alt="" draggable={false} />
          </div>
          <div className="ms-loader-track" aria-hidden>
            <span key={`${pathname}-${activeMs}-${show}`} className="ms-loader-fill" />
          </div>
          <p className="ms-loader-label">Shaking</p>
        </div>
      </div>
    </>
  );
}
