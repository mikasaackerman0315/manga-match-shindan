// ============================================================
// /api/recommend — Gemini 3.1 Pro バックエンド
// ============================================================
// 役割:
//   - フロントから「12問の回答 + 自由記述 + 言語」を受け取る
//   - 1500作品DBを使って Gemini 2.5 Flash に推薦させる
//   - 結果のJSONをパースしてフロントに返す
// セキュリティ: APIキーはサーバー側のみ（NEXT_PUBLIC_ を付けない）
// ============================================================

import { NextResponse } from "next/server";
import { CORE_DB as CORE_DB_BASE } from "@/data/coreDB";
import { CORE_DB_EXTRA } from "@/data/coreDB_extra";
import { CORE_DB_EXTRA2 } from "@/data/coreDB_extra2";
import { CORE_DB_EXTRA3 } from "@/data/coreDB_extra3";

// 既存207作品 + 追加193作品 + 追加600作品 + 追加500作品 = 計1500作品
const CORE_DB = [...CORE_DB_BASE, ...CORE_DB_EXTRA, ...CORE_DB_EXTRA2, ...CORE_DB_EXTRA3];

// Gemini APIのエンドポイント（v1beta / generateContent）
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_MAX_ATTEMPTS = 2;

// ------------------------------------------------------------
// シンプルなメモリ内レート制限（本番ではRedis等を推奨）
// ------------------------------------------------------------
const rateLimitStore = new Map(); // key: ip-date, value: count
const DAILY_GLOBAL_LIMIT = 300;   // サイト全体の1日あたり上限
const PER_USER_DAILY_LIMIT = 5;   // 1IPあたりの1日上限

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

## Curated Database (1500 hand-picked titles)
These are pre-vetted works spanning all genres & eras. Use them as RELIABLE quality picks.

\`\`\`json
${dbJson}
\`\`\`

## User's Quiz Answers
${profileSummary}
${freeTextSection}
## Your Task

1. Analyze the user's preference profile.
2. Review the curated DB carefully — with 1500 titles, there are likely many strong matches.
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

async function requestGeminiRecommendation(prompt, apiKey) {
  let lastError;

  for (let attempt = 0; attempt < GEMINI_MAX_ATTEMPTS; attempt += 1) {
    try {
      const geminiRes = await fetch(`${GEMINI_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
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
        return parsed;
      }
    } catch (err) {
      lastError = err;
      console.error(`Gemini recommendation attempt ${attempt + 1} failed:`, err);
    }

    if (attempt < GEMINI_MAX_ATTEMPTS - 1) {
      await sleep(900);
    }
  }

  throw lastError || new Error("Gemini recommendation failed.");
}

function buildFallbackResponse(answers, language) {
  const fallback = buildPreviewResponse(answers, language);
  return {
    userProfile: language === "en"
      ? "AI was busy, so these picks were selected from the curated database based on your answers."
      : "AIが混み合っていたため、回答に近い作品を厳選DBから選びました。",
    recommendations: fallback.recommendations.map((rec) => ({
      ...rec,
      reason: language === "en"
        ? "This title was selected from the curated database because its tags match your quiz answers."
        : "診断の回答と作品タグの相性が高いため、厳選DBから選びました。",
    })),
  };
}

function buildPreviewResponse(answers, language) {
  const selected = Object.values(answers || {}).flat();
  const scored = CORE_DB.map((m) => {
    const score = selected.reduce((sum, v) => sum + (m.tags?.includes(v) ? 1 : 0), 0);
    return { manga: m, score };
  }).sort((a, b) => b.score - a.score);

  const picked = scored.slice(0, 20).map(({ manga }, i) => ({
    rank: i + 1,
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
    description: language === "en" ? manga.desc_en : manga.desc_ja,
    reason: language === "en"
      ? "Preview mode recommendation from the curated database. Add GEMINI_API_KEY to enable AI-written reasons."
      : "プレビューモードのため、厳選DBから仮推薦しています。GEMINI_API_KEYを設定するとAIによる理由生成が有効になります。",
  }));

  return {
    userProfile: language === "en"
      ? "Preview mode is active because GEMINI_API_KEY is not set."
      : "GEMINI_API_KEY未設定のため、現在はプレビューモードで表示しています。",
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
        return NextResponse.json(buildPreviewResponse(answers, language || "ja"));
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
      return NextResponse.json(buildFallbackResponse(answers, language || "ja"));
    }
  } catch (err) {
    console.error("Recommend route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 }
    );
  }
}
