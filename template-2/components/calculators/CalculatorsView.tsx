"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { calculatorMeta, type CalculatorSlug } from "@/lib/calculators";
import { calculatorIcons } from "@/components/icons";
import { Container, Eyebrow, Section } from "@/components/ui";
import { CalculatorPanel } from "@/components/calculators/panels";

/**
 * Every calculator on one page.
 *
 * There used to be a route per calculator, which meant a full page load to
 * answer "and what if I did it as a lumpsum instead". They are now tabs over a
 * single workspace; the slug still lives in the URL hash, so the old deep
 * links and the header menu keep working and a result stays shareable.
 */

const slugs = calculatorMeta.map((item) => item.slug);

const isSlug = (value: string): value is CalculatorSlug =>
  (slugs as readonly string[]).includes(value);

/* -------------------------------------------------------------- tab rail --- */

const Rail = styled.div`
  position: sticky;
  top: 76px;
  z-index: 20;
  background: var(--surface-veil);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line-strong);
`;

const Scroller = styled.div`
  display: flex;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;

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
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ $on }) => ($on ? "var(--ink)" : "var(--muted)")};
  transition: color 0.18s ease;
  text-transform: none;
  letter-spacing: 0;
  font-size: 13px;
  font-weight: 650;

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
  const [active, setActive] = useState<CalculatorSlug>(slugs[0]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const workspace = useRef<HTMLDivElement>(null);

  const index = slugs.indexOf(active);
  const item = calculatorMeta[index];

  // The hash is the source of truth on arrival, so /calculators#retirement-planning
  // opens on that calculator whether it came from the menu or a shared link.
  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (isSlug(hash)) setActive(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);

    // Next.js client navigations often use pushState without firing hashchange.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== "/calculators") return;
        const slug = url.hash.slice(1);
        if (isSlug(slug)) queueMicrotask(() => setActive(slug));
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
  }, [index]);

  const select = useCallback((slug: CalculatorSlug) => {
    setActive(slug);
    window.history.replaceState(null, "", `#${slug}`);
  }, []);

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
          <Scroller role="tablist" aria-label="Calculators" onKeyDown={onKeyDown}>
            {calculatorMeta.map((entry, position) => {
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
        </Container>
      </Rail>

      <Section>
        <Container>
          <Lede>
            Seven planning tools, one page. Change an assumption on the left and every number,
            chart and table on the right moves with it - no page reloads, no lost inputs.
          </Lede>

          <div ref={workspace}>
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
          </div>
        </Container>
      </Section>
    </>
  );
}
