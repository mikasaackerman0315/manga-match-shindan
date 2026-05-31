const adsTxt = "google.com, pub-6726748690737074, DIRECT, f08c47fec0942fa0";

export function GET() {
  return new Response(adsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
