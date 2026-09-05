import type { Metadata } from "next";
import { getNews, routeSlug, toText } from "@/lib/advisorkhoj";
import { formatDate } from "@/lib/format";
import { NewsView, type NewsCard } from "@/components/pages/NewsView";

export const metadata: Metadata = {
  title: "Market News",
  description: "Fund launches, NFO notes, and market context.",
};

export const revalidate = 21600;

/**
 * Only categories the upstream feed actually returns items for. The API honours
 * `category` exactly, so a label with no rows renders an empty feed.
 */
const CATEGORIES = ["All", "Mutual Fund", "NFO", "BFSI Industry", "Income Tax"];

const PER_PAGE = 12;

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

function toCard(item: Awaited<ReturnType<typeof getNews>>["items"][number]): NewsCard {
  return {
    slug: routeSlug(item.disqus_url),
    title: item.title,
    excerpt: toText(item.small_content || item.contents, 200),
    date: formatDate(item.create_date),
    category: item.category,
    source: item.source_name,
  };
}

export default async function NewsPage({ searchParams }: Props) {
  const { category = "", page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);

  const [feed, latest] = await Promise.all([
    getNews(page, category),
    page === 1 && !category ? Promise.resolve(null) : getNews(1, ""),
  ]);

  const recentSource = latest ?? feed;

  return (
    <NewsView
      items={feed.items.map(toCard)}
      recent={recentSource.items.slice(0, 5).map(toCard)}
      categories={CATEGORIES}
      category={category}
      page={page}
      hasNext={page * PER_PAGE < feed.total}
    />
  );
}
