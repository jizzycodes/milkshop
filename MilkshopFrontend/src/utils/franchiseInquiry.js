export const FRANCHISE_INQUIRY_ID = "inquiry";

export function getNavOffset() {
  const nav = document.querySelector(".ms-site-nav");
  return (nav?.getBoundingClientRect().height ?? 72) + 12;
}

export function scrollToFranchiseInquiry(behavior = "smooth") {
  const el = document.getElementById(FRANCHISE_INQUIRY_ID);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - getNavOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/** Retry scroll until lazy route + form section have mounted. */
export function scheduleScrollToFranchiseInquiry(behavior = "smooth", attempts = 10) {
  let n = 0;
  const tick = () => {
    if (scrollToFranchiseInquiry(behavior)) return;
    n += 1;
    if (n < attempts) {
      setTimeout(tick, n < 4 ? 100 : 300);
    }
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(tick);
  } else {
    tick();
  }
}

export function isFranchiseInquiryHash(hash = "") {
  return hash === `#${FRANCHISE_INQUIRY_ID}` || hash === FRANCHISE_INQUIRY_ID;
}
