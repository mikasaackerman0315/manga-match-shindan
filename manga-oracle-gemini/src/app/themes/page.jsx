import { THEME_GUIDES } from "../themeData";
import SiteHeader from "../../components/SiteHeader";
import TrackedArticleLink from "../TrackedArticleLink";
import TrackedThemeLink from "../TrackedThemeLink";

const siteUrl = "https://www.mangamatchquiz.com";
const sans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const serif = "'Noto Serif JP', serif";

const themeBySlug = Object.fromEntries(THEME_GUIDES.map((theme) => [theme.slug, theme]));

const popularThemeLinks = [
  { type: "article", href: "/completed-manga", label: "完結済み", icon: "book" },
  { type: "theme", slug: "fantasy", label: "ダークファンタジー", icon: "sword" },
  { type: "article", href: "/emotional-manga", label: "泣ける漫画", icon: "drop" },
  { type: "theme", slug: "romance", label: "恋愛・ラブコメ", icon: "heart" },
  { type: "theme", slug: "mystery", label: "ミステリー・頭脳戦", icon: "search" },
  { type: "article", href: "/short-manga", label: "短く読める", icon: "clock" },
  { type: "article", href: "/trending-manga", label: "アニメ化作品", icon: "tv" },
  { type: "article", href: "/beginner-manga", label: "初心者向け", icon: "shield" },
];

const themeSections = [
  {
    title: "世界観から探す",
    description: "舞台や空気感から、読みたい漫画の方向性を選べます。",
    slugs: ["fantasy", "modern", "sci-fi", "horror"],
    tones: ["red", "blue", "green", "mono"],
  },
  {
    title: "読み味から探す",
    description: "恋愛、癒し、謎解き、名作など、読後感で選びたい人へ。",
    slugs: ["romance", "healing", "mystery", "classic"],
    tones: ["pink", "green", "blue", "orange"],
  },
];

const purposeArticles = [
  { href: "/completed-manga", label: "完結済み漫画おすすめ", description: "最後までスッキリ読みたい人へ。", tags: ["完結", "安心して読める"], icon: "flag" },
  { href: "/new-manga-2020s", label: "2020年代漫画おすすめ", description: "最近話題の新しめ作品をチェック。", tags: ["2020年代", "新作"], icon: "calendar" },
  { href: "/beginner-manga", label: "初心者におすすめの漫画", description: "はじめてでも楽しめる名作と新定番。", tags: ["初心者向け", "名作"], icon: "openBook" },
  { href: "/trending-manga", label: "トレンド漫画おすすめ", description: "今、SNSやアニメ化で話題の作品。", tags: ["トレンド", "話題作"], icon: "fire" },
  { href: "/adult-manga", label: "大人向け漫画おすすめ", description: "大人だからこそ響くテーマの作品。", tags: ["大人向け", "深いテーマ"], icon: "glass" },
  { href: "/lighthearted-manga", label: "鬱展開が少ない漫画おすすめ", description: "重すぎない、安心して読める作品。", tags: ["明るめ", "ハッピー"], icon: "sun" },
];

const genreArticles = [
  { href: "/battle-manga", label: "バトル漫画おすすめ", description: "迫力の戦闘や熱い成長が読みたい人へ。", tags: ["バトル", "熱い", "アクション"], icon: "sword", tone: "red" },
  { href: "/mystery-manga", label: "ミステリー漫画おすすめ", description: "謎解きや心理戦をじっくり味わう作品。", tags: ["ミステリー", "推理", "サスペンス"], icon: "search", tone: "blue" },
  { href: "/fantasy-manga", label: "ファンタジー漫画おすすめ", description: "魔法や冒険、壮大な世界に浸りたい人へ。", tags: ["ファンタジー", "冒険", "世界観"], icon: "key", tone: "green" },
  { href: "/horror-manga", label: "ホラー漫画おすすめ", description: "怖さや不穏な余韻を楽しみたい人へ。", tags: ["ホラー", "不穏", "サスペンス"], icon: "ghost", tone: "mono" },
  { href: "/sports-manga", label: "スポーツ漫画おすすめ", description: "青春、努力、才能、勝負の熱さが刺さる作品。", tags: ["スポーツ", "青春", "努力"], icon: "ball", tone: "orange" },
  { href: "/workplace-manga", label: "仕事漫画おすすめ", description: "働く人のリアルや専門職の面白さを描く作品。", tags: ["仕事", "お仕事", "成長"], icon: "case", tone: "beige" },
];

