import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function parseTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    const token = parseTokenFromCookie(req.headers.get("cookie"));
    if (!token) return NextResponse.json({ user: null });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return NextResponse.json({ user: null });

    const safeUser = { id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, address: user.address, createdAt: user.createdAt };
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error("/api/auth/me error:", err);
    return NextResponse.json({ user: null });
  }
}
