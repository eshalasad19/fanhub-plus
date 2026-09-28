import { motion } from "framer-motion";
import { FiSun, FiMoon, FiType } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext.jsx";

const FONT_SIZES = ["small", "medium", "large", "x-large"];

const ThemeToggle = () => {
  const { theme, toggleTheme, preferences, updatePreference } = useTheme();
  const isDark = theme === "dark";

  const currentSize = preferences?.fontSize || "medium";

  const cycleFontSize = () => {
    const currentIndex = FONT_SIZES.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % FONT_SIZES.length;
    updatePreference("fontSize", FONT_SIZES[nextIndex]);
  };

  const getSizeLabel = (size) => {
    switch (size) {
      case "small":
        return "A-";
      case "large":
        return "A+";
      case "x-large":
        return "A++";
      default:
        return "A";
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <motion.button
        onClick={cycleFontSize}
        whileTap={{ scale: 0.9 }}
        title={`Font size: ${currentSize} (Click to change)`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          borderRadius: 999,
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 700,
        }}
        aria-label="Adjust font size"
      >
        <FiType size={14} />
        <span>{getSizeLabel(currentSize)}</span>
      </motion.button>

      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text)",
          borderRadius: 999,
          padding: "6px 14px",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
        }}
        aria-label="Toggle theme"
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: "flex" }}
        >
          {isDark ? <FiMoon size={14} /> : <FiSun size={14} />}
        </motion.span>
        {isDark ? "Dark" : "Light"}
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
