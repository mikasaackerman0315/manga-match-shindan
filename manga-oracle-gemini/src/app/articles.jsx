import StoreLinks from "./StoreLinks";
import TrackedArticleLink from "./TrackedArticleLink";
import MangaCover from "../components/MangaCover";
import { getMangaCoverForItem } from "../data/mangaCovers";

const siteUrl = "https://www.mangamatchquiz.com";

const relatedArticleLinks = [
  { href: "/beginner-manga", label: "初心者向け漫画", description: "初めてでも読みやすい定番・人気作を探す" },
  { href: "/completed-manga", label: "完結済み漫画", description: "最後まで一気に読める作品を探す" },
  { href: "/trending-manga", label: "今話題の漫画", description: "漫画アプリ、SNS、アニメ化で注目される作品を見る" },
  { href: "/isekai-manga", label: "異世界漫画", description: "転生、冒険、魔法、世界観重視の作品を探す" },
  { href: "/romance-manga", label: "恋愛漫画", description: "青春、胸きゅん、大人の恋まで幅広く探す" },
  { href: "/horror-manga", label: "ホラー漫画", description: "怖さ、不穏さ、サスペンスを楽しめる作品を見る" },
  { href: "/sports-manga", label: "スポーツ漫画", description: "試合、努力、チームの熱さを味わう作品を探す" },
  { href: "/emotional-manga", label: "泣ける漫画", description: "読後に余韻が残る人間ドラマを探す" },
  { href: "/adult-manga", label: "大人向け漫画", description: "仕事、社会、人間関係に深く刺さる作品を見る" },
  { href: "/binge-read-manga", label: "一気読み漫画", description: "続きが気になって止まらない作品を探す" },
  { href: "/fantasy-manga", label: "ファンタジー漫画", description: "世界観に浸れる冒険・幻想作品を見る" },
];

