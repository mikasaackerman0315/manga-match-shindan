import { notFound } from "next/navigation";
import MangaListView from "../../MangaListView";
import { filterMangaByGenre, getGenreBySlug, getMangaPage, getTotalMangaPages, MANGA_GENRES } from "../../../../data/mangaCatalog";

export function generateStaticParams() {
  return MANGA_GENRES.map((genre) => ({ slug: genre.slug }));
}

export function generateMetadata({ params }) {
  const genre = getGenreBySlug(params.slug);
  if (!genre) return {};

  return {
    title: `${genre.label}漫画一覧 | マンガマッチ診断`,
    description: `${genre.label}に近い漫画を、マンガマッチ診断のデータベースから30作品ずつ一覧で探せます。`,
    alternates: {
      canonical: `/manga/genre/${genre.slug}`,
    },
  };
}

export default function MangaGenrePage({ params }) {
  const genre = getGenreBySlug(params.slug);
  if (!genre) notFound();

  const items = filterMangaByGenre(genre);

  return (
    <MangaListView
      title={`${genre.label}漫画一覧`}
      eyebrow="Genre Manga"
      lead={`${genre.label}の気分に合う漫画を、マンガマッチ診断のデータベースから一覧で探せます。作品カードからAmazon、楽天、試し読み導線にも進めます。`}
      items={getMangaPage(items, 1)}
      currentPage={1}
      totalPages={getTotalMangaPages(items)}
      basePath={`/manga/genre/${genre.slug}`}
      activeGenre={genre.slug}
      pageType="seo_article"
    />
  );
}
