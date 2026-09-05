"use client";

import styled from "styled-components";
import { Container, Eyebrow, PageHeroWrap } from "@/components/ui";

/**
 * The page heading, and nothing else. A single bold line under the header so
 * every inner page opens the same way as the home page.
 *
 * `meta` is for article routes and category pages, where a small pill above
 * the title names the section.
 */
const Title = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.06;
  letter-spacing: -0.035em;
  color: var(--ink);
  max-width: 18ch;
`;

const Meta = styled(Eyebrow)`
  margin: 0 0 16px;
`;

export function PageHero({ title, meta }: { title: string; meta?: string }) {
  return (
    <PageHeroWrap>
      <Container>
        {meta ? <Meta>{meta}</Meta> : null}
        <Title>{title}</Title>
      </Container>
    </PageHeroWrap>
  );
}
