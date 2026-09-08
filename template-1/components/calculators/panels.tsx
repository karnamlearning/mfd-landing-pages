"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import styled from "styled-components";
import { toast } from "sonner";
import { callCalc, CalcError } from "@/lib/calc-client";
import { callResearch, ResearchError } from "@/lib/research-client";
import { formatINR } from "@/lib/format";
import type { CalculatorSlug } from "@/lib/calculators";
import { CalcShell } from "@/components/calculators/CalcShell";
import type { Series } from "@/components/calculators/CalcChart";
import {
  ControlGrid,
  ControlStack,
  ControlWide,
  MoneyField,
  SelectField,
  SliderField,
  StepperField,
  TextField,
} from "@/components/calculators/controls";

/* ------------------------------------------------------------------ shared --- */

const LINE = {
  value: "--accent-strong",
  invested: "--brand-soft",
  target: "--positive",
} as const;

const FILL = {
  gain: "--accent",
  invested: "--on-brand-mute",
  existing: "--positive",
} as const;

/** Research tools always query Regular plans. */
const SCHEME_PLAN_TYPE = "Regular" as const;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

const RunButton = styled.button`
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 12px 20px;
  background: var(--accent-strong);
  color: var(--on-accent, #fff);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

const Status = styled.p`
  font-size: 13px;
  color: var(--muted);
  margin: 0;
`;

const TableWrap = styled.div`
  overflow: auto;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }

  th {
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--surface-raised);
    position: sticky;
    top: 0;
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;

const ResearchShell = styled.div`
  display: grid;
  gap: 22px;
  background: var(--surface-raised);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  padding: 28px;

  @media (max-width: 560px) {
    padding: 20px 16px;
  }
`;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const obj = asRecord(value);
  if (!obj) return [];
  for (const key of ["list", "schemes_list", "amount_list", "period_years", "year_list", "day_list", "period_list", "scheme_list"]) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }
  return [];
}

function labelOf(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item);
  const obj = asRecord(item);
  if (!obj) return "";
  return String(obj.label ?? obj.value ?? obj.name ?? obj.scheme_name ?? "");
}

function valueOf(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item);
  const obj = asRecord(item);
  if (!obj) return "";
  return String(obj.value ?? obj.label ?? obj.name ?? "");
}

function fmtNum(n: unknown, digits = 2) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("en-IN", { maximumFractionDigits: digits });
}

function fmtPct(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return "—";
  return `${v.toFixed(2)}%`;
}

