import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
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
