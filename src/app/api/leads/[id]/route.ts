import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

interface Params { params: Promise<{ id: string }> }

// ── PATCH /api/leads/[id] ─────────────────────────────────────────────────────
// Update lead status: New | Contacted | Closed
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const allowed = ["New", "Contacted", "Closed"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await query("UPDATE leads SET status = $1 WHERE id = $2", [status, id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/leads/[id]]", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// ── DELETE /api/leads/[id] ────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await query("DELETE FROM leads WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/leads/[id]]", err);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
