export const metadata = {
  title: "漫画おすすめ診断 | 自分に合う漫画をAIで探す",
  description: "漫画おすすめ診断で、自分に合う漫画をAIがランキング形式で提案します。恋愛、異世界、ホラー、スポーツ、名作まで幅広く診断できます。",
  alternates: { canonical: "/manga-diagnosis" },
};

export default function MangaDiagnosisPage() {
  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <section className="max-w-3xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← 診断トップへ</a>
        <div className="mt-10 mb-12">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>Manga Diagnosis</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>漫画おすすめ診断</h1>
          <p className="text-base md:text-lg leading-8" style={{ color: "#333" }}>マンガマッチ診断は、質問に答えるだけで自分に合う漫画を探せるAI漫画診断です。恋愛、異世界、ホラー、スポーツ、日常、名作など、好みの世界観や読み味からおすすめ作品をランキング形式で提案します。</p>
        </div>
        <div className="p-5 md:p-6 mb-10" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-2xl font-semibold mb-3">こんな検索をしている人に向いています</h2>
          <p className="leading-8" style={{ color: "#444" }}>「漫画 おすすめ 診断」「自分に合う漫画 診断」「次に読む漫画がわからない」「漫画 好み 診断」といった悩みに合わせて、1500作品データベースから候補を絞り込みます。</p>
        </div>
        <a href="/?start=1" className="inline-block px-8 py-4 text-xs tracking-[0.24em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める →</a>
      </section>
    </main>
  );
}
