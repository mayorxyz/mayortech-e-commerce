import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useOrders } from "@/hooks/useOrders";
import { sendOrderEmail } from "@/lib/emailjs";
import { products } from "@/data/products";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ToastStack from "@/components/ToastStack";
import OrderModal from "@/components/OrderModal";

const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

function condLabel(c: string) {
  return { new: "Brand New", uk: "UK Used", ng: "Nigerian Used" }[c] || "Brand New";
}

function condBadge(c: string) {
  if (c === "uk") return <span className="cbadge uk">UK Used</span>;
  if (c === "ng") return <span className="cbadge ng">NG Used</span>;
  return <span className="cbadge new">Brand New</span>;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedItems, toggleSave, cartCount, recentlyViewed, addRecentlyViewed, toasts, showToast, addOrderToHistory } = useStore();
  const { placeOrder } = useOrders();

  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const [mainImg, setMainImg] = useState(product?.images[0] || "");
  const [activeThumb, setActiveThumb] = useState(0);
  const [bumpCart, setBumpCart] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  // Track recently viewed
  useMemo(() => {
    if (id) addRecentlyViewed(id);
  }, [id]);

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)" }}>Product not found.</p>
      </div>
    );
  }

  const isSaved = savedItems.has(product.id);

  const handleSave = () => {
    toggleSave(product);
    setBumpCart(true);
    setTimeout(() => setBumpCart(false), 220);
  };

  const shareProduct = () => {
    const txt = encodeURIComponent(`Check out ${product.name} on MayorTech — ${product.price}. ${window.location.href}`);
    window.open(`https://wa.me/?text=${txt}`, "_blank");
  };

  const setThumb = (img: string, idx: number) => {
    setMainImg(img);
    setActiveThumb(idx);
  };

  const handleOrderSubmit = async (data: { name: string; phone: string; email: string }) => {
    if (!data.name || !data.phone || !data.email) {
      showToast("Please fill in all fields", "unbookmark", "!");
      return;
    }
    const orderData = {
      productId: product.id,
      productName: product.name,
      customerName: data.name,
      phone: data.phone,
      email: data.email,
      status: "pending",
      timestamp: Date.now(),
    };
    await placeOrder(orderData);
    addOrderToHistory(orderData, product);
    sendOrderEmail({ productName: product.name, customerName: data.name, phone: data.phone, email: data.email });
    setOrderOpen(false);
    showToast(`Order placed for <strong>${product.name}</strong> — we'll be in touch!`, "order", "✓");
  };

  const recentProducts = recentlyViewed
    .filter((x) => x !== id)
    .slice(0, 4)
    .map((rid) => products.find((p) => p.id === rid))
    .filter(Boolean);

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5);

  const specsList = product.specs.split("|").map((s) => {
    const parts = s.split(":");
    return parts.length >= 2
      ? { label: parts[0].trim(), value: parts.slice(1).join(":").trim() }
      : { label: "", value: s };
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastStack toasts={toasts} />
      <div className="detail-hdr">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Mayor<span>Tech</span>
        </div>
        <button className="cart-btn-sm" onClick={() => navigate("/saved")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          <div className={`ccnt${bumpCart ? " bump" : ""}`}>{cartCount}</div>
        </button>
      </div>

      <div className="gallery">
        <div className="gallery-main">
          <img src={mainImg || product.images[0]} alt={product.name} onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }} />
        </div>
        {product.images.length > 1 && (
          <div className="gallery-thumbs">
            {product.images.map((img, i) => (
              <div key={i} className={`thumb${activeThumb === i ? " active" : ""}`} onClick={() => setThumb(img, i)}>
                <img src={img} alt="" />
              </div>
            ))}
          </div>
        )}
        <div className="gallery-badges">{condBadge(product.condition)}</div>
        {!product.inStock && <div className="gallery-sold">Sold Out</div>}
      </div>

      <div className="dbody">
        <div className="dcat">{product.category.toUpperCase()}</div>
        <div className="dname">{product.name}</div>
        <div className="dprice">{product.price}</div>
        <div className="dmeta-row">
          <div className="dchip">{condLabel(product.condition)}</div>
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
        <div className="ddiv" />
        <div className="dsec-title">Specifications</div>
        <div className="specs-g">
          {specsList.map((s, i) => (
            <div key={i} className="spec-chip">
              {s.label && <span>{s.label}</span>}
              {s.value}
            </div>
          ))}
        </div>
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
        <button className={`bs2${isSaved ? " saved" : ""}`} onClick={handleSave}>
          {isSaved ? "✓" : "+"}
        </button>
        {product.inStock ? (
          <button className="bo2" onClick={() => setOrderOpen(true)}>Order Now →</button>
        ) : (
          <button className="bs3" disabled>Currently Sold Out</button>
        )}
      </div>

      <WhatsAppFloat className="detail-wa" />

      {orderOpen && (
        <OrderModal
          product={product}
          onClose={() => setOrderOpen(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
}