function errMessage(err: unknown) {
  if (err instanceof CalcError || err instanceof ResearchError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

function toDisplayDate(iso: string) {
  // HTML date input is YYYY-MM-DD; APIs want DD-MM-YYYY
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
}

function yearsAgoIso(years: number) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/* ----------------------------------------------------------- research UI --- */

function ResearchPanel({
  controls,
  onRun,
  loading,
  error,
  children,
}: {
  controls: ReactNode;
  onRun: () => void;
  loading: boolean;
  error: string | null;
  children: ReactNode;
}) {
  return (
    <ResearchShell>
      <ControlGrid>{controls}</ControlGrid>
      <ActionRow>
        <RunButton type="button" onClick={onRun} disabled={loading}>
          {loading ? "Loading…" : "Show results"}
        </RunButton>
        {error ? <Status role="alert">{error}</Status> : null}
      </ActionRow>
      {children}
    </ResearchShell>
  );
}

function ResultTable({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns: { key: string; label: string; format?: (v: unknown, row: Record<string, unknown>) => string }[];
}) {
  if (!rows.length) return <Status>No results yet. Adjust the filters and run again.</Status>;
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={String(row.id ?? row.scheme_amfi_code ?? i)}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.format ? col.format(row[col.key], row) : String(row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}

function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    callResearch("getAllSchemeCategories", {})
      .then((payload) => {
        if (cancelled) return;
        const list = asList(payload).map((item) => labelOf(item)).filter(Boolean);
        setCategories(list);
      })
      .catch(() => {
        if (!cancelled) setCategories(["Equity: Flexi Cap"]);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return categories;
}

/* ------------------------------------------------------- trailing returns --- */

function TrailingReturns() {
  const categories = useCategories();
  const [category, setCategory] = useState("Equity: Flexi Cap");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (categories.length && !categories.includes(category)) setCategory(categories[0]);
  }, [categories, category]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await callResearch("getSchemePerformanceReturns", {
        category,
        scheme_plan_type: SCHEME_PLAN_TYPE,
      });
      const list = asList(payload).map((item) => asRecord(item)).filter(Boolean) as Record<string, unknown>[];
      setRows(list.slice(0, 40));
    } catch (err) {
      setError(errMessage(err));
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [category]);

  return (
    <ResearchPanel
      loading={loading}
      error={error}
      onRun={run}
      controls={
        <>
          <SelectField
            label="Category"
            value={category}
            options={(categories.length ? categories : [category]).map((c) => ({ value: c, label: c }))}
            onChange={setCategory}
          />
        </>
      }
    >
      <ResultTable
        rows={rows}
        columns={[
          { key: "scheme_amfi", label: "Scheme" },
          { key: "scheme_company", label: "AMC" },
          { key: "returns_abs_1year", label: "1Y", format: (v) => fmtPct(v) },
          { key: "returns_cmp_3year", label: "3Y CAGR", format: (v) => fmtPct(v) },
          { key: "returns_cmp_5year", label: "5Y CAGR", format: (v) => fmtPct(v) },
          { key: "returns_cmp_10year", label: "10Y CAGR", format: (v) => fmtPct(v) },
          { key: "price", label: "NAV", format: (v) => fmtNum(v, 4) },
        ]}
      />
    </ResearchPanel>
  );
}

/* ---------------------------------------------------------- MF SIP returns --- */

function MfSipReturns() {
  const categories = useCategories();
  const [category, setCategory] = useState("Equity: Flexi Cap");
  const [period, setPeriod] = useState("1");
  const [amount, setAmount] = useState("3000");
  const [periods, setPeriods] = useState<{ value: string; label: string }[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      callResearch("getMutualFundSipReturnsPeriod", {}),
      callResearch("getMutualFundSipReturnsAmount", {}),
    ])
      .then(([periodPayload, amountPayload]) => {
        if (cancelled) return;
        const p = asList(periodPayload).map((item) => ({
          value: valueOf(item),
          label: labelOf(item) || valueOf(item),
        })).filter((x) => x.value);
        const a = asList(amountPayload).map((item) => valueOf(item)).filter(Boolean);
        setPeriods(p);
        setAmounts(a);
        if (p.length) setPeriod(p.find((x) => x.value === "1")?.value ?? p[0].value);
        if (a.length) setAmount(a.includes("3000") ? "3000" : a[0]);
      })
      .catch(() => {/* keep defaults */ });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (categories.length && !categories.includes(category)) setCategory(categories[0]);
  }, [categories, category]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await callResearch("getSIPReturnsForCategoryPeriodAmount", {
        category,
        period,
        amount,
        scheme_plan_type: SCHEME_PLAN_TYPE,
      });
      const list = asList(payload).map((item) => asRecord(item)).filter(Boolean) as Record<string, unknown>[];
      setRows(list.slice(0, 40));
    } catch (err) {
      setError(errMessage(err));
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [amount, category, period]);

  return (
    <ResearchPanel
      loading={loading}
      error={error}
      onRun={run}
      controls={
        <>
          <SelectField
            label="Category"
            value={category}
            options={(categories.length ? categories : [category]).map((c) => ({ value: c, label: c }))}
            onChange={setCategory}
          />
          <SelectField
            label="Period"
            value={period}
            options={(periods.length ? periods : [{ value: period, label: `${period} Years` }])}
            onChange={setPeriod}
          />
          <SelectField
            label="Monthly SIP"
            value={amount}
            options={(amounts.length ? amounts : [amount]).map((a) => ({
              value: a,
              label: formatINR(Number(a)),
            }))}
            onChange={setAmount}
          />
        </>
      }
    >
      <ResultTable
        rows={rows}
        columns={[
          { key: "scheme_name", label: "Scheme" },
          { key: "scheme_company", label: "AMC" },
          { key: "current_cost", label: "Invested", format: (v) => formatINR(Number(v) || 0) },
          { key: "current_value", label: "Value", format: (v) => formatINR(Number(v) || 0) },
          { key: "returns", label: "Returns", format: (v) => fmtPct(v) },
        ]}
      />
    </ResearchPanel>
  );
}

/* ----------------------------------------------------- MF lumpsum returns --- */

function MfLumpsumReturns() {
  const categories = useCategories();
  const [category, setCategory] = useState("Equity: Flexi Cap");
  const [period, setPeriod] = useState("5");
  const [amount, setAmount] = useState("10000");
  const [periods, setPeriods] = useState<{ value: string; label: string }[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      callResearch("getLumpsumReturnPeriod", {}),
      callResearch("getLumpsumReturnAmount", {}),
    ])
      .then(([periodPayload, amountPayload]) => {
        if (cancelled) return;
        const p = asList(periodPayload).map((item) => ({
          value: valueOf(item),
          label: labelOf(item) || valueOf(item),
        })).filter((x) => x.value);
        const a = asList(amountPayload).map((item) => valueOf(item)).filter(Boolean);
        setPeriods(p);
        setAmounts(a);
        if (p.length) setPeriod(p.find((x) => x.value === "5")?.value ?? p[0].value);
        if (a.length) setAmount(a.includes("10000") ? "10000" : a[0]);
      })
      .catch(() => {/* keep defaults */ });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (categories.length && !categories.includes(category)) setCategory(categories[0]);
  }, [categories, category]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await callResearch("getTopPerformingLumpsumFunds", {
        category,
        period,
        amount,
        scheme_plan_type: SCHEME_PLAN_TYPE,
      });
      const list = asList(payload).map((item) => asRecord(item)).filter(Boolean) as Record<string, unknown>[];
      setRows(list.slice(0, 40));
    } catch (err) {
      setError(errMessage(err));
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [amount, category, period]);

  return (
    <ResearchPanel
      loading={loading}
      error={error}
      onRun={run}
      controls={
        <>
          <SelectField
            label="Category"
            value={category}
            options={(categories.length ? categories : [category]).map((c) => ({ value: c, label: c }))}
            onChange={setCategory}
          />
          <SelectField
            label="Period"
            value={period}
            options={(periods.length ? periods : [{ value: period, label: `${period} Years` }])}
            onChange={setPeriod}
          />
          <SelectField
            label="Lumpsum amount"
            value={amount}
            options={(amounts.length ? amounts : [amount]).map((a) => ({
              value: a,
              label: formatINR(Number(a)),
            }))}
            onChange={setAmount}
          />
        </>
      }
    >
      <ResultTable
        rows={rows}
        columns={[
          { key: "scheme_name", label: "Scheme" },
          { key: "scheme_company", label: "AMC" },
          { key: "current_cost", label: "Invested", format: (v) => formatINR(Number(v) || 0) },
          { key: "current_value", label: "Value", format: (v) => formatINR(Number(v) || 0) },
          { key: "returns", label: "Returns", format: (v) => fmtPct(v) },
        ]}
      />
    </ResearchPanel>
  );
}

