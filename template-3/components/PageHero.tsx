"use client";

import styled from "styled-components";
import { Container, Eyebrow, PageHeroWrap } from "@/components/ui";

const Title = styled.h1`
  font-family: var(--font-display);
  font-weight: 750;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.045em;
  color: var(--on-brand);
  max-width: 16ch;
`;

const Meta = styled(Eyebrow)`
  margin: 0 0 16px;
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
