import { FiArrowDownCircle } from "react-icons/fi";
import { SORT_OPTIONS } from "../constants/taxonomy.js";

const SortDropdown = ({ value, onChange }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 999,
      padding: "10px 16px",
    }}
  >
    <FiArrowDownCircle color="var(--text-muted)" size={16} />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: "none",
        outline: "none",
        background: "transparent",
        color: "var(--text)",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortDropdown;
