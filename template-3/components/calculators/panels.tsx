"use client";

import { useState } from "react";
import {
  futureCost,
  lumpsumFutureValue,
  lumpsumRequired,
  realValue,
  retirementCorpus,
  sipFutureValue,
  sipInvested,
  sipRequired,
  sipRequiredAfterLumpsum,
  stepUpSipFutureValue,
  stepUpSipInvested,
  type CalculatorSlug,
} from "@/lib/calculators";
import { formatCompactINR, formatINR, formatShortINR } from "@/lib/format";
import { CalcShell } from "@/components/calculators/CalcShell";
import {
  ControlStack,
  MoneyField,
  Segmented,
  SelectField,
  SliderField,
  StepperField,
  SwitchField,
} from "@/components/calculators/controls";

/**
 * One panel per calculator. They share the shell and the control vocabulary;
 * what differs is which questions each one asks and in what shape - a target
 * is typed, an age is stepped, a risk appetite is picked from named presets.
 */

/* ------------------------------------------------------------------ shared --- */

/** Series colours for the chart, which sits on the light half of the panel. */
const LINE = {
  value: "--accent-strong",
  invested: "--brand-soft",
  target: "--positive",
} as const;

/** Split-bar colours, which sit on the dark half. */
const FILL = {
  gain: "--accent",
  invested: "--on-brand-mute",
  existing: "--positive",
} as const;

const spanOf = (n: number) => Array.from({ length: Math.max(1, n) }, (_, i) => i + 1);

const RETURN_PRESETS = [
  { value: 9, label: "Cautious", note: "9%" },
  { value: 12, label: "Balanced", note: "12%" },
  { value: 15, label: "Growth", note: "15%" },
];

/** Risk-appetite presets plus a slider, because the two are the same number. */
function ReturnField({
  value,
  onChange,
  min = 6,
  max = 18,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <>
      <Segmented label="Return assumption" options={RETURN_PRESETS} value={value} onChange={onChange} />
      <SliderField
        label="Expected annual return"
        value={value}
        min={min}
        max={max}
        step={0.5}
        suffix="%"
        onChange={onChange}
      />
    </>
  );
}

const yearsWord = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;

/* ------------------------------------------------------------- SIP return --- */

const SIP_RETURN_DEFAULTS = { monthly: 25000, span: 15, rate: 12, real: false, inflation: 6 };

