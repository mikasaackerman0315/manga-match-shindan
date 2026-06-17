import MangaCover from "../../components/MangaCover";
import WatchLaterButton from "../../components/WatchLaterButton";
import { getMangaCoverForItem } from "../../data/mangaCovers";
import { MANGA_GENRES } from "../../data/mangaCatalog";
import MangaSearch from "./MangaSearch";
import ProfileAwareMangaGrid from "./ProfileAwareMangaGrid";

const browseSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const browseSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const statusLabel = {
  completed: "完結済み",
  ongoing: "連載中",
  hiatus: "休載中",
};

const demographicLabel = {
  shonen: "少年",
  shojo: "少女",
  seinen: "青年",
  josei: "女性",
  web: "Web",
  kodomo: "児童",
};

const genreLabels = {
  battle: "バトル",
  romance: "恋愛",
  fantasy: "ファンタジー",
  isekai: "異世界",
  horror: "ホラー・ダーク",
  mystery: "ミステリー",
  sports: "スポーツ",
  healing: "癒し・日常",
  sf: "SF",
  historical: "歴史・時代",
  workplace: "仕事・専門職",
  school: "学校・青春",
  completed: "完結済み",
  ongoing: "連載中",
  genius: "天才漫画",
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
  comedy_gag: "ギャグ",
  suspense: "サスペンス",
  psychological: "心理",
  sci_fi: "SF",
  historical: "歴史",
  slice_of_life: "日常",
  self_discovery: "成長",
  worldbuilding: "世界観",
  friendship: "友情",
  light_comedy: "軽め",
};

const quickLinks = [
  { href: "/trending-manga", label: "トレンド漫画", text: "今話題の作品から探す" },
  { href: "/beginner-manga", label: "初心者向け", text: "最初の一冊を選びやすく" },
  { href: "/completed-manga", label: "完結済み", text: "最後まで一気に読める作品" },
  { href: "/genius-manga", label: "天才漫画", text: "頭脳戦や才気ある主人公で探す" },
  { href: "/manga/genres", label: "ジャンル別", text: "好みの方向から絞り込む" },
];

const sortChips = ["あなた向け順", "人気順", "新着順", "完結済み", "巻数が少ない順", "読みやすい順"];

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

function MangaBrowseHeader() {
  const nav = [
    { href: "/", label: "ホーム" },
    { href: "/?start=1", label: "診断する" },
    { href: "/manga", label: "漫画を探す", active: true },
    { href: "/themes", label: "テーマから探す" },
    { href: "/trending-manga", label: "ランキング" },
    { href: "/watchlist", label: "保存リスト" },
    { href: "/profile", label: "好みプロフィール" },
  ];

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
          {nav.map((item) => (
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
            <span className="px-2 py-1 text-[10px]" style={{ border: "1px solid #0a0a0a", backgroundColor: "#0a0a0a", color: "#f5f3ee" }}>JA</span>
            <span className="px-2 py-1 text-[10px]" style={{ border: "1px solid #0a0a0a", color: "#0a0a0a" }}>EN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function pageHref(basePath, page) {
  if (page <= 1) return basePath;
  return `${basePath}/page/${page}`;
}

function Pagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, totalPages].filter((page) => page >= 1 && page <= totalPages))
  ).sort((a, b) => a - b);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="ページ送り">
      {currentPage > 1 && (
        <a href={pageHref(basePath, currentPage - 1)} className="rounded-md border border-black/12 bg-white px-5 py-3 text-sm font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]">
          前へ
        </a>
      )}
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && <span className="text-xs text-black/45">...</span>}
          <a
            href={pageHref(basePath, page)}
            className="grid h-10 min-w-10 place-items-center rounded-md border text-sm font-bold transition hover:border-[#c0392b]"
            style={{
              borderColor: page === currentPage ? "#c0392b" : "rgba(10,10,10,0.14)",
              backgroundColor: page === currentPage ? "#c0392b" : "#fffdf9",
              color: page === currentPage ? "#fffdf9" : "#0a0a0a",
            }}
          >
            {page}
          </a>
        </span>
      ))}
      {currentPage < totalPages && (
        <a href={pageHref(basePath, currentPage + 1)} className="rounded-md border border-black/12 bg-white px-5 py-3 text-sm font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]">
          次へ
        </a>
      )}
    </nav>
  );
}