/* ---------------------------------------------------- SWP return research --- */

function SwpReturnResearch() {
  const [amcs, setAmcs] = useState<string[]>([]);
  const [amc, setAmc] = useState("Mirae Asset Mutual Fund");
  const [schemes, setSchemes] = useState<string[]>([]);
  const [scheme, setScheme] = useState("");
  const [days, setDays] = useState<string[]>(["10"]);
  const [swpDate, setSwpDate] = useState("10");
  const [frequencies, setFrequencies] = useState<string[]>(["Monthly"]);
  const [frequency, setFrequency] = useState("Monthly");
  const [initial, setInitial] = useState(10_00_000);
  const [withdrawal, setWithdrawal] = useState(3000);
  const [fromDate, setFromDate] = useState(yearsAgoIso(10));
  const [toDate, setToDate] = useState(todayIso());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      callResearch("getAllCompanies", {}),
      callResearch("getSwpDate", {}),
      callResearch("getSwpPeriod", {}),
    ])
      .then(([companies, dayPayload, periodPayload]) => {
        if (cancelled) return;
        const companyList = asList(companies).map((item) => labelOf(item)).filter(Boolean);
        setAmcs(companyList);
        if (companyList.length && !companyList.includes(amc)) setAmc(companyList[0]);
        const dayList = asList(dayPayload).map((item) => valueOf(item)).filter(Boolean);
        if (dayList.length) {
          setDays(dayList);
          setSwpDate(dayList.includes("10") ? "10" : dayList[0]);
        }
        const freqList = asList(periodPayload).map((item) => valueOf(item)).filter(Boolean);
        if (freqList.length) {
          setFrequencies(freqList);
          setFrequency(freqList.includes("Monthly") ? "Monthly" : freqList[0]);
        }
      })
      .catch(() => {/* defaults */ });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!amc) return;
    let cancelled = false;
    callResearch("getShortSchemeByAmcApi", { amc })
      .then((payload) => {
        if (cancelled) return;
        const list = asList(payload).map((item) => labelOf(item)).filter(Boolean);
        setSchemes(list);
        setScheme((prev) => (list.includes(prev) ? prev : list[0] ?? ""));
      })
      .catch(() => {
        if (!cancelled) {
          setSchemes([]);
          setScheme("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [amc]);

  const run = useCallback(async () => {
    if (!scheme) {
      setError("Pick a scheme");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = await callResearch("getAdvSWPReturnCalculatorNew", {
        scheme_name: scheme,
        amc,
        initial_amount: initial,
        withdrawal_amount: withdrawal,
        init_start_date: toDisplayDate(fromDate),
        swp_date: swpDate,
        period: frequency,
        from_date: toDisplayDate(fromDate),
        to_date: toDisplayDate(toDate),
      });
      setResult(asRecord(payload));
    } catch (err) {
      setError(errMessage(err));
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [amc, frequency, fromDate, initial, scheme, swpDate, toDate, withdrawal]);

  return (
    <ResearchPanel
      loading={loading}
      error={error}
      onRun={run}
      controls={
        <>
          <SelectField
            label="AMC"
            value={amc}
            options={(amcs.length ? amcs : [amc]).map((c) => ({ value: c, label: c }))}
            onChange={setAmc}
          />
          <ControlWide>
            <SelectField
              label="Scheme"
              value={scheme}
              options={(schemes.length ? schemes : scheme ? [scheme] : ["—"]).map((s) => ({
                value: s,
                label: s,
              }))}
              onChange={setScheme}
            />
          </ControlWide>
          <MoneyField label="Initial amount" value={initial} min={10_000} max={5_00_00_000} step={10_000} onChange={setInitial} />
          <MoneyField label="Withdrawal amount" value={withdrawal} min={500} max={10_00_000} step={500} onChange={setWithdrawal} />
          <SelectField
            label="SWP date"
            value={swpDate}
            options={days.map((d) => ({ value: d, label: d }))}
            onChange={setSwpDate}
          />
          <SelectField
            label="Frequency"
            value={frequency}
            options={frequencies.map((f) => ({ value: f, label: f }))}
            onChange={setFrequency}
          />
          <NativeDate label="Start / from date" value={fromDate} onChange={setFromDate} />
          <NativeDate label="To date" value={toDate} onChange={setToDate} />
        </>
      }
    >
      {result ? (
        <>
          <ResultTable
            rows={[result]}
            columns={[
              { key: "scheme_name", label: "Scheme" },
              {
                key: "scheme_investment_amount",
                label: "Invested",
                format: (v) => formatINR(Number(v) || 0),
              },
              {
                key: "scheme_total_withdrawal_amount",
                label: "Withdrawn",
                format: (v) => formatINR(Number(v) || 0),
              },
              {
                key: "scheme_current_value",
                label: "Current value",
                format: (v) => formatINR(Number(v) || 0),
              },
              { key: "scheme_returns", label: "Returns", format: (v) => fmtPct(v) },
              {
                key: "scheme_profit",
                label: "Profit",
                format: (v) => formatINR(Number(v) || 0),
              },
            ]}
          />
        </>
      ) : (
        <Status>Pick an AMC and scheme, then run the SWP history.</Status>
      )}
    </ResearchPanel>
  );
}

function NativeDate({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 750,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
      </span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid var(--line-strong)",
          background: "var(--surface)",
          color: "var(--ink)",
          font: "inherit",
        }}
      />
    </label>
  );
}

/* ---------------------------------------------------------- SIP calculator --- */

const SIP_DEFAULTS = { monthly: 25000, months: 120, rate: 12.5 };

function SipCalculator() {
  const [monthly, setMonthly] = useState(SIP_DEFAULTS.monthly);
  const [months, setMonths] = useState(SIP_DEFAULTS.months);
  const [rate, setRate] = useState(SIP_DEFAULTS.rate);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callCalc("getSIPCalcResultWithChartData", {
        sip_amount: monthly,
        interest_rate: rate,
        period: months,
      });
      setData(asRecord(payload));
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [monthly, months, rate]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const invested = Number(data?.invested_amount ?? 0);
  const maturity = Number(data?.maturity_amount ?? 0);
  const growth = Number(data?.growth_value ?? Math.max(0, maturity - invested));
  const chart = asList(data?.list).map((item) => asRecord(item)).filter(Boolean) as Record<string, unknown>[];
  const categories = chart.map((row) => String(row.year ?? ""));
  const series: Series[] = [
    {
      name: "Balance",
      token: LINE.value,
      data: chart.map((row) => Math.round(Number(row.balance ?? 0))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: chart.map((row) => Math.round(Number(row.principal ?? 0))),
    },
  ];

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : "Estimated maturity value",
        value: maturity,
        caption: `${formatINR(monthly)} a month for ${months} months at ${rate}%.`,
      }}
      stats={[
        { label: "Total invested", value: formatINR(invested) },
        { label: "Wealth gained", value: formatINR(growth) },
        { label: "Months", value: String(months) },
        { label: "Assumed return", value: `${rate}%` },
      ]}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        { label: "Market growth", value: growth, token: FILL.gain },
      ]}
      categories={categories.length ? categories : ["—"]}
      series={series}
      onReset={() => {
        setMonthly(SIP_DEFAULTS.monthly);
        setMonths(SIP_DEFAULTS.months);
        setRate(SIP_DEFAULTS.rate);
      }}
      controls={
        <ControlStack>
          <ControlWide>
            <MoneyField label="Monthly SIP" value={monthly} min={500} max={5_00_000} step={500} onChange={setMonthly} />
          </ControlWide>
          <StepperField label="Tenure" value={months} min={12} max={480} step={12} unit="months" onChange={setMonths} />
          <SliderField label="Expected annual return" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------ Lumpsum calculator --- */

const LUMP_DEFAULTS = { amount: 50_00_000, rate: 12, years: 30 };

function LumpsumCalculator() {
  const [amount, setAmount] = useState(LUMP_DEFAULTS.amount);
  const [rate, setRate] = useState(LUMP_DEFAULTS.rate);
  const [years, setYears] = useState(LUMP_DEFAULTS.years);
  const [future, setFuture] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callCalc("getLumpsumCalcResult", {
        lumpsum_amount: amount,
        expected_return: rate,
        years,
      });
      const row = asRecord(payload);
      setFuture(Number(row?.future_amount ?? 0));
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [amount, rate, years]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const gain = Math.max(0, future - amount);
  const xs = useMemo(() => Array.from({ length: Math.max(1, years) }, (_, i) => i + 1), [years]);
  const series: Series[] = [
    {
      name: "Value",
      token: LINE.value,
      data: xs.map((y) => Math.round(amount * Math.pow(1 + rate / 100, y))),
    },
    {
      name: "Invested",
      token: LINE.invested,
      data: xs.map(() => amount),
    },
  ];

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : `Value after ${years} years`,
        value: future,
        caption: `${formatINR(amount)} growing at ${rate}% a year.`,
      }}
      stats={[
        { label: "Amount invested", value: formatINR(amount) },
        { label: "Wealth gained", value: formatINR(gain) },
        { label: "Years", value: String(years) },
        { label: "Assumed return", value: `${rate}%` },
      ]}
      split={[
        { label: "You invest", value: amount, token: FILL.invested },
        { label: "Market growth", value: gain, token: FILL.gain },
      ]}
      categories={xs}
      series={series}
      onReset={() => {
        setAmount(LUMP_DEFAULTS.amount);
        setRate(LUMP_DEFAULTS.rate);
        setYears(LUMP_DEFAULTS.years);
      }}
      controls={
        <ControlStack>
          <ControlWide>
            <MoneyField label="Lumpsum amount" value={amount} min={10_000} max={10_00_00_000} step={10_000} onChange={setAmount} />
          </ControlWide>
          <StepperField label="Years" value={years} min={1} max={50} unit="years" onChange={setYears} />
          <SliderField label="Expected annual return" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
        </ControlStack>
      }
    />
  );
}

