"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { FiArrowRight, FiArrowUpRight, FiArrowLeft, FiStar } from "react-icons/fi";
import {
  blogPosts,
  firstQuestions,
  handle,
  hero,
  money,
  outcomes,
  partners,
  promises,
  talk,
  testimonials,
  words,
} from "@/lib/content";
import { site } from "@/lib/site";
import { photos } from "@/lib/media";
import { formatDate, formatINR, formatShortINR } from "@/lib/format";
import { LeadForm } from "@/components/LeadForm";
import { Item, Reveal, Stagger, ease, useReduceMotion } from "@/components/motion";
import { ButtonLink, Container, Display, Eyebrow, Section } from "@/components/ui";

/* ------------------------------------------------------------------ data --- */

const pad = (n: number) => String(n).padStart(2, "0");

/** Words per minute for the journal read-time label. */
const readMinutes = (paragraphs: string[]) =>
  Math.max(2, Math.round(paragraphs.join(" ").split(/\s+/).length / 180));

const journal = blogPosts.slice(0, 3);
const fundHouses = Array.from(new Set(partners));

/** Wraps the highlight words of the hero title in <em>. */
function titleWithHighlights(title: string, highlights: readonly string[]): ReactNode[] {
  return title.split(" ").map((word, index, all) => {
    const trailing = index < all.length - 1 ? " " : "";
    return highlights.includes(word) ? (
      <span key={index}>
        <em>{word}</em>
        {trailing}
      </span>
    ) : (
      <span key={index}>
        {word}
        {trailing}
      </span>
    );
  });
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/* ---------------------------------------------------------------- shared --- */

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 40px;

  ${Eyebrow} {
    margin: 0;
  }

  small {
    font-size: 13px;
    color: var(--muted);
    max-width: 44ch;
    line-height: 1.5;
  }
`;

const Caps = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Faces = styled.span`
  display: flex;
  flex-shrink: 0;
`;

const Face = styled.span`
  position: relative;
  width: 34px;
  height: 34px;
  margin-left: -9px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--surface);
  background: var(--surface-alt);

  &:first-child {
    margin-left: 0;
  }

  img {
    object-fit: cover;
    object-position: center 20%;
  }
`;

const RatingWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);

  b {
    color: var(--ink);
    font-weight: 500;
  }
`;

const Stars = styled.span`
  display: inline-flex;
  gap: 1px;
  color: var(--ink);
  margin-right: 6px;
  vertical-align: -1px;

  svg {
    fill: currentColor;
  }
`;

function Rating() {
  return (
    <RatingWrap>
      <Faces aria-hidden>
        {photos.faces.map((src) => (
          <Face key={src}>
            <Image src={src} alt="" fill sizes="34px" />
          </Face>
        ))}
      </Faces>
      <span>
        <Stars aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={11} />
          ))}
        </Stars>
        <b>{site.rating.score}</b> from {site.rating.count} client reviews
      </span>
    </RatingWrap>
  );
}

/* A round dark stamp with text set on a circle, like a rubber seal. */
const StampLink = styled(Link)`
  position: absolute;
  z-index: 2;
  width: 108px;
  height: 108px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--brand-deep);
  color: var(--on-brand);
  transition: transform 0.25s ease;

  svg.ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  svg.ring text {
    font-family: var(--font-sans);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    fill: currentColor;
  }

  &:hover {
    transform: scale(1.04);
  }
`;

function Stamp({
  href,
  label,
  id,
  style,
}: {
  href: string;
  label: string;
  id: string;
  style?: React.CSSProperties;
}) {
  return (
    <StampLink href={href} aria-label={label} style={style}>
      <svg className="ring" viewBox="0 0 108 108" aria-hidden>
        <defs>
          <path id={id} d="M54,54 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href={`#${id}`}>{label} · </textPath>
        </text>
      </svg>
      <FiArrowUpRight size={20} aria-hidden />
    </StampLink>
  );
}

/* ------------------------------------------------------------------ hero --- */

