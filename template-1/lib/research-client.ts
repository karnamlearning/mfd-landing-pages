/**
 * Typed client for research APIs via `/api/research/<endpoint>`.
 */

import type { ResearchEndpointName } from "@/lib/research-endpoints";

export type ResearchParams = {
  getAllSchemeCategories: Record<string, never>;
  getMutualFundSipReturnsPeriod: Record<string, never>;
  getMutualFundSipReturnsAmount: Record<string, never>;
  getLumpsumReturnPeriod: Record<string, never>;
  getLumpsumReturnAmount: Record<string, never>;
  getAllCompanies: Record<string, never>;
  getShortSchemeByAmcApi: { amc: string };
  getSwpDate: Record<string, never>;
  getSwpPeriod: Record<string, never>;
  getBenchmarkSwpPeriodInYears: Record<string, never>;
  getSchemePerformanceReturns: {
    category: string;
    scheme_plan_type: "Regular" | "Direct";
  };
  getSIPReturnsForCategoryPeriodAmount: {
    category: string;
    period: number | string;
    amount: number | string;
    scheme_plan_type: "Regular" | "Direct";
  };
  getTopPerformingLumpsumFunds: {
    category: string;
    period: number | string;
    amount: number | string;
    scheme_plan_type: "Regular" | "Direct";
  };
  getAdvSWPReturnCalculatorNew: {
    scheme_name: string;
    amc: string;
    initial_amount: number;
    withdrawal_amount: number;
    init_start_date: string;
    swp_date: string | number;
    period: string;
    from_date: string;
    to_date: string;
  };
};

export class ResearchError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ResearchError";
  }
}

export async function callResearch<K extends ResearchEndpointName & keyof ResearchParams>(
  endpoint: K,
  params: ResearchParams[K] = {} as ResearchParams[K],
  signal?: AbortSignal,
): Promise<unknown> {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(name, String(value));
  }

  const qs = query.toString();
  const res = await fetch(`/api/research/${endpoint}${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : null) ?? `Research request failed (${res.status})`;
    throw new ResearchError(message, res.status);
  }

  return payload;
}
