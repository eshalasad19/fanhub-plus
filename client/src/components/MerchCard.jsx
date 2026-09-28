import { Link } from "react-router-dom";
import FlipCard from "./FlipCard.jsx";
import TagBadge from "./TagBadge.jsx";
import RatingStars from "./RatingStars.jsx";

const MerchCard = ({ item }) => {
  const front = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: item.images?.[0] ? `url(${item.images[0]}) center/cover` : "var(--gradient)",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(item.tags || []).slice(0, 2).map((t) => <TagBadge key={t._id || t} label={t.name || t} />)}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, color: "white", fontWeight: 800, fontSize: 15 }}>
        {item.name}
      </div>
    </div>
  );

  const back = (
    <div className="card" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--surface)" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.name}</div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {item.description}
        </p>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, color: "var(--primary)" }}>${item.price}</span>
          <RatingStars value={item.ratingAvg} count={item.ratingCount} />
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>View Item →</div>
      </div>
    </div>
  );

  return (
    <Link to={`/merchandise/${item._id}`} style={{ display: "block", height: "100%" }}>
      <FlipCard front={front} back={back} height={280} />
    </Link>
  );
};

export default MerchCard;
