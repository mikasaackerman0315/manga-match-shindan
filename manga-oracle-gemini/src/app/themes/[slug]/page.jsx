import { notFound } from "next/navigation";
import { ArticlePage } from "../../articles";
import { THEME_GUIDES, findTheme } from "../../themeData";

const siteUrl = "https://www.mangamatchquiz.com";

export function generateStaticParams() {
  return THEME_GUIDES.map((theme) => ({ slug: theme.slug }));
}

export function generateMetadata({ params }) {
  const theme = findTheme(params.slug);
  if (!theme) return {};
  const cleanTitle = theme.title.replace(/漫画おすすめ$/, "");
  const description = `${theme.lead} ${theme.items.slice(0, 3).map((item) => item.title).join("、")}など10作品をランキング形式で紹介します。`;

  return {
    title: `${cleanTitle}テーマ別おすすめ10選 | マンガマッチ診断`,
    description,
    alternates: {
      canonical: `/themes/${theme.slug}`,
    },
    openGraph: {
      title: `${cleanTitle}テーマ別おすすめ10選 | マンガマッチ診断`,
      description,
      url: `${siteUrl}/themes/${theme.slug}`,
      siteName: "マンガマッチ診断",
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${cleanTitle}テーマ別おすすめ10選 | マンガマッチ診断`,
      description,
    },
  };
}

export default function ThemeDetailPage({ params }) {
  const theme = findTheme(params.slug);
  if (!theme) notFound();

  return <ArticlePage eyebrow={theme.eyebrow} title={theme.title} lead={theme.lead} items={theme.items} slug={theme.slug} />;
}
