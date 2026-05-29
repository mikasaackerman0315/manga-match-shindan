import { NextResponse } from "next/server";

const RAKUTEN_BOOKS_ENDPOINT = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const TITLE_ALIASES = {
  "SLAM DUNK": ["スラムダンク", "SLAM DUNK 1"],
  "DRAGON BALL": ["ドラゴンボール", "DRAGON BALL 1"],
  "ONE PIECE": ["ワンピース", "ONE PIECE 1"],
  "DEATH NOTE": ["デスノート", "DEATH NOTE 1"],
  "HUNTER×HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "HUNTER x HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "NANA": ["NANA 1"],
  "AKIRA": ["AKIRA 1"],
  "ARIA": ["ARIA 1"],
};

function getSearchTitles(title) {
  return [title, ...(TITLE_ALIASES[title] || [])].filter(Boolean);
}

function getCoverImage(item) {
  return item?.largeImageUrl || item?.mediumImageUrl || item?.smallImageUrl || null;
}

function normalizeItems(data) {
  return (data?.Items || data?.items || []).map((entry) => entry?.Item || entry?.item || entry).filter(Boolean);
}

function scoreVolumeOne(item, title) {
  const itemTitle = `${item?.title || ""} ${item?.subTitle || ""}`.trim();
  if (!itemTitle || !getCoverImage(item)) return -1;

  let score = 0;
  if (itemTitle.includes(title)) score += 3;
  if (/(^|[^0-9０-９])(?:1|１|01|０１)(?:巻|集|$|[^0-9０-９])/.test(itemTitle)) score += 8;
  if (/第(?:1|１)巻/.test(itemTitle)) score += 8;
  if (/全巻|セット|BOX|ボックス|公式|ファンブック|小説|ノベライズ|映画|劇場版|アニメ|DVD|Blu-ray/i.test(itemTitle)) score -= 8;
  return score;
}

async function searchRakutenBooks({ queryTitle, applicationId, accessKey, affiliateId }) {
  const apiUrl = new URL(RAKUTEN_BOOKS_ENDPOINT);
  apiUrl.searchParams.set("applicationId", applicationId);
  apiUrl.searchParams.set("accessKey", accessKey);
  if (affiliateId) {
    apiUrl.searchParams.set("affiliateId", affiliateId);
  }
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("formatVersion", "2");
  apiUrl.searchParams.set("title", queryTitle);
  apiUrl.searchParams.set("size", "9");
  apiUrl.searchParams.set("hits", "10");
  apiUrl.searchParams.set("sort", "standard");

  const response = await fetch(apiUrl, {
    headers: {
      Origin: (process.env.SITE_URL || "https://www.mangamatchquiz.com/").replace(/\/$/, ""),
      Referer: process.env.SITE_URL || "https://www.mangamatchquiz.com/",
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return normalizeItems(data);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const applicationId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  if (!title || !applicationId || !accessKey) {
    return NextResponse.json({ imageUrl: null, itemUrl: null });
  }

  try {
    const searchTitles = getSearchTitles(title);
    let item = null;

    for (const queryTitle of searchTitles) {
      const items = await searchRakutenBooks({ queryTitle, applicationId, accessKey, affiliateId });
      const rankedItems = [...items].sort((a, b) => scoreVolumeOne(b, queryTitle) - scoreVolumeOne(a, queryTitle));
      item = rankedItems.find((candidate) => scoreVolumeOne(candidate, queryTitle) > 0) || items.find((candidate) => getCoverImage(candidate));
      if (item) break;
    }

    const imageUrl = getCoverImage(item);
    const itemUrl = item?.affiliateUrl || item?.itemUrl || null;

    return NextResponse.json(
      { imageUrl, itemUrl },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch {
    return NextResponse.json({ imageUrl: null, itemUrl: null }, { status: 200 });
  }
}
