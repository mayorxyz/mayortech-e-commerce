import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DeliveryExpander() {
  const [open, setOpen] = useState(false);
  const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

  return (
    <div className="deliv-wrap" style={{ marginTop: 20 }}>
      <div className={`deliv-tog${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
        <span>📦 We deliver across PH &amp; nationwide — tap to learn more</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div className={`deliv-body${open ? " open" : ""}`}>
        <div className="deliv-inner">
          <strong>Port Harcourt delivery</strong>
          Same-day delivery within Port Harcourt for orders confirmed before 2pm. We bring it directly to you.
        </div>
        <div className="deliv-inner" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 2 }}>
          <strong>Nationwide delivery</strong>
          1–3 business days via GIG Logistics or courier of your choice. We ship to all states.
        </div>
        <div className="deliv-inner" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 2 }}>
          <strong>Payment</strong>
          Pay on delivery within Port Harcourt. For nationwide, transfer is made before dispatch. No hidden fees.
        </div>
        <div className="deliv-inner" style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 2 }}>
          Questions? <a href={`https://wa.me/${WHATSAPP}`} style={{ color: "var(--accent)" }}>Chat us on WhatsApp →</a>
        </div>
      </div>
    </div>
  );
}
