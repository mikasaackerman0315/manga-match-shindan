import { THEME_GUIDES } from "./themeData";
import { ALL_MANGA, filterMangaByGenre, getGeniusManga, getTotalMangaPages, MANGA_GENRES } from "../data/mangaCatalog";

const siteUrl = "https://www.mangamatchquiz.com";
const articlePaths = [
  "/completed-manga",
  "/new-manga-2020s",
  "/battle-manga",
  "/mystery-manga",
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
  "/workplace-manga",
  "/healing-manga",
  "/middle-school-manga",
  "/high-school-manga",
];

export default function sitemap() {
  const now = new Date();
  const mangaPages = Array.from({ length: getTotalMangaPages(ALL_MANGA) }, (_, index) => index + 1);
  const genrePages = MANGA_GENRES.flatMap((genre) => {
    const totalPages = getTotalMangaPages(filterMangaByGenre(genre));
    return Array.from({ length: totalPages }, (_, index) => ({
      genre,
      page: index + 1,
    }));
  });
  const geniusPages = Array.from({ length: getTotalMangaPages(getGeniusManga()) }, (_, index) => index + 1);

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
    ...mangaPages.map((page) => ({
      url: page === 1 ? `${siteUrl}/manga` : `${siteUrl}/manga/page/${page}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: page === 1 ? 0.85 : 0.55,
    })),
    {
      url: `${siteUrl}/manga/genres`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...genrePages.map(({ genre, page }) => ({
      url: page === 1 ? `${siteUrl}/manga/genre/${genre.slug}` : `${siteUrl}/manga/genre/${genre.slug}/page/${page}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: page === 1 ? 0.75 : 0.5,
    })),
    ...geniusPages.map((page) => ({
      url: page === 1 ? `${siteUrl}/genius-manga` : `${siteUrl}/genius-manga/page/${page}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: page === 1 ? 0.8 : 0.5,
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
