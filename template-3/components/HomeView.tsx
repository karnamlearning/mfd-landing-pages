"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import styled from "styled-components";
import { motion, type Variants } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import {
  PiArrowsClockwiseThin,
  PiChartLineUpThin,
  PiCompassThin,
  PiMagnifyingGlassThin,
} from "react-icons/pi";
import {
  blogPosts,
  goals,
  hero,
  homeServiceSlugs,
  partners,
  processSteps,
  services,
  testimonials,
} from "@/lib/content";
import { site } from "@/lib/site";
import { photos } from "@/lib/media";
import { calculatorMeta } from "@/lib/calculators";
import { LeadForm } from "@/components/LeadForm";
import { CountUp, Item, Reveal, Stagger, ease, useReduceMotion } from "@/components/motion";
import { IconBadge } from "@/components/icons";
import { ButtonLink, Container, Display, Eyebrow, Lead, Section } from "@/components/ui";

const featured = homeServiceSlugs
  .map((slug) => services.find((item) => item.slug === slug)!)
  .slice(0, 3);

const pillarSlugs = [
  "investor-onboarding",
  "scheme-selection",
  "sip-services",
  "portfolio-monitoring",
  "goal-based-investing",
  "retirement-planning",
] as const;

const pillarPhotos = [
  photos.caseA,
  photos.caseB,
  photos.caseC,
  photos.caseD,
  photos.caseE,
  photos.caseF,
] as const;

const pillars = pillarSlugs.map((slug, index) => ({
  service: services.find((item) => item.slug === slug)!,
  image: pillarPhotos[index],
}));

const resources = [
  {
    href: "/tools#sip-calculator",
    title: calculatorMeta.find((item) => item.slug === "sip-calculator")!.title,
    note: calculatorMeta.find((item) => item.slug === "sip-calculator")!.summary,
    image: photos.resourceSip,
  },
  {
    href: "/tools#retirement-planner",
    title: calculatorMeta.find((item) => item.slug === "retirement-planner")!.title,
    note: calculatorMeta.find((item) => item.slug === "retirement-planner")!.summary,
    image: photos.resourceRetirement,
  },
  {
    href: "/blog",
    title: blogPosts[0].title,
    note: blogPosts[0].excerpt,
    image: photos.resourceBlog,
  },
] as const;

/*
 * Client impact stories. Each pairs a testimonial with a portrait and a short
 * before/after summary drawn from the quote. testimonials[1] is used in the
 * portrait block further down.
 */
const impactStories = [
  {
    ...testimonials[0],
    image: photos.storyA,
    before: "Several SIPs across banks and apps, none tied to a purpose.",
    after: "Everything consolidated, each investment mapped to a goal, reviewed every quarter.",
  },
  {
    ...testimonials[2],
    image: photos.storyB,
    before: "NRE and NRO accounts plus KYC to sort out from overseas.",
    after: "Onboarded smoothly, with SIPs running without any hassle since.",
  },
  {
    ...testimonials[3],
    image: photos.storyC,
    before: "A falling market and the urge to stop investing.",
    after: "Stayed invested, kept the SIPs going, and saw the discipline pay off.",
  },
] as const;
const storyDwellMs = 7000;

/*
 * Home page runs slower than the shared defaults (0.7s) so sections settle
 * gently, and each block waits until `revealAmount` of it is on screen before
 * it starts, so the animation plays while you are actually looking at it.
 */
const revealDuration = 1.3;
const itemDuration = 1.2;
const staggerGap = 0.16;
const revealAmount = 0.4;
/* The process grid stacks tall on phones, so it needs less of itself visible to start. */
const gridAmount = 0.25;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: revealDuration, ease, delay },
});

const Hero = styled.section.attrs({ className: "home-hero" })``;
const Stage = styled.div.attrs({ className: "hero-stage" })``;

const StagePhoto = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgb(10 10 10 / 0.82) 0%, rgb(10 10 10 / 0.55) 48%, rgb(10 10 10 / 0.28) 100%),
      linear-gradient(180deg, rgb(10 10 10 / 0.2) 0%, rgb(10 10 10 / 0.62) 100%);
  }
`;

const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 140px 0 80px;

  @media (max-height: 760px) {
    align-items: flex-end;
    padding: 108px 0 48px;
  }
`;

const Proof = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: min(720px, 100%);
  margin-bottom: 28px;
`;

const Faces = styled.div`
  display: flex;
  flex-shrink: 0;
  padding-right: 8px;
