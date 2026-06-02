import StoreLinks from "./StoreLinks";
import TrackedArticleLink from "./TrackedArticleLink";

const siteUrl = "https://www.mangamatchquiz.com";
const relatedArticleLinks = [
  { href: "/trending-manga", label: "今話題の漫画", description: "SNS、漫画アプリ、アニメ化で読まれている作品を見る" },
  { href: "/beginner-manga", label: "初心者向け漫画", description: "久しぶりに漫画を読む人でも入りやすい作品を見る" },
  { href: "/completed-manga", label: "完結済み漫画", description: "最後まで一気に読める名作を探す" },
  { href: "/binge-read-manga", label: "一気読み漫画", description: "続きが気になって止まらない作品を探す" },
  { href: "/emotional-manga", label: "泣ける漫画", description: "感動や余韻が強い作品を探す" },
  { href: "/fantasy-manga", label: "ファンタジー漫画", description: "世界観に浸れる冒険や異世界作品を見る" },
  { href: "/romance-manga", label: "恋愛漫画", description: "青春、胸きゅん、大人の恋を探す" },
  { href: "/completed-romance-manga", label: "完結済み恋愛漫画", description: "結末まで安心して読める恋愛漫画を見る" },
  { href: "/sports-manga", label: "スポーツ漫画", description: "試合、努力、チームの熱さを味わえる作品を見る" },
  { href: "/horror-manga", label: "ホラー漫画", description: "怖さ、サスペンス、不穏な空気を楽しめる作品を見る" },
  { href: "/isekai-manga", label: "異世界漫画", description: "転生、冒険、成り上がり系の作品を見る" },
  { href: "/adult-manga", label: "大人向け漫画", description: "仕事、人生、人間関係に刺さる作品を見る" },
  { href: "/working-adult-manga", label: "社会人向け漫画", description: "働く日々に響く漫画を探す" },
  { href: "/middle-school-manga", label: "中学生向け漫画", description: "読みやすさと熱さのバランスがいい作品を見る" },
  { href: "/high-school-manga", label: "高校生向け漫画", description: "青春、進路、部活、恋愛に寄り添う作品を見る" },
  { href: "/lighthearted-manga", label: "鬱展開が少ない漫画", description: "気軽に読めて重すぎない作品を探す" },
];

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function stripRecommendationSuffix(title) {
  return title.replace(/漫画おすすめ(ランキング|10選)?$/, "").replace(/おすすめ(ランキング|10選)?$/, "");
}

