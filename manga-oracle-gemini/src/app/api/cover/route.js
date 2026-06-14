import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { CORE_DB as CORE_DB_BASE } from "@/data/coreDB";
import { CORE_DB_EXTRA } from "@/data/coreDB_extra";
import { CORE_DB_EXTRA2 } from "@/data/coreDB_extra2";
import { CORE_DB_EXTRA3 } from "@/data/coreDB_extra3";
import { CORE_DB_EXTRA4 } from "@/data/coreDB_extra4";
import { CORE_DB_EXTRA5 } from "@/data/coreDB_extra5";
import { COVER_OVERRIDES } from "@/data/coverOverrides.generated";
import { BOOKLIVE_COVER_OVERRIDES } from "@/data/bookliveCoverOverrides";

const RAKUTEN_BOOKS_ENDPOINT = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";
const GOOGLE_BOOKS_ENDPOINT = "https://www.googleapis.com/books/v1/volumes";
const JIKAN_MANGA_ENDPOINT = "https://api.jikan.moe/v4/manga";
const AMAZON_PAAPI_ENDPOINT = "https://webservices.amazon.co.jp/paapi5/searchitems";
const AMAZON_PAAPI_HOST = "webservices.amazon.co.jp";
const AMAZON_PAAPI_REGION = "us-west-2";
const AMAZON_PAAPI_SERVICE = "ProductAdvertisingAPI";
const CORE_DB = [...CORE_DB_BASE, ...CORE_DB_EXTRA, ...CORE_DB_EXTRA2, ...CORE_DB_EXTRA3, ...CORE_DB_EXTRA4, ...CORE_DB_EXTRA5];
const TITLE_ALIASES = {
  "3月のライオン": ["三月のライオン", "3月のライオン 1"],
  "20世紀少年": ["20世紀少年 1"],
  "A Silent Voice": ["聲の形", "聲の形 1"],
  "AKIRA": ["AKIRA 1", "アキラ"],
  "Alice in Borderland": ["今際の国のアリス", "今際の国のアリス 1"],
  "ARIA": ["ARIA 1", "ARIA 完全版"],
  "Assassination Classroom": ["暗殺教室", "暗殺教室 1"],
  "Attack on Titan": ["進撃の巨人", "進撃の巨人 1"],
  "Bakuman": ["バクマン。", "バクマン 1"],
  "Banana Fish": ["BANANA FISH", "BANANA FISH 1"],
  "Beastars": ["BEASTARS", "BEASTARS 1"],
  "Black Butler": ["黒執事", "黒執事 1"],
  "Black Clover": ["ブラッククローバー", "ブラッククローバー 1"],
  "Black Jack": ["ブラック・ジャック", "ブラックジャック 1"],
  "BLAME!": ["BLAME 1", "ブラム"],
  "Bleach": ["BLEACH", "ブリーチ", "BLEACH 1"],
  "Blue Exorcist": ["青の祓魔師", "青の祓魔師 1"],
  "Blue Giant": ["BLUE GIANT", "BLUE GIANT 1"],
  "Blue Lock": ["ブルーロック", "ブルーロック 1"],
  "Bocchi the Rock!": ["ぼっち・ざ・ろっく!", "ぼっち・ざ・ろっく 1"],
  "Boys Over Flowers": ["花より男子", "花より男子 1"],
  "Call of the Night": ["よふかしのうた", "よふかしのうた 1"],
  "Case Closed": ["名探偵コナン", "名探偵コナン 1"],
  "Chainsaw Man": ["チェンソーマン", "チェンソーマン 1"],
  "DEATH NOTE": ["デスノート", "DEATH NOTE 1"],
  "Delicious in Dungeon": ["ダンジョン飯", "ダンジョン飯 1"],
  "Demon Slayer": ["鬼滅の刃", "鬼滅の刃 1"],
  "Dorohedoro": ["ドロヘドロ", "ドロヘドロ 1"],
  "Dragon Ball": ["ドラゴンボール", "DRAGON BALL 1"],
  "DRAGON BALL": ["ドラゴンボール", "DRAGON BALL 1"],
  "Dr. Stone": ["Dr.STONE", "ドクターストーン", "Dr.STONE 1"],
  "Erased": ["僕だけがいない街", "僕だけがいない街 1"],
  "Eyeshield 21": ["アイシールド21", "アイシールド21 1"],
  "Fire Force": ["炎炎ノ消防隊", "炎炎ノ消防隊 1"],
  "Food Wars!": ["食戟のソーマ", "食戟のソーマ 1"],
  "Frieren": ["葬送のフリーレン", "葬送のフリーレン 1"],
  "Fullmetal Alchemist": ["鋼の錬金術師", "鋼の錬金術師 1"],
  "Gantz": ["GANTZ", "GANTZ 1"],
  "Golden Kamuy": ["ゴールデンカムイ", "ゴールデンカムイ 1"],
  "Haikyu!!": ["ハイキュー!!", "ハイキュー", "ハイキュー!! 1"],
  "Hell's Paradise": ["地獄楽", "地獄楽 1"],
  "HUNTER×HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "HUNTER x HUNTER": ["ハンターハンター", "HUNTER HUNTER 1"],
  "Hunter x Hunter": ["HUNTER×HUNTER", "ハンターハンター", "HUNTER×HUNTER 1"],
  "I Am a Hero": ["アイアムアヒーロー", "アイアムアヒーロー 1"],
  "Initial D": ["頭文字D", "頭文字D 1"],
  "Inuyasha": ["犬夜叉", "犬夜叉 1"],
  "Jujutsu Kaisen": ["呪術廻戦", "呪術廻戦 1"],
  "Kaiju No. 8": ["怪獣8号", "怪獣8号 1"],
  "Kaguya-sama": ["かぐや様は告らせたい", "かぐや様は告らせたい 1"],
  "Kingdom": ["キングダム", "キングダム 1"],
  "Komi Can't Communicate": ["古見さんは、コミュ症です。", "古見さんはコミュ症です 1"],
  "Kuroko's Basketball": ["黒子のバスケ", "黒子のバスケ 1"],
  "LIAR GAME": ["ライアーゲーム", "LIAR GAME 1"],
  "Made in Abyss": ["メイドインアビス", "メイドインアビス 1"],
  "March Comes in Like a Lion": ["3月のライオン", "3月のライオン 1"],
  "Mashle": ["マッシュル", "マッシュル 1"],
  "Mob Psycho 100": ["モブサイコ100", "モブサイコ100 1"],
  "MONSTER": ["モンスター 浦沢直樹", "MONSTER 1"],
  "My Dress-Up Darling": ["その着せ替え人形は恋をする", "その着せ替え人形は恋をする 1"],
  "My Hero Academia": ["僕のヒーローアカデミア", "ヒロアカ", "僕のヒーローアカデミア 1"],
  "NANA": ["NANA 1"],
  "Naruto": ["NARUTO", "ナルト", "NARUTO 1"],
  "Nausicaa": ["風の谷のナウシカ", "風の谷のナウシカ 1"],
  "Noragami": ["ノラガミ", "ノラガミ 1"],
  "One Punch Man": ["ワンパンマン", "ワンパンマン 1"],
  "ONE PIECE": ["ワンピース", "ONE PIECE 1"],
  "One Piece": ["ワンピース", "ONE PIECE 1"],
  "Oshi no Ko": ["推しの子", "【推しの子】", "推しの子 1"],
  "Pluto": ["PLUTO", "PLUTO 1"],
  "Q.E.D. 証明終了": ["QED 証明終了", "Q.E.D. 1"],
  "Ranking of Kings": ["王様ランキング", "王様ランキング 1"],
  "Real": ["リアル 井上雄彦", "リアル 1"],
  "Sailor Moon": ["美少女戦士セーラームーン", "セーラームーン 1"],
  "Sakamoto Days": ["SAKAMOTO DAYS", "SAKAMOTO DAYS 1"],
  "Silver Spoon": ["銀の匙", "銀の匙 1"],
  "Skip and Loafer": ["スキップとローファー", "スキップとローファー 1"],
  "SLAM DUNK": ["スラムダンク", "SLAM DUNK 1"],
  "Slam Dunk": ["スラムダンク", "SLAM DUNK 1"],
  "Solo Leveling": ["俺だけレベルアップな件", "俺だけレベルアップな件 1"],
  "Soul Eater": ["ソウルイーター", "ソウルイーター 1"],
  "Spy x Family": ["SPY×FAMILY", "SPY FAMILY", "SPY×FAMILY 1"],
  "The Apothecary Diaries": ["薬屋のひとりごと", "薬屋のひとりごと 1"],
  "The Fable": ["ザ・ファブル", "ザ・ファブル 1"],
  "The Promised Neverland": ["約束のネバーランド", "約束のネバーランド 1"],
  "Tokyo Ghoul": ["東京喰種", "東京喰種 1", "トーキョーグール"],
  "Tokyo Revengers": ["東京卍リベンジャーズ", "東京リベンジャーズ", "東京卍リベンジャーズ 1"],
  "Toriko": ["トリコ", "トリコ 1"],
  "Uzumaki": ["うずまき 伊藤潤二", "うずまき 1"],
  "Vagabond": ["バガボンド", "バガボンド 1"],
  "Vinland Saga": ["ヴィンランド・サガ", "ヴィンランドサガ", "ヴィンランド・サガ 1"],
  "Witch Hat Atelier": ["とんがり帽子のアトリエ", "とんがり帽子のアトリエ 1"],
  "World Trigger": ["ワールドトリガー", "ワールドトリガー 1"],
  "Yona of the Dawn": ["暁のヨナ", "暁のヨナ 1"],
  "Yu Yu Hakusho": ["幽遊白書", "幽遊白書 1"],
  "86": ["86 エイティシックス", "86 1"],
  "7 Seeds": ["7SEEDS", "7SEEDS 1"],
  "あしたのジョー": ["あしたのジョー 1"],
  "あせとせっけん": ["あせとせっけん 1"],
  "あひるの空": ["あひるの空 1"],
  "あまんちゅ!": ["あまんちゅ 1"],
  "あまつき": ["あまつき 1"],
  "うしおととら": ["うしおととら 1"],
  "うる星やつら": ["うる星やつら 1"],
  "おおきく振りかぶって": ["おおきく振りかぶって 1", "おお振り"],
  "おやすみプンプン": ["おやすみプンプン 1"],
  "かくかくしかじか": ["かくかくしかじか 1"],
  "かげきしょうじょ!!": ["かげきしょうじょ", "かげきしょうじょ!! 1"],
  "かぐや様は告らせたい": ["かぐや様は告らせたい 1"],
  "からくりサーカス": ["からくりサーカス 1"],
  "からかい上手の高木さん": ["からかい上手の高木さん 1"],
  "がっこうぐらし!": ["がっこうぐらし", "がっこうぐらし! 1"],
  "きのう何食べた?": ["きのう何食べた", "きのう何食べた? 1"],
  "ぐらんぶる": ["ぐらんぶる 1"],
  "けいおん!": ["けいおん", "けいおん! 1"],
  "ここは今から倫理です。": ["ここは今から倫理です", "ここは今から倫理です。 1"],
  "この音とまれ!": ["この音とまれ", "この音とまれ! 1"],
  "さよなら絶望先生": ["さよなら絶望先生 1"],
  "しろくまカフェ": ["しろくまカフェ 1"],
  "その着せ替え人形は恋をする": ["その着せ替え人形は恋をする 1", "着せ恋"],
  "それでも町は廻っている": ["それでも町は廻っている 1", "それ町"],
  "だがしかし": ["だがしかし 1"],
  "ちはやふる": ["ちはやふる 1"],
  "ちひろさん": ["ちひろさん 1"],
  "とんがり帽子のアトリエ": ["とんがり帽子のアトリエ 1"],
  "のんのんびより": ["のんのんびより 1"],
  "ばらかもん": ["ばらかもん 1"],
  "ひだまりスケッチ": ["ひだまりスケッチ 1"],
  "ひらやすみ": ["ひらやすみ 1"],
  "ふらいんぐうぃっち": ["ふらいんぐうぃっち 1"],
  "ぼっち・ざ・ろっく!": ["ぼっち・ざ・ろっく", "ぼっち・ざ・ろっく! 1"],
  "ましろのおと": ["ましろのおと 1"],
  "めぞん一刻": ["めぞん一刻 1"],
  "やがて君になる": ["やがて君になる 1"],
  "ゆるキャン△": ["ゆるキャン", "ゆるキャン△ 1"],
  "らき☆すた": ["らきすた", "らき☆すた 1"],
  "よつばと!": ["よつばと", "よつばと! 1"],
  "アイシールド21": ["アイシールド21 1"],
  "アイアムアヒーロー": ["アイアムアヒーロー 1"],
  "アオアシ": ["アオアシ 1"],
  "アオハライド": ["アオハライド 1"],
  "アクタージュ": ["アクタージュ 1"],
  "アサシン クリード": ["アサシンクリード"],
  "アドルフに告ぐ": ["アドルフに告ぐ 1"],
  "アフロ田中": ["アフロ田中 1"],
  "アルスラーン戦記": ["アルスラーン戦記 1"],
  "イエスタデイをうたって": ["イエスタデイをうたって 1"],
  "イムリ": ["イムリ 1"],
  "インベスターZ": ["インベスターZ 1"],
  "ヴィンランド・サガ": ["ヴィンランドサガ", "ヴィンランド・サガ 1"],
  "エマ": ["エマ 森薫", "エマ 1"],
  "エンジェル・ハート": ["エンジェルハート", "エンジェル・ハート 1"],
  "オッドタクシー": ["オッドタクシー 1"],
  "カイジ": ["賭博黙示録カイジ", "カイジ 1"],
  "カノジョは嘘を愛しすぎてる": ["カノジョは嘘を愛しすぎてる 1"],
  "カラオケ行こ!": ["カラオケ行こ", "カラオケ行こ!"],
  "ガラスの仮面": ["ガラスの仮面 1"],
  "ガンニバル": ["ガンニバル 1"],
  "キーチ!!": ["キーチ", "キーチ!! 1"],
  "キングダム": ["キングダム 1"],
  "クレイモア": ["CLAYMORE", "クレイモア 1"],
  "クロサギ": ["クロサギ 1"],
  "ゲゲゲの鬼太郎": ["ゲゲゲの鬼太郎 1"],
  "ゴールデンカムイ": ["ゴールデンカムイ 1"],
  "スキップとローファー": ["スキップとローファー 1"],
  "スケッチブック": ["スケッチブック 1"],
  "スパイファミリー": ["SPY×FAMILY", "SPY FAMILY", "SPY×FAMILY 1"],
  "ソウルイーター": ["ソウルイーター 1"],
  "ダイヤのA": ["ダイヤのエース", "ダイヤのA 1"],
  "ダンジョン飯": ["ダンジョン飯 1"],
  "チェンソーマン": ["チェンソーマン 1"],
  "チ。": ["チ。地球の運動について", "チ 1"],
  "デビルマン": ["デビルマン 1"],
  "デッドデッドデーモンズデデデデデストラクション": ["デデデデ", "デッドデッドデーモンズデデデデデストラクション 1"],
  "ドクターストーン": ["Dr.STONE", "Dr.STONE 1"],
  "ドリフターズ": ["ドリフターズ 1"],
  "ドラゴンボール": ["ドラゴンボール 1"],
  "ドラゴン桜": ["ドラゴン桜 1"],
  "ドロヘドロ": ["ドロヘドロ 1"],
  "ハイキュー": ["ハイキュー!!", "ハイキュー!! 1"],
  "ハイキュー!!": ["ハイキュー", "ハイキュー!! 1"],
  "ハコヅメ": ["ハコヅメ 1"],
  "ハチミツとクローバー": ["ハチミツとクローバー 1"],
  "バクマン。": ["バクマン", "バクマン。 1"],
  "バガボンド": ["バガボンド 1"],
  "バトル・ロワイアル": ["バトルロワイアル", "バトル・ロワイアル 1"],
  "パリピ孔明": ["パリピ孔明 1"],
  "ヒカルの碁": ["ヒカルの碁 1"],
  "ピンポン": ["ピンポン 松本大洋", "ピンポン 1"],
  "ファブル": ["ザ・ファブル", "ザ・ファブル 1"],
  "ブルーピリオド": ["ブルーピリオド 1"],
  "フルーツバスケット": ["フルーツバスケット 1"],
  "ブルーロック": ["ブルーロック 1"],
  "プラネテス": ["プラネテス 1"],
  "ヘルシング": ["HELLSING", "ヘルシング 1"],
  "ベルサイユのばら": ["ベルサイユのばら 1"],
  "ベルセルク": ["ベルセルク 1"],
  "ホリミヤ": ["ホリミヤ 1"],
  "マギ": ["マギ 1"],
  "マッシュル": ["マッシュル 1"],
  "ミステリと言う勿れ": ["ミステリと言う勿れ 1", "ミステリという勿れ"],
  "ミスミソウ": ["ミスミソウ 1"],
  "メイドインアビス": ["メイドインアビス 1"],
  "モブサイコ100": ["モブサイコ100 1"],
  "ライアーゲーム": ["LIAR GAME", "ライアーゲーム 1"],
  "リアル": ["リアル 井上雄彦", "リアル 1"],
  "ワールドトリガー": ["ワールドトリガー 1"],
  "ワンパンマン": ["ワンパンマン 1"],
  "ワンピース": ["ONE PIECE", "ONE PIECE 1"],
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

function normalizeTitleKey(title) {
  return (title || "").toLowerCase().replace(/[！!？?。・･\s:：'’"“”\-‐‑‒–—―_]/g, "");
}

function getCoverOverride(id, title) {
  if (id && COVER_OVERRIDES[id]?.coverUrl) return COVER_OVERRIDES[id];

  const normalizedTitle = normalizeTitleKey(title);
  if (!normalizedTitle) return null;

  return Object.values(COVER_OVERRIDES).find((entry) => {
    if (!entry?.coverUrl) return false;
    return normalizeTitleKey(entry.title_ja) === normalizedTitle || normalizeTitleKey(entry.title_en) === normalizedTitle;
  }) || null;
}

function getBookliveCoverOverride(id, title) {
  if (id && BOOKLIVE_COVER_OVERRIDES[id]?.coverUrl) return BOOKLIVE_COVER_OVERRIDES[id];

  const normalizedTitle = normalizeTitleKey(title);
  if (!normalizedTitle) return null;

  return Object.values(BOOKLIVE_COVER_OVERRIDES).find((entry) => {
    if (!entry?.coverUrl) return false;
    return normalizeTitleKey(entry.title_ja) === normalizedTitle || normalizeTitleKey(entry.title_en) === normalizedTitle;
  }) || null;
}

function getDatabaseAliases(title, id, author) {
  const normalizedTitle = normalizeTitleKey(title);
  const match = CORE_DB.find((entry) => entry.id === id) || CORE_DB.find((entry) => {
    const titleJa = normalizeTitleKey(entry.title_ja);
    const titleEn = normalizeTitleKey(entry.title_en);
    return (
      titleJa === normalizedTitle ||
      titleEn === normalizedTitle ||
      (normalizedTitle.length >= 5 && (titleJa.includes(normalizedTitle) || titleEn.includes(normalizedTitle))) ||
      (titleJa.length >= 5 && normalizedTitle.includes(titleJa)) ||
      (titleEn.length >= 5 && normalizedTitle.includes(titleEn))
    );
  });

  if (!match) return [];

  return [
    match.title_ja && `${match.title_ja} 1巻`,
    match.title_ja && `${match.title_ja} 1`,
    match.title_en && `${match.title_en} 1巻`,
    match.title_en && `${match.title_en} 1`,
    match.title_ja,
    match.title_en,
    match.title_ja && `${match.title_ja} ${match.author}`,
    match.title_en && `${match.title_en} ${match.author}`,
    author && `${match.title_ja} ${author}`,
  ].filter(Boolean);
}

function getSearchTitles(title, id, author) {
  const compactTitle = title.replace(/[【】\[\]（）()]/g, "").trim();
  const withVolumeOne = (value) => {
    if (!value) return [];
    return /(?:^|\s)(?:1|１|01|０１)(?:巻)?$/u.test(value) ? [value] : [`${value} 1巻`, value];
  };

  return Array.from(new Set([
    `${title} 1巻`,
    `${title} 1`,
    compactTitle && `${compactTitle} 1巻`,
    compactTitle && `${compactTitle} 1`,
    ...(TITLE_ALIASES[title] || []).flatMap(withVolumeOne),
    ...(TITLE_ALIASES[compactTitle] || []).flatMap(withVolumeOne),
    ...getDatabaseAliases(title, id, author),
    ...getDatabaseAliases(compactTitle, id, author),
    title,
    compactTitle,
    author && `${title} ${author}`,
    author && `${compactTitle} ${author}`,
    `${title} 漫画`,
    `${compactTitle} 漫画`,
  ].filter(Boolean)));
}

function getCoverImage(item) {
  return item?.largeImageUrl || item?.mediumImageUrl || item?.smallImageUrl || null;
}

function getJikanCoverImage(item) {
  return item?.images?.jpg?.large_image_url || item?.images?.jpg?.image_url || item?.images?.webp?.large_image_url || item?.images?.webp?.image_url || null;
}

function getJikanTitles(item) {
  return [
    item?.title,
    item?.title_english,
    item?.title_japanese,
    ...(item?.titles || []).map((entry) => entry?.title),
  ].filter(Boolean);
}

function getGoogleCoverImage(item) {
  const links = item?.volumeInfo?.imageLinks || {};
  const imageUrl = links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail || null;
  return imageUrl ? imageUrl.replace(/^http:\/\//, "https://") : null;
}

function getGoogleTitle(item) {
  return `${item?.volumeInfo?.title || ""} ${item?.volumeInfo?.subtitle || ""}`.trim();
}

function getJikanSearchTitles(title, id) {
  const compactTitle = title.replace(/[【】\[\]（）()]/g, "").trim();
  const normalizedTitle = normalizeTitleKey(title);
  const match = CORE_DB.find((entry) => entry.id === id) || CORE_DB.find((entry) => {
    const titleJa = normalizeTitleKey(entry.title_ja);
    const titleEn = normalizeTitleKey(entry.title_en);
    return titleJa === normalizedTitle || titleEn === normalizedTitle;
  });

  return Array.from(new Set([
    title,
    compactTitle,
    match?.title_en,
    match?.title_ja,
    ...(TITLE_ALIASES[title] || []).map((alias) => alias.replace(/\s+(?:1|１|01|０１|1巻|１巻)$/u, "")),
    ...(TITLE_ALIASES[compactTitle] || []).map((alias) => alias.replace(/\s+(?:1|１|01|０１|1巻|１巻)$/u, "")),
  ].filter(Boolean)));
}

function normalizeItems(data) {
  return (data?.Items || data?.items || []).map((entry) => entry?.Item || entry?.item || entry).filter(Boolean);
}

function scoreVolumeOne(item, title) {
  const itemTitle = `${item?.title || ""} ${item?.subTitle || ""}`.trim();
  if (!itemTitle || !getCoverImage(item)) return -1;

  const baseTitle = title.replace(/\s+(?:1|１|01|０１|1巻|１巻|漫画)$/u, "");
  const normalizedBaseTitle = normalizeTitleKey(baseTitle || title);
  const normalizedItemTitle = normalizeTitleKey(itemTitle);
  let score = 0;
  if (normalizedBaseTitle && normalizedItemTitle.startsWith(normalizedBaseTitle)) score += 12;
  else if (normalizedBaseTitle && normalizedItemTitle.includes(normalizedBaseTitle)) score += 7;
  if (itemTitle.includes(title)) score += 3;
  if (baseTitle && itemTitle.includes(baseTitle)) score += 4;
  if (/(^|[^0-9０-９])(?:1|１|01|０１)(?:巻|集|$|[^0-9０-９])/.test(itemTitle)) score += 8;
  if (/第(?:1|１)巻/.test(itemTitle)) score += 8;
  if (/(^|[^0-9０-９])(?:[2-9２-９]|1[0-9]|[２-９][０-９])(?:巻|集|$|[^0-9０-９])/.test(itemTitle)) score -= 10;
  if (normalizedBaseTitle && normalizedItemTitle.startsWith(normalizedBaseTitle) && normalizedItemTitle.length > normalizedBaseTitle.length + 8) score -= 5;
  if (/外伝|スピンオフ|全巻|セット|BOX|ボックス|公式|ガイド|ファンブック|小説|ノベライズ|映画|劇場版|アニメ|DVD|Blu-ray/i.test(itemTitle)) score -= 18;
  if (/特装版|限定版|画集|設定資料|キャラクターブック/i.test(itemTitle)) score -= 10;
  return score;
}

function scoreGoogleBook(item, title) {
  const itemTitle = getGoogleTitle(item);
  const imageUrl = getGoogleCoverImage(item);
  if (!itemTitle || !imageUrl) return -1;

  const baseTitle = title.replace(/\s+(?:1|１|01|０１|1巻|１巻|漫画)$/u, "");
  const normalizedBaseTitle = normalizeTitleKey(baseTitle || title);
  const normalizedItemTitle = normalizeTitleKey(itemTitle);
  let score = 0;

  if (normalizedBaseTitle && normalizedItemTitle.startsWith(normalizedBaseTitle)) score += 14;
  else if (normalizedBaseTitle && normalizedItemTitle.includes(normalizedBaseTitle)) score += 8;
  if (/(^|[^0-9０-９])(?:1|１|01|０１)(?:巻|集|$|[^0-9０-９])/.test(itemTitle)) score += 7;
  if (/第(?:1|１)巻/.test(itemTitle)) score += 7;
  if (item?.volumeInfo?.industryIdentifiers?.some((id) => id.type === "ISBN_13")) score += 2;
  if (/comics?|manga|コミック|漫画/i.test(`${item?.volumeInfo?.categories || ""} ${itemTitle}`)) score += 2;
  if (/(^|[^0-9０-９])(?:[2-9２-９]|1[0-9]|[２-９][０-９])(?:巻|集|$|[^0-9０-９])/.test(itemTitle)) score -= 8;
  if (/外伝|スピンオフ|全巻|セット|BOX|ボックス|公式|ガイド|ファンブック|小説|ノベライズ|映画|劇場版|アニメ|DVD|Blu-ray|特装版|限定版|画集|設定資料|キャラクターブック/i.test(itemTitle)) score -= 12;
  return score;
}

function scoreJikanManga(item, title) {
  const imageUrl = getJikanCoverImage(item);
  if (!imageUrl) return -1;

  const normalizedTitle = normalizeTitleKey(title);
  const normalizedItemTitles = getJikanTitles(item).map(normalizeTitleKey).filter(Boolean);
  let score = 0;

  if (normalizedItemTitles.some((candidate) => candidate === normalizedTitle)) score += 20;
  else if (normalizedItemTitles.some((candidate) => candidate.startsWith(normalizedTitle) || normalizedTitle.startsWith(candidate))) score += 12;
  else if (normalizedItemTitles.some((candidate) => candidate.includes(normalizedTitle) || normalizedTitle.includes(candidate))) score += 8;

  const text = `${getJikanTitles(item).join(" ")} ${item?.type || ""}`;
  if (/Manga/i.test(item?.type || "")) score += 3;
  if (/novel|light novel|spin-off|side story|外伝|小説|スピンオフ/i.test(text)) score -= 14;
  return score;
}

function hashHex(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding);
}

function getAmazonSigningKey(secretKey, dateStamp) {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, AMAZON_PAAPI_REGION);
  const kService = hmac(kRegion, AMAZON_PAAPI_SERVICE);
  return hmac(kService, "aws4_request");
}

function amazonTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function getAmazonImage(item) {
  return item?.Images?.Primary?.Large?.URL || item?.Images?.Primary?.Medium?.URL || item?.Images?.Primary?.Small?.URL || null;
}

function getAmazonTitle(item) {
  return item?.ItemInfo?.Title?.DisplayValue || "";
}

function scoreAmazonItem(item, title) {
  const itemTitle = getAmazonTitle(item);
  const imageUrl = getAmazonImage(item);
  if (!itemTitle || !imageUrl) return -1;

  const normalizedTitle = normalizeTitleKey(title);
  const normalizedItemTitle = normalizeTitleKey(itemTitle);
  let score = 0;
  if (normalizedTitle && normalizedItemTitle.includes(normalizedTitle)) score += 8;
  if (/[（(]\s*(?:0?1|一)\s*[）)]/.test(itemTitle)) score += 8;
  if (/(?:^|[^0-9])(?:1|１)\s*(?:巻|巻目)?(?:$|[^0-9])/.test(itemTitle)) score += 7;
  if (/コミック|漫画|ジャンプ|マガジン|サンデー|ヤング|モーニング|KC|ジャンプコミックス/i.test(itemTitle)) score += 2;
  if (/全巻|セット|BOX|小説|ライトノベル|公式ガイド|ファンブック|画集|特装版|限定版|DVD|Blu-ray|アニメ/i.test(itemTitle)) score -= 10;
  return score;
}

async function searchAmazonPaapi({ queryTitle, accessKey, secretKey, partnerTag }) {
  if (!accessKey || !secretKey || !partnerTag) return [];

  const body = JSON.stringify({
    Keywords: queryTitle,
    SearchIndex: "Books",
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.co.jp",
    ItemCount: 10,
    Resources: [
      "Images.Primary.Small",
      "Images.Primary.Medium",
      "Images.Primary.Large",
      "ItemInfo.Title",
      "ItemInfo.ByLineInfo",
    ],
  });

  const now = amazonTimestamp();
  const dateStamp = now.slice(0, 8);
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const headers = {
    "content-encoding": "amz-1.0",
    "content-type": "application/json; charset=utf-8",
    host: AMAZON_PAAPI_HOST,
    "x-amz-date": now,
    "x-amz-target": target,
  };
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const canonicalHeaders = signedHeaders.split(";").map((key) => `${key}:${headers[key]}`).join("\n") + "\n";
  const canonicalRequest = ["POST", "/paapi5/searchitems", "", canonicalHeaders, signedHeaders, hashHex(body)].join("\n");
  const credentialScope = `${dateStamp}/${AMAZON_PAAPI_REGION}/${AMAZON_PAAPI_SERVICE}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", now, credentialScope, hashHex(canonicalRequest)].join("\n");
  const signature = hmac(getAmazonSigningKey(secretKey, dateStamp), stringToSign, "hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(AMAZON_PAAPI_ENDPOINT, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body,
    next: { revalidate: 86400 },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data?.SearchResult?.Items || [];
}

async function searchRakutenBooks({ queryTitle, applicationId, accessKey, affiliateId }) {
  const apiUrl = new URL(RAKUTEN_BOOKS_ENDPOINT);
  apiUrl.searchParams.set("applicationId", applicationId);
  if (affiliateId) {
    apiUrl.searchParams.set("affiliateId", affiliateId);
  }
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("formatVersion", "2");
  apiUrl.searchParams.set("title", queryTitle);
  apiUrl.searchParams.set("booksGenreId", "001001");
  apiUrl.searchParams.set("size", "9");
  apiUrl.searchParams.set("hits", "10");
  apiUrl.searchParams.set("sort", "standard");

  const headers = {
    Origin: (process.env.SITE_URL || "https://www.mangamatchquiz.com/").replace(/\/$/, ""),
    Referer: process.env.SITE_URL || "https://www.mangamatchquiz.com/",
  };
  if (accessKey) headers.accessKey = accessKey;

  const response = await fetch(apiUrl, {
    headers,
    next: { revalidate: 86400 },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return normalizeItems(data);
}

async function searchGoogleBooks({ queryTitle }) {
  const apiUrl = new URL(GOOGLE_BOOKS_ENDPOINT);
  apiUrl.searchParams.set("q", queryTitle);
  apiUrl.searchParams.set("country", "JP");
  apiUrl.searchParams.set("printType", "books");
  apiUrl.searchParams.set("maxResults", "10");

  const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
  if (!response.ok) return [];

  const data = await response.json();
  return data?.items || [];
}

async function searchJikanManga({ queryTitle }) {
  const apiUrl = new URL(JIKAN_MANGA_ENDPOINT);
  apiUrl.searchParams.set("q", queryTitle);
  apiUrl.searchParams.set("limit", "5");

  const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
  if (!response.ok) return [];

  const data = await response.json();
  return data?.data || [];
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const id = (searchParams.get("id") || "").trim();
  const author = (searchParams.get("author") || "").trim();
  const amazonAccessKey = process.env.AMAZON_PAAPI_ACCESS_KEY || process.env.AMAZON_ACCESS_KEY_ID;
  const amazonSecretKey = process.env.AMAZON_PAAPI_SECRET_KEY || process.env.AMAZON_SECRET_ACCESS_KEY;
  const amazonPartnerTag = process.env.AMAZON_ASSOCIATE_TAG || "mangamatchquiz-22";
  const applicationId = process.env.RAKUTEN_APP_ID || process.env.RAKUTEN_APPLICATION_ID || process.env.VITE_RAKUTEN_APP_ID || process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY || process.env.VITE_RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || process.env.VITE_RAKUTEN_AFFILIATE_ID;
  const bookliveOverride = getBookliveCoverOverride(id, title);
  const override = getCoverOverride(id, title);

  if (bookliveOverride) {
    return NextResponse.json(
      {
        imageUrl: bookliveOverride.coverUrl,
        itemUrl: bookliveOverride.itemUrl || null,
        isbn13: bookliveOverride.isbn13 || null,
        coverSource: bookliveOverride.coverSource || "booklive",
        coverConfidence: bookliveOverride.coverConfidence || null,
        reviewNeeded: Boolean(bookliveOverride.reviewNeeded),
      },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  }

  if (override) {
    return NextResponse.json(
      {
        imageUrl: override.coverUrl,
        itemUrl: override.itemUrl || null,
        isbn13: override.isbn13 || null,
        coverSource: override.coverSource || "override",
        coverConfidence: override.coverConfidence || null,
        reviewNeeded: Boolean(override.reviewNeeded),
      },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  }

  if (!title) {
    return NextResponse.json({ imageUrl: null, itemUrl: null });
  }

  try {
    const searchTitles = getSearchTitles(title, id, author);

    if (amazonAccessKey && amazonSecretKey && amazonPartnerTag) {
      for (const queryTitle of searchTitles) {
        const items = await searchAmazonPaapi({ queryTitle, accessKey: amazonAccessKey, secretKey: amazonSecretKey, partnerTag: amazonPartnerTag });
        const rankedItems = [...items].sort((a, b) => scoreAmazonItem(b, queryTitle) - scoreAmazonItem(a, queryTitle));
        const item = rankedItems.find((candidate) => scoreAmazonItem(candidate, queryTitle) > 0) || items.find((candidate) => getAmazonImage(candidate));
        const imageUrl = getAmazonImage(item);
        if (imageUrl) {
          return NextResponse.json(
            { imageUrl, itemUrl: item?.DetailPageURL || null, coverSource: "amazon_paapi" },
            { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
          );
        }
      }
    }

    for (const queryTitle of getJikanSearchTitles(title, id)) {
      const items = await searchJikanManga({ queryTitle });
      const rankedItems = [...items].sort((a, b) => scoreJikanManga(b, queryTitle) - scoreJikanManga(a, queryTitle));
      const item = rankedItems.find((candidate) => scoreJikanManga(candidate, queryTitle) >= 8);
      const imageUrl = getJikanCoverImage(item);
      if (imageUrl) {
        return NextResponse.json(
          { imageUrl, itemUrl: item?.url || null, coverSource: "jikan" },
          { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
        );
      }
    }

    for (const queryTitle of searchTitles) {
      const items = await searchGoogleBooks({ queryTitle });
      const rankedItems = [...items].sort((a, b) => scoreGoogleBook(b, queryTitle) - scoreGoogleBook(a, queryTitle));
      const item = rankedItems.find((candidate) => scoreGoogleBook(candidate, queryTitle) >= 5);
      const imageUrl = getGoogleCoverImage(item);
      if (imageUrl) {
        return NextResponse.json(
          { imageUrl, itemUrl: item?.volumeInfo?.infoLink || null, coverSource: "google_books" },
          { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
        );
      }
    }

    if (!applicationId) {
      return NextResponse.json({ imageUrl: null, itemUrl: null });
    }

    let item = null;

    for (const queryTitle of searchTitles) {
      const items = await searchRakutenBooks({ queryTitle, applicationId, accessKey, affiliateId });
      const rankedItems = [...items].sort((a, b) => scoreVolumeOne(b, queryTitle) - scoreVolumeOne(a, queryTitle));
      item = rankedItems.find((candidate) => scoreVolumeOne(candidate, queryTitle) >= 5);
      if (item) break;
    }

    const imageUrl = getCoverImage(item);
    const itemUrl = item?.affiliateUrl || item?.itemUrl || null;

    return NextResponse.json(
      { imageUrl, itemUrl, coverSource: imageUrl ? "rakuten" : null },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch {
    return NextResponse.json({ imageUrl: null, itemUrl: null }, { status: 200 });
  }
}
