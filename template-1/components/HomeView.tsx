"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiCheckCircle, FiShield } from "react-icons/fi";
import {
  blogPosts,
  goals,
  hero,
  homeServiceSlugs,
  newsItems,
  partners,
  philosophy,
  processSteps,
  services,
  testimonials,
} from "@/lib/content";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { LeadForm } from "@/components/LeadForm";
import { SipWidget } from "@/components/calculators/SipWidget";
import { CountUp, Item, Reveal, Stagger, ease, fadeScale } from "@/components/motion";
import { IconBadge, serviceIcons } from "@/components/icons";
import {
  ButtonLink,
  CardLink,
  Container,
  Display,
  Eyebrow,
  Lead,
  Section,
} from "@/components/ui";

const featuredService = services.find((item) => item.slug === homeServiceSlugs[0])!;
const sideServices = homeServiceSlugs.slice(1).map((slug) => services.find((item) => item.slug === slug)!);
const homeCredentials = site.registrations.filter(
  (item) => item.label.startsWith("AMFI") || item.label.startsWith("FPSB"),
);

/* ------------------------------------------------------------------ hero --- */

const Hero = styled.section.attrs({ className: "home-hero" })``;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.78fr);
  gap: 72px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Kicker = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  border-radius: 999px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  box-shadow: 0 1px 0 var(--edge-highlight) inset;
`;

const KickerMark = styled.span`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--surface-dark);
  color: var(--accent);
  flex-shrink: 0;
`;

const KickerText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  padding-right: 4px;

  strong {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  small {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 1px;
  }
`;

const Title = styled(motion.h1)`
  font-family: var(--font-sans);
  font-size: clamp(40px, 5.6vw, 68px);
  line-height: 1.04;
  letter-spacing: -0.045em;
  font-weight: 700;
  margin-top: 18px;
  max-width: 16ch;

  em {
    font-style: normal;
    color: var(--accent-strong);
  }
`;

const HeroLead = styled(motion.p)`
  font-size: 18px;
  line-height: 1.7;
  color: var(--muted);
  max-width: 46ch;
  margin-top: 20px;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 28px;
`;

const QuietLink = styled(Link)`
  font-size: 14px;
  font-weight: 650;
  color: var(--brand);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;

  &:hover {
    color: var(--accent-strong);
  }
`;

const CredentialLine = styled(motion.p)`
  margin-top: 36px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  font-size: 13px;
  color: var(--muted);
  max-width: 48ch;
  line-height: 1.6;

  strong {
    color: var(--ink);
    font-weight: 650;
  }
`;

const FormWrap = styled(motion.div)`
  position: relative;
`;

const FormCard = styled.div`
  position: relative;
  background: var(--surface-raised);
  color: var(--ink);
  border-radius: 22px;
  padding: 26px 24px 22px;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);

  @media (max-width: 640px) {
    padding: 22px 18px;
  }
`;

const FormHead = styled.div`
  margin-bottom: 18px;

  h2 {
    font-family: var(--font-sans);
    font-size: 22px;
    letter-spacing: -0.02em;
    font-weight: 700;
  }

  p {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.55;
    margin-top: 6px;
  }
`;

const FormFoot = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 12px;
  color: var(--muted);

  svg {
    color: var(--positive);
    flex-shrink: 0;
  }
`;

/* ----------------------------------------------------------------- stats --- */

const StatsSection = styled.section`
  padding: 4px 0 72px;
  background: var(--surface);

  @media (max-width: 800px) {
    padding: 0 0 52px;
  }
`;

const StatsFrame = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr;
  border-top: 1px solid var(--line-strong);
  border-bottom: 1px solid var(--line-strong);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Established = styled.div`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  padding: 28px 18px;
  border-right: 1px solid var(--line);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--accent-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  @media (max-width: 720px) {
    writing-mode: horizontal-tb;
    transform: none;
    border-right: 0;
    border-bottom: 1px solid var(--line);
    padding: 12px 8px;
    letter-spacing: 0.18em;
  }
