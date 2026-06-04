// ============================================================
// 質問定義 — 2モード（シンプル6問 / 詳細12問）
// ============================================================


// ============================================================
// 質問定義 — 2モード（シンプル / 詳細）
// ============================================================
// SIMPLE: 6問 × 6択（こだわらない含む）→ サクッと
// DETAILED: 12問 × 12択（こだわらない含む）→ こだわり派
// ============================================================

export const QUESTIONS_SIMPLE = [
  { id: "setting", type: "multi", max: 2, text_ja: "どんな世界観が好き？（最大2つ）", text_en: "What kind of world? (max 2)", options: [
    { v: "modern", ja: "現代・日常", en: "Modern / everyday" },
    { v: "fantasy", ja: "ファンタジー・異世界", en: "Fantasy / other worlds" },
    { v: "sci_fi", ja: "SF・近未来", en: "Sci-fi / future" },
    { v: "historical", ja: "歴史・時代物", en: "Historical" },
    { v: "horror", ja: "ホラー・ダーク", en: "Horror / dark" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "elements", type: "multi", max: 2, text_ja: "どんな物語が読みたい？（最大2つ）", text_en: "What kind of story? (max 2)", options: [
    { v: "battle", ja: "バトル・アクション", en: "Battle / action" },
    { v: "romance", ja: "ロマンス・恋愛", en: "Romance" },
    { v: "mystery", ja: "ミステリー・謎解き", en: "Mystery" },
    { v: "self_discovery", ja: "成長・青春", en: "Growth / coming-of-age" },
    { v: "healing_story", ja: "日常・癒し", en: "Slice of life / healing" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "tone", type: "single", text_ja: "どんな雰囲気が気分？", text_en: "What mood?", options: [
    { v: "serious", ja: "シリアス・重厚", en: "Serious" },
    { v: "light_comedy", ja: "笑える・楽しい", en: "Fun / comedic" },
    { v: "dark", ja: "ダーク・刺激的", en: "Dark / intense" },
    { v: "healing", ja: "ほのぼの・癒し", en: "Heartwarming" },
    { v: "emotional", ja: "泣ける・感動", en: "Emotional" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "demographic", type: "single", text_ja: "どの層の漫画が好き？", text_en: "Which demographic?", options: [
    { v: "shonen", ja: "少年漫画（王道・熱血）", en: "Shonen" },
    { v: "shojo", ja: "少女漫画（恋愛・感情）", en: "Shojo" },
    { v: "seinen", ja: "青年漫画（大人向け）", en: "Seinen" },
    { v: "web", ja: "Web漫画・縦読み", en: "Webtoon" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "status", type: "single", text_ja: "完結・連載どっちがいい？", text_en: "Completed or ongoing?", options: [
    { v: "completed_only", ja: "完結済み（一気読み）", en: "Completed" },
    { v: "ongoing_only", ja: "連載中（リアタイ）", en: "Ongoing" },
    { v: "short", ja: "短め（サクッと読める）", en: "Short series" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "media", type: "single", text_ja: "アニメ化作品はどうする？", text_en: "Anime adaptation?", options: [
    { v: "anime_yes", ja: "アニメ化された有名作がいい", en: "Has anime" },
    { v: "anime_no", ja: "隠れた名作を発掘したい", en: "Hidden gems" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]}
];


// 詳細モード: 15問 × 15択（14具体 + こだわらない）
export const QUESTIONS_DETAILED = [
  { id: "setting", type: "multi", max: 3, text_ja: "惹かれる世界観は？（最大3つ）", text_en: "What worlds attract you? (max 3)", options: [
    { v: "modern", ja: "現代日常（学校・職場・街）", en: "Modern everyday life" },
    { v: "fantasy", ja: "ファンタジー・異世界（剣と魔法）", en: "Fantasy / other worlds" },
    { v: "sci_fi", ja: "SF・近未来・サイバー", en: "Sci-fi / cyber / future" },
    { v: "historical", ja: "歴史・時代物（和風）", en: "Historical (Japan)" },
    { v: "historical_west", ja: "歴史・時代物（西洋）", en: "Historical (Western)" },
    { v: "horror", ja: "ホラー・超常・オカルト", en: "Horror / supernatural / occult" },
    { v: "post_apocalypse", ja: "ポストアポカリプス・退廃世界", en: "Post-apocalyptic / dystopian" },
    { v: "virtual", ja: "バーチャル・ゲーム世界", en: "Virtual / game worlds" },
    { v: "school", ja: "学園もの", en: "School setting" },
    { v: "nature", ja: "自然・田舎・辺境", en: "Nature / rural / frontier" },
    { v: "urban_fantasy", ja: "現代＋異能（アーバンファンタジー）", en: "Urban fantasy" },
    { v: "space", ja: "宇宙・スペースオペラ", en: "Space / space opera" },
    { v: "mythology", ja: "神話・伝説・民話", en: "Mythology / folklore" },
    { v: "workplace", ja: "特定の職場・業界", en: "Specific workplace / industry" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "elements", type: "multi", max: 3, text_ja: "物語の中心要素は？（最大3つ）", text_en: "Central story elements? (max 3)", options: [
    { v: "battle", ja: "バトル・対決", en: "Battle / combat" },
    { v: "mystery", ja: "ミステリー・謎解き", en: "Mystery / puzzles" },
    { v: "romance", ja: "ロマンス・人間関係", en: "Romance / relationships" },
    { v: "self_discovery", ja: "成長・自己探求", en: "Growth / self-discovery" },
    { v: "sports", ja: "スポーツ・競技", en: "Sports / competition" },
    { v: "survival", ja: "サバイバル・生き残り", en: "Survival" },
    { v: "specialty", ja: "グルメ・職業・専門もの", en: "Food / profession / niche" },
    { v: "revenge", ja: "復讐・因縁", en: "Revenge / vendetta" },
    { v: "politics", ja: "政治・権力闘争", en: "Politics / power struggle" },
    { v: "friendship", ja: "友情・絆", en: "Friendship / bonds" },
    { v: "adventure", ja: "冒険・探検", en: "Adventure / exploration" },
    { v: "mystery_supernatural", ja: "怪異・あやかし", en: "Spirits / supernatural beings" },
    { v: "war", ja: "戦争・軍記", en: "War / military" },
    { v: "money", ja: "頭脳ゲーム・ギャンブル・商売", en: "Mind games / gambling / business" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "tone", type: "single", text_ja: "全体のトーンは？", text_en: "Overall tone?", options: [
    { v: "serious", ja: "シリアス・重厚", en: "Serious / heavy" },
    { v: "light_comedy", ja: "ライト・コメディ", en: "Light / comedic" },
    { v: "dark", ja: "ダーク・サイコ", en: "Dark / psychological" },
    { v: "healing", ja: "ほのぼの・癒し", en: "Healing / calming" },
    { v: "chaos", ja: "不条理・カオス", en: "Absurd / chaotic" },
    { v: "emotional", ja: "エモーショナル・泣ける", en: "Emotional / tearjerker" },
    { v: "burning", ja: "熱血・燃える", en: "Burning / passionate" },
    { v: "melancholic", ja: "メランコリック・物悲しい", en: "Melancholic / wistful" },
    { v: "tense", ja: "緊張感・スリリング", en: "Tense / thrilling" },
    { v: "wholesome", ja: "前向き・爽やか", en: "Wholesome / refreshing" },
    { v: "satirical", ja: "風刺・皮肉", en: "Satirical / ironic" },
    { v: "mysterious", ja: "ミステリアス・幻想的", en: "Mysterious / dreamlike" },
    { v: "warm", ja: "温かい・優しい", en: "Warm / gentle" },
    { v: "brutal", ja: "過激・残酷", en: "Brutal / harsh" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "scale", type: "single", text_ja: "物語の広がりはどれくらいがいい？", text_en: "How wide should the story feel?", options: [
    { v: "world", ja: "世界・宇宙規模", en: "World / cosmic scale" },
    { v: "nation", ja: "国家・組織レベル", en: "Nation / organization" },
    { v: "city", ja: "街・コミュニティが舞台", en: "City / community" },
    { v: "school", ja: "学校・職場の人間関係", en: "School / workplace" },
    { v: "intimate", ja: "数人の親密な関係", en: "Small intimate group" },
    { v: "internal", ja: "個人の内面・自分との戦い", en: "Internal / self" },
    { v: "family", ja: "家族・ホーム規模", en: "Family / home" },
    { v: "multiverse", ja: "多次元・時空を超える", en: "Multiverse / across time" },
    { v: "battlefield", ja: "戦場・戦争規模", en: "Battlefield / war" },
    { v: "small_town", ja: "村・小さな町", en: "Village / small town" },
    { v: "workplace_pro", ja: "特定の職業・業界", en: "Specific profession / industry" },
    { v: "underworld", ja: "裏社会・アングラ", en: "Criminal underworld" },
    { v: "one_building", ja: "ひとつの建物・密室", en: "Single building / confined" },
    { v: "global_travel", ja: "世界各地を巡る", en: "Globe-trotting" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "protagonist", type: "single", text_ja: "主人公の型は？", text_en: "Protagonist type?", options: [
    { v: "prodigy", ja: "最初から強い天才型", en: "Genius / prodigy" },
    { v: "underdog_growth", ja: "弱小から這い上がる王道型", en: "Underdog who grows" },
    { v: "ordinary_extraordinary", ja: "凡人が異常事態に巻き込まれる型", en: "Ordinary person, extraordinary events" },
    { v: "anti_hero", ja: "アンチヒーロー・規格外型", en: "Anti-hero / unconventional" },
    { v: "group", ja: "集団・チーム主人公", en: "Ensemble / team" },
    { v: "everyman", ja: "等身大の普通の人", en: "Relatable everyman" },
    { v: "female", ja: "女性主人公・少女視点", en: "Female lead" },
    { v: "villain_pov", ja: "悪役・敵側視点", en: "Villain / antagonist POV" },
    { v: "child", ja: "子供主人公", en: "Child protagonist" },
    { v: "adult", ja: "大人・社会人主人公", en: "Adult / working protagonist" },
    { v: "nonhuman", ja: "人外・動物・AI主人公", en: "Non-human / animal / AI" },
    { v: "duo", ja: "凸凹コンビ・バディ", en: "Buddy / duo" },
    { v: "elderly", ja: "老人・ベテラン主人公", en: "Elderly / veteran" },
    { v: "multiple", ja: "視点が切り替わる複数主人公", en: "Multiple shifting protagonists" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "relationship", type: "single", text_ja: "人間関係の描写は？", text_en: "Relationship dynamics?", options: [
    { v: "friendship", ja: "熱い友情・仲間", en: "Strong friendship / comrades" },
    { v: "rivalry", ja: "ライバル・好敵手", en: "Rivalry" },
    { v: "romance_sweet", ja: "甘い恋愛", en: "Sweet romance" },
    { v: "romance_complex", ja: "複雑な恋愛・三角関係", en: "Complex / love triangles" },
    { v: "family_bond", ja: "家族の絆", en: "Family bonds" },
    { v: "mentor", ja: "師弟・指導関係", en: "Mentor / apprentice" },
    { v: "found_family", ja: "疑似家族・拾われた絆", en: "Found family" },
    { v: "solo", ja: "孤独・一匹狼", en: "Solitary / lone wolf" },
    { v: "ensemble_cast", ja: "大人数の群像", en: "Large ensemble cast" },
    { v: "enemies", ja: "敵対から関係が変わる", en: "Enemies-to-allies" },
    { v: "team", ja: "チームワーク", en: "Teamwork" },
    { v: "generational", ja: "世代を超えた関係", en: "Across generations" },
    { v: "tragic_bond", ja: "切ない・報われない関係", en: "Tragic / unrequited" },
    { v: "duo_buddy", ja: "凸凹バディ", en: "Mismatched buddies" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]}
,
  { id: "structure", type: "single", text_ja: "どんな展開の漫画が読みたい？", text_en: "What kind of story flow do you want?", options: [
    { v: "long_arc", ja: "一本軸の長編冒険", en: "Long single arc" },
    { v: "episodic", ja: "エピソード完結型の連作", en: "Episodic / self-contained" },
    { v: "slice_of_life", ja: "スライス・オブ・ライフ（日常切り取り）", en: "Slice of life" },
    { v: "ensemble", ja: "群像劇・多視点", en: "Ensemble / multi-POV" },
    { v: "time_loop", ja: "ループ・タイムリープ系", en: "Time loop / time travel" },
    { v: "anthology", ja: "短編集・オムニバス", en: "Anthology / short stories" },
    { v: "twist", ja: "章ごとに大きく変わる展開型", en: "Major reinvention per arc" },
    { v: "mystery_box", ja: "謎が徐々に解ける構成", en: "Slowly unraveling mystery" },
    { v: "tournament", ja: "トーナメント・段階突破型", en: "Tournament / stage progression" },
    { v: "journey", ja: "旅・ロードムービー型", en: "Journey / road trip" },
    { v: "daily_buildup", ja: "日常の積み重ね型", en: "Daily life accumulation" },
    { v: "flashback", ja: "回想・過去軸交差型", en: "Flashback-driven" },
    { v: "parallel", ja: "並行する複数ストーリー", en: "Parallel storylines" },
    { v: "buildup_climax", ja: "終盤に向け加速する型", en: "Builds toward a big climax" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "pacing", type: "single", text_ja: "読むテンポの好みは？", text_en: "Reading pace preference?", options: [
    { v: "page_turner", ja: "一気読みしたくなる中毒性", en: "Addictive page-turner" },
    { v: "savor", ja: "じっくり味わう", en: "Slow and savory" },
    { v: "light_read", ja: "サクッと軽く読める", en: "Light and breezy" },
    { v: "dense", ja: "情報密度が濃い・読み応え", en: "Dense and meaty" },
    { v: "binge", ja: "話が気になって止まらない", en: "Can't-stop cliffhangers" },
    { v: "relaxing", ja: "リラックスして読める", en: "Relaxing" },
    { v: "intense", ja: "常に緊張感がある", en: "Constant tension" },
    { v: "episodic_easy", ja: "どこから読んでもOK", en: "Jump in anywhere" },
    { v: "emotional_rollercoaster", ja: "感情を揺さぶられる", en: "Emotional rollercoaster" },
    { v: "thoughtful", ja: "考えながら読む", en: "Thought-provoking" },
    { v: "comfort_reread", ja: "何度も読み返したくなる", en: "Re-readable comfort" },
    { v: "quick_hit", ja: "短時間で満足感", en: "Quick satisfying hit" },
    { v: "slow_build", ja: "じわじわ盛り上がる", en: "Slow burn build-up" },
    { v: "varied", ja: "緩急があって飽きない", en: "Varied rhythm" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "depth", type: "single", text_ja: "テーマの深さ・性質は？", text_en: "Theme depth?", options: [
    { v: "philosophical", ja: "哲学的・思索的", en: "Philosophical" },
    { v: "social", ja: "社会派（社会問題を扱う）", en: "Social commentary" },
    { v: "human_drama", ja: "人間ドラマ中心", en: "Human drama" },
    { v: "entertainment", ja: "エンタメ優先（深く考えず楽しむ）", en: "Pure entertainment" },
    { v: "educational", ja: "教養・知識が得られる", en: "Educational / informative" },
    { v: "psychological", ja: "心理戦・頭脳戦中心", en: "Mind games / strategy" },
    { v: "mixed", ja: "重さと軽さのミックス", en: "Mix of light and heavy" },
    { v: "existential", ja: "生死・実存を問う", en: "Life, death, existence" },
    { v: "emotional_catharsis", ja: "感情の浄化・カタルシス", en: "Emotional catharsis" },
    { v: "worldbuilding", ja: "緻密な世界観・設定", en: "Deep worldbuilding" },
    { v: "comfort", ja: "癒し・現実逃避", en: "Comfort / escapism" },
    { v: "moral", ja: "倫理・正義を問う", en: "Morality / justice" },
    { v: "coming_of_age", ja: "青春・成長の痛み", en: "Coming-of-age pains" },
    { v: "family_theme", ja: "家族・絆をめぐる", en: "Family / bonds" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "presentation", type: "multi", max: 2, text_ja: "演出スタイルは？（最大2つ）", text_en: "Presentation style? (max 2)", options: [
    { v: "action", ja: "アクション・派手な見せ場", en: "Action / spectacle" },
    { v: "psychological", ja: "心理描写・モノローグ重視", en: "Psychological / monologue" },
    { v: "atmosphere", ja: "雰囲気・空気感重視", en: "Atmosphere / mood" },
    { v: "comedy_gag", ja: "ギャグ・テンポ重視", en: "Comedy / pacing" },
    { v: "suspense", ja: "緊迫感・サスペンス重視", en: "Suspense / tension" },
    { v: "dialogue", ja: "セリフ・会話劇重視", en: "Dialogue-driven" },
    { v: "visual", ja: "視覚演出・画面構成重視", en: "Visual composition" },
    { v: "emotional_scenes", ja: "感動シーン・泣かせ重視", en: "Emotional / tearjerking scenes" },
    { v: "worldbuilding_detail", ja: "世界設定・ディテール重視", en: "Worldbuilding detail" },
    { v: "romance_tension", ja: "恋愛のときめき重視", en: "Romantic tension" },
    { v: "slow_burn", ja: "じっくり・スローテンポ", en: "Slow burn / deliberate pace" },
    { v: "fast_paced", ja: "テンポ良くサクサク", en: "Fast-paced" },
    { v: "shock", ja: "衝撃・どんでん返し重視", en: "Shock / plot twists" },
    { v: "realism", ja: "リアリティ・細部の説得力", en: "Realism / authenticity" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "art", type: "multi", max: 2, text_ja: "絵の雰囲気はどんな感じが好き？（最大2つ）", text_en: "What kind of art mood do you like? (max 2)", options: [
    { v: "detailed", ja: "美麗・繊細な描き込み系", en: "Detailed / refined" },
    { v: "unique", ja: "個性的・癖の強い作家性", en: "Distinctive / auteur" },
    { v: "shonen_classic", ja: "王道の少年漫画タッチ", en: "Classic shonen style" },
    { v: "shojo_kirakira", ja: "少女漫画系（華やか）", en: "Shojo / sparkly" },
    { v: "refined", ja: "シンプル・洗練・モダン", en: "Clean / modern / minimalist" },
    { v: "realistic", ja: "劇画・写実的でリアル", en: "Realistic / gekiga" },
    { v: "loose", ja: "ゆるい・絵本タッチ", en: "Loose / picture book" },
    { v: "cute", ja: "可愛い・デフォルメ系", en: "Cute / chibi" },
    { v: "retro", ja: "レトロ・古典的タッチ", en: "Retro / classic touch" },
    { v: "dynamic", ja: "ダイナミック・迫力系", en: "Dynamic / powerful" },
    { v: "webtoon_color", ja: "フルカラー・縦読み系", en: "Full color / webtoon" },
    { v: "dark_art", ja: "陰影が濃い・ダークな絵", en: "Heavy shadows / dark art" },
    { v: "soft", ja: "柔らかい・水彩タッチ", en: "Soft / watercolor" },
    { v: "sketchy", ja: "荒々しい・ラフな線", en: "Rough / sketchy lines" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "demographic", type: "multi", max: 2, text_ja: "どの漫画カテゴリから探したい？（最大2つ）", text_en: "Which manga categories should we search? (max 2)", options: [
    { v: "shonen", ja: "少年漫画（ジャンプ・サンデー系）", en: "Shonen (boys')" },
    { v: "shojo", ja: "少女漫画（恋愛・感情系）", en: "Shojo (girls')" },
    { v: "seinen", ja: "青年漫画（複雑・大人向け）", en: "Seinen (young men)" },
    { v: "josei", ja: "女性漫画（成人女性向け）", en: "Josei (adult women)" },
    { v: "web", ja: "Web漫画・縦読み（韓国系含む）", en: "Webtoons / vertical" },
    { v: "indie", ja: "同人・インディー系", en: "Indie / doujin" },
    { v: "classic", ja: "古典・クラシック（90年代以前）", en: "Classic (pre-2000s)" },
    { v: "kodomo", ja: "児童・子供向け", en: "Children's" },
    { v: "gekiga", ja: "劇画・大人の読み物", en: "Gekiga / mature literary" },
    { v: "4koma", ja: "4コマ・ギャグ専門", en: "4-panel / gag" },
    { v: "bl_gl", ja: "BL・GL", en: "BL / GL" },
    { v: "shonen_modern", ja: "現代の話題作（2020年代）", en: "Recent hits (2020s)" },
    { v: "alt", ja: "オルタナティブ・芸術系", en: "Alternative / art manga" },
    { v: "overseas", ja: "海外コミック（米・仏など）", en: "Overseas comics (US/EU)" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "status", type: "multi", max: 2, text_ja: "連載・完結ステータスの好み（最大2つ）", text_en: "Completion status? (max 2)", options: [
    { v: "completed_only", ja: "完結済みのみ", en: "Completed only" },
    { v: "ongoing_only", ja: "連載中のみ", en: "Ongoing only" },
    { v: "short", ja: "短期完結（5巻以下）", en: "Short (≤5 vol)" },
    { v: "medium", ja: "中期完結（5〜15巻）", en: "Medium (5-15 vol)" },
    { v: "long", ja: "長期完結（15〜40巻）", en: "Long (15-40 vol)" },
    { v: "epic", ja: "超長編（40巻以上）", en: "Epic (40+ vol)" },
    { v: "new", ja: "始まったばかりの新作", en: "Brand new" },
    { v: "ending", ja: "完結間近・最終章突入", en: "Near completion" },
    { v: "oneshot", ja: "読み切り・1巻完結", en: "One-shot / single volume" },
    { v: "long_running", ja: "超長期連載（10年以上）", en: "Very long-running (10+ years)" },
    { v: "hiatus_ok", ja: "休載中でも気にしない", en: "OK with hiatus" },
    { v: "recently_ended", ja: "最近完結した話題作", en: "Recently completed hits" },
    { v: "weekly", ja: "週刊連載のテンポ感", en: "Weekly serialization pace" },
    { v: "monthly", ja: "月刊・じっくり連載", en: "Monthly / slow serialization" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "media", type: "multi", max: 2, text_ja: "話題性や知名度はどれくらい重視する？（最大2つ）", text_en: "How much do buzz and recognition matter? (max 2)", options: [
    { v: "anime_yes", ja: "アニメ化されている作品", en: "Has anime" },
    { v: "anime_no", ja: "アニメ化されていない隠れた名作", en: "No anime / hidden gem" },
    { v: "live_action", ja: "実写映画・ドラマ化されている", en: "Has live action" },
    { v: "award", ja: "受賞歴のある作品", en: "Award winner" },
    { v: "global", ja: "海外でも人気", en: "Popular abroad" },
    { v: "viral", ja: "SNSで話題になっている新作", en: "Viral on social media" },
    { v: "critic", ja: "評論家から高く評価", en: "Critically acclaimed" },
    { v: "cult", ja: "カルト的人気・知る人ぞ知る", en: "Cult following" },
    { v: "bestseller", ja: "ベストセラー・国民的", en: "Bestseller / national hit" },
    { v: "legendary", ja: "歴史的名作・レジェンド", en: "Legendary classic" },
    { v: "underground", ja: "アングラ・実験的", en: "Underground / experimental" },
    { v: "game", ja: "ゲーム化されている", en: "Has game adaptation" },
    { v: "movie_anime", ja: "劇場アニメがある", en: "Has anime film" },
    { v: "trending_now", ja: "今まさに旬の作品", en: "Trending right now" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "ending", type: "single", text_ja: "読み終わったあと、どんな気持ちになりたい？", text_en: "How do you want to feel after reading?", options: [
    { v: "happy", ja: "ハッピーエンド", en: "Happy ending" },
    { v: "bittersweet", ja: "ほろ苦い・切ない", en: "Bittersweet" },
    { v: "rewarding", ja: "報われる・スッキリ", en: "Rewarding / satisfying" },
    { v: "open", ja: "余韻が残る・解釈に委ねる", en: "Open / ambiguous" },
    { v: "shocking", ja: "衝撃的・予想外", en: "Shocking / unexpected" },
    { v: "cathartic", ja: "涙を流してスッキリ", en: "Tearful catharsis" },
    { v: "thought", ja: "考えさせられる", en: "Thought-provoking" },
    { v: "uplifting", ja: "前向きになれる", en: "Uplifting" },
    { v: "tragic", ja: "悲劇でも美しい", en: "Beautiful tragedy" },
    { v: "warm", ja: "心が温まる", en: "Heartwarming" },
    { v: "epic_finale", ja: "壮大なフィナーレ", en: "Epic grand finale" },
    { v: "realistic_end", ja: "リアルで等身大", en: "Realistic / grounded" },
    { v: "hopeful", ja: "希望が見える", en: "Hopeful" },
    { v: "no_spoiler", ja: "結末は気にしない", en: "Don't care about ending" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]}
];
