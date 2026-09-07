"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled, { css } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiChevronDown,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  blogPosts,
  hero,
  homeServiceSlugs,
  philosophy,
  processSteps,
  services,
  testimonials,
} from "@/lib/content";
import { site } from "@/lib/site";
import { photos } from "@/lib/media";
import { calculatorMeta } from "@/lib/calculators";
import { formatDate } from "@/lib/format";
import { LeadForm } from "@/components/LeadForm";
import { CountUp, Item, Reveal, Stagger, ease, useReduceMotion } from "@/components/motion";
import {
  IconBadge,
  calculatorIcons,
  philosophyIcons,
  processIcons,
} from "@/components/icons";
import {
  ButtonLink,
  Container,
  Display,
  Eyebrow,
  Lead,
  Section,
  Stars,
} from "@/components/ui";

/* ------------------------------------------------------------------ data --- */

const homeServices = homeServiceSlugs.map((slug) => services.find((item) => item.slug === slug)!);

/* How long the service explorer rests on one service before moving on. */
const exploreDwellMs = 6000;

const pad = (n: number) => String(n).padStart(2, "0");

const tagRows = [
  services.filter((item) => item.category === "mutual-funds").map((item) => item.title),
  services
    .filter((item) => item.category !== "mutual-funds")
    .filter((_, index) => index % 3 === 0)
    .map((item) => item.title),
] as const;

const stat = (index: number) => {
  const item = site.stats[index];
  return `${"prefix" in item ? item.prefix : ""}${item.value.toLocaleString("en-IN")}${item.suffix}`;
};

const firmArn = site.registrations.find((item) => item.label.startsWith("AMFI"));

const comparison = [
  {
    alone: "Schemes picked from an app's top-performer list",
    with: "Suitability profiled before any scheme is discussed",
  },
  {
    alone: "One platform's shelf, whatever it happens to stock",
    with: "Scheme selection across 40+ fund houses on merit",
  },
  {
    alone: "KYC, mandates, and switches done form by form, alone",
    with: "KYC, mandates, and transactions handled for you",
  },
  {
    alone: "A NAV you check whenever the news gets loud",
    with: "Quarterly review with XIRR, allocation, and laggards flagged",
  },
  {
    alone: "SIPs that were never mapped to a purpose",
    with: "Every SIP tied to a goal, a date, and an amount",
  },
  {
    alone: "Nobody to call when the market falls",
    with: "A planner to call when the market falls",
  },
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/* ------------------------------------------------------------------ hero --- */

const Hero = styled.section.attrs({ className: "home-hero" })`
  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -20%;
    right: -12%;
    width: min(720px, 60vw);
    height: min(720px, 60vw);
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgb(var(--seed-sage)) 0%,
      rgb(var(--seed-sage) / 0.6) 45%,
      transparent 70%
    );
    pointer-events: none;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 64px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 44px;
  }
`;

const Kicker = styled(motion.p)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: 999px;
  background: var(--surface-sage);
  color: var(--brand-deep);
  font-size: 13px;
  font-weight: 650;

  i {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--brand-deep);
    color: var(--on-brand);
    flex-shrink: 0;
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(42px, 5.6vw, 72px);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 750;
  margin-top: 24px;
  max-width: 14ch;

  em {
    font-style: normal;
    color: var(--brand-deep);
  }
`;

const HeroLead = styled(motion.p)`
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 46ch;
  margin-top: 22px;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 30px;
`;

const Trust = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--line);

  p {
    display: grid;
    gap: 3px;
    font-size: 13px;
    color: var(--muted);
  }

  strong {
    color: var(--ink);
    font-weight: 700;
  }
`;

const Faces = styled.span`
  display: flex;
  flex-shrink: 0;
`;

const Face = styled.span`
  position: relative;
  width: 36px;
  height: 36px;
  margin-left: -10px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--surface);
  background: var(--surface-sage);

  &:first-child {
    margin-left: 0;
  }

  img {
    object-fit: cover;
    object-position: center 20%;
  }
`;

const Stage = styled(motion.div)`
  position: relative;
  padding: 0 24px 28px 0;

  @media (max-width: 960px) {
    max-width: 520px;
  }
`;

const MainShot = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 28px;
  overflow: hidden;
  background: var(--surface-sage);

  img {
    object-fit: cover;
    object-position: 34% 50%;
  }
`;

const FloatCard = styled(motion.div)`
  position: absolute;
  left: -28px;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px 16px 16px;
  border-radius: 18px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);

  i {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--brand-deep);
    color: var(--on-brand);
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: 22px;
    font-weight: 750;
    letter-spacing: -0.03em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  small {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    color: var(--muted);
  }

  @media (max-width: 960px) {
    left: 0;
  }
