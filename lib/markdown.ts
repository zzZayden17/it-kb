import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface ArticleFrontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface ParsedArticle {
  frontmatter: ArticleFrontmatter;
  html: string;
}

/**
 * Splits the raw Markdown string from GitHub into structured front matter
 * and rendered HTML. The two steps are independent: gray-matter handles the
 * YAML block, remark handles the body.
 *
 * sanitize: false — content is admin-authored (trusted), so raw HTML
 * embedded in Markdown (e.g. <details>, <summary>, diagrams) is preserved.
 */
export async function parseArticle(raw: string): Promise<ParsedArticle> {
  const { data, content } = matter(raw);

  const file = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    frontmatter: data as ArticleFrontmatter,
    html: String(file),
  };
}

/**
 * Extracts only the front matter from a raw Markdown string, without rendering
 * the body to HTML. Use this on list/index pages where you need metadata for
 * many articles but don't need the rendered content.
 */
export function parseFrontmatter(raw: string): ArticleFrontmatter {
  return matter(raw).data as ArticleFrontmatter;
}

/**
 * Serializes a front matter object and a Markdown body back into a raw .md
 * string suitable for writing to GitHub via upsertArticle().
 *
 * Output format:
 *   ---
 *   title: My Article
 *   date: 2026-05-18
 *   ---
 *   Body text here...
 */
export function serializeArticle(
  frontmatter: ArticleFrontmatter,
  body: string,
): string {
  return matter.stringify(body, frontmatter);
}
