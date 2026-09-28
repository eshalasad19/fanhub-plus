import { FiFilter, FiX } from "react-icons/fi";
import { CATEGORIES, CONTENT_TYPES, GENRES, RELEASE_YEARS, POPULARITY_OPTIONS } from "../constants/taxonomy.js";

const selectStyle = {
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  borderRadius: 10,
  padding: "9px 12px",
  fontSize: 14,
  cursor: "pointer",
};

const FilterPanel = ({ filters, onChange, hideCategory }) => {
  const set = (key, val) => onChange({ ...filters, [key]: val });
  const clear = () =>
    onChange({ category: hideCategory ? filters.category : "", contentType: "", genre: "", year: "", minPopularity: "" });

  const hasActive =
    filters.contentType ||
    filters.genre ||
    filters.year ||
    filters.minPopularity ||
    (!hideCategory && filters.category);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <FiFilter color="var(--text-muted)" />

      {!hideCategory && (
        <select style={selectStyle} value={filters.category || ""} onChange={(e) => set("category", e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      )}

      <select style={selectStyle} value={filters.contentType || ""} onChange={(e) => set("contentType", e.target.value)}>
        <option value="">All Types</option>
        {CONTENT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select style={selectStyle} value={filters.genre || ""} onChange={(e) => set("genre", e.target.value)}>
        <option value="">All Genres</option>
        {GENRES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select style={selectStyle} value={filters.year || ""} onChange={(e) => set("year", e.target.value)}>
        <option value="">All Years</option>
        {RELEASE_YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select style={selectStyle} value={filters.minPopularity || ""} onChange={(e) => set("minPopularity", e.target.value)}>
        <option value="">All Popularity</option>
        {POPULARITY_OPTIONS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {hasActive && (
        <button
          onClick={clear}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          <FiX /> Clear
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
