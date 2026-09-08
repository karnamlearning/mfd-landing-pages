"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { calculatorMeta, pathForTool } from "@/lib/calculators";

/** Legacy `/calculators/[slug]` URLs bounce into the matching workspace. */
export default function CalculatorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const item = calculatorMeta.find((entry) => entry.slug === slug);

  useEffect(() => {
    if (!item) return;
    window.location.replace(`${pathForTool(item.slug)}#${item.slug}`);
  }, [item]);

  if (!item) notFound();
  return null;
}
