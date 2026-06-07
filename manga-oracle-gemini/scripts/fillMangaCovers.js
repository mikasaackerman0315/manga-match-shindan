const fs = require("node:fs");
const path = require("node:path");

const rootDir = process.cwd();
const priorityPath = path.join(rootDir, "manga-cover-priority-300.json");
const coversPath = path.join(rootDir, "src", "data", "mangaCovers.js");
const reviewPath = path.join(rootDir, "manga-cover-review-needed.json");
const summaryPath = path.join(rootDir, "manga-cover-fill-summary.json");

const rakutenEndpoint = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const openBdEndpoint = "https://api.openbd.jp/v1/get";
const waitMs = Number(process.env.COVER_FILL_WAIT_MS || 650);
const updatedAt = process.env.COVER_UPDATED_AT || "2026-06-06";

function loadDotEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const rows = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const row of rows) {
    const match = row.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

loadDotEnvLocal();

const rakutenAppId =
  process.env.RAKUTEN_APP_ID ||
  process.env.RAKUTEN_APPLICATION_ID ||
  process.env.VITE_RAKUTEN_APP_ID ||
  process.env.NEXT_PUBLIC_RAKUTEN_APP_ID ||
  "";
const rakutenAffiliateId =
  process.env.RAKUTEN_AFFILIATE_ID ||
  process.env.VITE_RAKUTEN_AFFILIATE_ID ||
  "";
const rakutenAccessKey =
  process.env.RAKUTEN_ACCESS_KEY ||
  process.env.VITE_RAKUTEN_ACCESS_KEY ||
  "";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[!！?？:：・.,、。'"“”‘’()[\]【】<>《》〈〉\s　\-ー〜~×x]/g, "")
    .replace(/第?0?1巻|vol(?:ume)?0?1|volumeone|上巻|通常版|電子書籍|コミック|漫画|マンガ/g, "")
    .trim();
}

function normalizeAuthor(value = "") {
  return normalize(String(value).split(/[\/・]/)[0] || value);
}

function cleanIsbn(value = "") {
  return String(value).replace(/[^0-9Xx]/g, "");
}

function isIsbn13(value = "") {
  return /^97[89]\d{10}$/.test(cleanIsbn(value));
}

function volumeOneSignal(title = "") {
  const text = String(title).normalize("NFKC");
  if (/(^|[^0-9])0?1([^0-9]|$)/.test(text) && /巻|vol|volume|コミック/i.test(text)) return true;
  if (/第\s*(?:1|一)\s*巻/.test(text)) return true;
  if (/(?:^|[^0-9])1巻/.test(text)) return true;
  if (/[（(]\s*(?:0?1|一)\s*[）)]/.test(text)) return true;
  return false;
}

function excludedEditionSignal(value = "") {
  return /小説|ライトノベル|novel|公式ガイド|ファンブック|画集|イラスト|設定資料|特装版|限定版|愛蔵版|完全版|文庫|新装版|豪華版|セット|全巻|中古|BOX|box|DVD|Blu-ray|ブルーレイ|映画|アニメ/i.test(String(value));
}

function hasComicSignal(candidate) {
  return /コミック|漫画|マンガ|comic|comics|manga|ジャンプ|マガジン|サンデー|ヤング|モーニング|アフタヌーン|りぼん|花とゆめ|Kiss|フィール|ビッグコミック|booksGenreId:001001/i.test(
    `${candidate.title} ${candidate.publisher} ${candidate.category}`
  );
}

async function getJson(url, extraHeaders = {}) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "MangaMatchCoverFiller/1.0", ...extraHeaders },
    });
    if (!response.ok) return { data: null, error: `http_${response.status}` };
    return { data: await response.json(), error: "" };
  } catch {
    return { data: null, error: "network_error" };
  }
}

function rakutenHeaders() {
  const siteUrl = process.env.SITE_URL || "https://www.mangamatchquiz.com/";
  return {
    ...(rakutenAccessKey ? { accessKey: rakutenAccessKey } : {}),
    Origin: siteUrl.replace(/\/$/, ""),
    Referer: siteUrl,
  };
}

function describeRakutenError(error) {
  if (!error) return "";
  if (error === "http_400") return "rakuten_api_bad_request: check required parameters and credential format";
  if (error === "http_403") return "rakuten_api_forbidden: check Rakuten Books API scope, applicationId/accessKey pair, and allowed web site settings";
  if (error === "network_error") return "rakuten_api_network_error";
  return error;
}

