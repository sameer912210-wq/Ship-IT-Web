import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json({ ok: true });
    res.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "strict",
      secure: isProd,
    });
    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
