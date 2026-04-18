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
        <h3>Full device care</h3>
        <p>Repairs, upgrades, setup, data transfer, and trade-ins.</p>

        <div className="svc-bento-chips">
          {services.map((svc) => (
            <button
              key={svc.label}
              className="svc-chip"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/services");
              }}
            >
              {svc.label}
            </button>
          ))}
        </div>

        <button
          className="svc-bento-cta"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/services");
          }}
        >
          Explore all →
        </button>
      </div>
    </motion.div>
  );
}
