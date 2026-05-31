import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "src", "data");
const dbFiles = ["coreDB.js", "coreDB_extra.js", "coreDB_extra2.js", "coreDB_extra3.js"];
const outputPath = path.join(dataDir, "coverOverrides.generated.js");
const reviewCsvPath = path.join(rootDir, "cover-review.csv");
const resultJsonPath = path.join(rootDir, "cover-results.json");
const openBdEndpoint = "https://api.openbd.jp/v1/get";
const googleBooksEndpoint = "https://www.googleapis.com/books/v1/volumes";
const rakutenEndpoint = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const waitMs = Number(process.env.COVER_ENRICH_WAIT_MS || 350);

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = "true"] = arg.replace(/^--/, "").split("=");
  return [key, value];
}));

const limit = args.has("limit") ? Number(args.get("limit")) : Infinity;
const start = args.has("start") ? Number(args.get("start")) : 0;
const onlyId = args.get("id") || "";
const dryRun = args.get("dry-run") === "true";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[!?.,:;\s"'()[\]<>]/g, "");
}

function toCsvValue(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function isLikelyIsbn13(value = "") {
  return /^97[89]\d{10}$/.test(String(value).replace(/[^0-9Xx]/g, ""));
}

function cleanIsbn(value = "") {
  return String(value).replace(/[^0-9Xx]/g, "");
}

function parseEntries(source) {
  const entries = [];
  const entryRe = /\{\s*id:\s*"([^"]+)",\s*title_ja:\s*"([^"]*)",\s*title_en:\s*"([^"]*)",\s*author:\s*"([^"]*)",\s*year:\s*([^,]+),\s*volumes:\s*([^,]+),/g;
  let match;
  while ((match = entryRe.exec(source))) {
    entries.push({
      id: match[1],
      title_ja: match[2],
      title_en: match[3],
      author: match[4],
      year: Number(match[5]) || null,
      volumes: Number(match[6]) || null,
    });
  }
  return entries;
}

async function loadMangaEntries() {
  const all = [];
  for (const file of dbFiles) {
    const source = await fs.readFile(path.join(dataDir, file), "utf8");
    all.push(...parseEntries(source));
  }
  const seen = new Set();
  return all.filter((entry) => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

async function loadExistingOverrides() {
  try {
    const source = await fs.readFile(outputPath, "utf8");
    const match = source.match(/export const COVER_OVERRIDES = (\{[\s\S]*\});?/);
    if (!match) return {};
    const jsonish = match[1].replace(/,\s*}/g, "}");
    return JSON.parse(jsonish);
  } catch {
    return {};
  }
}

async function getJson(url) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "MangaMatchCoverEnricher/1.0" } });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function openBdCandidate(row) {
  if (!row?.summary?.isbn || !row?.summary?.cover) return null;
  return {
    source: "openBD",
    title: row.summary.title || "",
    authors: [row.summary.author || ""].filter(Boolean),
    publisher: row.summary.publisher || "",
    isbn13: cleanIsbn(row.summary.isbn),
    coverUrl: row.summary.cover,
    categories: [],
    itemUrl: "",
  };
}

async function searchOpenBdByIsbn(isbn13) {
  if (!isLikelyIsbn13(isbn13)) return [];
  const url = new URL(openBdEndpoint);
  url.searchParams.set("isbn", cleanIsbn(isbn13));
  const data = await getJson(url);
  await sleep(waitMs);
  return Array.isArray(data) ? data.map(openBdCandidate).filter(Boolean) : [];
}

function googleCandidate(item) {
  const info = item?.volumeInfo || {};
  const identifiers = info.industryIdentifiers || [];
  const isbn13 = cleanIsbn(identifiers.find((id) => id.type === "ISBN_13")?.identifier || identifiers[0]?.identifier || "");
  const coverUrl = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
  if (!coverUrl) return null;
  return {
    source: "googleBooks",
    title: info.title || "",
    authors: info.authors || [],
    publisher: info.publisher || "",
    isbn13,
    coverUrl: coverUrl.replace(/^http:/, "https:"),
    categories: info.categories || [],
    itemUrl: info.infoLink || "",
  };
}

