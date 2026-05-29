import { NextResponse } from "next/server";

const RAKUTEN_BOOKS_ENDPOINT = "https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "").trim();
  const applicationId = process.env.RAKUTEN_APP_ID;

  if (!title || !applicationId) {
    return NextResponse.json({ imageUrl: null, itemUrl: null });
  }

  const apiUrl = new URL(RAKUTEN_BOOKS_ENDPOINT);
  apiUrl.searchParams.set("applicationId", applicationId);
  apiUrl.searchParams.set("format", "json");
  apiUrl.searchParams.set("title", title);
  apiUrl.searchParams.set("booksGenreId", "001001");
  apiUrl.searchParams.set("hits", "1");
  apiUrl.searchParams.set("sort", "standard");

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 86400 } });
    if (!response.ok) {
      return NextResponse.json({ imageUrl: null, itemUrl: null }, { status: 200 });
    }

    const data = await response.json();
    const item = data?.Items?.[0]?.Item;
    const imageUrl = item?.largeImageUrl || item?.mediumImageUrl || item?.smallImageUrl || null;
    const itemUrl = item?.itemUrl || null;

    return NextResponse.json(
      { imageUrl, itemUrl },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch {
    return NextResponse.json({ imageUrl: null, itemUrl: null }, { status: 200 });
  }
}