`;

const Face = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  margin-left: -10px;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid var(--accent);
  background: var(--surface-darkest);

  &:first-child {
    margin-left: 0;
  }

  img {
    object-fit: cover;
  }
`;

const Ticker = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(var(--seed-accent) / 0.35);
  background: rgb(10 10 10 / 0.55);
  backdrop-filter: blur(10px);
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  gap: 0;
  animation: home-marquee 22s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const TickerItem = styled.span`
  flex-shrink: 0;
  padding: 11px 18px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  white-space: nowrap;

  &::after {
    content: "·";
    margin-left: 18px;
    opacity: 0.55;
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(42px, 6.4vw, 84px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 700;
  max-width: 14ch;
  color: var(--on-brand);

  em {
    font-style: normal;
    color: var(--accent);
  }
`;

const HeroBottom = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.85fr);
  gap: 40px;
  align-items: end;
  margin-top: 36px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const HeroQuote = styled(motion.blockquote)`
  position: relative;
  justify-self: end;
  width: 100%;
  max-width: 38ch;
  margin: 0;
  padding: 22px 22px 20px 24px;
  background: rgb(10 10 10 / 0.72);
  border: 1px solid rgb(var(--seed-accent) / 0.45);
  border-left: 3px solid var(--accent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--on-brand);
  box-shadow: 0 18px 40px rgb(0 0 0 / 0.28);

  &::before {
    content: "“";
    position: absolute;
    top: 6px;
    right: 16px;
    font-family: var(--font-logo);
    font-size: 64px;
    line-height: 1;
    color: var(--accent);
    opacity: 0.55;
    pointer-events: none;
  }

  p {
    position: relative;
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
    color: rgb(var(--seed-on-brand) / 0.92);
    max-width: 34ch;
  }

  footer {
    position: relative;
    display: grid;
    gap: 2px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgb(var(--seed-accent) / 0.28);
  }

  cite {
    font-style: normal;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--accent);
  }

  span {
    font-size: 12px;
    color: rgb(var(--seed-on-brand) / 0.62);
  }

  @media (max-width: 800px) {
    justify-self: start;
    max-width: none;

    &::before {
      font-size: 52px;
      top: 4px;
      right: 12px;
    }
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const heroQuote = testimonials[1];

const Intro = styled(Section)`
  text-align: center;
  padding-top: 104px;
  padding-bottom: 0;
  background: #f6f3e4;
`;

const IntroTitle = styled(Display)`
  margin: 0 auto;
  max-width: 16ch;
  text-align: center;
`;

const IntroLead = styled(Lead)`
  margin: 22px auto 0;
  text-align: center;
  max-width: 52ch;
  font-size: 16px;
`;

/*
 * The question cloud sits outside the Container and spans the full viewport.
 * Its radial mask has a 50% horizontal radius, so it reaches transparent
 * exactly at the screen edges and never cuts off early. A backdrop-blur
 * overlay masked to the outer ring softens pills as they drift outward while
 * the centre stays crisp.
 */
const cloudMask =
  "radial-gradient(ellipse 50% 140% at 50% 50%, #000 26%, rgb(0 0 0 / 0.6) 58%, rgb(0 0 0 / 0.18) 84%, transparent 100%)";
const cloudBlurMask = "radial-gradient(ellipse 50% 140% at 50% 50%, transparent 34%, #000 82%)";

const Cloud = styled(motion.div)`
  position: relative;
  width: 100%;
  margin: 44px 0 0;
  padding: 12px 0;
  overflow: hidden;
  mask-image: ${cloudMask};
  -webkit-mask-image: ${cloudMask};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    mask-image: ${cloudBlurMask};
    -webkit-mask-image: ${cloudBlurMask};
  }
`;

const CloudRow = styled.div<{ $reverse?: boolean; $duration: number }>`
  display: flex;
  width: max-content;
  margin-top: 14px;
  animation: home-cloud-marquee ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? "reverse" : "normal")};

  &:first-child {
    margin-top: 0;
  }

  ${Cloud}:hover & {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* Pill wrapper: framer animates this; the margin (not a flex gap) keeps the -50% loop seamless. */
const CloudCell = styled(motion.span)`
  display: inline-flex;
  flex-shrink: 0;
  margin-right: 18px;
`;

const pillPop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
};

const cloudDrift = [46, 58, 52] as const;