const navItems = [
  { label: "ホーム", href: "/" },
  { label: "診断する", href: "/?start=1" },
  { label: "漫画を探す", href: "/manga" },
  { label: "テーマから探す", href: "/themes", active: true },
  { label: "ランキング", href: "/trending-manga" },
  { label: "保存リスト", href: "/watchlist" },
  { label: "好みプロフィール", href: "/profile" },
];

export const metadata = {
  title: "テーマから漫画を探す | マンガマッチ診断",
  description: "異世界、恋愛、ホラー、SF、スポーツ、癒しなど、気分や世界観から漫画を探せるテーマ別おすすめ漫画一覧です。",
  alternates: {
    canonical: "/themes",
  },
  openGraph: {
    title: "テーマから漫画を探す | マンガマッチ診断",
    description: "気分や世界観から漫画を探せるテーマ別おすすめ漫画一覧です。",
    url: `${siteUrl}/themes`,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "website",
  },
};

function LogoMark() {
  return (
    <svg className="h-12 w-12 shrink-0" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M14 18.5c4.1 0 7 .9 10 3.3 3-2.4 5.9-3.3 10-3.3v12.7c-4.1 0-7 .9-10 3.3-3-2.4-5.9-3.3-10-3.3V18.5Z" fill="#0a0a0a" />
      <path d="M24 21.8v12.7" stroke="#f5f3ee" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LineIcon({ type, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    book: (
      <svg {...common}>
        <path d="M4 5.5c2.4 0 4.2.5 6 2v11c-1.8-1.4-3.6-2-6-2Z" />
        <path d="M20 5.5c-2.4 0-4.2.5-6 2v11c1.8-1.4 3.6-2 6-2Z" />
        <path d="M10 7.5v11" />
        <path d="M14 7.5v11" />
      </svg>
    ),
    sword: (
      <svg {...common}>
        <path d="M4 20 20 4" />
        <path d="M14 4h6v6" />
        <path d="M20 20 4 4" />
        <path d="M4 4v6h6" />
      </svg>
    ),
    drop: (
      <svg {...common}>
        <path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />
      </svg>
    ),
    heart: (
      <svg {...common}>
        <path d="M12 20s-7.2-4.4-9.2-8.7C1.4 8.4 3.3 5 6.5 5c1.9 0 3.2 1 3.9 2.2C11.1 6 12.4 5 14.3 5c3.2 0 5.1 3.4 3.7 6.5C16 15.6 12 20 12 20Z" />
      </svg>
    ),
    search: (
      <svg {...common}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    ),
    clock: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.5V12l3 1.8" />
      </svg>
    ),
    tv: (
      <svg {...common}>
        <rect x="4" y="7" width="16" height="11" rx="2" />
        <path d="m9 4 3 3 3-3" />
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M12 3 19 6v5.8c0 4.1-2.7 7.2-7 9.2-4.3-2-7-5.1-7-9.2V6Z" />
      </svg>
    ),
    flag: (
      <svg {...common}>
        <path d="M6 20V4" />
        <path d="M6 5h10l-1.4 4L16 13H6" />
      </svg>
    ),
    calendar: (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
      </svg>
    ),
    openBook: (
      <svg {...common}>
        <path d="M5 6h5.5A3.5 3.5 0 0 1 14 9.5V20a3.5 3.5 0 0 0-3.5-3.5H5Z" />
        <path d="M19 6h-5.5A3.5 3.5 0 0 0 10 9.5V20a3.5 3.5 0 0 1 3.5-3.5H19Z" />
      </svg>
    ),
    fire: (
      <svg {...common}>
        <path d="M12 21c3.5 0 6-2.4 6-5.8 0-2.6-1.6-4.4-3.2-6.1-.8 2.2-2 3.1-3.1 3.7.4-3.4-1.4-5.8-3.5-7.8.1 3.2-2.2 5.2-3.1 7.2C3.7 15.5 5.7 21 12 21Z" />
      </svg>
    ),
    glass: (
      <svg {...common}>
        <path d="M7 3h10l-1 8a4 4 0 0 1-8 0Z" />
        <path d="M12 15v5" />
        <path d="M9 20h6" />
      </svg>
    ),
    sun: (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.9 4.9 6.3 6.3" />
        <path d="m17.7 17.7 1.4 1.4" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m4.9 19.1 1.4-1.4" />
        <path d="m17.7 6.3 1.4-1.4" />
      </svg>
    ),
    key: (
      <svg {...common}>
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 8-8" />
        <path d="m16 4 4 4" />
        <path d="m14 6 4 4" />
      </svg>
    ),
    ghost: (
      <svg {...common}>
        <path d="M5 20V10a7 7 0 0 1 14 0v10l-2.4-1.5L14.2 20 12 18.5 9.8 20l-2.4-1.5Z" />
        <path d="M9.4 11h.1" />
        <path d="M14.5 11h.1" />
      </svg>
    ),
    ball: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M4.7 9.2c2.8 1 5.3 1 7.3 0 2.1-1 4.5-1 7.3 0" />
        <path d="M4.7 14.8c2.8-1 5.3-1 7.3 0 2.1 1 4.5 1 7.3 0" />
        <path d="M12 4c-1.3 2.5-1.3 13 0 16" />
      </svg>
    ),
    case: (
      <svg {...common}>
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M9 7V5h6v2" />
        <path d="M4 12h16" />
      </svg>
    ),
  };

  return icons[type] || icons.book;
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

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5f3ee]/95 backdrop-blur-xl">
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
              {item.active ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#c0392b]" /> : null}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-start gap-3">
          <a href="/manga" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="検索">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <SearchGlyph />
            </span>
            <span className="hidden text-[11px] font-semibold md:block">検索</span>
          </a>
          <a href="/profile" className="group flex flex-col items-center gap-1 text-[#0a0a0a]" aria-label="マイページ">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
              <UserGlyph />
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

function HeroIllustration() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[24px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(255,253,249,0.98), rgba(255,253,249,0.62))",
        }}
      />
      <svg className="absolute inset-x-4 bottom-0 mx-auto h-full max-h-[320px] w-[86%] text-[#c0392b]/30" viewBox="0 0 640 360" fill="none" aria-hidden="true">
        <path d="M110 258c40-34 73-52 124-58 67-8 118 18 178-4 43-16 62-49 100-68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M244 102c-38 4-74 18-108 42v138c38-24 76-38 116-40 32-2 58 4 82 16V120c-26-14-56-22-90-18Z" stroke="currentColor" strokeWidth="4" />
        <path d="M336 120v138c26-13 55-19 88-16 40 2 78 16 116 40V144c-34-24-70-38-108-42-36-4-68 3-96 18Z" stroke="currentColor" strokeWidth="4" />
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={index} d={`M${150 + index * 18} ${146 + index * 7}c20-9 42-14 68-16`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ))}
        {Array.from({ length: 8 }).map((_, index) => (
          <path key={index} d={`M${372 + index * 18} ${130 + index * 6}c24 2 46 10 66 24`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ))}
        <path d="M140 90h58l14 112h-64Z" stroke="currentColor" strokeWidth="4" />
        <path d="M214 72h58l16 130h-65Z" stroke="currentColor" strokeWidth="4" />
        <path d="M286 82h58l12 120h-63Z" stroke="currentColor" strokeWidth="4" />
        <path d="M366 68h60l14 134h-66Z" stroke="currentColor" strokeWidth="4" />
        <path d="M460 98c26 0 48 20 48 48 0 34-32 58-68 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M516 236c28-14 54-12 72 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M520 248c26-9 48-8 66 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fffdf9] to-transparent" />
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="h-5 w-1.5 rounded-full bg-[#c0392b]" />
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      </div>
      {description ? <p className="mt-2 text-sm leading-7 text-black/60">{description}</p> : null}
    </div>
  );
}

