import { NextResponse } from "next/server";
import {
  CALC_ENDPOINTS,
  isCalcEndpoint,
  pathFor,
  sourceFor,
  type CalcEndpointName,
  type KeyProfile,
} from "@/lib/calc-endpoints";

/**
 * Server-side proxy for the Advisorkhoj MF calculator API.
 *
 * It exists so the API key never reaches the browser bundle. The client calls
 * `/api/calc/<endpoint>` with the calculator's own params; this handler adds
 * `source` and `key` and forwards to the upstream.
 *
 * Two deliberate restrictions:
 *   - `endpoint` must appear in CALC_ENDPOINTS. Without that allowlist this
 *     route would be an open proxy to any path on the upstream host.
 *   - Client-supplied `key` and `source` are dropped, so a caller cannot
 *     override the signing key or spoof the source attribution.
 */

const BASE = process.env.ADVISORKHOJ_MF_API_BASE || "https://mfapi.advisorkhoj.com";

const KEYS: Record<KeyProfile, string | undefined> = {
  default: process.env.ADVISORKHOJ_KEY_DEFAULT,
  website: process.env.ADVISORKHOJ_KEY_WEBSITE,
  calc: process.env.ADVISORKHOJ_KEY_CALC,
};

/** Params the caller is never allowed to set. */
const RESERVED = new Set(["key", "source"]);

type Ctx = { params: Promise<{ endpoint: string }> };

async function proxy(request: Request, ctx: Ctx) {
  const { endpoint } = await ctx.params;

  if (!isCalcEndpoint(endpoint)) {
    return NextResponse.json({ error: `Unknown calculator: ${endpoint}` }, { status: 404 });
  }

  const name = endpoint as CalcEndpointName;
  const config = CALC_ENDPOINTS[name];
  const key = KEYS[config.keyProfile];

  if (!key) {
    return NextResponse.json(
      {
        error: "Calculator API key is not configured",
        detail: `Set the env var for the "${config.keyProfile}" key profile. See .env.example.`,
      },
      { status: 503 },
    );
  }

  // Start from the caller's params, minus anything reserved.
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  incoming.forEach((value, param) => {
    if (!RESERVED.has(param.toLowerCase())) params.append(param, value);
  });

  // A POST body is accepted as a convenience for callers with many params
  // (the composite goal planner has 23), but the upstream still wants them on
  // the query string.
  if (request.method === "POST") {
    try {
      const body = (await request.json()) as Record<string, unknown> | null;
      if (body && typeof body === "object") {
        for (const [param, value] of Object.entries(body)) {
          if (RESERVED.has(param.toLowerCase())) continue;
          if (value === undefined || value === null || value === "") continue;
          params.set(param, String(value));
        }
      }
    } catch {
      // No body, or not JSON. Query-string params alone are valid.
    }
  }

  const source = sourceFor(name);
  if (source) params.set("source", source);
  params.set("key", key);

  const upstream = `${BASE}${pathFor(name)}?${params.toString()}`;

  try {
    const res = await fetch(upstream, {
      method: config.method,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await res.text();
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: "Upstream returned a non-JSON response", body: text.slice(0, 500) };
    }

    return NextResponse.json(payload, {
      status: res.ok ? 200 : res.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the calculator API" },
      { status: 502 },
    );
  }
}

export async function GET(request: Request, ctx: Ctx) {
  return proxy(request, ctx);
}

export async function POST(request: Request, ctx: Ctx) {
  return proxy(request, ctx);
}
