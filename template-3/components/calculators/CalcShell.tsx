"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion } from "framer-motion";
import styled from "styled-components";
import { toast } from "sonner";
import { FiBarChart2, FiCopy, FiList, FiRotateCcw, FiTrendingUp } from "react-icons/fi";
import { formatCompactINR, formatINR } from "@/lib/format";
import { useReduceMotion } from "@/components/motion";
import { ButtonLink } from "@/components/ui";
import { CalcChart, type Series } from "@/components/calculators/CalcChart";

/**
 * Shared chrome for every calculator: inputs on the left, the answer on the
 * right, and the same projection underneath in three shapes - a growth curve,
 * a year-by-year column chart, and a table for anyone who wants the numbers.
 */

/* ------------------------------------------------------------------ types --- */

export type Stat = { label: string; value: string; hint?: string };

export type Headline = {
  label: string;
  value: number;
  caption?: string;
  /** Rendered instead of a rupee figure, e.g. "18 years". */
  text?: string;
};

export type SplitPart = { label: string; value: number; token: string };

/* ----------------------------------------------------------------- layout --- */

const Panel = styled.div`
  background: var(--surface-raised);
  border: 1px solid var(--line-strong);
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);

  @media (max-width: 940px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Inputs = styled.div`
  min-width: 0;
  padding: 30px;
  display: grid;
  align-content: start;
  gap: 22px;

  @media (max-width: 560px) {
    padding: 22px 18px;
  }
`;

const Output = styled.div.attrs({ className: "on-dark-scope" })`
  min-width: 0;
  padding: 30px;
  background: var(--surface-darkest);
  color: var(--on-brand);
  display: grid;
  align-content: start;
  gap: 24px;

  @media (max-width: 560px) {
    padding: 22px 18px;
  }
`;

const Kicker = styled.p`
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-strong);
  display: flex;
  align-items: center;
  gap: 10px;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--line);
  }
`;

const OutKicker = styled(Kicker)`
  color: var(--accent);
`;

/* --------------------------------------------------------------- headline --- */

const HeadlineBlock = styled.div`
  display: grid;
  gap: 8px;

  strong {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(34px, 4.4vw, 52px);
    font-weight: 750;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--on-brand-mute);
    max-width: 34ch;
  }
`;

/**
 * Rolls the figure from its previous value to the new one so a slider drag
 * reads as a number moving, not a number blinking.
 */
function AnimatedAmount({ value }: { value: number }) {
  const reduce = useReduceMotion();
  const [shown, setShown] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduce) {
      previous.current = value;
      setShown(value);
      return;
    }
    const controls = animate(previous.current, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setShown(latest),
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <>{formatINR(shown)}</>;
}

/* -------------------------------------------------------------- split bar --- */

const SplitWrap = styled.div`
  display: grid;
  gap: 12px;
`;

const Bar = styled.div`
  display: flex;
  height: 12px;
  overflow: hidden;
  background: var(--on-brand-veil);
`;

const BarPart = styled(motion.div)<{ $token: string }>`
  background: ${({ $token }) => `var(${$token})`};
  min-width: 2px;
`;

const SplitLegend = styled.ul`
  display: grid;
  gap: 8px;
  list-style: none;

  li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
  }

  span {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--on-brand-soft);
  }

  i {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
  }

  b {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
`;

function Split({ parts }: { parts: SplitPart[] }) {
  const total = parts.reduce((sum, part) => sum + Math.max(0, part.value), 0) || 1;
  return (
    <SplitWrap>
      <Bar aria-hidden>
        {parts.map((part) => (
          <BarPart
            key={part.label}
            $token={part.token}
            animate={{ flexGrow: Math.max(0, part.value) / total }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexBasis: 0 }}
          />
        ))}
      </Bar>
      <SplitLegend>
        {parts.map((part) => (
          <li key={part.label}>
            <span>
              <i style={{ background: `var(${part.token})` }} aria-hidden />
              {part.label}
            </span>
            <b>{formatCompactINR(part.value)}</b>
          </li>
        ))}
      </SplitLegend>
    </SplitWrap>
  );
}

/* ------------------------------------------------------------------ stats --- */

const StatList = styled.dl`
  display: grid;
  border-top: 1px solid var(--line);

  div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    padding: 11px 0;
    border-bottom: 1px solid var(--line);
  }

  dt {
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.02em;
    color: var(--on-brand-mute);
  }

  dd {
    font-size: 15px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    text-align: right;
    white-space: nowrap;
  }
`;

/* ---------------------------------------------------------------- actions --- */

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: inherit;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    background: var(--on-brand-veil);
    border-color: currentColor;
  }
`;

const ResetButton = styled(GhostButton)`
  justify-self: start;

  &:hover {
    background: var(--tint-accent-weak);
    border-color: var(--ink);
  }
`;

/* ------------------------------------------------------------ chart / tab --- */

const ViewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 30px;
  border-top: 1px solid var(--line-strong);
  background: var(--surface);

  @media (max-width: 560px) {
    padding: 14px 18px;
  }
