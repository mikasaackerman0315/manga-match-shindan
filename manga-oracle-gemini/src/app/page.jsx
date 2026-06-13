"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { QUESTIONS_SIMPLE, QUESTIONS_DETAILED } from "@/data/questions";
import HomePageV2, { MangaMatchHeader } from "./HomePageV2";
import MangaCover from "./MangaCover";
import StoreLinks from "./StoreLinks";
import WatchLaterButton from "@/components/WatchLaterButton";
import { getDiagnosisType, trackEvent } from "./analytics";

const USE_NEW_HOME = true;
const modeSans = "'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const modeSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

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
    intro: "AIが厳選1800作品DBを分析し、あなたの好みに合った漫画を最大20作品ランキング形式で推薦します。",
    next: "次へ", back: "戻る", submit: "AIに判定させる", progress: "問",
    loading: "AIが分析中…",
    loadingComplete: "診断が完了しました",
    viewResults: "結果を見る",
    nextDiscovery: "次の漫画",
    yourProfile: "あなたの読書プロファイル",
    top3: "絶対読んでほしい", next7: "これも合うはず", last10: "気が向いたら",
    retake: "もう一度診断する", error: "エラーが発生しました。もう一度お試しください。",
    selectMax: "最大", selectMaxSuffix: "つまで選択可能",
    volumes: "巻", anime: "アニメ化",
    status_completed: "完結", status_ongoing: "連載中", status_hiatus: "休載中",
    poweredBy: "POWERED BY GEMINI 2.5 FLASH · 1800作品DB",
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
    intro: "AI analyzes a curated 1800-title database to find up to 20 manga matched to your tastes.",
    next: "Next", back: "Back", submit: "Let AI Decide", progress: "of",
    loading: "AI is analyzing…",
    loadingComplete: "Analysis complete",
    viewResults: "View Results",
    nextDiscovery: "Next Manga",
    yourProfile: "Your Reading Profile",
    top3: "Must Reads", next7: "Highly Recommended", last10: "Worth Exploring",
    retake: "Take Quiz Again", error: "Something went wrong. Please try again.",
    selectMax: "Select up to", selectMaxSuffix: "",
    volumes: " vol", anime: "Anime",
    status_completed: "Completed", status_ongoing: "Ongoing", status_hiatus: "On hiatus",
    poweredBy: "POWERED BY GEMINI 2.5 FLASH · 1800-TITLE DB",
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
const LOADING_SIDE_DISCOVERIES = [
  { title_ja: "ひらやすみ", title_en: "Hirayasumi", lead_ja: "何も起きない日の良さを、じんわり思い出す。", lead_en: "A gentle reminder of ordinary days done well.", avoid: ["battle", "horror", "virtual"] },
  { title_ja: "海が走るエンドロール", title_en: "The End Credits Are Rolling", lead_ja: "遅く始まる夢の眩しさがある。", lead_en: "A late-blooming dream with a quiet shine.", avoid: ["battle", "virtual"] },
  { title_ja: "税金で買った本", title_en: "Books Bought With Taxes", lead_ja: "図書館の裏側が少し好きになる仕事もの。", lead_en: "A workplace manga that makes libraries feel alive.", avoid: ["battle", "horror", "romance"] },
  { title_ja: "北北西に曇と往け", title_en: "Go with the Clouds, North-by-Northwest", lead_ja: "旅と空気感で読ませる、静かな異国の物語。", lead_en: "A quiet travel mystery with a strong sense of place.", avoid: ["school", "sports"] },
  { title_ja: "煙と蜜", title_en: "Smoke and Honey", lead_ja: "時代の空気と距離感をゆっくり味わう。", lead_en: "A slow, elegant period piece with delicate distance.", avoid: ["battle", "virtual"] },
  { title_ja: "波よ聞いてくれ", title_en: "Wave, Listen to Me!", lead_ja: "会話の勢いと仕事の変さで引っ張る。", lead_en: "Fast talk, strange work, and messy adult energy.", avoid: ["fantasy", "virtual"] },
  { title_ja: "映像研には手を出すな！", title_en: "Keep Your Hands Off Eizouken!", lead_ja: "創作のワクワクだけを濃く吸える。", lead_en: "Pure creative excitement in manga form.", avoid: ["horror", "romance"] },
  { title_ja: "違国日記", title_en: "Diary of Different Countries", lead_ja: "言葉にならない距離を丁寧に描く。", lead_en: "A careful look at distance, grief, and living together.", avoid: ["battle", "virtual"] },
  { title_ja: "ダーウィン事変", title_en: "The Darwin Incident", lead_ja: "社会派とサスペンスの間を鋭く走る。", lead_en: "A sharp line between social drama and suspense.", avoid: ["healing", "romance"] },
  { title_ja: "望郷太郎", title_en: "Bokyo Taro", lead_ja: "文明のあとを歩く、骨太な再出発の物語。", lead_en: "A rugged story of rebuilding after civilization.", avoid: ["romance", "school"] },
  { title_ja: "図書館の大魔術師", title_en: "Magus of the Library", lead_ja: "本と世界の広がりをじっくり味わえる。", lead_en: "A rich fantasy about books, knowledge, and the wider world.", avoid: ["horror", "sports"] },
  { title_ja: "ふつうの軽音部", title_en: "Girl Meets Rock!", lead_ja: "青春の小さな熱が、変にリアルでいい。", lead_en: "Small, awkward sparks of youth and music.", avoid: ["battle", "horror", "fantasy"] },
  { title_ja: "しなのんちのいくる", title_en: "Shina's Ikuru", lead_ja: "短い日常の中に、妙な懐かしさがある。", lead_en: "Short everyday moments with odd nostalgia.", avoid: ["battle", "dark", "horror"] },
  { title_ja: "クジャクのダンス、誰が見た？", title_en: "Who Saw the Peacock Dance in the Jungle?", lead_ja: "静かな疑念がじわじわ広がるミステリー。", lead_en: "A mystery where quiet doubt keeps widening.", avoid: ["healing", "sports"] },
  { title_ja: "リバーエンド・カフェ", title_en: "River End Cafe", lead_ja: "土地と人の傷を、ゆっくり見つめる。", lead_en: "A slow look at place, wounds, and recovery.", avoid: ["battle", "virtual"] },
  { title_ja: "あかね噺", title_en: "Akane-banashi", lead_ja: "芸の世界の勝負を、熱すぎず熱く読ませる。", lead_en: "A performance manga with clean, controlled heat.", avoid: ["horror", "romance"] },
];

