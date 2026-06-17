import { NextResponse } from "next/server";
import { ALL_MANGA } from "@/data/mangaCatalog";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const CANDIDATE_LIMIT = 90;
const RESULT_LIMIT = 30;

function normalizeText(value) {
  return `${value || ""}`.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

function uniqueItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getQuerySignals(query) {
  const text = normalizeText(query);
  const signals = {
    tags: new Set(),
    bonus: [],
  };

  const add = (tags) => tags.forEach((tag) => signals.tags.add(tag));

  if (/面白|おもしろ|王道|名作|人気|おすすめ/.test(text)) add(["entertainment", "bestseller", "award", "viral", "anime_yes"]);
  if (/泣|感動|エモ|余韻|切ない/.test(text)) add(["emotional", "emotional_catharsis", "melancholic", "human_drama", "family_theme"]);
  if (/怖|ホラー|不気味|グロ|鬱|ダーク/.test(text)) add(["horror", "dark", "brutal", "shock", "suspense"]);
  if (/バトル|戦闘|能力|アクション|熱い/.test(text)) add(["battle", "action", "burning", "tournament", "shonen_classic"]);
  if (/恋愛|ラブ|胸キュン|青春|少女/.test(text)) add(["romance", "shojo_kirakira", "warm", "school", "coming_of_age"]);
  if (/異世界|ファンタジ|魔法|冒険|旅/.test(text)) add(["fantasy", "adventure", "journey", "worldbuilding"]);
  if (/謎|ミステリ|推理|考察|頭脳|天才/.test(text)) add(["mystery", "twist", "psychological", "prodigy", "dialogue"]);
  if (/スポーツ|部活|試合|サッカー|野球|バレー/.test(text)) add(["sports", "tournament", "burning", "coming_of_age"]);
  if (/癒|ほのぼの|日常|ゆる|安心/.test(text)) add(["healing", "slice_of_life", "warm", "comfort", "wholesome"]);
  if (/仕事|社会|大人|人間ドラマ|リアル/.test(text)) add(["workplace", "social", "human_drama", "adult", "realism"]);
  if (/sf|近未来|宇宙|ロボ|サイバー/.test(text)) add(["sci_fi", "space", "virtual", "post_apocalypse"]);
  if (/歴史|時代|戦国|幕末/.test(text)) add(["historical", "war", "politics"]);
  if (/完結|最後まで|一気読み/.test(text)) signals.bonus.push((manga) => manga.status === "completed" ? 16 : 0);
  if (/短い|短く|サクッ|すぐ読/.test(text)) signals.bonus.push((manga) => manga.volumes && manga.volumes <= 12 ? 18 : 0);
  if (/長い|長編|じっくり/.test(text)) signals.bonus.push((manga) => manga.volumes && manga.volumes >= 25 ? 12 : 0);
  if (/新しい|最近|最新|今|トレンド|話題/.test(text)) signals.bonus.push((manga) => manga.year && manga.year >= 2020 ? 18 : manga.year && manga.year >= 2016 ? 8 : 0);
  if (/アニメ|映像化/.test(text)) signals.bonus.push((manga) => manga.anime ? 16 : 0);

  return signals;
}

function scoreManga(manga, query) {
  const normalizedQuery = normalizeText(query);
  const titleJa = normalizeText(manga.title_ja);
  const titleEn = normalizeText(manga.title_en);
  const author = normalizeText(manga.author);
  const desc = normalizeText(`${manga.desc_ja || ""} ${manga.desc_en || ""}`);
  const tagText = normalizeText((manga.tags || []).join(" "));
  const signals = getQuerySignals(query);
  const tags = new Set(manga.tags || []);
  let score = 0;

  if (normalizedQuery && (titleJa === normalizedQuery || titleEn === normalizedQuery)) score += 120;
  if (normalizedQuery && (titleJa.includes(normalizedQuery) || titleEn.includes(normalizedQuery))) score += 70;
  if (normalizedQuery && author.includes(normalizedQuery)) score += 38;
  if (normalizedQuery && desc.includes(normalizedQuery)) score += 12;
  if (normalizedQuery && tagText.includes(normalizedQuery)) score += 10;

  signals.tags.forEach((tag) => {
    if (tags.has(tag)) score += 15;
    if (tag === "anime_yes" && manga.anime) score += 12;
    if (manga.demographic === tag || manga.status === tag) score += 8;
  });

  signals.bonus.forEach((bonus) => {
    score += bonus(manga);
  });

  if (manga.anime) score += 3;
  if (manga.year && manga.year >= 2018) score += 2;
  if (manga.status === "completed") score += 1;

  return score;
}

function rankFallback(query, limit = RESULT_LIMIT) {
  const scored = ALL_MANGA
    .map((manga) => ({ manga, score: scoreManga(manga, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.manga.year || 0) - (a.manga.year || 0))
    .map((item) => item.manga);

  const fallback = scored.length > 0
    ? scored
    : ALL_MANGA
        .filter((manga) => manga.anime || (manga.tags || []).some((tag) => ["bestseller", "award", "viral", "entertainment"].includes(tag)))
        .sort((a, b) => (b.year || 0) - (a.year || 0));

  return uniqueItems(fallback).slice(0, limit);
}

function serializeManga(manga) {
  return {
    id: manga.id,
    title_ja: manga.title_ja,
    title_en: manga.title_en,
    author: manga.author,
    year: manga.year,
    volumes: manga.volumes,
    status: manga.status,
    demographic: manga.demographic,
    anime: manga.anime,
    tags: manga.tags || [],
    desc_ja: manga.desc_ja,
    desc_en: manga.desc_en,
  };
}

function extractJson(text) {
  const raw = `${text || ""}`.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function askGemini(query, candidates) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const compactCandidates = candidates.map((manga) => ({
    id: manga.id,
    title: manga.title_ja || manga.title_en,
    author: manga.author,
    year: manga.year,
    status: manga.status,
    volumes: manga.volumes,
    anime: manga.anime,
    tags: (manga.tags || []).slice(0, 8),
    desc: manga.desc_ja || manga.desc_en || "",
  }));

  const prompt = [
    "あなたは漫画推薦サイトの検索AIです。",
    "ユーザーの曖昧な検索文に合う漫画を、候補リストの中から最大30件選んでください。",
    "作品IDだけを使い、候補にない作品は出さないでください。",
    "有名作だけに寄せすぎず、検索意図に合うものを優先してください。",
    "返答は必ず JSON のみです。形式: {\"ids\":[\"id\"],\"reason\":\"短い理由\"}",
    `ユーザー検索: ${query}`,
    `候補: ${JSON.stringify(compactCandidates)}`,
  ].join("\n");

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 1600,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  return extractJson(text);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const query = `${body?.query || ""}`.trim();
    if (!query) {
      return NextResponse.json({ results: [], aiUsed: false, reason: "" });
    }

    const candidates = rankFallback(query, CANDIDATE_LIMIT);
    let selected = null;
    let reason = "";
    let aiUsed = false;

    try {
      const ai = await askGemini(query, candidates);
      const ids = Array.isArray(ai?.ids) ? ai.ids : [];
      if (ids.length > 0) {
        const candidateById = new Map(candidates.map((manga) => [manga.id, manga]));
        selected = uniqueItems(ids.map((id) => candidateById.get(id)).filter(Boolean)).slice(0, RESULT_LIMIT);
        reason = `${ai?.reason || ""}`.trim();
        aiUsed = selected.length > 0;
      }
    } catch {
      selected = null;
    }

    const results = selected && selected.length > 0 ? selected : candidates.slice(0, RESULT_LIMIT);

    return NextResponse.json({
      results: results.map(serializeManga),
      aiUsed,
      reason: reason || (aiUsed ? "AIが検索文に近い候補を選びました。" : "検索文に近いタグ・説明文から候補を選びました。"),
    });
  } catch {
    return NextResponse.json({ results: [], aiUsed: false, reason: "", error: "search_failed" }, { status: 500 });
  }
}
