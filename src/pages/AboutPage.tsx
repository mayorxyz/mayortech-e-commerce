import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TechGridBackground from "@/components/TechGridBackground";

const testimonials = [
  { quote: "Got my MacBook in perfect condition. Delivery was same day in PH. Very legit!", author: "Emeka, Port Harcourt" },
  { quote: "Bought a UK-used iPhone 13, works like brand new. Will definitely order again.", author: "Chioma, Abuja" },
  { quote: "Best gadget store in PH. Fast response on WhatsApp and honest pricing.", author: "Tunde, Lagos" },
  { quote: "Ordered an Anker power bank, arrived next morning. Sealed box, original product.", author: "Adaeze, Port Harcourt" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <TechGridBackground />
      <Header onAbout={() => {}} onContact={() => navigate("/contact")} />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "20px 20px 60px" }}>
        <button
          onClick={() => navigate("/")}
          className="back-to-shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            background: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={14} /> Back to Shop
        </button>

        <h1 className="font-heading" style={{ fontSize: 36, marginBottom: 8, color: "var(--text)" }}>
          About <span style={{ color: "var(--accent)" }}>MRY Gadgets</span>
        </h1>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)", marginBottom: 20 }}>
          MRY // ABOUT-01
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text)", marginBottom: 24 }}>
          We're a Port Harcourt-based gadget store specialising in genuine phones, laptops, earphones, and accessories.
          Every device we sell is carefully sourced and verified — whether brand new or UK-used.
          We've been serving customers across Rivers State and nationwide since 2023, and we're proud of every 5-star review we've earned.
        </p>

        <div className="trust-row" style={{ marginBottom: 36 }}>
          <div className="trust-chip">✓ Verified seller</div>
          <div className="trust-chip">✓ Genuine products</div>
          <div className="trust-chip">✓ Buyer protection</div>
        </div>

        <h2 className="font-heading" style={{ fontSize: 22, marginBottom: 16, color: "var(--text)" }}>
          What our customers say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 16,
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ color: "var(--accent)", fontSize: 13, marginBottom: 8 }}>★★★★★</div>
              <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 10, lineHeight: 1.5 }}>"{t.quote}"</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>— {t.author}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
