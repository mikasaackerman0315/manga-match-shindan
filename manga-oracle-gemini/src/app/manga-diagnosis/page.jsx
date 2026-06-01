import { redirect } from "next/navigation";

export const metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default function MangaDiagnosisPage() {
  redirect("/");
}
