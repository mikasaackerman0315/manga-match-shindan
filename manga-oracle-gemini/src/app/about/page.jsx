export const metadata = {
  title: "運営者情報 | マンガマッチ診断",
  description: "マンガマッチ診断の運営者情報、サイトの目的、広告・アフィリエイト方針について掲載しています。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>運営者情報</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">サイト名</h2>
            <p>マンガマッチ診断</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">運営者</h2>
            <p>マンガマッチ診断 運営チーム</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">サイトの目的</h2>
            <p>当サイトは、漫画を探している方が自分の好みや気分に合う作品を見つけやすくすることを目的とした漫画推薦サービスです。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">広告・アフィリエイト方針</h2>
            <p>当サイトでは、運営費の一部を広告およびアフィリエイト収益でまかなう場合があります。推薦結果や記事内容は、ユーザーが作品を探しやすくなることを重視して作成しています。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">お問い合わせ</h2>
            <p>お問い合わせは、サイト内の「お問い合わせ」ページから受け付けています。</p>
          </section>
          <p className="text-xs tracking-widest" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>LAST UPDATED: 2026-06-01</p>
        </div>
      </article>
    </main>
  );
}