`;

const StatsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled(motion.div)`
  position: relative;
  min-width: 0;
  padding: 32px 28px 30px;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 28px;
    bottom: 28px;
    right: 0;
    width: 1px;
    background: var(--line);
  }

  em {
    display: block;
    font-style: normal;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-strong);
    margin-bottom: 14px;
  }

  strong {
    display: block;
    font-family: var(--font-sans);
    font-size: clamp(40px, 5vw, 62px);
    font-weight: 700;
    letter-spacing: -0.05em;
    line-height: 0.92;
    font-variant-numeric: tabular-nums;
    color: var(--ink);
  }

  span {
    display: block;
    margin-top: 16px;
    font-size: 15px;
    font-weight: 650;
    letter-spacing: -0.01em;
  }

  small {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.4;
  }

  strong::after {
    content: "";
    display: block;
    width: 36px;
    height: 3px;
    margin-top: 16px;
    border-radius: 2px;
    background: var(--accent);
  }

  @media (max-width: 900px) {
    &:nth-child(2n)::after {
      display: none;
    }

    &:nth-child(-n + 2) {
      border-bottom: 1px solid var(--line);
    }

    &:nth-child(-n + 2)::after {
      bottom: 0;
    }
  }

  @media (max-width: 560px) {
    &:not(:last-child) {
      border-bottom: 1px solid var(--line);
    }

    &:not(:last-child)::after {
      display: none;
    }
  }
`;

/* -------------------------------------------------------------- sections --- */

const Split = styled.div`
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const AboutHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 22px;
`;

const AboutCopy = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 48px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const PrincipleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 40px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const PrincipleCard = styled.article`
  padding: 28px 24px 26px;
  border-radius: 18px;
  background: var(--surface-raised);
  border: 1px solid var(--line);
  height: 100%;

  b {
    display: block;
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent-strong);
    margin-bottom: 18px;
  }

  h3 {
    font-family: var(--font-sans);
    font-size: 22px;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.25;
    margin-bottom: 10px;
  }

  p {
    color: var(--muted);
    line-height: 1.65;
    font-size: 15px;
  }
`;

const ChipRow = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  margin-top: 28px;
`;

const Chip = styled.li`
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
  background: var(--surface-raised);

  small {
    display: block;
    font-weight: 500;
    color: var(--muted);
    margin-top: 1px;
  }
`;

const SectionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
`;

const Bento = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: repeat(3, auto);
  gap: 14px;
  margin-top: 36px;

  > :first-child {
    grid-row: 1 / span 3;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: none;

    > :first-child {
      grid-row: auto;
    }
  }
`;

const FeaturedCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 36px 32px;
  min-height: 320px;
  border-radius: 22px;
  background: var(--surface-dark);
  color: var(--on-brand);
  border: 1px solid transparent;
  height: 100%;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);

  h3 {
    font-family: var(--font-sans);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 650;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  p {
    color: var(--on-brand-soft);
    line-height: 1.65;
    max-width: 36ch;
  }

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 800px) {
    min-height: 0;
  }
`;

const SideCard = styled(Link)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 22px 20px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  min-width: 0;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s ease;

  h3 {
    font-family: var(--font-sans);
    font-size: 20px;
    font-weight: 650;
    letter-spacing: -0.02em;
  }

  svg:last-child {
    color: var(--brand);
    opacity: 0.45;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: var(--accent);
  }
`;

const CardCta = styled.span`
  margin-top: auto;
  color: var(--accent-soft);
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const GoalList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  list-style: none;
  margin-top: 24px;

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-weight: 650;
    font-size: 15px;
    line-height: 1.4;
  }

  svg {
    color: var(--accent-text);
    margin-top: 3px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const QuoteStage = styled.div`
  margin-top: 28px;
`;

const QuoteCard = styled.div`
  height: 100%;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  padding: 32px 30px 28px;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
`;

const QuoteMark = styled.span`
  display: block;
  font-family: var(--font-sans);
  font-size: 56px;
  line-height: 0.6;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: -0.08em;
  margin-bottom: 16px;
`;

const Quote = styled.blockquote`
  font-family: var(--font-sans);
  font-size: clamp(18px, 1.8vw, 24px);
  line-height: 1.4;
  font-weight: 550;
  letter-spacing: -0.025em;
  flex: 1;
`;

const QuoteMeta = styled.div`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--line);

  p:first-child {
    font-weight: 700;
  }

  p:last-child {
    color: var(--muted);
    font-size: 14px;
    margin-top: 2px;
  }
`;

const QuoteNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
`;

const QuoteArrows = styled.div`
  display: flex;
  gap: 8px;
`;

const QuoteArrow = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
  cursor: pointer;

  &:hover {
    border-color: var(--accent);
    color: var(--accent-strong);
  }
`;

const Embla = styled.div`
  overflow: hidden;
`;

const Track = styled.div`
  display: flex;
