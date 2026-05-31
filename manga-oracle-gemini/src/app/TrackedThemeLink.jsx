"use client";

import { trackEvent } from "./analytics";

export default function TrackedThemeLink({ href, themeSlug, themeTitle, className, style, children }) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={() => trackEvent("theme_article_click", {
        theme_slug: themeSlug,
        theme_title: themeTitle,
      })}
    >
      {children}
    </a>
  );
}
