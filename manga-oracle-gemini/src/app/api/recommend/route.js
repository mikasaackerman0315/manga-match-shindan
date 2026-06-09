// ============================================================
// /api/recommend — Gemini 2.5 Flash バックエンド
// ============================================================
// 役割:
//   - フロントから「診断の回答 + 自由記述 + 言語」を受け取る
//   - 1800作品DBを使って Gemini 2.5 Flash に推薦させる
//   - 結果のJSONをパースしてフロントに返す
// セキュリティ: APIキーはサーバー側のみ（NEXT_PUBLIC_ を付けない）
// ============================================================

import { NextResponse } from "next/server";
import { CORE_DB as CORE_DB_BASE } from "@/data/coreDB";
import { CORE_DB_EXTRA } from "@/data/coreDB_extra";
import { CORE_DB_EXTRA2 } from "@/data/coreDB_extra2";
import { CORE_DB_EXTRA3 } from "@/data/coreDB_extra3";
import { CORE_DB_EXTRA4 } from "@/data/coreDB_extra4";

// 既存207作品 + 追加193作品 + 追加600作品 + 追加500作品 + 追加300作品 = 計1800作品
const CORE_DB_RAW = [...CORE_DB_BASE, ...CORE_DB_EXTRA, ...CORE_DB_EXTRA2, ...CORE_DB_EXTRA3, ...CORE_DB_EXTRA4];

function normalizeMangaTitle(title) {
  return `${title || ""}`
    .toLowerCase()
    .replace(/[!！?？:：・.\s　\-ー〜~]/g, "")
    .trim();
}

function normalizeVolumes(volumes) {
  return Number.isInteger(volumes) && volumes > 0 && volumes <= 250 ? volumes : null;
}

function normalizeMangaEntry(manga) {
  return {
    ...manga,
    volumes: normalizeVolumes(manga.volumes),
  };
}

function dedupeMangaDatabase(entries) {
  const seenTitles = new Set();
  return entries.filter((manga) => {
    const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    if (!key) return true;
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });
}

const CORE_DB = CORE_DB_RAW.map(normalizeMangaEntry);
const CORE_DB_UNIQUE = dedupeMangaDatabase(CORE_DB);
const CORE_DB_BY_ID = new Map(CORE_DB.map((manga) => [manga.id, manga]));

// Gemini APIのエンドポイント（v1beta / generateContent）
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_MAX_ATTEMPTS = 2;
const GEMINI_TIMEOUT_MS = 55000;
const GEMINI_CANDIDATE_LIMIT = 220;
const FALLBACK_RESULT_LIMIT = 15;
const WEB_DISCOVERY_LIMIT = 3;

// ------------------------------------------------------------
// シンプルなメモリ内レート制限（本番ではRedis等を推奨）
// ------------------------------------------------------------
const rateLimitStore = new Map(); // key: ip-date, value: count
const DAILY_GLOBAL_LIMIT = 300;   // サイト全体の1日あたり上限
const PER_USER_DAILY_LIMIT = 5;   // 1IPあたりの1日上限

const QUESTION_WEIGHTS = {
  setting: 5,
  elements: 5,
  tone: 4,
  scale: 2,
  protagonist: 3,
  relationship: 3,
  structure: 3,
  pacing: 2,
  depth: 4,
  presentation: 3,
  art: 2,
  demographic: 5,
  status: 4,
  media: 3,
  ending: 2,
};

const CORE_FIT_QUESTION_IDS = new Set([
  "setting",
  "elements",
  "tone",
  "relationship",
  "structure",
  "pacing",
  "depth",
  "protagonist",
]);

const STRICT_FIT_QUESTION_IDS = new Set(["setting", "elements", "tone"]);

const STAGED_FILTER_STEPS = [
  { questionId: "setting", min: 8 },
  { questionId: "elements", min: 12 },
  { questionId: "tone", min: 10 },
  { questionId: "demographic", min: 10 },
  { questionId: "status", min: 8 },
  { questionId: "relationship", min: 8 },
  { questionId: "depth", min: 8 },
  { questionId: "structure", min: 8 },
  { questionId: "pacing", min: 8 },
  { questionId: "protagonist", min: 8 },
  { questionId: "scale", min: 8 },
  { questionId: "presentation", min: 8 },
  { questionId: "art", min: 6 },
  { questionId: "media", min: 6 },
  { questionId: "ending", min: 6 },
];