`;

const ViewTabs = styled.div`
  display: flex;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ViewTab = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 7px;
  padding: 9px 14px;
  border: 0;
  background: ${({ $on }) => ($on ? "var(--ink)" : "transparent")};
  color: ${({ $on }) => ($on ? "var(--accent)" : "var(--muted)")};
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.16s ease;

  & + & {
    border-left: 1px solid var(--line);
  }

  &:hover {
    color: ${({ $on }) => ($on ? "var(--accent)" : "var(--ink)")};
  }
`;

const ViewNote = styled.p`
  font-size: 12px;
  color: var(--muted);
`;

const ChartArea = styled.div`
  padding: 10px 24px 24px;

  @media (max-width: 560px) {
    padding: 8px 12px 18px;
  }
`;

const TableScroll = styled.div`
  max-height: 340px;
  overflow: auto;
  border: 1px solid var(--line);
  margin-top: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  font-variant-numeric: tabular-nums;

  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--surface);
    text-align: right;
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--line-strong);
  }

  thead th:first-child,
  tbody td:first-child {
    text-align: left;
  }

  tbody td {
    padding: 9px 14px;
    text-align: right;
    border-bottom: 1px solid var(--line);
  }

  tbody tr:hover td {
    background: var(--tint-accent-weak);
  }
`;

const Legalese = styled.p`
  padding: 18px 30px 26px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
  border-top: 1px solid var(--line);

  @media (max-width: 560px) {
    padding: 16px 18px 22px;
  }
`;

type View = "growth" | "yearly" | "table";

const views: { id: View; label: string; icon: typeof FiTrendingUp; note: string }[] = [
  {
    id: "growth",
    label: "Growth",
    icon: FiTrendingUp,
    note: "Cumulative value at the end of each year.",
  },
  {
    id: "yearly",
    label: "Compare",
    icon: FiBarChart2,
    note: "The same figures side by side, year on year.",
  },
  { id: "table", label: "Table", icon: FiList, note: "Every year, in rupees." },
];

/* ------------------------------------------------------------------ shell --- */

export function CalcShell({
  controls,
  headline,
  stats,
  split,
  categories,
  series,
  xLabel = "Year",
  onReset,
  footnote,
  ctaLabel = "Discuss this goal with us",
}: {
  controls: ReactNode;
  headline: Headline;
  stats: Stat[];
  split?: SplitPart[];
  categories: (string | number)[];
  series: Series[];
  xLabel?: string;
  onReset: () => void;
  footnote?: string;
  ctaLabel?: string;
}) {
  const [view, setView] = useState<View>("growth");

  const copySummary = async () => {
    const lines = [
      `${headline.label}: ${headline.text ?? formatINR(headline.value)}`,
      ...stats.map((stat) => `${stat.label}: ${stat.value}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Summary copied to your clipboard");
    } catch {
      toast.error("Could not copy - your browser blocked clipboard access");
    }
  };

  return (
    <Panel>
      <Top>
        <Inputs>
          <Kicker>Your assumptions</Kicker>
          {controls}
          <ResetButton type="button" onClick={onReset}>
            <FiRotateCcw size={14} aria-hidden />
            Reset
          </ResetButton>
        </Inputs>

        <Output>
          <OutKicker>The answer</OutKicker>

          <HeadlineBlock>
            <Kicker as="p" style={{ color: "var(--on-brand-mute)" }}>
              {headline.label}
            </Kicker>
            <strong aria-live="polite">
              {headline.text ?? <AnimatedAmount value={headline.value} />}
            </strong>
            {headline.caption ? <p>{headline.caption}</p> : null}
          </HeadlineBlock>

          {split ? <Split parts={split} /> : null}

          <StatList>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </StatList>

          <Actions>
            <ButtonLink href="/contact" $variant="gold">
              {ctaLabel}
            </ButtonLink>
            <GhostButton type="button" onClick={copySummary}>
              <FiCopy size={14} aria-hidden />
              Copy
            </GhostButton>
          </Actions>
        </Output>
      </Top>

      <ViewBar>
        <ViewTabs role="group" aria-label="Chart view">
          {views.map((option) => {
            const Icon = option.icon;
            return (
              <ViewTab
                key={option.id}
                type="button"
                $on={view === option.id}
                aria-pressed={view === option.id}
                onClick={() => setView(option.id)}
              >
                <Icon size={13} aria-hidden />
                {option.label}
              </ViewTab>
            );
          })}
        </ViewTabs>
        <ViewNote>{views.find((option) => option.id === view)?.note}</ViewNote>
      </ViewBar>

      <ChartArea>
        {view === "table" ? (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <th scope="col">{xLabel}</th>
                  {series.map((entry) => (
                    <th key={entry.name} scope="col">
                      {entry.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={String(category)}>
                    <td>{category}</td>
                    {series.map((entry) => (
                      <td key={entry.name}>{formatINR(entry.data[index] ?? 0)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        ) : (
          <CalcChart
            categories={categories}
            series={series}
            xLabel={xLabel}
            type={view === "yearly" ? "column" : "areaspline"}
          />
        )}
      </ChartArea>

      <Legalese>
        {footnote ? `${footnote} ` : ""}
        These figures are educational illustrations using constant rates. They are not
        guaranteed, and they are not investment advice. Mutual fund investments are subject to
        market risks; read all scheme related documents carefully.
      </Legalese>
    </Panel>
  );
}
