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
  { id: "demographic", type: "multi", max: 2, text_ja: "寄せたい漫画のタイプは？（最大2つ）", text_en: "What manga type should this lean toward? (max 2)", options: [
    { v: "type_shonen", ja: "王道少年漫画っぽい作品", en: "Classic shonen energy" },
    { v: "type_shojo", ja: "少女漫画・恋愛漫画寄り", en: "Shojo or romance-leaning" },
    { v: "type_adult", ja: "大人向け・青年漫画寄り", en: "Mature seinen/josei leaning" },
    { v: "type_web", ja: "Web漫画・アプリ漫画っぽい作品", en: "Web/app manga feeling" },
    { v: "type_classic", ja: "定番・古典名作寄り", en: "Classic and established works" },
    { v: "type_niche", ja: "ニッチ・隠れた名作寄り", en: "Niche or hidden gems" },
    { v: "type_literary", ja: "文学的・考察向きの作品", en: "Literary or analytical works" },
    { v: "type_josei", ja: "女性向け・生活感のある作品", en: "Josei or life-focused works" },
    { v: "type_seinen_real", ja: "リアル寄りの青年漫画", en: "Grounded seinen works" },
    { v: "type_family", ja: "家族でも入りやすい作品", en: "Family-friendly works" },
    { v: "type_sports", ja: "スポーツ・部活漫画寄り", en: "Sports or club manga" },
    { v: "type_horror", ja: "ホラー・サスペンス寄り", en: "Horror or suspense leaning" },
    { v: "type_specialty", ja: "仕事・料理・専門もの寄り", en: "Work, food, or specialist manga" },
    { v: "type_app_trend", ja: "アプリで読まれやすい今どき作品", en: "Modern app-friendly hits" },
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
  { id: "media", type: "multi", max: 2, text_ja: "作品の知名度はどれくらいがいい？（最大2つ）", text_en: "How well-known should the manga be? (max 2)", options: [
    { v: "fame_famous", ja: "まずは超有名作から知りたい", en: "Start with very famous works" },
    { v: "fame_trending", ja: "今話題の作品を知りたい", en: "I want current trending works" },
    { v: "fame_hidden", ja: "隠れた名作を掘りたい", en: "I want hidden gems" },
    { v: "fame_anime", ja: "アニメ化済みで入りやすい作品", en: "Anime-adapted and easy to enter" },
    { v: "fame_undiscovered", ja: "まだあまり掘られていない作品", en: "Less-explored works" },
    { v: "fame_acclaimed", ja: "評価や受賞歴がある作品", en: "Acclaimed or award-recognized works" },
    { v: "fame_cult", ja: "刺さる人には深く刺さる作品", en: "Cult favorites for the right reader" },
    { v: "fame_bestseller", ja: "売れている作品を優先したい", en: "Bestsellers first" },
    { v: "fame_global", ja: "海外でも読まれている作品", en: "Globally popular works" },
    { v: "fame_viral", ja: "SNSで話題になりやすい作品", en: "Social-media buzz" },
    { v: "fame_newcomer", ja: "新しめの注目作を知りたい", en: "Newer rising works" },
    { v: "fame_long_running", ja: "長く愛されている作品", en: "Long-running favorites" },
    { v: "fame_critic", ja: "批評家評価の高い作品", en: "Critically respected works" },
    { v: "fame_media_mix", ja: "映像化・メディア展開がある作品", en: "Media-mix friendly works" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "scale", type: "single", text_ja: "どんな没入感がほしい？", text_en: "What kind of immersion do you want?", options: [
    { v: "immersion_world", ja: "壮大な世界に浸りたい", en: "A vast world to sink into" },
    { v: "immersion_intimate", ja: "身近な人間関係をじっくり見たい", en: "Close relationships and human drama" },
    { v: "immersion_incident", ja: "事件や謎に巻き込まれたい", en: "Incidents, danger, and mysteries" },
    { v: "immersion_journey", ja: "旅や冒険を一緒に味わいたい", en: "A journey or adventure" },
    { v: "immersion_workplace", ja: "職業や業界の裏側を覗きたい", en: "A profession or industry from the inside" },
    { v: "immersion_internal", ja: "主人公の内面に深く潜りたい", en: "A deep dive into the protagonist's inner life" },
    { v: "immersion_city", ja: "街や社会の空気に入りたい", en: "City life and social texture" },
    { v: "immersion_battlefield", ja: "戦場や極限状況に入りたい", en: "Battlefields and extreme situations" },
    { v: "immersion_underworld", ja: "裏社会や危ない場所を覗きたい", en: "The underworld and dangerous places" },
    { v: "immersion_family", ja: "家族や生活の距離感を味わいたい", en: "Family life and close everyday bonds" },
    { v: "immersion_small_town", ja: "小さな町や共同体に浸りたい", en: "Small towns and close communities" },
    { v: "immersion_global", ja: "国や世界をまたぐスケールがいい", en: "A national or global scale" },
    { v: "immersion_political", ja: "権力や組織の中に入りたい", en: "Power, systems, and organizations" },
    { v: "immersion_survival", ja: "生き残る緊張感を味わいたい", en: "Survival pressure and danger" },
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
  ]},
  { id: "structure", type: "single", text_ja: "読み進める快感はどれが好き？", text_en: "What kind of reading thrill do you like?", options: [
    { v: "reading_foreshadow", ja: "伏線があとで回収される快感", en: "Foreshadowing that pays off later" },
    { v: "reading_twist", ja: "どんでん返しで驚きたい", en: "Big twists and surprises" },
    { v: "reading_slow_build", ja: "じわじわ積み上がる物語が好き", en: "Slow buildup that grows richer" },
    { v: "reading_episodic", ja: "1話ごとに区切りよく読みたい", en: "Episodic stories that are easy to enter" },
    { v: "reading_growth", ja: "成長や勝ち上がりを追いたい", en: "Growth, rivalry, and progression" },
    { v: "reading_mystery_box", ja: "謎が少しずつ深まる話が好き", en: "Mysteries that deepen piece by piece" },
    { v: "reading_long_arc", ja: "長い章で大きく盛り上がってほしい", en: "Long arcs with big payoffs" },
    { v: "reading_parallel", ja: "複数視点が絡む構成が好き", en: "Parallel viewpoints that interlock" },
    { v: "reading_tournament", ja: "対決や勝ち抜きの熱さがほしい", en: "Tournament-like escalation" },
    { v: "reading_anthology", ja: "短編や連作で味わいたい", en: "Short stories or linked episodes" },
    { v: "reading_flashback", ja: "過去が少しずつ見える話が好き", en: "Past events revealed over time" },
    { v: "reading_daily_buildup", ja: "日常の積み重ねで深まってほしい", en: "Everyday buildup that gains meaning" },
    { v: "reading_strategy", ja: "駆け引きや作戦で読ませてほしい", en: "Strategy and mind games" },
    { v: "reading_journey", ja: "目的地へ進むロードムービー感が好き", en: "A journey toward a clear destination" },
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
  { id: "art", type: "multi", max: 2, text_ja: "絵で重視したいものは？（最大2つ）", text_en: "What matters most in the art? (max 2)", options: [
    { v: "art_beauty", ja: "綺麗さ・美しさ", en: "Beauty and polish" },
    { v: "art_power", ja: "迫力・アクションの強さ", en: "Powerful action and impact" },
    { v: "art_readable", ja: "読みやすさ・見やすさ", en: "Clarity and readability" },
    { v: "art_unique", ja: "個性・癖の強さ", en: "Distinctive personality" },
    { v: "art_realistic", ja: "リアルさ・重み", en: "Realism and weight" },
    { v: "art_cute", ja: "かわいさ・柔らかさ", en: "Cuteness and softness" },
    { v: "art_dark", ja: "暗さ・陰影・不穏さ", en: "Darkness, shadows, and unease" },
    { v: "art_soft", ja: "優しい空気感", en: "A gentle visual atmosphere" },
    { v: "art_detailed", ja: "描き込みの細かさ", en: "Dense detail" },
    { v: "art_refined", ja: "洗練された画面", en: "Refined composition" },
    { v: "art_retro", ja: "古さやレトロ感", en: "Retro flavor" },
    { v: "art_loose", ja: "ラフで抜け感のある絵", en: "Loose and relaxed art" },
    { v: "art_dynamic", ja: "動きのある構図", en: "Dynamic paneling" },
    { v: "art_webtoon", ja: "カラーや縦読みの見やすさ", en: "Color or webtoon readability" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]},
  { id: "ending", type: "single", text_ja: "読み終わったあと何が残ってほしい？", text_en: "What should stay with you after reading?", options: [
    { v: "after_clear", ja: "スッキリした満足感", en: "Clear satisfaction" },
    { v: "after_cry", ja: "泣ける感情の余韻", en: "A tearful emotional afterglow" },
    { v: "after_think", ja: "考えさせられる問い", en: "Questions to think about" },
    { v: "after_energy", ja: "元気や前向きさ", en: "Energy and encouragement" },
    { v: "after_lingering", ja: "しばらく残る余韻", en: "A lingering aftertaste" },
    { v: "after_shock", ja: "衝撃や驚き", en: "Shock and surprise" },
    { v: "after_warm", ja: "心が温まる感じ", en: "A warm feeling" },
    { v: "after_bitter", ja: "苦く切ない余韻", en: "A bittersweet aftertaste" },
    { v: "after_hope", ja: "希望が残る読後感", en: "A hopeful feeling" },
    { v: "after_catharsis", ja: "感情が解放される感じ", en: "Cathartic release" },
    { v: "after_realistic", ja: "現実味のある納得感", en: "Grounded realism" },
    { v: "after_epic", ja: "大作を読み切った達成感", en: "Epic completion" },
    { v: "after_comfort", ja: "また戻りたくなる安心感", en: "Comfort worth returning to" },
    { v: "after_unsettled", ja: "不穏さやざわつき", en: "An unsettling residue" },
    { v: "any", ja: "こだわらない", en: "No preference" }
  ]}
];
