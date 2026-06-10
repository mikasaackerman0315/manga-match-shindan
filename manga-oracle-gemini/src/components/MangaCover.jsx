"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const sizeClasses = {
  small: "w-[56px] md:w-[68px]",
  medium: "w-[86px] md:w-[108px]",
  large: "w-[116px] md:w-[148px]",
  result: "w-[124px] md:w-[160px]",
  hero: "w-[148px] md:w-[190px]",
  loading: "w-[168px] md:w-[220px]",
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
        {title || "表紙未掲載"}
      </div>
    </div>
  );
}

export default function MangaCover({
  title,
  mangaId,
  author,
  coverImageUrl,
  coverProductUrl,
  coverImageSource,
  verified = false,
  className = "",
  size = "medium",
  pageType = "other",
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackCover, setFallbackCover] = useState(null);
  const dynamicCoverImageUrl = coverImageUrl || fallbackCover?.imageUrl || "";
  const dynamicCoverProductUrl = coverProductUrl || fallbackCover?.itemUrl || "";
  const dynamicCoverSource = coverImageSource || fallbackCover?.source || "unknown";
  const dynamicVerified = Boolean(verified || fallbackCover?.imageUrl);
  const hasImage = Boolean(dynamicCoverImageUrl) && !imageFailed;
  const rel = "nofollow sponsored noopener noreferrer";
  const widthClass = sizeClasses[size] || sizeClasses.medium;

  useEffect(() => {
    setImageFailed(false);
  }, [dynamicCoverImageUrl]);

  useEffect(() => {
    if (coverImageUrl || !title) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ title });
    params.set("coverSearch", "title_volume_one_v2");
    if (mangaId) params.set("id", mangaId);
    if (author) params.set("author", author);

    fetch(`/api/cover?${params.toString()}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.imageUrl) return;
        setFallbackCover({
          imageUrl: data.imageUrl,
          itemUrl: data.itemUrl || "",
          source: data.coverSource || "api",
        });
      })
      .catch(() => {});

    return () => controller.abort();
  }, [author, coverImageUrl, mangaId, title]);

  const handleCoverClick = () => {
    trackEvent("cover_click", {
      title: title || "",
      source: dynamicCoverSource,
      page_type: pageType,
      verified: dynamicVerified,
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
          src={dynamicCoverImageUrl}
          alt={`${title || "漫画"} 1巻表紙`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <Placeholder title={title} />
      )}
      {dynamicVerified && hasImage && (
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[9px]"
          style={{ backgroundColor: "rgba(10,10,10,0.72)", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}
        >
          OK
        </span>
      )}
    </div>
  );

  if (dynamicCoverProductUrl && hasImage) {
    return (
      <a
        href={dynamicCoverProductUrl}
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
