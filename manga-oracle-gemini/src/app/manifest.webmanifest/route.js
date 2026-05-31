const manifest = {
  name: "マンガマッチ診断",
  short_name: "マンガ診断",
  description: "自分に合う漫画をAIで探せる漫画おすすめ診断サイトです。",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: "#f5f3ee",
  theme_color: "#f5f3ee",
  lang: "ja",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export function GET() {
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
}
