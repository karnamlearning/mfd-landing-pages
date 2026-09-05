import type { Metadata } from "next";
import { getFaqs } from "@/lib/advisorkhoj";
import { PageHero } from "@/components/PageHero";
import { FaqList } from "@/components/FaqList";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Mutual fund, NRI, and financial planning questions.",
};

export const revalidate = 21600;

export default async function FaqsPage() {
  const items = await getFaqs();

  return (
    <>
      <PageHero title="Frequently Asked Questions" />
      <FaqList items={items} />
    </>
  );
}
