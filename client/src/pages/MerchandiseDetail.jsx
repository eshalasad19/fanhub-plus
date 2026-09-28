import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import useApi from "../hooks/useApi.js";
import TagBadge from "../components/TagBadge.jsx";
import RatingStars from "../components/RatingStars.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const MerchandiseDetail = () => {
  const { id } = useParams();
  const { data: item, loading } = useApi(`/merchandise/${id}`, {}, [id]);
  const [selectedImg, setSelectedImg] = useState(0);

  if (loading) return <div className="container" style={{ paddingTop: 60 }}>Loading...</div>;
  if (!item) return <EmptyState message="Merchandise not found." />;

  const images = item.images?.length ? item.images : [];
  const currentImage = images[selectedImg] || images[0];

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 900 }}>
      <Breadcrumb
        items={[
          { label: "Merchandise", to: "/merchandise" },
          { label: item.category?.name || "Category", to: item.category?.name ? `/category/${item.category.name}` : "/merchandise" },
          { label: item.title },
        ]}
      />
      <Link to="/merchandise" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 20 }}>
        <FiArrowLeft /> Back to Merchandise
      </Link>
      <div className="card" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ width: "100%", height: 320, borderRadius: 14, background: currentImage ? `url(${currentImage}) center/cover` : "var(--gradient)", border: "1px solid var(--border)", transition: "background 0.3s ease" }} />
          {images.length > 1 && (
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>Image Gallery ({images.length} photos)</div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {images.map((imgUrl, idx) => (
                  <div key={idx} onClick={() => setSelectedImg(idx)} style={{ width: 64, height: 64, borderRadius: 8, flexShrink: 0, cursor: "pointer", border: selectedImg === idx ? "2px solid var(--accent)" : "1px solid var(--border)", background: `url(${imgUrl}) center/cover`, opacity: selectedImg === idx ? 1 : 0.65, transition: "opacity 0.2s, border-color 0.2s" }} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, textTransform: "uppercase" }}>
            {item.category?.name} {item.content?.title ? `· ${item.content.title}` : ""}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {(item.tags || []).map((t) => <TagBadge key={t._id || t} label={t.name || t} />)}
          </div>
          <h1 style={{ fontSize: 28, margin: "6px 0 12px" }}>{item.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <RatingStars value={item.ratingAvg} count={item.ratingCount} size={18} interactive targetType="Merchandise" targetId={item._id} />
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: "16px 0" }}>{item.description}</p>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", marginBottom: 8 }}>${item.price}</div>
          <div style={{ fontSize: 13, color: item.stock > 0 ? "#22c55e" : "#ef4444" }}>
            {item.stock > 0 ? `${item.stock} units in stock` : "Out of stock / Pre-Order Only"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchandiseDetail;
