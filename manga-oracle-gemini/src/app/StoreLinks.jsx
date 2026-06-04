"use client";

import { useState } from "react";
import { trackEvent } from "./analytics";

function makeLinks(title) {
  const query = encodeURIComponent(title || "");
  return {
    amazonKindle: `/api/out?store=amazon&intent=kindle&title=${query}`,
    amazonPaper: `/api/out?store=amazon&intent=paper&title=${query}`,
    rakutenSet: `/api/out?store=rakuten&intent=set&title=${query}`,
    rakutenBooks: `/api/out?store=rakuten&intent=books&title=${query}`,
  };
}

function trackAffiliateClick({ title, store, intent, pageType }) {
  if (store === "amazon") {
    trackEvent("affiliate_click_amazon", {
      title: title || "",
      link_type: intent === "paper" ? "paper" : intent === "kindle" ? "kindle" : "other",
      page_type: pageType || "other",
    });
    return;
  }

  if (store === "rakuten") {
    trackEvent("affiliate_click_rakuten", {
      title: title || "",
      link_type: intent === "set" ? "set" : intent === "books" ? "books" : "other",
      page_type: pageType || "other",
    });
  }
}

export default function StoreLinks({ title, compact = false, pageType = "diagnosis_result" }) {
  const [pressed, setPressed] = useState("");
  const links = makeLinks(title);
  const rel = "nofollow sponsored noopener noreferrer";
  const labels = {
    comic: "\u30b3\u30df\u30c3\u30af",
    fullSet: "\u5168\u5dfb",
    rakutenBooks: "\u697d\u5929\u30d6\u30c3\u30af\u30b9",
  };

  const wrapClass = compact ? "mt-2 w-full" : "mt-4 w-full";
  const gridClass = "grid grid-cols-2 gap-1.5";
  const buttonClass = compact
    ? "min-h-[32px] px-2 py-1.5 text-[10px] leading-snug text-center transition-all hover:translate-y-[-1px] active:scale-[0.98]"
    : "min-h-[36px] px-3 py-2 text-[11px] leading-snug text-center tracking-[0.04em] transition-all hover:translate-y-[-1px] active:scale-[0.98]";
  const buttonStyle = (key, accent = false) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: accent ? "1px solid rgba(192,57,43,0.45)" : "1px solid rgba(10,10,10,0.18)",
    color: accent ? "#c0392b" : "#0a0a0a",
    backgroundColor: pressed === key ? "rgba(192,57,43,0.12)" : "rgba(245,243,238,0.85)",
    fontFamily: "'Noto Serif JP', 'JetBrains Mono', serif",
  });
  const pressHandlers = (key) => ({
    onPointerDown: () => setPressed(key),
    onPointerUp: () => setPressed(""),
    onPointerCancel: () => setPressed(""),
    onPointerLeave: () => setPressed(""),
  });
  const clickHandlers = (store, intent) => ({
    onClick: () => trackAffiliateClick({ title, store, intent, pageType }),
  });

  return (
    <div className={wrapClass}>
      <div className="mb-2">
        <div className="text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Amazon</div>
        <div className={gridClass}>
          <a href={links.amazonKindle} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("amazon-kindle", true)} {...pressHandlers("amazon-kindle")} {...clickHandlers("amazon", "kindle")}>
            Kindle
          </a>
          <a href={links.amazonPaper} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("amazon-paper")} {...pressHandlers("amazon-paper")} {...clickHandlers("amazon", "paper")}>
            {labels.comic}
          </a>
        </div>
      </div>

      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Rakuten</div>
        <div className={gridClass}>
          <a href={links.rakutenSet} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("rakuten-set", true)} {...pressHandlers("rakuten-set")} {...clickHandlers("rakuten", "set")}>
            {labels.fullSet}
          </a>
          <a href={links.rakutenBooks} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("rakuten-books")} {...pressHandlers("rakuten-books")} {...clickHandlers("rakuten", "books")}>
            {labels.rakutenBooks}
          </a>
        </div>
      </div>
    </div>
  );
}
