"use client";

import { useEffect, useMemo, useState } from "react";
import MangaCover from "../../components/MangaCover";
import StoreLinks from "../StoreLinks";
import { readWatchLaterItems, removeWatchLaterItem, WATCH_LATER_EVENT } from "@/lib/watchLater";

const browseSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const browseSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/?start=1", label: "診断する" },
  { href: "/manga", label: "漫画を探す" },
  { href: "/themes", label: "テーマから探す" },
  { href: "/trending-manga", label: "ランキング" },
  { href: "/watchlist", label: "保存リスト", active: true },
  { href: "/?start=1", label: "好みプロフィール" },
];

function statusLabel(status) {
  if (status === "completed") return "完結";
  if (status === "ongoing") return "連載中";
  if (status === "hiatus") return "休載中";
  return "";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function sortByAdded(items) {
  return [...items].sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
}

function LogoMark() {
  return (
    <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M14 18.5c4.1 0 7 .9 10 3.3 3-2.4 5.9-3.3 10-3.3v12.7c-4.1 0-7 .9-10 3.3-3-2.4-5.9-3.3-10-3.3V18.5Z" fill="#0a0a0a" />
      <path d="M24 21.8v12.7" stroke="#f5f3ee" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function UserIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c1.5-4 4-6 7.5-6s6 2 7.5 6" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4.5h12v16l-6-3.8-6 3.8Z" />
    </svg>
  );
}

function WatchlistHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: "rgba(10,10,10,0.1)", backgroundColor: "rgba(245,243,238,0.92)", backdropFilter: "blur(18px)" }}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-2 md:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <div className="whitespace-nowrap text-base font-extrabold tracking-[0.01em] md:text-xl" style={{ fontFamily: browseSans }}>マンガマッチ診断</div>
            <div className="hidden text-[11px] font-semibold md:block" style={{ color: "#555", fontFamily: browseSans }}>あなたにぴったりの漫画が見つかる</div>
          </div>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-bold lg:flex" style={{ fontFamily: browseSans }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={`relative pb-2 transition-colors hover:text-[#c0392b] ${item.active ? "text-[#c0392b]" : ""}`}>
              {item.label}
              {item.active && <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#c0392b]" />}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-start gap-3">
          <a href="/manga" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="検索">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <SearchIcon />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">検索</span>
          </a>
          <a href="/watchlist" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="マイページ">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#c0392b]/30 bg-white/70 text-[#c0392b]">
              <UserIcon />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">マイページ</span>
          </a>
          <div className="hidden gap-1 pt-1 md:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="px-2 py-1 text-[10px]" style={{ border: "1px solid #0a0a0a", backgroundColor: "#0a0a0a", color: "#f5f3ee" }}>JA</span>
            <span className="px-2 py-1 text-[10px]" style={{ border: "1px solid #0a0a0a", color: "#0a0a0a" }}>EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function MangaWatchCard({ item }) {
  const title = item.title_ja || item.title_en || item.title || "";

  return (
    <article className="flex min-h-full gap-4 rounded-[10px] border border-black/10 bg-white p-4 shadow-[0_12px_34px_rgba(10,10,10,0.055)] md:gap-5 md:p-5">
      <MangaCover title={title} mangaId={item.id} author={item.author} coverImageUrl={item.coverImageUrl} size="large" pageType="watchlist" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-xl font-black leading-tight md:text-2xl" style={{ fontFamily: browseSerif }}>{title}</h2>
            <div className="mt-2 text-xs font-semibold leading-6 text-black/52">
              {[item.author, item.year, statusLabel(item.status), item.themeLabel].filter(Boolean).join(" / ")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeWatchLaterItem(item.id)}
            className="group grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c0392b]/24 bg-[#c0392b]/6 text-[#c0392b] transition-colors hover:border-[#c0392b] hover:bg-[#c0392b] hover:text-white"
            aria-label={`${title}を保存リストから外す`}
            title="保存リストから外す"
          >
            <BookmarkIcon />
          </button>
        </div>
        {item.description && (
          <p className="mb-3 line-clamp-3 text-sm font-medium leading-7 text-black/68">{item.description}</p>
        )}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {item.sourceContext && <span className="rounded-full border border-black/10 bg-[#f8f6f1] px-2 py-1 text-black/50">{item.sourceContext}</span>}
          {item.addedAt && <span className="rounded-full border border-black/10 bg-[#f8f6f1] px-2 py-1 text-black/50">保存: {formatDate(item.addedAt)}</span>}
        </div>
        <div className="mt-auto">
          <StoreLinks title={title} compact pageType="watchlist" />
        </div>
      </div>
    </article>
  );
}

export default function WatchlistClient() {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("added");
  const [selectedThemeKey, setSelectedThemeKey] = useState("");

  useEffect(() => {
    const sync = () => setItems(readWatchLaterItems());
    sync();
    window.addEventListener(WATCH_LATER_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(WATCH_LATER_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const themeGroups = useMemo(() => {
    const groups = new Map();
    items.forEach((item) => {
      const key = item.themeKey || "other";
      const label = item.themeLabel || "その他";
      if (!groups.has(key)) groups.set(key, { key, label, items: [] });
      groups.get(key).items.push(item);
    });

    return Array.from(groups.values())
      .map((group) => ({ ...group, items: sortByAdded(group.items) }))
      .sort((a, b) => a.label.localeCompare(b.label, "ja"));
  }, [items]);

  const selectedTheme = themeGroups.find((group) => group.key === selectedThemeKey);

  useEffect(() => {
    if (viewMode !== "theme") return;
    if (!selectedThemeKey) return;
    if (!themeGroups.some((group) => group.key === selectedThemeKey)) setSelectedThemeKey("");
  }, [selectedThemeKey, themeGroups, viewMode]);

  const visibleItems = viewMode === "theme"
    ? selectedTheme?.items || []
    : sortByAdded(items);

  const hasItems = items.length > 0;
  const latestSaved = sortByAdded(items)[0];

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#0a0a0a]" style={{ fontFamily: browseSans }}>
      <WatchlistHeader />
      <div className="mx-auto max-w-[1440px] px-4 pb-14 md:px-8">
        <section className="grid gap-6 py-8 md:grid-cols-[0.62fr_0.38fr] md:py-10">
          <div className="rounded-[14px] border border-black/10 bg-white/70 p-6 shadow-[0_18px_50px_rgba(10,10,10,0.05)] md:p-8">
            <div className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Saved Manga
            </div>
            <h1 className="text-4xl font-black leading-tight md:text-6xl" style={{ fontFamily: browseSerif }}>
              保存リスト
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-8 text-black/64 md:text-base">
              診断中や診断結果で気になった漫画を、あとからまとめて見返せます。追加順で眺めたり、テーマ別に絞り込んだりできます。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                ["added", "追加順"],
                ["theme", "テーマ別"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setViewMode(key);
                    if (key === "added") setSelectedThemeKey("");
                  }}
                  className={`h-12 rounded-[6px] border px-6 text-sm font-black transition-colors ${viewMode === key ? "border-[#c0392b] bg-[#c0392b] text-white shadow-[0_12px_24px_rgba(192,57,43,0.18)]" : "border-black/12 bg-white text-[#0a0a0a] hover:border-[#c0392b]/35 hover:text-[#c0392b]"}`}
                >
                  {label}
                </button>
              ))}
              <a href="/manga" className="flex h-12 items-center rounded-[6px] border border-black/12 bg-white px-6 text-sm font-black transition-colors hover:border-[#c0392b]/35 hover:text-[#c0392b]">
                漫画を探す →
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-[14px] border border-black/10 bg-white/70 p-5 shadow-[0_18px_50px_rgba(10,10,10,0.05)]">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[10px] border border-black/8 bg-[#fffdf9] p-4">
                <div className="text-xs font-bold text-black/50">保存数</div>
                <div className="mt-2 text-4xl font-black text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{items.length}</div>
              </div>
              <div className="rounded-[10px] border border-black/8 bg-[#fffdf9] p-4">
                <div className="text-xs font-bold text-black/50">テーマ</div>
                <div className="mt-2 text-4xl font-black" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{themeGroups.length}</div>
              </div>
            </div>
            <div className="rounded-[10px] border border-[#c0392b]/14 bg-[#fff8f6] p-4">
              <div className="text-xs font-bold text-[#c0392b]">最近保存した作品</div>
              <div className="mt-2 line-clamp-2 text-lg font-black">{latestSaved ? (latestSaved.title_ja || latestSaved.title_en || latestSaved.title) : "まだありません"}</div>
              {latestSaved?.addedAt && <div className="mt-1 text-xs font-semibold text-black/45">{formatDate(latestSaved.addedAt)}</div>}
            </div>
          </div>
        </section>

        {!hasItems ? (
          <section className="rounded-[14px] border border-black/10 bg-white/72 px-6 py-14 text-center shadow-[0_18px_50px_rgba(10,10,10,0.05)]">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-[#c0392b]/18 bg-[#c0392b]/6 text-[#c0392b]">
              <BookmarkIcon className="h-9 w-9" />
            </div>
            <h2 className="text-2xl font-black md:text-3xl" style={{ fontFamily: browseSerif }}>まだ保存した漫画がありません</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-8 text-black/60">診断中や診断結果に出てくる保存ボタンから追加できます。気になった作品を残しておくと、あとから読み返しやすくなります。</p>
            <a href="/?start=1" className="mt-7 inline-flex h-12 min-w-[220px] items-center justify-center rounded-[6px] bg-[#c0392b] px-7 text-sm font-black text-white shadow-[0_12px_24px_rgba(192,57,43,0.2)] transition-colors hover:bg-[#a92f23]">
              診断を始める →
            </a>
          </section>
        ) : (
          <>
            {viewMode === "theme" && (
              <section className="mb-6 rounded-[14px] border border-black/10 bg-white/72 p-5 shadow-[0_14px_38px_rgba(10,10,10,0.045)] md:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-5 w-1.5 rounded-full bg-[#c0392b]" />
                  <h2 className="text-xl font-black">テーマ別に絞り込む</h2>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
                  {themeGroups.map((group) => (
                    <button
                      key={group.key}
                      type="button"
                      onClick={() => setSelectedThemeKey(group.key)}
                      className={`rounded-[8px] border px-4 py-3 text-left transition-colors ${selectedThemeKey === group.key ? "border-[#c0392b] bg-[#c0392b] text-white" : "border-black/10 bg-white text-[#0a0a0a] hover:border-[#c0392b]/35 hover:text-[#c0392b]"}`}
                    >
                      <span className="block text-sm font-black leading-snug">{group.label}</span>
                      <span className={`mt-1 block text-[10px] font-bold ${selectedThemeKey === group.key ? "text-white/72" : "text-black/42"}`}>
                        {group.items.length} titles
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {viewMode === "theme" && !selectedTheme ? (
              <section className="rounded-[14px] border border-black/10 bg-white/70 px-6 py-12 text-center">
                <p className="text-sm font-medium leading-7 text-black/58">見たいテーマを選ぶと、そのテーマで保存した漫画だけ表示されます。</p>
              </section>
            ) : (
              <>
                {viewMode === "theme" && selectedTheme && (
                  <div className="mb-5 flex items-baseline gap-3">
                    <h2 className="text-2xl font-black md:text-3xl" style={{ fontFamily: browseSerif }}>{selectedTheme.label}</h2>
                    <span className="text-xs font-bold tracking-[0.14em] text-black/42" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedTheme.items.length} titles</span>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {visibleItems.map((item) => (
                    <MangaWatchCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