export function ArticlePage({ eyebrow, title, lead, items, slug, path, guideTitle = "選び方のポイント", guideItems = [] }) {
  const displayTitle = stripRecommendationSuffix(title);
  const pagePath = slug ? `/themes/${slug}` : path;
  const pageUrl = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  const pageType = slug ? "theme_article" : "seo_article";
  const currentRelatedIndex = relatedArticleLinks.findIndex((link) => link.href === pagePath);
  const rotatedRelatedLinks = currentRelatedIndex >= 0
    ? [...relatedArticleLinks.slice(currentRelatedIndex + 1), ...relatedArticleLinks.slice(0, currentRelatedIndex)]
    : relatedArticleLinks;
  const relatedLinks = rotatedRelatedLinks.slice(0, 6);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${displayTitle}漫画おすすめランキング`,
    description: lead,
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
      url: `${pageUrl}#rank-${index + 1}`,
    })),
  };
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "マンガマッチ診断", item: siteUrl },
    slug
      ? { "@type": "ListItem", position: 2, name: "テーマ別おすすめ漫画", item: `${siteUrl}/themes` }
      : { "@type": "ListItem", position: 2, name: displayTitle, item: pageUrl },
  ];
  if (slug) {
    breadcrumbItems.push({ "@type": "ListItem", position: 3, name: displayTitle, item: pageUrl });
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${displayTitle}漫画はどう選べばいいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "まずは読みたい気分、巻数、完結済みか連載中か、重い話が平気かを決めると選びやすくなります。迷う場合は診断で好みを絞り込むのがおすすめです。",
        },
      },
      {
        "@type": "Question",
        name: "電子書籍と紙の本はどちらがおすすめですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "すぐ読みたい場合は電子書籍、手元に残したい作品や全巻で集めたい作品は紙の本が向いています。価格や在庫はリンク先で確認してください。",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      {pagePath && (
        <>
          <JsonLd data={itemListJsonLd} />
          <JsonLd data={breadcrumbJsonLd} />
          <JsonLd data={faqJsonLd} />
        </>
      )}
      <article className="max-w-4xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>診断トップへ</a>
        <header className="mt-10 mb-14">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{displayTitle}</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>{lead}</p>
        </header>

        {guideItems.length > 0 && (
          <section className="mb-12 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
            <h2 className="text-2xl font-semibold mb-5">{guideTitle}</h2>
            <div className="space-y-5">
              {guideItems.map((item) => (
                <div key={item.heading}>
                  <h3 className="text-base font-semibold mb-2">{item.heading}</h3>
                  <p className="text-sm leading-7" style={{ color: "#555" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["読み切りやすさ", "巻数、完結状況、今すぐ読みたい気分を見て選ぶと失敗しにくくなります。"],
            ["気分との相性", "泣きたい、熱くなりたい、軽く読みたいなど、その日の気分に近い作品を優先しましょう。"],
            ["購入しやすさ", "電子書籍で試すか、紙で集めるかを先に決めると読み始めるまでが速くなります。"],
          ].map(([heading, text]) => (
            <div key={heading} className="p-4" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.45)" }}>
              <h2 className="text-base font-semibold mb-2">{heading}</h2>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{text}</p>
            </div>
          ))}
        </section>

        <div className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">自分に合う漫画をもっと絞り込む</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>好みがまだ固まっていない人は、診断で読みたい気分や苦手な展開を選ぶと、自分向けの漫画をランキング形式で探せます。</p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める</a>
        </div>

        <section className="space-y-8">
          {items.map((item, index) => (
            <div id={`rank-${index + 1}`} key={item.title} className="grid grid-cols-12 gap-4 md:gap-6 pb-8 scroll-mt-8" style={{ borderBottom: "1px solid rgba(10,10,10,0.1)" }}>
              <div className="col-span-2 md:col-span-1 text-3xl md:text-4xl font-bold leading-none" style={{ color: index === 0 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="col-span-10 md:col-span-11">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h2>
                <div className="text-xs tracking-[0.12em] mb-4" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>{item.meta}</div>
                <p className="leading-8 mb-4" style={{ color: "#333" }}>{item.text}</p>
                <p className="text-sm leading-7 mb-4 italic" style={{ color: "#555" }}>{item.fit}</p>
                <StoreLinks title={item.title} compact showPreview={false} pageType={pageType} labels={{ amazonKindle: "Kindleで今すぐ読む", amazonPaper: "Amazonで紙の本を探す", amazonSearch: "Amazonで関連商品を探す", rakutenSet: "楽天で全巻・ポイント還元を見る", rakutenBooks: "楽天ブックスで探す" }} />
              </div>
            </div>
          ))}
        </section>

        {relatedLinks.length > 0 && (
          <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
              <div>
                <div className="text-xs tracking-[0.22em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>More Guides</div>
                <h2 className="text-2xl font-semibold">ほかの切り口でも探す</h2>
              </div>
              <a href="/themes" className="text-xs tracking-[0.18em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>テーマ一覧へ</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedLinks.map((link) => (
                <TrackedArticleLink key={link.href} href={link.href} label={link.label} sourcePath={pagePath} className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
                  <h3 className="text-base font-semibold mb-2">{link.label}</h3>
                  <p className="text-sm leading-7" style={{ color: "#555" }}>{link.description}</p>
                </TrackedArticleLink>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">よくある選び方</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold mb-2">ランキング上位から読めば大丈夫？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>迷ったら上位からで大丈夫です。ただし、絵柄や重さの好みがある人は、診断で条件を絞ると外しにくくなります。</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">電子書籍と紙の本はどちらがおすすめ？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>まず試したい作品は電子書籍、手元に置きたい作品は紙が向いています。気になる作品はリンク先で価格や在庫を比べて選べます。</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
