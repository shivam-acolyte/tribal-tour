import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const admin = await queryOne(
      "SELECT id, username FROM admins WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: admin.username });
  } catch (err: any) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json({ error: "Login failed. Check your database connection." }, { status: 500 });
  }
}
