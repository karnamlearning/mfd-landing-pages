import { NextResponse } from "next/server";
import {
  isResearchEndpoint,
  RESEARCH_ENDPOINTS,
  researchSourceFor,
  type ResearchEndpointName,
} from "@/lib/research-endpoints";
import type { KeyProfile } from "@/lib/calc-endpoints";

/**
 * Server-side proxy for Advisorkhoj MF research APIs.
 * Mirrors `/api/calc/[endpoint]`: keys stay server-side, endpoint must be allowlisted.
 */

const BASE = process.env.ADVISORKHOJ_MF_API_BASE || "https://mfapi.advisorkhoj.com";

const KEYS: Record<KeyProfile, string | undefined> = {
  default: process.env.ADVISORKHOJ_KEY_DEFAULT,
  website: process.env.ADVISORKHOJ_KEY_WEBSITE,
  calc: process.env.ADVISORKHOJ_KEY_CALC,
};

const RESERVED = new Set(["key", "source"]);

type Ctx = { params: Promise<{ endpoint: string }> };

async function proxy(request: Request, ctx: Ctx) {
  const { endpoint } = await ctx.params;

  if (!isResearchEndpoint(endpoint)) {
    return NextResponse.json({ error: `Unknown research endpoint: ${endpoint}` }, { status: 404 });
  }

  const name = endpoint as ResearchEndpointName;
  const config = RESEARCH_ENDPOINTS[name];
  const key = KEYS[config.keyProfile];

  if (!key) {
    return NextResponse.json(
      {
        error: "Research API key is not configured",
        detail: `Set the env var for the "${config.keyProfile}" key profile. See .env.example.`,
      },
      { status: 503 },
    );
  }

  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();
  incoming.forEach((value, param) => {
    if (!RESERVED.has(param.toLowerCase())) params.append(param, value);
  });

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
      /* query-string only is valid */
    }
  }

  const source = researchSourceFor(name);
  if (source) params.set("source", source);
  params.set("key", key);

  const upstream = `${BASE}/${name}?${params.toString()}`;

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
      { error: "Could not reach the research API" },
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
