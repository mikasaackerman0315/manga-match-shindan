import { NextResponse } from "next/server";

const RAKUTEN_BOOKS_ENDPOINT = "https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const TITLE_ALIASES = {
  "3月のライオン": ["三月のライオン", "3月のライオン 1"],
  "20世紀少年": ["20世紀少年 1"],
  "AKIRA": ["AKIRA 1", "アキラ"],
  "ARIA": ["ARIA 1", "ARIA 完全版"],
  "BLAME!": ["BLAME 1", "ブラム"],
  "SLAM DUNK": ["スラムダンク", "SLAM DUNK 1"],
  "DRAGON BALL": ["ドラゴンボール", "DRAGON BALL 1"],
  "ONE PIECE": ["ワンピース", "ONE PIECE 1"],
  "DEATH NOTE": ["デスノート", "DEATH NOTE 1"],
  "HUNTER×HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "HUNTER x HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "LIAR GAME": ["ライアーゲーム", "LIAR GAME 1"],
  "MONSTER": ["モンスター 浦沢直樹", "MONSTER 1"],
  "NANA": ["NANA 1"],
  "Q.E.D. 証明終了": ["QED 証明終了", "Q.E.D. 1"],
  "あしたのジョー": ["あしたのジョー 1"],
  "あひるの空": ["あひるの空 1"],
  "あまんちゅ!": ["あまんちゅ 1"],
  "うる星やつら": ["うる星やつら 1"],
  "おおきく振りかぶって": ["おおきく振りかぶって 1", "おお振り"],
  "からかい上手の高木さん": ["からかい上手の高木さん 1"],
  "きのう何食べた?": ["きのう何食べた", "きのう何食べた? 1"],
  "しろくまカフェ": ["しろくまカフェ 1"],
  "それでも町は廻っている": ["それでも町は廻っている 1", "それ町"],
  "ちはやふる": ["ちはやふる 1"],
  "とんがり帽子のアトリエ": ["とんがり帽子のアトリエ 1"],
  "のんのんびより": ["のんのんびより 1"],
  "ばらかもん": ["ばらかもん 1"],
  "ふらいんぐうぃっち": ["ふらいんぐうぃっち 1"],
  "めぞん一刻": ["めぞん一刻 1"],
  "よつばと!": ["よつばと", "よつばと! 1"],
  "アイアムアヒーロー": ["アイアムアヒーロー 1"],
  "アオアシ": ["アオアシ 1"],
  "アオハライド": ["アオハライド 1"],
  "スキップとローファー": ["スキップとローファー 1"],
  "スケッチブック": ["スケッチブック 1"],
  "ダイヤのA": ["ダイヤのエース", "ダイヤのA 1"],
  "ダンジョン飯": ["ダンジョン飯 1"],
  "チェンソーマン": ["チェンソーマン 1"],
  "デビルマン": ["デビルマン 1"],
  "ドラゴンボール": ["ドラゴンボール 1"],
  "ドラゴン桜": ["ドラゴン桜 1"],
  "ハイキュー!!": ["ハイキュー", "ハイキュー!! 1"],
  "ハコヅメ": ["ハコヅメ 1"],
  "ハチミツとクローバー": ["ハチミツとクローバー 1"],
  "バクマン。": ["バクマン", "バクマン。 1"],
  "ピンポン": ["ピンポン 松本大洋", "ピンポン 1"],
  "フルーツバスケット": ["フルーツバスケット 1"],
  "ブルーロック": ["ブルーロック 1"],
  "プラネテス": ["プラネテス 1"],
  "ベルサイユのばら": ["ベルサイユのばら 1"],
  "ベルセルク": ["ベルセルク 1"],
  "マギ": ["マギ 1"],
  "ミステリと言う勿れ": ["ミステリと言う勿れ 1", "ミステリという勿れ"],
  "メイドインアビス": ["メイドインアビス 1"],
  "七つの大罪": ["七つの大罪 1"],
  "乙嫁語り": ["乙嫁語り 1"],
  "俺物語!!": ["俺物語", "俺物語!! 1"],
  "僕等がいた": ["僕等がいた 1"],
  "北斗の拳": ["北斗の拳 1"],
  "医龍": ["医龍 1"],
  "名探偵コナン": ["名探偵コナン 1"],
  "君に届け": ["君に届け 1"],
  "嘘喰い": ["嘘喰い 1"],
  "夏目友人帳": ["夏目友人帳 1"],
  "宇宙兄弟": ["宇宙兄弟 1"],
  "宝石の国": ["宝石の国 1"],
  "寄生獣": ["寄生獣 1"],
  "左ききのエレン": ["左ききのエレン 1"],
  "弱虫ペダル": ["弱虫ペダル 1"],
  "彼方のアストラ": ["彼方のアストラ 1"],
  "恋は雨上がりのように": ["恋は雨上がりのように 1"],
  "攻殻機動隊": ["攻殻機動隊 1"],
  "日常": ["日常 1 あらゐけいいち"],
  "東京喰種トーキョーグール": ["東京喰種", "東京喰種 1", "トーキョーグール"],
  "横浜買い出し紀行": ["横浜買い出し紀行 1"],
  "漂流教室": ["漂流教室 1"],
  "火の鳥": ["火の鳥 1 手塚治虫"],
  "王様の仕立て屋": ["王様の仕立て屋 1"],
  "町田くんの世界": ["町田くんの世界 1"],
  "神の雫": ["神の雫 1"],
  "約束のネバーランド": ["約束のネバーランド 1"],
  "花より男子": ["花より男子 1"],
  "葬送のフリーレン": ["葬送のフリーレン 1"],
  "血の轍": ["血の轍 1"],
  "親愛なる僕へ殺意をこめて": ["親愛なる僕へ殺意をこめて 1"],
  "転生したらスライムだった件": ["転生したらスライムだった件 1"],
  "重版出来!": ["重版出来", "重版出来! 1"],
  "金田一少年の事件簿": ["金田一少年の事件簿 1"],
  "銃夢": ["銃夢 1"],
  "銀の匙": ["銀の匙 1"],
  "魔法使いの嫁": ["魔法使いの嫁 1"],
  "黒子のバスケ": ["黒子のバスケ 1"],
};

function getSearchTitles(title) {
  return Array.from(new Set([
    title,
    ...(TITLE_ALIASES[title] || []),
    `${title} 1`,
    `${title} 1巻`,
    `${title} 漫画`,
  ].filter(Boolean)));
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

  const baseTitle = title.replace(/\s+(?:1|１|01|０１|1巻|１巻|漫画)$/u, "");
  let score = 0;
  if (itemTitle.includes(title)) score += 3;
  if (baseTitle && itemTitle.includes(baseTitle)) score += 4;
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
