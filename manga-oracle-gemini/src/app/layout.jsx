import "./globals.css";
import Script from "next/script";

const siteUrl = "https://www.mangamatchquiz.com";
const gaMeasurementId = "G-MBE4WLCLX2";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "マンガマッチ診断 — AI漫画おすすめ診断",
  description: "質問に答えるだけで、AIが1500作品DBを分析し、あなたに合う漫画をランキング形式でおすすめします。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "マンガマッチ診断 — AI漫画おすすめ診断",
    description: "質問に答えるだけで、AIがあなたに合う漫画をランキング形式でおすすめします。",
    url: siteUrl,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "マンガマッチ診断 — AI漫画おすすめ診断",
    description: "質問に答えるだけで、AIがあなたに合う漫画をランキング形式でおすすめします。",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
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
