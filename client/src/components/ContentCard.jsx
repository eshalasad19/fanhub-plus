import { Link } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import FlipCard from "./FlipCard.jsx";
import RatingStars from "./RatingStars.jsx";

const ContentCard = ({ item }) => {
  const front = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: item.coverImage ? `url(${item.coverImage}) center/cover` : "var(--gradient)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, color: "white", fontWeight: 700, textTransform: "uppercase", background: "rgba(0,0,0,0.5)", borderRadius: 999, padding: "3px 10px" }}>
        {item.category?.name || item.contentType}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, color: "white", fontWeight: 800, fontSize: 17, lineHeight: 1.25 }}>
        {item.title}
      </div>
    </div>
  );

  const back = (
    <div
      className="card"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "var(--surface)",
      }}
    >
      <div>
        <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
          {item.category?.name || item.contentType}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 8px" }}>{item.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {(item.genre || []).slice(0, 3).map((g) => (
            <span key={g} style={{ fontSize: 10, color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "2px 7px" }}>
              {g}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.description}
        </p>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <RatingStars value={item.ratingAvg} count={item.ratingCount} />
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)" }}>
            <FiTrendingUp size={13} /> {item.popularity || 0}
          </span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>View Details →</div>
      </div>
    </div>
  );

  return (
    <Link to={`/content/${item._id}`} style={{ display: "block", height: "100%" }}>
      <FlipCard front={front} back={back} height={300} />
    </Link>
  );
};

export default ContentCard;
