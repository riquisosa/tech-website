import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";
export const GLOSSARY_PATH = "src/content/glossary";

// ─────────────────────────────────────────────
// Posts — untouched, exactly as shipped by the
// theme. Journal entries live here too, folded
// in by tag (e.g. "journey"), not a separate
// collection — see project decision log.
// ─────────────────────────────────────────────
const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

// ─────────────────────────────────────────────
// Pages — untouched, exactly as shipped by the
// theme. Powers /about via src/content/pages/about.md.
// ─────────────────────────────────────────────
const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

// ─────────────────────────────────────────────
// Glossary — new. No `pubDatetime` (sorted A→Z,
// not by date). No `slug` (filename is the URL,
// same convention as posts). No `tags` — a term
// is connected to posts by the POST including the
// term's own id/slug in its own tags list, not by
// the glossary entry tagging itself. See the
// "referenced in" lookup on the detail page.
// ─────────────────────────────────────────────
const glossary = defineCollection({
  loader: glob({ pattern: "[^_]*.{md,mdx}", base: `./${GLOSSARY_PATH}` }),
  schema: z.object({
    term: z.string(),
    shortDefinition: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { posts, pages, glossary };
