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
  school: "学園",
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
  comedy_gag: "ギャグ",
  social: "社会派",
  warm: "温かい",
  brutal: "重め",
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

function SparkIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z" />
    </svg>
  );
}

function SearchResultCard({ manga }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en || manga.id;
  const description = manga.desc_ja || manga.desc_en || "";
  const tags = (manga.tags || []).slice(0, 3).map((tag) => tagLabels[tag]).filter(Boolean);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-black/10 bg-white/88 p-4 shadow-[0_14px_34px_rgba(10,10,10,0.035)] transition-shadow hover:shadow-[0_18px_40px_rgba(10,10,10,0.06)]">
      <a href={`/manga/${manga.id}`} className="absolute inset-0 z-0" aria-label={`${title}の詳細を見る`} />
      <div className="pointer-events-none relative z-10 flex gap-4">
        <MangaCover
          title={title}
          mangaId={manga.id}
          author={manga.author}
          coverImageUrl={cover?.coverImageUrl}
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
      <div className="pointer-events-auto relative z-20 mt-4 grid grid-cols-2 gap-2">
        <WatchLaterButton item={manga} sourceContext="漫画検索" compact className="justify-center" />
        <a href={`/manga/${manga.id}`} className="flex min-h-[34px] items-center justify-center rounded-md bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-black text-[#fffdf9] transition hover:bg-[#c0392b]">
          詳しく見る
        </a>
      </div>
    </article>
  );
}

export default function MangaSearch({ items = [] }) {
  const [mode, setMode] = useState("keyword");
  const [query, setQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [aiReason, setAiReason] = useState("");
  const [aiUsed, setAiUsed] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const trimmedQuery = query.trim();
  const isAiMode = mode === "ai";

  const keywordResults = useMemo(() => {
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

  async function runAiSearch() {
    if (!trimmedQuery || aiLoading) return;
    setAiLoading(true);
    setAiError("");
    setAiReason("");
    setAiUsed(false);

    try {
      const response = await fetch("/api/manga-ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmedQuery }),
      });
      if (!response.ok) throw new Error("search_failed");
      const data = await response.json();
      setAiResults(Array.isArray(data.results) ? data.results : []);
      setAiReason(data.reason || "");
      setAiUsed(Boolean(data.aiUsed));
    } catch {
      setAiResults([]);
      setAiError("AI検索に失敗しました。少し言い換えてもう一度試してください。");
    } finally {
      setAiLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isAiMode) runAiSearch();
  }

  function clearSearch() {
    setQuery("");
    setAiResults([]);
    setAiReason("");
    setAiError("");
    setAiUsed(false);
  }

  const results = isAiMode ? aiResults : keywordResults;
  const shouldShowResults = isAiMode ? Boolean(aiResults.length || aiReason || aiError) : Boolean(trimmedQuery);

  return (
    <section aria-label="漫画検索">
      <div className="mb-4 inline-flex rounded-full border border-black/10 bg-white p-1 text-xs font-black shadow-[0_10px_24px_rgba(10,10,10,0.04)]">
        <button
          type="button"
          onClick={() => setMode("keyword")}
          className={`rounded-full px-4 py-2 transition ${!isAiMode ? "bg-[#0a0a0a] text-[#fffdf9]" : "text-black/58 hover:text-[#c0392b]"}`}
        >
          作品名・作者名
        </button>
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`rounded-full px-4 py-2 transition ${isAiMode ? "bg-[#c0392b] text-white" : "text-black/58 hover:text-[#c0392b]"}`}
        >
          AIで探す
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <label className="relative block">
          <span className="sr-only">{isAiMode ? "AIに探してほしい漫画の雰囲気を入力" : "作品名・作者名で検索"}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isAiMode ? "例：面白いやつ、鬱すぎないバトル、短く読める名作" : "作品名・作者名で検索"}
            className="h-12 w-full rounded-md border border-black/12 bg-white/90 px-4 pr-12 text-base outline-none transition focus:border-[#c0392b]"
            style={{ fontFamily: "'Noto Serif JP', serif" }}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/52">
            {isAiMode ? <SparkIcon /> : <SearchIcon />}
          </span>
        </label>
        {isAiMode && (
          <button
            type="submit"
            disabled={aiLoading || !trimmedQuery}
            className="h-12 rounded-md bg-[#c0392b] px-6 text-sm font-black text-white transition hover:bg-[#a93226] disabled:cursor-not-allowed disabled:bg-black/20"
          >
            {aiLoading ? "検索中..." : "AIで検索"}
          </button>
        )}
        <button
          type="button"
          onClick={clearSearch}
          className="h-12 rounded-md border border-black/12 bg-white px-5 text-sm font-black transition hover:border-[#c0392b] hover:text-[#c0392b]"
        >
          クリア
        </button>
      </form>

      {isAiMode && (
        <p className="mt-3 text-xs font-semibold leading-6 text-black/50">
          「面白いやつ」「怖すぎないホラー」「社会人向け」みたいな曖昧な言葉でも探せます。診断結果には影響しません。
        </p>
      )}

      {shouldShowResults && (
        <div className="mt-5 rounded-xl border border-[#e8d6c8] bg-[#fffaf2] p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-black/55">
            <span>{isAiMode ? "AI検索結果" : "検索結果"}: {results.length}件</span>
            <span>{isAiMode ? (aiUsed ? "Geminiで候補を選定" : "タグ検索で候補を選定") : "最大30件"}</span>
          </div>
          {aiReason && (
            <div className="mb-4 rounded-lg border border-[#c0392b]/14 bg-white px-4 py-3 text-sm font-semibold leading-7 text-black/64">
              {aiReason}
            </div>
          )}
          {aiError ? (
            <div className="rounded-lg border border-[#c0392b]/18 bg-white p-5 text-sm leading-7 text-[#c0392b]">
              {aiError}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((manga) => (
                <SearchResultCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-black/10 bg-white p-5 text-sm leading-7 text-black/62">
              該当する漫画が見つかりませんでした。作品名を短くするか、雰囲気を少し変えて検索してみてください。
            </div>
          )}
        </div>
      )}
    </section>
  );
}
