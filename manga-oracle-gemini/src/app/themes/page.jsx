import { THEME_GUIDES } from "../themeData";
import TrackedThemeLink from "../TrackedThemeLink";

const siteUrl = "https://www.mangamatchquiz.com";
const keywordArticles = [
  { href: "/completed-manga", label: "完結済み漫画おすすめ", description: "最後まで読み切れる名作を探したい人向け。" },
  { href: "/emotional-manga", label: "泣ける漫画おすすめ", description: "感動したい時に読みたい漫画を紹介。" },
  { href: "/adult-manga", label: "大人向け漫画おすすめ", description: "人生や仕事に響く漫画を読みたい人向け。" },
  { href: "/beginner-manga", label: "初心者におすすめの漫画", description: "何から読めばいいか迷っている人向け。" },
  { href: "/binge-read-manga", label: "一気読みしたい漫画おすすめ", description: "続きが気になる漫画をまとめて紹介。" },
  { href: "/lighthearted-manga", label: "鬱展開が少ない漫画おすすめ", description: "重すぎない漫画を読みたい人向け。" },
  { href: "/trending-manga", label: "トレンド漫画おすすめ", description: "いま話題になりやすい人気漫画を読み始めたい人向け。" },
  { href: "/romance-manga", label: "恋愛漫画おすすめ", description: "甘さだけでなく、心の揺れや距離感まで楽しめる恋愛漫画。" },
  { href: "/completed-romance-manga", label: "完結済み恋愛漫画おすすめ", description: "最後まで安心して読み切れる恋愛漫画を探したい人向け。" },
  { href: "/isekai-manga", label: "異世界漫画おすすめ", description: "冒険、転生、成長、世界観の広がりで選ぶ異世界漫画。" },
  { href: "/horror-manga", label: "ホラー漫画おすすめ", description: "怖さ、緊張感、不穏な余韻を楽しみたい人向け。" },
  { href: "/sports-manga", label: "スポーツ漫画おすすめ", description: "努力、才能、チーム、勝負の熱さが刺さるスポーツ漫画。" },
  { href: "/working-adult-manga", label: "社会人におすすめ漫画", description: "仕事終わりにも読みやすい、大人向けの漫画を紹介。" },
  { href: "/middle-school-manga", label: "中学生におすすめ漫画", description: "友情、成長、冒険など読み始めやすい漫画をまとめました。" },
  { href: "/high-school-manga", label: "高校生におすすめ漫画", description: "青春、進路、恋愛、熱い挑戦を感じられる漫画を紹介。" },
];

export const metadata = {
  title: "テーマ別おすすめ漫画一覧 | マンガマッチ診断",
  description: "異世界、恋愛、ホラー、SF、スポーツ、癒しなど、気分やジャンルから漫画を探せるテーマ別おすすめ漫画一覧です。",
  alternates: {
    canonical: "/themes",
  },
  openGraph: {
    title: "テーマ別おすすめ漫画一覧 | マンガマッチ診断",
    description: "気分やジャンルから漫画を探せるテーマ別おすすめ漫画一覧です。",
    url: `${siteUrl}/themes`,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "website",
  },
};

export default function ThemesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "テーマ別おすすめ漫画一覧",
    description: metadata.description,
    url: `${siteUrl}/themes`,
    numberOfItems: THEME_GUIDES.length,
    itemListElement: THEME_GUIDES.map((theme, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: theme.label,
      description: theme.lead,
      url: `${siteUrl}/themes/${theme.slug}`,
    })),
  };

  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section className="max-w-5xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>診断トップへ</a>
        <div className="mt-10 mb-12">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Theme Guides</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>テーマ別おすすめ漫画</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>診断前にざっくり探したい人向けに、世界観や読み味ごとのおすすめ漫画をまとめました。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_GUIDES.map((theme, index) => (
            <TrackedThemeLink key={theme.slug} href={`/themes/${theme.slug}`} themeSlug={theme.slug} themeTitle={theme.label} className="group p-5 md:p-6 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.55)" }}>
              <div className="text-xs tracking-[0.25em] mb-3" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{String(index + 1).padStart(2, "0")}</div>
              <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{theme.label}</h2>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{theme.lead}</p>
              <div className="mt-4 text-xs tracking-[0.18em] uppercase group-hover:text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Read →</div>
            </TrackedThemeLink>
          ))}
        </div>

        <div className="mt-16">
          <div className="text-xs tracking-[0.35em] uppercase mb-5" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Keyword Guides</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keywordArticles.map((article) => (
              <a key={article.href} href={article.href} className="group p-5 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
                <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{article.label}</h2>
                <p className="text-sm leading-7" style={{ color: "#555" }}>{article.description}</p>
                <div className="mt-4 text-xs tracking-[0.18em] uppercase group-hover:text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Read →</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