function PopularChip({ item }) {
  const content = (
    <>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c0392b]/8 text-[#c0392b]">
        <LineIcon type={item.icon} className="h-5 w-5" />
      </span>
      <span>{item.label}</span>
    </>
  );

  const className = "flex min-w-max items-center gap-2 rounded-[12px] border border-black/8 bg-white px-4 py-3 text-sm font-bold shadow-[0_8px_18px_rgba(10,10,10,0.04)] transition-colors hover:border-[#c0392b]/35 hover:text-[#c0392b]";

  if (item.type === "theme") {
    const theme = themeBySlug[item.slug];
    return (
      <TrackedThemeLink href={`/themes/${item.slug}`} themeSlug={item.slug} themeTitle={theme?.label || item.label} className={className}>
        {content}
      </TrackedThemeLink>
    );
  }

  return (
    <TrackedArticleLink href={item.href} label={item.label} sourcePath="/themes" className={className}>
      {content}
    </TrackedArticleLink>
  );
}

function ThemeCard({ theme, index, tone }) {
  const toneClass = {
    red: "from-[#fff4f0] via-white to-[#ffe5df] text-[#c0392b]",
    blue: "from-[#f4fbff] via-white to-[#e4f4ff] text-[#3f8bb9]",
    green: "from-[#f4fff8] via-white to-[#e4f5ea] text-[#4a9b68]",
    mono: "from-[#f7f7f7] via-white to-[#dfdfdf] text-[#555]",
    pink: "from-[#fff5f7] via-white to-[#ffe2e8] text-[#d9617c]",
    orange: "from-[#fff8ed] via-white to-[#ffe9ca] text-[#bd7833]",
    beige: "from-[#fffaf2] via-white to-[#ece3d5] text-[#9c7254]",
  }[tone] || "from-[#fff4f0] via-white to-[#ffe5df] text-[#c0392b]";

  return (
    <TrackedThemeLink
      href={`/themes/${theme.slug}`}
      themeSlug={theme.slug}
      themeTitle={theme.label}
      className={`group relative min-h-[250px] overflow-hidden rounded-[10px] border border-black/10 bg-gradient-to-br ${toneClass} p-6 shadow-[0_14px_28px_rgba(10,10,10,0.06)] transition-colors hover:border-[#c0392b]/35`}
    >
      <div className="absolute -bottom-8 -right-8 opacity-30">
        <LineIcon type={theme.slug === "horror" ? "ghost" : theme.slug === "mystery" ? "search" : theme.slug === "sports" ? "ball" : theme.slug === "workplace" ? "case" : "openBook"} className="h-36 w-36" />
      </div>
      <div className="relative flex h-full flex-col">
        <div className="mb-5 text-xs font-extrabold text-[#c0392b]">{String(index + 1).padStart(2, "0")}</div>
        <h3 className="mb-3 text-2xl font-extrabold text-[#0a0a0a]">{theme.label}</h3>
        <p className="mb-4 max-w-[17rem] text-sm font-medium leading-7 text-black/70">{theme.lead}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {theme.items.slice(0, 3).map((item) => (
            <span key={item.title} className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-[11px] font-bold text-black/55">
              {item.title.length > 9 ? `${item.title.slice(0, 9)}…` : item.title}
            </span>
          ))}
        </div>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#0a0a0a] group-hover:text-[#c0392b]">
          <span className="grid h-6 w-6 place-items-center rounded-full border border-[#c0392b]/30 text-[#c0392b]">→</span>
          このテーマを見る
        </div>
      </div>
    </TrackedThemeLink>
  );
}

