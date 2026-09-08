import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CalculatorsView } from "@/components/calculators/CalculatorsView";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Planning calculators and mutual fund research tools — SIP, lumpsum, education, retirement, goal setting, SWP, trailing returns, and more.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHero title="Tools" meta="Calculators & research" />
      <CalculatorsView />
    </>
  );
}
