"use client";

import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { BROWSE_PROFILE_STORAGE_KEY, DEFAULT_BROWSE_PROFILE, normalizeBrowseProfile } from "@/lib/browseProfile";

const profileSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const profileSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const EMPTY_BROWSE_PROFILE = {
  gender: "",
  age: "",
  frequency: "",
  genres: [],
  dislikes: [],
  moods: [],
  updatedAt: "",
};

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/?start=1", label: "診断する" },
  { href: "/manga", label: "漫画を探す" },
  { href: "/themes", label: "テーマから探す" },
  { href: "/trending-manga", label: "ランキング" },
  { href: "/watchlist", label: "保存リスト" },
  { href: "/profile", label: "好みプロフィール", active: true },
];

const sections = [
  {
    id: "gender",
    title: "性別",
    note: "任意",
    type: "single",
    options: [
      { id: "female", label: "女性", icon: "person" },
      { id: "male", label: "男性", icon: "person" },
      { id: "other", label: "その他", icon: "spark" },
    ],
  },
  {
    id: "age",
    title: "年代",
    note: "任意",
    type: "single",
    options: [
      { id: "10s", label: "10代", icon: "person" },
      { id: "20s", label: "20代", icon: "person" },
      { id: "30s", label: "30代", icon: "person" },
      { id: "40plus", label: "40代以上", icon: "person" },
    ],
  },
  {
    id: "frequency",
    title: "漫画を読む頻度",
    type: "single",
    options: [
      { id: "almost_daily", label: "ほぼ毎日", icon: "book" },
      { id: "weekly", label: "週に数回", icon: "calendar" },
      { id: "sometimes", label: "週に1回程度", icon: "clock" },
      { id: "monthly", label: "月に数回", icon: "books" },
      { id: "rarely", label: "ほとんど読まない", icon: "circle" },
    ],
  },
  {
    id: "genres",
    title: "好きなジャンル",
    note: "3個まで",
    type: "multi",
    max: 3,
    options: [
      { id: "battle", label: "バトル・アクション", icon: "sword" },
      { id: "fantasy", label: "ファンタジー", icon: "wand" },
      { id: "sf", label: "SF・近未来", icon: "planet" },
      { id: "mystery", label: "ミステリー・サスペンス", icon: "search" },
      { id: "romance", label: "恋愛・ラブコメ", icon: "heart" },
      { id: "school", label: "青春・学園", icon: "heart" },
      { id: "horror", label: "ホラー・ダーク", icon: "ghost" },
      { id: "sports", label: "スポーツ", icon: "ball" },
      { id: "slice", label: "日常・ほのぼの", icon: "book" },
      { id: "comedy", label: "ギャグ・コメディ", icon: "smile" },
      { id: "historical", label: "歴史・時代", icon: "temple" },
      { id: "other", label: "その他", icon: "dots" },
    ],
  },
  {
    id: "dislikes",
    title: "苦手な要素",
    note: "複数選択可",
    type: "multi",
    options: [
      { id: "gore", label: "グロテスクな描写", icon: "sword" },
      { id: "violence", label: "暴力的な描写", icon: "cross" },
      { id: "tragedy", label: "鬱展開・胸が苦しくなる展開", icon: "drop" },
      { id: "repetition", label: "裏切り・どんでん返しが強すぎる", icon: "loop" },
      { id: "sexual", label: "性的な描写", icon: "drop" },
      { id: "horror", label: "ホラー全般", icon: "ghost" },
      { id: "long", label: "長すぎる（100巻以上など）", icon: "books" },
      { id: "none", label: "なし・特になし", icon: "dots" },
    ],
  },
  {
    id: "moods",
    title: "読みたい気分",
    note: "複数選択可",
    type: "multi",
    options: [
      { id: "exciting", label: "ワクワクしたい", icon: "heart" },
      { id: "emotional", label: "泣きたい・感動したい", icon: "spark" },
      { id: "heartwarming", label: "キュンとしたい", icon: "heart" },
      { id: "funny", label: "笑いたい・癒されたい", icon: "smile" },
      { id: "tense", label: "ドキドキしたい", icon: "heart" },
      { id: "thinking", label: "考えさせられたい", icon: "book" },
      { id: "refreshing", label: "スカッとしたい", icon: "wing" },
      { id: "casual", label: "なんとなく読みたい", icon: "circle" },
    ],
  },
];

