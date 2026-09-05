"use client";

import dynamic from "next/dynamic";
import styled from "styled-components";
import type { Series } from "@/components/calculators/CalcChartInner";

export type { Series };

const Placeholder = styled.div`
  margin-top: 8px;
`;

/**
 * Highcharts touches `document` during init, so the renderer is loaded
 * client-side only. A dynamic import handles that without a mount flag, which
 * would mean calling setState inside an effect.
 */
const Inner = dynamic(() => import("@/components/calculators/CalcChartInner"), {
  ssr: false,
  loading: () => <Placeholder aria-hidden />,
});

export function CalcChart(props: {
  categories: (string | number)[];
  series: Series[];
  xLabel?: string;
  height?: number;
  type?: "areaspline" | "column";
}) {
  return <Inner {...props} />;
}