const ANSWER_TAG_ALIASES = {
  healing_story: ["healing", "warm", "comfort", "wholesome"],
  immersion_world: ["world", "worldbuilding", "adventure", "fantasy"],
  immersion_intimate: ["intimate", "human_drama", "slice_of_life", "dialogue"],
  immersion_incident: ["mystery", "suspense", "survival", "twist"],
  immersion_journey: ["journey", "adventure", "global_travel"],
  immersion_workplace: ["workplace", "workplace_pro", "specialty", "educational"],
  immersion_internal: ["internal", "psychological", "self_discovery", "philosophical"],
  immersion_city: ["city", "urban_fantasy", "social", "human_drama"],
  immersion_battlefield: ["battlefield", "war", "survival", "tense"],
  immersion_underworld: ["underworld", "dark", "revenge", "suspense"],
  immersion_family: ["family", "family_theme", "warm", "human_drama"],
  immersion_small_town: ["small_town", "slice_of_life", "healing", "nature"],
  immersion_global: ["world", "nation", "global_travel", "politics"],
  immersion_political: ["politics", "nation", "social", "moral"],
  immersion_survival: ["survival", "tense", "post_apocalypse", "suspense"],
  historical_west: ["historical", "war", "politics"],
  mystery_supernatural: ["mystery", "supernatural", "mysterious"],
  money: ["specialty", "social", "underworld"],
  romance_sweet: ["romance", "warm", "wholesome", "shojo_kirakira"],
  romance_complex: ["romance", "human_drama", "melancholic", "psychological"],
  family_bond: ["family_theme", "family", "warm"],
  found_family: ["friendship", "group", "family_theme"],
  ensemble_cast: ["ensemble", "group", "multiple"],
  team: ["group", "friendship", "sports"],
  tragic_bond: ["emotional", "melancholic", "human_drama"],
  duo_buddy: ["duo", "friendship", "dialogue"],
  reading_foreshadow: ["twist", "mystery_box", "slow_burn", "suspense"],
  reading_twist: ["twist", "shock", "suspense", "mystery"],
  reading_slow_build: ["slow_burn", "daily_buildup", "human_drama"],
  reading_episodic: ["episodic", "slice_of_life", "light_comedy"],
  reading_growth: ["underdog_growth", "tournament", "coming_of_age", "burning"],
  reading_mystery_box: ["mystery_box", "mystery", "mysterious", "suspense"],
  reading_long_arc: ["long_arc", "worldbuilding", "emotional_catharsis"],
  reading_parallel: ["parallel", "ensemble", "multiple", "mystery_box"],
  reading_tournament: ["tournament", "battle", "sports", "burning"],
  reading_anthology: ["anthology", "episodic", "slice_of_life"],
  reading_flashback: ["flashback", "human_drama", "mystery"],
  reading_daily_buildup: ["daily_buildup", "slice_of_life", "slow_burn"],
  reading_strategy: ["psychological", "politics", "mystery", "suspense"],
  reading_journey: ["journey", "adventure", "self_discovery"],
  page_turner: ["fast_paced", "suspense", "twist"],
  savor: ["slow_burn", "atmosphere", "human_drama"],
  light_read: ["light_comedy", "slice_of_life", "comfort"],
  dense: ["detailed", "worldbuilding", "philosophical"],
  binge: ["long_arc", "fast_paced", "entertainment"],
  relaxing: ["healing", "warm", "comfort"],
  intense: ["tense", "brutal", "suspense"],
  episodic_easy: ["episodic", "slice_of_life", "light_comedy"],
  emotional_rollercoaster: ["emotional", "shock", "emotional_catharsis"],
  thoughtful: ["philosophical", "psychological", "dialogue"],
  comfort_reread: ["comfort", "wholesome", "warm"],
  quick_hit: ["fast_paced", "entertainment"],
  slow_build: ["slow_burn", "daily_buildup"],
  worldbuilding_detail: ["worldbuilding", "detailed", "fantasy"],
  romance_tension: ["romance", "slow_burn", "emotional"],
  dark_art: ["dark", "horror", "atmosphere"],
  art_beauty: ["detailed", "refined", "shojo_kirakira", "visual"],
  art_power: ["dynamic", "action", "shonen_classic", "battle"],
  art_readable: ["refined", "soft", "light_comedy"],
  art_unique: ["unique", "cult", "loose"],
  art_realistic: ["realistic", "adult", "social"],
  art_cute: ["cute", "soft", "wholesome"],
  art_dark: ["dark_art", "dark", "atmosphere", "horror"],
  art_soft: ["soft", "healing", "warm"],
  art_detailed: ["detailed", "visual", "worldbuilding"],
  art_refined: ["refined", "realistic", "visual"],
  art_retro: ["retro", "classic", "cult"],
  art_loose: ["loose", "unique", "light_comedy"],
  art_dynamic: ["dynamic", "action", "battle"],
  art_webtoon: ["webtoon_color", "web", "viral"],
  sketchy: ["loose", "unique"],
  shonen_modern: ["shonen_classic", "dynamic", "battle"],
  type_shonen: ["shonen_classic", "dynamic", "battle", "shonen"],
  type_shojo: ["shojo_kirakira", "romance", "emotional", "shojo"],
  type_adult: ["adult", "seinen", "josei", "human_drama", "social"],
  type_web: ["web", "webtoon_color", "viral"],
  type_classic: ["classic", "legendary", "retro"],
  type_niche: ["cult", "unique", "indie"],
  type_literary: ["realistic", "social", "philosophical", "human_drama"],
  type_josei: ["josei", "adult", "human_drama", "romance"],
  type_seinen_real: ["seinen", "realistic", "adult", "social"],
  type_family: ["family_theme", "warm", "kodomo", "wholesome"],
  type_sports: ["sports", "school", "burning", "team"],
  type_horror: ["horror", "dark", "suspense", "psychological"],
  type_specialty: ["specialty", "workplace", "educational", "workplace_pro"],
  type_app_trend: ["web", "viral", "trending_now", "fast_paced"],
  indie: ["unique", "cult"],
  gekiga: ["realistic", "adult", "social"],
  bl_gl: ["romance", "human_drama"],
  alt: ["unique", "cult"],
  overseas: ["global", "webtoon_color"],
  new: ["viral", "trending_now"],
  ending: ["completed"],
  recently_ended: ["completed"],
  weekly: ["ongoing"],
  monthly: ["ongoing"],
  live_action: ["viral"],
  movie_anime: ["anime_yes"],
  trending_now: ["viral", "bestseller"],
  fame_famous: ["bestseller", "legendary", "global", "anime_yes"],
  fame_trending: ["viral", "trending_now", "bestseller"],
  fame_hidden: ["cult", "unique", "anime_no"],
  fame_anime: ["anime_yes", "bestseller"],
  fame_undiscovered: ["cult", "unique", "anime_no"],
  fame_acclaimed: ["award", "critic", "philosophical"],
  fame_cult: ["cult", "underground", "unique"],
  fame_bestseller: ["bestseller", "global", "anime_yes"],
  fame_global: ["global", "bestseller", "long_running"],
  fame_viral: ["viral", "trending_now", "web"],
  fame_newcomer: ["trending_now", "viral", "ongoing"],
  fame_long_running: ["long_running", "classic", "bestseller"],
  fame_critic: ["critic", "award", "social"],
  fame_media_mix: ["anime_yes", "viral", "bestseller"],
  underground: ["cult", "unique"],
  game: ["virtual", "battle"],
  happy: ["warm", "wholesome", "emotional_catharsis"],
  bittersweet: ["melancholic", "emotional", "human_drama"],
  rewarding: ["emotional_catharsis", "coming_of_age"],
  open: ["philosophical", "mysterious"],
  shocking: ["shock", "twist", "dark"],
  cathartic: ["emotional_catharsis", "revenge"],
  thought: ["philosophical", "psychological"],
  uplifting: ["warm", "burning", "underdog_growth"],
  after_clear: ["rewarding", "emotional_catharsis", "completed"],
  after_cry: ["emotional", "emotional_catharsis", "melancholic"],
  after_think: ["philosophical", "psychological", "moral", "existential"],
  after_energy: ["uplifting", "burning", "underdog_growth", "warm"],
  after_lingering: ["melancholic", "atmosphere", "mysterious", "open"],
  after_shock: ["shock", "twist", "dark"],
  after_warm: ["warm", "wholesome", "comfort"],
  after_bitter: ["bittersweet", "melancholic", "human_drama"],
  after_hope: ["hopeful", "warm", "coming_of_age"],
  after_catharsis: ["cathartic", "emotional_catharsis", "revenge"],
  after_realistic: ["realistic_end", "realism", "human_drama"],
  after_epic: ["epic_finale", "long_arc", "world"],
  after_comfort: ["comfort", "warm", "wholesome"],
  after_unsettled: ["mysterious", "dark", "psychological"],
  tragic: ["dark", "melancholic", "emotional"],
  epic_finale: ["long_arc", "world", "emotional_catharsis"],
  realistic_end: ["realism", "human_drama"],
  hopeful: ["warm", "coming_of_age"],
};

const DEMOGRAPHIC_VALUES = new Set(["shonen", "shojo", "seinen", "josei", "web", "kodomo"]);
const SETTING_VALUES = new Set([
  "modern",
  "fantasy",
  "sci_fi",
  "historical",
  "historical_west",
  "horror",
  "post_apocalypse",
  "virtual",
  "school",
  "nature",
  "urban_fantasy",
  "space",
  "mythology",
  "workplace",
]);

const TAG_LABELS_JA = {
  fantasy: "ファンタジー",
  battle: "バトル",
  romance: "恋愛",
  mystery: "ミステリー",
  sports: "スポーツ",
  horror: "ホラー",
  healing: "癒し",
  emotional: "感情の深さ",
  light_comedy: "軽い読み味",
  dark: "ダークな雰囲気",
  warm: "温かさ",
  school: "青春",
  workplace: "仕事",
  human_drama: "人間ドラマ",
  worldbuilding: "世界観",
  psychological: "心理描写",
  friendship: "友情",
  completed: "完結済み",
};

function checkRateLimit(ip) {
  const today = new Date().toISOString().slice(0, 10);
  const globalKey = `global-${today}`;
  const userKey = `${ip}-${today}`;

  const globalCount = (rateLimitStore.get(globalKey) || 0) + 1;
  const userCount = (rateLimitStore.get(userKey) || 0) + 1;

  if (globalCount > DAILY_GLOBAL_LIMIT) return { ok: false, reason: "global" };
  if (userCount > PER_USER_DAILY_LIMIT) return { ok: false, reason: "user" };

  rateLimitStore.set(globalKey, globalCount);
  rateLimitStore.set(userKey, userCount);
  return { ok: true };
}

