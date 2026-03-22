import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types/product";

interface Props {
  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;
  sortValue: string;
  onSortChange: (val: string) => void;
}

function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export default function PriceFilter({ priceMin, priceMax, onPriceChange, sortValue, onSortChange }: Props) {
  const handleMin = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onPriceChange(Math.min(val, priceMax), priceMax);
  }, [priceMax, onPriceChange]);

  const handleMax = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    onPriceChange(priceMin, Math.max(val, priceMin));
  }, [priceMin, onPriceChange]);

  const resetPrice = () => onPriceChange(0, 2000000);

  const pct1 = (priceMin / 2000000) * 100;
  const pct2 = (priceMax / 2000000) * 100;

  return (
    <div className="filter-row">
      <div className="price-wrap">
        <div className="price-label">
          <span>{fmt(priceMin)} — {fmt(priceMax)}</span>
          <a onClick={resetPrice}>Reset</a>
        </div>
        <div className="range-track">
          <div className="range-fill" style={{ left: `${pct1}%`, right: `${100 - pct2}%` }} />
          <div className="range-wrap">
            <input type="range" min="0" max="2000000" step="10000" value={priceMin} onInput={handleMin as any} onChange={handleMin} />
            <input type="range" min="0" max="2000000" step="10000" value={priceMax} onInput={handleMax as any} onChange={handleMax} />
          </div>
        </div>
      </div>
      <select className="sort-sel" value={sortValue} onChange={(e) => onSortChange(e.target.value)}>
        <option value="newest">Newest first</option>
        <option value="asc">Price: Low → High</option>
        <option value="desc">Price: High → Low</option>
        <option value="az">Name: A–Z</option>
      </select>
    </div>
  );
}
