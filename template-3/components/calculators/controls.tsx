"use client";

import { useId, useState, type ReactNode } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiChevronDown, FiMinus, FiPlus } from "react-icons/fi";

/**
 * The input vocabulary shared by every calculator panel.
 *
 * Sliders alone made every calculator look the same and read as imprecise, so
 * each quantity now gets the control that suits it: money is typed or nudged,
 * ages and tenures are stepped, rates come with named presets, and optional
 * assumptions stay hidden behind a switch until they are turned on.
 */

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const digitsOnly = (value: string) => value.replace(/[^0-9]/g, "");

const groupIN = (n: number) => n.toLocaleString("en-IN");

/* ------------------------------------------------------------ scaffolding --- */

export const ControlStack = styled.div`
  display: grid;
  gap: 24px;
  align-content: start;
`;

const Block = styled.div`
  display: grid;
  gap: 10px;
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const Name = styled.span`
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
`;

const Readout = styled.span`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--accent-strong);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const Hint = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
`;

/* ---------------------------------------------------------------- slider --- */

/**
 * The filled portion is painted with a gradient: `accent-color` only tints the
 * thumb reliably, and the track has to read against a cream surface.
 */
const Range = styled.input<{ $pct: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  margin: 6px 0 2px;
  cursor: pointer;
  background: linear-gradient(
    90deg,
    var(--accent-strong) 0%,
    var(--accent-strong) ${({ $pct }) => $pct}%,
    var(--line-strong) ${({ $pct }) => $pct}%,
    var(--line-strong) 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--ink);
    transition: transform 0.12s ease;
  }

  &:active::-webkit-slider-thumb {
    transform: scale(1.15);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--ink);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-strong);
    outline-offset: 4px;
  }
`;

const Scale = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 650;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
`;

function Track({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <Range
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      $pct={Number.isFinite(pct) ? clamp(pct, 0, 100) : 0}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}

/* ----------------------------------------------------------------- chips --- */

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Chip = styled.button<{ $on: boolean }>`
  border: 1px solid ${({ $on }) => ($on ? "var(--ink)" : "var(--line-strong)")};
  background: ${({ $on }) => ($on ? "var(--ink)" : "transparent")};
  color: ${({ $on }) => ($on ? "var(--accent)" : "var(--muted)")};
  padding: 6px 11px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: 0.15s ease;
  font-variant-numeric: tabular-nums;

  &:hover {
    border-color: var(--ink);
    color: ${({ $on }) => ($on ? "var(--accent)" : "var(--ink)")};
  }
`;

export function ChipRow({
  options,
  value,
  onChange,
  format,
}: {
  options: number[];
  value: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
}) {
  return (
    <Chips>
      {options.map((option) => (
        <Chip
          key={option}
          type="button"
          $on={option === value}
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {format(option)}
        </Chip>
      ))}
    </Chips>
  );
}

/* ------------------------------------------------------------ money field --- */

const InputRow = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-within {
    border-color: var(--accent-strong);
    box-shadow: 0 0 0 3px var(--tint-accent-weak);
  }
`;

const Affix = styled.span`
  display: grid;
  place-items: center;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 750;
  color: var(--muted);
  background: var(--surface);
  border-right: 1px solid var(--line);
`;

const NumberInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  padding: 12px 14px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;

  &:focus {
    outline: none;
  }
`;

const InWords = styled.span`
  display: grid;
  place-items: center;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent-strong);
  border-left: 1px solid var(--line);
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }
`;

/** A rupee amount: typed directly, nudged with a slider, or picked from presets. */
export function MoneyField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1000,
  presets,
  hint,
  words,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  hint?: string;
  /** Short form shown inside the field and on the preset chips, e.g. "25 L". */
  words?: (n: number) => string;
}) {
  // While the field has focus the raw keystrokes win, so typing the "1" on the
  // way to "100000" is not clamped up to the minimum mid-word.
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (raw: string) => {
    const parsed = Number(digitsOnly(raw));
    onChange(clamp(Number.isFinite(parsed) ? parsed : min, min, max));
    setDraft(null);
  };

  return (
    <Block>
      <Head>
        <Name>{label}</Name>
      </Head>
      <InputRow>
        <Affix aria-hidden>₹</Affix>
        <NumberInput
          type="text"
          inputMode="numeric"
          aria-label={label}
          value={draft ?? groupIN(value)}
          onChange={(event) => setDraft(groupIN(Number(digitsOnly(event.target.value)) || 0))}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
        />
        {words ? <InWords aria-hidden>{words(value)}</InWords> : null}
      </InputRow>
      <Track label={label} value={value} min={min} max={max} step={step} onChange={onChange} />
      {presets ? (
        <ChipRow
          options={presets}
          value={value}
          onChange={onChange}
          format={words ?? groupIN}
        />
      ) : null}
      {hint ? <Hint>{hint}</Hint> : null}
    </Block>
  );
}

/* ----------------------------------------------------------- slider field --- */

/** A plain quantity with a track and end captions - used for rates and spans. */
export function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
  scale,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (n: number) => void;
  /** Overrides the min/max captions under the track. */
  scale?: [string, string];
  hint?: string;
}) {
  return (
    <Block>
      <Head>
        <Name>{label}</Name>
        <Readout>
          {value}
          {suffix}
        </Readout>
      </Head>
      <Track label={label} value={value} min={min} max={max} step={step} onChange={onChange} />
      <Scale aria-hidden>
        <span>{scale?.[0] ?? `${min}${suffix}`}</span>
        <span>{scale?.[1] ?? `${max}${suffix}`}</span>
      </Scale>
      {hint ? <Hint>{hint}</Hint> : null}
    </Block>
  );
}

/* ---------------------------------------------------------------- stepper --- */

const StepRow = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 0;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
`;

