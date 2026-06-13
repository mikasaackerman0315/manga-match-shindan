import MangaListView from "../manga/MangaListView";
import { ALL_MANGA, getGeniusManga, getMangaPage, getTotalMangaPages } from "../../data/mangaCatalog";

export const metadata = {
  title: "天才・頭脳派漫画一覧 | マンガマッチ診断",
  description: "天才キャラ、頭脳戦、心理戦、専門職のすごさが光る漫画を、マンガマッチ診断のデータベースから一覧で探せます。",
  alternates: {
    canonical: "/genius-manga",
  },
};

export default function GeniusMangaPage() {
  const items = getGeniusManga();

  return (
    <MangaListView
      title="天才・頭脳派漫画一覧"
      eyebrow="Genius Manga"
      lead="天才キャラ、頭脳戦、心理戦、専門職のすごさが光る漫画を集めた一覧です。バトルの強さだけでなく、推理、会話、戦略、職人技で読ませる作品を探せます。"
      items={getMangaPage(items, 1)}
      currentPage={1}
      totalPages={getTotalMangaPages(items)}
      basePath="/genius-manga"
      activeGenre="genius"
      searchItems={ALL_MANGA}
      pageType="seo_article"
    />
  );
}
