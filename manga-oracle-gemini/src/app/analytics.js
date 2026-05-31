"use client";

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function getDiagnosisType(mode) {
  return mode === "simple" ? "simple" : "advanced";
}
