"use client";

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) => value !== undefined)
  );
  if (window.location?.hostname === "localhost") {
    cleanParams.debug_mode = true;
  }

  try {
    window.gtag("event", eventName, cleanParams);
  } catch (error) {
    console.warn("GA4 event tracking failed:", eventName, error);
  }
}

export function getDiagnosisType(mode) {
  return mode === "simple" ? "simple" : "advanced";
}
