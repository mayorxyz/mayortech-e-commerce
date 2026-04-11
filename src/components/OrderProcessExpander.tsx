import { useState } from "react";

const steps = [
  {
    num: "1",
    title: "Place your order",
    desc: "Tap 'Order Now' on any product or checkout from your cart. Fill in your name, phone, email, and delivery address.",
  },
  {
    num: "2",
    title: "Order confirmed",
    desc: "You'll receive a confirmation via WhatsApp or email. Our team reviews and verifies your order details.",
  },
  {
    num: "3",
    title: "Processing & packaging",
    desc: "Your item is carefully inspected, tested, and securely packaged for delivery.",
  },
  {
    num: "4",
    title: "Dispatch & shipping",
    desc: "Port Harcourt orders ship same/next day. Nationwide orders are dispatched via GIG Logistics or your preferred courier.",
  },
  {
    num: "5",
    title: "Delivered to you",
    desc: "Receive your product at your doorstep. Pay on delivery (PH) or confirm receipt for shipped orders.",
  },
];

export default function OrderProcessExpander() {
  const [open, setOpen] = useState(false);

  return (
    <div className="deliv-wrap" style={{ marginTop: 16 }}>
      <div className={`deliv-tog${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
        <span>🛒 How ordering works — tap to learn</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className={`deliv-body${open ? " open" : ""}`}>
        {steps.map((s) => (
          <div
            key={s.num}
            className="deliv-inner"
            style={s.num !== "1" ? { borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 2 } : undefined}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#0e0e0f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.num}
              </span>
              <strong>{s.title}</strong>
            </div>
            <div style={{ paddingLeft: 30, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
