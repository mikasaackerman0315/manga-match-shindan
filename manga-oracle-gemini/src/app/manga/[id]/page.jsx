import { notFound } from "next/navigation";
import StoreLinks from "../../StoreLinks";
import MangaCover from "../../../components/MangaCover";
import SiteHeader from "../../../components/SiteHeader";
import WatchLaterButton from "../../../components/WatchLaterButton";
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

function affinityScore(manga) {
  const seed = `${manga.id || ""}${manga.title_ja || ""}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 88 + (seed % 9);
}

function affinityRows(manga, score) {
  const tags = new Set(manga.tags || []);
  const rows = [];

  if (tags.has("fantasy") || tags.has("worldbuilding") || tags.has("urban_fantasy")) rows.push("世界観に入り込みやすい");
  if (tags.has("battle") || tags.has("action") || tags.has("burning")) rows.push("展開の熱量が高い");
  if (tags.has("romance") || tags.has("emotional") || tags.has("human_drama")) rows.push("感情の動きが読みどころ");
  if (tags.has("mystery") || tags.has("psychological") || tags.has("suspense")) rows.push("考察しながら読める");
  if (tags.has("healing") || tags.has("slice_of_life") || tags.has("warm")) rows.push("読後に余韻が残りやすい");
  if (tags.has("sports") || tags.has("coming_of_age")) rows.push("成長や勝負を楽しめる");

  const fallback = ["読み味がはっきりしている", "キャラクターを追いやすい", "次の候補にしやすい"];
  const labels = [...rows, ...fallback].slice(0, 5);

  return labels.map((label, index) => ({
    label,
    value: Math.max(72, score - index * 3),
  }));
}

function dataRows(manga) {
  return [
    ["作者", manga.author || "不明"],
    ["開始年", manga.year ? `${manga.year}年` : "不明"],
    ["巻数", manga.volumes ? `${manga.volumes}巻` : "不明"],
    ["状態", statusLabel[manga.status] || manga.status || "不明"],
    ["読者層", demographicLabel[manga.demographic] || manga.demographic || "不明"],
    ["アニメ化", manga.anime ? "あり" : "なし"],
  ];
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
  const cover = getMangaCoverForItem(manga);
  const features = featureLabels(manga).slice(0, 2);

  return (
    <a
      href={`/manga/${manga.id}`}
      className="group flex gap-3 rounded-xl border border-black/10 bg-white/70 p-3 transition-colors hover:border-[#c0392b]/35 hover:bg-white"
      style={{ fontFamily: "'Noto Sans JP', system-ui, sans-serif" }}
    >
      <MangaCover
        title={titleOf(manga)}
        mangaId={manga.id}
        author={manga.author}
        coverImageUrl={cover?.coverImageUrl}
        size="small"
        className="shrink-0"
      />
      <div className="min-w-0">
        <div className="line-clamp-2 text-sm font-bold leading-snug">{titleOf(manga)}</div>
        <p className="mt-1 text-[11px] leading-5 text-black/55">{manga.author} / {statusLabel[manga.status] || manga.status}</p>
        {features.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {features.map((feature) => (
              <span key={feature} className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] text-black/55">{feature}</span>
            ))}
          </div>
        )}
      </div>
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
  const score = affinityScore(manga);
  const affinity = affinityRows(manga, score);
  const rows = dataRows(manga);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Sans JP', system-ui, sans-serif" }}>
      <SiteHeader active="manga" />
      <article className="mx-auto max-w-[1920px] px-4 py-7 md:px-8 md:py-9 xl:px-10 2xl:px-12">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-black/55">
          <a href="/" className="transition-colors hover:text-[#c0392b]">ホーム</a>
          <span>›</span>
          <a href="/manga" className="transition-colors hover:text-[#c0392b]">漫画を探す</a>
          <span>›</span>
          <span className="text-[#c0392b]">{title}</span>
        </div>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="rounded-2xl border border-black/10 bg-white/75 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
            <div className="grid gap-6 p-5 md:grid-cols-[260px_minmax(0,1fr)] md:p-7 lg:gap-8">
              <div className="mx-auto w-full max-w-[250px]">
                <MangaCover
                  title={title}
                  mangaId={manga.id}
                  author={manga.author}
                  coverImageUrl={cover?.coverImageUrl}
                  size="hero"
                />
              </div>

              <div className="min-w-0 self-center">
                <div className="mb-3 flex flex-wrap gap-2">
                  {features.slice(0, 5).map((feature) => (
                    <span key={feature} className="rounded-md bg-black/[0.05] px-3 py-1 text-xs font-bold text-black/65">{feature}</span>
                  ))}
                </div>
                <h1 className="text-4xl font-black leading-tight md:text-6xl" style={{ fontFamily: "'Noto Serif JP', serif" }}>{title}</h1>
                <p className="mt-3 text-sm font-bold text-black/60">
                  {manga.title_en && manga.title_en !== title ? `${manga.title_en} / ` : ""}{manga.author}
                </p>

                <div className="mt-5 grid gap-2 text-sm text-black/70 sm:grid-cols-2">
                  <div className="rounded-lg border border-black/10 bg-[#f5f3ee]/70 px-3 py-2">開始年: {manga.year || "不明"}</div>
                  <div className="rounded-lg border border-black/10 bg-[#f5f3ee]/70 px-3 py-2">状態: {statusLabel[manga.status] || manga.status || "不明"}</div>
                  <div className="rounded-lg border border-black/10 bg-[#f5f3ee]/70 px-3 py-2">巻数: {manga.volumes ? `${manga.volumes}巻` : "不明"}</div>
                  <div className="rounded-lg border border-black/10 bg-[#f5f3ee]/70 px-3 py-2">読者層: {demographicLabel[manga.demographic] || manga.demographic || "不明"}</div>
                </div>

                <p className="mt-5 max-w-3xl text-base leading-8 text-black/80">{manga.desc_ja || manga.desc_en}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#read"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#c0392b] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(192,57,43,0.22)] transition-colors hover:bg-[#a92f23]"
                  >
                    読む・探す
                  </a>
                  <WatchLaterButton item={manga} sourceContext="manga_detail" className="min-h-[44px] justify-center rounded-lg bg-white px-6" />
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-6">
            <h2 className="text-lg font-black">あなたとの相性</h2>
            <div className="mt-4 text-5xl font-black leading-none text-[#c0392b]" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{score}%</div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/[0.08]">
              <div className="h-full rounded-full bg-[#c0392b]" style={{ width: `${score}%` }} />
            </div>
            <div className="mt-5 space-y-4">
              {affinity.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold text-black/70">
                    <span>{row.label}</span>
                    <span className="text-[#c0392b]">{row.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.08]">
                    <div className="h-full rounded-full bg-[#c0392b]/80" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-black/50">相性は作品タグと読み味から見た目安です。好みプロフィールを設定すると、漫画一覧でより探しやすくなります。</p>
          </aside>
        </section>

        <nav className="mt-5 grid grid-cols-2 rounded-xl border border-black/10 bg-white/70 text-center text-xs font-black text-black/65 shadow-[0_12px_35px_rgba(0,0,0,0.04)] md:grid-cols-4">
          {["作品情報", "あらすじ", "似ている作品", "基本データ"].map((label, index) => (
            <a key={label} href={index === 0 ? "#info" : index === 1 ? "#story" : index === 2 ? "#related" : "#data"} className={`px-4 py-4 transition-colors hover:text-[#c0392b] ${index === 0 ? "text-[#c0392b]" : ""}`}>
              {label}
            </a>
          ))}
        </nav>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <section id="info" className="rounded-2xl border border-black/10 bg-white/[0.78] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-7">
              <h2 className="text-2xl font-black" style={{ fontFamily: "'Noto Serif JP', serif" }}>作品紹介</h2>
              <p id="story" className="mt-4 text-base leading-9 text-black/78">
                {title}は、{demographicLabel[manga.demographic] || "漫画"}として読まれている作品です。物語の入り口はシンプルでも、キャラクターの関係性、世界観、展開の積み重ねによって読み味が変わっていきます。
              </p>
              <p className="mt-3 text-base leading-9 text-black/78">{recommendText(manga)}</p>

              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {rows.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-black/10 bg-[#f5f3ee]/60 p-4">
                    <div className="text-xs font-bold text-black/45">{label}</div>
                    <div className="mt-1 text-sm font-black text-black/80">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            {related.length > 0 && (
              <section id="related" className="rounded-2xl border border-black/10 bg-white/[0.78] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black" style={{ fontFamily: "'Noto Serif JP', serif" }}>似ている作品</h2>
                    <p className="mt-2 text-sm leading-7 text-black/55">ジャンルや読み味が近い作品です。次に読む候補として見てください。</p>
                  </div>
                  <a href="/manga" className="hidden text-sm font-black text-[#c0392b] md:inline">もっと見る →</a>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <RelatedCard key={item.id} manga={item} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <section id="read" className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-6">
              <h2 className="text-lg font-black">今すぐ読む・探す</h2>
              <p className="mt-2 text-xs leading-6 text-black/55">電子書籍、紙の本、全巻セットなどを外部ストアで探せます。</p>
              <StoreLinks title={title} pageType="seo_article" />
            </section>

            <section className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-6">
              <h2 className="text-lg font-black">この作品が合う人</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-black/70">
                {affinity.slice(0, 4).map((row) => (
                  <li key={row.label} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c0392b]" />
                    <span>{row.label}作品を読みたい人</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#c0392b]/[0.18] bg-[#fff7f4] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:p-6">
              <h2 className="text-lg font-black text-[#c0392b]">読む前のポイント</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-black/70">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-[#c0392b]">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section id="data" className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-6">
              <h2 className="text-lg font-black">作品の基本データ</h2>
              <div className="mt-4 divide-y divide-black/10 text-sm">
                {rows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-black/55">{label}</span>
                    <span className="font-bold text-black/80">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </article>
    </main>
  );
}
