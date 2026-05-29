export const metadata = {
  title: "お問い合わせ | マンガマッチ診断",
  description: "マンガマッチ診断へのお問い合わせについて。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-16" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>お問い合わせ</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">お問い合わせについて</h2>
            <p>マンガマッチ診断へのご意見、不具合報告、掲載内容に関するお問い合わせは、今後設置予定のお問い合わせフォームまたは連絡先メールアドレスから受け付けます。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">お願い</h2>
            <p>作品情報やリンク先情報は、変更される場合があります。誤りを見つけた場合は、対象作品名と内容を添えてご連絡ください。</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">連絡先</h2>
            <p>現在、正式な連絡先を準備中です。広告審査や公開運用に向けて、専用のメールアドレスまたはフォームを追加予定です。</p>
          </section>
        </div>
      </article>
    </main>
  );
}
