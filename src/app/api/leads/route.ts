import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

// ── GET /api/leads ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const rows = await query(`
      SELECT id, name, email, phone, subject, message, status,
             created_at AS "created_at"
      FROM leads
      ORDER BY created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("[GET /api/leads]", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// ── POST /api/leads ────────────────────────────────────────────────────────────
// Used by contact form, booking modal, popup, etc.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, destination, source } = body;
    let { subject, message } = body;

    if (!name && !email && !phone) {
      return NextResponse.json({ error: "At least name, email, or phone is required" }, { status: 400 });
    }

    if (!subject) {
      if (destination) {
        subject = `Booking Inquiry: ${destination}`;
      } else if (source) {
        subject = `Inquiry from ${source}`;
      } else {
        subject = "Website Inquiry";
      }
    }

    if (!message) {
      if (destination || source) {
        message = `Inquiry received from ${source || "Website"}${destination ? ` for destination: ${destination}` : ""}.`;
      } else {
        message = "No message provided.";
      }
    }

    const rows = await query<{ id: string }>(
      `INSERT INTO leads (name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, 'New')
       RETURNING id`,
      [name || "Anonymous", email || "", phone || "", subject, message]
    );

    return NextResponse.json({ success: true, id: rows[0]?.id }, { status: 201 });
  } catch (err: any) {
    console.error("[POST /api/leads]", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