`;

const Slide = styled.div`
  flex: 0 0 50%;
  min-width: 0;
  padding-right: 16px;

  @media (max-width: 800px) {
    flex: 0 0 100%;
    padding-right: 0;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 32px;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "28px" : "8px")};
  height: 8px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "var(--accent)" : "var(--line-strong)")};
  transition: width 0.25s ease, background 0.25s ease;
`;

const Timeline = styled.ol`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 44px;
  position: relative;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  padding: 24px 22px 26px;
  border-radius: 18px;
  background: rgb(var(--seed-on-brand) / 0.08);
  border: 1px solid rgb(var(--seed-on-brand) / 0.16);

  h3 {
    font-family: var(--font-sans);
    font-size: 24px;
    font-weight: 650;
    margin: 16px 0 10px;
    color: var(--on-brand);
  }

  p {
    color: rgb(var(--seed-on-brand) / 0.9);
    line-height: 1.65;
    font-size: 15px;
  }
`;

const StepIndex = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--brand-deep);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
`;

const CtaBand = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
`;

const PhotoBand = styled(Section)`
  position: relative;
  isolation: isolate;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -2;
    background-image: url("/images/family-goals.jpg");
    background-size: cover;
    background-position: 62% 42%;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      100deg,
      rgb(var(--seed-panel-deep) / 0.95) 0%,
      rgb(var(--seed-panel-deep) / 0.86) 42%,
      rgb(var(--seed-panel-deep) / 0.6) 100%
    );
  }
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 48px;
  margin-top: 36px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const PostList = styled.div`
  display: grid;
  gap: 0;
`;

const NewsList = styled.div`
  display: grid;
`;

const NewsLink = styled(Link)`
  display: grid;
  gap: 4px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);

  small {
    color: var(--muted);
    font-size: 12px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-weight: 650;
  }

  h3 {
    font-size: 17px;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.35;
  }

  &:first-child {
    padding-top: 0;
  }

  &:hover h3 {
    color: var(--accent-strong);
  }
`;

const MarqueeWrap = styled.div`
  overflow: hidden;
  margin-top: 32px;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 6%, #000 94%, transparent);
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  animation: home-marquee 42s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    flex-wrap: wrap;
    width: auto;
  }
`;

const AMC = styled.span`
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 650;
  color: var(--brand);
  background: var(--surface-raised);
`;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

