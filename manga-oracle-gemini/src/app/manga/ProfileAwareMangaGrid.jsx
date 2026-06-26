"use client";

import { useEffect, useMemo, useState } from "react";
import MangaCover from "../../components/MangaCover";
import WatchLaterButton from "../../components/WatchLaterButton";
import { getMangaCoverForItem } from "../../data/mangaCovers";
import { BROWSE_PROFILE_STORAGE_KEY, normalizeBrowseProfile } from "@/lib/browseProfile";

const browseSerif = "'Noto Serif JP', 'Cormorant Garamond', serif";

const statusLabel = {
  completed: "完結済み",
  ongoing: "連載中",
  hiatus: "休載中",
};

const tagLabels = {
  fantasy: "ファンタジー",
  battle: "バトル",
  romance: "恋愛",
  mystery: "ミステリー",
  sports: "スポーツ",
  horror: "ホラー",
  dark: "ダーク",
  emotional: "感情描写",
  healing: "癒し",
  school: "青春",
  workplace: "仕事",
  human_drama: "人間ドラマ",
  action: "アクション",
  comedy_gag: "ギャグ",
  suspense: "サスペンス",
  psychological: "心理",
  sci_fi: "SF",
  historical: "歴史",
  slice_of_life: "日常",
  self_discovery: "成長",
  worldbuilding: "世界観",
  friendship: "友情",
  light_comedy: "軽め",
};

const genreRules = {
  battle: ["battle", "action", "burning", "tournament", "revenge", "dynamic"],
  fantasy: ["fantasy", "urban_fantasy", "isekai", "mythology", "worldbuilding", "adventure"],
  sf: ["sci_fi", "space", "virtual", "post_apocalypse", "time_loop"],
  mystery: ["mystery", "suspense", "psychological", "twist", "mystery_box"],
  romance: ["romance", "shojo_kirakira", "warm", "emotional"],
  school: ["school", "coming_of_age", "friendship", "self_discovery"],
  horror: ["horror", "dark", "brutal", "shock"],
  sports: ["sports", "tournament", "burning"],
  slice: ["slice_of_life", "healing", "wholesome", "daily_buildup", "comfort"],
  comedy: ["light_comedy", "comedy_gag", "satirical", "chaos"],
  historical: ["historical", "war", "politics"],
};

const dislikeRules = {
  gore: ["brutal", "horror", "shock"],
  violence: ["brutal", "revenge", "battle", "war"],
  tragedy: ["dark", "melancholic", "psychological", "existential"],
  repetition: ["twist", "mystery_box", "shock"],
  sexual: ["romance", "adult"],
  horror: ["horror", "supernatural", "dark"],
  long: ["long_running", "long_arc"],
};

const moodRules = {
  exciting: ["battle", "action", "adventure", "fast_paced", "burning"],
  emotional: ["emotional", "human_drama", "family_theme", "emotional_catharsis"],
  heartwarming: ["romance", "warm", "wholesome", "healing"],
  funny: ["light_comedy", "comedy_gag", "chaos"],
  tense: ["suspense", "mystery", "survival", "tense"],
  thinking: ["philosophical", "psychological", "moral", "social"],
  refreshing: ["underdog_growth", "sports", "burning", "friendship"],
  casual: ["slice_of_life", "episodic", "light_comedy"],
};

function countMatches(tags, rules) {
  return rules.reduce((score, tag) => score + (tags.includes(tag) ? 1 : 0), 0);
}

