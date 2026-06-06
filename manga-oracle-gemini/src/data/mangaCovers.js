// ============================================================
// Manga cover metadata
// ============================================================
// Cover data is kept separate from the main manga DB.
// Add entries by manga id so the core database stays clean.
// ============================================================

export const MANGA_COVER_SOURCES = ["manual", "rakuten", "openbd", "google_books", "other"];

/**
 * @typedef {"manual" | "rakuten" | "openbd" | "google_books" | "other"} MangaCoverSource
 *
 * @typedef {Object} MangaCoverInfo
 * @property {string=} isbn13
 * @property {string=} coverImageUrl
 * @property {MangaCoverSource=} coverImageSource
 * @property {boolean=} coverImageVerified
 * @property {string=} coverProductUrl
 * @property {number=} coverVolume
 * @property {boolean=} reviewNeeded
 * @property {string=} updatedAt
 */

/** @type {Record<string, MangaCoverInfo>} */
export const MANGA_COVERS = {
  one_piece: {
    isbn13: "",
    coverImageUrl: "",
    coverImageSource: "manual",
    coverImageVerified: false,
    coverProductUrl: "",
    coverVolume: 1,
    reviewNeeded: true,
    updatedAt: "2026-06-06",
  },
};

// Optional title index for article-only items that do not have DB ids.
// Example: onepiece: "one_piece"
export const MANGA_COVER_TITLE_INDEX = {};

function normalizeTitleForCover(title) {
  return `${title || ""}`
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[!！?？.．・･\s　\-ー―:：()[\]（）「」『』【】]/g, "")
    .trim();
}

export function getMangaCoverById(mangaId) {
  if (!mangaId) return undefined;
  return MANGA_COVERS[mangaId];
}

export function getMangaCoverByTitle(title) {
  const key = normalizeTitleForCover(title);
  if (!key) return undefined;
  const mangaId = MANGA_COVER_TITLE_INDEX[key];
  return mangaId ? getMangaCoverById(mangaId) : undefined;
}

export function getMangaCoverForItem(item) {
  if (!item) return undefined;
  return getMangaCoverById(item.id || item.mangaId) || getMangaCoverByTitle(item.title || item.title_ja || item.title_en);
}

export function hasVerifiedCover(mangaId) {
  const cover = getMangaCoverById(mangaId);
  return Boolean(cover?.coverImageUrl && cover?.coverImageVerified && !cover?.reviewNeeded);
}

export function getCoverImageUrl(mangaId) {
  return getMangaCoverById(mangaId)?.coverImageUrl || "";
}

export function getCoverProductUrl(mangaId) {
  return getMangaCoverById(mangaId)?.coverProductUrl || "";
}