// ------------------------------------------------------------
// プロンプト構築
// ------------------------------------------------------------
function buildPrompt(answers, questions, freeText, language, candidatePool = []) {
  const profileSummary = questions.map((q) => {
    const selectedValues = answers[q.id] || [];
    const labels = selectedValues.map((v) => {
      const opt = q.options.find((o) => o.v === v);
      return opt ? (language === "ja" ? opt.ja : opt.en) : v;
    });
    const questionText = language === "ja" ? q.text_ja : q.text_en;
    return `- ${questionText}\n  → ${labels.join(", ")}`;
  }).join("\n");

  const candidates = candidatePool.length
    ? candidatePool
    : CORE_DB_UNIQUE.map((manga) => ({ manga, score: 0, matchedTags: [] }));
  const dbJson = JSON.stringify(
    candidates.map(({ manga, score, matchedTags, fitCoverage, strictMisses }) => ({
      id: manga.id, title_ja: manga.title_ja, title_en: manga.title_en, author: manga.author,
      year: manga.year, volumes: manga.volumes, status: manga.status, demographic: manga.demographic,
      anime: manga.anime, tags: manga.tags, matchScore: Number(score.toFixed(2)),
      fitCoverage: fitCoverage || 0, strictMisses: strictMisses || 0,
      matchedTags: matchedTags.slice(0, 6), desc: language === "ja" ? manga.desc_ja : manga.desc_en,
    }))
  );

  const langInstruction = language === "ja"
    ? `CRITICAL LANGUAGE REQUIREMENT: Write ALL text fields (userProfile, description, reason) ENTIRELY in natural Japanese. Prefer Japanese titles for "title_ja". Do NOT mix English sentences into description or reason.`
    : `CRITICAL LANGUAGE REQUIREMENT: Write ALL text fields (userProfile, description, reason) ENTIRELY in natural English. Even though the curated database provides Japanese descriptions, you MUST write your own "description" and "reason" in English — do NOT copy the Japanese desc. Use English titles for display where available.`;

  const freeTextSection = freeText && freeText.trim()
    ? `\n## User's Free-Text Request (IMPORTANT — honor this carefully)\nThe user added this note in their own words. Treat it as a high-priority signal (e.g. if they say they dislike something, avoid recommending it):\n"${freeText.trim()}"\n`
    : "";
  const interpretedFreeTextSection = freeText && freeText.trim()
    ? buildFreeTextInstruction(freeText, language)
    : "";

  return `You are a world-class manga recommendation expert.

You are building a hybrid recommendation list: the curated DB is the factual backbone, and Google Search may be used to discover recent, app-native, niche, or underrepresented manga when the DB shortlist is not enough.

## Curated Database Shortlist (${candidates.length} candidates selected from ${CORE_DB_UNIQUE.length} unique works)
These candidates were narrowed step by step from the full curated database using the user's answers, then pre-scored. Treat this shortlist as the user's strongest fit zone. "matchScore", "fitCoverage", "strictMisses", and "matchedTags" are guidance signals, not final rankings.

- "fitCoverage" means how many important answer groups this manga matched.
- "strictMisses" means misses in the most important groups: setting, core elements, and tone.
- A famous manga with strictMisses should usually rank below a less famous manga with stronger fitCoverage.

\`\`\`json
${dbJson}
\`\`\`

## Google Search Discovery Guidance
Before finalizing, use Google Search to check whether recent manga, manga-app serializations, SNS buzz titles, anime-adaptation titles, or newly popular niche works match this user's profile better than some DB candidates. Web discoveries should improve the list, not pad it.

## User's Quiz Answers
${profileSummary}
${freeTextSection}
${interpretedFreeTextSection}
## Hard Fit Requirements

- Treat the user's selected world/setting as a hard editorial constraint. A famous manga is not a good pick if its core world does not match the selected setting.
- Treat setting, core elements, and tone as the first pass. If a manga misses two of these, do not rank it highly unless the free-text request clearly asks for it.
- Do not recommend broad prestige classics just because they are famous.
- Do not use fame, anime status, awards, or bestseller status as a substitute for preference fit.
- Match the selected setting literally: school means school life, space means space or planets, workplace means a specific job or industry, nature means rural/frontier/natural environments, historical means a period setting, and urban fantasy means modern life mixed with supernatural or fantasy elements.
- If the user selected "Virtual / game worlds", prioritize manga centered on VR, MMORPGs, game mechanics, level systems, dungeons, online worlds, or being trapped in a game-like world. Do NOT use general fantasy or dark fantasy as a substitute.
- If the setting-specific shortlist is small, use Google Search for better fitting manga instead of padding with unrelated famous works.
- If the user's answers point to a niche, app-native, or recent type of manga, search for a better exact fit rather than falling back to old classics.

## Your Task

1. Analyze the user's preference profile.
2. Review the curated DB carefully — with many unique titles, there are likely many strong matches.
3. Use Google Search grounding when it can improve freshness, app/web manga coverage, or niche fit.
4. Choose ONE ranked list of up to 15 manga.
5. Mark curated database recommendations as "db" and grounded discoveries as "web".

## Output Format

${langInstruction}

Return ONLY a valid JSON object (no markdown fences, no preamble):

{
  "userProfile": "1-2 sentence vivid description in second person",
  "recommendations": [
    { "rank": 1, "source": "db", "id": "one_piece", "title_ja": "...", "title_en": "...", "author": "...", "year": 1997, "volumes": 108, "status": "ongoing", "demographic": "shonen", "anime": true, "description": "1-2 sentence summary", "reason": "2-3 sentences why THIS fits THIS reader" },
    { "rank": 2, "source": "web", "id": "web_unique_title", "title_ja": "...", "title_en": "...", "author": "...", "year": 2024, "volumes": null, "status": "ongoing", "demographic": "web", "anime": false, "description": "1-2 sentence summary", "reason": "2-3 sentences why THIS fits THIS reader" }
  ]
}

## Rules

- ${langInstruction}
- For DB picks, "source" must be "db" and "id" must exactly match the curated DB id.
- For Google Search discoveries, "source" must be "web" and "id" must start with "web_".
- Use DB picks for the majority of the list. Include at most ${WEB_DISCOVERY_LIMIT} web discoveries.
- Only include a web discovery if you are confident it is a real manga and it clearly fits better than another DB candidate.
- Do not include adult-only, TL, or BL-only recommendations.
- Rank by best fit (rank 1 = strongest).
- Prefer high matchScore works when they also make editorial sense, but do not simply sort by score.
- Prefer candidates with higher fitCoverage and lower strictMisses. Penalize DB and web picks that only match broad tags.
- Do NOT recommend the same manga title twice, even if duplicate or variant entries exist in the database or search results.
- Keep "description" useful and readable. Keep "reason" to one short sentence because the UI prioritizes manga titles and summaries.
- ALWAYS reference the user's specific answers in your reasons.
- If the user provided a free-text request, treat it as top priority: respect dislikes (exclude matching works) and lean into stated likes.
- If exact year, volumes, anime, or demographic are uncertain for a web discovery, use your best grounded estimate and keep the reason focused on fit, not unverifiable trivia.
- "status": "completed" | "ongoing" | "hiatus"
- "demographic": "shonen" | "shojo" | "seinen" | "josei" | "kodomo" | "web"
- Output ONLY the JSON. No fences, no commentary.`;
}

// ------------------------------------------------------------
// Geminiレスポンスから本文テキストを抽出
// ------------------------------------------------------------
function extractText(data) {
  // Gemini の generateContent レスポンス構造:
  // data.candidates[0].content.parts[].text
  const candidates = data?.candidates;
  if (!candidates || candidates.length === 0) return "";
  const parts = candidates[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("\n");
}

function extractJSON(fullText) {
  let jsonText = fullText;
  const jsonStart = fullText.indexOf("{");
  const jsonEnd = fullText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1) {
    jsonText = fullText.substring(jsonStart, jsonEnd + 1);
  }
  jsonText = jsonText.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonText);
}

