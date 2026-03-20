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
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[200] flex items-center justify-center p-5"
    >
      <div className="bg-surface border border-[rgba(255,255,255,0.1)] rounded-[20px] w-full max-w-[400px] p-7 animate-slide-up">
        <div className="flex items-start justify-between mb-1.5">
          <h2 className="font-heading font-bold text-lg">Place Order</h2>
          <button
            onClick={onClose}
            className="bg-surface2 border border-border text-muted w-[30px] h-[30px] rounded-lg cursor-pointer flex items-center justify-center text-base hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="text-[13px] text-muted mb-5">
          Ordering: <span className="text-primary font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col gap-1.5 mb-3.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted font-heading">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chidi Okonkwo"
            className="bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none transition-colors focus:border-primary placeholder:text-muted"
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-3.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted font-heading">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 08012345678"
            className="bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none transition-colors focus:border-primary placeholder:text-muted"
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-3.5">
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted font-heading">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. chidi@gmail.com"
            className="bg-surface2 border border-border rounded-[10px] text-foreground font-body text-sm py-[11px] px-3.5 outline-none transition-colors focus:border-primary placeholder:text-muted"
          />
        </div>

        <div className="text-[11px] text-muted leading-relaxed mb-[18px] p-[10px_12px] bg-surface2 rounded-lg border-l-2 border-l-primary">
          No payment now. Once you submit, we'll contact you via WhatsApp or call to confirm and
          arrange delivery.
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-[13px] rounded-xl bg-primary border-none text-primary-foreground font-heading font-bold text-[15px] cursor-pointer transition-colors hover:brightness-90"
        >
          Confirm Order →
        </button>
      </div>
    </div>
  );
}
