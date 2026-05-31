export const metadata = {
  title: "免責事項・広告について | マンガマッチ診断",
  description: "マンガマッチ診断の免責事項、広告配信、アフィリエイトリンク、Amazonアソシエイト表記について掲載しています。",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>免責事項・広告について</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">推薦結果について</h2>
            <p>当サイトの漫画推薦は、ユーザーの回答、作品データベース、AIによる分析をもとに生成されます。推薦結果の正確性、完全性、満足度を保証するものではありません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">作品情報について</h2>
            <p>作品の巻数、連載状況、アニメ化情報、価格、在庫などは変更される場合があります。最新情報は各販売サイトや公式情報をご確認ください。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">広告・アフィリエイトについて</h2>
            <p>当サイトは広告配信サービスおよびアフィリエイトプログラムを利用しています。リンク先で商品を購入した場合、当サイトが紹介料を受け取ることがあります。</p>
            <p className="mt-3">当サイトはAmazonアソシエイト・プログラムの参加者です。適格販売により収入を得ています。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">外部リンクについて</h2>
            <p>当サイトから移動した外部サイトの商品、価格、在庫、サービス内容、個人情報の取り扱いについて、当サイトは責任を負いません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">著作権について</h2>
            <p>当サイトで掲載している作品名、作者名、出版社名などに関する権利は、各権利者に帰属します。権利を侵害する目的はありません。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">損害等の責任</h2>
            <p>当サイトの利用により発生した損害、トラブル、不利益について、当サイトは責任を負いかねます。</p>
          </section>
          <p className="text-xs tracking-widest" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>LAST UPDATED: 2026-05-31</p>
        </div>
      </article>
    </main>
  );
}