const LOADING_SIDE_DISCOVERY_DETAILS = {
  "ひらやすみ": {
    ja: "定職につかず気ままに暮らす青年と、上京してきた親戚の女の子を中心に、東京の片隅の日々を描く作品。派手な事件ではなく、生活の小さな変化や人との距離感がじわっと残ります。",
    en: "A quiet slice-of-life manga about a laid-back young man and a younger relative starting a new life in Tokyo. It is less about big events and more about small shifts, gentle days, and the distance between people.",
  },
  "海が走るエンドロール": {
    ja: "夫を亡くした女性が映画作りに出会い、年齢に関係なく新しい表現へ踏み出していく物語。夢を追う話なのに騒がしすぎず、静かな前向きさがあります。",
    en: "A story about an older woman who discovers filmmaking after loss and steps into a new creative life. It treats dreams with quiet dignity rather than loud inspiration.",
  },
  "税金で買った本": {
    ja: "図書館で働く人たちと利用者のやりとりを通して、本の扱い方や公共の場所の裏側を見せる仕事漫画。ゆるく読めるのに、知らなかった知識も残ります。",
    en: "A workplace manga about librarians, visitors, and the everyday systems behind public libraries. It is easy to read, but it leaves you with surprisingly useful knowledge.",
  },
  "北北西に曇と往け": {
    ja: "アイスランドを舞台に、探偵めいた青年が人や土地の謎に触れていく物語。旅漫画の空気感とミステリーの静けさが混ざっていて、余白を味わうタイプです。",
    en: "Set in Iceland, this follows a young man with a detective-like presence as he moves through people, landscapes, and quiet mysteries. It blends travel atmosphere with understated suspense.",
  },
  "煙と蜜": {
    ja: "大正時代を思わせる空気の中、年の離れた許嫁同士の関係を丁寧に描く作品。派手な恋愛というより、距離感、所作、時代の匂いをゆっくり読む漫画です。",
    en: "A period romance built on careful distance, manners, and atmosphere. Rather than loud romantic drama, it asks you to enjoy gestures, restraint, and the texture of its era.",
  },
  "波よ聞いてくれ": {
    ja: "勢いで喋る女性がラジオの世界に巻き込まれていく、会話劇の強い仕事漫画。テンポの良い台詞と大人のぐちゃっとした生活感が魅力です。",
    en: "A talk-driven workplace comedy about a woman pulled into radio after one explosive rant. Its charm comes from fast dialogue, messy adulthood, and strange professional momentum.",
  },
  "映像研には手を出すな！": {
    ja: "女子高生たちがアニメ制作にのめり込む創作漫画。設定を考える楽しさ、ものを作る熱、仲間内の役割分担が濃く、創作好きなら刺さりやすい作品です。",
    en: "A manga about high school girls diving into animation production. It captures the joy of building worlds, making things, and turning imagination into a shared project.",
  },
  "違国日記": {
    ja: "人付き合いが不器用な小説家と、親を亡くした少女が一緒に暮らし始める物語。家族ものですが甘くしすぎず、言葉にできない感情を丁寧に置いていきます。",
    en: "A restrained human drama about an awkward novelist and an orphaned girl beginning to live together. It is a family story, but it avoids easy sweetness and respects difficult emotions.",
  },
  "ダーウィン事変": {
    ja: "人間とチンパンジーの間に生まれた存在を通して、社会、差別、暴力、思想を描くサスペンス。読みやすいエンタメ性がありつつ、テーマはかなり鋭いです。",
    en: "A social suspense manga centered on a being born between human and chimpanzee. It has thriller momentum, but its questions about society, violence, and ideology are sharp.",
  },
  "望郷太郎": {
    ja: "文明崩壊後の世界で目覚めた男が、失われた故郷や社会の痕跡を追って歩く物語。サバイバルよりも、文明とは何かを考える骨太さがあります。",
    en: "A post-civilization journey about a man waking in a changed world and searching for traces of home and society. It is rugged, but more reflective than simple survival fiction.",
  },
  "図書館の大魔術師": {
    ja: "本と知識が大きな意味を持つ世界で、少年が図書館を目指すファンタジー。作り込まれた世界観と、本をめぐる憧れがゆっくり広がっていきます。",
    en: "A fantasy about a boy drawn toward a grand library in a world where books and knowledge hold deep power. It is rich in worldbuilding and the romance of reading.",
  },
  "ふつうの軽音部": {
    ja: "軽音部に入った高校生たちの、地味だけど妙にリアルな青春漫画。大げさな才能物語ではなく、好きな音楽や人間関係で少しずつ熱が出てくる感じです。",
    en: "A grounded school music manga about students in a light music club. It avoids grand genius drama and instead finds heat in ordinary taste, awkwardness, and relationships.",
  },
  "しなのんちのいくる": {
    ja: "短いエピソードで家族や日常を描く、少し懐かしい空気の漫画。大きな展開を追うより、ふとした会話や間の抜けた瞬間を楽しむタイプです。",
    en: "A series of short everyday episodes with a nostalgic family-life mood. It is best enjoyed for tiny conversations, odd pauses, and casual warmth rather than plot.",
  },
  "クジャクのダンス、誰が見た？": {
    ja: "事件の真相を追う中で、信じていたものが揺らいでいくミステリー。派手なトリックより、疑念が少しずつ広がる不安感で読ませます。",
    en: "A mystery where the search for truth slowly shakes what the characters believe. Its hook is not flashy tricks, but the creeping spread of doubt.",
  },
  "リバーエンド・カフェ": {
    ja: "地方のカフェを中心に、人の傷や再生をゆっくり描く作品。強い刺激ではなく、土地に残る記憶や人の回復を静かに読む漫画です。",
    en: "A quiet drama centered on a local cafe, wounds, and recovery. It focuses less on strong stimulation and more on memory, place, and slow healing.",
  },
  "あかね噺": {
    ja: "落語の世界で成長していく少女を描く芸道漫画。バトル漫画のような勝負感がありつつ、言葉、間、演技で魅せるところが特徴です。",
    en: "A performance manga about a girl growing through rakugo. It has the competitive pull of a battle manga, but its weapons are timing, words, and stage presence.",
  },
};

function createLoadingSeed() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const mixed = (values[0] ^ Date.now() ^ Math.floor(Math.random() * 2147483647)) >>> 0;
    return mixed || Date.now();
  }
  return Date.now() + Math.floor(Math.random() * 2147483647);
}

function getRandomLoadingIndex(length) {
  return length > 0 ? Math.floor(Math.random() * length) : 0;
}

