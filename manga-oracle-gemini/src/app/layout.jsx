import "./globals.css";
import Script from "next/script";

const siteUrl = "https://www.mangamatchquiz.com";
const gaMeasurementId = "G-MBE4WLCLX2";
const adsenseClientId = "ca-pub-6726748690737074";

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "マンガマッチ診断",
  title: {
    default: "マンガマッチ診断 | AI漫画おすすめ診断",
    template: "%s",
  },
  description: "質問に答えるだけで、AIが1500作品DBからあなたに合う漫画をランキング形式でおすすめ。恋愛、異世界、ホラー、スポーツ、名作まで幅広く診断します。",
  keywords: ["漫画おすすめ", "漫画診断", "マンガ診断", "AI漫画推薦", "マンガマッチ診断"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "マンガマッチ診断 | AI漫画おすすめ診断",
    description: "質問に答えるだけで、AIがあなたに合う漫画をランキング形式でおすすめします。",
    url: siteUrl,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "マンガマッチ診断 | AI漫画おすすめ診断",
    description: "質問に答えるだけで、AIがあなたに合う漫画をランキング形式でおすすめします。",
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
    url: siteUrl,
    description: metadata.description,
    inLanguage: "ja",
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
