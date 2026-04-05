import { useState } from "react";
import { Product } from "@/types/product";

interface Props {
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; email: string; address: string }) => Promise<boolean>;
}

export default function OrderModal({ product, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!product) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const ok = await onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    });
    setSubmitting(false);
    if (ok) setSuccess(true);
  };

  if (success) {
    return (
      <div className="overlay show" onClick={handleOverlayClick}>
        <div className="modal">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <div className="success-title">Order Confirmed!</div>
            <div className="success-msg">
              Your order for <strong>{product.name}</strong> has been received. We'll contact you shortly via WhatsApp or call to arrange delivery.
            </div>
            <button className="bconf" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay show" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="mhdr">
          <div className="mtitle">Place Order</div>
          <button className="mclose" onClick={onClose}>✕</button>
        </div>
        <div className="mdev">Ordering: <span>{product.name}</span></div>
        <div className="field">
          <label>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chidi Okonkwo" />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 08012345678" />
        </div>
        <div className="field">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. chidi@gmail.com" />
        </div>
        <div className="field">
          <label>Delivery Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 12 Aba Road, Port Harcourt" />
        </div>
        <div className="mnote">No payment now. Once you submit, we'll contact you via WhatsApp or call to confirm and arrange delivery.</div>
        <button className="bconf" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Confirm Order →"}
        </button>
      </div>
    </div>
  );
}