async function searchGoogleBooks(entry) {
  const url = new URL(googleBooksEndpoint);
  const query = [`intitle:${entry.title_ja || entry.title_en}`, entry.author && `inauthor:${entry.author}`, "manga OR comic"].filter(Boolean).join(" ");
  url.searchParams.set("q", query);
  url.searchParams.set("country", "JP");
  url.searchParams.set("maxResults", "10");
  url.searchParams.set("printType", "books");
  const data = await getJson(url);
  await sleep(waitMs);
  return (data?.items || []).map(googleCandidate).filter(Boolean);
}

function rakutenCandidate(item) {
  const coverUrl = item?.largeImageUrl || item?.mediumImageUrl || item?.smallImageUrl || "";
  if (!coverUrl) return null;
  return {
    source: "rakuten",
    title: item.title || "",
    authors: [item.author || ""].filter(Boolean),
    publisher: item.publisherName || "",
    isbn13: cleanIsbn(item.isbn || ""),
    coverUrl,
    categories: [item.booksGenreId || ""].filter(Boolean),
    itemUrl: item.affiliateUrl || item.itemUrl || "",
  };
}

async function searchRakuten(entry) {
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  if (!applicationId || !accessKey) return [];

  const url = new URL(rakutenEndpoint);
  url.searchParams.set("applicationId", applicationId);
  url.searchParams.set("accessKey", accessKey);
  if (process.env.RAKUTEN_AFFILIATE_ID) url.searchParams.set("affiliateId", process.env.RAKUTEN_AFFILIATE_ID);
  url.searchParams.set("format", "json");
  url.searchParams.set("formatVersion", "2");
  url.searchParams.set("title", entry.title_ja || entry.title_en);
  url.searchParams.set("author", entry.author);
  url.searchParams.set("booksGenreId", "001001");
  url.searchParams.set("hits", "10");
  url.searchParams.set("sort", "standard");
  const data = await getJson(url);
  await sleep(waitMs);
  return (data?.Items || data?.items || []).map((row) => rakutenCandidate(row?.Item || row?.item || row)).filter(Boolean);
}

function scoreCandidate(entry, candidate) {
  const expectedTitles = [entry.title_ja, entry.title_en].filter(Boolean).map(normalize);
  const candidateTitle = normalize(candidate.title);
  const candidateAuthors = normalize(candidate.authors.join(" "));
  const candidatePublisher = normalize(candidate.publisher);
  const candidateCategories = normalize(candidate.categories.join(" "));
  let score = 0;
  const notes = [];

  if (expectedTitles.some((title) => title && candidateTitle.includes(title))) {
    score += 46;
    notes.push("title");
  }
  if (expectedTitles.some((title) => title && title.includes(candidateTitle) && candidateTitle.length >= 4)) {
    score += 18;
    notes.push("short_title");
  }
  if (entry.author && candidateAuthors.includes(normalize(entry.author))) {
    score += 28;
    notes.push("author");
  }
  if (/(^|[^0-9])(?:1|01)(?:巻|$|[^0-9])/.test(candidate.title) || /第(?:1|一)巻/.test(candidate.title)) {
    score += 8;
    notes.push("volume1");
  }
  if (/漫画|コミック|comic|comics|jump|magazine|sunday|young|manga/i.test(`${candidate.title} ${candidatePublisher} ${candidateCategories}`)) {
    score += 10;
    notes.push("comic");
  }
  if (candidate.isbn13 && isLikelyIsbn13(candidate.isbn13)) {
    score += 6;
    notes.push("isbn");
  }
  if (/小説|ライトノベル|novel|公式ガイド|ファンブック|画集|イラスト|特装版|限定版|愛蔵版|完全版|文庫|セット|全巻|中古|box|dvd|blu-ray/i.test(`${candidate.title} ${candidatePublisher} ${candidateCategories}`)) {
    score -= 28;
    notes.push("penalty");
  }
  if (candidate.source === "openBD") score += 4;
  if (candidate.source === "rakuten") score += 2;

  return { ...candidate, score: Math.max(0, Math.min(100, score)), notes };
}

