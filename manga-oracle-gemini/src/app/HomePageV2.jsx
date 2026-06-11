"use client";

import MangaCover from "./MangaCover";
import { trackEvent } from "./analytics";

const homeSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const homeSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const heroManga = [
  { id: "jjk", title: "呪術廻戦", author: "芥見下々", tilt: "-rotate-6", offset: "md:translate-y-2" },
  { id: "aot", title: "進撃の巨人", author: "諫山創", tilt: "rotate-4", offset: "md:-translate-y-3" },
  { id: "chainsaw", title: "チェンソーマン", author: "藤本タツキ", tilt: "-rotate-3", offset: "md:translate-y-8" },
  { id: "blue_lock", title: "ブルーロック", author: "金城宗幸/ノ村優介", tilt: "rotate-3", offset: "md:translate-y-0" },
  { id: "spy_family", title: "SPY×FAMILY", author: "遠藤達哉", tilt: "-rotate-2", offset: "md:-translate-y-1" },
  { id: "frieren", title: "葬送のフリーレン", author: "山田鐘人/アベツカサ", tilt: "rotate-6", offset: "md:translate-y-6" },
];

const featureCards = [
  {
    icon: "AI",
    title: "AI検索対応",
    text: "データベースだけでなく、必要に応じてAI検索も使って候補を広げます。",
  },
  {
    icon: "LIKE",
    title: "好み分析",
    text: "ジャンル・読み味・苦手要素から、あなたの好みに近い作品を探します。",
  },
  {
    icon: "%",
    title: "相性スコア",
    text: "作品ごとに、あなたに合いそうな理由をスコアや文章で表示します。",
  },
  {
    icon: "BOOK",
    title: "試し読みリンク",
    text: "気になった作品をすぐに試し読み・購入ページへ移動できます。",
  },
];

const exploreCards = [
  { href: "/completed-manga", title: "完結済みから探す", text: "最後まで一気に楽しみたい人へ", icon: "01" },
  { href: "/short-manga", title: "短く読める漫画", text: "短時間でサクッと読みたい人へ", icon: "02" },
  { href: "/fantasy-manga", title: "ダークファンタジー", text: "重厚な世界観が好きな人へ", icon: "03" },
  { href: "/romance-manga", title: "恋愛・ラブコメ", text: "胸キュンや甘い関係性が好きな人へ", icon: "04" },
  { href: "/battle-manga", title: "バトル・アクション", text: "熱い戦いや能力バトルが好きな人へ", icon: "05" },
  { href: "/trending-manga", title: "アニメ化作品", text: "アニメから入りたい人へ", icon: "06" },
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
    <div className="relative h-10 w-10 shrink-0" aria-hidden="true">
      <div
        className="absolute inset-0 rotate-45 rounded-[6px]"
        style={{ border: "2px solid #0a0a0a" }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: "#0a0a0a" }}
      />
    </div>
  );
}

