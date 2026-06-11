"use client";

import { useEffect, useState } from "react";
import MangaCover from "./MangaCover";
import { trackEvent } from "./analytics";

const homeSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const homeSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const heroMangaSets = [
  [
    { id: "jjk", title: "呪術廻戦", author: "芥見下々", tilt: "-rotate-6", offset: "md:translate-y-2" },
    { id: "aot", title: "進撃の巨人", author: "諫山創", tilt: "rotate-4", offset: "md:-translate-y-3" },
    { id: "chainsaw", title: "チェンソーマン", author: "藤本タツキ", tilt: "-rotate-3", offset: "md:translate-y-8" },
    { id: "blue_lock", title: "ブルーロック", author: "金城宗幸/ノ村優介", tilt: "rotate-3", offset: "md:translate-y-0" },
    { id: "spy_family", title: "SPY×FAMILY", author: "遠藤達哉", tilt: "-rotate-2", offset: "md:-translate-y-1" },
    { id: "frieren", title: "葬送のフリーレン", author: "山田鐘人/アベツカサ", tilt: "rotate-6", offset: "md:translate-y-6" },
    { id: "tokyo_ghoul", title: "東京喰種", author: "石田スイ", tilt: "rotate-2", offset: "md:translate-y-4" },
    { id: "gachiakuta", title: "ガチアクタ", author: "裏那圭", tilt: "-rotate-4", offset: "md:-translate-y-1" },
  ],
  [
    { id: "dandadan", title: "ダンダダン", author: "龍幸伸", tilt: "rotate-4", offset: "md:translate-y-3" },
    { id: "sakamoto_days", title: "SAKAMOTO DAYS", author: "鈴木祐斗", tilt: "-rotate-5", offset: "md:-translate-y-2" },
    { id: "kaiju_no_8", title: "怪獣8号", author: "松本直也", tilt: "rotate-5", offset: "md:translate-y-8" },
    { id: "wind_breaker", title: "WIND BREAKER", author: "にいさとる", tilt: "-rotate-3", offset: "md:translate-y-0" },
    { id: "hxh", title: "HUNTER×HUNTER", author: "冨樫義博", tilt: "rotate-2", offset: "md:-translate-y-1" },
    { id: "naruto", title: "NARUTO -ナルト-", author: "岸本斉史", tilt: "-rotate-6", offset: "md:translate-y-6" },
    { id: "kingdom", title: "キングダム", author: "原泰久", tilt: "rotate-3", offset: "md:translate-y-4" },
    { id: "bleach", title: "BLEACH", author: "久保帯人", tilt: "-rotate-2", offset: "md:-translate-y-2" },
  ],
  [
    { id: "bleach", title: "BLEACH", author: "久保帯人", tilt: "-rotate-4", offset: "md:translate-y-2" },
    { id: "kingdom", title: "キングダム", author: "原泰久", tilt: "rotate-5", offset: "md:-translate-y-3" },
    { id: "haikyu", title: "ハイキュー!!", author: "古舘春一", tilt: "-rotate-2", offset: "md:translate-y-8" },
    { id: "demon_slayer", title: "鬼滅の刃", author: "吾峠呼世晴", tilt: "rotate-3", offset: "md:translate-y-0" },
    { id: "one_piece", title: "ONE PIECE", author: "尾田栄一郎", tilt: "-rotate-3", offset: "md:-translate-y-1" },
    { id: "the_apothecary_diaries", title: "薬屋のひとりごと", author: "日向夏/ねこクラゲ", tilt: "rotate-6", offset: "md:translate-y-6" },
    { id: "dandadan", title: "ダンダダン", author: "龍幸伸", tilt: "-rotate-5", offset: "md:translate-y-5" },
    { id: "wind_breaker", title: "WIND BREAKER", author: "にいさとる", tilt: "rotate-2", offset: "md:-translate-y-2" },
  ],
];

const heroCoverLayouts = [
  { className: "left-[0%] top-[9%] rotate-[-8deg] z-20 scale-[1.02]", size: "hero" },
  { className: "left-[19%] top-[0%] rotate-[5deg] z-30 scale-[1.08]", size: "hero" },
  { className: "left-[39%] top-[8%] rotate-[8deg] z-20 scale-[1.02]", size: "hero" },
  { className: "right-[12%] top-[1%] rotate-[-4deg] z-30 scale-[1.04]", size: "hero" },
  { className: "left-[7%] bottom-[2%] rotate-[6deg] z-40 scale-[0.98]", size: "hero" },
  { className: "left-[30%] bottom-[0%] rotate-[-3deg] z-50 scale-[1.08]", size: "hero" },
  { className: "left-[54%] bottom-[5%] rotate-[5deg] z-30 scale-[1.02]", size: "hero" },
  { className: "right-[-5%] bottom-[11%] rotate-[-6deg] z-10 scale-[0.98]", size: "hero" },
];

