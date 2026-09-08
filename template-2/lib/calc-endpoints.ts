/**
 * Registry of the Advisorkhoj MF calculator API (`/calc/` namespace).
 *
 * This is the single source of truth for the proxy in
 * `app/api/calc/[endpoint]/route.ts`. It doubles as an allowlist: the proxy
 * refuses any endpoint not named here, so it can never be used to reach an
 * arbitrary upstream path.
 *
 * Three things vary per endpoint and are easy to get wrong, so they are data
 * rather than logic:
 *   - HTTP method (some calculators are POST even though params are on the URL)
 *   - `source` value, which differs per endpoint
 *   - which API key profile signs the call
 *
 * Params always go on the QUERY STRING, including for POST.
 */

export type KeyProfile = "default" | "website" | "calc";

export type CalcEndpoint = {
  method: "GET" | "POST";
  /** Omitted entirely for the two custom endpoints that must not send it. */
  source?: string;
  keyProfile: KeyProfile;
  /** Path prefix. Everything is under /calc/ except the inflation companion. */
  prefix?: string;
};

const SOURCE_AK = "Advisorkhoj-Website";
const SOURCE_WEBSITE = "Website";

/** Resolved at request time from env; the default matches the upstream spec. */
export const DEFAULT_SOURCE = process.env.ADVISORKHOJ_SOURCE || "sudhanshu-Website";

export const CALC_ENDPOINTS = {
  // --- default source, `default` key ---------------------------------------
  getLumpsumCalcResult: { method: "GET", keyProfile: "default" },
  getFutureValueCalcResult: { method: "GET", keyProfile: "default" },

  // --- Advisorkhoj-Website source, `default` key ----------------------------
  getEMICalcResultWithChartTableData: {
    method: "POST",
    source: SOURCE_AK,
    keyProfile: "default",
  },
  getHumanLifeValueCalcResult: { method: "POST", source: SOURCE_AK, keyProfile: "default" },
  getGoalSettingCalcResult: { method: "POST", source: SOURCE_AK, keyProfile: "default" },
  getCompoundingResult: { method: "GET", source: SOURCE_AK, keyProfile: "default" },
  getEducationPlannerResult: { method: "GET", source: SOURCE_AK, keyProfile: "default" },
  getLumpsumTargetCalcResult: { method: "POST", source: SOURCE_AK, keyProfile: "default" },
  getTargetAmountSIPCalcResult: { method: "GET", source: SOURCE_AK, keyProfile: "default" },
  getNetworthCalcResult: { method: "GET", source: SOURCE_AK, keyProfile: "default" },
  getSIPCalcResultWithChartData: {
    method: "GET",
    source: SOURCE_AK,
    keyProfile: "default",
  },

  // --- Website source, `website` key ----------------------------------------
  getCrorepatiResult: { method: "GET", source: SOURCE_WEBSITE, keyProfile: "website" },
  getSpendingLessCalcResult: {
    method: "POST",
    source: SOURCE_WEBSITE,
    keyProfile: "website",
  },
  getTermInsuranceCalcResult: {
    method: "POST",
    source: SOURCE_WEBSITE,
    keyProfile: "website",
  },
  getCompositeFinancialGoalPlannerMFTools: {
    method: "POST",
    source: SOURCE_WEBSITE,
    keyProfile: "website",
  },
  getSIPCalcResult: { method: "GET", source: SOURCE_WEBSITE, keyProfile: "website" },
  getFDCalcResult: { method: "POST", source: SOURCE_WEBSITE, keyProfile: "website" },
  getRDCalcResult: { method: "POST", source: SOURCE_WEBSITE, keyProfile: "website" },
  getPPFCalcResult: { method: "POST", source: SOURCE_WEBSITE, keyProfile: "website" },

  // --- default source, `calc` key -------------------------------------------
  getSwpIncreaseCalcResult: { method: "POST", keyProfile: "calc" },
  getSwpCalcResult: { method: "POST", keyProfile: "calc" },
  getCIICalcResultNew: { method: "POST", keyProfile: "calc" },
  getNPSCalcResultNew: { method: "POST", keyProfile: "calc" },
  getCAGRCalculatorResult: { method: "POST", keyProfile: "calc" },
  getSIPCalcStepUpResult: { method: "POST", source: SOURCE_AK, keyProfile: "calc" },

  // --- custom: these two must NOT send `source` -----------------------------
  getImpactResult: { method: "POST", keyProfile: "calc" },
  getSipLumpsumTenure: { method: "POST", keyProfile: "calc" },

  // --- companion, not under /calc/ ------------------------------------------
  getInflationIndexFinancialyear: {
    method: "GET",
    source: SOURCE_WEBSITE,
    keyProfile: "website",
    prefix: "",
  },
  getRetirementAnnualIncrease: {
    method: "GET",
    keyProfile: "default",
    prefix: "",
  },
} as const satisfies Record<string, CalcEndpoint>;

export type CalcEndpointName = keyof typeof CALC_ENDPOINTS;

/**
 * The two endpoints the upstream rejects when `source` is present. Kept as an
 * explicit set rather than inferred from a missing `source`, because several
 * endpoints legitimately omit `source` in the table above and simply fall back
 * to the default value.
 */
export const NO_SOURCE_ENDPOINTS = new Set<CalcEndpointName>([
  "getImpactResult",
  "getSipLumpsumTenure",
  "getRetirementAnnualIncrease",
]);

export function isCalcEndpoint(name: string): name is CalcEndpointName {
  return Object.prototype.hasOwnProperty.call(CALC_ENDPOINTS, name);
}

/** The `source` to send, or null when the endpoint must not carry one. */
export function sourceFor(name: CalcEndpointName): string | null {
  if (NO_SOURCE_ENDPOINTS.has(name)) return null;
  const entry: CalcEndpoint = CALC_ENDPOINTS[name];
  return entry.source ?? DEFAULT_SOURCE;
}

export function pathFor(name: CalcEndpointName): string {
  const entry: CalcEndpoint = CALC_ENDPOINTS[name];
  const prefix = entry.prefix ?? "/calc";
  return `${prefix}/${name}`;
}
