import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types/product";

interface Props {
  product: Product;
  isSaved: boolean;
  onSave: () => void;
  onOrder: () => void;
}

export default function ProductCard({ product, isSaved, onSave, onOrder }: Props) {
  const [descOpen, setDescOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:-translate-y-0.5 group">
      {/* Image */}
      <div className="w-full aspect-square bg-surface2 flex items-center justify-center overflow-hidden relative">
        <span className="absolute top-2.5 left-2.5 bg-[rgba(14,14,15,0.7)] border border-border text-muted text-[10px] font-medium py-[3px] px-2 rounded-full uppercase tracking-wider">
          {product.category}
        </span>
        <img
          src={product.image}
          alt={product.name}
          className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.3";
          }}
        />
      </div>

      {/* Body */}
      <div className="p-3.5 pb-0 flex-1">
        <div className="font-heading font-semibold text-sm leading-tight text-foreground">
          {product.name}
        </div>
        <div className="text-[13px] font-medium text-primary mt-1">{product.price}</div>
      </div>

      {/* Desc Toggle */}
      <div
        onClick={() => setDescOpen(!descOpen)}
        className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer border-t border-border mt-2.5 text-muted text-xs transition-colors hover:text-foreground select-none`}
      >
        <span>Specs &amp; description</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-[250ms] shrink-0 ${descOpen ? "rotate-180" : ""}`}
        />
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out bg-surface2 ${
          descOpen ? "max-h-[200px]" : "max-h-0"
        }`}
      >
        <div className="p-3.5 text-xs leading-[1.65] text-muted">
          <strong className="block text-foreground text-[11px] uppercase tracking-wider mb-1 font-heading">
            Overview
          </strong>
          {product.desc}
          <br />
          <br />
          <strong className="block text-foreground text-[11px] uppercase tracking-wider mb-1 mt-2 font-heading">
            Specs
          </strong>
          {product.specs}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-3.5 pt-3 items-center">
        <button
          onClick={onSave}
          className={`w-9 h-9 shrink-0 rounded-[10px] border flex items-center justify-center text-lg leading-none font-body transition-all cursor-pointer
            ${
              isSaved
                ? "text-primary border-primary bg-[rgba(232,255,71,0.08)] text-sm"
                : "bg-surface2 border-border text-muted hover:text-primary hover:border-primary"
            }
          `}
        >
          {isSaved ? "✓" : "+"}
        </button>
        <button
          onClick={onOrder}
          className="flex-1 h-9 rounded-[10px] bg-primary border-none text-primary-foreground font-heading font-bold text-[13px] cursor-pointer transition-all hover:brightness-90 active:scale-[0.97]"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
