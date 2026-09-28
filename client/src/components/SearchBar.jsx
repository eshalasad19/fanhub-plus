import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const [term, setTerm] = useState(value || "");

  useEffect(() => {
    const timer = setTimeout(() => onChange(term), 350);
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        padding: "10px 18px",
        flex: 1,
        minWidth: 220,
      }}
    >
      <FiSearch color="var(--text-muted)" size={18} />
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--text)",
          fontSize: 15,
          width: "100%",
        }}
      />
    </div>
  );
};

export default SearchBar;
