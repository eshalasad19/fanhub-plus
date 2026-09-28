import { FiCalendar } from "react-icons/fi";
import FlipCard from "./FlipCard.jsx";

const daysUntil = (date) => {
  const diff = new Date(date) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const ReleaseCard = ({ release }) => {
  const front = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: release.coverImage ? `url(${release.coverImage}) center/cover` : "var(--gradient)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, color: "white", fontWeight: 700, textTransform: "uppercase", background: "rgba(0,0,0,0.5)", borderRadius: 999, padding: "3px 10px" }}>
        {release.releaseType}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, color: "white", fontWeight: 800, fontSize: 15 }}>
        {release.title}
      </div>
    </div>
  );

  const back = (
    <div className="card" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--surface)" }}>
      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
        {release.releaseType} · {release.category?.name}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, margin: "6px 0 8px" }}>{release.title}</div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {release.description}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
        <FiCalendar size={13} />
        {new Date(release.releaseDate).toLocaleDateString()} · {daysUntil(release.releaseDate)}d left
      </div>
    </div>
  );

  return <FlipCard front={front} back={back} height={220} />;
};

export default ReleaseCard;