const featureCards = [
  {
    icon: "ai",
    title: "AI検索対応",
    text: "データベースだけでなく、必要に応じてAI検索も使って候補を広げます。",
  },
  {
    icon: "heart",
    title: "好み分析",
    text: "ジャンル・読み味・苦手要素から、あなたの好みに近い作品を探します。",
  },
  {
    icon: "target",
    title: "相性スコア",
    text: "作品ごとに、あなたに合いそうな理由をスコアや文章で表示します。",
  },
  {
    icon: "book",
    title: "試し読みリンク",
    text: "気になった作品をすぐに試し読み・購入ページへ移動できます。",
  },
];

const exploreCards = [
  { href: "/completed-manga", title: "完結済みから探す", text: "最後まで一気に楽しみたい人へ", icon: "book" },
  { href: "/short-manga", title: "短く読める漫画", text: "短時間でサクッと読みたい人へ", icon: "clock" },
  { href: "/fantasy-manga", title: "ダークファンタジー", text: "重厚な世界観が好きな人へ", icon: "cat" },
  { href: "/romance-manga", title: "恋愛・ラブコメ", text: "胸キュンや甘い関係性が好きな人へ", icon: "heart_filled" },
  { href: "/battle-manga", title: "バトル・アクション", text: "熱い戦いや能力バトルが好きな人へ", icon: "swords" },
  { href: "/trending-manga", title: "アニメ化作品", text: "アニメから入りたい人へ", icon: "tv" },
];

const themeCards = [
  { href: "/battle-manga", title: "呪術廻戦好きにおすすめ", tone: "from-[#2b1010] to-[#8b1e1e]" },
  { href: "/horror-manga", title: "進撃の巨人好きにおすすめ", tone: "from-[#241c16] to-[#6c3b2a]" },
  { href: "/fantasy-manga", title: "ダークファンタジー", tone: "from-[#101828] to-[#334155]" },
  { href: "/emotional-manga", title: "泣ける漫画", tone: "from-[#6b4f2a] to-[#c58c43]" },
  { href: "/short-manga", title: "短く読める漫画", tone: "from-[#2f3a2f] to-[#6b7f52]" },
  { href: "/trending-manga", title: "アニメ化された漫画", tone: "from-[#17324d] to-[#4f7fa8]" },
];

function LogoMark() {
  return (
    <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M14 18.5c4.1 0 7 .9 10 3.3 3-2.4 5.9-3.3 10-3.3v12.7c-4.1 0-7 .9-10 3.3-3-2.4-5.9-3.3-10-3.3V18.5Z" fill="#0a0a0a" />
      <path d="M24 21.8v12.7" stroke="#f5f3ee" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon({ type, className = "h-7 w-7" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "ai") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
        <path d="M8.4 14 11 7.5 13.6 14" />
        <path d="M9.4 11.8h3.2" />
      </svg>
    );
  }

  if (type === "heart" || type === "heart_filled") {
    return (
      <svg {...common} fill={type === "heart_filled" ? "currentColor" : "none"} strokeWidth={type === "heart_filled" ? 0 : 2}>
        <path d="M12 20.2s-7.2-4.4-9.2-8.7C1.4 8.4 3.3 5 6.5 5c1.9 0 3.2 1 3.9 2.2C11.1 6 12.4 5 14.3 5c3.2 0 5.1 3.4 3.7 6.5-2 4.3-9 8.7-9 8.7Z" />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M22 12h-3" />
      </svg>
    );
  }

  if (type === "book") {
    return (
      <svg {...common}>
        <path d="M4 5.5c2.4 0 4.2.5 6 2v11c-1.8-1.4-3.6-2-6-2Z" />
        <path d="M20 5.5c-2.4 0-4.2.5-6 2v11c1.8-1.4 3.6-2 6-2Z" />
        <path d="M10 7.5v11" />
        <path d="M14 7.5v11" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V12l3.2 2" />
      </svg>
    );
  }

  if (type === "cat") {
    return (
      <svg {...common}>
        <path d="M5.5 9 4.5 4.8 8 7" />
        <path d="m18.5 9 1-4.2L16 7" />
        <path d="M5.5 9.5c0-2 2.9-3.5 6.5-3.5s6.5 1.5 6.5 3.5v3c0 3.4-2.9 5.5-6.5 5.5s-6.5-2.1-6.5-5.5Z" />
        <path d="M9.2 12h.1" />
        <path d="M14.7 12h.1" />
        <path d="M11 15h2" />
      </svg>
    );
  }

  if (type === "swords") {
    return (
      <svg {...common}>
        <path d="M4 20 20 4" />
        <path d="M14 4h6v6" />
        <path d="M20 20 4 4" />
        <path d="M4 4v6h6" />
        <path d="m7 17-3 3" />
        <path d="m17 17 3 3" />
      </svg>
    );
  }

  if (type === "tv") {
    return (
      <svg {...common}>
        <rect x="4" y="7" width="16" height="11" rx="2" />
        <path d="m9 4 3 3 3-3" />
        <path d="M9 21h6" />
      </svg>
    );
  }

  if (type === "clipboard") {
    return (
      <svg {...common}>
        <rect x="6" y="5" width="12" height="16" rx="2" />
        <path d="M9 5.5V4h6v1.5" />
        <path d="M9.5 11h5" />
        <path d="M9.5 15h3" />
        <path d="M16.8 15.2c.7-.7 1.9-.2 1.9.8 0 1.4-2.3 2.7-2.3 2.7S14 17.4 14 16c0-1 .9-1.5 1.7-.8l.5.5Z" />
      </svg>
    );
  }

  return null;
}

