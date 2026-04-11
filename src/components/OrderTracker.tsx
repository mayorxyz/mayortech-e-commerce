import { useOrderTracking, ORDER_STEPS, type TrackedOrder } from "@/hooks/useOrderTracking";

interface OrderTrackerProps {
  customerPhone?: string;
}

export default function OrderTracker({ customerPhone }: OrderTrackerProps) {
  const { orders, loading } = useOrderTracking(customerPhone);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
        Loading order tracking...
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: "0 20px 20px" }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        📦 Order Tracking
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: TrackedOrder }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

  return (
    <div
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--bv)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{order.customerName}</span>
        <span style={{ fontSize: 11, color: "var(--muted)" }}>
          {order.orderId?.slice(0, 8)}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
        {order.items}
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
        {ORDER_STEPS.map((step, i) => {
          const completed = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {/* Connector line */}
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: "50%",
                    width: "100%",
                    height: 3,
                    background: i <= currentIndex ? "var(--accent)" : "var(--bv)",
                    zIndex: 0,
                  }}
                />
              )}
              {/* Dot */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: completed ? "var(--accent)" : "var(--surface)",
                  border: `2px solid ${completed ? "var(--accent)" : "var(--bv)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: completed ? "#0e0e0f" : "var(--muted)",
                  zIndex: 1,
                  boxShadow: isCurrent ? "0 0 0 3px rgba(255,204,0,0.25)" : "none",
                }}
              >
                {completed ? "✓" : i + 1}
              </div>
              {/* Label */}
              <span
                style={{
                  fontSize: 9,
                  textAlign: "center",
                  marginTop: 6,
                  color: completed ? "var(--foreground)" : "var(--muted)",
                  fontWeight: isCurrent ? 700 : 400,
                  lineHeight: 1.2,
                  maxWidth: 60,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