function seededShuffle(items, seed) {
  const shuffled = [...items];
  let state = Math.max(1, Math.floor(seed) % 2147483647);

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    state = (state * 48271) % 2147483647;
    const j = state % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function getLoadingRecommendations(answers = {}, language = "ja", seed = 1) {
  const values = Object.values(answers).flat();
  const sideShelf = LOADING_SIDE_DISCOVERIES.filter((rec) => !(rec.avoid || []).some((value) => values.includes(value)));
  const recommendations = seededShuffle(sideShelf.length >= 8 ? sideShelf : LOADING_SIDE_DISCOVERIES, seed);

  return recommendations.map((rec) => ({
    title: language === "ja" ? rec.title_ja : rec.title_en,
    lead: language === "ja" ? rec.lead_ja : rec.lead_en,
    detail: language === "ja" ? LOADING_SIDE_DISCOVERY_DETAILS[rec.title_ja]?.ja : LOADING_SIDE_DISCOVERY_DETAILS[rec.title_ja]?.en,
  }));
}

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

function formatVolumeLabel(volumes, suffix) {
  const volumeNumber = Number(volumes);
  return Number.isInteger(volumeNumber) && volumeNumber > 0 && volumeNumber <= 250 ? `${volumeNumber}${suffix}` : "";
}

function MangaMetaLine({ rec, t, includeYear = false, includeStatus = true, includeAnime = false, className = "", style = {} }) {
  const parts = [
    rec.author,
    includeYear && rec.year,
    formatVolumeLabel(rec.volumes, t.volumes),
    includeStatus && rec.status && t["status_" + rec.status],
    includeAnime && rec.anime && `${t.anime} ✓`,
  ].filter(Boolean);

  if (parts.length === 0) return null;
  return <div className={className} style={style}>{parts.join(" · ")}</div>;
}

function AlternativeBadge({ rec, language }) {
  if (rec.matchLevel !== "alternative") return null;
  return (
    <span
      className="text-[10px] tracking-[0.18em] uppercase px-2 py-1 border"
      style={{ borderColor: "rgba(192,57,43,0.35)", color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {language === "ja" ? "こちらもおすすめ" : "Alternative"}
    </span>
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

function ModeLogoMark({ className = "h-11 w-11" }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4 41 14v20L24 44 7 34V14L24 4Z" stroke="#0a0a0a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M14 18.5c4.1 0 7 .9 10 3.3 3-2.4 5.9-3.3 10-3.3v12.7c-4.1 0-7 .9-10 3.3-3-2.4-5.9-3.3-10-3.3V18.5Z" fill="#0a0a0a" />
      <path d="M24 21.8v12.7" stroke="#f5f3ee" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ModeIcon({ type, className = "h-7 w-7", style = {} }) {
  const common = {
    className,
    style,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (type === "search") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>;
  if (type === "user") return <svg {...common}><circle cx="12" cy="7.5" r="3.5" /><path d="M4.5 21c1.3-4 4-6 7.5-6s6.2 2 7.5 6" /></svg>;
  if (type === "clipboard") return <svg {...common}><rect x="6" y="5" width="12" height="16" rx="2" /><path d="M9 5V3.8h6V5" /><path d="M9.5 11h5" /><path d="M9.5 15h5" /></svg>;
  if (type === "magnifier") return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /><path d="M8 10.5h5" /><path d="M10.5 8v5" /></svg>;
  if (type === "clock") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3.2 2" /></svg>;
  if (type === "chat") return <svg {...common}><path d="M5 6.5h14v9H9l-4 3v-12Z" /><path d="M8.5 10h7" /><path d="M8.5 13h4" /></svg>;
  if (type === "sparkles") return <svg {...common}><path d="M12 3 13.5 8.5 19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></svg>;
  if (type === "target") return <svg {...common}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3" /><path d="M22 12h-3" /></svg>;
  if (type === "heart") return <svg {...common}><path d="M12 20.2s-7.2-4.4-9.2-8.7C1.4 8.4 3.3 5 6.5 5c1.9 0 3.2 1 3.9 2.2C11.1 6 12.4 5 14.3 5c3.2 0 5.1 3.4 3.7 6.5-2 4.3-9 8.7-9 8.7Z" /></svg>;
  if (type === "chart") return <svg {...common}><path d="M5 19V9" /><path d="M12 19V5" /><path d="M19 19v-7" /><path d="M3 19h18" /></svg>;
  if (type === "bookmark") return <svg {...common}><path d="M7 4h10v17l-5-3.2L7 21V4Z" /></svg>;
  if (type === "lightbulb") return <svg {...common}><path d="M8 14.5a6 6 0 1 1 8 0c-.9.8-1.4 1.6-1.6 2.5H9.6c-.2-.9-.7-1.7-1.6-2.5Z" /><path d="M10 21h4" /><path d="M9.5 18.5h5" /></svg>;
  return null;
}

function DiagnosisModeScreen({ language, setLanguage, t, onStartMode, onBack }) {
  const isJa = language === "ja";
  const copy = isJa ? {
    nav: ["ホーム", "診断する", "漫画を探す", "テーマから探す", "ランキング", "保存リスト", "好みプロフィール"],
    subtitle: "あなたの好みに合わせて、最適な診断を選びましょう。",
    simpleMeta: "6問 / 約1分",
    detailedMeta: "15問 / 約4分",
    simpleDesc: "気軽におすすめを知りたい人向け。サクッとあなたに合う漫画を見つけます。",
    detailedDesc: "キャラ・世界観・読後感まで細かく分析。より精度の高いおすすめが知りたい人向け。",
    start: "この診断を始める",
    time: "所要時間",
    questions: "質問数",
    picks: "おすすめ数",
    simplePicks: "5〜10作品",
    detailedPicks: "10〜20作品",
    historyTitle: "過去の診断結果を引き継ぎますか？",
    historyText: "前回の診断をもとに、さらにあなたに合う漫画を提案します。",
    historyButton: "履歴を引き継ぐ",
    canDo: "診断することでできること",
    tipTitle: "迷ったら「こだわり診断」がおすすめ！",
    tipText: "より深く分析することで、あなたに本当に合う漫画が見つかりやすくなります。",
    features: [
      ["target", "あなたの好みを分析", "世界観・キャラ・展開・読後感など、多角的にあなたの好みを分析します。"],
      ["heart", "相性の高い漫画を提案", "データベースとAI検索を組み合わせ、あなたに合う漫画を厳選して提案します。"],
      ["chart", "相性スコアでわかりやすい", "なぜ合うのかをスコアや文章で表示。納得しながら選べます。"],
      ["bookmark", "保存して後で見返せる", "気になる作品は保存可能。いつでも見返すことができます。"],
    ],
  } : {
    nav: ["Home", "Quiz", "Manga", "Themes", "Ranking", "Saved", "Profile"],
    subtitle: "Choose the diagnosis style that fits how deeply you want to search.",
    simpleMeta: "6 questions / ~1 min",
    detailedMeta: "15 questions / ~4 min",
    simpleDesc: "For a quick recommendation. Find manga that fits you in a short flow.",
    detailedDesc: "For deeper matching across characters, worlds, tone, and aftertaste.",
    start: "Start this quiz",
    time: "Time",
    questions: "Questions",
    picks: "Results",
    simplePicks: "5-10 titles",
    detailedPicks: "10-20 titles",
    historyTitle: "Continue from your previous taste?",
    historyText: "Use a more detailed quiz to refine recommendations from your previous direction.",
    historyButton: "Continue",
    canDo: "What the diagnosis can do",
    tipTitle: "Not sure? Choose Deep Dive.",
    tipText: "A deeper diagnosis makes it easier to find manga that genuinely fits your taste.",
    features: [
      ["target", "Analyze Your Taste", "Looks at worlds, characters, plot style, and reading mood from multiple angles."],
      ["heart", "Recommend Better Matches", "Combines the manga database and AI search to suggest stronger matches."],
      ["chart", "Clear Match Scores", "Shows why a title may fit you with scores and short reasoning."],
      ["bookmark", "Save for Later", "Save interesting manga and revisit them whenever you want."],
    ],
  };
  return (
    <div
      className="min-h-screen overflow-x-hidden antialiased"
      style={{
        backgroundColor: "#f6f2ea",
        backgroundImage: "linear-gradient(180deg, #fffdf9 0%, #f6f2ea 34%, #f5f3ee 100%)",
        color: "#0a0a0a",
        fontFamily: modeSans,
      }}
    >
      <MangaMatchHeader language={language} setLanguage={setLanguage} onStartQuiz={() => {}} active="diagnosis" />

      <main className="relative mx-auto max-w-[1920px] px-6 pb-8 pt-4 md:px-7 xl:px-8 2xl:px-10">
        <div className="pointer-events-none absolute left-0 top-28 h-72 w-72 opacity-80" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.16) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-[520px] rotate-[-8deg] opacity-[0.055]" style={{ backgroundImage: "linear-gradient(90deg, #0a0a0a 1px, transparent 1px), linear-gradient(#0a0a0a 1px, transparent 1px)", backgroundSize: "92px 132px" }} />

        <div className="relative z-10 text-sm">
          <button onClick={onBack} className="hover:text-[#c0392b]">{copy.nav[0]}</button>
          <span className="mx-3 text-[#c0392b]">›</span>
          <span>{copy.nav[1]}</span>
        </div>

        <section className="relative z-10 mx-auto mt-4 max-w-[1120px] text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-7 text-[#c0392b]">
            <span className="h-px w-16 bg-[#c0392b]" />
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#c0392b]/30 bg-white"><ModeLogoMark className="h-6 w-6" /></span>
            <span className="h-px w-16 bg-[#c0392b]" />
          </div>
          <h1 className="text-3xl font-bold tracking-[0.08em] md:text-5xl" style={{ fontFamily: modeSerif, fontWeight: 700 }}>{t.chooseMode}</h1>
          <p className="mt-4 text-sm text-black/65 md:text-base">{copy.subtitle}</p>
        </section>

        <section className="relative z-10 mx-auto mt-8 grid max-w-[980px] gap-7 md:grid-cols-2">
          <DiagnosisModeCard variant="simple" icon="clipboard" title={t.simpleTitle} meta={copy.simpleMeta} desc={copy.simpleDesc} stats={[["clock", copy.time, isJa ? "約1分" : "~1 min"], ["chat", copy.questions, "6問"], ["sparkles", copy.picks, copy.simplePicks]]} button={copy.start} onClick={() => onStartMode("simple")} />
          <DiagnosisModeCard variant="detailed" icon="magnifier" title={t.detailedTitle} meta={copy.detailedMeta} desc={copy.detailedDesc} stats={[["clock", copy.time, isJa ? "約4分" : "~4 min"], ["chat", copy.questions, "15問"], ["sparkles", copy.picks, copy.detailedPicks]]} button={copy.start} onClick={() => onStartMode("detailed")} />
        </section>

        <section className="relative z-10 mx-auto mt-8 max-w-[1120px]">
          <h2 className="text-center text-2xl font-bold tracking-[0.12em]">{copy.canDo}</h2>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#c0392b]" />
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {copy.features.map(([icon, title, text]) => (
              <div key={title} className="flex gap-4 border-r border-black/10 last:border-r-0 md:pr-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#c0392b]"><ModeIcon type={icon} className="h-8 w-8" /></span>
                <span className="text-left">
                  <span className="block font-bold">{title}</span>
                  <span className="mt-2 block text-xs leading-6 text-black/62">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-10 mx-auto mt-8 flex max-w-[1120px] items-center gap-6 rounded-lg border border-[#c0392b]/12 bg-[#fff7f3] px-6 py-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#f4c7bd] text-white"><ModeIcon type="lightbulb" className="h-9 w-9" /></span>
          <span>
            <span className="block font-bold text-[#c0392b]">{copy.tipTitle}</span>
            <span className="mt-1 block text-sm text-black/65">{copy.tipText}</span>
          </span>
        </section>
      </main>
    </div>
  );
}

function DiagnosisModeCard({ variant, icon, title, meta, desc, stats, button, onClick }) {
  const dark = variant === "detailed";
  const accent = dark ? "#d7a447" : "#c0392b";
  return (
    <button onClick={onClick} className={`rounded-xl p-6 text-left shadow-[0_20px_60px_rgba(10,10,10,0.08)] transition-colors md:p-7 ${dark ? "bg-[#0a0a0a] text-[#f5f3ee]" : "bg-white/86 text-[#0a0a0a]"}`} style={{ border: `1px solid ${dark ? "rgba(215,164,71,0.36)" : "rgba(10,10,10,0.16)"}` }}>
      <div className="mb-6 flex items-start gap-7">
        <ModeIcon type={icon} className="h-14 w-14 shrink-0" style={{ color: accent }} />
        <div>
          <h3 className="text-2xl font-bold md:text-3xl">{title}</h3>
          <div className="mt-3 text-lg font-bold" style={{ color: accent }}>{meta}</div>
        </div>
      </div>
      <p className={`min-h-[48px] text-center text-sm leading-6 ${dark ? "text-white/80" : "text-black/68"}`}>{desc}</p>
      <div className={`my-6 border-t border-dotted ${dark ? "border-[#d7a447]/45" : "border-black/18"}`} />
      <div className="grid grid-cols-3 gap-3">
        {stats.map(([statIcon, label, value]) => (
          <div key={label} className={`flex items-center justify-center gap-2 border-r text-sm last:border-r-0 ${dark ? "border-white/10" : "border-black/10"}`}>
            <ModeIcon type={statIcon} className="h-6 w-6" style={{ color: accent }} />
            <span><span className="block text-xs opacity-70">{label}</span><span className="block font-bold">{value}</span></span>
          </div>
        ))}
      </div>
      <div className={`mt-6 flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-bold transition-all ${dark ? "border border-[#d7a447] text-[#d7a447] hover:bg-[#d7a447] hover:text-[#0a0a0a] hover:shadow-[0_0_0_4px_rgba(215,164,71,0.14),0_18px_42px_rgba(215,164,71,0.18)]" : "bg-[#c0392b] text-white hover:bg-[#d63e32] hover:shadow-[0_0_0_4px_rgba(192,57,43,0.14),0_18px_42px_rgba(192,57,43,0.26)]"}`}>
        {button} <span className="ml-5">→</span>
      </div>
    </button>
  );
}

const QUIZ_OPTION_VISUALS = {
  battle: { icon: "⚔", color: "#c0392b", hint_ja: "熱い戦いや勝負を重視します。", hint_en: "Prioritize action and conflict." },
  mystery: { icon: "◆", color: "#8e44ad", hint_ja: "謎解きや先が読めない展開を重視します。", hint_en: "Prioritize mystery and suspense." },
  romance: { icon: "♥", color: "#d94d65", hint_ja: "恋愛や関係性の揺れを重視します。", hint_en: "Prioritize romance and relationships." },
  self_discovery: { icon: "✎", color: "#3aa7a3", hint_ja: "成長や心の変化を重視します。", hint_en: "Prioritize growth and self-discovery." },
  sports: { icon: "○", color: "#2f80ed", hint_ja: "競技や努力の熱さを重視します。", hint_en: "Prioritize competition and effort." },
  survival: { icon: "△", color: "#d35400", hint_ja: "危機感と生き残る緊張を重視します。", hint_en: "Prioritize survival tension." },
  friendship: { icon: "◎", color: "#b7950b", hint_ja: "仲間との絆やチーム感を重視します。", hint_en: "Prioritize bonds and teamwork." },
  fantasy: { icon: "♜", color: "#399267", hint_ja: "魔法や異世界の広がりを重視します。", hint_en: "Prioritize fantasy worlds." },
  sci_fi: { icon: "◌", color: "#3282b8", hint_ja: "科学・未来・近未来感を重視します。", hint_en: "Prioritize sci-fi ideas." },
  historical: { icon: "▥", color: "#9a6b3f", hint_ja: "時代性や歴史の空気を重視します。", hint_en: "Prioritize historical atmosphere." },
  horror: { icon: "◐", color: "#30343f", hint_ja: "怖さや不穏な空気を重視します。", hint_en: "Prioritize horror and unease." },
  modern: { icon: "□", color: "#59656f", hint_ja: "現代の生活感や身近さを重視します。", hint_en: "Prioritize modern realism." },
  school: { icon: "◇", color: "#607d8b", hint_ja: "学校や青春の空気を重視します。", hint_en: "Prioritize school life." },
  virtual: { icon: "⌘", color: "#4a69bd", hint_ja: "ゲーム・仮想世界の面白さを重視します。", hint_en: "Prioritize virtual worlds." },
  workplace: { icon: "▤", color: "#8d6e63", hint_ja: "仕事や専門分野の面白さを重視します。", hint_en: "Prioritize work and expertise." },
  serious: { icon: "■", color: "#242424", hint_ja: "重みのある読後感を重視します。", hint_en: "Prioritize serious tone." },
  light_comedy: { icon: "☻", color: "#f39c12", hint_ja: "楽しく読める軽さを重視します。", hint_en: "Prioritize comedy and lightness." },
  dark: { icon: "●", color: "#2c2c34", hint_ja: "暗さや刺さる展開を重視します。", hint_en: "Prioritize dark intensity." },
  healing: { icon: "☼", color: "#e67e22", hint_ja: "やさしさや癒しを重視します。", hint_en: "Prioritize comfort." },
  emotional: { icon: "涙", color: "#3498db", hint_ja: "感情が動く展開を重視します。", hint_en: "Prioritize emotional impact." },
  any: { icon: "…", color: "#9b9b9b", hint_ja: "条件を固定せず、広めに探します。", hint_en: "Keep this condition open." },
};

function getQuizOptionVisual(value) {
  if (QUIZ_OPTION_VISUALS[value]) return QUIZ_OPTION_VISUALS[value];
  if (value?.includes("romance")) return QUIZ_OPTION_VISUALS.romance;
  if (value?.includes("battle")) return QUIZ_OPTION_VISUALS.battle;
  if (value?.includes("mystery")) return QUIZ_OPTION_VISUALS.mystery;
  if (value?.includes("horror") || value?.includes("dark")) return QUIZ_OPTION_VISUALS.horror;
  if (value?.includes("healing") || value?.includes("warm")) return QUIZ_OPTION_VISUALS.healing;
  if (value?.includes("fame")) return { icon: "★", color: "#c0392b", hint_ja: "知名度や話題性の好みを反映します。", hint_en: "Use popularity preference." };
  if (value?.includes("type")) return { icon: "▣", color: "#c0392b", hint_ja: "作品タイプの好みを反映します。", hint_en: "Use manga type preference." };
  if (value?.includes("reading")) return { icon: "↗", color: "#c0392b", hint_ja: "読み進める快感の好みを反映します。", hint_en: "Use reading-flow preference." };
  if (value?.includes("immersion")) return { icon: "◎", color: "#c0392b", hint_ja: "没入感の好みを反映します。", hint_en: "Use immersion preference." };
  return { icon: "•", color: "#7b746d", hint_ja: "この条件を候補に反映します。", hint_en: "Use this preference for matching." };
}

function getQuizText(item, language) {
  return language === "ja" ? item.ja || item.text_ja || item.en || item.text_en : item.en || item.text_en || item.ja || item.text_ja;
}

function QuizQuestionScreen({
  language,
  setLanguage,
  mode,
  questions,
  currentQ,
  answers,
  onAnswer,
  onClearAnswer,
  onNext,
  onBack,
  canProceed,
}) {
  const q = questions[currentQ];
  const selectedValues = answers[q.id] || [];
  const selectedOptions = q.options.filter((opt) => selectedValues.includes(opt.v));
  const progress = ((currentQ + 1) / questions.length) * 100;
  const isMulti = q.type === "multi";

  const copy = language === "ja" ? {
    quit: "診断をやめる",
    question: "QUESTION",
    remain: "残り",
    questions: "問",
    selectHint: isMulti ? `特に惹かれるものを最大${q.max}つまで選んでください。` : "直感でいちばん近いものを選んでください。",
    hintTitle: "選び方のヒント",
    hintItems: isMulti
      ? ["直感で「惹かれる！」と思うものを選んでください。", "あとから自由記述で細かく補足できます。", "迷ったら「こだわらない」以外から選んでみましょう。"]
      : ["正解はありません。今読みたい気分に近いものを選んでください。", "迷ったら、最初に目に入ったものを選ぶのがおすすめです。", "あとから自由記述で補足できます。"],
    selectedTitle: "選択中の回答",
    emptySelected: "まだ選択されていません",
    skipTitle: "スキップできます",
    skipText: "迷った時だけ次の質問へ",
    skipButton: "この質問をスキップ",
    back: "戻る",
    next: currentQ === questions.length - 1 ? "自由記述へ" : "次の質問へ",
    selectedCount: "選択中",
  } : {
    quit: "Quit quiz",
    question: "QUESTION",
    remain: "left",
    questions: "questions",
    selectHint: isMulti ? `Choose up to ${q.max}.` : "Choose the closest answer.",
    hintTitle: "Selection Hint",
    hintItems: isMulti
      ? ["Pick what feels immediately attractive.", "You can add nuance in free text later.", "If unsure, choose something other than no preference."]
      : ["There is no correct answer. Pick what matches your current mood.", "If unsure, trust your first impression.", "You can add nuance in free text later."],
    selectedTitle: "Selected answers",
    emptySelected: "Nothing selected yet",
    skipTitle: "You can skip",
    skipText: "Move on when you are unsure",
    skipButton: "Skip this question",
    back: "Back",
    next: currentQ === questions.length - 1 ? "Free text" : "Next question",
    selectedCount: "Selected",
  };

  return (
    <div
      className="h-screen overflow-hidden antialiased"
      style={{
        backgroundColor: "#f6f2ea",
        backgroundImage: "linear-gradient(180deg, #fffdf9 0%, #f6f2ea 46%, #f5f3ee 100%)",
        color: "#0a0a0a",
        fontFamily: modeSans,
      }}
    >
      <MangaMatchHeader language={language} setLanguage={setLanguage} onStartQuiz={() => {}} active="diagnosis" />

      <main className="relative mx-auto grid h-[calc(100vh-80px)] max-w-[1920px] gap-5 px-6 py-4 md:px-7 xl:grid-cols-[280px_minmax(0,1fr)_320px] xl:px-8 2xl:px-10">
        <div className="pointer-events-none absolute left-0 top-24 h-80 w-80 opacity-70" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.14) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="pointer-events-none absolute right-0 top-0 hidden h-96 w-[560px] rotate-[-8deg] opacity-[0.04] xl:block" style={{ backgroundImage: "linear-gradient(90deg, #0a0a0a 1px, transparent 1px), linear-gradient(#0a0a0a 1px, transparent 1px)", backgroundSize: "96px 132px" }} />

        <aside className="relative z-10 hidden h-full flex-col border-r border-black/10 pr-6 xl:flex">
          <button onClick={() => onBack(true)} className="mb-6 flex items-center gap-3 text-sm text-black/65 transition hover:text-[#c0392b]">
            <span>←</span>
            <span>{copy.quit}</span>
          </button>
          <div className="mb-5">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-[#c0392b]" style={{ fontFamily: modeSerif }}>{String(currentQ + 1).padStart(2, "0")}</span>
              <span className="mb-2 text-2xl text-black/45" style={{ fontFamily: modeSerif }}>/ {String(questions.length).padStart(2, "0")}</span>
            </div>
            <div className="mt-2 text-sm text-black/65">{copy.remain} <span className="font-bold text-[#c0392b]">{questions.length - currentQ - 1}</span> {copy.questions}</div>
            <div className="mt-5 h-2 rounded-full bg-black/10">
              <div className="h-2 rounded-full bg-[#c0392b] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            {questions.map((item, index) => {
              const active = index === currentQ;
              const done = index < currentQ;
              return (
                <div key={item.id} className={`flex items-center gap-3 ${active ? "font-bold text-[#0a0a0a]" : done ? "text-black/55" : "text-black/35"}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${active ? "bg-[#c0392b] text-white" : "bg-black/8 text-black/55"}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate">{language === "ja" ? item.text_ja : item.text_en}</span>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="relative z-10 flex min-w-0 flex-col">
          <div className="mb-4">
            <div className="mb-3 text-[11px] font-bold tracking-[0.32em] text-[#c0392b]">
              {copy.question} {String(currentQ + 1).padStart(2, "0")}
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl xl:text-[42px]" style={{ fontFamily: modeSerif, fontWeight: 700 }}>
              {language === "ja" ? q.text_ja : q.text_en}
            </h1>
            <p className="mt-3 min-h-[22px] text-sm text-black/68">{copy.selectHint}</p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {q.options.map((opt) => {
              const visual = getQuizOptionVisual(opt.v);
              const selected = selectedValues.includes(opt.v);
              return (
                <button
                  key={opt.v}
                  onClick={() => onAnswer(q.id, opt.v, q.type, q.max)}
                  className="group relative min-h-[82px] rounded-lg bg-white/82 p-3.5 text-left shadow-[0_16px_45px_rgba(10,10,10,0.045)] transition hover:-translate-y-0.5"
                  style={{ border: `1px solid ${selected ? "#c0392b" : "rgba(10,10,10,0.14)"}` }}
                >
                  <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border text-xs" style={{ borderColor: selected ? "#c0392b" : "rgba(10,10,10,0.22)", backgroundColor: selected ? "#c0392b" : "transparent", color: selected ? "#fff" : "transparent" }}>✓</span>
                  <span className="flex items-start gap-4 pr-7">
                    <span className="grid h-10 w-10 shrink-0 place-items-center text-2xl font-bold" style={{ color: visual.color }}>{visual.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-base font-bold leading-6">{getQuizText(opt, language)}</span>
                      <span className="mt-1.5 block text-xs leading-5 text-black/60">{language === "ja" ? visual.hint_ja : visual.hint_en}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid items-center gap-4 md:grid-cols-[160px_1fr_220px]">
            <button onClick={() => onBack(false)} className="rounded-md border border-black/18 bg-white px-5 py-3 text-sm font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]">
              ← {copy.back}
            </button>
            <div className="text-center text-sm text-black/68">
              {copy.selectedCount}：<span className="font-bold text-[#c0392b]">{selectedValues.length}</span>{isMulti ? ` / ${q.max}` : ""}
            </div>
            <button
              onClick={onNext}
              disabled={!canProceed()}
              className="rounded-md bg-[#c0392b] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_38px_rgba(192,57,43,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            >
              {copy.next} →
            </button>
          </div>
        </section>

        <aside className="relative z-10 hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-lg border border-[#d7a447]/20 bg-[#fff9ed]/86 p-6 shadow-[0_20px_60px_rgba(10,10,10,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <ModeIcon type="lightbulb" className="h-7 w-7 text-[#d7a447]" />
                <h2 className="font-bold">{copy.hintTitle}</h2>
              </div>
              <ul className="space-y-3 text-sm leading-7 text-black/70">
                {copy.hintItems.map((item) => <li key={item}>・{item}</li>)}
              </ul>
            </div>

            <div className="rounded-lg border border-black/10 bg-[#fff9ed]/86 p-5 shadow-[0_20px_60px_rgba(10,10,10,0.05)]">
              <h3 className="mb-4 text-sm font-bold">{copy.selectedTitle}</h3>
              <div className="space-y-3">
                {selectedOptions.length === 0 && (
                  <div className="rounded-md border border-dashed border-black/16 bg-white/70 px-4 py-4 text-sm text-black/45">{copy.emptySelected}</div>
                )}
                {selectedOptions.map((opt) => {
                  const visual = getQuizOptionVisual(opt.v);
                  return (
                    <div key={opt.v} className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-3 py-3">
                      <span className="text-xl font-bold" style={{ color: visual.color }}>{visual.icon}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-bold">{getQuizText(opt, language)}</span>
                      <button onClick={() => onClearAnswer(q.id, opt.v)} className="text-lg leading-none text-black/45 transition hover:text-[#c0392b]" aria-label="remove">×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function LoadingResultScreen({
  language,
  setLanguage,
  results,
  recommendations,
  loadingMangaIndex,
  onPrevDiscovery,
  onNextDiscovery,
  onSelectDiscovery,
  onViewResults,
  t,
}) {
  const rec = recommendations[loadingMangaIndex % recommendations.length];
  const completed = Boolean(results);
  const copy = language === "ja" ? {
    completeTitle: "診断が完了しました！",
    loadingTitle: "AIが分析中です",
    completeLead: ["あなたの好みを分析した結果、", "ぴったりの漫画を見つけました。", "気になる作品をチェックして、", "新しい出会いを楽しんでください。"],
    loadingLead: ["回答内容と自由記述を読み取り、", "候補作品を照合しています。", "待っている間に、", "こんな漫画も見てみませんか。"],
    sideLabel: "こんな漫画もあります",
    detailLabel: "どんな漫画？",
    viewResult: "結果を見る",
  } : {
    completeTitle: "Your diagnosis is ready",
    loadingTitle: "AI is analyzing",
    completeLead: ["We analyzed your preferences", "and found manga that may fit you.", "Check the titles that interest you", "and enjoy a new discovery."],
    loadingLead: ["Reading your answers and free text,", "then matching them with manga candidates.", "While you wait,", "here is another manga to explore."],
    sideLabel: "Side discovery",
    detailLabel: "What is it?",
    viewResult: "View results",
  };
  const leadLines = completed ? copy.completeLead : copy.loadingLead;

  return (
    <div
      className="min-h-screen overflow-x-hidden antialiased"
      style={{
        backgroundColor: "#f6f2ea",
        backgroundImage: "linear-gradient(180deg, #fffdf9 0%, #f6f2ea 48%, #f5f3ee 100%)",
        color: "#0a0a0a",
        fontFamily: modeSans,
      }}
    >
      <MangaMatchHeader language={language} setLanguage={setLanguage} onStartQuiz={() => {}} active="diagnosis" />

      <main className="relative mx-auto grid min-h-[calc(100vh-82px)] max-w-[1536px] items-center gap-10 px-6 py-7 md:px-10 xl:grid-cols-[380px_minmax(0,1fr)] xl:px-14">
        <div className="pointer-events-none absolute left-16 top-[22%] h-80 w-80 opacity-70" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.14) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div className="pointer-events-none absolute right-12 top-24 h-[620px] w-[900px] opacity-25" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.12) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />

        <section className="relative z-10 text-center xl:text-left">
          <div className="mb-9 flex justify-center xl:justify-center">
            <div className="relative grid h-40 w-40 place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c0392b]/18" />
              <div className="absolute inset-5 rounded-full border-4 border-[#c0392b]" />
              {completed ? (
                <svg className="h-20 w-20 text-[#c0392b]" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M17 33.5 27 43l20-23" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <>
                  <div className="absolute inset-5 rounded-full border-4 border-transparent border-t-[#c0392b] animate-spin" />
                  <div className="absolute inset-10 rounded-full border-2 border-transparent border-b-[#0a0a0a]/60 animate-spin" style={{ animationDuration: "1.8s", animationDirection: "reverse" }} />
                </>
              )}
              <span className="absolute right-2 top-6 h-2 w-2 rounded-full bg-[#c0392b]" />
              <span className="absolute right-0 top-16 h-1.5 w-1.5 rounded-full bg-[#c0392b]" />
            </div>
          </div>

          <h1 className="whitespace-nowrap text-3xl font-bold leading-tight md:text-4xl xl:text-[38px]" style={{ fontFamily: modeSerif, fontWeight: 800 }}>
            {completed ? (
              <>{language === "ja" ? "診断が" : "Diagnosis "} <span className="text-[#c0392b]">{language === "ja" ? "完了" : "Complete"}</span>{language === "ja" ? "しました！" : ""}</>
            ) : (
              copy.loadingTitle
            )}
          </h1>

          <div className="mt-7 space-y-3 text-base font-medium leading-8 text-black/75 md:text-lg">
            {leadLines.map((line) => <p key={line}>{line}</p>)}
          </div>

        </section>

        <section className="relative z-10">
          <div className="relative rounded-2xl border border-black/5 bg-white/82 px-6 py-7 shadow-[0_24px_70px_rgba(10,10,10,0.10)] md:px-10 md:py-9">
            <div className="mb-8 flex items-center justify-between">
              <div className="text-sm font-bold tracking-[0.08em] text-[#c0392b] md:text-base">{copy.sideLabel}</div>
              <div className="font-mono text-sm font-bold text-black/60">
                <span className="text-[#c0392b]">{String((loadingMangaIndex % recommendations.length) + 1).padStart(2, "0")}</span>
                {" / "}
                {String(recommendations.length).padStart(2, "0")}
              </div>
            </div>

            <div
              key={`${loadingMangaIndex}-${rec.title}`}
              className="grid items-center gap-8 md:grid-cols-[340px_minmax(0,1fr)]"
              style={{ animation: "loadingMangaPop 520ms ease-out both" }}
            >
              <div className="flex justify-center">
                <MangaCover title={rec.title} id={rec.id} author={rec.author} size="loading" />
              </div>
              <div className="min-w-0">
                <h2 className="text-3xl font-medium leading-tight md:text-5xl" style={{ fontFamily: modeSerif }}>
                  {rec.title}
                </h2>
                {rec.author && <p className="mt-4 text-lg text-black/80">{rec.author}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-md border border-[#c0392b]/20 bg-[#fff6f4] px-3 py-1 text-xs font-bold text-[#c0392b]">MANGA</span>
                  <span className="rounded-md border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-bold text-black/55">{completed ? "MATCHED" : "DISCOVERY"}</span>
                </div>
                <p className="mt-9 text-base leading-8 text-black/76 md:text-lg">{rec.lead}</p>
                {rec.detail && (
                  <div className="mt-6 border-t border-black/10 pt-5">
                    <div className="mb-2 text-[10px] font-bold tracking-[0.22em] text-black/40">{copy.detailLabel}</div>
                    <p className="text-sm leading-7 text-black/66">{rec.detail}</p>
                  </div>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <WatchLaterButton item={{ title_ja: rec.title, title_en: rec.title, author: rec.author, description: rec.lead }} sourceContext="診断中のおすすめ" compact />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onPrevDiscovery}
              className="absolute left-[-24px] top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#f2c7c2] bg-white text-2xl font-bold text-[#c0392b] shadow-[0_14px_34px_rgba(192,57,43,0.16)] transition hover:-translate-y-[52%] xl:grid"
              aria-label={language === "ja" ? "前の漫画" : "Previous manga"}
            >
              ←
            </button>

            <button
              type="button"
              onClick={onNextDiscovery}
              className="absolute right-[-24px] top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#f2c7c2] bg-white text-2xl font-bold text-[#c0392b] shadow-[0_14px_34px_rgba(192,57,43,0.16)] transition hover:-translate-y-[52%] xl:grid"
              aria-label={t.nextDiscovery}
            >
              →
            </button>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {recommendations.map((item, idx) => (
                <button
                  key={`${item.title}-${idx}`}
                  type="button"
                  onClick={() => onSelectDiscovery(idx)}
                  className="h-3 w-3 rounded-full transition"
                  style={{ backgroundColor: idx === loadingMangaIndex % recommendations.length ? "#c0392b" : "#eadbd7" }}
                  aria-label={`${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {completed && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onViewResults}
                className="w-full max-w-[420px] rounded-md border border-black/70 bg-white px-10 py-4 text-base font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]"
              >
                {copy.viewResult} →
              </button>
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes loadingMangaPop {
          0% { opacity: 0; transform: translateY(14px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function FreeTextScreen({
  language,
  setLanguage,
  freeText,
  setFreeText,
  onBack,
  onSubmit,
  error,
}) {
  const copy = language === "ja" ? {
    badge: "任意入力",
    titleBefore: "AIに伝えたい",
    titleAccent: "好み",
    titleAfter: "はありますか？",
    desc: "ここに書いた内容も含めて、AIがあなたに合う漫画を診断します。",
    subDesc: "なければ空欄のまま進んでOKです。",
    placeholder: "例：鬱展開は苦手。伏線回収がある作品が読みたい。",
    common: "よく選ばれるこだわり",
    examples: [
      { icon: "☂", label: "鬱展開は苦手" },
      { icon: "♡", label: "報われる結末がいい" },
      { icon: "♧", label: "頭脳戦が好き" },
      { icon: "◇", label: "重すぎる展開は苦手" },
      { icon: "♡", label: "恋愛少なめ" },
      { icon: "▤", label: "完結済みがいい" },
    ],
    back: "戻る",
    submit: "AIに診断してもらう",
    privacy: "入力内容はAI診断のみに使用されます",
  } : {
    badge: "Optional",
    titleBefore: "Anything you want",
    titleAccent: "AI to know",
    titleAfter: "?",
    desc: "The AI will include this note when choosing manga for you.",
    subDesc: "You can leave it blank and continue.",
    placeholder: "e.g. I dislike depressing endings. I want a story with good payoff.",
    common: "Common preferences",
    examples: [
      { icon: "☂", label: "No depressing plots" },
      { icon: "♡", label: "Rewarding ending" },
      { icon: "♧", label: "Mind games" },
      { icon: "◇", label: "Not too heavy" },
      { icon: "♡", label: "Less romance" },
      { icon: "▤", label: "Completed series" },
    ],
    back: "Back",
    submit: "Ask AI",
    privacy: "Your note is used only for this AI diagnosis",
  };

  const useExample = (label) => {
    setFreeText((current) => {
      const trimmed = current.trim();
      if (!trimmed) return label;
      if (trimmed.includes(label)) return current;
      const separator = language === "ja" ? "。" : ". ";
      const next = `${trimmed}${separator}${label}`;
      return next.slice(0, 200);
    });
  };

  return (
    <div
      className="h-screen overflow-hidden antialiased"
      style={{
        backgroundColor: "#f6f2ea",
        backgroundImage: "linear-gradient(180deg, #fffdf9 0%, #f7f2ea 48%, #f5f3ee 100%)",
        color: "#0a0a0a",
        fontFamily: modeSans,
      }}
    >
      <MangaMatchHeader language={language} setLanguage={setLanguage} onStartQuiz={() => {}} active="diagnosis" />

      <main className="relative mx-auto flex h-[calc(100vh-82px)] max-w-[1536px] items-center justify-center overflow-hidden px-6 py-5 md:px-10 md:py-6 xl:px-14">
        <div className="pointer-events-none absolute left-[6%] top-[27%] h-[520px] w-[360px] opacity-65" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.14) 1.25px, transparent 1.25px)", backgroundSize: "18px 18px" }} />
        <div className="pointer-events-none absolute right-[7%] top-[25%] h-[520px] w-[360px] opacity-65" style={{ backgroundImage: "radial-gradient(circle, rgba(192,57,43,0.14) 1.25px, transparent 1.25px)", backgroundSize: "18px 18px" }} />
        <div className="pointer-events-none absolute bottom-[14%] left-[5%] hidden h-48 w-56 rounded-[28px] border-2 border-[#e9afa8]/45 opacity-55 rotate-[-22deg] md:block" />
        <div className="pointer-events-none absolute bottom-[12%] right-[5%] hidden h-44 w-64 border-2 border-[#e9afa8]/45 opacity-55 rotate-[11deg] md:block" />

        <section className="relative z-10 w-full max-w-[1030px] rounded-[18px] border border-black/10 bg-[#fffdf9]/90 shadow-[0_28px_90px_rgba(10,10,10,0.13)]">
          <div className="px-7 pb-5 pt-7 md:px-16 md:pb-6 md:pt-8">
            <div className="flex items-start justify-between gap-8">
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-md border border-[#e0554a] px-4 py-2 text-sm font-bold text-[#c0392b]">
                  {copy.badge}
                </span>
                <h1 className="mt-5 whitespace-nowrap text-[30px] font-medium leading-tight sm:text-4xl md:text-[42px] xl:text-[46px]" style={{ fontFamily: modeSerif }}>
                  {copy.titleBefore}
                  <span className="text-[#c0392b]">{copy.titleAccent}</span>
                  {copy.titleAfter}
                </h1>
                <p className="mt-4 text-base leading-7 text-black/70">{copy.desc}</p>
                <p className="mt-2 text-base leading-7 text-black/70">{copy.subDesc}</p>
              </div>

              <div className="relative hidden h-32 w-48 shrink-0 text-[#e8aaa3] md:block" aria-hidden="true">
                <svg viewBox="0 0 220 150" className="h-full w-full" fill="none">
                  <path d="M72 22h82a12 12 0 0 1 12 12v92a12 12 0 0 1-12 12H72a12 12 0 0 1-12-12V34a12 12 0 0 1 12-12Z" stroke="currentColor" strokeWidth="5" />
                  <path d="M88 52h48M88 76h44M88 100h34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="m160 116 34-34 17 17-34 34-24 7 7-24Z" fill="currentColor" opacity="0.92" />
                  <path d="M192 18 200 36 218 44 200 52 192 70 184 52 166 44 184 36l8-18ZM40 98l6 14 14 6-14 6-6 14-6-14-14-6 14-6 6-14Z" fill="currentColor" opacity="0.75" />
                </svg>
              </div>
            </div>

            <div className="relative mt-7">
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={copy.placeholder}
                maxLength={200}
                className="min-h-[138px] w-full resize-none rounded-lg border border-[#ef9c94] bg-transparent px-5 py-4 text-base leading-8 outline-none transition focus:border-[#c0392b] focus:bg-white/65 md:min-h-[154px]"
                style={{ color: "#0a0a0a", fontFamily: modeSerif }}
              />
              <div className="pointer-events-none absolute bottom-5 right-5 text-sm tracking-[0.12em] text-black/45" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {freeText.length} / 200
              </div>
            </div>

            <div className="mt-6">
              <h2 className="mb-4 flex items-center gap-3 text-lg font-extrabold">
                <span className="text-[#c0392b]">✧</span>
                {copy.common}
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {copy.examples.map((example) => (
                  <button
                    key={example.label}
                    type="button"
                    onClick={() => useExample(example.label)}
                    className="flex min-h-[50px] items-center gap-4 rounded-full border border-[#efb1aa] bg-white/35 px-6 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:border-[#c0392b] hover:bg-white md:text-base"
                  >
                    <span className="w-5 text-xl text-[#e13f36]">{example.icon}</span>
                    <span>{example.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 px-7 py-5 md:px-16">
            <div className="grid items-center gap-4 md:grid-cols-[220px_282px] md:justify-between">
              <button
                type="button"
                onClick={onBack}
                className="h-[56px] rounded-md border border-black/60 bg-white/40 text-base font-bold transition hover:border-[#c0392b] hover:text-[#c0392b]"
              >
                ←　{copy.back}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="h-[56px] rounded-md bg-[#c7352d] text-base font-extrabold text-white shadow-[0_16px_35px_rgba(192,57,43,0.22)] transition hover:-translate-y-0.5 hover:bg-[#b92f28]"
              >
                {copy.submit}　→
              </button>
            </div>
          </div>
        </section>

        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap text-sm text-black/45">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 10V8a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M6.5 10h11A1.5 1.5 0 0 1 19 11.5v8A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10Z" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          {copy.privacy}
        </div>
      </main>

      {error && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[min(720px,calc(100vw-32px))] -translate-x-1/2 rounded-md bg-[#c0392b] px-5 py-4 text-center text-sm font-bold text-[#fffdf9] shadow-[0_18px_45px_rgba(10,10,10,0.18)]">
          {error}
        </div>
      )}
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
  const [loadingMangaIndex, setLoadingMangaIndex] = useState(0);
  const [loadingMangaSeed, setLoadingMangaSeed] = useState(() => createLoadingSeed());
  const prefetchRef = useRef({ key: "", promise: null });

  const t = T[language];
  const QUESTIONS = mode === "simple" ? QUESTIONS_SIMPLE : QUESTIONS_DETAILED;
  const diagnosisType = getDiagnosisType(mode);
  const loadingRecommendations = useMemo(() => getLoadingRecommendations(answers, language, loadingMangaSeed), [answers, language, loadingMangaSeed]);

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
        trackEvent("diagnosis_answer", { diagnosis_type: diagnosisType, question_id: qId, question_index: currentQ + 1, answer_value: nextValues.join(",") });
        return;
      }
      const filtered = current.filter((v) => v !== "any");
      if (filtered.includes(value)) nextValues = filtered.filter((v) => v !== value);
      else if (filtered.length < max) nextValues = [...filtered, value];
      else nextValues = filtered;
      setAnswers({ ...answers, [qId]: nextValues });
    }
    trackEvent("diagnosis_answer", { diagnosis_type: diagnosisType, question_id: qId, question_index: currentQ + 1, answer_value: nextValues.join(",") });
  };

  const clearAnswer = (qId, value) => {
    const current = answers[qId] || [];
    const nextValues = current.filter((v) => v !== value);
    setAnswers({ ...answers, [qId]: nextValues });
    trackEvent("diagnosis_answer", { diagnosis_type: diagnosisType, question_id: qId, question_index: currentQ + 1, answer_value: nextValues.join(",") });
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

  const quitQuiz = () => {
    setScreen("mode");
  };

  const submitQuiz = async () => {
    const diagnosisStartedAt = Date.now();
    const nextLoadingSeed = createLoadingSeed();
    const nextLoadingRecommendations = getLoadingRecommendations(answers, language, nextLoadingSeed);
    setScreen("loading");
    setLoadingStep(0);
    setLoadingMangaSeed(nextLoadingSeed);
    setLoadingMangaIndex(getRandomLoadingIndex(nextLoadingRecommendations.length));
    setError(null);
    setResults(null);
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
        fallback_used: Boolean(data.fallback),
        preview_mode: Boolean(data.preview),
        duration_ms: Date.now() - diagnosisStartedAt,
      });
    } catch (err) {
      console.error("Error:", err);
      trackEvent("diagnosis_error", {
        diagnosis_type: diagnosisType,
        error_type: getDiagnosisErrorType(err),
        duration_ms: Date.now() - diagnosisStartedAt,
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
      {!(screen === "landing" && USE_NEW_HOME) && screen !== "mode" && screen !== "quiz" && screen !== "freetext" && screen !== "loading" && <div className="fixed top-6 right-6 z-50 flex gap-1 items-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <button onClick={() => setLanguage("ja")} className="px-3 py-1 text-xs tracking-wider transition-all"
          style={{ backgroundColor: language === "ja" ? "#0a0a0a" : "transparent", color: language === "ja" ? "#f5f3ee" : "#0a0a0a", border: "1px solid #0a0a0a" }}>JA</button>
        <button onClick={() => setLanguage("en")} className="px-3 py-1 text-xs tracking-wider transition-all"
          style={{ backgroundColor: language === "en" ? "#0a0a0a" : "transparent", color: language === "en" ? "#f5f3ee" : "#0a0a0a", border: "1px solid #0a0a0a" }}>EN</button>
      </div>}

      {screen === "landing" && (USE_NEW_HOME ? (
        <HomePageV2 language={language} setLanguage={setLanguage} onStartQuiz={() => setScreen("mode")} />
      ) : (
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
            <div className="h-10 md:h-12 mb-10 pointer-events-none" aria-hidden="true" />
            <button onClick={() => setScreen("mode")} className="px-12 py-4 text-sm tracking-[0.3em] uppercase transition-all hover:scale-105"
              style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>
              {t.startQuiz} →
            </button>
            <div className="mt-8 mx-auto text-center">
              <div className="mb-3 text-[10px] tracking-[0.28em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
                Menu
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs" style={{ color: "#0a0a0a" }}>
                <a href="/manga" className="px-4 py-2 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.14)" }}>{"\u5168\u4f5c\u54c1\u4e00\u89a7"}</a>
                <a href="/watchlist" className="px-4 py-2 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.14)" }}>{"\u5f8c\u3067\u898b\u308b"}</a>
              </div>
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
      ))}

      {screen === "mode" && (
        <DiagnosisModeScreen language={language} setLanguage={setLanguage} t={t} onStartMode={startMode} onBack={() => setScreen("landing")} />
      )}

      {false && screen === "mode" && (
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
        <QuizQuestionScreen
          language={language}
          setLanguage={setLanguage}
          mode={mode}
          questions={QUESTIONS}
          currentQ={currentQ}
          answers={answers}
          onAnswer={handleAnswer}
          onClearAnswer={clearAnswer}
          onNext={goNext}
          onBack={(quit) => quit ? quitQuiz() : goBack()}
          canProceed={canProceed}
        />
      )}

      {false && screen === "quiz" && (
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
            <p className="min-h-[20px] text-xs tracking-wider mb-8" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>
              {QUESTIONS[currentQ].type === "multi" ? (
                <>
                  {t.selectMax} {QUESTIONS[currentQ].max} {t.selectMaxSuffix}
                  {answers[QUESTIONS[currentQ].id] && ` (${answers[QUESTIONS[currentQ].id].length}/${QUESTIONS[currentQ].max})`}
                </>
              ) : "\u00a0"}
            </p>
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
        <FreeTextScreen
          language={language}
          setLanguage={setLanguage}
          freeText={freeText}
          setFreeText={setFreeText}
          onBack={() => { setScreen("quiz"); setCurrentQ(QUESTIONS.length - 1); }}
          onSubmit={submitQuiz}
          error={error}
        />
      )}

      {false && screen === "freetext" && (
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
        <LoadingResultScreen
          language={language}
          setLanguage={setLanguage}
          results={results}
          recommendations={loadingRecommendations}
          loadingMangaIndex={loadingMangaIndex}
          onPrevDiscovery={() => setLoadingMangaIndex((prev) => (prev - 1 + loadingRecommendations.length) % loadingRecommendations.length)}
          onNextDiscovery={() => setLoadingMangaIndex((prev) => (prev + 1) % loadingRecommendations.length)}
          onSelectDiscovery={(index) => setLoadingMangaIndex(index)}
          onViewResults={() => setScreen("results")}
          t={t}
        />
      )}

      {false && screen === "loading" && (
        <div className="min-h-screen flex items-center justify-center px-5 md:px-8 py-12">
          <style>{`
            @keyframes loadingMangaPop {
              0% { opacity: 0; transform: translateY(14px) scale(0.96); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] gap-10 md:gap-14 items-center">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-2 border-black opacity-10" />
                  {results ? (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl" style={{ color: "#c0392b" }}>✓</div>
                  ) : (
                    <>
                      <div className="absolute inset-0 border-t-2 border-r-2 border-black animate-spin" />
                      <div className="absolute inset-2 border-b-2 border-l-2 animate-spin" style={{ borderColor: "#c0392b", animationDuration: "2s", animationDirection: "reverse" }} />
                    </>
                  )}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
                {results ? t.loadingComplete : t.loading}
              </h2>
              <div className="flex justify-center gap-2 mb-8">
                {Array.from({ length: LOADING_STEP_COUNT }).map((_, idx) => (<div key={idx} className="h-1 w-8 transition-all" style={{ backgroundColor: idx <= (results ? LOADING_STEP_COUNT - 1 : loadingStep) ? "#c0392b" : "rgba(10,10,10,0.15)" }} />))}
              </div>
              {results && (
                <button
                  onClick={() => setScreen("results")}
                  className="px-10 py-3 text-sm tracking-[0.24em] uppercase transition-all hover:scale-105"
                  style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {t.viewResults} →
                </button>
              )}
            </div>
            <div className="w-full">
              <div className="text-[10px] tracking-[0.28em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
                {language === "ja" ? "こんな漫画もあります" : "Side Discoveries"}
              </div>
              <div className="min-h-[520px] flex flex-col justify-between">
                {(() => {
                  const rec = loadingRecommendations[loadingMangaIndex % loadingRecommendations.length];
                  return (
                    <div
                      key={`${loadingMangaIndex}-${rec.title}`}
                      className="px-5 py-6 border"
                      style={{
                        borderColor: "rgba(192,57,43,0.35)",
                        backgroundColor: "rgba(192,57,43,0.045)",
                        animation: "loadingMangaPop 520ms ease-out both",
                      }}
                    >
                      <div className="text-xs mb-5" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
                        {String((loadingMangaIndex % loadingRecommendations.length) + 1).padStart(2, "0")} / {String(loadingRecommendations.length).padStart(2, "0")}
                      </div>
                      <div className="mb-6 flex justify-center">
                        <MangaCover title={rec.title} id={rec.id} author={rec.author} size="loading" />
                      </div>
                      <div className="text-3xl md:text-4xl leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
                        {rec.title}
                      </div>
                      <p className="text-sm md:text-base leading-relaxed" style={{ color: "#555" }}>
                        {rec.lead}
                      </p>
                      {rec.detail && (
                        <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(10,10,10,0.12)" }}>
                          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "#999", fontFamily: "'JetBrains Mono', monospace" }}>
                            {language === "ja" ? "どんな漫画？" : "What Is It?"}
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#444" }}>
                            {rec.detail}
                          </p>
                        </div>
                      )}
                      <div className="mt-5">
                        <WatchLaterButton item={{ title_ja: rec.title, title_en: rec.title, author: rec.author, description: rec.lead }} sourceContext="診断中のおすすめ" compact />
                      </div>
                    </div>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setLoadingMangaIndex((prev) => (prev + 1) % loadingRecommendations.length)}
                  className="mt-4 px-4 py-3 text-xs tracking-[0.2em] uppercase transition-all hover:translate-x-1"
                  style={{ border: "1px solid rgba(10,10,10,0.18)", color: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {t.nextDiscovery} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "results" && results && (
        <div className="min-h-screen px-4 md:px-8 py-16">
          <div className="max-w-5xl mx-auto">
            {/* 広告枠 1: プロフィール直後（最も目立つ位置） */}
            <AdSlot slot="results-top" />

            {results.matchNotice && (
              <div className="mb-10 border px-5 py-4" style={{ borderColor: "rgba(192,57,43,0.25)", backgroundColor: "rgba(192,57,43,0.04)" }}>
                <div className="text-xs tracking-[0.24em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
                  {results.matchNotice.type === "no_exact_match" ? "Close Alternatives" : "Also Recommended"}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#333" }}>
                  {language === "ja" ? results.matchNotice.message_ja : results.matchNotice.message_en}
                </p>
              </div>
            )}

            {results.recommendations && results.recommendations.length > 0 && (
              <div className="mb-20">
                <div className="flex items-baseline gap-4 mb-10">
                  <div className="text-xs tracking-[0.3em]" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>01 — 03</div>
                  <h3 className="text-2xl md:text-3xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.top3}</h3>
                  <div className="flex-grow h-px bg-black opacity-20" />
                </div>
                <div className="space-y-14">
                  {results.recommendations.slice(0, 3).map((rec, idx) => (
                    <article key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="grid grid-cols-12 gap-6 md:gap-10 pb-14 border-b" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
                      <div className="col-span-12 md:col-span-2">
                        <div className="text-7xl md:text-8xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: idx === 0 ? "#c0392b" : "#0a0a0a" }}>{String(rec.rank).padStart(2, "0")}</div>
                      </div>
                      <div className="col-span-12 md:col-span-10 flex flex-col sm:flex-row gap-6 md:gap-8">
                        <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} size="hero" />
                        <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="text-3xl md:text-4xl font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</h4>
                          <AlternativeBadge rec={rec} language={language} />
                        </div>
                        <MangaMetaLine rec={rec} t={t} includeYear includeAnime className="text-sm md:text-base mb-5 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }} />
                        {rec.description && (<p className="text-base md:text-lg leading-8 mb-5" style={{ color: "#333" }}>{rec.description}</p>)}
                        <div className="mb-3">
                          <WatchLaterButton item={rec} sourceContext="診断結果" />
                        </div>
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
                <div className="space-y-8">
                  {results.recommendations.slice(3, 10).map((rec) => (
                    <article key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="grid grid-cols-12 gap-5 md:gap-6 pb-8 border-b" style={{ borderColor: "rgba(10,10,10,0.08)" }}>
                      <div className="col-span-2 md:col-span-1">
                        <div className="text-3xl md:text-4xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#888" }}>{String(rec.rank).padStart(2, "0")}</div>
                      </div>
                      <div className="col-span-10 md:col-span-11 flex flex-col sm:flex-row gap-5">
                        <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} size="result" />
                        <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-2xl md:text-3xl font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</h4>
                          <AlternativeBadge rec={rec} language={language} />
                        </div>
                        <MangaMetaLine rec={rec} t={t} className="text-xs md:text-sm mb-3 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888" }} />
                        {rec.description && (<p className="text-sm md:text-base leading-7" style={{ color: "#444" }}>{rec.description}</p>)}
                        <div className="mt-3">
                          <WatchLaterButton item={rec} sourceContext="診断結果" compact />
                        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                  {results.recommendations.slice(10, 20).map((rec) => (
                    <div key={`${rec.rank}-${rec.title_en || rec.title_ja}`} className="flex gap-4 items-start py-2">
                      <span className="text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c0392b", minWidth: "1.5rem" }}>{String(rec.rank).padStart(2, "0")}</span>
                      <MangaCover title={rec.title_ja || rec.title_en} id={rec.id} author={rec.author} size="medium" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-lg md:text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{language === "ja" ? (rec.title_ja || rec.title_en) : (rec.title_en || rec.title_ja)}</div>
                          <AlternativeBadge rec={rec} language={language} />
                        </div>
                        <MangaMetaLine rec={rec} t={t} includeStatus={false} className="text-xs" style={{ color: "#888" }} />
                        <div className="mt-2">
                          <WatchLaterButton item={rec} sourceContext="診断結果" compact />
                        </div>
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