function SipReturn() {
  const [monthly, setMonthly] = useState(SIP_RETURN_DEFAULTS.monthly);
  const [span, setSpan] = useState(SIP_RETURN_DEFAULTS.span);
  const [rate, setRate] = useState(SIP_RETURN_DEFAULTS.rate);
  const [real, setReal] = useState(SIP_RETURN_DEFAULTS.real);
  const [inflation, setInflation] = useState(SIP_RETURN_DEFAULTS.inflation);

  const value = sipFutureValue(monthly, span, rate);
  const invested = sipInvested(monthly, span);
  const gain = Math.max(0, value - invested);
  const todaysMoney = realValue(value, span, inflation);

  const xs = spanOf(span);
  const series = [
    {
      name: "Value",
      token: LINE.value,
      data: xs.map((y) => Math.round(sipFutureValue(monthly, y, rate))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(sipInvested(monthly, y))),
    },
  ];
  if (real) {
    series.push({
      name: "In today's money",
      token: LINE.target,
      data: xs.map((y) => Math.round(realValue(sipFutureValue(monthly, y, rate), y, inflation))),
    });
  }

  return (
    <CalcShell
      headline={{
        label: `Estimated value after ${yearsWord(span)}`,
        value,
        caption: `${formatINR(monthly)} a month, compounding at ${rate}% a year.`,
      }}
      stats={[
        { label: "Total invested", value: formatINR(invested) },
        { label: "Wealth gained", value: formatINR(gain) },
        { label: "Growth multiple", value: `${(invested ? value / invested : 0).toFixed(2)}x` },
        ...(real ? [{ label: "Worth in today's money", value: formatINR(todaysMoney) }] : []),
      ]}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        { label: "Market growth", value: gain, token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      onReset={() => {
        setMonthly(SIP_RETURN_DEFAULTS.monthly);
        setSpan(SIP_RETURN_DEFAULTS.span);
        setRate(SIP_RETURN_DEFAULTS.rate);
        setReal(SIP_RETURN_DEFAULTS.real);
        setInflation(SIP_RETURN_DEFAULTS.inflation);
      }}
      controls={
        <ControlStack>
          <MoneyField
            label="Monthly SIP"
            value={monthly}
            min={500}
            max={500000}
            step={500}
            presets={[5000, 10000, 25000, 50000, 100000]}
            words={formatShortINR}
            onChange={setMonthly}
          />
          <StepperField
            label="How long will you invest"
            value={span}
            min={1}
            max={40}
            unit="years"
            onChange={setSpan}
          />
          <ReturnField value={rate} onChange={setRate} />
          <SwitchField
            label="Show it in today's money"
            note="Discount the result by inflation to see what it actually buys."
            on={real}
            onChange={setReal}
          >
            <SliderField
              label="Assumed inflation"
              value={inflation}
              min={2}
              max={12}
              step={0.5}
              suffix="%"
              onChange={setInflation}
            />
          </SwitchField>
        </ControlStack>
      }
    />
  );
}

/* -------------------------------------------------------------- crorepati --- */

const CROREPATI_DEFAULTS = {
  target: 1_00_00_000,
  currentAge: 30,
  goalAge: 48,
  rate: 12,
  existing: 0,
};

function Crorepati() {
  const [target, setTarget] = useState(CROREPATI_DEFAULTS.target);
  const [currentAge, setCurrentAge] = useState(CROREPATI_DEFAULTS.currentAge);
  const [goalAge, setGoalAge] = useState(CROREPATI_DEFAULTS.goalAge);
  const [rate, setRate] = useState(CROREPATI_DEFAULTS.rate);
  const [existing, setExisting] = useState(CROREPATI_DEFAULTS.existing);

  const span = Math.max(1, goalAge - currentAge);
  const sip = sipRequiredAfterLumpsum(target, existing, span, rate);
  const grownExisting = lumpsumFutureValue(existing, span, rate);
  const invested = existing + sipInvested(sip, span);

  const xs = spanOf(span);
  const series = [
    {
      name: "Projected corpus",
      token: LINE.value,
      data: xs.map((y) =>
        Math.round(lumpsumFutureValue(existing, y, rate) + sipFutureValue(sip, y, rate)),
      ),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(existing + sipInvested(sip, y))),
    },
    { name: "Target", token: LINE.target, data: xs.map(() => Math.round(target)) },
  ];

  return (
    <CalcShell
      headline={{
        label: `Monthly SIP to reach ${formatShortINR(target)}`,
        value: sip,
        caption: `Starting at ${currentAge} and getting there by ${goalAge} - that is ${yearsWord(span)} of investing.`,
      }}
      stats={[
        { label: "Time you have", value: yearsWord(span) },
        { label: "What you already hold grows to", value: formatINR(grownExisting) },
        { label: "Total you will invest", value: formatINR(invested) },
        { label: "Market growth", value: formatINR(Math.max(0, target - invested)) },
      ]}
      split={[
        { label: "Existing corpus", value: existing, token: FILL.existing },
        { label: "Fresh SIP investment", value: sipInvested(sip, span), token: FILL.invested },
        { label: "Market growth", value: Math.max(0, target - invested), token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      onReset={() => {
        setTarget(CROREPATI_DEFAULTS.target);
        setCurrentAge(CROREPATI_DEFAULTS.currentAge);
        setGoalAge(CROREPATI_DEFAULTS.goalAge);
        setRate(CROREPATI_DEFAULTS.rate);
        setExisting(CROREPATI_DEFAULTS.existing);
      }}
      controls={
        <ControlStack>
          <Segmented
            label="How big is the goal"
            value={target}
            options={[
              { value: 1_00_00_000, label: "1 Cr" },
              { value: 2_50_00_000, label: "2.5 Cr" },
              { value: 5_00_00_000, label: "5 Cr" },
            ]}
            onChange={setTarget}
          />
          <MoneyField
            label="Or set your own number"
            value={target}
            min={10_00_000}
            max={50_00_00_000}
            step={5_00_000}
            words={formatShortINR}
            onChange={setTarget}
          />
          <StepperField
            label="Your age today"
            value={currentAge}
            min={18}
            max={68}
            unit="years"
            onChange={(next) => {
              setCurrentAge(next);
              if (goalAge <= next) setGoalAge(next + 1);
            }}
          />
          <StepperField
            label="Age you want it by"
            value={goalAge}
            min={currentAge + 1}
            max={75}
            unit="years"
            onChange={setGoalAge}
            hint={`${yearsWord(span)} of compounding.`}
          />
          <ReturnField value={rate} onChange={setRate} min={8} max={16} />
          <MoneyField
            label="Already invested towards this"
            value={existing}
            min={0}
            max={2_00_00_000}
            step={50000}
            presets={[0, 5_00_000, 25_00_000, 50_00_000]}
            words={formatShortINR}
            onChange={setExisting}
          />
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------------- retirement --- */

const RETIREMENT_DEFAULTS = {
  lifestyle: "comfortable",
  expense: 80000,
  currentAge: 32,
  retireAge: 60,
  lifeExpectancy: 85,
  inflation: 6,
  pre: 12,
  post: 8,
  existing: 0,
};

const lifestyles = [
  { value: "modest", label: "Modest - ₹45,000 a month", expense: 45000 },
  { value: "comfortable", label: "Comfortable - ₹80,000 a month", expense: 80000 },
  { value: "premium", label: "Premium - ₹1,50,000 a month", expense: 150000 },
  { value: "custom", label: "Something else", expense: null },
];

function Retirement() {
  const [lifestyle, setLifestyle] = useState(RETIREMENT_DEFAULTS.lifestyle);
  const [expense, setExpense] = useState(RETIREMENT_DEFAULTS.expense);
  const [currentAge, setCurrentAge] = useState(RETIREMENT_DEFAULTS.currentAge);
  const [retireAge, setRetireAge] = useState(RETIREMENT_DEFAULTS.retireAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(RETIREMENT_DEFAULTS.lifeExpectancy);
  const [inflation, setInflation] = useState(RETIREMENT_DEFAULTS.inflation);
  const [pre, setPre] = useState(RETIREMENT_DEFAULTS.pre);
  const [post, setPost] = useState(RETIREMENT_DEFAULTS.post);
  const [existing, setExisting] = useState(RETIREMENT_DEFAULTS.existing);

  const toRetire = Math.max(1, retireAge - currentAge);
  const inRetirement = Math.max(1, lifeExpectancy - retireAge);

  const { corpus, annualAtRetirement } = retirementCorpus({
    monthlyExpense: expense,
    yearsToRetire: toRetire,
    yearsInRetirement: inRetirement,
    inflation,
    preReturn: pre,
    postReturn: post,
  });

  const sip = sipRequiredAfterLumpsum(corpus, existing, toRetire, pre);
  const sipTotal = sipInvested(sip, toRetire);
  const growth = Math.max(0, corpus - sipTotal - existing);

  const xs = spanOf(toRetire);
  const series = [
    {
      name: "Retirement corpus",
      token: LINE.value,
      data: xs.map((y) =>
        Math.round(lumpsumFutureValue(existing, y, pre) + sipFutureValue(sip, y, pre)),
      ),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(existing + sipInvested(sip, y))),
    },
    { name: "Corpus needed", token: LINE.target, data: xs.map(() => Math.round(corpus)) },
  ];

  return (
    <CalcShell
      headline={{
        label: "Monthly SIP to fund your retirement",
        value: sip,
        caption: `Enough to draw an inflation-linked income from age ${retireAge} to ${lifeExpectancy}.`,
      }}
      stats={[
        { label: "Corpus needed at retirement", value: formatINR(corpus) },
        { label: "First year of spending, then", value: formatINR(annualAtRetirement) },
        { label: "Years left to build it", value: yearsWord(toRetire) },
        { label: "Years it has to last", value: yearsWord(inRetirement) },
      ]}
      split={[
        { label: "Existing savings", value: existing, token: FILL.existing },
        { label: "Fresh SIP investment", value: sipTotal, token: FILL.invested },
        { label: "Market growth", value: growth, token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      footnote="Retirement spending is assumed to rise with inflation every year."
      onReset={() => {
        setLifestyle(RETIREMENT_DEFAULTS.lifestyle);
        setExpense(RETIREMENT_DEFAULTS.expense);
        setCurrentAge(RETIREMENT_DEFAULTS.currentAge);
        setRetireAge(RETIREMENT_DEFAULTS.retireAge);
        setLifeExpectancy(RETIREMENT_DEFAULTS.lifeExpectancy);
        setInflation(RETIREMENT_DEFAULTS.inflation);
        setPre(RETIREMENT_DEFAULTS.pre);
        setPost(RETIREMENT_DEFAULTS.post);
        setExisting(RETIREMENT_DEFAULTS.existing);
      }}
      controls={
        <ControlStack>
          <SelectField
            label="Retirement lifestyle"
            value={lifestyle}
            options={lifestyles.map(({ value, label }) => ({ value, label }))}
            onChange={(next) => {
              setLifestyle(next);
              const preset = lifestyles.find((item) => item.value === next)?.expense;
              if (preset) setExpense(preset);
            }}
          />
          <MoneyField
            label="What you spend a month today"
            value={expense}
            min={10000}
            max={10_00_000}
            step={5000}
            words={formatShortINR}
            hint="In today's rupees. We inflate it to your retirement date for you."
            onChange={(next) => {
              setExpense(next);
              setLifestyle("custom");
            }}
          />
          <StepperField
            label="Your age today"
            value={currentAge}
            min={18}
            max={69}
            unit="years"
            onChange={(next) => {
              setCurrentAge(next);
              if (retireAge <= next) setRetireAge(next + 1);
            }}
          />
          <StepperField
            label="Age you want to retire"
            value={retireAge}
            min={currentAge + 1}
            max={75}
            unit="years"
            onChange={(next) => {
              setRetireAge(next);
              if (lifeExpectancy <= next) setLifeExpectancy(next + 1);
            }}
          />
          <StepperField
            label="Plan your income until"
            value={lifeExpectancy}
            min={retireAge + 1}
            max={100}
            unit="years old"
            onChange={setLifeExpectancy}
            hint={`${yearsWord(inRetirement)} of retired life to fund.`}
          />
          <MoneyField
            label="Already saved for retirement"
            value={existing}
            min={0}
            max={10_00_00_000}
            step={1_00_000}
            presets={[0, 10_00_000, 50_00_000, 1_00_00_000]}
            words={formatShortINR}
            onChange={setExisting}
          />
          <SliderField
            label="Inflation"
            value={inflation}
            min={3}
            max={10}
            step={0.5}
            suffix="%"
            onChange={setInflation}
          />
          <SliderField
            label="Return before retirement"
            value={pre}
            min={6}
            max={16}
            step={0.5}
            suffix="%"
            onChange={setPre}
          />
          <SliderField
            label="Return after retirement"
            value={post}
            min={4}
            max={12}
            step={0.5}
            suffix="%"
            onChange={setPost}
            hint="Portfolios usually get more conservative once the salary stops."
          />
        </ControlStack>
      }
    />
  );
}

/* ---------------------------------------------------------------- step-up --- */

const STEP_UP_DEFAULTS = { monthly: 20000, span: 15, rate: 12, step: 10 };

function StepUp() {
  const [monthly, setMonthly] = useState(STEP_UP_DEFAULTS.monthly);
  const [span, setSpan] = useState(STEP_UP_DEFAULTS.span);
  const [rate, setRate] = useState(STEP_UP_DEFAULTS.rate);
  const [step, setStep] = useState(STEP_UP_DEFAULTS.step);

  const value = stepUpSipFutureValue(monthly, span, rate, step);
  const flat = sipFutureValue(monthly, span, rate);
  const invested = stepUpSipInvested(monthly, span, step);
  const finalInstalment = monthly * Math.pow(1 + step / 100, Math.max(0, span - 1));

  const xs = spanOf(span);
  const series = [
    {
      name: "With step-up",
      token: LINE.value,
      data: xs.map((y) => Math.round(stepUpSipFutureValue(monthly, y, rate, step))),
    },
    {
      name: "Flat SIP",
      token: LINE.target,
      data: xs.map((y) => Math.round(sipFutureValue(monthly, y, rate))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(stepUpSipInvested(monthly, y, step))),
    },
  ];

  return (
    <CalcShell
      headline={{
        label: `Value after ${yearsWord(span)} with a ${step}% annual step-up`,
        value,
        caption: `A flat SIP of the same starting size ends at ${formatCompactINR(flat)}.`,
      }}
      stats={[
        { label: "Extra from stepping up", value: formatINR(Math.max(0, value - flat)) },
        { label: "Total invested", value: formatINR(invested) },
        { label: "Wealth gained", value: formatINR(Math.max(0, value - invested)) },
        { label: `Instalment in year ${span}`, value: formatINR(finalInstalment) },
      ]}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        { label: "Market growth", value: Math.max(0, value - invested), token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      footnote="The instalment rises once a year, on the anniversary of the first one."
      onReset={() => {
        setMonthly(STEP_UP_DEFAULTS.monthly);
        setSpan(STEP_UP_DEFAULTS.span);
        setRate(STEP_UP_DEFAULTS.rate);
        setStep(STEP_UP_DEFAULTS.step);
      }}
      controls={
        <ControlStack>
          <MoneyField
            label="Starting monthly SIP"
            value={monthly}
            min={1000}
            max={300000}
            step={1000}
            presets={[5000, 10000, 20000, 50000]}
            words={formatShortINR}
            onChange={setMonthly}
          />
          <Segmented
            label="Annual step-up"
            value={step}
            options={[
              { value: 5, label: "Modest", note: "5%" },
              { value: 10, label: "Typical", note: "10%" },
              { value: 15, label: "Ambitious", note: "15%" },
            ]}
            onChange={setStep}
          />
          <SliderField
            label="Step-up each year"
            value={step}
            min={0}
            max={25}
            step={1}
            suffix="%"
            onChange={setStep}
            hint="Roughly the raise you expect to keep, after living costs."
          />
          <StepperField
            label="How long will you invest"
            value={span}
            min={3}
            max={35}
            unit="years"
            onChange={setSpan}
          />
          <ReturnField value={rate} onChange={setRate} min={8} max={16} />
        </ControlStack>
      }
    />
  );
}

/* ---------------------------------------------------------------- lumpsum --- */

const LUMPSUM_DEFAULTS = { target: 50_00_000, span: 10, rate: 11, withSip: false, sip: 10000 };

function Lumpsum() {
  const [target, setTarget] = useState(LUMPSUM_DEFAULTS.target);
  const [span, setSpan] = useState(LUMPSUM_DEFAULTS.span);
  const [rate, setRate] = useState(LUMPSUM_DEFAULTS.rate);
  const [withSip, setWithSip] = useState(LUMPSUM_DEFAULTS.withSip);
  const [sip, setSip] = useState(LUMPSUM_DEFAULTS.sip);

  const monthly = withSip ? sip : 0;
  const fromSip = sipFutureValue(monthly, span, rate);
  const needed = lumpsumRequired(Math.max(0, target - fromSip), span, rate);
  const invested = needed + sipInvested(monthly, span);

  const xs = spanOf(span);
  const series = [
    {
      name: "Projected value",
      token: LINE.value,
      data: xs.map((y) =>
        Math.round(lumpsumFutureValue(needed, y, rate) + sipFutureValue(monthly, y, rate)),
      ),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(needed + sipInvested(monthly, y))),
    },
    { name: "Target", token: LINE.target, data: xs.map(() => Math.round(target)) },
  ];

  return (
    <CalcShell
      headline={{
        label: "Invest this much today",
        value: needed,
        caption: withSip
          ? `Alongside ${formatINR(sip)} a month, this reaches ${formatCompactINR(target)} in ${yearsWord(span)}.`
          : `A single cheque that grows to ${formatCompactINR(target)} in ${yearsWord(span)}.`,
      }}
      stats={[
        { label: "Target amount", value: formatINR(target) },
        ...(withSip
          ? [{ label: "Added through SIP", value: formatINR(sipInvested(monthly, span)) }]
          : []),
        { label: "Total you put in", value: formatINR(invested) },
        { label: "Market growth", value: formatINR(Math.max(0, target - invested)) },
      ]}
      split={[
        { label: "Lumpsum today", value: needed, token: FILL.existing },
        { label: "SIP instalments", value: sipInvested(monthly, span), token: FILL.invested },
        { label: "Market growth", value: Math.max(0, target - invested), token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      onReset={() => {
        setTarget(LUMPSUM_DEFAULTS.target);
        setSpan(LUMPSUM_DEFAULTS.span);
        setRate(LUMPSUM_DEFAULTS.rate);
        setWithSip(LUMPSUM_DEFAULTS.withSip);
        setSip(LUMPSUM_DEFAULTS.sip);
      }}
      controls={
        <ControlStack>
          <MoneyField
            label="What you want to end up with"
            value={target}
            min={1_00_000}
            max={10_00_00_000}
            step={1_00_000}
            presets={[10_00_000, 50_00_000, 1_00_00_000, 5_00_00_000]}
            words={formatShortINR}
            onChange={setTarget}
          />
          <StepperField
            label="How long can it stay invested"
            value={span}
            min={1}
            max={30}
            unit="years"
            onChange={setSpan}
          />
          <ReturnField value={rate} onChange={setRate} />
          <SwitchField
            label="Add a monthly SIP alongside"
            note="A running SIP cuts the cheque you need to write today."
            on={withSip}
            onChange={setWithSip}
          >
            <MoneyField
              label="Monthly SIP"
              value={sip}
              min={500}
              max={200000}
              step={500}
              presets={[5000, 10000, 25000, 50000]}
              words={formatShortINR}
              onChange={setSip}
            />
          </SwitchField>
        </ControlStack>
      }
    />
  );
}

/* -------------------------------------------------------------- education --- */

const EDUCATION_DEFAULTS = {
  course: "engineering",
  cost: 15_00_000,
  childAge: 5,
  admitAge: 18,
  inflation: 8,
  rate: 12,
  existing: 0,
};

const courses = [
  { value: "engineering", label: "Engineering in India - ₹15 L", cost: 15_00_000 },
  { value: "medicine", label: "Medicine in India - ₹60 L", cost: 60_00_000 },
  { value: "mba", label: "MBA in India - ₹25 L", cost: 25_00_000 },
  { value: "ug-abroad", label: "Undergraduate abroad - ₹1.2 Cr", cost: 1_20_00_000 },
  { value: "pg-abroad", label: "Masters abroad - ₹80 L", cost: 80_00_000 },
  { value: "custom", label: "Something else", cost: null },
];

function Education() {
  const [course, setCourse] = useState(EDUCATION_DEFAULTS.course);
  const [cost, setCost] = useState(EDUCATION_DEFAULTS.cost);
  const [childAge, setChildAge] = useState(EDUCATION_DEFAULTS.childAge);
  const [admitAge, setAdmitAge] = useState(EDUCATION_DEFAULTS.admitAge);
  const [inflation, setInflation] = useState(EDUCATION_DEFAULTS.inflation);
  const [rate, setRate] = useState(EDUCATION_DEFAULTS.rate);
  const [existing, setExisting] = useState(EDUCATION_DEFAULTS.existing);

  const span = Math.max(1, admitAge - childAge);
  const future = futureCost(cost, span, inflation);
  const sip = sipRequiredAfterLumpsum(future, existing, span, rate);
  const invested = existing + sipInvested(sip, span);

  const xs = spanOf(span);
  const series = [
    {
      name: "Your corpus",
      token: LINE.value,
      data: xs.map((y) =>
        Math.round(lumpsumFutureValue(existing, y, rate) + sipFutureValue(sip, y, rate)),
      ),
    },
    {
      name: "Course cost",
      token: LINE.target,
      data: xs.map((y) => Math.round(futureCost(cost, y, inflation))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(existing + sipInvested(sip, y))),
    },
  ];

  return (
    <CalcShell
      headline={{
        label: "Monthly SIP for this education goal",
        value: sip,
        caption: `Your child is ${childAge}; the fees fall due at ${admitAge}, ${yearsWord(span)} from now.`,
      }}
      stats={[
        { label: "Cost today", value: formatINR(cost) },
        { label: `Cost in ${yearsWord(span)}`, value: formatINR(future) },
        { label: "Fee inflation adds", value: formatINR(Math.max(0, future - cost)) },
        { label: "Total you will invest", value: formatINR(invested) },
      ]}
      split={[
        { label: "Already saved", value: existing, token: FILL.existing },
        { label: "Fresh SIP investment", value: sipInvested(sip, span), token: FILL.invested },
        { label: "Market growth", value: Math.max(0, future - invested), token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      footnote="Education costs have historically outrun general inflation, which is why the default here is higher."
      onReset={() => {
        setCourse(EDUCATION_DEFAULTS.course);
        setCost(EDUCATION_DEFAULTS.cost);
        setChildAge(EDUCATION_DEFAULTS.childAge);
        setAdmitAge(EDUCATION_DEFAULTS.admitAge);
        setInflation(EDUCATION_DEFAULTS.inflation);
        setRate(EDUCATION_DEFAULTS.rate);
        setExisting(EDUCATION_DEFAULTS.existing);
      }}
      controls={
        <ControlStack>
          <SelectField
            label="What are you planning for"
            value={course}
            options={courses.map(({ value, label }) => ({ value, label }))}
            onChange={(next) => {
              setCourse(next);
              const preset = courses.find((item) => item.value === next)?.cost;
              if (preset) setCost(preset);
            }}
          />
          <MoneyField
            label="What that costs today"
            value={cost}
            min={1_00_000}
            max={5_00_00_000}
            step={1_00_000}
            words={formatShortINR}
            onChange={(next) => {
              setCost(next);
              setCourse("custom");
            }}
          />
          <StepperField
            label="Your child's age now"
            value={childAge}
            min={0}
            max={24}
            unit="years"
            onChange={(next) => {
              setChildAge(next);
              if (admitAge <= next) setAdmitAge(next + 1);
            }}
          />
          <StepperField
            label="Age when the fees start"
            value={admitAge}
            min={childAge + 1}
            max={30}
            unit="years"
            onChange={setAdmitAge}
            hint={`${yearsWord(span)} to prepare.`}
          />
          <SliderField
            label="Education cost inflation"
            value={inflation}
            min={4}
            max={14}
            step={0.5}
            suffix="%"
            onChange={setInflation}
          />
          <ReturnField value={rate} onChange={setRate} min={8} max={16} />
          <MoneyField
            label="Already earmarked for this"
            value={existing}
            min={0}
            max={2_00_00_000}
            step={50000}
            presets={[0, 2_00_000, 10_00_000, 25_00_000]}
            words={formatShortINR}
            onChange={setExisting}
          />
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------------- target SIP --- */

const TARGET_SIP_DEFAULTS = { target: 1_00_00_000, span: 12, rate: 12, basis: "future", inflation: 6 };

function TargetSip() {
  const [target, setTarget] = useState(TARGET_SIP_DEFAULTS.target);
  const [span, setSpan] = useState(TARGET_SIP_DEFAULTS.span);
  const [rate, setRate] = useState(TARGET_SIP_DEFAULTS.rate);
  const [basis, setBasis] = useState(TARGET_SIP_DEFAULTS.basis);
  const [inflation, setInflation] = useState(TARGET_SIP_DEFAULTS.inflation);

  const inTodaysMoney = basis === "today";
  const effectiveTarget = inTodaysMoney ? futureCost(target, span, inflation) : target;
  const sip = sipRequired(effectiveTarget, span, rate);
  const invested = sipInvested(sip, span);

  const xs = spanOf(span);
  const series = [
    {
      name: "Value",
      token: LINE.value,
      data: xs.map((y) => Math.round(sipFutureValue(sip, y, rate))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map((y) => Math.round(sipInvested(sip, y))),
    },
    { name: "Target", token: LINE.target, data: xs.map(() => Math.round(effectiveTarget)) },
  ];

  return (
    <CalcShell
      headline={{
        label: "Required monthly SIP",
        value: sip,
        caption: inTodaysMoney
          ? `${formatCompactINR(target)} of today's purchasing power is ${formatCompactINR(effectiveTarget)} in ${yearsWord(span)}.`
          : `To reach ${formatCompactINR(target)} in ${yearsWord(span)} at ${rate}% a year.`,
      }}
      stats={[
        { label: "Corpus you are aiming at", value: formatINR(effectiveTarget) },
        { label: "Total invested", value: formatINR(invested) },
        { label: "Wealth gained", value: formatINR(Math.max(0, effectiveTarget - invested)) },
        { label: "First instalment as a share", value: `${((sip * 12) / Math.max(1, effectiveTarget) * 100).toFixed(1)}% a year` },
      ]}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        {
          label: "Market growth",
          value: Math.max(0, effectiveTarget - invested),
          token: FILL.gain,
        },
      ]}
      categories={xs}
      series={series}
      onReset={() => {
        setTarget(TARGET_SIP_DEFAULTS.target);
        setSpan(TARGET_SIP_DEFAULTS.span);
        setRate(TARGET_SIP_DEFAULTS.rate);
        setBasis(TARGET_SIP_DEFAULTS.basis);
        setInflation(TARGET_SIP_DEFAULTS.inflation);
      }}
      controls={
        <ControlStack>
          <MoneyField
            label="The corpus you want"
            value={target}
            min={5_00_000}
            max={20_00_00_000}
            step={1_00_000}
            presets={[25_00_000, 1_00_00_000, 2_50_00_000, 5_00_00_000]}
            words={formatShortINR}
            onChange={setTarget}
          />
          <Segmented
            label="That number is in"
            value={basis}
            options={[
              { value: "future", label: "Future rupees", note: "as-is" },
              { value: "today", label: "Today's money", note: "inflated" },
            ]}
            onChange={setBasis}
          />
          {inTodaysMoney ? (
            <SliderField
              label="Inflation to apply"
              value={inflation}
              min={2}
              max={12}
              step={0.5}
              suffix="%"
              onChange={setInflation}
            />
          ) : null}
          <StepperField
            label="Years to get there"
            value={span}
            min={2}
            max={40}
            unit="years"
            onChange={setSpan}
          />
          <ReturnField value={rate} onChange={setRate} />
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------------------ index --- */

export function CalculatorPanel({ slug }: { slug: CalculatorSlug }) {
  if (slug === "become-a-crorepati") return <Crorepati />;
  if (slug === "sip-step-up") return <StepUp />;
  if (slug === "lumpsum-target") return <Lumpsum />;
  if (slug === "target-amount-sip") return <TargetSip />;
  if (slug === "children-education") return <Education />;
  if (slug === "retirement-planning") return <Retirement />;
  return <SipReturn />;
}