function ArticleMiniCard({ article, index }) {
  return (
    <TrackedArticleLink
      href={article.href}
      label={article.label}
      sourcePath="/themes"
      className="group flex min-h-[220px] flex-col rounded-[9px] border border-black/10 bg-white/80 p-5 shadow-[0_12px_24px_rgba(10,10,10,0.05)] transition-colors hover:border-[#c0392b]/35"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="text-xs font-extrabold text-[#c0392b]">{String(index + 1).padStart(2, "0")}</div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#c0392b]/8 text-[#c0392b]">
          <LineIcon type={article.icon} className="h-6 w-6" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="mb-3 text-lg font-extrabold leading-7">{article.label}</h3>
        <p className="mb-4 text-sm font-medium leading-6 text-black/65">{article.description}</p>
        <div className="mt-auto flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/10 bg-[#f5f3ee] px-2 py-1 text-[11px] font-bold text-black/55">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </TrackedArticleLink>
  );
}

function GenreCard({ article, index }) {
  return (
    <TrackedArticleLink
      href={article.href}
      label={article.label}
      sourcePath="/themes"
      className="group min-h-[210px] rounded-[9px] border border-black/10 bg-white/80 p-5 shadow-[0_12px_24px_rgba(10,10,10,0.05)] transition-colors hover:border-[#c0392b]/35"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="text-xs font-extrabold text-[#c0392b]">{String(index + 1).padStart(2, "0")}</div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#c0392b]/8 text-[#c0392b]">
          <LineIcon type={article.icon} className="h-6 w-6" />
        </div>
      </div>
      <h3 className="mb-3 text-xl font-extrabold leading-7">{article.label}</h3>
      <p className="mb-4 text-sm font-medium leading-7 text-black/65">{article.description}</p>
      <div className="flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-black/10 bg-[#f5f3ee] px-2 py-1 text-[11px] font-bold text-black/55">
            #{tag}
          </span>
        ))}
      </div>
    </TrackedArticleLink>
  );
}

