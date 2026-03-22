export default function TestimonialsSection() {
  const testimonials = [
    { quote: "Got my MacBook in perfect condition. Delivery was same day in PH. Very legit!", author: "Emeka, Port Harcourt" },
    { quote: "Bought a UK-used iPhone 13, works like brand new. Will definitely order again.", author: "Chioma, Abuja" },
    { quote: "Best gadget store in PH. Fast response on WhatsApp and honest pricing.", author: "Tunde, Lagos" },
    { quote: "Ordered an Anker power bank, arrived next morning. Sealed box, original product.", author: "Adaeze, Port Harcourt" },
  ];

  return (
    <div className="testi-section">
      <div className="section-title">What customers say</div>
      <div className="testi-scroll">
        {testimonials.map((t, i) => (
          <div key={i} className="tcard">
            <div className="tcard-stars">★★★★★</div>
            <div className="tcard-quote">"{t.quote}"</div>
            <div className="tcard-author">— {t.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