function validateResponse(payload) {
  if (!payload || typeof payload !== "object") return false;
  if (!Array.isArray(payload.recommendations)) return false;
  if (payload.recommendations.length === 0) return false;
  return payload.recommendations.every((rec) => rec && typeof rec === "object" && rec.title_ja && rec.reason);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAnswerTags(value) {
  if (!value || value === "any") return [];
  return ANSWER_TAG_ALIASES[value] || [value];
}

function getSelectedEntries(answers, questions = []) {
  const questionById = new Map((questions || []).map((q) => [q.id, q]));
  return Object.entries(answers || {}).flatMap(([questionId, values]) => {
    const q = questionById.get(questionId);
    return (Array.isArray(values) ? values : [values])
      .filter((value) => value && value !== "any")
      .map((value) => ({ questionId, value, question: q }));
  });
}

function getOptionLabel(entry, language) {
  const option = entry.question?.options?.find((o) => o.v === entry.value);
  if (!option) return entry.value;
  return language === "en" ? option.en || entry.value : option.ja || entry.value;
}

function getMangaText(manga) {
  return [
    manga.title_ja,
    manga.title_en,
    manga.author,
    manga.description,
    manga.reason,
    manga.desc_ja,
    manga.desc_en,
    ...(manga.tags || []),
  ].join(" ").toLowerCase();
}

function hasAnyTag(tags, values) {
  return values.some((value) => tags.has(value));
}

function matchesPreferenceValue(manga, value) {
  const tags = new Set(manga.tags || []);
  const text = getMangaText(manga);

  if (value === "modern") return tags.has("modern") || (hasAnyTag(tags, ["school", "workplace", "city", "slice_of_life"]) && !hasAnyTag(tags, ["fantasy", "sci_fi", "historical", "post_apocalypse", "space"])) || /modern|daily life|contemporary|city life|現代|日常|街|都会/.test(text);
  if (value === "fantasy") return tags.has("fantasy") || hasAnyTag(tags, ["mythology", "urban_fantasy", "worldbuilding"]) || /magic|mage|demon lord|dragon|kingdom|another world|otherworld|isekai|ファンタジー|異世界|魔法|魔王|竜|ドラゴン|王国/.test(text);
  if (value === "sci_fi") return tags.has("sci_fi") || hasAnyTag(tags, ["space", "virtual", "post_apocalypse"]) || /science fiction|sci-fi|cyber|future|robot|android|ai|technology|near-future|sf|近未来|サイバー|ロボット|アンドロイド|人工知能|科学/.test(text);
  if (value === "historical") return (tags.has("historical") && !/western|europe|viking|roman|rome|france|french|britain|medieval europe|renaissance|西洋|欧州|ヨーロッパ|ローマ|フランス|英国|ヴァイキング/.test(text)) || /戦国|江戸|幕末|明治|大正|時代劇|侍|武士|忍者|日本史/.test(text);
  if (value === "historical_west") return tags.has("historical") && (hasAnyTag(tags, ["war", "politics"]) || /western|europe|viking|roman|rome|france|french|britain|medieval europe|renaissance|西洋|欧州|ヨーロッパ|ローマ|フランス|英国|ヴァイキング|中世/.test(text));
  if (value === "horror") return tags.has("horror") || (tags.has("supernatural") && hasAnyTag(tags, ["dark", "mystery", "survival", "psychological"])) || /horror|occult|ghost|curse|monster|terror|nightmare|ホラー|怪談|怪異|呪い|幽霊|怪物|オカルト|恐怖/.test(text);
  if (value === "post_apocalypse") return tags.has("post_apocalypse") || (tags.has("survival") && hasAnyTag(tags, ["dark", "world", "sci_fi"])) || /post-apocalyptic|apocalypse|dystopia|ruined world|collapsed world|zombie|wasteland|終末|荒廃|退廃|ディストピア|ゾンビ|崩壊/.test(text);
  if (value === "virtual") return tags.has("virtual") || /virtual|vrmmo|mmorpg|online game|game world|game mechanics|trapped in (a )?game|leveling system|vr game|mmo game|game-like world|ゲーム世界|ゲーム内|ゲームに閉じ込め|オンラインゲーム|vrゲーム|レベルアップ|仮想|バーチャル/.test(text);
  if (value === "school") return tags.has("school") || /school|classroom|classmate|club activity|student council|high school|middle school|academy|campus|学校|学園|高校|中学|部活|生徒会|同級生|クラス/.test(text);
  if (value === "nature") return tags.has("nature") || hasAnyTag(tags, ["small_town", "journey", "healing"]) || /nature|rural|countryside|village|island|mountain|forest|farm|frontier|wilderness|自然|田舎|村|島|山|森|農|辺境/.test(text);
  if (value === "urban_fantasy") return tags.has("urban_fantasy") || (tags.has("modern") && (tags.has("fantasy") || tags.has("supernatural"))) || /urban fantasy|modern fantasy|city and supernatural|contemporary supernatural|現代ファンタジー|都市伝説|都会.*怪異|現代.*超常|現代.*異能/.test(text);
  if (value === "space") return tags.has("space") || (tags.has("sci_fi") && /space|galaxy|planet|spaceship|space opera|astronaut|interstellar|宇宙|銀河|惑星|宇宙船|星間|スペースオペラ/.test(text));
  if (value === "mythology") return tags.has("mythology") || (tags.has("supernatural") && hasAnyTag(tags, ["fantasy", "historical"])) || /myth|mythology|folklore|legend|god|deity|divine|yokai|神話|民話|伝承|神|神々|妖怪|伝説/.test(text);
  if (value === "workplace") return tags.has("workplace") || tags.has("workplace_pro") || (tags.has("specialty") && hasAnyTag(tags, ["adult", "human_drama", "educational"])) || /workplace|profession|industry|office|company|job|career|chef|doctor|lawyer|editor|creator|仕事|職場|業界|会社|職業|料理人|医者|弁護士|編集者|作家/.test(text);
  if (tags.has(value) || manga.demographic === value || manga.status === value) return true;
  if (value === "mystery_supernatural") return tags.has("mystery") && tags.has("supernatural");
  return false;
}

function matchesAnySetting(manga, signals) {
  if (!signals.settingPrefs || signals.settingPrefs.size === 0) return true;
  return Array.from(signals.settingPrefs).some((value) => matchesPreferenceValue(manga, value));
}

function matchesEntry(manga, entry) {
  const tags = new Set(manga.tags || []);
  const value = entry.value;

  if (!value || value === "any") return true;
  if (entry.questionId === "setting") return matchesPreferenceValue(manga, value);
  if (entry.questionId === "demographic" && DEMOGRAPHIC_VALUES.has(value)) return manga.demographic === value;
  if (entry.questionId === "status") {
    if (value === "completed_only") return manga.status === "completed";
    if (value === "ongoing_only") return manga.status === "ongoing";
    if (value === "short") return manga.volumes && manga.volumes <= 10;
    if (value === "medium") return manga.volumes && manga.volumes > 10 && manga.volumes <= 30;
    if (value === "long" || value === "epic" || value === "long_running") return manga.volumes && manga.volumes >= 30;
    return manga.status === value || tags.has(value);
  }
  if (entry.questionId === "media") {
    if (value === "anime_yes") return manga.anime === true;
    if (value === "anime_no") return manga.anime === false;
  }

  return getAnswerTags(value).some((tag) => {
    if (tags.has(tag) || manga.demographic === tag || manga.status === tag) return true;
    if (tag === "anime_yes") return manga.anime === true;
    if (tag === "anime_no") return manga.anime === false;
    return matchesPreferenceValue(manga, tag);
  });
}

function matchesQuestionEntries(manga, entries) {
  return entries.some((entry) => matchesEntry(manga, entry));
}

function addTags(target, tags = []) {
  tags.forEach((tag) => target.add(tag));
}

function textHasAny(text, patterns = []) {
  return patterns.some((pattern) => pattern.test(text));
}

function mangaHasAnyTag(manga, tagSet) {
  if (!tagSet || tagSet.size === 0) return false;
  const tags = new Set(manga.tags || []);
  return Array.from(tagSet).some((tag) => tags.has(tag) || manga.demographic === tag || manga.status === tag);
}

function extractReferencedTitleKeys(freeText, avoidOnly = false) {
  const text = `${freeText || ""}`.toLowerCase();
  if (!text.trim()) return new Set();

  const negativeNearby = /(苦手|嫌い|無理|いらない|なし|無し|避けたい|除外|外して|入れない|見たくない|読みたくない|not|avoid|exclude|dislike|don't want|no )/i;
  const positiveNearby = /(みたい|っぽい|好き|読みたい|近い|似た|like|similar|want)/i;
  const keys = new Set();

  CORE_DB_UNIQUE.forEach((manga) => {
    const candidates = [manga.title_ja, manga.title_en].filter(Boolean);
    const matchedTitle = candidates.find((title) => {
      const raw = `${title}`.toLowerCase();
      const normalized = normalizeMangaTitle(title);
      return raw.length >= 3 && (text.includes(raw) || (normalized.length >= 3 && normalizeMangaTitle(text).includes(normalized)));
    });
    if (!matchedTitle) return;

    const index = text.indexOf(`${matchedTitle}`.toLowerCase());
    const windowText = index >= 0 ? text.slice(Math.max(0, index - 24), index + `${matchedTitle}`.length + 24) : text;
    if (avoidOnly ? negativeNearby.test(windowText) : positiveNearby.test(windowText) && !negativeNearby.test(windowText)) {
      keys.add(normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id));
    }
  });

  return keys;
}

function extractFreeTextSignals(freeText = "") {
  const text = `${freeText || ""}`.toLowerCase();
  const avoidTags = new Set();
  const hardAvoidTags = new Set();
  const boostTags = new Set();
  const settingPrefs = new Set();
  const requiredSettingPrefs = new Set();
  const demographics = new Set();
  const statusPrefs = new Set();
  const requiredStatusPrefs = new Set();
  const mediaPrefs = new Set();
  const blockedTitleKeys = extractReferencedTitleKeys(freeText, true);
  const likedTitleKeys = extractReferencedTitleKeys(freeText, false);

  const negative = "(苦手|嫌い|無理|いらない|なし|無し|避けたい|除外|外して|入れない|見たくない|読みたくない|not|avoid|exclude|dislike|don't want|no)";
  const around = (word) => new RegExp(`(${word}).{0,16}${negative}|${negative}.{0,16}(${word})`, "i");

  if (around("鬱|胸糞|救われない|しんどい|暗すぎ|重すぎ|バッドエンド|bad ending").test(text)) {
    addTags(avoidTags, ["dark", "brutal", "shock", "melancholic", "horror"]);
    addTags(hardAvoidTags, ["brutal", "shock"]);
    addTags(boostTags, ["warm", "wholesome", "healing", "emotional_catharsis"]);
  }
  if (around("グロ|残酷|怖い|ホラー|怖すぎ|gore|horror").test(text)) {
    addTags(avoidTags, ["horror", "brutal", "shock"]);
    addTags(hardAvoidTags, ["horror", "brutal"]);
  }
  if (around("恋愛|ラブコメ|ロマンス|romance|love").test(text)) {
    addTags(avoidTags, ["romance", "shojo_kirakira"]);
    addTags(hardAvoidTags, ["romance"]);
  }
  if (around("スポーツ|部活|sports").test(text)) {
    addTags(avoidTags, ["sports", "tournament"]);
  }
  if (around("バトル|戦闘|アクション|battle|action").test(text)) {
    addTags(avoidTags, ["battle", "action", "brutal"]);
  }
  if (around("長い|長編|巻数多い|long").test(text)) {
    statusPrefs.add("short");
    requiredStatusPrefs.add("short");
  }
  if (around("連載中|未完|ongoing").test(text)) {
    statusPrefs.add("completed_only");
    requiredStatusPrefs.add("completed_only");
  }

  if (around("完結|終わって|completed").test(text)) {
    statusPrefs.add("ongoing_only");
    requiredStatusPrefs.add("ongoing_only");
  } else if (textHasAny(text, [/完結/, /終わって/, /最後まで読/, /completed/])) {
    statusPrefs.add("completed_only");
    requiredStatusPrefs.add("completed_only");
  }
  if (!around("連載中|新作|ongoing|new").test(text) && textHasAny(text, [/連載中/, /新作/, /追いかけたい/, /ongoing/, /new/])) {
    statusPrefs.add("ongoing_only");
    requiredStatusPrefs.add("ongoing_only");
  }
  if (!around("短め|短い|サクッ|すぐ読|short").test(text) && textHasAny(text, [/短め/, /短い/, /サクッ/, /すぐ読/, /短時間/, /short/])) {
    statusPrefs.add("short");
    requiredStatusPrefs.add("short");
  }
  if (textHasAny(text, [/長編/, /じっくり/, /読み応え/, /long/])) addTags(boostTags, ["long_arc", "worldbuilding"]);

  if (textHasAny(text, [/バーチャル/, /ゲーム世界/, /オンラインゲーム/, /vr/, /mmo/, /レベル/, /ダンジョン/])) {
    settingPrefs.add("virtual");
    requiredSettingPrefs.add("virtual");
    addTags(boostTags, ["virtual", "battle", "adventure"]);
  }
  if (textHasAny(text, [/異世界/, /ファンタジー/, /魔法/, /fantasy/, /isekai/])) {
    settingPrefs.add("fantasy");
    requiredSettingPrefs.add("fantasy");
    addTags(boostTags, ["fantasy", "worldbuilding", "adventure"]);
  }
  if (textHasAny(text, [/学校/, /学園/, /高校/, /青春/, /school/])) {
    settingPrefs.add("school");
    requiredSettingPrefs.add("school");
    addTags(boostTags, ["school", "coming_of_age"]);
  }
  if (textHasAny(text, [/仕事/, /職場/, /社会人/, /業界/, /workplace/, /office/])) {
    settingPrefs.add("workplace");
    requiredSettingPrefs.add("workplace");
    addTags(boostTags, ["workplace", "adult", "human_drama"]);
  }
  if (textHasAny(text, [/sf/, /近未来/, /サイバー/, /宇宙/, /ロボット/, /sci-fi/, /space/])) {
    const sciFiSetting = textHasAny(text, [/宇宙/, /space/]) ? "space" : "sci_fi";
    settingPrefs.add(sciFiSetting);
    requiredSettingPrefs.add(sciFiSetting);
    addTags(boostTags, ["sci_fi", "space", "worldbuilding"]);
  }
  if (textHasAny(text, [/歴史/, /時代/, /侍/, /戦国/, /江戸/, /historical/])) {
    settingPrefs.add("historical");
    requiredSettingPrefs.add("historical");
    addTags(boostTags, ["historical", "human_drama"]);
  }

  if (textHasAny(text, [/明る/, /笑える/, /楽しい/, /軽い/, /コメディ/, /ギャグ/, /funny/, /comedy/])) {
    addTags(boostTags, ["light_comedy", "warm", "wholesome", "comedy_gag"]);
  }
  if (textHasAny(text, [/恋愛/, /ラブコメ/, /ロマンス/, /きゅん/, /romance/, /love/]) && !around("恋愛|ラブコメ|ロマンス|romance|love").test(text)) {
    addTags(boostTags, ["romance", "warm", "emotional", "shojo_kirakira"]);
  }
  if (textHasAny(text, [/バトル/, /戦闘/, /アクション/, /熱血/, /battle/, /action/]) && !around("バトル|戦闘|アクション|battle|action").test(text)) {
    addTags(boostTags, ["battle", "action", "burning", "dynamic"]);
  }
  if (textHasAny(text, [/スポーツ/, /部活/, /試合/, /sports/]) && !around("スポーツ|部活|sports").test(text)) {
    addTags(boostTags, ["sports", "school", "burning", "tournament"]);
  }
  if (textHasAny(text, [/ホラー/, /怖い/, /怪異/, /不穏/, /horror/]) && !around("グロ|残酷|怖い|ホラー|怖すぎ|gore|horror").test(text)) {
    addTags(boostTags, ["horror", "dark", "mysterious", "suspense"]);
  }
  if (textHasAny(text, [/泣ける/, /感動/, /余韻/, /エモ/, /tear/, /emotional/])) {
    addTags(boostTags, ["emotional", "human_drama", "emotional_catharsis"]);
  }
  if (textHasAny(text, [/癒し/, /ほのぼの/, /優しい/, /安心/, /healing/, /cozy/])) {
    addTags(boostTags, ["healing", "warm", "comfort", "wholesome"]);
  }
  if (textHasAny(text, [/謎/, /考察/, /伏線/, /ミステリ/, /サスペンス/, /mystery/])) {
    addTags(boostTags, ["mystery", "mystery_box", "suspense", "twist"]);
  }
  if (textHasAny(text, [/大人向け/, /青年漫画/, /社会派/, /リアル/, /seinen/, /adult/])) {
    demographics.add("seinen");
    addTags(boostTags, ["adult", "realistic", "social", "human_drama"]);
  }
  if (textHasAny(text, [/女性向け/, /少女漫画/, /josei/, /shojo/])) {
    addTags(boostTags, ["romance", "emotional", "shojo_kirakira"]);
  }
  if (textHasAny(text, [/アニメ化/, /有名/, /入りやすい/, /anime/])) mediaPrefs.add("anime_yes");
  if (textHasAny(text, [/隠れた/, /マイナー/, /知られてない/, /穴場/, /hidden/])) {
    mediaPrefs.add("anime_no");
    addTags(boostTags, ["cult", "unique", "anime_no"]);
  }

  likedTitleKeys.forEach((key) => {
    const liked = CORE_DB_UNIQUE.find((manga) => normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id) === key);
    if (liked) addTags(boostTags, liked.tags || []);
  });

  return {
    avoidTags,
    hardAvoidTags,
    boostTags,
    settingPrefs,
    requiredSettingPrefs,
    demographics,
    statusPrefs,
    requiredStatusPrefs,
    mediaPrefs,
    blockedTitleKeys,
    likedTitleKeys,
  };
}

