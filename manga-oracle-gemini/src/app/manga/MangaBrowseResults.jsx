"use client";

import { useState } from "react";
import ProfileAwareMangaGrid from "./ProfileAwareMangaGrid";

const sortOptions = [
  { value: "default", label: "並び替えなし" },
  { value: "profile", label: "あなた向け順" },
  { value: "popular", label: "人気順" },
  { value: "new", label: "新着順" },
  { value: "completed", label: "完結済み" },
  { value: "short", label: "巻数が少ない順" },
  { value: "readable", label: "読みやすい順" },
];

const quickLinks = [
  { href: "/trending-manga", label: "トレンド漫画", text: "今話題の作品から探す" },
  { href: "/beginner-manga", label: "初心者向け", text: "最初の一冊を選びやすい" },
  { href: "/completed-manga", label: "完結済み", text: "最後まで一気に読める作品" },
  { href: "/genius-manga", label: "天才漫画", text: "頭脳戦や鋭い主人公で探す" },
  { href: "/manga/genres", label: "ジャンル別", text: "好みの方向から絞り込む" },
];

function SortControls({ sortMode, setSortMode, currentPage, totalPages, itemsCount }) {
  return (
    <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-black/62">並び替え</span>
        {sortOptions.map((option) => {
          const active = sortMode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSortMode(option.value)}
              className="rounded-md border px-3 py-2 text-xs font-black transition-colors hover:border-[#c0392b] hover:text-[#c0392b]"
              style={{
                borderColor: active ? "#c0392b" : "rgba(10,10,10,0.12)",
                backgroundColor: active ? "#c0392b" : "#fffdf9",
                color: active ? "#fffdf9" : "#0a0a0a",
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-black/58">
        <span>{itemsCount}件を表示 / PAGE {currentPage}・{totalPages}</span>
        <span className="grid h-9 w-9 place-items-center rounded-md border border-[#c0392b] bg-[#fff4f1] text-[#c0392b]">▦</span>
        <span className="grid h-9 w-9 place-items-center rounded-md border border-black/12 bg-white">▤</span>
      </div>
    </div>
  );
}

function QuickEntryCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {quickLinks.map((link) => (
        <a key={link.href} href={link.href} className="rounded-xl border border-black/10 bg-white/76 p-4 transition-colors hover:border-[#c0392b]/40 hover:text-[#c0392b]">
          <div className="text-base font-black">{link.label}</div>
          <p className="mt-1 text-xs leading-5 text-black/55">{link.text}</p>
        </a>
      ))}
    </div>
  );
}

export default function MangaBrowseResults({ items, startIndex, pageType, currentPage, totalPages, showQuickLinks = false }) {
  const [sortMode, setSortMode] = useState("default");

  return (
    <>
      <SortControls sortMode={sortMode} setSortMode={setSortMode} currentPage={currentPage} totalPages={totalPages} itemsCount={items.length} />

      {showQuickLinks && (
        <div className="mt-5">
          <QuickEntryCards />
        </div>
      )}

      <ProfileAwareMangaGrid items={items} startIndex={startIndex} pageType={pageType} sortMode={sortMode} />
    </>
  );
}
