/**
 * Client for the Advisorkhoj public web API.
 *
 * Endpoints in use:
 *   getFundNews?page_id=&category=   news feed, 12 per page
 *   getArticles?page_id=             articles, 9 per page (page_id is the ONLY
 *                                    parameter it honours - amc/search/title
 *                                    filters are accepted but ignored)
 *   getMutualFunds                   mutual fund topic titles
 *   getMutualFundContent?title=      one topic's explainer
 *
 * Responses are cached with ISR so a page render never waits on the upstream.
 */

const BASE = "https://web-api.advisorkhoj.com/common";

/** 6 hours. News and articles move slowly; the mutual fund topics barely move at all. */
const REVALIDATE = 60 * 60 * 6;

export type FundNews = {
  id: number;
  title: string;
  small_content: string;
  full_content: string;
  contents: string;
  source_name: string;
  create_date: string;
  category: string;
  disqus_url: string;
};

export type AkArticle = {
  articleId: number;
  title: string;
  h1: string;
  short_content: string;
  contents: string;
  authorFirstName: string;
  authorLastName: string;
  createDate: string;
  disqus_url: string;
  amc: string;
  article_photo: string;
};

export type MutualFundTopic = {
  id: number;
  title: string;
  content: string;
  created_date: string;
  title_url: string;
  related_articles: string;
  related_calc: string;
  related_topics: string;
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, {
      headers: { "User-Agent": "MfdLandingPage/1.0" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Upstream down or unreachable: callers fall back to an empty list rather
    // than failing the whole page render.
    return null;
  }
}

/* ------------------------------------------------------------------ HTML --- */

const UPSTREAM = "https://www.advisorkhoj.com";

/**
 * Article images arrive in three shapes: an absolute `src`, a lazy-load
 * `data-src` (with an empty or missing `src`), and a site-relative
 * `/resources/...` path. Browsers only fetch `src`, and relative paths would
 * resolve against this site, so every one of them is rewritten to an absolute
 * `src` on the upstream host before the HTML is injected.
 */
function normaliseImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const attr = (name: string) => {
      const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
      return (m?.[1] ?? m?.[2] ?? "").trim();
    };
    const lazy = attr("data-src") || attr("data-original") || attr("data-lazy-src");
    const src = attr("src");
    let url = lazy || src;
    if (!url || url.startsWith("data:image/gif")) url = lazy;
    if (!url) return "";
    if (url.startsWith("//")) url = `https:${url}`;
    else if (url.startsWith("/")) url = `${UPSTREAM}${url}`;
    else if (!/^https?:\/\//i.test(url)) url = `${UPSTREAM}/${url}`;
    const alt = attr("alt");
    return `<img src="${url}" alt="${alt.replace(/"/g, "&quot;")}" decoding="async" referrerpolicy="no-referrer">`;
  });
}

/**
 * Strip anchors but keep their text, per the brief: no hyperlinks are to be
 * carried across from the source articles, news, or mutual fund topics. Also
 * removes scripts, styles, iframes and inline event handlers, since this HTML
 * is injected with dangerouslySetInnerHTML. Forms, inputs, and "Download KIM/SID"
 * CTAs from the upstream news body are dropped too. Lazy-loaded images are
 * rewritten so they actually display. Native `loading="lazy"` is omitted:
 * `overflow-x: clip` on html/body makes off-screen images never intersect.
 */
