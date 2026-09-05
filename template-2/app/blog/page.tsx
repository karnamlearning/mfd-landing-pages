import type { Metadata } from "next";
import { getPinnedArticles, routeSlug, toText } from "@/lib/advisorkhoj";
import { formatDate } from "@/lib/format";
import { BlogView, type PostCard } from "@/components/pages/BlogView";

export const metadata: Metadata = {
  title: "Insights Blog",
  description: "Guides on mutual funds, insurance, and long-term financial planning.",
};

export const revalidate = 21600;

export default async function BlogPage() {
  const articles = await getPinnedArticles();

  const posts: PostCard[] = articles.map((article) => ({
    slug: routeSlug(article.disqus_url),
    title: article.title,
    excerpt: toText(article.short_content || article.contents, 190),
    date: formatDate(article.createDate),
    author: `${article.authorFirstName ?? ""} ${article.authorLastName ?? ""}`.trim(),
    amc: article.amc ?? "",
    image: article.article_photo ?? "",
  }));

  return <BlogView posts={posts} />;
}