/* ----------------------------------------------- Child education planner --- */

type ChildPlan = { id: number; name: string; age: number; eduAge: number; cost: number };

const MAX_CHILDREN = 3;

const newChild = (id: number): ChildPlan => ({
  id,
  name: "",
  age: 5,
  eduAge: 18,
  cost: 5_00_000,
});

const EDU_DEFAULTS = { rate: 10, inflation: 5, savings: 2_00_000 };

const ChildCard = styled.div`
  display: grid;
  gap: 18px 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 18px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--surface);

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ChildHead = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  strong {
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-strong);
  }
`;

const GhostButton = styled.button`
  appearance: none;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink);
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover:not(:disabled) {
    border-color: var(--accent-strong);
    color: var(--accent-strong);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;

  &:hover {
    color: var(--negative, #b42318);
    background: var(--tint-accent-weak);
  }
`;

/** The name the API sees; an empty name makes the upstream skip that child. */
const childLabel = (child: ChildPlan, index: number) =>
  child.name.trim() || `Child ${index + 1}`;

function ChildEducationPlanner() {
  const [children, setChildren] = useState<ChildPlan[]>([newChild(1)]);
  const [nextId, setNextId] = useState(2);
  const [rate, setRate] = useState(EDU_DEFAULTS.rate);
  const [inflation, setInflation] = useState(EDU_DEFAULTS.inflation);
  const [savings, setSavings] = useState(EDU_DEFAULTS.savings);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (id: number, patch: Partial<ChildPlan>) =>
    setChildren((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const add = () => {
    if (children.length >= MAX_CHILDREN) return;
    setChildren((list) => [...list, newChild(nextId)]);
    setNextId((n) => n + 1);
  };

  const remove = (id: number) => {
    if (children.length <= 1) return;
    setChildren((list) => list.filter((c) => c.id !== id));
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // The API has three fixed slots; unused ones get an empty name, which
      // the upstream treats as "no child" (verified against the sample call).
      const slot = (i: number) => {
        const c = children[i];
        return c
          ? { name: childLabel(c, i), age: c.age, eduAge: c.eduAge, cost: c.cost }
          : { name: "", age: 5, eduAge: 18, cost: 5_00_000 };
      };
      const [a, b, c] = [slot(0), slot(1), slot(2)];
      const payload = await callCalc("getEducationPlannerResult", {
        child1_name: a.name,
        child1_current_age: a.age,
        child1_education_age: a.eduAge,
        child1_education_amount: a.cost,
        child2_name: b.name,
        child2_current_age: b.age,
        child2_education_age: b.eduAge,
        child2_education_amount: b.cost,
        child3_name: c.name,
        child3_current_age: c.age,
        child3_education_age: c.eduAge,
        child3_education_amount: c.cost,
        expected_return: rate,
        inflation_rate: inflation,
        savings_amount: savings,
      });
      setData(asRecord(payload));
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [children, inflation, rate, savings]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const monthly = Number(data?.total_monthly_savings ?? 0);
  const futureCost = Number(data?.toal_inflation_adjust_education_amount ?? 0);
  const target = Number(data?.target_amount ?? 0);
  const invested = Number(data?.total_invested_amount ?? 0);
  const earnings = Number(data?.total_earnings ?? 0);
  const costToday = children.reduce((sum, c) => sum + c.cost, 0);

  const perChild = children.map((c, i) => ({
    label: childLabel(c, i),
    monthly: Number(data?.[`child${i + 1}_monthly_savings`] ?? 0),
    future: Number(data?.[`child${i + 1}_inflation_adjust_education_amount`] ?? 0),
    today: c.cost,
  }));

  const stats = [
    { label: "Inflation-adjusted cost", value: formatINR(futureCost) },
    { label: "Gap to fund", value: formatINR(target) },
    { label: "Total invested", value: formatINR(invested) },
    { label: "Expected earnings", value: formatINR(earnings) },
    ...(children.length > 1
      ? perChild.map((c) => ({ label: `${c.label} · monthly`, value: formatINR(c.monthly) }))
      : []),
  ];

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : "Required monthly savings",
        value: monthly,
        caption:
          children.length === 1
            ? `To fund ${perChild[0].label}'s education cost of ${formatINR(costToday)} (today's money).`
            : `To fund education for ${children.length} children costing ${formatINR(costToday)} today.`,
      }}
      stats={stats}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        { label: "Market growth", value: earnings, token: FILL.gain },
      ]}
      categories={perChild.map((c) => c.label)}
      xLabel="Child"
      series={[
        { name: "Cost today", token: LINE.invested, data: perChild.map((c) => c.today) },
        { name: "Future cost", token: LINE.value, data: perChild.map((c) => c.future) },
      ]}
      onReset={() => {
        setChildren([newChild(1)]);
        setNextId(2);
        setRate(EDU_DEFAULTS.rate);
        setInflation(EDU_DEFAULTS.inflation);
        setSavings(EDU_DEFAULTS.savings);
      }}
      controls={
        <ControlStack>
          {children.map((child, index) => (
            <ControlWide key={child.id}>
              <ChildCard>
                <ChildHead>
                  <strong>Child {index + 1}</strong>
                  {children.length > 1 ? (
                    <RemoveButton type="button" onClick={() => remove(child.id)}>
                      Remove
                    </RemoveButton>
                  ) : null}
                </ChildHead>
                <ControlWide>
                  <TextField
                    label="Name"
                    value={child.name}
                    placeholder={`Child ${index + 1}`}
                    onChange={(name) => update(child.id, { name })}
                  />
                </ControlWide>
                <StepperField
                  label="Current age"
                  value={child.age}
                  min={0}
                  max={17}
                  unit="years"
                  onChange={(age) =>
                    update(child.id, { age, eduAge: Math.max(child.eduAge, age + 1) })
                  }
                />
                <StepperField
                  label="Education age"
                  value={child.eduAge}
                  min={Math.max(child.age + 1, 10)}
                  max={25}
                  unit="years"
                  onChange={(eduAge) => update(child.id, { eduAge })}
                />
                <ControlWide>
                  <MoneyField
                    label="Education cost (today)"
                    value={child.cost}
                    min={1_00_000}
                    max={2_00_00_000}
                    step={50_000}
                    onChange={(cost) => update(child.id, { cost })}
                  />
                </ControlWide>
              </ChildCard>
            </ControlWide>
          ))}
          <ControlWide>
            <GhostButton type="button" onClick={add} disabled={children.length >= MAX_CHILDREN}>
              {children.length >= MAX_CHILDREN
                ? `Up to ${MAX_CHILDREN} children`
                : "+ Add another child"}
            </GhostButton>
          </ControlWide>
          <ControlWide>
            <MoneyField label="Existing savings" value={savings} min={0} max={5_00_00_000} step={10_000} onChange={setSavings} />
          </ControlWide>
          <SliderField label="Expected return" value={rate} min={1} max={20} step={0.5} suffix="%" onChange={setRate} />
          <SliderField label="Inflation" value={inflation} min={1} max={12} step={0.5} suffix="%" onChange={setInflation} />
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------- Retirement planner --- */

const RET_DEFAULTS = {
  currentAge: 24,
  retireAge: 60,
  lifeExpectancy: 80,
  expense: 50_000,
  expectedReturn: 10,
  postReturn: 7,
  inflation: 6,
  lumpsum: 1_00_000,
};

function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState(RET_DEFAULTS.currentAge);
  const [retireAge, setRetireAge] = useState(RET_DEFAULTS.retireAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(RET_DEFAULTS.lifeExpectancy);
  const [expense, setExpense] = useState(RET_DEFAULTS.expense);
  const [expectedReturn, setExpectedReturn] = useState(RET_DEFAULTS.expectedReturn);
  const [postReturn, setPostReturn] = useState(RET_DEFAULTS.postReturn);
  const [inflation, setInflation] = useState(RET_DEFAULTS.inflation);
  const [lumpsum, setLumpsum] = useState(RET_DEFAULTS.lumpsum);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callCalc("getRetirementAnnualIncrease", {
        current_age: currentAge,
        retire_age: retireAge,
        life_expectancy: lifeExpectancy,
        monthly_expense_amount: expense,
        expected_return: expectedReturn,
        post_retire_return: postReturn,
        inflation,
        lumpsum_amount: lumpsum,
        // Hidden from UI; keep in sync with inflation as upstream expects it.
        withdrawal_increase_percent: inflation,
      });
      const row = asRecord(payload);
      if (row) {
        // Do not surface cash_flow_list in the UI.
        const { cash_flow_list: _cash, ...rest } = row;
        setData(rest);
      } else {
        setData(null);
      }
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [currentAge, expectedReturn, expense, inflation, lifeExpectancy, lumpsum, postReturn, retireAge]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const sip = Number(data?.monthly_sip_amount ?? 0);
  const corpus = Number(data?.retirement_corpus ?? 0);
  const inflatedExpense = Number(data?.expense_inflation_adjust_value ?? 0);
  const lumpsumFv = Number(data?.lumpsum_future_value ?? 0);

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : "Required monthly SIP",
        value: sip,
        caption: `To build a retirement corpus by age ${retireAge}.`,
      }}
      stats={[
        { label: "Retirement corpus", value: formatINR(corpus) },
        { label: "Expense at retirement", value: formatINR(inflatedExpense) },
        { label: "Existing lumpsum (future)", value: formatINR(lumpsumFv) },
        { label: "Years to retire", value: String(Math.max(0, retireAge - currentAge)) },
      ]}
      split={[
        { label: "Existing lumpsum growth", value: lumpsumFv, token: FILL.existing },
        { label: "Corpus still needed", value: Math.max(0, corpus - lumpsumFv), token: FILL.gain },
      ]}
      categories={["Corpus", "Lumpsum FV", "Monthly SIP × 12"]}
      series={[
        {
          name: "Amount",
          token: LINE.value,
          data: [corpus, lumpsumFv, sip * 12],
        },
      ]}
      onReset={() => {
        setCurrentAge(RET_DEFAULTS.currentAge);
        setRetireAge(RET_DEFAULTS.retireAge);
        setLifeExpectancy(RET_DEFAULTS.lifeExpectancy);
        setExpense(RET_DEFAULTS.expense);
        setExpectedReturn(RET_DEFAULTS.expectedReturn);
        setPostReturn(RET_DEFAULTS.postReturn);
        setInflation(RET_DEFAULTS.inflation);
        setLumpsum(RET_DEFAULTS.lumpsum);
      }}
      controls={
        <ControlStack>
          <StepperField label="Current age" value={currentAge} min={18} max={70} unit="years" onChange={setCurrentAge} />
          <StepperField label="Retirement age" value={retireAge} min={Math.max(currentAge + 1, 40)} max={75} unit="years" onChange={setRetireAge} />
          <StepperField label="Life expectancy" value={lifeExpectancy} min={Math.max(retireAge + 1, 70)} max={100} unit="years" onChange={setLifeExpectancy} />
          <SliderField label="Inflation" value={inflation} min={1} max={12} step={0.5} suffix="%" onChange={setInflation} />
          <ControlWide>
            <MoneyField label="Monthly expense today" value={expense} min={10_000} max={10_00_000} step={5_000} onChange={setExpense} />
          </ControlWide>
          <ControlWide>
            <MoneyField label="Existing lumpsum" value={lumpsum} min={0} max={5_00_00_000} step={10_000} onChange={setLumpsum} />
          </ControlWide>
          <SliderField label="Return before retirement" value={expectedReturn} min={1} max={20} step={0.5} suffix="%" onChange={setExpectedReturn} />
          <SliderField label="Return after retirement" value={postReturn} min={1} max={15} step={0.5} suffix="%" onChange={setPostReturn} />
        </ControlStack>
      }
    />
  );
}

