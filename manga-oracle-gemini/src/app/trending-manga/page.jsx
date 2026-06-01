import StoreLinks from "../StoreLinks";

const siteUrl = "https://www.mangamatchquiz.com";

export const metadata = {
  title: "今話題の漫画おすすめランキング | マンガマッチ診断",
  description: "ジャンプ＋、マガポケ、LINEマンガ、マンガワン、SNS、アニメ化・新刊情報などを参考に、今読まれている注目漫画を紹介します。",
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
    heading: "ジャンプ＋で話題の漫画",
    lead: "更新日のSNS反応、アニメ化、新刊発売、無料公開キャンペーンなどで話題が広がりやすいジャンプ＋系の作品です。",
    items: [
      {
        title: "ダンダダン",
        author: "龍幸伸",
        medium: "少年ジャンプ＋",
        genre: "オカルト・バトル・ラブコメ",
        status: "連載中",
        buzz: "アニメ化以降、怪異・宇宙人・青春の勢いがSNSで広がり、原作のアクション表現にも再注目が集まっています。",
        fit: "テンポの速いバトル、濃いキャラ、少し変な青春ノリをまとめて楽しみたい人におすすめです。",
        caution: "ホラー寄りの怪異表現や下ネタ気味の勢いがあるので、完全に穏やかな漫画を求める人は注意。",
      },
      {
        title: "SPY×FAMILY",
        author: "遠藤達哉",
        medium: "少年ジャンプ＋",
        genre: "スパイ・家族コメディ",
        status: "連載中",
        buzz: "アニメ、映画、新刊のたびに幅広い層へ届き、家族で読める話題作として安定して読まれています。",
        fit: "重すぎない漫画、キャラのかわいさ、コメディとアクションのバランスを求める人に向いています。",
        caution: "スパイものですが、本格的な政治サスペンスよりも家族コメディ寄りです。",
      },
      {
        title: "怪獣8号",
        author: "松本直也",
        medium: "少年ジャンプ＋",
        genre: "怪獣・防衛隊バトル",
        status: "完結",
        buzz: "アニメ展開と最終巻周辺の話題で、これからまとめて読みたい作品として注目されやすくなっています。",
        fit: "王道バトル、社会人主人公、仲間との成長を読みやすいテンポで楽しみたい人におすすめです。",
        caution: "怪獣との戦闘や身体変化の描写があるため、グロテスク表現が苦手な人は少し注意。",
      },
      {
        title: "ラーメン赤猫",
        author: "アンギャマン",
        medium: "少年ジャンプ＋",
        genre: "仕事・癒し・コメディ",
        status: "連載中",
        buzz: "アニメ化後も配信やグッズ展開で見つけやすく、猫と仕事漫画の組み合わせで読者層が広がっています。",
        fit: "バトルよりも癒し、仕事の空気感、やさしいユーモアを読みたい人に向いています。",
        caution: "大きな事件よりも日常と接客の積み重ねを楽しむ作品です。",
      },
      {
        title: "ケントゥリア",
        author: "暗森透",
        medium: "少年ジャンプ＋",
        genre: "ダークファンタジー・冒険",
        status: "連載中",
        buzz: "新しめのジャンプ＋作品として、重い世界観と先が読めない展開が漫画好きの間で話題になっています。",
        fit: "王道だけでは物足りない、少し暗くて骨太なファンタジーを追いたい人におすすめです。",
        caution: "暴力表現や不穏な展開があるため、明るい冒険ものだけを求める人には重めです。",
      },
    ],
  },
  {
    id: "webtoon",
    heading: "LINEマンガ・ピッコマ系で人気の漫画",
    lead: "縦読み、フルカラー、ゲーム的な成長要素、強い主人公など、スマホで読み進めやすい作品が中心です。",
    items: [
      {
        title: "俺だけレベルMAXなビギナー",
        author: "Maslow / swingbat / WAN.Z",
        medium: "LINEマンガ",
        genre: "ファンタジー・成長・攻略",
        status: "連載中",
        buzz: "LINEマンガのランキングで目に入りやすく、ゲーム攻略型のわかりやすい強さが継続読みに向いています。",
        fit: "レベル、スキル、攻略情報を使って主人公が勝ち上がる作品が好きな人におすすめです。",
        caution: "ゲーム的な設定が多いため、現実寄りの人間ドラマを求める人には軽く感じるかもしれません。",
      },
      {
        title: "入学傭兵",
        author: "YC / rakhyun",
        medium: "LINEマンガ",
        genre: "学園・アクション",
        status: "連載中",
        buzz: "元傭兵の高校生という強いフックがあり、短い区切りで爽快感を得やすい縦読み系の人気作です。",
        fit: "強い主人公、学園トラブル解決、アクションの気持ちよさを求める人に向いています。",
        caution: "暴力的な場面や制裁系の展開があるので、穏やかな学園ものとは違います。",
      },
      {
        title: "外見至上主義",
        author: "T.Jun",
        medium: "LINEマンガ",
        genre: "学園・社会派・アクション",
        status: "連載中",
        buzz: "長期人気の縦読み作品で、外見、格差、暴力、仲間関係を扱うテーマ性が今も読まれ続けています。",
        fit: "ただのバトルではなく、社会的なテーマや人間関係のこじれも読みたい人におすすめです。",
        caution: "いじめ、暴力、差別的な扱いなど重い題材が出てきます。",
      },
      {
        title: "喧嘩独学",
        author: "T.Jun / 金正賢",
        medium: "LINEマンガ",
        genre: "格闘・動画配信・成長",
        status: "完結",
        buzz: "動画配信と格闘を組み合わせた設定が現代的で、短い話数単位で続きが気になる作りになっています。",
        fit: "弱い主人公が知識と努力で強くなる話、現代的なSNS感のある漫画が好きな人に向いています。",
        caution: "喧嘩や暴力描写が中心なので、平和な日常系を探している人には不向きです。",
      },
    ],
  },
  {
    id: "magapoke-mangaone",
    heading: "マガポケ・マンガワンで注目の漫画",
    lead: "アプリ連載から口コミで伸びる作品や、アニメ化をきっかけに読者が増えている作品を中心に選びました。",
    items: [
      {
        title: "ブルーロック",
        author: "金城宗幸 / ノ村優介",
        medium: "週刊少年マガジン・マガポケ",
        genre: "サッカー・バトル・心理戦",
        status: "連載中",
        buzz: "アニメ、映画、スポーツ系SNSの話題で新規読者が入りやすく、サッカー漫画の中でも熱量が高い作品です。",
        fit: "勝負論、エゴ、ライバル関係、派手な演出が好きな人におすすめです。",
        caution: "リアルな部活スポーツというより、バトル漫画的なサッカー表現です。",
      },
      {
        title: "薫る花は凛と咲く",
        author: "三香見サカ",
        medium: "マガポケ",
        genre: "青春・恋愛・学園",
        status: "連載中",
        buzz: "アニメ化で一気に知名度が広がり、やさしい恋愛漫画を探す層から注目されています。",
        fit: "不器用な距離感、友人関係、穏やかな青春の空気を読みたい人に向いています。",
        caution: "刺激の強い展開よりも、関係性の変化を丁寧に追うタイプです。",
      },
      {
        title: "ガチアクタ",
        author: "裏那圭 / 晏童秀吉",
        medium: "週刊少年マガジン・マガポケ",
        genre: "バトル・ダークファンタジー",
        status: "連載中",
        buzz: "アニメ化で原作への注目が上がり、荒い線と熱いバトル演出が漫画好きに刺さっています。",
        fit: "泥臭い世界観、怒りを抱えた主人公、勢いのあるアクションを読みたい人におすすめです。",
        caution: "差別、暴力、閉塞感のある世界が描かれるため、軽い作品ではありません。",
      },
      {
        title: "裏バイト:逃亡禁止",
        author: "田口翔太郎",
        medium: "マンガワン",
        genre: "ホラー・怪異・サスペンス",
        status: "連載中",
        buzz: "アプリ発のホラーとして口コミで読まれやすく、短編ごとの不穏さがSNSで共有されやすい作品です。",
        fit: "怖い話、都市伝説、説明しきれない怪異の気持ち悪さが好きな人に向いています。",
        caution: "後味の悪い話や理不尽な恐怖が多いので、癒し目的には向きません。",
      },
      {
        title: "ケンガンオメガ",
        author: "サンドロビッチ・ヤバ子 / だろめおん",
        medium: "マンガワン",
        genre: "格闘・企業バトル",
        status: "連載中",
        buzz: "前作から続く格闘漫画として、対戦カードや強さ議論で継続的に盛り上がりやすい作品です。",
        fit: "肉弾戦、格闘技、強者同士のトーナメント感が好きな人におすすめです。",
        caution: "前作『ケンガンアシュラ』を読んでいる方が入りやすいです。",
      },
    ],
  },
  {
    id: "anime",
    heading: "アニメ化・映像化で話題の漫画",
    lead: "映像化で一気に検索されやすくなった作品、放送後に原作へ戻る人が増えやすい作品です。",
    items: [
      {
        title: "チェンソーマン 第二部",
        author: "藤本タツキ",
        medium: "少年ジャンプ＋",
        genre: "ダークアクション・青春",
        status: "連載中",
        buzz: "アニメ・劇場版関連の話題に加え、第二部の展開が読者の考察を呼びやすい作品です。",
        fit: "予測不能な展開、乾いたギャグ、痛みのある青春を読みたい人におすすめです。",
        caution: "暴力、流血、精神的に重い描写が多めです。",
      },
      {
        title: "魔都精兵のスレイブ",
        author: "タカヒロ / 竹村洋平",
        medium: "少年ジャンプ＋",
        genre: "バトル・ファンタジー",
        status: "連載中",
        buzz: "アニメ化とキャラクター人気で検索されやすく、ジャンプ＋の中でも話題を作りやすい作品です。",
        fit: "能力バトル、強いヒロイン、少し刺激のある娯楽漫画を読みたい人に向いています。",
        caution: "サービスシーンが多いため、読む場所や好みは選びます。",
      },
      {
        title: "アオのハコ",
        author: "三浦糀",
        medium: "週刊少年ジャンプ",
        genre: "青春・恋愛・スポーツ",
        status: "連載中",
        buzz: "アニメ化で青春恋愛漫画としての認知が広がり、原作の繊細な関係性にも注目が集まっています。",
        fit: "部活、片思い、ゆっくり進む恋愛を読みたい人におすすめです。",
        caution: "派手な事件よりも、日々の積み重ねを味わうタイプの作品です。",
      },
      {
        title: "サカモトデイズ",
        author: "鈴木祐斗",
        medium: "週刊少年ジャンプ",
        genre: "殺し屋・アクション・コメディ",
        status: "連載中",
        buzz: "アニメ化で入口が増え、原作のアクション作画とキャラクター人気が再注目されています。",
        fit: "かっこいいアクション、テンポの良いギャグ、強キャラ同士の戦いが好きな人に向いています。",
        caution: "暗殺者ものなので、コメディでも戦闘や暴力描写があります。",
      },
    ],
  },
];

