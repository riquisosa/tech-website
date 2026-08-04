import type { CollectionEntry } from "astro:content";

/**
 * Returns glossary entries sorted A→Z by `term`, excluding drafts.
 *
 * Unlike `getSortedPosts`, there's no scheduling/publish-time check here —
 * glossary entries have no `pubDatetime`, so the only exclusion is `draft`.
 */
export function getSortedGlossary(entries: CollectionEntry<"glossary">[]) {
  return entries
    .filter(({ data }) => !data.draft)
    .sort((a, b) => a.data.term.localeCompare(b.data.term));
}