function buildRakutenQueries(item) {
  const baseTitle = item.title || "";
  const author = String(item.author || "").split(/[\/・]/)[0].trim();
  return [
    { title: baseTitle, author, label: "title_author" },
    { keyword: `${baseTitle} ${author} 1巻`, label: "keyword_author_volume" },
    { keyword: `${baseTitle} 1巻`, label: "keyword_volume" },
  ].filter((query) => query.title || query.keyword);
}

function rakutenCandidate(row, queryLabel) {
  const item = row?.Item || row?.item || row;
  if (!item) return null;
  const coverImageUrl = item.largeImageUrl || item.mediumImageUrl || item.smallImageUrl || "";
  const isbn13 = cleanIsbn(item.isbn || "");
  return {
    source: "rakuten",
    queryLabel,
    title: item.title || "",
    author: item.author || "",
    publisher: item.publisherName || "",
    category: `booksGenreId:${item.booksGenreId || ""}`,
    isbn13: isIsbn13(isbn13) ? isbn13 : "",
    coverImageUrl,
    coverProductUrl: item.affiliateUrl || item.itemUrl || "",
  };
}

async function searchRakuten(item) {
  if (!rakutenAppId) {
    return { candidates: [], error: "RAKUTEN_APP_ID is not set" };
  }

  const all = [];
  const errors = [];
  for (const query of buildRakutenQueries(item)) {
    const url = new URL(rakutenEndpoint);
    url.searchParams.set("applicationId", rakutenAppId);
    if (rakutenAffiliateId) url.searchParams.set("affiliateId", rakutenAffiliateId);
    url.searchParams.set("format", "json");
    url.searchParams.set("formatVersion", "2");
    url.searchParams.set("booksGenreId", "001001");
    url.searchParams.set("hits", "10");
    url.searchParams.set("sort", "standard");
    if (query.title) url.searchParams.set("title", query.title);
    if (query.author) url.searchParams.set("author", query.author);
    if (query.keyword) url.searchParams.set("keyword", query.keyword);

    const { data, error } = await getJson(url, rakutenHeaders());
    await sleep(waitMs);
    if (error) {
      errors.push(`${query.label}:${describeRakutenError(error)}`);
      continue;
    }
    const rows = data?.Items || data?.items || [];
    all.push(...rows.map((row) => rakutenCandidate(row, query.label)).filter(Boolean));
  }

  return { candidates: dedupeCandidates(all), error: errors.join(", ") };
}

async function preflightRakuten() {
  if (!rakutenAppId) return "RAKUTEN_APP_ID is not set";
  if (!rakutenAccessKey) return "RAKUTEN_ACCESS_KEY is not set";

  const url = new URL(rakutenEndpoint);
  url.searchParams.set("applicationId", rakutenAppId);
  url.searchParams.set("format", "json");
  url.searchParams.set("title", "ONE PIECE");
  url.searchParams.set("booksGenreId", "001001");
  url.searchParams.set("hits", "1");

  const { error } = await getJson(url, rakutenHeaders());
  await sleep(waitMs);
  return describeRakutenError(error);
}

function openBdCandidate(row) {
  if (!row?.summary) return null;
  const coverImageUrl = row.summary.cover || "";
  if (!coverImageUrl) return null;
  const isbn13 = cleanIsbn(row.summary.isbn || "");
  return {
    source: "openbd",
    queryLabel: "isbn",
    title: row.summary.title || "",
    author: row.summary.author || "",
    publisher: row.summary.publisher || "",
    category: "",
    isbn13: isIsbn13(isbn13) ? isbn13 : "",
    coverImageUrl,
    coverProductUrl: "",
  };
}