const labelMaps = sections.reduce((acc, section) => {
  acc[section.id] = Object.fromEntries(section.options.map((option) => [option.id, option.label]));
  return acc;
}, {});

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

function TinyIcon({ type, className = "h-5 w-5" }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (type === "book" || type === "books") return <svg {...common}><path d="M4 5.5c3.5 0 5.7.8 8 2.8 2.3-2 4.5-2.8 8-2.8v12.8c-3.5 0-5.7.8-8 2.8-2.3-2-4.5-2.8-8-2.8Z" /><path d="M12 8.3v12.8" /></svg>;
  if (type === "heart") return <svg {...common}><path d="M20 8.5c0 5.2-8 10-8 10s-8-4.8-8-10A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8 3.5Z" /></svg>;
  if (type === "sword") return <svg {...common}><path d="M14 4 20 2l-2 6L8 18l-4 2 2-4Z" /><path d="m5 19 4-4" /></svg>;
  if (type === "search") return <svg {...common}><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 5 5" /></svg>;
  if (type === "person") return <svg {...common}><circle cx="12" cy="8" r="3" /><path d="M6 20c1.2-3.4 3.2-5 6-5s4.8 1.6 6 5" /></svg>;
  if (type === "spark") return <svg {...common}><path d="M12 3l1.8 5 5.2 1.8-5.2 1.8L12 17l-1.8-5.4L5 9.8 10.2 8Z" /></svg>;
  if (type === "calendar") return <svg {...common}><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>;
  if (type === "clock") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
  if (type === "planet") return <svg {...common}><circle cx="12" cy="12" r="5" /><path d="M3 14c4 2 11 3 18-4" /></svg>;
  if (type === "ghost") return <svg {...common}><path d="M6 20V10a6 6 0 0 1 12 0v10l-3-2-3 2-3-2Z" /><path d="M9.5 11h.01M14.5 11h.01" /></svg>;
  if (type === "ball") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M7 8c3 2 7 2 10 0M7 16c3-2 7-2 10 0" /></svg>;
  if (type === "smile") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M9 10h.01M15 10h.01M8.5 14.2c2 2 5 2 7 0" /></svg>;
  if (type === "temple") return <svg {...common}><path d="M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M3 18h18M12 4 4 8h16Z" /></svg>;
  if (type === "cross") return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (type === "drop") return <svg {...common}><path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" /></svg>;
  if (type === "loop") return <svg {...common}><path d="M17 7h2v5h-5M7 17H5v-5h5" /><path d="M18.5 12a6.7 6.7 0 0 0-11-4M5.5 12a6.7 6.7 0 0 0 11 4" /></svg>;
  if (type === "wand") return <svg {...common}><path d="m5 19 9-9M13 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" /></svg>;
  if (type === "wing") return <svg {...common}><path d="M5 16c5-1 9-4 14-10-1 8-5 12-14 14Z" /></svg>;
  if (type === "circle") return <svg {...common}><circle cx="12" cy="12" r="7" /></svg>;
  return <svg {...common}><path d="M5 12h.01M12 12h.01M19 12h.01" /></svg>;
}

function ProfileHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5f3ee]/92 backdrop-blur-[18px]">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-2 md:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <div className="whitespace-nowrap text-base font-extrabold tracking-[0.01em] md:text-xl">マンガマッチ診断</div>
            <div className="hidden text-[11px] font-semibold text-black/60 md:block">あなたにぴったりの漫画が見つかる</div>
          </div>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-bold lg:flex">
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
          <a href="/profile" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="マイページ">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <UserIcon />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">マイページ</span>
          </a>
          <div className="hidden gap-1 pt-1 md:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="border border-black bg-black px-2 py-1 text-[10px] text-[#f5f3ee]">JA</span>
            <span className="border border-black px-2 py-1 text-[10px] text-[#0a0a0a]">EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function toggleArray(list, id, max) {
  if (id === "none") return list.includes(id) ? [] : [id];
  const withoutNone = list.filter((item) => item !== "none");
  if (withoutNone.includes(id)) return withoutNone.filter((item) => item !== id);
  if (max && withoutNone.length >= max) return [...withoutNone.slice(1), id];
  return [...withoutNone, id];
}

function OptionButton({ option, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[52px] items-center justify-center gap-3 rounded-[7px] border px-4 py-3 text-sm font-bold transition-colors ${selected ? "border-[#d23a32] bg-[#fff7f4] text-[#d23a32]" : "border-black/12 bg-white text-black/76 hover:border-[#d23a32]/45 hover:text-[#d23a32]"}`}
    >
      <TinyIcon type={option.icon} className="h-5 w-5 shrink-0" />
      <span>{option.label}</span>
      {selected && <span className="absolute -bottom-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-[#d23a32] text-xs text-white">✓</span>}
    </button>
  );
}

function ProfileSection({ section, profile, setProfile }) {
  const value = profile[section.id];
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#d23a32]" />
        <h2 className="text-base font-black">{section.title}</h2>
        {section.note && <span className="text-sm font-bold text-black/42">（{section.note}）</span>}
      </div>
      <div className={`grid gap-3 ${section.id === "genres" || section.id === "dislikes" || section.id === "moods" ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {section.options.map((option) => {
          const selected = Array.isArray(value) ? value.includes(option.id) : value === option.id;
          return (
            <OptionButton
              key={option.id}
              option={option}
              selected={selected}
              onClick={() => {
                setProfile((current) => {
                  if (section.type === "multi") {
                    return { ...current, [section.id]: toggleArray(current[section.id] || [], option.id, section.max) };
                  }
                  return { ...current, [section.id]: option.id };
                });
              }}
            />
          );
        })}
      </div>
      {section.max && <p className="text-xs font-semibold text-black/42">※ {section.max}つまで選択できます</p>}
      {section.id === "dislikes" && <p className="text-xs font-semibold text-black/42">※ 選択した要素を含む作品は、漫画一覧で少し下に出やすくなります</p>}
    </section>
  );
}

function chipsFor(profile, key) {
  const value = profile[key];
  if (!Array.isArray(value)) return [];
  return value.map((id) => labelMaps[key]?.[id]).filter(Boolean);
}

function ProfilePreview({ profile }) {
  return (
    <aside className="space-y-6">
      <section className="rounded-[10px] border border-[#efddd5] bg-[#fff8f3] p-6 shadow-[0_18px_44px_rgba(10,10,10,0.04)]">
        <h2 className="border-l-4 border-[#d23a32] pl-3 text-sm font-black text-[#d23a32]">プロフィールのプレビュー</h2>
        <div className="mt-7 flex justify-center">
          <div className="relative grid h-32 w-32 place-items-center rounded-full border border-[#e9b8b0] bg-white">
            <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(210,58,50,0.15)_1px,transparent_1px)] [background-size:10px_10px]" />
            <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[#f1e4d9]">
              <UserIcon className="h-14 w-14 text-black/70" />
            </div>
          </div>
        </div>
        <dl className="mt-7 space-y-4 text-sm">
          <div className="flex justify-between gap-3"><dt className="font-bold text-black/58">性別</dt><dd className="font-bold">{labelMaps.gender[profile.gender] || "未設定"}</dd></div>
          <div className="flex justify-between gap-3"><dt className="font-bold text-black/58">年代</dt><dd className="font-bold">{labelMaps.age[profile.age] || "未設定"}</dd></div>
          <div className="flex justify-between gap-3"><dt className="font-bold text-black/58">読む頻度</dt><dd className="font-bold">{labelMaps.frequency[profile.frequency] || "未設定"}</dd></div>
        </dl>
        <PreviewChips title="好きなジャンル" chips={chipsFor(profile, "genres")} />
        <PreviewChips title="苦手な要素" chips={chipsFor(profile, "dislikes")} />
        <PreviewChips title="読みたい気分" chips={chipsFor(profile, "moods")} />
      </section>
      <section className="rounded-[10px] border border-[#efddd5] bg-white p-6 shadow-[0_18px_44px_rgba(10,10,10,0.035)]">
        <h2 className="border-l-4 border-[#d23a32] pl-3 text-sm font-black text-[#d23a32]">プロフィール設定のポイント</h2>
        <div className="mt-6 space-y-6">
          <Point icon="search" title="漫画一覧だけに反映" text="保存した内容は、漫画を探すページの並び替えと表示補助だけに使います。" />
          <Point icon="book" title="診断には影響しません" text="AI診断の質問や診断結果には、このプロフィールを混ぜません。" />
          <Point icon="heart" title="いつでも変更できます" text="あとから読みたい気分が変わっても、ここで気軽に更新できます。" />
        </div>
      </section>
    </aside>
  );
}

function PreviewChips({ title, chips }) {
  if (!chips.length) return null;
  return (
    <div className="mt-5">
      <div className="mb-2 text-sm font-black text-black/72">{title}</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full border border-[#d23a32]/18 bg-white px-3 py-1 text-xs font-bold text-[#d23a32]">{chip}</span>
        ))}
      </div>
    </div>
  );
}