`;

const FloatTag = styled(motion.div)`
  position: absolute;
  top: 22px;
  right: 0;
  padding: 9px 14px;
  border-radius: 999px;
  background: var(--brand-deep);
  color: var(--on-brand);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: var(--shadow);
  display: inline-flex;
  align-items: center;
  gap: 8px;

  b {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent-soft);
  }
`;

/* ------------------------------------------------------------ what we do --- */

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${Eyebrow} {
    align-self: center;
  }

  ${Display} {
    max-width: 20ch;
  }

  ${Lead} {
    margin-top: 16px;
    max-width: 52ch;
  }
`;

/*
 * Service explorer. An accordion of the four core services on the left; the
 * open one shows its highlights, and a green panel on the right describes who
 * it is for. It advances on its own every few seconds and pauses on hover or
 * focus, so it reads as a guided tour rather than a static list.
 */
const Explorer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 24px;
  margin-top: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Rows = styled.div`
  display: grid;
  gap: 10px;
`;

const Row = styled.div<{ $open: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: ${({ $open }) => ($open ? "var(--surface-raised)" : "transparent")};
  border: 1px solid ${({ $open }) => ($open ? "var(--line-strong)" : "var(--line)")};
  transition: background 0.25s ease, border-color 0.25s ease;

  &:hover {
    border-color: var(--line-strong);
  }
`;

const RowButton = styled.button<{ $open: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 18px 20px;
  border: 0;
  background: none;
  color: inherit;
  text-align: left;
  cursor: pointer;

  i {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    background: ${({ $open }) => ($open ? "var(--brand-deep)" : "transparent")};
    border-color: ${({ $open }) => ($open ? "var(--brand-deep)" : "var(--line-strong)")};
    color: ${({ $open }) => ($open ? "var(--on-brand)" : "var(--ink)")};
    font-style: normal;
    font-size: 12px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
    transition: 0.25s ease;
  }

  strong {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.025em;
  }

  svg {
    color: var(--muted);
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -4px;
    border-radius: 20px;
  }
`;

const RowBody = styled(motion.div)`
  overflow: hidden;
`;

const RowInner = styled.div`
  display: grid;
  gap: 14px;
  padding: 0 20px 22px 74px;

  p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
    max-width: 52ch;
  }

  ul {
    list-style: none;
    display: grid;
    gap: 8px;
  }

  li {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 13.5px;
    font-weight: 600;
    line-height: 1.45;
  }

  li svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: var(--accent-strong);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: var(--brand-deep);
  }

  @media (max-width: 640px) {
    padding-left: 20px;
  }
`;

const RowProgress = styled.span<{ $running: boolean; $ms: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--brand-deep);
  transform-origin: left;
  transform: scaleX(0);
  animation: ${({ $running }) => ($running ? "explorerFill" : "none")} ${({ $ms }) => $ms}ms linear forwards;

  @keyframes explorerFill {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
`;

const ExplorerPanel = styled.div.attrs({ className: "on-dark-scope" })`
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  padding: 32px;
  border-radius: 24px;
  background: var(--brand-deep);
  color: var(--on-brand);

  @media (max-width: 900px) {
    position: static;
    min-height: 0;
  }
`;

const PanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--on-brand-mute);

  b {
    color: var(--accent-soft);
    font-variant-numeric: tabular-nums;
  }
`;

const PanelBody = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 26px;

  h3 {
    font-size: clamp(24px, 2.4vw, 32px);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.12;
    max-width: 16ch;
  }

  > p {
    margin-top: 12px;
    font-size: 15px;
    line-height: 1.65;
    color: var(--on-brand-soft);
    max-width: 44ch;
  }

  small {
    display: block;
    margin-top: 26px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--on-brand-mute);
  }

  ul {
    list-style: none;
    display: grid;
    gap: 10px;
    margin-top: 12px;
  }

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1.5;
  }

  li i {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin-top: 1px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--on-brand-veil-strong);
    color: var(--accent-soft);
  }
