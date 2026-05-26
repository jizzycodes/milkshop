import { useEffect } from "react"

const SCROLL_END_MS = 140

/** Pauses heavy animations / blur while the user scrolls for smoother frames. */
export default function ScrollPerformance() {
  useEffect(() => {
    const root = document.documentElement
    let endTimer

    const onScroll = () => {
      root.classList.add("is-scrolling")
      clearTimeout(endTimer)
      endTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling")
      }, SCROLL_END_MS)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(endTimer)
      root.classList.remove("is-scrolling")
    }
  }, [])

  return null
}
