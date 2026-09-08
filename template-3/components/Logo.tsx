"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

const Mark = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
`;

const Seal = styled.span<{ $size: number }>`
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;
  line-height: 0;
  background: transparent;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Word = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.05;
`;

const Name = styled.strong`
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const Sub = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  max-width: 22ch;
  opacity: 0.8;
`;

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <Seal $size={size} aria-hidden>
      <Image
        src="/images/logo.png?v=3"
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        priority
        unoptimized
      />
    </Seal>
  );
}

export function Logo({ showAmfiTag = true }: { showAmfiTag?: boolean }) {
  return (
    <Mark href="/" aria-label={site.name}>
      <LogoMark />
      <Word>
        <Name>{site.shortName}</Name>
        {showAmfiTag ? <Sub>{site.amfiMark.tagline}</Sub> : null}
      </Word>
    </Mark>
  );
}