function buildFreeTextInstruction(freeText, language) {
  const signals = extractFreeTextSignals(freeText);
  const avoid = Array.from(signals.avoidTags);
  const hardAvoid = Array.from(signals.hardAvoidTags);
  const boost = Array.from(signals.boostTags).slice(0, 16);
  const settings = Array.from(signals.settingPrefs);
  const requiredSettings = Array.from(signals.requiredSettingPrefs);
  const statuses = Array.from(signals.statusPrefs);
  const requiredStatuses = Array.from(signals.requiredStatusPrefs);
  const blockedTitles = Array.from(signals.blockedTitleKeys);
  const likedTitles = Array.from(signals.likedTitleKeys);

  if (!avoid.length && !hardAvoid.length && !boost.length && !settings.length && !requiredSettings.length && !statuses.length && !requiredStatuses.length && !blockedTitles.length && !likedTitles.length) return "";

  const label = language === "ja" ? "## Interpreted Free-Text Constraints" : "## Interpreted Free-Text Constraints";
  return `\n${label}\n- Strongly avoid tags: ${[...new Set([...hardAvoid, ...avoid])].join(", ") || "none"}\n- Prefer tags: ${boost.join(", ") || "none"}\n- Extra setting preferences: ${settings.join(", ") || "none"}\n- Required setting filters when enough candidates exist: ${requiredSettings.join(", ") || "none"}\n- Extra status preferences: ${statuses.join(", ") || "none"}\n- Required status filters when enough candidates exist: ${requiredStatuses.join(", ") || "none"}\n- Avoid exact referenced titles: ${blockedTitles.join(", ") || "none"}\n- Similar-to referenced titles: ${likedTitles.join(", ") || "none"}\n`;
}

function violatesFreeTextAvoidance(manga, signals) {
  if (!signals) return false;
  const titleKey = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
  if (signals.blockedTitleKeys?.has(titleKey)) return true;
  const tags = new Set(manga.tags || []);
  return Array.from(signals.hardAvoidTags || []).some((tag) => tags.has(tag));
}

