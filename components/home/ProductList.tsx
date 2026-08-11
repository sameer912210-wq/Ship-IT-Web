"use client";

import ProductFilters from "@/components/home/ProductFilters";
import products from "@/data/products.json";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const LazyProductCard = dynamic(() => import("./ProductCard"), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />,
});

export default function ProductList() {
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, [category, maxPrice]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        (category === "Running" && /runner|running/i.test(product.name)) ||
        (category === "Street" && /street|urban|retro|vibe|core/i.test(product.name)) ||
        (category === "Classic" && /classic|court|retro/i.test(product.name)) ||
        (category === "Performance" && /edge|react|volt|flow|aero/i.test(product.name)) ||
        (category === "Lifestyle" && /zenith|nova|pulse|aero|urban/i.test(product.name));
      const matchesPrice = !maxPrice || product.price <= Number(maxPrice);
      return matchesCategory && matchesPrice;
    });
  }, [category, maxPrice]);

  return (
    <div className="mx-auto max-w-7xl">
      <ProductFilters
        category={category}
        maxPrice={maxPrice}
        onCategoryChange={setCategory}
        onMaxPriceChange={setMaxPrice}
        onClear={() => {
          setCategory("All");
          setMaxPrice("");
        }}
      />

      {isLoading ? (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
          Loading curated picks...
        </div>
      ) : null}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => <LazyProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">No products found</h3>
            <p className="mb-4 text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}
