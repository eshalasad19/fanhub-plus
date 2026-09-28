const TAG_COLORS = {
  "Limited Edition": "#f97316",
  "Pre-Order": "#6366f1",
  Collectible: "#10b981",
};

const TagBadge = ({ label }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      color: "white",
      background: TAG_COLORS[label] || "var(--primary)",
      borderRadius: 999,
      padding: "4px 10px",
    }}
  >
    {label}
  </span>
);

export default TagBadge;
