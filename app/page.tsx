import ProductList from "@/components/home/ProductList";
import { ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
      <section className="px-4 py-10 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
              <Sparkles className="h-4 w-4" />
              Smart shipping for modern essentials
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
                Ship smarter, shop sharper.
              </h1>
              <p className="max-w-2xl text-lg text-gray-600">
                Discover premium products, fast delivery, and a checkout experience designed for today’s pace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/cart" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600">
                Meet the team
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-orange-600" /> Next-day dispatch</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-orange-600" /> Secure checkout</div>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-gradient-to-br from-orange-500 via-orange-400 to-blue-600 p-6 text-white">
            <div className="rounded-[1.25rem] border border-white/20 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-white/80">Featured release</p>
              <h2 className="mt-3 text-2xl font-semibold">Curated essentials for every route</h2>
              <p className="mt-3 text-sm text-white/90">From commuting to weekend escape, Ship-IT pairs premium quality with effortless delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Trending now</p>
              <h2 className="text-2xl font-semibold text-black">Modern picks, built to move</h2>
            </div>
          </div>
          <ProductList />
        </div>
      </section>
    </div>
  );
}
