import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40 }}>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="btn"
        style={{ padding: "8px 12px", opacity: page === 1 ? 0.5 : 1 }}
      >
        <FiChevronLeft />
      </button>
      {numbers.map((n, i) => (
        <span key={n} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && numbers[i - 1] !== n - 1 && <span style={{ color: "var(--text-muted)", padding: "0 4px" }}>…</span>}
          <button
            onClick={() => onChange(n)}
            style={{
              border: "1px solid var(--border)",
              background: n === page ? "var(--gradient)" : "var(--surface)",
              color: n === page ? "white" : "var(--text)",
              borderRadius: 10,
              width: 36,
              height: 36,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="btn"
        style={{ padding: "8px 12px", opacity: page === pages ? 0.5 : 1 }}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
