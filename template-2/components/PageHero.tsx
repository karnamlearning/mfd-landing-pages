"use client";

import styled from "styled-components";
import { Container, Eyebrow, PageHeroWrap } from "@/components/ui";

const Title = styled.h1`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(36px, 4.4vw, 56px);
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--ink);
  max-width: 18ch;
`;

const Meta = styled(Eyebrow)`
  margin: 0 0 12px;
  color: var(--accent);
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
