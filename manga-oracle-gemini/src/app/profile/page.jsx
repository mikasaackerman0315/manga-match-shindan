import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "好みプロフィール | マンガマッチ診断",
  description: "漫画を探すページだけに使う好みプロフィールを設定できます。診断結果には影響しません。",
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
