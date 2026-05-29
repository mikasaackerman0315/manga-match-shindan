export const metadata = {
  title: "免責事項 | マンガマッチ診断",
  description: "マンガマッチ診断の免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>免責事項</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">推薦結果について</h2>
            <p>当サイトの漫画推薦は、ユーザーの回答、作品データベース、AIによる分析をもとに生成されます。推薦結果の正確性、完全性、満足度を保証するものではありません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">作品情報について</h2>
            <p>作品の巻数、連載状況、アニメ化情報などは、公開時点の情報をもとにしています。最新情報と異なる場合があります。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">外部リンクについて</h2>
            <p>当サイトから移動する外部サイトの内容、商品、価格、在庫、サービス内容について、当サイトは責任を負いません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">著作権について</h2>
            <p>当サイトで掲載している作品名、作者名、関連する権利は各権利者に帰属します。権利を侵害する目的はありません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">損害等の責任</h2>
            <p>当サイトの利用によって発生した損害、トラブル、不利益について、当サイトは責任を負いかねます。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
