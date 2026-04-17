import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Laptop,
  Wrench,
  Settings,
  Database,
  Rocket,
  Brush,
  Terminal,
  RefreshCw,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AboutSheet from "@/components/AboutSheet";
import ContactSheet from "@/components/ContactSheet";

const services = [
  {
    title: "Gadget Sales",
    description:
      "Get the right device, not just any device. We take the time to understand what you actually need before recommending anything. Whether it's a laptop built for heavy workloads or a reliable daily smartphone, we match you with the right pick for your budget and make sure you walk away with everything you need to get started.",
    cta: "Shop Now",
    Icon: Laptop,
    action: "shop",
  },
  {
    title: "Device Repairs",
    description:
      "From cracked screens and dead batteries to motherboard faults, we fix it. We handle all kinds of mobile repairs and specialise in advanced laptop diagnostics. No guesswork, no long waits — just a straightforward repair done properly so you can get back to work.",
    cta: "Book Repair",
    Icon: Wrench,
    action: "contact",
  },
  {
    title: "Setup and Installation",
    description:
      "We handle the part most people dread. OS installation, app setup, account configuration, custom settings — your laptop or phone comes back fully ready to use. No setup screens, no tutorials, just switch it on and go.",
    cta: "Request Setup",
    Icon: Settings,
    action: "contact",
  },
  {
    title: "Data Transfer and Backup",
    description:
      "Switching devices shouldn't mean losing anything. We move your photos, documents, contacts, and files across safely, with nothing left behind. Once everything is transferred, we also set up a proper backup system so you're covered if anything ever goes wrong down the line.",
    cta: "Secure Data",
    Icon: Database,
    action: "contact",
  },
  {
    title: "Performance Upgrades",
    description:
      "Your laptop might not need replacing — it might just need the right upgrade. We install fast SSDs and expand RAM to give older machines a real boost in speed and responsiveness. Faster boot times, smoother multitasking, and a noticeably better experience without the cost of buying new.",
    cta: "Boost Speed",
    Icon: Rocket,
    action: "contact",
  },
  {
    title: "Cleaning and Maintenance",
    description:
      "Heat and dust do more damage than most people realise. Over time they slow machines down and shorten their lifespan. Our deep-cleaning service clears out internal cooling systems and replaces thermal paste, keeping your hardware running at the right temperature and extending its life significantly.",
    cta: "Extend Life",
    Icon: Brush,
    action: "contact",
  },
  {
    title: "Software and OS Troubleshooting",
    description:
      "If your system is freezing, crashing, or just running slower than it should, we'll get to the bottom of it. We carry out full system cleans, remove malware, and fix OS-level issues so everything runs the way it's supposed to again.",
    cta: "Fix Issues",
    Icon: Terminal,
    action: "contact",
  },
  {
    title: "The Device Swap",
    description:
      "Ready to move on from your current device? Bring it in and trade it toward a newer model. We assess it on the spot and give you its value directly off the price of your upgrade — making it easier and more affordable to stay on the latest tech.",
    cta: "Swap Now",
    Icon: RefreshCw,
    action: "contact",
  },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const handleCta = (action: string) => {
    if (action === "shop") navigate("/");
    else setContactOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Header onAbout={() => setAboutOpen(true)} onContact={() => setContactOpen(true)} />

      <section
        style={{
          padding: "48px 20px 32px",
          textAlign: "center",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 16,
            lineHeight: 1.05,
          }}
        >
          Our <span style={{ color: "var(--accent)" }}>Services</span>
        </h1>
        <p
          style={{
            fontSize: "clamp(14px, 1.6vw, 17px)",
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          We specialise in high-performance laptop solutions, with solid support for phones and
          essential gadgets. Whatever you need, we've got it covered.
        </p>
      </section>

      <section
        style={{
          padding: "16px 20px 56px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <div className="services-grid">
          {services.map(({ title, description, cta, Icon, action }) => (
            <article key={title} className="service-card">
              <div className="service-icon-wrap">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="service-title">{title}</h3>
              <p className="service-desc">{description}</p>
              <button className="service-cta" onClick={() => handleCta(action)}>
                {cta}
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
      <AboutSheet open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ContactSheet open={contactOpen} onClose={() => setContactOpen(false)} />

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; }
        }
        @media (min-width: 1024px) {
          .services-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
        }
        .service-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease, background .25s ease;
          overflow: hidden;
        }
        .service-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 80% at 0% 0%, rgba(232,255,71,0.06), transparent 50%);
          opacity: 0;
          transition: opacity .3s ease;
          pointer-events: none;
        }
        .service-card:hover {
          border-color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px var(--accent), 0 12px 36px -12px rgba(232,255,71,0.35);
        }
        .service-card:hover::before { opacity: 1; }
        .service-icon-wrap {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(232,255,71,0.08);
          color: var(--accent);
          border: 1px solid rgba(232,255,71,0.2);
        }
        body.light .service-icon-wrap {
          background: rgba(200,223,32,0.12);
          border-color: rgba(200,223,32,0.35);
        }
        .service-title {
          font-family: Syne, sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
        }
        .service-desc {
          font-size: 13px;
          line-height: 1.55;
          color: var(--muted);
          flex: 1;
        }
        .service-cta {
          margin-top: 6px;
          align-self: flex-start;
          background: transparent;
          border: 1px solid var(--bv);
          color: var(--text);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background .2s ease, color .2s ease, border-color .2s ease;
        }
        .service-cta:hover {
          background: var(--accent);
          color: #0e0e0f;
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}