function buildPreferenceSignals(answers, questions, freeText = "", language = "ja") {
  const entries = getSelectedEntries(answers, questions);
  const tagWeights = new Map();
  const selectedLabels = [];
  const settingPrefs = new Set();
  const demographics = new Set();
  const statusPrefs = new Set();
  const mediaPrefs = new Set();
  const freeTextSignals = extractFreeTextSignals(freeText);

  entries.forEach((entry) => {
    const weight = QUESTION_WEIGHTS[entry.questionId] || 2;
    selectedLabels.push(getOptionLabel(entry, language));

    if (entry.questionId === "demographic" && DEMOGRAPHIC_VALUES.has(entry.value)) {
      demographics.add(entry.value);
    }
    if (entry.questionId === "setting" && SETTING_VALUES.has(entry.value)) {
      settingPrefs.add(entry.value);
    }
    if (entry.questionId === "status") statusPrefs.add(entry.value);
    if (entry.questionId === "media") mediaPrefs.add(entry.value);

    getAnswerTags(entry.value).forEach((tag) => {
      tagWeights.set(tag, (tagWeights.get(tag) || 0) + weight);
    });
  });

  freeTextSignals.settingPrefs.forEach((value) => settingPrefs.add(value));
  freeTextSignals.demographics.forEach((value) => demographics.add(value));
  freeTextSignals.statusPrefs.forEach((value) => statusPrefs.add(value));
  freeTextSignals.mediaPrefs.forEach((value) => mediaPrefs.add(value));
  freeTextSignals.boostTags.forEach((tag) => tagWeights.set(tag, (tagWeights.get(tag) || 0) + 8));
  freeTextSignals.avoidTags.forEach((tag) => tagWeights.set(tag, (tagWeights.get(tag) || 0) - 14));

  return {
    tagWeights,
    settingPrefs,
    demographics,
    statusPrefs,
    mediaPrefs,
    selectedLabels,
    entries,
    appliedFilterQuestionIds: [],
    avoidTags: freeTextSignals.avoidTags,
    hardAvoidTags: freeTextSignals.hardAvoidTags,
    requiredSettingPrefs: freeTextSignals.requiredSettingPrefs,
    requiredStatusPrefs: freeTextSignals.requiredStatusPrefs,
    appliedFreeTextFilters: [],
    blockedTitleKeys: freeTextSignals.blockedTitleKeys,
    likedTitleKeys: freeTextSignals.likedTitleKeys,
  };
}

function matchesStatusPreference(manga, value) {
  if (value === "completed_only") return manga.status === "completed";
  if (value === "ongoing_only") return manga.status === "ongoing";
  if (value === "short") return manga.volumes && manga.volumes <= 10;
  if (value === "medium") return manga.volumes && manga.volumes > 10 && manga.volumes <= 30;
  if (value === "long" || value === "epic" || value === "long_running") return manga.volumes && manga.volumes >= 30;
  if (value === "hiatus_ok") return manga.status === "hiatus";
  return manga.status === value || (manga.tags || []).includes(value);
}

function matchesRequiredFreeTextSettings(manga, signals) {
  if (!signals?.requiredSettingPrefs || signals.requiredSettingPrefs.size === 0) return true;
  return Array.from(signals.requiredSettingPrefs).some((value) => matchesPreferenceValue(manga, value));
}

function matchesRequiredFreeTextStatuses(manga, signals) {
  if (!signals?.requiredStatusPrefs || signals.requiredStatusPrefs.size === 0) return true;
  return Array.from(signals.requiredStatusPrefs).some((value) => matchesStatusPreference(manga, value));
}

function matchesAppliedFreeTextFilters(manga, signals) {
  const applied = new Set(signals?.appliedFreeTextFilters || []);
  if (applied.has("free_text_setting") && !matchesRequiredFreeTextSettings(manga, signals)) return false;
  if (applied.has("free_text_status") && !matchesRequiredFreeTextStatuses(manga, signals)) return false;
  if (applied.has("free_text_avoid") && mangaHasAnyTag(manga, signals.avoidTags)) return false;
  return true;
}

function scoreManga(manga, signals) {
  if (violatesFreeTextAvoidance(manga, signals)) {
    return { score: -999, matchedTags: [], fitCoverage: 0, strictMisses: 99 };
  }

  const tags = new Set(manga.tags || []);
  let score = 0;
  const matchedTags = [];
  const entriesByQuestion = groupEntriesByQuestion(signals.entries);
  let fitCoverage = 0;
  let strictMisses = 0;
  let coreMisses = 0;

  signals.tagWeights.forEach((weight, tag) => {
    const matched = tags.has(tag) || manga.demographic === tag || manga.status === tag || (tag === "anime_yes" && manga.anime);
    if (matched) {
      score += weight;
      if (weight > 0) matchedTags.push(tag);
    }
  });

  entriesByQuestion.forEach((entries, questionId) => {
    if (!CORE_FIT_QUESTION_IDS.has(questionId)) return;
    const meaningfulEntries = entries.filter((entry) => entry.value && entry.value !== "any");
    if (meaningfulEntries.length === 0) return;

    const matched = matchesQuestionEntries(manga, meaningfulEntries);
    if (matched) {
      fitCoverage += 1;
      score += STRICT_FIT_QUESTION_IDS.has(questionId) ? 7 : 3;
      return;
    }

    coreMisses += 1;
    if (STRICT_FIT_QUESTION_IDS.has(questionId)) {
      strictMisses += 1;
      score -= 12;
    } else {
      score -= 4;
    }
  });

  if (strictMisses >= 2) score -= 22;
  if (coreMisses >= 4) score -= 12;

  if (signals.settingPrefs?.size > 0) {
    const settingMatched = matchesAnySetting(manga, signals);
    if (settingMatched) {
      score += 22;
      matchedTags.push(...Array.from(signals.settingPrefs).filter((value) => matchesPreferenceValue(manga, value)));
    } else {
      score -= 34;
    }

    if (signals.settingPrefs.has("virtual") && !matchesPreferenceValue(manga, "virtual")) {
      score -= 48;
    }
  }

  if (signals.demographics.size > 0) {
    score += signals.demographics.has(manga.demographic) ? 8 : -2;
  }

  if (signals.statusPrefs.has("completed_only")) score += matchesStatusPreference(manga, "completed_only") ? 10 : -8;
  if (signals.statusPrefs.has("ongoing_only")) score += matchesStatusPreference(manga, "ongoing_only") ? 8 : -5;
  if (signals.statusPrefs.has("hiatus_ok") && matchesStatusPreference(manga, "hiatus_ok")) score += 3;
  if (signals.statusPrefs.has("short")) score += matchesStatusPreference(manga, "short") ? 9 : -2;
  if (signals.statusPrefs.has("medium")) score += matchesStatusPreference(manga, "medium") ? 6 : 0;
  if (signals.statusPrefs.has("long") || signals.statusPrefs.has("epic") || signals.statusPrefs.has("long_running")) {
    score += matchesStatusPreference(manga, "long") ? 6 : 0;
  }

  if (signals.mediaPrefs.has("anime_yes")) score += manga.anime ? 6 : -2;
  if (signals.mediaPrefs.has("anime_no")) score += manga.anime ? -2 : 4;
  ["award", "global", "viral", "critic", "cult", "bestseller", "legendary"].forEach((tag) => {
    if (signals.mediaPrefs.has(tag) && tags.has(tag)) score += 5;
  });

  if (signals.avoidTags?.size > 0) {
    signals.avoidTags.forEach((tag) => {
      if (tags.has(tag)) score -= 12;
    });
  }

  if (signals.likedTitleKeys?.size > 0) {
    const titleKey = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    if (signals.likedTitleKeys.has(titleKey)) score += 18;
  }

  if (tags.has("award")) score += 0.7;
  if (tags.has("bestseller") || tags.has("legendary")) score += 0.4;
  if (manga.anime) score += 0.2;

  return { score, matchedTags, fitCoverage, strictMisses };
}

function scoreCandidatePool(signals) {
  const scored = CORE_DB_UNIQUE.map((manga) => {
    const result = scoreManga(manga, signals);
    return {
      manga,
      score: result.score,
      matchedTags: result.matchedTags,
      fitCoverage: result.fitCoverage,
      strictMisses: result.strictMisses,
    };
  });
  const safeScored = scored.filter(({ score }) => score > -500);

  return (safeScored.length >= FALLBACK_RESULT_LIMIT ? safeScored : scored).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if ((a.strictMisses || 0) !== (b.strictMisses || 0)) return (a.strictMisses || 0) - (b.strictMisses || 0);
    if ((b.fitCoverage || 0) !== (a.fitCoverage || 0)) return (b.fitCoverage || 0) - (a.fitCoverage || 0);
    return (b.manga.anime === true) - (a.manga.anime === true);
  });
}

function groupEntriesByQuestion(entries = []) {
  return entries.reduce((groups, entry) => {
    if (!groups.has(entry.questionId)) groups.set(entry.questionId, []);
    groups.get(entry.questionId).push(entry);
    return groups;
  }, new Map());
}

