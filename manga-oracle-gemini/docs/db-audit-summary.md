# 漫画DB品質監査サマリー

生成日: 2026-06-04

## 全体
- 生DB件数: 1800
- ユニークID数: 1800
- タイトル正規化後の候補数: 1692
- ID重複グループ: 0
- タイトル重複グループ: 106
- 巻数未確認または異常値: 540

## ファイル別件数

- src/data/coreDB.js: 207
- src/data/coreDB_extra.js: 193
- src/data/coreDB_extra2.js: 600
- src/data/coreDB_extra3.js: 500
- src/data/coreDB_extra4.js: 300

## デモグラフィック別件数

- shonen: 501
- seinen: 818
- shojo: 204
- josei: 59
- web: 215
- kodomo: 3

## ステータス別件数

- ongoing: 587
- completed: 1188
- hiatus: 25

## タイトル重複の優先度
- high: 105
- medium: 1
- low: 0

優先度の目安:

- high: タイトル、作者、開始年が同じ。完全重複の可能性が高い。
- medium: タイトルまたは作者が同じ。表記ゆれ、続編、関連作の確認が必要。
- low: 正規化後のタイトルだけが一致。誤検出の可能性もある。

### 優先確認リスト 上位20件

1. [high] プルトウ (3件): プルートウ / pluto_x / src/data/coreDB_extra.js#187; プルートウ / pluto / src/data/coreDB.js#88; プルートウ / pluto_2 / src/data/coreDB.js#202
2. [high] るろうに剣心 (2件): るろうに剣心 / rurouni_kenshin / src/data/coreDB.js#15; るろうに剣心 / rurouni_kenshin2 / src/data/coreDB.js#94
3. [high] サムライ8八丸伝 (2件): サムライ8 八丸伝 / samurai_8_extra / src/data/coreDB_extra.js#19; サムライ8 八丸伝 / samurai_8 / src/data/coreDB.js#16
4. [high] 青の祓魔師 (2件): 青の祓魔師 / blue_exorcist_x / src/data/coreDB_extra.js#20; 青の祓魔師 / blue_exorcist / src/data/coreDB.js#24
5. [high] ソウルイタ (2件): ソウルイーター / soul_eater_x / src/data/coreDB_extra.js#21; ソウルイーター / soul_eater / src/data/coreDB.js#25
6. [high] ブルロック (2件): ブルーロック / blue_lock / src/data/coreDB.js#26; ブルーロック / blue_lock2 / src/data/coreDB.js#109
7. [high] キングダム (2件): キングダム / kingdom_x / src/data/coreDB_extra.js#22; キングダム / kingdom / src/data/coreDB.js#27
8. [high] シグルイ (2件): シグルイ / samurai_x / src/data/coreDB.js#28; シグルイ / shigurui / src/data/coreDB.js#97
9. [high] 魔法使いの嫁 (2件): 魔法使いの嫁 / magus_no_yome / src/data/coreDB_extra.js#25; 魔法使いの嫁 / magus_bride / src/data/coreDB.js#30
10. [high] 東京喰種 (2件): 東京喰種 / tokyo_ghoul_x / src/data/coreDB_extra.js#191; 東京喰種 / tokyo_ghoul / src/data/coreDB.js#31
11. [high] ベルセルク (2件): ベルセルク / berserk_x / src/data/coreDB_extra.js#190; ベルセルク / berserk / src/data/coreDB.js#32
12. [high] monster (2件): MONSTER / monster_x / src/data/coreDB_extra.js#186; MONSTER / monster / src/data/coreDB.js#36
13. [high] deathnote (2件): DEATH NOTE / death_note_x / src/data/coreDB_extra.js#189; DEATH NOTE / deathnote / src/data/coreDB.js#39
14. [high] 約束のネバランド (2件): 約束のネバーランド / promised_neverland_x / src/data/coreDB_extra.js#185; 約束のネバーランド / promised_neverland / src/data/coreDB.js#42
15. [high] btooom (2件): BTOOOM! / btooom_x / src/data/coreDB_extra.js#37; BTOOOM! / btooom / src/data/coreDB.js#43
16. [high] 漂流教室 (2件): 漂流教室 / drifting_classroom_x / src/data/coreDB_extra.js#39; 漂流教室 / drifting_classroom / src/data/coreDB.js#48
17. [high] バトルロワイアル (2件): バトル・ロワイアル / battle_royale_x / src/data/coreDB_extra.js#184; バトル・ロワイアル / battle_royale / src/data/coreDB.js#50
18. [high] 亜人 (2件): 亜人 / ajin_x / src/data/coreDB_extra.js#38; 亜人 / ajin / src/data/coreDB.js#51
19. [high] biomega (2件): BIOMEGA / biomega_x / src/data/coreDB_extra.js#77; BIOMEGA / biomega / src/data/coreDB.js#52
20. [high] シドニアの騎士 (2件): シドニアの騎士 / sgz / src/data/coreDB.js#54; シドニアの騎士 / knights_sidonia_main / src/data/coreDB.js#90

