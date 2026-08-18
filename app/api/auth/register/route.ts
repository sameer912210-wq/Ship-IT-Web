import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function validatePassword(pw: string) {
  const minLength = 6;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return pw.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, address, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: "Password does not meet complexity rules" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        phone: phone || null,
        email: email.toLowerCase(),
        address: address || null,
        passwordHash,
      },
    });

    const safeUser = { id: user.id, fullName: user.fullName, phone: user.phone, email: user.email, address: user.address, createdAt: user.createdAt };
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