export function stripLinks(html: string): string {
  if (!html) return "";
  let out = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, "")
    .replace(/<a\b[^>]*>[\s\S]*?\bDownload\b[\s\S]*?<\/a>/gi, "")
    .replace(/<input\b[^>]*>/gi, "")
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, "")
    .replace(/<select\b[^>]*>[\s\S]*?<\/select>/gi, "")
    .replace(/<textarea\b[^>]*>[\s\S]*?<\/textarea>/gi, "")
    .replace(/<ul\b[^>]*typeahead[^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<span\b[^>]*searchAdvisorsInThisCity[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/Locate [^<]{0,120}in your city/gi, "")
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
    .replace(/\sclass\s*=\s*"[^"]*"/gi, "");

  for (let i = 0; i < 6; i += 1) {
    const next = out.replace(/<(div|span|p|section|li)\b[^>]*>\s*<\/\1>/gi, "");
    if (next === out) break;
    out = next;
  }

  return normaliseImages(out);
}

/**
 * Some upstream bodies are plain text with blank-line paragraph breaks rather
 * than HTML. Those get wrapped in <p> so they read the same as the rest.
 */
export function toHtml(body: string): string {
  const text = (body || "").trim();
  if (!text) return "";
  if (/<(p|div|h[1-6]|ul|ol|table|br)\b/i.test(text)) return stripLinks(text);
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((para) => `<p>${para.trim().replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

/** Plain text, for excerpts and meta descriptions. */
export function toText(html: string, limit = 220): string {
  const text = (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/, "")}...`;
}

/** Last path segment of a disqus_url, as the upstream spells it. */
export function slugOf(disqusUrl: string): string {
  const clean = (disqusUrl || "").split("?")[0].replace(/\/$/, "");
  return clean.slice(clean.lastIndexOf("/") + 1);
}

/** Strip characters that cannot survive a dynamic route segment. */
function safeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/:/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Route-safe slug. Two of the pinned article slugs contain a colon
 * (`xirr:-way-to-...`), which does not round-trip through a Next.js path
 * segment, so it is dropped and any resulting double dashes collapsed.
 */
export function routeSlug(disqusUrl: string): string {
  return safeSlug(slugOf(disqusUrl));
}

/** The pinned article slugs as they appear in our own routes. */
export function pinnedRouteSlugs(): string[] {
  return PINNED_ARTICLE_SLUGS.map(safeSlug);
}

/* ------------------------------------------------------------------ news --- */

export async function getNews(page = 1, category = "") {
  const data = await get<{ newsList: FundNews[]; totalCount: number }>(
    `getFundNews?page_id=${page}&category=${encodeURIComponent(category)}`,
  );
  return { items: data?.newsList ?? [], total: data?.totalCount ?? 0 };
}

export async function findNews(slug: string, maxPages = 6) {
  for (let page = 1; page <= maxPages; page += 1) {
    const { items } = await getNews(page);
    if (items.length === 0) break;
    const hit = items.find((n) => routeSlug(n.disqus_url) === slug.toLowerCase());
    if (hit) return hit;
  }
  return null;
}

/* -------------------------------------------------------------- articles --- */

export async function getArticles(page = 1) {
  const data = await get<{ article: AkArticle[]; totalCount: number }>(
    `getArticles?page_id=${page}`,
  );
  return { items: data?.article ?? [], total: data?.totalCount ?? 0 };
}

/**
 * The six articles the blog launches with, in the order given. The API has no
 * lookup by id or slug, so they are located by paging. Bounded and cached: the
 * cost is paid once per revalidation window, not per request.
 */
export const PINNED_ARTICLE_SLUGS = [
  "role-of-asset-allocation-in-achieving-your-financial-goals",
  "volatility-in-markets-and-your-long-term-investment",
  "financial-independence-and-mutual-funds",
  "multi-asset-allocation:-importance-of-having-gold-and-silver-exposure",
  "how-to-create-long-term-wealth-with-sip-top-up"
] as const;

const SCAN_PAGES = 130;
const SCAN_CONCURRENCY = 10;

export async function getPinnedArticles(): Promise<AkArticle[]> {
  const wanted = new Set<string>(PINNED_ARTICLE_SLUGS);
  const found = new Map<string, AkArticle>();

  for (let page = 1; page <= SCAN_PAGES && found.size < wanted.size;) {
    const batch: Promise<{ items: AkArticle[] }>[] = [];
    for (let i = 0; i < SCAN_CONCURRENCY && page <= SCAN_PAGES; i += 1, page += 1) {
      batch.push(getArticles(page));
    }
    const pages = await Promise.all(batch);
    for (const { items } of pages) {
      for (const article of items) {
        const slug = slugOf(article.disqus_url).toLowerCase();
        if (wanted.has(slug) && !found.has(slug)) found.set(slug, article);
      }
    }
  }

  return PINNED_ARTICLE_SLUGS.map((slug) => found.get(slug)).filter(
    (a): a is AkArticle => Boolean(a),
  );
}

export async function findArticle(slug: string) {
  const pinned = await getPinnedArticles();
  return pinned.find((a) => routeSlug(a.disqus_url) === slug.toLowerCase()) ?? null;
}

/* ---------------------------------------------------------- mutual funds --- */

/** URL segment for a topic title: "What is NAV in mutual funds" -> "what-is-nav-in-mutual-funds". */
export function topicSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function getMutualFundTitles(): Promise<string[]> {
  const data = await get<{ mutual_funds: string[] }>("getMutualFunds");
  return Array.isArray(data?.mutual_funds) ? data.mutual_funds : [];
}

export async function getMutualFundContent(title: string): Promise<MutualFundTopic | null> {
  const data = await get<{ mutual_funds: MutualFundTopic | null }>(
    `getMutualFundContent?title=${encodeURIComponent(title)}`,
  );
  return data?.mutual_funds ?? null;
}

/** Every topic with its body, in the order the list endpoint gives them. */
export async function getMutualFundTopics(): Promise<MutualFundTopic[]> {
  const titles = await getMutualFundTitles();
  const topics = await Promise.all(titles.map((title) => getMutualFundContent(title)));
  return topics.filter((t): t is MutualFundTopic => Boolean(t));
}

export async function findMutualFundTopic(slug: string): Promise<MutualFundTopic | null> {
  const titles = await getMutualFundTitles();
  const title = titles.find((t) => topicSlug(t) === slug.toLowerCase());
  return title ? getMutualFundContent(title) : null;
}

/**
 * `related_topics` is "Title | url || Title | url". Only the titles are kept,
 * and only those that resolve to one of our own topic pages, so nothing links
 * out to the upstream site.
 */
export function relatedTopicTitles(topic: MutualFundTopic, known: string[]): string[] {
  const set = new Set(known);
  return (topic.related_topics || "")
    .split("||")
    .map((pair) => pair.split("|")[0].trim())
    .filter((title) => title && set.has(title));
}
