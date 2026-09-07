"use client";

import styled from "styled-components";
import Link from "next/link";
import { site } from "@/lib/site";

/*
 * A serif wordmark, the way a firm's name sits on a letterhead, with the
 * category and city in tracked small caps beside it.
 */

const Mark = styled(Link)`
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  color: inherit;
  white-space: nowrap;
`;

const Name = styled.span`
  font-family: var(--font-display);
  font-size: 27px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--ink);
`;

const Sub = styled.span<{ $hideNarrow?: boolean }>`
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
  line-height: 1;

  ${({ $hideNarrow }) =>
    $hideNarrow
      ? `@media (max-width: 1360px) { display: none; }`
      : ""}
`;

export function LogoMark() {
  return <Name aria-hidden>{site.shortName}</Name>;
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Mark href="/" aria-label={site.name}>
      <Name>{site.shortName}</Name>
      <Sub $hideNarrow={compact}>
        {site.logoTagline} · {site.address.city}
      </Sub>
    </Mark>
  );
}