function Point({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff4f1] text-[#d23a32]">
        <TinyIcon type={icon} className="h-5 w-5" />
      </div>
      <div>
        <div className="font-black">{title}</div>
        <p className="mt-1 text-sm leading-6 text-black/58">{text}</p>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  const [profile, setProfile] = useState(DEFAULT_BROWSE_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BROWSE_PROFILE_STORAGE_KEY);
      const parsed = stored ? normalizeBrowseProfile(JSON.parse(stored)) : null;
      if (parsed) setProfile({ ...DEFAULT_BROWSE_PROFILE, ...parsed });
    } catch {
      setProfile(DEFAULT_BROWSE_PROFILE);
    }
  }, []);

  const selectedCount = useMemo(() => {
    return profile.genres.length + profile.dislikes.length + profile.moods.length;
  }, [profile]);

  function saveProfile() {
    const payload = { ...profile, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(BROWSE_PROFILE_STORAGE_KEY, JSON.stringify(payload));
    setProfile(payload);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function resetProfile() {
    const payload = { ...EMPTY_BROWSE_PROFILE, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(BROWSE_PROFILE_STORAGE_KEY, JSON.stringify(payload));
    setProfile(payload);
    setSaved(false);
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#0a0a0a]" style={{ fontFamily: profileSans }}>
      <SiteHeader active="profile" />
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-[5%] top-[220px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(210,58,50,0.13)_1px,transparent_1px)] [background-size:15px_15px] opacity-45" />
        <div className="pointer-events-none absolute right-[5%] top-[210px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(210,58,50,0.12)_1px,transparent_1px)] [background-size:15px_15px] opacity-45" />

        <section className="relative mx-auto grid max-w-[1680px] items-center gap-8 px-6 py-12 md:grid-cols-[1fr_420px] md:px-12">
          <div>
            <p className="mb-4 inline-flex rounded-[6px] border border-[#d23a32]/30 bg-white/70 px-3 py-1 text-sm font-black text-[#d23a32]">漫画を探す専用</p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl" style={{ fontFamily: profileSerif }}>
              好みの<span className="text-[#d23a32]">プロフィール</span>を設定しよう
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-black/70">
              あなたの好みを設定すると、漫画一覧でより探しやすくなります。ここで保存した内容は漫画を探すページだけに使われ、診断モードには影響しません。
            </p>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="relative h-48 w-72 text-[#d23a32]/34">
              <div className="absolute left-8 top-4 h-32 w-44 rounded-[10px] border-4 border-current" />
              <div className="absolute left-16 top-12 h-3 w-24 rounded-full bg-current opacity-35" />
              <div className="absolute left-16 top-20 h-3 w-20 rounded-full bg-current opacity-25" />
              <div className="absolute right-8 bottom-8 h-20 w-5 rotate-45 rounded-full bg-[#d23a32]" />
              <div className="absolute right-16 top-12 h-12 w-12 rotate-45 bg-current opacity-45" />
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-[1680px] px-6 pb-10 md:px-12">
          <div className="overflow-hidden rounded-[14px] border border-black/10 bg-white/90 shadow-[0_24px_60px_rgba(10,10,10,0.08)]">
            <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:p-10">
              <div className="space-y-9">
                {sections.map((section) => (
                  <ProfileSection key={section.id} section={section} profile={profile} setProfile={setProfile} />
                ))}
              </div>
              <ProfilePreview profile={profile} />
            </div>

            <div className="border-t border-black/10 bg-[#fffdf9] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <button type="button" onClick={resetProfile} className="h-14 rounded-[7px] border border-black/25 bg-white px-8 text-sm font-black transition-colors hover:border-[#d23a32] hover:text-[#d23a32] md:w-[280px]">
                  リセット
                </button>
                <button type="button" onClick={saveProfile} className="h-14 flex-1 rounded-[7px] bg-[#d23a32] px-8 text-sm font-black text-white shadow-[0_16px_30px_rgba(210,58,50,0.20)] transition-colors hover:bg-[#b72f28]">
                  この内容で保存する　→
                </button>
              </div>
              <p className="mt-5 text-center text-sm font-semibold text-black/45">
                設定内容はいつでも変更できます。選択中: {selectedCount}件 {saved ? " / 保存しました" : ""}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
