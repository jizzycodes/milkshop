import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { postTrackingEvents } from "../admin/services/api";

const ENABLED = (import.meta.env.VITE_TRACKING_ENABLED || "true").toLowerCase() !== "false";
const MIN_SECTION_DURATION_MS = 4000;
const MAX_SECTION_DURATION_MS = 7 * 60 * 1000;
const TRACKING_RESET_AT_KEY = "milkshop_tracking_reset_at";
const SECTION_SELECTOR = "[data-track-section]";
const SECTION_FALLBACK_SELECTOR = "section[id], section";
const OBSERVER_THRESHOLD = 0.4;

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
  return fromHeading || "unknown section";
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
    postTrackingEvents({ events });
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
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

  function enqueueSectionViewIfQualified(state) {
    if (!state) return;
    let durationMs = state.accumulatedMs || 0;
    if (state.startedAt != null) {
      durationMs += Math.max(0, Date.now() - state.startedAt);
    }
    if (!Number.isFinite(durationMs) || durationMs < MIN_SECTION_DURATION_MS) return;
    const trackedDurationMs = durationMs - MIN_SECTION_DURATION_MS;
    if (trackedDurationMs <= 0) return;
    const bounded = Math.min(Math.round(trackedDurationMs), MAX_SECTION_DURATION_MS);
    enqueue({ eventType: "section_view_end", sectionKey: state.sectionKey, durationMs: bounded });
  }

  function flushAndClearActiveSections() {
    activeSectionsRef.current.forEach((state) => {
      enqueueSectionViewIfQualified(state);
    });
    activeSectionsRef.current.clear();
  }

  useEffect(() => {
    if (!ENABLED) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target;
          const sectionKey = resolveSectionKey(node);

          if (entry.isIntersecting) {
            if (!activeSectionsRef.current.has(node)) {
              activeSectionsRef.current.set(node, {
                sectionKey,
                startedAt: startWallClock(),
                accumulatedMs: 0,
              });
            }
            return;
          }

          const state = activeSectionsRef.current.get(node);
          if (!state) return;
          activeSectionsRef.current.delete(node);
          enqueueSectionViewIfQualified(state);
        });
      },
      { threshold: OBSERVER_THRESHOLD },
    );

    const sectionNodes = Array.from(document.querySelectorAll(SECTION_SELECTOR));
    const nodesToObserve = sectionNodes.length > 0
      ? sectionNodes
      : Array.from(document.querySelectorAll(SECTION_FALLBACK_SELECTOR));
    nodesToObserve.forEach((node) => observer.observe(node));

    const onClick = (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const label = normalizeSectionLabel(a.textContent || a.getAttribute("aria-label") || "");
      if (!label) return;
      enqueue({ eventType: "nav_click", sectionKey: label, durationMs: 0 });
    };
    document.addEventListener("click", onClick);

    const onBeforeUnload = () => {
      flushAndClearActiveSections();
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
      flushAndClearActiveSections();
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, location.hash]);
}
