"use client";

import styled, { css } from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(1200px, calc(100% - 28px));
  }
`;

export const Section = styled.section.attrs<{
  $tone?: "cream" | "paper" | "sage" | "navy" | "ink";
}>(({ $tone }) => ({
  className: $tone === "navy" || $tone === "ink" ? "on-dark-scope" : undefined,
}))<{ $tone?: "cream" | "paper" | "sage" | "navy" | "ink" }>`
  padding: 96px 0;
  background: ${({ $tone }) =>
    $tone === "navy"
      ? "var(--surface-dark)"
      : $tone === "ink"
        ? "var(--surface-darkest)"
        : $tone === "paper"
          ? "var(--surface-raised)"
          : $tone === "sage"
            ? "var(--surface-sage)"
            : "var(--surface)"};
  color: ${({ $tone }) =>
    $tone === "navy" || $tone === "ink" ? "var(--on-brand)" : "var(--ink)"};

  @media (max-width: 800px) {
    padding: 64px 0;
  }
`;

/* Small pill label: "AMFI-registered", "What we do". */
export const Eyebrow = styled.p`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: transparent;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink);
  font-weight: 700;
  margin-bottom: 18px;

  .on-dark-scope & {
    color: var(--on-brand);
  }
`;

export const Display = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(32px, 4vw, 50px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  max-width: 18ch;

  em {
    font-style: normal;
    color: var(--accent-text);
  }
`;

/**
 * A heading for a section inside an inner page. Deliberately smaller than the
 * page title in PageHero so each page reads with one dominant heading.
 */
export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 2.4vw, 34px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 4px;

  em {
    font-style: normal;
    color: var(--accent-text);
  }
`;

export const Lead = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 58ch;
`;

const buttonStyles = css<{ $variant?: "gold" | "navy" | "ghost" | "light" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s ease;
  width: fit-content;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  ${({ $variant }) =>
    $variant === "navy"
      ? css`
          background: transparent;
          color: var(--ink);
          border-color: var(--line-strong);
          &:hover {
            background: var(--ink);
            color: var(--surface-raised);
            border-color: var(--ink);
          }
        `
      : $variant === "ghost"
        ? css`
            background: transparent;
            color: inherit;
            border-color: var(--line-strong);
            &:hover {
              background: var(--tint-accent-weak);
              border-color: currentColor;
            }
          `
        : $variant === "light"
          ? css`
              background: var(--surface-raised);
              color: var(--ink);
              border-color: var(--line);
              &:hover {
                background: var(--surface);
              }
            `
          : css`
              background: var(--cta-bg);
              color: var(--cta-text);
              border-color: var(--cta-bg);
              &:hover {
                background: var(--cta-bg-hover);
                border-color: var(--cta-bg-hover);
              }
            `}
`;

export const ButtonLink = styled(Link)<{
  $variant?: "gold" | "navy" | "ghost" | "light";
}>`
  ${buttonStyles}
`;

export const Button = styled.button<{
  $variant?: "gold" | "navy" | "ghost" | "light";
}>`
  ${buttonStyles}
`;

export const Grid = styled.div<{ $cols?: number }>`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(${({ $cols }) => $cols ?? 3}, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px;
`;

export const CardLink = styled(Link)`
  display: block;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px;
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }
`;

export const DisplayTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(30px, 3.4vw, 44px);
  line-height: 1.1;
  letter-spacing: -0.03em;
  max-width: 16ch;
  color: var(--ink);
`;

/* Five filled stars, as used under hero and process copy. */
export const Stars = styled.span.attrs({ "aria-hidden": true })`
  display: inline-flex;
  gap: 2px;
  color: var(--star);
  font-size: 13px;
  letter-spacing: 0.06em;

  &::before {
    content: "★★★★★";
  }
`;

/* An icon badge and a pill label on one baseline - service cards, process steps. */
export const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  ${Eyebrow} {
    margin: 0;
  }
`;

export const PageHeroWrap = styled.section.attrs({ className: "page-hero" })``;
