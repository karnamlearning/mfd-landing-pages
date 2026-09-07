"use client";

import Link from "next/link";
import styled from "styled-components";
import { FiArrowRight } from "react-icons/fi";
import { Container, Eyebrow, Section } from "@/components/ui";
import { PageHero } from "@/components/PageHero";

export type NewsCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  source: string;
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 0.85fr);
  gap: 56px;
  align-items: start;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled(Link)<{ $active?: boolean }>`
  padding: 9px 16px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: 0.18s ease;
  border: 1px solid ${({ $active }) => ($active ? "var(--ink)" : "var(--line-strong)")};
  background: ${({ $active }) => ($active ? "var(--ink)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--surface)" : "var(--ink)")};

  &:hover {
    border-color: var(--ink);
  }
`;

const Item = styled.article`
  padding: 28px 0;
  border-bottom: 1px solid var(--line);
`;

const ItemTitle = styled(Link)`
  display: block;
  font-family: var(--font-display);
  font-size: clamp(21px, 2vw, 28px);
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -0.03em;
  color: var(--ink);

  &:hover {
    color: var(--accent-strong);
  }
`;

const Meta = styled.p`
  margin: 10px 0 12px;
  font-size: 13px;
  color: var(--muted);

  b {
    color: var(--accent-text);
    font-weight: 650;
  }
`;

const Excerpt = styled.p`
  color: var(--muted);
  line-height: 1.7;
  max-width: 64ch;
`;

const More = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-text);
`;

const Panel = styled.div`
  position: sticky;
  top: 96px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  padding: 24px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const RecentRow = styled(Link)`
  display: block;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }

  h3 {
    font-size: 15px;
    line-height: 1.45;
    font-weight: 650;
    color: var(--ink);
  }

  small {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: var(--muted);
  }

  &:hover h3 {
    color: var(--accent-strong);
  }
`;

const Empty = styled.p`
  padding: 40px 0;
  color: var(--muted);
`;

function href(category: string) {
  return category ? `/news?category=${encodeURIComponent(category)}` : "/news";
}

export function NewsView({
  items,
  recent,
  categories,
  category,
}: {
  items: NewsCard[];
  recent: NewsCard[];
  categories: string[];
  category: string;
}) {
  return (
    <>
      <PageHero title="Market News" />
      <Section>
        <Container>
          <Layout>
            <div>
              <Chips>
                {categories.map((name) => {
                  const value = name === "All" ? "" : name;
                  return (
                    <Chip
                      key={name}
                      href={href(value)}
                      $active={category === value}
                      scroll={false}
                    >
                      {name}
                    </Chip>
                  );
                })}
              </Chips>

              {items.map((item) => (
                <Item key={item.slug}>
                  <ItemTitle href={`/news/${item.slug}`}>{item.title}</ItemTitle>
                  <Meta>
                    {item.date} · <b>{item.category}</b> · by {item.source}
                  </Meta>
                  <Excerpt>{item.excerpt}</Excerpt>
                  <More href={`/news/${item.slug}`}>
                    Read more <FiArrowRight />
                  </More>
                </Item>
              ))}

              {items.length === 0 ? (
                <Empty>
                  Nothing filed under {category || "this feed"} right now. Try another
                  category.
                </Empty>
              ) : null}
            </div>

            <Panel>
              <Eyebrow>Recent news</Eyebrow>
              {recent.map((item) => (
                <RecentRow key={item.slug} href={`/news/${item.slug}`}>
                  <h3>{item.title}</h3>
                  <small>{item.date}</small>
                </RecentRow>
              ))}
            </Panel>
          </Layout>
        </Container>
      </Section>
    </>
  );
}
