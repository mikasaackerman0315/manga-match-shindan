import { notFound } from "next/navigation";
import MangaListView from "../../../manga/MangaListView";
import { getGeniusManga, getMangaPage, getTotalMangaPages } from "../../../../data/mangaCatalog";

export function generateStaticParams() {
  const totalPages = getTotalMangaPages(getGeniusManga());
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export function generateMetadata({ params }) {
  const page = Number(params.page);
  return {
    title: `天才・頭脳派漫画一覧 ${page}ページ目 | マンガマッチ診断`,
    description: `天才キャラ、頭脳戦、心理戦が光る漫画を30作品ずつ紹介する一覧の${page}ページ目です。`,
    alternates: {
      canonical: `/genius-manga/page/${page}`,
    },
  };
}

export default function GeniusMangaPagedPage({ params }) {
  const currentPage = Number(params.page);
  const items = getGeniusManga();
  const totalPages = getTotalMangaPages(items);
  if (!Number.isFinite(currentPage) || currentPage < 2 || currentPage > totalPages) notFound();

  return (
    <MangaListView
      title="天才・頭脳派漫画一覧"
      eyebrow="Genius Manga"
      lead="天才キャラ、頭脳戦、心理戦、専門職のすごさが光る漫画を集めた一覧です。バトルの強さだけでなく、推理、会話、戦略、職人技で読ませる作品を探せます。"
      items={getMangaPage(items, currentPage)}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/genius-manga"
      activeGenre="genius"
      pageType="seo_article"
    />
  );
}
