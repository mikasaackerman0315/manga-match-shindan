import { notFound } from "next/navigation";
import StoreLinks from "../../StoreLinks";
import MangaCover from "../../../components/MangaCover";
import { ALL_MANGA, getMangaById, getRelatedManga } from "../../../data/mangaCatalog";
import { getMangaCoverForItem } from "../../../data/mangaCovers";

const siteUrl = "https://www.mangamatchquiz.com";

const statusLabel = {
  completed: "完結",
  ongoing: "連載中",
  hiatus: "休載中",
};

const demographicLabel = {
  shonen: "少年漫画",
  shojo: "少女漫画",
  seinen: "青年漫画",
  josei: "女性漫画",
  web: "Web漫画",
  kodomo: "児童向け",
};

const tagLabel = {
  fantasy: "空想世界",
  battle: "バトル",
  romance: "恋愛",
  mystery: "謎解き",
  horror: "ホラー",
  sports: "スポーツ",
  school: "学校",
  workplace: "仕事",
  historical: "歴史",
  sci_fi: "SF",
  healing: "癒し",
  dark: "ダーク",
  emotional: "感情に残る",
  light_comedy: "軽い笑い",
  psychological: "心理戦",
  philosophical: "考えさせる",
  human_drama: "人間ドラマ",
  action: "アクション",
  suspense: "サスペンス",
  adventure: "冒険",
  friendship: "友情",
  family_theme: "家族",
  coming_of_age: "成長",
  worldbuilding: "世界観重視",
  slice_of_life: "日常",
  prodigy: "天才キャラ",
  underdog_growth: "成長型主人公",
  ensemble: "群像劇",
  long_arc: "長編",
  completed: "完結",
};

function titleOf(manga) {
  return manga.title_ja || manga.title_en || manga.id;
}

function featureLabels(manga) {
  return (manga.tags || [])
    .map((tag) => tagLabel[tag])
    .filter(Boolean)
    .slice(0, 6);
}

function readingPoints(manga) {
  const points = [];
  const status = statusLabel[manga.status] || manga.status;
  if (status) points.push(`${status}作品として読めます。`);
  if (manga.volumes) points.push(`${manga.volumes}巻前後のボリューム感です。`);
  if (manga.anime) points.push("アニメ化されているため、映像から入る選び方もしやすい作品です。");
  if ((manga.tags || []).includes("dark") || (manga.tags || []).includes("brutal")) {
    points.push("重めの展開や緊張感を含むため、明るい気分だけを求める時は注意してください。");
  }
  if ((manga.tags || []).includes("healing") || (manga.tags || []).includes("warm")) {
    points.push("刺激よりも余韻や空気感を楽しみたい時に向いています。");
  }
  return points.slice(0, 4);
}

function recommendText(manga) {
  const tags = new Set(manga.tags || []);
  if (tags.has("mystery") || tags.has("psychological")) return "謎解き、心理戦、会話の駆け引きが好きな人に向いています。";
  if (tags.has("battle") || tags.has("action")) return "勢いのある展開や、キャラクター同士のぶつかり合いを楽しみたい人に向いています。";
  if (tags.has("romance")) return "関係性の変化や、感情の揺れをじっくり読みたい人に向いています。";
  if (tags.has("sports")) return "努力、勝負、チームの熱さを味わいたい人に向いています。";
  if (tags.has("healing") || tags.has("slice_of_life")) return "落ち着いた時間や、日常の会話を楽しみたい人に向いています。";
  if (tags.has("fantasy") || tags.has("worldbuilding")) return "現実とは違う世界観や、独自設定に入り込みたい人に向いています。";
  return "次に読む漫画を広げたい人におすすめしやすい作品です。";
}

export function generateStaticParams() {
  return ALL_MANGA.map((manga) => ({ id: manga.id }));
}