function scoreManga(manga, profile) {
  if (!profile) return 0;
  const tags = manga.tags || [];
  let score = 0;

  for (const genre of profile.genres || []) {
    score += countMatches(tags, genreRules[genre] || []) * 4;
  }

  for (const mood of profile.moods || []) {
    score += countMatches(tags, moodRules[mood] || []) * 3;
  }

  for (const dislike of profile.dislikes || []) {
    score -= countMatches(tags, dislikeRules[dislike] || []) * 5;
  }

  if (profile.dislikes?.includes("long") && manga.volumes >= 50) score -= 6;
  if (profile.frequency === "rarely" && manga.volumes >= 30) score -= 3;
  if (profile.frequency === "almost_daily" && manga.volumes >= 20) score += 1;
  if (profile.age === "10s" && tags.some((tag) => ["school", "coming_of_age", "friendship"].includes(tag))) score += 2;

  return score;
}

function tagSet(manga) {
  return new Set(manga.tags || []);
}

function popularityScore(manga) {
  const tags = tagSet(manga);
  let score = 0;
  if (manga.anime) score += 28;
  if (manga.status === "ongoing") score += 5;
  if ((manga.year || 0) >= 2020) score += 8;
  if ((manga.year || 0) >= 2023) score += 6;
  for (const tag of ["bestseller", "global", "viral", "award", "legendary", "classic", "critic", "shonen_classic"]) {
    if (tags.has(tag)) score += 12;
  }
  for (const tag of ["battle", "romance", "mystery", "sports", "fantasy", "human_drama"]) {
    if (tags.has(tag)) score += 2;
  }
  if (manga.volumes && manga.volumes >= 5) score += Math.min(10, Math.floor(manga.volumes / 10));
  return score;
}

function readabilityScore(manga) {
  const tags = tagSet(manga);
  let score = 0;
  const volumes = manga.volumes || 999;
  if (volumes <= 3) score += 26;
  else if (volumes <= 10) score += 22;
  else if (volumes <= 20) score += 14;
  else if (volumes <= 35) score += 6;
  else score -= 8;
  if (manga.status === "completed") score += 10;
  for (const tag of ["light_comedy", "healing", "slice_of_life", "episodic", "fast_paced", "wholesome", "warm", "comfort"]) {
    if (tags.has(tag)) score += 6;
  }
  for (const tag of ["long_arc", "long_running", "mystery_box", "brutal", "dark", "psychological"]) {
    if (tags.has(tag)) score -= 4;
  }
  return score;
}

function compareBySortMode(a, b, sortMode) {
  if (sortMode === "profile") return b.score - a.score || a.originalIndex - b.originalIndex;
  if (sortMode === "popular") return popularityScore(b.manga) - popularityScore(a.manga) || (b.manga.year || 0) - (a.manga.year || 0) || a.originalIndex - b.originalIndex;
  if (sortMode === "new") return (b.manga.year || 0) - (a.manga.year || 0) || a.originalIndex - b.originalIndex;
  if (sortMode === "completed") {
    const completedDiff = (b.manga.status === "completed" ? 1 : 0) - (a.manga.status === "completed" ? 1 : 0);
    return completedDiff || (b.manga.year || 0) - (a.manga.year || 0) || a.originalIndex - b.originalIndex;
  }
  if (sortMode === "short") {
    const aVolumes = a.manga.volumes && a.manga.volumes > 0 ? a.manga.volumes : 9999;
    const bVolumes = b.manga.volumes && b.manga.volumes > 0 ? b.manga.volumes : 9999;
    return aVolumes - bVolumes || (b.manga.year || 0) - (a.manga.year || 0) || a.originalIndex - b.originalIndex;
  }
  if (sortMode === "readable") return readabilityScore(b.manga) - readabilityScore(a.manga) || a.originalIndex - b.originalIndex;
  return a.originalIndex - b.originalIndex;
}

