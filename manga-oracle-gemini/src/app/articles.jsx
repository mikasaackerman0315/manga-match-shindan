function shopLinks(title) {
  const query = encodeURIComponent(title);
  return [
    { label: "Amazon", children: [
      { label: "Kindle", href: `/api/out?store=amazon&intent=kindle&title=${query}` },
      { label: "紙の本", href: `/api/out?store=amazon&intent=paper&title=${query}` },
    ] },
    { label: "楽天", href: `/api/out?store=rakuten&intent=store&title=${query}` },
  ];
}

export function ArticlePage({ eyebrow, title, lead, items }) {
  return (
    <main className="min-h-screen px-5 py-14 md:px-8 md:py-20" style={{ backgroundColor: "#f5f3ee", color: "#0a0a0a", fontFamily: "'Noto Serif JP', serif" }}>
      <article className="max-w-4xl mx-auto">
        <a href="/" className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>← 診断トップへ</a>
        <div className="mt-10 mb-14">
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c0392b", fontFamily: "'JetBrains Mono', monospace" }}>{eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{title}</h1>
          <p className="text-base md:text-lg leading-8 max-w-2xl" style={{ color: "#333" }}>{lead}</p>
        </div>

        <div className="mb-14 p-5 md:p-6" style={{ border: "1px solid rgba(10,10,10,0.16)", backgroundColor: "rgba(245,243,238,0.65)" }}>
          <h2 className="text-xl md:text-2xl font-semibold mb-3">自分に合う漫画をもっと絞り込む</h2>
          <p className="text-sm leading-7 mb-5" style={{ color: "#555" }}>好みがまだ固まっていない人は、診断で読むべき作品をランキング形式で探せます。</p>
          <a href="/" className="inline-block px-7 py-3 text-xs tracking-[0.22em] uppercase transition-all hover:scale-105" style={{ backgroundColor: "#0a0a0a", color: "#f5f3ee", fontFamily: "'JetBrains Mono', monospace" }}>診断を始める →</a>
        </div>

        <section className="space-y-8">
          {items.map((item, index) => (
            <div key={item.title} className="grid grid-cols-12 gap-4 md:gap-6 pb-8" style={{ borderBottom: "1px solid rgba(10,10,10,0.1)" }}>
              <div className="col-span-2 md:col-span-1 text-3xl md:text-4xl font-bold leading-none" style={{ color: index === 0 ? "#c0392b" : "#0a0a0a", fontFamily: "'Cormorant Garamond', serif" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="col-span-10 md:col-span-11">
                <h2 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: "'Cormorant Garamond', 'Noto Serif JP', serif" }}>{item.title}</h2>
                <div className="text-xs tracking-[0.12em] mb-4" style={{ color: "#777", fontFamily: "'JetBrains Mono', monospace" }}>{item.meta}</div>
                <p className="leading-8 mb-4" style={{ color: "#333" }}>{item.text}</p>
                <p className="text-sm leading-7 mb-4 italic" style={{ color: "#555" }}>{item.fit}</p>
                <div className="flex flex-wrap gap-2">
                  {shopLinks(item.title).map((link) => link.children ? (
                    <details key={link.label} className="relative">
                      <summary className="list-none cursor-pointer text-[11px] px-3 py-1.5 tracking-[0.12em] uppercase transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.18)", color: "#0a0a0a", backgroundColor: "rgba(245,243,238,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {link.label}
                      </summary>
                      <div className="absolute left-0 top-full z-20 mt-1 min-w-[7rem] p-1" style={{ border: "1px solid rgba(10,10,10,0.18)", backgroundColor: "#f5f3ee", boxShadow: "0 10px 24px rgba(10,10,10,0.12)" }}>
                        {link.children.map((child) => (
                          <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer sponsored" className="block whitespace-nowrap px-3 py-2 text-[11px] tracking-[0.12em] uppercase hover:text-[#c0392b]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{child.label}</a>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer sponsored" className="text-[11px] px-3 py-1.5 tracking-[0.12em] uppercase transition-all hover:translate-y-[-1px]" style={{ border: "1px solid rgba(10,10,10,0.18)", color: link.label === "楽天" ? "#c0392b" : "#0a0a0a", backgroundColor: "rgba(245,243,238,0.55)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </article>
    </main>
  );
}
