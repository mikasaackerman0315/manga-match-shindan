import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const dbFiles = [
  "src/data/coreDB.js",
  "src/data/coreDB_extra.js",
  "src/data/coreDB_extra2.js",
  "src/data/coreDB_extra3.js",
  "src/data/coreDB_extra4.js",
];

const outDir = path.join(rootDir, "docs");
const summaryPath = path.join(outDir, "db-audit-summary.md");
const duplicateCsvPath = path.join(outDir, "db-audit-duplicate-titles.csv");
const unknownVolumesCsvPath = path.join(outDir, "db-audit-unknown-volumes.csv");
const articleCoverageCsvPath = path.join(outDir, "db-audit-article-coverage.csv");

function readDbArray(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const exportMatch = source.match(/export\s+const\s+\w+\s*=\s*\[/);
  const start = exportMatch ? exportMatch.index + exportMatch[0].lastIndexOf("[") : -1;
  const end = source.lastIndexOf("];");
  if (start === -1 || end === -1) {
    throw new Error(`Could not find exported array in ${filePath}`);
  }

  const body = source.slice(start, end + 1);
  return Function(`"use strict"; return (${body});`)();
}

function normalizeTitle(title) {
  return `${title || ""}`
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[!！?？:：;；,，.。・･\s\-ー―–—~〜「」『』（）()［\][]/g, "")
    .trim();
}

function countBy(list, getKey) {
  return list.reduce((acc, item) => {
    const key = getKey(item) || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.sourceFile !== b.sourceFile) return a.sourceFile.localeCompare(b.sourceFile);
    return a.sourceIndex - b.sourceIndex;
  });
}

function csvEscape(value) {
  const text = `${value ?? ""}`;
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll("\"", "\"\"")}"`;
  return text;
}

function toCsv(rows, columns) {
  return [
    columns.map((column) => csvEscape(column.label)).join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(column.value(row))).join(",")),
  ].join("\n") + "\n";
}

function formatTokyoDate(date) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function duplicatePriority(matches) {
  const authors = new Set(matches.map((entry) => entry.author));
  const years = new Set(matches.map((entry) => entry.year));
  const exactTitles = new Set(matches.map((entry) => entry.title_ja));
  if (authors.size === 1 && years.size === 1 && exactTitles.size === 1) return "high";
  if (authors.size === 1 || exactTitles.size === 1) return "medium";
  return "low";
}

function isUnknownVolume(entry) {
  return !Number.isInteger(entry.volumes) || entry.volumes <= 0 || entry.volumes > 250;
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return [fullPath];
  });
}

function extractArticleTitles() {
  const appDir = path.join(rootDir, "src", "app");
  const files = walkFiles(appDir).filter((file) => file.endsWith("page.jsx") || file.endsWith("themeData.js"));
  const rows = [];

  files.forEach((file) => {
    const source = fs.readFileSync(file, "utf8");
    const relativeFile = path.relative(rootDir, file).replaceAll("\\", "/");

    for (const match of source.matchAll(/\{\s*title:\s*"([^"]+)"\s*,\s*meta:\s*"/g)) {
      rows.push({ title: match[1], sourceFile: relativeFile, sourceType: "seo_article_card" });
    }

    for (const match of source.matchAll(/\["([^"]+)",\s*"[^"]+",\s*"[^"]+",\s*"[^"]+"\]/g)) {
      rows.push({ title: match[1], sourceFile: relativeFile, sourceType: "theme_article_card" });
    }
  });

  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.sourceFile}:${normalizeTitle(row.title)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return normalizeTitle(row.title);
  }).sort((a, b) => {
    if (a.sourceFile !== b.sourceFile) return a.sourceFile.localeCompare(b.sourceFile);
    return a.title.localeCompare(b.title, "ja");
  });
}

const entries = [];

dbFiles.forEach((relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const list = readDbArray(filePath);
  list.forEach((entry, index) => {
    entries.push({ ...entry, sourceFile: relativePath, sourceIndex: index + 1 });
  });
});

const byId = new Map();
const byTitle = new Map();

