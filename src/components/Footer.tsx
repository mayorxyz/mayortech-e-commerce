import { Link } from "react-router-dom";

const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

export default function Footer() {
  return (
    <div className="footer">
      <strong>MRY Gadgets</strong>
      Quality phones, laptops &amp; gadgets — Port Harcourt, Nigeria<br />
      <Link to="/about" style={{ color: "var(--accent)" }}>About</Link> &nbsp;·&nbsp;{" "}
      <Link to="/contact" style={{ color: "var(--accent)" }}>Contact</Link> &nbsp;·&nbsp;{" "}
      <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp</a> &nbsp;·&nbsp; © {new Date().getFullYear()} MRY Gadgets
    </div>
  );
}
