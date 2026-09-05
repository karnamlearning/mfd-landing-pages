"use client";

import styled, { css } from "styled-components";
import Link from "next/link";

export const Container = styled.div`
  width: min(1280px, calc(100% - 48px));
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
  padding: 92px 0;
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
    padding: 64px 0;
  }
`;

export const Eyebrow = styled.p`
  font-size: 13px;
  font-weight: 650;
  color: var(--muted);
  margin-bottom: 14px;
`;

export const Display = styled.h2`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(34px, 4.4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.04em;
  max-width: 16ch;

  em {
    font-style: normal;
    color: var(--accent-strong);
  }
`;

export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 2.4vw, 32px);
  line-height: 1.2;
  letter-spacing: -0.03em;
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
  min-height: 50px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.01em;
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
            color: var(--brand-deep);
            border-color: var(--ink);
          }
        `
      : $variant === "ghost"
        ? css`
            background: transparent;
            color: var(--ink);
            border-color: var(--line-strong);
            &:hover {
              background: var(--on-brand-veil);
            }
          `
        : $variant === "light"
          ? css`
              background: var(--on-brand);
              color: var(--brand-deep);
              &:hover {
                background: var(--accent);
              }
            `
          : css`
              background: var(--cta-bg);
              color: var(--cta-text);
              &:hover {
                background: var(--cta-bg-hover);
                box-shadow: var(--shadow-accent);
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
  font-weight: 600;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.12;
  letter-spacing: -0.03em;
  max-width: 16ch;
  color: var(--ink);
`;

export const PageHeroWrap = styled.section.attrs({ className: "page-hero" })``;
