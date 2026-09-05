"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiPhone, FiStar } from "react-icons/fi";
import {
  faqs,
  goals,
  hero,
  homeServiceSlugs,
  partners,
  philosophy,
  processSteps,
  services,
  testimonials,
} from "@/lib/content";
import { site } from "@/lib/site";
import { photos } from "@/lib/media";
import { LeadForm } from "@/components/LeadForm";
import { SipWidget } from "@/components/calculators/SipWidget";
import { CountUp, Item, Reveal, Stagger, ease } from "@/components/motion";
import { IconBadge, serviceIcons } from "@/components/icons";
import { ButtonLink, Container, Display, Eyebrow, Lead, Section } from "@/components/ui";

const featured = homeServiceSlugs.map((slug) => services.find((item) => item.slug === slug)!);
const homeFaqs = [...faqs.planning, faqs["mutual-funds"][0], faqs["mutual-funds"][1]];
const stories = [
  {
    person: testimonials[0],
    kicker: "Portfolio cleanup",
    metrics: [
      { value: "Quarterly", label: "Reviews" },
      { value: "Goal-mapped", label: "SIPs" },
    ],
    image: photos.caseA,
  },
  {
    person: testimonials[1],
    kicker: "Protection first",
    metrics: [
      { value: "Term first", label: "Cover" },
      { value: "Then invest", label: "Sequence" },
    ],
    image: photos.caseB,
  },
  {
    person: testimonials[2],
    kicker: "NRI onboarding",
    metrics: [
      { value: "NRE / NRO", label: "Accounts" },
      { value: "Remote KYC", label: "Process" },
    ],
    image: photos.caseC,
  },
] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/* ------------------------------------------------------------------ hero --- */

const Hero = styled.section.attrs({ className: "home-hero" })``;

const Stage = styled.div.attrs({ className: "hero-stage" })``;

const StagePhoto = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    object-fit: cover;
    object-position: 72% 40%;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgb(20 22 16 / 0.78) 0%, rgb(20 22 16 / 0.5) 52%, rgb(20 22 16 / 0.22) 100%),
      linear-gradient(180deg, rgb(20 22 16 / 0.18) 0%, rgb(20 22 16 / 0.55) 100%);
  }
`;

const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 132px 0 48px;

  @media (max-width: 960px) {
    padding: 116px 0 32px;
    align-items: flex-end;
  }
`;

const HeroGrid = styled.div`
  max-width: 720px;
`;

const Trust = styled(motion.p)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
`;

const Title = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(44px, 6vw, 76px);
  line-height: 1.02;
  letter-spacing: -0.045em;
  font-weight: 600;
  margin-top: 18px;
  max-width: 12ch;
  color: var(--on-brand);

  em {
    font-style: normal;
    color: var(--accent);
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-underline-offset: 8px;
  }
`;

const HeroLead = styled(motion.p)`
  font-size: 18px;
  line-height: 1.7;
  color: var(--on-brand-soft);
  max-width: 44ch;
  margin-top: 20px;
`;

const HeroPrimary = styled(ButtonLink)`
  background: var(--accent);
  color: var(--brand-deep);

  &:hover {
    background: var(--accent-soft);
    color: var(--brand-deep);
  }
`;

const HeroGhost = styled(ButtonLink)`
  background: transparent;
  color: var(--on-brand);
  border-color: rgb(255 255 255 / 0.35);

  &:hover {
    background: rgb(255 255 255 / 0.1);
    color: var(--on-brand);
    border-color: rgb(255 255 255 / 0.55);
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 32px;
`;

const Overlay = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  margin-top: auto;
  padding: 36px 0 40px;
  background: rgb(16 17 20 / 0.78);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgb(255 255 255 / 0.14);
  color: var(--on-brand);

  @media (max-width: 980px) {
    padding: 24px 0 28px;
  }
`;

const OverlayGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
  gap: 48px;
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const OverlayStat = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;

  small {
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }

  strong,
  strong span {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(52px, 6vw, 80px);
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 0.92;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    color: var(--on-brand);
  }

  p {
    font-size: 15px;
    color: rgb(255 255 255 / 0.72);
  }
`;

