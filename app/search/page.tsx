import products from "@/data/products.json";
import Link from "next/link";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }> | { query?: string };
}) {
  const resolvedParams = searchParams ? (searchParams instanceof Promise ? undefined : searchParams) : undefined;
  const searchTerm = resolvedParams?.query ?? "";

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const matches = products.filter((product) => {
    const haystack = `${product.name} ${product.description}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black">Search results</h1>
          <p className="mt-2 text-gray-600">
            {normalizedQuery
              ? `Showing products matching “${normalizedQuery}”`
              : "Search across our latest essentials."}
          </p>
        </div>

        {matches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 h-40 rounded-xl bg-gray-100" />
                <h2 className="font-semibold text-black">{product.name}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="mt-4 font-semibold text-orange-600">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            No products matched your search yet.
          </div>
        )}
      </div>
    </div>
  );
}
