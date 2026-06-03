import { redirect } from "next/navigation";

export const metadata = {
  alternates: { canonical: "/completed-manga" },
  robots: { index: false, follow: true },
};

export default function ShortMangaPage() {
  redirect("/completed-manga");
}
