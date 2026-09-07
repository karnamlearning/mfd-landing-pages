"use client";

import styled, { css } from "styled-components";
import Link from "next/link";

/*
 * Shared primitives. The visual language is editorial: serif headlines with an
 * italic highlight, tiny tracked uppercase labels, near-square buttons, and
 * hairlines instead of boxes wherever a box is not needed.
 */

export const Container = styled.div`
  width: min(1360px, calc(100% - 80px));
  margin: 0 auto;

  @media (max-width: 800px) {
    width: min(1360px, calc(100% - 40px));
  }
`;

export const Section = styled.section.attrs<{
  $tone?: "cream" | "paper" | "navy" | "ink";
}>(({ $tone }) => ({
  className: $tone === "navy" || $tone === "ink" ? "on-dark-scope" : undefined,
})) <{ $tone?: "cream" | "paper" | "navy" | "ink" }>`
  padding: 112px 0;
  background: ${({ $tone }) =>
    $tone === "navy"
      ? "var(--surface-dark)"
      : $tone === "ink"
        ? "var(--surface-darkest)"
        : $tone === "paper"
          ? "var(--surface-alt)"
          : "var(--surface)"};
  color: ${({ $tone }) =>
    $tone === "navy" || $tone === "ink" ? "var(--on-brand)" : "var(--ink)"};

  @media (max-width: 800px) {
    padding: 72px 0;
  }
`;

/** Tiny tracked label above a headline: "WHAT WE HANDLE". */
export const Eyebrow = styled.p`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 18px;
`;

/** Section headline. Wrap the highlight in <em> for the italic cut. */
export const Display = styled.h2`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(34px, 4.2vw, 58px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  max-width: 18ch;
  color: var(--ink);

  em {
    font-style: italic;
    font-weight: 400;
    color: var(--accent-text);
  }
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1.12;
  letter-spacing: -0.015em;
  margin-bottom: 4px;
`;

export const Lead = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 56ch;
`;

const buttonStyles = css<{ $variant?: "gold" | "navy" | "ghost" | "light" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 1;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  width: fit-content;
  white-space: nowrap;

  ${({ $variant }) =>
    $variant === "navy"
      ? css`
          background: transparent;
          color: var(--ink);
          border-color: var(--line-strong);
          &:hover {
            background: var(--brand-deep);
            color: var(--on-brand);
            border-color: var(--brand-deep);
          }
        `
      : $variant === "ghost"
        ? css`
            background: transparent;
            color: inherit;
            padding: 0 4px;
            text-decoration: underline;
            text-underline-offset: 5px;
            text-decoration-color: var(--line-strong);
            &:hover {
              text-decoration-color: currentColor;
            }
          `
        : $variant === "light"
          ? css`
              background: var(--on-brand);
              color: var(--brand-deep);
              &:hover {
                background: rgb(255 255 255);
              }
            `
          : css`
              background: var(--cta-bg);
              color: var(--cta-text);
              &:hover {
                background: var(--cta-bg-hover);
              }
            `}
`;

export const ButtonLink = styled(Link) <{
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
  gap: 22px;
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
  padding: 30px;
`;

export const CardLink = styled(Link)`
  display: block;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px;
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--brand);
  }
`;

export const DisplayTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(36px, 4.6vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  max-width: 16ch;
  color: var(--ink);
`;

export const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  ${Eyebrow} {
    margin: 0;
  }
`;

/** Hairline rule with a label, used between editorial blocks. */
export const Rule = styled.hr`
  border: 0;
  border-top: 1px solid var(--line);
`;

export const PageHeroWrap = styled.section.attrs({ className: "page-hero" })``;