function MangaCard({ manga, index, pageType, matchScore }) {
  const cover = getMangaCoverForItem(manga);
  const title = manga.title_ja || manga.title_en || manga.id;
  const description = manga.desc_ja || manga.desc_en || "マンガマッチ診断のデータベースに登録されている漫画です。";
  const tags = (manga.tags || []).slice(0, 3).map((tag) => tagLabels[tag]).filter(Boolean);

  return (
    <article className="group relative min-h-[246px] overflow-hidden rounded-xl border border-black/10 bg-white/88 p-4 shadow-[0_14px_34px_rgba(10,10,10,0.035)] transition-shadow hover:shadow-[0_18px_40px_rgba(10,10,10,0.06)]">
      <a href={`/manga/${manga.id}`} className="absolute inset-0 z-0" aria-label={`${title}の詳細を見る`} />
      <div className="relative z-10 flex gap-4 pointer-events-none">
        <div className="relative shrink-0">
          <div className="absolute -left-2 -top-2 z-10 rounded-md bg-[#c0392b] px-2 py-1 text-xs font-black text-white">
            {String(index + 1).padStart(2, "0")}
          </div>
          <MangaCover
            title={title}
            mangaId={manga.id}
            author={manga.author}
            coverImageUrl={cover?.coverImageUrl}
            coverProductUrl={cover?.coverProductUrl}
            coverImageSource={cover?.coverImageSource}
            verified={cover?.coverImageVerified}
            size="medium"
            pageType={pageType}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-black leading-snug transition-colors group-hover:text-[#c0392b]" style={{ fontFamily: browseSerif }}>
              {title}
            </h2>
            <span className="shrink-0 text-black/45">♡</span>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] font-bold text-black/48">
            {manga.author} / {manga.year || "年不明"} / {statusLabel[manga.status] || manga.status || "不明"}
            {manga.volumes ? ` / ${manga.volumes}巻` : ""}
          </p>
          {matchScore > 0 && (
            <p className="mt-2 text-[11px] font-black text-[#c0392b]">プロフィール相性 +{matchScore}</p>
          )}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="rounded border border-black/8 bg-[#f3f0e9] px-2 py-1 text-[10px] font-bold text-black/58">{tag}</span>
              ))}
            </div>
          )}
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/68">{description}</p>
        </div>
      </div>
      <div className="relative z-20 mt-4 grid grid-cols-2 gap-2 pointer-events-auto">
        <WatchLaterButton item={manga} sourceContext="漫画一覧" compact className="justify-center" />
        <a href={`/manga/${manga.id}`} className="flex min-h-[34px] items-center justify-center rounded-md bg-[#0a0a0a] px-3 py-1.5 text-[11px] font-black text-[#fffdf9] transition hover:bg-[#c0392b]">
          詳しく見る
        </a>
      </div>
    </article>
  );
}

export default function ProfileAwareMangaGrid({ items, startIndex, pageType, sortMode = "default" }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BROWSE_PROFILE_STORAGE_KEY);
      const parsed = stored ? normalizeBrowseProfile(JSON.parse(stored)) : null;
      setProfile(parsed);
    } catch {
      setProfile(null);
    }
  }, []);

  const sortedItems = useMemo(() => {
    const mapped = items.map((manga, index) => ({
      manga,
      originalIndex: index,
      score: sortMode === "profile" && profile ? scoreManga(manga, profile) : 0,
    }));
    return [...mapped].sort((a, b) => compareBySortMode(a, b, sortMode));
  }, [items, profile, sortMode]);

  return (
    <div>
      {sortMode === "profile" && profile && (
        <div className="mt-5 rounded-xl border border-[#efc8c2] bg-[#fff6f4] px-4 py-3 text-sm font-bold text-[#c0392b]">
          好みプロフィールを漫画一覧だけに適用中です。診断結果には影響しません。
        </div>
      )}
      {sortMode === "profile" && !profile && (
        <div className="mt-5 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-bold text-black/62">
          あなた向け順を使うには、好みプロフィールを設定してください。
        </div>
      )}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sortedItems.map(({ manga, originalIndex, score }, displayIndex) => (
          <MangaCard key={`${manga.id}-${originalIndex}`} manga={manga} index={startIndex + displayIndex} pageType={pageType} matchScore={sortMode === "profile" ? score : 0} />
        ))}
      </div>
    </div>
  );
}
