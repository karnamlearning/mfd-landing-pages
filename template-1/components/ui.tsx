"use client";

import styled, { css } from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  width: min(1320px, calc(100% - 48px));
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(1180px, calc(100% - 28px));
  }
`;

export const Section = styled.section.attrs<{
  $tone?: "cream" | "paper" | "navy" | "ink";
}>(({ $tone }) => ({
  className: $tone === "navy" || $tone === "ink" ? "on-dark-scope" : undefined,
})) <{ $tone?: "cream" | "paper" | "navy" | "ink" }>`
  padding: 72px 0;
  background: ${({ $tone }) =>
    $tone === "navy"
      ? "var(--surface-dark)"
      : $tone === "ink"
        ? "var(--surface-darkest)"
        : $tone === "paper"
          ? "var(--surface-raised)"
          : "var(--surface)"};
  color: ${({ $tone }) =>
    $tone === "navy" || $tone === "ink" ? "var(--on-brand)" : "var(--ink)"};

  @media (max-width: 800px) {
    padding: 56px 0;
  }
`;

export const Eyebrow = styled.p`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-text);
  font-weight: 700;
  margin-bottom: 12px;
`;

export const Display = styled.h2`
  font-family: var(--font-sans);
  font-weight: 650;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.12;
  letter-spacing: -0.03em;
  max-width: 18ch;
`;

/**
 * A heading for a section inside a page. Deliberately smaller than the page
 * title in PageHero so each page reads with one dominant heading; `Display` is
 * reserved for the home page, where there is no PageHero to compete with.
 */
export const SectionTitle = styled.h2`
  font-family: var(--font-sans);
  font-weight: 650;
  font-size: clamp(22px, 2vw, 26px);
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
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
  letter-spacing: 0.02em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s ease;
  width: fit-content;

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
            color: var(--on-brand);
            border-color: var(--line-accent);
            &:hover {
              background: var(--on-brand-veil);
            }
          `
        : $variant === "light"
          ? css`
              background: var(--surface-raised);
              color: var(--brand);
              &:hover {
                background: var(--surface);
              }
            `
          : css`
              background: var(--cta-bg);
              color: var(--cta-text);
              &:hover {
                background: var(--cta-bg-hover);
                box-shadow: var(--shadow);
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
  padding: 28px;
  box-shadow: 0 1px 0 var(--edge-highlight) inset;
`;

export const CardLink = styled(Link)`
  display: block;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: 0 1px 0 var(--edge-highlight) inset;
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }
`;

export const DisplayTitle = styled.h1`
  font-family: var(--font-sans);
  font-weight: 650;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.15;
  letter-spacing: -0.03em;
  max-width: 16ch;
  color: var(--ink);
`;

export const PageHeroWrap = styled.section.attrs({ className: "page-hero" })``;
