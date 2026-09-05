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

const Tile = styled.span`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: var(--accent);
  color: var(--ink);
`;

const Glyph = styled.span`
  font-family: var(--font-logo);
  font-size: 26px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.04em;
  translate: 0 1px;
`;

const Word = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.05;
`;

const Name = styled.strong`
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Sub = styled.small`
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.7;
  font-weight: 650;
  margin-top: 3px;
`;

const markLetter = site.shortName.trim().charAt(0);

export function LogoMark() {
  return (
    <Tile aria-hidden>
      <Glyph>{markLetter}</Glyph>
    </Tile>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  void onDark;
  return (
    <Mark href="/" aria-label={site.name}>
      <LogoMark />
      <Word>
        <Name>{site.name}</Name>
        <Sub>{site.logoTagline}</Sub>
      </Word>
    </Mark>
  );
}
