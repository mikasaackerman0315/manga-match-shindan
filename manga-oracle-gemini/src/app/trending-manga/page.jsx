import StoreLinks from "../StoreLinks";
import TrackedArticleLink from "../TrackedArticleLink";

const siteUrl = "https://www.mangamatchquiz.com";

export const metadata = {
  title: "今話題の漫画おすすめランキング30選 | マンガマッチ診断",
  description: "ジャンプ＋、マガポケ、マンガワン、SNS、アニメ化、新刊、漫画賞で読まれやすい注目漫画30作品を紹介します。",
  alternates: { canonical: "/trending-manga" },
  openGraph: {
    title: "今話題の漫画おすすめランキング30選 | マンガマッチ診断",
    description: "漫画アプリ、SNS、アニメ化、新刊、漫画賞で読まれやすい注目漫画をまとめました。",
    url: `${siteUrl}/trending-manga`,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "article",
  },
};

const sections = [
  {
    id: "jump-plus",
    heading: "ジャンプ＋・Web連載で読みたい漫画",
    lead: "更新日の反応、アニメ化、単行本発売で読み始める人が増えやすい作品を中心に選びました。",
    defaultTags: ["ジャンプ＋", "Web連載"],
    items: [
      {
        title: "ダンダダン",
        author: "龍幸伸",
        medium: "少年ジャンプ＋",
        genre: "オカルトバトル・ラブコメ",
        status: "連載中",
        trendTags: ["アニメ化", "SNS人気"],
        synopsis: "霊を信じる女子高生と宇宙人を信じる少年が、怪異と宇宙人に巻き込まれていく高速バトル漫画。勢いのあるアクションと青春の距離感が魅力です。",
        fit: "テンポの速いバトル、変な設定、恋愛未満の空気をまとめて楽しみたい人に。",
        caution: "下ネタ寄りのギャグや怪異表現があります。",
      },
      {
        title: "ルリドラゴン",
        author: "眞藤雅興",
        medium: "週刊少年ジャンプ・少年ジャンプ＋",
        genre: "日常・青春・少し不思議",
        status: "連載中",
        trendTags: ["再注目", "読みやすい"],
        synopsis: "ある朝、頭に角が生えた女子高生ルリの日常を描く作品。大きな事件よりも、会話や教室の空気で読ませるやさしい漫画です。",
        fit: "バトルより空気感、自然な会話、少しだけ非日常な日常漫画を読みたい人に。",
        caution: "派手な展開を求めると物足りないかもしれません。",
      },
      {
        title: "ケントゥリア",
        author: "暗森透",
        medium: "少年ジャンプ＋",
        genre: "ダークファンタジー・冒険",
        status: "連載中",
        trendTags: ["次にくる", "重め"],
        synopsis: "過酷な運命を背負った青年が、異形の力と人間の欲望が渦巻く世界を進むファンタジー。重い空気と先の読めなさが強い作品です。",
        fit: "王道だけでは物足りない、少し暗く骨太なファンタジーを追いたい人に。",
        caution: "暴力表現や重い展開があります。",
      },
      {
        title: "魔男のイチ",
        author: "西修・宇佐崎しろ",
        medium: "週刊少年ジャンプ",
        genre: "魔法・バトル・ファンタジー",
        status: "連載中",
        trendTags: ["マンガ大賞候補", "新世代ジャンプ"],
        synopsis: "魔法をめぐる世界で、少年イチが常識外れの存在として成長していく冒険譚。読みやすい設定とキャラクターの強さで入りやすい新世代バトルです。",
        fit: "ジャンプらしい成長、魔法バトル、見やすい絵の新作を読みたい人に。",
        caution: "序盤は世界観の説明を追いながら読む作品です。",
      },
      {
        title: "カグラバチ",
        author: "外薗健",
        medium: "週刊少年ジャンプ",
        genre: "剣戟・復讐・バトル",
        status: "連載中",
        trendTags: ["海外人気", "新世代ジャンプ"],
        synopsis: "刀匠の父を持つ少年が、妖刀をめぐる因縁に踏み込んでいくバトル漫画。静かな怒りとスタイリッシュな戦闘が軸になっています。",
        fit: "剣、復讐、クールな主人公、切れ味のあるアクションが好きな人に。",
        caution: "復讐劇なので空気はやや重めです。",
      },
      {
        title: "ドラマクイン",
        author: "市川苦楽",
        medium: "少年ジャンプ＋",
        genre: "SF・群像劇",
        status: "連載中",
        trendTags: ["新連載", "尖った作品"],
        synopsis: "宇宙人と人間が共存する社会を舞台に、怒りや違和感を抱える人々を描くSF漫画。読みながら居心地の悪さと引っかかりが残ります。",
        fit: "きれいにまとまりすぎない、少し毒のある新作を探している人に。",
        caution: "万人向けの爽快感より、ざらついた読後感が強い作品です。",
      },
    ],
  },
  {
    id: "app-serial",
    heading: "マガポケ・マンガワン周辺で注目の漫画",
    lead: "アプリ連載や週刊誌連載から、今まとめて追いやすい人気作を選びました。",
    defaultTags: ["漫画アプリ", "連載中"],
    items: [
      {
        title: "薫る花は凛と咲く",
        author: "三香見サカ",
        medium: "マガジンポケット",
        genre: "青春・恋愛・学園",
        status: "連載中",
        trendTags: ["アニメ化", "青春"],
        synopsis: "底辺男子校の少年とお嬢様学校の少女が出会い、互いの世界を少しずつ知っていく青春漫画。やさしい会話と誠実な関係性が魅力です。",
        fit: "刺激よりも、まっすぐな青春と読後感のよさを求める人に。",
        caution: "派手な事件よりも関係性の積み重ねを楽しむ作品です。",
      },
      {
        title: "ブルーロック",
        author: "金城宗幸・ノ村優介",
        medium: "週刊少年マガジン・マガポケ",
        genre: "サッカー・デスゲーム的競争",
        status: "連載中",
        trendTags: ["アニメ化", "スポーツ"],
        synopsis: "日本代表を変えるため、ストライカーたちが過酷な選抜施設で競い合うサッカー漫画。友情よりもエゴと才能のぶつかり合いで読ませます。",
        fit: "熱い台詞、ライバル関係、勝負の高揚感が好きな人に。",
        caution: "リアルな部活スポーツより、エンタメ性の強い競争漫画です。",
      },
      {
        title: "ガチアクタ",
        author: "裏那圭・晏童秀吉",
        medium: "週刊少年マガジン・マガポケ",
        genre: "バトル・ダークファンタジー",
        status: "連載中",
        trendTags: ["アニメ化", "絵が強い"],
        synopsis: "不当な罪で奈落へ落とされた少年が、廃棄物と異能が支配する世界で戦う物語。荒々しい絵と怒りのある世界観が印象に残ります。",
        fit: "絵の個性、下層から這い上がる物語、重めのバトルが好きな人に。",
        caution: "世界観は暗めで、暴力表現もあります。",
      },
      {
        title: "裏バイト:逃亡禁止",
        author: "田口翔太郎",
        medium: "マンガワン・裏サンデー",
        genre: "ホラー・怪異・サスペンス",
        status: "連載中",
        trendTags: ["口コミ人気", "ホラー"],
        synopsis: "高額報酬の怪しい仕事に挑む二人が、不可解な現場で危険な目に遭うホラー漫画。短い話の中で不穏さが一気に膨らみます。",
        fit: "1話ごとの引きが強いホラー、怪異系の嫌な空気が好きな人に。",
        caution: "怖さや不快感のある回があります。",
      },
      {
        title: "ケンガンオメガ",
        author: "サンドロビッチ・ヤバ子・だろめおん",
        medium: "マンガワン・裏サンデー",
        genre: "格闘・バトル",
        status: "連載中",
        trendTags: ["格闘", "シリーズ人気"],
        synopsis: "企業同士の利権を賭けた格闘試合を軸に、強者たちの戦いを描くシリーズ続編。肉体派のぶつかり合いと駆け引きが魅力です。",
        fit: "格闘漫画、トーナメント、強い男たちの戦いが好きな人に。",
        caution: "前作から読むとより入りやすい作品です。",
      },
      {
        title: "レッドブルー",
        author: "波切敦",
        medium: "週刊少年サンデー",
        genre: "格闘・MMA・青春",
        status: "連載中",
        trendTags: ["スポーツ", "成長物語"],
        synopsis: "冴えない少年が総合格闘技に出会い、自分の弱さと向き合いながら強くなっていくスポーツ漫画。地味な努力と試合の緊張感が光ります。",
        fit: "才能より努力、泥臭い成長、格闘技のリアル寄りな熱さが好きな人に。",
        caution: "爽快な無双より、少しずつ積み上げるタイプです。",
      },
    ],
  },
  {
    id: "next-hit",
    heading: "次にくる枠で押さえたい漫画",
    lead: "マンガ大賞、アニメ化してほしい漫画ランキング、書店員評価など、次の入口になりやすい作品です。",
    defaultTags: ["次にくる", "ランキング注目"],
    items: [
      {
        title: "写らナイんです",
        author: "コノシマルカ",
        medium: "週刊少年サンデー",
        genre: "青春・オカルト・コメディ",
        status: "連載中",
        trendTags: ["AnimeJapan", "爽やかホラー"],
        synopsis: "霊媒体質の少年と心霊写真好きの少女が、オカルト部で怪異に向き合う青春漫画。怖さよりも明るい掛け合いと爽やかさで読みやすい作品です。",
        fit: "ホラーは気になるけど重すぎるものは避けたい人、青春オカルトが好きな人に。",
        caution: "ホラー演出はありますが、過度に暗い作品ではありません。",
      },
      {
        title: "会社と私生活－オンとオフ－",
        author: "金沢真之介",
        medium: "ガンガンpixiv",
        genre: "社会人・日常・ギャップ",
        status: "連載中",
        trendTags: ["SNS発", "社会人"],
        synopsis: "会社では真面目に働く人々が、私生活ではまったく違う顔を持つ日常漫画。オンとオフのギャップが軽やかに描かれます。",
        fit: "社会人の日常、趣味のある生活、ゆるい会話劇を読みたい人に。",
        caution: "大事件よりもキャラクターのギャップを楽しむ作品です。",
      },
      {
        title: "本なら売るほど",
        author: "児島青",
        medium: "ハルタ",
        genre: "古本屋・人間ドラマ",
        status: "連載中",
        trendTags: ["マンガ大賞", "ヒューマンドラマ"],
        synopsis: "古本屋に集まる人々と、本にまつわる記憶や縁を描くヒューマンドラマ。静かな読後感と本をめぐる会話が心に残ります。",
        fit: "派手な展開より、人の生活や記憶を丁寧に描く漫画を読みたい人に。",
        caution: "バトルや強い刺激を求める人には穏やかです。",
      },
      {
        title: "サンキューピッチ",
        author: "住吉九",
        medium: "少年ジャンプ＋",
        genre: "野球・コメディ・青春",
        status: "連載中",
        trendTags: ["マンガ大賞候補", "スポーツ"],
        synopsis: "個性の強い高校球児たちが、予想外の戦術と勢いで野球に挑むスポーツ漫画。笑いと熱さの振れ幅が大きい作品です。",
        fit: "野球漫画、クセのあるキャラ、ギャグと本気の試合を両方楽しみたい人に。",
        caution: "正統派の部活漫画より、かなり変化球のテンポです。",
      },
    ],
  },
  {
    id: "sns-reader",
    heading: "SNSや口コミで見つけやすい漫画",
    lead: "感想を言いたくなる設定、読みやすい短さ、キャラクターの強さで広がりやすい作品です。",
    defaultTags: ["SNS・口コミ", "読みやすい"],
    items: [
      {
        title: "ふつうの軽音部",
        author: "クワハリ・出内テツオ",
        medium: "少年ジャンプ＋",
        genre: "部活・青春・音楽",
        status: "連載中",
        trendTags: ["マンガ大賞候補", "音楽"],
        synopsis: "軽音部に入った高校生たちの温度差や承認欲求、音楽への憧れを描く青春漫画。派手ではない会話の積み重ねが妙に刺さります。",
        fit: "部活もの、等身大の人間関係、音楽への憧れが好きな人に。",
        caution: "熱血よりも観察眼と空気感で読ませる作品です。",
      },
      {
        title: "光が死んだ夏",
        author: "モクモクれん",
        medium: "ヤングエースUP",
        genre: "青春・ホラー",
        status: "連載中",
        trendTags: ["アニメ化", "ホラー"],
        synopsis: "親友の姿をした何かと過ごす少年の夏を描くホラー漫画。田舎の湿度、喪失感、近すぎる関係性が静かに怖さを生みます。",
        fit: "静かな怖さ、青春の痛み、不穏な空気を楽しみたい人に。",
        caution: "明るい青春漫画ではなく、喪失感とホラーが中心です。",
      },
      {
        title: "スーパーの裏でヤニ吸うふたり",
        author: "地主",
        medium: "ビッグガンガン",
        genre: "日常・会話劇・恋愛未満",
        status: "連載中",
        trendTags: ["大人向け", "会話劇"],
        synopsis: "仕事帰りの会社員とスーパー店員が、店の裏で煙草を吸いながら少しずつ距離を縮める物語。短い会話の余韻で読ませます。",
        fit: "大人の距離感、静かな会話、派手すぎないラブコメが好きな人に。",
        caution: "煙草描写が多い作品です。",
      },
      {
        title: "正反対な君と僕",
        author: "阿賀沢紅茶",
        medium: "少年ジャンプ＋",
        genre: "青春・恋愛・学園",
        status: "完結",
        trendTags: ["完結済み", "青春"],
        synopsis: "明るく周囲に合わせがちな女子と、まじめで自分の軸を持つ男子の関係を描く青春ラブコメ。会話の自然さと友人たちの描写も魅力です。",
        fit: "重すぎない恋愛、クラスの空気、友人関係まで含めて読みたい人に。",
        caution: "刺激的な展開より、細やかな心の変化が中心です。",
      },
      {
        title: "十字架のろくにん",
        author: "中武士竜",
        medium: "マガジンポケット",
        genre: "復讐・サスペンス",
        status: "連載中",
        trendTags: ["アプリ人気", "復讐"],
        synopsis: "壮絶ないじめで家族を奪われた少年が、復讐のために自分を鍛え、加害者たちへ近づいていくサスペンス。強烈な怒りと緊張感で読ませます。",
        fit: "刺激の強い復讐劇、先が気になるサスペンスを読みたい人に。",
        caution: "暴力表現と精神的に重い描写がかなり強めです。",
      },
      {
        title: "ドッグスレッド",
        author: "野田サトル",
        medium: "週刊ヤングジャンプ",
        genre: "アイスホッケー・青春・スポーツ",
        status: "連載中",
        trendTags: ["作者人気", "スポーツ"],
        synopsis: "問題児の少年が氷上競技の世界へ飛び込み、仲間やライバルとぶつかりながら成長していくスポーツ漫画。勢いのある人物描写が魅力です。",
        fit: "スポーツ漫画、荒い才能、チームで熱くなる展開が好きな人に。",
        caution: "序盤からキャラクターの癖が強めです。",
      },
    ],
  },
  {
    id: "anime-media",
    heading: "アニメ化・映像化で入りやすい漫画",
    lead: "アニメや映画をきっかけに原作を読み始めやすい作品です。",
    defaultTags: ["アニメ化", "入りやすい"],
    items: [
      {
        title: "怪獣8号",
        author: "松本直也",
        medium: "少年ジャンプ＋",
        genre: "怪獣・防衛隊・バトル",
        status: "完結",
        trendTags: ["完結済み", "まとめ読み"],
        synopsis: "怪獣清掃業で働く男が、思わぬ変化をきっかけに防衛隊を目指すバトル漫画。社会人主人公の再挑戦と仲間との共闘が読みやすい作品です。",
        fit: "大人主人公、怪獣バトル、テンポの良い少年漫画を読みたい人に。",
        caution: "怪獣との戦闘や身体変化の描写があります。",
      },
      {
        title: "SAKAMOTO DAYS",
        author: "鈴木祐斗",
        medium: "週刊少年ジャンプ",
        genre: "殺し屋・アクション・コメディ",
        status: "連載中",
        trendTags: ["アニメ化", "アクション"],
        synopsis: "元最強の殺し屋が、家族との平穏を守るために再び危険な世界と向き合うアクション漫画。日常コメディと迫力ある戦闘の落差が楽しい作品です。",
        fit: "キレのあるアクション、強い主人公、軽い笑いを一緒に楽しみたい人に。",
        caution: "殺し屋ものなので戦闘描写は多めです。",
      },
      {
        title: "WIND BREAKER",
        author: "にいさとる",
        medium: "マガジンポケット",
        genre: "不良・青春・バトル",
        status: "連載中",
        trendTags: ["アニメ化", "キャラ人気"],
        synopsis: "街を守る不良高校に入った少年が、仲間との出会いを通じて変わっていく青春バトル漫画。喧嘩の熱さと仲間関係のまっすぐさが魅力です。",
        fit: "不良漫画、友情、キャラクター人気の強い作品を読みたい人に。",
        caution: "喧嘩描写が中心ですが、空気は比較的読みやすいです。",
      },
      {
        title: "ウィッチウォッチ",
        author: "篠原健太",
        medium: "週刊少年ジャンプ",
        genre: "魔女・コメディ・学園",
        status: "連載中",
        trendTags: ["アニメ化", "コメディ"],
        synopsis: "魔女の少女と幼なじみの少年が同居し、魔法にまつわる騒動を巻き起こす学園コメディ。ギャグ、恋愛、バトルが軽やかに混ざります。",
        fit: "笑えて読みやすい、明るいファンタジー寄りの漫画を探している人に。",
        caution: "シリアスな魔法バトルより、コメディの比重が高めです。",
      },
      {
        title: "メダリスト",
        author: "つるまいかだ",
        medium: "月刊アフタヌーン",
        genre: "フィギュアスケート・スポーツ",
        status: "連載中",
        trendTags: ["アニメ化", "受賞作"],
        synopsis: "フィギュアスケートに憧れる少女と、夢に挫折した青年コーチが頂点を目指すスポーツ漫画。努力の痛みと成長の瞬間が濃く描かれます。",
        fit: "本気のスポーツ漫画、師弟関係、才能と努力の物語が好きな人に。",
        caution: "競技の厳しさや挫折も丁寧に描かれます。",
      },
      {
        title: "ラーメン赤猫",
        author: "アンギャマン",
        medium: "少年ジャンプ＋",
        genre: "仕事・癒し・コメディ",
        status: "連載中",
        trendTags: ["アニメ化", "癒し"],
        synopsis: "猫たちが働くラーメン屋で、人間のスタッフが接客や店の仕事を学んでいくお仕事漫画。ゆるい空気と働く人へのやさしさがあります。",
        fit: "バトルより癒し、仕事の空気、やさしいユーモアを読みたい人に。",
        caution: "大きな事件より日常と接客の積み重ねを楽しむ作品です。",
      },
      {
        title: "シャングリラ・フロンティア",
        author: "硬梨菜・不二涼介",
        medium: "週刊少年マガジン",
        genre: "ゲーム・ファンタジー・バトル",
        status: "連載中",
        trendTags: ["アニメ化", "ゲーム"],
        synopsis: "クソゲー好きのプレイヤーが、神ゲーと呼ばれるVRゲームへ挑む冒険漫画。ゲーム攻略の楽しさと強敵との戦いがテンポよく進みます。",
        fit: "ゲーム、攻略、強敵バトル、明るい冒険が好きな人に。",
        caution: "現実ドラマよりゲーム内の展開が中心です。",
      },
      {
        title: "戦隊大失格",
        author: "春場ねぎ",
        medium: "週刊少年マガジン",
        genre: "戦隊・ダークヒーロー・バトル",
        status: "連載中",
        trendTags: ["アニメ化", "変化球"],
        synopsis: "正義の戦隊と怪人の関係を裏側から描くバトル漫画。ヒーローものの定番をひっくり返す視点で、組織の歪みと反抗を描きます。",
        fit: "ヒーローものを少し斜めから見たい人、皮肉のあるバトルが好きな人に。",
        caution: "明快な正義の物語ではなく、黒い部分も多い作品です。",
      },
    ],
  },
];

