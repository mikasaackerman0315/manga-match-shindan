export const metadata = {
  title: "運営者情報 | マンガマッチ診断",
  description: "マンガマッチ診断の運営方針、サイトの目的、問い合わせ先について掲載しています。",
};

const contactEmail = "mangamatchquiz@gmail.com";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-8 xl:px-10 2xl:px-12" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-[1280px] mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>運営者情報</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">サイト名</h2>
            <p>マンガマッチ診断</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">運営者</h2>
            <p>マンガマッチ診断 運営</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">サイトの目的</h2>
            <p>マンガマッチ診断は、次に読む漫画を探している方に向けて、好みや苦手な展開、読みたい雰囲気に合う作品を見つけやすくするための漫画案内サイトです。</p>
            <p className="mt-4">AI診断による推薦と、テーマ別の編集コンテンツを組み合わせ、初心者向け、完結済み、恋愛、ホラー、スポーツ、異世界など、さまざまな切り口から漫画を探せるようにしています。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">情報の確認について</h2>
            <p>掲載する作品情報や紹介文は、できるだけ正確で分かりやすい内容になるよう確認しています。ただし、巻数、連載状況、価格、在庫、配信状況は変更される場合があります。購入や閲覧の前には、公式サイトや販売ページで最新情報をご確認ください。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">広告・アフィリエイトについて</h2>
            <p>当サイトでは、運営費の一部を広告およびアフィリエイト収益でまかなう場合があります。記事や診断結果は、ユーザーが漫画を探しやすくなることを重視して作成しています。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">問い合わせ先</h2>
            <p>掲載内容に関するご連絡は、<a href={`mailto:${contactEmail}`} className="underline decoration-[#c0392b] underline-offset-4" style={{ color: "#c0392b" }}>{contactEmail}</a> までお願いいたします。</p>
          </section>
          <p className="text-xs tracking-widest" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>LAST UPDATED: 2026-06-07</p>
        </div>
      </article>
    </main>
  );
}