const Pill = styled.span`
  flex-shrink: 0;
  padding: 11px 18px;
  border-radius: 999px;
  background: #ebe4c4;
  color: var(--ink);
  font-size: 13px;
  font-weight: 550;
  line-height: 1.3;
  white-space: nowrap;
`;

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 56px;
  border-top: 1px dashed rgb(var(--seed-ink) / 0.28);
  text-align: left;

  > * {
    padding: 44px 32px 72px;
  }

  > *:first-child {
    padding-left: 0;
  }

  > * + * {
    border-left: 1px dashed rgb(var(--seed-ink) / 0.28);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;

    > * {
      padding: 36px 24px 48px;
    }

    > *:nth-child(odd) {
      padding-left: 0;
      border-left: none;
    }

    > *:nth-child(n + 3) {
      border-top: 1px dashed rgb(var(--seed-ink) / 0.28);
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;

    > * {
      padding: 32px 0 40px;
      border-left: none;
    }

    > * + * {
      border-top: 1px dashed rgb(var(--seed-ink) / 0.28);
    }
  }
`;

const Pillar = styled.div`
  svg {
    width: 60px;
    height: 60px;
    color: #000;
    display: block;
  }

  h3 {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 750;
    letter-spacing: -0.03em;
    margin: 28px 0 12px;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
    font-size: 15px;
  }
`;

const processMarks = [
  PiMagnifyingGlassThin,
  PiCompassThin,
  PiChartLineUpThin,
  PiArrowsClockwiseThin,
] as const;

const concernRows = [
  [
    "How much SIP do I need?",
    "Which funds should I keep?",
    "Am I saving enough for retirement?",
    "What risks should I prepare for?",
  ],
  [
    "SIP or lumpsum?",
    "How do I plan for education?",
    "Is my portfolio too concentrated?",
    "When should I review my SIPs?",
    "Do I have enough cover?",
  ],
  [
    "Should I stop SIPs in a crash?",
    "How do I start KYC?",
    "What about NRI investing?",
    "Can I rebalance without selling?",
  ],
] as const;

const WorkHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 36px;
  flex-wrap: wrap;
`;

const FeatureShot = styled.div`
  position: relative;
  min-height: 420px;
  overflow: hidden;

  img {
    object-fit: cover;
  }

  @media (max-width: 800px) {
    min-height: 260px;
  }
`;

const WorkCols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 36px;
  border-top: 1px solid var(--line);

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const WorkCol = styled(Link)`
  padding: 28px 24px 8px 0;
  border-right: 1px solid var(--line);

  & + & {
    padding-left: 24px;
  }

  &:last-child {
    border-right: 0;
    padding-right: 0;
  }

  h3 {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 750;
    letter-spacing: -0.03em;
    margin: 12px 0 10px;
  }

  p {
    color: var(--on-brand-mute);
    line-height: 1.65;
    font-size: 15px;
  }

  &:hover h3 {
    color: var(--accent);
  }

  @media (max-width: 800px) {
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 24px 0;

    & + & {
      padding-left: 0;
    }
  }
`;

const LimeBar = styled.div`
  height: 14px;
  background: var(--accent);
  margin-top: 48px;
`;

const LogoRow = styled.div`
  overflow: hidden;
  padding: 28px 0 0;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
`;

const LogoTrack = styled.div`
  display: flex;
  gap: 40px;
  width: max-content;
  animation: home-marquee 36s linear infinite;
  color: var(--on-brand-mute);
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
`;

const Stack = styled.div`
  display: grid;
  gap: 72px;
`;

const Case = styled.article<{ $flip?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $flip }) => ($flip ? "1.05fr 0.95fr" : "0.95fr 1.05fr")};
  gap: 48px;
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const CaseCopy = styled.div`
  order: 1;

  h3 {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 750;
    letter-spacing: -0.035em;
    margin: 14px 0 14px;
  }

  p {
    color: var(--muted);
    line-height: 1.7;
  }

  ${Case}[data-flip="true"] & {
    order: 2;
  }

  @media (max-width: 860px) {
    order: 2 !important;
  }
`;

const CaseShot = styled.div<{ $flip?: boolean }>`
  position: relative;
  min-height: 280px;
  order: ${({ $flip }) => ($flip ? 1 : 2)};

  img {
    object-fit: cover;
  }

  @media (max-width: 860px) {
    order: 1;
    min-height: 220px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  text-align: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Stat = styled.div`
  strong,
  strong span {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.95;
    color: var(--accent-strong);
  }

  span {
    display: block;
    margin-top: 12px;
    font-size: 14px;
    font-weight: 650;
  }
