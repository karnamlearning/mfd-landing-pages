"use client";

import styled from "styled-components";
import { Container, Eyebrow, PageHeroWrap } from "@/components/ui";

const Title = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(38px, 5vw, 68px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--ink);
  max-width: 20ch;
`;

const Meta = styled(Eyebrow)`
  margin: 0 0 18px;
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
