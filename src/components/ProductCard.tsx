import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";

interface Props {
  product: Product;
  inCart: boolean;
  onAddToCart: () => void;
  onOrder: () => void;
}

function condBadge(c: string) {
  const colors: Record<string, string> = {
    "Brand New": "bg-green-500",
    "UK Used": "bg-amber-500",
    "Foreign Used": "bg-blue-500",
  };
  return (
    <span
      className={`absolute top-2 right-2 text-white text-[10px] px-2 py-0.5 rounded-full z-10 ${
        colors[c] || "bg-gray-500"
      }`}
    >
      {c}
    </span>
  );
}

export default function ProductCard({ product, inCart, onAddToCart, onOrder }: Props) {
  const navigate = useNavigate();
  const isSold = product.sold || !product.inStock;

  return (
    <div className="card">
      <div className="card-img" onClick={() => navigate(`/product/${product.id}`)}>
        <span className="ctag">{product.category}</span>
        {condBadge(product.condition)}
        {product.sold && (
          <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-1 rounded font-bold z-10">
            Sold
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.2";
          }}
        />
        {isSold && <div className="sold-ov">Sold Out</div>}
      </div>

      <div className="card-body">
        {product.brand && <div className="text-xs text-muted mb-0.5">{product.brand}</div>}
        <div className="cname" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</div>
        {product.tagline && <div className="text-xs text-muted-foreground/70 mb-1 line-clamp-1">{product.tagline}</div>}
        <div className="flex items-end justify-between">
          <div className="cprice">{product.price}</div>
          {!isSold && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                inCart
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {isSold && (
            <span className="text-xs text-destructive font-semibold">Sold Out</span>
          )}
        </div>
      </div>
    </div>
  );
}
