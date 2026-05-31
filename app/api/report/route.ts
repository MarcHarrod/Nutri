import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // TODO: persist reports to Supabase or send to an email/webhook
  // For now, log and acknowledge.
  console.log("[report]", JSON.stringify(body));

  return NextResponse.json({ ok: true });
}