async function enrichOne(entry) {
  const candidates = [];
  if (entry.isbn13) candidates.push(...await searchOpenBdByIsbn(entry.isbn13));
  candidates.push(...await searchGoogleBooks(entry));
  candidates.push(...await searchRakuten(entry));

  const withOpenBd = [];
  for (const candidate of candidates) {
    withOpenBd.push(candidate);
    if (candidate.isbn13) {
      const verified = await searchOpenBdByIsbn(candidate.isbn13);
      withOpenBd.push(...verified);
    }
  }

  const ranked = withOpenBd
    .map((candidate) => scoreCandidate(entry, candidate))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0] || null;
  const confidence = best?.score || 0;

  return {
    entry,
    best,
    override: best && confidence >= 60 ? {
      title_ja: entry.title_ja,
      title_en: entry.title_en,
      isbn13: best.isbn13 || null,
      coverUrl: confidence >= 60 ? best.coverUrl : null,
      itemUrl: best.itemUrl || null,
      coverSource: best.source,
      coverConfidence: confidence,
      reviewNeeded: confidence < 80,
    } : {
      title_ja: entry.title_ja,
      title_en: entry.title_en,
      isbn13: best?.isbn13 || null,
      coverUrl: null,
      itemUrl: best?.itemUrl || null,
      coverSource: best?.source || null,
      coverConfidence: confidence,
      reviewNeeded: true,
    },
  };
}

function buildGeneratedFile(overrides) {
  const entries = Object.entries(overrides).filter(([, override]) => override?.coverUrl);
  const lines = [
    "// ============================================================",
    "// MANGA MATCH - Cover metadata overrides",
    "// ============================================================",
    "// Generated by scripts/enrichCovers.mjs.",
    "// Keep manga DB files unchanged; add cover metadata here by manga id.",
    "// ============================================================",
    "",
    "export const COVER_OVERRIDES = {",
    ...entries.map(([id, override]) => `  ${JSON.stringify(id)}: ${JSON.stringify(override)},`),
    "};",
    "",
  ];
  return lines.join("\n");
}

function buildReviewCsv(results) {
  const rows = [
    ["id", "title_ja", "title_en", "author", "confidence", "reviewNeeded", "source", "isbn13", "coverUrl", "itemUrl"].map(toCsvValue).join(","),
    ...results.map(({ entry, override }) => [
      entry.id,
      entry.title_ja,
      entry.title_en,
      entry.author,
      override.coverConfidence,
      override.reviewNeeded,
      override.coverSource,
      override.isbn13,
      override.coverUrl,
      override.itemUrl,
    ].map(toCsvValue).join(",")),
  ];
  return rows.join("\n");
}

async function main() {
  const entries = await loadMangaEntries();
  const existingOverrides = await loadExistingOverrides();
  const targets = entries
    .filter((entry) => !onlyId || entry.id === onlyId)
    .slice(start, Number.isFinite(limit) ? start + limit : undefined);
  const results = [];

  for (const [index, entry] of targets.entries()) {
    console.log(`[${start + index + 1}/${entries.length}] ${entry.id} ${entry.title_ja || entry.title_en}`);
    results.push(await enrichOne(entry));
  }

  if (!dryRun) {
    const mergedOverrides = { ...existingOverrides };
    for (const { entry, override } of results) {
      if (override.coverUrl || override.reviewNeeded) mergedOverrides[entry.id] = override;
    }
    await fs.writeFile(outputPath, buildGeneratedFile(mergedOverrides), "utf8");
    await fs.writeFile(reviewCsvPath, buildReviewCsv(results), "utf8");
    await fs.writeFile(resultJsonPath, JSON.stringify(results, null, 2), "utf8");
  }

  const adopted = results.filter((result) => result.override.coverUrl).length;
  const reviewNeeded = results.filter((result) => result.override.reviewNeeded).length;
  console.log(`Done. adopted=${adopted} reviewNeeded=${reviewNeeded} total=${results.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