entries.forEach((entry) => {
  byId.set(entry.id, [...(byId.get(entry.id) || []), entry]);
  const titleKey = normalizeTitle(entry.title_ja || entry.title_en);
  if (titleKey) byTitle.set(titleKey, [...(byTitle.get(titleKey) || []), entry]);
});

const dbTitleKeys = new Set();
entries.forEach((entry) => {
  [entry.title_ja, entry.title_en].forEach((title) => {
    const titleKey = normalizeTitle(title);
    if (titleKey) dbTitleKeys.add(titleKey);
  });
});

const duplicateIdGroups = [...byId.entries()].filter(([, matches]) => matches.length > 1);
const duplicateTitleGroups = [...byTitle.entries()]
  .filter(([, matches]) => matches.length > 1)
  .map(([titleKey, matches]) => ({
    titleKey,
    priority: duplicatePriority(matches),
    matches: sortEntries(matches),
  }))
  .sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.matches.length - a.matches.length;
  });

const unknownVolumes = sortEntries(entries.filter(isUnknownVolume));
const duplicateRows = duplicateTitleGroups.flatMap((group) => group.matches.map((entry) => ({
  priority: group.priority,
  titleKey: group.titleKey,
  matchCount: group.matches.length,
  ...entry,
})));

const unknownVolumeRows = unknownVolumes.map((entry) => ({
  ...entry,
  titleKey: normalizeTitle(entry.title_ja || entry.title_en),
  volumeIssue: entry.volumes > 250 ? "suspicious_large_volume" : "unknown_or_zero_volume",
}));

const articleCoverageRows = extractArticleTitles().map((row) => {
  const titleKey = normalizeTitle(row.title);
  const matched = dbTitleKeys.has(titleKey);
  return {
    ...row,
    titleKey,
    coverageStatus: matched ? "exact_match" : "missing_or_variant",
    suggestedAction: matched ? "" : "DB未登録か表記ゆれの可能性を確認",
  };
});

const demographicCounts = countBy(entries, (entry) => entry.demographic);
const statusCounts = countBy(entries, (entry) => entry.status);
const fileCounts = countBy(entries, (entry) => entry.sourceFile);
const unknownVolumesByFile = countBy(unknownVolumes, (entry) => entry.sourceFile);
const unknownVolumesByDemographic = countBy(unknownVolumes, (entry) => entry.demographic);
const duplicatePriorities = countBy(duplicateTitleGroups, (group) => group.priority);
const articleCoverageCounts = countBy(articleCoverageRows, (row) => row.coverageStatus);
const uniqueTitleCount = byTitle.size;

const topDuplicateGroups = duplicateTitleGroups.slice(0, 20).map((group, index) => {
  const titles = group.matches
    .map((entry) => `${entry.title_ja} / ${entry.id} / ${entry.sourceFile}#${entry.sourceIndex}`)
    .join("; ");
  return `${index + 1}. [${group.priority}] ${group.titleKey} (${group.matches.length}件): ${titles}`;
});

const topArticleGaps = articleCoverageRows
  .filter((row) => row.coverageStatus === "missing_or_variant")
  .slice(0, 30)
  .map((row, index) => `${index + 1}. ${row.title} (${row.sourceType}, ${row.sourceFile})`);

