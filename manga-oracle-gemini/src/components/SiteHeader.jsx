"use client";

const headerSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const navItems = [
  { key: "home", label: "ホーム", href: "/" },
  { key: "diagnosis", label: "診断する", href: "/?start=1" },
  { key: "manga", label: "漫画を探す", href: "/manga" },
  { key: "themes", label: "テーマから探す", href: "/themes" },
  { key: "ranking", label: "ランキング", href: "/trending-manga" },
  { key: "watchlist", label: "保存リスト", href: "/watchlist" },
  { key: "profile", label: "好みプロフィール", href: "/profile" },
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

function HeaderIconLink({ href, label, children }) {
  return (
    <a href={href} className="group flex w-12 shrink-0 flex-col items-center gap-1 text-[#0a0a0a]" aria-label={label}>
      <span className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition-colors group-hover:border-[#c0392b]/30 group-hover:text-[#c0392b]">
        {children}
      </span>
      <span className="hidden w-12 text-center text-[11px] font-semibold leading-none md:block">{label}</span>
    </a>
  );
}

export default function SiteHeader({ active = "home", language = "ja", setLanguage, onStartQuiz }) {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ borderColor: "rgba(10,10,10,0.1)", backgroundColor: "rgba(245,243,238,0.92)", backdropFilter: "blur(18px)" }}
    >
      <div className="mx-auto flex h-[80px] max-w-[1920px] items-center justify-between gap-4 px-4 md:px-8" style={{ fontFamily: headerSans }}>
        <a href="/" className="flex min-w-0 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <div className="whitespace-nowrap text-base font-extrabold tracking-[0.01em] md:text-xl">マンガマッチ診断</div>
            <div className="hidden text-[11px] font-semibold text-black/60 md:block">あなたにぴったりの漫画が見つかる</div>
          </div>
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-bold lg:flex">
          {navItems.map((item) => {
            const isActive = item.key === active;
            const className = `relative pb-2 transition-colors hover:text-[#c0392b] ${isActive ? "text-[#c0392b]" : ""}`;
            const underline = isActive ? <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#c0392b]" /> : null;

            if (item.key === "diagnosis" && onStartQuiz) {
              return (
                <button key={item.key} type="button" onClick={onStartQuiz} className={className}>
                  {item.label}
                  {underline}
                </button>
              );
            }

            return (
              <a key={item.key} href={item.href} className={className}>
                {item.label}
                {underline}
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-start gap-3">
          <HeaderIconLink href="/manga" label="検索">
            <SearchGlyph />
          </HeaderIconLink>
          <HeaderIconLink href="/profile" label="マイページ">
            <UserGlyph />
          </HeaderIconLink>
          <div className="hidden h-11 items-start gap-1 pt-1 md:flex" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {setLanguage ? (
              <>
                <button
                  type="button"
                  onClick={() => setLanguage("ja")}
                  className="h-7 min-w-7 px-2 text-[10px]"
                  style={{ border: "1px solid #0a0a0a", backgroundColor: language === "ja" ? "#0a0a0a" : "transparent", color: language === "ja" ? "#f5f3ee" : "#0a0a0a" }}
                >
                  JA
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className="h-7 min-w-7 px-2 text-[10px]"
                  style={{ border: "1px solid #0a0a0a", backgroundColor: language === "en" ? "#0a0a0a" : "transparent", color: language === "en" ? "#f5f3ee" : "#0a0a0a" }}
                >
                  EN
                </button>
              </>
            ) : (
              <>
                <span className="grid h-7 min-w-7 place-items-center border border-black bg-black px-2 text-[10px] text-[#f5f3ee]">JA</span>
                <span className="grid h-7 min-w-7 place-items-center border border-black px-2 text-[10px] text-[#0a0a0a]">EN</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