function HomeBadge({ icon, children, size = "md", inverted = false }) {
  const sizeClass = size === "lg" ? "h-20 w-20" : "h-12 w-12";
  return (
    <div
      className={`grid ${sizeClass} shrink-0 place-items-center rounded-full border`}
      style={{
        borderColor: inverted ? "rgba(192,57,43,0.26)" : "rgba(192,57,43,0.18)",
        backgroundColor: inverted ? "#fffdf9" : "rgba(192,57,43,0.08)",
        color: "#c0392b",
      }}
    >
      {icon ? <HomeIcon type={icon} className={size === "lg" ? "h-11 w-11" : "h-7 w-7"} /> : children}
    </div>
  );
}

function SearchGlyph() {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span className="absolute left-0 top-0 h-4 w-4 rounded-full border-2 border-current" />
      <span className="absolute bottom-0 right-0 h-2.5 w-0.5 rotate-[-45deg] rounded-full bg-current" />
    </span>
  );
}

function UserGlyph() {
  return (
    <span className="relative block h-5 w-5" aria-hidden="true">
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-current" />
      <span className="absolute bottom-0 left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-t-full border-2 border-current border-b-0" />
    </span>
  );
}

function Header({ language, setLanguage, onStartQuiz }) {
  const navItems = [
    { label: "ホーム", href: "/", active: true },
    { label: "診断する", action: onStartQuiz },
    { label: "漫画を探す", href: "/manga" },
    { label: "テーマから探す", href: "/themes" },
    { label: "ランキング", href: "/trending-manga" },
    { label: "保存リスト", href: "/watchlist" },
    { label: "好みプロフィール", action: onStartQuiz },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: "rgba(10,10,10,0.1)", backgroundColor: "rgba(245,243,238,0.92)", backdropFilter: "blur(18px)" }}
    >
      <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <div className="whitespace-nowrap text-base font-extrabold tracking-[0.01em] md:text-xl" style={{ fontFamily: homeSans }}>マンガマッチ診断</div>
            <div className="hidden text-[11px] font-semibold md:block" style={{ color: "#555", fontFamily: homeSans }}>あなたにぴったりの漫画が見つかる</div>
          </div>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-bold lg:flex" style={{ fontFamily: homeSans }}>
          {navItems.map((item) => {
            const className = `relative pb-2 transition-colors hover:text-[#c0392b] ${item.active ? "text-[#c0392b]" : ""}`;
            const underline = item.active ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#c0392b]" /> : null;
            if (item.action) {
              return (
                <button key={item.label} type="button" onClick={item.action} className={className}>
                  {item.label}
                  {underline}
                </button>
              );
            }
            return (
              <a key={item.label} href={item.href} className={className}>
                {item.label}
                {underline}
              </a>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-start gap-3">
          <a href="/manga" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="検索">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <SearchGlyph />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">検索</span>
          </a>
          <a href="/watchlist" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="マイページ">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <UserGlyph />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">マイページ</span>
          </a>
          <div className="hidden gap-1 pt-1 md:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <button
              onClick={() => setLanguage("ja")}
              className="px-2 py-1 text-[10px]"
              style={{ border: "1px solid #0a0a0a", backgroundColor: language === "ja" ? "#0a0a0a" : "transparent", color: language === "ja" ? "#f5f3ee" : "#0a0a0a" }}
            >
              JA
            </button>
            <button
              onClick={() => setLanguage("en")}
              className="px-2 py-1 text-[10px]"
              style={{ border: "1px solid #0a0a0a", backgroundColor: language === "en" ? "#0a0a0a" : "transparent", color: language === "en" ? "#f5f3ee" : "#0a0a0a" }}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroVisual() {
  const [activeSet, setActiveSet] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSet((current) => (current + 1) % heroMangaSets.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="relative h-[430px] w-full overflow-visible px-1 py-4 sm:h-[470px] md:-ml-6 md:-mr-16 md:h-[590px] md:px-0 md:py-0 xl:-ml-8 xl:-mr-24"
    >
      <div
        className="absolute bottom-4 left-[-10%] right-[-16%] top-4 rounded-[24px] opacity-100 md:bottom-0 md:left-[-8%] md:right-[-16%] md:top-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(190,30,30,0.16) 1.15px, transparent 1.25px)",
          backgroundPosition: "0 0",
          backgroundSize: "18px 18px",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 14%, black 90%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 14%, black 90%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-[-5%] w-[22%] bg-gradient-to-r from-[#fffdf9] via-[#fffdf9]/75 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-[-12%] w-[28%] bg-gradient-to-l from-[#fffdf9]/40 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-[4%] right-[-2%] h-32 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.17),transparent_64%)] blur-2xl" />
      <div className="relative h-full w-full overflow-visible">
        {heroMangaSets.map((set, setIndex) => (
          <div
            key={setIndex}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${activeSet === setIndex ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {set.map((manga, index) => {
              const layout = heroCoverLayouts[index % heroCoverLayouts.length];

              return (
                <a
                  key={manga.id}
                  href={`/manga/${manga.id}`}
                  className={`absolute block overflow-hidden rounded-xl border border-white/70 bg-white p-1 shadow-[0_24px_60px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 ${layout.className} ${index > 5 ? "hidden md:block" : ""}`}
                  aria-label={`${manga.title} の作品ページへ`}
                >
                  <MangaCover title={manga.title} id={manga.id} author={manga.author} size={layout.size} />
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  return (
    <div className="rounded-[8px] border border-black/10 bg-white/80 p-5 shadow-[0_10px_24px_rgba(10,10,10,0.07)]">
      <div className="mb-4 flex items-center gap-3">
        <HomeBadge icon={feature.icon} />
        <h3 className="text-lg font-bold">{feature.title}</h3>
      </div>
      <p className="text-sm leading-7" style={{ color: "#333" }}>{feature.text}</p>
    </div>
  );
}

function ProfileCta({ onStartQuiz }) {
  return (
    <aside className="relative overflow-hidden rounded-[10px] border border-[#c0392b]/45 bg-[#fff6f2] p-6 shadow-[0_12px_30px_rgba(192,57,43,0.1)] md:p-8">
      <div className="relative mb-5 inline-block">
        <HomeBadge icon="clipboard" size="lg" inverted />
        <span className="absolute -bottom-1 -right-2 grid h-9 w-9 place-items-center rounded-full bg-[#c0392b] text-white shadow-[0_6px_14px_rgba(192,57,43,0.25)]">
          <HomeIcon type="heart_filled" className="h-5 w-5" />
        </span>
      </div>
      <h2 className="mb-3 text-2xl font-bold">もっと細かく探したい方へ</h2>
      <p className="mb-6 text-sm leading-7" style={{ color: "#333" }}>
        好みプロフィールを設定すると、漫画一覧をあなたとの相性順で表示できます。
      </p>
      <button
        type="button"
        onClick={onStartQuiz}
        className="w-full rounded-[6px] bg-[#c0392b] px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
      >
        好みプロフィールを設定する →
      </button>
    </aside>
  );
}

export default function HomePageV2({ language, setLanguage, onStartQuiz }) {
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        backgroundColor: "#f6f2ea",
        backgroundImage: "linear-gradient(180deg, #fffdf9 0%, #f6f2ea 34%, #f5f3ee 100%)",
        color: "#0a0a0a",
        fontFamily: homeSans,
      }}
    >
      <Header language={language} setLanguage={setLanguage} onStartQuiz={onStartQuiz} />

      <main>
        <section className="relative overflow-hidden border-b border-black/10 md:min-h-[650px]">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fffdf9_0%,#fffdf9_42%,rgba(255,253,249,0.88)_58%,#fffdf9_100%)]" />
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[70%] md:block"
            style={{
              backgroundImage: "linear-gradient(90deg, #fffdf9 0%, rgba(255,253,249,0.62) 10%, rgba(255,253,249,0) 24%), radial-gradient(circle, rgba(190,30,30,0.13) 1.1px, transparent 1.2px)",
              backgroundPosition: "0 0, 0 0",
              backgroundSize: "100% 100%, 18px 18px",
            }}
          />
          <div className="relative mx-auto grid max-w-[1920px] items-center gap-2 px-6 pb-12 pt-10 md:grid-cols-[0.34fr_0.66fr] md:px-8 md:pb-14 md:pt-14 xl:px-10 2xl:px-14">
            <div className="flex flex-col justify-center">
              <div className="mb-5 text-sm font-extrabold tracking-[0.02em] text-[#c0392b]" style={{ fontFamily: homeSans }}>AIがあなたの好みを分析</div>
              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-normal sm:text-5xl md:text-6xl xl:text-7xl" style={{ fontFamily: homeSerif, fontWeight: 700 }}>
                <span className="block whitespace-nowrap">
                  あなたに<span className="text-[#c0392b]">本当に合う</span>
                </span>
                <span className="block whitespace-nowrap">
                  漫画を、見つけよう。
                </span>
              </h1>
              <p className="mb-8 max-w-2xl text-base font-medium leading-8 md:text-lg" style={{ color: "#222", fontFamily: homeSans }}>
                いくつかの質問に答えるだけで、あなたの好みに近い漫画をAIが探します。データベースだけでなく、必要に応じてAI検索も使って候補を広げます。
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onStartQuiz}
                  className="rounded-[6px] bg-[#c0392b] px-8 py-4 text-center text-sm font-bold text-white shadow-[0_10px_20px_rgba(192,57,43,0.18)] transition-transform hover:-translate-y-0.5"
                >
                  診断を始める →
                </button>
                <a
                  href="/manga"
                  className="rounded-[6px] border border-black/25 bg-white/70 px-8 py-4 text-center text-sm font-bold transition-transform hover:-translate-y-0.5"
                >
                  漫画を探す →
                </a>
              </div>
            </div>
            <HeroVisual />
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] px-6 py-8 md:px-8 xl:px-10 2xl:px-14">
          <h2 className="mb-5 text-2xl font-bold">マンガマッチ診断の特徴</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1920px] gap-6 px-6 py-8 md:grid-cols-[1fr_0.42fr] md:px-8 xl:px-10 2xl:px-14">
          <div>
            <h2 className="mb-5 text-2xl font-bold">人気の探し方</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {exploreCards.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className="rounded-[8px] border border-black/10 bg-white/55 p-4 shadow-[0_8px_18px_rgba(10,10,10,0.04)] transition-transform hover:-translate-y-1"
                >
                  <div className="mb-3">
                    <HomeBadge icon={card.icon} />
                  </div>
                  <h3 className="mb-2 text-base font-bold">{card.title}</h3>
                  <p className="text-xs leading-6" style={{ color: "#444" }}>{card.text}</p>
                </a>
              ))}
            </div>
          </div>
          <ProfileCta onStartQuiz={onStartQuiz} />
        </section>

        <section className="mx-auto max-w-[1920px] px-6 py-8 md:px-8 xl:px-10 2xl:px-14">
          <h2 className="mb-5 text-2xl font-bold">おすすめテーマから探す</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {themeCards.map((theme) => (
              <a
                key={theme.title}
                href={theme.href}
                onClick={() => trackEvent("theme_article_click", { theme_slug: theme.href.replace("/", ""), theme_title: theme.title })}
                className={`relative min-h-[118px] min-w-[230px] overflow-hidden rounded-[8px] bg-gradient-to-br ${theme.tone} p-4 text-white shadow-[0_10px_22px_rgba(10,10,10,0.12)] transition-transform hover:-translate-y-1`}
              >
                <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "14px 14px" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.42),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.38))]" />
                <div className="relative flex h-full flex-col justify-end">
                  <h3 className="pr-10 text-base font-bold leading-7 drop-shadow">{theme.title}</h3>
                  <span className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-white text-[#0a0a0a] shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
                    <span className="text-lg leading-none">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1920px] px-6 pb-10 pt-4 md:px-8 xl:px-10 2xl:px-14">
          <div className="rounded-[8px] border border-black/10 bg-white/45 px-5 py-4 text-center text-sm leading-7" style={{ color: "#333" }}>
            あなたの「好き」や「気になる」を大切に、マンガマッチ診断が新しい漫画との出会いをお手伝いします。
          </div>
        </section>
      </main>
    </div>
  );
}
