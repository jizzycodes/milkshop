import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Full-screen route transition loader.
 * - First paint: shows for `initialDurationMs` (so the animation feels finished).
 * - Later navigations: shows for `minDurationMs` (covers lazy chunk paint without feeling stuck).
 */
export default function RouteLoader({ minDurationMs = 450, initialDurationMs = 900 }) {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const hideTimerRef = useRef(null);
  const bootstrappedRef = useRef(false);
  const prevPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    const clear = () => {
      if (hideTimerRef.current != null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };

    if (!bootstrappedRef.current) {
      bootstrappedRef.current = true;
      prevPathnameRef.current = pathname;
      clear();
      hideTimerRef.current = window.setTimeout(() => setVisible(false), initialDurationMs);
      return clear;
    }

    if (prevPathnameRef.current === pathname) {
      return clear;
    }

    prevPathnameRef.current = pathname;
    setVisible(true);
    clear();
    hideTimerRef.current = window.setTimeout(() => setVisible(false), minDurationMs);
    return clear;
  }, [pathname, initialDurationMs, minDurationMs]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes msSpin { to { transform: rotate(360deg); } }
        @keyframes msPulse { 0%,100% { opacity: 0.65; } 50% { opacity: 1; } }
        .ms-loader-overlay{
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: radial-gradient(120% 120% at 50% 0%, rgba(248,252,241,1) 0%, rgba(245,248,239,1) 42%, rgba(238,245,223,1) 100%);
        }
        .ms-loader-card{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:14px;
        }
        .ms-loader-ring{
          width:72px;height:72px;
          border-radius:50%;
          border: 3px solid rgba(151,182,76,0.22);
          border-top-color: rgba(98,132,11,0.9);
          animation: msSpin 0.9s linear infinite;
          display:grid;
          place-items:center;
          box-shadow: 0 10px 30px rgba(98,132,11,0.12);
          background: rgba(255,255,255,0.55);
        }
        .ms-loader-logo{
          width:34px;height:34px;
          object-fit:contain;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.10));
        }
        .ms-loader-text{
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(98,132,11,0.88);
          animation: msPulse 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="ms-loader-overlay" role="status" aria-live="polite" aria-label="Loading">
        <div className="ms-loader-card">
          <div className="ms-loader-ring">
            <img className="ms-loader-logo" src="/milkshop-logo-removebg-preview.png" alt="Milkshop" draggable={false} />
          </div>
          <div className="ms-loader-text">Loading</div>
        </div>
      </div>
    </>
  );
}