const articleOverrides = {
  "/beginner-manga": {
    eyebrow: "Beginner Manga",
    title: "初心者向け漫画おすすめランキング",
    lead: "漫画をあまり読んでこなかった人でも入りやすい、読みやすさと満足度のバランスが良い作品を紹介します。アニメ化で知っている作品、巻数が追いやすい作品、キャラクターを覚えやすい作品を中心に選びました。",
    guideTitle: "初心者が漫画を選ぶポイント",
    guideItems: [
      { heading: "まずは読みやすい導入を重視する", text: "最初の数話で目的や人物関係が分かる作品は、漫画に慣れていない人でも入りやすいです。長編でも、序盤の目標が明確な作品なら読み進めやすくなります。" },
      { heading: "好きな映像作品に近いジャンルから入る", text: "アクション映画が好きならバトル、青春ドラマが好きなら恋愛やスポーツ、ミステリーが好きならサスペンスなど、すでに好きな雰囲気から選ぶと失敗しにくいです。" },
      { heading: "重さと明るさのバランスを見る", text: "名作でもテーマが重すぎると最初の一冊には向かない場合があります。読み終わった後に元気が出るか、深い余韻が残るか、自分の気分に合わせて選びましょう。" },
    ],
    items: [
      { id: "demon_slayer", title: "鬼滅の刃", author: "吾峠呼世晴", meta: "全23巻 / バトル・家族", text: "家族を奪われた少年が、鬼となった妹を救うために戦う王道バトル漫画です。目的が分かりやすく、感情の山場もはっきりしているため、漫画の入口として読みやすい作品です。", fit: "王道、感動、アニメ化作品から入りたい人に向いています。読む前に、家族の喪失や戦闘描写がある点は知っておくと安心です。" },
      { id: "spy_family", title: "SPY×FAMILY", author: "遠藤達哉", meta: "連載中 / 家族コメディ", text: "スパイ、殺し屋、超能力者が互いの正体を隠しながら家族として暮らすコメディです。重すぎず、1話ごとの満足感があり、キャラクターの魅力で読み進めやすい作品です。", fit: "明るい作品、家族で話題にしやすい作品を探している人におすすめです。" },
      { id: "fullmetal_alchemist", title: "鋼の錬金術師", author: "荒川弘", meta: "全27巻 / ファンタジー・冒険", text: "兄弟の旅を通して、命、罪、国家、成長を描く完成度の高い冒険漫画です。長すぎず短すぎず、最初から最後まで物語の軸がぶれません。", fit: "バトルだけでなく、物語の完成度や読後感を重視したい人に向いています。" },
      { id: "haikyu", title: "ハイキュー!!", author: "古舘春一", meta: "全45巻 / スポーツ", text: "高校バレーに打ち込む少年たちの成長と試合を描くスポーツ漫画です。チーム全員に見せ場があり、勝敗だけでなく努力の過程を楽しめます。", fit: "熱い青春、仲間との成長、読みやすいスポーツ漫画を求める人におすすめです。" },
      { id: "kimi_ni_todoke", title: "君に届け", author: "椎名軽穂", meta: "全30巻 / 恋愛・青春", text: "人付き合いが不器用な少女が、友人や恋を通じて少しずつ変わっていく青春漫画です。派手さよりも、丁寧な心の動きが魅力です。", fit: "やさしい恋愛漫画から入りたい人に向いています。" },
      { id: "dungeon_meshi", title: "ダンジョン飯", author: "九井諒子", meta: "全14巻 / ファンタジー・料理", text: "ダンジョン探索と料理を組み合わせた、独自性の高いファンタジーです。設定は濃いですが会話が読みやすく、世界観に自然と入れます。", fit: "少し変わった漫画を試したい人、ファンタジーと食べ物が好きな人におすすめです。" },
    ],
  },
  "/completed-manga": {
    eyebrow: "Completed Manga",
    title: "完結済み漫画おすすめランキング",
    lead: "結末まで読める安心感がある完結済み漫画を紹介します。伏線の回収、読後の余韻、一気読みのしやすさを重視して、今から読み始めても満足しやすい作品を選びました。",
    guideTitle: "完結済み漫画を選ぶポイント",
    guideItems: [
      { heading: "巻数と読む時間を決めて選ぶ", text: "10巻前後なら週末に読み切りやすく、30巻以上なら世界観や人物をじっくり追えます。自分の時間に合う長さを選ぶと積まずに読めます。" },
      { heading: "読後感を先に考える", text: "爽快に終わる作品、深く考えさせる作品、泣ける作品など、完結済み漫画は結末の印象まで含めて選べるのが強みです。" },
      { heading: "映像化作品から入るのもあり", text: "アニメや映画で知っている作品は入りやすく、原作では細かな心理描写やテンポの違いも楽しめます。" },
    ],
    items: [
      { id: "fullmetal_alchemist", title: "鋼の錬金術師", author: "荒川弘", meta: "全27巻 / ファンタジー", text: "兄弟の旅と国家の陰謀を描く名作です。序盤から終盤まで目的が明確で、完結済み漫画としてのまとまりが非常に強い作品です。", fit: "完成度の高い長編を読みたい人におすすめです。" },
      { id: "demon_slayer", title: "鬼滅の刃", author: "吾峠呼世晴", meta: "全23巻 / バトル", text: "家族、師弟、仲間との絆を軸に進むバトル漫画です。巻数が比較的追いやすく、最後まで勢いを保って読めます。", fit: "感情が動く王道バトルを探している人向けです。" },
      { id: "death_note", title: "DEATH NOTE", author: "大場つぐみ・小畑健", meta: "全12巻 / サスペンス", text: "名前を書いた人間を死に至らせるノートをめぐる頭脳戦です。短めながら密度が高く、ページをめくる手が止まりにくい作品です。", fit: "心理戦や緊張感のある物語を一気読みしたい人におすすめです。" },
      { id: "assassination_classroom", title: "暗殺教室", author: "松井優征", meta: "全21巻 / 学園", text: "謎の教師と生徒たちの一年を描く、笑えて泣ける学園漫画です。キャラクターが多くても役割が分かりやすく、結末まできれいにまとまっています。", fit: "重すぎない完結作を読みたい人に向いています。" },
      { id: "slam_dunk", title: "SLAM DUNK", author: "井上雄彦", meta: "全31巻 / スポーツ", text: "高校バスケを題材にしたスポーツ漫画の代表作です。試合の熱量と青春のまぶしさが強く、今読んでも古びにくい魅力があります。", fit: "熱い試合、仲間、名場面を味わいたい人におすすめです。" },
      { id: "dungeon_meshi", title: "ダンジョン飯", author: "九井諒子", meta: "全14巻 / ファンタジー", text: "料理と冒険の軽さから始まり、世界の仕組みや人物の選択へ広がっていく作品です。短めでも満足度が高い完結作です。", fit: "設定のうまいファンタジーが好きな人に向いています。" },
    ],
  },
  "/isekai-manga": {
    eyebrow: "Isekai Manga",
    title: "異世界漫画おすすめランキング",
    lead: "転生、冒険、魔法、国づくり、ダークファンタジーまで、別世界に入り込める漫画を紹介します。爽快感だけでなく、世界観の作り込みや物語の読み応えも重視しました。",
    guideTitle: "異世界漫画を選ぶポイント",
    guideItems: [
      { heading: "転生ものか冒険ものかで選ぶ", text: "人生をやり直す転生ものと、未知の世界を旅する冒険ものでは読み味が違います。気軽さが欲しいか、没入感が欲しいかで選びましょう。" },
      { heading: "明るめか重めかを確認する", text: "コメディ寄りは気楽に読めますが、戦争や復讐が絡む作品は読み応えが強くなります。今の気分に合わせるのが大切です。" },
      { heading: "世界観の作り込みを見る", text: "魔法、経済、文化、政治などの設定が細かい作品は、長く楽しみやすいです。" },
    ],
    items: [
      { id: "tensei_shitara_slime_datta_ken", title: "転生したらスライムだった件", author: "伏瀬・川上泰樹", meta: "転生・国づくり", text: "スライムに転生した主人公が仲間を増やし、国づくりへ進む異世界漫画です。読みやすく爽快で、異世界ジャンルの入口に向いています。", fit: "成り上がりや仲間集めが好きな人におすすめです。" },
      { id: "mushoku_tensei", title: "無職転生", author: "理不尽な孫の手・フジカワユカ", meta: "転生・人生再挑戦", text: "異世界で人生をやり直す主人公の成長を描く作品です。時間をかけて人物の変化を追う読み味があります。", fit: "じっくりした転生ものを読みたい人に向いています。" },
      { id: "re_zero", title: "Re:ゼロから始める異世界生活", author: "長月達平・マツセダイチ", meta: "死に戻り・サスペンス", text: "死に戻りの力を持つ少年が過酷な運命に挑む異世界作品です。緊張感が強く、苦境を乗り越える物語が好きな人に刺さります。", fit: "明るいだけではない異世界漫画を求める人におすすめです。" },
      { id: "konosuba", title: "この素晴らしい世界に祝福を!", author: "暁なつめ・渡真仁", meta: "コメディ・冒険", text: "残念な仲間たちと異世界生活を送るコメディ寄りの作品です。肩の力を抜いて笑いながら読めます。", fit: "重い展開よりギャグとテンポを重視したい人向けです。" },
      { id: "overlord", title: "オーバーロード", author: "丸山くがね・深山フギン", meta: "ダークファンタジー", text: "ゲーム世界に取り残された支配者の視点で描く、重厚な異世界ファンタジーです。強者側の物語を楽しめます。", fit: "ダークな世界観や支配者目線が好きな人に向いています。" },
      { id: "dungeon_meshi", title: "ダンジョン飯", author: "九井諒子", meta: "迷宮・料理", text: "転生ものではありませんが、異世界の生態や食文化を細かく描く名作ファンタジーです。世界観重視の人におすすめです。", fit: "設定の作り込みを楽しみたい人に向いています。" },
    ],
  },
  "/romance-manga": {
    eyebrow: "Romance Manga",
    title: "恋愛漫画おすすめランキング",
    lead: "青春の胸きゅんから大人の恋、ゆっくり距離が縮まる作品まで、恋愛の読み味が違う漫画を紹介します。甘さだけでなく、関係性の変化や読後感も重視しました。",
    guideTitle: "恋愛漫画を選ぶポイント",
    guideItems: [
      { heading: "甘さの強さで選ぶ", text: "胸きゅん重視、切なさ重視、会話のリアルさ重視など、恋愛漫画は温度差があります。今読みたい感情に合わせましょう。" },
      { heading: "学生恋愛か大人の恋かを見る", text: "学生ものは初々しさ、大人向けは生活や仕事との関係が魅力になります。" },
      { heading: "すれ違いの量を確認する", text: "じれったさが楽しい作品もありますが、ストレスが苦手な人は穏やかな作品を選ぶと読みやすいです。" },
    ],
    items: [
      { id: "kimi_ni_todoke", title: "君に届け", author: "椎名軽穂", meta: "青春・純愛", text: "不器用な少女が友人や恋を通じて変わっていく青春恋愛漫画です。心の距離が少しずつ近づく過程が丁寧です。", fit: "やさしい恋愛を読みたい人におすすめです。" },
      { id: "my_love_story", title: "俺物語!!", author: "河原和音・アルコ", meta: "青春・コメディ", text: "まっすぐで大柄な男子高校生の恋を描く、明るく温かい恋愛漫画です。読後感がよく、重い展開が苦手な人にも向いています。", fit: "笑えて応援したくなる恋愛が好きな人向けです。" },
      { id: "ao_haru_ride", title: "アオハライド", author: "咲坂伊緒", meta: "青春・再会", text: "再会した男女の距離感と、友人関係の揺れを描く青春恋愛漫画です。甘さと切なさのバランスがあります。", fit: "王道の青春恋愛を読みたい人におすすめです。" },
      { id: "my_dress_up_darling", title: "その着せ替え人形は恋をする", author: "福田晋一", meta: "趣味・恋愛", text: "雛人形職人を目指す少年とコスプレ好きの少女が、衣装作りを通して近づいていきます。趣味への熱も魅力です。", fit: "恋愛と好きなものへの情熱を一緒に楽しみたい人向けです。" },
      { id: "wotakoi", title: "ヲタクに恋は難しい", author: "ふじた", meta: "大人・オタク恋愛", text: "オタク同士の社会人恋愛を軽いテンポで描く作品です。仕事終わりに読みやすい明るさがあります。", fit: "大人のラブコメを気楽に読みたい人におすすめです。" },
      { id: "bokuyaba", title: "僕の心のヤバイやつ", author: "桜井のりお", meta: "青春・成長", text: "内向的な少年と人気者の少女が、日常の中で少しずつ距離を縮めていく作品です。表情や会話の細かな変化が魅力です。", fit: "ゆっくり進む関係性が好きな人に向いています。" },
    ],
  },
  "/horror-manga": {
    eyebrow: "Horror Manga",
    title: "ホラー漫画おすすめランキング",
    lead: "恐怖、不穏さ、怪異、心理サスペンスなど、さまざまな怖さを楽しめる漫画を紹介します。刺激だけでなく、物語としての読み応えもある作品を選びました。",
    guideTitle: "ホラー漫画を選ぶポイント",
    guideItems: [
      { heading: "怖さの種類を選ぶ", text: "怪異の怖さ、心理的な怖さ、グロテスクな怖さ、社会の不穏さなど、ホラーには種類があります。苦手な方向性は避けましょう。" },
      { heading: "読後感の重さを確認する", text: "強い余韻が残る作品も多いため、寝る前に読むなら軽めの怪異譚を選ぶのも手です。" },
      { heading: "サスペンス寄りから入る", text: "ホラー初心者は、謎解きやサスペンス要素がある作品から入ると読みやすいです。" },
    ],
    items: [
      { id: "hikari_ga_shinda_natsu", title: "光が死んだ夏", author: "モクモクれん", meta: "怪異・青春", text: "親友の姿をした何かと過ごす日常が、静かな違和感に侵されていく作品です。派手な恐怖よりも、不穏な空気が続きます。", fit: "じわじわ怖いホラーを読みたい人におすすめです。" },
      { id: "uzumaki", title: "うずまき", author: "伊藤潤二", meta: "怪異・名作", text: "町に広がる渦巻きへの異常な執着を描くホラー漫画です。独特の絵と発想が強烈で、忘れにくい読後感があります。", fit: "ビジュアルの怖さを味わいたい人向けです。" },
      { id: "parasyte", title: "寄生獣", author: "岩明均", meta: "SFホラー", text: "人間に寄生する生物との共存と対立を描く名作です。怖さだけでなく、人間性や倫理について考えさせられます。", fit: "怖さとテーマ性の両方を求める人におすすめです。" },
      { id: "mieruko_chan", title: "見える子ちゃん", author: "泉朝樹", meta: "怪異・コメディ", text: "普通の少女が恐ろしい存在を見えてしまう日常ホラーです。怖さと笑いのバランスがあり、読みやすい作品です。", fit: "重すぎないホラーから入りたい人に向いています。" },
      { id: "tokyo_ghoul", title: "東京喰種", author: "石田スイ", meta: "ダーク・サスペンス", text: "人を喰らう存在となった青年の葛藤を描くダークファンタジーです。アクションと心理描写の両方があります。", fit: "暗い世界観と葛藤が好きな人におすすめです。" },
      { id: "urabaito", title: "裏バイト:逃亡禁止", author: "田口翔太郎", meta: "怪異・短編連作", text: "高額報酬の怪しい仕事に挑む少女たちが、毎回異なる危険に遭遇します。短編感覚で読めるのに後味は強めです。", fit: "一話ごとの怪異を楽しみたい人に向いています。" },
    ],
  },
  "/sports-manga": {
    eyebrow: "Sports Manga",
    title: "スポーツ漫画おすすめランキング",
    lead: "試合の熱さ、努力、ライバル、チームの成長を楽しめるスポーツ漫画を紹介します。競技を知らなくても入りやすい作品を中心に選びました。",
    guideTitle: "スポーツ漫画を選ぶポイント",
    guideItems: [
      { heading: "競技知識なしで読めるかを見る", text: "ルール説明や主人公の成長が自然に入る作品は、競技を知らなくても楽しめます。" },
      { heading: "個人戦かチーム戦かで選ぶ", text: "個人の才能や努力を追いたいなら個人競技、仲間との関係性を楽しみたいならチーム競技がおすすめです。" },
      { heading: "試合以外のドラマも確認する", text: "部活、家族、ライバル、進路など、試合外の人間ドラマが強い作品ほど長く楽しめます。" },
    ],
    items: [
      { id: "haikyu", title: "ハイキュー!!", author: "古舘春一", meta: "バレーボール", text: "高校バレーを題材に、チーム全員の成長と試合の熱量を描きます。競技を知らなくても流れが分かりやすい作品です。", fit: "仲間との成長を楽しみたい人におすすめです。" },
      { id: "slam_dunk", title: "SLAM DUNK", author: "井上雄彦", meta: "バスケットボール", text: "バスケ初心者の主人公が仲間と出会い、試合を通じて変わっていく名作です。名場面が多く、今読んでも熱いです。", fit: "王道スポーツ漫画を読みたい人に向いています。" },
      { id: "blue_lock", title: "ブルーロック", author: "金城宗幸・ノ村優介", meta: "サッカー", text: "日本サッカーを変えるため、ストライカーたちが競い合う異色のサッカー漫画です。チームより個のエゴを強く描きます。", fit: "普通の部活ものとは違う刺激が欲しい人におすすめです。" },
      { id: "aoashi", title: "アオアシ", author: "小林有吾", meta: "サッカー", text: "ユース年代のサッカーを戦術面から描く作品です。成長物語としても、競技理解を深める漫画としても読み応えがあります。", fit: "戦術や育成に興味がある人に向いています。" },
      { id: "medalist", title: "メダリスト", author: "つるまいかだ", meta: "フィギュアスケート", text: "フィギュアスケートに憧れる少女とコーチの挑戦を描きます。夢を追う熱量と繊細な感情描写が魅力です。", fit: "努力と才能の物語に泣きたい人におすすめです。" },
      { id: "real", title: "リアル", author: "井上雄彦", meta: "車いすバスケ", text: "車いすバスケを軸に、挫折や再生を描く人間ドラマです。スポーツ漫画でありながら人生の物語として重みがあります。", fit: "大人にも刺さるスポーツ漫画を読みたい人向けです。" },
    ],
  },
  "/emotional-manga": {
    eyebrow: "Emotional Manga",
    title: "泣ける漫画おすすめランキング",
    lead: "家族、友情、別れ、成長、人生の選択など、読後に余韻が残る漫画を紹介します。ただ悲しいだけでなく、読み終えた後に前を向ける作品も選びました。",
    guideTitle: "泣ける漫画を選ぶポイント",
    guideItems: [
      { heading: "何で泣きたいかを決める", text: "家族、恋愛、友情、人生、喪失など、刺さるテーマは人によって違います。自分が読みたい感情に近い作品を選びましょう。" },
      { heading: "重さに注意する", text: "強い喪失や暴力を含む作品もあります。疲れている日は、温かい余韻が残る作品を選ぶのがおすすめです。" },
      { heading: "短編・中編から試す", text: "泣ける作品は感情の消耗もあります。まずは巻数が短めの作品から読むと入りやすいです。" },
    ],
    items: [
      { id: "your_lie_in_april", title: "四月は君の嘘", author: "新川直司", meta: "音楽・青春", text: "音楽を失った少年が、一人の少女との出会いで再び前を向いていく物語です。美しさと切なさが強く残ります。", fit: "青春と音楽、涙の余韻を味わいたい人におすすめです。" },
      { id: "a_silent_voice", title: "聲の形", author: "大今良時", meta: "青春・再生", text: "過去の過ちと向き合い、人との関係を取り戻そうとする物語です。簡単な感動ではなく、痛みを伴う再生を描きます。", fit: "深く考えさせられる作品を読みたい人に向いています。" },
      { id: "march_comes_in_like_a_lion", title: "3月のライオン", author: "羽海野チカ", meta: "将棋・人間ドラマ", text: "孤独な棋士と周囲の人々の関係を丁寧に描く作品です。静かな温かさと痛みの両方があります。", fit: "日常の中で救われる物語を読みたい人向けです。" },
      { id: "orange", title: "orange", author: "高野苺", meta: "青春・後悔", text: "未来からの手紙をきっかけに、後悔を変えようとする高校生たちの物語です。友情と喪失の重さが胸に残ります。", fit: "青春と切なさを求める人におすすめです。" },
      { id: "to_your_eternity", title: "不滅のあなたへ", author: "大今良時", meta: "ファンタジー・人生", text: "不死の存在が人と出会い、別れを重ねながら変化していく物語です。命と記憶のテーマが強く響きます。", fit: "壮大で感情に残る作品を読みたい人に向いています。" },
      { id: "solanin", title: "ソラニン", author: "浅野いにお", meta: "青春・生活", text: "若者たちの停滞、夢、生活の揺れを描く作品です。派手ではありませんが、現実に近い痛みと余韻があります。", fit: "大人になりかけの不安に刺さる漫画を探している人向けです。" },
    ],
  },
  "/adult-manga": {
    eyebrow: "Adult Manga",
    title: "大人向け漫画おすすめランキング",
    lead: "仕事、社会、人間関係、人生の選択など、大人になってから読むと深く刺さる漫画を紹介します。刺激よりも読み応えやテーマ性を重視しました。",
    guideTitle: "大人向け漫画を選ぶポイント",
    guideItems: [
      { heading: "自分の関心に近いテーマを選ぶ", text: "仕事、家族、社会問題、孤独、再出発など、今の自分に近いテーマほど深く刺さります。" },
      { heading: "重い作品は読むタイミングを見る", text: "社会派や心理描写の濃い作品は読み応えがある一方、疲れている時には重く感じることもあります。" },
      { heading: "短評と注意点を見て選ぶ", text: "大人向け漫画は名作でも癖が強い場合があります。テーマや読後感を確認してから選びましょう。" },
    ],
    items: [
      { id: "the_fable", title: "ザ・ファブル", author: "南勝久", meta: "裏社会・日常", text: "伝説の殺し屋が普通の生活を送ろうとする物語です。緊張感と日常の間合いが独特で、大人向けの読み応えがあります。", fit: "アクションと人間味の両方を楽しみたい人におすすめです。" },
      { id: "kujo_no_taizai", title: "九条の大罪", author: "真鍋昌平", meta: "社会派・弁護士", text: "裏社会や弱者に関わる弁護士を通して、法と現実の隙間を描きます。軽い作品ではありませんが、強い問題意識があります。", fit: "社会派漫画を読みたい人に向いています。" },
      { id: "chi_chikyu_no_undo", title: "チ。―地球の運動について―", author: "魚豊", meta: "歴史・思想", text: "地動説が異端とされた時代に、知を追う人々を描く作品です。信念や学びの意味を考えさせられます。", fit: "知的なテーマの漫画を読みたい人におすすめです。" },
      { id: "hirayasumi", title: "ひらやすみ", author: "真造圭伍", meta: "日常・生活", text: "ゆるやかに暮らす青年と周囲の人々の日常を描きます。大事件は少ないですが、生活の手触りが温かい作品です。", fit: "疲れた日に静かに読みたい人に向いています。" },
      { id: "blue_giant", title: "BLUE GIANT", author: "石塚真一", meta: "音楽・挑戦", text: "ジャズに人生を懸ける若者の挑戦を描く作品です。努力と熱量がまっすぐで、大人にも響く夢の物語です。", fit: "何かに本気で向かう作品を読みたい人向けです。" },
      { id: "monster", title: "MONSTER", author: "浦沢直樹", meta: "サスペンス", text: "医師の選択から始まる重厚なサスペンスです。人間の善悪や責任を問う物語で、じっくり読む価値があります。", fit: "長編の心理サスペンスを読みたい人におすすめです。" },
    ],
  },
  "/binge-read-manga": {
    eyebrow: "Binge Read Manga",
    title: "一気読み漫画おすすめランキング",
    lead: "続きが気になって止まらない、テンポと引きの強い漫画を紹介します。週末や休みにまとめて読みたい作品を中心に選びました。",
    guideTitle: "一気読み漫画を選ぶポイント",
    guideItems: [
      { heading: "巻数と集中できる時間を見る", text: "短めの完結作は一晩で読みやすく、長編は数日かけて没入できます。" },
      { heading: "引きの強さを重視する", text: "ミステリー、サスペンス、バトル、スポーツは次の展開が気になりやすく、一気読みと相性が良いです。" },
      { heading: "重い作品は休憩を入れる", text: "面白くても心理的に重い作品は疲れやすいです。無理せず読み進めると楽しめます。" },
    ],
    items: [
      { id: "death_note", title: "DEATH NOTE", author: "大場つぐみ・小畑健", meta: "全12巻 / 頭脳戦", text: "ノートをめぐる心理戦がテンポよく進みます。短めの巻数で密度が高く、一気読みしやすい作品です。", fit: "頭脳戦とサスペンスが好きな人におすすめです。" },
      { id: "chainsaw_man", title: "チェンソーマン", author: "藤本タツキ", meta: "バトル・ダーク", text: "予測しにくい展開と勢いのあるバトルで読ませる作品です。独特の空気が強く、ページをめくる力があります。", fit: "刺激の強い漫画を読みたい人向けです。" },
      { id: "blue_lock", title: "ブルーロック", author: "金城宗幸・ノ村優介", meta: "サッカー・競争", text: "勝ち残り形式のサッカー漫画で、試合ごとの引きが強い作品です。テンション高く読み進められます。", fit: "熱い競争や成長を一気に追いたい人におすすめです。" },
      { id: "the_promised_neverland", title: "約束のネバーランド", author: "白井カイウ・出水ぽすか", meta: "脱出・サスペンス", text: "孤児院に隠された秘密を知った子どもたちの脱出劇です。序盤から緊張感が高く、先が気になります。", fit: "謎とサスペンスで引っ張られたい人に向いています。" },
      { id: "kingdom", title: "キングダム", author: "原泰久", meta: "歴史・戦争", text: "中国春秋戦国時代を舞台に、天下の大将軍を目指す少年を描きます。長編ですが、戦ごとの盛り上がりが強いです。", fit: "長く没入できる大河漫画を探している人におすすめです。" },
      { id: "golden_kamuy", title: "ゴールデンカムイ", author: "野田サトル", meta: "冒険・歴史", text: "北海道を舞台に、金塊をめぐる冒険と人間模様を描きます。笑い、緊張感、知識が混ざり、飽きずに読めます。", fit: "濃いキャラクターと冒険が好きな人向けです。" },
    ],
  },
};

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function pickArticle({ eyebrow, title, lead, items, path, guideTitle, guideItems }) {
  return articleOverrides[path] || { eyebrow, title, lead, items, guideTitle, guideItems };
}

