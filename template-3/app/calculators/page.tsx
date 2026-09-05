import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CalculatorsView } from "@/components/calculators/CalculatorsView";

export const metadata: Metadata = {
  title: "Calculators",
  description:
    "SIP, retirement, education, lumpsum, and crorepati calculators — all on one interactive page.",
};

export default function CalculatorsPage() {
  return (
    <>
      <PageHero title="Calculators" meta="Plan the numbers" />
      <CalculatorsView />
    </>
  );
}
