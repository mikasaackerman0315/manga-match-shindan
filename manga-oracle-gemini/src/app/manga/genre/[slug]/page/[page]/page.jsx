import { notFound } from "next/navigation";
import MangaListView from "../../../../MangaListView";
import { ALL_MANGA, filterMangaByGenre, getGenreBySlug, getMangaPage, getTotalMangaPages, MANGA_GENRES } from "../../../../../../data/mangaCatalog";

export function generateStaticParams() {
  return MANGA_GENRES.flatMap((genre) => {
    const items = filterMangaByGenre(genre);
    const totalPages = getTotalMangaPages(items);
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      slug: genre.slug,
      page: String(index + 2),
    }));
  });
}

export function generateMetadata({ params }) {
  const genre = getGenreBySlug(params.slug);
  const page = Number(params.page);
  if (!genre) return {};

  return {
    title: `${genre.label}漫画一覧 ${page}ページ目 | マンガマッチ診断`,
    description: `${genre.label}に近い漫画を、30作品ずつ紹介する一覧の${page}ページ目です。`,
    alternates: {
      canonical: `/manga/genre/${genre.slug}/page/${page}`,
    },
  };
}

export default function MangaGenrePagedPage({ params }) {
  const genre = getGenreBySlug(params.slug);
  if (!genre) notFound();

  const currentPage = Number(params.page);
  const items = filterMangaByGenre(genre);
  const totalPages = getTotalMangaPages(items);
  if (!Number.isFinite(currentPage) || currentPage < 2 || currentPage > totalPages) notFound();

  return (
    <MangaListView
      title={`${genre.label}漫画一覧`}
      eyebrow="Genre Manga"
      lead={`${genre.label}の気分に合う漫画を、マンガマッチ診断のデータベースから一覧で探せます。作品カードからAmazon、楽天、試し読み導線にも進めます。`}
      items={getMangaPage(items, currentPage)}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/manga/genre/${genre.slug}`}
      activeGenre={genre.slug}
      searchItems={ALL_MANGA}
      pageType="seo_article"
    />
  );
}
