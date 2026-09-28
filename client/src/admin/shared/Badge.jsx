const STATUS_COLORS = {
  open: "#f59e0b",
  reviewed: "#3b82f6",
  resolved: "#10b981",
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  bug: "#ef4444",
  suggestion: "#3b82f6",
  query: "#8b5cf6",
};

const Badge = ({ label }) => {
  const color = STATUS_COLORS[label] || "#6b7280";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 700,
        textTransform: "capitalize",
        background: `${color}1f`,
        color,
      }}
    >
      {label}
    </span>
  );
};

export default Badge;