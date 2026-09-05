"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import {
  futureCost,
  lumpsumRequired,
  retirementCorpus,
  sipFutureValue,
  sipInvested,
  sipRequired,
  stepUpSipFutureValue,
  stepUpSipInvested,
  type CalculatorSlug,
} from "@/lib/calculators";
import { formatINR } from "@/lib/format";
import { ButtonLink } from "@/components/ui";
import { CalcShell, type Stat } from "@/components/calculators/CalcShell";
import { CalcChart } from "@/components/calculators/CalcChart";

/* ---------------------------------------------------------------- inputs --- */

const Field = styled.label`
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
`;

const Label = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  font-weight: 650;
  color: var(--ink);

  b {
    font-family: var(--font-sans);
    font-size: 16px;
    font-weight: 650;
    color: var(--accent-strong);
  }
`;

/**
 * The track is painted with a gradient so the filled portion is visible on a
 * light surface; `accent-color` alone only tints the thumb consistently.
 */
const Range = styled.input<{ $pct: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  cursor: pointer;
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    var(--accent) ${({ $pct }) => $pct}%,
    var(--line-strong) ${({ $pct }) => $pct}%,
    var(--line-strong) 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--surface-raised);
    border: 3px solid var(--accent);
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.18);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--surface-raised);
    border: 3px solid var(--accent);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
`;

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  display?: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <Field>
      <Label>
        {label}
        <b>
          {display ?? value}
          {suffix ? ` ${suffix}` : ""}
        </b>
      </Label>
      <Range
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        $pct={Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

/* ----------------------------------------------------------------- utils --- */

const years = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/* ---------------------------------------------------------------- panels --- */

export function CalculatorPanel({ slug }: { slug: CalculatorSlug }) {
  if (slug === "become-a-crorepati") return <Crorepati />;
  if (slug === "sip-step-up") return <StepUp />;
  if (slug === "lumpsum-target") return <Lumpsum />;
  if (slug === "target-amount-sip") return <TargetSip />;
  if (slug === "children-education") return <Education />;
  if (slug === "retirement-planning") return <Retirement />;
  return <SipReturn />;
}

function SipReturn() {
  const [monthly, setMonthly] = useState(25000);
  const [span, setSpan] = useState(15);
  const [rate, setRate] = useState(12);

  const fv = sipFutureValue(monthly, span, rate);
  const invested = sipInvested(monthly, span);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "Invested", token: "--muted", data: xs.map((y) => Math.round(sipInvested(monthly, y))) },
      { name: "Value", token: "--accent", data: xs.map((y) => Math.round(sipFutureValue(monthly, y, rate))) },
    ],
  };

  const stats: Stat[] = [
    { label: "Estimated value", value: formatINR(fv), emphasis: true },
    { label: "Total invested", value: formatINR(invested) },
    { label: "Wealth gained", value: formatINR(Math.max(0, fv - invested)) },
  ];

  return (
    <CalcShell
      title="SIP return"
      stats={stats}
      controls={
        <>
          <Slider label="Monthly SIP" value={monthly} min={500} max={300000} step={500} display={formatINR(monthly)} onChange={setMonthly} />
          <Slider label="Years" value={span} min={1} max={40} step={1} onChange={setSpan} />
          <Slider label="Expected return" value={rate} min={4} max={18} step={0.5} suffix="%" onChange={setRate} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function Crorepati() {
  const [span, setSpan] = useState(18);
  const [rate, setRate] = useState(12);
  const [existing, setExisting] = useState(0);

  const target = 1_00_00_000;
  const futureExisting = existing * Math.pow(1 + rate / 100, span);
  const gap = Math.max(0, target - futureExisting);
  const sip = sipRequired(gap, span, rate);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      {
        name: "Projected corpus",
        token: "--accent",
        data: xs.map((y) =>
          Math.round(existing * Math.pow(1 + rate / 100, y) + sipFutureValue(sip, y, rate)),
        ),
      },
      { name: "Invested", token: "--muted", data: xs.map((y) => Math.round(existing + sipInvested(sip, y))) },
    ],
  };

  return (
    <CalcShell
      title="Become a crorepati"
      stats={[
        { label: "Monthly SIP for ₹1 Cr", value: formatINR(sip), emphasis: true },
        { label: "Goal", value: "₹1.00 Cr" },
        { label: "Existing corpus grows to", value: formatINR(futureExisting) },
      ]}
      controls={
        <>
          <Slider label="Years to the goal" value={span} min={5} max={40} step={1} onChange={setSpan} />
          <Slider label="Expected return" value={rate} min={8} max={16} step={0.5} suffix="%" onChange={setRate} />
          <Slider label="Existing corpus" value={existing} min={0} max={8000000} step={50000} display={formatINR(existing)} onChange={setExisting} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function StepUp() {
  const [monthly, setMonthly] = useState(20000);
  const [span, setSpan] = useState(15);
  const [rate, setRate] = useState(12);
  const [step, setStep] = useState(10);

  const fv = stepUpSipFutureValue(monthly, span, rate, step);
  const flat = sipFutureValue(monthly, span, rate);
  const invested = stepUpSipInvested(monthly, span, step);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "With step-up", token: "--accent", data: xs.map((y) => Math.round(stepUpSipFutureValue(monthly, y, rate, step))) },
      { name: "Without step-up", token: "--muted", data: xs.map((y) => Math.round(sipFutureValue(monthly, y, rate))) },
    ],
  };

  return (
    <CalcShell
      title="SIP step-up"
      stats={[
        { label: "With step-up", value: formatINR(fv), emphasis: true },
        { label: "Without step-up", value: formatINR(flat) },
        { label: "Amount invested", value: formatINR(invested) },
      ]}
      controls={
        <>
          <Slider label="Starting monthly SIP" value={monthly} min={1000} max={200000} step={1000} display={formatINR(monthly)} onChange={setMonthly} />
          <Slider label="Years" value={span} min={3} max={35} step={1} onChange={setSpan} />
          <Slider label="Annual step-up" value={step} min={0} max={20} step={1} suffix="%" onChange={setStep} />
          <Slider label="Expected return" value={rate} min={8} max={16} step={0.5} suffix="%" onChange={setRate} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function Lumpsum() {
  const [target, setTarget] = useState(5000000);
  const [span, setSpan] = useState(10);
  const [rate, setRate] = useState(11);

  const needed = lumpsumRequired(target, span, rate);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "Projected value", token: "--accent", data: xs.map((y) => Math.round(needed * Math.pow(1 + rate / 100, y))) },
    ],
  };

  return (
    <CalcShell
      title="Lumpsum target"
      stats={[
        { label: "Invest today", value: formatINR(needed), emphasis: true },
        { label: "Target amount", value: formatINR(target) },
        { label: "Growth", value: formatINR(Math.max(0, target - needed)) },
      ]}
      controls={
        <>
          <Slider label="Target amount" value={target} min={100000} max={50000000} step={100000} display={formatINR(target)} onChange={setTarget} />
          <Slider label="Years" value={span} min={1} max={30} step={1} onChange={setSpan} />
          <Slider label="Expected return" value={rate} min={6} max={16} step={0.5} suffix="%" onChange={setRate} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function TargetSip() {
  const [target, setTarget] = useState(10000000);
  const [span, setSpan] = useState(12);
  const [rate, setRate] = useState(12);

  const sip = sipRequired(target, span, rate);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "Value", token: "--accent", data: xs.map((y) => Math.round(sipFutureValue(sip, y, rate))) },
      { name: "Invested", token: "--muted", data: xs.map((y) => Math.round(sipInvested(sip, y))) },
    ],
  };

  return (
    <CalcShell
      title="Target amount SIP"
      stats={[
        { label: "Required monthly SIP", value: formatINR(sip), emphasis: true },
        { label: "Target corpus", value: formatINR(target) },
        { label: "Total invested", value: formatINR(sipInvested(sip, span)) },
      ]}
      controls={
        <>
          <Slider label="Target corpus" value={target} min={500000} max={100000000} step={100000} display={formatINR(target)} onChange={setTarget} />
          <Slider label="Years" value={span} min={2} max={40} step={1} onChange={setSpan} />
          <Slider label="Expected return" value={rate} min={6} max={16} step={0.5} suffix="%" onChange={setRate} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function Education() {
  const [cost, setCost] = useState(2500000);
  const [span, setSpan] = useState(12);
  const [inflation, setInflation] = useState(8);
  const [rate, setRate] = useState(12);

  const future = futureCost(cost, span, inflation);
  const sip = sipRequired(future, span, rate);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "Course cost", token: "--muted", data: xs.map((y) => Math.round(futureCost(cost, y, inflation))) },
      { name: "Your corpus", token: "--accent", data: xs.map((y) => Math.round(sipFutureValue(sip, y, rate))) },
    ],
  };

  return (
    <CalcShell
      title="Children's education"
      stats={[
        { label: "Monthly SIP", value: formatINR(sip), emphasis: true },
        { label: "Future cost", value: formatINR(future) },
        { label: "Cost today", value: formatINR(cost) },
      ]}
      controls={
        <>
          <Slider label="Today's education cost" value={cost} min={200000} max={15000000} step={50000} display={formatINR(cost)} onChange={setCost} />
          <Slider label="Years until the goal" value={span} min={1} max={25} step={1} onChange={setSpan} />
          <Slider label="Education inflation" value={inflation} min={4} max={12} step={0.5} suffix="%" onChange={setInflation} />
          <Slider label="Expected return" value={rate} min={8} max={16} step={0.5} suffix="%" onChange={setRate} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

function Retirement() {
  const [expense, setExpense] = useState(80000);
  const [toRetire, setToRetire] = useState(20);
  const [inRetire, setInRetire] = useState(25);
  const [inflation, setInflation] = useState(6);
  const [pre, setPre] = useState(12);
  const [post, setPost] = useState(8);

  const result = useMemo(
    () =>
      retirementCorpus({
        monthlyExpense: expense,
        yearsToRetire: toRetire,
        yearsInRetirement: inRetire,
        inflation,
        preReturn: pre,
        postReturn: post,
      }),
    [expense, toRetire, inRetire, inflation, pre, post],
  );

  const { sip: retirementSip, corpus } = result;

  const xs = years(toRetire);
  const chart = {
    categories: xs,
    series: [
      { name: "Corpus", token: "--accent", data: xs.map((y) => Math.round(sipFutureValue(retirementSip, y, pre))) },
      { name: "Invested", token: "--muted", data: xs.map((y) => Math.round(sipInvested(retirementSip, y))) },
    ],
  };

  return (
    <CalcShell
      title="Retirement planning"
      stats={[
        { label: "Suggested SIP", value: formatINR(retirementSip), emphasis: true },
        { label: "Corpus needed", value: formatINR(corpus) },
        { label: "Monthly expenses today", value: formatINR(expense) },
      ]}
      controls={
        <>
          <Slider label="Monthly expenses today" value={expense} min={20000} max={500000} step={5000} display={formatINR(expense)} onChange={setExpense} />
          <Slider label="Years to retirement" value={toRetire} min={1} max={40} step={1} onChange={setToRetire} />
          <Slider label="Years in retirement" value={inRetire} min={10} max={40} step={1} onChange={setInRetire} />
          <Slider label="Inflation" value={inflation} min={3} max={10} step={0.5} suffix="%" onChange={setInflation} />
          <Slider label="Return before retirement" value={pre} min={6} max={16} step={0.5} suffix="%" onChange={setPre} />
          <Slider label="Return after retirement" value={post} min={4} max={10} step={0.5} suffix="%" onChange={setPost} />
        </>
      }
      chart={<CalcChart categories={chart.categories} series={chart.series} xLabel="Year" />}
    />
  );
}

/* -------------------------------------------------- compact home version --- */

export function SipWidget() {
  const [monthly, setMonthly] = useState(25000);
  const [span, setSpan] = useState(15);
  const [rate, setRate] = useState(12);

  const fv = sipFutureValue(monthly, span, rate);
  const invested = sipInvested(monthly, span);

  const xs = years(span);
  const chart = {
    categories: xs,
    series: [
      { name: "Invested", token: "--muted", data: xs.map((y) => Math.round(sipInvested(monthly, y))) },
      { name: "Value", token: "--accent", data: xs.map((y) => Math.round(sipFutureValue(monthly, y, rate))) },
    ],
  };

  return (
    <div>
      <CalcShell
        title="SIP calculator"
        stats={[
          { label: "Estimated value", value: formatINR(fv), emphasis: true },
          { label: "Total invested", value: formatINR(invested) },
        ]}
        controls={
          <>
            <Slider label="Monthly SIP" value={monthly} min={500} max={200000} step={500} display={formatINR(monthly)} onChange={setMonthly} />
            <Slider label="Years" value={span} min={1} max={35} step={1} onChange={setSpan} />
            <Slider label="Expected return" value={rate} min={6} max={16} step={0.5} suffix="%" onChange={setRate} />
          </>
        }
        chart={
          <CalcChart categories={chart.categories} series={chart.series} xLabel="Year" height={240} />
        }
      />
      <ButtonLink href="/calculators" $variant="navy" style={{ marginTop: 16 }}>
        All calculators
      </ButtonLink>
    </div>
  );
}