const OverlayQuote = styled.blockquote`
  margin: 0;
  padding-left: 28px;
  border-left: 2px solid var(--accent);
  max-width: 54ch;

  p {
    font-size: clamp(16px, 1.6vw, 20px);
    line-height: 1.5;
    color: rgb(255 255 255 / 0.92);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  cite {
    display: block;
    margin-top: 14px;
    font-style: normal;
    font-size: 13px;
    font-weight: 650;
    letter-spacing: 0.02em;
    color: var(--accent);

    span {
      display: block;
      margin-top: 2px;
      font-weight: 500;
      color: rgb(255 255 255 / 0.62);
    }
  }

  @media (max-width: 800px) {
    padding-left: 16px;
  }
`;

/* -------------------------------------------------------------- marquee --- */

const MarqueeSection = styled.section.attrs({ className: "home-marquee" })`
  padding: 56px 0 48px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
`;

const MarqueeRow = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 0.38fr) minmax(0, 1fr);
  gap: 40px;
  align-items: center;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

const MarqueeHead = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 650;
  letter-spacing: -0.03em;
  line-height: 1.25;
  color: var(--ink);
  max-width: 18ch;

  em {
    font-style: normal;
    color: var(--ink);
    text-decoration: underline;
    text-decoration-color: var(--accent);
    text-decoration-thickness: 3px;
    text-underline-offset: 5px;
  }
`;

const MarqueeWrap = styled.div`
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 82%, transparent);
  mask-image: linear-gradient(to right, #000 0%, #000 82%, transparent);
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 12px;
  width: max-content;
  animation: home-marquee 42s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
    justify-content: flex-start;
  }
`;

const AMC = styled.span`
  flex-shrink: 0;
  border: 1px solid rgb(18 20 24 / 0.2);
  border-radius: 999px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.01em;
  color: var(--ink);
  background: var(--surface-raised);
  box-shadow: 0 1px 2px rgb(16 17 20 / 0.06);
`;

/* ---------------------------------------------------------------- stats --- */

const StatsSection = styled(Section).attrs({ className: "home-stats" })`
  padding-top: 72px;
  padding-bottom: 72px;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  container-type: inline-size;
  min-width: 0;
  padding: 36px 28px 32px;

  &:not(:last-child) {
    border-right: 1px solid var(--line);
  }

  small {
    display: block;
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-strong);
    margin-bottom: 16px;
  }

  strong,
  strong span {
    display: inline-block;
    font-family: var(--font-display);
    font-size: clamp(36px, 20cqi, 64px);
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 0.92;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    color: var(--ink);
  }

  em {
    display: block;
    margin-top: 16px;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.45;
    color: var(--muted);
  }

  @media (max-width: 900px) {
    &:nth-child(2) {
      border-right: 0;
    }

    &:nth-child(-n + 2) {
      border-bottom: 1px solid var(--line);
    }
  }

  @media (max-width: 560px) {
    border-right: 0 !important;
    border-bottom: 1px solid var(--line);

    &:last-child {
      border-bottom: 0;
    }
  }
`;

/* ---------------------------------------------------------------- about --- */

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Collage = styled.div`
  position: relative;
  min-height: 520px;

  @media (max-width: 900px) {
    min-height: 420px;
  }
`;

const Frame = styled.div<{ $pos: "a" | "b" | "c" }>`
  position: absolute;
  overflow: hidden;
  background: var(--surface-raised);

  ${({ $pos }) =>
    $pos === "a"
      ? `
        width: 58%;
        height: 70%;
        left: 0;
        top: 8%;
        border-radius: 36px;
      `
      : $pos === "b"
        ? `
          width: 42%;
          height: 46%;
          right: 0;
          top: 0;
          border-radius: 28px;
        `
        : `
          width: 40%;
          height: 38%;
          right: 6%;
          bottom: 0;
          border-radius: 50%;
        `}