## 巻数未確認または異常値

ファイル別:

- src/data/coreDB_extra.js: 8
- src/data/coreDB_extra2.js: 194
- src/data/coreDB_extra3.js: 161
- src/data/coreDB_extra4.js: 169
- src/data/coreDB.js: 8

デモグラフィック別:

- web: 151
- seinen: 238
- josei: 10
- shonen: 121
- shojo: 20

## 記事掲載作品とDBの一致

- exact_match: 233
- missing_or_variant: 52

### 記事側で確認したい作品 上位30件

1. 重版出来! (seo_article_card, src/app/adult-manga/page.jsx)
2. 働きマン (seo_article_card, src/app/adult-manga/page.jsx)
3. 東京喰種トーキョーグール (seo_article_card, src/app/binge-read-manga/page.jsx)
4. 七つの大罪 (seo_article_card, src/app/fantasy-manga/page.jsx)
5. うめともものふつうの暮らし (seo_article_card, src/app/healing-manga/page.jsx)
6. フードコートで、また明日。 (seo_article_card, src/app/healing-manga/page.jsx)
7. ラーメン赤猫 (seo_article_card, src/app/healing-manga/page.jsx)
8. 銀の匙 (seo_article_card, src/app/high-school-manga/page.jsx)
9. ガンニバル (seo_article_card, src/app/horror-manga/page.jsx)
10. ミスミソウ (seo_article_card, src/app/horror-manga/page.jsx)
11. 東京喰種トーキョーグール (seo_article_card, src/app/horror-manga/page.jsx)
12. しろくまカフェ (seo_article_card, src/app/lighthearted-manga/page.jsx)
13. 銀の匙 (seo_article_card, src/app/lighthearted-manga/page.jsx)
14. 銀の匙 (seo_article_card, src/app/middle-school-manga/page.jsx)
15. 聖母の断罪 (seo_article_card, src/app/mystery-manga/page.jsx)
16. 裏バイト:逃亡禁止 (seo_article_card, src/app/mystery-manga/page.jsx)
17. フードコートで、また明日。 (seo_article_card, src/app/new-manga-2020s/page.jsx)
18. classic (theme_article_card, src/app/page.jsx)
19. romance (theme_article_card, src/app/page.jsx)
20. sports (theme_article_card, src/app/page.jsx)
21. workplace (theme_article_card, src/app/page.jsx)
22. 恋は雨上がりのように (seo_article_card, src/app/romance-manga/page.jsx)
23. あさひなぐ (theme_article_card, src/app/themeData.js)
24. うめともものふつうの暮らし (theme_article_card, src/app/themeData.js)
25. ガンニバル (theme_article_card, src/app/themeData.js)
26. ハコヅメ (theme_article_card, src/app/themeData.js)
27. フードコートで、また明日。 (theme_article_card, src/app/themeData.js)
28. ミスミソウ (theme_article_card, src/app/themeData.js)
29. ラーメン赤猫 (theme_article_card, src/app/themeData.js)
30. 異世界黙示録マイノグーラ (theme_article_card, src/app/themeData.js)

## 出力ファイル

- `docs/db-audit-duplicate-titles.csv`
- `docs/db-audit-unknown-volumes.csv`
- `docs/db-audit-article-coverage.csv`

## 次にやると効果が大きいこと

1. high のタイトル重複を確認し、完全重複ならDBから除外する。
2. 記事掲載作品の missing_or_variant を見て、DB未登録なのか表記ゆれなのか確認する。
3. 巻数が0または250超の作品は、UIでは「巻数未確認」として扱いながら、人気記事掲載作品から順に補正する。