function HomeBadge({ children, size = "md", inverted = false }) {
  const sizeClass = size === "lg" ? "h-16 w-16 text-[11px]" : "h-12 w-12 text-[10px]";
  return (
    <div
      className={`grid ${sizeClass} shrink-0 place-items-center rounded-full border font-extrabold tracking-[0.08em]`}
      style={{
        borderColor: inverted ? "rgba(192,57,43,0.26)" : "rgba(192,57,43,0.18)",
        backgroundColor: inverted ? "#fffdf9" : "rgba(192,57,43,0.08)",
        color: "#c0392b",
        fontFamily: homeSans,
      }}
    >
      {children}
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
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 md:px-8">
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
        <div className="flex shrink-0 items-center gap-2">
          <a href="/manga" className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-[#0a0a0a] transition-colors hover:border-[#c0392b]/30 hover:text-[#c0392b]" aria-label="検索">
            <SearchGlyph />
          </a>
          <a href="/watchlist" className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-[#0a0a0a] transition-colors hover:border-[#c0392b]/30 hover:text-[#c0392b]" aria-label="保存リスト">
            <UserGlyph />
          </a>
          <div className="hidden gap-1 md:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
  return (
    <div
      className="relative min-h-[330px] overflow-hidden rounded-[10px] border border-black/10 px-5 py-8 shadow-[0_18px_45px_rgba(10,10,10,0.06)] md:min-h-[430px]"
      style={{ background: "linear-gradient(135deg, rgba(255,253,249,0.86), rgba(245,243,238,0.78))" }}
    >
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(192,57,43,0.12) 1px, transparent 0)", backgroundSize: "18px 18px" }} />
      <div className="absolute inset-x-8 top-8 h-px bg-[#c0392b]/15" />
      <div className="absolute inset-x-8 bottom-8 h-px bg-black/10" />
      <div className="relative grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 md:gap-4">
        {heroManga.map((manga, index) => (
          <a
            key={manga.id}
            href={`/manga/${manga.id}`}
            className={`group block transition-transform hover:-translate-y-2 ${manga.tilt} ${manga.offset} ${index > 3 ? "hidden sm:block" : ""}`}
            aria-label={`${manga.title} の作品ページへ`}
          >
            <MangaCover title={manga.title} id={manga.id} author={manga.author} size="large" />
          </a>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature }) {
  return (
    <div className="rounded-[8px] border border-black/10 bg-white/65 p-5 shadow-[0_10px_24px_rgba(10,10,10,0.05)]">
      <div className="mb-4 flex items-center gap-3">
        <HomeBadge>{feature.icon}</HomeBadge>
        <h3 className="text-lg font-bold">{feature.title}</h3>
      </div>
      <p className="text-sm leading-7" style={{ color: "#333" }}>{feature.text}</p>
    </div>
  );
}

function ProfileCta({ onStartQuiz }) {
  return (
    <aside className="rounded-[10px] border border-[#c0392b]/25 bg-[#fff8f6] p-6 shadow-[0_12px_30px_rgba(192,57,43,0.08)] md:p-8">
      <div className="mb-5">
        <HomeBadge size="lg" inverted>MATCH</HomeBadge>
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
    <div className="min-h-screen antialiased" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: homeSans }}>
      <Header language={language} setLanguage={setLanguage} onStartQuiz={onStartQuiz} />

      <main>
        <section className="mx-auto grid max-w-[1500px] gap-10 px-5 pb-12 pt-10 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pb-16 md:pt-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 text-sm font-extrabold tracking-[0.02em] text-[#c0392b]" style={{ fontFamily: homeSans }}>AIがあなたの好みを分析</div>
            <h1 className="mb-6 text-4xl font-bold leading-[1.22] tracking-normal sm:text-5xl md:text-6xl lg:text-[4.35rem]" style={{ fontFamily: homeSerif, fontWeight: 700 }}>
              あなたに<span className="text-[#c0392b]">本当に合う</span>
              <br />
              漫画を、見つけよう。
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
                className="rounded-[6px] border border-black/25 bg-white/60 px-8 py-4 text-center text-sm font-bold transition-transform hover:-translate-y-0.5"
              >
                漫画を探す →
              </a>
            </div>
          </div>
          <HeroVisual />
        </section>

        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8">
          <h2 className="mb-5 text-2xl font-bold">マンガマッチ診断の特徴</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {featureCards.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1500px] gap-6 px-5 py-8 md:grid-cols-[1fr_0.42fr] md:px-8">
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
                    <HomeBadge>{card.icon}</HomeBadge>
                  </div>
                  <h3 className="mb-2 text-base font-bold">{card.title}</h3>
                  <p className="text-xs leading-6" style={{ color: "#444" }}>{card.text}</p>
                </a>
              ))}
            </div>
          </div>
          <ProfileCta onStartQuiz={onStartQuiz} />
        </section>

        <section className="mx-auto max-w-[1500px] px-5 py-8 md:px-8">
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
                <div className="relative flex h-full flex-col justify-end">
                  <div className="mb-3 inline-flex h-8 w-12 items-center justify-center rounded-full border border-white/45 bg-white/10 text-[10px] font-extrabold tracking-[0.14em]">
                    PICK
                  </div>
                  <h3 className="text-base font-bold leading-7 drop-shadow">{theme.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-10 pt-4 md:px-8">
          <div className="rounded-[8px] border border-black/10 bg-white/45 px-5 py-4 text-center text-sm leading-7" style={{ color: "#333" }}>
            あなたの「好き」や「気になる」を大切に、マンガマッチ診断が新しい漫画との出会いをお手伝いします。
          </div>
        </section>
      </main>
    </div>
  );
}
