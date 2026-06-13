import WatchlistClient from "./WatchlistClient";

export const metadata = {
  title: "保存リスト | マンガマッチ診断",
  description: "診断中や診断結果から保存した漫画を、追加順やテーマ順で見返せる一覧ページです。",
};

export default function WatchlistPage() {
  return <WatchlistClient />;
}
