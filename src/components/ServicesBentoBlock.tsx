import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServicesBentoBlock() {
  const navigate = useNavigate();

  const services = [
    { label: "Repairs", icon: "🔧" },
    { label: "Upgrades", icon: "⚡" },
    { label: "Setup", icon: "⚙" },
    { label: "Swap", icon: "🔄" },
  ];

  return (
    <motion.div
      className="svc-bento"
      onClick={() => navigate("/services")}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate("/services");
        }
      }}
      aria-label="Explore our services"
    >
      <div className="svc-bento-inner">
        <span className="svc-bento-tag">SVC // M-OPS</span>
        <h3>More than a shop — <em>full device care.</em></h3>
        <p>Repairs, performance upgrades, setup, data transfer, and trade-ins. One team for everything your phone or laptop needs.</p>

        <div className="svc-bento-icons">
          {services.map((svc) => (
            <div
              key={svc.label}
              className="svc-icon-item"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/services");
              }}
            >
              <span className="svc-icon">{svc.label}</span>
            </div>
          ))}
        </div>

        <button
          className="svc-bento-cta"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/services");
          }}
        >
          Explore all services →
        </button>
      </div>
    </motion.div>
  );
}
