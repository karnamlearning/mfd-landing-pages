"use client";

import { useEffect } from "react";
import { isCalculatorSlug, toolsForGroup } from "@/lib/calculators";

/** `/calculators` lands on the Calculators division of the Tools page. */
export default function CalculatorsRedirectPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const slug = isCalculatorSlug(hash) ? hash : toolsForGroup("calculator")[0].slug;
    window.location.replace(`/tools#${slug}`);
  }, []);

  return null;
}
