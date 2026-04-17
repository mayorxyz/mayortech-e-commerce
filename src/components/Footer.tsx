const WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || "2348000000000";

export default function Footer() {
  return (
    <div className="footer">
      <strong>M Gadgets</strong>
      Quality phones, laptops &amp; gadgets — Port Harcourt, Nigeria<br />
      <a href={`https://wa.me/${WHATSAPP}`}>WhatsApp us</a> &nbsp;·&nbsp; © {new Date().getFullYear()} M Gadgets
    </div>
  );
}
