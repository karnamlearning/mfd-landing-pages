import { NextResponse } from "next/server";

export function notImplemented(resource: string) {
  return NextResponse.json(
    { resource, status: "not_implemented" },
    { status: 501 },
  );
}
