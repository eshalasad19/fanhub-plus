const LoadingGrid = ({ count = 8, height = 260 }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 20,
    }}
  >
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="card"
        style={{
          height,
          background: "linear-gradient(90deg, var(--surface) 25%, var(--surface-glass) 50%, var(--surface) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
    ))}
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

export default LoadingGrid;
