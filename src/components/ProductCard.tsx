import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { Plus, ChevronDown } from "lucide-react";

interface Props {
  product: Product;
  inCart: boolean;
  onAddToCart: () => void;
  onOrder: () => void;
}

function condBadgeClass(c: string) {
  if (c === "Brand New") return "cbadge new";
  if (c === "UK Used") return "cbadge uk";
  if (c === "Foreign Used") return "cbadge ng";
  return "cbadge";
}

export default function ProductCard({ product, inCart, onAddToCart, onOrder }: Props) {
  const navigate = useNavigate();
  const isSold = product.sold || !product.inStock;
  const [specsOpen, setSpecsOpen] = useState(false);

  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;

  return (
    <div className="card" onClick={() => !isSold && navigate(`/product/${product.id}`)} style={{ cursor: !isSold ? 'pointer' : 'default' }}>
      <div className="card-img">
        <span className="ctag">{product.category}</span>
        <span className={condBadgeClass(product.condition)}>{product.condition}</span>
        {product.sold && <span className="sold-badge">Sold</span>}
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
        {product.brand && <div className="text-[10px] text-[var(--muted)] mb-0.5">{product.brand}</div>}
        <div className="cname" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</div>
        {product.tagline && <div className="text-[10px] text-[var(--muted)] mt-0.5 line-clamp-1">{product.tagline}</div>}
        <div className="cprice">{product.price}</div>
      </div>

      {hasSpecs && (
        <>
          <div className={`dtog${specsOpen ? " open" : ""}`} onClick={() => setSpecsOpen(!specsOpen)}>
            <span>Quick specs</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <div className={`dpanel${specsOpen ? " open" : ""}`}>
            <div className="dpanel-in">
              {Object.entries(product.specifications!).map(([k, v]) => (
                <div key={k}><strong>{k}:</strong> {v}</div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="cact">
        {isSold ? (
          <button className="bsold" disabled>Sold Out</button>
        ) : (
          <>
            <button
              className={`bsave${inCart ? " saved" : ""}`}
              onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              aria-label="Add to cart"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="border-btn"
              onClick={(e) => { e.stopPropagation(); onOrder(); }}
            >
              Order Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
