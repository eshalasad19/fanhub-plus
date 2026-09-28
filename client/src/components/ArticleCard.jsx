import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import FlipCard from "./FlipCard.jsx";

const ArticleCard = ({ article }) => {
  const front = (
    <div style={{ width: "100%", height: "100%", position: "relative", background: article.coverImage ? `url(${article.coverImage}) center/cover` : "var(--gradient)" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, color: "white", fontWeight: 700, textTransform: "uppercase", background: "rgba(0,0,0,0.5)", borderRadius: 999, padding: "3px 10px" }}>
        {article.category?.name}
      </div>
      <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, color: "white", fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>
        {article.title}
      </div>
    </div>
  );

  const back = (
    <div className="card" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--surface)" }}>
      <div>
        <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>{article.category?.name}</div>
        <div style={{ fontWeight: 700, fontSize: 15, margin: "4px 0 8px" }}>{article.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
          <FiClock size={13} /> {new Date(article.publishedAt).toLocaleDateString()}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>Read Article →</div>
    </div>
  );

  return (
    <Link to={`/articles/${article._id}`} style={{ display: "block", height: "100%" }}>
      <FlipCard front={front} back={back} height={260} />
    </Link>
  );
};

export default ArticleCard;
