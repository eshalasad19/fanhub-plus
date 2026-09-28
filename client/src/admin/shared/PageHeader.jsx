import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const PageHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: -0.3 }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13.5 }}>{subtitle}</p>}
    </div>
    {actionLabel && (
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onAction}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "none",
          borderRadius: 10,
          padding: "10px 16px",
          background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
          color: "#fff",
          fontSize: 13.5,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <Plus size={16} strokeWidth={2.3} />
        {actionLabel}
      </motion.button>
    )}
  </div>
);

export default PageHeader;