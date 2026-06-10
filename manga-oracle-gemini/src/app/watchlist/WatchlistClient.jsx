"use client";

import { useEffect, useMemo, useState } from "react";
import MangaCover from "../../components/MangaCover";
import StoreLinks from "../StoreLinks";
import { readWatchLaterItems, removeWatchLaterItem, WATCH_LATER_EVENT } from "@/lib/watchLater";

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

export default function WatchlistClient() {
  const [items, setItems] = useState([]);
  const [sortMode, setSortMode] = useState("added");

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

  const sortedItems = useMemo(() => {
    const copied = [...items];
    if (sortMode === "theme") {
      return copied.sort((a, b) => {
        const theme = `${a.themeLabel || "その他"}`.localeCompare(`${b.themeLabel || "その他"}`, "ja");
        if (theme !== 0) return theme;
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
      });
    }

    return copied.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
  }, [items, sortMode]);

  return (
    <main className="min-h-screen px-4 md:px-8 py-14" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif" }}>
      <div className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-8 text-xs tracking-[0.24em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
          ← Home
        </a>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="text-xs tracking-[0.34em] uppercase mb-3" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
              Watch Later
            </div>
            <h1 className="text-4xl md:text-6xl leading-tight font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
              後で見る漫画一覧
            </h1>
            <p className="mt-4 text-sm md:text-base leading-8 max-w-2xl" style={{ color: "#555" }}>
              診断中や診断結果で気になった漫画を、ここでまとめて見返せます。
            </p>
          </div>

          <div className="flex gap-2">
            {[
              ["added", "追加順"],
              ["theme", "テーマ順"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSortMode(key)}
                className="px-4 py-2 text-xs tracking-[0.18em] uppercase transition-all hover:translate-y-[-1px]"
                style={{
                  border: "1px solid rgba(10,10,10,0.18)",
                  backgroundColor: sortMode === key ? "#0a0a0a" : "transparent",
                  color: sortMode === key ? "#f5f3ee" : "#0a0a0a",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <section className="border px-6 py-12 text-center" style={{ borderColor: "rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.72)" }}>
            <h2 className="text-2xl md:text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>まだ保存した漫画がありません</h2>
            <p className="text-sm leading-7 mb-6" style={{ color: "#555" }}>診断中や診断結果に出てくる「後で見る」ボタンから追加できます。</p>
            <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>
              診断を始める
            </a>
          </section>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {sortedItems.map((item) => {
              const title = item.title_ja || item.title_en || item.title || "";
              return (
                <article key={item.id} className="border p-5 flex gap-5 items-start" style={{ borderColor: "rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.74)" }}>
                  <MangaCover title={title} mangaId={item.id} author={item.author} coverImageUrl={item.coverImageUrl} coverProductUrl={item.coverProductUrl} size="large" pageType="watchlist" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-2xl md:text-3xl leading-tight font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{title}</h2>
                      <button type="button" onClick={() => removeWatchLaterItem(item.id)} className="shrink-0 text-[10px] px-2 py-1 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.16)", color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>
                        削除
                      </button>
                    </div>
                    <div className="text-xs leading-6 mb-3" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>
                      {[item.author, item.year, statusLabel(item.status), item.themeLabel].filter(Boolean).join(" / ")}
                    </div>
                    {item.description && (
                      <p className="text-sm leading-7 mb-3" style={{ color: "#444" }}>{item.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center text-[10px] mb-2" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.sourceContext && <span>{item.sourceContext}</span>}
                      {item.addedAt && <span>保存: {formatDate(item.addedAt)}</span>}
                    </div>
                    <StoreLinks title={title} compact pageType="watchlist" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
