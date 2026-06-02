# マンガマッチ診断 運用メモ

このメモは、公開後に「どこを見て、何を直すか」を迷わないための運用チェックリストです。

## 週1で見る数字

### GA4

- `diagnosis_start`
  - 診断開始数。
  - `diagnosis_type` で `simple` と `advanced` を比較する。
- `diagnosis_answer`
  - どの質問で離脱していそうかを見る。
  - `question_id` ごとのイベント数が急に減る場所を確認する。
- `diagnosis_complete`
  - 診断完了数。
  - `result_count` が少ないケース、`fallback_used` が多い日を確認する。
- `diagnosis_error`
  - 診断失敗数。
  - `error_type` が `api_error` に寄るならAPIや制限、`json_parse_error` に寄るならプロンプトを見直す。
- `affiliate_click_amazon`
  - Amazonクリック数。
  - `link_type` の `kindle` / `paper` / `search` を比較する。
- `affiliate_click_rakuten`
  - 楽天クリック数。
  - `link_type` の `set` / `books` / `search` を比較する。
- `theme_article_click`
  - 診断結果やホームからテーマ記事へ移動した数。
- `related_article_click`
  - SEO記事から別記事へ回遊した数。
  - `source_path` と `destination_path` を見て、強い記事同士の導線を残す。

## 目安にする率

- 診断開始率: ホーム訪問から `diagnosis_start` まで。
- 診断完了率: `diagnosis_complete / diagnosis_start`。
- アフィリエイトクリック率: `(affiliate_click_amazon + affiliate_click_rakuten) / diagnosis_complete`。
- 記事回遊率: `related_article_click / SEO記事閲覧数`。

最初は絶対値よりも、変更前後で改善しているかを見る。

## Search Console

週1で以下を見る。

- 検索パフォーマンスで表示回数が増えているクエリ
- 掲載順位が 8〜20 位のクエリ
- クリック率が低いページ

改善の優先順位:

1. 表示回数が多いのにクリック率が低いページのタイトルを調整する。
2. 8〜20位にいる記事へ内部リンクを増やす。
3. 検索語と本文がずれているページは、導入文と見出しを寄せる。

## DB品質チェック

通常チェック:

```bash
npm run check:db
```

詳細確認:

```bash
npm run check:db -- --details
```

厳格チェック:

```bash
npm run check:db:strict
```

現在のDBでは、巻数 `0` や重複候補が既存データに残っているため、通常チェックはレポート用途にしている。DBを整理する日に、詳細を見ながら少しずつ直す。

## 改善判断

- `fallback_used` が多い
  - Gemini APIの失敗、タイムアウト、JSON不安定を確認する。
- `diagnosis_answer` が途中で落ちる
  - その質問の選択肢数、文言、ボタン高さを見直す。
- Amazonクリックが少ない
  - Kindle / 紙 / 関連商品の文言を比較する。
- 楽天クリックが少ない
  - 全巻セットやポイント還元の補足文を強める。
- SEO記事の回遊が少ない
  - 関連記事ブロックの見出し、表示順、リンク先を調整する。
