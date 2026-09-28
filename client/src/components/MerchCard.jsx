import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, ExternalLink, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import FlipCard from "./FlipCard.jsx";
import TagBadge from "./TagBadge.jsx";
import RatingStars from "./RatingStars.jsx";

const TAG_ACCENTS = {
  "Limited Edition": "#ec4899",
  "Pre-Order": "#f59e0b",
  "Collectible": "#8b5cf6",
  "New": "#10b981",
  "Trending": "#06b6d4",
};

const MerchCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const imgUrl = item.image || item.images?.[0];
  const tagColor = TAG_ACCENTS[item.tag] || "#ec4899";
  const catName = typeof item.category === "object" ? item.category?.name : item.category;

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  const front = (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: imgUrl ? `url(${imgUrl}) center/cover` : "var(--gradient)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(12,7,20,0.92) 100%)",
        }}
      />
      
      {/* Top badges */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {item.tag && (
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
                color: tagColor,
                border: `1px solid ${tagColor}70`,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {item.tag}
            </span>
          )}
          {(item.tags || []).slice(0, 1).map((t) => (
            <TagBadge key={t._id || t} label={t.name || t} />
          ))}
        </div>

        <button
          onClick={toggleLike}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: liked ? "#ec4899" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.2s, color 0.2s",
          }}
          title={liked ? "Saved to Wishlist" : "Save to Wishlist"}
        >
          <Heart size={14} fill={liked ? "#ec4899" : "none"} />
        </button>
      </div>

      {/* Bottom Title & Price Bar */}
      <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", marginBottom: 3 }}>
          {catName}
        </div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.25, marginBottom: 6 }}>
          {item.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 6,
              background: "var(--gradient)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 13,
            }}
          >
            ${Number(item.price || 0).toFixed(2)}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 3 }}>
            Flip for details ↻
          </span>
        </div>
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
        padding: 18,
        border: `1px solid ${tagColor}40`,
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25 }}>{item.name}</div>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 800,
              background: `${tagColor}20`,
              color: tagColor,
              flexShrink: 0,
            }}
          >
            {item.tag || "Collectible"}
          </span>
        </div>

        <div style={{ fontSize: 11.5, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>
          {catName} {item.isUpcoming ? " · Upcoming" : ""}
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: 0,
          }}
        >
          {item.description || "Official collector showcase edition crafted for passionate fans."}
        </p>
      </div>

      <div style={{ paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: "var(--primary)" }}>
            ${Number(item.price || 0).toFixed(2)}
          </span>
          <RatingStars value={item.ratingAvg || 4.8} count={item.ratingCount || 12} />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            padding: "8px",
            borderRadius: 10,
            background: "var(--gradient)",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 800,
            boxShadow: "0 4px 14px rgba(219,39,119,0.3)",
          }}
        >
          <span>View Product Showcase</span>
          <ExternalLink size={12} />
        </div>
      </div>
    </div>
  );

  return (
    <Link to={`/merchandise/${item._id}`} style={{ display: "block", height: "100%", textDecoration: "none" }}>
      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
        <FlipCard front={front} back={back} height={290} />
      </motion.div>
    </Link>
  );
};

export default MerchCard;
