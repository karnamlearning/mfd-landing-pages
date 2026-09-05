"use client";

import styled, { css } from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;

  @media (max-width: 640px) {
    width: min(1180px, calc(100% - 28px));
  }
`;

export const Section = styled.section.attrs<{
  $tone?: "cream" | "paper" | "navy" | "ink";
}>(({ $tone }) => ({
  className: $tone === "navy" || $tone === "ink" ? "on-dark-scope" : undefined,
}))<{ $tone?: "cream" | "paper" | "navy" | "ink" }>`
  padding: 104px 0;
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
    padding: 72px 0;
  }
`;

export const Eyebrow = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-text);
  margin-bottom: 16px;
`;

export const Display = styled.h2`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.08;
  letter-spacing: -0.03em;
  max-width: 16ch;

  em {
    font-style: normal;
    color: var(--accent);
  }
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 750;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.1;
  letter-spacing: -0.035em;
  margin-bottom: 4px;

  em {
    font-style: normal;
    color: var(--accent);
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
  min-height: 50px;
  padding: 0 22px;
  border-radius: 0;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s ease;
  width: fit-content;

  ${({ $variant }) =>
    $variant === "navy"
      ? css`
          background: var(--ink);
          color: var(--surface);
          border-color: var(--ink);
          &:hover {
            background: transparent;
            color: var(--ink);
          }
        `
      : $variant === "ghost"
        ? css`
            background: transparent;
            color: inherit;
            border-color: currentColor;
            &:hover {
              background: var(--on-brand-veil);
            }
          `
        : $variant === "light"
          ? css`
              background: var(--on-brand);
              color: var(--ink);
              &:hover {
                background: var(--accent);
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
  border-radius: 0;
  padding: 28px;
`;

export const CardLink = styled(Link)`
  display: block;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: 0;
  padding: 28px;
  color: inherit;
  transition: 0.2s ease;

  &:hover {
    border-color: var(--accent);
    background: var(--tint-accent-weak);
  }
`;

export const DisplayTitle = styled.h1`
  font-family: var(--font-display);
  font-weight: 750;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.04em;
  max-width: 16ch;
  color: inherit;
`;

export const PageHeroWrap = styled.section.attrs({ className: "page-hero on-dark-scope" })``;
