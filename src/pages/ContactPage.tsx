import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Instagram, Music2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TechGridBackground from "@/components/TechGridBackground";

const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348144922398";
const INSTAGRAM = import.meta.env.VITE_ADMIN_INSTAGRAM || "mayortech";
const TIKTOK = import.meta.env.VITE_ADMIN_TIKTOK || "mayortech";
const EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "hello@mayortech.ng";

const contacts = [
  { icon: MessageCircle, label: "WhatsApp", value: WHATSAPP, href: `https://wa.me/${WHATSAPP}`, color: "#25d366" },
  { icon: Instagram, label: "Instagram", value: `@${INSTAGRAM}`, href: `https://instagram.com/${INSTAGRAM}`, color: "#E1306C" },
  { icon: Music2, label: "TikTok", value: `@${TIKTOK}`, href: `https://tiktok.com/@${TIKTOK}`, color: "#fff" },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, color: "var(--accent)" },
];

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <TechGridBackground />
      <Header onAbout={() => navigate("/about")} onContact={() => {}} />

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 20px 60px" }}>
        <button
          onClick={() => navigate("/")}
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
          Contact <span style={{ color: "var(--accent)" }}>Us</span>
        </h1>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)", marginBottom: 28 }}>
          MRY // CONTACT-01
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {/* Column 1: Contact details */}
          <div>
            <h2 className="font-heading" style={{ fontSize: 18, marginBottom: 14, color: "var(--text)" }}>
              Reach us anywhere
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 18, lineHeight: 1.6 }}>
              We respond fast on every channel. Pick what works for you.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {contacts.map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      textDecoration: "none",
                      color: "var(--text)",
                      transition: "all .2s",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "var(--surface2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: c.color,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{c.value}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: SVC // M-OPS block */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--accent)",
              borderRadius: 16,
              padding: 24,
              backdropFilter: "blur(10px)",
              position: "relative",
              boxShadow: "0 0 30px rgba(223, 255, 0, 0.08)",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "var(--accent)",
                marginBottom: 12,
                letterSpacing: 1,
              }}
            >
              SVC // M-OPS
            </div>
            <h2 className="font-heading" style={{ fontSize: 24, marginBottom: 12, color: "var(--text)", lineHeight: 1.2 }}>
              More than a shop — <em style={{ color: "var(--accent)", fontStyle: "normal" }}>full device care.</em>
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
              Repairs, performance upgrades, setup, data transfer, and trade-ins. One team for everything your phone or laptop needs.
            </p>
            <button
              onClick={() => navigate("/services")}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "var(--accent)",
                color: "#0e0e0f",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Explore all services →
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
