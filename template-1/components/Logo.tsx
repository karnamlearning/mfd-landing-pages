"use client";

import styled from "styled-components";
import Link from "next/link";
import { site } from "@/lib/site";

/* Bold sans wordmark. */
const Mark = styled(Link)`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  color: inherit;
`;

const Word = styled.span`
  font-family: var(--font-logo);
  font-weight: 800;
  font-size: 24px;
  line-height: 1;
  letter-spacing: -0.04em;
`;

const Sub = styled.small`
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.6;
  font-weight: 700;

  @media (max-width: 640px) {
    display: none;
  }
`;

export function LogoMark() {
  return <Word aria-hidden>{site.shortName}</Word>;
}

export function Logo({ onDark = false, tagline = true }: { onDark?: boolean; tagline?: boolean }) {
  void onDark;
  return (
    <Mark href="/" aria-label={site.name}>
      <Word>{site.shortName}</Word>
      {tagline ? <Sub>{site.logoTagline}</Sub> : null}
    </Mark>
  );
}