async function searchOpenBdByIsbn(isbn13) {
  if (!isIsbn13(isbn13)) return [];
  const url = new URL(openBdEndpoint);
  url.searchParams.set("isbn", cleanIsbn(isbn13));
  const { data } = await getJson(url);
  await sleep(waitMs);
  return Array.isArray(data) ? data.map(openBdCandidate).filter(Boolean) : [];
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const deduped = [];
  for (const candidate of candidates) {
    const key = `${candidate.source}:${candidate.isbn13}:${normalize(candidate.title)}:${candidate.coverImageUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(candidate);
  }
  return deduped;
}

function scoreCandidate(item, candidate) {
  const expectedTitle = normalize(item.title);
  const candidateTitle = normalize(candidate.title);
  const expectedAuthor = normalizeAuthor(item.author);
  const candidateAuthor = normalizeAuthor(candidate.author);
  const joined = `${candidate.title} ${candidate.author} ${candidate.publisher} ${candidate.category}`;
  let score = 0;
  const notes = [];

  if (candidateTitle === expectedTitle) {
    score += 44;
    notes.push("exact_title");
  } else if (candidateTitle.includes(expectedTitle) || expectedTitle.includes(candidateTitle)) {
    score += 34;
    notes.push("near_title");
  }

  if (expectedAuthor && candidateAuthor && (candidateAuthor.includes(expectedAuthor) || expectedAuthor.includes(candidateAuthor))) {
    score += 32;
    notes.push("author");
  }

  if (volumeOneSignal(candidate.title)) {
    score += 14;
    notes.push("volume1");
  }

  if (hasComicSignal(candidate)) {
    score += 10;
    notes.push("comic");
  }

  if (candidate.coverImageUrl) {
    score += 4;
    notes.push("cover");
  }

  if (candidate.isbn13) {
    score += 4;
    notes.push("isbn13");
  }

  if (excludedEditionSignal(joined)) {
    score -= 40;
    notes.push("excluded_edition");
  }

  if (!candidate.coverImageUrl) score -= 30;
  if (!candidate.coverProductUrl && candidate.source === "rakuten") score -= 8;
  if (candidate.source === "rakuten") score += 4;
  if (candidate.source === "openbd") score += 2;

  return {
    ...candidate,
    score: Math.max(0, Math.min(100, score)),
    notes,
  };
}

function shouldAdopt(scored) {
  const safeTitleMatch = scored?.notes.includes("exact_title") || (scored?.notes.includes("near_title") && scored?.notes.includes("volume1"));
  return (
    scored &&
    scored.score >= 82 &&
    safeTitleMatch &&
    scored.notes.includes("author") &&
    scored.notes.includes("volume1") &&
    scored.notes.includes("comic") &&
    !scored.notes.includes("excluded_edition")
  );
}

async function findCover(item) {
  const review = {
    id: item.id,
    title: item.title,
    author: item.author,
    reason: "",
    candidates: [],
  };

  const rakuten = await searchRakuten(item);
  if (rakuten.error) review.reason = rakuten.error;

  let candidates = [...rakuten.candidates];
  for (const candidate of rakuten.candidates.slice(0, 3)) {
    if (!candidate.isbn13) continue;
    candidates.push(...await searchOpenBdByIsbn(candidate.isbn13));
  }

  candidates = dedupeCandidates(candidates);
  const scored = candidates
    .map((candidate) => scoreCandidate(item, candidate))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  review.candidates = scored.slice(0, 5).map((candidate) => ({
    title: candidate.title,
    author: candidate.author,
    source: candidate.source,
    score: candidate.score,
    notes: candidate.notes,
    isbn13: candidate.isbn13,
    productUrl: candidate.coverProductUrl,
  }));

  if (!best) {
    review.reason ||= "no candidate found";
    return { cover: null, review };
  }

  if (!shouldAdopt(best)) {
    review.reason = `not adopted: score=${best.score}, notes=${best.notes.join("|")}`;
    return { cover: null, review };
  }

  const openBdVerification = best.isbn13 ? await searchOpenBdByIsbn(best.isbn13) : [];
  const openBdCover = openBdVerification[0];
  const coverSource = best.source === "openbd" || (openBdCover?.coverImageUrl && !best.coverImageUrl) ? "openbd" : "rakuten";

  return {
    cover: {
      isbn13: best.isbn13 || openBdCover?.isbn13 || "",
      coverImageUrl: best.coverImageUrl || openBdCover?.coverImageUrl || "",
      coverImageSource: coverSource,
      coverImageVerified: true,
      coverProductUrl: best.coverProductUrl || "",
      coverVolume: 1,
      reviewNeeded: false,
      updatedAt,
    },
    review: null,
  };
}

function jsString(value) {
  return JSON.stringify(value);
}

function buildCoversFile(covers) {
  const lines = [
    "// ============================================================",
    "// Manga cover metadata",
    "// ============================================================",
    "// 表紙情報は漫画DB本体を汚さず、作品IDに紐付けて管理する。",
    "// 楽天/openBDから高信頼な1巻表紙だけを採用する。",
    "// ============================================================",
    "",
    "export const MANGA_COVER_SOURCES = [\"manual\", \"rakuten\", \"openbd\", \"google_books\", \"other\"];",
    "",
    "/**",
    " * @typedef {\"manual\" | \"rakuten\" | \"openbd\" | \"google_books\" | \"other\"} MangaCoverSource",
    " *",
    " * @typedef {Object} MangaCoverInfo",
    " * @property {string=} isbn13",
    " * @property {string=} coverImageUrl",
    " * @property {MangaCoverSource=} coverImageSource",
    " * @property {boolean=} coverImageVerified",
    " * @property {string=} coverProductUrl",
    " * @property {number=} coverVolume",
    " * @property {boolean=} reviewNeeded",
    " * @property {string=} updatedAt",
    " */",
    "",
    "/** @type {Record<string, MangaCoverInfo>} */",
    "export const MANGA_COVERS = {",
  ];

  for (const [id, cover] of Object.entries(covers).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`  ${jsString(id)}: ${JSON.stringify(cover)},`);
  }

  lines.push(
    "};",
    "",
    "// 記事ページは現状タイトルだけを持つため、必要になった作品からタイトル索引を足す。",
    "// 例: [\"onepiece\"]: \"one_piece\"",
    "export const MANGA_COVER_TITLE_INDEX = {};",
    "",
    "function normalizeTitleForCover(title) {",
    "  return `${title || \"\"}`",
    "    .toLowerCase()",
    "    .replace(/[!！?？:：・.・\\s　\\-ー〜~×x]/g, \"\")",
    "    .trim();",
    "}",
    "",
    "export function getMangaCoverById(mangaId) {",
    "  if (!mangaId) return undefined;",
    "  return MANGA_COVERS[mangaId];",
    "}",
    "",
    "export function getMangaCoverByTitle(title) {",
    "  const key = normalizeTitleForCover(title);",
    "  const mangaId = MANGA_COVER_TITLE_INDEX[key];",
    "  return mangaId ? getMangaCoverById(mangaId) : undefined;",
    "}",
    "",
    "export function getMangaCoverForItem(item) {",
    "  if (!item) return undefined;",
    "  return getMangaCoverById(item.id || item.mangaId) || getMangaCoverByTitle(item.title || item.title_ja || item.title_en);",
    "}",
    ""
  );

  return lines.join("\n");
}

function parseArgs() {
  const args = new Map(process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }));
  return {
    limit: args.has("limit") ? Number(args.get("limit")) : Infinity,
    start: args.has("start") ? Number(args.get("start")) : 0,
    dryRun: args.get("dry-run") === "true",
  };
}