`;

const Impact = styled.section.attrs({ className: "on-dark-scope" })`
  position: relative;
  overflow: hidden;
  background: var(--surface-darkest);
  color: var(--on-brand);
  padding: 104px 0;

  @media (max-width: 800px) {
    padding: 72px 0;
  }
`;

const ImpactHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 32px 72px;
  align-items: end;
  margin-bottom: 44px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 32px;
  }
`;

const ImpactAside = styled.div`
  display: grid;
  gap: 24px;
`;

const ImpactBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ImpactHint = styled.p`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--on-brand-mute);

  &::before {
    content: "";
    width: 28px;
    height: 1px;
    background: var(--accent);
  }
`;

/*
 * Expanding story strip. On wide screens the panels sit side by side and the
 * open one takes most of the row; on phones they stack and the open one grows
 * downwards. Hover, tap, focus, or the arrow keys open a story.
 */
const Strip = styled.div`
  display: flex;
  gap: 6px;
  height: clamp(440px, 58vh, 560px);

  @media (max-width: 800px) {
    flex-direction: column;
    height: auto;
  }
`;

const panelEase = "cubic-bezier(0.22, 1, 0.36, 1)";

const Panel = styled.article<{ $active: boolean }>`
  position: relative;
  overflow: hidden;
  flex: ${({ $active }) => ($active ? "5 1 0%" : "1 1 0%")};
  min-width: 0;
  background: var(--brand);
  border: 1px solid var(--line);
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};
  transition: flex 0.9s ${panelEase}, border-color 0.4s ease;

  &:hover {
    border-color: var(--line-strong);
  }

  @media (max-width: 800px) {
    flex: none;
    display: grid;
    grid-template-rows: auto ${({ $active }) => ($active ? "1fr" : "0fr")};
    transition: grid-template-rows 0.6s ${panelEase}, border-color 0.4s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PanelPhoto = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ $active }) => ($active ? "42%" : "100%")};
  z-index: 0;
  transition: width 0.9s ${panelEase};

  img {
    object-fit: cover;
    object-position: center 18%;
    opacity: ${({ $active }) => ($active ? 0.92 : 0.42)};
    transform: scale(${({ $active }) => ($active ? 1 : 1.08)});
    transition: opacity 0.6s ease, transform 1.2s ${panelEase};
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, transparent 60%, rgb(var(--seed-brand) / 0.85) 100%),
      linear-gradient(to top, rgb(var(--seed-brand-deep) / 0.9) 0%, transparent 55%);
    opacity: ${({ $active }) => ($active ? 0.7 : 1)};
    transition: opacity 0.6s ease;
  }

  @media (max-width: 800px) {
    width: 100%;

    img {
      opacity: ${({ $active }) => ($active ? 0.32 : 0.22)};
      transform: none;
    }

    &::after {
      opacity: 1;
      background: linear-gradient(
        to right,
        rgb(var(--seed-brand-deep) / 0.7) 0%,
        rgb(var(--seed-brand-deep) / 0.96) 70%
      );
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    img {
      transition: none;
    }
  }
`;

