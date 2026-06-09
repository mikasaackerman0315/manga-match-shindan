"use client";

import { useMemo, useState } from "react";
import StoreLinks from "../StoreLinks";
import MangaCover from "../../components/MangaCover";
import { getMangaCoverForItem } from "../../data/mangaCovers";

const statusLabel = {
  completed: "完結",
  ongoing: "連載中",
  hiatus: "休載中",
};

function normalizeText(value) {
  return `${value || ""}`.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function SearchResultCard({ manga }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en || manga.id;
  const description = manga.desc_ja || manga.desc_en || "";

  return (
    <article className="group relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-4 transition-all hover:translate-y-[-2px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
      <a href={`/manga/${manga.id}`} className="absolute inset-0 z-0" aria-label={`${title}の詳細ページを見る`} />
      <div className="relative z-10 pointer-events-none">
        <MangaCover
          title={title}
          mangaId={manga.id}
          author={manga.author}
          coverImageUrl={cover?.coverImageUrl}
          coverProductUrl={cover?.coverProductUrl}
          coverImageSource={cover?.coverImageSource}
          verified={cover?.coverImageVerified}
          size="medium"
          pageType="seo_article"
        />
      </div>
      <div className="relative z-10 min-w-0 pointer-events-none">
        <h3 className="text-xl md:text-2xl font-semibold leading-snug transition-colors group-hover:text-[#c0392b]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
          {title}
        </h3>
        <p className="mt-1 text-xs leading-5" style={{ color: "#666" }}>
          {manga.author} / {manga.year || "年不明"} / {statusLabel[manga.status] || manga.status}
          {manga.volumes ? ` / ${manga.volumes}巻` : ""}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: "#333" }}>{description}</p>
        <div className="pointer-events-auto relative z-20">
          <StoreLinks title={title} compact pageType="seo_article" />
        </div>
      </div>
    </article>
  );
}

export default function MangaSearch({ items = [] }) {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    const normalizedQuery = normalizeText(trimmedQuery);
    if (!normalizedQuery) return [];

    return items
      .map((manga) => {
        const titleJa = normalizeText(manga.title_ja);
        const titleEn = normalizeText(manga.title_en);
        const author = normalizeText(manga.author);
        const desc = normalizeText(`${manga.desc_ja || ""} ${manga.desc_en || ""}`);
        let score = 0;
        if (titleJa === normalizedQuery || titleEn === normalizedQuery) score += 100;
        if (titleJa.includes(normalizedQuery) || titleEn.includes(normalizedQuery)) score += 50;
        if (author.includes(normalizedQuery)) score += 25;
        if (desc.includes(normalizedQuery)) score += 8;
        return { manga, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || (a.manga.year || 9999) - (b.manga.year || 9999))
      .slice(0, 30)
      .map((item) => item.manga);
  }, [items, trimmedQuery]);

  return (
    <section className="mt-8" aria-label="漫画検索">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="mb-2 block text-xs tracking-[0.24em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
            Search
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="作品名・作者名で検索"
            className="w-full px-4 py-3 text-base outline-none"
            style={{
              border: "1px solid rgba(10,10,10,0.18)",
              backgroundColor: "rgba(245,243,238,0.9)",
              color: "#0a0a0a",
              fontFamily: "'Noto Serif JP', serif",
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => setQuery("")}
          className="self-end px-4 py-3 text-xs tracking-[0.18em] uppercase transition-all hover:translate-y-[-1px]"
          style={{ border: "1px solid rgba(10,10,10,0.18)", color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
        >
          Clear
        </button>
      </div>

      {trimmedQuery && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs" style={{ color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>
            <span>{results.length} results</span>
            <span>MAX 30</span>
          </div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {results.map((manga) => (
                <SearchResultCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="p-5 text-sm leading-7" style={{ border: "1px solid rgba(10,10,10,0.12)", color: "#555" }}>
              該当する漫画が見つかりませんでした。表記を短くしてもう一度検索してみてください。
            </div>
          )}
        </div>
      )}
    </section>
  );
}