`;

const FloatCard = styled.div`
  position: absolute;
  left: 8%;
  bottom: 8%;
  z-index: 2;
  width: min(280px, 70%);
  padding: 22px 20px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);

  p {
    font-weight: 700;
    margin: 8px 0 14px;
    line-height: 1.4;
  }
`;

const Online = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

/* ------------------------------------------------------------- services --- */

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 36px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(Link)`
  display: grid;
  gap: 14px;
  padding: 32px 28px;
  border-radius: 28px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  min-height: 240px;
  transition: transform 0.25s ease, border-color 0.2s ease;

  h3 {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent);
  }
`;

const Index = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
`;

/* --------------------------------------------------------------- cases --- */

const CaseStage = styled.div`
  margin-top: 36px;
`;

const Embla = styled.div`
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
`;

const Slide = styled.div`
  flex: 0 0 100%;
  min-width: 0;
  padding-right: 16px;
`;

const CaseCard = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  overflow: hidden;
  border-radius: 32px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  min-height: 420px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const CaseCopy = styled.div`
  padding: 36px 32px;
  display: flex;
  flex-direction: column;

  h3 {
    font-family: var(--font-display);
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 10px 0 16px;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
  }
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: auto;
  padding-top: 28px;

  strong {
    display: block;
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 600;
  }

  span {
    color: var(--muted);
    font-size: 13px;
  }
`;

const CaseShot = styled.div`
  position: relative;
  min-height: 280px;
`;

const Arrows = styled.div`
  display: flex;
  gap: 8px;
`;

const Arrow = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--ink);
  cursor: pointer;

  &:hover {
    background: var(--accent);
    color: var(--brand-deep);
    border-color: var(--accent);
  }
`;

/* --------------------------------------------------------------- quotes --- */

const QuoteSlide = styled.div`
  flex: 0 0 50%;
  min-width: 0;
  padding-right: 16px;

  @media (max-width: 800px) {
    flex: 0 0 100%;
    padding-right: 0;
  }
`;

const QuoteCard = styled.article`
  padding: 32px 28px;
  border-radius: 28px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  min-height: 280px;
  display: flex;
  flex-direction: column;

  blockquote {
    font-family: var(--font-display);
    font-size: clamp(20px, 2vw, 26px);
    line-height: 1.35;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
`;

const QuoteMeta = styled.div`
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  b {
    display: block;
  }

  small {
    color: var(--muted);
  }
`;

const Avatar = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: var(--brand-deep);
  font-weight: 800;
  font-size: 13px;
`;

/* ----------------------------------------------------------------- why --- */

const WhyGrid = styled.div`
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WhyShot = styled.div`
  position: relative;
  min-height: 520px;
  border-radius: 36px;
  overflow: hidden;

  @media (max-width: 900px) {
    min-height: 360px;
  }
`;

const PhoneCard = styled.a`
  position: absolute;
  left: 22px;
  bottom: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 18px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  font-weight: 700;

  small {
    display: block;
    font-weight: 600;
    color: var(--muted);
    font-size: 12px;
  }
`;

const CheckList = styled.ul`
  list-style: none;
  display: grid;
  gap: 14px;
  margin-top: 28px;

  li {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    font-weight: 650;
    line-height: 1.4;
  }

  svg {
    margin-top: 3px;
    color: var(--accent);
    flex-shrink: 0;
  }
`;

const Split = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 48px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const GoalList = styled.ul`
  display: grid;
  gap: 12px;
  list-style: none;
  margin-top: 24px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-weight: 650;
    line-height: 1.4;
  }

  svg {
    color: var(--accent);
    margin-top: 3px;
    flex-shrink: 0;
  }
`;

/* ------------------------------------------------------------------ faq --- */

const FaqList = styled.div`
  display: grid;
  gap: 0;
  margin-top: 28px;
  border-top: 1px solid var(--line);
