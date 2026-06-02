"use client";

import { trackEvent } from "./analytics";

export default function TrackedArticleLink({ href, label, sourcePath, children, className, style }) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => trackEvent("related_article_click", {
        source_path: sourcePath || "",
        destination_path: href,
        article_title: label || "",
      })}
    >
      {children}
    </a>
  );
}
