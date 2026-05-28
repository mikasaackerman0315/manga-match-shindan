# ????????

12の質問に答えると、AIがあなたにぴったりの漫画を最大20作品ランキング形式で推薦するWebアプリ。**Gemini 3.1 Pro** + 厳選207作品DB + Google検索グラウンディングのハイブリッド構成。

---

## 特徴

- 🤖 **Gemini 3.1 Pro** を使用（高性能・高コスパ・Google検索との相性◎）
- 📚 **207作品の厳選DB**（事実が保証された名作）＋ **Google検索**（新作・隠れた名作の発掘）のハイブリッド
- 🎯 **2つの診断モード**: シンプル（6問）/ こだわり（12問・選択肢12択）
- ✍️ **自由記述欄**（「鬱展開は苦手」など細かい好みをAIが汲み取る）
- 🌐 **日英バイリンガル** 対応
- 🏆 推薦結果に **DB / Web発掘** バッジ表示
- 🔒 APIキーはサーバー側のみ（安全）＋ レート制限内蔵

---

## セットアップ手順

### 1. 前提
- Node.js 18以上がインストールされていること（`node -v` で確認）

### 2. プロジェクトの準備

```bash
# このフォルダに移動
cd manga-oracle-gemini

# 依存パッケージをインストール
npm install
```

### 3. Gemini APIキーの取得と設定

1. [Google AI Studio](https://aistudio.google.com/apikey) にアクセス
2. 「Get API key」からAPIキーを作成（無料枠あり）
3. プロジェクト直下に `.env.local` ファイルを作成し、以下を記入:

```
GEMINI_API_KEY=取得したAPIキーをここに貼り付け
```

> ⚠️ `.env.local` は絶対にGitにコミットしないこと（`.gitignore` で除外済み）

### 4. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開くと動きます。

---

## デプロイ（Vercel）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel --prod

# 環境変数を設定（Vercelダッシュボード or CLI）
vercel env add GEMINI_API_KEY production
```

または、Vercelのダッシュボードで GitHub リポジトリと連携し、Environment Variables に `GEMINI_API_KEY` を追加。

---

## ファイル構成

```
manga-oracle-gemini/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── recommend/
│   │   │       └── route.js      # Gemini API を呼ぶバックエンド
│   │   ├── layout.jsx            # 共通レイアウト（フォント読込）
│   │   ├── page.jsx              # メインUI（診断フロー）
│   │   └── globals.css           # Tailwind
│   └── data/
│       ├── coreDB.js             # 207作品の漫画DB
│       └── questions.js          # 2モード分の質問定義
├── .env.example                  # 環境変数のテンプレート
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── jsconfig.json                 # @/ エイリアス設定
```

---

## コスト管理

### 内蔵のレート制限（`src/app/api/recommend/route.js`）

- **サイト全体**: 1日300回まで（`DAILY_GLOBAL_LIMIT`）
- **1ユーザー（IP）あたり**: 1日5回まで（`PER_USER_DAILY_LIMIT`）

数字は用途に合わせて調整可能。本番で大規模運用する場合は、メモリ内ストアではなくRedis（Upstash等）に置き換えることを推奨。

### Google Cloud側の予算上限

Google Cloud Console で予算アラート・上限を設定すれば、想定外の高額請求を防げます。

### コスト目安（Gemini 3.1 Pro）

- 1ユーザーあたり 約 ¥40〜50
- Google検索グラウンディングは検索クエリごとに課金（複数クエリ実行時はその数だけカウント）

> 請求は従量制で、月末締めでクレジットカードに請求されるのが基本です（API利用料を払うのは運営者）。

---

## カスタマイズ

### モデルを変える
`src/app/api/recommend/route.js` の `GEMINI_MODEL` を編集:
```js
const GEMINI_MODEL = "gemini-3.1-pro-preview"; // ここを変更
```
コスト優先なら `gemini-3.5-flash` などの軽量モデルに変更可能。

### DBに作品を追加する
`src/data/coreDB.js` の配列に、既存と同じ形式でエントリを追加するだけ。

### 質問・選択肢を変える
`src/data/questions.js` の `QUESTIONS_SIMPLE` / `QUESTIONS_DETAILED` を編集。

### DB と Web の比率を変える
`src/app/api/recommend/route.js` の `buildPrompt` 内の指示文（"Roughly 14-16 picks from the DB..."）を編集。

---

## 注意事項

- 推薦内容はAI生成です。事実関係（巻数・連載状況など）に誤りが含まれる可能性があります（特にWeb発掘分）。
- 商用利用する場合は、利用規約・プライバシーポリシー・特定商取引法表記・Cookie同意などの整備が必要です。
- あらすじは独自に記述しており、原典の文章を転載していません。

---

**モデル**: Gemini 3.1 Pro (`gemini-3.1-pro-preview`)
**フレームワーク**: Next.js 14 (App Router)
**スタイリング**: Tailwind CSS