const Hero = styled.section.attrs({ className: "home-hero" })`
  padding: 168px 0 0;

  @media (max-width: 800px) {
    padding-top: 120px;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 72px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const HeroCopy = styled.div`
  padding-top: 24px;

  @media (max-width: 960px) {
    padding-top: 0;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(44px, 5.4vw, 82px);
  line-height: 1;
  letter-spacing: -0.025em;
  max-width: 13ch;
  margin: 0 0 30px;
  color: var(--ink);

  em {
    font-style: italic;
    color: var(--accent-text);
  }
`;

const HeroLead = styled(motion.p)`
  font-size: 16.5px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 46ch;
  margin-bottom: 34px;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;
`;

const CallLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-color: var(--line-strong);

  &:hover {
    text-decoration-color: currentColor;
  }
`;

const HeroRating = styled(motion.div)`
  margin-top: 40px;
`;

const Portrait = styled(motion.div)`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-alt);

  img {
    object-fit: cover;
    object-position: 72% 50%;
  }

  @media (max-width: 960px) {
    aspect-ratio: 4 / 3;
  }
`;

/* Tags scroll slowly under the hero; hover pauses them. */
const TagBand = styled.div`
  margin-top: 56px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);

  @media (max-width: 800px) {
    margin-top: 40px;
  }
`;

const TagTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  width: max-content;
  animation: home-marquee 46s linear infinite;

  ${TagBand}:hover & {
    animation-play-state: paused;
  }

  i {
    color: var(--brand);
    font-style: normal;
    font-size: 10px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* -------------------------------------------------------------- outcomes --- */

const OutcomesWrap = styled(Section)`
  position: relative;
  overflow: hidden;
  padding-top: 96px;
`;

/* The wordmark, huge and almost invisible, sits behind the figures. */
const Ghost = styled.span`
  position: absolute;
  z-index: 0;
  left: -0.02em;
  top: 44px;
  font-family: var(--font-display);
  font-size: clamp(160px, 24vw, 420px);
  line-height: 0.8;
  letter-spacing: -0.03em;
  color: rgb(var(--seed-ink) / 0.045);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
`;

const OutcomeGrid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const Outcome = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
  padding-top: 22px;
  border-top: 1px solid var(--line-strong);

  strong {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(44px, 4.6vw, 64px);
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
    max-width: 34ch;
  }
`;

const OutcomeMeta = styled.div`
  display: flex;
  gap: 14px;
  align-items: baseline;
  margin-top: 4px;

  ${Caps}:last-child {
    color: rgb(var(--seed-muted) / 0.7);
  }
`;

const PromiseStrip = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px 28px;
  margin-top: 72px;
  padding-top: 20px;
  border-top: 1px solid var(--line);

  span {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  i {
    color: var(--brand);
    font-style: normal;
    font-size: 9px;
  }

  time {
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 860px) {
    justify-content: flex-start;
    margin-top: 48px;
  }
`;

function Clock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setNow(format.format(new Date()).toUpperCase());
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <time>{now ? `${now} IST` : "—"}</time>;
}

/* ---------------------------------------------------------------- handle --- */

const Statement = styled.p`
  font-family: var(--font-display);
  font-size: clamp(30px, 3.7vw, 54px);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--ink);
  max-width: 28ch;
  margin-bottom: 64px;

  @media (max-width: 800px) {
    margin-bottom: 40px;
  }
`;

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const reduce = useReduceMotion();
  return <motion.span style={{ opacity: reduce ? 1 : opacity }}>{children} </motion.span>;
}

/** Each word brightens as the paragraph scrolls up through the viewport. */
function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const list = useMemo(() => text.split(" "), [text]);

  return (
    <Statement ref={ref}>
      {list.map((word, index) => (
        <Word
          key={`${word}-${index}`}
          progress={scrollYProgress}
          range={[index / list.length, (index + 1) / list.length]}
        >
          {word}
        </Word>
      ))}
    </Statement>
  );
}

const CardRail = styled.div`
  overflow: hidden;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const CardTrack = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding-bottom: 48px;
`;

const HandleCard = styled.article<{ $offset: boolean }>`
  flex: 0 0 min(380px, 84vw);
  margin-top: ${({ $offset }) => ($offset ? "48px" : "0")};
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--brand-deep);
  color: var(--on-brand);

  @media (max-width: 800px) {
    margin-top: 0;
  }
`;

const CardShot = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--brand);

  img {
    object-fit: cover;
  }
`;

const CardBody = styled.div`
  padding: 26px 26px 30px;

  h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 27px;
    letter-spacing: -0.015em;
    line-height: 1.1;
    color: var(--on-brand);
  }

  p {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--on-brand-soft);
  }
