"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { FiArrowRight, FiSearch } from "react-icons/fi";
import { PageHero } from "@/components/PageHero";
import { Container, Lead, Section } from "@/components/ui";

export type TopicCard = { slug: string; title: string; excerpt: string };

const Toolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }
`;

const Search = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  padding: 0 16px;
  min-height: 48px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm, 0);
  background: var(--surface-raised);
  color: var(--muted);
  transition: border-color 0.15s ease;

  &:focus-within {
    border-color: var(--accent-strong);
  }

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    font-size: 15px;
    color: var(--ink);

    &:focus {
      outline: none;
    }
  }

  @media (max-width: 720px) {
    min-width: 0;
  }
`;

const List = styled.ol`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Topic = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  padding: 26px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent-strong);
    transform: translateY(-2px);
  }

  small {
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent-text);
    font-variant-numeric: tabular-nums;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 21px;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 14.5px;
    line-height: 1.65;
    color: var(--muted);
    flex: 1;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: var(--ink);
  }
`;

const Empty = styled.p`
  padding: 40px 0;
  color: var(--muted);
`;

export function MutualFundsView({ topics }: { topics: TopicCard[] }) {
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (t) => t.title.toLowerCase().includes(q) || t.excerpt.toLowerCase().includes(q),
    );
  }, [query, topics]);

  return (
    <>
      <PageHero meta="Insights" title="Mutual Funds" />
      <Section>
        <Container>
          <Toolbar>
            <Lead>
              The basics, answered in plain language: what a mutual fund is, how NAV works, the
              types of funds, and how to invest, switch, and redeem. Start anywhere.
            </Lead>
            <Search>
              <FiSearch size={16} aria-hidden />
              <input
                type="search"
                placeholder="Search topics"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search mutual fund topics"
              />
            </Search>
          </Toolbar>

          {shown.length === 0 ? (
            <Empty>
              {topics.length === 0
                ? "Topics are unavailable right now. Please try again shortly."
                : `Nothing matches "${query}".`}
            </Empty>
          ) : (
            <List>
              {shown.map((topic) => (
                <li key={topic.slug}>
                  <Topic href={`/mutual-funds/${topic.slug}`}>
                    <small>{String(topics.indexOf(topic) + 1).padStart(2, "0")}</small>
                    <h2>{topic.title}</h2>
                    <p>{topic.excerpt}</p>
                    <span>
                      Read the answer <FiArrowRight size={14} aria-hidden />
                    </span>
                  </Topic>
                </li>
              ))}
            </List>
          )}
        </Container>
      </Section>
    </>
  );
}
