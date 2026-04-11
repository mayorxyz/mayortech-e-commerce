import { useState } from "react";
import { useAllOrderTracking, ORDER_STEPS, type OrderStatus } from "@/hooks/useOrderTracking";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminOrderTracking() {
  const { orders, loading, updateStatus } = useAllOrderTracking();
  const [showCreate, setShowCreate] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newItems, setNewItems] = useState("");
  const [creating, setCreating] = useState(false);

  const inputClass =
    "w-full bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none focus:border-primary placeholder:text-muted";

  const handleCreate = async () => {
    if (!newOrderId || !newName || !newPhone) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "order_tracking"), {
        orderId: newOrderId,
        customerName: newName,
        customerPhone: newPhone,
        items: newItems,
        orderStatus: "confirmed" as OrderStatus,
        createdAt: Date.now(),
      });
      setNewOrderId("");
      setNewName("");
      setNewPhone("");
      setNewItems("");
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to create tracking:", err);
    }
    setCreating(false);
  };

  return (
    <section className="bg-surface border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-base">📦 Order Tracking</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:brightness-90"
        >
          {showCreate ? "Cancel" : "+ Add Tracking"}
        </button>
      </div>

      {showCreate && (
        <div className="grid gap-3 mb-6 p-4 bg-surface2 rounded-lg border border-border">
          <input className={inputClass} placeholder="Order ID" value={newOrderId} onChange={(e) => setNewOrderId(e.target.value)} />
          <input className={inputClass} placeholder="Customer Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className={inputClass} placeholder="Customer Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
          <input className={inputClass} placeholder="Items (e.g. iPhone 13, AirPods)" value={newItems} onChange={(e) => setNewItems(e.target.value)} />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm cursor-pointer hover:brightness-90 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Tracking"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading tracked orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted text-sm">No tracked orders yet.</p>
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => {
            const currentIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
            return (
              <div key={order.id} className="bg-surface2 border border-border rounded-lg p-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-heading font-semibold text-sm">{order.customerName}</span>
                    <span className="text-muted text-xs ml-2">{order.customerPhone}</span>
                  </div>
                  <span className="text-xs text-muted">{order.orderId?.slice(0, 8)}</span>
                </div>
                <div className="text-xs text-muted mb-3">{order.items}</div>

                {/* Status selector */}
                <div className="flex flex-wrap gap-1.5">
                  {ORDER_STEPS.map((step, i) => (
                    <button
                      key={step.key}
                      onClick={() => updateStatus(order.id, step.key)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-all ${
                        i <= currentIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface border border-border text-muted hover:border-primary/50"
                      } ${i === currentIndex ? "ring-2 ring-primary/30" : ""}`}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
