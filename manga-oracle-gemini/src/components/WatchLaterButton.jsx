"use client";

import { useEffect, useState } from "react";
import { addWatchLaterItem, isWatchLaterSaved, removeWatchLaterItem, WATCH_LATER_EVENT } from "@/lib/watchLater";
import { trackEvent } from "@/lib/analytics";

function BookmarkIcon({ saved }) {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} aria-hidden="true">
      <path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75v15.1l-5-3.2-5 3.2V4.75Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

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

  const label = saved ? "保存済み" : compact ? "保存" : "保存する";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-md ${compact ? "min-h-[34px] px-2.5 py-1.5 text-[11px]" : "min-h-[38px] px-4 py-2 text-xs"} font-bold tracking-[0.08em] transition-colors hover:!border-[#c0392b] hover:!bg-[#fff4f1] hover:!text-[#c0392b] active:scale-[0.98] ${className}`}
      style={{
        border: saved ? "1px solid rgba(192,57,43,0.55)" : "1px solid rgba(10,10,10,0.18)",
        color: saved ? "#c0392b" : "#0a0a0a",
        backgroundColor: saved ? "rgba(192,57,43,0.08)" : "rgba(245,243,238,0.82)",
        fontFamily: "'Noto Serif JP', 'JetBrains Mono', serif",
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      <BookmarkIcon saved={saved} />
      <span>{label}</span>
    </button>
  );
}
