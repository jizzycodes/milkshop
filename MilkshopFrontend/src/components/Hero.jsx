import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HERO_IMAGE = "/HEROFRESH.jpg";

const heroStyles = `
  @keyframes heroBreathe {
    0%   { transform: scale(1.03) translateX(0%); }
    50%  { transform: scale(1.08) translateX(-1%); }
    100% { transform: scale(1.03) translateX(0%); }
  }

  @keyframes heroOverlayPulse {
    0%, 100% { opacity: 0.18; }
    50%      { opacity: 0.3; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes pulseBadge {
    0%, 100% { box-shadow: 0 0 0 0 rgba(151,182,76,0.5); }
    50%       { box-shadow: 0 0 0 8px rgba(151,182,76,0); }
  }

  .hero-image {
    animation: heroBreathe 20s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    will-change: transform;
  }

  .hero-overlay-pulse {
    animation: heroOverlayPulse 20s ease-in-out infinite;
  }

  .anim-badge {
    opacity: 0;
    animation: fadeUp 0.7s ease forwards;
    animation-delay: 0.2s;
  }

  .anim-h1 {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.5s;
  }

  .anim-sub {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.75s;
  }

  .anim-stats {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 0.95s;
  }

  .anim-btn1 {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 1.1s;
  }

  .anim-btn2 {
    opacity: 0;
    animation: fadeUp 0.8s ease forwards;
    animation-delay: 1.25s;
  }

  .badge-pulse {
    animation: pulseBadge 2.5s ease-in-out infinite;
    animation-delay: 1s;
  }
`;

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <style>{heroStyles}</style>

      <section className="relative w-full min-h-[500px] sm:min-h-[560px] lg:min-h-[760px] overflow-hidden bg-[#0a0a0a]">

        {/* Animated Background Image */}
        <img
          src={HERO_IMAGE}
          alt="Milkshop signature drinks"
          className="hero-image absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: isMobile ? "62% center" : "center center" }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/45 to-black/8 lg:from-black/88 lg:via-black/55 lg:to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-black/18 lg:from-black/80 lg:to-black/20" />

        {/* Green glow accent */}
        <div className="hero-overlay-pulse absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(98,132,11,0.38),transparent_55%)]" />

        {/* Content */}
        <div className="relative z-10 h-full min-h-[500px] sm:min-h-[560px] lg:min-h-[760px] flex items-end">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-8 sm:pb-12 lg:pb-24">

        
         
         

            {/* Buttons */}
            <div
              className="flex flex-wrap items-center gap-3 sm:gap-4"
              style={{
                transform: isMobile ? "translateX(0)" : "translateX(-120px)",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Link
                to="/franchise#inquiry"
                className="anim-btn1 text-sm font-bold px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-white bg-[#E8A020] hover:bg-[#CF8E18] transition-all duration-300 active:scale-95 shadow-[0_10px_30px_rgba(232,160,32,0.4)] hover:shadow-[0_18px_45px_rgba(232,160,32,0.55)] hover:-translate-y-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Franchise Now
              </Link>

              <Link
                to="/locations"
                className="anim-btn2 text-sm font-semibold px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border border-white/30 text-white backdrop-blur-md bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                See Our Locations
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}