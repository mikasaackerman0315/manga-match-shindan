"use client";

import SharedMangaCover from "../components/MangaCover";
import { getMangaCoverForItem } from "../data/mangaCovers";

export default function MangaCover({ title, id, author, size = "medium" }) {
  const cover = getMangaCoverForItem({
    id,
    title,
    title_ja: title,
    author,
  });

  return (
    <SharedMangaCover
      title={title}
      mangaId={id}
      author={author}
      coverImageUrl={cover?.coverImageUrl}
      coverProductUrl={cover?.coverProductUrl}
      coverImageSource={cover?.coverImageSource}
      verified={cover?.coverImageVerified}
      size={size}
      pageType="diagnosis_result"
    />
  );
}
