import { FiTv } from "react-icons/fi";

const BRAND_COLORS = {
  Netflix: { bg: "#E50914", text: "#ffffff" },
  Crunchyroll: { bg: "#F47521", text: "#ffffff" },
  Max: { bg: "#002BE7", text: "#ffffff" },
  "Disney+": { bg: "#113CCF", text: "#ffffff" },
  "Prime Video": { bg: "#00A8E1", text: "#0d0a17" },
  "Apple TV": { bg: "#2d2d2d", text: "#ffffff" },
  "Paramount+": { bg: "#0064FF", text: "#ffffff" },
  Hulu: { bg: "#1CE783", text: "#0d0a17" },
  Steam: { bg: "#1b2838", text: "#66c0f4" },
  "PlayStation Store": { bg: "#00439c", text: "#ffffff" },
  "Xbox Store": { bg: "#107c10", text: "#ffffff" },
  "Nintendo eShop": { bg: "#e60012", text: "#ffffff" },
  Spotify: { bg: "#1DB954", text: "#ffffff" },
  "Apple Music": { bg: "#fa2d48", text: "#ffffff" },
  "Manga Plus": { bg: "#c4151c", text: "#ffffff" },
  "Marvel Unlimited": { bg: "#e23636", text: "#ffffff" },
  "DC Universe Infinite": { bg: "#0078f2", text: "#ffffff" },
};

const WatchProviders = ({ providers = [], title = "", contentType = "movie" }) => {
  if (!providers || providers.length === 0) return null;

  return (
    <div
      className="card"
      style={{
        marginTop: 24,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "20px 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <FiTv size={20} color="var(--accent)" />
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
          Officially Licensed On
        </h3>
      </div>

      <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
        {title} is officially distributed through these platforms. Play the trailer above right here on Fan Hub Plus.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {providers.map((p, idx) => {
          const brand = BRAND_COLORS[p] || { bg: "var(--primary)", text: "#ffffff" };
          return (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: brand.bg,
                color: brand.text,
                padding: "8px 16px",
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default WatchProviders;
