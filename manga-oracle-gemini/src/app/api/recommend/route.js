// ============================================================
// /api/recommend — Gemini 3.1 Pro バックエンド
// ============================================================
// 役割:
//   - フロントから「12問の回答 + 自由記述 + 言語」を受け取る
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
const CORE_DB = [...CORE_DB_BASE, ...CORE_DB_EXTRA, ...CORE_DB_EXTRA2, ...CORE_DB_EXTRA3, ...CORE_DB_EXTRA4];

// Gemini APIのエンドポイント（v1beta / generateContent）
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_MAX_ATTEMPTS = 2;
const GEMINI_TIMEOUT_MS = 28000;

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

const ANSWER_TAG_ALIASES = {
  healing_story: ["healing", "warm", "comfort", "wholesome"],
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
  sketchy: ["loose", "unique"],
  shonen_modern: ["shonen_classic", "dynamic", "battle"],
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
  tragic: ["dark", "melancholic", "emotional"],
  epic_finale: ["long_arc", "world", "emotional_catharsis"],
  realistic_end: ["realism", "human_drama"],
  hopeful: ["warm", "coming_of_age"],
};

const DEMOGRAPHIC_VALUES = new Set(["shonen", "shojo", "seinen", "josei", "web", "kodomo"]);

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
function buildPrompt(answers, questions, freeText, language) {
  const profileSummary = questions.map((q) => {
    const selectedValues = answers[q.id] || [];
    const labels = selectedValues.map((v) => {
      const opt = q.options.find((o) => o.v === v);
      return opt ? (language === "ja" ? opt.ja : opt.en) : v;
    });
    const questionText = language === "ja" ? q.text_ja : q.text_en;
    return `- ${questionText}\n  → ${labels.join(", ")}`;
  }).join("\n");

  const dbJson = JSON.stringify(
    CORE_DB.map((m) => ({
      id: m.id, title_ja: m.title_ja, title_en: m.title_en, author: m.author,
      year: m.year, volumes: m.volumes, status: m.status, demographic: m.demographic,
      anime: m.anime, tags: m.tags, desc: language === "ja" ? m.desc_ja : m.desc_en,
    }))
  );

  const langInstruction = language === "ja"
    ? `CRITICAL LANGUAGE REQUIREMENT: Write ALL text fields (userProfile, description, reason) ENTIRELY in natural Japanese. Prefer Japanese titles for "title_ja". Do NOT mix English sentences into description or reason.`
    : `CRITICAL LANGUAGE REQUIREMENT: Write ALL text fields (userProfile, description, reason) ENTIRELY in natural English. Even though the curated database provides Japanese descriptions, you MUST write your own "description" and "reason" in English — do NOT copy the Japanese desc. Use English titles for display where available.`;

  const freeTextSection = freeText && freeText.trim()
    ? `\n## User's Free-Text Request (IMPORTANT — honor this carefully)\nThe user added this note in their own words. Treat it as a high-priority signal (e.g. if they say they dislike something, avoid recommending it):\n"${freeText.trim()}"\n`
    : "";

  return `You are a world-class manga recommendation expert.

Recommend only from this source:

## Curated Database (1800 hand-picked titles)
These are pre-vetted works spanning all genres & eras. Use them as RELIABLE quality picks.

\`\`\`json
${dbJson}
\`\`\`

## User's Quiz Answers
${profileSummary}
${freeTextSection}
## Your Task

1. Analyze the user's preference profile.
2. Review the curated DB carefully — with 1800 titles, there are likely many strong matches.
3. Choose ONE ranked list of 20 manga from the curated database.
4. Mark each recommendation's source as "db".

## Output Format

${langInstruction}

Return ONLY a valid JSON object (no markdown fences, no preamble):

{
  "userProfile": "1-2 sentence vivid description in second person",
  "recommendations": [
    { "rank": 1, "source": "db", "id": "one_piece", "title_ja": "...", "title_en": "...", "author": "...", "year": 1997, "volumes": 108, "status": "ongoing", "demographic": "shonen", "anime": true, "description": "1-2 sentence summary", "reason": "2-3 sentences why THIS fits THIS reader" }
  ]
}

## Rules

- ${langInstruction}
- "source" must be "db" and include the id from DB.
- Rank by best fit (rank 1 = strongest).
- Top 3: enthusiastic, detailed reasons. Items 4-10: concise. Items 11-20: brief.
- ALWAYS reference the user's specific answers in your reasons.
- If the user provided a free-text request, treat it as top priority: respect dislikes (exclude matching works) and lean into stated likes.
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

function normalizeMangaTitle(title) {
  return `${title || ""}`
    .toLowerCase()
    .replace(/[!！?？:：・.\s　\-ー〜~]/g, "")
    .trim();
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

function buildPreferenceSignals(answers, questions, freeText = "", language = "ja") {
  const entries = getSelectedEntries(answers, questions);
  const tagWeights = new Map();
  const selectedLabels = [];
  const demographics = new Set();
  const statusPrefs = new Set();
  const mediaPrefs = new Set();
  const freeTextValue = `${freeText || ""}`.toLowerCase();
  const avoidTags = new Set();
  const boostTags = new Set();

  entries.forEach((entry) => {
    const weight = QUESTION_WEIGHTS[entry.questionId] || 2;
    selectedLabels.push(getOptionLabel(entry, language));

    if (entry.questionId === "demographic" && DEMOGRAPHIC_VALUES.has(entry.value)) {
      demographics.add(entry.value);
    }
    if (entry.questionId === "status") statusPrefs.add(entry.value);
    if (entry.questionId === "media") mediaPrefs.add(entry.value);

    getAnswerTags(entry.value).forEach((tag) => {
      tagWeights.set(tag, (tagWeights.get(tag) || 0) + weight);
    });
  });

  if (/鬱|胸糞|救われない|しんどい|暗すぎ|重すぎ/.test(freeTextValue)) {
    ["dark", "brutal", "shock", "melancholic", "horror"].forEach((tag) => avoidTags.add(tag));
    ["warm", "wholesome", "healing", "emotional_catharsis"].forEach((tag) => boostTags.add(tag));
  }
  if (/グロ|残酷|怖い|ホラー/.test(freeTextValue)) {
    ["horror", "brutal", "shock"].forEach((tag) => avoidTags.add(tag));
  }
  if (/完結|終わって/.test(freeTextValue)) statusPrefs.add("completed_only");
  if (/短め|短い|サクッ|すぐ読/.test(freeTextValue)) statusPrefs.add("short");
  if (/明る|笑える|楽しい|軽い/.test(freeTextValue)) {
    ["light_comedy", "warm", "wholesome", "comedy_gag"].forEach((tag) => boostTags.add(tag));
  }
  if (/泣ける|感動|余韻/.test(freeTextValue)) {
    ["emotional", "human_drama", "emotional_catharsis"].forEach((tag) => boostTags.add(tag));
  }

  boostTags.forEach((tag) => tagWeights.set(tag, (tagWeights.get(tag) || 0) + 4));
  avoidTags.forEach((tag) => tagWeights.set(tag, (tagWeights.get(tag) || 0) - 6));

  return { tagWeights, demographics, statusPrefs, mediaPrefs, selectedLabels };
}

function scoreManga(manga, signals) {
  const tags = new Set(manga.tags || []);
  let score = 0;
  const matchedTags = [];

  signals.tagWeights.forEach((weight, tag) => {
    const matched = tags.has(tag) || manga.demographic === tag || manga.status === tag || (tag === "anime_yes" && manga.anime);
    if (matched) {
      score += weight;
      if (weight > 0) matchedTags.push(tag);
    }
  });

  if (signals.demographics.size > 0) {
    score += signals.demographics.has(manga.demographic) ? 8 : -2;
  }

  if (signals.statusPrefs.has("completed_only")) score += manga.status === "completed" ? 10 : -8;
  if (signals.statusPrefs.has("ongoing_only")) score += manga.status === "ongoing" ? 8 : -5;
  if (signals.statusPrefs.has("hiatus_ok") && manga.status === "hiatus") score += 3;
  if (signals.statusPrefs.has("short")) score += manga.volumes && manga.volumes <= 10 ? 9 : -2;
  if (signals.statusPrefs.has("medium")) score += manga.volumes && manga.volumes > 10 && manga.volumes <= 30 ? 6 : 0;
  if (signals.statusPrefs.has("long") || signals.statusPrefs.has("epic") || signals.statusPrefs.has("long_running")) {
    score += manga.volumes && manga.volumes >= 30 ? 6 : 0;
  }

  if (signals.mediaPrefs.has("anime_yes")) score += manga.anime ? 6 : -2;
  if (signals.mediaPrefs.has("anime_no")) score += manga.anime ? -2 : 4;
  ["award", "global", "viral", "critic", "cult", "bestseller", "legendary"].forEach((tag) => {
    if (signals.mediaPrefs.has(tag) && tags.has(tag)) score += 5;
  });

  if (tags.has("award")) score += 1.2;
  if (tags.has("bestseller") || tags.has("legendary")) score += 1;
  if (manga.anime) score += 0.5;

  return { score, matchedTags };
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
    ? `${labels}の好みに合いやすいため、厳選DBから選びました。${manga.title_ja}は読み味とテーマの相性がよく、次に読む候補として外しにくい作品です。`
    : "診断の回答と作品情報のバランスを見て、厳選DBから選びました。迷った時の候補として読み始めやすい作品です。";
}

function enrichRecommendations(payload) {
  if (!payload?.recommendations) return payload;
  const seenTitles = new Set();

  return {
    ...payload,
    recommendations: payload.recommendations.map((rec) => {
      const dbEntry = CORE_DB.find((m) => m.id === rec.id);
      if (!dbEntry) return rec;

      return {
        ...rec,
        tags: dbEntry.tags,
        demographic: rec.demographic || dbEntry.demographic,
      };
    }).filter((rec) => {
      const key = normalizeMangaTitle(rec.title_ja || rec.title_en || rec.id);
      if (!key) return true;
      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    }).map((rec, index) => ({ ...rec, rank: index + 1 })),
  };
}

async function requestGeminiRecommendation(prompt, apiKey) {
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
          generationConfig: {
            temperature: attempt === 0 ? 0.7 : 0.35,
            maxOutputTokens: 16000,
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
        return enrichRecommendations(parsed);
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

function buildFallbackResponse(answers, questions, freeText, language) {
  const fallback = buildPreviewResponse(answers, questions, freeText, language);
  return {
    fallback: true,
    userProfile: language === "en"
      ? "AI was busy, so these picks were selected from the curated database based on your answers."
      : "AIが混み合っていたため、回答に近い作品を厳選DBから選びました。",
    recommendations: fallback.recommendations,
  };
}

function buildPreviewResponse(answers, questions = [], freeText = "", language = "ja") {
  const signals = buildPreferenceSignals(answers, questions, freeText, language);
  const scored = CORE_DB.map((m) => {
    const result = scoreManga(m, signals);
    return { manga: m, score: result.score, matchedTags: result.matchedTags };
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.manga.anime === true) - (a.manga.anime === true);
  });

  const seenTitles = new Set();
  const picked = [];
  for (const { manga, matchedTags } of scored) {
    const titleKey = normalizeMangaTitle(manga.title_ja || manga.title_en || manga.id);
    if (titleKey && seenTitles.has(titleKey)) continue;
    if (titleKey) seenTitles.add(titleKey);
    picked.push({
      rank: picked.length + 1,
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
    });
    if (picked.length >= 20) break;
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json(buildPreviewResponse(answers, questions, freeText, language || "ja"));
      }
      return NextResponse.json({ error: "Server misconfiguration: missing API key." }, { status: 500 });
    }

    const prompt = buildPrompt(answers, questions, freeText, language || "ja");
    // Gemini 2.5 Flash 呼び出し（JSONレスポンス優先）
    try {
      const parsed = await requestGeminiRecommendation(prompt, apiKey);
      return NextResponse.json(parsed);
    } catch (aiErr) {
      console.error("Gemini failed after retries. Returning fallback recommendations:", aiErr);
      return NextResponse.json(buildFallbackResponse(answers, questions, freeText, language || "ja"));
    }
  } catch (err) {
    console.error("Recommend route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
