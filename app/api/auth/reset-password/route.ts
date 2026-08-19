import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function parseTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Try to get logged in user first
    const token = parseTokenFromCookie(req.headers.get("cookie"));
    let userId: string | null = null;
    if (token) {
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        userId = payload.sub;
      } catch (e) {
        // Ignore token verify error and fallback
      }
    }

    let user;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
