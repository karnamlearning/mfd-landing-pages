"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Container } from "@/components/ui";

/**
 * A sticky rail of category tabs on the services page, the same shape as the
 * calculator tabs. A tab scrolls to its section; the highlighted tab follows
 * the reader as they scroll, and the URL hash is kept in step so a section
 * stays shareable.
 */

export type ServiceTab = { id: string; label: string };

const Rail = styled.div`
  position: sticky;
  top: var(--header-height, 76px);
  z-index: 20;
  background: var(--surface-veil);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  font-size: 13px;
  font-weight: 650;
  color: ${({ $on }) => ($on ? "var(--ink)" : "var(--muted)")};
  transition: color 0.18s ease;

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
  background: var(--accent-strong);
`;

export function ServiceTabs({ tabs }: { tabs: ServiceTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // While a click-triggered smooth scroll is in flight the observer would flick
  // through every section on the way; hold the clicked tab until it settles.
  const lock = useRef<number | null>(null);

  const go = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    if (lock.current !== null) window.clearTimeout(lock.current);
    lock.current = window.setTimeout(() => {
      lock.current = null;
    }, 900);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (tabs.some((tab) => tab.id === hash)) setActive(hash);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);

    // Header dropdowns use <Link href="/services#insurance">. Client navigations
    // often skip hashchange, so watch clicks the same way the calculator rail does.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== "/services") return;
        const id = url.hash.slice(1);
        if (tabs.some((tab) => tab.id === id)) queueMicrotask(() => go(id));
      } catch {
        /* ignore malformed hrefs */
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, [go, tabs]);

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const onScroll = () => {
      if (lock.current !== null) return;
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tabs]);

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.id === active);
    tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active, tabs]);

  useEffect(() => () => {
    if (lock.current !== null) window.clearTimeout(lock.current);
  }, []);

  return (
    <Rail>
      <Container>
        <Scroller role="tablist" aria-label="Service categories">
          {tabs.map((tab, position) => {
            const on = tab.id === active;
            return (
              <Tab
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[position] = node;
                }}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={tab.id}
                $on={on}
                onClick={() => go(tab.id)}
              >
                {tab.label}
                {on ? (
                  <Underline
                    layoutId="service-tab-underline"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                ) : null}
              </Tab>
            );
          })}
        </Scroller>
      </Container>
    </Rail>
  );
}
