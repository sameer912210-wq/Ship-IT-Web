import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-black">Order confirmed</h1>
        <p className="mt-3 text-lg text-gray-600">
          Your Ship-IT order is on the way. A confirmation email has been queued for your inbox.
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-600">
          <div className="flex items-center gap-2 font-semibold text-black">
            <Mail className="h-4 w-4 text-orange-600" /> Mock email notification
          </div>
          <p className="mt-2">Subject: Your Ship-IT order has been confirmed</p>
          <p className="mt-1">We’ve prepared your shipping label and will keep you updated during dispatch.</p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600">
            Continue shopping
          </Link>
          <Link href="/contact" className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
