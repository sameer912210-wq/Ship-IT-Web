"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
  category: string;
  maxPrice: string;
  onCategoryChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onClear: () => void;
}

const categories = ["All", "Running", "Street", "Classic", "Performance", "Lifestyle"];

export default function ProductFilters({
  category,
  maxPrice,
  onCategoryChange,
  onMaxPriceChange,
  onClear,
}: ProductFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal className="h-4 w-4 text-orange-600" />
          Filters
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              onClick={() => onCategoryChange(item)}
              className={cn(category === item && "bg-black text-white hover:bg-orange-600")}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-36"
          />
          <Button variant="ghost" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
