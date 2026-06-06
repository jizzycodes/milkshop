import { useState, useEffect } from "react"

import { useLocation } from "react-router-dom"

import { useFranchiseInquiry } from "../context/FranchiseInquiryContext"



const PROMO_DISMISS_KEY = "ms_franchise_promo_dismissed"



const T = {

  greenLight: "#b7cd7f",

  greenDark: "#62840b",

}



/**

 * Floating "Franchise Now" + small dismissible promo card (below the button).

 * Hidden on /admin/* only. Opens franchise application popup (no scroll).

 */

export default function FranchiseCTAFloating() {

  const location = useLocation()

  const { open, isOpen } = useFranchiseInquiry()

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
    location.pathname.startsWith("/admin") ||
    isOpen ||
    location.pathname.startsWith("/franchise")



  if (hidden) return null



  const dismissPromo = () => {

    setPromoOpen(false)

    try {

      sessionStorage.setItem(PROMO_DISMISS_KEY, "1")

    } catch {

      /* ignore */

    }

  }



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



      {promoOpen && (

        <div

          className="order-2 w-[min(292px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl transition-opacity duration-300"

          role="dialog"

          aria-label="Franchise promo"

        >

          <div className="relative px-4 pt-3.5 pb-2.5">

            <button

              type="button"

              onClick={dismissPromo}

              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg text-lg leading-none text-[#6b7280] hover:bg-black/5"

              aria-label="Close"

            >

              ×

            </button>

            <p className="pr-10 text-[13px] font-medium leading-snug text-[#111827]">

              <span aria-hidden>👋</span> Enjoy{" "}

              <strong className="font-extrabold">FREE CONSULTATION</strong> on your first

              inquiry <span aria-hidden>❤️</span>

            </p>

            <p className="mt-2 text-[11.5px] leading-relaxed text-[#4b5563]">

              Explore franchising with Milkshop — we’re here to guide you.{" "}

              <span aria-hidden>👇</span>

            </p>

          </div>

          <button

            type="button"

            onClick={() => open()}

            className="flex w-full min-h-[52px] items-center gap-2.5 bg-[#E8A020] px-3 py-3 text-[#111827] transition-colors hover:bg-[#CF8E18]"

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

          </button>

        </div>

      )}

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


