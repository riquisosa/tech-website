import { getRelativeLocaleUrl } from "astro:i18n";
import config from "@/config";

/**
 * Returns a fully navigable URL for a glossary entry.
 *
 * Glossary uses a flat folder (no subfolders), so `id` is already the
 * complete slug — no path-stripping logic needed, unlike getPostUrl.
 * e.g. `/glossary/content-collection`
 */
export function getGlossaryUrl(
  id: string,
  locale: string | undefined = config.site.lang
): string {
  return getRelativeLocaleUrl(locale, `glossary/${id}`);
}
