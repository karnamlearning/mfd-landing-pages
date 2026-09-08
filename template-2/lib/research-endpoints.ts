/**
 * Registry for Advisorkhoj MF research APIs (root paths, not under /calc/).
 *
 * Same allowlist pattern as calc-endpoints: the proxy refuses any name not
 * listed here so it cannot become an open proxy to the upstream host.
 */

import type { KeyProfile } from "@/lib/calc-endpoints";

export type ResearchEndpoint = {
  method: "GET" | "POST";
  source?: string;
  keyProfile: KeyProfile;
};

const SOURCE_AK = "Advisorkhoj-Website";

export const RESEARCH_ENDPOINTS = {
  // Lookups — default key, no source
  getAllSchemeCategories: { method: "GET", keyProfile: "default" },
  getMutualFundSipReturnsPeriod: { method: "GET", keyProfile: "default" },
  getMutualFundSipReturnsAmount: { method: "GET", keyProfile: "default" },
  getLumpsumReturnPeriod: { method: "GET", keyProfile: "default" },
  getLumpsumReturnAmount: { method: "GET", keyProfile: "default" },
  getAllCompanies: { method: "GET", keyProfile: "default" },
  getShortSchemeByAmcApi: { method: "GET", keyProfile: "default" },
  getSwpDate: { method: "GET", keyProfile: "default" },
  getSwpPeriod: { method: "GET", keyProfile: "default" },
  getBenchmarkSwpPeriodInYears: { method: "GET", keyProfile: "default" },

  // Results — website key + Advisorkhoj-Website source
  getSchemePerformanceReturns: {
    method: "GET",
    source: SOURCE_AK,
    keyProfile: "website",
  },
  getSIPReturnsForCategoryPeriodAmount: {
    method: "GET",
    source: SOURCE_AK,
    keyProfile: "website",
  },
  getTopPerformingLumpsumFunds: {
    method: "GET",
    source: SOURCE_AK,
    keyProfile: "website",
  },
  getAdvSWPReturnCalculatorNew: {
    method: "GET",
    source: SOURCE_AK,
    keyProfile: "website",
  },
} as const satisfies Record<string, ResearchEndpoint>;

export type ResearchEndpointName = keyof typeof RESEARCH_ENDPOINTS;

export function isResearchEndpoint(name: string): name is ResearchEndpointName {
  return Object.prototype.hasOwnProperty.call(RESEARCH_ENDPOINTS, name);
}

export function researchSourceFor(name: ResearchEndpointName): string | null {
  const entry: ResearchEndpoint = RESEARCH_ENDPOINTS[name];
  return entry.source ?? null;
}