const allItems = sections.flatMap((section) => section.items);

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "今話題の漫画おすすめランキング",
  description: metadata.description,
  url: `${siteUrl}/trending-manga`,
  numberOfItems: allItems.length,
  itemListElement: allItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.title,
    description: item.buzz,
    url: `${siteUrl}/trending-manga#rank-${index + 1}`,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "トレンド漫画はどう選べばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "掲載アプリ、SNSでの話題性、アニメ化や新刊のタイミングだけでなく、自分が読みたいジャンルや重さに合うかを見て選ぶのがおすすめです。",
      },
    },
    {
      "@type": "Question",
      name: "有名作とトレンド漫画は何が違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有名作は長く読まれている定番作品、トレンド漫画はアプリ更新、映像化、SNS、ランキング、新刊などで今読まれやすい作品です。",
      },
    },
  ],
};

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function WorkCard({ item, index }) {
  return (
    <article id={`rank-${index + 1}`} className="scroll-mt-8 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.62)" }}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="text-4xl md:text-5xl font-bold leading-none shrink-0" style={{ color: index < 3 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2 text-xs leading-6 mb-5" style={{ color: "#555" }}>
            <div><dt className="inline font-semibold">作者：</dt><dd className="inline">{item.author}</dd></div>
            <div><dt className="inline font-semibold">媒体：</dt><dd className="inline">{item.medium}</dd></div>
            <div><dt className="inline font-semibold">ジャンル：</dt><dd className="inline">{item.genre}</dd></div>
            <div><dt className="inline font-semibold">状況：</dt><dd className="inline">{item.status}</dd></div>
          </dl>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase mb-1" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>WHY TRENDING</div>
              <p className="text-sm md:text-base leading-8" style={{ color: "#333" }}>{item.buzz}</p>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase mb-1" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>BEST FOR</div>
              <p className="text-sm leading-7" style={{ color: "#555" }}>{item.fit}</p>
            </div>
            <div>
              <div className="text-[10px] tracking-[0.22em] uppercase mb-1" style={{ color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>NOTE</div>
              <p className="text-sm leading-7" style={{ color: "#666" }}>{item.caution}</p>
            </div>
          </div>
          <StoreLinks title={item.title} compact showPreview={false} pageType="seo_article" labels={{ amazonKindle: "Kindleで今すぐ読む", amazonPaper: "Amazonで紙の本を探す", amazonSearch: "Amazonで関連商品を探す", rakutenSet: "楽天で全巻・ポイント還元を見る", rakutenBooks: "楽天ブックスで探す" }} />
        </div>
      </div>
    </article>
  );
}

export default function TrendingMangaPage() {
  let rank = 0;

  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <article className="max-w-5xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>診断トップへ</a>
        <header className="mt-10 mb-14">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Trending Manga</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>今話題の漫画おすすめランキング</h1>
          <p className="text-base md:text-lg leading-8 max-w-3xl" style={{ color: "#333" }}>
            ジャンプ＋、マガポケ、LINEマンガ、マンガワン、SNS、アニメ化・新刊情報などを参考に、今読まれている注目漫画を紹介します。昔からの名作だけではなく、アプリで追いやすい連載中作品、映像化で入口が増えた作品、口コミで伸びている作品を中心に選びました。
          </p>
        </header>

        <section className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">今本当に読まれているトレンド漫画とは？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p className="text-sm leading-7" style={{ color: "#555" }}>漫画アプリのランキングや更新日の反応で見つかりやすい作品は、読み始めるきっかけが多く、短期間で話題になりやすいです。</p>
            <p className="text-sm leading-7" style={{ color: "#555" }}>SNSで感想や考察が流れやすい作品は、キャラクター、展開、世界観のどれかに強い引きがあります。</p>
            <p className="text-sm leading-7" style={{ color: "#555" }}>アニメ化や新刊発売のタイミングでは、途中まで読んでいた人も新規読者も戻ってきやすくなります。</p>
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.id} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{section.heading}</h2>
            <p className="text-sm md:text-base leading-8 mb-7 max-w-3xl" style={{ color: "#555" }}>{section.lead}</p>
            <div className="space-y-5">
              {section.items.map((item) => {
                rank += 1;
                return <WorkCard key={item.title} item={item} index={rank - 1} />;
              })}
            </div>
          </section>
        ))}

        <section className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">迷ったら漫画診断で選ぶ</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>
            トレンド作品は勢いがありますが、必ずしも今の自分に合うとは限りません。重い話が苦手、恋愛多めがいい、完結済みだけ読みたいなどの条件がある場合は、診断で好みを絞り込むのがおすすめです。
          </p>
          <a href="/?start=1" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める</a>
        </section>

        <section className="p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.45)" }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-5">よくある質問</h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold mb-2">トレンド漫画はランキング上位から読めばいいですか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>まずは上位からで大丈夫です。ただし、ホラー、縦読み、青春、バトルなど読み味が大きく違うので、注意点も見て選ぶと外しにくくなります。</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">アプリで読む作品と紙で買う作品はどう分ければいいですか？</h3>
              <p className="text-sm leading-7" style={{ color: "#555" }}>縦読み系や更新を追いたい作品はアプリ、手元に残したい作品やまとめ読みしたい作品は紙・全巻セットが向いています。価格や在庫はリンク先で確認してください。</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
