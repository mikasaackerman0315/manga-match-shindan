import { notFound } from "next/navigation";
import { ArticlePage } from "../../articles";
import { THEME_GUIDES, findTheme } from "../../themeData";

export function generateStaticParams() {
  return THEME_GUIDES.map((theme) => ({ slug: theme.slug }));
}

export function generateMetadata({ params }) {
  const theme = findTheme(params.slug);
  if (!theme) return {};

  return {
    title: `${theme.title} | マンガマッチ診断`,
    description: theme.lead,
  };
}

export default function ThemeDetailPage({ params }) {
  const theme = findTheme(params.slug);
  if (!theme) notFound();

  return <ArticlePage eyebrow={theme.eyebrow} title={theme.title} lead={theme.lead} items={theme.items} />;
}
