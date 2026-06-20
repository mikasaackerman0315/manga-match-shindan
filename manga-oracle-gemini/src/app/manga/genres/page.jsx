import { MANGA_GENRES } from "../../../data/mangaCatalog";

export const metadata = {
  title: "ジャンル別漫画一覧 | マンガマッチ診断",
  description: "バトル、恋愛、ファンタジー、ホラー、スポーツ、癒しなど、マンガマッチ診断の漫画データベースをジャンル別に探せます。",
  alternates: {
    canonical: "/manga/genres",
  },
};

export default function MangaGenresPage() {
  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20 xl:px-10 2xl:px-12" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <section className="mx-auto max-w-[1920px]">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
          診断トップへ
        </a>
        <div className="mt-10 mb-10">
          <div className="mb-4 text-xs tracking-[0.35em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>
            Genre Index
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>
            ジャンル別漫画一覧
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-8" style={{ color: "#333" }}>
            読みたい気分が決まっている時は、ジャンルから漫画を探せます。各ジャンルは30作品ずつの一覧ページに分かれています。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <a href="/manga" className="group p-5 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.72)" }}>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>全作品一覧</h2>
            <p className="mt-2 text-sm leading-7" style={{ color: "#555" }}>登録作品を30件ずつまとめて見る。</p>
          </a>
          <a href="/genius-manga" className="group p-5 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.72)" }}>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>天才・頭脳派</h2>
            <p className="mt-2 text-sm leading-7" style={{ color: "#555" }}>天才キャラ、頭脳戦、心理戦が光る漫画を探す。</p>
          </a>
          {MANGA_GENRES.map((genre) => (
            <a key={genre.slug} href={`/manga/genre/${genre.slug}`} className="group p-5 transition-all hover:translate-x-1" style={{ border: "1px solid rgba(10,10,10,0.14)", backgroundColor: "rgba(245,243,238,0.72)" }}>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{genre.label}</h2>
              <p className="mt-2 text-sm leading-7" style={{ color: "#555" }}>{genre.label}に近い登録作品を見る。</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