async function main() {
  const options = parseArgs();
  const priorityItems = JSON.parse(fs.readFileSync(priorityPath, "utf8"));
  const targets = priorityItems.slice(options.start, Number.isFinite(options.limit) ? options.start + options.limit : undefined);
  const covers = {};
  const reviewNeeded = [];
  const preflightError = await preflightRakuten();

  if (preflightError) {
    for (const item of targets) {
      reviewNeeded.push({
        id: item.id,
        title: item.title,
        author: item.author,
        reason: `rakuten_api_unavailable:${preflightError}; openBD title search is unavailable without isbn13`,
        candidates: [],
      });
    }
  } else {
    for (const [index, item] of targets.entries()) {
      const position = options.start + index + 1;
      console.log(`[${position}/${priorityItems.length}] ${item.id} ${item.title}`);
      const result = await findCover(item);
      if (result.cover) {
        covers[item.id] = result.cover;
        console.log(`  adopted ${result.cover.coverImageSource} ${result.cover.isbn13}`);
      } else if (result.review) {
        reviewNeeded.push(result.review);
        console.log(`  review ${result.review.reason}`);
      }
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    targetCount: targets.length,
    adoptedCount: Object.keys(covers).length,
    rakutenCount: Object.values(covers).filter((cover) => cover.coverImageSource === "rakuten").length,
    openbdCount: Object.values(covers).filter((cover) => cover.coverImageSource === "openbd").length,
    reviewNeededCount: reviewNeeded.length,
    hasRakutenAppId: Boolean(rakutenAppId),
    hasRakutenAccessKey: Boolean(rakutenAccessKey),
    preflightError,
    coversFileUpdated: Object.keys(covers).length > 0,
    dryRun: options.dryRun,
  };

  if (!options.dryRun) {
    if (Object.keys(covers).length > 0) {
      fs.writeFileSync(coversPath, buildCoversFile(covers), "utf8");
    }
    fs.writeFileSync(reviewPath, JSON.stringify(reviewNeeded, null, 2), "utf8");
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
