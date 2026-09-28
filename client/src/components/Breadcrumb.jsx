import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiHome } from "react-icons/fi";


const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 6,
        fontSize: 12.5,
        color: "var(--text-muted)",
        marginBottom: 20,
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: "var(--text-muted)",
          transition: "color 0.15s",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <FiHome size={13} />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FiChevronRight size={12} style={{ opacity: 0.6 }} />
            {isLast || !item.to ? (
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--text)",
                  maxWidth: 240,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                style={{
                  color: "var(--text-muted)",
                  transition: "color 0.15s",
                  textDecoration: "none",
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

export default Breadcrumb;