`;

const PanelFoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: auto;
  padding-top: 28px;
`;

function ServiceExplorer() {
  const reduce = useReduceMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const count = homeServices.length;
  const running = !paused && !reduce;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
      setCycle((c) => c + 1);
    }, exploreDwellMs);
    return () => window.clearTimeout(timer);
  }, [running, active, cycle, count]);

  const select = (index: number) => {
    setActive(index);
    setCycle((c) => c + 1);
  };

  const current = homeServices[active];

  return (
    <Explorer onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Rows>
        {homeServices.map((service, index) => {
          const open = index === active;
          const bodyId = `service-body-${service.slug}`;
          return (
            <Row key={service.slug} $open={open}>
              <RowButton
                type="button"
                $open={open}
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => select(index)}
                onFocus={() => {
                  setPaused(true);
                  if (!open) select(index);
                }}
                onBlur={() => setPaused(false)}
              >
                <i>{pad(index + 1)}</i>
                <strong>{service.title}</strong>
                <FiChevronDown size={18} aria-hidden />
              </RowButton>
              <AnimatePresence initial={false}>
                {open ? (
                  <RowBody
                    key="body"
                    id={bodyId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease }}
                  >
                    <RowInner>
                      <p>{service.summary}</p>
                      <ul>
                        {service.highlights.slice(0, 3).map((item) => (
                          <li key={item}>
                            <FiCheck size={14} aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/services/${service.slug}`}>
                        Learn more <FiArrowRight size={14} aria-hidden />
                      </Link>
                    </RowInner>
                  </RowBody>
                ) : null}
              </AnimatePresence>
              {open ? (
                <RowProgress key={cycle} $running={running} $ms={exploreDwellMs} aria-hidden />
              ) : null}
            </Row>
          );
        })}
      </Rows>

      <ExplorerPanel aria-live="polite">
        <PanelTop>
          <span>{current.eyebrow}</span>
          <b>
            {pad(active + 1)} / {pad(count)}
          </b>
        </PanelTop>
        <AnimatePresence mode="wait" initial={false}>
          <PanelBody
            key={current.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease }}
          >
            <h3>{current.title}</h3>
            <p>{current.summary}</p>
            <small>Who it is for</small>
            <ul>
              {current.whoFor.map((item) => (
                <li key={item}>
                  <i>
                    <FiCheck size={12} aria-hidden />
                  </i>
                  {item}
                </li>
              ))}
            </ul>
            <PanelFoot>
              <ButtonLink href="/contact">
                Talk to us about {current.shortTitle} <FiArrowUpRight />
              </ButtonLink>
              <ButtonLink href="/services" $variant="ghost">
                All services
              </ButtonLink>
            </PanelFoot>
          </PanelBody>
        </AnimatePresence>
      </ExplorerPanel>
    </Explorer>
  );
}

const Marquee = styled.div`
  overflow: hidden;
  margin-top: 40px;
  display: grid;
  gap: 10px;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
`;

const Track = styled.div<{ $reverse?: boolean; $duration: number }>`
  display: flex;
  gap: 10px;
  width: max-content;
  animation: home-marquee ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? "reverse" : "normal")};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
`;

const Tag = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;

  svg {
    color: var(--accent-strong);
  }
`;

/* -------------------------------------------------------------- cta band --- */

const Band = styled.div.attrs({ className: "on-dark-scope" })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 40px 44px;
  border-radius: 28px;
  background: var(--brand-deep);
  color: var(--on-brand);

  h2 {
    font-size: clamp(26px, 2.8vw, 36px);
    font-weight: 700;
    letter-spacing: -0.03em;
    max-width: 22ch;
  }

  @media (max-width: 640px) {
    padding: 28px 24px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

/* ---------------------------------------------------------------- why us --- */

const WhyHead = styled.div`
  position: relative;
`;

const ThreeUp = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 44px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const WhyCard = styled.article`
  padding: 28px 26px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  height: 100%;

  h3 {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 18px 0 10px;
  }

  p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
  }
`;

/* --------------------------------------------------------------- process --- */

/*
 * Scroll-stacking cards. The copy on the left is sticky; each step on the
 * right is sticky too, with a slightly lower top offset than the one before,
 * so as you scroll each card slides up and settles on top of the previous
 * one - four times - and then the whole stack scrolls away with the section.
 */
const ProcessSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ProcessCopy = styled.div`
  position: sticky;
  top: 120px;

  ${Display} {
    color: var(--on-brand);
  }

  ${Lead} {
    color: var(--on-brand-mute);
  }

  @media (max-width: 900px) {
    position: static;
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: grid;
  gap: 28px;
  padding-bottom: 40px;
`;

const StepSlot = styled.li<{ $index: number }>`
  position: sticky;
  top: ${({ $index }) => 112 + $index * 18}px;
`;

const StepCard = styled(motion.article)`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  padding: 30px 32px 32px;
  border-radius: 24px;
  background: var(--surface-raised);
  color: var(--ink);
  box-shadow: 0 -12px 40px rgb(0 0 0 / 0.18);
  /* A light card inside the green section: put the light-surface tokens back. */
  --accent: rgb(var(--seed-accent));
  --accent-strong: rgb(var(--seed-accent-strong));
  --accent-text: rgb(var(--seed-accent-strong));
  --line: rgb(var(--seed-ink) / 0.1);
  --line-strong: rgb(var(--seed-ink) / 0.2);

  h3 {
    font-size: 26px;
    font-weight: 750;
    letter-spacing: -0.03em;
    margin: 22px 0 10px;
  }

  p {
    color: var(--muted);
    font-size: 15px;
    line-height: 1.7;
    max-width: 48ch;
  }

  @media (max-width: 640px) {
    min-height: 0;
    padding: 24px 22px 26px;
  }
`;

const StepHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  i {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--brand-deep);
    color: var(--on-brand);
    font-style: normal;
    font-size: 15px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  small {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
`;

const StepFoot = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 22px;
  font-size: 13px;
  font-weight: 650;
  color: var(--brand-deep);
`;

/* ------------------------------------------------------------ comparison --- */

/* Two columns face to face: the do-it-yourself picture, and ours, with a "vs" mark between. */
const Versus = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 44px;
  align-items: stretch;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const VsMark = styled.span`
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;

  @media (max-width: 860px) {
    display: none;
  }
`;

const Side = styled.div.attrs<{ $primary?: boolean }>(({ $primary }) => ({
  className: $primary ? "on-dark-scope" : undefined,
}))<{ $primary?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 32px;
  border-radius: 24px;
  background: ${({ $primary }) => ($primary ? "var(--brand-deep)" : "var(--surface-raised)")};
  color: ${({ $primary }) => ($primary ? "var(--on-brand)" : "var(--ink)")};
  border: 1px solid ${({ $primary }) => ($primary ? "var(--brand-deep)" : "var(--line)")};

  @media (max-width: 640px) {
    padding: 24px 20px;
  }
`;

const SideHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);

  h3 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  span {
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
  }
`;

const SideList = styled.ul<{ $primary?: boolean }>`
  list-style: none;
  display: grid;
  gap: 14px;

  li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    font-size: 15px;
    line-height: 1.5;
    color: ${({ $primary }) => ($primary ? "var(--on-brand)" : "var(--muted)")};
  }

  i {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-top: 1px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ $primary }) => ($primary ? "var(--accent-soft)" : "var(--surface-sage)")};
    color: ${({ $primary }) => ($primary ? "var(--brand-deep)" : "var(--muted)")};
  }
`;

const SideFoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: auto;
  padding-top: 28px;

  p {
    font-size: 13px;
    color: var(--on-brand-mute);
  }
`;

/* ---------------------------------------------------------- testimonials --- *//* ---------------------------------------------------------- testimonials --- */

/*
 * A continuously drifting strip of quotes. Two rows move in opposite
 * directions and pause on hover so a quote can be read to the end.
 */
const QuoteStrip = styled.div`
  margin-top: 40px;
  display: grid;
  gap: 16px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
`;

const QuoteTrack = styled.div<{ $reverse?: boolean; $duration: number }>`
  display: flex;
  gap: 16px;
  width: max-content;
  animation: home-marquee ${({ $duration }) => $duration}s linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? "reverse" : "normal")};

  ${QuoteStrip}:hover & {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
`;

const quoteCss = css`
  flex: 0 0 min(380px, 82vw);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 26px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s ease;

  blockquote {
    flex: 1;
    font-size: 15px;
    line-height: 1.7;
    color: var(--ink);
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--brand-soft);
  }
`;

const Quote = styled.figure`
  ${quoteCss}
`;

const Who = styled.figcaption`
  display: flex;
  align-items: center;
  gap: 12px;

  b {
    display: block;
    font-size: 14px;
    font-weight: 700;
  }

  small {
    display: block;
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }
`;

const Avatar = styled.span`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--brand-deep);
  color: var(--on-brand);
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.04em;
  flex-shrink: 0;
`;

const StatBand = styled.div.attrs({ className: "on-dark-scope" })`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 40px;
  padding: 36px 24px;
  border-radius: 24px;
  background: var(--brand-deep);
  color: var(--on-brand);
  text-align: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Stat = styled.div`
  strong {
    display: block;
    font-size: clamp(34px, 4vw, 52px);
    font-weight: 750;
    line-height: 1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }

  > span {
    display: block;
    margin-top: 10px;
    font-size: 13px;
    color: var(--on-brand-mute);
  }
`;

const CenterActions = styled(Actions)`
  justify-content: center;
  margin-top: 32px;
`;

/* -------------------------------------------------------------- insights --- */

const Posts = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 44px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Post = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 14px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  color: inherit;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  h3 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.25;
    margin: 18px 12px 8px;
  }

  p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
    margin: 0 12px;
  }

  &:hover {
    transform: translateY(-3px);
  }
`;

const PostShot = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-sage);

  img {
    object-fit: cover;
  }
`;

const PostMeta = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 18px 12px 8px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);

  b {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--brand-deep);
    font-weight: 700;
  }
`;

/* ----------------------------------------------------------- calculators --- */

const CalcSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const CalcShot = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 24px;
  overflow: hidden;
  background: var(--surface-sage);

  img {
    object-fit: cover;
  }
`;

const CalcList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 26px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const CalcLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface-raised);
  font-size: 14px;
  font-weight: 600;
  transition: 0.18s ease;

  svg:first-child {
    color: var(--accent-strong);
    flex-shrink: 0;
  }

  svg:last-child {
    margin-left: auto;
    opacity: 0.4;
  }

  &:hover {
    border-color: var(--brand-deep);
    background: var(--tint-accent-weak);
  }
`;

/* --------------------------------------------------------------- contact --- */

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const ContactMeta = styled.ul`
  list-style: none;
  display: grid;
  gap: 10px;
  margin-top: 26px;
  font-size: 15px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  svg {
    margin-top: 4px;
    color: var(--accent-strong);
    flex-shrink: 0;
  }
`;

const FormCard = styled.div`
  padding: 28px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid rgb(var(--seed-ink) / 0.1);
  color: var(--ink);
  /* A light card inside a dark section: put the light-surface tokens back. */
  --line: rgb(var(--seed-ink) / 0.1);
  --line-strong: rgb(var(--seed-ink) / 0.2);
  --accent: rgb(var(--seed-accent));
  --tint-accent-weak: rgb(var(--seed-accent) / 0.08);
  --cta-bg: var(--brand-deep);
  --cta-bg-hover: var(--brand);
  --cta-text: var(--on-brand);

  h3 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }

  > p {
    color: var(--muted);
    font-size: 14px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    padding: 22px 18px;
  }
