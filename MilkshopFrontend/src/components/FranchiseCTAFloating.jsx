import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

/**
 * FranchiseCTAFloating
 * ─────────────────────
 * Floating "Franchise Now" button pinned bottom-right.
 * - Hidden on /franchise (user is already there)
 * - Hidden on /admin routes
 * - Slides up after 1s on page load
 * - Expands on hover (icon → full label)
 * - Pulses gently to attract attention
 */
export default function FranchiseCTAFloating() {
  const location  = useLocation()
  const [visible, setVisible] = useState(false)

  // Slide in after short delay on every route change
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(t)
  }, [location.pathname])

  // Hide on franchise page and all admin routes
  const hidden =
    location.pathname === "/franchise" ||
    location.pathname.startsWith("/admin")

  if (hidden) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <Link
        to="/franchise#inquiry"
        className="group flex items-center gap-2.5 bg-[#E8A020] hover:bg-[#CF8E18] text-white font-bold text-sm pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Pulse ring */}
        <span className="relative flex items-center justify-center shrink-0">
          <span className="absolute w-7 h-7 rounded-full bg-white/30 animate-ping" />
          <span className="relative text-lg">🧋</span>
        </span>

        {/* Label — always visible on mobile, expands smoothly on desktop */}
        <span className="whitespace-nowrap overflow-hidden max-w-0 sm:max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
          Franchise Now
        </span>
        <span className="hidden group-hover:inline transition-all duration-200">→</span>

        {/* Always visible label on mobile */}
        <span
          className="sm:hidden whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Franchise Now
        </span>
      </Link>
    </div>
  )
}