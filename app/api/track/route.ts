import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path || typeof path !== "string" || path.startsWith("/admin")) {
      return NextResponse.json({ ok: true });
    }
    await getSupabaseAdmin().from("page_views").insert({ path });
  } catch {
    // falha silenciosa — não quebra a página se o tracking falhar
  }
  return NextResponse.json({ ok: true });
}
