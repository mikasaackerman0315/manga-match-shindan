export const WATCH_LATER_STORAGE_KEY = "manga_match_watch_later_v1";
export const WATCH_LATER_EVENT = "manga-match-watch-later-updated";

const THEME_RULES = [
  { key: "trend", label: "トレンド", tags: ["viral", "bestseller", "anime_yes", "global"] },
  { key: "battle", label: "バトル", tags: ["battle", "action", "burning", "tournament"] },
  { key: "fantasy", label: "ファンタジー", tags: ["fantasy", "worldbuilding", "mythology", "urban_fantasy"] },
  { key: "romance", label: "恋愛", tags: ["romance", "shojo_kirakira", "emotional"] },
  { key: "mystery", label: "ミステリー", tags: ["mystery", "suspense", "psychological", "twist"] },
  { key: "horror", label: "ホラー", tags: ["horror", "dark", "brutal", "shock"] },
  { key: "sports", label: "スポーツ", tags: ["sports", "underdog_growth"] },
  { key: "healing", label: "癒し", tags: ["healing", "warm", "comfort", "wholesome"] },
  { key: "workplace", label: "仕事", tags: ["workplace", "workplace_pro", "specialty"] },
  { key: "classic", label: "名作", tags: ["classic", "legendary", "award"] },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeKey(value = "") {
  return `${value}`.trim().toLowerCase().replace(/\s+/g, "_");
}

export function getWatchLaterTheme(item = {}) {
  const tags = new Set(item.tags || []);
  const matched = THEME_RULES.find((theme) => theme.tags.some((tag) => tags.has(tag)));
  return matched || { key: "other", label: "その他" };
}

export function normalizeWatchLaterItem(item = {}, sourceContext = "") {
  const title = item.title_ja || item.title_en || item.title || "";
  const id = item.id || `title_${normalizeKey(title)}`;
  const theme = getWatchLaterTheme(item);

  return {
    id,
    title_ja: item.title_ja || item.title || title,
    title_en: item.title_en || item.title || title,
    author: item.author || "",
    year: item.year || null,
    volumes: item.volumes || null,
    status: item.status || "",
    demographic: item.demographic || "",
    anime: Boolean(item.anime),
    tags: item.tags || [],
    description: item.description || item.desc_ja || item.lead || "",
    source: item.source || "",
    sourceContext,
    themeKey: theme.key,
    themeLabel: theme.label,
    addedAt: item.addedAt || new Date().toISOString(),
  };
}

export function readWatchLaterItems() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(WATCH_LATER_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWatchLaterItems(items = []) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(WATCH_LATER_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WATCH_LATER_EVENT));
}

export function isWatchLaterSaved(item = {}) {
  const normalized = normalizeWatchLaterItem(item);
  return readWatchLaterItems().some((saved) => saved.id === normalized.id);
}

export function addWatchLaterItem(item = {}, sourceContext = "") {
  const normalized = normalizeWatchLaterItem(item, sourceContext);
  const current = readWatchLaterItems();
  const exists = current.some((saved) => saved.id === normalized.id);
  const next = exists
    ? current.map((saved) => saved.id === normalized.id ? { ...saved, ...normalized, addedAt: saved.addedAt } : saved)
    : [normalized, ...current];
  writeWatchLaterItems(next);
  return normalized;
}

export function removeWatchLaterItem(itemOrId) {
  const id = typeof itemOrId === "string" ? itemOrId : normalizeWatchLaterItem(itemOrId).id;
  const next = readWatchLaterItems().filter((saved) => saved.id !== id);
  writeWatchLaterItems(next);
}