function articleFaq(title) {
  return [
    {
      q: `${title}はどれから読めばいいですか？`,
      a: "まずは紹介文を読んで、今読みたい雰囲気に近い作品から選ぶのがおすすめです。巻数、完結状況、苦手な展開もあわせて確認すると失敗しにくくなります。",
    },
    {
      q: "電子書籍と紙の本はどちらがおすすめですか？",
      a: "すぐ読みたい場合は電子書籍、手元に残したい作品や全巻で集めたい作品は紙の本が向いています。価格や在庫はリンク先で確認してください。",
    },
    {
      q: "迷った場合はどう選べばいいですか？",
      a: "好みや苦手な展開がまだはっきりしない場合は、漫画おすすめ診断で条件を絞ると選びやすくなります。",
    },
  ];
}

function RelatedCard({ href, label, description, sourcePath }) {
  return (
    <TrackedArticleLink href={href} label={label} sourcePath={sourcePath} className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
      <h3 className="text-base font-semibold mb-2">{label}</h3>
      <p className="text-sm leading-7" style={{ color: "#555" }}>{description}</p>
    </TrackedArticleLink>
  );
}

export function ArticlePage(props) {
  const article = pickArticle(props);
  const pagePath = props.slug ? `/themes/${props.slug}` : props.path;
  const pageUrl = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  const pageType = props.slug ? "theme_article" : "seo_article";
  const currentRelatedIndex = relatedArticleLinks.findIndex((link) => link.href === pagePath);
  const rotatedRelatedLinks = currentRelatedIndex >= 0
    ? [...relatedArticleLinks.slice(currentRelatedIndex + 1), ...relatedArticleLinks.slice(0, currentRelatedIndex)]
    : relatedArticleLinks;
  const relatedLinks = rotatedRelatedLinks.slice(0, 6);
  const faqs = articleFaq(article.title);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: article.title,
    description: article.lead,
    url: pageUrl,
    numberOfItems: article.items.length,
    itemListElement: article.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.text,
      url: `${pageUrl}#rank-${index + 1}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "マンガマッチ診断", item: siteUrl },
      { "@type": "ListItem", position: 2, name: article.title, item: pageUrl },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      {pagePath && (
        <>
          <JsonLd data={itemListJsonLd} />
          <JsonLd data={breadcrumbJsonLd} />
          <JsonLd data={faqJsonLd} />
        </>
      )}
      <article className="max-w-4xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>診断トップへ</a>
        <header className="mt-10 mb-12">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{article.eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{article.title}</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>{article.lead}</p>
        </header>

        <section className="mb-12 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-2xl font-semibold mb-5">{article.guideTitle || "漫画の選び方"}</h2>
          <div className="space-y-5">
            {(article.guideItems || []).map((item) => (
              <div key={item.heading}>
                <h3 className="text-base font-semibold mb-2">{item.heading}</h3>
                <p className="text-sm leading-7" style={{ color: "#555" }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["向いている人", "読みたい気分や苦手な展開が分かっている人ほど、作品選びの精度が上がります。各作品の短評と注意点を見ながら選んでください。"],
            ["失敗しない選び方", "巻数、完結状況、作品の重さ、アニメ化の有無を確認すると、自分の読書ペースに合う漫画を選びやすくなります。"],
            ["リンクについて", "販売ページでは価格、在庫、電子書籍の配信状況が変わることがあります。購入前にリンク先で最新情報を確認してください。"],
          ].map(([heading, text]) => (
            <div key={heading} className="p-4" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.45)" }}>
              <h2 className="text-base font-semibold mb-2">{heading}</h2>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{text}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          {article.items.map((item, index) => {
            const cover = getMangaCoverForItem(item);

            return (
              <div id={`rank-${index + 1}`} key={`${item.title}-${index}`} className="grid grid-cols-12 gap-4 md:gap-6 pb-8 scroll-mt-8" style={{ borderBottom: "1px solid rgba(10,10,10,0.1)" }}>
                <div className="col-span-2 md:col-span-1 text-3xl md:text-4xl font-bold leading-none" style={{ color: index === 0 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="col-span-10 md:col-span-11">
                  <div className="flex items-start gap-4 md:gap-5">
                    <MangaCover title={item.title} mangaId={item.id} author={item.author} coverImageUrl={cover?.coverImageUrl} coverProductUrl={cover?.coverProductUrl} coverImageSource={cover?.coverImageSource} verified={cover?.coverImageVerified} pageType={pageType} />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h2>
                      <div className="text-xs tracking-[0.12em] mb-4" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>{item.meta}</div>
                      <p className="leading-8 mb-4" style={{ color: "#333" }}>{item.text}</p>
                      <p className="text-sm leading-7 mb-4" style={{ color: "#555" }}><strong>読む前に:</strong> {item.fit}</p>
                      <StoreLinks title={item.title} compact showPreview={false} pageType={pageType} labels={{ amazonKindle: "Kindle", amazonPaper: "Amazon", rakutenSet: "楽天で探す", rakutenBooks: "楽天ブックス" }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-4">どれから読むか迷ったら</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>作品ごとの雰囲気を見ても決めきれない場合は、好みや苦手な展開をもとに選べる漫画おすすめ診断も活用してみてください。恋愛、異世界、ホラー、スポーツ、完結済みなど、読みたい条件に合わせて候補を絞れます。</p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>漫画おすすめ診断を使う</a>
        </section>

        <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">よくある質問</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-base font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm leading-7" style={{ color: "#555" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedLinks.length > 0 && (
          <section className="mt-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
              <div>
                <div className="text-xs tracking-[0.22em] uppercase mb-2" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>More Guides</div>
                <h2 className="text-2xl font-semibold">ほかの切り口で探す</h2>
              </div>
              <a href="/themes" className="text-xs tracking-[0.18em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>テーマ一覧へ</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedLinks.map((link) => <RelatedCard key={link.href} {...link} sourcePath={pagePath} />)}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
