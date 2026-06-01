"use client";

import React, { useState, useEffect, useRef } from "react";
import { QUESTIONS_SIMPLE, QUESTIONS_DETAILED } from "@/data/questions";
import MangaCover from "./MangaCover";
import StoreLinks from "./StoreLinks";
import { getDiagnosisType, trackEvent } from "./analytics";

// ============================================================
// 広告枠コンポーネント（将来 Google AdSense 等を入れる場所）
// ============================================================
// 使い方:
//   - 今は枠だけ表示（プレースホルダー）
//   - AdSense導入時は、下の <!-- AD --> 部分に広告コードを貼る
//   - slot prop でどの位置の広告かを区別
function AdSlot({ slot, label = "Advertisement" }) {
  return (
    <div
      className="w-full my-8 flex items-center justify-center"
      data-ad-slot={slot}
      style={{
        minHeight: "90px",
        border: "1px dashed rgba(10,10,10,0.2)",
        backgroundColor: "rgba(10,10,10,0.02)",
      }}
    >
      {/* ▼▼▼ 広告コードをここに貼る（例: Google AdSense の <ins> タグ）▼▼▼ */}
      {/* <ins className="adsbygoogle" style={{display:'block'}} data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" /> */}
      {/* ▲▲▲ ここまで ▲▲▲ */}
      <span
        className="text-xs tracking-[0.3em] uppercase"
        style={{ color: "#bbb", fontFamily: "'JetBrains Mono', monospace" }}
      >
        {label} · {slot}
      </span>
    </div>
  );
}


// ============================================================
// UI Translations
// ============================================================
const T = {
  ja: {
    appTitle: "マンガマッチ診断", appSubtitle: "質問に答えるだけで、あなたに合う漫画をAIが見つけます。",
    chooseMode: "診断モードを選んでください",
    simpleTitle: "シンプル診断", simpleDesc: "6つの質問でサクッと。気軽に試したい人向け。", simpleTime: "約1分",
    detailedTitle: "こだわり診断", detailedDesc: "15の質問で深く掘り下げ。選択肢も豊富。じっくり選びたい人向け。", detailedTime: "約4分",
    startQuiz: "診断を始める",
    intro: "AIが厳選1500作品DBを分析し、あなたの好みに合った漫画を最大20作品ランキング形式で推薦します。",
    next: "次へ", back: "戻る", submit: "AIに判定させる", progress: "問",
    loading: "AIが分析中…",
    yourProfile: "あなたの読書プロファイル",
    top3: "絶対読んでほしい", next7: "これも合うはず", last10: "気が向いたら",
    retake: "もう一度診断する", error: "エラーが発生しました。もう一度お試しください。",
    selectMax: "最大", selectMaxSuffix: "つまで選択可能",
    volumes: "巻", anime: "アニメ化",
    status_completed: "完結", status_ongoing: "連載中", status_hiatus: "休載中",
    poweredBy: "POWERED BY GEMINI 2.5 FLASH · 1500作品DB",
    sourceDB: "DB", sourceWeb: "Web発掘",
    buyLinks: "読む・探す",
    amazon: "Amazon",
    kindle: "Kindle",
    paper: "紙の本",
    rakuten: "楽天",
    preview: "試し読み",
    modeBadgeSimple: "シンプル", modeBadgeDetailed: "こだわり",
    freeTextStep: "あと少し（任意）",
    freeTextTitle: "その他、こだわりはある？",
    freeTextDesc: "選択肢で表せなかった希望を自由に書いてください（任意）。AIがしっかり汲み取ります。書かなくてもOK。",
    freeTextPlaceholder: "例：鬱展開は苦手 / 主人公が報われる話がいい",
    freeTextExamples: ["鬱展開は苦手", "報われる結末がいい", "頭脳戦が好き", "動物が死ぬのは無理", "余韻が残る作品"],
    skip: "スキップ",
    shareResult: "結果をシェア",
    shareLead: "おすすめされた漫画をメモ代わりに共有できます。",
    shareText: "マンガマッチ診断で自分に合う漫画を診断しました。",
  },
  en: {
    appTitle: "MANGA MATCH QUIZ", appSubtitle: "Answer a few questions and let AI find manga that fits you.",
    chooseMode: "Choose your quiz mode",
    simpleTitle: "Quick Quiz", simpleDesc: "Just 6 questions. For a fast, casual try.", simpleTime: "~1 min",
    detailedTitle: "Deep Dive", detailedDesc: "15 questions with rich options. For those who want precision.", detailedTime: "~4 min",
    startQuiz: "Start Quiz",
    intro: "AI analyzes a curated 1500-title database to find up to 20 manga matched to your tastes.",
    next: "Next", back: "Back", submit: "Let AI Decide", progress: "of",
    loading: "AI is analyzing…",
    yourProfile: "Your Reading Profile",
    top3: "Must Reads", next7: "Highly Recommended", last10: "Worth Exploring",
    retake: "Take Quiz Again", error: "Something went wrong. Please try again.",
    selectMax: "Select up to", selectMaxSuffix: "",
    volumes: " vol", anime: "Anime",
    status_completed: "Completed", status_ongoing: "Ongoing", status_hiatus: "On hiatus",
    poweredBy: "POWERED BY GEMINI 2.5 FLASH · 1500-TITLE DB",
    sourceDB: "Curated", sourceWeb: "Web Find",
    buyLinks: "Read / Shop",
    amazon: "Amazon",
    kindle: "Kindle",
    paper: "Print",
    rakuten: "Rakuten",
    preview: "Preview",
    modeBadgeSimple: "Quick", modeBadgeDetailed: "Deep",
    freeTextStep: "ALMOST DONE (OPTIONAL)",
    freeTextTitle: "Anything else you care about?",
    freeTextDesc: "Write any preferences the options couldn't capture (optional). The AI will take it into account.",
    freeTextPlaceholder: "e.g. No depressing endings / I like mind games",
    freeTextExamples: ["No depressing plots", "Want a rewarding ending", "Love mind games", "No animal deaths", "Leaves an impression"],
    skip: "Skip",
    shareResult: "Share Results",
    shareLead: "Save or share your manga match results.",
    shareText: "I found my manga matches with Manga Match Quiz.",
  },
};