const StepButton = styled.button`
  width: 48px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  transition: 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--accent);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StepValue = styled.div`
  flex: 1;
  min-height: 50px;
  display: grid;
  place-items: center;
  gap: 1px;
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);

  strong {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.015em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  small {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
`;

/** Ages and tenures: a short range, nudged one notch at a time. */
export function StepperField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
  hint?: string;
}) {
  const set = (next: number) => onChange(clamp(next, min, max));
  return (
    <Block>
      <Head>
        <Name>{label}</Name>
      </Head>
      <StepRow>
        <StepButton
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => set(value - step)}
        >
          <FiMinus size={16} />
        </StepButton>
        <StepValue aria-live="polite" aria-label={`${label}: ${value} ${unit}`}>
          <strong>{value}</strong>
          <small>{unit}</small>
        </StepValue>
        <StepButton
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => set(value + step)}
        >
          <FiPlus size={16} />
        </StepButton>
      </StepRow>
      {hint ? <Hint>{hint}</Hint> : null}
    </Block>
  );
}

/* -------------------------------------------------------------- segmented --- */

const Seg = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  min-width: 0;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
`;

const SegCell = styled.div`
  position: relative;
  display: grid;
  min-width: 0;

  & + & {
    border-left: 1px solid var(--line);
  }
`;

const SegPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  background: var(--ink);
`;

const SegButton = styled.button<{ $on: boolean }>`
  position: relative;
  z-index: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 10px 6px;
  display: grid;
  gap: 2px;
  color: ${({ $on }) => ($on ? "var(--accent)" : "var(--muted)")};
  transition: color 0.2s ease;

  strong {
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  small {
    font-size: 11px;
    font-weight: 650;
    opacity: 0.85;
    font-variant-numeric: tabular-nums;
  }

  &:hover {
    color: ${({ $on }) => ($on ? "var(--accent)" : "var(--ink)")};
  }
`;

export type SegOption<T extends string | number> = {
  value: T;
  label: string;
  note?: string;
};

/** Named presets - risk appetite, step-up size, payout frequency. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  hint,
}: {
  label: string;
  options: SegOption<T>[];
  value: T;
  onChange: (value: T) => void;
  hint?: string;
}) {
  // One id per instance, so the sliding pill never animates between two
  // different segmented controls that happen to be on screen together.
  const pillId = useId();
  return (
    <Block>
      <Head>
        <Name>{label}</Name>
      </Head>
      <Seg role="group" aria-label={label}>
        {options.map((option) => {
          const on = option.value === value;
          return (
            <SegCell key={String(option.value)}>
              {on ? (
                <SegPill
                  layoutId={pillId}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
              <SegButton
                type="button"
                $on={on}
                aria-pressed={on}
                onClick={() => onChange(option.value)}
              >
                <strong>{option.label}</strong>
                {option.note ? <small>{option.note}</small> : null}
              </SegButton>
            </SegCell>
          );
        })}
      </Seg>
      {hint ? <Hint>{hint}</Hint> : null}
    </Block>
  );
}

/* ----------------------------------------------------------------- select --- */

const SelectShell = styled.div`
  position: relative;
  display: grid;

  svg {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--muted);
  }
`;

const NativeSelect = styled.select`
  appearance: none;
  width: 100%;
  min-height: 50px;
  padding: 0 42px 0 14px;
  border: 1px solid var(--line-strong);
  background: var(--surface-raised);
  color: var(--ink);
  font-size: 15px;
  font-weight: 650;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-strong);
    box-shadow: 0 0 0 3px var(--tint-accent-weak);
  }
`;

/** A preset list too long for a segmented control. */
export function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <Block>
      <Head>
        <Name>{label}</Name>
      </Head>
      <SelectShell>
        <NativeSelect
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect>
        <FiChevronDown size={16} aria-hidden />
      </SelectShell>
      {hint ? <Hint>{hint}</Hint> : null}
    </Block>
  );
}

/* ----------------------------------------------------------------- switch --- */

const SwitchButton = styled.button<{ $on: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  cursor: pointer;
  border: 1px solid ${({ $on }) => ($on ? "var(--accent-strong)" : "var(--line-strong)")};
  background: ${({ $on }) => ($on ? "var(--tint-accent-weak)" : "var(--surface-raised)")};
  transition: 0.18s ease;

  .copy {
    display: grid;
    gap: 2px;
  }

  strong {
    font-size: 12px;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink);
  }

  small {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
  }
`;

const SwitchTrack = styled.span<{ $on: boolean }>`
  position: relative;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? "var(--ink)" : "var(--line-strong)")};
  transition: background 0.2s ease;
`;

const SwitchKnob = styled(motion.span)`
  position: absolute;
  top: 3px;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
`;

/** Turns an optional assumption on, revealing the inputs it needs. */
export function SwitchField({
  label,
  note,
  on,
  onChange,
  children,
}: {
  label: string;
  note?: string;
  on: boolean;
  onChange: (on: boolean) => void;
  /** Revealed only while the switch is on. */
  children?: ReactNode;
}) {
  return (
    <Block>
      <SwitchButton
        type="button"
        role="switch"
        aria-checked={on}
        $on={on}
        onClick={() => onChange(!on)}
      >
        <span className="copy">
          <strong>{label}</strong>
          {note ? <small>{note}</small> : null}
        </span>
        <SwitchTrack $on={on} aria-hidden>
          <SwitchKnob
            animate={{ x: on ? 23 : 3 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          />
        </SwitchTrack>
      </SwitchButton>
      {on && children ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden", display: "grid", gap: 22, paddingTop: 6 }}
        >
          {children}
        </motion.div>
      ) : null}
    </Block>
  );
}
