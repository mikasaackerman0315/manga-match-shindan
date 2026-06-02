# 漫画DB 監査サマリー

最終生成日: 2026-06-02

## 全体

- 合計作品数: 1500
- ユニークID数: 1500
- 重複IDグループ: 0
- タイトル重複候補グループ: 106
- 巻数未確認作品: 371

## ファイル別件数

- src/data/coreDB.js: 207
- src/data/coreDB_extra.js: 193
- src/data/coreDB_extra2.js: 600
- src/data/coreDB_extra3.js: 500

## デモグラフィック別件数

- shonen: 353
- seinen: 684
- shojo: 190
- josei: 55
- web: 215
- kodomo: 3

## ステータス別件数

- ongoing: 417
- completed: 1060
- hiatus: 23

## タイトル重複候補

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

## 巻数未確認

ファイル別:

- src/data/coreDB_extra.js: 8
- src/data/coreDB_extra2.js: 194
- src/data/coreDB_extra3.js: 161
- src/data/coreDB.js: 8

デモグラフィック別:

- web: 151
- seinen: 148
- josei: 8
- shonen: 50
- shojo: 14

## 出力ファイル

- `docs/db-audit-duplicate-titles.csv`
- `docs/db-audit-unknown-volumes.csv`

## 次にやると効果が大きいこと

1. high のタイトル重複候補を確認し、完全重複なら片方を別作品に差し替える。
2. 人気作、SEO記事掲載作、テーマ記事掲載作の巻数未確認を優先して埋める。
3. Webtoonや連載中で巻数が固定しづらい作品は、巻数0を許容する運用対象として残す。
