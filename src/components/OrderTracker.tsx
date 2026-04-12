import { useState } from "react";
import { useOrderTracking, ORDER_STEPS, type TrackedOrder } from "@/hooks/useOrderTracking";

interface OrderTrackerProps {
  customerPhone?: string;
}

export default function OrderTracker({ customerPhone }: OrderTrackerProps) {
  const { orders, loading } = useOrderTracking(customerPhone);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
        Loading order tracking...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          No orders yet.<br />Once you place an order, tracking will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 20px 20px" }} data-orders-section>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        📦 Order Tracking
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            expanded={!!expanded[order.id]}
            onToggle={() =>
              setExpanded((prev) => ({ ...prev, [order.id]: !prev[order.id] }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: TrackedOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);
  const itemCount = order.items.length;
  const firstItem = order.items[0];

  return (
    <div
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--bv)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          textAlign: "left",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                overflow: "hidden",
                background: "var(--surface)",
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              {firstItem?.image ? (
                <img
                  src={firstItem.image}
                  alt={firstItem.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--muted)", fontSize: 22 }}>📦</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {firstItem?.productName || "Order item"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--foreground)",
                    background: "var(--surface)",
                    padding: "2px 8px",
                    borderRadius: 999,
                    border: "1px solid var(--bv)",
                  }}
                >
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                {order.totalAmount ? `₦${order.totalAmount.toLocaleString("en-NG")}` : "Price not set"}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                {new Date(order.createdAt).toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              color: order.orderStatus === "delivered" ? "#22c55e" : "var(--accent)",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {ORDER_STEPS.find((step) => step.key === order.orderStatus)?.label || order.orderStatus}
          </span>
        </div>
      </button>

      {expanded && (
        <div style={{ marginTop: 16, borderTop: "1px solid var(--bv)", paddingTop: 16, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {order.items.map((item, index) => (
              <div
                key={`${item.productName}-${index}`}
                style={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "var(--surface)",
                    flexShrink: 0,
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--muted)" }}>
                      📦
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{item.productName}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    ₦{item.price} · Qty {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ORDER_STEPS.map((step, index) => {
              const completed = index < currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div
                  key={step.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 12,
                    alignItems: "center",
                    opacity: completed || isCurrent ? 1 : 0.45,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${completed || isCurrent ? "var(--accent)" : "var(--bv)"}`,
                      background: completed ? "var(--accent)" : isCurrent ? "var(--surface)" : "transparent",
                      display: "grid",
                      placeItems: "center",
                      color: completed ? "#0e0e0f" : "var(--muted)",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {completed ? "✓" : index + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "var(--foreground)" : "var(--muted)" }}>
                      {step.label}
                    </div>
                    {completed && (
                      <div style={{ fontSize: 11, color: "var(--foreground)", marginTop: 2 }}>
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
