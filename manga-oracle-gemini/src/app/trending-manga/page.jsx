import StoreLinks from "../StoreLinks";
import TrackedArticleLink from "../TrackedArticleLink";

const siteUrl = "https://www.mangamatchquiz.com";

export const metadata = {
  title: "今話題の漫画おすすめランキング | マンガマッチ診断",
  description: "ジャンプ＋、マガポケ、マンガワン、SNS、アニメ化、新刊で話題になりやすい注目漫画を紹介します。",
  alternates: { canonical: "/trending-manga" },
  openGraph: {
    title: "今話題の漫画おすすめランキング | マンガマッチ診断",
    description: "漫画アプリ、SNS、アニメ化、新刊で話題になりやすい注目漫画をまとめました。",
    url: `${siteUrl}/trending-manga`,
    siteName: "マンガマッチ診断",
    locale: "ja_JP",
    type: "article",
  },
};

const sections = [
  {
    id: "jump-plus",
    heading: "ジャンプ＋・Web連載で話題の漫画",
    lead: "更新日のSNS反応、アニメ化、新刊発売、無料公開キャンペーンなどで話題が広がりやすい作品です。",
    items: [
      {
        title: "ダンダダン",
        author: "龍幸伸",
        medium: "少年ジャンプ＋",
        genre: "オカルト・バトル・ラブコメ",
        status: "連載中",
        buzz: "アニメ化以降も原作のアクション、怪異、青春ノリへの注目が強く、ジャンプ＋の入口として読まれやすい作品です。",
        fit: "テンポの速いバトル、濃いキャラ、少し変な青春感をまとめて楽しみたい人に。",
        caution: "怪異表現や下ネタ寄りの勢いがあるため、完全に穏やかな漫画を求める人は注意。",
      },
      {
        title: "ルリドラゴン",
        author: "眞藤雅興",
        medium: "週刊少年ジャンプ・少年ジャンプ＋",
        genre: "日常・青春・少し不思議",
        status: "連載中",
        buzz: "連載再開や掲載形態の変化で話題になり、ゆるい会話と絵柄の魅力でSNSでも見つかりやすい作品です。",
        fit: "バトルよりも空気感、キャラの自然な会話、少しだけ非日常な日常漫画を読みたい人に。",
        caution: "大事件が続く作品ではなく、日常のテンポを楽しむ漫画です。",
      },
      {
        title: "マリッジトキシン",
        author: "静脈・依田瑞稀",
        medium: "少年ジャンプ＋",
        genre: "殺し屋・バトル・婚活コメディ",
        status: "連載中",
        buzz: "アクションの見せ方と婚活設定の変化球が強く、ジャンプ＋内でもおすすめされやすい中堅人気作です。",
        fit: "強い主人公、テンポのいいバトル、コメディ混じりの関係性を読みたい人に。",
        caution: "恋愛漫画というより、アクションとコメディの比重が高めです。",
      },
      {
        title: "幼稚園WARS",
        author: "千葉侑生",
        medium: "少年ジャンプ＋",
        genre: "アクション・ギャグ・ラブコメ",
        status: "連載中",
        buzz: "危険すぎる幼稚園という一発で伝わる設定が強く、短い紹介から読み始めやすいWeb発の人気作です。",
        fit: "変な設定を全力で走らせる漫画、ギャグとバトルの両方が欲しい人に。",
        caution: "リアリティよりも勢いとキャラの濃さを楽しむ作品です。",
      },
      {
        title: "ケントゥリア",
        author: "暗森透",
        medium: "少年ジャンプ＋",
        genre: "ダークファンタジー・冒険",
        status: "連載中",
        buzz: "新しめのジャンプ＋作品として、重い世界観と先が読めない展開が漫画好きの間で話題になっています。",
        fit: "王道だけでは物足りない、少し暗くて骨太なファンタジーを追いたい人に。",
        caution: "暴力表現や不穏な展開があるため、明るい冒険だけを求める人には重めです。",
      },
    ],
  },
  {
    id: "magapoke-mangaone",
    heading: "マガポケ・マンガワン周辺で注目の漫画",
    lead: "アニメ化、連載の盛り上がり、アプリ内ランキングで見つけやすい作品を中心に選びました。",
    items: [
      {
        title: "ブルーロック",
        author: "金城宗幸・ノ村優介",
        medium: "週刊少年マガジン・マガポケ",
        genre: "サッカー・デスゲーム的競争",
        status: "連載中",
        buzz: "アニメ、映画、代表戦シーズンの話題と相性がよく、スポーツ漫画の中でも検索されやすい作品です。",
        fit: "友情より競争、才能のぶつかり合い、強い言葉で盛り上がる漫画が好きな人に。",
        caution: "リアルな部活スポーツより、エンタメ性の強いサッカー漫画です。",
      },
      {
        title: "薫る花は凛と咲く",
        author: "三香見サカ",
        medium: "マガジンポケット",
        genre: "青春・恋愛・学校",
        status: "連載中",
        buzz: "アニメ化でさらに入口が広がり、丁寧な恋愛と人間関係で幅広い読者に届いています。",
        fit: "刺激よりも誠実さ、まっすぐな青春、読後感のよさを求める人に。",
        caution: "派手な事件より、関係性の積み重ねを楽しむ作品です。",
      },
      {
        title: "ガチアクタ",
        author: "裏那圭・晏童秀吉",
        medium: "週刊少年マガジン・マガポケ",
        genre: "バトル・ダークファンタジー",
        status: "連載中",
        buzz: "アニメ化情報や独特なグラフィティ調の絵で注目され、バトル漫画好きの入口になりやすい作品です。",
        fit: "絵の個性、荒い熱量、下層から這い上がる物語が好きな人に。",
        caution: "世界観は暗めで、暴力表現もあります。",
      },
      {
        title: "裏バイト:逃亡禁止",
        author: "田口翔太郎",
        medium: "マンガワン・裏サンデー",
        genre: "ホラー・怪異・サスペンス",
        status: "連載中",
        buzz: "一話ごとの引きが強く、アプリで読み進めやすいホラーとして口コミで広がりやすい作品です。",
        fit: "短編感覚で怖い話を読みたい人、怪異系の不穏さが好きな人に。",
        caution: "怖さや不快感のある回もあるので、癒し目的には向きません。",
      },
      {
        title: "ケンガンオメガ",
        author: "サンドロビッチ・ヤバ子・だろめおん",
        medium: "マンガワン・裏サンデー",
        genre: "格闘・バトル",
        status: "連載中",
        buzz: "シリーズ人気と配信アニメの流れで、格闘漫画として継続的に読まれています。",
        fit: "肉体派バトル、トーナメント、濃い格闘家同士のぶつかり合いが好きな人に。",
        caution: "前作から読むとより入りやすい作品です。",
      },
    ],
  },
  {
    id: "sns-hit",
    heading: "SNSや口コミで広がりやすい漫画",
    lead: "タイトルの強さ、設定の分かりやすさ、感想を言いたくなる展開で話題になりやすい作品です。",
    items: [
      {
        title: "少年のアビス",
        author: "峰浪りょう",
        medium: "週刊ヤングジャンプ",
        genre: "心理ドラマ・サスペンス",
        status: "完結",
        buzz: "地方の閉塞感と人間関係の重さが強く、感想や考察がSNSで広がりやすい作品です。",
        fit: "明るい漫画より、重い心理劇や人間関係の沼を読みたい人に。",
        caution: "かなり重い展開があるため、気分が落ちている時は注意。",
      },
      {
        title: "十字架のろくにん",
        author: "中武士竜",
        medium: "マガジンポケット",
        genre: "復讐・サスペンス",
        status: "連載中",
        buzz: "強い復讐テーマと衝撃展開で、アプリ漫画として見つかりやすく話題にもなりやすい作品です。",
        fit: "刺激の強いサスペンス、復讐劇、続きが気になる展開を求める人に。",
        caution: "暴力表現や精神的に重い描写があります。",
      },
      {
        title: "フードコートで、また明日。",
        author: "成家慎一郎",
        medium: "コミックNewtype",
        genre: "日常・会話劇",
        status: "連載中",
        buzz: "会話だけで読ませる心地よさが口コミで広がり、短い紹介でも魅力が伝わりやすい作品です。",
        fit: "派手な事件より、二人の空気感と会話のテンポを楽しみたい人に。",
        caution: "物語の起伏は控えめで、日常の余白を味わう作品です。",
      },
      {
        title: "極楽街",
        author: "佐乃夕斗",
        medium: "ジャンプSQ.",
        genre: "怪異・バトル・アクション",
        status: "連載中",
        buzz: "絵の華やかさとキャラ人気でSNS上の見栄えが強く、単行本入口でも選ばれやすい作品です。",
        fit: "スタイリッシュな絵、怪異バトル、キャラの掛け合いが好きな人に。",
        caution: "物語の深掘りより、まず雰囲気とアクションを楽しむ入口です。",
      },
      {
        title: "光が死んだ夏",
        author: "モクモクれん",
        medium: "ヤングエースUP",
        genre: "青春・ホラー",
        status: "連載中",
        buzz: "田舎の夏と違和感のある親友という強いフックで、感想や考察が広がりやすい作品です。",
        fit: "静かな怖さ、青春の切なさ、不穏な空気を楽しみたい人に。",
        caution: "明るい青春漫画ではなく、ホラーと喪失感が中心です。",
      },
    ],
  },
  {
    id: "anime-media",
    heading: "アニメ化・映像化で話題の漫画",
    lead: "アニメや映像化をきっかけに、原作をまとめて読み始める人が増えやすい作品です。",
    items: [
      {
        title: "シャングリラ・フロンティア",
        author: "硬梨菜・不二涼介",
        medium: "週刊少年マガジン",
        genre: "ゲーム・ファンタジー・バトル",
        status: "連載中",
        buzz: "アニメ化でゲーム攻略ものとしての入口が広がり、原作の作画とバトルにも注目が集まっています。",
        fit: "ゲーム、強敵攻略、主人公の成長を爽快に読みたい人に。",
        caution: "現実ドラマより、ゲーム内の冒険とバトルが中心です。",
      },
      {
        title: "桃源暗鬼",
        author: "漆原侑来",
        medium: "週刊少年チャンピオン",
        genre: "異能・バトル",
        status: "連載中",
        buzz: "アニメ化で原作を探す人が増え、王道の異能バトルとして読み始めやすい作品です。",
        fit: "少年漫画らしい勢い、能力バトル、チーム感が好きな人に。",
        caution: "設定は王道寄りなので、変化球より熱さを求める人向けです。",
      },
      {
        title: "ウィッチウォッチ",
        author: "篠原健太",
        medium: "週刊少年ジャンプ",
        genre: "魔女・コメディ・学園",
        status: "連載中",
        buzz: "アニメ化で再注目され、ギャグと恋愛とファンタジーの軽さが広い層に届きやすい作品です。",
        fit: "笑えて読みやすい、学園ファンタジー寄りの漫画を探している人に。",
        caution: "シリアスな魔法バトルより、コメディの比重が高めです。",
      },
      {
        title: "怪獣8号",
        author: "松本直也",
        medium: "少年ジャンプ＋",
        genre: "怪獣・防衛隊バトル",
        status: "完結",
        buzz: "アニメ展開と完結後のまとめ読み需要で、今から一気に読みたい作品として見つかりやすいです。",
        fit: "社会人主人公、王道バトル、仲間との成長を読みやすいテンポで楽しみたい人に。",
        caution: "怪獣との戦闘や身体変化の描写があります。",
      },
      {
        title: "ラーメン赤猫",
        author: "アンギャマン",
        medium: "少年ジャンプ＋",
        genre: "仕事・癒し・コメディ",
        status: "連載中",
        buzz: "アニメ化後も配信やグッズ展開で見つけやすく、猫と仕事漫画の組み合わせで読者層が広がっています。",
        fit: "バトルよりも癒し、仕事の空気感、やさしいユーモアを読みたい人に。",
        caution: "大きな事件よりも日常と接客の積み重ねを楽しむ作品です。",
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

export default function TrendingMangaPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "今話題の漫画おすすめランキング",
    description: metadata.description,
    url: `${siteUrl}/trending-manga`,
    numberOfItems: flatItems.length,
    itemListElement: flatItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      description: item.buzz,
      url: `${siteUrl}/trending-manga#rank-${index + 1}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "マンガマッチ診断", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "今話題の漫画おすすめランキング", item: `${siteUrl}/trending-manga` },
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
          <h1 className="text-4xl md:text-6xl leading-tight font-semibold mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>今話題の漫画おすすめランキング</h1>
          <p className="text-base md:text-lg leading-9 max-w-3xl" style={{ color: "#444" }}>
            ジャンプ＋、マガポケ、マンガワン、SNS、アニメ化・新刊情報などを参考に、今読まれている注目漫画を紹介します。昔からの名作だけではなく、アプリやSNSで見つけやすい新しめの作品も入れています。
          </p>
        </header>

        <section className="mb-12 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.6)" }}>
          <h2 className="text-2xl font-semibold mb-3">今本当に読まれているトレンド漫画とは？</h2>
          <p className="leading-8" style={{ color: "#444" }}>
            トレンド漫画は、単に昔から有名な作品ではなく、アプリ更新日、SNSの感想、アニメ化、映像化、新刊発売、無料公開などで読み始める人が増えている作品です。ここでは「なぜ今話題なのか」が分かるように、媒体やおすすめ対象も一緒に整理しています。
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
                      <div className="flex flex-wrap gap-2 mb-4">
                        <MetaPill>{item.author}</MetaPill>
                        <MetaPill>{item.medium}</MetaPill>
                        <MetaPill>{item.genre}</MetaPill>
                        <MetaPill>{item.status}</MetaPill>
                      </div>
                      <div className="space-y-3 leading-8" style={{ color: "#333" }}>
                        <p><strong>なぜ今話題？</strong> {item.buzz}</p>
                        <p><strong>おすすめの人</strong> {item.fit}</p>
                        <p><strong>読む前の注意点</strong> {item.caution}</p>
                      </div>
                      <StoreLinks title={item.title} compact showPreview={false} pageType="seo_article" labels={{ amazonKindle: "Kindleで今すぐ読む", amazonPaper: "Amazonで紙の本を探す", amazonSearch: "Amazonで関連商品を探す", rakutenSet: "楽天で全巻・ポイント還元を見る", rakutenBooks: "楽天ブックスで探す" }} />
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
            トレンド漫画は数が多く、話題性だけで選ぶと好みに合わないこともあります。苦手な展開や読みたい気分がある場合は、診断で条件を入れて候補を絞り込めます。
          </p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める</a>
        </section>

        <section className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">ほかの切り口でも探す</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TrackedArticleLink href="/themes" label="テーマ別おすすめ漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">テーマ別おすすめ漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>異世界、恋愛、ホラー、日常など、読みたい気分から探せます。</p>
            </TrackedArticleLink>
            <TrackedArticleLink href="/working-adult-manga" label="社会人におすすめ漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">社会人におすすめ漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>仕事終わりや休日に読みやすい、大人向けの作品を探せます。</p>
            </TrackedArticleLink>
            <TrackedArticleLink href="/beginner-manga" label="初心者向け漫画" sourcePath="/trending-manga" className="block p-4 transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.12)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h3 className="text-base font-semibold mb-2">初心者向け漫画</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>久しぶりに漫画を読む人でも入りやすい作品をまとめています。</p>
            </TrackedArticleLink>
          </div>
        </section>

        <section className="p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl font-semibold mb-5">よくある質問</h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold mb-2">トレンド漫画は名作ランキングと何が違いますか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>名作ランキングは評価が固まった作品中心ですが、トレンド漫画はアプリ、SNS、アニメ化、新刊などで今読み始める人が増えている作品を重視しています。</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">話題作だけで選んでも大丈夫ですか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>話題性は入口として便利ですが、重さ、ジャンル、巻数が合わない場合もあります。迷う場合は診断と併用すると外しにくくなります。</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
