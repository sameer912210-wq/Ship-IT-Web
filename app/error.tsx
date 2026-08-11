"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-black">Something went wrong</h2>
        <p className="mt-3 text-sm text-gray-600">The page could not be loaded. Please try again.</p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
