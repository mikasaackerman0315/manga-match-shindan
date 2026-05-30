"use client";

import { useEffect, useState } from "react";

export default function MangaCover({ title, id, author, size = "medium" }) {
  const [cover, setCover] = useState({ loading: true, imageUrl: null, itemUrl: null });
  const encodedTitle = encodeURIComponent(title || "");
  const encodedId = encodeURIComponent(id || "");
  const encodedAuthor = encodeURIComponent(author || "");
  const frameClass = size === "small" ? "w-14 h-20" : size === "large" ? "w-28 h-40 md:w-32 md:h-48" : "w-20 h-28 md:w-24 md:h-36";

  useEffect(() => {
    let active = true;

    if (!title) {
      setCover({ loading: false, imageUrl: null, itemUrl: null });
      return () => {
        active = false;
      };
    }

    setCover({ loading: true, imageUrl: null, itemUrl: null });
    fetch(`/api/cover?title=${encodedTitle}&id=${encodedId}&author=${encodedAuthor}`)
      .then((response) => response.json())
      .then((data) => {
        if (active) setCover({ loading: false, imageUrl: data.imageUrl || null, itemUrl: data.itemUrl || null });
      })
      .catch(() => {
        if (active) setCover({ loading: false, imageUrl: null, itemUrl: null });
      });

    return () => {
      active = false;
    };
  }, [encodedAuthor, encodedId, encodedTitle, title]);

  if (!cover.loading && !cover.imageUrl) {
    return null;
  }

  const image = (
    <div className={`${frameClass} shrink-0 overflow-hidden`} style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)", boxShadow: "0 8px 18px rgba(10,10,10,0.08)" }}>
      {cover.imageUrl ? (
        <img src={cover.imageUrl} alt={`${title} 表紙`} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-full w-full animate-pulse" style={{ backgroundColor: "rgba(10,10,10,0.08)" }} />
      )}
    </div>
  );

  if (!cover.itemUrl) return image;

  return (
    <a href={cover.itemUrl} target="_blank" rel="noopener noreferrer sponsored" aria-label={`${title}の楽天ブックス商品ページを開く`} className="inline-block transition-all hover:translate-y-[-1px] active:scale-95">
      {image}
    </a>
  );
}
