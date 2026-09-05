"use client";

import styled from "styled-components";
import { Container, Eyebrow, PageHeroWrap } from "@/components/ui";

/**
 * The page heading, and nothing else.
 *
 * This used to be a full-bleed band - its own background, a gradient wash, a
 * closing hairline, a marketing headline, a supporting paragraph and a CTA on
 * top of the header clearance. On a laptop it pushed the first real section of
 * every inner page under the fold. It is now a single line naming the page.
 *
 * `meta` is only for article routes, where the category and publish date are
 * not repeated anywhere else on the page.
 */
/**
 * Still one line, but given a little presence: a short accent rule above the
 * title so the heading reads as a deliberate mark rather than a stray sentence
 * floating under the header.
 */
const Title = styled.h1`
  font-family: var(--font-sans);
  font-weight: 650;
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--ink);
`;

const Rule = styled.span`
  display: block;
  width: 44px;
  height: 3px;
  margin-bottom: 16px;
  border-radius: 2px;
  background: var(--accent);
`;

const Meta = styled(Eyebrow)`
  margin: 0 0 8px;
`;

export function PageHero({ title, meta }: { title: string; meta?: string }) {
  return (
    <PageHeroWrap>
      <Container>
        {meta ? <Meta>{meta}</Meta> : <Rule aria-hidden />}
        <Title>{title}</Title>
      </Container>
    </PageHeroWrap>
  );
}