export function HomeView() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = window.setInterval(() => emblaApi.scrollNext(), 7000);
    return () => {
      window.clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const firmArn = site.registrations.find((item) => item.detail === "Firm registration");

  return (
    <>
      <Hero>
        <Container>
          <HeroGrid>
            <div>
              <Kicker {...rise(0)}>
                <KickerMark>
                  <FiShield size={15} aria-hidden />
                </KickerMark>
                <KickerText>
                  <strong>AMFI-registered</strong>
                  <small>Mutual Fund Distributor</small>
                </KickerText>
              </Kicker>
              <Title {...rise(0.08)}>
                {hero.title} <em>{hero.highlight}</em>
              </Title>
              <HeroLead {...rise(0.16)}>{hero.body}</HeroLead>
              <HeroActions {...rise(0.24)}>
                <ButtonLink href="/contact">
                  Book a free consultation <FiArrowRight />
                </ButtonLink>
                <QuietLink href="/services">
                  Explore services <FiArrowRight />
                </QuietLink>
              </HeroActions>
              <CredentialLine {...rise(0.32)}>
                <strong>AMFI registered</strong>
                {firmArn
                  ? ` · ${firmArn.value}${"validTill" in firmArn && firmArn.validTill ? `, valid till ${firmArn.validTill}` : ""}`
                  : ""}
                {` · Open architecture across ${site.stats[3].value}+ fund houses.`}
              </CredentialLine>
            </div>
            <FormWrap
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.18 }}
            >
              <FormCard>
                <FormHead>
                  <h2>Request a callback</h2>
                  <p>Share your details. We will call you to schedule a conversation.</p>
                </FormHead>
                <LeadForm compact />
                <FormFoot>
                  <FiCheckCircle size={14} aria-hidden />
                  No obligation. We reply within one business day.
                </FormFoot>
              </FormCard>
            </FormWrap>
          </HeroGrid>
        </Container>
      </Hero>

      <StatsSection>
        <Container>
          <StatsFrame>
            <Established>Established {site.foundedYear}</Established>
            <StatsRow
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-72px 0px" }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {site.stats.map((item, index) => (
                <Stat key={item.label} variants={fadeScale}>
                  <em>{String(index + 1).padStart(2, "0")}</em>
                  <strong>
                    <CountUp
                      value={item.value}
                      prefix={"prefix" in item ? item.prefix : ""}
                      suffix={item.suffix}
                    />
                  </strong>
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </Stat>
              ))}
            </StatsRow>
          </StatsFrame>
        </Container>
      </StatsSection>

      <Section>
        <Container>
          <AboutHead>
            <Reveal>
              <Eyebrow>Who we are</Eyebrow>
              <Display style={{ maxWidth: "22ch" }}>
                A distributor you can stay with for the long run.
              </Display>
            </Reveal>
            <Reveal delay={0.08}>
              <ButtonLink href="/about" $variant="navy">
                About us <FiArrowRight />
              </ButtonLink>
            </Reveal>
          </AboutHead>
          <Reveal delay={0.06}>
            <AboutCopy>
              <Lead>
                {site.name} is an AMFI-registered mutual fund distributor. We help
                individuals, families, and NRIs start SIPs, protect what they have
                built, and plan for retirement — with a written plan and regular
                reviews.
              </Lead>
              <Lead>
                Schemes are chosen across fund houses on merit. There is no in-house
                product to push, and commissions are disclosed on this website.
              </Lead>
            </AboutCopy>
          </Reveal>
          <Stagger delay={0.1} stagger={0.1}>
            <PrincipleGrid>
              {philosophy.map((item, index) => (
                <Item key={item.title}>
                  <PrincipleCard>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </PrincipleCard>
                </Item>
              ))}
            </PrincipleGrid>
          </Stagger>
          <Reveal delay={0.16}>
            <ChipRow>
              {homeCredentials.map((item) => (
                <Chip key={item.value}>
                  {item.value}
                  <small>{item.label}</small>
                </Chip>
              ))}
            </ChipRow>
          </Reveal>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <SectionTop>
            <Reveal>
              <Eyebrow>What we do</Eyebrow>
              <Display>From onboarding to ongoing portfolio service.</Display>
            </Reveal>
            <Reveal delay={0.1}>
              <ButtonLink href="/services" $variant="navy">
                All services <FiArrowRight />
              </ButtonLink>
            </Reveal>
          </SectionTop>
          <Stagger>
            <Bento>
              <Item>
                <FeaturedCard href={`/services/${featuredService.slug}`}>
                  <IconBadge icon={serviceIcons[featuredService.slug]} tone="dark" />
                  <Eyebrow style={{ color: "var(--accent-soft)", marginBottom: 0 }}>
                    {featuredService.eyebrow}
                  </Eyebrow>
                  <h3>{featuredService.shortTitle}</h3>
                  <p>{featuredService.summary}</p>
                  <CardCta>
                    Learn more <FiArrowRight />
                  </CardCta>
                </FeaturedCard>
              </Item>
              {sideServices.map((service) => (
                <Item key={service.slug}>
                  <SideCard href={`/services/${service.slug}`}>
                    <IconBadge icon={serviceIcons[service.slug]} />
                    <div>
                      <Eyebrow style={{ marginBottom: 4 }}>{service.eyebrow}</Eyebrow>
                      <h3>{service.shortTitle}</h3>
                    </div>
                    <FiArrowRight size={18} aria-hidden />
                  </SideCard>
                </Item>
              ))}
            </Bento>
          </Stagger>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <SectionTop>
            <Reveal>
              <Eyebrow>Client stories</Eyebrow>
              <Display>In their words.</Display>
            </Reveal>
            <Reveal delay={0.08}>
              <QuoteArrows>
                <QuoteArrow
                  type="button"
                  aria-label="Previous story"
                  onClick={() => emblaApi?.scrollPrev()}
                >
                  <FiArrowLeft size={18} />
                </QuoteArrow>
                <QuoteArrow
                  type="button"
                  aria-label="Next story"
                  onClick={() => emblaApi?.scrollNext()}
                >
                  <FiArrowRight size={18} />
                </QuoteArrow>
              </QuoteArrows>
            </Reveal>
          </SectionTop>
          <Reveal delay={0.1}>
            <QuoteStage>
              <Embla ref={emblaRef}>
                <Track>
                  {testimonials.map((item) => (
                    <Slide key={item.name}>
                      <QuoteCard>
                        <QuoteMark aria-hidden>“</QuoteMark>
                        <Quote>{item.quote}</Quote>
                        <QuoteMeta>
                          <p>{item.name}</p>
                          <p>{item.role}</p>
                        </QuoteMeta>
                      </QuoteCard>
                    </Slide>
                  ))}
                </Track>
              </Embla>
              <QuoteNav>
                <Dots>
                  {testimonials.map((item, index) => (
                    <Dot
                      key={item.name}
                      type="button"
                      $active={selected === index}
                      aria-label={`Show testimonial ${index + 1}`}
                      onClick={() => emblaApi?.scrollTo(index)}
                    />
                  ))}
                </Dots>
              </QuoteNav>
            </QuoteStage>
          </Reveal>
        </Container>
      </Section>

      <Section $tone="navy">
        <Container>
          <Reveal>
            <Eyebrow style={{ color: "var(--accent)" }}>How we work</Eyebrow>
            <Display style={{ color: "var(--on-brand)", maxWidth: "16ch" }}>
              Four steps. No surprises.
            </Display>
            <Lead style={{ color: "rgb(var(--seed-on-brand) / 0.88)", marginTop: 14 }}>
              From the first conversation to regular reviews, you always know what
              happens next.
            </Lead>
          </Reveal>
          <Stagger stagger={0.12}>
            <Timeline>
              {processSteps.map((step) => (
                <Item key={step.n}>
                  <Step>
                    <StepIndex>{step.n}</StepIndex>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </Step>
                </Item>
              ))}
            </Timeline>
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Eyebrow>Fund houses</Eyebrow>
            <Display>Open architecture. No house bias.</Display>
            <Lead style={{ marginTop: 14 }}>
              We select schemes across the industry on consistency, cost, and fit
              with your plan — never because a single AMC sits on our shelf.
            </Lead>
          </Reveal>
          <MarqueeWrap>
            <MarqueeTrack>
              {[...partners, ...partners].map((name, index) => (
                <AMC key={`${name}-${index}`}>{name}</AMC>
              ))}
            </MarqueeTrack>
          </MarqueeWrap>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Split>
            <Reveal>
              <Eyebrow>Goal-based investing</Eyebrow>
              <Display>Name the goal. Then size the SIP.</Display>
              <Lead style={{ marginTop: 16 }}>
                Every goal has a time horizon and a target amount. We map SIPs to
                those goals so each rupee has a job — education, a home, retirement,
                or a buffer you can actually use.
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

      <Section>
        <Container>
          <SectionTop>
            <Reveal>
              <Eyebrow>Insights</Eyebrow>
              <Display>Notes from the desk.</Display>
            </Reveal>
            <Reveal delay={0.08}>
              <ButtonLink href="/blog" $variant="navy">
                All articles <FiArrowRight />
              </ButtonLink>
            </Reveal>
          </SectionTop>
          <ArticleGrid>
            <Stagger>
              <PostList>
                {blogPosts.slice(0, 3).map((post) => (
                  <Item key={post.slug}>
                    <CardLink href={`/blog/${post.slug}`} style={{ marginBottom: 14 }}>
                      <Eyebrow>
                        {post.category} · {formatDate(post.date)}
                      </Eyebrow>
                      <h3 style={{ fontFamily: "var(--font-sans)", fontSize: 24, letterSpacing: "-0.02em" }}>
                        {post.title}
                      </h3>
                      <p style={{ color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>{post.excerpt}</p>
                    </CardLink>
                  </Item>
                ))}
              </PostList>
            </Stagger>
            <Reveal delay={0.16} x={20} y={0}>
              <Eyebrow>Latest news</Eyebrow>
              <NewsList>
                {newsItems.slice(0, 5).map((item) => (
                  <NewsLink key={item.slug} href={`/news/${item.slug}`}>
                    <small>{formatDate(item.date)}</small>
                    <h3>{item.title}</h3>
                  </NewsLink>
                ))}
              </NewsList>
              <ButtonLink href="/news" $variant="navy" style={{ marginTop: 20 }}>
                More news
              </ButtonLink>
            </Reveal>
          </ArticleGrid>
        </Container>
      </Section>

      <PhotoBand $tone="ink">
        <Container>
          <Reveal>
            <CtaBand>
              <div>
                <Eyebrow>Get started</Eyebrow>
                <Display>Bring your goals. Leave with a plan.</Display>
                <Lead style={{ color: "var(--on-brand-mute)", marginTop: 12 }}>
                  Book a free consultation. Bring existing SIPs, insurance policies,
                  and the goals that matter — we will map the next step together.
                </Lead>
              </div>
              <ButtonLink href="/contact">
                Book a consultation <FiArrowRight />
              </ButtonLink>
            </CtaBand>
          </Reveal>
        </Container>
      </PhotoBand>
    </>
  );
}
