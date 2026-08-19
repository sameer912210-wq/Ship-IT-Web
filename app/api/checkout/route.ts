import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

function parseTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|; )token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  try {
    const cookieHeader = (request as NextRequest).headers.get("cookie");
    const token = parseTokenFromCookie(cookieHeader);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let userId: string;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      userId = payload.sub;
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart, customer } = await request.json();

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customer || !customer.name || !customer.email || !customer.address || !customer.city || !customer.postalCode) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }

    // Calculate total
    const subtotal = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;

    // Save the order to DB
    await prisma.order.create({
      data: {
        userId,
        items: cart, // Json field
        total,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
      },
    });

    // Simulate network processing delay for a realistic checkout experience
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect directly to the local checkout success page
    const successUrl = "/checkout/success";

    return NextResponse.json({ url: successUrl });
  } catch (error: any) {
    console.error("Mock Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred during checkout processing." },
      { status: 500 }
    );
  }
}
