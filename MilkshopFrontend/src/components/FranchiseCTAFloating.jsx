import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useFranchiseInquiry } from "../context/FranchiseInquiryContext"

const T = {
  greenLight: "#b7cd7f",
  greenDark: "#62840b",
}

/**
 * Floating "Franchise Now" button.
 * Hidden on /admin/* only. Opens franchise application popup (no scroll).
 */
export default function FranchiseCTAFloating() {
  const location = useLocation()
  const { open, isOpen } = useFranchiseInquiry()
  const [panelVisible, setPanelVisible] = useState(false)

  useEffect(() => {
    setPanelVisible(false)
    const t = setTimeout(() => setPanelVisible(true), 900)
    return () => clearTimeout(t)
  }, [location.pathname])

  const hidden =
    location.pathname.startsWith("/admin") ||
    isOpen ||
    location.pathname.startsWith("/franchise")

  if (hidden) return null

  const ctaClass =
    "flex items-center gap-2.5 font-bold text-sm pl-3 pr-5 py-2.5 min-h-[48px] rounded-full shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300 order-1 hover:brightness-110"

  const ctaStyle = {
    fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
    backgroundColor: T.greenDark,
    color: "#ffffff",
  }

  return (
    <div
      className={`fixed z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        panelVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{
        bottom: "max(24px, env(safe-area-inset-bottom, 0px))",
        right: "max(16px, env(safe-area-inset-right, 0px))",
      }}
    >
      <button type="button" onClick={() => open()} className={ctaClass} style={ctaStyle}>
        <CtaIcon />
        <span className="whitespace-nowrap pr-0.5">Franchise Now</span>
        <span aria-hidden>→</span>
      </button>
    </div>
  )
}

function CtaIcon() {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
      <span
        className="absolute h-9 w-9 rounded-full animate-ping opacity-40"
        style={{ backgroundColor: T.greenLight }}
      />
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/90 ring-1 ring-black/5">
        <img
          src="/milkshop-logo-removebg-preview.png"
          alt=""
          className="h-7 w-7 object-contain"
          draggable={false}
        />
      </span>
    </span>
  )
}