const LOADING_STEP_COUNT = 4;
const RELATED_THEMES = [
  { slug: "fantasy", label_ja: "異世界・ファンタジー", label_en: "Fantasy", tags: ["fantasy", "adventure", "worldbuilding", "mythology", "urban_fantasy"] },
  { slug: "modern", label_ja: "現代・日常", label_en: "Modern / Slice of Life", tags: ["modern", "school", "slice_of_life", "daily_buildup", "warm"] },
  { slug: "sci-fi", label_ja: "SF・近未来", label_en: "Sci-Fi", tags: ["sci_fi", "space", "post_apocalypse", "virtual", "philosophical"] },
  { slug: "horror", label_ja: "ホラー・ダーク", label_en: "Horror / Dark", tags: ["horror", "dark", "brutal", "survival", "shock"] },
  { slug: "romance", label_ja: "恋愛・ロマンス", label_en: "Romance", tags: ["romance", "shojo_kirakira", "emotional", "family_theme"] },
  { slug: "mystery", label_ja: "ミステリー・頭脳戦", label_en: "Mystery", tags: ["mystery", "mysterious", "suspense", "psychological", "twist"] },
  { slug: "sports", label_ja: "スポーツ", label_en: "Sports", tags: ["sports", "tournament", "burning", "underdog_growth"] },
  { slug: "healing", label_ja: "癒し・ほのぼの", label_en: "Healing", tags: ["healing", "wholesome", "comfort", "cute", "soft"] },
  { slug: "workplace", label_ja: "仕事・専門職", label_en: "Workplace", tags: ["workplace", "specialty", "educational", "workplace_pro"] },
  { slug: "classic", label_ja: "名作・クラシック", label_en: "Classics", tags: ["classic", "legendary", "award", "long_running"] },
];

function PurchaseLinks({ rec, t, compact = false }) {
  const title = `${rec.title_ja || rec.title_en || ""}`.trim();
  return <StoreLinks title={title} labels={t} compact={compact} showHeading={!compact} pageType="diagnosis_result" />;
}

