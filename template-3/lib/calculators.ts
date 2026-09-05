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
    slug: "become-a-crorepati",
    title: "Become a Crorepati",
    eyebrow: "Goal calculator",
    summary:
      "What monthly SIP it takes to get to Rs. 1 crore by a year you choose.",
  },
  {
    slug: "sip-return",
    title: "SIP Return Calculator",
    eyebrow: "Contribution math",
    summary:
      "Invested amount versus an assumed constant return. A sketch, not a forecast.",
  },
  {
    slug: "retirement-planning",
    title: "Retirement Planning Calculator",
    eyebrow: "Paycheck after work",
    summary:
      "Inflate today's spend, then see the corpus and SIP that would fund it.",
  },
  {
    slug: "sip-step-up",
    title: "SIP Step-Up Calculator",
    eyebrow: "Annual raise",
    summary:
      "What happens if the SIP grows with your salary, not just the market.",
  },
  {
    slug: "lumpsum-target",
    title: "Lumpsum Target Calculator",
    eyebrow: "One cheque",
    summary:
      "Start from the goal and work back to the amount that would have to go in today.",
  },
  {
    slug: "children-education",
    title: "Children Education Planner",
    eyebrow: "Fee inflation",
    summary:
      "Today's course cost, inflated, then a SIP that might meet it.",
  },
  {
    slug: "target-amount-sip",
    title: "Target Amount SIP Calculator",
    eyebrow: "Reverse the SIP",
    summary:
      "Pick a corpus and a year. Get the monthly debit that would be required.",
  },
] as const;

export type CalculatorSlug = (typeof calculatorMeta)[number]["slug"];