function applyStagedFilters(scored, signals) {
  const entriesByQuestion = groupEntriesByQuestion(signals.entries);
  let narrowed = scored;
  const applied = [];

  STAGED_FILTER_STEPS.forEach(({ questionId, min }) => {
    const entries = entriesByQuestion.get(questionId);
    if (!entries || entries.length === 0) return;

    const filtered = narrowed.filter(({ manga }) => matchesQuestionEntries(manga, entries));
    if (filtered.length >= min) {
      narrowed = filtered;
      applied.push(questionId);
    }
  });

  signals.appliedFilterQuestionIds = applied;
  return narrowed;
}

function keepFilterIfEnough(current, filtered, min) {
  return filtered.length >= min ? filtered : current;
}

function applyFreeTextFilters(scored, signals) {
  let narrowed = scored;
  const applied = [];

  if (signals.requiredSettingPrefs?.size > 0) {
    const filtered = narrowed.filter(({ manga }) => matchesRequiredFreeTextSettings(manga, signals));
    const next = keepFilterIfEnough(narrowed, filtered, FALLBACK_RESULT_LIMIT);
    if (next !== narrowed) {
      narrowed = next;
      applied.push("free_text_setting");
    }
  }

  if (signals.requiredStatusPrefs?.size > 0) {
    const filtered = narrowed.filter(({ manga }) => matchesRequiredFreeTextStatuses(manga, signals));
    const next = keepFilterIfEnough(narrowed, filtered, Math.min(10, FALLBACK_RESULT_LIMIT));
    if (next !== narrowed) {
      narrowed = next;
      applied.push("free_text_status");
    }
  }

  if (signals.avoidTags?.size > 0) {
    const filtered = narrowed.filter(({ manga }) => !mangaHasAnyTag(manga, signals.avoidTags));
    const next = keepFilterIfEnough(narrowed, filtered, Math.min(10, FALLBACK_RESULT_LIMIT));
    if (next !== narrowed) {
      narrowed = next;
      applied.push("free_text_avoid");
    }
  }

  signals.appliedFreeTextFilters = applied;
  return narrowed;
}

function selectCandidatePool(signals, limit = GEMINI_CANDIDATE_LIMIT) {
  const scored = scoreCandidatePool(signals);
  const narrowed = applyFreeTextFilters(applyStagedFilters(scored, signals), signals);
  const meaningfulCoreQuestions = Array.from(groupEntriesByQuestion(signals.entries).entries())
    .filter(([questionId, entries]) => CORE_FIT_QUESTION_IDS.has(questionId) && entries.some((entry) => entry.value && entry.value !== "any"))
    .length;
  const minimumCoverage = Math.min(3, Math.max(1, Math.ceil(meaningfulCoreQuestions / 2)));
  const stricter = narrowed.filter(({ fitCoverage = 0, strictMisses = 0 }) => {
    if (meaningfulCoreQuestions === 0) return true;
    return strictMisses <= 1 && fitCoverage >= minimumCoverage;
  });

  const source = stricter.length >= Math.min(limit, FALLBACK_RESULT_LIMIT) ? stricter : narrowed;
  return source.slice(0, limit);
}

function createWebDiscoveryId(rec) {
  const source = `${rec.title_en || rec.title_ja || rec.id || "discovery"}`;
  const asciiSlug = source
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);

  if (asciiSlug) return `web_${asciiSlug}`;

  const codeSlug = Array.from(source)
    .slice(0, 10)
    .map((char) => char.codePointAt(0).toString(36))
    .join("_");
  return `web_${codeSlug || "discovery"}`;
}

function buildFallbackReason(manga, matchedTags, language) {
  if (language === "en") {
    const labels = matchedTags.slice(0, 3).join(", ");
    return labels
      ? `Selected from the curated database because it strongly matches your answers around ${labels}.`
      : "Selected from the curated database as a balanced match for your quiz answers.";
  }

  const labels = matchedTags
    .slice(0, 3)
    .map((tag) => TAG_LABELS_JA[tag] || tag)
    .join("・");
  return labels
    ? `${labels}の好みに合いやすいため、厳選DBから選びました。${manga.title_ja}は次に読む候補として相性の良い作品です。`
    : "診断の回答と作品情報のバランスを見て、厳選DBから選びました。迷った時の候補として読み始めやすい作品です。";
}
function enrichRecommendations(payload) {
  if (!payload?.recommendations) return payload;
  const seenTitles = new Set();
  let webCount = 0;

  return {
    ...payload,
    recommendations: payload.recommendations.map((rec) => {
      const dbEntry = CORE_DB_BY_ID.get(rec.id);
      if (!dbEntry) {
        return {
          ...rec,
          source: "web",
          id: rec.id && `${rec.id}`.startsWith("web_") ? rec.id : createWebDiscoveryId(rec),
          demographic: rec.demographic || "web",
          status: rec.status || "ongoing",
          anime: typeof rec.anime === "boolean" ? rec.anime : false,
        };
      }

      return {
        ...rec,
        source: "db",
        author: rec.author || dbEntry.author,
        year: rec.year || dbEntry.year,
        volumes: dbEntry.volumes,
        status: rec.status || dbEntry.status,
        anime: typeof rec.anime === "boolean" ? rec.anime : dbEntry.anime,
        tags: dbEntry.tags,
        demographic: rec.demographic || dbEntry.demographic,
      };
    }).filter((rec) => {
      const key = normalizeMangaTitle(rec.title_ja || rec.title_en || rec.id);
      if (!key) return true;
      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      if (rec.source === "web") {
        webCount += 1;
        if (webCount > WEB_DISCOVERY_LIMIT) return false;
      }
      return true;
    }).map((rec, index) => ({ ...rec, rank: index + 1 })),
  };
}

function recommendationMatchesSignals(rec, signals) {
  const dbEntry = rec.source === "db" || CORE_DB_BY_ID.has(rec.id) ? CORE_DB_BY_ID.get(rec.id) : null;
  const manga = dbEntry || rec;
  if (violatesFreeTextAvoidance(manga, signals)) return false;
  if (!matchesAppliedFreeTextFilters(manga, signals)) return false;
  if (!signals?.appliedFilterQuestionIds || signals.appliedFilterQuestionIds.length === 0) return true;
  const entriesByQuestion = groupEntriesByQuestion(signals.entries);

  return signals.appliedFilterQuestionIds.every((questionId) => {
    const entries = entriesByQuestion.get(questionId);
    return !entries || entries.length === 0 || matchesQuestionEntries(manga, entries);
  });
}

function countMatchedFilterQuestions(rec, signals) {
  if (!signals?.appliedFilterQuestionIds || signals.appliedFilterQuestionIds.length === 0) return 0;
  const dbEntry = rec.source === "db" || CORE_DB_BY_ID.has(rec.id) ? CORE_DB_BY_ID.get(rec.id) : null;
  const manga = dbEntry || rec;
  const entriesByQuestion = groupEntriesByQuestion(signals.entries);

  return signals.appliedFilterQuestionIds.reduce((count, questionId) => {
    const entries = entriesByQuestion.get(questionId);
    return entries && entries.length > 0 && matchesQuestionEntries(manga, entries) ? count + 1 : count;
  }, 0);
}

function shouldKeepSettingForAlternative(manga, signals) {
  return !signals?.appliedFilterQuestionIds?.includes("setting") || matchesAnySetting(manga, signals);
}

function createFallbackRecommendation(manga, matchedTags, rank, language) {
  return {
    rank,
    source: "db",
    id: manga.id,
    title_ja: manga.title_ja,
    title_en: manga.title_en,
    author: manga.author,
    year: manga.year,
    volumes: manga.volumes,
    status: manga.status,
    demographic: manga.demographic,
    anime: manga.anime,
    tags: manga.tags,
    description: language === "en" ? manga.desc_en : manga.desc_ja,
    reason: buildFallbackReason(manga, matchedTags, language),
  };
}

