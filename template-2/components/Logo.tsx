"use client";

import styled from "styled-components";
import Link from "next/link";
import { site } from "@/lib/site";

const Mark = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
`;

const Tile = styled.span<{ $onDark?: boolean }>`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  flex-shrink: 0;
  background: ${({ $onDark }) => ($onDark ? "var(--surface-dark)" : "var(--accent)")};
  color: ${({ $onDark }) => ($onDark ? "var(--accent)" : "var(--brand-deep)")};
  box-shadow: ${({ $onDark }) =>
    $onDark ? "none" : "inset 0 1px 0 rgb(255 255 255 / 0.12)"};
`;

const Glyph = styled.span`
  font-family: var(--font-logo);
  font-size: 30px;
  font-weight: 700;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.06em;
  translate: 0 1px;
`;

const Word = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.05;
`;

const Name = styled.strong`
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Sub = styled.small`
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.7;
  font-weight: 650;
  margin-top: 3px;
`;

const markLetter = site.shortName.trim().charAt(0);

export function LogoMark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Tile $onDark={onDark} aria-hidden>
      <Glyph>{markLetter}</Glyph>
    </Tile>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Mark href="/" aria-label={site.name}>
      <LogoMark onDark={onDark} />
      <Word>
        <Name>{site.name}</Name>
        <Sub>{site.logoTagline}</Sub>
      </Word>
    </Mark>
  );
}
