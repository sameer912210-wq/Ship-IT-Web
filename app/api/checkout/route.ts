import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const { cart, customer } = await request.json();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-07-29.dahlia",
  });

  const lineItems = cart.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`,
    customer_email: customer?.email || undefined,
    line_items: lineItems,
    metadata: {
      customerName: customer?.name || "",
    },
  });

  return NextResponse.json({ url: session.url });
}
