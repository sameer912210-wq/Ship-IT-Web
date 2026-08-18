import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProd ? "; Secure" : ""}`;
    const res = NextResponse.json({ ok: true });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
