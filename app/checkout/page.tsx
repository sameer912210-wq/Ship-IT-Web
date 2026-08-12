"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { ArrowRight, CheckCircle2, CreditCard, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, customer: form }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid non-JSON response.");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process checkout. Please try again.");
      }

      if (data?.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response received from checkout server.");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setError(err?.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Checkout</p>
            <h1 className="text-3xl font-semibold text-black">Secure payment, step by step</h1>
          </div>
          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            Step {step} of 3
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 text-orange-600"><MapPin className="h-5 w-5" /></div>
                    <div>
                      <h2 className="font-semibold text-black">Shipping details</h2>
                      <p className="text-sm text-gray-600">We’ll send your order to the address below.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input placeholder="Full name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                    <Input placeholder="Email address" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                    <Input className="md:col-span-2" placeholder="Street address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    <Input placeholder="City" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
                    <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} className="bg-black text-white hover:bg-orange-600">Review order</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 text-orange-600"><PackageCheck className="h-5 w-5" /></div>
                    <div>
                      <h2 className="font-semibold text-black">Review order</h2>
                      <p className="text-sm text-gray-600">Confirm your items and shipping before payment.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3">
                        <div>
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)} className="bg-black text-white hover:bg-orange-600">Continue to payment</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-orange-100 p-2 text-orange-600"><CreditCard className="h-5 w-5" /></div>
                    <div>
                      <h2 className="font-semibold text-black">Payment</h2>
                      <p className="text-sm text-gray-600">Use Stripe test mode to complete your purchase.</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                    This demo uses Stripe test mode. No real charges will be made.
                  </div>
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button onClick={handlePayNow} disabled={isProcessing} className="bg-black text-white hover:bg-orange-600">
                      {isProcessing ? "Preparing checkout..." : "Pay now"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 text-orange-600"><CheckCircle2 className="h-4 w-4" /> Secure checkout and tracked delivery</div>
            </div>
            <Link href="/cart" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              <ArrowRight className="h-4 w-4" /> Return to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
