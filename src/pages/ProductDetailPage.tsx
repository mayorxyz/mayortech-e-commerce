import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useOrders } from "@/hooks/useOrders";
import { sendOrderEmail } from "@/lib/emailjs";
import { supabase } from "@/lib/supabase";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import { Product } from "@/types/product";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ToastStack from "@/components/ToastStack";
import OrderModal from "@/components/OrderModal";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useSupabaseProducts();
  const { cartItems, addToCart, cartCount, recentlyViewed, addRecentlyViewed, toasts, showToast, addOrderToHistory } = useStore();
  const { placeOrder } = useOrders();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImg, setMainImg] = useState("");
  const [activeThumb, setActiveThumb] = useState(0);
  const [bumpCart, setBumpCart] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const fetchProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("id, name, price, category, description, image_url, video_url, in_stock, sold, created_at, condition, images, specifications, brand, tagline")
        .eq("id", productId)
        .single();

      if (fetchError) {
        setError(fetchError.code === "PGRST116" ? "Product not found" : "Failed to load product");
        setProduct(null);
      } else if (data) {
        const priceNum = data.price;
        const mapped: Product = {
          id: data.id,
          name: data.name,
          price: "₦" + priceNum.toLocaleString("en-NG"),
          priceNum,
          category: data.category,
          condition: data.condition || "Brand New",
          inStock: data.in_stock,
          image: data.image_url || "",
          images: data.images || (data.image_url ? [data.image_url] : []),
          desc: data.description || "",
          specs: "",
          video_url: data.video_url || undefined,
          brand: data.brand || "",
          tagline: data.tagline || "",
          specifications: data.specifications || {},
          sold: data.sold ?? false,
        };
        setProduct(mapped);
        setMainImg(mapped.images[0] || "");
      }
    } catch {
      setError("Failed to load product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
      addRecentlyViewed(id);
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [id, fetchProduct, addRecentlyViewed]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted mb-6">
            {error === "Product not found"
              ? "The product you're looking for doesn't exist or may have been removed."
              : "We couldn't load this product. Please try again later."}
          </p>
          <button onClick={() => navigate("/")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:brightness-90">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isInCart = !!cartItems[product.id];
  const isSold = product.sold || !product.inStock;

  const handleAddToCart = () => {
    addToCart(product);
    setBumpCart(true);
    setTimeout(() => setBumpCart(false), 220);
  };

  const shareProduct = () => {
    const txt = encodeURIComponent(`Check out ${product.name} on MayorTech — ${product.price}. ${window.location.href}`);
    window.open(`https://wa.me/?text=${txt}`, "_blank");
  };

  const handleOrderSubmit = async (data: { name: string; phone: string; email: string; address: string }): Promise<boolean> => {
    if (!data.name || !data.phone || !data.email || !data.address) {
      showToast("Please fill in all fields", "unbookmark", "!");
      return false;
    }
    const result = await placeOrder({
      customer_name: data.name,
      customer_phone: data.phone,
      customer_address: data.address,
      items: [{ productName: product.name, price: product.price, quantity: 1, image: product.image }],
      total_amount: product.priceNum,
    });
    if (!result.success) {
      showToast(result.error || "Failed to place order", "unbookmark", "!");
      return false;
    }
    addOrderToHistory({ productName: product.name, customerName: data.name, phone: data.phone, email: data.email, status: "confirmed", timestamp: Date.now() }, product);
    sendOrderEmail({ productName: product.name, customerName: data.name, phone: data.phone, email: data.email });
    showToast(`Order placed for <strong>${product.name}</strong> — we'll be in touch!`, "order", "✓");
    return true;
  };

  const condColors: Record<string, string> = {
    "Brand New": "bg-green-500",
    "UK Used": "bg-amber-500",
    "Foreign Used": "bg-blue-500",
  };

  const specsList = Object.entries(product.specifications || {});
  const recentProducts = recentlyViewed.filter((x) => x !== id).slice(0, 4).map((rid) => products.find((p) => p.id === rid)).filter(Boolean);
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastStack toasts={toasts} />
      <div className="detail-hdr">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Mayor<span>Tech</span>
        </div>
        <button className="cart-btn-sm" onClick={() => navigate("/cart")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
          </svg>
          <div className={`ccnt${bumpCart ? " bump" : ""}`}>{cartCount}</div>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="gallery">
        <div className="gallery-main">
          <img src={mainImg || product.images[0]} alt={product.name} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
        </div>
        {product.images.length > 1 && (
          <div className="gallery-thumbs">
            {product.images.map((img, i) => (
              <div key={i} className={`thumb${activeThumb === i ? " active" : ""}`} onClick={() => { setMainImg(img); setActiveThumb(i); }}>
                <img src={img} alt="" />
              </div>
            ))}
          </div>
        )}
        <div className="gallery-badges">
          <span className={`inline-block text-white text-xs px-2 py-1 rounded ${condColors[product.condition] || "bg-gray-500"}`}>
            {product.condition}
          </span>
          {product.sold && <span className="inline-block bg-destructive text-white text-xs px-2 py-1 rounded font-bold ml-2">Sold</span>}
        </div>
        {isSold && <div className="gallery-sold">Sold Out</div>}
      </div>

      <div className="dbody">
        <div className="dcat">{product.category.toUpperCase()}</div>
        <div className="dname">{product.name}</div>
        {product.brand && <div className="text-sm text-muted mb-2">{product.brand}</div>}
        {product.tagline && <div className="text-sm text-muted-foreground/70 mb-2">{product.tagline}</div>}
        <div className="dprice">{product.price}</div>
        <div className="dmeta-row">
          <div className="dchip">{product.condition || "Brand New"}</div>
          <div className="dchip" style={{ color: product.inStock ? "#64dc82" : "var(--muted)" }}>
            {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
          </div>
        </div>

        <button className="bshare" onClick={shareProduct}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Share on WhatsApp
        </button>

        <div className="ddiv" />
        <div className="dsec-title">About this device</div>
        <div className="ddesc">{product.desc}</div>

        {specsList.length > 0 && (
          <>
            <div className="ddiv" />
            <div className="dsec-title">Specifications</div>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {specsList.map(([key, value], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface2"}>
                      <td className="py-2.5 px-3 font-medium text-foreground w-2/5">{key}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="ddiv" />
        <div className="dsec-title">Delivery &amp; Payment</div>
        <div className="deliv-box">
          We deliver across Port Harcourt same-day and can arrange nationwide delivery 1–3 days via courier.{" "}
          <strong style={{ color: "var(--text)" }}>No upfront payment required</strong> — confirm your order, we contact you, and you pay on delivery (within PH) or via bank transfer before dispatch (nationwide).
        </div>
      </div>

      {recentProducts.length > 0 && (
        <div className="rel-section">
          <div className="section-title">Recently viewed</div>
          <div className="hscroll">
            {recentProducts.map((r: any) => (
              <div key={r.id} className="rcard" onClick={() => navigate(`/product/${r.id}`)}>
                <img src={r.image} alt={r.name} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                <div className="rcard-b">
                  <div className="rcard-n">{r.name}</div>
                  <div className="rcard-p">{r.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div className="rel-section">
          <div className="section-title">You might also like</div>
          <div className="hscroll">
            {relatedProducts.map((r) => (
              <div key={r.id} className="rcard" onClick={() => navigate(`/product/${r.id}`)}>
                <img src={r.image} alt={r.name} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
                <div className="rcard-b">
                  <div className="rcard-n">{r.name}</div>
                  <div className="rcard-p">{r.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 84 }} />

      <div className="dcta">
        {isSold ? (
          <button className="bs3 w-full" disabled>Sold Out</button>
        ) : (
          <>
            <button className={`bs2${isInCart ? " saved" : ""}`} onClick={handleAddToCart}>
              {isInCart ? "✓" : "+"}
            </button>
            <button className="bo2" onClick={() => setOrderOpen(true)}>Order Now →</button>
          </>
        )}
      </div>

      <WhatsAppFloat className="detail-wa" />

      {orderOpen && (
        <OrderModal product={product} onClose={() => setOrderOpen(false)} onSubmit={handleOrderSubmit} />
      )}
    </div>
  );
}
