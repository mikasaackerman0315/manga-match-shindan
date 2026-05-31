import { THEME_GUIDES } from "./themeData";

const siteUrl = "https://www.mangamatchquiz.com";
const articlePaths = [
  "/completed-manga",
  "/emotional-manga",
  "/fantasy-manga",
  "/adult-manga",
  "/beginner-manga",
  "/binge-read-manga",
  "/lighthearted-manga",
  "/trending-manga",
  "/romance-manga",
  "/completed-romance-manga",
  "/isekai-manga",
  "/horror-manga",
  "/sports-manga",
  "/working-adult-manga",
  "/middle-school-manga",
  "/high-school-manga",
];

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/themes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...THEME_GUIDES.map((theme) => ({
      url: `${siteUrl}/themes/${theme.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    })),
    ...articlePaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
