"use client";

import { useState } from "react";
import { trackEvent } from "./analytics";

function makeLinks(title) {
  const query = encodeURIComponent(title || "");
  return {
    preview: `/api/out?store=ebookjapan&intent=preview&title=${query}`,
    amazonKindle: `/api/out?store=amazon&intent=kindle&title=${query}`,
    amazonPaper: `/api/out?store=amazon&intent=paper&title=${query}`,
    amazonSearch: `/api/out?store=amazon&intent=search&title=${query}`,
    rakutenSet: `/api/out?store=rakuten&intent=set&title=${query}`,
    rakutenBooks: `/api/out?store=rakuten&intent=books&title=${query}`,
  };
}

function trackAffiliateClick({ title, store, intent, pageType }) {
  if (store === "amazon") {
    trackEvent("affiliate_click_amazon", {
      title: title || "",
      link_type: intent === "paper" ? "paper" : intent === "kindle" ? "kindle" : "search",
      page_type: pageType,
    });
    return;
  }

  if (store === "rakuten") {
    trackEvent("affiliate_click_rakuten", {
      title: title || "",
      link_type: intent === "set" ? "set" : intent === "books" ? "books" : "search",
      page_type: pageType,
    });
  }
}

export default function StoreLinks({ title, labels, compact = false, showHeading = false, showPreview = true, pageType = "diagnosis_result" }) {
  const [pressed, setPressed] = useState("");
  const links = makeLinks(title);
  const label = {
    ...labels,
    buyLinks: "購入・検索する",
    preview: "試し読みを探す",
    amazonKindle: "Kindleで今すぐ読む",
    amazonPaper: "Amazonで紙の本を探す",
    amazonSearch: "Amazonで関連商品を探す",
    rakutenSet: "楽天で全巻・ポイント還元を見る",
    rakutenBooks: "楽天ブックスで探す",
    amazonNote: "電子書籍ならすぐ読めます。紙の本や関連商品も探せます。",
    rakutenNote: "紙の本や全巻セット、ポイント還元をリンク先で確認できます。",
    priceNote: "価格や在庫はリンク先で確認してください。",
  };

  const wrapClass = compact
    ? "mt-3 w-full"
    : "mt-5 w-full p-4";
  const wrapStyle = compact ? {} : {
    border: "1px solid rgba(10,10,10,0.14)",
    backgroundColor: "rgba(245,243,238,0.62)",
  };
  const gridClass = compact
    ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2";
  const buttonClass = compact
    ? "min-h-[42px] px-3 py-2 text-[11px] leading-snug text-center transition-all hover:translate-y-[-1px] active:scale-[0.98]"
    : "min-h-[46px] px-4 py-3 text-[12px] leading-snug text-center tracking-[0.08em] transition-all hover:translate-y-[-1px] active:scale-[0.98]";
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
  const rel = "nofollow sponsored noopener noreferrer";

  return (
    <div className={wrapClass} style={wrapStyle}>
      {showHeading && (
        <>
          <div className="w-full text-[10px] tracking-[0.25em] mb-2 uppercase" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
            {label.buyLinks}
          </div>
          <p className="w-full text-xs leading-6 mb-3" style={{ color: "#666" }}>{label.priceNote}</p>
        </>
      )}

      <div className="mb-3">
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Amazon</div>
        <div className={gridClass}>
          <a href={links.amazonKindle} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("amazon-kindle", true)} {...pressHandlers("amazon-kindle")} {...clickHandlers("amazon", "kindle")}>
            {label.amazonKindle}
          </a>
          <a href={links.amazonPaper} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("amazon-paper")} {...pressHandlers("amazon-paper")} {...clickHandlers("amazon", "paper")}>
            {label.amazonPaper}
          </a>
          <a href={links.amazonSearch} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("amazon-search")} {...pressHandlers("amazon-search")} {...clickHandlers("amazon", "search")}>
            {label.amazonSearch}
          </a>
        </div>
        <p className="mt-2 text-[11px] leading-5" style={{ color: "#777" }}>{label.amazonNote}</p>
      </div>

      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Rakuten</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a href={links.rakutenSet} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("rakuten-set", true)} {...pressHandlers("rakuten-set")} {...clickHandlers("rakuten", "set")}>
            {label.rakutenSet}
          </a>
          <a href={links.rakutenBooks} target="_blank" rel={rel} className={buttonClass} style={buttonStyle("rakuten-books")} {...pressHandlers("rakuten-books")} {...clickHandlers("rakuten", "books")}>
            {label.rakutenBooks}
          </a>
        </div>
        <p className="mt-2 text-[11px] leading-5" style={{ color: "#777" }}>{label.rakutenNote}</p>
      </div>

      {showPreview && (
        <a href={links.preview} target="_blank" rel={rel} className={`${buttonClass} mt-3 w-full`} style={buttonStyle("preview")} {...pressHandlers("preview")}>
          {label.preview}
        </a>
      )}
    </div>
  );
}
