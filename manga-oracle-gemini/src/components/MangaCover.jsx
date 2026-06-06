"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

const sizeClasses = {
  small: "w-[42px] md:w-[50px]",
  medium: "w-[74px] md:w-[92px]",
  large: "w-[96px] md:w-[124px]",
};

function Placeholder({ title }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center px-2 text-center"
      style={{
        backgroundColor: "rgba(10,10,10,0.035)",
        color: "#777",
        border: "1px solid rgba(10,10,10,0.12)",
      }}
    >
      <div
        className="mb-2 h-5 w-8"
        style={{
          borderTop: "2px solid rgba(10,10,10,0.28)",
          borderBottom: "2px solid rgba(10,10,10,0.18)",
        }}
      />
      <div className="line-clamp-3 text-[10px] leading-4 md:text-[11px]" style={{ fontFamily: "'Noto Serif JP', serif" }}>
        {title || "表紙準備中"}
      </div>
    </div>
  );
}

export default function MangaCover({
  title,
  coverImageUrl,
  coverProductUrl,
  coverImageSource,
  verified = false,
  className = "",
  size = "medium",
  pageType = "other",
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(coverImageUrl) && !imageFailed;
  const rel = "nofollow sponsored noopener noreferrer";
  const widthClass = sizeClasses[size] || sizeClasses.medium;

  const handleCoverClick = () => {
    trackEvent("cover_click", {
      title: title || "",
      source: coverImageSource || "unknown",
      page_type: pageType,
      verified: Boolean(verified),
    });
  };

  const coverBody = (
    <div
      className={`relative aspect-[2/3] ${widthClass} shrink-0 overflow-hidden rounded-[6px] ${className}`}
      style={{
        backgroundColor: "#ebe7de",
        boxShadow: "0 8px 18px rgba(10,10,10,0.08)",
      }}
    >
      {hasImage ? (
        <img
          src={coverImageUrl}
          alt={`${title || "漫画"} 1巻表紙`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Placeholder title={title} />
      )}
      {verified && hasImage && (
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px]"
          style={{ backgroundColor: "rgba(10,10,10,0.72)", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}
        >
          OK
        </span>
      )}
    </div>
  );

  if (coverProductUrl && hasImage) {
    return (
      <a
        href={coverProductUrl}
        target="_blank"
        rel={rel}
        aria-label={`${title || "漫画"} 1巻表紙の商品ページを開く`}
        className="inline-block"
        onClick={handleCoverClick}
      >
        {coverBody}
      </a>
    );
  }

  return coverBody;
}