`;

const ArrowNav = styled.div`
  display: flex;
  gap: 8px;

  button {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    background: transparent;
    color: var(--ink);
    cursor: pointer;
    transition: 0.15s ease;
  }

  button:hover {
    background: var(--brand-deep);
    border-color: var(--brand-deep);
    color: var(--on-brand);
  }
`;

function HandleCards() {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <>
      <Head style={{ marginBottom: 24 }}>
        <small>Drag, or use the arrows.</small>
        <ArrowNav>
          <button type="button" onClick={prev} aria-label="Previous">
            <FiArrowLeft size={18} />
          </button>
          <button type="button" onClick={next} aria-label="Next">
            <FiArrowRight size={18} />
          </button>
        </ArrowNav>
      </Head>
      <CardRail ref={viewportRef}>
        <CardTrack>
          {handle.cards.map((card, index) => (
            <HandleCard key={card.title} $offset={index % 2 === 1}>
              <CardShot>
                <Image
                  src={photos.handle[index % photos.handle.length]}
                  alt=""
                  fill
                  sizes="(max-width: 800px) 84vw, 380px"
                />
              </CardShot>
              <CardBody>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </CardBody>
            </HandleCard>
          ))}
        </CardTrack>
      </CardRail>
    </>
  );
}

/* ----------------------------------------------------------------- words --- */

const WordsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 80px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const WordStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--line);

  strong {
    display: block;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(30px, 3vw, 42px);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--ink);
  }

  span {
    display: block;
    margin-top: 10px;
    font-size: 13px;
    color: var(--muted);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const WordsNote = styled.p`
  margin-top: 32px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
  max-width: 48ch;
`;

const QuoteCard = styled.div`
  position: relative;
`;

const QuoteShot = styled.div`
  position: relative;
  aspect-ratio: 5 / 4;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-alt);

  img {
    object-fit: cover;
    object-position: center 30%;
  }
`;

const QuoteBody = styled(motion.blockquote)`
  position: relative;
  z-index: 1;
  margin: -72px 28px 0 28px;
  padding: 28px 30px 26px;
  border-radius: var(--radius);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);

  p {
    font-family: var(--font-display);
    font-size: clamp(20px, 1.7vw, 24px);
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
  }

  footer b {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
  }

  footer small {
    display: block;
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }

  @media (max-width: 560px) {
    margin: -48px 14px 0;
    padding: 22px;
  }
`;

const QuoteFace = styled.span`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--surface-alt);

  img {
    object-fit: cover;
    object-position: center 20%;
  }
`;

const QuoteNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 28px 0;

  @media (max-width: 560px) {
    margin: 20px 14px 0;
  }
`;

/** Initials only: surnames are withheld, so "Neelima R." becomes "Neelima". */
const firstName = (name: string) => name.split(" ")[0];

function Words() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const item = testimonials[index];

  return (
    <QuoteCard>
      <QuoteShot>
        <Image src={photos.words} alt="" fill sizes="(max-width: 960px) 100vw, 45vw" />
      </QuoteShot>
      <AnimatePresence mode="wait" initial={false}>
        <QuoteBody
          key={item.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease }}
        >
          <p>“{item.quote}”</p>
          <footer>
            <QuoteFace>
              <Image src={photos.faces[index % photos.faces.length]} alt="" fill sizes="36px" />
            </QuoteFace>
            <div>
              <b>{firstName(item.name)}, surname withheld</b>
              <small>{item.role}</small>
            </div>
          </footer>
        </QuoteBody>
      </AnimatePresence>
      <QuoteNav>
        <Caps>
          {pad(index + 1)} / {pad(count)}
        </Caps>
        <ArrowNav>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            aria-label="Previous quote"
          >
            <FiArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % count)}
            aria-label="Next quote"
          >
            <FiArrowRight size={18} />
          </button>
        </ArrowNav>
      </QuoteNav>
    </QuoteCard>
  );
}

/* ----------------------------------------------------------- fund houses --- */

/* Every fund house scrolls past slowly, like a logo wall; hover pauses it. */
const HouseBand = styled.div`
  overflow: hidden;
  padding: 34px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
`;

const HouseTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 56px;
  width: max-content;
  animation: home-marquee 70s linear infinite;

  ${HouseBand}:hover & {
    animation-play-state: paused;
  }

  span {
    font-family: var(--font-display);
    font-size: 22px;
    letter-spacing: -0.01em;
    color: rgb(var(--seed-muted) / 0.85);
    white-space: nowrap;
  }

  i {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--line-strong);
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

/* -------------------------------------------------------------- let's talk --- */

const TalkPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-raised);
  border: 1px solid var(--line);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const TalkShot = styled.div`
  position: relative;
  min-height: 520px;
  background: var(--surface-alt);

  img {
    object-fit: cover;
    object-position: center 40%;
  }

  @media (max-width: 960px) {
    min-height: 0;
    aspect-ratio: 4 / 3;
  }
`;

const TalkBody = styled.div`
  display: grid;
  gap: 22px;
  align-content: center;
  padding: 56px 60px;

  ${Eyebrow} {
    margin: 0;
  }

  ${Display} {
    max-width: 15ch;
  }

  > p {
    font-size: 15.5px;
    line-height: 1.65;
    color: var(--muted);
    max-width: 44ch;
  }

  @media (max-width: 640px) {
    padding: 30px 22px;
  }
`;

const Covers = styled.ol`
  list-style: none;
  display: grid;
  border-top: 1px solid var(--line);

  li {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 12px;
    align-items: baseline;
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--ink);
  }

  li small {
    font-size: 11px;
    letter-spacing: 0.16em;
    color: var(--brand);
    font-variant-numeric: tabular-nums;
  }
`;

const TalkActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 24px;
  margin-top: 6px;
`;

const TalkMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  font-size: 13px;
  color: var(--muted);

  a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--line-strong);
  }

  a:hover {
    text-decoration-color: currentColor;
  }
`;

/* ----------------------------------------------------------------- money --- */

const MoneyIntro = styled.p`
  font-family: var(--font-display);
  font-size: clamp(22px, 2.1vw, 30px);
  line-height: 1.3;
  letter-spacing: -0.012em;
  color: var(--ink);
  max-width: 44ch;
  margin-bottom: 48px;
`;

const Ledger = styled.div`
  border-radius: var(--radius);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  padding: 38px 40px 34px;

  @media (max-width: 640px) {
    padding: 26px 20px;
  }
`;

const LedgerTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px 40px;
  flex-wrap: wrap;
`;

const BigFigure = styled.div`
  display: grid;
  gap: 10px;

  strong {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(44px, 5vw, 72px);
    line-height: 1;
    letter-spacing: -0.03em;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }

  strong small {
    font-size: 0.42em;
    color: var(--muted);
    letter-spacing: 0;
    margin-left: 8px;
  }
`;

const Presets = styled.div`
  display: grid;
  gap: 10px;
  justify-items: end;

  div {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  @media (max-width: 640px) {
    justify-items: start;
  }
`;

const Preset = styled.button<{ $on: boolean }>`
  min-height: 38px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $on }) => ($on ? "var(--brand-deep)" : "var(--line-strong)")};
  background: ${({ $on }) => ($on ? "var(--brand-deep)" : "transparent")};
  color: ${({ $on }) => ($on ? "var(--on-brand)" : "var(--ink)")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.15s ease;
  font-variant-numeric: tabular-nums;

  &:hover {
    border-color: var(--brand-deep);
  }
`;

const YearsRow = styled.label`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--line);

  b {
    font-weight: 500;
    font-size: 14px;
    color: var(--ink);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  input[type="range"] {
    width: 100%;
    height: 2px;
    appearance: none;
    background: var(--line-strong);
    border-radius: 2px;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--brand-deep);
    border: 3px solid var(--surface-raised);
    box-shadow: 0 0 0 1px var(--brand-deep);
  }

  input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--brand-deep);
    border: 3px solid var(--surface-raised);
    box-shadow: 0 0 0 1px var(--brand-deep);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const Shares = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 28px;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid var(--line);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Share = styled.div<{ $tone?: "ink" | "muted" }>`
  display: grid;
  gap: 8px;
  align-content: start;

  strong {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(26px, 2.4vw, 34px);
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${({ $tone }) => ($tone === "muted" ? "var(--muted)" : "var(--ink)")};
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 13px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
`;

