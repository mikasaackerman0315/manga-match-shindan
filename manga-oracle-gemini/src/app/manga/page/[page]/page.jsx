import { notFound } from "next/navigation";
import MangaListView from "../../MangaListView";
import { ALL_MANGA, getMangaPage, getTotalMangaPages } from "../../../../data/mangaCatalog";

export function generateStaticParams() {
  const totalPages = getTotalMangaPages(ALL_MANGA);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export function generateMetadata({ params }) {
  const page = Number(params.page);
  return {
    title: `漫画データベース一覧 ${page}ページ目 | マンガマッチ診断`,
    description: `マンガマッチ診断に登録されている漫画を30作品ずつ紹介する一覧の${page}ページ目です。`,
    alternates: {
      canonical: `/manga/page/${page}`,
    },
  };
}

export default function MangaPagedPage({ params }) {
  const currentPage = Number(params.page);
  const totalPages = getTotalMangaPages(ALL_MANGA);
  if (!Number.isFinite(currentPage) || currentPage < 2 || currentPage > totalPages) notFound();

  return (
    <MangaListView
      title="漫画データベース一覧"
      eyebrow="All Manga"
      lead="マンガマッチ診断に登録されている漫画を、1ページ30作品ずつ見られる一覧です。診断で探す前に、気になる作品やジャンルをざっと眺めたい時に使えます。"
      items={getMangaPage(ALL_MANGA, currentPage)}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/manga"
      pageType="seo_article"
    />
  );
}
