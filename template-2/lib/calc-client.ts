/**
 * Typed client for the calculator API.
 *
 * Every call goes through `/api/calc/<endpoint>`, never to the upstream host
 * directly, so the API key stays on the server. Param shapes below mirror the
 * upstream contract; getting one wrong is a compile error rather than a
 * silently empty result.
 */

import type { CalcEndpointName } from "@/lib/calc-endpoints";

export type CalcParams = {
  getLumpsumCalcResult: {
    lumpsum_amount: number;
    expected_return: number;
    years: number;
  };
  getFutureValueCalcResult: {
    current_cost: number;
    inflation_rate: number;
    no_years: number;
  };
  getEMICalcResultWithChartTableData: {
    loan_amount: number;
    interest_rate: number;
    loan_tenure: number;
    loan_tenure_type: "year" | "month";
    month: number;
    year: number;
  };
  getHumanLifeValueCalcResult: {
    annual_income_expense: number;
    expected_increase_income_expense: number;
    loan_amount: number;
    no_years: number;
  };
  getGoalSettingCalcResult: {
    dream_amount: number;
    expected_return: number;
    inflation_rate: number;
    years: number;
    savings_amount: number;
  };
  getCrorepatiResult: {
    current_age: number;
    retirement_age: number;
    wealth_amount: number;
    inflation_rate: number;
    expected_return: number;
    savings_amount: number;
  };
  getSpendingLessCalcResult: {
    current_age: number;
    retire_age: number;
    income_tax_rate: number;
    inflation_rate: number;
    savings_interest_rate: number;
    house_flat_value: number;
    home_loan_emi_value: number;
    new_car_value: number;
    eating_out_value: number;
    lifestyle_spending_value: number;
    holidays_value: number;
    transport_value: number;
    credit_card_interest_value: number;
    personal_loan_value: number;
    shopping_value: number;
  };
  getTermInsuranceCalcResult: {
    annual_income: number;
    current_age: number;
    existing_cover: number;
    home_loan_amount: number;
    retirement_age: number;
    running_loan_amount: number;
    savings_amount: number;
  };
  getCompoundingResult: {
    principal_amount: number;
    interest_rate: number;
    period: number;
    compound_interval: "yearly" | "half yearly" | "quarterly" | "monthly";
  };
  getCompositeFinancialGoalPlannerMFTools: {
    current_age: number;
    inflation_rate: number;
    savings_amount: number;
    education_amount: number;
    child_current_age: number;
    child_education_age: number;
    edu_rateOfReturn: number;
    wealth_amount: number;
    wealth_age: number;
    wealth_rateOfReturn: number;
    expense_amount: number;
    expense_year: number;
    dream_rateOfReturn: number;
    retire_amount: number;
    retire_year: number;
    retirement_rateOfReturn: number;
    child_marriage_amount: number;
    child_marriage_current_age: number;
    child_marriage_age: number;
    child_marriage_expected_return: number;
    dream_home_amount: number;
    dream_home_years: number;
    dream_home_expected_return: number;
  };
  /** `period` is in MONTHS. */
  getSIPCalcResult: {
    sip_amount: number;
    interest_rate: number;
    period: number;
  };
  /** `period` is in MONTHS. */
  getSIPCalcResultWithChartData: {
    sip_amount: number;
    interest_rate: number;
    period: number;
  };
  getRetirementAnnualIncrease: {
    current_age: number;
    retire_age: number;
    life_expectancy: number;
    monthly_expense_amount: number;
    expected_return: number;
    post_retire_return: number;
    inflation: number;
    lumpsum_amount: number;
    withdrawal_increase_percent: number;
  };
  /** Empty child names are ignored by the upstream. */
  getEducationPlannerResult: {
    child1_name: string;
    child1_current_age: number;
    child1_education_age: number;
    child1_education_amount: number;
    child2_name: string;
    child2_current_age: number;
    child2_education_age: number;
    child2_education_amount: number;
    child3_name: string;
    child3_current_age: number;
    child3_education_age: number;
    child3_education_amount: number;
    expected_return: number;
    inflation_rate: number;
    savings_amount: number;
  };
  getLumpsumTargetCalcResult: {
    target_amount: number;
    expected_return: number;
    years: number;
  };
  /** `period` is in YEARS. */
  getTargetAmountSIPCalcResult: {
    wealth_amount: number;
    expected_return: number;
    inflation_rate: number;
    period: number;
  };
  getNetworthCalcResult: {
    shares_equity_value: number;
    fixed_income_value: number;
    cash_value: number;
    property_value: number;
    gold_value: number;
    other_assets_value: number;
    home_loan_value: number;
    personal_other_loan_value: number;
    income_tax_value: number;
    outstanding_bill_value: number;
    credit_card_due_value: number;
    other_liabilities_value: number;
  };
  getFDCalcResult: {
    investment_amount: number;
    interest_rate: number;
    period: number;
    frequency: "Yearly" | "Half-Yearly" | "Quarterly" | "Monthly";
  };
  getRDCalcResult: {
    monthly_amount: number;
    interest_rate: number;
    period: number;
  };
  getSwpIncreaseCalcResult: {
    lumpsum_amount: number;
    withdrawal_amount: number;
    interest_rate: number;
    period: number;
    increase_percentage: number;
  };
  getSwpCalcResult: {
    flumpsum_amount: number;
    lumpsum_amount: number;
    withdrawal_amount: number;
    interest_rate: number;
    period: number;
    swp_frequency: string;
    years: number;
  };
  getPPFCalcResult: {
    /** Comma-separated yearly amounts. */
    amount_array: string;
    ppf_start_year: number;
    /** 0 = fixed, 1 = variable. */
    ppf_type: 0 | 1;
  };
  getCIICalcResultNew: {
    purchase_year: string;
    purchase_value: number;
    sales_year: string;
    sales_value: number;
    tax_rate: number;
  };
  getNPSCalcResultNew: {
    investment_type: "Monthly" | "Annually";
    monthly_contribution: number;
    age: number;
    expected_return: number;
    annuity_percent: number;
    expected_return_annuity: number;
    period_annuity: number;
    retirement_age: number;
  };
  /** `period` is in MONTHS. */
  getImpactResult: {
    sip_amount: number;
    interest_rate: number;
    period: number;
  };
  getCAGRCalculatorResult: {
    initial_value: number;
    final_value: number;
    years: number;
  };
  getSipLumpsumTenure: {
    saving_target: number;
    lumpsum_amt: number;
    monthly_amt: number;
    avg_lumpsum: number;
    avg_monthly: number;
    inflation: number;
  };
  /** `period` is in MONTHS. */
  getSIPCalcStepUpResult: {
    sip_amount: number;
    interest_rate: number;
    period: number;
    sip_stepup_value: number;
    sip_stepup_amount?: number;
  };
  getInflationIndexFinancialyear: Record<string, never>;
};

export class CalcError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "CalcError";
  }
}

/**
 * Call a calculator. Params are sent on the query string, matching the upstream
 * contract; the proxy adds `source` and `key`.
 */
export async function callCalc<K extends CalcEndpointName & keyof CalcParams>(
  endpoint: K,
  params: CalcParams[K],
  signal?: AbortSignal,
): Promise<unknown> {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(name, String(value));
  }

  const res = await fetch(`/api/calc/${endpoint}?${query.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : null) ?? `Calculator request failed (${res.status})`;
    throw new CalcError(message, res.status);
  }

  return payload;
}