/* A single stacked bar for the same split, so the shares read at a glance. */
const Bar = styled.div`
  display: flex;
  height: 8px;
  margin-top: 26px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--surface-alt);

  i {
    display: block;
    height: 100%;
    transition: width 0.35s ease;
  }
`;

const LedgerFoot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px 32px;
  flex-wrap: wrap;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid var(--line);

  p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--muted);
    max-width: 52ch;
  }

  div {
    display: flex;
    gap: 8px 22px;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const RATE = 0.12;
const TRAIL = 0.0075;

/** Month-by-month SIP with the distributor's trail accrued on the running balance. */
function ledger(monthly: number, years: number) {
  const r = RATE / 12;
  const t = TRAIL / 12;
  let balance = 0;
  let invested = 0;
  let commission = 0;
  for (let m = 0; m < years * 12; m += 1) {
    balance = balance * (1 + r) + monthly;
    invested += monthly;
    commission += balance * t;
  }
  return {
    corpus: balance,
    invested,
    growth: Math.max(0, balance - invested),
    commission,
  };
}

const pct = (part: number, whole: number) =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "0%";

function MoneyLedger() {
  const [monthly, setMonthly] = useState(money.presets[1]);
  const [years, setYears] = useState(15);
  const out = useMemo(() => ledger(monthly, years), [monthly, years]);

  return (
    <Ledger>
      <LedgerTop>
        <BigFigure>
          <Caps>If you invest</Caps>
          <strong>
            {formatINR(monthly)}
            <small>a month</small>
          </strong>
        </BigFigure>
        <Presets>
          <Caps>Try another SIP</Caps>
          <div role="group" aria-label="Monthly SIP presets">
            {money.presets.map((amount) => (
              <Preset
                key={amount}
                type="button"
                $on={amount === monthly}
                onClick={() => setMonthly(amount)}
              >
                {formatShortINR(amount)}
              </Preset>
            ))}
          </div>
        </Presets>
      </LedgerTop>

      <YearsRow>
        <b>for {years} years</b>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={years}
          onChange={(event) => setYears(Number(event.target.value))}
          aria-label="Years invested"
        />
        <Caps>5 to 30 yrs</Caps>
      </YearsRow>

      <Shares>
        <Share>
          <Caps>You end with</Caps>
          <strong>{formatCompact(out.corpus)}</strong>
          <span>100%</span>
        </Share>
        <Share>
          <Caps>You put in</Caps>
          <strong>{formatCompact(out.invested)}</strong>
          <span>{pct(out.invested, out.corpus)}</span>
        </Share>
        <Share>
          <Caps>Market growth</Caps>
          <strong>{formatCompact(out.growth)}</strong>
          <span>{pct(out.growth, out.corpus)}</span>
        </Share>
        <Share $tone="muted">
          <Caps>What we receive</Caps>
          <strong>{formatCompact(out.commission)}</strong>
          <span>{pct(out.commission, out.corpus)} · paid by the AMC</span>
        </Share>
      </Shares>

      <Bar aria-hidden>
        <i style={{ width: pct(out.invested, out.corpus), background: "var(--brand-deep)" }} />
        <i style={{ width: pct(out.growth, out.corpus), background: "var(--accent)" }} />
      </Bar>

      <LedgerFoot>
        <p>{money.note}</p>
        <div>
          <ButtonLink href="/disclosures" $variant="ghost">
            Read the commission disclosures
          </ButtonLink>
          <ButtonLink href="/contact">Ask what yours would look like</ButtonLink>
        </div>
      </LedgerFoot>
    </Ledger>
  );
}

/** "₹1.2 Cr" style figures with two decimals trimmed. */
function formatCompact(value: number) {
  return formatShortINR(Math.round(value));
}

/* -------------------------------------------------------------- questions --- */

const AskGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 72px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const QuestionList = styled.div`
  display: grid;
  border-top: 1px solid var(--line-strong);
`;

const Question = styled.button<{ $on: boolean }>`
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 4px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: ${({ $on }) => ($on ? "var(--ink)" : "rgb(var(--seed-ink) / 0.6)")};
  transition: color 0.18s ease;

  small {
    font-size: 11px;
    letter-spacing: 0.16em;
    color: ${({ $on }) => ($on ? "var(--brand)" : "var(--muted)")};
    font-variant-numeric: tabular-nums;
  }

  span {
    font-family: var(--font-display);
    font-size: clamp(20px, 1.8vw, 25px);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  svg {
    opacity: ${({ $on }) => ($on ? 1 : 0)};
    transition: opacity 0.18s ease;
  }

  &:hover {
    color: var(--ink);
  }
`;

const AnswerPanel = styled.div`
  display: grid;
  gap: 26px;
`;

const AnswerShot = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-alt);
`;

const AnswerShotInner = styled(motion.div)`
  position: absolute;
  inset: 0;

  img {
    object-fit: cover;
  }
