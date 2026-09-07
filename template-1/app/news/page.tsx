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

type Props = {
  searchParams: Promise<{ category?: string }>;
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
  const { category = "" } = await searchParams;

  const [feed, latest] = await Promise.all([
    getNews(1, category),
    category ? getNews(1, "") : Promise.resolve(null),
  ]);

  const recentSource = latest ?? feed;

  return (
    <NewsView
      items={feed.items.map(toCard)}
      recent={recentSource.items.slice(0, 5).map(toCard)}
      categories={CATEGORIES}
      category={category}
    />
  );
}
