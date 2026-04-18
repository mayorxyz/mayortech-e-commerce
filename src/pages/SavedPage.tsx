import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/contexts/StoreContext";
import { useSupabaseProducts } from "@/hooks/useSupabaseProducts";
import Header from "@/components/Header";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ToastStack from "@/components/ToastStack";

export default function SavedPage() {
  const [tab, setTab] = useState<"bkmarks" | "orders">("bkmarks");
  const { orderHistory, toasts, cartCount } = useStore();
  const { products } = useSupabaseProducts();
  const navigate = useNavigate();

  const savedList: typeof products = [];

  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastStack toasts={toasts} />
      <Header onAbout={() => {}} onContact={() => {}} />
      <div className="tabs">
        <div className={`tab${tab === "bkmarks" ? " active" : ""}`} onClick={() => setTab("bkmarks")}>
          Bookmarked <span>({savedList.length})</span>
        </div>
        <div className={`tab${tab === "orders" ? " active" : ""}`} onClick={() => setTab("orders")}>
          Orders <span>({orderHistory.length})</span>
        </div>
      </div>

      {tab === "bkmarks" && (
        <div style={{ padding: 20 }}>
          {savedList.length === 0 ? (
            <div className="empty">
              <span className="emo">🔖</span>
              <p>Nothing bookmarked yet.<br />Hit <strong>+</strong> on any product.</p>
            </div>
          ) : (
            <div className="sgrid">
              {[0, 1].map((ci) => (
                <div className="grid-col" key={ci}>
                  {savedList.filter((_, i) => i % 2 === ci).map((p) => (
                    <div key={p.id} className="scard">
                      <img
                        src={p.image}
                        alt={p.name}
                        onClick={() => navigate(`/product/${p.id}`)}
                        style={{ cursor: "pointer" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
                      />
                      <div className="scard-body">
                        <div className="scard-name" onClick={() => navigate(`/product/${p.id}`)}>{p.name}</div>
                        <div className="scard-price">{p.price}</div>
                        <button className="brem" onClick={() => {}}>✕ Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div style={{ padding: 20 }}>
          {orderHistory.length === 0 ? (
            <div className="empty">
              <span className="emo">📋</span>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="olist">
              {orderHistory.map((o, i) => (
                <div key={i} className="oitem">
                  <div className="oname">{o.productName}</div>
                  <div className="ometa">{o.customerName} · {o.phone}<br />{o.email}</div>
                  <div className="ometa" style={{ fontSize: 11, marginTop: 2 }}>{o.placedAt}</div>
                  <span className="obadge">Pending confirmation</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
}
