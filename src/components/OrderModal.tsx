import { useState } from "react";
import { Product } from "@/types/product";

interface Props {
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; email: string }) => void;
}

export default function OrderModal({ product, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (!product) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    setName("");
    setPhone("");
    setEmail("");
  };

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
        <div className="mnote">No payment now. Once you submit, we'll contact you via WhatsApp or call to confirm and arrange delivery.</div>
        <button className="bconf" onClick={handleSubmit}>Confirm Order →</button>
      </div>
    </div>
  );
}
