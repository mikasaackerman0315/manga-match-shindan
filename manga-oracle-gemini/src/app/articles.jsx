import StoreLinks from "./StoreLinks";

const siteUrl = "https://www.mangamatchquiz.com";

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
