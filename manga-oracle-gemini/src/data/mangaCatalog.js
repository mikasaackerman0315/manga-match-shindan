import { CORE_DB as CORE_DB_BASE } from "./coreDB";
import { CORE_DB_EXTRA } from "./coreDB_extra";
import { CORE_DB_EXTRA2 } from "./coreDB_extra2";
import { CORE_DB_EXTRA3 } from "./coreDB_extra3";
import { CORE_DB_EXTRA4 } from "./coreDB_extra4";
import { CORE_DB_EXTRA5 } from "./coreDB_extra5";

export const MANGA_PAGE_SIZE = 30;

export const MANGA_GENRES = [
  { slug: "battle", label: "バトル・アクション", group: "genre", tags: ["battle", "action", "burning", "tournament", "dynamic"], threshold: 1 },
  { slug: "romance", label: "恋愛・ラブコメ", group: "genre", tags: ["romance", "shojo_kirakira", "emotional", "warm"], threshold: 1 },
  { slug: "fantasy", label: "ファンタジー", group: "world", tags: ["fantasy", "urban_fantasy", "mythology", "worldbuilding"], threshold: 1 },
  { slug: "isekai", label: "異世界・冒険", group: "world", tags: ["fantasy", "journey", "adventure", "worldbuilding", "global_travel"], threshold: 2 },
  { slug: "dark_fantasy", label: "ダークファンタジー", group: "world", tags: ["fantasy", "dark", "horror", "brutal", "supernatural"], threshold: 2 },
  { slug: "horror", label: "ホラー", group: "genre", tags: ["horror", "supernatural", "shock", "dark"], threshold: 1 },
  { slug: "mystery", label: "ミステリー", group: "genre", tags: ["mystery", "mysterious", "twist", "mystery_box"], threshold: 1 },
  { slug: "suspense", label: "サスペンス・心理", group: "genre", tags: ["suspense", "psychological", "tense", "survival", "underworld"], threshold: 1 },
  { slug: "sports", label: "スポーツ", group: "genre", tags: ["sports", "tournament", "burning", "coming_of_age"], threshold: 1 },
  { slug: "healing", label: "癒し・日常", group: "mood", tags: ["healing", "slice_of_life", "warm", "comfort", "wholesome"], threshold: 1 },
  { slug: "comedy", label: "ギャグ・コメディ", group: "mood", tags: ["light_comedy", "comedy_gag", "satirical", "chaos"], threshold: 1 },
  { slug: "emotional", label: "泣ける・人間ドラマ", group: "mood", tags: ["emotional", "human_drama", "family_theme", "emotional_catharsis"], threshold: 1 },
  { slug: "sf", label: "SF・近未来", group: "world", tags: ["sci_fi", "space", "post_apocalypse", "virtual", "time_loop"], threshold: 1 },
  { slug: "historical", label: "歴史・時代", group: "world", tags: ["historical", "war", "politics", "nation"], threshold: 1 },
  { slug: "workplace", label: "仕事・専門職", group: "theme", tags: ["workplace", "specialty", "workplace_pro", "educational"], threshold: 1 },
  { slug: "gourmet", label: "グルメ・料理", group: "theme", tags: ["specialty", "workplace", "educational", "healing"], keywords: ["食", "料理", "グルメ", "めし", "ごはん", "酒", "珈琲", "ラーメン"], threshold: 2 },
  { slug: "school", label: "学校・青春", group: "theme", tags: ["school", "coming_of_age", "friendship", "daily_buildup"], threshold: 1 },
  { slug: "short", label: "短く読みやすい", group: "purpose", tags: ["episodic", "anthology", "light_comedy", "slice_of_life"], maxVolumes: 12, threshold: 1 },
  { slug: "anime", label: "アニメ化作品", group: "purpose", anime: true },
  { slug: "award", label: "受賞・高評価", group: "purpose", tags: ["award", "critic", "bestseller", "legendary"], threshold: 1 },
  { slug: "classic", label: "名作・定番", group: "purpose", tags: ["classic", "legendary", "global", "bestseller", "shonen_classic"], threshold: 1 },
  { slug: "web", label: "Web・縦読み", group: "format", demographic: "web", tags: ["webtoon_color", "web"], threshold: 1 },
  { slug: "completed", label: "完結済み", group: "status", status: "completed" },
  { slug: "ongoing", label: "連載中", group: "status", status: "ongoing" },
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
  if (genre.anime) return ALL_MANGA.filter((manga) => manga.anime === true);
  if (genre.demographic) return ALL_MANGA.filter((manga) => manga.demographic === genre.demographic);

  const genreTags = new Set(genre.tags || []);
  const threshold = genre.threshold || 1;
  const keywordPattern = genre.keywords?.length ? new RegExp(genre.keywords.join("|"), "i") : null;

  return ALL_MANGA
    .map((manga) => {
      const tags = manga.tags || [];
      const tagScore = tags.reduce((score, tag) => score + (genreTags.has(tag) ? 1 : 0), 0);
      const keywordScore = keywordPattern && keywordPattern.test(`${manga.title_ja || ""} ${manga.title_en || ""} ${manga.desc_ja || ""}`) ? 1 : 0;
      const volumeScore = genre.maxVolumes && manga.volumes && manga.volumes <= genre.maxVolumes ? 1 : 0;
      const score = tagScore * 3 + keywordScore * 2 + volumeScore;
      return { manga, score, tagScore };
    })
    .filter(({ manga, score, tagScore }) => {
      if (genre.maxVolumes && manga.volumes && manga.volumes > genre.maxVolumes) return false;
      return tagScore >= threshold || score >= threshold * 3;
    })
    .sort((a, b) => b.score - a.score || (b.manga.year || 0) - (a.manga.year || 0))
    .map((item) => item.manga);
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
