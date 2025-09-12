// app/api/agents/route-lead/route.ts
import { NextResponse } from "next/server";

const API_BASE = process.env.AGENTS_API_BASE || "http://127.0.0.1:8080";

export async function POST(req: Request) {
  const body = await req.json();
  const r = await fetch(`${API_BASE}/agents/route-lead`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    // send cookies/headers if you need auth later
  });
  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
