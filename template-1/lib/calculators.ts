export function sipFutureValue(
  monthly: number,
  years: number,
  annualRate: number,
) {
  const r = annualRate / 12 / 100;
  const n = Math.max(0, years) * 12;
  if (monthly <= 0 || n === 0) return 0;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

export function sipInvested(monthly: number, years: number) {
  return monthly * Math.max(0, years) * 12;
}

export function sipRequired(target: number, years: number, annualRate: number) {
  const r = annualRate / 12 / 100;
  const n = Math.max(0, years) * 12;
  if (target <= 0 || n === 0) return 0;
  if (r === 0) return target / n;
  return target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

export function lumpsumFutureValue(
  principal: number,
  years: number,
  annualRate: number,
) {
  if (principal <= 0 || years <= 0) return 0;
  return principal * Math.pow(1 + annualRate / 100, years);
}

export function lumpsumRequired(
  target: number,
  years: number,
  annualRate: number,
) {
  if (target <= 0 || years <= 0) return 0;
  return target / Math.pow(1 + annualRate / 100, years);
}

export function stepUpSipFutureValue(
  monthly: number,
  years: number,
  annualRate: number,
  stepUpPercent: number,
) {
  if (monthly <= 0 || years <= 0) return 0;
  const r = annualRate / 12 / 100;
  let fv = 0;
  let pmt = monthly;
  const totalMonths = years * 12;

  for (let month = 0; month < totalMonths; month++) {
    if (month > 0 && month % 12 === 0) {
      pmt *= 1 + stepUpPercent / 100;
    }
    const monthsLeft = totalMonths - month;
    fv += pmt * Math.pow(1 + r, monthsLeft);
  }

  return fv;
}

export function stepUpSipInvested(
  monthly: number,
  years: number,
  stepUpPercent: number,
) {
  if (monthly <= 0 || years <= 0) return 0;
  let invested = 0;
  let pmt = monthly;
  for (let y = 0; y < years; y++) {
    invested += pmt * 12;
    pmt *= 1 + stepUpPercent / 100;
  }
  return invested;
}

export function futureCost(present: number, years: number, inflation: number) {
  if (present <= 0 || years < 0) return 0;
  return present * Math.pow(1 + inflation / 100, years);
}

export function retirementCorpus(options: {
  monthlyExpense: number;
  yearsToRetire: number;
  yearsInRetirement: number;
  inflation: number;
  preReturn: number;
  postReturn: number;
}) {
  const annualAtRetirement =
    options.monthlyExpense *
    12 *
    Math.pow(1 + options.inflation / 100, options.yearsToRetire);

  const r = options.postReturn / 100;
  const i = options.inflation / 100;
  const n = options.yearsInRetirement;

  let corpus = 0;
  if (n <= 0) corpus = 0;
  else if (Math.abs(r - i) < 0.0001) corpus = annualAtRetirement * n;
  else
    corpus =
      (annualAtRetirement * (1 - Math.pow((1 + i) / (1 + r), n))) / (r - i);

  const existingNotUsed = 0;
  const sip = sipRequired(
    Math.max(0, corpus - existingNotUsed),
    options.yearsToRetire,
    options.preReturn,
  );

  return {
    annualAtRetirement,
    corpus,
    sip,
  };
}

export const calculatorMeta = [
  {
    slug: "trailing-returns",
    short: "Trailing Returns",
    title: "Trailing Returns",
    eyebrow: "MF research",
    group: "research" as const,
    summary:
      "Compare category trailing returns across Regular plans.",
  },
  {
    slug: "mf-sip-returns",
    short: "MF SIP Returns",
    title: "MF SIP Returns",
    eyebrow: "MF research",
    group: "research" as const,
    summary:
      "See how a monthly SIP in a category would have performed over a chosen period.",
  },
  {
    slug: "mf-lumpsum-returns",
    short: "MF Lumpsum Returns",
    title: "MF Lumpsum Returns",
    eyebrow: "MF research",
    group: "research" as const,
    summary:
      "Top-performing lumpsum outcomes by category, period, and investment amount.",
  },
  {
    slug: "swp-return-calculator",
    short: "SWP Returns",
    title: "SWP Return Calculator",
    eyebrow: "MF research",
    group: "research" as const,
    summary:
      "Historical SWP results for a chosen AMC scheme, withdrawal day, and period.",
  },
  {
    slug: "sip-calculator",
    short: "SIP",
    title: "SIP Calculator",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Estimate maturity value for a fixed monthly SIP at an assumed return rate.",
  },
  {
    slug: "lumpsum-calculator",
    short: "Lumpsum",
    title: "Lumpsum Calculator",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Project what a one-time investment could grow to over the years you choose.",
  },
  {
    slug: "child-education-planner",
    short: "Education",
    title: "Child Education Planner",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Inflate today's education cost and see the monthly savings that could fund it.",
  },
  {
    slug: "retirement-planner",
    short: "Retirement",
    title: "Retirement Planner",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Work out the corpus and SIP needed to fund inflated retirement expenses.",
  },
  {
    slug: "goal-setting-calculator",
    short: "Goal Setting",
    title: "Goal Setting Calculator",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Turn a future dream amount into a monthly savings target after inflation.",
  },
  {
    slug: "swp-calculator",
    short: "SWP",
    title: "SWP Calculator",
    eyebrow: "Calculator",
    group: "calculator" as const,
    summary:
      "Model systematic withdrawals from a corpus at an assumed return rate.",
  },
] as const;

export type CalculatorSlug = (typeof calculatorMeta)[number]["slug"];
export type ToolGroup = (typeof calculatorMeta)[number]["group"];

export const researchMeta = calculatorMeta.filter((item) => item.group === "research");
export const calculatorToolsMeta = calculatorMeta.filter((item) => item.group === "calculator");

export function toolsForGroup(group: ToolGroup) {
  return calculatorMeta.filter((item) => item.group === group);
}

/** Display order of the two divisions on the Tools page. */
export const toolGroups: { id: ToolGroup; label: string; note: string }[] = [
  { id: "calculator", label: "Calculators", note: "Plan the numbers" },
  { id: "research", label: "Research", note: "Compare funds" },
];

/** Every tool lives on the single Tools page; the slug is the hash. */
export function pathForTool(_slug: CalculatorSlug): "/tools" {
  return "/tools";
}

export function groupOf(slug: CalculatorSlug): ToolGroup {
  return calculatorMeta.find((entry) => entry.slug === slug)?.group ?? "calculator";
}

export function isCalculatorSlug(value: string): value is CalculatorSlug {
  return calculatorMeta.some((entry) => entry.slug === value);
}

/** What a future rupee amount is worth in today's money. */
export function realValue(nominal: number, years: number, inflation: number) {
  if (nominal <= 0) return 0;
  return nominal / Math.pow(1 + inflation / 100, Math.max(0, years));
}

/**
 * The SIP needed to close the gap between a target and what a lumpsum already
 * invested today will have grown into by then.
 */
export function sipRequiredAfterLumpsum(
  target: number,
  lumpsum: number,
  years: number,
  annualRate: number,
) {
  const grown = lumpsumFutureValue(lumpsum, years, annualRate);
  return sipRequired(Math.max(0, target - grown), years, annualRate);
}
