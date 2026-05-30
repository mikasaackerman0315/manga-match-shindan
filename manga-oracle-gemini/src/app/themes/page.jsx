import { THEME_GUIDES } from "../themeData";

const siteUrl = "https://www.mangamatchquiz.com";

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
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← 診断トップへ</a>
        <div className="mt-10 mb-12">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Theme Guides</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>テーマ別おすすめ漫画</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>診断前にざっくり探したい人向けに、世界観や読み味ごとのおすすめ漫画をまとめました。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEME_GUIDES.map((theme, index) => (
            <a key={theme.slug} href={`/themes/${theme.slug}`} className="group p-5 md:p-6 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.55)" }}>
              <div className="text-xs tracking-[0.25em] mb-3" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{String(index + 1).padStart(2, "0")}</div>
              <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{theme.label}</h2>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{theme.lead}</p>
              <div className="mt-4 text-xs tracking-[0.18em] uppercase group-hover:text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Read →</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
