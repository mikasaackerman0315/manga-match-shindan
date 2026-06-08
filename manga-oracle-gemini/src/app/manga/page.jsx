import MangaListView from "./MangaListView";
import { ALL_MANGA, getMangaPage, getTotalMangaPages } from "../../data/mangaCatalog";

export const metadata = {
  title: "漫画データベース一覧 | マンガマッチ診断",
  description: "マンガマッチ診断に登録されている漫画を30作品ずつ一覧で見られるページです。ジャンル別や天才・頭脳派漫画からも探せます。",
  alternates: {
    canonical: "/manga",
  },
};

export default function MangaIndexPage() {
  return (
    <MangaListView
      title="漫画データベース一覧"
      eyebrow="All Manga"
      lead="マンガマッチ診断に登録されている漫画を、1ページ30作品ずつ見られる一覧です。診断で探す前に、気になる作品やジャンルをざっと眺めたい時に使えます。"
      items={getMangaPage(ALL_MANGA, 1)}
      currentPage={1}
      totalPages={getTotalMangaPages(ALL_MANGA)}
      basePath="/manga"
      pageType="seo_article"
    />
  );
}
