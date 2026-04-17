import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, Rocket, RefreshCw, Settings, ArrowRight } from "lucide-react";

export default function ServicesBentoBlock() {
  const navigate = useNavigate();

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
        <h3>
          More than a shop — <em>full device care</em>.
        </h3>
        <p>
          Repairs, performance upgrades, setup, data transfer, and trade-ins. One team for everything your phone or laptop needs.
        </p>

        <div className="svc-bento-icons" aria-hidden="true">
          <div className="si">
            <Wrench size={18} />
            <span>Repairs</span>
          </div>
          <div className="si">
            <Rocket size={18} />
            <span>Upgrades</span>
          </div>
          <div className="si">
            <Settings size={18} />
            <span>Setup</span>
          </div>
          <div className="si">
            <RefreshCw size={18} />
            <span>Swap</span>
          </div>
        </div>

        <button
          className="svc-bento-cta"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/services");
          }}
        >
          Explore all services <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
