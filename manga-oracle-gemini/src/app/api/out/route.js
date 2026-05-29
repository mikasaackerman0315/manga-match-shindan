import { NextResponse } from "next/server";

const DEFAULT_AMAZON_ASSOCIATE_TAG = "mangamatchquiz-22";
const DEFAULT_RAKUTEN_AFFILIATE_BASE = "https://hb.afl.rakuten.co.jp/ichiba/544efdb0.c2fbd832.544efdb1.c9054ec8/";

const STORES = {
  amazon: {
    base: "https://www.amazon.co.jp/s",
    queryParam: "k",
    affiliateParam: "tag",
    affiliateEnv: "AMAZON_ASSOCIATE_TAG",
  },
  rakuten: {
    base: "https://books.rakuten.co.jp/search",
    queryParam: "sitem",
    affiliateParam: "affiliateId",
    affiliateEnv: "RAKUTEN_AFFILIATE_ID",
  },
  ebookjapan: {
    base: "https://ebookjapan.yahoo.co.jp/search/",
    queryParam: "keyword",
    affiliateParam: null,
    affiliateEnv: null,
  },
};

export function GET(req) {
  const { searchParams } = new URL(req.url);
  const store = searchParams.get("store");
  const title = searchParams.get("title") || "";
  const intent = searchParams.get("intent");
  const config = STORES[store];

  if (!config || !title.trim()) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const destination = new URL(config.base);
  const suffix = intent === "kindle"
    ? " Kindle"
    : intent === "volume1"
      ? " 1巻"
      : intent === "set"
        ? " 全巻セット"
        : intent === "preview"
          ? " 試し読み"
          : intent === "ebook"
          ? ""
          : " 漫画";

  destination.searchParams.set(config.queryParam, `${title.trim()}${suffix}`);
  destination.searchParams.set("utm_source", "manga_oracle");
  destination.searchParams.set("utm_medium", "affiliate_button");
  destination.searchParams.set("utm_campaign", "recommendation_results");

  if (store === "rakuten") {
    const affiliateDestination = new URL(process.env.RAKUTEN_AFFILIATE_BASE || DEFAULT_RAKUTEN_AFFILIATE_BASE);
    affiliateDestination.searchParams.set("pc", destination.toString());
    affiliateDestination.searchParams.set("link_type", "hybrid_url");
    return NextResponse.redirect(affiliateDestination);
  }

  const affiliateId = config.affiliateEnv
    ? process.env[config.affiliateEnv] || (store === "amazon" ? DEFAULT_AMAZON_ASSOCIATE_TAG : null)
    : null;
  if (affiliateId && config.affiliateParam) {
    destination.searchParams.set(config.affiliateParam, affiliateId);
  }

  return NextResponse.redirect(destination);
}
