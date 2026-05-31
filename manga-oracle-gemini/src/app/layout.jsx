import "./globals.css";
import Script from "next/script";

const siteUrl = "https://www.mangamatchquiz.com";
const gaMeasurementId = "G-MBE4WLCLX2";
const adsenseClientId = "ca-pub-6726748690737074";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "マンガマッチ診断",
  title: {
    default: "漫画おすすめ診断 | 自分に合う漫画をAIで探す",
    template: "%s",
  },
  description: "質問に答えるだけで、AIが1500作品データベースから自分に合う漫画をランキング形式でおすすめ。恋愛、異世界、ホラー、スポーツ、名作まで幅広く診断します。",
  keywords: ["漫画おすすめ", "漫画診断", "マンガ診断", "AI漫画推薦", "マンガマッチ診断", "自分に合う漫画"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "漫画おすすめ診断 | 自分に合う漫画をAIで探す",
    description: "質問に答えるだけで、AIが自分に合う漫画をランキング形式でおすすめします。",
    url: siteUrl,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "漫画おすすめ診断 | 自分に合う漫画をAIで探す",
    description: "質問に答えるだけで、AIが自分に合う漫画をランキング形式でおすすめします。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "マンガマッチ診断",
    alternateName: ["漫画おすすめ診断", "漫画診断", "AI漫画診断"],
    url: siteUrl,
    description: metadata.description,
    inLanguage: "ja",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "マンガマッチ診断",
    url: siteUrl,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    description: metadata.description,
  };

  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`} crossOrigin="anonymous"></script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+JP:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