/* The whole panel is one tab. Collapsed on desktop it shows a number and a vertical name. */
const PanelTab = styled.button<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 22px;
  border: 0;
  background: none;
  color: inherit;
  text-align: left;
  cursor: inherit;
  opacity: ${({ $active }) => ($active ? 0 : 1)};
  pointer-events: ${({ $active }) => ($active ? "none" : "auto")};
  transition: opacity 0.35s ease;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
  }

  i {
    font-style: normal;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  b {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 750;
    letter-spacing: -0.02em;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  small {
    display: none;
  }

  svg {
    display: none;
  }

  @media (max-width: 800px) {
    position: relative;
    inset: auto;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    width: 100%;
    padding: 18px 20px;
    opacity: 1;
    pointer-events: auto;

    b {
      writing-mode: horizontal-tb;
      transform: none;
      font-size: 18px;
    }

    small {
      display: block;
      margin-left: auto;
      font-size: 12px;
      color: var(--on-brand-mute);
      text-align: right;
    }

    svg {
      display: block;
      flex: none;
      width: 18px;
      height: 18px;
      color: var(--accent);
      transform: rotate(${({ $active }) => ($active ? "90deg" : "0deg")});
      transition: transform 0.4s ${panelEase};
    }
  }
`;

/* Phones only: the full-bleed photo sits behind a dark veil there, so the row header shows a small portrait. */
const PanelAvatar = styled.span`
  display: none;

  @media (max-width: 800px) {
    display: block;
    position: relative;
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid var(--line-strong);

    img {
      object-fit: cover;
      object-position: center 18%;
    }
  }
`;

const PanelBody = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 42%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 36px 40px 34px;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: translateY(${({ $active }) => ($active ? 0 : 14)}px);
  pointer-events: ${({ $active }) => ($active ? "auto" : "none")};
  transition: ${({ $active }) =>
    $active ? "opacity 0.55s ease 0.35s, transform 0.7s ease 0.35s" : "opacity 0.2s ease, transform 0.2s ease"};

  @media (max-width: 800px) {
    position: relative;
    inset: auto;
    min-height: 0;
    overflow: hidden;
    padding: 0;
    transform: none;
    transition: opacity 0.4s ease ${({ $active }) => ($active ? "0.15s" : "0s")};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

const BodyInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  @media (max-width: 800px) {
    padding: 4px 20px 24px;
  }
`;

const BodyHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 22px;

  i {
    font-style: normal;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent);
  }

  b {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 750;
    letter-spacing: -0.02em;
  }

  span {
    font-size: 13px;
    color: var(--on-brand-mute);
  }

  @media (max-width: 800px) {
    display: none;
  }
`;

const StoryQuote = styled.blockquote`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(20px, 1.8vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  text-wrap: pretty;

  &::before {
    content: "\\201C";
    display: block;
    font-size: 64px;
    line-height: 0.4;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 18px;
  }
`;

/* Before -> after strip. This is the "impact" part of each story. */
const Change = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid var(--line);

  @media (max-width: 800px) {
    margin-top: 22px;
    padding-top: 18px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ChangeCell = styled.div<{ $after?: boolean }>`
  display: grid;
  gap: 6px;

  small {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ $after }) => ($after ? "var(--accent)" : "var(--on-brand-mute)")};
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    color: ${({ $after }) => ($after ? "var(--on-brand)" : "var(--on-brand-soft)")};
  }
`;

const ChangeArrow = styled.span`
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  margin-top: 2px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--accent);

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 480px) {
    transform: rotate(90deg);
  }
`;

const PanelProgress = styled.span<{ $running: boolean; $ms: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 2px;
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(0);
  animation: ${({ $running }) => ($running ? "storyFill" : "none")} ${({ $ms }) => $ms}ms linear forwards;

  @keyframes storyFill {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
`;

const StoryControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  button {
    display: inline-grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    background: none;
    color: inherit;
    cursor: pointer;
    transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }

  button:hover,
  button:focus-visible {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--cta-text);
    outline: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  em {
    font-style: normal;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--on-brand-mute);
    min-width: 5.5ch;
    text-align: center;
    white-space: nowrap;
  }
`;

const NewsList = styled.div`
  display: grid;
  gap: 0;
