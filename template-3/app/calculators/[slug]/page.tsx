"use client";

import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { calculatorMeta } from "@/lib/calculators";

/**
 * Legacy `/calculators/[slug]` URLs bounce into the single-page workspace.
 * Kept as a client page so the hash redirect runs in the browser.
 */
export default function CalculatorDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const item = calculatorMeta.find((entry) => entry.slug === slug);

  useEffect(() => {
    if (!item) return;
    window.location.replace(`/calculators#${item.slug}`);
  }, [item]);

  if (!item) notFound();

  return (
    <p style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
      Opening {item.title}…
    </p>
  );
}
