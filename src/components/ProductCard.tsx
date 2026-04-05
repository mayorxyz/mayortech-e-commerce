import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface Props {
  product: Product;
  isSaved: boolean;
  onSave: () => void;
  onOrder: () => void;
}

function condBadge(c: string) {
  const colors = {
    "Brand New": "bg-green-500",
    "UK Used": "bg-amber-500", 
    "Foreign Used": "bg-blue-500"
  };
  return <span className={`cbadge absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${colors[c as keyof typeof colors] || "bg-gray-500"}`}>{c}</span>;
}

export default function ProductCard({ product, isSaved, onSave, onOrder }: Props) {
  const [descOpen, setDescOpen] = useState(false);
  const navigate = useNavigate();

  const specsPreview = product.specs
    .split("|")
    .slice(0, 3)
    .map((s) => s.split(":").slice(1).join(":").trim())
    .join(" · ");

  return (
    <div className="card">
      <div className="card-img" onClick={() => navigate(`/product/${product.id}`)}>
        <span className="ctag">{product.category}</span>
        {condBadge(product.condition)}
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.2";
          }}
        />
        {!product.inStock && <div className="sold-ov">Sold Out</div>}
      </div>

      <div className="card-body">
        <div className="cname" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</div>
        {product.brand && <div className="text-xs text-muted mb-1">{product.brand}</div>}
        {product.tagline && <div className="text-sm text-foreground/80 mb-2">{product.tagline}</div>}
        <div className="cprice">{product.price}</div>
      </div>

      <div
        className={`dtog${descOpen ? " open" : ""}`}
        onClick={() => setDescOpen(!descOpen)}
      >
        <span>Quick specs</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className={`dpanel${descOpen ? " open" : ""}`}>
        <div className="dpanel-in">
          <strong>Overview</strong>
          {product.desc.substring(0, 110)}...
          <br /><br />
          <strong>Key specs</strong>
          {specsPreview}
        </div>
      </div>

      <div className="cact">
        <button
          className={`bsave${isSaved ? " saved" : ""}`}
          onClick={onSave}
        >
          {isSaved ? "✓" : "+"}
        </button>
        {product.inStock ? (
          <button className="border-btn" onClick={onOrder}>Order Now</button>
        ) : (
          <button className="bsold" disabled>Sold Out</button>
        )}
      </div>
    </div>
  );
}