export default function ThemesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "テーマから漫画を探す",
    description: metadata.description,
    url: `${siteUrl}/themes`,
    numberOfItems: THEME_GUIDES.length,
    itemListElement: THEME_GUIDES.map((theme, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: theme.label,
      description: theme.lead,
      url: `${siteUrl}/themes/${theme.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#0a0a0a]" style={{ fontFamily: sans }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader active="themes" />

      <main>
        <section className="relative overflow-hidden border-b border-black/10 bg-[#fffdf9]">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-20 xl:px-16">
            <div>
              <div className="mb-4 text-sm font-extrabold tracking-[0.02em] text-[#c0392b]">テーマから漫画を選ぶ</div>
              <h1 className="mb-6 text-5xl font-black leading-tight tracking-normal md:text-7xl" style={{ fontFamily: serif }}>
                <span className="block text-[#c0392b]">テーマから</span>
                <span className="block">漫画を探す</span>
              </h1>
              <p className="max-w-xl text-base font-medium leading-8 text-black/72">
                いま読みたい気分や、好きな世界観から漫画を選べます。診断前にざっくり探したい人にもおすすめです。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/?start=1" className="rounded-[7px] bg-[#c0392b] px-8 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(192,57,43,0.18)] transition-colors hover:bg-[#a93226]">
                  AI診断で探す →
                </a>
                <a href="/manga" className="rounded-[7px] border border-[#c0392b]/35 bg-white px-8 py-3.5 text-center text-sm font-extrabold transition-colors hover:border-[#c0392b] hover:text-[#c0392b]">
                  漫画一覧を見る →
                </a>
              </div>
            </div>
            <HeroIllustration />
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 xl:px-16">
          <SectionHeading title="人気のテーマから探す" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {popularThemeLinks.map((item) => (
              <PopularChip key={item.type === "theme" ? item.slug : item.href} item={item} />
            ))}
          </div>
        </section>

        {themeSections.map((section) => (
          <section key={section.title} className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10 xl:px-16">
            <SectionHeading title={section.title} description={section.description} />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {section.slugs.map((slug, index) => (
                <ThemeCard key={slug} theme={themeBySlug[slug]} index={index} tone={section.tones[index]} />
              ))}
            </div>
          </section>
        ))}

        <section className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10 xl:px-16">
          <SectionHeading title="目的・条件から探す" description="完結済み、トレンド、初心者向けなど、条件がはっきりしている人向けです。" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {purposeArticles.map((article, index) => (
              <ArticleMiniCard key={article.href} article={article} index={index} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 pb-14 md:px-10 xl:px-16">
          <SectionHeading title="ジャンルから探す" description="バトル、ミステリー、スポーツ、仕事漫画など、定番ジャンルから選べます。" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {genreArticles.map((article, index) => (
              <GenreCard key={article.href} article={article} index={index} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-6 pb-16 md:px-10">
          <div className="grid items-center gap-8 rounded-[12px] border border-[#c0392b]/18 bg-[#fff9f6] px-7 py-8 shadow-[0_18px_40px_rgba(192,57,43,0.08)] md:grid-cols-[0.28fr_1fr_0.35fr]">
            <div className="hidden justify-center text-[#c0392b]/35 md:flex">
              <LineIcon type="openBook" className="h-28 w-28" />
            </div>
            <div>
              <h2 className="mb-3 text-center text-2xl font-extrabold md:text-left">迷ったら、診断であなたに合う漫画を探せます。</h2>
              <p className="text-center text-sm font-medium leading-7 text-black/65 md:text-left">
                いくつかの質問に答えるだけで、AIがあなたにぴったりの漫画を提案します。苦手な展開や読みたい雰囲気も伝えられます。
              </p>
            </div>
            <a href="/?start=1" className="rounded-[7px] bg-[#c0392b] px-8 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(192,57,43,0.18)] transition-colors hover:bg-[#a93226]">
              診断を始める →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