`;

const Answer = styled(motion.div)`
  display: grid;
  gap: 16px;

  ${Caps} {
    color: var(--brand);
  }

  p {
    font-family: var(--font-display);
    font-size: clamp(21px, 1.9vw, 27px);
    line-height: 1.3;
    letter-spacing: -0.012em;
    color: var(--ink);
    max-width: 40ch;
  }
`;

const AnswerFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 28px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const StillRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
  flex-wrap: wrap;
  margin-top: 72px;
  padding-top: 26px;
  border-top: 1px solid var(--line);

  p {
    font-size: 15px;
    color: var(--muted);
    max-width: 52ch;
  }

  p b {
    font-weight: 500;
    color: var(--ink);
  }
`;

function Questions() {
  const [index, setIndex] = useState(0);
  const item = firstQuestions[index];

  return (
    <>
      <AskGrid>
        <QuestionList role="tablist" aria-label="Common questions">
          {firstQuestions.map((entry, i) => (
            <Question
              key={entry.q}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="first-answer"
              $on={i === index}
              onClick={() => setIndex(i)}
            >
              <small>{pad(i + 1)}</small>
              <span>{entry.q}</span>
              <FiArrowRight size={16} aria-hidden />
            </Question>
          ))}
        </QuestionList>

        <AnswerPanel id="first-answer" role="tabpanel" aria-live="polite">
          <AnswerShot>
            <AnimatePresence mode="wait" initial={false}>
              <AnswerShotInner
                key={`shot-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <Image
                  src={photos.questions[index % photos.questions.length]}
                  alt=""
                  fill
                  sizes="(max-width: 960px) 100vw, 55vw"
                />
              </AnswerShotInner>
            </AnimatePresence>
            <Stamp
              id="stamp-answers"
              href="/faqs"
              label="Straight answers · No jargon"
              style={{ right: 22, bottom: 22 }}
            />
          </AnswerShot>
          <AnimatePresence mode="wait" initial={false}>
            <Answer
              key={`answer-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              <Caps>{pad(index + 1)}</Caps>
              <p>{item.a}</p>
            </Answer>
          </AnimatePresence>
          <AnswerFoot>
            <Rating />
            <ButtonLink href="/contact">Tell us your goals</ButtonLink>
          </AnswerFoot>
        </AnswerPanel>
      </AskGrid>

      <StillRow>
        <p>
          Still deciding whether to invest at all? <b>Read what to do with your first surplus.</b>
        </p>
        <ButtonLink href="/blog" $variant="navy">
          What to do first <FiArrowRight />
        </ButtonLink>
      </StillRow>
    </>
  );
}

/* --------------------------------------------------------------- journal --- */

const JournalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* Rows: photo, meta, title, excerpt (stretches), footer - so dates line up across cards. */
const Note = styled(Link)`
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  align-content: start;
  gap: 14px;
  height: 100%;
  color: inherit;

  h3 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 25px;
    line-height: 1.15;
    letter-spacing: -0.015em;
    color: var(--ink);
    max-width: 22ch;
  }

  p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
    max-width: 40ch;
  }

  &:hover h3 {
    color: var(--brand);
  }
`;

const NoteShot = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-alt);
  margin-bottom: 8px;

  img {
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  ${Note}:hover & img {
    transform: scale(1.03);
  }
`;

const NoteFoot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid var(--line);

  svg {
    color: var(--ink);
  }
`;

/* --------------------------------------------------------------- contact --- */

const TellGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 88px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;

const TellCopy = styled.div`
  display: grid;
  gap: 22px;

  ${Display} {
    max-width: 16ch;
  }

  p {
    font-size: 15.5px;
    line-height: 1.65;
    color: var(--muted);
    max-width: 40ch;
  }

  p a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: var(--line-strong);
  }
`;

const TellShot = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  margin-top: 16px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface-alt);
  max-width: 520px;

  img {
    object-fit: cover;
    object-position: center 20%;
  }
