import { useEffect, useRef, useState, MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  Wrench,
  Settings,
  Database,
  Rocket,
  Wind,
  Cpu,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

type Service = {
  id: string;
  title: string;
  desc: string;
  longDescription: string;
  Icon: LucideIcon;
  cta: string;
  action: "shop" | "contact";
  span: "featured" | "wide" | "regular" | "gallery";
  effect?: "pulse" | "speed";
};

const services: Service[] = [
  {
    id: "MT-01",
    title: "Premium Gadget Sales",
    desc: "Get the right device, not just any device. We match you with the right pick for your budget and ensure you have everything needed to get started.",
    longDescription: "Browse premium phones and laptops with expert guidance. We hand-select devices that deliver the best value and performance for your daily needs.",
    Icon: Smartphone,
    cta: "Explore Inventory",
    action: "shop",
    span: "featured",
    effect: "pulse",
  },
  {
    id: "MT-02",
    title: "Device Repairs",
    desc: "From cracked screens to complex motherboard faults. Advanced laptop diagnostics with no guesswork and no long waits.",
    longDescription: "We perform complete motherboard diagnostics, component-level repairs, and fast screen replacement so your laptop or phone looks and works like new.",
    Icon: Wrench,
    cta: "Get Quote",
    action: "contact",
    span: "regular",
  },
  {
    id: "MT-03",
    title: "Setup and Installation",
    desc: "OS installation, app setup, and account configuration. Your device comes back fully optimized and ready for immediate action.",
    longDescription: "We install operating systems, configure accounts, tune settings, and remove unneeded apps so your device is clean, secure, and ready to use.",
    Icon: Settings,
    cta: "Book Setup",
    action: "contact",
    span: "regular",
  },
  {
    id: "MT-05",
    title: "Performance Upgrades",
    desc: "High-speed SSD installations and RAM expansions. Give your older machine a massive boost in speed and responsiveness.",
    longDescription: "Upgrade with high-speed SSDs, extra RAM, and performance tuning to make your device faster, more responsive, and better suited for modern apps.",
    Icon: Rocket,
    cta: "Upgrade Now",
    action: "contact",
    span: "wide",
    effect: "speed",
  },
  {
    id: "MT-04",
    title: "Data Transfer and Backup",
    desc: "Seamless migration of your photos, documents, and files. We also implement robust backup systems for total peace of mind.",
    longDescription: "We safely move your data, set up backup solutions, and ensure nothing is lost during device replacements or system upgrades.",
    Icon: Database,
    cta: "Secure Files",
    action: "contact",
    span: "regular",
  },
  {
    id: "MT-06",
    title: "Cleaning and Maintenance",
    desc: "Deep-cleaning of internal cooling systems and fresh thermal paste to prevent overheating and extend hardware life.",
    longDescription: "Internal dust removal, fan maintenance, and fresh thermal paste help keep your device cool and stable for longer service life.",
    Icon: Wind,
    cta: "Book Service",
    action: "contact",
    span: "regular",
  },
  {
    id: "MT-07",
    title: "Software Troubleshooting",
    desc: "Eliminate crashes, malware, and OS-level bugs. We perform deep system cleans to get everything running smoothly again.",
    longDescription: "We identify software issues, remove harmful programs, fix crashes, and restore your device to a stable, usable state.",
    Icon: Cpu,
    cta: "Fix Device",
    action: "contact",
    span: "regular",
  },
  {
    id: "MT-08",
    title: "The Device Swap",
    desc: "Trade in your current device for instant credit toward a newer model. The smartest and fastest way to stay on the latest tech.",
    longDescription: "We complete a transparent fair-market valuation, then apply the trade-in credit instantly toward the next device you choose.",
    Icon: RefreshCw,
    cta: "Swap Today",
    action: "contact",
    span: "regular",
  },
  // ── Gallery card ─────────────────────────────────────────────────────────
  // Add images for this card in serviceImageMap under "Gallery Showcase".
  // Only images listed in extensions[] will display. Empty array = card hidden.
  {
    id: "MT-09",
    title: "Gallery Showcase",
    desc: "",
    longDescription: "",
    Icon: Smartphone,
    cta: "",
    action: "contact",
    span: "gallery",
  },
];

// ── Image map ─────────────────────────────────────────────────────────────────
// extensions[] is the source of truth for image count per service.
// Gallery card: put exactly the images you want in "Gallery Showcase" extensions.
const serviceImageMap: Record<string, { prefix: string; extensions: string[] }> = {
  "Premium Gadget Sales":     { prefix: "Gadget Sales",             extensions: ["jpg", "jpg", "jpg"] },
  "Device Repairs":           { prefix: "repair",                   extensions: ["jpg", "jpg", "webp"] },
  "Setup and Installation":   { prefix: "Setup and Installation",   extensions: ["png", "jpg"] },
  "Performance Upgrades":     { prefix: "Performance Upgrades",     extensions: ["webp", "jpg", "jpg"] },
  "Data Transfer and Backup": { prefix: "Data Transfer and Backup", extensions: ["jpg", "jpg"] },
  "Cleaning and Maintenance": { prefix: "Cleaning and Maintenance", extensions: ["jpg", "jpg"] },
  "Software Troubleshooting": { prefix: "Software Troubleshooting", extensions: ["jpg", "png"] },
  "The Device Swap":          { prefix: "The Device Swap",          extensions: [] },
  // Gallery card — change extensions to control exactly how many images appear.
  // Example: ["jpg", "jpg"] shows 2 images; [] hides the card entirely.
  "Gallery Showcase":         { prefix: "Gallery",                  extensions: ["jpg", "jpg"] },
};

/** Returns the src path for a service + index, or "" if out of range. */
function getServiceImage(title: string, index: number): string {
  const config = serviceImageMap[title];
  if (!config) return "";
  const { prefix, extensions } = config;
  if (index >= extensions.length) return "";
  const ext = extensions[index];
  const num = index + 1;
  if (prefix === "Data Transfer and Backup") {
    return index === 0 ? `/${prefix}1.${ext}` : `/${prefix} ${num}.${ext}`;
  }
  return `/${prefix} ${num}.${ext}`;
}

/** How many images are defined for a service. */
function imageCount(title: string): number {
  return serviceImageMap[title]?.extensions.length ?? 0;
}

const gadgetSalesImages = [
  "/Gadget Sales 1.jpg",
  "/Gadget Sales 2.jpg",
  "/Gadget Sales 3.jpg",
];

// ── Gallery Card ──────────────────────────────────────────────────────────────
// Pure image display: cycles through its assigned images only.
// Shows indicator dots when > 1 image. Renders nothing if no images defined.
function GalleryCard({
  service,
  onExpand,
}: {
  service: Service;
  onExpand: (id: string) => void;
}) {
  const { id, title } = service;
  const count = imageCount(title);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (count <= 1) return;
    const t = window.setInterval(() => {
      setIdx((p) => (p + 1) % count);
      setFailed(false);
    }, 4000);
    return () => clearInterval(t);
  }, [count]);

  // No images configured → render nothing
  if (count === 0) return null;

  return (
    <motion.article
      layoutId={`card-${id}`}
      className="bento-card bento-gallery"
      onClick={() => onExpand(id)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ cursor: "pointer" }}
    >
      <div className="bento-spotlight" aria-hidden />

      <AnimatePresence mode="wait">
        {!failed && (
          <motion.img
            key={`${id}-${idx}`}
            src={getServiceImage(title, idx)}
            alt={title}
            className="gallery-card-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            layoutId={`image-${id}`}
            onError={() => setFailed(true)}
          />
        )}
      </AnimatePresence>

      {count > 1 && (
        <div className="gallery-dots" aria-hidden>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className={`gallery-dot${i === idx ? " active" : ""}`} />
          ))}
        </div>
      )}
    </motion.article>
  );
}

