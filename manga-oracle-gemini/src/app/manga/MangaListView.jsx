import StoreLinks from "../StoreLinks";
import MangaCover from "../../components/MangaCover";
import { getMangaCoverForItem } from "../../data/mangaCovers";
import { MANGA_GENRES } from "../../data/mangaCatalog";

const statusLabel = {
  completed: "完結",
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

function pageHref(basePath, page) {
  if (page <= 1) return basePath;
  return `${basePath}/page/${page}`;
}

function Pagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter((page) => page >= 1 && page <= totalPages))
  ).sort((a, b) => a - b);

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="ページ送り">
      {currentPage > 1 && (
        <a href={pageHref(basePath, currentPage - 1)} className="px-3 py-2 text-xs transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.16)" }}>
          前へ
        </a>
      )}
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && <span className="text-xs" style={{ color: "#888" }}>...</span>}
          <a
            href={pageHref(basePath, page)}
            className="min-w-[38px] px-3 py-2 text-center text-xs transition-all hover:translate-y-[-1px]"
            style={{
              border: "1px solid rgba(10,10,10,0.16)",
              backgroundColor: page === currentPage ? "#0a0a0a" : "transparent",
              color: page === currentPage ? "#f5f3ee" : "#0a0a0a",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {page}
          </a>
        </span>
      ))}
      {currentPage < totalPages && (
        <a href={pageHref(basePath, currentPage + 1)} className="px-3 py-2 text-xs transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.16)" }}>
          次へ
        </a>
      )}
    </nav>
  );
}

function GenreMenu({ activeSlug }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <a href="/manga" className="px-3 py-2 text-xs transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: !activeSlug ? "#0a0a0a" : "transparent", color: !activeSlug ? "#f5f3ee" : "#0a0a0a" }}>
        全作品
      </a>
      <a href="/genius-manga" className="px-3 py-2 text-xs transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: activeSlug === "genius" ? "#0a0a0a" : "transparent", color: activeSlug === "genius" ? "#f5f3ee" : "#0a0a0a" }}>
        天才・頭脳派
      </a>
      {MANGA_GENRES.map((genre) => (
        <a
          key={genre.slug}
          href={`/manga/genre/${genre.slug}`}
          className="px-3 py-2 text-xs transition-all hover:translate-y-[-1px]"
          style={{
            border: "1px solid rgba(10,10,10,0.14)",
            backgroundColor: activeSlug === genre.slug ? "#0a0a0a" : "transparent",
            color: activeSlug === genre.slug ? "#f5f3ee" : "#0a0a0a",
          }}
        >
          {genre.label}
        </a>
      ))}
    </div>
  );
}

function MangaCard({ manga, index, pageType }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en;
  const description = manga.desc_ja || manga.desc_en || "作品データベースに登録されている漫画です。";
  const visibleTags = (manga.tags || []).slice(0, 4);

  return (
    <article className="grid grid-cols-[auto_1fr] gap-4 p-4 md:p-5" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.7)" }}>
      <div>
        <div className="mb-2 text-xs" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
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
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-semibold leading-snug" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
          {title}
        </h2>
        <p className="mt-1 text-xs leading-6" style={{ color: "#666" }}>
          {manga.author} / {manga.year || "年不明"} / {statusLabel[manga.status] || manga.status} / {demographicLabel[manga.demographic] || manga.demographic}
          {manga.volumes ? ` / ${manga.volumes}巻` : ""}
        </p>
        <p className="mt-3 text-sm leading-7" style={{ color: "#333" }}>{description}</p>
        {visibleTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <span key={tag} className="px-2 py-1 text-[10px]" style={{ border: "1px solid rgba(10,10,10,0.12)", color: "#555", fontFamily: "'JetBrains Mono', monospace" }}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <StoreLinks title={title} compact pageType={pageType} />
      </div>
    </article>
  );
}

export default function MangaListView({
  title,
  eyebrow = "Manga List",
  lead,
  items,
  currentPage,
  totalPages,
  basePath,
  activeGenre,
  pageType = "seo_article",
}) {
  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <section className="mx-auto max-w-6xl">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
          診断トップへ
        </a>
        <div className="mt-10">
          <div className="mb-4 text-xs tracking-[0.35em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
            {eyebrow}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-8" style={{ color: "#333" }}>
            {lead}
          </p>
          <GenreMenu activeSlug={activeGenre} />
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 text-xs" style={{ color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>
          <span>{items.length} titles on this page</span>
          <span>PAGE {currentPage} / {totalPages}</span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((manga, index) => (
            <MangaCard key={`${manga.id}-${index}`} manga={manga} index={(currentPage - 1) * 30 + index} pageType={pageType} />
          ))}
        </div>

        <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />
      </section>
    </main>
  );
}
