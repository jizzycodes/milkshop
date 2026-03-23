import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { postTrackingEvents } from "../admin/services/api";

const ENABLED = (import.meta.env.VITE_TRACKING_ENABLED || "true").toLowerCase() !== "false";
const MIN_SECTION_DURATION_MS = 4000;
const TRACKING_RESET_AT_KEY = "milkshop_tracking_reset_at";

function getSessionId() {
  const key = "milkshop_track_session";
  let v = window.sessionStorage.getItem(key);
  if (!v) {
    v = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(key, v);
  }
  return v;
}

function nowIso() {
  return new Date().toISOString();
}

export function useWebsiteTracker() {
  const location = useLocation();
  const sessionId = useMemo(() => (typeof window !== "undefined" ? getSessionId() : ""), []);
  const queueRef = useRef([]);
  const activeSectionsRef = useRef(new Map());
  const flushTimerRef = useRef(null);

  function enqueue(event) {
    if (!ENABLED) return;
    queueRef.current.push({
      ...event,
      sessionId,
      path: location.pathname + location.search + location.hash,
      occurredAt: nowIso(),
    });
    if (queueRef.current.length >= 10) {
      flush();
      return;
    }
    // Section dwell time is what Monitor cares about — send right away so
    // admin dashboard is not 5s behind. Clicks batch briefly.
    if (event.eventType === "section_view_end") {
      flush();
      return;
    }
    if (!flushTimerRef.current) {
      flushTimerRef.current = window.setTimeout(() => {
        flush();
      }, 2000);
    }
  }

  function flush() {
    if (!ENABLED) return;
    if (!queueRef.current.length) return;
    const resetAtRaw = window.localStorage.getItem(TRACKING_RESET_AT_KEY);
    const resetAtMs = resetAtRaw ? Date.parse(resetAtRaw) : NaN;
    const events = queueRef.current.splice(0, queueRef.current.length).filter((e) => {
      if (!Number.isFinite(resetAtMs)) return true;
      const eventMs = Date.parse(String(e.occurredAt || ""));
      if (!Number.isFinite(eventMs)) return true;
      return eventMs > resetAtMs;
    });
    if (!events.length) return;
    const payload = { events };
    postTrackingEvents(payload);
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }

  function normalizeSectionLabel(raw) {
    if (!raw) return "";
    return String(raw).trim().replace(/\s+/g, " ").slice(0, 80);
  }

  function resolveSectionKey(node) {
    const fromData = normalizeSectionLabel(node.getAttribute("data-track-section"));
    if (fromData) return fromData;

    const fromId = normalizeSectionLabel(node.getAttribute("id"));
    if (fromId) return fromId;

    const heading = node.querySelector("h1, h2, h3, [data-track-title]");
    const fromHeading = normalizeSectionLabel(
      heading?.getAttribute?.("data-track-title") || heading?.textContent,
    );
    if (fromHeading) return fromHeading;

    return "unknown section";
  }

  function startWallClock() {
    return document.visibilityState === "visible" ? Date.now() : null;
  }

  function pauseAllActiveSections() {
    const now = Date.now();
    activeSectionsRef.current.forEach((state) => {
      if (state.startedAt == null) return;
      state.accumulatedMs += Math.max(0, now - state.startedAt);
      state.startedAt = null;
    });
  }

  function resumeAllActiveSections() {
    const now = Date.now();
    activeSectionsRef.current.forEach((state) => {
      if (state.startedAt != null) return;
      state.startedAt = now;
    });
  }

  function enqueueSectionViewIfQualified(sectionKey, state) {
    if (!state) return;
    let durationMs = state.accumulatedMs || 0;
    if (state.startedAt != null) {
      durationMs += Math.max(0, Date.now() - state.startedAt);
    }
    if (durationMs < MIN_SECTION_DURATION_MS) return;
    enqueue({ eventType: "section_view_end", sectionKey, durationMs });
  }

  useEffect(() => {
    if (!ENABLED) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionKey = resolveSectionKey(entry.target);

          if (entry.isIntersecting) {
            if (!activeSectionsRef.current.has(sectionKey)) {
              activeSectionsRef.current.set(sectionKey, {
                startedAt: startWallClock(),
                accumulatedMs: 0,
              });
            }
          } else if (activeSectionsRef.current.has(sectionKey)) {
            const state = activeSectionsRef.current.get(sectionKey);
            activeSectionsRef.current.delete(sectionKey);
            enqueueSectionViewIfQualified(sectionKey, state);
          }
        });
      },
      { threshold: 0.4 },
    );

    const sectionNodes = Array.from(
      document.querySelectorAll("[data-track-section], section, [id]"),
    ).filter((node) => {
      const tag = node.tagName.toLowerCase();
      if (["html", "body", "main", "nav", "footer", "header"].includes(tag)) return false;
      return true;
    });
    sectionNodes.forEach((n) => observer.observe(n));

    const onClick = (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const label = (a.textContent || "").trim();
      if (!label) return;
      enqueue({ eventType: "nav_click", sectionKey: label, durationMs: 0 });
    };
    document.addEventListener("click", onClick);

    const onBeforeUnload = () => {
      activeSectionsRef.current.forEach((state, sectionKey) => {
        enqueueSectionViewIfQualified(sectionKey, state);
      });
      activeSectionsRef.current.clear();
      flush();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseAllActiveSections();
      } else {
        resumeAllActiveSections();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      activeSectionsRef.current.forEach((state, sectionKey) => {
        enqueueSectionViewIfQualified(sectionKey, state);
      });
      activeSectionsRef.current.clear();
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);
}
