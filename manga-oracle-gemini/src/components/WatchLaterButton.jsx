"use client";

import { useEffect, useState } from "react";
import { addWatchLaterItem, isWatchLaterSaved, removeWatchLaterItem, WATCH_LATER_EVENT } from "@/lib/watchLater";
import { trackEvent } from "@/lib/analytics";

export default function WatchLaterButton({ item, sourceContext = "", compact = false, className = "" }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(isWatchLaterSaved(item));
    sync();
    window.addEventListener(WATCH_LATER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCH_LATER_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [item]);

  const handleClick = () => {
    const title = item?.title_ja || item?.title_en || item?.title || "";
    if (saved) {
      removeWatchLaterItem(item);
      setSaved(false);
      trackEvent("watch_later_remove", { title, source_context: sourceContext });
      return;
    }

    addWatchLaterItem(item, sourceContext);
    setSaved(true);
    trackEvent("watch_later_add", { title, source_context: sourceContext });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${compact ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"} tracking-[0.16em] uppercase transition-all hover:translate-y-[-1px] active:scale-[0.98] ${className}`}
      style={{
        border: saved ? "1px solid rgba(192,57,43,0.55)" : "1px solid rgba(10,10,10,0.18)",
        color: saved ? "#c0392b" : "#0a0a0a",
        backgroundColor: saved ? "rgba(192,57,43,0.08)" : "rgba(245,243,238,0.82)",
        fontFamily: "'JetBrains Mono', 'Noto Serif JP', monospace",
      }}
      aria-pressed={saved}
    >
      {saved ? "保存済み" : "後で見る"}
    </button>
  );
}