function enforceRecommendationFit(payload, signals, language) {
  if (!payload?.recommendations || !signals?.appliedFilterQuestionIds || signals.appliedFilterQuestionIds.length === 0) return payload;

  const filtered = payload.recommendations.filter((rec) => recommendationMatchesSignals(rec, signals));
  const seen = new Set(filtered.map((rec) => normalizeMangaTitle(rec.title_ja || rec.title_en || rec.id)));

  if (filtered.length < FALLBACK_RESULT_LIMIT) {
    for (const { manga, matchedTags } of scoreCandidatePool(signals)) {
      if (!recommendationMatchesSignals(manga, signals)) continue;
      const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
      if (seen.has(key)) continue;
      seen.add(key);
      filtered.push(createFallbackRecommendation(manga, matchedTags, filtered.length + 1, language));
      if (filtered.length >= FALLBACK_RESULT_LIMIT) break;
    }
  }

  const exactCount = filtered.length;
  const minimumPartialMatches = Math.max(1, Math.ceil(signals.appliedFilterQuestionIds.length / 2));

  if (filtered.length < FALLBACK_RESULT_LIMIT) {
    for (const { manga, matchedTags } of scoreCandidatePool(signals)) {
      if (violatesFreeTextAvoidance(manga, signals) || !matchesAppliedFreeTextFilters(manga, signals)) continue;
      if (!shouldKeepSettingForAlternative(manga, signals)) continue;
      if (countMatchedFilterQuestions(manga, signals) < minimumPartialMatches) continue;
      const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
      if (seen.has(key)) continue;
      seen.add(key);
      filtered.push({
        ...createFallbackRecommendation(manga, matchedTags, filtered.length + 1, language),
        matchLevel: "alternative",
      });
      if (filtered.length >= FALLBACK_RESULT_LIMIT) break;
    }
  }

  if (filtered.length < FALLBACK_RESULT_LIMIT) {
    for (const { manga, matchedTags } of scoreCandidatePool(signals)) {
      if (violatesFreeTextAvoidance(manga, signals) || !matchesAppliedFreeTextFilters(manga, signals)) continue;
      const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
      if (seen.has(key)) continue;
      seen.add(key);
      filtered.push({
        ...createFallbackRecommendation(manga, matchedTags, filtered.length + 1, language),
        matchLevel: "alternative",
      });
      if (filtered.length >= FALLBACK_RESULT_LIMIT) break;
    }
  }

  const hasAlternatives = exactCount < FALLBACK_RESULT_LIMIT;

  return {
    ...payload,
    matchNotice: hasAlternatives
      ? {
          type: exactCount === 0 ? "no_exact_match" : "partial_match",
          exactCount,
          message_ja: exactCount === 0
            ? "ご希望すべてにぴったり合う作品は見つかりませんでした。条件に近い漫画をこちらもおすすめします。"
            : "ご希望にかなり近い作品を中心に、条件の一部に合う漫画もあわせておすすめします。",
          message_en: exactCount === 0
            ? "We could not find manga that matched every preference exactly, so here are close alternatives too."
            : "These picks focus on close matches and include a few useful alternatives.",
        }
      : null,
    recommendations: filtered.slice(0, FALLBACK_RESULT_LIMIT).map((rec, index) => ({ ...rec, rank: index + 1 })),
  };
}

function ensureNonEmptyRecommendations(payload, signals, language) {
  if (payload?.recommendations?.length > 0) return payload;

  const seen = new Set();
  const recommendations = [];
  const scored = scoreCandidatePool(signals);

  for (const { manga, matchedTags } of scored) {
    if (violatesFreeTextAvoidance(manga, signals)) continue;
    const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    recommendations.push({
      ...createFallbackRecommendation(manga, matchedTags, recommendations.length + 1, language),
      matchLevel: "alternative",
    });
    if (recommendations.length >= FALLBACK_RESULT_LIMIT) break;
  }

  if (recommendations.length < FALLBACK_RESULT_LIMIT) {
    for (const manga of CORE_DB_UNIQUE) {
      const key = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
      if (key && seen.has(key)) continue;
      if (key) seen.add(key);
      recommendations.push({
        ...createFallbackRecommendation(manga, [], recommendations.length + 1, language),
        matchLevel: "alternative",
      });
      if (recommendations.length >= FALLBACK_RESULT_LIMIT) break;
    }
  }

  return {
    ...(payload || {}),
    fallback: true,
    userProfile: payload?.userProfile || (language === "en"
      ? "We could not find an exact match, so these are close alternatives selected from the curated database."
      : "条件に完全一致する作品が少なかったため、近い作品を厳選DBから選びました。"),
    matchNotice: {
      type: "no_exact_match",
      exactCount: 0,
      message_ja: "ご希望すべてにぴったり合う作品は見つかりませんでした。条件に近い漫画をこちらもおすすめします。",
      message_en: "We could not find manga that matched every preference exactly, so here are close alternatives too.",
    },
    recommendations: recommendations.map((rec, index) => ({ ...rec, rank: index + 1 })),
  };
}

async function requestGeminiRecommendation(prompt, apiKey, signals, language, useGoogleSearch = true) {
  let lastError;

  for (let attempt = 0; attempt < GEMINI_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
    try {
      const geminiRes = await fetch(`${GEMINI_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(useGoogleSearch ? { tools: [{ google_search: {} }] } : {}),
          generationConfig: {
            temperature: attempt === 0 ? 0.7 : 0.35,
            maxOutputTokens: 9000,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        const retryable = geminiRes.status === 429 || geminiRes.status >= 500;
        lastError = new Error(`Gemini API error ${geminiRes.status}: ${errText.slice(0, 500)}`);
        console.error("Gemini API error:", geminiRes.status, errText);
        if (!retryable) throw lastError;
      } else {
        const data = await geminiRes.json();
        const fullText = extractText(data);
        const parsed = extractJSON(fullText);
        if (!validateResponse(parsed)) throw new Error("Gemini response did not match expected shape.");
        return ensureNonEmptyRecommendations(enforceRecommendationFit(enrichRecommendations(parsed), signals, language), signals, language);
      }
    } catch (err) {
      lastError = err;
      console.error(`Gemini recommendation attempt ${attempt + 1} failed:`, err);
    } finally {
      clearTimeout(timeoutId);
    }

    if (attempt < GEMINI_MAX_ATTEMPTS - 1) {
      await sleep(900);
    }
  }

  throw lastError || new Error("Gemini recommendation failed.");
}

function buildFallbackResponse(answers, questions, freeText, language, candidatePool = null) {
  const signals = buildPreferenceSignals(answers, questions, freeText, language);
  const fallbackPool = candidatePool || selectCandidatePool(signals);
  const fallback = ensureNonEmptyRecommendations(enforceRecommendationFit(buildPreviewResponse(answers, questions, freeText, language, fallbackPool), signals, language), signals, language);
  return {
    fallback: true,
    userProfile: language === "en"
      ? "AI was busy, so these picks were selected from the curated database based on your answers."
      : "AIが混み合っていたため、回答に近い作品を厳選DBから選びました。",
    recommendations: fallback.recommendations,
  };
}

function buildPreviewResponse(answers, questions = [], freeText = "", language = "ja", candidatePool = null) {
  const signals = buildPreferenceSignals(answers, questions, freeText, language);
  const scored = candidatePool || selectCandidatePool(signals);

  const seenTitles = new Set();
  const picked = [];
  for (const { manga, matchedTags } of scored) {
    const titleKey = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    if (titleKey && seenTitles.has(titleKey)) continue;
    if (titleKey) seenTitles.add(titleKey);
    picked.push(createFallbackRecommendation(manga, matchedTags, picked.length + 1, language));
    if (picked.length >= FALLBACK_RESULT_LIMIT) break;
  }

  return {
    preview: true,
    userProfile: language === "en"
      ? "These picks were selected from the curated database by matching your answers to genres, tone, length, demographic, and media preferences."
      : "ジャンル、読み味、巻数、対象読者、メディア化の希望をもとに、厳選DBから相性のよい作品を選びました。",
    recommendations: picked,
  };
}

// ------------------------------------------------------------
// POST ハンドラ
// ------------------------------------------------------------
export async function POST(req) {
  try {
    // レート制限
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      const msg = rl.reason === "global"
        ? "現在混雑しています。しばらく経ってからお試しください。"
        : "本日の診断回数の上限に達しました。明日またお試しください。";
      return NextResponse.json({ error: msg }, { status: 429 });
    }

    const body = await req.json();
    const { answers, questions, freeText, language } = body;

    if (!answers || !questions) {
      return NextResponse.json({ error: "Missing answers or questions." }, { status: 400 });
    }

    const requestLanguage = language || "ja";
    const signals = buildPreferenceSignals(answers, questions, freeText, requestLanguage);
    const candidatePool = selectCandidatePool(signals);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(buildPreviewResponse(answers, questions, freeText, requestLanguage, candidatePool));
      }
      return NextResponse.json({ error: "Server misconfiguration: missing API key." }, { status: 500 });
    }

    const prompt = buildPrompt(answers, questions, freeText, requestLanguage, candidatePool);
    // Gemini 2.5 Flash 呼び出し（JSONレスポンス優先）
    try {
      const parsed = await requestGeminiRecommendation(prompt, apiKey, signals, requestLanguage, true);
      return NextResponse.json(parsed);
    } catch (groundedErr) {
      console.error("Grounded Gemini recommendation failed. Returning fallback recommendations:", groundedErr);
      return NextResponse.json(buildFallbackResponse(answers, questions, freeText, requestLanguage, candidatePool));
    }
  } catch (err) {
    console.error("Recommend route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
