import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function parseTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    const token = parseTokenFromCookie(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId: string;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      userId = payload.sub;
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = parseTokenFromCookie(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId: string;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      userId = payload.sub;
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderIds } = await req.json();
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "No orders selected for deletion" }, { status: 400 });
    }

    const result = await prisma.order.deleteMany({
      where: {
        id: { in: orderIds },
        userId,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `${result.count} order(s) deleted successfully.`,
    });
  } catch (err) {
    console.error("Delete orders error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
