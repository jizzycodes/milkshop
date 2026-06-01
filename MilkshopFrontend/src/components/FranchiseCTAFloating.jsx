import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

const PROMO_DISMISS_KEY = "ms_franchise_promo_dismissed"

const T = {
  greenLight: "#b7cd7f",
  greenDark: "#62840b",
  green: "#97b64c",
}

/**
 * Floating "Franchise Now" + small dismissible promo card (below the button).
 * Hidden on /franchise and /admin/*.
 */
export default function FranchiseCTAFloating() {
  const location = useLocation()
  const [panelVisible, setPanelVisible] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)

  useEffect(() => {
    setPanelVisible(false)
    const t = setTimeout(() => setPanelVisible(true), 900)
    return () => clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    if (typeof window === "undefined") return
    const dismissed = sessionStorage.getItem(PROMO_DISMISS_KEY) === "1"
    setPromoOpen(!dismissed)
  }, [location.pathname])

  const hidden =
    location.pathname === "/franchise" ||
    location.pathname.startsWith("/admin")

  if (hidden) return null

  const dismissPromo = () => {
    setPromoOpen(false)
    try {
      sessionStorage.setItem(PROMO_DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        panelVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <Link
        to="/franchise#inquiry"
        className="group flex items-center gap-2.5 font-bold text-sm pl-2 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-2xl active:scale-95 transition-all duration-300 order-1 hover:brightness-110"
        style={{
          fontFamily: "'Signia Pro', 'DM Sans', sans-serif",
          backgroundColor: T.greenDark,
          color: "#ffffff",
        }}
      >
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

        <span className="hidden sm:inline whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
          Franchise Now
        </span>
        <span className="hidden sm:inline group-hover:inline transition-all duration-200">→</span>

        <span
          className="sm:hidden whitespace-nowrap"
          style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
        >
          Franchise Now
        </span>
      </Link>

      {promoOpen && (
        <div
          className="order-2 w-[min(292px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl transition-opacity duration-300"
          role="dialog"
          aria-label="Franchise promo"
        >
          <div className="relative px-4 pt-3.5 pb-2.5">
            <button
              type="button"
              onClick={dismissPromo}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-lg leading-none text-[#6b7280] hover:bg-black/5"
              aria-label="Close"
            >
              ×
            </button>
            <p className="pr-8 text-[13px] font-medium leading-snug text-[#111827]">
              <span aria-hidden>👋</span> Enjoy{" "}
              <strong className="font-extrabold">FREE CONSULTATION</strong> on your first
              inquiry <span aria-hidden>❤️</span>
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-[#4b5563]">
              Explore franchising with Milkshop — we’re here to guide you.{" "}
              <span aria-hidden>👇</span>
            </p>
          </div>
          <Link
            to="/franchise#inquiry"
            className="flex items-center gap-2.5 bg-[#E8A020] px-3 py-3 text-[#111827] transition-colors hover:bg-[#CF8E18]"
            style={{ fontFamily: "'Signia Pro', 'DM Sans', sans-serif" }}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/90 ring-1 ring-black/5">
              <img
                src="/milkshop-logo-removebg-preview.png"
                alt=""
                className="h-7 w-7 object-contain"
                draggable={false}
              />
            </span>
            <span className="text-[13px] font-black uppercase tracking-wide">Inquire now</span>
          </Link>
        </div>
      )}
    </div>
  )
}
