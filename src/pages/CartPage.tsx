import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useOrders } from "@/hooks/useOrders";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { sendOrderEmail } from "@/lib/emailjs";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ToastStack from "@/components/ToastStack";
import OrderModal from "@/components/OrderModal";
import OrderTracker from "@/components/OrderTracker";
import { Product } from "@/types/product";

const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQuantity, orderHistory, toasts, showToast, addOrderToHistory } = useStore();
  const { placeOrder } = useOrders();
  const { orders: trackedOrders } = useOrderTracking();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderOpen, setOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useEffect(() => {
    if ((location.state as any)?.tab === "orders") {
      setActiveTab("orders");
    }
  }, [location.state]);

  const scrollToOrders = () => {
    setActiveTab("orders");
    setTimeout(() => {
      const ordersSection = document.querySelector('[data-orders-section]');
      if (ordersSection) {
        ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const cartList = Object.values(cartItems);
  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);

  const handleOrderAllItems = async (data: { name: string; phone: string; email: string; address: string }): Promise<boolean> => {
    if (!data.name || !data.phone || !data.email || !data.address) {
      showToast("Please fill in all fields", "order", "!");
      return false;
    }

    if (cartList.length === 0) {
      showToast("Your cart is empty", "order", "!");
      return false;
    }

    const items = cartList.map((item) => ({
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const result = await placeOrder({
      customer_name: data.name,
      customer_phone: data.phone,
      customer_address: data.address,
      items,
      total_amount: totalPrice,
    });

    if (!result.success) {
      showToast(result.error || "Failed to place order", "order", "!");
      return false;
    }
    setActiveTab("orders");
    setShowOrderSuccess(true);

    cartList.forEach((item) => {
      addOrderToHistory(
        {
          productName: item.product.name,
          customerName: data.name,
          phone: data.phone,
          email: data.email,
          status: "pending",
          timestamp: Date.now(),
        },
        item.product
      );
    });

    const itemsList = cartList.map((item) => `${item.product.name} (qty: ${item.quantity})`).join(", ");
    sendOrderEmail({
      productName: itemsList,
      customerName: data.name,
      phone: data.phone,
      email: data.email,
    });

    showToast(`Order placed for ${cartList.length} item(s) — we'll be in touch!`, "order", "✓");
    return true;
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastStack toasts={toasts} />
      <div className="phdr">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <div className="ptitle">Shopping Cart</div>
      </div>
      <div className="tabs">
        <div className={`tab${activeTab === "cart" ? " active" : ""}`} onClick={() => setActiveTab("cart")} style={{ cursor: "pointer" }}>
          Cart <span>({totalItems})</span>
        </div>
        <div className={`tab${activeTab === "orders" ? " active" : ""}`} onClick={() => setActiveTab("orders")} style={{ cursor: "pointer" }}>
          ORDER
        </div>
      </div>

      {activeTab === "cart" ? (
        <div style={{ padding: 20 }}>
          {cartList.length === 0 ? (
            <div className="empty">
              <span className="emo">🛒</span>
              <p>Your cart is empty.<br />Browse products and add items to get started.</p>
              <button
                onClick={() => navigate("/")}
                style={{
                  marginTop: 16,
                  padding: "10px 20px",
                  background: "var(--accent)",
                  color: "#0e0e0f",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cgrid">
                {cartList.map((item) => (
                  <div key={item.product.id} className="ccard">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.2";
                      }}
                    />
                    <div className="ccard-body">
                      <div className="ccard-name" onClick={() => navigate(`/product/${item.product.id}`)} style={{ cursor: "pointer" }}>{item.product.name}</div>
                      <div className="ccard-cond" style={{ fontSize: "11px", color: "var(--muted)", marginBottom: 6 }}>
                        {item.product.condition}
                      </div>
                      <div className="ccard-price">{item.product.price}</div>

                      <div className="ccard-qty" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 8 }}>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          style={{
                            width: 28,
                            height: 28,
                            border: "1px solid var(--bv)",
                            background: "var(--surface2)",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        >
                          −
                        </button>
                        <span style={{ minWidth: 20, textAlign: "center", fontWeight: 500 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          style={{
                            width: 28,
                            height: 28,
                            border: "1px solid var(--bv)",
                            background: "var(--surface2)",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div className="ccard-subtotal" style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
                        Subtotal: ₦{(item.product.priceNum * item.quantity).toLocaleString("en-NG")}
                      </div>

                      <button
                        className="brem"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 24, padding: "16px", background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--bv)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                  <span>Total Items:</span>
                  <strong>{totalItems}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "var(--accent)", paddingTop: 12, borderTop: "1px solid var(--bv)" }}>
                  <span>Total Price:</span>
                  <span>₦{totalPrice.toLocaleString("en-NG")}</span>
                </div>
                <button
                  onClick={() => setOrderOpen(true)}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "12px",
                    background: "var(--accent)",
                    color: "#0e0e0f",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Order All Items
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <OrderTracker />
      )}

      {showOrderSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            right: 20,
            background: "var(--surface2)",
            border: "1px solid var(--bv)",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 20, color: "var(--accent)" }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
              Order Placed Successfully
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Check your order status below
            </div>
          </div>
          <button
            onClick={() => {
              setShowOrderSuccess(false);
              scrollToOrders();
            }}
            style={{
              padding: "8px 16px",
              background: "var(--accent)",
              color: "#0e0e0f",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Order →
          </button>
        </div>
      )}

      <WhatsAppFloat />

      {orderOpen && (
        <OrderModal
          product={null as any}
          onClose={() => setOrderOpen(false)}
          onSubmit={handleOrderAllItems}
          onViewOrder={() => {
            setActiveTab("orders");
            setOrderOpen(false);
            setTimeout(() => scrollToOrders(), 100);
          }}
          isCartOrder={true}
        />
      )}
    </div>
  );
}
