import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

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

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart, customer } = await request.json();

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
