import { CORE_DB as CORE_DB_BASE } from "./coreDB";
import { CORE_DB_EXTRA } from "./coreDB_extra";
import { CORE_DB_EXTRA2 } from "./coreDB_extra2";
import { CORE_DB_EXTRA3 } from "./coreDB_extra3";
import { CORE_DB_EXTRA4 } from "./coreDB_extra4";
import { CORE_DB_EXTRA5 } from "./coreDB_extra5";

export const MANGA_PAGE_SIZE = 30;

export const MANGA_GENRES = [
  { slug: "battle", label: "バトル", tags: ["battle", "action", "burning", "tournament"] },
  { slug: "romance", label: "恋愛", tags: ["romance", "shojo_kirakira", "emotional"] },
  { slug: "fantasy", label: "ファンタジー", tags: ["fantasy", "urban_fantasy", "mythology", "worldbuilding"] },
  { slug: "isekai", label: "異世界", tags: ["fantasy", "journey", "adventure", "worldbuilding"] },
  { slug: "horror", label: "ホラー・ダーク", tags: ["horror", "dark", "brutal", "shock"] },
  { slug: "mystery", label: "ミステリー", tags: ["mystery", "mysterious", "suspense", "twist"] },
  { slug: "sports", label: "スポーツ", tags: ["sports", "tournament", "burning", "coming_of_age"] },
  { slug: "healing", label: "癒し・日常", tags: ["healing", "slice_of_life", "warm", "comfort", "wholesome"] },
  { slug: "sf", label: "SF", tags: ["sci_fi", "space", "post_apocalypse", "virtual"] },
  { slug: "historical", label: "歴史・時代", tags: ["historical", "war", "politics", "nation"] },
  { slug: "workplace", label: "仕事・専門職", tags: ["workplace", "specialty", "workplace_pro", "educational"] },
  { slug: "school", label: "学校・青春", tags: ["school", "coming_of_age", "friendship", "daily_buildup"] },
  { slug: "completed", label: "完結済み", status: "completed" },
  { slug: "ongoing", label: "連載中", status: "ongoing" },
];

export const GENIUS_MANGA_GENRE = {
  slug: "genius",
  label: "天才・頭脳派",
  tags: ["prodigy", "mystery", "psychological", "dialogue", "specialty", "politics"],
};

function normalizeMangaTitle(title) {
  return `${title || ""}`
    .toLowerCase()
    .replace(/[！!？?・:：,，.。'"“”‘’「」『』（）()[\]\s_-]/g, "");
}

function normalizeMangaEntry(manga) {
  return {
    ...manga,
    tags: Array.isArray(manga.tags) ? manga.tags : [],
    title_ja: manga.title_ja || manga.title_en || manga.id,
    title_en: manga.title_en || manga.title_ja || manga.id,
  };
}

function dedupeMangaDatabase(items) {
  const seen = new Set();
  const unique = [];

  for (const raw of items) {
    const manga = normalizeMangaEntry(raw);
    const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    const idKey = manga.id ? `id:${manga.id}` : "";
    if ((key && seen.has(key)) || (idKey && seen.has(idKey))) continue;
    if (key) seen.add(key);
    if (idKey) seen.add(idKey);
    unique.push(manga);
  }

  return unique;
}

export const ALL_MANGA = dedupeMangaDatabase([
  ...CORE_DB_BASE,
  ...CORE_DB_EXTRA,
  ...CORE_DB_EXTRA2,
  ...CORE_DB_EXTRA3,
  ...CORE_DB_EXTRA4,
  ...CORE_DB_EXTRA5,
]);

export const MANGA_BY_ID = new Map(ALL_MANGA.map((manga) => [manga.id, manga]));

export function getMangaById(id) {
  return MANGA_BY_ID.get(id);
}

export function getRelatedManga(manga, limit = 6) {
  if (!manga) return [];
  const tags = new Set(manga.tags || []);
  return ALL_MANGA
    .filter((item) => item.id !== manga.id)
    .map((item) => ({
      manga: item,
      score: (item.tags || []).filter((tag) => tags.has(tag)).length
        + (item.demographic === manga.demographic ? 1 : 0)
        + (item.status === manga.status ? 0.5 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.manga.year || 0) - (a.manga.year || 0))
    .slice(0, limit)
    .map((item) => item.manga);
}

export function getTotalMangaPages(items = ALL_MANGA) {
  return Math.max(1, Math.ceil(items.length / MANGA_PAGE_SIZE));
}

export function getMangaPage(items, page) {
  const safePage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1;
  const start = (safePage - 1) * MANGA_PAGE_SIZE;
  return items.slice(start, start + MANGA_PAGE_SIZE);
}

export function getGenreBySlug(slug) {
  return MANGA_GENRES.find((genre) => genre.slug === slug);
}

export function filterMangaByGenre(genre) {
  if (!genre) return [];
  if (genre.status) return ALL_MANGA.filter((manga) => manga.status === genre.status);
  const genreTags = new Set(genre.tags || []);
  return ALL_MANGA.filter((manga) => manga.tags?.some((tag) => genreTags.has(tag)));
}

export function getGeniusManga() {
  const tags = new Set(GENIUS_MANGA_GENRE.tags);
  return ALL_MANGA
    .filter((manga) => manga.tags?.some((tag) => tags.has(tag)))
    .sort((a, b) => {
      const aScore = (a.tags || []).filter((tag) => tags.has(tag)).length + (a.anime ? 1 : 0);
      const bScore = (b.tags || []).filter((tag) => tags.has(tag)).length + (b.anime ? 1 : 0);
      return bScore - aScore || (b.year || 0) - (a.year || 0);
    });
}
