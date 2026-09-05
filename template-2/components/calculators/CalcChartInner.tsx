"use client";

import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { formatCompactINR, formatINR } from "@/lib/format";

const Frame = styled.div`
  margin-top: 8px;
  min-height: 300px;

  .highcharts-credits {
    display: none;
  }
`;

export type Series = {
  name: string;
  data: number[];
  /** Palette token to colour the series with, e.g. "--accent". */
  token: string;
};

/**
 * Reads a CSS custom property off :root. The palette lives in globals.css, so
 * the chart follows whatever theme is active instead of hard-coding colours.
 */
function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  return value.trim() || fallback;
}

export default function CalcChartInner({
  categories,
  series,
  xLabel,
  height = 320,
  type = "areaspline",
}: {
  categories: (string | number)[];
  series: Series[];
  xLabel?: string;
  height?: number;
  type?: "areaspline" | "column";
}) {
  const options = useMemo<Highcharts.Options>(() => {
    const ink = token("--ink", "#0f0f0f");
    const muted = token("--muted", "#6b655f");
    const line = token("--line", "rgba(0,0,0,0.12)");
    const surface = token("--surface-raised", "#ffffff");

    return {
      chart: {
        type,
        height,
        backgroundColor: "transparent",
        style: { fontFamily: "var(--font-sans)" },
        spacing: [8, 0, 8, 0],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        align: "left",
        verticalAlign: "top",
        margin: 18,
        itemStyle: { color: muted, fontWeight: "650", fontSize: "12px" },
        itemHoverStyle: { color: ink },
        symbolRadius: 3,
      },
      xAxis: {
        categories: categories.map(String),
        title: xLabel ? { text: xLabel, style: { color: muted } } : { text: undefined },
        lineColor: line,
        tickColor: line,
        labels: { style: { color: muted, fontSize: "11px" } },
        crosshair: { color: line },
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: line,
        labels: {
          style: { color: muted, fontSize: "11px" },
          formatter() {
            return formatCompactINR(Number(this.value));
          },
        },
      },
      tooltip: {
        shared: true,
        backgroundColor: surface,
        borderColor: line,
        borderRadius: 12,
        shadow: false,
        style: { color: ink, fontSize: "13px" },
        formatter() {
          const rows = (this.points ?? [])
            .map(
              (p) =>
                `<div><span style="color:${p.color}">●</span> ${p.series.name}: <b>${formatINR(Number(p.y))}</b></div>`,
            )
            .join("");
          return `<div style="font-weight:700;margin-bottom:4px">${xLabel ?? ""} ${this.x}</div>${rows}`;
        },
      },
      plotOptions: {
        areaspline: {
          fillOpacity: 0.16,
          lineWidth: 2,
          marker: { enabled: false, symbol: "circle", radius: 3 },
        },
        column: { borderWidth: 0, borderRadius: 4, groupPadding: 0.12 },
        series: { animation: { duration: 260 } },
      },
      series: series.map((s) => ({
        type,
        name: s.name,
        data: s.data,
        color: token(s.token, "#f5623c"),
      })) as Highcharts.SeriesOptionsType[],
    };
  }, [categories, series, xLabel, height, type]);

  return (
    <Frame>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Frame>
  );
}
