import ContactForm from "./ContactForm";

export const metadata = {
  title: "お問い合わせ | マンガマッチ診断",
  description: "マンガマッチ診断へのお問い合わせフォームです。ご意見、不具合報告、掲載内容に関するご連絡はこちらからお送りください。",
};

const contactEmail = "mangamatchquiz@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 py-16 md:px-8 xl:px-10 2xl:px-12" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-[1280px] mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>HOME</a>
        <h1 className="text-4xl md:text-5xl font-bold mt-10 mb-8" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>お問い合わせ</h1>
        <div className="space-y-8 leading-8 text-sm md:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-3">お問い合わせフォーム</h2>
            <p>マンガマッチ診断へのご意見、不具合報告、掲載内容に関するご連絡は、以下のフォームから送信できます。送信内容は運営宛にメールで届きます。</p>
          </section>

          <ContactForm />

          <section>
            <h2 className="text-xl font-semibold mb-3">メールで直接連絡する場合</h2>
            <p>
              フォームを利用できない場合は、
              <a href={`mailto:${contactEmail}`} className="underline decoration-[#c0392b] underline-offset-4" style={{ color: "#c0392b" }}>{contactEmail}</a>
              までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">ご連絡時のお願い</h2>
            <p>作品名、対象ページのURL、該当箇所、確認したい内容を添えていただけると、内容を確認しやすくなります。作品情報や販売ページの価格・在庫は変動するため、必要に応じて公式サイトや販売ページもあわせてご確認ください。</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">返信について</h2>
            <p>いただいた内容は順次確認します。すべてのお問い合わせに個別返信をお約束するものではありませんが、サイト改善や掲載内容の確認に活用します。</p>
          </section>

          <p className="text-xs tracking-widest" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>LAST UPDATED: 2026-06-07</p>
        </div>
      </article>
    </main>
  );
}
