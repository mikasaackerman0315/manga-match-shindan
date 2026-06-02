import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const strictMode = process.argv.includes("--strict");
const showDetails = strictMode || process.argv.includes("--details");
const dbFiles = [
  "src/data/coreDB.js",
  "src/data/coreDB_extra.js",
  "src/data/coreDB_extra2.js",
  "src/data/coreDB_extra3.js",
];

const allowedStatuses = new Set(["completed", "ongoing", "hiatus"]);
const allowedDemographics = new Set(["shonen", "shojo", "seinen", "josei", "web", "kodomo"]);
const allowedTags = new Set([
  "modern", "fantasy", "sci_fi", "historical", "horror", "post_apocalypse", "virtual", "school", "nature", "urban_fantasy", "space", "mythology", "workplace", "supernatural",
  "battle", "mystery", "romance", "self_discovery", "sports", "survival", "specialty", "revenge", "politics", "friendship", "adventure", "war", "time_loop",
  "serious", "light_comedy", "dark", "healing", "chaos", "emotional", "burning", "melancholic", "tense", "wholesome", "satirical", "mysterious", "warm", "brutal",
  "prodigy", "underdog_growth", "ordinary_extraordinary", "anti_hero", "group", "everyman", "female", "villain_pov", "child", "adult", "nonhuman", "duo", "elderly", "multiple",
  "long_arc", "episodic", "slice_of_life", "ensemble", "anthology", "twist", "mystery_box", "tournament", "journey", "daily_buildup", "flashback", "parallel",
  "detailed", "unique", "shonen_classic", "shojo_kirakira", "refined", "realistic", "loose", "cute", "retro", "dynamic", "webtoon_color", "soft",
  "philosophical", "social", "human_drama", "entertainment", "educational", "psychological", "mixed", "existential", "emotional_catharsis", "worldbuilding", "comfort", "moral", "coming_of_age", "family_theme",
  "action", "atmosphere", "comedy_gag", "suspense", "dialogue", "visual", "emotional_scenes", "slow_burn", "fast_paced", "shock", "realism",
  "world", "nation", "city", "intimate", "internal", "family", "multiverse", "battlefield", "small_town", "workplace_pro", "underworld", "global_travel",
  "long_running", "classic", "anime_yes", "anime_no", "award", "global", "viral", "critic", "cult", "bestseller", "legendary",
]);

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
    .replace(/[!！?？:：・.\s　\-ー〜~]/g, "")
    .trim();
}

function validateEntry(entry, sourceFile, index) {
  const location = `${sourceFile}#${index + 1}`;
  const issues = [];
  const required = ["id", "title_ja", "title_en", "author", "year", "volumes", "status", "demographic", "anime", "tags", "desc_ja", "desc_en"];

  required.forEach((field) => {
    if (!(field in entry)) issues.push(`${location}: missing field "${field}"`);
  });

  if (!/^[a-z0-9_]+$/.test(entry.id || "")) issues.push(`${location}: invalid id "${entry.id}"`);
  if (!Number.isInteger(entry.year) || entry.year < 1900 || entry.year > 2030) issues.push(`${location}: suspicious year "${entry.year}"`);
  if (!Number.isInteger(entry.volumes) || entry.volumes < 1 || entry.volumes > 250) issues.push(`${location}: suspicious volumes "${entry.volumes}"`);
  if (!allowedStatuses.has(entry.status)) issues.push(`${location}: invalid status "${entry.status}"`);
  if (!allowedDemographics.has(entry.demographic)) issues.push(`${location}: invalid demographic "${entry.demographic}"`);
  if (typeof entry.anime !== "boolean") issues.push(`${location}: anime must be boolean`);
  if (!Array.isArray(entry.tags) || entry.tags.length < 2 || entry.tags.length > 10) issues.push(`${location}: tags should contain 2-10 items`);
  (entry.tags || []).forEach((tag) => {
    if (!allowedTags.has(tag)) issues.push(`${location}: unknown tag "${tag}"`);
  });
  if (`${entry.desc_ja || ""}`.length < 10) issues.push(`${location}: desc_ja is too short`);
  if (`${entry.desc_en || ""}`.length < 10) issues.push(`${location}: desc_en is too short`);

  return issues;
}

const entries = [];
const issues = [];

dbFiles.forEach((relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  const list = readDbArray(filePath);
  list.forEach((entry, index) => {
    entries.push({ ...entry, sourceFile: relativePath, sourceIndex: index });
    issues.push(...validateEntry(entry, relativePath, index));
  });
});

const byId = new Map();
const byTitle = new Map();

entries.forEach((entry) => {
  byId.set(entry.id, [...(byId.get(entry.id) || []), entry]);
  const titleKey = normalizeTitle(entry.title_ja || entry.title_en);
  if (titleKey) byTitle.set(titleKey, [...(byTitle.get(titleKey) || []), entry]);
});

for (const [id, matches] of byId.entries()) {
  if (matches.length > 1) {
    issues.push(`duplicate id "${id}": ${matches.map((m) => `${m.sourceFile}#${m.sourceIndex + 1}`).join(", ")}`);
  }
}

for (const [title, matches] of byTitle.entries()) {
  if (matches.length > 1) {
    issues.push(`possible duplicate title "${title}": ${matches.map((m) => `${m.title_ja} (${m.id})`).join(", ")}`);
  }
}

const summary = {
  total: entries.length,
  files: Object.fromEntries(dbFiles.map((relativePath) => [relativePath, entries.filter((entry) => entry.sourceFile === relativePath).length])),
  uniqueIds: byId.size,
  issueCount: issues.length,
};

console.log(JSON.stringify(summary, null, 2));

if (issues.length > 0) {
  const categories = issues.reduce((acc, issue) => {
    const key = issue.includes("duplicate id") ? "duplicate_id"
      : issue.includes("possible duplicate title") ? "possible_duplicate_title"
      : issue.includes("suspicious volumes") ? "suspicious_volumes"
      : issue.includes("unknown tag") ? "unknown_tag"
      : issue.includes("missing field") ? "missing_field"
      : "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log("\nIssue categories:");
  console.log(JSON.stringify(categories, null, 2));

  if (showDetails) {
    console.log("\nIssues:");
    issues.slice(0, 200).forEach((issue) => console.log(`- ${issue}`));
    if (issues.length > 200) console.log(`- ...and ${issues.length - 200} more`);
  } else {
    console.log("\nRun `npm run check:db -- --details` to print individual issues.");
  }
  if (strictMode) process.exitCode = 1;
}