export function generateMetadata({ params }) {
  const manga = getMangaById(params.id);
  if (!manga) return {};
  const title = titleOf(manga);
  const description = manga.desc_ja || `${title}の基本情報、あらすじ、読む前のポイント、関連作品を紹介します。`;

  return {
    title: `${title}とは？あらすじ・読む前のポイント | マンガマッチ診断`,
    description,
    alternates: {
      canonical: `/manga/${manga.id}`,
    },
    openGraph: {
      title: `${title}とは？ | マンガマッチ診断`,
      description,
      url: `${siteUrl}/manga/${manga.id}`,
      siteName: "マンガマッチ診断",
      locale: "ja_JP",
      type: "article",
    },
  };
}

function RelatedCard({ manga }) {
  return (
    <a href={`/manga/${manga.id}`} className="block p-4 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.65)" }}>
      <div className="text-lg font-semibold leading-snug" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{titleOf(manga)}</div>
      <p className="mt-1 text-xs leading-5" style={{ color: "#666" }}>{manga.author} / {statusLabel[manga.status] || manga.status}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: "#444" }}>{manga.desc_ja || manga.desc_en}</p>
    </a>
  );
}

export default function MangaDetailPage({ params }) {
  const manga = getMangaById(params.id);
  if (!manga) notFound();

  const cover = getMangaCoverForItem(manga);
  const title = titleOf(manga);
  const features = featureLabels(manga);
  const related = getRelatedManga(manga, 6);
  const points = readingPoints(manga);

  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-4 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <a href="/" style={{ color: "#c0392b" }}>診断トップへ</a>
          <a href="/manga" style={{ color: "#c0392b" }}>全作品一覧へ</a>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
          <MangaCover
            title={title}
            mangaId={manga.id}
            author={manga.author}
            coverImageUrl={cover?.coverImageUrl}
            coverProductUrl={cover?.coverProductUrl}
            coverImageSource={cover?.coverImageSource}
            verified={cover?.coverImageVerified}
            size="hero"
            pageType="seo_article"
          />

          <div className="min-w-0">
            <div className="mb-4 text-xs tracking-[0.35em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Manga Profile</div>
            <h1 className="text-5xl md:text-7xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{title}</h1>
            <p className="mt-4 text-base leading-7" style={{ color: "#555" }}>
              {manga.author} / {manga.year || "年不明"}年開始 / {statusLabel[manga.status] || manga.status} / {demographicLabel[manga.demographic] || manga.demographic}
              {manga.volumes ? ` / ${manga.volumes}巻` : ""}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-9" style={{ color: "#222" }}>
              {manga.desc_ja || manga.desc_en}
            </p>
            {features.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span key={feature} className="px-3 py-1 text-xs" style={{ border: "1px solid rgba(10,10,10,0.14)", color: "#555" }}>{feature}</span>
                ))}
              </div>
            )}
            <div className="mt-6 max-w-xl">
              <StoreLinks title={title} pageType="seo_article" />
            </div>
          </div>
        </section>

        <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{title}はどんな漫画？</h2>
            <p className="mt-5 text-base leading-9" style={{ color: "#333" }}>
              {title}は、{demographicLabel[manga.demographic] || "漫画"}として読まれている作品です。物語の入り口はシンプルでも、キャラクターの関係性、世界観、展開の積み重ねによって読み味が変わっていきます。診断結果で出た場合は、回答した好みと作品の雰囲気が近い候補として見ると選びやすいです。
            </p>
            <p className="mt-4 text-base leading-9" style={{ color: "#333" }}>
              {recommendText(manga)}
            </p>
          </div>

          <aside className="p-5" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.72)" }}>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>読む前のポイント</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7" style={{ color: "#444" }}>
              {points.map((point) => (
                <li key={point}>・{point}</li>
              ))}
            </ul>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>近い雰囲気の漫画</h2>
            <p className="mt-3 text-sm leading-7" style={{ color: "#555" }}>ジャンルや読み味が近い作品です。次に読む候補として見てください。</p>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RelatedCard key={item.id} manga={item} />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