/* ----------------------------------------------------- Goal setting calculator --- */

const GOAL_DEFAULTS = {
  dream: 1_00_00_000,
  rate: 12,
  inflation: 8,
  years: 30,
  savings: 0,
};

function GoalSettingCalculator() {
  const [dream, setDream] = useState(GOAL_DEFAULTS.dream);
  const [rate, setRate] = useState(GOAL_DEFAULTS.rate);
  const [inflation, setInflation] = useState(GOAL_DEFAULTS.inflation);
  const [years, setYears] = useState(GOAL_DEFAULTS.years);
  const [savings, setSavings] = useState(GOAL_DEFAULTS.savings);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callCalc("getGoalSettingCalcResult", {
        dream_amount: dream,
        expected_return: rate,
        inflation_rate: inflation,
        years,
        savings_amount: savings,
      });
      setData(asRecord(payload));
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [dream, inflation, rate, savings, years]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const monthly = Number(data?.monthly_savings ?? 0);
  const target = Number(data?.target_amount ?? 0);
  const invested = Number(data?.invested_amount ?? 0);
  const earnings = Number(data?.total_earnings ?? 0);

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : "Required monthly savings",
        value: monthly,
        caption: `To reach an inflation-adjusted goal of ${formatINR(target)}.`,
      }}
      stats={[
        { label: "Future goal amount", value: formatINR(target) },
        { label: "Total invested", value: formatINR(invested) },
        { label: "Expected earnings", value: formatINR(earnings) },
        { label: "Years", value: String(years) },
      ]}
      split={[
        { label: "You invest", value: invested, token: FILL.invested },
        { label: "Market growth", value: earnings, token: FILL.gain },
      ]}
      categories={["Dream today", "Future goal", "Invested"]}
      series={[
        {
          name: "Amount",
          token: LINE.value,
          data: [dream, target, invested],
        },
      ]}
      onReset={() => {
        setDream(GOAL_DEFAULTS.dream);
        setRate(GOAL_DEFAULTS.rate);
        setInflation(GOAL_DEFAULTS.inflation);
        setYears(GOAL_DEFAULTS.years);
        setSavings(GOAL_DEFAULTS.savings);
      }}
      controls={
        <ControlStack>
          <ControlWide>
            <MoneyField label="Dream amount (today)" value={dream} min={1_00_000} max={50_00_00_000} step={1_00_000} onChange={setDream} />
          </ControlWide>
          <ControlWide>
            <MoneyField label="Existing savings" value={savings} min={0} max={10_00_00_000} step={10_000} onChange={setSavings} />
          </ControlWide>
          <StepperField label="Years" value={years} min={1} max={50} unit="years" onChange={setYears} />
          <SliderField label="Inflation" value={inflation} min={1} max={12} step={0.5} suffix="%" onChange={setInflation} />
          <ControlWide>
            <SliderField label="Expected return" value={rate} min={1} max={20} step={0.5} suffix="%" onChange={setRate} />
          </ControlWide>
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------------- SWP calculator --- */

const SWP_DEFAULTS = {
  corpus: 8_05_256,
  withdrawal: 10_000,
  rate: 10,
  years: 5,
  frequency: "Monthly",
};

function SwpCalculator() {
  const [corpus, setCorpus] = useState(SWP_DEFAULTS.corpus);
  const [withdrawal, setWithdrawal] = useState(SWP_DEFAULTS.withdrawal);
  const [rate, setRate] = useState(SWP_DEFAULTS.rate);
  const [years, setYears] = useState(SWP_DEFAULTS.years);
  const [frequency, setFrequency] = useState(SWP_DEFAULTS.frequency);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await callCalc("getSwpCalcResult", {
        flumpsum_amount: corpus,
        lumpsum_amount: corpus,
        withdrawal_amount: withdrawal,
        interest_rate: rate,
        period: years,
        swp_frequency: frequency,
        years,
      });
      setData(asRecord(payload));
    } catch (err) {
      toast.error(errMessage(err));
    } finally {
      setLoading(false);
    }
  }, [corpus, frequency, rate, withdrawal, years]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 280);
    return () => window.clearTimeout(t);
  }, [load]);

  const totalWithdrawal = Number(data?.total_withdrawal_amount ?? 0);
  const balance = Number(data?.total_balance_amount ?? 0);
  const profit = Number(data?.total_profit ?? 0);
  const xirr = Number(data?.xirr ?? 0);

  return (
    <CalcShell
      headline={{
        label: loading ? "Calculating…" : "Remaining balance",
        value: balance,
        caption: `${formatINR(withdrawal)} ${frequency.toLowerCase()} from ${formatINR(corpus)}.`,
      }}
      stats={[
        { label: "Total withdrawn", value: formatINR(totalWithdrawal) },
        { label: "Total profit", value: formatINR(profit) },
        { label: "XIRR", value: fmtPct(xirr) },
        { label: "Years", value: String(years) },
      ]}
      split={[
        { label: "Withdrawn", value: totalWithdrawal, token: FILL.invested },
        { label: "Left in corpus", value: balance, token: FILL.gain },
      ]}
      categories={["Corpus", "Withdrawn", "Balance"]}
      series={[
        {
          name: "Amount",
          token: LINE.value,
          data: [corpus, totalWithdrawal, balance],
        },
      ]}
      onReset={() => {
        setCorpus(SWP_DEFAULTS.corpus);
        setWithdrawal(SWP_DEFAULTS.withdrawal);
        setRate(SWP_DEFAULTS.rate);
        setYears(SWP_DEFAULTS.years);
        setFrequency(SWP_DEFAULTS.frequency);
      }}
      controls={
        <ControlStack>
          <ControlWide>
            <MoneyField label="Corpus / investment" value={corpus} min={50_000} max={10_00_00_000} step={10_000} onChange={setCorpus} />
          </ControlWide>
          <ControlWide>
            <MoneyField label="Withdrawal amount" value={withdrawal} min={500} max={10_00_000} step={500} onChange={setWithdrawal} />
          </ControlWide>
          <SelectField
            label="Frequency"
            value={frequency}
            options={[
              { value: "Monthly", label: "Monthly" },
              { value: "Quarterly", label: "Quarterly" },
              { value: "Yearly", label: "Yearly" },
            ]}
            onChange={setFrequency}
          />
          <StepperField label="Years" value={years} min={1} max={40} unit="years" onChange={setYears} />
          <ControlWide>
            <SliderField label="Expected return" value={rate} min={1} max={20} step={0.5} suffix="%" onChange={setRate} />
          </ControlWide>
        </ControlStack>
      }
    />
  );
}

/* ------------------------------------------------------------------ index --- */

export function CalculatorPanel({ slug }: { slug: CalculatorSlug }) {
  if (slug === "trailing-returns") return <TrailingReturns />;
  if (slug === "mf-sip-returns") return <MfSipReturns />;
  if (slug === "mf-lumpsum-returns") return <MfLumpsumReturns />;
  if (slug === "swp-return-calculator") return <SwpReturnResearch />;
  if (slug === "lumpsum-calculator") return <LumpsumCalculator />;
  if (slug === "child-education-planner") return <ChildEducationPlanner />;
  if (slug === "retirement-planner") return <RetirementPlanner />;
  if (slug === "goal-setting-calculator") return <GoalSettingCalculator />;
  if (slug === "swp-calculator") return <SwpCalculator />;
  return <SipCalculator />;
}
