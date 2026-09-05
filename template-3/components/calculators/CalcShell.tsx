"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

/**
 * Shared chrome for every calculator: inputs on the left, headline numbers on
 * the right, chart underneath. Light surfaces throughout - the previous panel
 * was a single dark slab, which read as a hole in a cream page.
 */

const Panel = styled.div`
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const Controls = styled.div`
  padding: 30px;
  display: grid;
  align-content: start;
  gap: 4px;
`;

const Output = styled.div`
  padding: 30px;
  background: var(--surface);
  border-left: 1px solid var(--line);
  display: grid;
  align-content: start;
  gap: 18px;

  @media (max-width: 880px) {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
`;

const StatBlock = styled.div<{ $emphasis?: boolean }>`
  span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
    color: ${({ $emphasis }) => ($emphasis ? "var(--accent-strong)" : "var(--muted)")};
    margin-bottom: 6px;
  }

  strong {
    display: block;
    font-family: var(--font-sans);
    font-size: ${({ $emphasis }) => ($emphasis ? "clamp(30px, 3.4vw, 40px)" : "24px")};
    font-weight: ${({ $emphasis }) => ($emphasis ? 650 : 550)};
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--ink);
  }
`;

const ChartArea = styled.div`
  padding: 8px 24px 24px;
  border-top: 1px solid var(--line);
`;

const Legalese = styled.p`
  padding: 0 30px 26px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
`;

const Head = styled.p`
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--accent-strong);
  margin-bottom: 18px;
`;

export type Stat = { label: string; value: string; emphasis?: boolean };

export function CalcShell({
  title,
  controls,
  stats,
  chart,
}: {
  title?: string;
  controls: ReactNode;
  stats: Stat[];
  chart?: ReactNode;
}) {
  return (
    <Panel>
      <Top>
        <Controls>
          {title ? <Head>{title}</Head> : null}
          {controls}
        </Controls>
        <Output>
          {stats.map((stat) => (
            <StatBlock key={stat.label} $emphasis={stat.emphasis}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </StatBlock>
          ))}
        </Output>
      </Top>
      {chart ? <ChartArea>{chart}</ChartArea> : null}
      <Legalese>
        These figures are educational illustrations using constant rates. They are not
        guaranteed, and they are not investment advice. Mutual fund investments are subject
        to market risks.
      </Legalese>
    </Panel>
  );
}