function ReadingActionHint({ compact = false }) {
  const items = ["電子書籍ならすぐ読めます", "紙の本や全巻セットも探せます", "価格や在庫はリンク先で確認してください"];
  return (
    <div className={compact ? "mt-3 flex flex-wrap gap-1.5" : "mt-4 flex flex-wrap gap-2"}>
      {items.map((item) => (
        <span key={item} className={compact ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"} style={{ border: "1px solid rgba(10,10,10,0.12)", color: "#666", backgroundColor: "rgba(245,243,238,0.55)" }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function getDiagnosisErrorType(error) {
  const message = error?.message?.toLowerCase?.() || "";
  if (message.includes("parse") || message.includes("json")) return "json_parse_error";
  if (message.includes("empty_result")) return "empty_result";
  if (message.includes("api") || message.includes("request") || message.includes("failed")) return "api_error";
  return "unknown_error";
}

function getShareUrl() {
  if (typeof window === "undefined") return "https://www.mangamatchquiz.com/";
  return window.location.origin;
}

function getRelatedThemes(recommendations = [], language = "ja") {
  const tagCounts = new Map();
  recommendations.forEach((rec) => {
    (rec.tags || []).forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1));
    if (rec.demographic === "shojo" || rec.demographic === "josei") tagCounts.set("romance", (tagCounts.get("romance") || 0) + 1);
  });

  return RELATED_THEMES.map((theme) => ({
    ...theme,
    score: theme.tags.reduce((sum, tag) => sum + (tagCounts.get(tag) || 0), 0),
  }))
    .filter((theme) => theme.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((theme) => ({ ...theme, label: language === "ja" ? theme.label_ja : theme.label_en }));
}

function RelatedThemeLinks({ recommendations, language }) {
  const themes = getRelatedThemes(recommendations, language);
  if (themes.length === 0) return null;

  return (
    <div className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.6)" }}>
      <div className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
        RELATED GUIDES
      </div>
      <h3 className="text-xl md:text-2xl font-medium mb-4" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
        {language === "ja" ? "この系統の漫画をもっと見る" : "Explore Similar Themes"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <a key={theme.slug} href={`/themes/${theme.slug}`} onClick={() => trackEvent("theme_article_click", { theme_slug: theme.slug, theme_title: theme.label })} className="px-4 py-2 text-xs tracking-[0.16em] uppercase transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.18)", color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}>
            {theme.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [language, setLanguage] = useState("ja");
  const [mode, setMode] = useState("detailed");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [freeText, setFreeText] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const prefetchRef = useRef({ key: "", promise: null });

  const t = T[language];
  const QUESTIONS = mode === "simple" ? QUESTIONS_SIMPLE : QUESTIONS_DETAILED;
  const diagnosisType = getDiagnosisType(mode);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("start") === "1") {
      setScreen("mode");
    }
  }, []);

  useEffect(() => {
    if (screen === "loading") {
      const interval = setInterval(() => {
        setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEP_COUNT - 1));
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const startMode = (selectedMode) => {
    trackEvent("diagnosis_start", { diagnosis_type: getDiagnosisType(selectedMode) });
    setMode(selectedMode);
    setAnswers({});
    setFreeText("");
    setCurrentQ(0);
    prefetchRef.current = { key: "", promise: null };
    setScreen("quiz");
  };

  const buildRecommendBody = (nextAnswers, nextFreeText = freeText) => ({
    answers: nextAnswers,
    questions: QUESTIONS,
    freeText: nextFreeText,
    language,
  });

  const requestRecommendation = async (body) => {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  const prefetchRecommendation = (nextAnswers) => {
    const body = buildRecommendBody(nextAnswers, "");
    const key = JSON.stringify(body);
    if (prefetchRef.current.key === key && prefetchRef.current.promise) return;

    prefetchRef.current = {
      key,
      promise: requestRecommendation(body).catch((err) => {
        console.error("Prefetch error:", err);
        if (prefetchRef.current.key === key) prefetchRef.current = { key: "", promise: null };
        return null;
      }),
    };
  };

  const handleAnswer = (qId, value, type, max) => {
    let nextValues = [];
    if (type === "single") {
      nextValues = [value];
      setAnswers({ ...answers, [qId]: nextValues });
    } else {
      const current = answers[qId] || [];
      if (value === "any") {
        nextValues = ["any"];
        setAnswers({ ...answers, [qId]: nextValues });
        trackEvent("diagnosis_answer", { diagnosis_type: diagnosisType, question_id: qId, answer_value: nextValues.join(",") });
        return;
      }
      const filtered = current.filter((v) => v !== "any");
      if (filtered.includes(value)) nextValues = filtered.filter((v) => v !== value);
      else if (filtered.length < max) nextValues = [...filtered, value];
      else nextValues = filtered;
      setAnswers({ ...answers, [qId]: nextValues });
    }
    trackEvent("diagnosis_answer", { diagnosis_type: diagnosisType, question_id: qId, answer_value: nextValues.join(",") });
  };

  const canProceed = () => {
    const q = QUESTIONS[currentQ];
    return answers[q.id] && answers[q.id].length > 0;
  };

  const goNext = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
    else {
      prefetchRecommendation(answers);
      setScreen("freetext");
    }
  };

  const goBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
    else setScreen("mode");
  };

  const submitQuiz = async () => {
    setScreen("loading");
    setLoadingStep(0);
    setError(null);
    try {
      const body = buildRecommendBody(answers, freeText);
      const key = JSON.stringify(body);
      const prefetched = prefetchRef.current.key === key && prefetchRef.current.promise
        ? await prefetchRef.current.promise
        : null;
      const data = prefetched || await requestRecommendation(body);
      const resultCount = data.recommendations?.length || 0;
      if (resultCount === 0) throw new Error("empty_result");

      setResults(data);
      trackEvent("diagnosis_complete", {
        diagnosis_type: diagnosisType,
        result_count: resultCount,
        has_free_text: freeText.trim().length > 0,
      });
      setScreen("results");
    } catch (err) {
      console.error("Error:", err);
      trackEvent("diagnosis_error", {
        diagnosis_type: diagnosisType,
        error_type: getDiagnosisErrorType(err),
      });
      setError(t.error + (err.message ? ` (${err.message})` : ""));
      setScreen("freetext");
    }
  };

  const reset = () => {
    setAnswers({});
    setFreeText("");
    setCurrentQ(0);
    setResults(null);
    setLoadingStep(0);
    prefetchRef.current = { key: "", promise: null };
    setScreen("landing");
  };

  const shareResults = async () => {
    const topTitles = (results?.recommendations || [])
      .slice(0, 3)
      .map((rec, index) => `${index + 1}. ${language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}`)
      .join("\n");
    const text = `${t.shareText}${topTitles ? `\n\n${topTitles}` : ""}`;
    const url = getShareUrl();

    trackEvent("share_results", {
      mode,
      language,
      recommendation_count: results?.recommendations?.length || 0,
    });

    if (navigator.share) {
      try {
        await navigator.share({ title: t.appTitle, text, url });
        return;
      } catch {
        return;
      }
    }

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen w-full" style={{
      backgroundColor: "#f5f3ee",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(10,10,10,0.05) 1px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif",
      color: "#0a0a0a",
    }}>
      <div className="fixed top-6 right-6 z-50 flex gap-1 items-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <button onClick={() => setLanguage("ja")} className="px-3 py-1 text-xs tracking-wider transition-all"
          style={{ backgroundColor: language === "ja" ? "#0a0a0a" : "transparent", color: language === "ja" ? "#f5f3ee" : "#0a0a0a", border: "1px solid #0a0a0a" }}>JA</button>
        <button onClick={() => setLanguage("en")} className="px-3 py-1 text-xs tracking-wider transition-all"
          style={{ backgroundColor: language === "en" ? "#0a0a0a" : "transparent", color: language === "en" ? "#f5f3ee" : "#0a0a0a", border: "1px solid #0a0a0a" }}>EN</button>
      </div>

      {screen === "landing" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-8 relative">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-10" style={{ background: "radial-gradient(ellipse, #c0392b 0%, transparent 70%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-10" style={{ background: "radial-gradient(ellipse, #0a0a0a 0%, transparent 70%)" }} />
          <div className="max-w-2xl text-center relative z-10">
            <div className="mb-2 text-xs tracking-[0.4em] invisible pointer-events-none" aria-hidden="true" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
              PLACEHOLDER
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-none whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif", fontWeight: 700 }}>
              {t.appTitle}
            </h1>
            <div className="w-24 h-px bg-black mx-auto my-8" />
            <p className="text-xl md:text-2xl mb-6 leading-relaxed italic font-light">{t.appSubtitle}</p>
            <p className="text-sm md:text-base leading-7 max-w-xl mx-auto mb-4" style={{ color: "#555" }}>
              {language === "ja" ? "恋愛、異世界、ホラー、スポーツ、完結済みまで。好みを選ぶだけで、次に読む漫画を絞り込みます。" : "From romance and fantasy to horror, sports, and completed series, narrow down your next read in a few clicks."}
            </p>
            <div className="h-10 md:h-12 mb-10 pointer-events-none" aria-hidden="true" />
            <button onClick={() => setScreen("mode")} className="px-12 py-4 text-sm tracking-[0.3em] uppercase transition-all hover:scale-105"
              style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>
              {t.startQuiz} →
            </button>
            <div className="mt-10">
              <div className="text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>THEME GUIDES</div>
              <a href="/themes" className="text-sm underline underline-offset-4 hover:text-[#c0392b] transition-colors">テーマ別おすすめを見る</a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs" style={{ color: "#555" }}>
              <a href="/completed-manga" className="hover:text-[#c0392b] transition-colors">完結済み</a>
              <a href="/beginner-manga" className="hover:text-[#c0392b] transition-colors">初心者向け</a>
              <a href="/trending-manga" className="hover:text-[#c0392b] transition-colors">トレンド漫画</a>
            </div>
            <nav className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] tracking-[0.18em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#777" }}>
              <a href="/about" className="hover:text-[#c0392b] transition-colors">About</a>
              <a href="/privacy" className="hover:text-[#c0392b] transition-colors">Privacy</a>
              <a href="/contact" className="hover:text-[#c0392b] transition-colors">Contact</a>
              <a href="/disclaimer" className="hover:text-[#c0392b] transition-colors">Disclaimer</a>
            </nav>
          </div>
          <div className="absolute bottom-8 text-xs tracking-widest text-center invisible pointer-events-none" aria-hidden="true" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
            {t.poweredBy}
          </div>
        </div>
      )}

      {screen === "mode" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 relative">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="text-xs tracking-[0.4em] mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>▌SELECT MODE</div>
              <h2 className="text-3xl md:text-4xl font-medium italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.chooseMode}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => startMode("simple")} className="text-left p-8 transition-all hover:scale-[1.02] group"
                style={{ backgroundColor: "transparent", border: "1px solid rgba(10,10,10,0.2)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0a0a0a" }}>06</div>
                  <div className="text-xs tracking-widest px-3 py-1" style={{ fontFamily: "'JetBrains Mono', monospace", border: "1px solid #0a0a0a" }}>{t.simpleTime}</div>
                </div>
                <h3 className="text-2xl font-medium mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{t.simpleTitle}</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{t.simpleDesc}</p>
                <div className="text-xs tracking-[0.2em] transition-all group-hover:translate-x-1" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>SELECT →</div>
              </button>
              <button onClick={() => startMode("detailed")} className="text-left p-8 transition-all hover:scale-[1.02] group"
                style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", border: "1px solid #0a0a0a" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c0392b" }}>15</div>
                  <div className="text-xs tracking-widest px-3 py-1" style={{ fontFamily: "'JetBrains Mono', monospace", border: "1px solid #f5f3ee" }}>{t.detailedTime}</div>
                </div>
                <h3 className="text-2xl font-medium mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{t.detailedTitle}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(245,243,238,0.75)" }}>{t.detailedDesc}</p>
                <div className="text-xs tracking-[0.2em] transition-all group-hover:translate-x-1" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>SELECT →</div>
              </button>
            </div>
            <div className="text-center mt-10">
              <button onClick={() => setScreen("landing")} className="text-sm tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-all" style={{ fontFamily: "'JetBrains Mono', monospace" }}>← {t.back}</button>
            </div>
          </div>
        </div>
      )}

      {screen === "quiz" && (
        <div className="min-h-screen flex flex-col px-4 md:px-8 py-12">
          <div className="max-w-3xl mx-auto w-full mb-12">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>
                {String(currentQ + 1).padStart(2, "0")} {t.progress} {String(QUESTIONS.length).padStart(2, "0")}
              </div>
              <div className="text-xs tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c0392b" }}>
                ▌{mode === "simple" ? t.modeBadgeSimple : t.modeBadgeDetailed}
              </div>
            </div>
            <div className="h-px w-full" style={{ backgroundColor: "rgba(10,10,10,0.15)" }}>
              <div className="h-px transition-all duration-500" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`, backgroundColor: "#c0392b" }} />
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full flex-grow">
            <h2 className="text-3xl md:text-4xl font-medium mb-2 leading-snug" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
              {language === "ja" ? QUESTIONS[currentQ].text_ja : QUESTIONS[currentQ].text_en}
            </h2>
            {QUESTIONS[currentQ].type === "multi" && (
              <p className="text-xs tracking-wider mb-8" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
                {t.selectMax} {QUESTIONS[currentQ].max} {t.selectMaxSuffix}
                {answers[QUESTIONS[currentQ].id] && ` (${answers[QUESTIONS[currentQ].id].length}/${QUESTIONS[currentQ].max})`}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 auto-rows-fr">
              {QUESTIONS[currentQ].options.map((opt) => {
                const isSelected = (answers[QUESTIONS[currentQ].id] || []).includes(opt.v);
                const isAny = opt.v === "any";
                return (
                  <button key={opt.v} onClick={() => handleAnswer(QUESTIONS[currentQ].id, opt.v, QUESTIONS[currentQ].type, QUESTIONS[currentQ].max)}
                    className="text-left p-4 min-h-[76px] h-full transition-all hover:translate-x-1"
                    style={{
                      backgroundColor: isSelected ? "#0a0a0a" : "transparent",
                      color: isSelected ? "#f5f3ee" : "#0a0a0a",
                      border: `1px solid ${isSelected ? "#0a0a0a" : "rgba(10,10,10,0.2)"}`,
                      fontStyle: isAny ? "italic" : "normal", opacity: isAny ? 0.75 : 1,
                    }}>
                    <div className="flex items-center gap-3 h-full">
                      <div className="text-xs w-4" style={{ fontFamily: "'JetBrains Mono', monospace", color: isSelected ? "#c0392b" : "#888" }}>{isSelected ? "▌" : "○"}</div>
                      <div className="text-sm md:text-base leading-snug">{language === "ja" ? opt.ja : opt.en}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="max-w-3xl mx-auto w-full flex justify-between items-center mt-12">
            <button onClick={goBack} className="text-sm tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-all" style={{ fontFamily: "'JetBrains Mono', monospace" }}>← {t.back}</button>
            <button onClick={goNext} disabled={!canProceed()}
              className="px-8 py-3 text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>
              {t.next} →
            </button>
          </div>
        </div>
      )}

      {screen === "freetext" && (
        <div className="min-h-screen flex flex-col px-4 md:px-8 py-12">
          <div className="max-w-3xl mx-auto w-full mb-12">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>{t.freeTextStep}</div>
              <div className="text-xs tracking-[0.3em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c0392b" }}>▌{mode === "simple" ? t.modeBadgeSimple : t.modeBadgeDetailed}</div>
            </div>
            <div className="h-px w-full" style={{ backgroundColor: "rgba(10,10,10,0.15)" }}>
              <div className="h-px transition-all duration-500" style={{ width: "100%", backgroundColor: "#c0392b" }} />
            </div>
          </div>
          <div className="max-w-3xl mx-auto w-full flex-grow">
            <h2 className="text-3xl md:text-4xl font-medium mb-3 leading-snug" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{t.freeTextTitle}</h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "#888" }}>{t.freeTextDesc}</p>
            <input type="text" value={freeText} onChange={(e) => setFreeText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitQuiz(); }}
              placeholder={t.freeTextPlaceholder} maxLength={200}
              className="w-full p-4 text-base md:text-lg outline-none transition-all focus:translate-x-1"
              style={{ backgroundColor: "transparent", border: "1px solid rgba(10,10,10,0.3)", color: "#0a0a0a", fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif" }} />
            <div className="text-right text-xs mt-2" style={{ color: "#aaa", fontFamily: "'JetBrains Mono', monospace" }}>{freeText.length}/200</div>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.freeTextExamples.map((ex, i) => (
                <button key={i} onClick={() => setFreeText(ex)} className="text-xs px-3 py-1.5 transition-all hover:scale-105"
                  style={{ border: "1px solid rgba(10,10,10,0.2)", color: "#666", fontFamily: "'Noto Serif JP', sans-serif" }}>{ex}</button>
              ))}
            </div>
          </div>
          <div className="max-w-3xl mx-auto w-full flex justify-between items-center mt-12">
            <button onClick={() => { setScreen("quiz"); setCurrentQ(QUESTIONS.length - 1); }} className="text-sm tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-all" style={{ fontFamily: "'JetBrains Mono', monospace" }}>← {t.back}</button>
            <div className="flex items-center gap-4">
              <button onClick={submitQuiz} className="text-sm tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-all" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t.skip}</button>
              <button onClick={submitQuiz} className="px-8 py-3 text-sm tracking-[0.2em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>{t.submit} →</button>
            </div>
          </div>
          {error && (<div className="max-w-3xl mx-auto w-full mt-6 p-4 text-center text-sm" style={{ backgroundColor: "#c0392b", color: "#f5f3ee" }}>{error}</div>)}
        </div>
      )}

      {screen === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-8">
          <div className="text-center max-w-md">
            <div className="mb-8 flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-2 border-black opacity-10" />
                <div className="absolute inset-0 border-t-2 border-r-2 border-black animate-spin" />
                <div className="absolute inset-2 border-b-2 border-l-2 animate-spin" style={{ borderColor: "#c0392b", animationDuration: "2s", animationDirection: "reverse" }} />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.loading}</h2>
            <div className="flex justify-center gap-2">
              {Array.from({ length: LOADING_STEP_COUNT }).map((_, idx) => (<div key={idx} className="h-1 w-8 transition-all" style={{ backgroundColor: idx <= loadingStep ? "#c0392b" : "rgba(10,10,10,0.15)" }} />))}
            </div>
          </div>
        </div>
      )}

      {screen === "results" && results && (
        <div className="min-h-screen px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <div className="text-xs tracking-[0.4em] mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>▌YOUR PROFILE</div>
              <h2 className="text-3xl md:text-5xl font-medium mb-6 italic leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.yourProfile}</h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic" style={{ color: "#0a0a0a", borderLeft: "2px solid #c0392b", paddingLeft: "1.5rem", textAlign: "left" }}>{results.userProfile}</p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-xs leading-6" style={{ color: "#666" }}>{t.shareLead}</p>
                <button onClick={shareResults} className="px-6 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "transparent", color: "#0a0a0a", border: "1px solid rgba(10,10,10,0.25)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {t.shareResult}
                </button>
              </div>
            </div>

            {/* 広告枠 1: プロフィール直後（最も目立つ位置） */}
            <AdSlot slot="results-top" />

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="mb-20">
                <div className="flex items-baseline gap-4 mb-10">
                  <div className="text-xs tracking-[0.3em]" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>01 — 03</div>
                  <h3 className="text-2xl md:text-3xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.top3}</h3>
                  <div className="flex-grow h-px bg-black opacity-20" />
                </div>
                <div className="space-y-12">
                  {results.recommendations.slice(0, 3).map((rec, idx) => (
                    <article key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="grid grid-cols-12 gap-6 md:gap-8 pb-12 border-b" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
                      <div className="col-span-12 md:col-span-2">
                        <div className="text-6xl md:text-7xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: idx === 0 ? "#c0392b" : "#0a0a0a" }}>{String(rec.rank).padStart(2, "0")}</div>
                      </div>
                      <div className="col-span-12 md:col-span-10 flex flex-col sm:flex-row gap-5 md:gap-7">
                        <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} size="large" />
                        <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-2xl md:text-3xl font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</h4>
                          {rec.source && (<span className="text-[10px] tracking-widest px-2 py-1" style={{ fontFamily: "'JetBrains Mono', monospace", backgroundColor: rec.source === "db" ? "#0a0a0a" : "#c0392b", color: "#f5f3ee" }}>{rec.source === "db" ? t.sourceDB : t.sourceWeb}</span>)}
                        </div>
                        <div className="text-sm mb-4 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>
                          {rec.author && <>{rec.author} · </>}{rec.year && <>{rec.year} · </>}{rec.volumes && <>{rec.volumes}{t.volumes} · </>}{rec.status && t["status_" + rec.status]}{rec.anime && <> · {t.anime} ✓</>}
                        </div>
                        {rec.description && (<p className="text-base leading-relaxed mb-4" style={{ color: "#333" }}>{rec.description}</p>)}
                        <div className="pl-4 border-l-2" style={{ borderColor: "#c0392b" }}>
                          <div className="text-xs tracking-[0.2em] mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>▌WHY YOU'LL LOVE IT</div>
                          <p className="text-sm md:text-base italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{rec.reason}</p>
                        </div>
                        <ReadingActionHint />
                        <PurchaseLinks rec={rec} t={t} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 3 && (
              <div className="mb-20">
                <div className="flex items-baseline gap-4 mb-10">
                  <div className="text-xs tracking-[0.3em]" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>04 — {String(Math.min(10, results.recommendations.length)).padStart(2, "0")}</div>
                  <h3 className="text-xl md:text-2xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.next7}</h3>
                  <div className="flex-grow h-px bg-black opacity-10" />
                </div>
                <div className="space-y-6">
                  {results.recommendations.slice(3, 10).map((rec) => (
                    <article key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="grid grid-cols-12 gap-4 pb-6 border-b" style={{ borderColor: "rgba(10,10,10,0.08)" }}>
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-2xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#888" }}>{String(rec.rank).padStart(2, "0")}</div>
                      </div>
                      <div className="col-span-10 md:col-span-11 flex flex-col sm:flex-row gap-4">
                        <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} />
                        <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-lg md:text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</h4>
                          {rec.source && (<span className="text-[9px] tracking-widest px-1.5 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", backgroundColor: rec.source === "db" ? "rgba(10,10,10,0.7)" : "rgba(192,57,43,0.85)", color: "#f5f3ee" }}>{rec.source === "db" ? t.sourceDB : t.sourceWeb}</span>)}
                        </div>
                        <div className="text-xs mb-2 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }}>
                          {rec.author && <>{rec.author} · </>}{rec.volumes && <>{rec.volumes}{t.volumes} · </>}{rec.status && t["status_" + rec.status]}
                        </div>
                        <p className="text-sm leading-relaxed italic" style={{ color: "#444", fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{rec.reason}</p>
                        <ReadingActionHint compact />
                        <PurchaseLinks rec={rec} t={t} compact />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 広告枠 2: 中間（おすすめリストの途中） */}
            {results.recommendations && results.recommendations.length > 3 && (
              <AdSlot slot="results-mid" />
            )}

            {results.recommendations && results.recommendations.length > 10 && (
              <div className="mb-20">
                <div className="flex items-baseline gap-4 mb-8">
                  <div className="text-xs tracking-[0.3em]" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>11 — {String(results.recommendations.length).padStart(2, "0")}</div>
                  <h3 className="text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.last10}</h3>
                  <div className="flex-grow h-px bg-black opacity-10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {results.recommendations.slice(10, 20).map((rec) => (
                    <div key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="flex gap-3 items-start py-2">
                      <span className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c0392b", minWidth: "1.5rem" }}>{String(rec.rank).padStart(2, "0")}</span>
                      <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} size="small" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-base font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</div>
                          {rec.source === "web" && (<span className="text-[8px] tracking-widest px-1 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", backgroundColor: "rgba(192,57,43,0.85)", color: "#f5f3ee" }}>{t.sourceWeb}</span>)}
                        </div>
                        <div className="text-xs" style={{ color: "#888" }}>{rec.author}{rec.volumes && ` · ${rec.volumes}${t.volumes}`}</div>
                        <ReadingActionHint compact />
                        <PurchaseLinks rec={rec} t={t} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 広告枠 3: 最下部（再診断ボタンの前） */}
            <AdSlot slot="results-bottom" />

            <RelatedThemeLinks recommendations={results.recommendations} language={language} />

            <div className="text-center mt-16">
              <button onClick={reset} className="px-12 py-4 text-sm tracking-[0.3em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>↻ {t.retake}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
