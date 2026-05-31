import StoreLinks from "./StoreLinks";
import MangaCover from "./MangaCover";

const siteUrl = "https://www.mangamatchquiz.com";

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function ArticlePage({ eyebrow, title, lead, items, slug, path, guideTitle = "選び方のポイント", guideItems = [] }) {
  const displayTitle = title.replace(/漫画おすすめ$/, "");
  const pagePath = slug ? `/themes/${slug}` : path;
  const pageUrl = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${displayTitle}漫画おすすめ10選`,
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
        name: `${displayTitle}はどんな基準で選べばいいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "まずは完結済みか連載中か、明るい話がいいか重い話がいいかなど、今の気分に近い条件で選ぶと失敗しにくくなります。",
        },
      },
      {
        "@type": "Question",
        name: "迷ったときはどれから読めばいいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ランキング上位から読むか、診断で好みを絞り込むのがおすすめです。短時間で今の気分に合う作品を探せます。",
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
        <div className="mt-10 mb-14">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{displayTitle}</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>{lead}</p>
        </div>

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
            ["読み切りやすさ", "巻数や完結状況を見て、今すぐ最後まで読みたいのか、時間をかけて追いたいのかで選ぶ。"],
            ["気分との相性", "泣きたい、熱くなりたい、軽く読みたいなど、その日の気分に近い作品を優先する。"],
            ["購入しやすさ", "電子で試すか、紙で集めるかを先に決めると、読み始めるまでが速くなる。"],
          ].map(([heading, text]) => (
            <div key={heading} className="p-4" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.45)" }}>
              <h2 className="text-base font-semibold mb-2">{heading}</h2>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{text}</p>
            </div>
          ))}
        </section>

        <div className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">自分に合う漫画をもっと絞り込む</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>好みがまだ固まっていない人は、診断で読むべき作品をランキング形式で探せます。</p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める</a>
        </div>

        <section className="space-y-8">
          {items.map((item, index) => (
            <div id={`rank-${index + 1}`} key={item.title} className="grid grid-cols-12 gap-4 md:gap-6 pb-8 scroll-mt-8" style={{ borderBottom: "1px solid rgba(10,10,10,0.1)" }}>
              <div className="col-span-2 md:col-span-1 text-3xl md:text-4xl font-bold leading-none" style={{ color: index === 0 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="col-span-10 md:col-span-11 flex flex-col sm:flex-row gap-4 md:gap-6">
                <MangaCover title={item.title} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h2>
                  <div className="text-xs tracking-[0.12em] mb-4" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>{item.meta}</div>
                  <p className="leading-8 mb-4" style={{ color: "#333" }}>{item.text}</p>
                  <p className="text-sm leading-7 mb-4 italic" style={{ color: "#555" }}>{item.fit}</p>
                  <StoreLinks title={item.title} compact showPreview={false} pageType={slug ? "theme_article" : "seo_article"} labels={{ amazon: "Amazon", kindle: "Kindle", paper: "紙の本", rakuten: "楽天" }} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">よくある選び方</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold mb-2">ランキング上位から読めば大丈夫？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>迷ったら上位からで大丈夫です。ただ、絵柄や重さの好みがある人は、診断で条件を絞ると外しにくくなります。</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">電子と紙のどちらがおすすめ？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>まず試したい作品は電子、手元に置きたい作品は紙が向いています。気になる作品はリンク先で価格や在庫を比べて選べます。</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