`;

const Q = styled.details`
  border-bottom: 1px solid var(--line);
  padding: 20px 0;

  summary {
    cursor: pointer;
    font-weight: 700;
    font-size: 18px;
    list-style: none;
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  p {
    margin-top: 12px;
    color: var(--muted);
    line-height: 1.7;
    max-width: 70ch;
  }
`;

/* -------------------------------------------------------------- contact --- */

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ContactShot = styled.div`
  position: relative;
  min-height: 520px;
  border-radius: 32px;
  overflow: hidden;

  @media (max-width: 900px) {
    min-height: 280px;
  }
`;

const FormCard = styled.div`
  padding: 36px 32px;
  border-radius: 32px;
  background: var(--surface-raised);
  border: 1px solid var(--line);

  h2 {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 600;
    letter-spacing: -0.03em;
    margin: 8px 0 8px;
  }

  @media (max-width: 640px) {
    padding: 24px 18px;
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.li`
  padding: 28px 24px;
  border-radius: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  height: 100%;

  b {
    display: block;
    color: var(--accent);
    font-size: 13px;
    margin-bottom: 16px;
  }

  h3 {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
    font-size: 15px;
  }
`;

const SectionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
`;

export function HomeView() {
  const [caseRef, caseApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [quoteRef, quoteApi] = useEmblaCarousel({ loop: true, align: "start" });
  const firmArn = site.registrations.find((item) => item.detail === "Firm registration");

  useEffect(() => {
    if (!caseApi) return;
    const id = window.setInterval(() => caseApi.scrollNext(), 7000);
    return () => window.clearInterval(id);
  }, [caseApi]);

  return (
    <>
      <Hero>
        <Stage>
          <StagePhoto>
            <Image
              src={photos.hero}
              alt="Advisors in a planning conversation"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "72% 40%" }}
            />
          </StagePhoto>
          <HeroCopy>
            <Container>
              <HeroGrid>
                <Trust {...rise(0)}>
                  <FiStar /> {hero.kicker}
                  {firmArn ? ` · ${firmArn.value}` : ""}
                </Trust>
                <Title {...rise(0.08)}>
                  {hero.title} <em>{hero.highlight}</em>
                </Title>
                <HeroLead {...rise(0.16)}>{hero.body}</HeroLead>
                <HeroActions {...rise(0.24)}>
                  <HeroPrimary href="/contact">
                    Book a free consultation <FiArrowRight />
                  </HeroPrimary>
                  <HeroGhost href="/services" $variant="ghost">
                    See our services
                  </HeroGhost>
                </HeroActions>
              </HeroGrid>
            </Container>
          </HeroCopy>
          <Overlay>
            <Container>
              <OverlayGrid>
                <OverlayStat>
                  <small>Families served</small>
                  <strong>
                    <CountUp value={site.stats[1].value} suffix={site.stats[1].suffix} />
                  </strong>
                  <p>Across India and overseas</p>
                </OverlayStat>
                <OverlayQuote>
                  <p>“{testimonials[0].quote}”</p>
                  <cite>
                    {testimonials[0].name}
                    <span>{testimonials[0].role}</span>
                  </cite>
                </OverlayQuote>
              </OverlayGrid>
            </Container>
          </Overlay>
        </Stage>
      </Hero>

      <MarqueeSection>
        <Container>
          <MarqueeRow>
            <MarqueeHead>
              Trusted by families investing across India’s leading <em>fund houses</em>.
            </MarqueeHead>
            <MarqueeWrap>
              <MarqueeTrack>
                {[...partners, ...partners].map((name, index) => (
                  <AMC key={`${name}-${index}`}>{name}</AMC>
                ))}
              </MarqueeTrack>
            </MarqueeWrap>
          </MarqueeRow>
        </Container>
      </MarqueeSection>

      <StatsSection $tone="paper">
        <Container>
          <StatRow>
            {site.stats.map((item) => (
              <StatCard key={item.label}>
                <small>{item.label}</small>
                <strong>
                  <CountUp
                    value={item.value}
                    prefix={"prefix" in item ? item.prefix : ""}
                    suffix={item.suffix}
                  />
                </strong>
                <em>{item.note}</em>
              </StatCard>
            ))}
          </StatRow>
        </Container>
      </StatsSection>

      <Section>
        <Container>
          <AboutGrid>
            <Reveal>
              <Eyebrow>About the firm</Eyebrow>
              <Display>
                Real plans from people who have sat on <em>your</em> side of the table.
              </Display>
              <Lead style={{ marginTop: 18 }}>
                {site.name} is an AMFI-registered mutual fund distributor. We help
                individuals, families, and NRIs start SIPs, protect what they have
                built, and plan for retirement — with a written plan and regular reviews.
              </Lead>
              <Lead style={{ marginTop: 12 }}>
                Schemes are chosen across fund houses on merit. There is no in-house
                product to push, and commissions are disclosed on this website.
              </Lead>
              <ButtonLink href="/about" $variant="ghost" style={{ marginTop: 28 }}>
                Learn about us <FiArrowRight />
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.1} y={36}>
              <Collage>
                <Frame $pos="a">
                  <Image src={photos.aboutA} alt="" fill sizes="40vw" style={{ objectFit: "cover" }} />
                </Frame>
                <Frame $pos="b">
                  <Image src={photos.aboutB} alt="" fill sizes="30vw" style={{ objectFit: "cover" }} />
                </Frame>
                <Frame $pos="c">
                  <Image src={photos.aboutC} alt="" fill sizes="28vw" style={{ objectFit: "cover" }} />
                </Frame>
                <FloatCard>
                  <Online>
                    <i /> {site.stats[0].value}+ years online
                  </Online>
                  <p>Looking for a quick expert consultation?</p>
                  <ButtonLink href="/contact">Talk with an expert</ButtonLink>
                </FloatCard>
              </Collage>
            </Reveal>
          </AboutGrid>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
            <Display>From onboarding to ongoing portfolio service.</Display>
          </Reveal>
          <Stagger>
            <ServiceGrid>
              {featured.map((service, index) => (
                <Item key={service.slug}>
                  <ServiceCard href={`/services/${service.slug}`}>
                    <Index>{String(index + 1).padStart(2, "0")}</Index>
                    <IconBadge icon={serviceIcons[service.slug]} />
                    <h3>{service.shortTitle}</h3>
                    <p>{service.summary}</p>
                  </ServiceCard>
                </Item>
              ))}
            </ServiceGrid>
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTop>
            <Reveal>
              <Eyebrow>Client outcomes</Eyebrow>
              <Display>Results, not just recommendations.</Display>
            </Reveal>
            <Arrows>
              <Arrow type="button" aria-label="Previous story" onClick={() => caseApi?.scrollPrev()}>
                <FiArrowLeft size={18} />
              </Arrow>
              <Arrow type="button" aria-label="Next story" onClick={() => caseApi?.scrollNext()}>
                <FiArrowRight size={18} />
              </Arrow>
            </Arrows>
          </SectionTop>
          <CaseStage>
            <Embla ref={caseRef}>
              <Track>
                {stories.map((story) => (
                  <Slide key={story.person.name}>
                    <CaseCard>
                      <CaseCopy>
                        <Eyebrow>{story.kicker}</Eyebrow>
                        <h3>{story.person.quote}</h3>
                        <p>
                          {story.person.name} · {story.person.role}
                        </p>
                        <Metrics>
                          {story.metrics.map((metric) => (
                            <div key={metric.label}>
                              <strong>{metric.value}</strong>
                              <span>{metric.label}</span>
                            </div>
                          ))}
                        </Metrics>
                      </CaseCopy>
                      <CaseShot>
                        <Image
                          src={story.image}
                          alt=""
                          fill
                          sizes="(max-width: 860px) 100vw, 46vw"
                          style={{ objectFit: "cover" }}
                        />
                      </CaseShot>
                    </CaseCard>
                  </Slide>
                ))}
              </Track>
            </Embla>
          </CaseStage>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <SectionTop>
            <Reveal>
              <Eyebrow>Client voices</Eyebrow>
              <Display>Success stories from our clients.</Display>
            </Reveal>
            <Arrows>
              <Arrow type="button" aria-label="Previous quote" onClick={() => quoteApi?.scrollPrev()}>
                <FiArrowLeft size={18} />
              </Arrow>
              <Arrow type="button" aria-label="Next quote" onClick={() => quoteApi?.scrollNext()}>
                <FiArrowRight size={18} />
              </Arrow>
            </Arrows>
          </SectionTop>
          <Embla ref={quoteRef} style={{ marginTop: 32 }}>
            <Track>
              {testimonials.map((item) => (
                <QuoteSlide key={item.name}>
                  <QuoteCard>
                    <blockquote>{item.quote}</blockquote>
                    <QuoteMeta>
                      <Avatar>{item.name.slice(0, 1)}</Avatar>
                      <div>
                        <b>{item.name}</b>
                        <small>{item.role}</small>
                      </div>
                    </QuoteMeta>
                  </QuoteCard>
                </QuoteSlide>
              ))}
            </Track>
          </Embla>
        </Container>
      </Section>

      <Section>
        <Container>
          <WhyGrid>
            <Reveal>
              <WhyShot>
                <Image src={photos.why} alt="" fill sizes="46vw" style={{ objectFit: "cover" }} />
                <PhoneCard href={site.phoneHref}>
                  <FiPhone />
                  <span>
                    <small>Quick contact</small>
                    {site.phone}
                  </span>
                </PhoneCard>
              </WhyShot>
            </Reveal>
            <Reveal delay={0.08}>
              <Eyebrow>Why families choose us</Eyebrow>
              <Display>The partner behind a plan you can actually keep.</Display>
              <Lead style={{ marginTop: 16 }}>
                We use open architecture, written plans, and regular reviews so that
                investing stays tied to your goals — not to the product of the month.
              </Lead>
              <CheckList>
                {philosophy.map((item) => (
                  <li key={item.title}>
                    <FiCheck /> {item.title}
                  </li>
                ))}
                <li>
                  <FiCheck /> Dedicated planner, from first SIP to retirement reviews
                </li>
              </CheckList>
            </Reveal>
          </WhyGrid>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Split>
            <Reveal>
              <Eyebrow>Goal-based investing</Eyebrow>
              <Display>Name the goal. Then size the SIP.</Display>
              <Lead style={{ marginTop: 16 }}>
                Every goal has a time horizon and a target amount. We map SIPs to those
                goals so each rupee has a job.
              </Lead>
              <GoalList>
                {goals.map((goal) => (
                  <li key={goal}>
                    <FiCheck /> {goal}
                  </li>
                ))}
              </GoalList>
            </Reveal>
            <Reveal delay={0.12} y={36}>
              <SipWidget />
            </Reveal>
          </Split>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Reveal>
            <Eyebrow>How we work</Eyebrow>
            <Display>Four steps. No surprises.</Display>
          </Reveal>
          <Stagger stagger={0.1}>
            <Steps>
              {processSteps.map((step) => (
                <Item key={step.n}>
                  <Step>
                    <b>{step.n}</b>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </Step>
                </Item>
              ))}
            </Steps>
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Eyebrow>Common questions</Eyebrow>
            <Display>Still deciding? Here’s what clients usually ask.</Display>
          </Reveal>
          <FaqList>
            {homeFaqs.map((item) => (
              <Q key={item.q}>
                <summary>
                  {item.q}
                  <FiArrowRight />
                </summary>
                <p>{item.a}</p>
              </Q>
            ))}
          </FaqList>
        </Container>
      </Section>

      <Section $tone="paper" id="consult">
        <Container>
          <ContactGrid>
            <ContactShot>
              <Image
                src={photos.contact}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 42vw"
                style={{ objectFit: "cover" }}
              />
            </ContactShot>
            <FormCard>
              <Eyebrow>Get in touch</Eyebrow>
              <h2>Let’s talk about your plans</h2>
              <Lead style={{ marginBottom: 22 }}>
                Fill in your details and a planner will get back to you within one business day.
              </Lead>
              <LeadForm />
            </FormCard>
          </ContactGrid>
        </Container>
      </Section>
    </>
  );
}