function FilterPanel({ activeGenre }) {
  return (
    <aside className="self-start rounded-xl border border-black/10 bg-white/82 p-5 shadow-[0_18px_44px_rgba(10,10,10,0.04)] lg:sticky lg:top-24">
      <div className="text-lg font-black">絞り込み</div>

      <div className="mt-5 space-y-6">
        <section>
          <div className="mb-3 text-sm font-black">ジャンル</div>
          <div className="grid gap-2">
            <a href="/manga" className={`rounded-md border px-3 py-2 text-sm font-bold transition hover:border-[#c0392b] ${!activeGenre ? "border-[#c0392b] bg-[#fff4f1] text-[#c0392b]" : "border-black/10 bg-white"}`}>
              すべて
            </a>
            {MANGA_GENRES.slice(0, 8).map((genre) => (
              <a key={genre.slug} href={`/manga/genre/${genre.slug}`} className={`rounded-md border px-3 py-2 text-sm font-bold transition hover:border-[#c0392b] ${activeGenre === genre.slug ? "border-[#c0392b] bg-[#fff4f1] text-[#c0392b]" : "border-black/10 bg-white"}`}>
                {genreLabels[genre.slug] || genre.slug}
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 text-sm font-black">作品の状態</div>
          <div className="space-y-2 text-sm">
            <a href="/manga" className="flex items-center gap-2 font-bold text-black/72 hover:text-[#c0392b]"><span className="h-3 w-3 rounded-full border border-[#c0392b]" />すべて</a>
            <a href="/manga/genre/ongoing" className="flex items-center gap-2 font-bold text-black/72 hover:text-[#c0392b]"><span className="h-3 w-3 rounded-full border border-black/25" />連載中</a>
            <a href="/manga/genre/completed" className="flex items-center gap-2 font-bold text-black/72 hover:text-[#c0392b]"><span className="h-3 w-3 rounded-full border border-black/25" />完結済み</a>
          </div>
        </section>

        <section>
          <div className="mb-3 text-sm font-black">人気の探し方</div>
          <div className="space-y-2">
            {quickLinks.slice(0, 4).map((link) => (
              <a key={link.href} href={link.href} className="block rounded-md border border-black/10 bg-[#f8f5ef] px-3 py-2 text-sm font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]">
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <a href="/manga" className="flex h-11 items-center justify-center rounded-md border border-black/12 bg-white text-sm font-black transition hover:border-[#c0392b] hover:text-[#c0392b]">
          条件をリセット
        </a>
      </div>
    </aside>
  );
}

function ProfileNotice() {
  return (
    <section className="rounded-xl border border-[#ead8c5] bg-[#fffaf2] px-5 py-4 shadow-[0_14px_36px_rgba(10,10,10,0.035)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black/62">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-base font-black">好みプロフィールはまだ設定されていません</h2>
            <p className="mt-1 text-sm leading-6 text-black/62">ジャンルや読み味をもとに、自分に合う漫画を探しやすくできます。プロフィール機能は今後追加予定です。</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href="/profile" className="flex h-11 items-center justify-center rounded-md bg-[#c0392b] px-5 text-sm font-black text-white shadow-[0_12px_28px_rgba(192,57,43,0.18)]">
            診断して好みを作る
          </a>
          <a href="/watchlist" className="flex h-11 items-center justify-center rounded-md border border-black/12 bg-white px-5 text-sm font-black transition hover:border-[#c0392b] hover:text-[#c0392b]">
            保存リストを見る
          </a>
        </div>
      </div>
    </section>
  );
}

function SortControls({ currentPage, totalPages, itemsCount }) {
  return (
    <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-bold text-black/62">並び替え:</span>
        {sortChips.map((chip, index) => (
          <span
            key={chip}
            className="rounded-md border px-3 py-2 text-xs font-black"
            style={{
              borderColor: index === 0 ? "#c0392b" : "rgba(10,10,10,0.12)",
              backgroundColor: index === 0 ? "#c0392b" : "#fffdf9",
              color: index === 0 ? "#fffdf9" : "#0a0a0a",
            }}
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs font-bold text-black/58">
        <span>{itemsCount}件を表示 / PAGE {currentPage}・{totalPages}</span>
        <span className="grid h-9 w-9 place-items-center rounded-md border border-[#c0392b] bg-[#fff4f1] text-[#c0392b]">▦</span>
        <span className="grid h-9 w-9 place-items-center rounded-md border border-black/12 bg-white">☰</span>
      </div>
    </div>
  );
}

function MangaCard({ manga, index, pageType }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en || manga.id;
  const description = manga.desc_ja || manga.desc_en || "マンガマッチ診断のデータベースに登録されている漫画です。";
  const tags = (manga.tags || []).slice(0, 3).map((tag) => tagLabels[tag]).filter(Boolean);

  return (
    <article className="group relative min-h-[246px] overflow-hidden rounded-xl border border-black/10 bg-white/88 p-4 shadow-[0_14px_34px_rgba(10,10,10,0.035)] transition-shadow hover:shadow-[0_18px_40px_rgba(10,10,10,0.06)]">
      <a href={`/manga/${manga.id}`} className="absolute inset-0 z-0" aria-label={`${title}の詳細を見る`} />
      <div className="relative z-10 flex gap-4 pointer-events-none">
        <div className="relative shrink-0">
          <div className="absolute -left-2 -top-2 z-10 rounded-md bg-[#c0392b] px-2 py-1 text-xs font-black text-white">
            {String(index + 1).padStart(2, "0")}
          </div>
          <MangaCover
            title={title}
            mangaId={manga.id}
            author={manga.author}
            coverImageUrl={cover?.coverImageUrl}
            coverProductUrl={cover?.coverProductUrl}
            coverImageSource={cover?.coverImageSource}
            verified={cover?.coverImageVerified}
            size="medium"
            pageType={pageType}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-black leading-snug transition-colors group-hover:text-[#c0392b]" style={{ fontFamily: browseSerif }}>
              {title}
            </h2>
            <span className="shrink-0 text-black/45">♡</span>
          </div>
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
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/68">{description}</p>
        </div>
      </div>
      <div className="relative z-20 mt-4 grid grid-cols-2 gap-2 pointer-events-auto">
        <WatchLaterButton item={manga} sourceContext="漫画一覧" compact className="justify-center" />
        <a href={`/manga/${manga.id}`} className="flex min-h-[34px] items-center justify-center rounded-md bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-black text-[#fffdf9] transition hover:bg-[#c0392b]">
          詳しく見る
        </a>
      </div>
    </article>
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

export default function MangaListView({
  title,
  lead,
  items,
  currentPage,
  totalPages,
  basePath,
  activeGenre,
  searchItems,
  pageType = "seo_article",
}) {
  const displayTitle = activeGenre ? `${genreLabels[activeGenre] || title}漫画` : "漫画を探す";
  const displayLead = activeGenre
    ? `${genreLabels[activeGenre] || "選んだジャンル"}に近い漫画を一覧で探せます。気になる作品は保存して、あとから見返せます。`
    : "作品名・作者名・ジャンルから、気になる漫画を探せます。まずは検索やジャンルから、次に読む一冊を見つけてください。";

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#0a0a0a]" style={{ fontFamily: browseSans }}>
      <MangaBrowseHeader />
      <main className="mx-auto max-w-[1680px] px-4 py-6 md:px-8 xl:px-10">
        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-black/50">
          <a href="/" className="hover:text-[#c0392b]">ホーム</a>
          <span>›</span>
          <span className="text-[#c0392b]">{activeGenre ? genreLabels[activeGenre] || title : "漫画を探す"}</span>
        </div>

        <section className="mb-6">
          <h1 className="text-4xl font-black leading-tight md:text-5xl" style={{ fontFamily: browseSerif }}>{displayTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-black/64 md:text-base">{displayLead}</p>
        </section>

        <ProfileNotice />

        <div className="mt-5 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] 2xl:grid-cols-[250px_minmax(0,1fr)]">
          <FilterPanel activeGenre={activeGenre} />

          <section className="min-w-0">
            {searchItems?.length > 0 && <MangaSearch items={searchItems} />}
            <SortControls currentPage={currentPage} totalPages={totalPages} itemsCount={items.length} />

            {!activeGenre && (
              <div className="mt-5">
                <QuickEntryCards />
              </div>
            )}

            <ProfileAwareMangaGrid items={items} startIndex={(currentPage - 1) * 30} pageType={pageType} />

            <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />

            <section className="mt-8 rounded-xl border border-[#efc8c2] bg-[#fff6f4] px-5 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black">もっと自分に合う作品を見つけたいあなたへ</h2>
                  <p className="mt-1 text-sm leading-6 text-black/62">診断を使うと、苦手な展開や読みたい雰囲気も含めて候補を絞り込めます。</p>
                </div>
                <a href="/?start=1" className="flex h-11 items-center justify-center rounded-md bg-[#c0392b] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(192,57,43,0.18)]">
                  漫画診断を始める →
                </a>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
