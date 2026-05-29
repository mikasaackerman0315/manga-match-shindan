"use client";

import { useEffect, useRef, useState } from "react";

function makeLinks(title) {
  const query = encodeURIComponent(title || "");
  return {
    preview: `/api/out?store=ebookjapan&intent=preview&title=${query}`,
    kindle: `/api/out?store=amazon&intent=kindle&title=${query}`,
    paper: `/api/out?store=amazon&intent=paper&title=${query}`,
    rakuten: `/api/out?store=rakuten&intent=store&title=${query}`,
  };
}

export default function StoreLinks({ title, labels, compact = false, showHeading = false, showPreview = true }) {
  const [amazonOpen, setAmazonOpen] = useState(false);
  const [pressed, setPressed] = useState("");
  const rootRef = useRef(null);
  const links = makeLinks(title);
  const label = {
    buyLinks: "読む・探す",
    preview: "試し読み",
    amazon: "Amazon",
    kindle: "Kindle",
    paper: "紙の本",
    rakuten: "楽天",
    ...labels,
  };

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setAmazonOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  const baseClass = compact
    ? "text-[10px] px-2 py-1 transition-all hover:translate-y-[-1px] active:scale-95"
    : "text-[11px] px-3 py-1.5 tracking-[0.12em] uppercase transition-all hover:translate-y-[-1px] active:scale-95";
  const baseStyle = (key, accent = false) => ({
    border: "1px solid rgba(10,10,10,0.18)",
    color: accent ? "#c0392b" : "#0a0a0a",
    backgroundColor: pressed === key ? "rgba(192,57,43,0.12)" : "rgba(245,243,238,0.55)",
    fontFamily: "'JetBrains Mono', monospace",
  });
  const pressHandlers = (key) => ({
    onPointerDown: () => setPressed(key),
    onPointerUp: () => setPressed(""),
    onPointerCancel: () => setPressed(""),
    onPointerLeave: () => setPressed(""),
  });

  return (
    <div ref={rootRef} className={compact ? "mt-2 flex flex-wrap gap-1.5" : "mt-5"}>
      {showHeading && (
        <div className="w-full text-[10px] tracking-[0.25em] mb-2 uppercase" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
          {label.buyLinks}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {showPreview && (
          <a href={links.preview} target="_blank" rel="noopener noreferrer sponsored" className={baseClass} style={baseStyle("preview", true)} {...pressHandlers("preview")}>
            {label.preview}
          </a>
        )}
        <div className="relative">
          <button type="button" className={`${baseClass} cursor-pointer`} style={baseStyle("amazon")} onClick={() => setAmazonOpen((value) => !value)} {...pressHandlers("amazon")}>
            {label.amazon}
          </button>
          {amazonOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[7rem] p-1" style={{ border: "1px solid rgba(10,10,10,0.18)", backgroundColor: "#f5f3ee", boxShadow: "0 10px 24px rgba(10,10,10,0.12)" }}>
              <a href={links.kindle} target="_blank" rel="noopener noreferrer sponsored" className="block whitespace-nowrap px-3 py-2 text-[11px] tracking-[0.12em] uppercase hover:text-[#c0392b] active:bg-[rgba(192,57,43,0.12)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {label.kindle}
              </a>
              <a href={links.paper} target="_blank" rel="noopener noreferrer sponsored" className="block whitespace-nowrap px-3 py-2 text-[11px] tracking-[0.12em] uppercase hover:text-[#c0392b] active:bg-[rgba(192,57,43,0.12)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {label.paper}
              </a>
            </div>
          )}
        </div>
        <a href={links.rakuten} target="_blank" rel="noopener noreferrer sponsored" className={baseClass} style={baseStyle("rakuten")} {...pressHandlers("rakuten")}>
          {label.rakuten}
        </a>
      </div>
    </div>
  );
}
