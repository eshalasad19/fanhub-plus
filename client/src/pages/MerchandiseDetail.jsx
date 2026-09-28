import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiExternalLink, FiShare2, FiHeart } from "react-icons/fi";
import { Sparkles, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import useApi from "../hooks/useApi.js";
import TagBadge from "../components/TagBadge.jsx";
import RatingStars from "../components/RatingStars.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";

const MerchandiseDetail = () => {
  const { id } = useParams();
  const { data: item, loading } = useApi(`/merchandise/${id}`, {}, [id]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "var(--gradient)", margin: "0 auto 20px", animation: "funkyPulse 1.5s infinite ease-in-out" }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-muted)" }}>Loading merchandise details…</div>
      </div>
    );
  }

  if (!item) return <EmptyState message="Merchandise item not found." />;

  const catName = typeof item.category === "object" ? item.category?.name : item.category;
  const images = (item.images && item.images.length > 0)
    ? item.images
    : (item.image ? [item.image] : []);
  const currentImage = images[selectedImg] || images[0] || "";

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 1060 }}>
      <Breadcrumb
        items={[
          { label: "Merchandise", to: "/merchandise" },
          { label: catName || "Category", to: catName ? `/category/${catName}` : "/merchandise" },
          { label: item.name || "Item Details" },
        ]}
      />

      <Link
        to="/merchandise"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--text-muted)",
          marginBottom: 20,
          fontSize: 13.5,
          fontWeight: 600,
        }}
      >
        <FiArrowLeft /> Back to Merchandise Showcase
      </Link>

      <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 36, padding: 32, borderRadius: 24 }}>
        {/* Left Image Showcase */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              width: "100%",
              height: 380,
              borderRadius: 18,
              background: currentImage ? `url(${currentImage}) center/cover` : "var(--gradient)",
              border: "1px solid var(--border)",
              boxShadow: "0 14px 36px rgba(0,0,0,0.35)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {item.tag && (
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  background: "rgba(0,0,0,0.75)",
                  backdropFilter: "blur(8px)",
                  color: "#ec4899",
                  border: "1px solid rgba(236,72,153,0.5)",
                }}
              >
                {item.tag}
              </span>
            )}
          </motion.div>

          {images.length > 1 && (
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 700 }}>
                Product Gallery ({images.length} photos)
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 10,
                      flexShrink: 0,
                      cursor: "pointer",
                      border: selectedImg === idx ? "2.5px solid var(--primary)" : "1px solid var(--border)",
                      background: `url(${imgUrl}) center/cover`,
                      opacity: selectedImg === idx ? 1 : 0.6,
                      transform: selectedImg === idx ? "scale(1.05)" : "none",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Details & Action */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
                {catName} Universe {item.isUpcoming ? "· Upcoming Release" : ""}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: wishlisted ? "rgba(236,72,153,0.15)" : "var(--bg)",
                    color: wishlisted ? "#ec4899" : "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FiHeart fill={wishlisted ? "#ec4899" : "none"} size={13} /> {wishlisted ? "Saved" : "Wishlist"}
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 999,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text-muted)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FiShare2 size={13} /> {copied ? "Copied Link!" : "Share"}
                </button>
              </div>
            </div>

            <h1 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 900, margin: "6px 0 12px", lineHeight: 1.2 }}>
              {item.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <RatingStars value={item.ratingAvg || 4.9} count={item.ratingCount || 16} size={18} interactive targetType="Merchandise" targetId={item._id} />
              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Verified Collector Rating</span>
            </div>

            <div style={{ margin: "20px 0", padding: "16px 20px", borderRadius: 14, background: "var(--bg-soft)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Collector Showcase Price</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)", marginTop: 2 }}>
                ${Number(item.price || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: 12.5, color: (item.stock || 10) > 0 ? "#10b981" : "#ef4444", marginTop: 4, fontWeight: 700 }}>
                {(item.stock || 10) > 0 ? `✓ In Stock (${item.stock || 10} available)` : "⚠ Pre-Order / Limited Stock"}
              </div>
            </div>

            <p style={{ color: "var(--text-muted)", lineHeight: 1.7, margin: "16px 0", fontSize: 14.5 }}>
              {item.description || "Premium authentic collector edition crafted for fans."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            {item.externalLink && (
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ padding: "14px", fontSize: 15, fontWeight: 800, textDecoration: "none", width: "100%" }}
              >
                <FiShoppingBag size={16} /> Order on Official Store <FiExternalLink size={14} />
              </a>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldCheck size={15} color="var(--primary)" /> 100% Authentic Merchandise
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={15} color="var(--primary)" /> Collector Packaging Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchandiseDetail;
