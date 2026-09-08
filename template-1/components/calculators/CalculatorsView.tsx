"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import {
  groupOf,
  isCalculatorSlug,
  toolGroups,
  toolsForGroup,
  type CalculatorSlug,
  type ToolGroup,
} from "@/lib/calculators";
import { calculatorIcons } from "@/components/icons";
import { Container, Eyebrow, Section } from "@/components/ui";
import { CalculatorPanel } from "@/components/calculators/panels";

/**
 * One Tools page, two divisions. A group switch (Calculators / Research)
 * picks the division; the tab rail below it lists that division's tools. The
 * active tool's slug lives in the URL hash so deep links and the header menu
 * keep working, and a result stays shareable.
 */

const LEDE: Record<ToolGroup, string> = {
  calculator:
    "Six planning calculators. Change an assumption on the left and the numbers on the right move with it.",
  research:
    "Four mutual fund research tools. Pick a category or scheme, run the query, and compare results.",
};

const firstOf = (group: ToolGroup) => toolsForGroup(group)[0].slug;

/* ---------------------------------------------------------- group switch --- */

const Rail = styled.div`
  position: sticky;
  top: 76px;
  z-index: 20;
  background: var(--surface-veil);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line-strong);
`;

const RailInner = styled.div`
  display: flex;
  align-items: stretch;
  gap: 18px;
  min-width: 0;

  @media (max-width: 780px) {
    flex-direction: column;
    gap: 0;
  }
`;

const GroupSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  flex: 0 0 auto;
  border-right: 1px solid var(--line-strong);
  padding-right: 18px;

  @media (max-width: 780px) {
    border-right: 0;
    padding-right: 0;
    border-bottom: 1px solid var(--line);
  }
`;

const GroupButton = styled.button<{ $on: boolean }>`
  position: relative;
  appearance: none;
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $on }) => ($on ? "var(--on-brand)" : "var(--muted)")};
  background: transparent;
  transition: color 0.18s ease;

  .label {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: ${({ $on }) => ($on ? "var(--on-brand)" : "var(--ink)")};
  }
`;

const GroupPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  display: block;
  border-radius: 999px;
  background: var(--brand-deep, var(--ink));
`;

/* -------------------------------------------------------------- tab rail --- */

const Scroller = styled.div`
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;
  flex: 1 1 auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button<{ $on: boolean }>`
  position: relative;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 16px 16px;
  border: 0;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 650;
  color: ${({ $on }) => ($on ? "var(--ink)" : "var(--muted)")};
  transition: color 0.18s ease;

  svg {
    color: ${({ $on }) => ($on ? "var(--accent-strong)" : "currentColor")};
    transition: color 0.18s ease;
  }

  &:hover {
    color: var(--ink);
  }
`;

const Underline = styled(motion.span)`
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -1px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--accent-strong);
`;

/* ------------------------------------------------------------- workspace --- */

const Intro = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 26px;

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

const Heading = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.06;
  letter-spacing: -0.035em;
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 46ch;
`;

const Counter = styled.p`
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

const Lede = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 62ch;
  margin-bottom: 34px;
`;

export function CalculatorsView() {
  const [active, setActive] = useState<CalculatorSlug>(firstOf(toolGroups[0].id));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const group = groupOf(active);
  const items = useMemo(() => toolsForGroup(group), [group]);
  const slugs = useMemo(() => items.map((item) => item.slug), [items]);
  const index = Math.max(0, slugs.indexOf(active));
  const item = items[index];

  // The hash is the source of truth on arrival, so /tools#retirement-planner
  // opens on that tool (and its division) from the menu or a shared link.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (isCalculatorSlug(hash)) setActive(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);

    // Next.js client navigations often use pushState without firing hashchange.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== "/tools") return;
        const slug = url.hash.slice(1);
        if (isCalculatorSlug(slug)) queueMicrotask(() => setActive(slug));
      } catch {
        /* ignore malformed hrefs */
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Keep the active tab visible on narrow screens, where the rail scrolls.
  useEffect(() => {
    tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index, group]);

  const select = useCallback((slug: CalculatorSlug) => {
    setActive(slug);
    window.history.replaceState(null, "", `#${slug}`);
  }, []);

  const switchGroup = (next: ToolGroup) => {
    if (next !== group) select(firstOf(next));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    let next = -1;
    if (event.key in moves) next = (index + moves[event.key] + slugs.length) % slugs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = slugs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    select(slugs[next]);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <Rail>
        <Container>
          <RailInner>
            <GroupSwitch role="tablist" aria-label="Tool divisions">
              {toolGroups.map((entry) => {
                const on = entry.id === group;
                return (
                  <GroupButton
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    $on={on}
                    onClick={() => switchGroup(entry.id)}
                  >
                    {on ? (
                      <GroupPill
                        layoutId="tool-group-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    ) : null}
                    <span className="label">{entry.label}</span>
                  </GroupButton>
                );
              })}
            </GroupSwitch>

            <Scroller role="tablist" aria-label={toolGroups.find((g) => g.id === group)?.label} onKeyDown={onKeyDown}>
              {items.map((entry, position) => {
                const Icon = calculatorIcons[entry.slug];
                const on = entry.slug === active;
                return (
                  <Tab
                    key={entry.slug}
                    ref={(node) => {
                      tabRefs.current[position] = node;
                    }}
                    id={`calc-tab-${entry.slug}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls={`calc-panel-${entry.slug}`}
                    tabIndex={on ? 0 : -1}
                    $on={on}
                    onClick={() => select(entry.slug)}
                  >
                    {Icon ? <Icon size={16} aria-hidden /> : null}
                    {entry.short}
                    {on ? (
                      <Underline
                        layoutId="calc-tab-underline"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    ) : null}
                  </Tab>
                );
              })}
            </Scroller>
          </RailInner>
        </Container>
      </Rail>

      <Section>
        <Container>
          <Lede>{LEDE[group]}</Lede>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              id={`calc-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`calc-tab-${active}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Intro>
                <div>
                  <Eyebrow>{item.eyebrow}</Eyebrow>
                  <Heading>{item.title}</Heading>
                  <Summary style={{ marginTop: 10 }}>{item.summary}</Summary>
                </div>
                <Counter>
                  {String(index + 1).padStart(2, "0")} / {String(slugs.length).padStart(2, "0")}
                </Counter>
              </Intro>

              <CalculatorPanel slug={active} />
            </motion.div>
          </AnimatePresence>
        </Container>
      </Section>
    </>
  );
}
