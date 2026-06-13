"use client";

import { useMemo, useState } from "react";
import MangaCover from "../../components/MangaCover";
import WatchLaterButton from "../../components/WatchLaterButton";
import { getMangaCoverForItem } from "../../data/mangaCovers";

const statusLabel = {
  completed: "完結済み",
  ongoing: "連載中",
  hiatus: "休載中",
};

const tagLabels = {
  fantasy: "ファンタジー",
  battle: "バトル",
  romance: "恋愛",
  mystery: "ミステリー",
  sports: "スポーツ",
  horror: "ホラー",
  dark: "ダーク",
  emotional: "感情描写",
  healing: "癒し",
  school: "青春",
  workplace: "仕事",
  human_drama: "人間ドラマ",
  action: "アクション",
  suspense: "サスペンス",
  psychological: "心理",
  sci_fi: "SF",
  historical: "歴史",
  slice_of_life: "日常",
  self_discovery: "成長",
  worldbuilding: "世界観",
};

function normalizeText(value) {
  return `${value || ""}`.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function SearchResultCard({ manga }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en || manga.id;
  const description = manga.desc_ja || manga.desc_en || "";
  const tags = (manga.tags || []).slice(0, 3).map((tag) => tagLabels[tag]).filter(Boolean);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-black/10 bg-white/88 p-4 shadow-[0_14px_34px_rgba(10,10,10,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(10,10,10,0.06)]">
      <a href={`/manga/${manga.id}`} className="absolute inset-0 z-0" aria-label={`${title}の詳細を見る`} />
      <div className="relative z-10 flex gap-4 pointer-events-none">
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
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-black leading-snug transition-colors group-hover:text-[#c0392b]" style={{ fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif" }}>
            {title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] font-bold text-black/48">
            {manga.author} / {manga.year || "年不明"} / {statusLabel[manga.status] || manga.status || "不明"}
            {manga.volumes ? ` / ${manga.volumes}巻` : ""}
          </p>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="rounded border border-black/8 bg-[#f3f0e9] px-2 py-1 text-[10px] font-bold text-black/58">{tag}</span>
              ))}
            </div>
          )}
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-black/68">{description}</p>
        </div>
      </div>
      <div className="relative z-20 mt-4 grid grid-cols-2 gap-2 pointer-events-auto">
        <WatchLaterButton item={manga} sourceContext="漫画検索" compact className="justify-center" />
        <a href={`/manga/${manga.id}`} className="flex min-h-[34px] items-center justify-center rounded-md bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-black text-[#fffdf9] transition hover:bg-[#c0392b]">
          詳しく見る
        </a>
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
    <section aria-label="漫画検索">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="relative block">
          <span className="sr-only">作品名・作者名で検索</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="作品名・作者名で検索"
            className="h-12 w-full rounded-md border border-black/12 bg-white/90 px-4 pr-12 text-base outline-none transition focus:border-[#c0392b]"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/52">
            <SearchIcon />
          </span>
        </label>
        <button
          type="button"
          onClick={() => setQuery("")}
          className="h-12 rounded-md border border-black/12 bg-white px-5 text-sm font-black transition hover:border-[#c0392b] hover:text-[#c0392b]"
        >
          検索をクリア
        </button>
      </div>

      {trimmedQuery && (
        <div className="mt-5 rounded-xl border border-[#e8d6c8] bg-[#fffaf2] p-4">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold text-black/55">
            <span>検索結果: {results.length}件</span>
            <span>最大30件</span>
          </div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((manga) => (
                <SearchResultCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-black/10 bg-white p-5 text-sm leading-7 text-black/62">
              該当する漫画が見つかりませんでした。作品名を短くするか、作者名で検索してみてください。
            </div>
          )}
        </div>
      )}
    </section>
  );
}