`;

const NewsRow = styled(Link)`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 24px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);

  time {
    font-size: 13px;
    color: var(--on-brand-mute);
  }

  strong {
    font-family: var(--font-display);
    font-size: clamp(18px, 2vw, 24px);
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  span {
    color: var(--accent);
    font-size: 13px;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  &:hover strong {
    color: var(--accent);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const NewsHead = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 48px;
  margin-bottom: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Testimonial = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 48px;
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Portrait = styled.div`
  position: relative;
  width: 220px;
  height: 260px;

  img {
    object-fit: cover;
  }
`;

const QuoteMark = styled.span`
  display: block;
  font-family: var(--font-display);
  font-size: 96px;
  line-height: 0.5;
  color: var(--accent);
  font-weight: 800;
`;

const QuoteText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 750;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin: 16px 0 20px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 56px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const ContactMeta = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  margin-top: 28px;
  color: var(--on-brand-soft);
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Resource = styled(Link)`
  display: grid;
  gap: 14px;

  h3 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 750;
    letter-spacing: -0.03em;
  }

  p {
    color: var(--muted);
    line-height: 1.6;
    font-size: 15px;
  }

  &:hover h3 {
    color: var(--accent-strong);
  }
`;

const Thumb = styled.div`
  position: relative;
  height: 180px;

  img {
    object-fit: cover;
  }
`;

const GoalCols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  margin-bottom: 48px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const GoalList = styled.ul`
  list-style: none;
  display: grid;
  gap: 12px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-weight: 650;
    line-height: 1.45;
  }

  svg {
    color: var(--accent-strong);
    margin-top: 3px;
    flex-shrink: 0;
  }
`;

const tickerItems = [
  `${site.stats[1].value}${site.stats[1].suffix} families served`,
  `${"prefix" in site.stats[2] ? site.stats[2].prefix : ""}${site.stats[2].value}${site.stats[2].suffix} client investments`,
  `${site.stats[0].value}${site.stats[0].suffix} years of experience`,
  `${site.stats[3].value}${site.stats[3].suffix} fund houses`,
  "AMFI-registered mutual fund distributor",
];

const pad = (n: number) => String(n + 1).padStart(2, "0");

function ImpactStories() {
  const reduceMotion = useReduceMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = impactStories.length;
  const running = !paused && !reduceMotion;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setCycle((c) => c + 1);
    },
    [count],
  );

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(index + 1), storyDwellMs);
    return () => window.clearTimeout(t);
  }, [running, index, cycle, go]);

  const hold = () => setPaused(true);
  const release = () => {
    setPaused(false);
    setCycle((c) => c + 1);
  };

  /* Arrow keys move between stories; focus follows so screen readers stay in sync. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    const target = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : step ? index + step : null;
    if (target === null) return;
    event.preventDefault();
    const next = ((target % count) + count) % count;
    go(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <ImpactHead>
        <div>
          <Eyebrow>Client impact</Eyebrow>
          <Display>
            What changes after the <em>first</em> review.
          </Display>
        </div>
        <ImpactAside>
          <Lead style={{ color: "var(--on-brand-mute)" }}>
            Fewer scattered folios, one written plan, and a review cadence families actually keep.
            In their words, not ours.
          </Lead>
          <ImpactBar>
            <ImpactHint>Open a story to see what changed</ImpactHint>
            <StoryControls>
              <button type="button" aria-label="Previous story" onClick={() => go(index - 1)}>
                <FiArrowLeft />
              </button>
              <em>
                {pad(index)} / {pad(count - 1)}
              </em>
              <button type="button" aria-label="Next story" onClick={() => go(index + 1)}>
                <FiArrowRight />
              </button>
            </StoryControls>
          </ImpactBar>
        </ImpactAside>
      </ImpactHead>

      <Strip role="tablist" aria-label="Client stories" onMouseLeave={release} onKeyDown={onKeyDown}>
        {impactStories.map((story, i) => {
          const active = i === index;
          const tabId = `impact-tab-${i}`;
          const panelId = `impact-panel-${i}`;
          return (
            <Panel
              key={story.name}
              $active={active}
              onMouseEnter={() => {
                hold();
                if (!active) go(i);
              }}
            >
              <PanelPhoto $active={active} aria-hidden>
                <Image src={story.image} alt="" fill sizes="(max-width: 800px) 100vw, 800px" />
              </PanelPhoto>

              <PanelTab
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                $active={active}
                onClick={() => go(i)}
                onFocus={() => {
                  hold();
                  if (!active) go(i);
                }}
                onBlur={release}
              >
                <PanelAvatar aria-hidden>
                  <Image src={story.image} alt="" fill sizes="40px" />
                </PanelAvatar>
                <i>{pad(i)}</i>
                <b>{story.name}</b>
                <small>{story.role}</small>
                <FiArrowRight aria-hidden />
              </PanelTab>

              <PanelBody role="tabpanel" id={panelId} aria-labelledby={tabId} aria-hidden={!active} $active={active}>
                <BodyInner>
                  <BodyHead>
                    <i>{pad(i)}</i>
                    <b>{story.name}</b>
                    <span>{story.role}</span>
                  </BodyHead>
                  <StoryQuote>{story.quote}</StoryQuote>
                  <Change>
                    <ChangeCell>
                      <small>Before</small>
                      <p>{story.before}</p>
                    </ChangeCell>
                    <ChangeArrow aria-hidden>
                      <FiArrowRight />
                    </ChangeArrow>
                    <ChangeCell $after>
                      <small>After</small>
                      <p>{story.after}</p>
                    </ChangeCell>
                  </Change>
                </BodyInner>
              </PanelBody>

              {active && <PanelProgress key={cycle} $running={running} $ms={storyDwellMs} aria-hidden />}
            </Panel>
          );
        })}
      </Strip>
    </>
  );
}

export function HomeView() {
  const news = blogPosts.slice(0, 4);

  return (
    <>
      <Hero>
        <Stage>
          <StagePhoto>
            <Image
              src={photos.hero}
              alt="Indian family planning their financial future together"
              fill
              priority
              sizes="100vw"
            />
          </StagePhoto>
          <HeroCopy>
            <Container>
              <Proof {...rise(0)} aria-label={tickerItems.join(". ")}>
                <Faces>
                  {photos.faces.map((src) => (
                    <Face key={src}>
                      <Image src={src} alt="" fill sizes="40px" />
                    </Face>
                  ))}
                </Faces>
                <Ticker aria-hidden>
                  <TickerTrack>
                    {[...tickerItems, ...tickerItems].map((item, index) => (
                      <TickerItem key={`${item}-${index}`}>{item}</TickerItem>
                    ))}
                  </TickerTrack>
                </Ticker>
              </Proof>
              <Title {...rise(0.08)}>
                {hero.title} <em>{hero.highlight}</em>
              </Title>
              <HeroBottom>
                <HeroActions {...rise(0.2)}>
                  <ButtonLink href="/contact">
                    Book a free consultation <FiArrowRight />
                  </ButtonLink>
                </HeroActions>
                <HeroQuote {...rise(0.24)}>
                  <p>{heroQuote.quote}</p>
                  <footer>
                    <cite>{heroQuote.name}</cite>
                    <span>{heroQuote.role}</span>
                  </footer>
                </HeroQuote>
              </HeroBottom>
            </Container>
          </HeroCopy>
        </Stage>
      </Hero>

      <Intro>
        <Container>
          <Reveal duration={revealDuration} amount={revealAmount}>
            <IntroTitle>The right partner for your wealth.</IntroTitle>
            <IntroLead>
              Families come to us with the same money questions - how much to invest, which
              schemes to keep, and whether the plan will still work when life changes.
            </IntroLead>
          </Reveal>
        </Container>
        <Cloud
          aria-hidden
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: revealAmount }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          {concernRows.map((row, rowIndex) => (
            <CloudRow
              key={rowIndex}
              $reverse={rowIndex % 2 === 1}
              $duration={cloudDrift[rowIndex % cloudDrift.length]}
            >
              {[...row, ...row, ...row].map((text, index) => (
                <CloudCell key={`${text}-${index}`} variants={pillPop}>
                  <Pill>{text}</Pill>
                </CloudCell>
              ))}
            </CloudRow>
          ))}
        </Cloud>
        <Container>
          <Stagger stagger={staggerGap} amount={gridAmount}>
            <PillarGrid>
              {processSteps.map((step, index) => {
                const Mark = processMarks[index];
                return (
                  <Item key={step.n} duration={itemDuration}>
                    <Pillar>
                      <Mark style={{
                        width: "40px"
                      }} />
                      < h3 style={{ fontSize: "18px" }}> {step.title}</h3>
                      <p style={{ fontSize: "14px" }}>{step.body}</p>
                    </Pillar>
                  </Item>
                );
              })}
            </PillarGrid>
          </Stagger>
        </Container>
      </Intro >

      <Section $tone="ink">
        <Container>
          <WorkHead>
            <Display>
              What we do for every <em>rupee</em> you invest.
            </Display>
            <ButtonLink href="/services">See our services</ButtonLink>
          </WorkHead>
        </Container>
        <FeatureShot>
          <Image src={photos.featured} alt="" fill sizes="100vw" />
        </FeatureShot>
        <Container>
          <WorkCols>
            {featured.map((service) => (
              <WorkCol key={service.slug} href={`/services/${service.slug}`}>
                <IconBadge name={service.slug} tone="dark" />
                <h3>{service.shortTitle}</h3>
                <p>{service.summary}</p>
              </WorkCol>
            ))}
          </WorkCols>
          <LimeBar />
          <LogoRow>
            <LogoTrack>
              {[...partners, ...partners].map((name, index) => (
                <span key={`${name}-${index}`}>{name}</span>
              ))}
            </LogoTrack>
          </LogoRow>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal duration={revealDuration} amount={revealAmount}>
            <Eyebrow>How we help</Eyebrow>
            <Display>Service that stays after the SIP starts.</Display>
          </Reveal>
          <Stack style={{ marginTop: 56 }}>
            {pillars.map((item, index) => (
              <Reveal key={item.service.slug} duration={revealDuration} amount={revealAmount}>
                <Case $flip={index % 2 === 1} data-flip={index % 2 === 1}>
                  <CaseCopy>
                    <IconBadge name={item.service.slug} />
                    <h3>{item.service.title}</h3>
                    <p>{item.service.summary}</p>
                    <ButtonLink href={`/services/${item.service.slug}`} $variant="ghost" style={{ marginTop: 22 }}>
                      Learn more <FiArrowRight />
                    </ButtonLink>
                  </CaseCopy>
                  <CaseShot $flip={index % 2 === 1}>
                    <Image src={item.image} alt="" fill sizes="(max-width: 860px) 100vw, 46vw" />
                  </CaseShot>
                </Case>
              </Reveal>
            ))}
          </Stack>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <GoalCols>
            <GoalList>
              {goals.slice(0, 2).map((goal) => (
                <li key={goal}>
                  <FiCheck /> {goal}
                </li>
              ))}
            </GoalList>
            <GoalList>
              {goals.slice(2, 4).map((goal) => (
                <li key={goal}>
                  <FiCheck /> {goal}
                </li>
              ))}
            </GoalList>
            <GoalList>
              {goals.slice(4).map((goal) => (
                <li key={goal}>
                  <FiCheck /> {goal}
                </li>
              ))}
            </GoalList>
          </GoalCols>
          <Display>
            Name the goal. Then size the <em>SIP</em>.
          </Display>
        </Container>
      </Section>

      <Section>
        <Container>
          <Stats>
            {site.stats.map((item) => (
              <Stat key={item.label}>
                <strong>
                  <CountUp
                    value={item.value}
                    prefix={"prefix" in item ? item.prefix : ""}
                    suffix={item.suffix}
                    duration={2.2}
                  />
                </strong>
                <span>{item.label}</span>
              </Stat>
            ))}
          </Stats>
        </Container>
      </Section>

      <Impact id="impact">
        <Container>
          <Reveal duration={revealDuration} amount={revealAmount}>
            <ImpactStories />
          </Reveal>
        </Container>
      </Impact>

      <Section $tone="ink">
        <Container>
          <NewsHead>
            <Display>
              News &amp; <em>insights</em>
            </Display>
            <Lead style={{ color: "var(--on-brand-mute)" }}>
              Notes on SIPs, allocation, and the paperwork that keeps a folio usable -
              written for families who want a plan they can keep.
            </Lead>
          </NewsHead>
          <NewsList>
            {news.map((item) => (
              <NewsRow key={item.slug} href="/blog">
                <time dateTime={item.date}>
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <strong>{item.title}</strong>
                <span>Read more</span>
              </NewsRow>
            ))}
          </NewsList>
        </Container>
      </Section>

      <Section>
        <Container>
          <Testimonial>
            <Portrait>
              <Image src={photos.portrait} alt="" fill sizes="220px" />
            </Portrait>
            <div>
              <QuoteMark aria-hidden>“</QuoteMark>
              <QuoteText>{testimonials[1].quote}</QuoteText>
              <b>{testimonials[1].name}</b>
              <Lead style={{ marginTop: 4 }}>{testimonials[1].role}</Lead>
            </div>
          </Testimonial>
        </Container>
      </Section>

      <Section $tone="ink" id="consult">
        <Container>
          <ContactGrid>
            <div>
              <Eyebrow>Get in touch</Eyebrow>
              <Display>
                Let’s talk about your <em>plans</em>.
              </Display>
              <Lead style={{ marginTop: 18, color: "var(--on-brand-mute)" }}>
                Fill in your details and a planner will get back to you within one business day.
              </Lead>
              <ContactMeta>
                <li>{site.phone}</li>
                <li>{site.email}</li>
                <li>{site.hours}</li>
                <li>{site.address.city}</li>
              </ContactMeta>
            </div>
            <LeadForm compact />
          </ContactGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal duration={revealDuration} amount={revealAmount}>
            <Eyebrow>Resources</Eyebrow>
            <Display>Tools and notes to start with.</Display>
          </Reveal>
          <ResourceGrid style={{ marginTop: 40 }}>
            {resources.map((item) => (
              <Resource key={item.href} href={item.href}>
                <Thumb>
                  <Image src={item.image} alt="" fill sizes="33vw" />
                </Thumb>
                <h3>{item.title}</h3>
                <p>{item.note}</p>
              </Resource>
            ))}
          </ResourceGrid>
        </Container>
      </Section>
    </>
  );
}