// ── Bento Card ────────────────────────────────────────────────────────────────
function BentoCard({
  service,
  onCta,
  imageIndex,
  onExpand,
}: {
  service: Service;
  onCta: (a: string) => void;
  imageIndex: number;
  onExpand: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { id, title, desc, Icon, cta, action, span, effect } = service;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => { setImageFailed(false); }, [imageIndex, id]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${((y - cy) / cy) * -4}deg`);
    el.style.setProperty("--ry", `${((x - cx) / cx) * 4}deg`);
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  // Cycle index capped to this service's actual image count
  const count = imageCount(title);
  const safeIdx = count > 0 ? imageIndex % count : 0;
  const imgSrc = getServiceImage(title, safeIdx);
  const hasImage = imgSrc !== "" && !imageFailed;

  return (
    <motion.article
      ref={ref}
      layoutId={`card-${id}`}
      className={`bento-card bento-${span}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onExpand(id)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ cursor: "pointer" }}
    >
      <div className="bento-spotlight" aria-hidden />
      <div className="bento-noise" aria-hidden />
      {effect === "speed" && <div className="speed-lines" aria-hidden />}

      {/* Image block — only rendered when the service has images */}
      {count > 0 && (
        <div className="service-image-wrap">
          <AnimatePresence mode="wait">
            {!hasImage ? (
              <motion.div
                key={`fallback-${id}-${safeIdx}`}
                className="service-image-fallback"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {title}
              </motion.div>
            ) : (
              <motion.img
                key={`${id}-${safeIdx}`}
                src={imgSrc}
                alt={title}
                className="service-card-image"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                layoutId={`image-${id}`}
                onError={() => setImageFailed(true)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="bento-inner">
        <div className="bento-top">
          <div className={`bento-icon-wrap ${effect === "pulse" ? "pulse-glow" : ""}`}>
            <Icon size={span === "featured" ? 28 : 22} strokeWidth={2} />
          </div>
          <span className="bento-id">{id}</span>
        </div>
        <div className="bento-body">
          <h3 className="bento-title">{title}</h3>
          <p className="bento-desc">{desc}</p>
        </div>
        <button
          className="bento-cta"
          onClick={(e) => { e.stopPropagation(); onCta(action); }}
        >
          {cta}<span aria-hidden>→</span>
        </button>
      </div>
    </motion.article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState<Record<string, number>>(
    () => Object.fromEntries(services.map((s) => [s.id, 0]))
  );
  const [gadgetSalesIndex, setGadgetSalesIndex] = useState(0);
  const [gadgetSalesError, setGadgetSalesError] = useState(false);
  const [expandedImgIdx, setExpandedImgIdx] = useState(0);
  const [expandedImgFailed, setExpandedImgFailed] = useState(false);

  // Global cycling — each service wraps within its own image count
  useEffect(() => {
    const interval = window.setInterval(() => {
      setImageIndex((prev) =>
        services.reduce((acc, s) => {
          const count = imageCount(s.title);
          acc[s.id] = count > 0 ? ((prev[s.id] ?? 0) + 1) % count : 0;
          return acc;
        }, {} as Record<string, number>)
      );
      setGadgetSalesIndex((p) => (p + 1) % gadgetSalesImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setGadgetSalesError(false); }, [gadgetSalesIndex]);

  // Reset expanded image state when a card is opened
  useEffect(() => {
    if (expandedId) {
      setExpandedImgIdx(imageIndex[expandedId] ?? 0);
      setExpandedImgFailed(false);
    }
  }, [expandedId]);

  const handleCta = (action: string) => {
    if (action === "shop") navigate("/");
    else navigate("/contact");
  };

  const currentImageIndex = (id: string) => imageIndex[id] ?? 0;
  const expandedService = expandedId ? services.find((s) => s.id === expandedId) : null;

  // Build the list of valid image srcs for the expanded service
  const expandedImages = expandedService
    ? Array.from({ length: imageCount(expandedService.title) }, (_, i) =>
        getServiceImage(expandedService.title, i)
      ).filter(Boolean)
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "var(--text)",
        position: "relative",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "70px 70px",
      }}
    >
      <div className="mesh-overlay" aria-hidden />
      <Header onAbout={() => navigate("/about")} onContact={() => navigate("/contact")} />

      {/* Back */}
      <section style={{ padding: "16px 20px 0", position: "relative", zIndex: 1 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent", border: "1px solid var(--bv)", color: "var(--text)",
            padding: "7px 14px", borderRadius: "50px", cursor: "pointer",
            fontSize: "13px", fontWeight: 500, transition: "all 0.2s", marginBottom: "16px",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--accent)";
            (e.target as HTMLButtonElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.borderColor = "var(--bv)";
            (e.target as HTMLButtonElement).style.color = "var(--text)";
          }}
        >
          ← Back
        </button>
      </section>

      {/* Hero */}
      <section style={{ padding: "28px 20px 28px", textAlign: "center", maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="services-eyebrow"><span className="dot" /> SERVICES // MT_SYSTEMS</div>
        <div className="services-brand">M Gadgets</div>
        <h1
          style={{
            fontFamily: "Syne, sans-serif", fontSize: "clamp(34px, 5.5vw, 58px)",
            fontWeight: 800, letterSpacing: "-0.025em", margin: "12px 0 16px", lineHeight: 1.02,
          }}
        >
          Engineered <span style={{ color: "var(--accent)" }}>Solutions</span>
          <br />For Every Device
        </h1>
        <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "var(--muted)", lineHeight: 1.6, maxWidth: 600, margin: "0 auto" }}>
          High-performance laptop solutions with solid support for phones and essential gadgets.
          Pick a service module below.
        </p>
      </section>

      {/* Gadget Sales featured */}
      <section style={{ padding: "16px 20px 56px", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="services-eyebrow"><span className="dot" /> GADGET SALES // FEATURED</div>
        <div className="gadget-sales-panel">
          <div className="service-image-wrap gadget-sales-image-wrap">
            <AnimatePresence mode="wait">
              {gadgetSalesError ? (
                <motion.div key={`gadget-fallback-${gadgetSalesIndex}`} className="service-image-fallback"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Gadget Sales
                </motion.div>
              ) : (
                <motion.img
                  key={gadgetSalesImages[gadgetSalesIndex]}
                  src={gadgetSalesImages[gadgetSalesIndex]}
                  alt={`Featured gadget sales image ${gadgetSalesIndex + 1}`}
                  className="service-card-image"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  onError={() => setGadgetSalesError(true)}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="gadget-sales-copy">
            <h2>New arrivals ready for sale</h2>
            <p>See the latest gadgets hand-picked for performance and style.</p>
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <section style={{ padding: "16px 20px 64px", maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="bento-grid">
          {services.map((s, i) => (
            <div key={s.id} className="bento-cell-wrap" style={{ animationDelay: `${i * 80}ms` }}>
              {s.span === "gallery" ? (
                <GalleryCard service={s} onExpand={setExpandedId} />
              ) : (
                <BentoCard
                  service={s}
                  onCta={handleCta}
                  imageIndex={currentImageIndex(s.id)}
                  onExpand={setExpandedId}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Expanded modal */}
      <AnimatePresence>
        {expandedService && (
          <motion.div
            className="expanded-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.section
              className="expanded-panel"
              layoutId={`card-${expandedService.id}`}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Image LEFT — content RIGHT */}
              <div className="expanded-layout">

                {/* Left: image + dot nav */}
                {expandedImages.length > 0 && (
                  <div className="expanded-image-col">
                    <AnimatePresence mode="wait">
                      {expandedImgFailed ? (
                        <motion.div key="exp-fallback" className="expanded-image-fallback"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {expandedService.title}
                        </motion.div>
                      ) : (
                        <motion.img
                          key={`exp-${expandedImgIdx}`}
                          src={expandedImages[expandedImgIdx]}
                          alt={expandedService.title}
                          className="expanded-image"
                          layoutId={`image-${expandedService.id}`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          onError={() => setExpandedImgFailed(true)}
                        />
                      )}
                    </AnimatePresence>

                    {expandedImages.length > 1 && (
                      <div className="expanded-img-dots">
                        {expandedImages.map((_, i) => (
                          <button
                            key={i}
                            className={`expanded-img-dot${i === expandedImgIdx ? " active" : ""}`}
                            onClick={() => { setExpandedImgIdx(i); setExpandedImgFailed(false); }}
                            aria-label={`Image ${i + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Right: text + actions */}
                <div className="expanded-content-col">
                  <div className="expanded-meta">
                    <span className="bento-id">{expandedService.id}</span>
                    <h2>{expandedService.title}</h2>
                    <p className="expanded-short-desc">{expandedService.desc}</p>
                  </div>
                  {expandedService.longDescription && (
                    <div className="expanded-long-desc">
                      <p>{expandedService.longDescription}</p>
                    </div>
                  )}
                  <div className="expanded-actions">
                    <button
                      className="expanded-whatsapp"
                      onClick={() => window.open(`https://wa.me/${WHATSAPP}`, "_blank")}
                    >
                      Chat on WhatsApp
                    </button>
                    <button className="expanded-close" onClick={() => setExpandedId(null)}>
                      Close
                    </button>
                  </div>
                </div>

              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFloat className="wa-ping" />

      <style>{`
        /* Mesh */
        .mesh-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(232,255,71,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,255,71,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 80%);
        }
        body.light .mesh-overlay {
          background-image:
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
        }

        /* Eyebrow */
        .services-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px; letter-spacing: 0.18em; color: var(--muted);
          padding: 6px 12px; border: 1px solid var(--border);
          border-radius: 999px; background: rgba(255,255,255,0.02);
        }
        .services-eyebrow .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 10px var(--accent);
          animation: pulse-dot 1.6s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }

        /* Bento grid */
        .bento-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 640px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
        }
        @media (min-width: 1024px) {
          .bento-grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: auto; gap: 32px; }
          .bento-featured { grid-column: span 2; grid-row: span 2; min-height: 480px; }
          .bento-wide     { grid-column: span 2; }
          .bento-gallery  { grid-column: span 2; }
        }

        /* Cell wrapper */
        .bento-cell-wrap {
          opacity: 0;
          animation: bento-rise 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          perspective: 1000px;
        }
        @keyframes bento-rise {
          0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
          60%  { opacity: 1; transform: translateY(-6px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Bento card base */
        .bento-card {
          position: relative; min-height: 320px; border-radius: 18px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          overflow: hidden; cursor: default; transform-style: preserve-3d;
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.25s ease, border-color 0.3s ease, background 0.3s ease;
          display: flex; flex-direction: column;
        }
        body.light .bento-card { background: rgba(255,255,255,0.7); border-color: rgba(0,0,0,0.08); }
        .bento-card:hover { border-color: rgba(232,255,71,0.45); background: rgba(255,255,255,0.06); }
        body.light .bento-card:hover { background: rgba(255,255,255,0.95); }

        /* Gallery card variant — pure image, no inner text */
        .bento-gallery {
          min-height: 260px;
          padding: 0;
        }
        .gallery-card-image {
          width: 100%; height: 100%; min-height: 260px;
          object-fit: cover; display: block; border-radius: 18px;
        }
        .gallery-dots {
          position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 6px; z-index: 4;
        }
        .gallery-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.35);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .gallery-dot.active { background: #DFFF00; transform: scale(1.4); }

        /* Spotlight / noise / speed */
        .bento-spotlight {
          position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 0.3s ease;
          background: radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(232,255,71,0.18), transparent 60%);
        }
        .bento-card:hover .bento-spotlight { opacity: 1; }
        .bento-card::after {
          content: ""; position: absolute; inset: 0; border-radius: 18px; padding: 1px;
          background: radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(232,255,71,0.6), transparent 50%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .bento-card:hover::after { opacity: 1; }
        .bento-noise {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.02; transition: opacity 0.3s ease;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
        }
        .bento-card:hover .bento-noise { opacity: 0.08; }
        .speed-lines {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
          background-image: repeating-linear-gradient(-20deg, transparent 0, transparent 40px, rgba(232,255,71,0.06) 40px, rgba(232,255,71,0.06) 41px);
          animation: speed-shift 4s linear infinite;
        }
        @keyframes speed-shift { from { background-position: 0 0; } to { background-position: 80px 0; } }

        /* Bento inner */
        .bento-inner { position: relative; z-index: 2; flex: 1; padding: 20px 20px 18px; display: flex; flex-direction: column; gap: 12px; }
        .bento-featured .bento-inner { padding: 24px; gap: 16px; }
        .bento-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .bento-icon-wrap {
          width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
          border-radius: 12px; background: rgba(232,255,71,0.08); color: var(--accent);
          border: 1px solid rgba(232,255,71,0.22); transition: transform 0.3s ease, background 0.3s ease;
        }
        .bento-featured .bento-icon-wrap { width: 56px; height: 56px; border-radius: 14px; }
        .bento-card:hover .bento-icon-wrap { transform: scale(1.1); background: rgba(232,255,71,0.14); }
        body.light .bento-icon-wrap { background: rgba(200,223,32,0.14); border-color: rgba(200,223,32,0.4); }
        .pulse-glow { box-shadow: 0 0 0 0 rgba(232,255,71,0.45); animation: pulse-ring 2.4s ease-out infinite; }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0    rgba(232,255,71,0.5); }
          70%  { box-shadow: 0 0 0 18px rgba(232,255,71,0);   }
          100% { box-shadow: 0 0 0 0    rgba(232,255,71,0);   }
        }
        .bento-id {
          font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px; letter-spacing: 0.15em; color: var(--muted);
          padding: 4px 8px; border: 1px solid var(--border); border-radius: 6px; background: rgba(0,0,0,0.2);
        }
        body.light .bento-id { background: rgba(0,0,0,0.04); }
        .bento-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .bento-title { font-family: Syne, sans-serif; font-weight: 700; font-size: 13px; letter-spacing: -0.01em; color: var(--text); line-height: 1.2; }
        .bento-featured .bento-title { font-size: 16px; line-height: 1.1; }
        @media (min-width: 1024px) { .bento-featured .bento-title { font-size: 18px; } }
        .bento-desc { font-size: 10px; line-height: 1.4; color: var(--muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .bento-featured .bento-desc { font-size: 11px; line-height: 1.45; }
        .bento-cta {
          align-self: flex-start; background: transparent; border: 1px solid var(--bv); color: var(--text);
          padding: 9px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;
        }
        .bento-cta:hover { background: var(--accent); color: #0e0e0f; border-color: var(--accent); transform: translateX(2px); }

        /* Service image wrap (inside regular bento cards) */
        .service-image-wrap {
          position: relative; border-radius: 18px; overflow: hidden; height: 160px; flex-shrink: 0;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
        }
        .gadget-sales-image-wrap { height: 280px; border: 2px solid #DFFF00; }
        .service-card-image { width: 100%; height: 100%; object-fit: cover; display: block; }
        .service-image-fallback {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; color: #0A0A0A; background: #DFFF00;
          border: 2px solid #DFFF00; border-radius: 18px; font-family: Syne, sans-serif;
          text-align: center; padding: 20px; word-break: break-word;
        }

        /* Misc */
        .services-brand { margin: 18px auto 0; color: #DFFF00; font-weight: 700; letter-spacing: 0.24em; font-size: 12px; text-transform: uppercase; opacity: 0.9; }

        /* Gadget sales panel */
        .gadget-sales-panel { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; margin-top: 32px; }
        @media (min-width: 900px) { .gadget-sales-panel { grid-template-columns: 1.4fr 0.6fr; gap: 32px; align-items: center; } }
        .gadget-sales-copy h2 { font-family: Syne, sans-serif; font-size: clamp(24px, 4vw, 42px); font-weight: 800; margin: 0 0 12px; color: var(--text); }
        .gadget-sales-copy p  { font-size: 15px; color: var(--muted); line-height: 1.7; margin: 0; }

        /* ── Expanded modal ───────────────────────────────────────────── */
        .expanded-backdrop {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(18px); background: rgba(10,10,10,0.92); padding: 30px 16px;
        }
        .expanded-panel {
          width: min(1100px, 100%); max-width: 1120px;
          border: 2px solid #DFFF00; border-radius: 26px;
          background: #0A0A0A; box-shadow: 0 40px 120px rgba(0,0,0,0.55);
          overflow: hidden; color: #f5f5f5; max-height: 90vh; overflow-y: auto;
        }

        /* Image LEFT / content RIGHT */
        .expanded-layout {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 700px) {
          .expanded-layout {
            grid-template-columns: 1.1fr 0.9fr;
            min-height: 420px;
          }
        }

        /* Left column */
        .expanded-image-col {
          display: flex; flex-direction: column;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 700px) {
          .expanded-image-col {
            border-bottom: none;
            border-right: 1px solid rgba(255,255,255,0.06);
          }
        }
        .expanded-image {
          width: 100%; flex: 1; min-height: 280px; object-fit: cover; display: block;
        }
        @media (min-width: 700px) { .expanded-image { min-height: 380px; } }
        .expanded-image-fallback {
          flex: 1; min-height: 280px; display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 600; color: #0A0A0A; background: #DFFF00;
          font-family: Syne, sans-serif; text-align: center; padding: 20px;
        }
        .expanded-img-dots {
          display: flex; gap: 8px; justify-content: center;
          padding: 12px 0; background: rgba(0,0,0,0.5);
          flex-shrink: 0;
        }
        .expanded-img-dot {
          width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer;
          background: rgba(255,255,255,0.3); padding: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .expanded-img-dot.active { background: #DFFF00; transform: scale(1.35); }
        .expanded-img-dot:hover  { background: rgba(255,255,255,0.6); }

        /* Right column */
        .expanded-content-col {
          display: flex; flex-direction: column; gap: 20px;
          padding: 28px 26px; justify-content: center;
        }
        .expanded-meta { display: flex; flex-direction: column; gap: 10px; }
        .expanded-meta h2 { font-family: Syne, sans-serif; font-size: clamp(26px, 3.5vw, 40px); margin: 0; line-height: 1.1; }
        .expanded-short-desc { color: rgba(255,255,255,0.78); line-height: 1.75; margin: 0; font-size: 14px; }
        .expanded-long-desc p { color: rgba(255,255,255,0.62); line-height: 1.8; margin: 0; font-size: 13px; }
        .expanded-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
        .expanded-whatsapp {
          background: #25D366; color: #fff; border: none; padding: 11px 22px;
          border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.2s ease;
        }
        .expanded-whatsapp:hover { opacity: 0.88; }
        .expanded-close {
          background: transparent; border: 1px solid rgba(255,255,255,0.18); color: #f5f5f5;
          padding: 11px 22px; border-radius: 999px; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: border-color 0.2s ease;
        }
        .expanded-close:hover { border-color: rgba(255,255,255,0.45); }
      `}</style>
    </div>
  );
}