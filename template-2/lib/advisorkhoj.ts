/**
 * Client for the Advisorkhoj public web API.
 *
 * Endpoints in use:
 *   getFundNews?page_id=&category=   news feed, 12 per page
 *   getArticles?page_id=             articles, 9 per page (page_id is the ONLY
 *                                    parameter it honours - amc/search/title
 *                                    filters are accepted but ignored)
 *   getInvestorFaq                   investor FAQ list
 *
 * Responses are cached with ISR so a page render never waits on the upstream.
 */

const BASE = "https://web-api.advisorkhoj.com/common";

/** 6 hours. News and articles move slowly; the FAQ barely moves at all. */
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

export type Faq = { question: string; answer: string };

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

/**
 * Strip anchors but keep their text, per the brief: no hyperlinks are to be
 * carried across from the source articles. Also removes scripts, styles,
 * iframes and inline event handlers, since this HTML is injected with
 * dangerouslySetInnerHTML.
 */
export function stripLinks(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
    .replace(/\sclass\s*=\s*"[^"]*"/gi, "");
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

/* ------------------------------------------------------------------- faq --- */

export async function getFaqs(): Promise<Faq[]> {
  const data = await get<{ faqList: Faq[] }>("getInvestorFaq");
  return data?.faqList ?? [];
}
