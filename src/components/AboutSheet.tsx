interface Props {
  open: boolean;
  onClose: () => void;
}

const testimonials = [
  { quote: "Got my MacBook in perfect condition. Delivery was same day in PH. Very legit!", author: "Emeka, Port Harcourt" },
  { quote: "Bought a UK-used iPhone 13, works like brand new. Will definitely order again.", author: "Chioma, Abuja" },
  { quote: "Best gadget store in PH. Fast response on WhatsApp and honest pricing.", author: "Tunde, Lagos" },
  { quote: "Ordered an Anker power bank, arrived next morning. Sealed box, original product.", author: "Adaeze, Port Harcourt" },
];

export default function AboutSheet({ open, onClose }: Props) {
  if (!open) return null;

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`aoverlay${open ? " show" : ""}`} onClick={handleOverlay}>
      <div className="asheet">
        <h2>About M Gadgets</h2>
        <p>
          We're a Port Harcourt-based gadget store specialising in genuine phones, laptops, earphones, and accessories.
          Every device we sell is carefully sourced and verified — whether brand new or UK-used.
          We've been serving customers across Rivers State and nationwide since 2023, and we're proud of every 5-star review we've earned.
        </p>
        <div className="trust-row">
          <div className="trust-chip">✓ Verified seller</div>
          <div className="trust-chip">✓ Genuine products</div>
          <div className="trust-chip">✓ Buyer protection</div>
        </div>

        <div className="section-title" style={{ marginTop: 8 }}>What our customers say</div>
        <div className="testi-scroll" style={{ marginBottom: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="tcard">
              <div className="tcard-stars">★★★★★</div>
              <div className="tcard-quote">"{t.quote}"</div>
              <div className="tcard-author">— {t.author}</div>
            </div>
          ))}
        </div>

        <button className="aclose" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