`;

const TellForm = styled.div`
  padding-top: 6px;

  > div:last-child {
    margin-top: 28px;
  }
`;

/* ------------------------------------------------------------------ view --- */

export function HomeView() {
  return (
    <>
      <Hero>
        <Container>
          <HeroGrid>
            <HeroCopy>
              <motion.div {...rise(0)}>
                <Eyebrow>{hero.kicker}</Eyebrow>
              </motion.div>
              <HeroTitle {...rise(0.06)}>{titleWithHighlights(hero.title, hero.highlights)}</HeroTitle>
              <HeroLead {...rise(0.14)}>{hero.body}</HeroLead>
              <HeroActions {...rise(0.2)}>
                <ButtonLink href="/contact">Tell us your goals</ButtonLink>
                <CallLink href={site.phoneHref}>or call {site.phone}</CallLink>
              </HeroActions>
              <HeroRating {...rise(0.28)}>
                <Rating />
              </HeroRating>
            </HeroCopy>
            <Portrait
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
            >
              <Image
                src={photos.hero}
                alt="An Indian family looking out over a field at sunset"
                fill
                priority
                sizes="(max-width: 960px) 100vw, 42vw"
              />
              <Stamp
                id="stamp-team"
                href="/about/team"
                label={`Meet the team · Since ${site.foundedYear}`}
                style={{ left: 22, bottom: 22 }}
              />
            </Portrait>
          </HeroGrid>
        </Container>
        <TagBand aria-hidden>
          <TagTrack>
            {[...hero.tags, ...hero.tags].map((tag, index) => (
              <span key={`${tag}-${index}`} style={{ display: "contents" }}>
                <Caps style={{ color: "var(--ink)" }}>{tag}</Caps>
                <i>✦</i>
              </span>
            ))}
          </TagTrack>
        </TagBand>
      </Hero>

      <OutcomesWrap>
        <Ghost aria-hidden>{site.shortName}</Ghost>
        <Container>
          <Reveal>
            <Head>
              <Eyebrow>Past results</Eyebrow>
              <small>
                Illustrative client outcomes. Past performance is not indicative of future
                returns; every plan is decided on its own facts.
              </small>
            </Head>
          </Reveal>
          <Stagger>
            <OutcomeGrid>
              {outcomes.map((item) => (
                <Item key={item.label}>
                  <Outcome>
                    <strong>{item.amount}</strong>
                    <OutcomeMeta>
                      <Caps style={{ color: "var(--ink)" }}>{item.label}</Caps>
                      <Caps>{item.year}</Caps>
                    </OutcomeMeta>
                    <p>{item.body}</p>
                  </Outcome>
                </Item>
              ))}
            </OutcomeGrid>
          </Stagger>
          <Reveal delay={0.1}>
            <PromiseStrip>
              {promises.map((line) => (
                <span key={line}>
                  <i>✦</i>
                  <Caps style={{ color: "var(--ink)" }}>{line}</Caps>
                </span>
              ))}
              <span>
                <Caps>
                  <Clock />
                </Caps>
              </span>
            </PromiseStrip>
          </Reveal>
        </Container>
      </OutcomesWrap>

      <Section $tone="paper">
        <Container>
          <Reveal>
            <Eyebrow>What we handle</Eyebrow>
          </Reveal>
          <WordReveal text={handle.statement} />
          <Reveal delay={0.05}>
            <HandleCards />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <WordsGrid>
            <Reveal>
              <Head style={{ marginBottom: 28 }}>
                <Eyebrow>In their words</Eyebrow>
                <small>Surnames withheld at our clients&apos; request.</small>
              </Head>
              <Display>{words.intro}</Display>
              <WordStats>
                {words.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </WordStats>
              <WordsNote>{words.note}</WordsNote>
            </Reveal>
            <Reveal delay={0.1}>
              <Words />
            </Reveal>
          </WordsGrid>
        </Container>
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <Container>
          <Reveal>
            <Eyebrow style={{ textAlign: "center" }}>
              Fund houses we work with · {site.stats[3].value}
              {site.stats[3].suffix} in all
            </Eyebrow>
            <HouseBand aria-label="Fund houses">
              <HouseTrack>
                {[...fundHouses, ...fundHouses].map((name, index) => (
                  <span key={`${name}-${index}`} style={{ display: "contents" }}>
                    <span>{name}</span>
                    <i aria-hidden />
                  </span>
                ))}
              </HouseTrack>
            </HouseBand>
          </Reveal>
        </Container>
      </Section>

      <Section style={{ paddingTop: 0 }}>
        <Container>
          <Reveal>
            <TalkPanel>
              <TalkShot>
                <Image src={photos.reel} alt="" fill sizes="(max-width: 960px) 100vw, 45vw" />
              </TalkShot>
              <TalkBody>
                <Eyebrow>Let&apos;s talk</Eyebrow>
                <Display as="h2">{talk.title}</Display>
                <p>{talk.body}</p>
                <Covers aria-label="What the first conversation covers">
                  {talk.covers.map((line, index) => (
                    <li key={line}>
                      <small>{pad(index + 1)}</small>
                      <span>{line}</span>
                    </li>
                  ))}
                </Covers>
                <TalkActions>
                  <ButtonLink href="/contact">
                    Book a consultation <FiArrowUpRight size={15} />
                  </ButtonLink>
                  <CallLink href={site.phoneHref}>or call {site.phone}</CallLink>
                </TalkActions>
                <TalkMeta>
                  <span>{site.hours}</span>
                  <span>
                    Also on <a href={site.whatsapp}>WhatsApp</a>
                  </span>
                </TalkMeta>
              </TalkBody>
            </TalkPanel>
          </Reveal>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Reveal>
            <Head>
              <Eyebrow>Where the money goes</Eyebrow>
              <small>Illustrative. Your own numbers turn on your own plan.</small>
            </Head>
            <MoneyIntro>{money.intro}</MoneyIntro>
          </Reveal>
          <Reveal delay={0.08}>
            <MoneyLedger />
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Head>
              <Eyebrow>What people ask first</Eyebrow>
            </Head>
          </Reveal>
          <Reveal delay={0.05}>
            <Questions />
          </Reveal>
        </Container>
      </Section>

      <Section $tone="paper">
        <Container>
          <Reveal>
            <Head>
              <Eyebrow>What we write down</Eyebrow>
              <ButtonLink href="/blog" $variant="ghost">
                All notes
              </ButtonLink>
            </Head>
          </Reveal>
          <Stagger>
            <JournalGrid>
              {journal.map((post, index) => (
                <Item key={post.slug}>
                  <Note href={`/blog/${post.slug}`}>
                    <NoteShot>
                      <Image
                        src={post.image || photos.journal[index % photos.journal.length]}
                        alt=""
                        fill
                        sizes="(max-width: 960px) 100vw, 33vw"
                      />
                    </NoteShot>
                    <Caps>
                      {post.category} · {readMinutes(post.body)} min
                    </Caps>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <NoteFoot>
                      <Caps>{formatDate(post.date)}</Caps>
                      <FiArrowUpRight size={16} aria-hidden />
                    </NoteFoot>
                  </Note>
                </Item>
              ))}
            </JournalGrid>
          </Stagger>
        </Container>
      </Section>

      <Section id="tell-us">
        <Container>
          <TellGrid>
            <Reveal>
              <TellCopy>
                <Eyebrow style={{ margin: 0 }}>Tell us your goals</Eyebrow>
                <Display>
                  There is no wrong way to start this. Tell us roughly what you are saving for
                  and we will take it <em>from there.</em>
                </Display>
                <p>
                  Or call <a href={site.phoneHref}>{site.phone}</a>. We answer, or we call back
                  the same working day.
                </p>
                <TellShot>
                  <Image
                    src={photos.contact}
                    alt=""
                    fill
                    sizes="(max-width: 960px) 100vw, 40vw"
                  />
                </TellShot>
              </TellCopy>
            </Reveal>
            <Reveal delay={0.1}>
              <TellForm>
                <LeadForm compact cta="Send this to us" />
                <Rating />
              </TellForm>
            </Reveal>
          </TellGrid>
        </Container>
      </Section>
    </>
  );
}
