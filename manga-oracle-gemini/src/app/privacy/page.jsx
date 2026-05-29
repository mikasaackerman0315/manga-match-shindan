export const metadata = {
  title: "プライバシーポリシー | マンガマッチ診断",
  description: "マンガマッチ診断のプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>プライバシーポリシー</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">取得する情報</h2>
            <p>当サイトでは、漫画推薦のために、ユーザーが診断で選択した回答や自由記述の内容を処理します。氏名、住所、電話番号など、個人を直接特定する情報の入力は求めていません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">利用目的</h2>
            <p>取得した情報は、漫画推薦結果の生成、サイト品質の改善、不正利用の防止、アクセス状況の分析のために利用します。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">外部サービス</h2>
            <p>当サイトでは、AIによる推薦生成のためにGoogle Gemini APIを利用します。また、今後Google Analytics、Google AdSense、アフィリエイトサービスを利用する場合があります。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">広告とアフィリエイト</h2>
            <p>当サイトは、広告配信サービスおよびアフィリエイトプログラムを利用する場合があります。リンク先の商品やサービスの購入、契約、問い合わせはユーザー自身の判断で行ってください。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Cookieについて</h2>
            <p>広告配信やアクセス解析のためにCookieを使用する場合があります。Cookieはブラウザ設定から無効化できます。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">改定</h2>
            <p>本ポリシーは、必要に応じて予告なく変更されることがあります。変更後の内容は当ページに掲載した時点で有効になります。</p>
          </section>
          <p className="text-xs tracking-widest" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>LAST UPDATED: 2026-05-29</p>
        </div>
      </article>
    </main>
  );
}
