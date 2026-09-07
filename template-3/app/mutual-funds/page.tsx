import type { Metadata } from "next";
import { getMutualFundTopics, toText, topicSlug } from "@/lib/advisorkhoj";
import { MutualFundsView } from "@/components/pages/MutualFundsView";

export const metadata: Metadata = {
  title: "Mutual Funds",
  description:
    "Plain-language explainers on how mutual funds work: types of funds, NAV, SIPs, redemptions, and more.",
};

export const revalidate = 21600;

export default async function MutualFundsPage() {
  const topics = await getMutualFundTopics();

  return (
    <MutualFundsView
      topics={topics.map((topic) => ({
        slug: topicSlug(topic.title),
        title: topic.title,
        excerpt: toText(topic.content, 150),
      }))}
    />
  );
}
