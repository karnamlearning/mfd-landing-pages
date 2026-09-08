"use client";

import { useEffect } from "react";
import { isCalculatorSlug, toolsForGroup } from "@/lib/calculators";

/** `/research` lands on the Research division of the Tools page. */
export default function ResearchRedirectPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const slug = isCalculatorSlug(hash) ? hash : toolsForGroup("research")[0].slug;
    window.location.replace(`/tools#${slug}`);
  }, []);

  return null;
}