const summary = `# 漫画DB品質監査サマリー

生成日: ${formatTokyoDate(new Date())}

## 全体
- 生DB件数: ${entries.length}
- ユニークID数: ${byId.size}
- タイトル正規化後の候補数: ${uniqueTitleCount}
- ID重複グループ: ${duplicateIdGroups.length}
- タイトル重複グループ: ${duplicateTitleGroups.length}
- 巻数未確認または異常値: ${unknownVolumes.length}

## ファイル別件数

${Object.entries(fileCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## デモグラフィック別件数

${Object.entries(demographicCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## ステータス別件数

${Object.entries(statusCounts).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## タイトル重複の優先度
- high: ${duplicatePriorities.high || 0}
- medium: ${duplicatePriorities.medium || 0}
- low: ${duplicatePriorities.low || 0}

優先度の目安:

- high: タイトル、作者、開始年が同じ。完全重複の可能性が高い。
- medium: タイトルまたは作者が同じ。表記ゆれ、続編、関連作の確認が必要。
- low: 正規化後のタイトルだけが一致。誤検出の可能性もある。

### 優先確認リスト 上位20件

${topDuplicateGroups.join("\n")}

## 巻数未確認または異常値

ファイル別:

${Object.entries(unknownVolumesByFile).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

デモグラフィック別:

${Object.entries(unknownVolumesByDemographic).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## 記事掲載作品とDBの一致

- exact_match: ${articleCoverageCounts.exact_match || 0}
- missing_or_variant: ${articleCoverageCounts.missing_or_variant || 0}

### 記事側で確認したい作品 上位30件

${topArticleGaps.length ? topArticleGaps.join("\n") : "該当なし"}

## 出力ファイル

- \`docs/db-audit-duplicate-titles.csv\`
- \`docs/db-audit-unknown-volumes.csv\`
- \`docs/db-audit-article-coverage.csv\`

## 次にやると効果が大きいこと

1. high のタイトル重複を確認し、完全重複ならDBから除外する。
2. 記事掲載作品の missing_or_variant を見て、DB未登録なのか表記ゆれなのか確認する。
3. 巻数が0または250超の作品は、UIでは「巻数未確認」として扱いながら、人気記事掲載作品から順に補正する。
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(summaryPath, summary, "utf8");
fs.writeFileSync(duplicateCsvPath, toCsv(duplicateRows, [
  { label: "priority", value: (row) => row.priority },
  { label: "title_key", value: (row) => row.titleKey },
  { label: "match_count", value: (row) => row.matchCount },
  { label: "id", value: (row) => row.id },
  { label: "title_ja", value: (row) => row.title_ja },
  { label: "title_en", value: (row) => row.title_en },
  { label: "author", value: (row) => row.author },
  { label: "year", value: (row) => row.year },
  { label: "volumes", value: (row) => row.volumes },
  { label: "status", value: (row) => row.status },
  { label: "demographic", value: (row) => row.demographic },
  { label: "source_file", value: (row) => row.sourceFile },
  { label: "source_index", value: (row) => row.sourceIndex },
]), "utf8");
fs.writeFileSync(unknownVolumesCsvPath, toCsv(unknownVolumeRows, [
  { label: "volume_issue", value: (row) => row.volumeIssue },
  { label: "title_key", value: (row) => row.titleKey },
  { label: "id", value: (row) => row.id },
  { label: "title_ja", value: (row) => row.title_ja },
  { label: "title_en", value: (row) => row.title_en },
  { label: "author", value: (row) => row.author },
  { label: "year", value: (row) => row.year },
  { label: "volumes", value: (row) => row.volumes },
  { label: "status", value: (row) => row.status },
  { label: "demographic", value: (row) => row.demographic },
  { label: "source_file", value: (row) => row.sourceFile },
  { label: "source_index", value: (row) => row.sourceIndex },
]), "utf8");
fs.writeFileSync(articleCoverageCsvPath, toCsv(articleCoverageRows, [
  { label: "coverage_status", value: (row) => row.coverageStatus },
  { label: "title", value: (row) => row.title },
  { label: "title_key", value: (row) => row.titleKey },
  { label: "source_type", value: (row) => row.sourceType },
  { label: "source_file", value: (row) => row.sourceFile },
  { label: "suggested_action", value: (row) => row.suggestedAction },
]), "utf8");

console.log(JSON.stringify({
  total: entries.length,
  uniqueIds: byId.size,
  uniqueTitles: uniqueTitleCount,
  duplicateIdGroups: duplicateIdGroups.length,
  duplicateTitleGroups: duplicateTitleGroups.length,
  unknownVolumes: unknownVolumes.length,
  articleCoverage: articleCoverageCounts,
  outputs: [
    path.relative(rootDir, summaryPath),
    path.relative(rootDir, duplicateCsvPath),
    path.relative(rootDir, unknownVolumesCsvPath),
    path.relative(rootDir, articleCoverageCsvPath),
  ],
}, null, 2));
