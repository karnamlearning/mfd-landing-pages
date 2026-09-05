"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  type Variants,
} from "framer-motion";

/**
 * Small, shared motion vocabulary so every section animates the same way.
 *
 * Reduced motion: <MotionProvider> (mounted in app/layout.tsx) tells
 * framer-motion to honour the OS setting, which turns transform animations
 * into instant changes while keeping opacity fades. Components below never
 * branch on the preference during render, so server and client markup match.
 */

export const ease = [0.22, 1, 0.36, 1] as const;

const viewport = { once: true, margin: "-72px 0px" } as const;

/**
 * `amount` is the fraction of the element that must be on screen before it
 * animates. Pages that want reveals to wait until a block is comfortably in
 * view (rather than firing the moment its edge appears) pass a higher value.
 */
const viewportFor = (amount?: number) => (amount === undefined ? viewport : { ...viewport, amount });

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Hydration-safe "prefers-reduced-motion". The server snapshot is always
 * false, so the first client render matches the HTML; the real value arrives
 * on the very next render.
 */
const reduceQuery = "(prefers-reduced-motion: reduce)";

function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(reduceQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReduceMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(reduceQuery).matches,
    () => false,
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease } },
};

type BoxProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Fades a block into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  x = 0,
  duration = 0.7,
  amount,
  className,
  style,
}: BoxProps & { delay?: number; y?: number; x?: number; duration?: number; amount?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewportFor(amount)}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for a group of <Item>s. Children animate one after another. It is a
 * plain wrapper, so a grid can sit between it and its items - variants reach
 * child motion components through context, not through the DOM.
 */
export function Stagger({
  children,
  className,
  style,
  stagger = 0.08,
  delay = 0,
  amount,
}: BoxProps & { stagger?: number; delay?: number; amount?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={viewportFor(amount)}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** One member of a <Stagger> group. Fills its grid cell so cards stay equal height. */
export function Item({
  children,
  className,
  style,
  duration,
}: BoxProps & { duration?: number }) {
  const variants: Variants = duration
    ? { hidden: fadeUp.hidden, show: { opacity: 1, y: 0, transition: { duration, ease } } }
    : fadeUp;
  return (
    <motion.div
      className={className}
      style={{ display: "grid", minWidth: 0, ...style }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Counts from zero to `value` when it first scrolls into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduce = useReduceMotion();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setCurrent(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  // With reduced motion on, skip the count and show the final figure at once.
  const shown = reduce ? value : current;

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