const flatItems = sections.flatMap((section) => section.items);

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function MetaPill({ children }) {
  return (
    <span className="px-2.5 py-1 text-[11px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.7)", color: "#555" }}>
      {children}
    </span>
  );
}

function TrendPill({ children }) {
  return (
    <span className="px-2 py-0.5 text-[10px] tracking-[0.08em]" style={{ border: "1px solid rgba(192,57,43,0.26)", color: "#c0392b", backgroundColor: "rgba(192,57,43,0.055)", fontFamily: "'JetBrains Mono', 'Noto Serif JP', monospace" }}>
      {children}
    </span>
  );
}

function getTags(section, item) {
  return Array.from(new Set([...(section.defaultTags || []), ...(item.trendTags || [])])).slice(0, 5);
}

export default function TrendingMangaPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "今話題の漫画おすすめランキング30選",
    description: metadata.description,
    url: `${siteUrl}/trending-manga`,
    numberOfItems: flatItems.length,
    itemListElement: flatItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.synopsis,
      url: `${siteUrl}/trending-manga#rank-${index + 1}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "マンガマッチ診断", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "今話題の漫画おすすめランキング30選", item: `${siteUrl}/trending-manga` },
    ],
  };

  let rank = 0;

  return (
    <main className="min-h-screen px-4 py-10 md:py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a" }}>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-5xl mx-auto">
        <a href="/" className="inline-block mb-10 text-xs tracking-[0.24em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Manga Match Quiz</a>

        <header className="mb-12">
          <div className="text-xs tracking-[0.28em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Trending Manga</div>
          <h1 className="text-4xl md:text-6xl leading-tight font-semibold mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>今話題の漫画おすすめランキング30選</h1>
          <p className="text-base md:text-lg leading-9 max-w-3xl" style={{ color: "#444" }}>
            ジャンプ＋、マガポケ、マンガワン、SNS、アニメ化、新刊、漫画賞を入口に、今読み始めやすい漫画を30作品に絞りました。昔からの名作だけではなく、アプリや口コミで見つけやすい新しめの作品も入れています。
          </p>
        </header>

        <section className="mb-12 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.6)" }}>
          <h2 className="text-2xl font-semibold mb-3">トレンド漫画を選ぶポイント</h2>
          <p className="leading-8" style={{ color: "#444" }}>
            話題性だけで選ぶと好みに合わないこともあるので、あらすじ、ジャンル、重さ、読みやすさを一緒に見るのがおすすめです。各作品には、アニメ化、SNS人気、漫画賞、アプリ連載などの入口タグも付けています。
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.id} className="mb-14">
            <div className="mb-6">
              <div className="text-xs tracking-[0.22em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{section.id}</div>
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">{section.heading}</h2>
              <p className="leading-8" style={{ color: "#555" }}>{section.lead}</p>
            </div>

            <div className="space-y-8">
              {section.items.map((item) => {
                rank += 1;
                return (
                  <article id={`rank-${rank}`} key={item.title} className="grid grid-cols-12 gap-4 md:gap-6 pb-8 scroll-mt-8" style={{ borderBottom: "1px solid rgba(10,10,10,0.1)" }}>
                    <div className="col-span-2 md:col-span-1 text-3xl md:text-4xl font-bold leading-none" style={{ color: rank === 1 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
                      {String(rank).padStart(2, "0")}
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {getTags(section, item).map((tag) => <TrendPill key={tag}>{tag}</TrendPill>)}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <MetaPill>{item.author}</MetaPill>
                        <MetaPill>{item.medium}</MetaPill>
                        <MetaPill>{item.genre}</MetaPill>
                        <MetaPill>{item.status}</MetaPill>
                      </div>
                      <div className="space-y-3 leading-8" style={{ color: "#333" }}>
                        <p><strong>あらすじ</strong> {item.synopsis}</p>
                        <p><strong>おすすめの人</strong> {item.fit}</p>
                        <p><strong>読む前に</strong> {item.caution}</p>
                      </div>
                      <StoreLinks title={item.title} compact pageType="seo_article" />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.6)" }}>
          <h2 className="text-2xl font-semibold mb-3">迷ったら漫画診断で選ぶ</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>
            トレンド漫画は数が多く、重さやジャンルもかなり違います。苦手な展開や読みたい気分がある場合は、診断で条件を入れて候補を絞り込めます。
          </p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める</a>
        </section>

        <section className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">ほかの切り口で探す</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrackedArticleLink href="/completed-manga" label="完結済み漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">完結済み漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>最後まで一気に読める作品を探せます。</p>
            </TrackedArticleLink>
            <TrackedArticleLink href="/beginner-manga" label="初心者向け漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">初心者向け漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>久しぶりに漫画を読む人でも入りやすい作品をまとめています。</p>
            </TrackedArticleLink>
            <TrackedArticleLink href="/themes" label="テーマ別おすすめ漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">テーマ別おすすめ漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>異世界、恋愛、ホラー、スポーツなど気分から探せます。</p>
            </TrackedArticleLink>
          </div>
        </section>

        <section className="p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">よくある質問</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-2">トレンド漫画は名作ランキングと何が違いますか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>名作ランキングは評価が固まった作品中心ですが、トレンド漫画はアプリ、SNS、アニメ化、新刊、漫画賞などで今読み始める人が増えている作品を重視しています。</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">話題作だけで選んでも大丈夫ですか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>入口としては便利ですが、重さやジャンルが合わない場合もあります。迷う場合は診断と併用すると外しにくくなります。</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