`;

/* ------------------------------------------------------------------ view --- */

export function HomeView() {
  const quotes = [...testimonials, ...testimonials];

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <Hero>
        <Container>
          <HeroGrid>
            <div>
              <Kicker {...rise(0)}>
                <i>
                  <FiShield size={13} aria-hidden />
                </i>
                {hero.kicker}
              </Kicker>
              <Title {...rise(0.08)}>
                {hero.title} <em>{hero.highlight}</em>
              </Title>
              <HeroLead {...rise(0.16)}>{hero.body}</HeroLead>
              <HeroActions {...rise(0.24)}>
                <ButtonLink href="/contact">
                  Book a consultation <FiArrowUpRight />
                </ButtonLink>
                <ButtonLink href="/services" $variant="navy">
                  Our services <FiArrowRight />
                </ButtonLink>
              </HeroActions>
              <Trust {...rise(0.32)}>
                <Faces aria-hidden>
                  {photos.faces.map((src) => (
                    <Face key={src}>
                      <Image src={src} alt="" fill sizes="36px" />
                    </Face>
                  ))}
                </Faces>
                <p>
                  <Stars />
                  <span>
                    Trusted by <strong>{stat(1)} families</strong> since {site.foundedYear}
                  </span>
                </p>
              </Trust>
            </div>
            <Stage
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <MainShot>
                <Image
                  src={photos.hero}
                  alt="A young plant growing out of a pile of coins"
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 44vw"
                />
              </MainShot>
              <FloatTag {...rise(0.5)}>
                <b aria-hidden />
                AMFI-registered{firmArn ? ` · ${firmArn.value}` : ""}
              </FloatTag>
              <FloatCard {...rise(0.6)}>
                <i>
                  <FiTrendingUp size={20} aria-hidden />
                </i>
                <span>
                  <strong>{stat(2)}</strong>
                  <small>{site.stats[2].label} · {site.stats[2].note}</small>
                </span>
              </FloatCard>
            </Stage>
          </HeroGrid>
        </Container>
      </Hero>

      {/* ------------------------------------------------------ what we do */}
      <Section $tone="sage">
        <Container>
          <Reveal>
            <Centered>
              <Eyebrow>What we do</Eyebrow>
              <Display>
                What we do for every <em>rupee</em> you invest.
              </Display>
              <Lead>
                Selecting what fits, executing cleanly, monitoring the portfolio, and staying
                available for service - the work of an AMFI-registered distributor.
              </Lead>
            </Centered>
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceExplorer />
          </Reveal>
        </Container>
        <Marquee aria-hidden>
          {tagRows.map((row, index) => (
            <Track key={index} $reverse={index === 1} $duration={index === 1 ? 52 : 46}>
              {[...row, ...row].map((label, i) => (
                <Tag key={`${label}-${i}`}>
                  <FiCheck size={13} />
                  {label}
                </Tag>
              ))}
            </Track>
          ))}
        </Marquee>
      </Section>

      {/* -------------------------------------------------------- cta band */}
      <Section style={{ paddingBottom: 0 }}>
        <Container>
          <Reveal>
            <Band>
              <h2>Reach out for a first conversation about your goals.</h2>
              <Actions>
                <ButtonLink href="/contact">
                  Contact us <FiArrowUpRight />
                </ButtonLink>
                <ButtonLink href="/services" $variant="ghost">
                  Our services <FiArrowRight />
                </ButtonLink>
              </Actions>
            </Band>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- why us */}
      <Section>
        <Container>
          <WhyHead>
            <Reveal>
              <Centered>
                <Eyebrow>Why us</Eyebrow>
                <Display>Why families stay with us.</Display>
                <Lead>
                  No in-house product to push, a written plan for every goal, and reviews that
                  actually happen.
                </Lead>
              </Centered>
            </Reveal>
          </WhyHead>
          <Stagger>
            <ThreeUp>
              {philosophy.map((item, index) => (
                <Item key={item.title}>
                  <WhyCard>
                    <IconBadge icon={philosophyIcons[index]} />
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </WhyCard>
                </Item>
              ))}
            </ThreeUp>
          </Stagger>
        </Container>
      </Section>

      {/* --------------------------------------------------------- process */}      {/* --------------------------------------------------------- process */}
      <Section $tone="navy">
        <Container>
          <ProcessSplit>
            <ProcessCopy>
              <Reveal>
                <Eyebrow>How we work</Eyebrow>
                <Display>A proven process for your goals.</Display>
                <Lead style={{ marginTop: 16 }}>
                  Four steps, in the order they happen. Keep scrolling - each one settles on
                  top of the last, from the first conversation to the regular review.
                </Lead>
                <Actions style={{ marginTop: 26 }}>
                  <ButtonLink href="/contact">
                    Get started <FiArrowUpRight />
                  </ButtonLink>
                  <ButtonLink href="/about" $variant="ghost">
                    About us
                  </ButtonLink>
                </Actions>
              </Reveal>
            </ProcessCopy>
            <Steps>
              {processSteps.map((step, index) => {
                const Icon = processIcons[index];
                return (
                  <StepSlot key={step.n} $index={index}>
                    <StepCard
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px 0px" }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <StepHead>
                        <i>{Number(step.n)}</i>
                        <small>
                          Step {Number(step.n)} of {processSteps.length}
                        </small>
                        <IconBadge icon={Icon} />
                      </StepHead>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                      <StepFoot>
                        <FiCheck size={15} aria-hidden />
                        {index === processSteps.length - 1
                          ? "Repeats every year, and after every big life change."
                          : `Next: ${processSteps[index + 1].title}`}
                      </StepFoot>
                    </StepCard>
                  </StepSlot>
                );
              })}
            </Steps>
          </ProcessSplit>
        </Container>
      </Section>

      {/* ------------------------------------------------------ comparison */}
      <Section>
        <Container>
          <Reveal>
            <Centered>
              <Eyebrow>Why a distributor</Eyebrow>
              <Display>Why an MFD when I can figure it out myself?</Display>
              <Lead>
                Apps and articles get you started. Suitability, execution, and a review cadence
                are what keep a plan alive.
              </Lead>
            </Centered>
          </Reveal>
          <Reveal delay={0.08}>
            <Versus>
              <Side>
                <SideHead>
                  <h3>Doing it alone</h3>
                  <span>The usual way</span>
                </SideHead>
                <SideList>
                  {comparison.map((row) => (
                    <li key={row.alone}>
                      <i>
                        <FiX size={13} aria-hidden />
                      </i>
                      {row.alone}
                    </li>
                  ))}
                </SideList>
              </Side>
              <VsMark aria-hidden>VS</VsMark>
              <Side $primary>
                <SideHead>
                  <h3>With {site.shortName}</h3>
                  <span>Recommended</span>
                </SideHead>
                <SideList $primary>
                  {comparison.map((row) => (
                    <li key={row.with}>
                      <i>
                        <FiCheck size={13} aria-hidden />
                      </i>
                      {row.with}
                    </li>
                  ))}
                </SideList>
                <SideFoot>
                  <ButtonLink href="/contact">
                    Book a consultation <FiArrowUpRight />
                  </ButtonLink>
                  <p>Free, no obligation.</p>
                </SideFoot>
              </Side>
            </Versus>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------- testimonials */}      {/* ---------------------------------------------------- testimonials */}
      <Section $tone="sage">
        <Container>
          <Reveal>
            <Centered>
              <Eyebrow>Client stories</Eyebrow>
              <Display>What our clients say.</Display>
              <Lead>
                We have helped families consolidate scattered folios, map each investment to a
                goal, and stay invested through the noise.
              </Lead>
            </Centered>
          </Reveal>
        </Container>
        <Reveal delay={0.08}>
          <QuoteStrip>
            {[false, true].map((reverse) => (
              <QuoteTrack key={String(reverse)} $reverse={reverse} $duration={reverse ? 64 : 56}>
                {(reverse ? [...quotes.slice(2), ...quotes.slice(0, 2)] : quotes).map(
                  (item, index) => (
                    <Quote key={`${item.name}-${index}`}>
                      <Stars />
                      <blockquote>“{item.quote}”</blockquote>
                      <Who>
                        <Avatar aria-hidden>{initials(item.name)}</Avatar>
                        <span>
                          <b>{item.name}</b>
                          <small>{item.role}</small>
                        </span>
                      </Who>
                    </Quote>
                  ),
                )}
              </QuoteTrack>
            ))}
          </QuoteStrip>
        </Reveal>
        <Container>
          <Reveal delay={0.12}>
            <StatBand>
              {site.stats.map((item) => (
                <Stat key={item.label}>
                  <strong>
                    <CountUp
                      value={item.value}
                      prefix={"prefix" in item ? item.prefix : ""}
                      suffix={item.suffix}
                    />
                  </strong>
                  <span>{item.label}</span>
                </Stat>
              ))}
            </StatBand>
            <CenterActions>
              <ButtonLink href="/contact">
                Get started <FiArrowUpRight />
              </ButtonLink>
              <ButtonLink href="/services" $variant="navy">
                Our services <FiArrowRight />
              </ButtonLink>
            </CenterActions>
          </Reveal>
        </Container>
      </Section>

      {/* -------------------------------------------------------- insights */}
      <Section>
        <Container>
          <Reveal>
            <Centered>
              <Eyebrow>Insights</Eyebrow>
              <Display>Notes that drive better decisions.</Display>
              <Lead>
                Short reads on SIPs, allocation, and the paperwork that keeps a folio usable -
                written for families who want a plan they can keep.
              </Lead>
            </Centered>
          </Reveal>
          <Stagger>
            <Posts>
              {blogPosts.slice(0, 2).map((post, index) => (
                <Item key={post.slug}>
                  <Post href={`/blog/${post.slug}`}>
                    <PostShot>
                      <Image
                        src={post.image ?? (index === 0 ? photos.insightA : photos.insightB)}
                        alt=""
                        fill
                        sizes="(max-width: 800px) 100vw, 50vw"
                      />
                    </PostShot>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <PostMeta>
                      <span>
                        {post.category} · {formatDate(post.date)}
                      </span>
                      <b>
                        Read the note <FiArrowUpRight />
                      </b>
                    </PostMeta>
                  </Post>
                </Item>
              ))}
            </Posts>
          </Stagger>
          <Reveal delay={0.1}>
            <CenterActions>
              <ButtonLink href="/blog">
                All articles <FiArrowUpRight />
              </ButtonLink>
              <ButtonLink href="/news" $variant="navy">
                Market news <FiArrowRight />
              </ButtonLink>
            </CenterActions>
          </Reveal>
        </Container>
      </Section>

      {/* ----------------------------------------------------- calculators */}
      <Section $tone="sage">
        <Container>
          <CalcSplit>
            <Reveal>
              <CalcShot>
                <Image src={photos.calculators} alt="" fill sizes="(max-width: 900px) 100vw, 46vw" />
              </CalcShot>
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>Calculators</Eyebrow>
              <Display>Plan the numbers before you invest.</Display>
              <Lead style={{ marginTop: 16 }}>
                Seven planning tools on one page. Change an assumption and every figure, chart,
                and table moves with it.
              </Lead>
              <CalcList>
                {calculatorMeta.map((item) => {
                  const Icon = calculatorIcons[item.slug];
                  return (
                    <li key={item.slug}>
                      <CalcLink href={`/calculators#${item.slug}`}>
                        {Icon ? <Icon size={16} aria-hidden /> : null}
                        {item.title}
                        <FiArrowRight size={14} aria-hidden />
                      </CalcLink>
                    </li>
                  );
                })}
              </CalcList>
            </Reveal>
          </CalcSplit>
        </Container>
      </Section>

      {/* --------------------------------------------------------- contact */}
      <Section $tone="navy" id="consult">
        <Container>
          <ContactGrid>
            <Reveal>
              <Eyebrow>Get in touch</Eyebrow>
              <Display>Bring your goals. Leave with a plan.</Display>
              <Lead style={{ marginTop: 16, color: "var(--on-brand-mute)" }}>
                Share your details and a planner will call you back within one business day.
                Bring existing SIPs, insurance policies, and the goals that matter.
              </Lead>
              <ContactMeta>
                <li>
                  <FiCheck size={16} aria-hidden />
                  <span>{site.phone}</span>
                </li>
                <li>
                  <FiCheck size={16} aria-hidden />
                  <span>{site.email}</span>
                </li>
                <li>
                  <FiCheck size={16} aria-hidden />
                  <span>{site.hours}</span>
                </li>
              </ContactMeta>
            </Reveal>
            <Reveal delay={0.1}>
              <FormCard>
                <h3>Request a callback</h3>
                <p>No obligation. We reply within one business day.</p>
                <LeadForm compact />
              </FormCard>
            </Reveal>
          </ContactGrid>
        </Container>
      </Section>
    </>
  );
}
